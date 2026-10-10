Source: https://docs.aivax.net/learn/guides/sales-qualification-agent.html

A visitor asks whether a service can help their business. A useful sales agent helps them understand the fit and, if they want, reach the right person. It is not a machine for extracting contact details at any cost. This guide follows a fictional company, Fieldwork Scheduling, which sells appointment-management software to small organisations.

A **lead** is a person or organisation that has expressed possible interest. **Qualification** means learning enough about their needs to suggest a sensible next step. A **CRM**, or customer relationship management system, stores sales records and follow-up activity. Think of the agent as a receptionist who can prepare a meeting brief, not a salesperson authorised to make every commercial promise.

## Define a useful outcome

Fieldwork wants interested visitors to receive an accurate explanation, an appropriate demonstration offer, or an honest statement that the service may not fit. The agent must not invent discounts, promise features, or claim a deadline that does not exist. “No, thank you” is a valid outcome, not a failure to overcome.

Separate three responsibilities before writing the first instruction:

- **Inform** — Answer from approved product information, including known limitations. Let visitors read about the service without requiring their details first.

- **Qualify** — Ask only questions that change the recommendation. Record uncertainty rather than filling gaps with guesses about a visitor's business.

- **Connect** — Offer a human conversation when the visitor wants one. Prepare a concise, confirmed summary instead of making them repeat the whole exchange.

A **conversion** is a defined next step, such as an agreed demonstration. Define it explicitly: sending a calendar link is not the same as booking a meeting, and a booking is not a sale. Otherwise the dashboard can reward activity that creates no benefit for either party.

## Build the conversation around the visitor

1. **Explain the role and ask about the need**

Say that this is an automated assistant. Ask what the visitor is trying to improve: missed appointments, staff scheduling, or another problem. Answer their original question before starting an interview.

2. **Explore timing and budget gently**

Ask when they expect to make a change and whether they have an approximate budget range. Explain why the question helps. Allow “not decided” and “prefer not to say”.

3. **Summarise and check the facts**

Repeat the stated need, constraints, and requested next step. Ask for corrections. Distinguish the visitor's statements from the agent's interpretation.

4. **Propose a routing result**

Use an agreed rubric, a small set of scoring rules, to suggest information-only follow-up or a human sales conversation. Keep missing information visible.

5. **Approve, save, and hand over**

Ask permission to share the summary and confirm the intended contact method. Apply the business's required staff approval before the CRM write, then verify the result before saying it was saved.

Ask one question at a time and reuse answers already given. If someone says “We need this next month”, do not ask for timing again merely because it is next on a form. A conversational assistant should reduce effort compared with a form, not hide a long mandatory form inside chat bubbles.

The instruction draft can be simple: “Help visitors assess whether our documented service fits. Ask relevant questions without pressure. Do not infer personal characteristics, invent terms, or send follow-ups without the required permission. Record unknown answers as unknown. Offer a person when asked and respect a refusal immediately.”

> **Interactive demo: Example: qualification with an unanswered budget question.** This interactive demo is available on the web page. The visitor's request for a person takes priority over completing every qualification field. This example stops before the review and write, so it does not claim a record or booking exists.

## Score evidence, not people

A **lead score** is a prioritisation aid based on stated business facts. It is not a measure of a person's worth or a reliable prediction of buying behaviour. A **hot lead** simply means one that meets the company's documented readiness criteria and wants timely contact.

For this case, the rubric considers product fit, a concrete problem, and stated timing. Budget can improve the completeness of the brief but an unknown budget does not mean “unqualified”. A human should be able to read the same evidence and understand why the agent suggested its route.

| Evidence | Appropriate interpretation | Inappropriate shortcut |
|---|---|---|
| Visitor describes a supported need | Potential product fit | Guaranteed purchase |
| Visitor requests a near-term discussion | Prioritise an agreed response | Invent an urgent deadline |
| Budget is not disclosed | Mark the field unknown | Assume the organisation is poor |
| Visitor declines contact | End follow-up respectfully | Try another channel |

Avoid scoring from names, accents, disability, age, or other sensitive characteristics and unjustified proxies. A **proxy** is an indirect substitute, such as using a postcode to guess income. Review the rubric for unfair effects, particularly if it influences access to services or commercial terms.

Related: AIVAX [decision models](https://docs.aivax.net/docs/generations/decisions.md) can evaluate defined questions, while [structured responses](https://docs.aivax.net/docs/inference/structured-responses.md) provide a machine-readable output format. A valid structure only shows that the fields fit a required shape; it does not prove that the facts or recommendation are correct.

## Put approval before the write

A CRM write is an external action: it changes a business record. Keep the proposed summary separate from the saved record. The proposed data should include the visitor's stated need, unknown fields, approved contact method, and evidence for the routing recommendation. Avoid storing the entire chat when a short summary is sufficient.

Visitor confirms summary → Staff approves proposed record → Application validates permissions → CRM write → Verify saved result

Visitor agreement and staff approval serve different purposes. The visitor confirms what will be shared; the staff member checks whether the business should create or update that record. Neither automatically provides every legal basis needed for processing personal data. Establish the appropriate basis, privacy notice, retention period, and channel rules with the responsible team.

Read [Human in the loop](https://docs.aivax.net/learn/advanced-agents/human-in-the-loop.md) for approval design. The approval screen should show exactly what will change. If important fields change after approval, ask again rather than treating the old approval as unlimited permission.

**Pressure and hidden action**

“I need your phone number before I can answer. I have added you to our campaign because you seem interested.”

**Choice and a clear boundary**

“Here is the product information. If you want a sales conversation, I can prepare a summary for your review. You can also stop here.”

If the CRM request times out, the application may not know whether the write happened. Check for the existing result before retrying so the visitor does not become several duplicate leads. A **webhook** is an event notification sent from one system to another; it can trigger follow-up after a confirmed change. See [Webhooks, events, and automations](https://docs.aivax.net/learn/tools-and-integrations/webhooks-events-and-automations.md) for the connection pattern.

## Evaluate the funnel without rewarding pressure

A **funnel** shows how many people move through successive stages. Use clearly defined stages and the same observation period. The chart below is illustrative, not a conversion forecast or a claim about any product.

**Illustrative pilot funnel**

| Item | Value |
| --- | --- |
| Asked a product question | 100 visitors |
| Chose qualification | 64 visitors |
| Requested a human conversation | 28 visitors |
| Confirmed a meeting | 18 visitors |

Invented teaching data. Each stage is a subset of the previous one; declining to continue can be an appropriate outcome.

Review whether sales staff received accurate briefs, visitors understood the handover, and declined contact was respected. Track incorrect product claims, duplicate records, unwanted messages, and complaints alongside meetings. A rise in bookings accompanied by more pressure complaints is not an unqualified improvement.

Test missing budgets, contradictory answers, requests for unsupported features, withdrawal of contact permission, CRM failure, and an attempt to bypass staff approval. Pilot with reviewers available, define who owns each follow-up, and stop automated writes if approval or permission checks fail.

What's next: build an [internal knowledge assistant](https://docs.aivax.net/learn/guides/internal-knowledge-assistant.md), where the central question is who may see which information.

**Knowledge check.** A visitor will not share a budget but asks to speak to sales. What is the appropriate next step?

1. Guess a budget from the visitor's job title
2. Mark the budget unknown and offer the requested human handover
3. Refuse further help until every field is filled

Answer: option 2. Unknown information should remain unknown, and qualification should not block a reasonable request for a person or encourage sensitive guesses.
