Source: https://docs.aivax.net/pt-br/docs/inference/workers.html

# Gateway Workers

Os Gateway Workers são hooks HTTP que permitem ao seu serviço controlar um AI Gateway enquanto uma solicitação está em execução. Use um quando uma regra precisar ser decidida fora do prompt.

Um worker pode:

- permitir um evento;
- interromper um evento;
- reescrever o contexto;
- adicionar instruções ou ferramentas;
- substituir o resultado de uma ferramenta do lado do servidor, antes ou depois da execução da ferramenta;
- receber uma notificação quando uma inferência termina.

Use um worker quando a decisão depender dos seus próprios sistemas. Casos típicos:

- verificações de assinatura;
- enriquecimento de CRM;
- política específica do inquilino (tenant);
- registro de auditoria;
- bloqueio dinâmico de ferramentas;
- substituição do resultado de uma ferramenta visível pelo modelo por dados de um sistema interno.

Os workers executam no caminho de toda inferência que eles manipulam. Cada evento adiciona uma solicitação HTTP antes que o gateway possa continuar, então mantenha o endpoint rápido e previsível. A exceção é `message.completed`, que é enviado após a resposta e não a atrasa.

| Evento | Quando é acionado | Pode alterar a solicitação |
|---|---|---|
| [`message.received`](#messagereceived) | Antes da chamada ao modelo. | Sim |
| [`tool.called`](#toolcalled) | Antes de uma ferramenta do lado do servidor ser executada. | Sim |
| [`tool.fetched`](#toolfetched) | Após uma ferramenta do lado do servidor retornar seu resultado. | Sim |
| [`message.completed`](#messagecompleted) | Após o término da inferência, com ou sem erros. | Não |

## Formato da solicitação

A solicitação é o evento que o AIVAX envia ao seu worker. Ela chega quando um evento de worker configurado é acionado, antes que o gateway continue.

O AIVAX envia este `POST` para a URL do worker do gateway:

```json
{
    "gatewayId": "seu-id-do-gateway",
    "moment": "2025-12-29T17:04:39",
    "event": {
        "name": "message.received",
        "data": {
            "messages": [
                {
                    "role": "user",
                    "content": "Bom dia"
                }
            ],
            "origin": "ChatCompletionsApi",
            "externalUserId": "cliente-123",
            "metadata": {}
        }
    }
}
```

Leia o corpo antes de agir:

1. Valide `gatewayId` quando um endpoint atende mais de um gateway.
2. Ramifique com base em `event.name`.
3. Leia `event.data`. O formato exato depende do evento.

Trate o JSON acima como o envelope. Não assuma que todos os eventos possuem os mesmos campos `data`.

## Autenticação

Use o nonce para confirmar que o AIVAX enviou a solicitação. Valide-o antes de confiar no corpo, especialmente quando o worker libera dados privados, altera o contexto ou autoriza o uso de ferramentas.

Quando a conta possui uma chave de hook, o AIVAX envia `X-Request-Nonce`. O nonce é um hash BCrypt derivado da chave de hook da conta.

Trate estes campos como entrada não confiável:

- `externalUserId`
- `metadata`
- mensagens
- argumentos de ferramentas

## Comportamento da resposta

A resposta informa ao AIVAX se deve continuar, parar ou aplicar uma ação. Escolha-a intencionalmente: um enriquecimento opcional pode falhar abertamente (fail open), e uma verificação de autorização ou conformidade deve falhar fechadamente (fail closed).

Após o AIVAX enviar a solicitação, ele trata sua resposta da seguinte forma:

| Resposta | Comportamento |
|---|---|
| `Content-Type: application/json+worker-action` | Executa a ação descrita no corpo JSON. |
| `2xx` sem `application/json+worker-action` | Continua normalmente. |
| Resposta não OK sem `application/json+worker-action` | Interrompe o evento. |

Se a solicitação do worker falhar com uma exceção de solicitação HTTP, o AIVAX registra a falha e interrompe o evento.

### Quando continuar ou parar

Use o status que corresponde ao risco:

1. Retorne `Content-Type: application/json+worker-action` quando o AIVAX deve aplicar a ação JSON.
2. Retorne `2xx` sem esse tipo de conteúdo quando o worker apenas adiciona enriquecimento opcional, ou quando sua lógica não tem nada a adicionar. A conversa continua.
3. Retorne uma resposta não OK sem esse tipo de conteúdo quando autorização, conformidade ou política de negócios não podem falhar abertamente. O AIVAX interrompe o evento.

## `message.received`

`message.received` é o hook para o prompt preparado. Use-o para inspecionar, reescrever ou interromper o contexto antes que o modelo seja executado. Ele é acionado após o gateway preparar o contexto da mensagem recebida e antes da chamada ao modelo.

```json
{
    "name": "message.received",
    "data": {
        "messages": [],
        "origin": "ChatCompletionsApi",
        "externalUserId": "cliente-123",
        "metadata": {}
    }
}
```

Para alterar o contexto, retorne `Content-Type: application/json+worker-action` com `type: "message.received.response"`. Retorne `2xx` sem ação quando a mensagem puder continuar inalterada. Este exemplo adiciona uma instrução de sistema:

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "add-system",
                "message": "Responda em inglês formal."
            }
        ]
    }
}
```

Use uma reescrita quando o contexto preparado não for o que o modelo deve ver. Ações disponíveis:

| Ação | Descrição | Parâmetros |
|---|---|---|
| `clear` | Remove elementos do contexto. | `argument`: `messages`, `meta`, `system`, `tools`, `skills`, `all` ou omitido. |
| `add-message` | Adiciona uma mensagem à conversa. | `message`: objeto de mensagem compatível com OpenAI. |
| `remove-message` | Remove uma mensagem por índice. | `index`: índice baseado em zero da mensagem. |
| `add-system` | Adiciona uma instrução de sistema. | `message`: texto da instrução. |
| `add-tool` | Adiciona uma definição de ferramenta compatível com OpenAI. | `tool`: objeto JSON da ferramenta. |
| `add-protocol-tool` | Adiciona uma [função de protocolo](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md). | `tool`: definição da função de protocolo. |
| `add-mcp-source` | Adiciona as ferramentas descobertas de uma fonte [MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md) ao contexto. | `source`: objeto de origem MCP com `url`, `headers`, `name` e/ou `cacheDuration`. |

### Substituir o contexto do usuário

Use este padrão quando a política deve substituir a entrada original do usuário. O exemplo executa `clear` e depois adiciona uma mensagem de substituição, para que o modelo responda à mensagem de política em vez da entrada original:

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "clear"
            },
            {
                "type": "add-message",
                "message": {
                    "role": "user",
                    "content": "A mensagem original foi removida por uma verificação de política externa. Informe ao usuário que ele precisa de uma assinatura ativa para continuar."
                }
            }
        ]
    }
}
```

### Remover uma mensagem

Use `remove-message` quando uma mensagem deve sair do contexto e o restante deve permanecer. Este exemplo remove a primeira mensagem, usando seu índice baseado em zero:

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "remove-message",
                "index": 0
            }
        ]
    }
}
```

### Adicionar uma fonte MCP temporária

Use `add-mcp-source` quando a lista de ferramentas depender desta mensagem, usuário, canal ou política externa, e apenas para a inferência atual. Este exemplo expõe as ferramentas de um servidor MCP interno:

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "add-mcp-source",
                "source": {
                    "name": "CRM Interno",
                    "url": "https://crm.example.com/mcp",
                    "headers": {
                        "Authorization": "Bearer <TOKEN_CRM_INTERNO>"
                    },
                    "cacheDuration": 600
                }
            }
        ]
    }
}
```

Apenas para esta inferência, o AIVAX:

1. Lista as ferramentas do servidor MCP.
2. Converte cada esquema em uma função chamável pelo modelo.
3. Torna essas ferramentas disponíveis apenas para essa inferência.

Para uma fonte que deve permanecer no gateway, configure o MCP diretamente no AI Gateway.

## `tool.called`

`tool.called` é o hook para uma ferramenta interna do lado do servidor. Use-o para permitir a chamada, bloqueá-la ou substituir o resultado que o modelo verá. O evento é acionado antes que o AIVAX execute essa ferramenta.

```json
{
    "name": "tool.called",
    "data": {
        "toolName": "check_order",
        "toolArguments": {
            "order_id": "A123"
        },
        "origin": "ChatCompletionsApi",
        "externalUserId": "cliente-123",
        "metadata": {}
    }
}
```

Escolha um dos resultados:

1. Retorne uma resposta não OK para bloquear a chamada da ferramenta.
2. Retorne `2xx` para permitir que o AIVAX execute a ferramenta normalmente.
3. Retorne `Content-Type: application/json+worker-action` com `type: "tool.called.response"` para substituir o resultado da ferramenta:

```json
{
    "type": "tool.called.response",
    "data": {
        "result": "O pedido A123 está pago e agendado para entrega amanhã.",
        "messages": []
    }
}
```

`result` é o texto injetado como resultado da ferramenta. `messages` é opcional e anexa mensagens adicionais no formato OpenAI ao contexto da conversa. Campos de `data`:

| Campo | Descrição |
|---|---|
| `result` | Conteúdo textual injetado como resultado da ferramenta. |
| `messages` | Mensagens adicionais opcionais no formato OpenAI anexadas ao contexto da conversa. |

Quando você retorna `tool.called.response`, o AIVAX usa o resultado fornecido pelo worker em vez de executar o manipulador de ferramenta padrão.

## `tool.fetched`

`tool.fetched` é o hook para o resultado de uma ferramenta interna do lado do servidor. Use-o para auditar, ofuscar ou substituir o que a ferramenta retornou antes que o modelo o veja. O evento é acionado após o AIVAX executar a ferramenta, e não é acionado quando uma resposta `tool.called` já substituiu ou bloqueou a chamada.

```json
{
    "name": "tool.fetched",
    "data": {
        "toolName": "check_order",
        "toolArguments": {
            "order_id": "A123"
        },
        "result": "Pedido A123: pago, cartão terminando em 4242, entrega amanhã.",
        "failed": false,
        "origin": "ChatCompletionsApi",
        "externalUserId": "cliente-123",
        "metadata": {}
    }
}
```

| Campo | Descrição |
|---|---|
| `result` | O texto que a ferramenta retornou, conforme o modelo o veria. |
| `failed` | Indica se a execução da ferramenta falhou. |

Escolha um dos resultados:

1. Retorne uma resposta não OK para descartar o resultado. O modelo recebe uma mensagem dizendo que o gateway bloqueou o resultado da ferramenta.
2. Retorne `2xx` para manter o resultado inalterado.
3. Retorne `Content-Type: application/json+worker-action` com `type: "tool.fetched.response"` para substituir o resultado. `data` possui os mesmos campos que [`tool.called.response`](#toolcalled):

```json
{
    "type": "tool.fetched.response",
    "data": {
        "result": "Pedido A123: pago, entrega amanhã."
    }
}
```

## `message.completed`

`message.completed` é uma notificação enviada quando uma inferência termina. Use-o para logs de auditoria, análises, alertas ou reconciliação de cobrança em seus próprios sistemas. Ele é acionado após a resposta, independentemente de a inferência ter sido bem-sucedida ou falhada, portanto, não atrasa o usuário.

```json
{
    "name": "message.completed",
    "data": {
        "messages": [],
        "errors": [
            {
                "message": "Falha ao analisar o JSON de argumentos da ferramenta para a ferramenta `check_order`.",
                "fatal": false
            }
        ],
        "fatal": false,
        "usage": {
            "prompt_tokens": 1200,
            "completion_tokens": 180,
            "total_tokens": 1380,
            "cost": 0.00042
        },
        "origin": "ChatCompletionsApi",
        "externalUserId": "cliente-123",
        "metadata": {}
    }
}
```

| Campo | Descrição |
|---|---|
| `messages` | As mensagens da inferência, incluindo as geradas pelo modelo e pelas ferramentas. Quando a inferência falha antes da chamada ao modelo, ela contém as mensagens de entrada preparadas. |
| `errors` | Os erros relacionados à inferência. Cada item possui uma `message` e uma flag `fatal`. |
| `fatal` | Indica se a inferência foi interrompida por um erro. |
| `usage` | Uso de tokens, custo em USD e desempenho da inferência. É `null` quando a inferência falhou antes da chamada ao modelo. |

A resposta do worker é ignorada: `message.completed` não pode parar, reescrever ou atrasar a inferência. Quando o AIVAX tenta novamente uma solicitação em outro provedor, apenas a tentativa final envia `message.completed`.

## Exemplo: bloqueando usuários não autorizados

Use este padrão quando apenas uma lista de permissão de usuários externos puder acessar um gateway. O exemplo é um Cloudflare Worker. Ele interrompe `message.received` para todos os outros e permite que outros gateways e eventos continuem.

O worker decide nesta ordem:

1. Rejeite métodos diferentes de `POST`.
2. Retorne um `2xx` vazio para qualquer outro gateway, para que a chamada continue.
3. Retorne um `2xx` vazio para qualquer outro evento.
4. Retorne `403` quando `externalUserId` estiver fora da lista de permissão. Isso interrompe `message.received`.
5. Retorne um `2xx` vazio para um usuário permitido, para que o gateway continue.

```js
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Método não permitido", { status: 405 });
    }

    const body = await request.json();

    if (body.gatewayId !== env.CHECKING_GATEWAY_ID) {
      return new Response();
    }

    if (body.event?.name !== "message.received") {
      return new Response();
    }

    const externalUserId = body.event.data.externalUserId;
    const allowedUsers = new Set((env.ALLOWED_USERS || "").split(","));

    if (!allowedUsers.has(externalUserId)) {
      return new Response("Usuário não autorizado", { status: 403 });
    }

    return new Response();
  }
};
```

## Exemplo: substituindo uma ferramenta por um sistema interno

Use este padrão quando o modelo deve ver o resultado de uma ferramenta, mas os dados devem vir do seu sistema em vez do manipulador de ferramenta padrão. O exemplo substitui `check_order` e permite que todos os outros eventos continuem.

```js
export default {
  async fetch(request, env) {
    const body = await request.json();

    if (body.event?.name !== "tool.called") {
      return new Response();
    }

    const { toolName, toolArguments, externalUserId } = body.event.data;

    if (toolName !== "check_order") {
      return new Response();
    }

    const orderId = toolArguments?.order_id;
    const orderResponse = await fetch(`${env.INTERNAL_API}/orders/${orderId}`, {
      headers: {
        "Authorization": `Bearer ${env.INTERNAL_API_TOKEN}`
      }
    });

    if (!orderResponse.ok) {
      return new Response(JSON.stringify({
        type: "tool.called.response",
        data: {
          result: `O pedido ${orderId} não pôde ser recuperado para o usuário ${externalUserId}. Peça ao usuário para confirmar o número do pedido.`
        }
      }), {
        headers: {
          "Content-Type": "application/json+worker-action"
        }
      });
    }

    const order = await orderResponse.json();

    return new Response(JSON.stringify({
      type: "tool.called.response",
      data: {
        result: `Pedido ${order.id}: status ${order.status}, entrega estimada ${order.eta}.`
      }
    }), {
      headers: {
        "Content-Type": "application/json+worker-action"
      }
    });
  }
};
```

Este padrão mantém a API interna fora do contexto do modelo. O worker permanece responsável por:

1. Autenticar a solicitação.
2. Validar o usuário.
3. Chamar o sistema interno.
4. Decidir quanto de dados pode retornar ao contexto do modelo.

Para saber como os workers se encaixam na execução do gateway, consulte [Pipelines](https://docs.aivax.net/pt-br/docs/inference/chat-completions/processing-pipeline.md).
