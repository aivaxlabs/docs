---
{title: Caching,linkTitle: Caching,weight: 60,group: Inference}
---

# Caching

Several caches affect an inference request. Prompt caching lowers the cost of input the provider has already processed. Other caches let AIVAX reuse media descriptions and remote definitions instead of fetching or processing them again.

## Prompt caching

Providers that support prompt caching reuse the processing of an identical request prefix. Cached input tokens are billed at the model's cache rate, which is lower than its input rate. Rates per model are listed on the dashboard **Models** page and in `GET /v1/models`.

The response reports cached input separately:

```json
{
    "usage": {
        "prompt_tokens": 412,
        "completion_tokens": 96,
        "total_tokens": 4604,
        "prompt_tokens_details": {
            "cached_tokens": 4096
        }
    }
}
```

`prompt_tokens` counts only the uncached input. Add `prompt_tokens_details.cached_tokens` to it to get the full input size.

Send `prompt_cache_key` to group requests that share a prefix, such as the requests of one gateway or one user; AIVAX forwards it to the provider. Providers that do not support it ignore it.

### Keep the prefix stable

The cache matches only an identical prefix, so put stable content first and variable content last:

- Keep system instructions, tool definitions, and skill lists unchanged between requests. Gateway instructions are a stable prefix by default; remote instruction sources change it whenever their content changes.
- Do not put timestamps, request IDs, or user-specific values in the system instructions. Send them in the latest user message or in `metadata`.
- Append new messages to the end of the history instead of rewriting earlier ones. [Context truncation](/docs/inference/ai-gateways/concepts.md#context-window-and-truncation) and [tool message truncation](/docs/inference/ai-gateways/concepts.md#tool-message-truncation) rewrite earlier messages and reduce cache hits.
- Retrieved RAG documents are inserted into the latest user message, so they do not break the prefix of earlier messages.

To check the hit rate on your own usage, see [why a prompt cache hit rate is low](https://aivax.net/blog/low-prompt-cache-hit-rate-prefix-breakers-compaction/).

## Multimodal pre-processing results

[Multimodal pre-processing](multimodal-pre-processing.md) results are cached by content and engine. When the same media is resolved again with the same engine, AIVAX reuses the description and does not bill it again. Changing the engine processes and bills the content again.

This matters when you resend the full history: an image attached in the first turn is not described again on every later turn.

## Remote definitions

AIVAX caches resources that a gateway fetches from your servers:

| Resource | Default cache | Configurable |
| --- | --- | --- |
| [Remote instruction sources](/docs/inference/pipelines.md#instructions) | 600 seconds | 0 to 86,400 seconds per source |
| [MCP](/docs/tools/mcp.md) tool lists, server instructions, and remote skills | 600 seconds | `cacheDuration`, 0 to 86,400 seconds |
| [Protocol function sources](/docs/tools/protocol-functions.md) | 10 minutes | No |

A failed fetch of a remote instruction source is cached for at most 30 seconds, so a temporary outage clears quickly. Tool calls are never cached: every MCP tool or protocol function call reaches your server.

Lower the cache duration while you develop a source, and raise it in production to reduce requests to your server and the latency of the first call.

## Server-side tool state

The server-side tool calls and results of recent turns are kept for one hour after their last use, so a request with the same `conversation_token` can restore them. This is a conversation state, not a response cache: AIVAX never returns a stored answer for a repeated request. See [Session reuse](session-reuse.md).
