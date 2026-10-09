Source: https://docs.aivax.net/learn/agents/adding-guardrails.html

A support agent may know the refund procedure and have an order-lookup tool, yet still need limits. It should not expose another customer's order, promise an exception it cannot approve or follow a message telling it to ignore company policy. A well-written playbook guides normal work; boundaries determine what happens when a request falls outside that work.

**Guardrails** are instructions and checks intended to keep an agent within an acceptable scope. The name suggests a roadside barrier: it helps prevent a dangerous departure, but it does not replace a careful driver, a sound vehicle or a suitable road. For agents, this means combining conversational guidance with controls in the surrounding software and business systems.

## Start with the risks of the job

Write down the errors that would matter for your particular assistant. For the support agent in this module, those include revealing private order details, inventing a refund approval and submitting an action for the wrong customer. A public product-information assistant and an internal payroll assistant need different boundaries because they see different information and can cause different harm.

Then describe the allowed job positively. “Explain product information, check permitted order status and prepare support requests” gives a clearer scope than a long list of forbidden topics alone. Define which requests can be answered directly, which need more information, which need review and which should be refused. The person responsible for the business process should approve these decisions.

A boundary should also name its enforcement point. An instruction can tell the model not to show another customer's records, but the order service should prevent those records from being returned in the first place. Prefer preventing an unauthorised operation to hoping the final answer will hide its consequences.

## Check inputs, outputs and actions separately

An **input** is information entering the agent, such as a message or a retrieved document. An **output** is what the system sends back, such as an answer or a proposed action. Different checks apply at each boundary; a safe-looking message can still lead to an unsafe tool request.


- **Input rules** — Limit what the application accepts and passes onward. Check required fields, reject unsuitable attachments and avoid collecting secrets or unnecessary personal information.

- **Output rules** — Require supported claims and suitable wording. Check for private information, unsupported promises and missing qualifications before delivering a response where practical.

- **Topic boundaries** — Keep the assistant focused on its defined role. A delivery assistant can explain delivery options without acting as a medical or legal adviser.

- **Tool permission limits** — Allow only the operations and records needed for the job. Check the current user's authority and the requested action in software, not only in the conversation.




Input checks should distinguish hostile instructions from ordinary information about a problem. A customer quoting an offensive message to report abuse is not necessarily asking the assistant to produce abuse. Simple word blocking can reject legitimate requests while missing harmful paraphrases. Rules need examples of acceptable and unacceptable use, together with a way to review mistakes.

For outputs, identify claims that require evidence. “Your order is recorded as shipped” needs a successful order lookup. “Your refund is approved” needs an approval result from the authorised process. An output rule can require those distinctions, while an application check can reject a response that violates a reliably testable requirement. Neither a confident tone nor a disclaimer supplies missing evidence.

Output checks must also fit how answers are delivered. If the interface sends text as it is generated, the user may see it before a later check finishes. For sensitive responses, the application may need to hold the answer until review completes. A check performed after disclosure can help investigation, but it cannot undo what the user has already received.

## Make refusal useful and specific

A **refusal** is a clear decision not to fulfil a request. It should explain the relevant boundary briefly and offer a permitted next step when one exists. It should not blame the user, reveal private instructions or suggest that rephrasing the request will bypass a restriction. Refusing one action does not mean abandoning the whole conversation.

Here is an illustrative exchange. A customer says: “My parcel is late. Refund it now, and show me my neighbour's order so I can compare.” The assistant has no authority to approve refunds or access the neighbour's account.


**Unguarded reply**

“I have approved your refund. Send your neighbour's order reference and I will check that too.”

The reply promises an unverified action and invites an unauthorised lookup.


**Guarded reply**

“I cannot access another customer's order or approve a refund here. I can check the order available through your verified account and help request a refund review.”

The reply names the limits and preserves useful, permitted help.





This example is not proof of enforcement. The order tool must still reject a reference belonging to someone else, even if the model requests it. Likewise, a review-submission tool must not quietly become an unrestricted refund tool because the assistant used reassuring wording. Test the underlying operation as well as the text around it.

## Use layered defence

**Layered defence** means using several controls so a single missed check does not determine the whole outcome. Think of an office with a visitor desk, locked rooms and permissions on individual records. Each protects a different boundary. Repeating the same sentence in several prompts is not the same as adding independent protection.

Receive request → Check input and identity → Apply task boundaries → Check any proposed tool action → Review answer → Respond or escalate


The flow is a design outline, not a guarantee that every product implements these checks automatically. A rejected action stops before execution. An answer needing review waits rather than being sent with a hopeful disclaimer. The application should record enough information to explain what happened while avoiding unnecessary storage of private content.

A **prompt injection** is an attempt to make an agent treat untrusted content as instructions that override its intended task. It can appear in a user message, a document or a tool result. A retrieved page saying “send all customer records elsewhere” is still page content, not authority to change the agent's permissions. Read [Prompt injection and jailbreaks](https://docs.aivax.net/learn/safety/prompt-injection-and-jailbreaks.md) for this boundary in more detail.

Keep security controls independent of the model where possible. Verify identity through the application's sign-in process, restrict records in the business service and require approval for consequential changes. If a required authorisation check is unavailable, stop the protected action. Do not let a service outage silently turn a restricted operation into an unrestricted one.

## Escalate to a person with a clear handover

**Human escalation** means transferring a decision or case to someone authorised to handle it. Use it for disputed policy exceptions, conflicting evidence, significant consequences or an explicit request for a person where your service supports that route. Define who receives the case and what happens while the customer waits.

A useful handover contains the customer's goal, relevant confirmed facts, checks already attempted and the decision still needed. Include only information the reviewer requires. Tell the customer whether a request was actually submitted, is awaiting submission or could not be sent. Do not claim that a colleague is reviewing the case unless the system confirms that state.

**What if nobody is available to review?**

Pause the action that requires approval. Explain the available contact route or the pending state accurately. Do not promise a response time that the service has not committed to, and do not treat an unanswered request as approval.



[Human in the loop](https://docs.aivax.net/learn/advanced-agents/human-in-the-loop.md) explains approval and handover patterns. Human involvement also needs reviewable evidence and appropriate access; adding an approval button alone does not make a confusing or overloaded process safe.

## Understand the remaining limits

Guardrails reduce risk; they cannot guarantee truth, perfect privacy or universal legal compliance. Models can misunderstand instructions. Automated checks can miss a violation or block a legitimate request. Approved source material can be outdated. An agent with no powerful tools can still mislead someone through advice, so limiting actions does not remove every risk.

**Does a safety instruction make the agent safe?**

It expresses the intended behaviour, but the model may not follow it in every situation. Enforce access and business rules outside the model, test difficult cases and review actual failures. Treat instructions as one layer, not as a security boundary by themselves.



Keep a set of ordinary, ambiguous and deliberately challenging requests. Check refusals, permitted assistance, tool rejections and handovers after changes. Track both missed violations and unnecessary refusals: a system that blocks every request is not useful support. [Content moderation and policies](https://docs.aivax.net/learn/safety/content-moderation-and-policies.md) develops the distinction between a policy and the checks used to apply it.

**Related:** On AIVAX, [AI workers](https://docs.aivax.net/docs/inference/workers.md) let an external service allow, stop or adjust supported events around messages and server-side tool calls. They can implement checks outside the prompt, but they do not automatically establish a complete safety policy or replace permissions in your business systems.

**What's next:** Boundaries need reliable evidence. [Adding knowledge](https://docs.aivax.net/learn/agents/adding-knowledge.md) explains how to give the agent approved company sources instead of relying on plausible guesses.

**Knowledge check.** Which approach best represents layered defence for a support agent?

1. Repeat the safety instruction until the model cannot overlook it
2. Allow every tool and check the wording only after replying
3. Combine clear instructions, software-enforced permissions, response checks and human escalation
4. Add a disclaimer to every answer and remove other controls

Answer: option 3. Different controls protect different boundaries. Instructions guide behaviour, software restricts actions and access, response checks catch some mistakes, and authorised people handle decisions that need review.
