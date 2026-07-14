# Funções de Protocolo

Funções de protocolo são ferramentas do lado do servidor AIVAX. Elas permitem que um modelo solicite uma ação nomeada enquanto o AIVAX executa a ação do servidor chamando seu callback HTTP ou uma URL de callback interna do AIVAX.

Use-as quando um assistente precisa de uma forma controlada de interagir com sua aplicação, como verificar um pedido, abrir um ticket de suporte, validar um cupom, registrar um lead ou consultar um serviço privado. O modelo vê o nome da ferramenta, a descrição e o esquema JSON de argumentos. Ele não vê a URL de callback nem os cabeçalhos.

<img src="/assets/diagrams/protocol-functions-1.drawio.svg">

Uma função de protocolo tem dois contratos:

- **Contrato do modelo:** o nome público da ferramenta, a descrição e o JSON Schema que orientam a chamada da ferramenta pelo modelo.  
- **Contrato de callback:** a URL oculta e cabeçalhos opcionais que o AIVAX usa para executar a ferramenta após o modelo chamá‑la.

Essa separação mantém os detalhes de implementação fora do prompt, ainda dando ao modelo uma capacidade precisa de usar.

## Quando usar funções de protocolo

Use funções de protocolo quando quiser expor uma ação HTTP específica a um AI Gateway sem criar um servidor MCP completo. Elas são boas para integrações pontuais, como verificar um pedido, abrir um ticket, buscar um usuário, validar um cupom, registrar um lead ou invocar uma automação interna. O AIVAX mantém a URL invisível ao modelo, envia a requisição do lado do servidor e adiciona o resultado textual ao contexto da conversa.

Se você tem muitas ferramentas, ferramentas dinâmicas ou um sistema que já implementa o Model Context Protocol, prefira [MCP](/docs/pt-br/tools/mcp). Se quiser usar capacidades já mantidas pelo AIVAX, prefira [built-in tools](/docs/pt-br/tools/builtin-tools). Se precisar tomar decisões antes ou depois de eventos de inferência, prefira [workers](/docs/pt-br/inference/workers). Funções de protocolo ficam no meio: são mais simples que MCP e mais específicas que workers, mas ainda dão ao modelo uma ferramenta controlada para executar uma ação externa.

Uma função de protocolo deve ter um nome de ferramenta, uma descrição, uma URL de callback e um esquema de argumentos. O nome ajuda o modelo a reconhecer a ação; a descrição explica quando chamar; o esquema limita o formato dos argumentos. Nomes de função devem ser identificadores JavaScript válidos com pelo menos três caracteres. A URL de callback e os detalhes de autenticação não são visíveis ao modelo. Isso permite criar ferramentas especializadas sem expor endpoints internos, desde que seu serviço valide o `X-Request-Nonce`, valide os argumentos recebidos e aplique sua própria autorização quando a chamada depender do usuário.

Use a seguinte regra prática:

| Necessidade | Preferir |
|---|---|
| Uma ou poucas callbacks HTTP estáveis de sua aplicação | Funções de protocolo |
| Catálogo maior de ferramentas, descoberta padronizada ou servidor MCP existente | [MCP](/docs/pt-br/tools/mcp) |
| Busca na web, leitura de URL, execução de código, geração de imagens, memória, calendário ou ferramentas de requisição HTTP mantidas pelo AIVAX | [Built-in tools](/docs/pt-br/tools/builtin-tools) |
| Política em tempo de evento, reescrita de mensagem, injeção dinâmica de ferramentas ou bloqueio de chamada de ferramenta antes da execução | [Workers](/docs/pt-br/inference/workers) |
| Definições de ferramentas nativas do provedor que seu próprio cliente executará | `tools` brutos em uma requisição compatível com OpenAI |

### Escolhendo o nome da função

O nome da função deve ser simples e específico sobre o que a função faz. Evite nomes difíceis de adivinhar ou que não reflitam o papel da função, pois o assistente pode não chamá‑la quando deveria.

Por exemplo, considere uma função que consulta um usuário em um banco de dados externo. Bons nomes incluem:

- `search_user`
- `query_user`

Nomes fracos incluem:

- `search` (muito amplo)
- `query_user_in_database_data` (longo e ruidoso)
- `pesquisa-usuario` (nome não em inglês)
- `search user` (nome com caracteres inadequados)

Tendo o nome da função, podemos pensar sobre a descrição da função.

### Escolhendo a descrição da função

A descrição da função deve explicar o que a função faz, quando o assistente deve chamá‑la e quando não deve. Boas descrições incluem a entrada esperada, o tipo de resultado retornado e qualquer regra de decisão que o assistente deve seguir antes de chamar a ferramenta.

Por exemplo, uma descrição útil é:

> Use esta ferramenta para buscar o perfil de um cliente pelo ID do cliente quando o usuário pergunta sobre o status da conta, pedidos recentes ou elegibilidade de suporte. Não a chame quando o usuário fornece apenas um nome ou e‑mail; peça primeiro o ID do cliente.

Isso dá ao modelo uma ação clara, gatilho e limitação. Uma descrição vaga como “Search customers” oferece ao modelo muito menos orientação.

## Definindo funções de protocolo

Funções de protocolo são definidas no [AI Gateway](/docs/pt-br/inference/ai-gateway). Você pode declará‑las diretamente no gateway quando a lista é estável, ou fornecer uma fonte remota que retorne a lista de funções quando o catálogo for gerenciado por outro serviço.

A forma direta é a opção mais simples. Use‑a quando a lista de funções muda raramente e pertence à própria configuração do gateway.

Reference:

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

Fontes de funções de protocolo permitem que um gateway carregue suas funções de protocolo a partir de um ou mais endpoints remotos ao invés de armazenar cada função inline. Na configuração do gateway, `protocolFunctionSources` é um array de strings de URL, não um array de objetos de fonte. Use fontes quando o catálogo de funções pertence a outro serviço, muda independentemente do gateway ou precisa ser compartilhado por múltiplos gateways.

Cada URL de fonte é um endpoint HTTP que retorna um objeto JSON com um array `functions`. O AIVAX busca a fonte antes de preparar as opções de inferência, converte cada definição retornada em uma ferramenta do lado do servidor e armazena em cache o resultado por 10 minutos por conta e URL de fonte. Durante a janela de cache, o AIVAX reutiliza as definições de função ao invés de fazer outra requisição de listagem.

Use `protocolFunctions` inline para ferramentas estáveis e pertencentes ao gateway. Use `protocolFunctionSources` para catálogos gerenciados remotamente. Você pode usar ambos no mesmo gateway, mas os nomes das funções devem permanecer únicos após a combinação de funções inline, funções de fonte, ferramentas MCP, ferramentas integradas e ferramentas brutas.

<img src="/assets/diagrams/protocol-functions-2.drawio.svg">

Defina os pontos de listagem de funções no seu AI Gateway:

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

O endpoint de fonte de funções recebe uma requisição `GET`. Ele deve retornar um status HTTP de sucesso e um objeto JSON neste formato:

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

Se o endpoint de fonte retornar um status de não‑sucesso, o AIVAX registra o erro e a requisição de inferência falha ao preparar as ferramentas. Torne o endpoint de fonte rápido, estável e pequeno o suficiente para retornar apenas as funções que o gateway deve expor. Se o catálogo for específico de usuário ou locatário, use o nonce da requisição e suas próprias regras de autorização para decidir quais funções retornar.

### Manipulando chamadas de função

Funções são invocadas no endpoint fornecido em `callbackUrl` via uma requisição HTTP POST. O AIVAX envia `Content-Type: application/json` e um corpo equivalente a:

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
        "externalUserId": "...",
        "metadata": {},
        "callSource": "WebChatClient",
        "conversationToken": "...",
        "moment": "2025-05-18T03:36:27"
    }
}
```

A resposta a essa ação deve retornar um status HTTP de sucesso (2xx), mesmo para erros que o assistente possa ter cometido. Uma resposta de não‑sucesso é registrada e o modelo recebe um erro genérico de chamada de ferramenta ao invés do corpo da sua resposta.

#### Formato de resposta

Respostas bem‑sucedidas devem ser textuais e serão anexadas como resposta da função da forma que o endpoint retornar. Não há formato ou estrutura JSON para essa resposta, mas é recomendável fornecer uma resposta simples e legível para que o assistente possa ler o resultado da ação.

Erros podem ser comuns, como não encontrar um cliente por ID ou um campo não estar no formato desejado. Nesses casos, responda com status OK e inclua uma descrição humana do erro no corpo da resposta e como o assistente pode contorná‑lo.

Os argumentos são validados contra o JSON Schema antes da execução. Seu callback ainda deve validar os argumentos recebidos, pois esquemas podem limitar a estrutura mas não substituem autorizações de negócio ou verificações de consistência. Funções que não esperam argumentos devem usar um esquema de objeto vazio.

A resposta da função deve ser escrita para o modelo, não para o usuário final. Ela pode conter dados, avisos e instruções curtas sobre como usar o resultado. Por exemplo, se uma busca de pedido encontrar o status, responda com o status, data esperada e restrições relevantes. Se não encontrado, responda que o pedido não foi localizado e indique quais dados o assistente deve solicitar ao usuário. Evite retornar objetos enormes, HTML, logs brutos ou mensagens internas, pois esse conteúdo entra no contexto e pode confundir a próxima resposta.

> [!IMPORTANT]
>
> Quanto mais funções você definir, mais tokens de entrada você consumirá no processo de raciocínio. A definição da função, assim como seu formato, consome tokens do processo de raciocínio.

#### Autenticação

A autenticação da requisição é feita via cabeçalho `X-Request-Nonce` enviado nas chamadas de funções de protocolo e nas requisições de listagem de fontes.

Consulte o manual de [authentication](/docs/pt-br/authentication) para entender como autenticar requisições reversas do AIVAX.

#### Autenticação do usuário

Chamadas de função enviam `$.context.externalUserId` quando a chamada vem de uma [chat session](/docs/pt-br/features/chat-clients) identificada. Elas também incluem `metadata`, `callSource`, `conversationToken` e `moment`. Use esses campos para correlação e autorização ao nível de usuário, mas não os trate como a única fronteira de segurança; valide o nonce e aplique suas próprias regras de autorização.

#### Considerações de segurança

Para o modelo de IA, somente o nome, a descrição e o formato da função são visíveis. Ele não pode ver o endpoint para o qual a função aponta. Também não recebe os cabeçalhos de callback configurados para a função. Trate todas as requisições de callback como chamadas privilegiadas servidor‑para‑servidor: valide o nonce, valide os argumentos, imponha autorização e evite expor ações de escrita amplas a menos que sua aplicação tenha suas próprias regras de aprovação.

## Funções especializadas

Além das [built-in functions](/docs/pt-br/tools/builtin-tools), você pode definir funções especializadas que realizam tarefas específicas na sua conta AIVAX.

Você define funções especializadas usando o esquema de URL `aivax://`, seguindo o exemplo abaixo:

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

A função acima cria uma ferramenta para que a IA consulte uma [document collection](/docs/pt-br/rag/collections) específica, orientando o assistente sobre o que buscar nessa coleção e o que esperar de uma resposta. Dessa forma, você pode vincular múltiplas coleções RAG para que o assistente recupere conteúdo especializado.

Você pode personalizar a descrição das propriedades do JSON Schema para funções especializadas, mas sua estrutura é fixa. Os parâmetros da função especializada são fornecidos na URL via parâmetros de consulta.

Atualmente, existe apenas uma função especializada:

- `query-collection`: realiza uma busca RAG em uma coleção especificada.

Parâmetros de consulta:

- `collection-id`: o UUID da coleção a ser pesquisada.
- `top`: número indicando quantos documentos devem ser retornados na busca.
- `min`: decimal indicando a pontuação mínima de similaridade da busca.
- `refs`: quando presente, inclui documentos pais referenciados no resultado RAG.

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