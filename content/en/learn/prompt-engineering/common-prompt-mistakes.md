---
title: Common prompt mistakes and fixes
linkTitle: Common prompt mistakes
description: "Recognise eight recurring prompt problems and replace them with clear goals, consistent evidence, usable outputs and safe escalation."
weight: 50
duration: 12
objectives:
  - Recognise vague, conflicting or incomplete instructions.
  - Rewrite prompts with explicit goals, evidence and output requirements.
  - Define a useful next step when the assistant cannot safely complete a task.
  - Review a prompt with representative examples before relying on it.
---

A disappointing answer does not always mean you chose the wrong model. Often the assistant received an incomplete work order: it was told to be helpful without being told what success meant, or it was asked to follow rules that could not all be satisfied. Fixing the briefing is usually a better first step than adding emphatic language.

The examples below use fictional support and back-office tasks. Each pair repairs a specific problem. The aim is not to make prompts longer; it is to remove guesswork that changes the result. If essential facts or permissions are missing, the fix may belong in the application rather than in the wording.

## Diagnose the missing ingredient

Before editing, identify whether the failure concerns the job, its evidence or the required result. This avoids adding an unrelated instruction every time something goes wrong. A prompt that grows by accumulating reactions can become harder to follow than the original.

{{< cards >}}
{{< card title="The job" icon="compass" >}}
Can a new colleague identify the intended outcome, audience and limits without guessing what “good” means?
{{< /card >}}
{{< card title="The evidence" icon="book" >}}
Does the briefing contain the relevant facts and distinguish approved information from customer claims?
{{< /card >}}
{{< card title="The result" icon="list-check" >}}
Is the answer format usable, and is there an agreed next step when the task cannot be completed safely?
{{< /card >}}
{{< /cards >}}

## 1. A vague goal

“Handle this” leaves the assistant to choose between summarising, replying, deciding and taking action. Those are different jobs with different consequences. State the intended deliverable and who will use it. You can leave room for natural wording without leaving the business outcome undefined.

{{< compare >}}
{{< side title="Before" tone="bad" >}}
“Help with this customer complaint. Make it good.”
{{< /side >}}
{{< side title="After" tone="good" >}}
“Draft a reply for a support representative to review. Acknowledge the delayed delivery, summarise the verified status and explain the next available step. Do not send the reply or promise compensation.”
{{< /side >}}
{{< /compare >}}

{{< accordion title="Check whether the goal is observable" >}}
Ask what a reviewer could point to in the answer: an accurate status, an appropriate acknowledgement and a permitted next step. “Excellent service” is an aspiration, not an acceptance check. Keep the aspiration, but give it concrete meaning.
{{< /accordion >}}

## 2. Contradictory rules

Conflicts often appear when several people contribute instructions. One person demands absolute brevity while another requires every detail. The model cannot fully satisfy both. Choose a priority or define when each rule applies, rather than expecting it to discover the team's unstated compromise.

{{< compare >}}
{{< side title="Before" tone="bad" >}}
“Always answer in one sentence. Always explain every exception and the complete procedure.”
{{< /side >}}
{{< side title="After" tone="good" >}}
“Start with a short answer. Include any exception that changes the customer's next step. Put the detailed procedure in a separate list when needed for safe completion.”
{{< /side >}}
{{< /compare >}}

{{< accordion title="Check priority, not just wording" >}}
Search for words such as “always,” “never” and “only.” Compare their scope. If a required warning takes more space, should brevity yield? Decide explicitly. A polite tone must not outrank a truthful description of missing information.
{{< /accordion >}}

## 3. No output format

A good explanation can still be unusable if the next person or system expects fields. Decide whether the output is for reading, copying into a form or processing automatically. Define how unknown values appear so the assistant is not encouraged to fill empty spaces with invented details.

{{< compare >}}
{{< side title="Before" tone="bad" >}}
“Extract the important invoice details.”
{{< /side >}}
{{< side title="After" tone="good" >}}
“Return a JSON object with supplier_name, invoice_date and total_amount using the supplied schema. Use null when a field is absent. Do not infer a date or amount from unrelated text.”
{{< /side >}}
{{< /compare >}}

{{< accordion title="Check the consumer of the answer" >}}
JSON is a text format containing named fields and values; a schema specifies their required structure. A prompt alone is not validation. Software should check the result before using it, while a human-facing message may be clearer as ordinary prose.
{{< /accordion >}}

## 4. Overlong instructions

Length itself is not the problem; unnecessary repetition and irrelevant detail are. A prompt containing every historical policy revision makes it hard to identify the current rule. Separate stable behaviour from reference knowledge, and supply only the reference material needed for this task.

{{< compare >}}
{{< side title="Before" tone="bad" >}}
Paste old policy drafts, repeated tone reminders and every past support incident into the standing instructions. End with “Use the latest rules.”
{{< /side >}}
{{< side title="After" tone="good" >}}
“Use the approved policy supplied for this request. Explain the relevant rule and required next step. If the supplied documents conflict or lack a current version, request review rather than choosing silently.”
{{< /side >}}
{{< /compare >}}

{{< accordion title="Shorten without removing safeguards" >}}
Remove duplicates and superseded material first. Do not delete the source-of-truth rule, action limits or escalation criteria merely to reduce length. If a section does not affect the expected behaviour, consider whether it belongs in the prompt at all.
{{< /accordion >}}

## 5. Examples that conflict with the rules

Models can follow the pattern demonstrated by examples even when a written rule says something different. This is especially easy to miss after changing a policy: the instructions are updated, but an old demonstration still shows an unauthorised promise. Treat examples as part of the specification.

{{< compare >}}
{{< side title="Before" tone="bad" >}}
Rule: “Do not promise delivery dates without a verified estimate.”

Example reply: “Your parcel will definitely arrive tomorrow.”
{{< /side >}}
{{< side title="After" tone="good" >}}
Rule: “Report only the estimate in the verified record, and label it as an estimate.”

Example when no estimate exists: “The parcel has been dispatched. The record does not yet show an estimated delivery date.”
{{< /side >}}
{{< /compare >}}

{{< accordion title="Review examples after changing a rule" >}}
For each example, identify the evidence supporting every claim. Include an incomplete-information case as well as the easy successful case. If reviewers disagree about the correct example, resolve the business ambiguity before asking the model to resolve it.
{{< /accordion >}}

## 6. Assuming the model knows your company

A model's training is not a live connection to your organisation. It does not establish today's return policy, current stock or a customer's account status. Even public information may be old. Private and changing facts must come from authorised documents or connected systems.

{{< compare >}}
{{< side title="Before" tone="bad" >}}
“You work for our company, so explain our current warranty and confirm whether this repair is covered.”
{{< /side >}}
{{< side title="After" tone="good" >}}
“Use the supplied current warranty and verified purchase details. Identify the relevant clause. If the policy or required purchase evidence is missing, explain what is needed before coverage can be determined.”
{{< /side >}}
{{< /compare >}}

{{< accordion title="Distinguish access from a role description" >}}
Calling an assistant a warranty specialist changes the requested perspective, not its access to records. Verify that the application actually provides the policy and permits the necessary lookup. A tool must also report failures clearly rather than returning an apparently empty success.
{{< /accordion >}}

## 7. Negative-only instructions

“Don't be vague, don't hallucinate, don't be unhelpful” describes unwanted behaviour without showing a useful alternative. **Hallucination** means generating unsupported or false content as if it were true. Reduce the opportunity for it by specifying evidence and a missing-information path, not by merely prohibiting mistakes.

{{< compare >}}
{{< side title="Before" tone="bad" >}}
“Never guess. Never be vague. Never say anything wrong.”
{{< /side >}}
{{< side title="After" tone="good" >}}
“Base factual claims on the supplied policy or verified tool result. State what is known and what remains unknown. Ask for a missing detail when it affects the answer; otherwise explain the supported next step.”
{{< /side >}}
{{< /compare >}}

{{< accordion title="Keep necessary prohibitions, then add a path" >}}
Some boundaries should stay explicit, such as not exposing credentials or approving payments. Pair them with the permitted response: explain the limit, use an authorised process or refer to the appropriate person. Positive instructions do not replace hard restrictions.
{{< /accordion >}}

## 8. No escalation path

**Escalation** means passing a case to an authorised person or process when the assistant cannot resolve it appropriately. Without a defined path, the assistant may keep asking questions, invent an answer or claim to have contacted someone. Specify both the trigger and the actual available mechanism.

{{< compare >}}
{{< side title="Before" tone="bad" >}}
“Resolve every refund request. Never leave the customer without an answer.”
{{< /side >}}
{{< side title="After" tone="good" >}}
“If eligibility is unclear or approval is required, summarise the evidence and unresolved question for human review. Use the configured handoff if available; otherwise explain the approved contact route. Do not claim a handoff succeeded without confirmation.”
{{< /side >}}
{{< /compare >}}

{{< accordion title="Test the unavailable-handoff case" >}}
A transfer tool can fail, and a review team may not respond immediately. Define what the customer should see in that situation. Distinguish “I prepared a summary” from “a representative received the case,” and avoid inventing response-time promises.
{{< /accordion >}}

## Review the complete prompt

Fixes should work together. A clear output format does not compensate for missing evidence, and a concise prompt does not compensate for contradictory rules. Keep a short set of representative cases so each edit can be judged against the same expectations, not only the most recent failure.

{{< steps >}}
{{< step title="Read it as a new colleague" >}}
Identify the outcome, audience, source of truth and action limits. Rewrite any instruction that depends on unstated company knowledge.
{{< /step >}}
{{< step title="Check consistency" >}}
Compare rules with examples, remove repeated or superseded instructions and define which requirement wins when constraints compete.
{{< /step >}}
{{< step title="Exercise uncertainty" >}}
Try a normal request, missing evidence, conflicting documents and an unavailable tool. Define the acceptable response for each before testing.
{{< /step >}}
{{< step title="Measure before keeping the change" >}}
Review factual correctness, format and escalation behaviour. Change one relevant part at a time and retain revisions that improve the intended outcome.
{{< /step >}}
{{< /steps >}}

For a broader instruction-writing method, revisit [Writing good prompts and instructions](../agents/writing-good-prompts-and-instructions.md). Related: on AIVAX, repeatable conversational evaluations are called [Agentic Tests](../../docs/inference/agentic-tests.md). They help assess defined scenarios, but their results still need meaningful criteria and review; a passing sample is not a guarantee for every future conversation.

**What's next:** Explore [model families and choosing a model](../models/model-families-and-choosing.md) to match the engine to a clearly defined task.

{{< quiz options="Repeat the demand for confidence more forcefully | Add examples that promise a positive outcome | Supply the authorised policy, define the missing-evidence path and test uncertain cases | Ask the assistant to resolve every case without human review" answer="3" explanation="Unsupported certainty is best addressed by providing authoritative evidence and a safe path when it is missing. Stronger wording or optimistic examples cannot supply facts or approval authority." >}}
An assistant confidently approves requests even when the policy evidence is missing. Which change addresses the root problem?
{{< /quiz >}}
