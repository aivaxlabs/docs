---
{title: Suporte ao Protocolo de Contexto do Modelo (MCP),linkTitle: Funções MCP,weight: 20,group: Tools,sourceHash: 1c7728b5805c4b9f,aliases: [/docs/pt-br/tools/mcp.html]}
---

# Suporte para o Protocolo de Contexto do Modelo (MCP)

Você pode vincular ferramentas externas do protocolo MCP ao seu [AI Gateway](/docs/pt-br/inference/ai-gateways/concepts.md). O protocolo define ferramentas que são executadas no lado do servidor e permitem que o assistente interaja com serviços em tempo real.

O AIVAX atua como um cliente MCP para inferência no gateway: ele se conecta à fonte MCP configurada, lista as ferramentas, converte o esquema de cada ferramenta em uma função chamável pelo modelo e chama o servidor MCP remoto quando o modelo seleciona essa ferramenta.

<img src="/assets/diagrams/mcp-1.drawio.svg">

## Quando usar o MCP

Use o MCP quando você já tiver ferramentas externas que precisam ser descobertas e chamadas pelos modelos de maneira padronizada. Um servidor MCP é adequado para catálogos de ferramentas, integrações com sistemas internos, operações com estado, ferramentas compartilhadas entre vários agentes e ambientes onde você deseja manter a lógica fora do AIVAX.

Não use o MCP apenas para substituir uma única chamada HTTP simples. Quando você precisa expor uma função isolada com um callback específico e autenticação nonce, as [funções de protocolo](/docs/pt-br/tools/protocol-functions) geralmente são mais simples. Quando a capacidade já existe no AIVAX, como pesquisa na web, abertura de URLs, execução de código ou geração de imagens, as [ferramentas integradas](/docs/pt-br/tools/builtin-tools) geralmente são o caminho mais direto. O MCP é melhor quando há um conjunto de ferramentas com seus próprios esquemas, quando outro sistema já fala MCP ou quando você deseja que o mesmo servidor seja usado por diferentes clientes.

Em produção, trate o servidor MCP como uma API exposta a um agente. As descrições das ferramentas devem ser claras, os esquemas devem ser restritivos e a autenticação deve ser configurada nos cabeçalhos do servidor. O modelo não deve receber ferramentas muito genéricas como `execute`, `request` ou `search` sem descrições fortes e parâmetros controlados. Ferramentas ambíguas aumentam as chamadas incorretas; ferramentas específicas como `lookup_customer_by_email` ou `create_support_ticket` ajudam o modelo a decidir melhor.

Uma lista longa de ferramentas também tem um custo: cada ferramenta oferecida ao modelo adiciona seu nome, descrição e esquema a cada solicitação. Para medir essa sobrecarga e reduzi-la, consulte [como medir e reduzir tokens de definição de ferramentas](https://aivax.net/blog/reduce-mcp-tool-definition-tokens-too-many-tools/).

### Escolhendo o nome da função

O nome da função deve ser simples e determinístico sobre o que a função faz. Evite nomes difíceis de adivinhar ou que não sugiram o papel da função, pois o assistente pode ficar confuso e não chamar a função quando apropriado.

Como exemplo, vamos pensar em uma função que consulta um usuário em um banco de dados externo. Os seguintes nomes são bons exemplos a considerar para a chamada:

- `search_user`
- `query_user`

Nomes ruins incluem:

- `search` (implícito, possivelmente ambíguo)
- `search user` (nome com caracteres impróprios)

Tendo o nome da função, podemos pensar na descrição da função.

### Escolhendo a descrição da função

A descrição da função deve explicar conceitualmente duas situações: o que ela faz e quando o assistente deve chamá-la. Essa descrição deve incluir os cenários em que o assistente deve considerar chamá-la e quando não deve chamá-la, fornecendo alguns exemplos de chamada one-shot e/ou tornando as regras da função explícitas.

### Definindo servidores MCP

Você pode definir seus servidores MCP no gateway por meio de uma matriz JSON:

```json
[
    {
        "name": "Meu servidor MCP",
        "url": "https://example-server.io/mcp",
        "headers": {
            "Authorization": "<CHAVE_API_AIVAX>"
        }
    }
]
```

Seu servidor MCP deve suportar **HTTP Streamable** para funcionar com o AIVAX como uma fonte de ferramentas do gateway. Você pode definir cabeçalhos personalizados na configuração do seu servidor MCP para configurar autenticação ou outras necessidades. Ferramentas, instruções do servidor e descoberta de habilidades remotas são armazenadas em cache conforme `cacheDuration`; o padrão é 600 segundos.

Cada origem MCP aceita os seguintes campos:

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `name` | `string` | Obrigatório | Nome de exibição da origem, com pelo menos 3 caracteres. Ele identifica a origem nos nomes das ferramentas (consulte `prefixTools`), nas instruções do servidor e nas descrições de habilidades remotas. Alterá-lo cria uma nova entrada de cache de descoberta. |
| `url` | `string` | Obrigatório | URL absoluto HTTP ou HTTPS do ponto de extremidade Streamable HTTP do servidor MCP. |
| `description` | `string` | `null` | Nota opcional descrevendo o que a origem fornece. É apenas informativo: não é enviado ao modelo nem ao servidor MCP. |
| `headers` | `object` | `{}` | Mapa de nomes de cabeçalhos HTTP para valores de string enviados em toda conexão com o servidor, tanto durante a descoberta quanto em cada chamada de ferramenta. Use-o para autenticação, como `Authorization`. |
| `cacheDuration` | `integer` | `600` | Tempo, em segundos, que as ferramentas descobertas, as instruções do servidor e as habilidades remotas são reutilizadas antes que o AIVAX as liste novamente. Aceita valores de `0` a `86400`. As chamadas de ferramenta nunca são armazenadas em cache. |
| `prefixTools` | `boolean` | `true` | Quando `true`, cada ferramenta é exposta ao modelo como `mcp_<origem>_<ferramenta>`, onde `<origem>` é o `name` em letras minúsculas, com espaços substituídos por hífens e outros caracteres não alfanuméricos removidos. Por exemplo, a ferramenta `get_weather` de `Meu servidor MCP` torna-se `mcp_meu-servidor-mcp_get_weather`. Quando `false`, o nome original da ferramenta do servidor é usado; certifique-se de que não haja colisão com ferramentas de outras origens ou funções no mesmo gateway. O servidor sempre recebe seu nome original de ferramenta. |
| `allowClientInstructions` | `boolean` | `true` | Adiciona as instruções de uso anunciadas pelo servidor ao contexto do gateway. Consulte [instruções do servidor e habilidades remotas](#instruções-do-servidor-e-habilidades-remotas). |
| `allowRemoteSkills` | `boolean` | `true` | Importa habilidades remotas verificadas de servidores que anunciam a extensão de habilidades. Consulte [instruções do servidor e habilidades remotas](#instruções-do-servidor-e-habilidades-remotas). |

Se o seu servidor for direcionado ao MCP `2026-07-28`, consulte [como migrar um servidor MCP off Mcp-Session-Id](https://aivax.net/blog/mcp-stateless-core-moves-session-state-into-your-application/) para ver como ele interage com este gateway.

## Instruções do servidor e habilidades remotas

Cada origem MCP aceita `allowClientInstructions` e `allowRemoteSkills`, ambos habilitados por padrão. Defina qualquer uma dessas opções como `false` para excluir esse conteúdo. Conecte-se apenas a servidores cujo conteúdo você confia: as instruções do servidor são adicionadas ao contexto do gateway e as habilidades remotas ficam disponíveis por meio de `read_skill` junto com suas habilidades de conta.

O AIVAX solicita ferramentas apenas quando o servidor anuncia ferramentas. A descoberta de habilidades também requer a capacidade `resources` e a extensão `io.modelcontextprotocol/skills` nas capacidades do servidor retornadas durante a inicialização. O AIVAX segue a paginação de `skills/list` e lê cada `SKILL.md` listado do mesmo servidor. Habilidades remotas recebem identificadores qualificados por origem para não substituir habilidades de conta ou habilidades de mesmo nome de outra origem.

Esta é uma integração de compatibilidade limitada, não suporte completo para o protocolo base `2026-07-28` da extensão. O servidor deve aceitar o fluxo de inicialização Streamable HTTP existente e anunciar a extensão lá; servidores que exigem `server/discover` não são suportados por esta integração.

Apenas o `SKILL.md` raiz é importado. Seu comprimento em bytes, digest SHA-256 e frontmatter YAML devem corresponder à entrada anunciada; uma falha na correspondência falha na descoberta em vez de carregar conteúdo não verificado. Os manifestos são limitados a 512 recursos e 16 MiB de conteúdo total declarado por habilidade. Habilidades que anunciam `resources: "dynamic"` são ignoradas. Arquivos de suporte, navegação em diretórios, consulta direta `skills/get` e scripts não são importados. O frontmatter não concede permissões de ferramenta nem preenche as listas de ferramentas permitidas do gateway; as políticas de ferramenta existentes ainda se aplicam. Esta integração não adiciona um sistema de aprovação por habilidade nem uma nova sandbox de execução. Desative as habilidades remotas quando sua política exigir esses controles.

Antes de conectar um servidor de terceiros, revise a [lista de verificação de conexão MCP de terceiros](https://aivax.net/blog/mcp-is-a-trust-boundary-not-just-a-tool-catalog/).

As mesmas opções se aplicam às origens MCP adicionadas por trabalhadores do gateway. As habilidades de conta existentes permanecem disponíveis. Novas conexões buscam conteúdo de habilidade durante a descoberta, enquanto `read_skill` controla quando esse conteúdo entra no contexto de habilidade ativo do modelo.

## Metadados enviados com chamadas de ferramentas

Para cada solicitação `tools/call`, o AIVAX adiciona contexto de execução em `params._meta`, juntamente com `params.arguments`. Os argumentos contêm a entrada da ferramenta; os metadados identificam o contexto de chamada e carregam valores fornecidos pelo aplicativo. Esses campos descrevem solicitações de execução de ferramentas, não descoberta de ferramentas (`tools/list`).

O exemplo a seguir ilustra uma chamada com um usuário identificado, um token de conversa e metadados personalizados:

```json
{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
        "name": "get_weather",
        "arguments": {
            "location": "Nova York"
        },
        "_meta": {
            "_aiv_nonce": "<HASH_BCRYPT>",
            "_aiv_external_user_id": "<ID_USUARIO_EXTERNO>",
            "_aiv_call_source": "WebChatClient",
            "_aiv_conversation_token": "<TOKEN_CONVERSA>",
            "_aiv_moment": "2025-09-09T16:58:05.0000000+00:00",
            "tenant_id": "<ID_TENANT>",
            "request_id": "<ID_SOLICITACAO_APLICACAO>"
        }
    }
}
```

### Campos AIVAX

Todos os caminhos abaixo são relativos a `params._meta`. Nomes começando com `_aiv` são reservados; não os use para metadados personalizados.

| Campo | Tipo JSON | Significado e disponibilidade |
| --- | --- | --- |
| `_aiv_nonce` | `string` ou `null` | Hash BCrypt derivado da chave de hook da conta de chamada. Sem uma chave de hook configurada, seu valor é `null`. Verifique a chave de hook de texto plano configurada contra este hash, conforme descrito em [autenticação de hook](/docs/pt-br/authentication#hook-authentication); não compare strings de hash ou espere a própria chave de hook. |
| `_aiv_external_user_id` | `string` ou `null` | Identificador de usuário externo transportado pelo contexto de inferência. Para clientes de chat, vem da sessão; para conclusões de chat, vem do campo `user` da solicitação. Pode ser `null` quando nenhum usuário foi identificado. Use-o para procurar o usuário em seu aplicativo, não como um ID de conta AIVAX ou prova de autorização. |
| `_aiv_call_source` | `string` | Origem da inferência, não o transporte de ferramenta de saída. Uma ferramenta MCP chamada durante a inferência de bate-papo web ainda recebe `WebChatClient`, não `McpClient`. Consulte os valores abaixo. |
| `_aiv_conversation_token` | `string` ou `null` | Token de correlação de conversa transportado pela sessão ou solicitação de inferência. Para conclusões de chat, é o `conversation_token` da solicitação, ou o token gerado pelo AIVAX quando nenhum foi enviado. Pode ser `null`; não é uma credencial de autenticação nem um ID exclusivo de chamada de ferramenta. Múltiplas chamadas na mesma conversa podem compartilhá-lo. |
| `_aiv_moment` | `string` | Carimbo de data/hora criado quando o AIVAX prepara esta chamada de ferramenta, no formato de viagem de ida e volta ISO 8601 com segundos fracionários e deslocamento UTC. Usa o relógio local do servidor AIVAX, não o fuso horário do usuário ou o início da conversa. Analise o deslocamento e converta para o fuso horário do seu aplicativo quando necessário. |

### Valores de origem de chamada

Os mesmos valores de string são usados por funções de protocolo em `context.callSource`:

| Valor | Origem da inferência |
| --- | --- |
| `WebChatClient` | Cliente de bate-papo web AIVAX. |
| `ChatCompletionsApi` | API de conclusões de chat compatível com OpenAI; a origem padrão para essa API. |
| `FunctionsApi` | API de Funções. |
| `IntegrationBot` | Bot de integração de mensagens. |
| `OpenWebUiClient` | Cliente Open WebUI. |
| `McpClient` | Inferência iniciada por meio de um cliente MCP. |
| `ValidationApi` | Validação de teste agêntico. |

Trate a origem como contexto de roteamento e diagnóstico, não como uma função de autorização. Os consumidores devem tolerar valores de origem futuros.

### Metadados personalizados e segurança

Os metadados de inferência personalizados são um mapa de chaves de string para valores de string. Eles vêm dos `metadata` da solicitação para conclusões de chat ou dos metadados da sessão para clientes de chat. O AIVAX copia essas entradas diretamente em `params._meta`: no exemplo, `tenant_id` e `request_id` são definidos pelo aplicativo, não são campos integrados do AIVAX. Não há objeto `metadata` aninhado no envelope MCP. Sem metadados personalizados, apenas os campos AIVAX permanecem.

Não envie segredos nos metadados personalizados: esses valores são encaminhados para o servidor de ferramenta remoto. Valide o acesso do tenant e do usuário contra seus próprios registros confiáveis antes de usar metadados para selecionar dados ou realizar gravações. Nem um ID de usuário externo, um token de conversa nem um rótulo de origem de chamada concedem permissão por si só.

O nonce autentica a chave de hook da conta configurada; não é uma assinatura dos argumentos, um ID de solicitação único ou um mecanismo de prevenção de replay. Mantenha o HTTPS e os cabeçalhos de autenticação configurados do servidor MCP e aplique seus próprios controles de autorização e operação duplicada. Se o seu servidor exigir autenticação nonce, rejeite um nonce ausente ou inválido.

Para o envelope de callback HTTP equivalente, consulte [contexto de função de protocolo](/docs/pt-br/tools/protocol-functions#context-fields).

## Resultados de ferramentas

Os resultados das ferramentas podem incluir blocos de conteúdo de texto, imagem e áudio. O texto é adicionado diretamente ao resultado da ferramenta. Blocos de imagem e áudio são anexados de volta à conversa como conteúdo multimodal com IDs gerados. Tipos de blocos de conteúdo não suportados são relatados como texto não suportado.

Se algo der errado, verifique o sintoma:

- **A ferramenta não aparece para o modelo:** verifique se o servidor remoto está acessível, suporta Streamable HTTP, possui os cabeçalhos de autenticação corretos e está configurado como uma origem MCP no gateway.
- **A ferramenta aparece, mas não é chamada:** revise o nome, a descrição e o esquema.
- **A ferramenta é chamada com argumentos ruins:** restrinja o JSON Schema e inclua descrições de propriedades.
- **A chamada falha:** faça com que o servidor MCP retorne erros legíveis para que o modelo possa decidir se tenta outro argumento, pergunta ao usuário por informações ou interrompe a ação.
