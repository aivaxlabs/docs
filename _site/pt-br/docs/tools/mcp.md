Source: https://docs.aivax.net/pt-br/docs/tools/mcp.html

# Suporte ao Protocolo de Contexto do Modelo (MCP)

O MCP vincula ferramentas externas a um [Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md). Use-o quando o assistente precisar chamar serviços em tempo real por meio de um protocolo de ferramenta padrão.

O protocolo define ferramentas que são executadas no lado do servidor e permitem que o assistente interaja com serviços em tempo real.

O AIVAX atua como cliente MCP para inferência no gateway. Para cada fonte configurada, ele:

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
- Ambientes onde você deseja manter a lógica fora do AIVAX.

Não use o MCP apenas para substituir uma única chamada HTTP simples.

- Use [funções de protocolo](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) quando precisar de uma função isolada com um callback específico e autenticação nonce. Elas geralmente são mais simples.
- Use [ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) quando a capacidade já existir no AIVAX, como pesquisa na web, abertura de URL, execução de código ou geração de imagens. Elas geralmente são o caminho mais direto.
- Use o MCP quando houver um conjunto de ferramentas com seus próprios esquemas, quando outro sistema já usa o MCP ou quando você deseja que o mesmo servidor seja usado por diferentes clientes.

Em produção, trate o servidor MCP como uma API exposta a um agente:

- Escreva descrições claras das ferramentas.
- Mantenha os esquemas restritivos.
- Configure a autenticação nos cabeçalhos do servidor.
- Não ofereça ferramentas excessivamente genéricas como `execute`, `request` ou `search` sem descrições robustas e parâmetros controlados.

Ferramentas ambíguas aumentam as chamadas incorretas. Ferramentas específicas como `lookup_customer_by_email` ou `create_support_ticket` ajudam o modelo a decidir melhor.

Uma lista longa de ferramentas também tem um custo: cada ferramenta oferecida ao modelo adiciona seu nome, descrição e esquema a cada solicitação. Para medir esse overhead e reduzi-lo, consulte [como medir e reduzir tokens de definição de ferramentas](https://aivax.net/blog/reduce-mcp-tool-definition-tokens-too-many-tools/).

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
- Cenários em que ela não deve ser chamada.
- Alguns exemplos de chamada única ou regras explícitas da função.

### Definindo servidores MCP

Defina servidores MCP no gateway quando o assistente precisar descobrir e chamar as ferramentas desse servidor. Envie uma matriz JSON:

```json
[
    {
        "name": "Meu servidor MCP",
        "url": "https://example-server.io/mcp",
        "headers": {
            "Authorization": "<AIVAX_API_KEY>"
        }
    }
]
```

Seu servidor MCP deve suportar **HTTP Streamable** para funcionar com o AIVAX como fonte de ferramentas do gateway. Você pode definir cabeçalhos personalizados na configuração do seu servidor MCP para configurar autenticação ou outras necessidades. As ferramentas descobertas, as instruções do servidor e as habilidades remotas são reutilizadas por `cacheDuration` segundos; o padrão é 600.

Cada origem MCP aceita os seguintes campos. Use-os para nomear a origem, autenticar a conexão e controlar o que o modelo vê:

| Campo | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `name` | `string` | Obrigatório | Nome de exibição da origem, com pelo menos 3 caracteres. Ele identifica a origem nos nomes das ferramentas (consulte `prefixTools`), nas instruções do servidor e nas descrições de habilidades remotas. |
| `url` | `string` | Obrigatório | URL absoluta HTTP ou HTTPS do endpoint Streamable HTTP do servidor MCP. |
| `description` | `string` | `null` | Nota opcional descrevendo o que a origem fornece. É apenas informativa: não é enviada ao modelo nem ao servidor MCP. |
| `headers` | `object` | `{}` | Mapeamento de nomes de cabeçalhos HTTP para valores string enviados em toda conexão com o servidor, tanto durante a descoberta quanto em cada chamada de ferramenta. Use-o para autenticação, como `Authorization`. |
| `cacheDuration` | `integer` | `600` | Tempo, em segundos, que as ferramentas descobertas, as instruções do servidor e as habilidades remotas são reutilizadas antes que o AIVAX as liste novamente. Aceita valores de `0` a `86400`. As chamadas de ferramentas nunca são armazenadas em cache. |
| `prefixTools` | `boolean` | `true` | Quando `true`, cada ferramenta é exposta ao modelo como `mcp_<origem>_<ferramenta>`, onde `<origem>` é o `name` em minúsculas, com espaços substituídos por hífens e outros caracteres não alfanuméricos removidos. Por exemplo, a ferramenta `get_weather` do `Meu servidor MCP` torna-se `mcp_meu-servidor-mcp_get_weather`. Quando `false`, o nome original da ferramenta do servidor é usado; certifique-se de que não haja colisão com ferramentas de outras origens ou funções no mesmo gateway. O servidor sempre recebe seu nome original de ferramenta. |
| `allowClientInstructions` | `boolean` | `true` | Adiciona as instruções de uso anunciadas pelo servidor ao contexto do gateway. Consulte [instruções do servidor e habilidades remotas](#instruções-do-servidor-e-habilidades-remotas). |
| `allowRemoteSkills` | `boolean` | `true` | Importa habilidades remotas verificadas de servidores que anunciam a extensão de habilidades. Consulte [instruções do servidor e habilidades remotas](#instruções-do-servidor-e-habilidades-remotas). |

Se seu servidor for direcionado ao MCP `2026-07-28`, consulte [MCP Stateless: migrando do Mcp-Session-Id](https://aivax.net/blog/mcp-stateless-core-moves-session-state-into-your-application/) para ver como ele interage com este gateway.

## Instruções do servidor e habilidades remotas

Use essas opções quando um servidor MCP confiável deve adicionar instruções ou habilidades ao gateway. Cada origem MCP aceita `allowClientInstructions` e `allowRemoteSkills`. Ambas estão habilitadas por padrão. Defina qualquer opção como `false` para excluir esse conteúdo.

Conecte-se apenas a servidores cujo conteúdo você confia:

- As instruções do servidor são adicionadas ao contexto do gateway.
- As habilidades remotas ficam disponíveis por meio de `read_skill` junto com suas habilidades de conta.

Para serem importadas, um servidor deve anunciar a capacidade `resources` e a extensão `io.modelcontextprotocol/skills` quando a conexão for inicializada. Habilidades remotas nunca substituem suas habilidades de conta ou habilidades de mesmo nome de outra origem.

Para saber como a descoberta, verificação e ativação de habilidades são divididas entre servidor e host, e quais clientes as suportam, consulte [Habilidades MCP vs ferramentas](https://aivax.net/blog/mcp-skills-extension-workflows/).

Somente a raiz `SKILL.md` de cada habilidade é importada, e ela deve corresponder ao conteúdo anunciado pelo servidor. Arquivos de suporte e scripts não são importados, e o frontmatter da habilidade não concede permissões de ferramenta: suas políticas de ferramenta existentes ainda se aplicam. Desative as habilidades remotas se precisar de aprovação por habilidade.

Antes de conectar um servidor de terceiros, revise [Melhores práticas de segurança do servidor MCP para servidores de terceiros](https://aivax.net/blog/mcp-is-a-trust-boundary-not-just-a-tool-catalog/), que aborda envenenamento de ferramentas, credenciais, bloqueio baseado em worker e aprovação no lado do servidor.

As mesmas opções se aplicam às origens MCP adicionadas por workers do gateway.

## Metadados enviados com solicitações MCP

Use esta seção quando seu servidor MCP precisar identificar o contexto de chamada ou receber valores do aplicativo com uma solicitação.

O AIVAX adiciona o contexto de chamada em `params._meta` a todas as solicitações e notificações que envia ao servidor: `initialize`, `notifications/initialized`, `tools/list`, `skills/list`, `resources/read` e `tools/call`.

- Em `tools/call`, os argumentos contêm a entrada da ferramenta.
- Os metadados identificam o contexto de chamada e carregam valores fornecidos pelo aplicativo.

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

### Campos do AIVAX

Estes campos identificam o contexto de chamada. Todos os caminhos abaixo são relativos a `params._meta`. Nomes começando com `_aiv` são reservados; não os use para metadados personalizados.

| Campo | Tipo JSON | Significado e disponibilidade |
| --- | --- | --- |
| `_aiv_nonce` | `string` ou `null` | Hash BCrypt derivado da chave hook da conta de chamada. Sem uma chave hook configurada, seu valor é `null`. Verifique a chave hook de texto plano configurada contra este hash, conforme descrito em [autenticação hook](https://docs.aivax.net/pt-br/docs/authentication.md#hook-authentication); não compare strings de hash nem espere a própria chave hook. |
| `_aiv_external_user_id` | `string` ou `null` | Identificador de usuário externo carregado pelo contexto de inferência. Para clientes de chat, vem da sessão; para conclusões de chat, vem do campo `user` da solicitação. Pode ser `null` quando nenhum usuário foi identificado. Use-o para procurar o usuário em seu aplicativo, não como ID de conta AIVAX ou prova de autorização. |
| `_aiv_call_source` | `string` | Origem da inferência, não do transporte de ferramenta de saída. Uma ferramenta MCP chamada durante a inferência de bate-papo web ainda recebe `WebChatClient`, não `McpClient`. Consulte os valores abaixo. |
| `_aiv_conversation_token` | `string` ou `null` | Token de correlação de conversa. Para conclusões de chat, é o `conversation_token` da solicitação, ou o token gerado pelo AIVAX quando nenhum foi enviado. Pode ser `null`. Não é uma credencial nem um ID exclusivo de chamada de ferramenta; chamadas na mesma conversa podem compartilhá-lo. |
| `_aiv_moment` | `string` | Carimbo de data/hora ISO 8601, com deslocamento UTC, de quando o AIVAX enviou a solicitação. Não é a hora local do usuário. |

### Valores de origem de chamada

Use a origem para rotear e diagnosticar a chamada, não para autorizar. Os mesmos valores string são usados por funções de protocolo em `context.callSource`:

| Valor | Origem da inferência |
| --- | --- |
| `WebChatClient` | Cliente de bate-papo web do AIVAX. |
| `ChatCompletionsApi` | API de conclusões de chat compatível com OpenAI; a origem padrão para essa API. |
| `FunctionsApi` | API de funções. |
| `IntegrationBot` | Bot de integração de mensagens. |
| `OpenWebUiClient` | Cliente Open WebUI. |
| `McpClient` | Inferência iniciada por meio de um cliente MCP. |
| `ValidationApi` | Validação de teste agêntico. |

Os consumidores devem tolerar futuros valores de origem.

### Metadados personalizados e segurança

Os metadados de inferência personalizados são um mapa de chaves string para valores string. Eles vêm dos metadados da solicitação para conclusões de chat ou dos metadados da sessão para clientes de chat, incluindo sessões criadas por integrações de mensagens.

O AIVAX copia essas entradas diretamente em `params._meta`. Chaves personalizadas começando com `_aiv` são ignoradas. No exemplo, `tenant_id` e `request_id` são definidos pelo aplicativo. Não há objeto `metadata` aninhado no envelope MCP.

Antes de confiar nos metadados:

- Não envie segredos em metadados personalizados. Esses valores são encaminhados ao servidor de ferramenta remoto.
- Valide o acesso do tenant e do usuário contra seus próprios registros confiáveis antes de usar metadados para selecionar dados ou realizar gravações.
- Não trate um ID de usuário externo, um token de conversa ou um rótulo de origem de chamada como permissão por si só.
- Trate o nonce como prova apenas da chave hook da conta configurada. Não é uma assinatura dos argumentos, um ID de solicitação único ou um mecanismo de prevenção de replay.
- Mantenha o HTTPS e os cabeçalhos de autenticação configurados do servidor MCP.
- Aplique seus próprios controles de autorização e de operações duplicadas.
- Se seu servidor exigir autenticação nonce, rejeite um nonce ausente ou inválido.

Para o envelope de callback HTTP equivalente, consulte [contexto de função de protocolo](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md#context-fields).

## Resultados de ferramentas

Um resultado de ferramenta é o que o servidor MCP retorna após uma chamada. O AIVAX adiciona blocos suportados de volta à conversa para que o modelo possa continuar.

- Texto é adicionado diretamente ao resultado da ferramenta.
- Blocos de imagem e áudio são anexados de volta à conversa como conteúdo multimodal com IDs gerados.
- Tipos de bloco de conteúdo não suportados são relatados como texto não suportado.

Se algo der errado, verifique o sintoma:

- **A ferramenta não aparece para o modelo:** verifique se o servidor remoto está acessível, suporta Streamable HTTP, possui os cabeçalhos de autenticação corretos e está configurado como uma origem MCP no gateway.
- **A ferramenta aparece, mas não é chamada:** revise o nome, a descrição e o esquema.
- **A ferramenta é chamada com argumentos incorretos:** restrinja o JSON Schema e inclua descrições de propriedades.
- **A chamada falha:** faça o servidor MCP retornar erros legíveis para que o modelo possa decidir se tenta outro argumento, pede informações ao usuário ou interrompe a ação.
