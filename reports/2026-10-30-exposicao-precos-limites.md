# Auditoria de exposição de preços, modelos internos e limites (2026-10-30)

Escopo: `content/en/docs` fora de `pricing.md`, `limits.md` e das seções de preço e limite de cada produto. Regra do dono: modelos reais escondidos atrás de aliases, métricas de custo e limites só aparecem nas páginas dedicadas.

## Resultado

Commit local `32e803e` no worktree `C:\Code\www\docs-docfx-wt2` (branch `wt-changelog`), empilhado sobre `7528091`. Só EN, 5 páginas, `git diff --check` limpo e build Hugo isolado sem avisos (290 páginas).

## Corrigido

| Página | Antes | Depois |
| --- | --- | --- |
| `legal/changelogs.md` (MiniMax M3.1 Flash) | citava o preço de lista do OpenRouter e comparava com o M3 | removido; mantém o que o modelo melhora |
| `legal/changelogs.md` (catálogo de serviços) | "OpenRouter catalog dates" | "Catalog dates" |
| `inference/agentic-tests.md` | "até 16 resources" no corpo | aponta para Pricing and limits (o 16 já estava lá) |
| `tools/builtin-tools.md` | "10 KB por memória" no corpo | aponta para Pricing and limits |
| `data-processing/extraction.md`, `summarization.md` | "5 MB" no corpo | link para Pricing and limits; o 5 MB passou para a seção dedicada |

Observação: o preço de lista do Kimi K3.1 Pro (OpenRouter) já tinha sido trocado por preço do catálogo AIVAX no commit `9bc2a4d`.

## Verificado sem achado

- Nenhum alias `@aivax/*` esconde modelo real; os 3 usos são o pacote da CLI e o Reflex público.
- Nenhum nome interno (classes, jobs, repositórios, caminhos) nos guias.
- Preços de plano não aparecem nos guias; multiplicadores, comissão e allowances só em `pricing.md` e `limits.md`. Allowances são relativos (Base, 25x Free), sem unidades absolutas.
- Guias com preços e limites têm seção própria (`Pricing and limits`, `Usage and cost`, `Account rate limits`, `Model-specific limits`, `Limits`).
- Valores que são contrato de API (cursor de 10 min, limite de 100.000 caracteres do get document, 10 termos de busca, cron mínimo de 5 min, limites de filtros) ficaram: não são limite de plano nem custo.

## Decisão pendente (não alterei)

- `data-processing/classification.md`, `extraction.md` e `web-foundation/fetch-and-ocr.md` mantêm tabelas de preço próprias, o que segue o `AGENTS.md` do repo. O histórico do changelog (`legal/changelogs.md`) lista preços de modelos e limites por data; mexer nisso é decisão de produto e reescreveria histórico.
- `inference/batch.md` e `rag/document-filters.md` têm seção `Limits` própria com valores. Estão na própria página do produto, então ficaram.
- `legal/changelogs.md` continua citando preços de modelos novos ao anunciá-los. Não toquei: é registro público de mudança, não página de guia, e a regra de preço fora das páginas dedicadas não diz nada sobre ele.

## Pt-br

Fica desatualizado até o `bun build.js translate pt-br` do pedido de publicação, em commit à parte.
