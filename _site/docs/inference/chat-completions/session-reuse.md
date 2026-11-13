Source: https://docs.aivax.net/docs/inference/chat-completions/session-reuse.html

# Session reuse

Session reuse lets a stateless `chat/completions` client keep the server-side context of a conversation between requests. Your application still stores and sends the message history; AIVAX only restores what the history cannot carry. For what that context contains, see [Server-side context](https://docs.aivax.net/docs/inference/chat-completions/server-side-context.md).

## Session reuse and chat client sessions

AIVAX has two features with "session" in the name. They solve different problems:

| | Session reuse (`conversation_token`) | [Chat client session](https://docs.aivax.net/docs/inference/chat-clients/managing-sessions.md) |
| --- | --- | --- |
| Who stores the message history | Your application. It sends the full history on every request. | AIVAX. The client sends only the new message. |
| What AIVAX keeps | Server-side tool calls and results of recent turns, for one hour after last use. | The whole conversation, context, metadata, and limits, until the session expires. |
| Endpoint | `/v1/chat/completions` | Chat client session endpoints, the web widget, and messaging integrations. |
| Identity | An opaque token you choose or AIVAX returns. | A session access key, optionally tied to a stable user `tag`. |
| Best for | Backends, agents, and SDK integrations that already manage conversations. | End-user chats in browsers, WhatsApp, or Telegram, where AIVAX manages the conversation. |

A chat client session manages its own conversation token internally; you do not send `conversation_token` to it. Use session reuse when your application owns the history, and a chat client when AIVAX should own it.

## Send the token

Send `conversation_token` in every request of the same conversation. AIVAX uses it to restore what happened on the server side in earlier turns, and to update a single stored conversation record instead of creating a new one for each request.

Server-side tools, such as [built-in tools](https://docs.aivax.net/docs/tools/builtin-tools.md), MCP tools, and protocol functions, run inside AIVAX. Their calls and results are not returned to you as messages: the response contains only the final assistant message, with the text of every step joined together. When you send the conversation history back, those tool calls and results are missing. With the same `conversation_token`, AIVAX puts them back into the history before the model runs, so the model still sees the data its tools returned and does not repeat the same calls.

```json
{
    "model": "your-model-or-gateway-id",
    "conversation_token": "support-ticket-1042",
    "messages": [
        {
            "role": "user",
            "content": "What is the status of order 123?"
        },
        {
            "id": "aivx_k2m9x0q4tr",
            "role": "assistant",
            "content": "Order 123 was shipped yesterday and should arrive on Friday."
        },
        {
            "role": "user",
            "content": "Can you change the delivery address?"
        }
    ]
}
```

You can create the token yourself and send it from the first request of the conversation; you do not need to wait for AIVAX to return one. Any non-empty string with 128 characters or less is accepted, with no required format, such as the ID your application already uses for the conversation. Tokens are scoped to your account, so another account can use the same value without sharing state with yours. When omitted, AIVAX generates a token and returns it, and you can reuse the returned value from the second request on.

Every response returns two values:

| Field | Where | Use |
| --- | --- | --- |
| `conversation_token` | Response root. When streaming, the last chunk before `[DONE]`. | Send it in the next request of the conversation. |
| Message ID (`aivx_...`) | The response `id` and `choices[].message.id`. When streaming, the `id` of every chunk, including tool and error chunks. | Recommended. Store it with the assistant message and send it back as that message's `id`. |

AIVAX matches the assistant messages you send back with its stored turns in this order:

1. The `id` of the assistant message, when you send it.
2. The IDs of the tool calls it carries, when the turn also requested tools from your client.
3. The text of the message, within the same `conversation_token`.

Matching by `id` is the most reliable. Matching by text is a fallback for clients that discard the `id`, and it can fail without an error, for example when the text was changed or when two answers in the same conversation have the same text. When no match is found, the message is used exactly as you sent it.

## Client requirements

- **Use one token per conversation.** Reusing a token across different conversations, users, or branches can restore tool results from another conversation. Generate a new token when a new conversation starts, and do not use values that users can guess or choose.
- **Do not share tokens between end users.** The token is not a credential, but anyone who can call your account with it can continue that conversation's stored context.
- **Store and resend the message `id`.** Save the `aivx_...` ID of every assistant message you receive and send it back as the `id` of that message in later requests. This is the recommended way to restore a turn, and it keeps working when the text alone cannot identify it.
- **Send back the exact content AIVAX returned.** Keep the full text of each assistant message as you received it, including the text the model wrote before calling tools, joined in a single assistant message. Do not split it into several messages, drop parts of it, or rewrite, translate, or summarize it. Matching by text ignores whitespace only. When `rendering_mode` is `textual_blocks`, the content mixes reasoning and answer blocks, so only the `id` can identify the turn.
- **Preserve tool call IDs.** When a response requests tools from your client, send back the same `tool_calls[].id` values and answer each one with a `tool` message.
- **Handle expired state.** The server-side state of a turn expires after one hour without use. After that, or when it cannot be found, the conversation continues normally, but the model no longer sees the results of those earlier server-side tools.
- **Do not resend restored tools yourself.** You do not need to rebuild server-side tool calls or results. If your history already contains them with the same IDs, AIVAX does not add them again.

`idempotency_key` is a deprecated alias of `conversation_token`. It still works, but new integrations should use `conversation_token`. When both are sent, they must have the same value; otherwise the request fails with `400 Bad Request`.

To keep conversation state in your application and gateway configuration in AIVAX, see [migrating Assistants threads to Responses](https://aivax.net/blog/migrating-from-openai-assistants-without-rebuilding-the-same-coupling/).
