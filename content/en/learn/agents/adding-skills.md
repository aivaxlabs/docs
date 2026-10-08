---
title: Adding skills
linkTitle: Adding skills
description: "Package a repeatable way of working into a reusable skill, distinguish it from tools and knowledge, and keep it useful through review and testing."
weight: 60
duration: 12
objectives:
  - Distinguish a skill from a tool and a knowledge source.
  - Identify a recurring task that benefits from a reusable playbook.
  - Describe the instructions and boundaries a useful skill needs.
  - Plan how to version and test a skill used by several agents.
---

An experienced support adviser does more than know the returns policy. They know which question to ask first, when to check an order, how to explain an exception and when to involve a supervisor. Giving a new employee that method saves them from rediscovering it in every conversation. An agent can benefit from the same kind of playbook.

A **skill** is a reusable bundle of instructions for a particular kind of work. It describes how to approach a task, including the necessary checks and the expected result. A refund-review skill might guide the agent from a customer's request to a clear summary for a human reviewer. Attaching it does not retrain the underlying model or give the agent permission to issue refunds.

## Separate method, action and evidence

A useful way to distinguish the parts of an agent is to ask three questions: How should I work? What can I do? What information supports my answer? These questions often appear together in a conversation, but their answers belong in different places.

{{< cards >}}
{{< card title="Skill: the method" icon="list-check" >}}
A refund-review playbook says to clarify the request, consult the current policy, check the permitted order record and summarise unresolved points.
{{< /card >}}
{{< card title="Tool: the action" icon="tools" >}}
An order-lookup operation retrieves a record. A review-request operation submits a case. Software executes these actions and enforces access.
{{< /card >}}
{{< card title="Knowledge: the evidence" icon="book" >}}
The approved returns policy explains eligibility and exceptions. The skill tells the agent to consult it rather than guessing its contents.
{{< /card >}}
{{< /cards >}}

Think of a kitchen: the recipe describes the method, the oven provides a capability, and the ingredient label supplies facts. A recipe cannot heat anything by itself. Similarly, a skill that says “check the order” still needs an available, authorised lookup tool. If that tool is missing, the agent should explain the limitation rather than pretend that the check happened.

Some documents contain both facts and procedures. The distinction is their purpose, not their file format. Keep the reusable sequence in the skill and point to the authoritative policy for changing business rules. Copying every policy detail into every skill creates several places to update when the business changes its promise.

## Decide when a skill is worth creating

Create a skill when the same method will be useful repeatedly, particularly when it involves decisions that a short instruction leaves ambiguous. Examples include preparing a quotation, reviewing a refund request, or turning meeting notes into an internal handover. The aim is consistent handling, not a larger library of instructions.

A skill is less useful for a one-off wording change or a rule that must apply to every interaction. “Identify yourself as an assistant” belongs in the agent's standing instructions. “When drafting a quotation, separate confirmed requirements from assumptions” belongs in a focused quotation skill. Essential safety restrictions should not depend on whether the model remembers to load a specialist playbook.

The same refund-review skill can be attached to a website support agent and an internal service-desk agent. They can share the method while having different access. The public agent might collect a description and request review; the internal agent might also see authorised case history. Reuse does not mean sharing customer records or granting both agents identical tools.

## Write a playbook, not an aspiration

Start with a clear purpose and a description of when the skill should be used. This description acts like the label on a training folder: it must help someone choose the right folder before opening it. “Use when a customer requests a refund review” is more informative than “Excellent customer service.” Also explain when a closely related task belongs elsewhere.

{{< compare >}}
{{< side title="An aspiration" tone="bad" >}}
“Handle refunds professionally. Keep customers happy and resolve their issues quickly.”

This does not say what to check, what counts as resolution or when to stop.
{{< /side >}}
{{< side title="A usable method" tone="good" >}}
“Clarify the requested outcome. Consult the current policy and authorised order record. Explain what is confirmed. If an exception needs approval, prepare a review request without promising a refund.”
{{< /side >}}
{{< /compare >}}

The full instructions should identify the information required before proceeding, the sequence of checks, the tools that may help and the expected response format. Include what to do when information is missing or contradictory. A playbook that covers only the happy path leaves the agent to invent a procedure precisely when the situation becomes difficult.

For example, if the customer says an item arrived damaged but the order cannot be located, the skill should not treat the claim as proof of eligibility. It can ask for the permitted lookup information or explain the available review route. It should not request unnecessary sensitive information simply because more detail might be convenient.

## Adapt the method to the department

The following examples are illustrative playbook outlines, not complete business policies. Notice that each specifies a task and an end state rather than merely choosing a tone of voice.

{{< tabs >}}
{{< tab title="Support" >}}
**Refund review:** establish what the customer wants, consult the applicable policy, check the authorised order record and identify any approval requirement. Finish with confirmed facts, missing information and the next permitted action. Do not describe a review request as an approved refund.
{{< /tab >}}
{{< tab title="Sales" >}}
**Quotation drafting:** confirm the requested products, quantities and delivery needs. Obtain current commercial information from approved sources. Separate confirmed terms from assumptions and flag exceptions for review. Finish with a draft quotation; do not imply that drafting it accepts an order.
{{< /tab >}}
{{< tab title="Back office" >}}
**Invoice query:** clarify the discrepancy, compare the invoice with authorised supporting records and summarise the difference. Ask the responsible person to resolve missing evidence. Finish with a reviewable explanation, not an unapproved change to the accounting record.
{{< /tab >}}
{{< /tabs >}}

A good first draft usually comes from someone who already does the work. Ask them to explain the reasoning behind their decisions, not just the clicks they make. “Open this panel” is fragile if the screen changes. “Check whether a refund was already recorded before submitting another request” captures a business requirement that remains useful across interfaces.

## Keep shared skills versioned and tested

**Versioning** means keeping identifiable revisions of an instruction set so the team can see what changed and recover a previous approved version. Record an owner, the reason for each change and which agents use the skill. A shared playbook is valuable because it avoids duplication, but a mistake in it can also affect several agents at once.

Do not assume that changing the skill automatically updates every copy or attachment in every platform. Check how your system distributes changes. Before release, verify the instructions each affected agent will actually receive, alongside its available tools and standing rules. A playbook tested with an internal support agent may fail with a public agent that cannot access the same records.

{{< steps >}}
{{< step title="Draft with a task owner" >}}
Capture the purpose, prerequisites, decision points and limits. Use sanitised examples that contain no customer records or credentials.
{{< /step >}}
{{< step title="Test selection and execution" >}}
Check whether the agent chooses the skill for relevant requests and avoids it for unrelated ones. Then check that it follows the method.
{{< /step >}}
{{< step title="Review before sharing" >}}
Have the responsible team approve the revision. Test each attached agent's permissions and missing-tool behaviour before wider use.
{{< /step >}}
{{< step title="Monitor and revise" >}}
Keep the previous approved revision, investigate failures and repeat the checks after changes to policies, tools or instructions.
{{< /step >}}
{{< /steps >}}

Testing needs more than a polite final answer. Include a normal request, missing facts, a disputed exception and an unavailable tool. Check whether the agent consulted the right source, preserved uncertainty and stopped at the approval boundary. Also test a conversation that changes topic: a refund playbook should not distort a later question about product care.

**Related:** On AIVAX, this reusable instruction bundle is called a [skill](../../docs/features/skills.md), and selected skills can be enabled for an agent's configured runtime. [Teach Skill](../../docs/generations/teach-skill.md) can turn a recorded demonstration into draft instructions. Review that draft against the real process before saving it; generating it does not automatically publish a skill.

**What's next:** A method needs boundaries. [Adding guardrails](adding-guardrails.md) explains how to limit actions and handle requests the agent should not fulfil.

{{< quiz options="The current returns policy | An operation that reads an order record | A reusable procedure for checking a refund request and preparing it for review | Permission to approve every refund" answer="3" explanation="A skill describes how to perform a recurring task. The policy supplies knowledge, the lookup supplies a tool capability, and approval authority must be enforced separately." >}}
Which item is a skill in a support agent's design?
{{< /quiz >}}
