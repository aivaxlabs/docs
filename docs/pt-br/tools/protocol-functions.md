# Funções de Protocolo

Funções de protocolo são ferramentas do lado do servidor AIVAX. Elas permitem que um modelo solicite uma ação nomeada enquanto o AIVAX executa a ação do servidor chamando seu callback HTTP ou uma URL de callback interna do AIVAX.

Use-as quando um assistente precisar de uma forma controlada de interagir com sua aplicação, como verificar um pedido, abrir um ticket de suporte, validar um cupom, registrar um lead ou consultar um serviço privado. O modelo vê o nome da ferramenta, a descrição e o esquema de argumentos JSON. Ele não vê a URL de callback ou os cabeçalhos.

<img src="/assets/diagrams/protocol-functions-1.drawio.svg">

Uma função de protocolo tem dois contratos:

- **Contrato do modelo:** o nome público da ferramenta, a descrição e o JSON Schema que orientam a chamada da ferramenta pelo modelo.
- **Contrato do callback:** a URL oculta e os cabeçalhos opcionais que o AIVAX usa para executar a ferramenta após a chamada do modelo.

Essa separação mantém os detalhes de implementação fora do prompt, ainda dando ao modelo uma capacidade precisa de uso.

## Quando usar funções de protocolo

Use funções de protocolo quando quiser expor uma ação HTTP específica a um AI Gateway sem criar um servidor MCP completo. Elas são boas para integrações pontuais, como verificar um pedido, abrir um ticket, buscar um usuário, validar um cupom, registrar um lead ou invocar uma automação interna. O AIVAX mantém a URL invisível ao modelo, envia a requisição do lado do servidor e adiciona o resultado textual ao contexto da conversa.

Se você tem muitas ferramentas, ferramentas dinâmicas ou um sistema que já implementa o Model Context Protocol, prefira [MCP](/docs/pt-br/tools/mcp). Se quiser usar recursos já mantidos pelo AIVAX, prefira [ferramentas embutidas](/docs/pt-br/tools/builtin-tools). Se precisar tomar decisões antes ou depois de eventos de inferência, prefira [workers](/docs/pt-br/inference/workers). Funções de protocolo ficam no meio: são mais simples que MCP e mais específicas que workers, mas ainda dão ao modelo uma ferramenta controlada para executar uma ação externa.

Uma função de protocolo deve ter um nome de ferramenta, uma descrição, uma URL de callback e um esquema de argumentos. O nome ajuda o modelo a reconhecer a ação; a descrição explica quando chamar; o esquema limita o formato dos argumentos. Nomes de funções devem ser identificadores JavaScript válidos com pelo menos três caracteres. A URL de callback e os detalhes de autenticação não são visíveis ao modelo. Isso permite criar ferramentas especializadas sem expor endpoints internos, desde que seu serviço valide o `X-Request-Nonce`, valide os argumentos recebidos e aplique sua própria autorização quando a chamada depender do usuário.

Use a seguinte regra prática:

| Necessidade | Preferir |
|---|---|
| Um ou poucos callbacks HTTP estáveis pertencentes ao seu aplicativo | Funções de protocolo |
| Um catálogo maior de ferramentas, descoberta padronizada ou um servidor MCP existente | [MCP](/docs/pt-br/tools/mcp) |
| Busca na web, leitura de URL, execução de código, geração de imagens, memória, calendário ou ferramentas de requisição HTTP mantidas pelo AIVAX | [Ferramentas embutidas](/docs/pt-br/tools/builtin-tools) |
| Política em tempo de evento, reescrita de mensagem, injeção dinâmica de ferramenta ou bloqueio de chamada de ferramenta antes da execução | [Workers](/docs/pt-br/inference/workers) |
| Definições de ferramenta nativas do provedor que seu próprio cliente executará | `tools` brutos em uma requisição compatível com OpenAI |

### Escolhendo o nome da função

O nome da função deve ser simples e específico sobre o que a função faz. Evite nomes difíceis de adivinhar ou que não reflitam o papel da função, pois o assistente pode não chamá‑la quando necessário.

Por exemplo, considere uma função que consulta um usuário em um banco de dados externo. Bons nomes incluem:

- `search_user`
- `query_user`

Nomes fracos incluem:

- `search` (amplo demais)
- `query_user_in_database_data` (longo e barulhento)
- `pesquisa-usuario` (nome não em inglês)
- `search user` (nome com caracteres inadequados)

Com o nome da função definido, podemos pensar na descrição da função.

### Escolhendo a descrição da função

A descrição da função deve explicar o que ela faz, quando o assistente deve chamá‑la e quando não deve. Boas descrições incluem a entrada esperada, o tipo de resultado retornado e qualquer regra de decisão que o assistente deve seguir antes de chamar a ferramenta.

Por exemplo, uma descrição útil é:

> Use esta ferramenta para buscar o perfil de um cliente pelo ID do cliente quando o usuário solicitar status de conta, pedidos recentes ou elegibilidade de suporte. Não a chame quando o usuário fornecer apenas nome ou e‑mail; peça primeiro o ID do cliente.

Isso dá ao modelo uma ação clara, um gatilho e uma limitação. Uma descrição vaga como “Search customers” oferece ao modelo muito menos orientação.

## Definindo funções de protocolo

Funções de protocolo são definidas no [AI Gateway](/docs/pt-br/inference/ai-gateway). Você pode declará‑las diretamente no gateway quando a lista for estável, ou fornecer uma fonte remota que retorne a lista de funções quando o catálogo for gerenciado por outro serviço.

A forma direta é a opção mais simples. Use‑a quando a lista de funções mudar raramente e pertencer à própria configuração do gateway.

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

No trecho acima, o gateway expõe `list_clients` e `view_client` ao modelo. O modelo decide se chama uma delas durante a geração. Se chamar `view_client`, o AIVAX valida os argumentos contra `contentFormat` e então envia a requisição de callback ao seu serviço.

## Fontes de funções de protocolo

Fontes de funções de protocolo permitem que um gateway carregue suas funções de protocolo a partir de um ou mais endpoints remotos, em vez de armazenar cada função inline. Na configuração do gateway, `protocolFunctionSources` é um array de strings de URL, não um array de objetos de origem. Use fontes quando o catálogo de funções pertencer a outro serviço, mudar independentemente do gateway ou precisar ser compartilhado por vários gateways.

Cada URL de origem é um endpoint HTTP que retorna um objeto JSON com um array `functions`. O AIVAX busca a origem antes de preparar as opções de inferência, converte cada definição retornada em uma ferramenta do lado do servidor e armazena em cache por 10 minutos por conta e URL de origem. Durante a janela de cache, o AIVAX reutiliza as definições de função em vez de fazer outra requisição de listagem.

Use `protocolFunctions` inline para ferramentas estáveis e controladas pelo gateway. Use `protocolFunctionSources` para catálogos gerenciados remotamente. Você pode usar ambos no mesmo gateway, mas os nomes das funções devem permanecer únicos após a combinação de funções inline, funções originadas, ferramentas MCP, ferramentas embutidas e ferramentas brutas.

<img src="/assets/diagrams/protocol-functions-2.drawio.svg">

Defina os endpoints de listagem de funções no seu AI Gateway:

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

O endpoint de origem de funções recebe uma requisição `GET`. Ele deve retornar um status HTTP de sucesso e um objeto JSON neste formato:

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

Se o endpoint de origem retornar um status não‑de sucesso, o AIVAX registra o erro e a requisição de inferência falha ao preparar as ferramentas. Torne o endpoint de origem rápido, estável e pequeno o suficiente para retornar apenas as funções que o gateway deve expor. Se o catálogo for específico de usuário ou locatário, use o nonce da requisição e suas próprias regras de autorização para decidir quais funções retornar.

### Manipulando chamadas de função

Funções são invocadas no endpoint fornecido em `callbackUrl` via requisição HTTP POST. O AIVAX envia `Content-Type: application/json` e um corpo equivalente a:

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

A resposta a essa ação deve retornar um status HTTP de sucesso (2xx), mesmo para erros que o assistente possa ter cometido. Uma resposta não‑de sucesso é registrada e o modelo recebe um erro genérico de chamada de ferramenta em vez do corpo da sua resposta.

#### Campos de contexto

O AIVAX constrói `context` separadamente dos argumentos gerados pelo modelo em `function.content`. Seu callback deve validar os argumentos contra o esquema da função e usar o contexto para correlacionar a requisição com sua aplicação. O contexto não é um conjunto adicional de argumentos selecionados pelo modelo.

| Campo | Tipo JSON | Significado e disponibilidade |
| --- | --- | --- |
| `context.externalUserId` | `string` ou `null` | Identificador externo do usuário a partir do contexto de inferência. Para uma [sessão de chat](/docs/pt-br/features/chat-clients), este é o ID externo do usuário da sessão; para completions de chat, vem do campo `user` da requisição. Pode ser `null` quando nenhum usuário foi identificado. Não é um ID de conta AIVAX nem credencial de autenticação. |
| `context.metadata` | `object` | Parâmetros de chave/valor de string fornecidos pela aplicação a partir da requisição de inferência ou sessão de chat. Para completions de chat, são as entradas `metadata` da requisição. O objeto está vazio (`{}`) quando nada é fornecido. O `tenant_id` e `request_id` do exemplo são campos personalizados, não nomes gerados pelo AIVAX. |
| `context.callSource` | `string` | Origem da inferência, como `WebChatClient`, `ChatCompletionsApi` ou `IntegrationBot`. Não descreve o transporte do callback: chamar uma função de protocolo não define automaticamente o valor `FunctionsApi`. Consulte os valores compartilhados de [fonte de chamada](/docs/pt-br/tools/mcp#call-source-values) para todos os valores atuais. |
| `context.conversationToken` | `string` ou `null` | Token de correlação da conversa transportado pela sessão ou requisição de inferência. Para completions de chat, vem de `idempotency_key` quando fornecido. Pode ser `null`, e múltiplas chamadas de função podem compartilhá‑lo. Não o trate como um ID de callback único, credencial ou garantia de que uma operação já foi executada. |
| `context.moment` | `string` | Timestamp de data‑hora JSON criado quando o AIVAX prepara o callback, usando o relógio local do servidor. Não é a hora local do usuário nem o horário de início da conversa. Analise como data‑hora com seu deslocamento UTC em vez de depender de precisão fracionária fixa; converta para o fuso horário da sua aplicação quando necessário. |

Metadados personalizados permanecem aninhados em `context.metadata`; não são mesclados em `context`. Isso difere dos [metadados MCP](/docs/pt-br/tools/mcp#metadata-sent-with-tool-calls), onde as mesmas entradas personalizadas ficam ao lado dos campos reservados `_aiv_*` em `params._meta`.

O nonce de autenticação **não** é um campo `context` ou `metadata`. Funções de protocolo recebem-no no cabeçalho HTTP `X-Request-Nonce` quando a conta tem uma chave de hook. Chamadas de ferramenta MCP carregam o valor equivalente em `params._meta._aiv_nonce`. Esses campos de contexto descrevem requisições POST de execução; não presuma que requisições de listagem de funções tenham esse corpo JSON.

#### Formato da resposta

Respostas bem‑sucedidas devem ser textuais e serão anexadas como resposta da função da que o endpoint retornar. Não há formato ou estrutura JSON para essa resposta, mas é recomendável fornecer uma resposta simples e legível para que o assistente possa ler o resultado da ação.

Erros podem ser comuns, como não encontrar um cliente por ID ou um campo não estar no formato desejado. Nesses casos, responda com status OK e inclua uma descrição humana do erro no corpo da resposta e como o assistente pode contorná‑lo.

Os argumentos são validados contra o JSON Schema antes da execução. Seu callback ainda deve validar os argumentos recebidos, pois os esquemas podem limitar a estrutura, mas não substituem autorizações de negócio ou verificações de consistência. Funções que não esperam argumentos devem usar um esquema de objeto vazio.

A resposta da função deve ser escrita para o modelo, não para o usuário final. Ela pode conter dados, avisos e instruções curtas sobre como usar o resultado. Por exemplo, se uma busca de pedido encontrar o status, responda com o status, data esperada e restrições relevantes. Se não for encontrado, indique que o pedido não foi localizado e indique quais dados o assistente deve solicitar ao usuário. Evite retornar objetos enormes, HTML, logs brutos ou mensagens internas, pois esse conteúdo entra no contexto e pode confundir a próxima resposta.

> [!IMPORTANT]
>
> Quanto mais funções você definir, mais tokens de entrada consumirá no processo de raciocínio. A definição da função, assim como seu formato, consomem tokens do processo de raciocínio.

#### Autenticação

A autenticação da requisição é feita via cabeçalho `X-Request-Nonce` enviado em chamadas de funções de protocolo e requisições de listagem de origem.

Consulte o manual de [autenticação](/docs/pt-br/authentication) para entender como autenticar requisições reversas do AIVAX.

#### Autenticação do usuário

Use `context.externalUserId` para localizar o chamador em sua aplicação e, em seguida, verifique se esse usuário pode acessar o recurso solicitado ou executar a ação requerida. Se uma função exigir um usuário identificado, rejeite chamadas sem um identificador utilizável em vez de conceder acesso anônimo silenciosamente.

Valide o nonce e aplique suas próprias regras de autorização de usuário e locatário. Metadados de requisição e sessão podem conter valores fornecidos pelo chamador: um `tenant_id`, `callSource` ou `conversationToken` não são prova de permissão. Evite colocar segredos em metadados porque eles são encaminhados ao seu callback. O nonce verifica a chave de hook da conta, não as permissões individuais do usuário, e não assina o corpo nem impede replay; use seus próprios controles de operação duplicada para gravações.

#### Considerações de segurança

Para o modelo de IA, apenas o nome, a descrição e o formato da função são visíveis. Ele não pode ver o endpoint para o qual a função aponta. Também não recebe os cabeçalhos de callback configurados para a função. Trate todas as requisições de callback como chamadas privilegiadas de servidor‑para‑servidor: valide o nonce, valide os argumentos, aplique autorização e evite expor ações de gravação amplas a menos que sua aplicação tenha suas próprias regras de aprovação.

## Funções especializadas

Além das [funções embutidas](/docs/pt-br/tools/builtin-tools), você pode definir funções especializadas que executam tarefas específicas em sua conta AIVAX.

Você define funções especializadas usando o esquema de URL `aivax://`, conforme o exemplo abaixo:

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

A função acima cria uma ferramenta para que a IA consulte uma [coleção de documentos](/docs/pt-br/rag/collections) específica, orientando o assistente sobre o que buscar nessa coleção e o que esperar da resposta. Dessa forma, você pode vincular várias coleções RAG para que um assistente recupere conteúdo especializado.

Você pode personalizar a descrição das propriedades do JSON Schema para funções especializadas, mas sua estrutura é fixa. Os parâmetros da função especializada são fornecidos na URL via parâmetros de consulta.

Atualmente, existe apenas uma função especializada:

- `query-collection`: realiza uma busca RAG em uma coleção especificada.

Parâmetros de consulta:

- `collection-id`: o UUID da coleção a ser pesquisada.
- `top`: número indicando quantos documentos devem ser retornados na busca.
- `min`: decimal indicando a pontuação mínima de similaridade da busca.
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