Source: https://docs.aivax.net/docs/inference/chat-clients/web-client.html

# Web Chat Client

The web client is the browser-facing side of a chat client. You can use it in two ways:

- **Hosted web chat:** send the user to the session `talkUrl`, or embed it in an iframe. AIVAX serves the interface, and you customize how it looks and what it accepts.
- **Your own interface:** keep your application's UI and send each message to the session with [Send Prompt](#sending-prompts-from-your-application).

Both start with a [session](https://docs.aivax.net/docs/inference/chat-clients/managing-sessions.md) created by your server.

## Publish the hosted chat

The access key and the link of a session are its credentials, so create sessions on your server and only hand the result to the user's browser:

1. **Create the chat client** once, linked to your AI Gateway. See [Create a chat client](https://docs.aivax.net/docs/inference/chat-clients/overview.md#create-a-chat-client).
2. **Create a session** from your server when a user opens the chat, with your private API key. Send a stable `tag` to continue the user's previous conversation. See [Create a session](https://docs.aivax.net/docs/inference/chat-clients/managing-sessions.md#create-a-session).
3. **Return the `talkUrl`** from the response to the page that shows the chat. Do not return your API key.
4. **Open or embed the link.** Send the user to it, or load it in an iframe:

```html
<iframe
    src="<talk-url>"
    title="Support chat"
    allow="microphone; clipboard-write"
    style="width: 100%; height: 640px; border: 0;">
</iframe>
```

The `microphone` permission is only needed when `Audio` is in `inputModes`. When the session expires, the link stops working: create or refresh the session again with the same `tag` to get a working link that keeps the conversation.

## Customize the hosted chat

Set these options in the chat client configuration:

| Option | What it controls |
|---|---|
| `pageTitle`, `primaryColor`, `logoImageUrl` | Page title, main color, and logo. |
| `helloLabel`, `helloSubLabel`, `textAreaPlaceholder` | Greeting shown before the first message, and the placeholder of the message box. |
| `suggestionButtons` | Buttons with ready-made prompts, each with a `label` and the `prompt` it sends. |
| `languageCode` | Language of the chat interface. |
| `customStyles`, `customScripts` | Your own CSS and JavaScript, added to the hosted page. |
| `showToolCalls` | Shows tool activity in the conversation. On by default. |
| `debug` | Shows diagnostic information for troubleshooting, and enables `/usage` in integrations. Off by default; turn it off again after use. |

## Attachments and audio

`inputModes` selects what users can attach: `Image`, `Document`, and `Audio`. Enable `uploadUnsupportedFiles` to also accept file types that AIVAX cannot read, sent as generic files.

Attached images, files, videos, and audio are processed before inference. They are forwarded as multimodal content when the gateway's model and configuration support them. When a channel cannot pass an attachment on, AIVAX replaces it with a text notice, so the assistant can still reply clearly.

To reply with audio, set `audioSynthesisSource` to the `name` of a text-to-speech model, as listed by **Get Speech Models** in the API reference. The default, `None`, turns audio replies off. Optionally, set `audioSynthesisVoice` and `audioSynthesisInstruction` to choose the voice and how it speaks. Enable `summarizeTextBeforeAudioSynthesis` to read a summary of long answers instead of the full text. Audio replies are available in the hosted web chat only, not in integrations. See [Speech](https://docs.aivax.net/docs/generations/speech.md) for voices and pricing.

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

Use `instructions` for context that should apply only to the current request, such as a temporary answer format or the item currently selected in your application. It accepts a string or an array of strings; array entries are joined with blank lines. This context is appended to the system instructions after the session's `extraContext` and any context loaded from `contextLocation`.

Unlike session `extraContext`, `instructions` is not saved as session context, even when `commit` is `true`. It is still sent to the model and can influence responses and tools; do not include secrets or data the model should not see. For context that should last the whole conversation, use the session `extraContext` instead; see [Choose where to put context](https://docs.aivax.net/docs/inference/chat-clients/managing-sessions.md#choose-where-to-put-context).

```json
{
    "prompt": "Is this item still available?",
    "instructions": [
        "The user is viewing product SKU 4471.",
        "Answer in one sentence."
    ]
}
```

### Add disposable context to the last user message

Use `context` to give the model material that belongs to the current turn only, such as a screenshot of what the user is looking at, a document they selected, a short audio clip, or text extracted from your application. It accepts:

- a string, which becomes a text part;
- one OpenAI-compatible content part: `text`, `image_url`, `input_audio`, `video_url`, or `file`;
- an array mixing strings and content parts.

The parts are inserted at the beginning of the last user message of the conversation, before the user's own content. When a tool returned media in a previous step, the context still goes into the message written by the user, not the tool output.

The context is disposable: it is never saved to the session history or to the stored conversation, even when `commit` is `true`, and it is not returned in `createdMessages`. Send it again on each request that needs it. Media parts follow the same rules as attachments in `prompt`: they are forwarded as multimodal content or converted to text according to the model and the gateway's multimodal settings, and that processing is billed as usual.

`context` is the cache-friendly way to send changing information. Unlike `extraContext` and `instructions`, it does not change the system instructions, so the cached part of the conversation is kept up to the last user message. Like every other context field, it is sent to the model: do not include secrets or data the model should not see.

Use `context` for information, not for instructions. Because it is part of the user's message, the model treats it as user input: directives such as "ignore previous rules" or "always answer in JSON" may be ignored, or interpreted as a jailbreak attempt and refused. Put behavior rules, answer formats, and other directives in `instructions` or in the session `extraContext`, which are added to the system instructions.

```json
{
    "prompt": "Is this item still available?",
    "context": [
        "The user is viewing product SKU <sku>.",
        {
            "type": "image_url",
            "image_url": { "url": "https://example.com/product.png" }
        }
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

## Other session routes

With the session access key, your application can also use these routes, described in the API reference:

- **Get Session Info** returns the messages and the client configuration, to render the conversation in your own interface.
- **Retry Last Message** removes everything after the last user message, so the user can try again from there.
- **Download Session Transcript** exports the messages, context, metadata, and conversation token as JSON.
