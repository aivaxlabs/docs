---
{title: Funções de Protocolo,linkTitle: Funções de protocolo,weight: 30,group: Tools,sourceHash: 9a01a355c9794fb6,aliases: [/docs/pt-br/tools/protocol-functions.html]}
---

# Funções de Protocolo

As funções de protocolo são ferramentas do lado do servidor do AIVAX. O modelo solicita uma ação nomeada, e o AIVAX a executa no servidor chamando seu callback HTTP ou um URL de callback interno do AIVAX.

Use-as quando um assistente precisar de uma maneira controlada de interagir com sua aplicação, como verificar um pedido, abrir um chamado de suporte ou consultar um serviço privado. O modelo vê o nome da ferramenta, a descrição e o esquema JSON dos argumentos. Ele não vê o URL do callback nem os cabeçalhos.

<img src="/assets/diagrams/protocol-functions-1.drawio.svg">

Uma função de protocolo possui dois contratos:

- **O contrato do modelo:** o nome público da ferramenta, a descrição e o JSON Schema que orientam a chamada de ferramenta pelo modelo.
- **O contrato do callback:** o URL oculto e os cabeçalhos opcionais que o AIVAX usa para executar a ferramenta após o modelo chamá-la.

Essa separação mantém os detalhes de implementação fora do prompt, ao mesmo tempo em que fornece ao modelo uma capacidade precisa para usar.

## Quando usar funções de protocolo

Use funções de protocolo para expor uma ação HTTP específica a um Gateway de IA sem construir um servidor MCP completo. Elas se adequam a integrações pontuais, como buscar um usuário, registrar um lead ou invocar uma automação interna. O AIVAX mantém o URL oculto do modelo, envia a solicitação do lado do servidor e adiciona o resultado textual ao contexto da conversa.

As funções de protocolo ficam entre outros tipos de ferramentas: são mais simples que [MCP](/docs/pt-br/tools/mcp) e mais específicas que [workers](/docs/pt-br/inference/workers), ainda assim fornecendo ao modelo uma ferramenta controlada para uma ação externa. Use esta regra prática:

| Necessidade | Prefira |
|---|---|
| Um ou poucos callbacks HTTP estáveis de propriedade do seu aplicativo | Funções de protocolo |
| Um catálogo maior de ferramentas, descoberta padronizada ou um servidor MCP existente | [MCP](/docs/pt-br/tools/mcp) |
| Busca na web, leitura de URLs, execução de código, geração de imagens, memória ou ferramentas de solicitação HTTP mantidas pelo AIVAX | [Ferramentas integradas](/docs/pt-br/tools/builtin-tools) |
| Política em tempo de evento, reescrita de mensagens, injeção dinâmica de ferramentas ou bloqueio de uma chamada de ferramenta antes da execução | [Workers](/docs/pt-br/inference/workers) |
| Definições de ferramentas nativas do provedor que seu próprio cliente executará | `tools` brutos em uma solicitação compatível com OpenAI |

Cada função de protocolo tem quatro partes:

- **Nome:** ajuda o modelo a reconhecer a ação. Deve ser um identificador JavaScript válido com pelo menos três caracteres.
- **Descrição:** informa ao modelo quando chamar a função.
- **Esquema de argumento** (`contentFormat`): limita o formato dos argumentos.
- **URL de callback** (`callbackUrl`): para onde o AIVAX envia a chamada. O modelo nunca o vê nem seus detalhes de autenticação.

Como o callback permanece oculto, você pode criar ferramentas especializadas sem expor endpoints internos. Seu serviço ainda deve validar o `X-Request-Nonce`, validar os argumentos recebidos e aplicar sua própria autorização quando a chamada depender do usuário.

### Escolhendo o nome da função

O nome da função deve ser simples e específico sobre o que ela faz. Evite nomes difíceis de adivinhar ou que não reflitam o papel da função, pois o assistente pode não chamar a função quando deveria.

Por exemplo, considere uma função que consulta um usuário em um banco de dados externo. Bons nomes incluem:

- `search_user`
- `query_user`

Nomes fracos incluem:

- `search` (muito genérico)
- `query_user_in_database_data` (longo e ruidoso)
- `pesquisa-usuario` (nome não em inglês)
- `search user` (nome com caracteres impróprios)

### Escolhendo a descrição da função

A descrição da função deve explicar o que ela faz, quando o assistente deve chamá-la e quando não deve chamá-la. Boas descrições incluem a entrada esperada, o tipo de resultado retornado e qualquer regra de decisão que o assistente deva seguir antes de chamar a ferramenta.

Por exemplo, uma descrição útil é:

> Use esta ferramenta para buscar o perfil de um cliente por ID do cliente quando o usuário perguntar sobre o status da conta, pedidos recentes ou elegibilidade para suporte. Não a chame quando o usuário fornecer apenas um nome ou e-mail; peça o ID do cliente primeiro.

Isso dá ao modelo uma ação clara, um gatilho e uma limitação. Uma descrição vaga como "Buscar clientes" oferece muito menos orientação ao modelo.

## Definindo funções de protocolo

As funções de protocolo são definidas no [Gateway de IA](/docs/pt-br/inference/ai-gateway). Você pode declará-las diretamente no gateway quando a lista for estável ou fornecer uma fonte remota que retorne a lista de funções quando o catálogo for gerenciado por outro serviço.

A forma direta é a opção mais simples. Use-a quando a lista de funções mudar raramente e pertencer à configuração do gateway.

Referência:

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20AI%20Gateway&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

```json
{
    "name": "my-ai-gateway",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "@openai/gpt-5-mini",
        "protocolFunctions": [
            {
                "name": "list_clients",
                "description": "Use this tool to list and search for the user's clients.",
                "callbackUrl": "https://my-external-api.com/api/scp/users",
                "contentFormat": {
                    "type": "object",
                    "properties": {}
                }
            },
            {
                "name": "view_client",
                "description": "Use this tool to obtain details and orders of a client via its ID.",
                "callbackUrl": "https://my-external-api.com/api/scp/users",
                "contentFormat": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string",
                            "format": "uuid"
                        }
                    },
                    "required": ["user_id"]
                }
            }
        ]
    }
}
```

No trecho acima, o gateway expõe `list_clients` e `view_client` ao modelo. O modelo decide se chama uma delas durante a geração. Se ele chamar `view_client`, o AIVAX valida os argumentos contra `contentFormat` e, em seguida, envia a solicitação de callback para o seu serviço, conforme descrito em [Manipulando chamadas de função](#handling-function-calls).

> [!IMPORTANT]
>
> Cada definição de função, incluindo seu nome, descrição e esquema, consome tokens de entrada. Quanto mais funções você definir, mais tokens de entrada consumirá.

## Fontes de funções de protocolo

As fontes de funções de protocolo permitem que um gateway carregue suas funções de protocolo de um ou mais endpoints remotos em vez de armazenar cada função inline. Use fontes quando o catálogo de funções pertencer a outro serviço, mudar independentemente do gateway ou for compartilhado por vários gateways.

- Use `protocolFunctions` inline para ferramentas estáveis e de propriedade do gateway.
- Use `protocolFunctionSources` para catálogos gerenciados remotamente. É uma matriz de strings de URL, não uma matriz de objetos de origem.

Você pode usar ambos no mesmo gateway. Os nomes das funções devem permanecer exclusivos após combinar funções inline, funções originadas, ferramentas MCP, ferramentas integradas e ferramentas brutas.

Cada URL de origem é um endpoint HTTP que retorna um objeto JSON com uma matriz `functions`. O AIVAX busca a origem antes de preparar as opções de inferência e converte cada definição retornada em uma ferramenta do lado do servidor. O resultado é armazenado em cache por 10 minutos por conta e URL de origem; durante essa janela, o AIVAX reutiliza as definições em vez de fazer outra solicitação de listagem.

<img src="/assets/diagrams/protocol-functions-2.drawio.svg">

Defina os endpoints de listagem de funções no seu Gateway de IA:

```json
{
    "name": "my-ai-gateway",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "@openai/gpt-5-mini",
        "protocolFunctionSources": [
            "https://my-external-api.com/api/scp/listings"
        ]
    }
}
```

O endpoint de origem da função recebe uma solicitação `GET`. Ele deve retornar um status HTTP bem-sucedido e um objeto JSON neste formato:

<div class="request-item get">
    <span>GET</span>
    <span>
        https://my-external-api.com/api/scp/listings
    </span>
</div>

```json
{
    "functions": [
        {
            "name": "list_clients",
            "description": "Use this tool to list and search for the user's clients.",
            "callbackUrl": "https://my-external-api.com/api/scp/users",
            "contentFormat": {
                "type": "object",
                "properties": {}
            }
        },
        {
            "name": "view_client",
            "description": "Use this tool to obtain details and orders of a client via its ID.",
            "callbackUrl": "https://my-external-api.com/api/scp/users",
            "contentFormat": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "format": "uuid"
                    }
                },
                "required": ["user_id"]
            }
        }
    ]
}
```

Os objetos de função retornados usam a mesma estrutura das `protocolFunctions` inline: `name`, `description`, `callbackUrl`, `headers` opcionais e `contentFormat`.

Se o endpoint de origem retornar um status não bem-sucedido, o AIVAX registra o erro e a solicitação de inferência falha ao preparar as ferramentas. Torne o endpoint de origem rápido, estável e pequeno o suficiente para retornar apenas as funções que o gateway deve expor. Se o catálogo for específico por usuário ou inquilino, use o nonce da solicitação e suas próprias regras de autorização para decidir quais funções retornar.

## Manipulando chamadas de função

Quando o modelo chama uma função, seja inline ou originada, o AIVAX envia uma solicitação HTTP `POST` para seu `callbackUrl` com `Content-Type: application/json` e um corpo equivalente a:

```json
{
    "type": "tool_call",
    "function": {
        "name": "view_client",
        "content": {
            "user_id": "example-user-id"
        }
    },
    "context": {
        "externalUserId": "<EXTERNAL_USER_ID>",
        "metadata": {
            "tenant_id": "<TENANT_ID>",
            "request_id": "<APPLICATION_REQUEST_ID>"
        },
        "callSource": "WebChatClient",
        "conversationToken": "<CONVERSATION_TOKEN>",
        "moment": "2025-05-18T03:36:27+00:00"
    }
}
```

`function.content` contém os argumentos gerados pelo modelo, e `context` descreve a inferência que acionou a chamada.

Seu callback deve retornar um status HTTP bem-sucedido (2xx), mesmo quando o assistente cometeu um erro na chamada. Uma resposta não bem-sucedida é registrada e o modelo recebe um erro genérico de chamada de ferramenta em vez do corpo da sua resposta.

### Campos de contexto

O AIVAX constrói `context` separadamente dos argumentos gerados pelo modelo em `function.content`. Seu callback deve validar os argumentos contra o esquema da função e usar o contexto para correlacionar a solicitação com o seu aplicativo. O contexto não é um conjunto adicional de argumentos de função selecionados pelo modelo.

| Campo | Tipo JSON | Significado e disponibilidade |
| --- | --- | --- |
| `context.externalUserId` | `string` ou `null` | Identificador de usuário externo do contexto de inferência. Para uma [sessão de chat](/docs/pt-br/inference/chat-clients), este é o ID de usuário externo da sessão; para conclusões de chat, vem do campo `user` da solicitação. Pode ser `null` quando nenhum usuário foi identificado. Não é um ID de conta do AIVAX nem uma credencial de autenticação. |
| `context.metadata` | `object` | Pares de chave/valor de string fornecidos pelo aplicativo provenientes da solicitação de inferência ou da sessão de chat. Para conclusões de chat, estas são as entradas `metadata` da solicitação. O objeto está vazio (`{}`) quando nenhum é fornecido. O `tenant_id` e o `request_id` do exemplo são campos personalizados, não nomes gerados pelo AIVAX. |
| `context.callSource` | `string` | Origem da inferência, como `WebChatClient`, `ChatCompletionsApi` ou `IntegrationBot`. Não descreve o transporte do callback: chamar uma função de protocolo não torna automaticamente o valor `FunctionsApi`. Consulte os [valores de origem de chamada](/docs/pt-br/tools/mcp#call-source-values) compartilhados para todos os valores atuais. |
| `context.conversationToken` | `string` ou `null` | Token de correlação de conversa transportado pela sessão ou solicitação de inferência. Para conclusões de chat, vem de `idempotency_key` quando fornecido. Pode ser `null`, e várias chamadas de função podem compartilhá-lo. Não o trate como um ID de callback exclusivo, uma credencial ou uma garantia de que uma operação já não foi executada. |
| `context.moment` | `string` | Timestamp de data/hora JSON criado quando o AIVAX prepara o callback, usando o relógio local do servidor. Não é a hora local do usuário nem a hora de início da conversa. Analise-o como uma data/hora com seu deslocamento UTC em vez de confiar em uma precisão fixa de fração de segundo; converta para o fuso horário do seu aplicativo quando necessário. |

Metadados personalizados permanecem aninhados sob `context.metadata`; eles não são mesclados em `context`. Isso difere dos [metadados do MCP](/docs/pt-br/tools/mcp#metadata-sent-with-tool-calls), onde as mesmas entradas personalizadas estão ao lado dos campos reservados `_aiv_*` em `params._meta`.

O nonce de autenticação **não** é um campo `context` ou `metadata`. As funções de protocolo recebem o `X-Request-Nonce` no cabeçalho HTTP nas chamadas de funções de protocolo e nas solicitações de listagem de origens. As chamadas de ferramentas MCP carregam o valor equivalente em `params._meta._aiv_nonce` em vez disso. Esses campos de contexto descrevem solicitações POST de execução; não assuma que as solicitações de listagem de origem de função tenham esse corpo JSON.

### Formato de resposta

Retorne um corpo de resposta textual. O AIVAX o anexa à conversa como o resultado da função exatamente como seu endpoint o retorna. Nenhuma estrutura JSON é necessária, mas uma resposta curta e legível por humanos é mais fácil para o assistente usar.

Escreva a resposta para o modelo, não para o usuário final. Ela pode conter dados, avisos e instruções curtas sobre como usar o resultado. Por exemplo:

- Se uma busca por pedido encontrar o pedido, retorne seu status, data prevista e restrições relevantes.
- Se o pedido não for encontrado, diga isso e indique quais dados o assistente deve pedir ao usuário.

Erros esperados, como um ID de cliente que não existe ou um campo no formato errado, são comuns. Retorne-os com status 2xx e descreva o erro e como o assistente pode contorná-lo no corpo da resposta.

Evite retornar objetos enormes, HTML, logs brutos ou mensagens internas. Esse conteúdo entra no contexto e pode confundir a próxima resposta.

O AIVAX valida os argumentos contra o JSON Schema antes da execução. Seu callback ainda deve validá-los, porque um esquema limita a estrutura, mas não substitui verificações de autorização comercial ou consistência. Funções que não recebem argumentos devem usar um esquema de objeto vazio.

### Autenticação

A autenticação de solicitação é feita através do cabeçalho `X-Request-Nonce` enviado nas chamadas de funções de protocolo e nas solicitações de listagem de origens.

Consulte o manual de [autenticação](/docs/pt-br/authentication) para entender como autenticar solicitações reversas do AIVAX.

### Autenticação de usuário

Use `context.externalUserId` para procurar o chamador no seu aplicativo e, em seguida, verifique se esse usuário pode acessar o recurso solicitado ou realizar a ação solicitada. Se uma função exigir um usuário identificado, rejeite chamadas sem um identificador utilizável em vez de conceder acesso anônimo silenciosamente.

Valide o nonce e aplique suas próprias regras de autorização de usuário e inquilino. Metadados de solicitação e sessão podem conter valores fornecidos pelo chamador: um `tenant_id`, `callSource` ou `conversationToken` não é prova de permissão. Evite colocar segredos nos metadados, pois eles são encaminhados para o seu callback. O nonce verifica a chave de gancho da conta, não as permissões individuais do usuário, e não assina o corpo nem impede a reprodução; use seus próprios controles de operação duplicada para gravações.

### Considerações de segurança

O modelo vê apenas o nome da função, a descrição e o esquema de argumento. Ele não pode ver o endpoint de callback nem os cabeçalhos de callback configurados para a função. Trate todas as solicitações de callback como chamagens privilegiadas de servidor para servidor: valide o nonce, valide os argumentos, aplique a autorização e evite expor ações de gravação amplas, a menos que seu aplicativo tenha suas próprias regras de aprovação.

## Funções especialistas

Funções especialistas são funções de protocolo cujo callback é uma capacidade do AIVAX em vez do seu próprio endpoint. Diferente das [ferramentas integradas](/docs/pt-br/tools/builtin-tools), você as nomeia e descreve, para que possa apontar várias funções para recursos diferentes na sua conta do AIVAX.

Defina uma função especialista definindo `callbackUrl` para um URL `aivax://`:

```json
{
    "name": "my-ai-gateway",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "@openai/gpt-5-mini",
        "protocolFunctions": [
            {
                "name": "search_disease",
                "description": "Use this tool to search for diseases, treatments, and symptoms.",
                "callbackUrl": "aivax://query-collection?collection-id=your-collection-id&top=5&min=0.4",
                "contentFormat": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "Name of the disease, treatment, or symptoms."
                        }
                    },
                    "required": [
                        "query"
                    ]
                }
            }
        ]
    }
}
```

Esta função permite que o modelo consulte uma [coleção de documentos](/docs/pt-br/rag/collections) específica. Sua descrição informa ao assistente o que pesquisar nessa coleção e o que esperar receber. Defina uma função por coleção para dar ao assistente várias fontes de conteúdo especializado.

A estrutura do JSON Schema de uma função especialista é fixa, mas você pode personalizar as descrições de suas propriedades. As configurações da função especialista são passadas como parâmetros de consulta no URL.

Atualmente, existe apenas uma função especialista:

- `query-collection`: realiza uma pesquisa RAG em uma coleção especificada.

Parâmetros de consulta:

- `collection-id`: o UUID da coleção a ser pesquisada.
- `top`: um número indicando quantos documentos devem ser retornados na pesquisa.
- `min`: um decimal indicando a pontuação mínima de similaridade da pesquisa.
- `refs`: quando presente, inclui documentos pai referenciados no resultado RAG.

Formato JSON da função:

```json
{
    "type": "object",
    "properties": {
        "query": {
            "type": "string",
            "description": "Search content."
        }
    },
    "required": [
        "query"
    ]
}
```
