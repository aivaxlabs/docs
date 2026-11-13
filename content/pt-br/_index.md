---
{title: Documentação da AIVAX,aliases: [/pt-br/toc.html,/pt-br/AGENTS.html,/pt-br/readme.html],sourceHash: 5e38e06acb0447ca}
---

# Documentação da AIVAX

A AIVAX é uma plataforma de orquestração de IA para criar, operar e avaliar aplicações de IA por meio de uma única conta e superfície de API. Utilize modelos hospedados ou traga suas próprias chaves (BYOK), e depois adicione instruções reutilizáveis, conhecimento, ferramentas, mídia, canais de usuário e processamento em segundo plano conforme seu produto cresce.

## Escolha onde começar

- **Faça sua primeira chamada de modelo:** siga [Faça sua primeira solicitação](docs/overview.md#make-your-first-request) para uma conclusão de chat mínima compatível com OpenAI.
- **Entenda a plataforma:** leia a página [Boas-vindas](docs/overview.md) para escolher entre inferência direta, AI Gateways, RAG, gerações, Batch e outros produtos.
- **Prepare uma integração de produção:** revise [Autenticação](docs/authentication.md), [Preços](docs/pricing.md) e [Planos e limites](docs/limits.md).

## Crie uma aplicação de IA

- [Inferência](/docs/pt-br/inference/chat-completions/concepts.md) — gere respostas com modelos hospedados ou BYOK por meio de uma API compatível com OpenAI.
- [AI Gateways](/docs/pt-br/inference/ai-gateways/concepts.md) — reutilize um modelo, instruções, RAG, habilidades, ferramentas, moderação e configurações de inferência como um único runtime de assistente.
- [Coleções RAG](docs/rag/collections.md) — indexe seu próprio conhecimento para busca semântica e respostas fundamentadas.
- [Rerankers](docs/rag/reranking.md) — reordene documentos candidatos por relevância, com ou sem uma coleção gerenciada.
- [Skills](docs/inference/skills.md) — empacote instruções reutilizáveis e conhecimento operacional para AI Gateways.
- [Tools](docs/tools/builtin-tools.md) e [MCP](docs/tools/mcp.md) — conecte assistentes às capacidades da AIVAX e sistemas externos.
- [Chat clients](docs/inference/chat-clients/overview.md) — publique um gateway por meio de chat web ou integrações de mensagens suportadas.

## Processe texto e mídia

- [Classificação de texto](docs/data-processing/classification.md) e [segmentação de texto](docs/data-processing/text-segmentation.md) — prepare documentos para roteamento, análise e recuperação.
- [Geração de imagens](docs/generations/images.md) — crie ou edite imagens a partir de texto e imagens de referência.
- [Geração de fala](docs/generations/speech.md) e [transcrição de áudio](docs/generations/audio-transcriptions.md) — converta entre texto e áudio.
- [Descrições de mídia](docs/data-processing/media-descriptions.md) — transforme imagens, áudio, vídeo ou arquivos em texto para processamento posterior.
- [Voice Sessions](docs/inference/voice-session.md) — construa experiências de voz bidirecionais de baixa latência.

## Operem em escala e melhorem a qualidade

- [Batch](docs/inference/batch.md) — execute o mesmo fluxo de trabalho de IA sobre muitos itens independentes em segundo plano.
- [Agentic Tests](docs/inference/agentic-tests.md) — avalie conversas completas orientadas a objetivos e acompanhe regressões repetíveis do gateway.
- [Structured responses](/docs/pt-br/inference/structured-responses/concepts.md) — valide JSON gerado contra um contrato de aplicativo.
- [MCP utilities](docs/mcp-utilities/account-management-mcp.md) — exponha capacidades de conta, coleção, documentação, web e inferência a agentes compatíveis.

Para esquemas de endpoint e detalhes de solicitação gerados, use a [referência da API AIVAX](https://inference.aivax.net/apidocs).
