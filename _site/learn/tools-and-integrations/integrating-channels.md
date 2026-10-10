Source: https://docs.aivax.net/learn/tools-and-integrations/integrating-channels.html

A customer may start a question in a website widget, send a photograph through WhatsApp and later call for an update. To the customer, these are different ways to reach the same business. To the software, they are different connections with different rules. Integrating channels means joining those experiences deliberately, not simply forwarding every message to the same model.

A **channel** is a medium through which a person communicates with an assistant, such as web chat or voice. You can share an agent's knowledge, business rules and authorised tools across channels while changing how it receives information and presents answers. Think of a service desk staffed through a counter, a telephone and a mailbox: the policy should be consistent, but the conversation should not sound identical everywhere.

## Separate the agent from the channel

The shared part of the agent decides what the business knows and permits. A **channel adapter** is the software that translates between the channel's message format and the agent application's format. It receives incoming messages, handles attachments and sends replies in a form the destination supports.

That adapter is also where delivery realities become visible. A messaging platform may reject an outgoing message; a browser tab may close; an audio connection may break. A generated answer is not necessarily a delivered answer. Preserve the difference between prepared, sent and confirmed delivery where the channel exposes that information, and do not promise confirmation a channel cannot provide.

- **Shared behaviour** — Keep business policy, knowledge sources, tool permissions and escalation rules consistent. A refund should not become easier to obtain just because the customer changes channels.

- **Channel presentation** — Adapt length, formatting, attachments and pacing. A spoken answer needs different structure from an e-mail summary or a web comparison table.

- **Conversation state** — Track the current exchange, verified identity and unresolved work. Share only the information that is appropriate for the destination and authorised user.

One shared agent does not require one unrestricted conversation history. An internal employee channel may expose tools that a public website must never offer. A family member using a shared phone may not be entitled to another person's records. Reuse the underlying behaviour while preserving different access boundaries.

## Design for how people use each channel

**Latency** means the delay between an input and its useful response. **Media** means content beyond ordinary text, such as images, documents or audio. Both change expectations: a photograph may need interpretation, while someone on a live call cannot comfortably wait through a long silent search.

**WhatsApp**

Prefer short, readable messages and a clear next question. People may send several fragments, images or voice notes instead of one complete request. Handle these as parts of a conversation rather than starting unrelated tasks for each fragment. Outgoing messaging must also respect the provider's current delivery, consent and template rules where applicable.

**Web chat**

Use the page context carefully and support readable links, buttons or lists when the widget allows them. Explain attachment limits before upload. Browser refreshes, closed tabs and anonymous sessions need deliberate recovery behaviour; a returning visitor is not automatically a verified customer.

**E-mail**

Write self-contained replies with a clear subject, short summary and explicit next action. Long quoted histories can contain stale instructions and unrelated information. Preserve the conversation thread without treating a visible sender address or a forwarded signature as proof of account ownership.

**Voice**

Use short sentences, allow interruptions and confirm critical details. Read back ambiguous names, dates or amounts before acting. Tell the caller when a lookup will take time. A voice note processed later is different from a live conversation that must keep responding as people speak.

These differences should affect the response, not the underlying facts. A long policy can become a concise spoken explanation with an offer to send the details. It should not become a different policy. Likewise, unsupported formatting needs an intentional alternative: a table may become a short list, rather than unreadable fragments in a channel that does not render tables.

**Copy the same output everywhere**

Send a dense comparison table to a live voice session, or split a formal e-mail into many chat-sized fragments. The content may be accurate, but the customer has to reconstruct it.

**Preserve meaning, adapt the delivery**

Speak the main recommendation and ask whether the caller wants details. Use a compact list in messaging and a complete, structured explanation in e-mail. Keep conditions and uncertainty intact.

## Make waiting understandable

An immediate acknowledgement is different from an answer that completes the task. “I am checking the order” is useful only if the system is actually doing so and will return with a result or a failure. Avoid repeating empty progress messages while nothing changes. For longer work, agree how the customer will receive the outcome if they leave.

**Illustrative targets for a first useful response**

| Item | Value |
| --- | --- |
| Live voice | 2 seconds |
| Web chat | 8 seconds |
| WhatsApp | 30 seconds |
| E-mail | 300 seconds |

Invented planning targets for one support scenario, not measured averages or channel guarantees. A first useful response may acknowledge real work; final resolution can take longer. Set targets from your customers and service commitments.

The chart is a discussion aid, not a rule for how long an organisation should take. A critical e-mail can require faster attention than a routine chat. Measure the delay customers actually experience, including media processing, tool calls and delivery. A model that starts writing quickly does not solve a slow external lookup by itself.

For voice, the application may turn speech into text and text back into speech, or use a realtime audio service that exchanges audio continuously. Either approach must handle misunderstandings. A transcript is an interpretation of sound, not a verified statement of intent. Ask for confirmation before acting on an uncertain address or consequential instruction.

## Connect sessions without mixing people

A **session** is a bounded conversation with its own history and state. An **identity** is the person or account the application has verified. These are related but not interchangeable. One customer can have several sessions, and a shared device can be used by several people. A persistent chat history alone should not grant access to private records.

Receive message → Find channel session → Verify identity when needed → Apply shared agent rules → Format and deliver reply

Use a stable internal reference to connect a verified person to the correct account. Do not merge histories solely because display names match. A phone number, e-mail address or browser identifier can help find a conversation, but the degree of verification needed depends on the sensitivity of the action. Reading public opening hours needs less assurance than changing a delivery address.

When a customer moves from web chat to messaging, explicitly decide what transfers. A short case summary and reference may be enough; the entire conversation may contain private attachments that should not appear on the new device. Explain any required verification without making the person repeat every non-sensitive detail. Continuity should reduce effort without weakening account security.

## Hand over ownership, not just text

**Human handover** means transferring responsibility for a case from the automated assistant to a person. It is more than generating “Someone will contact you.” The system needs a destination, a case record and a clear state indicating who should respond next. If the destination is unavailable, explain the real alternative rather than pretending the transfer succeeded.

A useful handover summary includes what the customer wants, which facts were verified, what tools already did, what remains unresolved and why help is needed. Keep uncertain interpretations labelled as uncertain. The receiving person should not have to guess whether the assistant merely proposed a refund or actually issued one.

While a human owns the conversation, prevent the assistant from sending competing replies or continuing consequential actions in the background. Define how the conversation returns to automation and tell the user when that happens. Test an explicit request for a person, a failed tool call and an interrupted conversation in each channel, not just the happy path on the website.

Attachments deserve their own channel checks. A customer may send an unreadable photograph, a very long recording or a document type the adapter cannot accept. Explain the specific limitation and offer an accessible alternative, such as pasting the relevant text or speaking to a person. Do not silently omit an attachment and then answer as if it had been reviewed. Where information is extracted from media, retain the distinction between what the customer supplied and what the system inferred. Test these cases on the actual channel: an attachment that works in a development screen may arrive differently through a messaging provider or mobile browser.

**Related:** On AIVAX, [chat clients](https://docs.aivax.net/docs/features/chat-clients.md) provide a session layer and supported channel integrations around a gateway. [Voice Session](https://docs.aivax.net/docs/inference/voice-session.md) covers live audio conversations; [speech generation](https://docs.aivax.net/docs/generations/speech.md) turns prepared text into audio, and [audio transcriptions](https://docs.aivax.net/docs/generations/audio-transcriptions.md) turn recordings into text. E-mail in this unit is a general integration pattern, not a claim of a built-in e-mail channel.

What's next: move beyond user messages to [webhooks, events and automations](https://docs.aivax.net/learn/tools-and-integrations/webhooks-events-and-automations.md).

**Knowledge check.** What should remain central when one agent serves several channels?

1. Use one shared history for anyone with the same display name
2. Keep business rules consistent, adapt presentation and verify identity before joining private context
3. Give every channel the same tools and permissions
4. Treat a generated reply as proof of successful delivery

Answer: option 2. Channel integration should preserve policy while adapting the experience. Session matching, verified identity, permissions and actual message delivery each need explicit handling.
