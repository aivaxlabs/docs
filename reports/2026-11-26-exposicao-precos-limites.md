# Auditoria de exposição de preço, modelo interno e limites em docs/ (2026-11-26)

Escopo: `content/en/docs` fora de `pricing.md`, `limits.md` e `legal/`. Base: master `938ba6c5` (publicado).

## Publicação desta ativação

- `2d4b1796` e `e79c0bc2` publicados em fast-forward (liberação do Gabriel via Bom Senso).
- `938ba6c5`: tradução pt-br das 10 páginas alteradas, em commit à parte e publicado.
- Não entraram: `_site/`, `_index.md` EN de 4 seções, `jsonl-exports` e `providers.md` (WIP de terceiros). O pt-br dessas 4 seções e de `providers.md` foi gerado e descartado de propósito; seguem outdated/missing até o EN ser commitado.

## Resultado

Nenhuma exposição nova em páginas commitadas.

- Nenhum alias `@aivax/*` expõe modelo real (só `@aivax/cli` e `@aivax/reflex-v1`, próprio da AIVAX). Os `@aivax-subscription/*` nomeiam o modelo de propósito.
- Preços por produto só aparecem em seções `Pricing and limits` (fetch-and-ocr, reflex, shell, media-descriptions, extraction, web-search, builtin-tools, documents). `pricing.md` só traz regras de conta (armazenamento, comissão, taxas), sem taxas de modelo.
- Limites por plano em prosa apontam para `limits.md`. Limites técnicos do produto (decisions, document-filters, async-generations, oauth, shell) ficam nas páginas ou seções do próprio produto.
- Estimativas `≈ $` e multiplicadores em subscription models seguem o AGENTS.md.

## Pendente em arquivo não commitado

`content/en/docs/inference/providers.md` (untracked, não é meu) tem dois trechos que o gate público provavelmente barra:

- Cita OpenRouter e Vertex AI como agregadores; os dois não constam em `legal/third-party-processors.md` (conferido por busca).
- "Subscription model providers" descreve pool interno com taxas negociadas que mudam de hora em hora. Isso expõe estrutura de custo e contradiz "A subscription model runs the model it names" em `subscription-models/overview.md`.

Recomendação: antes de commitar a página, trocar os nomes por "aggregators and routers" e remover a frase sobre taxas negociadas e voláteis. Não editei porque o arquivo é draft de terceiros.
