---
{title: Suporte para o Protocolo de Contexto do Modelo (MCP),linkTitle: Funções MCP,weight: 20,group: Tools,sourceHash: b763c880d3a3213e,aliases: [/docs/pt-br/tools/mcp.html]}
---

# Suporte ao Protocolo de Contexto do Modelo (MCP)

O MCP vincula ferramentas externas a um [Gateway de IA](/docs/pt-br/inference/ai-gateways/concepts.md). Utilize-o quando o assistente precisar chamar serviços em tempo real por meio de um protocolo de ferramenta padrão.

O protocolo define ferramentas que são executadas no lado do servidor e permitem que o assistente interaja com serviços em tempo real.

A AIVAX atua como cliente MCP para inferência de gateway. Para cada fonte configurada, ela:

1. Conecta-se ao servidor MCP.
2. Lista as ferramentas.
3. Converte o esquema de cada ferramenta em uma função acionável pelo modelo.
4. Chama o servidor MCP remoto quando o modelo seleciona essa ferramenta.

<img src="/assets/diagrams/mcp-1.drawio.svg">

## Quando usar o MCP

Use o MCP quando você já tiver ferramentas externas que precisam ser descobertas e chamadas pelos modelos de maneira padronizada. Um servidor MCP se encaixa em:

- Catálogos de ferramentas.
- Integrações com sistemas internos.
- Operações com estado.
- Ferramentas compartilhadas entre vários agentes.
- Ambientes onde você deseja manter a lógica fora da AIVAX.

Não use o MCP apenas para substituir uma única chamada HTTP simples.

- Use [funções de protocolo](/docs/pt-br/tools/protocol-functions) quando precisar de uma função isolada com um callback específico e autenticação nonce. Elas geralmente são mais simples.
- Use [ferramentas integradas](/docs/pt-br/tools/builtin-tools) quando a capacidade já existir na AIVAX, como pesquisa na web, abertura de URLs, execução de código ou geração de imagens. Elas geralmente são o caminho mais direto.
- Use o MCP quando houver um conjunto de ferramentas com seus próprios esquemas, quando outro sistema já falar MCP ou quando você quiser que o mesmo servidor seja usado por diferentes clientes.

Em produção, trate o servidor MCP como uma API exposta a um agente:

- Escreva descrições claras das ferramentas.
- Mantenha os esquemas restritivos.
- Configure autenticação nos cabeçalhos do servidor.
- Não ofereça ferramentas excessivamente genéricas como `execute`, `request` ou `search` sem descrições fortes e parâmetros controlados.

Ferramentas ambíguas aumentam as chamadas incorretas. Ferramentas específicas como `lookup_customer_by_email` ou `create_support_ticket` ajudam o modelo a decidir melhor.

Uma lista longa de ferramentas também tem um custo: cada ferramenta oferecida ao modelo adiciona seu nome, descrição e esquema a cada solicitação. Para medir essa sobrecarga e reduzi-la, consulte [como medir e cortar tokens de definição de ferramentas](https://aivax.net/blog/reduce-mcp-tool-definition-tokens-too-many-tools/).

### Escolhendo o nome da função

Use um nome que indique a ação. Mantenha-o simples e determinístico. Evite nomes difíceis de adivinhar ou que não sugiram o papel da função. Caso contrário, o assistente pode não chamar a função quando deveria.

Para uma função que consulta um usuário em um banco de dados externo, prefira:

- `search_user`
- `query_user`

Evite:

- `search` (implícito, possivelmente ambíguo)
- `search user` (nome com caracteres impróprios)

Após definir o nome, escreva a descrição.

### Escolhendo a descrição da função

Use a descrição para informar ao assistente o que a função faz e quando chamá-la.

Inclua:

- Cenários em que o assistente deve chamá-la.
- Cenários em que ele não deve chamá-la.
- Alguns exemplos de chamada única ou regras explícitas de função.

### Definindo servidores MCP

Defina servidores MCP no gateway quando o assistente dever descobrir e chamar as ferramentas desse servidor. Envie uma matriz JSON:

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

Seu servidor MCP deve suportar **HTTP Streamable** para funcionar com a AIVAX como fonte de ferramenta de gateway. Você pode definir cabeçalhos personalizados na configuração do seu servidor MCP para configurar autenticação ou outras necessidades. Ferramentas, instruções do servidor e descoberta de habilidades remotas são armazenadas em cache conforme `cacheDuration`; o padrão é 600 segundos.

Cada origem MCP aceita os seguintes campos. Use-os para nomear a origem, autenticar a conexão e controlar o que o modelo vê:

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `name` | `string` | Obrigatório | Nome de exibição da origem, com pelo menos 3 caracteres. Ele identifica a origem nos nomes das ferramentas (consulte `prefixTools`), nas instruções do servidor e nas descrições de habilidades remotas. Alterá-lo cria uma nova entrada de cache de descoberta. |
| `url` | `string` | Obrigatório | URL absoluto HTTP ou HTTPS do ponto de extremidade Streamable HTTP do servidor MCP. |
| `description` | `string` | `null` | Nota opcional descrevendo o que a origem fornece. É apenas informativa: não é enviada ao modelo nem ao servidor MCP. |
| `headers` | `object` | `{}` | Mapa de nomes de cabeçalhos HTTP para valores de string enviados em cada conexão com o servidor, tanto durante a descoberta quanto em cada chamada de ferramenta. Use-o para autenticação, como `Authorization`. |
| `cacheDuration` | `integer` | `600` | Tempo, em segundos, no qual as ferramentas descobertas, as instruções do servidor e as habilidades remotas são reutilizadas antes que a AIVAX as liste novamente. Aceita valores de `0` a `86400`. As chamadas de ferramenta nunca são armazenadas em cache. |
| `prefixTools` | `boolean` | `true` | Quando `true`, cada ferramenta é exposta ao modelo como `mcp_<origem>_<ferramenta>`, onde `<origem>` é o `name` em letras minúsculas, com espaços substituídos por hífens e outros caracteres não alfanuméricos removidos. Por exemplo, a ferramenta `get_weather` do `Meu servidor MCP` torna-se `mcp_meu-servidor-mcp_get_weather`. Quando `false`, o nome original da ferramenta do servidor é usado; certifique-se de que não haja colisão com ferramentas de outras origens ou funções no mesmo gateway. O servidor sempre recebe seu nome original de ferramenta. |
| `allowClientInstructions` | `boolean` | `true` | Adiciona as instruções de uso anunciadas pelo servidor ao contexto do gateway. Consulte [instruções do servidor e habilidades remotas](#instruções-do-servidor-e-habilidades-remotas). |
| `allowRemoteSkills` | `boolean` | `true` | Importa habilidades remotas verificadas de servidores que anunciam a extensão de habilidades. Consulte [instruções do servidor e habilidades remotas](#instruções-do-servidor-e-habilidades-remotas). |

Se seu servidor for direcionado ao MCP `2026-07-28`, consulte [como migrar um servidor MCP off Mcp-Session-Id](https://aivax.net/blog/mcp-stateless-core-moves-session-state-into-your-application/) para ver como ele interage com este gateway.

## Instruções do servidor e habilidades remotas

Use essas opções quando um servidor MCP confiável dever adicionar instruções ou habilidades ao gateway. Cada origem MCP aceita `allowClientInstructions` e `allowRemoteSkills`. Ambas estão habilitadas por padrão. Defina qualquer opção como `false` para excluir esse conteúdo.

Conecte-se apenas a servidores cujo conteúdo você confia:

- As instruções do servidor são adicionadas ao contexto do gateway.
- As habilidades remotas ficam disponíveis por meio de `read_skill` junto com as habilidades da sua conta.

Como funciona a descoberta:

1. A AIVAX solicita ferramentas apenas quando o servidor anuncia ferramentas.
2. A descoberta de habilidades também requer a capacidade `resources` e a extensão `io.modelcontextprotocol/skills` nas capacidades do servidor retornadas durante a inicialização.
3. A AIVAX segue a paginação de `skills/list` e lê cada `SKILL.md` listado do mesmo servidor.
4. As habilidades remotas recebem identificadores qualificados por origem para não substituir habilidades da conta ou habilidades de mesmo nome de outra origem.

Esta é uma integração de compatibilidade limitada, não suporte completo ao protocolo base `2026-07-28` da extensão.

- O servidor deve aceitar o fluxo de inicialização HTTP Streamable existente e anunciar a extensão nele.
- Servidores que exigem `server/discover` não são suportados por esta integração.

Apenas o `SKILL.md` raiz é importado. Seu comprimento em bytes, digest SHA-256 e frontmatter YAML devem corresponder à entrada anunciada. Uma falha na correspondência interrompe a descoberta em vez de carregar conteúdo não verificado.

Limites e exclusões de importação:

- Os manifestos são limitados a 512 recursos e 16 MiB de conteúdo total declarado por habilidade.
- Habilidades que anunciam `resources: "dynamic"` são ignoradas.
- Arquivos de suporte, navegação por diretório, busca direta `skills/get` e scripts não são importados.
- O frontmatter não concede permissões de ferramenta nem popula as listas de ferramentas permitidas do gateway. As políticas de ferramenta existentes ainda se aplicam.
- Esta integração não adiciona um sistema de aprovação por habilidade nem uma nova sandbox de execução. Desative as habilidades remotas quando sua política exigir esses controles.

Antes de conectar um servidor de terceiros, revise a [lista de verificação de conexão MCP de terceiros](https://aivax.net/blog/mcp-is-a-trust-boundary-not-just-a-tool-catalog/).

As mesmas opções se aplicam às origens MCP adicionadas por trabalhadores do gateway. As habilidades da conta existentes permanecem disponíveis. Novas conexões buscam conteúdo de habilidade durante a descoberta, enquanto `read_skill` controla quando esse conteúdo entra no contexto de habilidade ativo do modelo.

## Metadados enviados com chamadas de ferramenta

Use esta seção quando seu servidor MCP precisar identificar o contexto de chamada ou receber valores de aplicativo com a chamada.

Para cada solicitação `tools/call`, a AIVAX adiciona o contexto de execução em `params._meta`, juntamente com `params.arguments`.

- Os argumentos contêm a entrada da ferramenta.
- Os metadados identificam o contexto de chamada e carregam valores fornecidos pelo aplicativo.
- Esses campos descrevem solicitações de execução de ferramenta, não a descoberta de ferramentas (`tools/list`).

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
            "_aiv_conversation_token": "<TOKEN_DE_CONVERSA>",
            "_aiv_moment": "2025-09-09T16:58:05.0000000+00:00",
            "tenant_id": "<ID_INQUILINO>",
            "request_id": "<ID_SOLICITACAO_DO_APLICATIVO>"
        }
    }
}
```

### Campos da AIVAX

Estes campos identificam o contexto de chamada. Todos os caminhos abaixo são relativos a `params._meta`. Nomes começando com `_aiv` são reservados; não os use para metadados personalizados.

| Campo | Tipo JSON | Significado e disponibilidade |
| --- | --- | --- |
| `_aiv_nonce` | `string` ou `null` | Hash BCrypt derivado da chave de gancho da conta de chamada. Sem uma chave de gancho configurada, seu valor é `null`. Verifique a chave de gancho em texto claro configurada contra este hash, conforme descrito em [autenticação de gancho](/docs/pt-br/authentication#hook-authentication); não compare strings de hash nem espere a própria chave de gancho. |
| `_aiv_external_user_id` | `string` ou `null` | Identificador de usuário externo carregado pelo contexto de inferência. Para clientes de chat, vem da sessão; para conclusões de chat, vem do campo `user` da solicitação. Pode ser `null` quando nenhum usuário foi identificado. Use-o para procurar o usuário em seu aplicativo, não como ID de conta AIVAX ou prova de autorização. |
| `_aiv_call_source` | `string` | Origem da inferência, não o transporte de ferramenta de saída. Uma ferramenta MCP chamada durante a inferência de bate-papo na web ainda recebe `WebChatClient`, não `McpClient`. Consulte os valores abaixo. |
| `_aiv_conversation_token` | `string` ou `null` | Token de correlação de conversa carregado pela sessão ou solicitação de inferência. Para conclusões de chat, é o `conversation_token` da solicitação, ou o token gerado pela AIVAX quando nenhum foi enviado. Pode ser `null`; não é uma credencial de autenticação nem um ID de chamada de ferramenta exclusivo. Múltiplas chamadas na mesma conversa podem compartilhá-lo. |
| `_aiv_moment` | `string` | Carimbo de data/hora criado quando a AIVAX prepara esta chamada de ferramenta, no formato de ida e volta ISO 8601 com frações de segundo e deslocamento UTC. Usa o relógio local do servidor AIVAX, não o fuso horário do usuário ou o horário de início da conversa. Analise o deslocamento e converta para o fuso horário do seu aplicativo quando necessário. |

### Valores de origem de chamada

Use a origem para rotear e diagnosticar a chamada, não para autorizar. Os mesmos valores de string são usados por funções de protocolo em `context.callSource`:

| Valor | Origem da inferência |
| --- | --- |
| `WebChatClient` | Cliente de bate-papo na web da AIVAX. |
| `ChatCompletionsApi` | API de conclusões de chat compatível com OpenAI; a origem padrão para essa API. |
| `FunctionsApi` | API de funções. |
| `IntegrationBot` | Bot de integração de mensagens. |
| `OpenWebUiClient` | Cliente Open WebUI. |
| `McpClient` | Inferência iniciada por meio de um cliente MCP. |
| `ValidationApi` | Validação de teste agêntico. |

Os consumidores devem tolerar futuros valores de origem.

### Metadados personalizados e segurança

Os metadados de inferência personalizados são um mapa de chaves de string para valores de string. Vêm dos `metadata` da solicitação para conclusões de chat ou dos metadados da sessão para clientes de chat.

A AIVAX copia essas entradas diretamente em `params._meta`. No exemplo, `tenant_id` e `request_id` são definidos pelo aplicativo, não são campos internos da AIVAX. Não há objeto `metadata` aninhado no envelope MCP. Sem metadados personalizados, apenas os campos da AIVAX permanecem.

Antes de confiar nos metadados:

- Não envie segredos nos metadados personalizados. Esses valores são encaminhados para o servidor de ferramenta remoto.
- Valide o acesso do inquilino e do usuário contra seus próprios registros confiáveis antes de usar metadados para selecionar dados ou realizar gravações.
- Não trate um ID de usuário externo, um token de conversa ou um rótulo de origem de chamada como permissão por si só.
- Trate o nonce como prova apenas da chave de gancho da conta configurada. Não é uma assinatura dos argumentos, um ID de solicitação único ou um mecanismo de prevenção de replay.
- Mantenha o HTTPS e os cabeçalhos de autenticação configurados do servidor MCP.
- Aplique seus próprios controles de autorização e de operações duplicadas.
- Se seu servidor exigir autenticação nonce, rejeite um nonce ausente ou inválido.

Para o envelope de callback HTTP equivalente, consulte [contexto de função de protocolo](/docs/pt-br/tools/protocol-functions#context-fields).

## Resultados de ferramentas

Um resultado de ferramenta é o que o servidor MCP retorna após uma chamada. A AIVAX adiciona blocos suportados de volta à conversa para que o modelo possa continuar.

- O texto é adicionado diretamente ao resultado da ferramenta.
- Blocos de imagem e áudio são anexados de volta à conversa como conteúdo multimodal com IDs gerados.
- Tipos de bloco de conteúdo não suportados são relatados como texto não suportado.

Se algo der errado, verifique o sintoma:

- **A ferramenta não aparece para o modelo:** verifique se o servidor remoto está acessível, suporta HTTP Streamable, possui os cabeçalhos de autenticação corretos e está configurado como uma origem MCP no gateway.
- **A ferramenta aparece, mas não é chamada:** revise o nome, a descrição e o esquema.
- **A ferramenta é chamada com argumentos ruins:** restrinja o JSON Schema e inclua descrições de propriedades.
- **A chamada falha:** faça o servidor MCP retornar erros legíveis para que o modelo possa decidir se tenta outro argumento, pede informações ao usuário ou interrompe a ação.
