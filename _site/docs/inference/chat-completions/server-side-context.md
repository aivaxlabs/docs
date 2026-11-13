Source: https://docs.aivax.net/docs/inference/chat-completions/server-side-context.html

# Server-side context

`chat/completions` is stateless: each request carries the conversation it needs, and AIVAX does not keep a message history for you. Some of the context the model works with, however, is created or added on the server and never appears in the messages you send or receive. This page explains what that context is, so you can predict what the model sees.

## What AIVAX adds before the model runs

Before each generation, AIVAX can add context that your request did not contain:

| Context | Source | Returned to you |
| --- | --- | --- |
| System instructions and remote instruction sources | [AI Gateway](https://docs.aivax.net/docs/inference/ai-gateways/concepts.md#instructions) | No |
| Retrieved documents | Gateway [RAG](https://docs.aivax.net/docs/inference/chat-completions/processing-pipeline.md#rag) collections | No, unless the model quotes them |
| Skill instructions | [Skills](https://docs.aivax.net/docs/inference/skills.md) the model loads | No |
| Tool definitions | Gateway tools, MCP sources, protocol functions, `builtin_tools` | No |
| Descriptions of media | [Multimodal pre-processing](https://docs.aivax.net/docs/inference/chat-completions/multimodal-pre-processing.md) | No |
| Context added by a worker | [Workers](https://docs.aivax.net/docs/inference/workers.md) | No |

This context is rebuilt on every request from the current gateway configuration. Changing the gateway changes the next request; it does not rewrite earlier answers.

## What AIVAX creates during the request

When the model calls a [server-side tool](https://docs.aivax.net/docs/inference/chat-completions/mcp-and-protocol-functions.md), AIVAX runs it and adds the call and its result to the conversation before generating again. A single request can contain many of these steps. The response returns only the final assistant message, with the text of every step joined together; the tool calls and their results are not returned as messages.

With streaming, you can observe these steps as they happen through `servertool` events and reasoning, but they are still not part of the final `messages` you would send back. See [Streaming](https://docs.aivax.net/docs/inference/chat-completions/streaming.md).

## Keep the context across turns

Because tool calls and results are not returned, the history you send on the next turn lacks them. Without them, the model can lose data it already obtained and call the same tools again.

Send the same `conversation_token` on every request of the conversation, and AIVAX restores those tool calls and results into the history before the model runs. The restored state expires one hour after its last use. See [Session reuse](https://docs.aivax.net/docs/inference/chat-completions/session-reuse.md) for the token rules and how AIVAX matches stored turns.

Client-side tools are different: their calls are returned to you, and your application sends their results back as `tool` messages, so they are always part of the history you control. See [Tools](https://docs.aivax.net/docs/inference/chat-completions/tools.md).

## What is not kept

- **The message history.** Your application stores it and sends it on every request. If AIVAX should store it, use a [chat client session](https://docs.aivax.net/docs/inference/chat-clients/managing-sessions.md).
- **Reasoning.** Session reuse restores tool calls and results, not reasoning. Send back the final assistant answer, not the reasoning transcript; see [Raw multi-turn example](https://docs.aivax.net/docs/inference/response-rendering/raw-multi-turn-example.md).
- **Long-term memory.** Facts the assistant should remember across conversations require the [memory tool](https://docs.aivax.net/docs/tools/builtin-tools.md#memory).

## Conversation records

When conversation logging is enabled, AIVAX stores a record of the conversation for observability, and requests with the same `conversation_token` update the same record. This record is for inspection and auditing; it is not used as context for later requests. See [Response and conversation records](https://docs.aivax.net/docs/inference/chat-completions/concepts.md#response-and-conversation-records).
