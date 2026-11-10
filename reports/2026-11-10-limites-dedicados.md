# Limites fora das páginas dedicadas — 2026-11-10

Commit local `21b8602e` em `C:\Code\www\docs-docfx` (master, ahead 1). Sem push. Sem tradução pt-br.

## O que mudou

- `content/en/docs/inference/chat-completions/limits.md`: o teto de 5 MB de cada fonte de instrução remota passou para esta página.
- `content/en/docs/inference/chat-completions/processing-pipeline.md`: só aponta para essa página.
- `content/en/docs/inference/chat-completions/context-truncation.md`: o teto de contexto do Free (64.000) ficou só em Plans and limits e em Inference limits.
- `content/en/docs/web-foundation/fetch-and-ocr.md`: a comparação com Extraction não repete o corte de 5 MB. O link de blog não commitado nesse arquivo ficou de fora.

## Fora do commit

Tabelas `## Pricing and limits` de produto seguem o AGENTS.md do repo. Não há alias `@aivax/*` expondo o modelo real.

`content/en/docs/limits.md` tem edição não commitada de terceiros que troca "Base allowance" por 10.000 tokens, 2.000 input tokens, 20.000 input tokens e 1.000 PUs. Não incluí nem reverti. O HEAD publicado continua com "Base allowance".
