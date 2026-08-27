# AIVAX Documentation

AIVAX is an AI orchestration platform for building, operating, and evaluating AI applications through one account and API surface. Use hosted or bring-your-own-key (BYOK) models, then add reusable instructions, knowledge, tools, media, user channels, and background processing as your product grows.

## Choose where to start

- **Make your first model call:** follow [Getting Started](docs/getting-started.md) for a minimal OpenAI-compatible chat completion.
- **Understand the platform:** read the [Overview](docs/overview.md) to choose between direct inference, AI Gateways, RAG, generations, Batch, and other products.
- **Prepare a production integration:** review [Authentication](docs/authentication.md), [Pricing](docs/pricing.md), and [Plans and limits](docs/limits.md).

## Build an AI application

- [Inference](docs/inference/inference.md) — generate responses with hosted or BYOK models through an OpenAI-compatible API.
- [AI Gateways](docs/inference/ai-gateway.md) — reuse a model, instructions, RAG, skills, tools, moderation, and inference settings as one assistant runtime.
- [RAG collections](docs/rag/collections.md) — index your own knowledge for semantic search and grounded answers.
- [Rerankers](docs/rag/reranking.md) — reorder candidate documents by relevance, with or without a managed collection.
- [Skills](docs/features/skills.md) — package reusable instructions and operating knowledge for AI Gateways.
- [Tools](docs/tools/builtin-tools.md) and [MCP](docs/tools/mcp.md) — connect assistants to AIVAX capabilities and external systems.
- [Chat clients](docs/features/chat-clients.md) — publish a gateway through web chat or supported messaging integrations.

## Process text and media

- [Text classification](docs/rag/classification.md) and [text segmentation](docs/rag/text-segmentation.md) — prepare documents for routing, analysis, and retrieval.
- [Image generation](docs/generations/images.md) — create or edit images from text and reference images.
- [Speech generation](docs/generations/speech.md) and [audio transcription](docs/generations/audio-transcriptions.md) — convert between text and audio.
- [Media descriptions](docs/generations/media-descriptions.md) — turn images, audio, video, or files into text for downstream processing.
- [Voice Sessions](docs/inference/voice-session.md) — build low-latency, two-way voice experiences.

## Operate at scale and improve quality

- [Batch](docs/features/batch.md) — run the same AI workflow over many independent items in the background.
- [Agentic Tests](docs/inference/agentic-tests.md) — evaluate complete, goal-oriented conversations and track repeatable gateway regressions.
- [Structured responses](docs/inference/structured-responses.md) — validate generated JSON against an application contract.
- [MCP utilities](docs/mcp-utilities/account-management-mcp.md) — expose account, collection, documentation, web, and inference capabilities to compatible agents.

For endpoint schemas and generated request details, use the [AIVAX API reference](https://inference.aivax.net/apidocs).
