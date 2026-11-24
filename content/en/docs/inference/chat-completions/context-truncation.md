---
{title: Context Truncation,linkTitle: Context truncation,weight: 134,group: Inference}
---

# Context truncation

Context truncation keeps long conversations within a maximum input size. An AI Gateway can limit the input with `contextMaximumSize`, choose what happens when a conversation exceeds it with `contextOverflowAction`, and shorten old tool results with `toolContextCount`. Configure them in **Context window management** in the gateway editor or in the gateway parameters.

These are gateway settings; requests cannot override them. Your application still sends the full history it stores, and truncation only changes what the model receives for that request.

## Maximum context size

`contextMaximumSize` is the maximum approximate number of input tokens sent to the model. When it is not set, AIVAX does not limit the input, and the request fails only if it exceeds the model's own context window.

The size is an estimate of the conversation messages (including documents inserted by [RAG](processing-pipeline.md#rag)), system instructions, tool definitions, and response schema. Because it can differ from the provider's token count, set `contextMaximumSize` below the model's real context window to leave a margin, especially for media-heavy conversations.

On the Free plan, the input context is capped, even when the model or the gateway allows more. See [Limits](limits.md#context-window) for the value.

## Overflow actions

When the estimated input exceeds the limit, the gateway follows `contextOverflowAction`:

| Action | Behavior | When to use |
| --- | --- | --- |
| `Throw` (default) | Returns an error instead of calling the model. | Every message matters, such as a document review, so the application decides what to remove. |
| `Truncate` | Removes the oldest conversation messages until they fit, then continues. | Long-lived chats in which old turns lose relevance, such as support conversations. |
| `TruncateHard` | Truncates like `Truncate`, then returns an error if the full prompt, including system instructions, retrieved documents, and tool definitions, still exceeds the limit. | You want truncation, but never a request larger than the limit. |

The gateway editor offers `Throw` and `Truncate`; set `TruncateHard` through the API.

### How truncation removes messages

`Truncate` and `TruncateHard` remove messages from the beginning of the conversation. System messages and the last user message are never removed, so the model always receives the current request. Tool results are removed together with their tool call.

Truncation does not summarize removed messages. When the model needs facts from early turns, keep them in the system instructions, in a [collection](/docs/rag/collections.md), or in [memories](/docs/tools/builtin-tools.md).

### When the check runs

The check runs before every model generation of a request. In an agentic request, a large tool result can make the conversation exceed the limit after some tools already ran. With `Throw`, the request then fails at that point; with `Truncate`, older messages are removed and the loop continues. See [Processing pipeline](processing-pipeline.md).

Media counts by its estimated original size, not by the size of its [pre-processed](multimodal-pre-processing.md) description.

## Tool message truncation

`toolContextCount` controls how many recent tool response messages keep their original content. When it is set to a value greater than zero, older tool messages remain in the conversation but their content is replaced with:

```text
[tool response truncated - call this tool again]
```

This applies to results of [client-side tools](tools.md) and server-side tools. It reduces context usage in long agentic conversations whose tools return large payloads that are only relevant once, such as search results. Avoid it when an early tool result remains important later, and use it only when the model can safely call the tool again.

Rewriting older tool messages also changes the request prefix, which can lower the [prompt cache](caching.md) hit rate.

## Example

The following gateway fragment keeps support conversations under 32,000 estimated tokens and keeps only the last three tool results:

```json
{
  "contextMaximumSize": 32000,
  "contextOverflowAction": "Truncate",
  "toolContextCount": 3
}
```
