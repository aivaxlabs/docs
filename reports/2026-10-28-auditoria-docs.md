# Auditoria docs/ — 2026-10-28

Escopo: commits da API fb7cc46..b5a9071 (27–28/10) contra `content/en/docs`.

## Corrigido (commit local, sem push)
- `data-processing/decisions.md`: adicionado `@liquid/d1.1` (lista, contexto 65.536, preço 0,020); removido `@perplexity/pplx-decider-v1.1-27b` (removido do código em dcfb5aa); aliases `@liquid/d` -> `d1.1` e `@perplexity/pplx-decider` -> `pplx-decider-v1.2`.

## Conferido sem divergência
- Planos: docs não citam preço mensal (apontam para a página de preços do site); limites de Free/Pro/Max em `limits.md` batem com `Net/Plans/*`.
- Extraction/Summarization/Translations: limites por plano batem com os planos; RAG v2 (`/api/v2/query`, `/similar`, `/browse`) e 2FA (`authentication.md#console-sign-in`) documentados.
- Catálogo de decisões: todos os modelos, contextos e preços batem com `SemanticDecider.cs`.
- Nenhum alias `@aivax/` escondendo modelo real fora de `collections-mcp.md` (`@aivax/reflex-v1`, nome público).

## Pendente / para decisão
- **Código x doc (imagens em decisões):** `@typesafe/jev-1.14` e `@liquid/d1.1` têm a capability `ImageInput`, mas `MaxImages` = 0, então `DecisionsApi` rejeita imagens ("does not accept images"). `decisions.md` diz que só clef*, mercury e luna aceitam imagens (coerente com o enforcement), mas a entrada de changelog de 28/10 (alteração não commitada de terceiros) diz que `@liquid/d1.1` aceita texto e imagens. Corrigir o código (definir MaxImages) ou o changelog antes de publicar.
- **Changelog 28/10 (não commitado, de terceiros):** contém preços de modelos (GPT-6.1 Terra, Reflection Beam, STT/TTS, rerankers) — é o local dedicado a isso, sem problema; falta citar o endpoint `GET /api/v1/information/plans.json` e a redução de Pro/Max (verificar se o preço de plano deve aparecer no changelog).
- `AllowRagLogging` (padrão true) existe no código e não há controle/documentação pública; só documentar quando houver endpoint/UI.
- Páginas de guia (classification, extraction, media-descriptions, decisions) mantêm tabelas de preço próprias; é o padrão atual de `pricing.md` ("cada produto documenta suas tarifas"), mantido.
- Em pt-br, `decisions.md` ficará outdated até o próximo `bun build.js translate pt-br` (regra do Gabriel: commit à parte, no pedido de publicação).
