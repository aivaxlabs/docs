Source: https://docs.aivax.net/pt-br/docs/tools/mcp.html

# Suporte ao Protocolo de Contexto de Modelo (MCP)

Você pode conectar ferramentas externas do protocolo MCP ao seu [gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md). O protocolo define ferramentas que são executadas no lado do servidor e permitem que o assistente interaja com serviços em tempo real.

AIVAX funciona como um cliente MCP para inferência via gateway: ele se conecta à fonte MCP configurada, lista as ferramentas, converte cada esquema de ferramenta em uma função chamável pelo modelo e chama o servidor MCP remoto quando o modelo seleciona essa ferramenta.

<img src="/assets/diagrams/mcp-1.drawio.svg">

## Quando usar MCP

Use MCP quando você já tem ferramentas externas que precisam ser descobertas e chamadas pelos modelos de forma padronizada. Um servidor MCP é adequado para catálogos de ferramentas, integrações com sistemas internos, operações com estado, ferramentas compartilhadas entre vários agentes e ambientes onde você deseja manter a lógica fora do AIVAX.

Não use MCP apenas para substituir uma única chamada HTTP simples. Quando precisar expor uma função isolada com um callback específico e autenticação por nonce, [protocol functions](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) costumam ser mais simples. Quando a capacidade já existe no AIVAX, como busca na web, abertura de URL, execução de código ou geração de imagens, [built‑in tools](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) costumam ser o caminho mais direto. MCP é melhor quando há um conjunto de ferramentas com seus próprios esquemas, quando outro sistema já fala MCP ou quando você deseja que o mesmo servidor seja usado por diferentes clientes.

Em produção, trate o servidor MCP como uma API exposta a um agente. As descrições das ferramentas devem ser claras, os esquemas devem ser restritivos e a autenticação deve ser configurada nos cabeçalhos do servidor. O modelo não deve receber ferramentas genéricas demais, como `execute`, `request` ou `search`, sem descrições fortes e parâmetros controlados. Ferramentas ambíguas aumentam chamadas erradas; ferramentas específicas como `lookup_customer_by_email` ou `create_support_ticket` ajudam o modelo a decidir melhor.

Uma lista longa de ferramentas também tem um custo: cada ferramenta oferecida ao modelo adiciona seu nome, descrição e esquema a cada requisição. Para medir esse overhead e reduzi‑lo, veja [how to measure and cut tool-definition tokens](https://aivax.net/blog/reduce-mcp-tool-definition-tokens-too-many-tools/).

### Escolhendo o nome da função

O nome da função deve ser simples e determinístico sobre o que a função faz. Evite nomes difíceis de adivinhar ou que não indiquem o papel da função, pois o assistente pode ficar confuso e não chamar a função quando necessário.

Como exemplo, vamos pensar em uma função que consulta um usuário em um banco de dados externo. Os nomes a seguir são bons exemplos a considerar para a chamada:

- `search_user`
- `query_user`

Nomes ruins incluem:

- `search` (implícito, possivelmente ambíguo)
- `search user` (nome com caracteres inadequados)

Tendo o nome da função, podemos pensar na descrição da função.

### Escolhendo a descrição da função

A descrição da função deve explicar conceitualmente duas situações: o que ela faz e quando o assistente deve chamá‑la. Essa descrição deve incluir os cenários que o assistente deve considerar para chamá‑la e quando não deve ser chamada, fornecendo alguns exemplos de chamada única e/ou tornando as regras da função explícitas.

### Definindo servidores MCP

Você pode definir seus servidores MCP no gateway através de um array JSON:

```json
[
    {
        "name": "My MCP server",
        "url": "https://example-server.io/mcp",
        "headers": {
            "Authorization": "<AIVAX_API_KEY>"
        }
    }
]
```

Seu servidor MCP deve suportar **Streamable HTTP** para funcionar com o AIVAX como fonte de ferramentas do gateway. Você pode definir cabeçalhos personalizados na configuração do seu servidor MCP para configurar autenticação ou outras necessidades. Ferramentas, instruções do servidor e descoberta de habilidades remotas são armazenadas em cache de acordo com `cacheDuration`; o padrão é 600 segundos.

Cada fonte MCP aceita os seguintes campos:

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `name` | `string` | Required | Nome exibido da fonte, com pelo menos 3 caracteres. Identifica a fonte nos nomes das ferramentas (veja `prefixTools`), instruções do servidor e descrições de habilidades remotas. Alterá‑lo cria uma nova entrada de cache de descoberta. |
| `url` | `string` | Required | URL HTTP ou HTTPS absoluta do endpoint Streamable HTTP do servidor MCP. |
| `description` | `string` | `null` | Nota opcional descrevendo o que a fonte fornece. É apenas informativa: não é enviada ao modelo nem ao servidor MCP. |
| `headers` | `object` | `{}` | Mapa de nomes de cabeçalhos HTTP para valores de string enviados em toda conexão ao servidor, tanto durante a descoberta quanto em cada chamada de ferramenta. Use para autenticação, como `Authorization`. |
| `cacheDuration` | `integer` | `600` | Tempo, em segundos, que ferramentas descobertas, instruções do servidor e habilidades remotas são reutilizadas antes que o AIVAX as liste novamente. Aceita valores de `0` a `86400`. Chamadas de ferramenta nunca são armazenadas em cache. |
| `prefixTools` | `boolean` | `true` | Quando `true`, cada ferramenta é exposta ao modelo como `mcp_<source>_<tool>`, onde `<source>` é o `name` em minúsculas com espaços substituídos por hífens e outros caracteres não alfanuméricos removidos. Por exemplo, a ferramenta `get_weather` de `My MCP server` torna‑se `mcp_my-mcp-server_get_weather`. Quando `false`, o nome original da ferramenta do servidor é usado; certifique‑se de que não colida com ferramentas de outras fontes ou funções no mesmo gateway. O servidor sempre recebe seu nome original de ferramenta. |
| `allowClientInstructions` | `boolean` | `true` | Adiciona as instruções de uso anunciadas pelo servidor ao contexto do gateway. Veja [server instructions and remote skills](#server-instructions-and-remote-skills). |
| `allowRemoteSkills` | `boolean` | `true` | Importa habilidades remotas verificadas de servidores que anunciam a extensão de habilidades. Veja [server instructions and remote skills](#server-instructions-and-remote-skills). |

Se o seu servidor tem como alvo o MCP `2026-07-28`, veja [how to migrate an MCP server off Mcp-Session-Id](https://aivax.net/blog/mcp-stateless-core-moves-session-state-into-your-application/) para saber como ele interage com este gateway.

## Instruções do servidor e habilidades remotas

Cada fonte MCP aceita `allowClientInstructions` e `allowRemoteSkills`, ambas habilitadas por padrão. Defina qualquer uma das opções como `false` para excluir aquele conteúdo. Conecte apenas servidores cujo conteúdo você confia: instruções do servidor são adicionadas ao contexto do gateway, e habilidades remotas ficam disponíveis através de `read_skill` junto com as habilidades da sua conta.

AIVAX solicita ferramentas somente quando o servidor anuncia ferramentas. A descoberta de habilidades requer adicionalmente a capacidade `resources` e a extensão `io.modelcontextprotocol/skills` nas capacidades do servidor retornadas durante a inicialização. AIVAX segue a paginação `skills/list` e lê cada `SKILL.md` listado do mesmo servidor. Habilidades remotas recebem identificadores qualificados por origem para que não substituam habilidades da conta ou habilidades com o mesmo nome de outra fonte.

Esta é uma integração de compatibilidade limitada, não suporte completo para o protocolo base `2026-07-28` da extensão. O servidor deve aceitar o fluxo de inicialização Streamable HTTP existente e anunciar a extensão lá; servidores que exigem `server/discover` não são suportados por esta integração.

Apenas o `SKILL.md` raiz é importado. Seu comprimento em bytes, digest SHA‑256 e frontmatter YAML devem corresponder à entrada anunciada; uma incompatibilidade falha a descoberta em vez de carregar conteúdo não verificado. Manifests são limitados a 512 recursos e 16 MiB de conteúdo declarado total por habilidade. Habilidades que anunciam `resources: "dynamic"` são ignoradas. Arquivos de suporte, navegação de diretórios, lookup direto `skills/get` e scripts não são importados. Frontmatter não concede permissões de ferramenta nem preenche as listas de ferramentas permitidas do gateway; políticas de ferramenta existentes ainda se aplicam. Esta integração não adiciona um sistema de aprovação por habilidade nem um novo sandbox de execução. Desative habilidades remotas quando sua política exigir esses controles.

Antes de conectar um servidor de terceiros, revise o [third-party MCP connection checklist](https://aivax.net/blog/mcp-is-a-trust-boundary-not-just-a-tool-catalog/).

As mesmas opções se aplicam a fontes MCP adicionadas por workers do gateway. Habilidades de conta existentes permanecem disponíveis. Novas conexões buscam o conteúdo da habilidade durante a descoberta, enquanto `read_skill` controla quando esse conteúdo entra no contexto de habilidade ativo do modelo.

## Metadados enviados com chamadas de ferramenta

Para cada requisição `tools/call`, o AIVAX adiciona contexto de execução em `params._meta`, ao lado de `params.arguments`. Argumentos contêm a entrada da ferramenta; metadados identificam o contexto de chamada e carregam valores fornecidos pela aplicação. Esses campos descrevem solicitações de execução de ferramenta, não descoberta de ferramenta (`tools/list`).

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
| `_aiv_nonce` | `string` ou `null` | Hash BCrypt derivado da chave de hook da conta que está chamando. Sem uma chave de hook configurada, seu valor é `null`. Verifique a chave de hook em texto plano configurada contra esse hash conforme descrito em [hook authentication](https://docs.aivax.net/pt-br/docs/authentication.md#hook-authentication); não compare strings de hash nem espere a própria chave de hook. |
| `_aiv_external_user_id` | `string` ou `null` | Identificador externo do usuário transportado pelo contexto de inferência. Para clientes de chat vem da sessão; para completions de chat vem do campo `user` da requisição. Pode ser `null` quando nenhum usuário foi identificado. Use para buscar o usuário na sua aplicação, não como ID de conta AIVAX ou prova de autorização. |
| `_aiv_call_source` | `string` | Origem da inferência, não do transporte da ferramenta. Uma ferramenta MCP chamada durante inferência de chat web ainda recebe `WebChatClient`, não `McpClient`. Veja os valores abaixo. |
| `_aiv_conversation_token` | `string` ou `null` | Token de correlação de conversa transportado pela sessão ou requisição de inferência. Para completions de chat, vem de `idempotency_key` quando fornecido. Pode ser `null`; não é credencial de autenticação nem ID de chamada de ferramenta único. Várias chamadas na mesma conversa podem compartilhá‑lo. |
| `_aiv_moment` | `string` | Timestamp criado quando o AIVAX prepara esta chamada de ferramenta, no formato ISO 8601 round‑trip com frações de segundo e deslocamento UTC. Usa o relógio local do servidor AIVAX, não o fuso horário do usuário ou o horário de início da conversa. Analise o deslocamento e converta para o fuso horário da sua aplicação quando necessário. |

### Valores de origem da chamada

Os mesmos valores de string são usados por funções de protocolo em `context.callSource`:

| Valor | Origem da inferência |
| --- | --- |
| `WebChatClient` | Cliente de chat web do AIVAX. |
| `ChatCompletionsApi` | API de completions de chat compatível com OpenAI; origem padrão para essa API. |
| `FunctionsApi` | API de funções. |
| `IntegrationBot` | Bot de integração de mensagens. |
| `OpenWebUiClient` | Cliente Open WebUI. |
| `McpClient` | Inferência iniciada por um cliente MCP. |
| `ValidationApi` | Validação de teste agenteico. |

Trate a origem como contexto de roteamento e diagnóstico, não como papel de autorização. Consumidores devem tolerar valores de origem futuros.

### Metadados personalizados e segurança

Metadados de inferência personalizados são um mapa de chaves string para valores string. Eles vêm de `metadata` da requisição para completions de chat ou metadados de sessão para clientes de chat. O AIVAX copia essas entradas diretamente para `params._meta`: no exemplo, `tenant_id` e `request_id` são definidos pela aplicação, não campos internos do AIVAX. Não há objeto `metadata` aninhado no envelope MCP. Sem metadados personalizados, permanecem apenas os campos AIVAX.

Não envie segredos em metadados personalizados: esses valores são encaminhados ao servidor de ferramenta remoto. Valide o acesso de tenant e usuário contra seus próprios registros confiáveis antes de usar metadados para selecionar dados ou executar gravações. Nem um ID de usuário externo, um token de conversa ou um rótulo de origem de chamada concedem permissão por si só.

O nonce autentica a chave de hook da conta configurada; não é uma assinatura dos argumentos, um ID de requisição único ou um mecanismo de prevenção de replay. Mantenha HTTPS e os cabeçalhos de autenticação configurados no servidor MCP, e aplique sua própria autorização e controles de duplicação de operação. Se seu servidor exigir autenticação por nonce, rejeite um nonce ausente ou inválido.

Para o envelope de callback HTTP equivalente, veja [protocol function context](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md#context-fields).

## Resultados da ferramenta

Resultados da ferramenta podem incluir blocos de conteúdo de texto, imagem e áudio. Texto é adicionado diretamente ao resultado da ferramenta. Blocos de imagem e áudio são anexados de volta à conversa como conteúdo multimodal com IDs gerados. Tipos de bloco de conteúdo não suportados são relatados como texto não suportado.

Se algo der errado, verifique o sintoma:

- **A ferramenta não aparece para o modelo:** verifique se o servidor remoto está acessível, suporta Streamable HTTP, tem os cabeçalhos de autenticação corretos e está configurado como uma fonte MCP no gateway.
- **A ferramenta aparece mas não é chamada:** revise o nome, a descrição e o esquema.
- **A ferramenta é chamada com argumentos incorretos:** restrinja o JSON Schema e inclua descrições de propriedades.
- **A chamada falha:** faça o servidor MCP retornar erros legíveis para que o modelo possa decidir se tenta outro argumento, pede informações ao usuário ou interrompe a ação.
