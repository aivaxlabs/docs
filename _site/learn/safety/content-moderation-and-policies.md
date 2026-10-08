Source: http://localhost:1313/learn/safety/content-moderation-and-policies.html

A customer types an angry complaint containing an insult. Another asks how to protect an account after receiving a threat. A simple blocked-word list might reject both messages. Yet one may need calm customer service and the other safety guidance. Content moderation works best when it understands the purpose of the request, not just the words it contains.

**Content moderation** is the process of deciding whether content can be accepted, generated or displayed under a policy. A **usage policy** states what a service permits, restricts and does when a boundary is reached. The policy is the rule; moderation is one way of enforcing it. Neither should be left entirely to whatever a model happens to answer.

## Check both sides of the conversation

**Input moderation** examines material before it reaches the model or another component. It can identify requests that require refusal, clarification or specialist handling. Include attachments and tool-provided material where relevant, not only the text box a user can see.

**Output moderation** examines the draft response before it reaches the user. Even a legitimate question can produce an inappropriate answer, an unsupported accusation or information the user should not receive. Checking only the input therefore leaves an important gap. The checks should fit the purpose and risk of the service rather than blindly applying the same rule everywhere.

User request → Input checks → Agent and permitted tools → Output checks → Answer or safe alternative

This simplified flow is not the whole security architecture. A tool might send an e-mail or change a record before a final answer exists. Those actions need separate permission and policy checks before execution. Blocking the final message cannot undo an already-completed action. [Adding guardrails](http://localhost:1313/learn/agents/adding-guardrails.md) explains how these controls fit around the agent.

For streamed responses, where text appears as it is generated, decide how required output checks work before release. A message that has already been shown cannot be made unseen by a later refusal. Depending on the risk, the application may need to check complete responses or verified portions rather than immediately displaying everything.

## Define more than prohibited content

A useful policy covers the agent's purpose as well as harmful material. A delivery assistant should not become a general medical adviser merely because a user asks politely. That is a **topic boundary**: the limit of the subjects and actions the agent is designed to handle competently.

- **Supported work** — State what the agent can answer and do. Examples include explaining published return rules or collecting information for an appointment.

- **Restricted work** — Identify requests that require refusal or human review, such as disclosing another customer's records or making an unsupported guarantee.

- **Audience conditions** — Define age restrictions, appropriate language and access requirements. Check the rules that apply to your service instead of assuming all users are adults.

- **Safe alternatives** — Describe what the agent should offer when it cannot complete a request: general information, a supported task or a route to a qualified person.

Some subjects are **regulated**, meaning laws or professional rules constrain how they may be handled. Medical care, financial services, legal advice and age-restricted products can require specialised controls. An agent's confident tone does not establish professional competence, and a disclaimer does not create permission to provide a service your organisation is not authorised to offer.

For children and young people, consider age-appropriate design, privacy, content and any required consent or verification. Do not collect identity documents merely because an assistant guessed someone might be young. Choose a proportionate, legally reviewed process suitable for the service and keep sensitive verification outside ordinary conversation where possible.

## Write rules people can apply

“Be safe” expresses an intention but does not settle difficult cases. A usable policy connects a request category to an action and a response. It identifies who owns the rule, what evidence matters, and when the agent should ask a person rather than improvise.

1. **Describe the service and audience**

Write a short statement of who the agent serves and which tasks it supports. Include channels and any age or professional restrictions relevant to the service.

2. **Define allowed and restricted cases**

Use plain examples, including borderline requests. Distinguish harmful assistance from legitimate reporting, education or requests for protection.

3. **Choose the response for each boundary**

Decide whether to answer, ask a clarifying question, refuse the unsafe part, route to a person or stop a repeated abusive session.

4. **Place enforceable checks**

Keep identity and action permissions in the application or connected service. Use content checks where interpretation is needed, with an explicit safe response when a mandatory check fails.

5. **Review and test the policy**

Assign an owner, document changes and test both prohibited requests and legitimate near-neighbours. Give users and staff a route to report mistaken blocks.

A **false positive** is a harmless request wrongly blocked. A **false negative** is a prohibited request wrongly allowed. Both matter. A policy that blocks every difficult conversation may look safe while making the service unusable for people who need help. Test realistic language, quotations, dialects and frustration, not only clean examples written by the policy author.

## Adapt the same structure to different industries

These examples are starting points for discussion, not ready-made legal policies. Each describes a boundary and a useful alternative. Your organisation should review the actual product, jurisdiction, audience and staff capability before turning them into operating rules.

**Retail support**

Explain published returns and help with the signed-in customer's order. Do not reveal another customer's purchase history or invent refund exceptions. Offer a human review when the case falls outside the published policy.

**Healthcare administration**

Help with opening hours and appointment logistics. Do not diagnose symptoms or choose treatment. Route clinical questions to an appropriate professional and follow a reviewed process for urgent situations.

**Financial services**

Explain approved product information within the service's permitted scope. Do not promise returns or present a personal recommendation as guaranteed advice. Route suitability and regulated decisions through the authorised process.

An internal assistant also needs a policy. Employees may legitimately discuss incidents, discrimination complaints or security threats in their work. Blocking the subject entirely could obstruct reporting. Instead, distinguish handling an authorised report from generating abuse or releasing restricted information. Access rights and confidentiality still apply even inside the organisation.

## Refuse the unsafe part, not the person

A useful refusal is brief, specific enough to explain the boundary, and followed by a safe next step. Avoid moral judgements, accusations and long descriptions of internal checks. Do not repeat sensitive information or unnecessarily restate harmful material in the refusal itself.

**Poor refusal**

“Request rejected. You violated our policy.” The user does not know which part cannot be completed or how to solve the legitimate problem.

**Helpful refusal**

“I can't share another customer's account information. If you need help with your own order, sign in through the support page, or I can explain how to contact our team.”

The better response protects the boundary without debating the user's character. It also avoids promising an action the agent cannot perform. If it cannot actually create a support ticket, it should provide the available contact route rather than announce that a person has been notified.

Handle abuse proportionately. An upset user describing poor service is different from someone repeatedly threatening staff or trying to misuse the system. Use a calm reminder when appropriate, limit repeated attempts according to a documented process, and involve trained staff for situations that require judgement. Do not automatically penalise an account solely because a model inferred hostile intent from ambiguous language.

## Keep policy connected to operations

Monitor mistaken refusals, harmful outputs that passed checks, appeal outcomes and incidents involving tools. Store only the detail needed for review, restrict access and set retention rules. When a policy changes, update the agent's instructions, application checks, staff guidance and evaluation cases together so they do not contradict each other.

Related on AIVAX: consult the [Terms of Use](http://localhost:1313/docs/legal/terms-of-service.md) for platform obligations. [AI workers](http://localhost:1313/docs/inference/workers.md) are external hooks that can allow, stop or modify parts of gateway execution. They can support application-specific controls, but they are not a substitute for designing and validating the complete moderation process.

What's next: learn how to explain boundaries and transfer responsibility in [Transparency and human escalation](http://localhost:1313/learn/safety/transparency-and-human-escalation.md).

**Knowledge check.** Which approach best balances useful service with enforceable boundaries?

1. Block every message containing an offensive word
2. Check only the final answer because that is all the user sees
3. Define contextual input and output checks, enforce action permissions and offer safe alternatives
4. Let each response invent its own policy based on tone

Answer: option 3. Moderation needs context and controls at the relevant points. Final-output checks cannot undo tool actions, and keyword blocking alone can reject legitimate complaints or safety reports.
