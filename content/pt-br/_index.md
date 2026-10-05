---
{title: Documentação AIVAX,aliases: [/pt-br/toc.html,/pt-br/AGENTS.html,/pt-br/readme.html],sourceHash: ef600ffc9abb29eb}
---

# Documentação AIVAX

AIVAX é uma plataforma de orquestração de IA para construir, operar e avaliar aplicações de IA através de uma única conta e superfície de API. Use modelos hospedados ou bring-your-own-key (BYOK), depois adicione instruções reutilizáveis, conhecimento, ferramentas, mídia, canais de usuário e processamento em segundo plano à medida que seu produto cresce.

## Escolha por onde começar

- **Faça sua primeira chamada de modelo:** siga [Primeiros passos](docs/getting-started.md) para uma conclusão de chat mínima compatível com OpenAI.
- **Entenda a plataforma:** leia a [Visão geral](docs/overview.md) para escolher entre inferência direta, Portais de IA, RAG, gerações, Lote e outros produtos.
- **Prepare uma integração de produção:** revise [Autenticação](docs/authentication.md), [Preços](docs/pricing.md) e [Planos e limites](docs/limits.md).

## Crie uma aplicação de IA

- [Inferência](docs/inference/inference.md) — gere respostas com modelos hospedados ou BYOK através de uma API compatível com OpenAI.
- [Portais de IA](docs/inference/ai-gateway.md) — reutilize um modelo, instruções, RAG, habilidades, ferramentas, moderação e configurações de inferência como um único runtime de assistente.
- [Coleções RAG](docs/rag/collections.md) — indexe seu próprio conhecimento para busca semântica e respostas fundamentadas.
- [Rerankers](docs/rag/reranking.md) — reordene documentos candidatos por relevância, com ou sem uma coleção gerenciada.
- [Habilidades](docs/features/skills.md) — empacote instruções reutilizáveis e conhecimento operacional para Portais de IA.
- [Ferramentas](docs/tools/builtin-tools.md) e [MCP](docs/tools/mcp.md) — conecte assistentes às capacidades do AIVAX e a sistemas externos.
- [Clientes de chat](docs/features/chat-clients.md) — publique um portal via chat web ou integrações de mensagens suportadas.

## Processar texto e mídia

- [Classificação de texto](docs/rag/classification.md) e [segmentação de texto](docs/rag/text-segmentation.md) — prepare documentos para roteamento, análise e recuperação.
- [Geração de imagens](docs/generations/images.md) — crie ou edite imagens a partir de texto e imagens de referência.
- [Geração de fala](docs/generations/speech.md) e [transcrição de áudio](docs/generations/audio-transcriptions.md) — converta entre texto e áudio.
- [Descrições de mídia](docs/generations/media-descriptions.md) — converta imagens, áudio, vídeo ou arquivos em texto para processamento posterior.
- [Sessões de voz](docs/inference/voice-session.md) — construa experiências de voz bidirecionais de baixa latência.

## Operar em escala e melhorar a qualidade

- [Lote](docs/features/batch.md) — execute o mesmo fluxo de trabalho de IA em vários itens independentes em segundo plano.
- [Agentic Tests](docs/inference/agentic-tests.md) — avalie conversas completas orientadas a metas e rastreie regressões repetíveis do portal.
- [Respostas estruturadas](docs/inference/structured-responses.md) — valide JSON gerado contra um contrato de aplicação.
- [Utilitários MCP](docs/mcp-utilities/account-management-mcp.md) — exponha capacidades de conta, coleção, documentação, web e inferência para agentes compatíveis.

Para esquemas de endpoint e detalhes de solicitações geradas, use a [referência da API AIVAX](https://inference.aivax.net/apidocs).
