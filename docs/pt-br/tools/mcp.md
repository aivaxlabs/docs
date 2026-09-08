## Suporte ao Protocolo de Contexto de Modelo (MCP)

Você pode vincular ferramentas externas do protocolo MCP ao seu [AI Gateway](/docs/pt-br/inference/ai-gateway). O protocolo define ferramentas que são executadas no lado do servidor e permitem que o assistente interaja com serviços em tempo real.

AIVAX funciona como um cliente MCP para inferência de gateway: ele se conecta à fonte MCP configurada, lista ferramentas, converte cada esquema de ferramenta em uma função chamável pelo modelo e chama o servidor MCP remoto quando o modelo seleciona essa ferramenta.

<img src="/assets/diagrams/mcp-1.drawio.svg">

## Quando usar MCP

Use o MCP quando você já possui ferramentas externas que precisam ser descobertas e chamadas por modelos de forma padronizada. Um servidor MCP é adequado para catálogos de ferramentas, integrações com sistemas internos, operações com estado, ferramentas compartilhadas entre múltiplos agentes e ambientes onde você deseja manter a lógica fora do AIVAX. AIVAX funciona como um cliente MCP: ele conecta o AI Gateway ao servidor remoto, lê as ferramentas disponíveis e permite que o modelo chame essas ferramentas durante a inferência.

Não use o MCP apenas para substituir uma única chamada HTTP simples. Quando precisar expor uma função isolada com um callback específico e autenticação por nonce, [funções de protocolo](/docs/pt-br/tools/protocol-functions) geralmente são mais simples. Quando a capacidade já existe no AIVAX, como busca na web, abertura de URL, execução de código ou geração de imagens, [ferramentas integradas](/docs/pt-br/tools/builtin-tools) geralmente são o caminho mais direto. O MCP é melhor quando há um conjunto de ferramentas com seus próprios esquemas, quando outro sistema já fala MCP ou quando você deseja que o mesmo servidor seja usado por diferentes clientes.

Em produção, trate o servidor MCP como uma API exposta a um agente. As descrições das ferramentas devem ser claras, os esquemas devem ser restritivos e a autenticação deve ser configurada nos cabeçalhos do servidor. O modelo não deve receber ferramentas excessivamente genéricas, como `execute`, `request` ou `search`, sem descrições fortes e parâmetros controlados. Ferramentas ambíguas aumentam chamadas erradas; ferramentas específicas como `lookup_customer_by_email` ou `create_support_ticket` ajudam o modelo a decidir melhor.

### Escolhendo o nome da função

O nome da função deve ser simples e determinístico sobre o que a função faz. Evite nomes que sejam difíceis de adivinhar ou que não indiquem o papel da função, pois o assistente pode ficar confuso e não chamar a função quando necessário.

Como exemplo, vamos pensar em uma função que consulta um usuário em um banco de dados externo. Os nomes a seguir são bons exemplos a considerar para a chamada:

- `search_user`
- `query_user`

Nomes ruins incluem:

- `search` (implícito, possivelmente ambíguo)
- `search user` (nome com caracteres inadequados)

### Escolhendo a descrição da função

A descrição da função deve explicar conceitualmente duas situações: o que ela faz e quando o assistente deve chamá‑la. Essa descrição deve incluir os cenários que o assistente deve considerar para chamá‑la e quando não deve ser chamada, fornecendo alguns exemplos de chamadas de um único disparo e/ou tornando as regras da função explícitas.

### Definindo servidores MCP

Você pode definir seus servidores MCP no gateway através de um array JSON:

```json
[
    {
        "name": "My MCP server",
        "url": "https://example-server.io/mcp",
        "headers": {
            "Authorization": "sk-pv-12nbo..."
        }
    }
]
```

Seu servidor MCP deve suportar **HTTP transmissível** para funcionar com o AIVAX como fonte de ferramentas do gateway. Você pode definir cabeçalhos personalizados na configuração do seu servidor MCP para configurar autenticação ou outras necessidades. A descoberta de ferramentas é armazenada em cache de acordo com `cacheDuration`; o padrão é 600 segundos.

## Metadados enviados com chamadas de ferramentas

Para cada requisição `tools/call`, o AIVAX adiciona contexto de execução em `params._meta`, ao lado de `params.arguments`. Os argumentos contêm a entrada da ferramenta; os metadados identificam o contexto de chamada e carregam valores fornecidos pela aplicação. Esses campos descrevem solicitações de execução de ferramentas, não a descoberta de ferramentas (`tools/list`).

O exemplo a seguir ilustra uma chamada com um usuário identificado, um token de conversa e metadados personalizados:

```json
{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
        "name": "get_weather",
        "arguments": {
            "location": "New York"
        },
        "_meta": {
            "_aiv_nonce": "<BCRYPT_HASH>",
            "_aiv_external_user_id": "<EXTERNAL_USER_ID>",
            "_aiv_call_source": "WebChatClient",
            "_aiv_conversation_token": "<CONVERSATION_TOKEN>",
            "_aiv_moment": "2025-09-09T16:58:05.0000000+00:00",
            "tenant_id": "<TENANT_ID>",
            "request_id": "<APPLICATION_REQUEST_ID>"
        }
    }
}
```

### Campos AIVAX

Todos os caminhos abaixo são relativos a `params._meta`. Nomes que começam com `_aiv` são reservados; não os use para metadados personalizados.

| Campo | Tipo JSON | Significado e disponibilidade |
| --- | --- | --- |
| `_aiv_nonce` | `string` ou `null` | Hash BCrypt derivada da chave de hook da conta chamadora. Sem uma chave de hook configurada, seu valor é `null`. Verifique a chave de hook em texto plano configurada contra esse hash conforme descrito em [autenticação de hook](/docs/pt-br/authentication#hook-authentication); não compare strings de hash nem espere a própria chave de hook. |
| `_aiv_external_user_id` | `string` ou `null` | Identificador externo de usuário transportado pelo contexto de inferência. Para clientes de chat vem da sessão; para conclusões de chat vem do campo `user` da requisição. Pode ser `null` quando nenhum usuário foi identificado. Use‑o para buscar o usuário na sua aplicação, não como um ID de conta AIVAX ou prova de autorização. |
| `_aiv_call_source` | `string` | Origem da inferência, não o transporte de ferramenta de saída. Uma ferramenta MCP chamada durante inferência de chat web ainda recebe `WebChatClient`, não `McpClient`. Veja os valores abaixo. |
| `_aiv_conversation_token` | `string` ou `null` | Token de correlação de conversa transportado pela sessão ou requisição de inferência. Para conclusões de chat, vem de `idempotency_key` quando fornecido. Pode ser `null`; não é credencial de autenticação nem um ID único de chamada de ferramenta. Várias chamadas na mesma conversa podem compartilhá‑lo. |
| `_aiv_moment` | `string` | Timestamp criado quando o AIVAX prepara esta chamada de ferramenta, no formato ISO 8601 round-trip com segundos fracionários e offset UTC. Usa o relógio local do servidor AIVAX, não o fuso horário do usuário ou o horário de início da conversa. Analise o offset e converta para o fuso horário da sua aplicação quando necessário. |

### Valores de origem da chamada

Os mesmos valores de string são usados por funções de protocolo em `context.callSource`:

| Valor | Origem da inferência |
| --- | --- |
| `WebChatClient` | Cliente de chat web AIVAX. |
| `ChatCompletionsApi` | API de conclusões de chat compatível com OpenAI; a origem padrão para essa API. |
| `FunctionsApi` | API de funções. |
| `IntegrationBot` | Bot de integração de mensagens. |
| `OpenWebUiClient` | Cliente Open WebUI. |
| `McpClient` | Inferência iniciada através de um cliente MCP. |
| `ValidationApi` | Validação de teste agenteico. |

Trate a origem como contexto de roteamento e diagnóstico, não como um papel de autorização. Os consumidores devem tolerar valores de origem futuros.

### Metadados personalizados e segurança

Metadados de inferência personalizados são um mapa de chaves string para valores string. Eles vêm do `metadata` da requisição para conclusões de chat ou dos metadados de sessão para clientes de chat. O AIVAX copia essas entradas diretamente para `params._meta`: no exemplo, `tenant_id` e `request_id` são definidos pela aplicação, não campos integrados do AIVAX. Não há objeto `metadata` aninhado no envelope MCP. Sem metadados personalizados, permanecem apenas os campos AIVAX.

Não envie segredos em metadados personalizados: esses valores são encaminhados para o servidor de ferramentas remoto. Valide o acesso do locatário e do usuário contra seus próprios registros confiáveis antes de usar metadados para selecionar dados ou realizar gravações. Nem um ID de usuário externo, um token de conversa ou um rótulo de origem de chamada concede permissão por si só.

O nonce autentica a chave de hook da conta configurada; não é uma assinatura dos argumentos, um ID de requisição único ou um mecanismo de prevenção de replay. Mantenha HTTPS e os cabeçalhos de autenticação configurados no servidor MCP, e aplique sua própria autorização e controles de operação duplicada. Se seu servidor exigir autenticação por nonce, rejeite um nonce ausente ou inválido.

Para o envelope de callback HTTP equivalente, veja [contexto da função de protocolo](/docs/pt-br/tools/protocol-functions#context-fields).

## Resultados das ferramentas

Os resultados das ferramentas podem incluir blocos de conteúdo de texto, imagem e áudio. O texto é adicionado diretamente ao resultado da ferramenta. Blocos de imagem e áudio são anexados de volta à conversa como conteúdo multimodal com IDs gerados. Tipos de bloco de conteúdo não suportados são relatados como texto não suportado.

Quando uma ferramenta MCP não aparece para o modelo, verifique se o servidor remoto está acessível, se suporta HTTP transmissível, se os cabeçalhos de autenticação estão corretos e se o gateway está realmente configurado com a fonte MCP. Quando a ferramenta aparece mas não é chamada, revise o nome, a descrição e o esquema. Quando é chamada com argumentos incorretos, restrinja o JSON Schema e inclua descrições de propriedades. Quando a chamada falha, faça o servidor MCP retornar erros legíveis, pois o modelo precisa entender se deve tentar outro argumento, pedir informações ao usuário ou encerrar a ação.