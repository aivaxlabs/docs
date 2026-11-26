# Legibilidade docs/ — 2026-11-26

5 páginas EN revisadas, das candidatas listadas em 2026-11-24. Só prosa e estrutura; nenhum fato, valor, embed, nome de modelo ou alvo de link alterado. `content/pt-br` não foi editado.

## O que mudou

- `inference/chat-completions/moderation.md`: o parágrafo de falha do moderador ganhou a seção "If moderation cannot run"; frases de "Scope" mais diretas.
- `inference/chat-clients/web-client.md`: aviso de sessão expirada separado do aviso de microfone; dois subtítulos novos ("Add client-side tools for one request" e "Server-side tools in the response") quebram a seção longa de tool calls.
- `inference/chat-clients/integrations.md`: as quatro ferramentas de agendamento e as quatro rotas de revisão viraram listas.
- `inference/chat-completions/processing-pipeline.md`: uma frase informa que o passo 13 roda uma vez, após a última geração.
- `inference/ai-gateways/concepts.md`: parágrafo de truncamento de contexto dividido em dois.

## Sem alteração

- `inference/chat-completions/streaming.md`: já estava bem estruturada.

## Validação

- Links, fences de código e `<script>` (embeds) iguais a HEAD, arquivo a arquivo.
- `hugo` isolado (destino temporário): exit 0, sem warnings. `_site` não foi tocado.
- `git diff --check` limpo.

## Fora do commit

WIP alheio preservado: `chat-clients/_index.md`, `response-rendering/_index.md`, `routing/_index.md`, `structured-responses/_index.md`, `providers.md`, `jsonl-exports` e `_site`.

pt-br fica outdated até o `bun build.js translate pt-br` do pedido de publicação.
