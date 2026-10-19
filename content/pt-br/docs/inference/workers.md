---
{title: Workers de Gateway,linkTitle: Workers de Gateway,weight: 70,group: Inference,sourceHash: 5e4e53a6d5a10371,aliases: [/docs/pt-br/inference/workers.html]}
---

# Workers de Gateway

Workers de gateway de IA são hooks HTTP que permitem que um serviço externo controle a execução do gateway em tempo de execução. Um worker pode permitir um evento, interrompê-lo, reescrever o contexto, adicionar instruções ou ferramentas, ou substituir o resultado de uma ferramenta do lado do servidor.

Use workers quando uma regra precisar ser decidida fora do prompt. Casos comuns incluem verificações de assinatura, enriquecimento de CRM, política específica de tenant, registro de auditoria, bloqueio dinâmico de ferramentas e substituição de um resultado de ferramenta visível ao modelo por dados de um sistema interno.

Workers rodam no caminho crítico da inferência. Cada evento de worker adiciona uma requisição HTTP antes que o gateway possa continuar, portanto mantenha o endpoint rápido e previsível.

## Formato da solicitação

Quando um evento de worker configurado dispara, o AIVAX envia uma requisição `POST` para a URL do worker do gateway.

```json
{
    "gatewayId": "your-gateway-id",
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
            "externalUserId": "customer-123",
            "metadata": {}
        }
    }
}
```

A forma exata de `event.data` depende do evento. Sempre valide `gatewayId` quando um endpoint atende a mais de um gateway.

## Autenticação

Quando a conta possui uma chave de hook, o AIVAX envia o cabeçalho `X-Request-Nonce`. O nonce é um hash BCrypt derivado da chave de hook da conta. Valide esse cabeçalho antes de confiar no corpo, especialmente quando o worker libera dados privados, altera o contexto ou autoriza o uso de ferramentas.

Trate `externalUserId`, `metadata`, mensagens e argumentos de ferramentas como entrada não confiável.

## Comportamento da resposta

Após enviar a requisição, o AIVAX trata a resposta do worker da seguinte forma:

| Resposta | Comportamento |
|---|---|
| `Content-Type: application/json+worker-action` | Executa a ação descrita no corpo JSON. |
| `2xx` sem `application/json+worker-action` | Continua normalmente. |
| Resposta não‑OK sem `application/json+worker-action` | Interrompe o evento. |

Se a requisição ao worker falhar com uma exceção de requisição HTTP, o AIVAX registra a falha e interrompe o evento.

Escolha intencionalmente o comportamento fail‑open ou fail‑closed:

- Retorne `2xx` quando o worker apenas adiciona enriquecimento opcional, para que a conversa continue mesmo que sua lógica não tenha nada a acrescentar.  
- Retorne uma resposta não‑OK quando autorização, conformidade ou política de negócio não puder falhar aberto.

## `message.received`

O evento `message.received` dispara após o gateway preparar o contexto da mensagem de entrada e antes da chamada ao modelo.

```json
{
    "name": "message.received",
    "data": {
        "messages": [],
        "origin": "ChatCompletionsApi",
        "externalUserId": "customer-123",
        "metadata": {}
    }
}
```

Para modificar o contexto, retorne `Content-Type: application/json+worker-action` com `type: "message.received.response"`:

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

Ações de reescrita disponíveis:

| Ação | Descrição | Parâmetros |
|---|---|---|
| `clear` | Remove elementos do contexto. | `argument`: `messages`, `meta`, `system`, `tools`, `skills`, `all` ou omitido. |
| `add-message` | Adiciona uma mensagem à conversa. | `message`: objeto de mensagem compatível com OpenAI. |
| `remove-message` | Remove uma mensagem por índice. | `index`: índice da mensagem (base zero). |
| `add-system` | Adiciona uma instrução de sistema. | `message`: texto da instrução. |
| `add-tool` | Adiciona uma definição de ferramenta compatível com OpenAI. | `tool`: objeto JSON da ferramenta. |
| `add-protocol-tool` | Adiciona uma [função de protocolo](/docs/pt-br/tools/protocol-functions). | `tool`: definição da função de protocolo. |
| `add-mcp-source` | Adiciona as ferramentas descobertas de uma fonte [MCP](/docs/pt-br/tools/mcp) ao contexto. | `source`: objeto de fonte MCP com `url`, `headers`, `name` e/ou `cacheDuration`. |

### Substituir o contexto do usuário

Este exemplo executa `clear` e depois adiciona uma mensagem de substituição, fazendo com que o modelo responda à mensagem de política em vez da entrada original do usuário:

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

Este exemplo remove a primeira mensagem do contexto, usando seu índice base zero:

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

Este exemplo expõe as ferramentas de um servidor MCP interno apenas para a inferência atual:

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
                        "Authorization": "Bearer <INTERNAL_CRM_TOKEN>"
                    },
                    "cacheDuration": 600
                }
            }
        ]
    }
}
```

Use `add-mcp-source` quando a lista de ferramentas precisar depender da mensagem, usuário, canal ou de uma política externa. O AIVAX lista as ferramentas do servidor MCP, converte cada esquema em uma função chamável pelo modelo e disponibiliza essas ferramentas apenas para aquela inferência. Para fontes permanentes, configure o MCP diretamente no gateway de IA.

## `tool.called`

O evento `tool.called` dispara antes que o AIVAX execute uma ferramenta interna do lado do servidor.

```json
{
    "name": "tool.called",
    "data": {
        "toolName": "check_order",
        "toolArguments": {
            "order_id": "A123"
        },
        "origin": "ChatCompletionsApi",
        "externalUserId": "customer-123",
        "metadata": {}
    }
}
```

Retorne uma resposta não‑OK para bloquear a chamada da ferramenta. Retorne `2xx` para que o AIVAX execute a ferramenta normalmente.

Para substituir o resultado da ferramenta, retorne `Content-Type: application/json+worker-action` com `type: "tool.called.response"`:

```json
{
    "type": "tool.called.response",
    "data": {
        "result": "O pedido A123 está pago e programado para entrega amanhã.",
        "messages": []
    }
}
```

Campos de `data`:

| Campo | Descrição |
|---|---|
| `result` | Conteúdo textual injetado como resultado da ferramenta. |
| `messages` | Mensagens adicionais opcionais no formato OpenAI anexadas ao contexto da conversa. |

Quando `tool.called.response` é retornado, o AIVAX usa o resultado fornecido pelo worker em vez de executar o manipulador padrão da ferramenta.

## Exemplo: bloqueando usuários não autorizados

O exemplo abaixo mostra um Cloudflare Worker que bloqueia uma chamada ao gateway quando o usuário externo não é permitido. Requisições para outros gateways ou eventos recebem uma resposta vazia `2xx` e continuam normalmente; uma resposta `403` interrompe o evento `message.received` para usuários fora da lista de permissões.

```js
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
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
      return new Response("User is not authorized", { status: 403 });
    }

    return new Response();
  }
};
```

## Exemplo: substituindo uma ferramenta por um sistema interno

Use `tool.called` quando o modelo deve ver um resultado de ferramenta, mas os dados reais devem vir do seu sistema.

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
          result: `The order ${orderId} could not be retrieved for user ${externalUserId}. Ask the user to confirm the order number.`
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
        result: `Order ${order.id}: status ${order.status}, estimated delivery ${order.eta}.`
      }
    }), {
      headers: {
        "Content-Type": "application/json+worker-action"
      }
    });
  }
};
```

Esse padrão impede a exposição direta da API interna ao modelo. O worker continua responsável por autenticar a requisição, validar o usuário, chamar o sistema interno e decidir quanto de dados podem ser retornados ao contexto do modelo.

Para saber como os workers se encaixam na execução do gateway, veja [Pipelines](/docs/pt-br/inference/pipelines).
