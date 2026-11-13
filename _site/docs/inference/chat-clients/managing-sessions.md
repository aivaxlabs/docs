Source: https://docs.aivax.net/docs/inference/chat-clients/managing-sessions.html

# Managing Chat Client Sessions

A session is one conversation between a chat client and an end user. It stores the message history, the conversation context, metadata, an access key, and an optional `tag` that identifies the user or conversation. Sessions expire after a configured time.

The web client and your application create sessions explicitly through the API. [Integrations](https://docs.aivax.net/docs/inference/chat-clients/integrations.md) create them automatically, one per conversation in the messaging app.

## Create a session

Create a session from your server, with a private API key, when a user starts a conversation. You can give it context for the whole conversation, such as the user's name or location.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Web%20Chat%20Session)

The response contains:

- `sessionId`: the session identifier, used to manage it with your API key.
- `accessKey`: the key that authorizes [Send Prompt](https://docs.aivax.net/docs/inference/chat-clients/web-client.md#sending-prompts-from-your-application) and the other public session routes.
- `talkUrl`: the link to the [hosted web chat](https://docs.aivax.net/docs/inference/chat-clients/web-client.md) for this session.

Anyone with the access key or the link can use the session. Give them only to the user who owns the conversation, and keep them out of logs.

`expires` sets the session lifetime in seconds, counted from creation or refresh. It accepts 600 seconds (10 minutes) through 7,776,000 seconds (90 days) and defaults to 3,600 seconds (one hour).

## Identify users with a tag

Without a `tag`, every session is an independent conversation, reachable only through its access key.

With a `tag`, AIVAX reuses the active session for that tag instead of creating a new one. Creating a session again with the same tag returns the same session and keeps its message history, but replaces its context, expiration, and metadata with the new values. This lets a user come back to the widget, or send another message through the same channel, without losing the conversation.

The `tag` also connects the session to other features:

- [Memory](https://docs.aivax.net/docs/tools/builtin-tools.md) needs a stable identifier to know who a saved preference belongs to.
- [Gateway workers](https://docs.aivax.net/docs/inference/workers.md) and [protocol functions](https://docs.aivax.net/docs/tools/protocol-functions.md) receive it as `externalUserId`, to apply rules per user, channel, or external account.
- Integrations use the chat ID or phone number as the tag, to find the right session for each conversation.

Choose a tag that is stable, unique per user or conversation, and not sensitive, such as an internal user ID instead of an email address.

## Conversation token

Each session has a conversation token that groups its exchanges into one stored [conversation](https://docs.aivax.net/docs/inference/chat-completions/concepts.md). AIVAX creates and manages it; you never send it, unlike `conversation_token` in [session reuse](https://docs.aivax.net/docs/inference/chat-completions/session-reuse.md).

The token is renewed when the conversation is cleared, by the web chat reset or by the `/reset` command in [integrations](https://docs.aivax.net/docs/inference/chat-clients/integrations.md#commands). The following messages are then recorded as a new conversation, even though the session and its `tag` stay the same.

You can read the token in the session transcript, and [protocol functions](https://docs.aivax.net/docs/tools/protocol-functions.md) and [MCP tools](https://docs.aivax.net/docs/tools/mcp.md) receive it in their call context. Use it to correlate calls from the same conversation, not as proof of identity or permission.

## Choose where to put context

AIVAX accepts context in three places. All of them are added to the system instructions of the inference, in this order:

| Field | When it applies | Use it for |
|---|---|---|
| `extraContext` (session) | Every inference in the session. | Context for the whole conversation: the channel, the user's name, plan, preferred language, or the product the conversation is about. |
| `contextLocation` (session) | AIVAX fetches the URL before each inference and appends its content after `extraContext`. | Server-controlled context that can change while the conversation goes on, such as the cart, an order status, or the record open in your application. |
| `instructions` ([Send Prompt](https://docs.aivax.net/docs/inference/chat-clients/web-client.md#add-context-for-one-inference)) | That request only, appended after the `contextLocation` content. | Context for that moment, such as a temporary answer format or the item the user just selected. |

None of them is saved to the session history: the model sees the latest version on each request. Because they are part of the system instructions, which start every request, changing them invalidates the prompt cache for the whole history.

Keep `extraContext` stable during the conversation. Each change to it, or to the content returned by `contextLocation`, invalidates the prompt cache for the whole history, which increases latency and input cost on the next request. For information that changes on every request, or that is not text, use the Send Prompt `context` field instead: it goes into the last user message rather than the system instructions, so the cached history before that message is kept. See [Add disposable context to the last user message](https://docs.aivax.net/docs/inference/chat-clients/web-client.md#add-disposable-context-to-the-last-user-message).

The same rule applies to the channel integrations: Telegram and WhatsApp put their fixed channel context, such as formatting rules and the user's display name, in the session `extraContext`.

Do not put secrets, internal tokens, or data the model should not see in any of these fields. They are sent to the model and can influence responses, tools, and workers. Make sure the `contextLocation` URL is reachable by AIVAX; when it can't be loaded, the inference continues without it and a warning is added to the account logs.

## List and end sessions

To review the sessions of a chat client, with their tags, timestamps, and message and token counts, use **List Web Chat Sessions** in the API reference.

To end a session before it expires, use **Delete Web Chat Session**. Its access key and link stop working immediately.
