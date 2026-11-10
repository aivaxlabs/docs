Source: https://docs.aivax.net/docs/inference/chat-clients.html

# Chat Clients

A chat client gives end users an interface to converse with an assistant powered by an [AI Gateway](https://docs.aivax.net/docs/inference/ai-gateways/concepts.md). It runs on the gateway's inference and supports deep thinking, search, text conversation, and image sending. Audio features depend on the integration and client configuration.

You can customize the chat client interface with CSS, custom JavaScript, colors, labels, suggestion buttons, frame origins, input modes, and the language used by the chat resources.

## How the chat client works

A chat client is a session layer on top of an AI Gateway. The gateway defines the assistant’s behavior; the chat client defines how an end user converses with it, how the session is identified, how long it lasts, what limits are applied, which visual resources appear, and how messages enter and exit through external channels. This separation is important: you can use the same gateway in an internal API, a web widget, Telegram, and WhatsApp, but each channel will have its own rules for identity, attachments, formatting, commands, and message delivery.

Each session maintains a message history, additional context, metadata, conversation token, and an optional external identifier. When you create a session with a `tag`, AIVAX tries to reuse the active session for that tag instead of creating a new conversation. This allows a user to return to the widget or send another message through the same channel without immediately losing context. When the session has no `tag`, it functions as an independent conversation controlled by the access token generated at creation.

The `tag` also serves as the connection point between the chat client, memory, workers, and integrations. Tools like memory need a stable identifier to know who a preference or persistent information belongs to. Workers receive `externalUserId` to apply rules per user, per channel, or per external account. WhatsApp and Telegram integrations use the conversation ID, phone number, or user to retrieve the correct session. Therefore, choose a stable, non‐sensitive, unique `tag` per user or conversation.

## Creating a chat session

A chat session represents one conversation between your chat client and an end user. When you create it, you can provide additional context for the conversation, such as the user’s name or location.

A session can be identified with a stable, non-sensitive tag so the client can continue the appropriate conversation. See the embedded API Reference for supported session behavior and configuration.

Reference:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Web%20Chat%20Session)

### Choose where to put context

AIVAX accepts context in three places. Each one reaches the model in a different position, and that position decides what it costs and how long it lasts:

| Field | Where it goes | Use it for |
|---|---|---|
| `extraContext` (session) | Added to the system instructions of every inference in the session. | Context that ideally doesn't change during the conversation: the channel, the user's name, plan, preferred language, or the product the conversation is about. |
| `contextLocation` (session) | AIVAX fetches the URL before each inference and sends its content right after the last user message. | External context that can change while the conversation goes on, such as the cart, an order status, or the record open in your application. |
| `instructions` ([Send Prompt](#add-context-for-one-inference)) | Sent right after the last user message, after the `contextLocation` content, for that request only. | Context for that moment that won't be reused in the rest of the conversation, such as a temporary answer format or the item the user just selected. |

Keep `extraContext` stable. The system instructions are the start of every request, so changing them invalidates the prompt cache for the whole history. Content sent after the last user message doesn't affect the cache of earlier messages, which makes `contextLocation` and `instructions` the right place for anything that varies. Neither is saved to the session history: the model sees the latest version on each request and older versions are not repeated.

The same rule applies to the channel integrations: Telegram and WhatsApp put their fixed channel context, such as formatting rules and the user's display name, in the session `extraContext`.

Do not put secrets, internal tokens, or data the model should not see in any of these fields. They are sent to the model and can influence responses, tools, and workers. Make sure the `contextLocation` URL is reachable by AIVAX; when it can't be loaded, the inference continues without it and a warning is added to the account logs.

The web chat accepts text messages and attachments. Images, files, videos, and audio are materialized before inference; supported image, file, video, and audio types can be forwarded as multimodal content when the selected model and gateway configuration support them. Audio can also be synthesized as a response when the chat client’s audio synthesis setting is active. When a channel cannot embed an attachment, AIVAX turns unsupported content into a textual attachment notice so that the assistant can reply clearly.

## Sending prompts from your application

Use **Send Prompt** when your application needs a response using an existing chat-client session. The session access key authorizes the request; keep it private. The request uses the session history and the associated AI Gateway configuration.

For long-running inference, send `POST /api/v1/public/chat-clients/<access-key>/prompt` to `https://direct.inference.aivax.net` to bypass the Cloudflare Tunnel path. Configure your HTTP client's timeout for the expected generation duration. The direct domain exposes selected routes, not the entire chat-client API; see [endpoints available on the direct host](https://docs.aivax.net/docs/overview.md#endpoints-available-on-the-direct-host).

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Send%20Prompt)

### Choose the input format

The required `prompt` accepts plain text, one OpenAI-compatible message object, or an ordered array of message objects. Plain text becomes a user message. Use message objects for multimodal content or tool results, and an array when several messages must be supplied together. At least one message must contain content or tool calls.

The response contains `completionText`, `reasoning` when available, `toolCalls` for your application to execute, `usage`, and `createdMessages`. The last field contains only the messages generated during this request, in generation order—not the submitted messages or the previous session history. Its messages use the OpenAI-compatible format and may include tool calls, tool results, reasoning and per-message metadata.

`completionText` is the text of the last assistant message in `createdMessages`, not a concatenation of the turn: after a tool call, it holds only the final answer. It falls back to the accumulated inference text when the last assistant message is missing or empty, so a tool-call-only turn may return an empty `completionText` — check `toolCalls` to decide whether to continue.

### Decide whether to save the turn

`commit` defaults to `true`: submitted messages and generated messages are saved to the session. Use `commit: false` for a one-off inference against the current history without saving that turn. You still receive the completion and `createdMessages`.

This is not a dry run: inference is still billed and tools can still act. Uncommitted messages stay out of later session history — to continue that branch, resubmit them in an ordered `prompt` array.

### Add context for one inference

Use `instructions` for context that applies only to the current request and won't be reused in the rest of the conversation, such as a temporary answer format or the item currently selected in your application. It accepts text, one OpenAI-compatible content part, or an array of them, so you can also send an image or a file for that request only.

AIVAX sends this content as a user message right after the last user message, after any content loaded from `contextLocation`. It is not saved to the session history, even when `commit` is `true`, and it is not returned in `createdMessages`. Because it comes after the history, changing it on every request doesn't invalidate the prompt cache of earlier messages. For context that should last the whole conversation, use the session `extraContext` instead; see [Choose where to put context](#choose-where-to-put-context).

```json
{
    "prompt": "Is this item still available?",
    "instructions": [
        "The user is viewing product SKU 4471.",
        { "type": "image_url", "image_url": { "url": "https://example.com/sku-4471.png" } }
    ]
}
```

### Stream the response

Set `stream: true` to receive the response as server-sent events instead of one JSON body. Each `data` line is a JSON object with `type` and `data`:

- `text`: a completion text delta in `content`. When `replace` is `true`, replace the text received so far instead of appending.
- `reasoning`: a reasoning delta in `content`, when the model exposes reasoning.
- `tool`: a server-side tool update with `toolName`, `toolId`, `toolArguments`, and `update` (such as `Created` or `Finished`).
- `result`: the final body, with the same fields as the non-streamed response. It is the last event of a successful request.
- `error`: an error that happened after the stream started, with a `message`. It replaces `result`.

Errors detected before the stream starts, such as insufficient balance or an exceeded message limit, are still returned as regular HTTP errors. `commit` works the same way in both modes: the turn is saved before the `result` event is sent.

### Adjust the inference

Use `inferenceOptions` to override some AI Gateway settings for one request. Omitted fields keep the gateway configuration.

- `reasoningEffort`: the reasoning effort, such as `none`, `low`, `medium`, or `high`, when the model supports it.
- `renderingMode`: `default` or `textual_blocks`. With `textual_blocks`, reasoning and server-side tool activity are placed as textual blocks inside the completion text; see [Chat presentation guidance](https://docs.aivax.net/docs/inference/response-rendering/chat-presentation-guidance.md#response-rendering-mode).
- `toolInvocationExplanations`: whether the model must explain why it calls each server-side tool; see [Tool explanations](https://docs.aivax.net/docs/inference/response-rendering/tool-explanations.md).

```json
{
    "prompt": "Find the latest release notes.",
    "stream": true,
    "inferenceOptions": {
        "reasoningEffort": "low",
        "toolInvocationExplanations": true
    }
}
```

When the model provider fails temporarily before sending any output, AIVAX retries the request automatically, up to three times.

### Complete client-side tool calls

1. Configure the desired client-side tool in the AI Gateway, or send it in the request `tools` field, and send a prompt.
2. When `toolCalls` is nonempty, execute the requested function in your application. Each entry exposes `id`, `functionName`, `contents` (JSON-encoded arguments), and `isProtocolFunction`. Validate the arguments and enforce your application's permissions before execution.
3. Send a new prompt with a `role: "tool"` message. Set `tool_call_id` to the returned call's `id`, `name` to its `functionName`, and `content` to the tool result as text. For multiple calls, submit an array of matching result messages.
4. Read the next completion, or repeat if it requests more tools.

With the default `commit: true`, the assistant's tool-call message is already in the session: submit only the tool results, without duplicating that assistant message. If the preceding request used `commit: false`, include the unsaved conversation messages—including the assistant message containing `tool_calls`—before the results. The top-level `toolCalls` entries are not message objects; use the OpenAI-compatible messages in `createdMessages` when reconstructing that exchange.

Use the request `tools` field for client-side tools that apply only to that inference, such as an action available on the screen the user is on. It takes OpenAI-compatible function tools, added to the AI Gateway tools for that request only; they are not saved to the session. They stay visible even when the gateway hides tools without a skill, and their names must not repeat a gateway tool name. Send the same `tools` again in the request that submits the results, so the model can call them again in the next step.

```json
{
    "prompt": "Add this item to my cart.",
    "tools": [
        {
            "type": "function",
            "function": {
                "name": "add_to_cart",
                "description": "Adds the product the user is viewing to the cart.",
                "parameters": {
                    "type": "object",
                    "properties": { "quantity": { "type": "integer" } },
                    "required": [ "quantity" ]
                }
            }
        }
    ]
}
```

For server-side tools, AIVAX executes the tools and continues generation within the same request. `createdMessages` can therefore contain an assistant tool call, its tool result, and the final assistant reply, while top-level `toolCalls` is empty. Do not execute those server-side calls again. The API reference above includes examples for simple completions, client-side calls, submitted client-side results, and multiple messages from server-side calling.

## Integration sessions

AIVAX provides integrations for chat clients via Telegram and WhatsApp, including [Z-Api](https://www.z-api.io/), Evolution API, and Kapso. Each conversation in an app is an individual session, identified by the conversation ID, chat ID, or the user’s phone number, depending on the provider. Integration sessions default to a three-hour duration unless the integration parameters specify another value.

These sessions obey the original chat client rules. Additionally, chat sessions in these integrations have two special commands:

- `/reset`: clears the current session context.
- `/usage`: when `debug` is active in the chat client, displays the current chat usage in tokens.

Integrations treat the channel as the source of messages, but inference continues to be performed by the AI Gateway associated with the chat client. In Telegram, the conversation receives additional instructions about formatting and expected channel behavior. In WhatsApp, each provider has its own webhook details, media download, and response sending; Z-Api, Evolution API, and Kapso are different paths to the same operational goal. In all cases, user messages enter the session, are materialized as inference‐compatible messages, and the assistant’s response is sent back via the integration’s messenger.

Use Telegram when you need a simple bot with users identifiable by chat and easy‐to‐test commands. Use WhatsApp when the user’s primary support channel is already the phone and the conversation needs to happen in a daily app. Use the web widget when you want to embed the assistant in a website, product, support center, or dashboard. The channel choice should not change the gateway’s essential content, but may require adjustments to tone, response size, formatting, and attachment tolerance.

Before opening a channel to the public, review the chat client configuration and explain memory behavior to users when applicable. When an integration does not respond as expected, first verify the associated gateway and integration configuration, then retry with a simple message before investigating optional capabilities.

Treat persistent memory separately from session history. See [the memory-poisoning guide](https://aivax.net/blog/persistent-memory-is-a-write-path/) for reviewing stored context and testing its influence across conversations.

For the next steps, review [AI Gateway configuration](https://docs.aivax.net/docs/inference/ai-gateways/concepts.md) and [Authentication](https://docs.aivax.net/docs/authentication.md), especially the boundary between public chat access and API credentials.
