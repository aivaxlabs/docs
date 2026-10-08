---
title: Writing good prompts and instructions
linkTitle: Writing good prompts and instructions
description: "Write an agent's job description with clear goals, evidence rules, boundaries, tone, and examples, then improve it using real conversations."
weight: 130
duration: 12
objectives:
  - Distinguish a user's prompt from an agent's standing instructions.
  - Draft a clear role, goal, scope, and output expectation.
  - Replace vague directions with observable behaviour.
  - Refine instructions using representative conversations and failure cases.
---

A capable employee still needs to know which job they have been hired to do. “Be helpful” does not tell a support adviser whether they may approve refunds, change an account, or promise delivery dates. An agent has the same need for a clear job description, although it also requires software controls that a written instruction cannot replace.

A **prompt** is the input given to a model for a particular response or task. It can include the user's question and supporting context. **System instructions** are standing directions supplied by the application to define the agent's role and behaviour across requests. Think of the user's message as today's assignment and the system instructions as the job description and working rules.

## Describe the job before choosing the wording

Start with the work the agent should accomplish, not a personality. “You are a brilliant assistant” says little about a useful result. “Help customers understand delivery options using the current policy, and use the order-status tool for questions about a specific shipment” names a purpose and connects different questions to appropriate evidence.

Be explicit about the intended audience. A support answer for a customer should not read like an internal incident report. An internal assistant may use terminology employees recognise, while a public assistant should explain unfamiliar terms. Defining the audience helps the agent choose detail and tone without pretending that style is the whole task.

Next, describe success in a way a reviewer can observe. For example: answer the customer's question, distinguish policy from current status, cite the supporting source when available, and ask a necessary follow-up when evidence is missing. These criteria are more testable than “always deliver an excellent experience.”

## The sections of a useful instruction

A good instruction is usually a small, organised document rather than one long paragraph of demands. Keep rules about the same subject together. If several passages describe what to do when information is missing, combine them into one clear rule instead of making the agent reconcile slightly different versions.

{{< cards >}}
{{< card title="Role and goal" icon="briefcase" >}}
State who the agent helps and which outcome it should pursue. Name the work, not an exaggerated level of expertise.
{{< /card >}}
{{< card title="Scope and evidence" icon="book" >}}
Identify the subjects it handles and the sources or tools it should consult. Say what to do when those sources do not answer the question.
{{< /card >}}
{{< card title="Boundaries" icon="shield" >}}
List meaningful limits, required approvals, and escalation conditions. Distinguish explaining an action from being authorised to perform it.
{{< /card >}}
{{< card title="Tone and format" icon="chat" >}}
Specify the audience, level of detail, and required sections or fields. Ask for respectful clarity rather than a vague personality trait.
{{< /card >}}
{{< card title="Examples" icon="lightbulb" >}}
Show realistic inputs and acceptable responses, including uncertainty. Use examples to demonstrate rules, not to introduce hidden exceptions.
{{< /card >}}
{{< /cards >}}

The sections should agree. “Never ask a question” conflicts with “verify all required details before updating a record” whenever the user omits a detail. “Always answer confidently” conflicts with admitting that a source is unavailable. Resolve such conflicts in the instruction itself; do not expect the model to discover the business priority you intended.

## Replace vague adjectives with behaviours

An instruction can be short without being vague. The test is whether two reviewers would recognise the same successful response. “Professional” means different things to different people. “Use plain language, avoid blame, and explain the next available step” points to visible behaviour.

{{< compare >}}
{{< side title="Vague: personality instead of purpose" tone="bad" >}}
You are a world-class support expert. Be helpful, proactive, and confident. Resolve every customer problem.
{{< /side >}}
{{< side title="Specific: a bounded support role" tone="good" >}}
Help customers understand delivery policy and the status of their own orders. Consult the approved policy for rules and the authorised lookup tool for current status. If evidence is missing, say what is unknown and offer the appropriate support route. Do not promise refunds or delivery dates without supporting authority.
{{< /side >}}
{{< /compare >}}

The specific version does not guarantee correctness. It gives the application a clearer behavioural target and gives reviewers a basis for checking answers. Tool permissions, source quality, and identity checks still need to work independently. A written rule saying “only read this customer's order” is not sufficient if the connected service exposes every order without checking access.

A second common problem is asking for an output without explaining how it will be used. A manager scanning a case summary needs different detail from an engineer investigating a failure. State the desired structure when it helps the reader or a downstream system use the result.

{{< compare >}}
{{< side title="Vague: an undefined summary" tone="bad" >}}
Summarise this case nicely. Include everything important and keep it short.
{{< /side >}}
{{< side title="Specific: a reviewable case summary" tone="good" >}}
Write a case summary with these headings: Customer request, Verified facts, Open questions, and Next step. Separate customer-reported claims from tool-confirmed facts. Do not describe a proposed action as completed. Leave unknown details explicitly marked as unknown rather than filling them in.
{{< /side >}}
{{< /compare >}}

If software needs to read the result automatically, agree on the exact fields and validate the response in software. Human-friendly formatting and machine-readable output are related but different requirements. A heading that looks right to a person does not necessarily satisfy a program expecting a defined data structure.

## Use examples to teach distinctions

Examples help when a rule is easy to misunderstand. “Do not invent facts” is broad; a sample answer that admits a failed lookup demonstrates what honesty looks like during a real task. Include both ordinary cases and cases where the agent should ask, stop, or refer the user to someone else.

Keep examples consistent with the written rules. If the rules say a refund requires approval but every example grants one immediately, the instruction sends competing signals. Also make clear which details are fictional. Do not use real customer conversations containing personal information as public examples, and remove unnecessary identifying details from internal test material.

{{< demo name="conversation" title="Try it: clear instructions produce a reviewable response" config=`{"messages":[["system","You help customers check delivery status. Use the authorised order lookup before stating current status. If the lookup fails, say that status is unverified. Never describe a requested action as completed without a confirming result."],["user","Has my delivery arrived?"],["tool","Authorised order lookup: temporarily unavailable. No delivery status returned."],["assistant","I could not verify the delivery status because the lookup is temporarily unavailable. I cannot confirm that it has arrived. You can try the lookup again later or contact support for a status check."]]}` >}}
This is a scripted illustration, not a live model response. Notice the distinction between a failed check and a negative result: the tool did not say that delivery had not occurred.
{{< /demo >}}

That distinction is important in many business tasks. “No record was found” differs from “the search failed.” “The request was submitted” differs from “the change was confirmed.” Useful instructions name these differences because plausible language can otherwise hide operational uncertainty.

## Draft, test, and refine with real situations

Do not judge an instruction only by reading it. Test how the configured agent behaves when a user is unclear, a source is missing, or a tool returns an error. Use representative conversations from the intended task, with appropriate permission and removal of identifying information. Invented scenarios can fill gaps, but should not be the only evidence of readiness.

{{< steps >}}
{{< step title="Write the smallest complete job description" >}}
Define the goal, audience, evidence sources, boundaries, and desired output. Remove unrelated ambitions before adding more detail.
{{< /step >}}
{{< step title="Collect representative cases" >}}
Include common questions, ambiguous requests, unsupported requests, and failed lookups. Write down what an acceptable result should show.
{{< /step >}}
{{< step title="Inspect the actual failure" >}}
Decide whether the problem came from unclear instructions, missing knowledge, a tool failure, or insufficient permission checks. Do not treat every failure as a wording problem.
{{< /step >}}
{{< step title="Make a focused change and recheck" >}}
Change the relevant rule or example, then run the earlier cases again. Confirm that fixing one behaviour did not break another.
{{< /step >}}
{{< /steps >}}

Keep a versioned copy of instructions: a record of which wording was active and what changed. This makes it easier to explain why behaviour changed and to restore an earlier version if a revision causes problems. Small changes are usually easier to evaluate than replacing the entire instruction after one disappointing answer.

Avoid growing the document into a catalogue of every failure ever observed. Some rules belong in tools or application controls; others belong in a specialised skill loaded for that task. Repeated warnings can obscure the main job. The goal is a coherent working agreement, not the longest possible prompt.

## Recognise the limits of wording

Better instructions can improve consistency, but they cannot supply unavailable data, create permissions, or guarantee compliance. If an agent lacks a current policy, add the correct source. If a tool accepts unsafe actions, fix the integration. If the process requires human approval, enforce that checkpoint rather than adding stronger adjectives to the prompt.

For a deeper drafting framework, continue with [Anatomy of a prompt](../prompt-engineering/anatomy-of-a-prompt.md). The [common prompt mistakes](../prompt-engineering/common-prompt-mistakes.md) unit examines conflicting rules, missing context, and other patterns that make behaviour harder to predict.

What's next: begin [Introduction to knowledge creation](../teaching-agents/introduction-to-knowledge-creation.md) and learn how to prepare the evidence your instructions tell an agent to use.

{{< quiz options="Add more praise about the agent's expertise | Clarify the expected behaviour, inspect real failures, and test a focused revision | Tell the agent never to admit uncertainty" answer="2" explanation="Good instructions define observable behaviour and improve through evidence. Praise and forced confidence do not fix missing sources, unclear boundaries, or tool failures." >}}
An agent gives inconsistent case summaries. Which approach is most useful?
{{< /quiz >}}
