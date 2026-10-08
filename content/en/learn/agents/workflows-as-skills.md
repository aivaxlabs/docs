---
title: Workflows as skills
linkTitle: Workflows as skills
description: "Turn a recurring business procedure into reusable guidance with explicit steps, checkpoints, approvals, and a clear boundary between model judgement and software rules."
weight: 120
duration: 11
objectives:
  - Describe a workflow as a reusable business procedure.
  - Distinguish conversational flexibility from predictable process control.
  - Add prerequisites, checkpoints, and approvals to a workflow.
  - Decide when software should enforce a step rather than asking a model to remember it.
---

A useful agent should not invent a new customer-onboarding process every time a sale closes. It should know which information to collect, what to check, who must approve the setup, and when the customer can receive a welcome message. A **workflow** describes that sequence of work and the conditions for moving through it.

A workflow can be written as a reusable skill: a procedure the agent follows when a relevant task arises. Think of the difference between telling a colleague “help this customer” and giving them an onboarding checklist with clear responsibilities. Both require judgement, but the checklist preserves the steps the business cannot afford to forget.

## From a capability to a procedure

In [Adding skills](adding-skills.md), a skill is a reusable body of guidance for a particular kind of work. A workflow-shaped skill goes further than describing expertise. It says when to start, what information is required, which steps depend on earlier results, and what counts as finished.

For example, “write friendly welcome messages” describes a capability. “Check that the account is approved, confirm the contact channel, draft the welcome message, obtain review, then send through the authorised tool” describes a procedure. The procedure makes dependencies visible. A good message is not useful if it is sent before the customer's access exists.

A written procedure still leaves room for language judgement. The agent might explain a missing field in a friendly way or adapt a summary for a busy manager. What should remain stable is the business meaning: which checks happened, whether an approval exists, and whether the claimed action actually succeeded.

{{< compare >}}
{{< side title="Free conversation" >}}
The next step follows the user's questions and the information that emerges. Useful for exploration, explanation, and discovering requirements. Completion may be a satisfactory answer rather than a changed record.
{{< /side >}}
{{< side title="Defined workflow" >}}
The next step depends on a stated procedure and recorded progress. Useful for repeatable operations with required checks. Completion has explicit evidence, such as an approved setup and a confirmed result.
{{< /side >}}
{{< /compare >}}

Neither style should replace the other everywhere. A customer may need an open conversation to understand their options before starting onboarding. Once onboarding begins, the system should know which procedure is active and should not skip required checks merely because the conversation changes direction.

## Design the starting and finishing conditions

A workflow needs a **trigger**, meaning the event or request that starts it. “An authorised employee requests customer onboarding” is more specific than “a customer is mentioned.” It also needs prerequisites: facts or permissions that must already exist. For example, the agreement may need to be accepted before account creation is allowed.

Define the finish line before writing the middle. “Customer onboarded” can mean different things to sales, operations, and support. Decide whether the workflow ends at approved account creation, confirmed welcome-message delivery, or completion of a later training session. If a separate team owns that later stage, make the handoff explicit rather than claiming that all work is done.

Then separate mandatory steps from optional branches. A **branch** is an alternative path chosen under a stated condition. A customer who already has an account may need an access review instead of a new account. The workflow should check that condition rather than allowing the agent to create a duplicate because the main checklist says “create account.”

## A customer-onboarding example

The sequence below is illustrative and must be adapted to the organisation's actual policies. It is a design example, not a claim that any particular platform automatically performs these steps or grants these permissions.

{{< steps >}}
{{< step title="Confirm the request and prerequisites" >}}
Identify the authorised requester and the intended customer. Check that required business approval exists and look for an existing account.
{{< /step >}}
{{< step title="Collect and validate the setup details" >}}
Ask only for necessary information. Check required fields and resolve ambiguity before preparing a change.
{{< /step >}}
{{< step title="Present the proposed setup" >}}
Show the customer record, access level, and planned communication in a reviewable summary. Make missing information visible.
{{< /step >}}
{{< step title="Obtain the required approval" >}}
Record who approved which version of the proposed change. If important details change afterward, request a new approval.
{{< /step >}}
{{< step title="Execute and verify" >}}
Use authorised tools, inspect their results, and record what actually succeeded. Do not announce completion merely because a request was sent.
{{< /step >}}
{{< /steps >}}

The procedure should also say what not to do. If the approval is refused, stop rather than finding another route to the same change. If the customer record is ambiguous, ask for clarification rather than choosing the closest name. If a tool is unavailable, preserve the completed checks and explain which step remains open.

## Checkpoints are more than reassuring sentences

A **checkpoint** is a point where the process checks evidence before continuing. An approval is one kind of checkpoint, but others include validating a required field, confirming that a record exists, or checking the result of an action. “Make sure everything looks right” is not a useful checkpoint because it does not define the evidence needed.

For approvals, specify the decision, the authorised approver, and the proposed action. A customer's general enthusiasm is not approval to change a contract. A manager approving a draft does not necessarily authorise sending it to every contact. The [human-in-the-loop](../advanced-agents/human-in-the-loop.md) unit explains how to design human participation without making responsibility unclear.

{{< flow "Start with prerequisites | Prepare the work | Check evidence | Obtain approval | Execute | Verify completion" >}}

Record progress somewhere the application can reliably consult. This recorded **state** tells the system which steps are complete, pending, or failed. Conversation text alone is a fragile checklist: it can become long, be summarised, or contain contradictory statements. A reliable process should not forget an approval boundary because an earlier message is no longer visible to the model.

For a month-end closing workflow, this matters especially. One account may be reconciled while another still needs review. The workflow must preserve that distinction instead of restarting everything or reporting the whole close as complete. If the process resumes later, it should recheck any information that may have changed rather than assuming all earlier observations remain current.

## When to prefer deterministic execution

**Deterministic** means that the same defined inputs and rules lead to the same decision or action. Ordinary software can enforce that a total balances, a required field is present, or an approval exists before a write operation. A model is useful for interpreting varied language, but it should not be the only mechanism enforcing those rules.

A skill containing numbered steps is not automatically a deterministic workflow engine. It guides the model; it does not by itself guarantee step order, durable progress, or permission checks. For important procedures, combine the skill with application controls that enforce transitions and required approvals. The model can help draft and explain while the software controls whether the process may advance.

{{< accordion title="When is a written skill enough?" >}}
For a low-impact task such as drafting a meeting brief, reusable instructions and human review may be sufficient. The consequence of a missed step is limited and the output is easy to inspect. Still define what a complete draft should contain.
{{< /accordion >}}

{{< accordion title="When should software enforce the workflow?" >}}
Use stronger controls when steps change records, involve money, require regulated checks, or must resume after an interruption. Required approvals and business calculations should not depend only on the model choosing to follow a checklist.
{{< /accordion >}}

The [planning and reasoning loops](../advanced-agents/planning-and-reasoning-loops.md) unit explores cases where an agent decides its next move from observations. That flexibility is valuable for uncertain work. It is less appropriate when the business already knows the required sequence and needs evidence that each condition was met.

## How this maps to AIVAX

On AIVAX, [skills](../../docs/features/skills.md) hold reusable instructions. [Processing pipelines](../../docs/inference/pipelines.md) configure processing around model requests; they are not the same concept as a complete business approval process. Keep the business procedure and its required external controls explicit rather than assuming the word “pipeline” supplies them automatically.

[Batch](../../docs/features/batch.md) applies an AI workflow to many independent inputs in the background. It can suit tasks such as preparing separate summaries for many customers. It is not a substitute for a dependent sequence in which one customer's next step waits for another step's approval or result. Choose the execution mechanism according to the work's dependencies.

What's next: learn to express roles, limits, and procedures clearly in [Writing good prompts and instructions](writing-good-prompts-and-instructions.md).

{{< quiz options="A numbered skill automatically guarantees every approval is enforced | The model should decide whether required approvals are worth asking for | A skill guides the agent, while software should enforce important permissions and process checkpoints" answer="3" explanation="Written guidance helps the agent follow the procedure, but high-impact requirements need controls that cannot be skipped merely because a model produces a different next step." >}}
Which statement correctly describes a workflow written as a skill?
{{< /quiz >}}
