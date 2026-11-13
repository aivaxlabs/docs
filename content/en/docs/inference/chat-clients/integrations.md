---
{title: Chat Client Integrations,linkTitle: Integrations,weight: 40,group: Chat Clients}
---

# Chat Client Integrations

Integrations connect a chat client to messaging apps, so users can talk to the assistant where they already are. AIVAX supports:

- **Telegram**, through a bot created with BotFather.
- **WhatsApp**, through [Z-API](https://www.z-api.io/), [Evolution API](https://doc.evolution-api.com/), or [Kapso](https://kapso.ai/).

The channel only carries the messages. Inference is still performed by the AI Gateway linked to the chat client, under the same [limits](overview.md#limits) as any other session.

## How messages flow

1. The provider sends each new message to the integration's [webhook URL](#webhook-urls).
2. AIVAX finds the session for that conversation, or creates one, and adds the message to its history. Media is downloaded and handled like [web client attachments](web-client.md#attachments-and-audio).
3. The gateway generates the reply, which AIVAX sends back through the provider.

Each conversation in the app is its own [session](managing-sessions.md), identified by the chat or the user's phone number, depending on the provider. Integration sessions last three hours by default. Change `sessionDuration`, in seconds, in the integration settings to keep them longer or shorter. A session that is still in use is extended automatically, so an active conversation does not expire in the middle of an exchange.

Each channel adds its own context to the session. On Telegram, the assistant receives instructions about formatting and expected channel behavior. On WhatsApp, the assistant is told to write with WhatsApp formatting, such as `*bold*` and `_italic_`, because Markdown is not converted.

Integrations reply with text and images. Audio replies are available only in the [hosted web chat](web-client.md#attachments-and-audio).

## Configure an integration

Set up the integration in the chat client settings in the dashboard, or with **Edit Web Chat Client Integrations** in the API reference. Each update changes one integration, and only the fields you send are replaced. To disconnect a channel, remove its integration with **Delete Web Chat Client Integration**.

The webhook URL appears after the integration is saved for the first time. Then finish the setup on the provider's side, as described below.

### Telegram

1. In Telegram, open [@BotFather](https://t.me/BotFather) and send `/newbot` to create the bot. BotFather replies with the bot token. To get a new token later, use `/token`.
2. In the chat client, open the Telegram integration and paste the token into **Bot token**.
3. Save, then select **Update hooks**. AIVAX registers the webhook with Telegram for you, including a secret token that proves each request came from Telegram. Messages that were waiting before the registration are discarded.

| Field | Required | Description |
|---|---|---|
| `botToken` | Yes | The token returned by BotFather. |
| `sessionDuration` | No | Session lifetime, in seconds. Three hours by default. |

The bot receives text, photos, voice messages and audio, videos, and PDF documents, including captions. Other document types get a reply saying the format is not supported; stickers and other message types are ignored.

Replies use Telegram's rich formatting, so Markdown, tables, and formulas render in the app. In private chats, the reply appears while it is being written. Each user has their own session, including in group chats. In groups, Telegram's privacy mode decides which messages the bot receives; see `/setprivacy` in BotFather.

### Z-API

1. In the [Z-API](https://www.z-api.io/) panel, open **Instances**, connect your WhatsApp number to an instance, and copy its **Instance ID** and **Instance token**.
2. If you enabled the account security token in Z-API's **Security** tab, copy it too.
3. In the chat client, open the Z-API integration, fill in the fields, and save.
4. In the instance webhooks, paste the AIVAX webhook URL into **On receive**. Leave **Notify those sent by me too** unchecked.

| Field | Required | Description |
|---|---|---|
| `instanceId` | Yes | The ID of the Z-API instance connected to WhatsApp. |
| `instanceToken` | Yes | The token of that instance. |
| `clientToken` | No | The account security token, required only if you enabled it in Z-API. |
| `sessionDuration` | No | Session lifetime, in seconds. Three hours by default. |

The assistant receives text, images with their captions, and audio. Other message types, such as documents, videos, stickers, and locations, are ignored without a reply. Messages sent by the connected number itself are ignored, as are webhooks for another instance.

### Evolution API

1. On your [Evolution API](https://doc.evolution-api.com/) server, create an instance and connect your WhatsApp number to it.
2. In the chat client, open the Evolution API integration and fill in the server URL, the instance name, and the API key. Save.
3. In the instance webhook settings, set the AIVAX webhook URL, enable the `MESSAGES_UPSERT` event, and leave **Webhook by Events** and **Webhook Base64** disabled.

| Field | Required | Description |
|---|---|---|
| `endpointUrl` | Yes | The base URL of your Evolution API server. |
| `instanceName` | Yes | The name of the instance connected to WhatsApp. |
| `apiKey` | Yes | The API key that AIVAX uses to call your server, sent in the `apikey` header. |
| `sessionDuration` | No | Session lifetime, in seconds. Three hours by default. |

Evolution API has the widest support for incoming messages: text, images, audio, videos, PDF documents, and stickers. Other document types get a reply asking the user to resend the content as text, an image, audio, or a PDF. Messages sent by the connected number itself are ignored.

### Kapso

1. In [Kapso](https://kapso.ai/), connect your WhatsApp Business number and copy its **phone number ID**, the ID of the number in the WhatsApp Cloud API, not the phone number itself. Create a project API key.
2. In the chat client, open the Kapso integration, fill in the fields, and save.
3. In Kapso, create a webhook for the phone number with the AIVAX webhook URL and subscribe it to `whatsapp.message.received`. Set a secret key on the webhook and enter the same value in **Webhook secret key**.

| Field | Required | Description |
|---|---|---|
| `apiKey` | Yes | The Kapso project API key. |
| `phoneNumberId` | Yes | The WhatsApp phone number ID of the connected number. |
| `webhookSecretKey` | No | The secret of the Kapso webhook. When set, requests with an invalid signature are rejected. Recommended. |
| `continuedMessagesTemplateId` | No | The name of the WhatsApp template used for [scheduled messages](#scheduled-messages-on-whatsapp-business). |
| `sessionDuration` | No | Session lifetime, in seconds. Three hours by default. |

The assistant receives text, images and stickers, audio, videos, PDF documents, and replies to interactive buttons and lists. For audio without a file, the Kapso transcription is used. Other document types are sent to the model as a link when `uploadUnsupportedFiles` is enabled in the chat client; otherwise the assistant tells the user the format is not supported. Locations, reactions, and contacts are ignored. Messages from users who have no phone number in the webhook are ignored.

## Webhook URLs

Each integration has its own webhook URL, which you copy from the integration settings in the dashboard. The URL contains a webhook key generated for that integration, so treat it as a secret.

Use **Rotate webhook key** to replace the key. The previous URL stops working immediately, so update the URL in the provider right after rotating. For Telegram, rotating the key also updates the bot hooks.

Some providers can also prove that a request came from them:

- **Telegram:** **Update hooks** registers the webhook with a secret token, and messages without it are rejected.
- **Kapso:** set **Webhook secret key** to the secret of your Kapso webhook. Requests whose signature doesn't match are rejected.
- **Z-API** and **Evolution API:** these providers don't sign webhook requests, so the webhook key in the URL is what authorizes them.

Webhook URLs without a webhook key keep working until December 1st, 2026. After that date they are rejected. Copy the current URL from the dashboard and update it in the provider, or use **Update hooks** for Telegram, before that date.

## Commands

Users can send two commands in any integration:

- `/reset`: clears the conversation history and starts a new [conversation](managing-sessions.md#conversation-token) in the same session.
- `/usage`: when `debug` is active in the chat client, shows the current chat usage in tokens.

## Message behavior

These chat client options adjust how the assistant behaves in messaging apps:

| Option | Default | What it does |
|---|---|---|
| `messageDebounceInterval` | 5 seconds | How long AIVAX waits after a message before replying, so several quick messages are answered together. |
| `splitAnswerIntoMessageChunks` | Off | Sends a reply as several shorter messages, split by topic, with a short pause between them, instead of one block of text. Replies are not streamed while it is on. |
| `showToolCalls` | On | Sends a short progress message while the assistant uses tools. |

When a user sends a message while a reply is still being generated, AIVAX passes it to the running inference, so the assistant can take it into account without waiting for a new turn. `/reset` and `/usage` are always handled on their own.

## Scheduled messages

Scheduled messages let the assistant write to the user first, at a set time: a reminder the user asked for, a follow-up on an open order, or a daily check-in. They are available only in integrations, not in the web client.

Enable `allowScheduledContinuations` in the chat client. The assistant then gets tools to schedule a single message for a date and time, create a recurring task with a cron expression, list what is scheduled for the current user, and cancel it. The assistant decides when to use them, based on the conversation and the gateway instructions. Describe in your instructions when scheduling is appropriate, such as only when the user asks for a reminder, to avoid unwanted messages.

Times are interpreted in the gateway time zone, set in `parameters.timeZone`, unless the assistant includes an explicit UTC offset. Recurring tasks also follow that time zone. See [Current date and time](/docs/tools/builtin-tools.md#current-date-and-time) for how the time zone is configured.

### What happens at the scheduled time

When a message is due, AIVAX runs a new inference with the same AI Gateway and the user's conversation history, together with the reason and context the assistant saved when scheduling. The assistant then writes the message and sends it through the same channel.

- **The assistant can decide not to send it.** If, given the conversation, the message is no longer needed, the assistant can skip it and nothing reaches the user.
- **Timing is approximate.** Messages are sent within a few minutes of the scheduled time. A message that cannot be sent long after its time is marked as failed.
- **The session can be new.** If the user's session expired, the scheduled message starts a new session without the previous history.
- **It is billed as a normal inference** on the account that owns the chat client. If the account has no available balance at that time, the message is not sent.
- **Long replies are sent as one message.** `splitAnswerIntoMessageChunks` does not apply to scheduled messages.

### Inactive users

`maxScheduledIgnoredZone` stops the assistant from writing to users who stopped talking to it. When a scheduled message is due, AIVAX checks when the user last sent a message. If it was longer ago than this interval, the message is skipped. The default is 3 days; `0` turns the check off.

For example, with the default, if the user last wrote on Monday at 10:00, a message scheduled for Thursday at 09:00 is sent, but one scheduled for Thursday at 11:00 is skipped. A recurring task keeps its schedule, and its messages are sent again once the user writes back.

### Scheduled messages on WhatsApp Business

WhatsApp only accepts free-form messages from a business within 24 hours of the user's last message. After that, the business must use an approved message template. Z-API and Evolution API do not use templates, so a scheduled message sent outside that window may not be delivered, depending on the number and the provider.

With Kapso, set `continuedMessagesTemplateId` to the name of an approved template. When it is set, scheduled messages are sent through that template:

- The template must be in Portuguese (Brazil), `pt_BR`, and have one body variable named `text`, which receives the message written by the assistant.
- Line breaks and long spaces in the message are replaced by single spaces, because WhatsApp doesn't accept them in template variables. Keep scheduled messages short.
- Images in the reply are still sent as regular images.

Without a template, Kapso sends scheduled messages as plain text, which only works inside the 24-hour window.

### Review and cancel scheduled messages

Users can ask the assistant to list or cancel their scheduled messages. You can also review them per chat client in the API reference: **List Hook Schedules** shows pending messages, recurring tasks, and users who stopped replying to scheduled messages. **Get Schedule** shows the outcome of a message, including when it was skipped, and **Cancel Schedule** and **Cancel Recurring Task** remove it. Scheduled messages and recurring tasks are deleted together with their chat client.
