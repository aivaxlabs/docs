Source: http://localhost:1313/index.html

# AIVAX Documentation

AIVAX is an AI orchestration platform for building, operating, and evaluating AI applications through one account and API surface. Use hosted or bring-your-own-key (BYOK) models, then add reusable instructions, knowledge, tools, media, user channels, and background processing as your product grows.

## Choose where to start

- **Make your first model call:** follow [Getting Started](http://localhost:1313/docs/getting-started.md) for a minimal OpenAI-compatible chat completion.
- **Understand the platform:** read the [Overview](http://localhost:1313/docs/overview.md) to choose between direct inference, AI Gateways, RAG, generations, Batch, and other products.
- **Prepare a production integration:** review [Authentication](http://localhost:1313/docs/authentication.md), [Pricing](http://localhost:1313/docs/pricing.md), and [Plans and limits](http://localhost:1313/docs/limits.md).

## Build an AI application

- [Inference](http://localhost:1313/docs/inference/inference.md) — generate responses with hosted or BYOK models through an OpenAI-compatible API.
- [AI Gateways](http://localhost:1313/docs/inference/ai-gateway.md) — reuse a model, instructions, RAG, skills, tools, moderation, and inference settings as one assistant runtime.
- [RAG collections](http://localhost:1313/docs/rag/collections.md) — index your own knowledge for semantic search and grounded answers.
- [Rerankers](http://localhost:1313/docs/rag/reranking.md) — reorder candidate documents by relevance, with or without a managed collection.
- [Skills](http://localhost:1313/docs/features/skills.md) — package reusable instructions and operating knowledge for AI Gateways.
- [Tools](http://localhost:1313/docs/tools/builtin-tools.md) and [MCP](http://localhost:1313/docs/tools/mcp.md) — connect assistants to AIVAX capabilities and external systems.
- [Chat clients](http://localhost:1313/docs/features/chat-clients.md) — publish a gateway through web chat or supported messaging integrations.

## Process text and media

- [Text classification](http://localhost:1313/docs/rag/classification.md) and [text segmentation](http://localhost:1313/docs/rag/text-segmentation.md) — prepare documents for routing, analysis, and retrieval.
- [Image generation](http://localhost:1313/docs/generations/images.md) — create or edit images from text and reference images.
- [Speech generation](http://localhost:1313/docs/generations/speech.md) and [audio transcription](http://localhost:1313/docs/generations/audio-transcriptions.md) — convert between text and audio.
- [Media descriptions](http://localhost:1313/docs/generations/media-descriptions.md) — turn images, audio, video, or files into text for downstream processing.
- [Voice Sessions](http://localhost:1313/docs/inference/voice-session.md) — build low-latency, two-way voice experiences.

## Operate at scale and improve quality

- [Batch](http://localhost:1313/docs/features/batch.md) — run the same AI workflow over many independent items in the background.
- [Agentic Tests](http://localhost:1313/docs/inference/agentic-tests.md) — evaluate complete, goal-oriented conversations and track repeatable gateway regressions.
- [Structured responses](http://localhost:1313/docs/inference/structured-responses.md) — validate generated JSON against an application contract.
- [MCP utilities](http://localhost:1313/docs/mcp-utilities/account-management-mcp.md) — expose account, collection, documentation, web, and inference capabilities to compatible agents.

For endpoint schemas and generated request details, use the [AIVAX API reference](https://inference.aivax.net/apidocs).

## For AI agents

- [llms.txt](http://localhost:1313/llms.txt)
- [llms-full.txt](http://localhost:1313/llms-full.txt)
