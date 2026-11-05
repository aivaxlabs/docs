---
{title: Streaming,linkTitle: Streaming,weight: 110,group: Inference}
---

# Streaming

Set `stream: true` to receive the response as server-sent events (SSE) while it is generated. Each event is a `data:` line with a JSON `chat.completion.chunk`, and the stream ends with `data: [DONE]`. OpenAI-compatible SDKs parse this format directly.

Use streaming for user-facing chats, so the user sees progress while reasoning and tools run. Streaming also keeps data flowing, so long requests rarely hit proxy timeouts.

## Event types

| Chunk contains | Meaning |
| --- | --- |
| `choices[].delta.content` | A fragment of the answer text. |
| `choices[].delta.reasoning` | A fragment of the model's reasoning, when the model returns it. |
| `choices[].delta.tool_calls` | A [client-side tool](tools.md) call. The stream then ends with `finish_reason: "tool_calls"`. |
| `servertool` | A [server-side tool](#server-side-tool-events) state change. `choices` is empty. |
| `usage` | The last chunk before `[DONE]`, with `finish_reason` and token usage. |
| `error` | A failure after the stream started; see [Errors during a stream](#errors-during-a-stream). |

Every chunk includes `id`, the AIVAX message ID (`aivx_...`), `model`, and `provider`. The last chunk before `[DONE]` also includes `conversation_token`. Store both to continue the conversation; see [Session reuse](session-reuse.md).

Preserve the order in which events arrive. Reasoning, tool events, and answer text of one assistant turn can be interleaved.

## Server-side tool events

While AIVAX runs a built-in tool, MCP tool, or protocol function, it sends chunks with a `servertool` object:

```json
{
    "object": "chat.completion.chunk",
    "choices": [],
    "servertool": {
        "name": "web_search",
        "id": "call-example-id-0",
        "contents": "{\"query\":\"weather forecast today\"}",
        "state": "Created",
        "explanation": null
    }
}
```

| Field | Description |
| --- | --- |
| `name` | Tool name. |
| `id` | Tool call ID. All events of one call share it. |
| `contents` | Tool arguments as a JSON string. |
| `state` | `Created` when the call starts, then `Completed` or `Failed`. |
| `explanation` | `{ "reason", "goal" }` when [tool explanations](/docs/inference/response-rendering/tool-explanations.md) are enabled and the model supplied them; otherwise `null`. |

To receive reasoning and tool activity as text blocks inside `delta.content` instead of separate fields, use `rendering_mode: "textual_blocks"`; see [Chat presentation guidance](/docs/inference/response-rendering/chat-presentation-guidance.md).

## Usage chunk

The last chunk before `[DONE]` has an empty `delta`, the final `finish_reason`, and `usage`:

```json
{
    "object": "chat.completion.chunk",
    "choices": [
        { "index": 0, "finish_reason": "stop", "delta": {} }
    ],
    "usage": {
        "prompt_tokens": 412,
        "completion_tokens": 96,
        "total_tokens": 4604,
        "prompt_tokens_details": { "cached_tokens": 4096, "audio_tokens": 0 }
    },
    "conversation_token": "support-ticket-1042"
}
```

`prompt_tokens` excludes cached input; see [Caching](caching.md).

## Keep-alive

While a stream is open, AIVAX sends a keep-alive event with the data `%ping%` every 15 seconds, so proxies do not close an idle connection during long tool calls. Ignore events whose data is `%ping%`. If your SSE parser expects JSON in every event, skip these events or disable the keep-alive.

To disable the keep-alive, send the request header:

```text
Sse-Stream-Options: no-ping
```

Disable it only when nothing between your client and AIVAX closes idle connections.

## Errors during a stream

Once the stream starts, the HTTP status is already `200`. A failure is sent as a chunk with `finish_reason: "error"` and an `error` object, followed by `[DONE]`:

```json
{
    "object": "chat.completion.chunk",
    "choices": [
        { "index": 0, "finish_reason": "error", "delta": { "content": "" } }
    ],
    "error": {
        "code": "service_unavailable",
        "message": "The inference provider is unavailable right now. Please, try again later."
    }
}
```

Check every chunk for `error` and treat it as a failed request. Text already received belongs to an incomplete answer; discard it or mark it as incomplete. For integrated models, provider error details are not returned; for gateways that use your own provider key, the provider's message is returned as is.

When a provider fails before any data was sent, AIVAX retries the request on another eligible provider, so the client sees no error.

## Streaming with `json_only`

With `json_only: true`, AIVAX generates the complete JSON first and sends it as a single SSE event containing the raw JSON, followed by `[DONE]`. The event is not a `chat.completion.chunk`. See [JSON-only](/docs/inference/structured-responses/json-only.md).
