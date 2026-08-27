# Overview

AIVAX is an AI orchestration platform for building, operating, and evaluating AI applications through one account, API surface, and billing wallet. It combines hosted and bring-your-own-key (BYOK) models with reusable assistant configuration, knowledge retrieval, tools, text and media processing, user-facing channels, background jobs, and conversational evaluation.

You do not need every product for every application. Start with direct inference for one response, then add the products that solve a specific reuse, knowledge, integration, scale, or quality requirement.

## Choose the right starting point

| Goal | Start with | Why |
| --- | --- | --- |
| Generate or analyze text in one request | [Inference](inference/inference.md) | Call a hosted or BYOK model through the OpenAI-compatible API without creating reusable assistant configuration. |
| Reuse instructions, knowledge, tools, and model settings | [AI Gateway](inference/ai-gateway.md) | Give your application one stable assistant runtime that can evolve without rebuilding every request. |
| Search your own documents or generate grounded answers | [RAG collections](rag/collections.md) | Store and index knowledge for semantic retrieval, citations, and gateway context. |
| Reorder candidates your application already retrieved | [Rerankers](rag/reranking.md) | Improve relevance without requiring a managed AIVAX collection. |
| Publish an assistant to end users | [Chat clients](features/chat-clients.md) | Connect a gateway to web chat or supported messaging integrations with session and channel controls. |
| Process many independent records | [Batch](features/batch.md) | Run one repeatable workflow asynchronously with per-item state, validation, retries, cost, and export. |
| Test a complete assistant conversation | [Agentic Tests](inference/agentic-tests.md) | Simulate a goal-oriented user and judge the gateway across multiple turns. |
| Build a low-latency two-way voice experience | [Voice Sessions](inference/voice-session.md) | Stream user and assistant audio in an interactive session instead of combining separate audio jobs. |

## Build the assistant runtime

### Inference and AI Gateways

AIVAX exposes OpenAI-compatible model listing and chat completion endpoints. Use a **direct model call** for exploration, one-off generation, or configuration that does not need to be reused. Use an **AI Gateway** when the same model, instructions, RAG collections, skills, tools, moderation, or output behavior should serve multiple calls or users.

Most production assistants use a gateway because the application can keep calling one identifier while the assistant configuration changes independently. Gateways can use integrated AIVAX models or external OpenAI-compatible providers.

Production API base URL:

```text
https://inference.aivax.net
```

OpenAI-compatible SDK base URL:

```text
https://inference.aivax.net/v1
```

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Knowledge, retrieval, and reranking

A [RAG collection](rag/collections.md) is a semantic knowledge library. Add documents, test them with [Semantic Search](rag/semantic-search.md), and then attach the collection to an AI Gateway when the assistant should answer from that knowledge. AIVAX can also generate grounded answers directly from collections and expose collection search through [Collections MCP](mcp-utilities/collections-mcp.md).

Reranking is a separate step: it receives a query and candidate documents, then returns the candidates in a more relevant order. Use a collection for managed storage and retrieval; use the standalone [reranking](rag/reranking.md) generation when your application already owns the candidates.

### Skills and tools

[Skills](features/skills.md) package reusable instructions and operating knowledge. Use a skill when the assistant needs to know **how** to perform a task. Use RAG when it needs to retrieve **facts or source material** that may grow or change independently.

Tools let the assistant take action or retrieve live information. Choose among:

- [Built-in tools](tools/builtin-tools.md) for capabilities provided by AIVAX.
- [MCP](tools/mcp.md) for Model Context Protocol servers and reusable tool ecosystems.
- [Protocol functions](tools/protocol-functions.md) for HTTP functions defined by your application.
- [Shell](tools/shell.md) for controlled command execution when the use case requires it.

Keep the tool surface as small as the assistant's job allows. Each additional tool expands cost, latency, permissions, and failure paths.

## Process text, documents, and media

AIVAX includes focused generation products for work that does not need a full chat conversation:

- [Text classification](rag/classification.md) assigns labels to one or more documents.
- [Text segmentation](rag/text-segmentation.md) splits long content into useful chunks for indexing or downstream processing.
- [Media descriptions](generations/media-descriptions.md) convert images, audio, video, and files into text that another model or workflow can use.
- [Image generation](generations/images.md) creates or edits images.
- [Speech generation](generations/speech.md) turns text into audio.
- [Audio transcription](generations/audio-transcriptions.md) turns audio into text.

Use direct multimodal inference when the selected chat model supports the input and should reason over it in the same request. Use a focused generation endpoint when you need a reusable artifact, a transcript, a description, or a preprocessing stage. For large independent input sets, run the appropriate operation through [Batch](features/batch.md).

For interactive two-way audio, use [Voice Sessions](inference/voice-session.md) instead of manually chaining transcription, text inference, and speech generation.

## Deliver, scale, and evaluate

### Chat clients

A [chat client](features/chat-clients.md) connects an AI Gateway to an end-user channel. It owns presentation, session behavior, allowed origins, uploads, audio replies, channel integrations, and user-facing limits. The gateway continues to own assistant behavior such as the model, instructions, RAG, and tools.

Use a chat client for a browser widget or supported messaging integration. Use the inference API directly when your own backend or interface already manages users, conversation state, and delivery.

### Batch

[Batch](features/batch.md) applies one workflow to dozens or thousands of independent records. A workflow defines the instruction, model or gateway, structured output, validation, tools, and retry policy. A job imports items, processes them in the background, exposes per-item progress and cost, and exports results.

Do not use Batch when one item depends on another or when a user needs an immediate answer. Use direct inference for one synchronous result and RAG for searchable knowledge.

### Agentic Tests

[Agentic Tests](inference/agentic-tests.md) evaluates the configured behavior of an AI Gateway across a bounded conversation. A simulated user pursues a goal while an independent judge evaluates progress. Use persisted tests for reusable, scheduled regression coverage or an ephemeral evaluation for one immediate run.

A completed test run is not automatically a successful behavior result. Review the run outcome, judge result, retained conversation, usage, and cost together.

## Operate and connect AIVAX

AIVAX records conversations and usage so you can trace behavior, attribute cost, and diagnose failures. The dashboard and account APIs expose account balance, usage, conversations, gateway resources, collection transactions, Batch items, and Agentic Test runs. Start with [Pricing](pricing.md) and [Plans and limits](limits.md) before enabling a high-volume or media-heavy workflow.

AIVAX also provides MCP utilities for compatible agents:

- [Account management MCP](mcp-utilities/account-management-mcp.md)
- [Collections MCP](mcp-utilities/collections-mcp.md)
- [Documentation MCP](mcp-utilities/documentation-mcp.md)
- [Web utilities MCP](mcp-utilities/web-utilities-mcp.md)
- [Inference MCP](mcp-utilities/inference-mcp.md)

These utilities expose existing AIVAX capabilities through MCP; they do not replace the underlying account, collection, or inference products.

## Next steps

1. Follow [Getting Started](getting-started.md) to make and verify your first chat completion.
2. Read [Authentication](authentication.md) before choosing private keys, public keys, or chat sessions for an application boundary.
3. Review [Pricing](pricing.md) and [Plans and limits](limits.md) before increasing traffic or processing large collections, media, tests, or Batch jobs.
4. Move reusable assistant behavior into an [AI Gateway](inference/ai-gateway.md), then add RAG, skills, tools, and a chat client only when the use case requires them.
