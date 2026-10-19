---
{title: Documentação AIVAX,aliases: [/pt-br/toc.html,/pt-br/AGENTS.html,/pt-br/readme.html],sourceHash: dd04299fe82447b4}
---

# Documentação AIVAX

AIVAX é uma plataforma de orquestração de IA para construir, operar e avaliar aplicações de IA por meio de uma única conta e superfície de API. Use modelos hospedados ou traga sua própria chave (BYOK), depois adicione instruções reutilizáveis, conhecimento, ferramentas, mídia, canais de usuário e processamento em segundo plano à medida que seu produto cresce.

## Escolha por onde começar

- **Faça sua primeira chamada de modelo:** siga [Make your first request](docs/overview.md#make-your-first-request) para uma conclusão de chat mínima compatível com OpenAI.
- **Entenda a plataforma:** leia a página [Welcome](docs/overview.md) para escolher entre inferência direta, gateways de IA, RAG, gerações, Batch e outros produtos.
- **Prepare uma integração de produção:** revise [Authentication](docs/authentication.md), [Pricing](docs/pricing.md) e [Plans and limits](docs/limits.md).

## Construa uma aplicação de IA

- [Inference](docs/inference/inference.md) — gere respostas com modelos hospedados ou BYOK através de uma API compatível com OpenAI.
- [Gateways de IA](docs/inference/ai-gateway.md) — reutilize um modelo, instruções, RAG, habilidades, ferramentas, moderação e configurações de inferência como um único runtime de assistente.
- [RAG collections](docs/rag/collections.md) — indexe seu próprio conhecimento para busca semântica e respostas fundamentadas.
- [Rerankers](docs/rag/reranking.md) — reordene documentos candidatos por relevância, com ou sem uma coleção gerenciada.
- [Skills](docs/inference/skills.md) — empacote instruções reutilizáveis e conhecimento operacional para gateways de IA.
- [Tools](docs/tools/builtin-tools.md) e [MCP](docs/tools/mcp.md) — conecte assistentes às capacidades da AIVAX e sistemas externos.
- [Chat clients](docs/inference/chat-clients.md) — publique um gateway via chat web ou integrações de mensagens suportadas.

## Processar texto e mídia

- [Text classification](docs/data-processing/classification.md) e [text segmentation](docs/data-processing/text-segmentation.md) — prepare documentos para roteamento, análise e recuperação.
- [Image generation](docs/generations/images.md) — crie ou edite imagens a partir de texto e imagens de referência.
- [Speech generation](docs/generations/speech.md) e [audio transcription](docs/generations/audio-transcriptions.md) — converta entre texto e áudio.
- [Media descriptions](docs/data-processing/media-descriptions.md) — converta imagens, áudio, vídeo ou arquivos em texto para processamento subsequente.
- [Voice Sessions](docs/inference/voice-session.md) — construa experiências de voz bidirecionais de baixa latência.

## Operar em escala e melhorar a qualidade

- [Batch](docs/inference/batch.md) — execute o mesmo fluxo de trabalho de IA em muitos itens independentes em segundo plano.
- [Agentic Tests](docs/inference/agentic-tests.md) — avalie conversas completas orientadas a metas e acompanhe regressões repetíveis do gateway.
- [Structured responses](docs/inference/structured-responses.md) — valide JSON gerado contra um contrato de aplicação.
- [MCP utilities](docs/mcp-utilities/account-management-mcp.md) — exponha capacidades de conta, coleção, documentação, web e inferência para agentes compatíveis.

Para esquemas de endpoints e detalhes de solicitações geradas, utilize a [AIVAX API reference](https://inference.aivax.net/apidocs).
