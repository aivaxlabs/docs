Source: http://localhost:1313/pt-br/index.html

# Documentação AIVAX

AIVAX é uma plataforma de orquestração de IA para construir, operar e avaliar aplicações de IA através de uma única conta e superfície de API. Use modelos hospedados ou bring-your-own-key (BYOK), depois adicione instruções reutilizáveis, conhecimento, ferramentas, mídia, canais de usuário e processamento em segundo plano à medida que seu produto cresce.

## Escolha por onde começar

- **Faça sua primeira chamada de modelo:** siga [Primeiros passos](http://localhost:1313/pt-br/docs/getting-started.md) para uma conclusão de chat mínima compatível com OpenAI.
- **Entenda a plataforma:** leia a [Visão geral](http://localhost:1313/pt-br/docs/overview.md) para escolher entre inferência direta, Portais de IA, RAG, gerações, Lote e outros produtos.
- **Prepare uma integração de produção:** revise [Autenticação](http://localhost:1313/pt-br/docs/authentication.md), [Preços](http://localhost:1313/pt-br/docs/pricing.md) e [Planos e limites](http://localhost:1313/pt-br/docs/limits.md).

## Crie uma aplicação de IA

- [Inferência](http://localhost:1313/pt-br/docs/inference/inference.md) — gere respostas com modelos hospedados ou BYOK através de uma API compatível com OpenAI.
- [Portais de IA](http://localhost:1313/pt-br/docs/inference/ai-gateway.md) — reutilize um modelo, instruções, RAG, habilidades, ferramentas, moderação e configurações de inferência como um único runtime de assistente.
- [Coleções RAG](http://localhost:1313/pt-br/docs/rag/collections.md) — indexe seu próprio conhecimento para busca semântica e respostas fundamentadas.
- [Rerankers](http://localhost:1313/pt-br/docs/rag/reranking.md) — reordene documentos candidatos por relevância, com ou sem uma coleção gerenciada.
- [Habilidades](http://localhost:1313/pt-br/docs/features/skills.md) — empacote instruções reutilizáveis e conhecimento operacional para Portais de IA.
- [Ferramentas](http://localhost:1313/pt-br/docs/tools/builtin-tools.md) e [MCP](http://localhost:1313/pt-br/docs/tools/mcp.md) — conecte assistentes às capacidades do AIVAX e a sistemas externos.
- [Clientes de chat](http://localhost:1313/pt-br/docs/features/chat-clients.md) — publique um portal via chat web ou integrações de mensagens suportadas.

## Processar texto e mídia

- [Classificação de texto](http://localhost:1313/pt-br/docs/rag/classification.md) e [segmentação de texto](http://localhost:1313/pt-br/docs/rag/text-segmentation.md) — prepare documentos para roteamento, análise e recuperação.
- [Geração de imagens](http://localhost:1313/pt-br/docs/generations/images.md) — crie ou edite imagens a partir de texto e imagens de referência.
- [Geração de fala](http://localhost:1313/pt-br/docs/generations/speech.md) e [transcrição de áudio](http://localhost:1313/pt-br/docs/generations/audio-transcriptions.md) — converta entre texto e áudio.
- [Descrições de mídia](http://localhost:1313/pt-br/docs/generations/media-descriptions.md) — converta imagens, áudio, vídeo ou arquivos em texto para processamento posterior.
- [Sessões de voz](http://localhost:1313/pt-br/docs/inference/voice-session.md) — construa experiências de voz bidirecionais de baixa latência.

## Operar em escala e melhorar a qualidade

- [Lote](http://localhost:1313/pt-br/docs/features/batch.md) — execute o mesmo fluxo de trabalho de IA em vários itens independentes em segundo plano.
- [Agentic Tests](http://localhost:1313/pt-br/docs/inference/agentic-tests.md) — avalie conversas completas orientadas a metas e rastreie regressões repetíveis do portal.
- [Respostas estruturadas](http://localhost:1313/pt-br/docs/inference/structured-responses.md) — valide JSON gerado contra um contrato de aplicação.
- [Utilitários MCP](http://localhost:1313/pt-br/docs/mcp-utilities/account-management-mcp.md) — exponha capacidades de conta, coleção, documentação, web e inferência para agentes compatíveis.

Para esquemas de endpoint e detalhes de solicitações geradas, use a [referência da API AIVAX](https://inference.aivax.net/apidocs).

## Para agentes de IA

- [llms.txt](http://localhost:1313/pt-br/llms.txt)
- [llms-full.txt](http://localhost:1313/pt-br/llms-full.txt)
