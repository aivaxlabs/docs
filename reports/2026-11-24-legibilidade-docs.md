# Legibilidade docs/ — 2026-11-24

7 páginas EN, das 53 que nunca tiveram passe de legibilidade (lista por `git show` dos 6 commits de legibilidade anteriores). Só prosa e estrutura; nenhum fato, valor, embed, nome de modelo ou alvo de link alterado. `content/pt-br` não foi editado.

## O que mudou

- `inference/routing/zdr.md`: um parágrafo único virou três seções curtas (como afeta o roteamento, o que não muda, etapas da plataforma).
- `inference/routing/special-providers.md`: a falha por modelo só disponível em special providers virou lista de saídas; seleção direta por tag ganhou seção própria.
- `inference/structured-responses/concepts.md`: "Choosing a mode" passou de três parágrafos para lista com o campo em negrito.
- `inference/subscription-models/integration.md`: características comuns dos modelos em lista; alinhamento do bloco do ZCode corrigido.
- `inference/subscription-models/overview.md`: duas frases repetidas de "Availability" fundidas em uma.
- `inference/chat-clients/overview.md`: abertura dividida em dois parágrafos.
- `data-processing/instruction-refinement.md`: subtítulos para tipos de item, exemplo de request, findings, suggested fixes e exemplo de response. Nenhum heading existente foi renomeado.

## Validação

- Links, número de `<script>` (embeds) e fences de código iguais antes e depois, arquivo a arquivo.
- `hugo` isolado (destino temporário): exit 0, sem warnings. `_site` não foi tocado.
- `git diff --check` limpo, exceto em `subscription-models/overview.md`: o arquivo já tinha CRLF em 50 linhas antes da edição (HEAD) e o aviso some com `core.whitespace=cr-at-eol`. Não normalizei os finais de linha para não gerar diff grande.

## Fora desta rodada

- 46 páginas ainda sem passe. Mais densas e candidatas na próxima: `inference/chat-clients/web-client.md`, `chat-clients/integrations.md`, `chat-completions/processing-pipeline.md`, `chat-completions/moderation.md`, `chat-completions/streaming.md`, `ai-gateways/concepts.md`.
- pt-br fica outdated até o `bun build.js translate pt-br` do pedido de publicação.
