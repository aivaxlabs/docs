# Legibilidade docs/ — 2026-11-06

12 páginas EN ainda sem passe de legibilidade, 3 lotes. Só prosa e estrutura; nenhum fato, valor, embed, nome de modelo ou alvo de link alterado. `content/pt-br` não foi editado.

## O que mudou

- `inference/workers.md`: cada seção diz o que o hook é e quando usar; escolhas de resposta, resultados de `tool.called` e exemplos em passos; JSON intacto.
- `inference/batch.md`: casos de uso, exclusões, roteamento e fluxo da API em listas; passos de criar, importar, iniciar, pausar, concluir, repetir e exportar. `#limits` e a tabela de limites intactos.
- `inference/voice-session.md`: conectar, migrar, configurar, stream, interrupção, tools, cobrança e desconexão abrem com quando usar. `#billing-and-limits` e o JSON da sessão intactos.
- `rag/semantic-search.md`: os três endpoints ganharam quando usar; páginas, filtros, similar e browse saíram de parágrafos densos. Tabela de opções intacta.
- `tools/mcp.md`: escolha de MCP, nomes, descoberta de skills, metadados e resultados em listas. `#choosing-the-function-name` e `#server-instructions-and-remote-skills` mantidos.
- `inference/structured-responses/json-healing.md`: ligar o healing, o loop, a falha e os padrões práticos mais escaneáveis. `#when-healing-fails` mantido.
- `overview.md`: abertura e cada bloco dizem o que é e quando usar; primeira requisição e caminhos de produto em passos.
- `mcp-utilities/media-generation-mcp.md`, `documentation-mcp.md`, `web-utilities-mcp.md`: abertura por seção e listas para resultados, header, busca, allowlist, preço e segurança.
- `authentication.md`: tipos de chave, 2FA e recuperação em subseções e passos. `#api-key-types`, `#hook-authentication` e `#console-sign-in` intactos.
- `oauth.md`: return URL, callback, state e revogação em passos. `#permissions` intacto.

## Validação

- `git diff --check` limpo.
- Embeds `<script src=...apidocs...>`, fences de código, valores numéricos e alvos de link iguais antes e depois.
- `hugo` isolado (destino temporário): exit 0, sem warnings. `_site` não foi tocado.

## Dúvidas factuais não editadas

- `authentication.md`: o texto fala em duas famílias de chave e lista três tipos (private, public, application). Não reescrito como contradição.
- `mcp-utilities/documentation-mcp.md`: a prosa diz "account API key" e o exemplo usa placeholder de chave privada.
- `mcp-utilities/web-utilities-mcp.md`: o título da página é Web Foundation MCP; o corpo e outros guias dizem web utilities MCP.
- `json-healing.md`: a página não diz se `healing_options` e o ajuste automático da conta usam os mesmos passos, nem como esse ajuste interage com `response_format` nativo.
- `batch.md`: uma frase diz que mudar o workflow afeta jobs e itens seguintes processados com aquela configuração; a página não diz se um job em andamento pega a edição.

pt-br fica outdated até o `bun build.js translate pt-br` do pedido de publicação.
