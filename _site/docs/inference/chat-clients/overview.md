Source: https://docs.aivax.net/docs/inference/chat-clients/overview.html

# Chat Clients Overview

A chat client publishes an [AI Gateway](https://docs.aivax.net/docs/inference/ai-gateways/concepts.md) to end users. It gives them a place to talk to the assistant—a hosted web chat, your own application, Telegram, or WhatsApp—while the gateway keeps answering with its model, instructions, tools, and knowledge. Chat clients support text conversation, deep thinking, search, and image sending. Audio features depend on the channel and the client configuration.

## How a chat client works

A chat client is a session layer on top of an AI Gateway. The two have separate jobs:

- **The AI Gateway** defines what the assistant does: model, instructions, tools, RAG, and skills.
- **The chat client** defines how end users reach it: how a conversation is identified, how long it lasts, which limits apply, what the interface looks like, and how messages enter and leave each channel.

Because of this split, one gateway can serve an internal API, a web widget, Telegram, and WhatsApp at the same time. Each channel keeps its own rules for identity, attachments, formatting, commands, and message delivery.

Every conversation is a [session](https://docs.aivax.net/docs/inference/chat-clients/managing-sessions.md). A session stores the message history, the conversation context, and metadata, and it expires after a configured time.

## Choose a channel

| Channel | Use it when | Guide |
|---|---|---|
| Web client | You want to embed the assistant in a website, product, support center, or dashboard, or call it from your own application. | [Web client](https://docs.aivax.net/docs/inference/chat-clients/web-client.md) |
| Telegram | You need a simple bot with users identified by chat and commands that are easy to test. | [Integrations](https://docs.aivax.net/docs/inference/chat-clients/integrations.md) |
| WhatsApp | Your users' main support channel is already the phone, through Z-API, Evolution API, or Kapso. | [Integrations](https://docs.aivax.net/docs/inference/chat-clients/integrations.md) |

The channel should not change what the gateway knows or does. It may still call for adjustments to tone, response length, formatting, and the attachments you accept.

## Create a chat client

Create the chat client, link it to an AI Gateway, then configure its limits, interface, and integrations. You can do this in the dashboard or through the API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Web%20Chat%20Client)

To change an existing client, use **Edit Web Chat Client** in the API reference. Send only the fields you want to update; omitted fields keep their current values.

Options that are durations, such as `messageDebounceInterval`, `maxScheduledIgnoredZone`, and the integrations' `sessionDuration`, are numbers of seconds.

## Limits

Two limits apply to every session of the chat client, on all channels:

| Limit | Default | What happens when it is reached |
|---|---|---|
| `messagesPerHour` | 20 | New messages from that session are rejected until the hour window allows them again. |
| `maxMessages` | 500 | The session can't receive more messages, and the user must start a new conversation. |

In the web client, a rejected message returns an error. In integrations, the user receives a system message in the chat explaining the limit.

Set both deliberately. Values that are too permissive increase cost and exposure to abuse; values that are too strict hurt the user experience.

## Before you go public

- Review the gateway and chat client configuration, and test the channel with a simple message first.
- Keep API keys on your server. End users only receive the session access key or link, never your account credentials. See [Authentication](https://docs.aivax.net/docs/authentication.md) for the boundary between public chat access and API credentials.
- If the gateway uses persistent memory, explain to users what it stores. Memory is separate from session history: it outlives the session and is tied to the session `tag`. See [the memory-poisoning guide](https://aivax.net/blog/persistent-memory-is-a-write-path/) for reviewing stored context and testing its influence across conversations.
- When a channel does not respond as expected, check the linked gateway and the integration configuration, then retry with a simple message before investigating optional features.

## Next steps

- [Managing sessions](https://docs.aivax.net/docs/inference/chat-clients/managing-sessions.md): create sessions, identify users, and choose where to put context.
- [Web client](https://docs.aivax.net/docs/inference/chat-clients/web-client.md): customize and embed the hosted chat, or send prompts from your application.
- [Integrations](https://docs.aivax.net/docs/inference/chat-clients/integrations.md): connect Telegram and WhatsApp.
