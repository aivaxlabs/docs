---
title: Dynamic context
linkTitle: Dynamic context
description: "Give an agent current, authorised facts about a conversation without confusing them with durable knowledge or permanent memory."
weight: 80
duration: 12
objectives:
  - Distinguish shared knowledge from facts supplied for a particular conversation.
  - Explain how tools and preparation steps supply current context.
  - Manage freshness, privacy and missing information in runtime data.
  - Choose relevant facts within a limited context budget.
---

The Trail Lamp handbook explains warranty conditions. It cannot tell a support agent which lamp the current customer bought, whether a replacement order is still open or whether their service plan changed this morning. Those facts live in business systems, and they may change while the conversation continues.

**Dynamic context** is information supplied to an agent for the current interaction, rather than fixed permanently in its instructions or shared knowledge. Think of a receptionist reading an appointment list before greeting a visitor. The employee handbook still applies, but the appointment list explains who this visitor is and what is happening now. The agent needs both kinds of information, kept distinct.

## Separate the handbook from the current case

**Static knowledge** means relatively durable reference material: approved policies, product manuals and procedures. Static does not mean “never updated”. It means the material is maintained as shared knowledge rather than assembled specifically for this conversation. Dynamic context answers questions such as who the verified customer is, which plan they currently hold and which order they are asking about.

The same topic can require both. A policy explains what a service plan includes; a current account record establishes which plan the customer has. The policy cannot establish membership, and the account record cannot explain every exception in the policy. An accurate answer combines the relevant evidence without pretending that either source does the other's job.

{{< compare >}}
{{< side title="Shared knowledge" >}}
The approved Trail Lamp support guide describes warranty conditions and the replacement process.

It applies across relevant conversations and changes through document maintenance.
{{< /side >}}
{{< side title="Dynamic context" >}}
The verified customer's current account record shows their plan and an open replacement order for the Trail Lamp.

It applies to this customer and may need another lookup before the next answer.
{{< /side >}}
{{< /compare >}}

For the broader idea of supplying useful information to a model, revisit [Adding context](../agents/adding-context.md). Here the emphasis is on **runtime**, the period when the system is actually handling a request. Runtime facts should be selected, checked and supplied at that moment rather than copied into a general instruction document for everyone.

## Decide where each fact comes from

A **tool** is a controlled operation the agent can request, such as looking up an order. The application executes it and returns a result. A **pre-step** is application work performed before the model receives the request, such as loading the signed-in customer's current plan. Both can supply context; the difference is when and why the lookup happens.

A pre-step suits facts almost every conversation needs. A tool suits details needed only after the question is understood. Loading all orders before a simple product question adds unnecessary information. Waiting for the model to request a verified identity on every message may be equally unnecessary when the application already has an authenticated session, meaning a sign-in state whose identity the system has checked.

{{< cards >}}
{{< card title="Customer identity" icon="user" >}}
Use the application's verified sign-in context. A name typed into chat is not proof of account ownership.
{{< /card >}}
{{< card title="Current plan" icon="briefcase" >}}
Read the authorised account system. Keep the current plan separate from the policy explaining its benefits.
{{< /card >}}
{{< card title="Open orders" icon="tools" >}}
Look up orders within the verified customer's permitted scope. Ask which order matters if several could match.
{{< /card >}}
{{< card title="Today's date" icon="time" >}}
Supply the date from the application and the relevant time zone. The model should not guess what “today” means.
{{< /card >}}
{{< /cards >}}

Do not use the conversation as a shortcut around permissions. “I am the account owner” remains a user statement until the application verifies it. Similarly, a tool response containing a customer's free-text note is still user-authored content inside a system response. Keep it separate from trusted account fields and do not treat instructions inside the note as authority to change agent behaviour.

Related: on AIVAX, [AI Workers](../../docs/inference/workers.md) can enrich or rewrite gateway context at runtime through an external service. They can support account checks and system-provided facts, but the surrounding service must validate requests and enforce permissions. A worker adds another step before the answer, so its reliability and response time matter.

## Make current facts visible in the conversation

Dynamic context need not be shown verbatim to the user. The model needs enough information to answer, while the user needs a clear result and any important limitation. Separate instructions about behaviour from facts about the current case. “Explain uncertainty” is an instruction; “replacement status is awaiting dispatch” is a fact from a particular source at a particular time.

{{< demo name="conversation" title="Try it: answer from a current order lookup" config=`{"messages":[["system","Use the current authorised order result. Do not invent a dispatch date."],["user","Has my Trail Lamp replacement shipped?"],["tool","Authorised order lookup for the signed-in customer: replacement awaiting dispatch. Checked for this request. No dispatch date available."],["assistant","Your replacement is awaiting dispatch. The current order record does not provide a dispatch date."]]}` >}}
Step through this fictional exchange. The tool result supplies the current state; the assistant does not turn the missing date into a promise. This demo is a prepared example, not a live order lookup.
{{< /demo >}}

Notice that the handbook alone could not answer the question. It could explain the replacement process, but the current order record is needed to describe this replacement. Equally, “awaiting dispatch” does not prove the package will leave tomorrow. Dynamic context narrows uncertainty; it does not justify filling remaining gaps with plausible details.

## Give changing facts an expiry policy

**Freshness** describes how recently information was checked and whether it is still suitable for the decision. An order status may need checking again after the customer asks the agent to cancel it. A language preference may remain useful throughout the conversation. There is no single refresh interval that suits every fact.

Record the source and when a fact was retrieved. Where available, also record when the source itself was last updated. A fresh lookup can still return an old business record. Decide what changes should trigger another lookup: a completed action, a new day, a customer switching accounts or a question requiring a more current answer.

“Today” needs special care around midnight and across time zones. A delivery deadline should use the relevant business or customer time zone, not an unexplained server date. If the correct time zone is unknown and the distinction matters, ask or state the uncertainty instead of presenting a precise deadline.

When a lookup fails, do not quietly reuse an old value as though it were current. Distinguish “no open orders” from “the order system could not be checked”. For a general explanation, the agent may still use the handbook. For an action depending on current eligibility, stop or route to a person when the required verification is unavailable.

## Protect privacy and the available space

**Data minimisation** means supplying only information needed for the task. A delivery-status answer rarely requires payment details, a complete address or the customer's entire support history. Restrict access before selecting data, then remove unnecessary fields before they reach the model. Instructions saying “do not reveal this” are not a substitute for avoiding unnecessary disclosure in the first place.

A model's **context window** is the limited amount of information it can consider in a request. **Tokens** are the text pieces used to measure that space. Instructions, retrieved passages, conversation history and dynamic facts all compete for room, and the application must also leave room for the answer.

{{< demo name="context" title="Try it: a context budget (illustrative)" config=`{"blocks":[["Instructions",400,"#7a3fd1"],["Warranty evidence",1200,"#1a7f37"],["Old conversation",900,"#0b6bcb"],["Current order facts",300,"#7f2942"],["New question",200,"#735c0f"]]}` >}}
These token quantities are illustrative, not a product limit. Reduce the available space and see which blocks disappear. This simplified demo drops the oldest blocks first and keeps the last one; it does not represent a recommended production policy.
{{< /demo >}}

A real application should deliberately preserve required instructions and the evidence needed for the current decision rather than blindly discard the oldest block. Prefer a compact, accurate record over a full account export. Do not shorten “awaiting dispatch; no confirmed date” to “dispatch soon”, because that saves space by inventing certainty.

Dynamic context is also not automatically permanent memory. Some facts should disappear when the request or session ends. Persisting information for later conversations requires a separate purpose, retention decision and permission model, as explained in [Memory](../prompt-engineering/memory.md). Even when an old fact is remembered, check it again before relying on it for a changing account state.

What's next: organise instructions, evidence and the current task in [Anatomy of a prompt](../prompt-engineering/anatomy-of-a-prompt.md).

{{< quiz options="Copy the last known order status into every future conversation | Read the current authorised order record and explain any missing information | Infer shipment from the general delivery policy | Load every customer's orders so the model can find the right one" answer="2" explanation="Current order status is dynamic context. It needs an authorised lookup, enough freshness for the task and an honest distinction between missing data and confirmed facts." >}}
A signed-in customer asks whether an open replacement order has shipped. What should the agent rely on?
{{< /quiz >}}
