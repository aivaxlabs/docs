# Legibilidade docs/ — 2026-10-29

12 páginas EN (maiores e ainda sem passe de legibilidade), 3 lotes. Só prosa e estrutura; nenhum fato, valor, embed ou nome de modelo alterado.

## O que mudou

- `inference/inference.md`: seção "Direct call or gateway" movida para o início; abertura de seções (structured responses, tool explanations, `extra_body`); "On-demand functions" renomeada para "On-demand built-in tools" com link; placeholders de base64 explícitos.
- `inference/pipelines.md`: abertura de RAG, parametrização, truncamento, moderação e workers diz o que é e quando usar; falhas de fonte remota em lista; links para gateway e `chat/completions`.
- `inference/skills.md`: nova subseção "Import and export skills"; seção final renomeada para "Combine skills with RAG and pipelines"; link "Building effective agents" corrigido; hifens normalizados.
- `tools/builtin-tools.md`: escolha de ferramenta em lista; troubleshooting dividido em três subseções; aberturas "Enable X to…".
- `tools/protocol-functions.md`: "Handling function calls" promovido a H2 (âncora igual); aviso de tokens junto do exemplo; resposta/erros em passos; fontes remotas em lista.
- `inference/agentic-tests.md`: ciclo do turno em lista numerada; guia de ajuste e campos de avaliação direta em listas; H3 "Stream events", "Judge states and outcomes", "Errors"; hooks em lista.
- `data-processing/decisions.md`, `extraction.md` ("Request behavior" -> "Build the request"), `rag/documents.md`, `rag/document-filters.md` (links com âncora), `mcp-utilities/account-management-mcp.md`, `mcp-utilities/collections-mcp.md` (H3 por tool, conselho de gateway movido para o início).

## Validação

- `git diff --check` limpo; arquivos `i/lf w/lf`.
- `hugo` isolado (destino temporário): sem warnings.
- Headings renomeados sem links internos para as âncoras antigas (`request-behavior`, `on-demand-functions`, etc.).
- `agentic-tests.md`: afirmação "avaliação direta não aceita `hooks`" conferida no texto original.

## Dúvidas factuais não editadas

- `collections-mcp.md`: `X-Mcp-Use-References: none` "habilita" referências (conferido antes no handler; mantido).
- `decisions.md`: "Send images" lista 4 modelos; a seção de limites cita também `@inception/mercury-decide` (até 16 imagens). Listas divergem. Jev 1.14 e d1.1 declaram imagem mas a API rejeita (item aberto de 28/10).
- `account-management-mcp.md`: "routes using a subscription multiplier" pouco claro; não editado.

pt-br fica outdated até o `bun build.js translate pt-br` do pedido de publicação.

## Divergência de código (não é dos docs)

`@liquid/d1.1` e `jev-1.14` declaram `ImageInput`, mas têm `MaxImages = 0`, e a API rejeita imagem. Os docs seguem o que a API aplica, então estão corretos. A correção é no código do Alpha2; não foi subida.
