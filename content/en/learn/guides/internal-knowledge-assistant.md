---
title: Internal knowledge assistant
linkTitle: Internal knowledge assistant
description: "Create an employee assistant that finds approved policies, respects departmental access, and makes uncertainty visible."
weight: 30
duration: 12
objectives:
  - Prepare owned and current knowledge sources for employee questions.
  - Apply access checks before information reaches the model.
  - Design answers with useful citations and honest uncertainty.
  - Measure resolved questions without hiding unmet employee needs.
---

Employees often know that an answer exists but not where to find it. The holiday policy is in one folder, the laptop guide in another, and an old expense form still appears in search. An internal knowledge assistant helps employees navigate this material in ordinary language. It should behave like a careful librarian, not an all-seeing colleague.

Imagine a fictional organisation called Cedar Office. It wants one entry point for human resources, information technology, and finance questions. **Human resources**, or HR, handles employment policies. **Information technology**, or IT, manages workplace systems. The first version answers policy questions; it does not approve leave, reset accounts, or submit expenses.

## Choose questions before collecting documents

Start by interviewing the people who answer recurring questions. Ask what employees find confusing, which answers vary by location or role, and which issues must remain private. “Help employees find the correct travel policy” is a manageable objective. “Know everything about the company” is not.

{{< cards >}}
{{< card title="Shared guidance" icon="book" >}}
Published employee policies, service-desk instructions, and approved office procedures can support general questions when they apply to the current employee.
{{< /card >}}
{{< card title="Restricted guidance" icon="lock" >}}
Department-specific procedures require an access decision before retrieval. A document being searchable does not mean every employee may read it.
{{< /card >}}
{{< card title="Private records" icon="shield" >}}
Personnel cases, medical details, individual payroll records, and disciplinary files do not belong in the general pilot collection.
{{< /card >}}
{{< /cards >}}

A **wiki** is a set of collaboratively maintained pages. It may contain useful material, but popularity is not authority. A widely linked page can still be outdated. **Metadata** means descriptive labels attached to a document, such as owner, department, effective date, and permitted audience. These labels help organise retrieval; their accuracy needs an owner too.

## Prepare a reliable reference shelf

{{< steps >}}
{{< step title="Inventory the sources" >}}
List candidate policies, wiki pages, and service guides with their owners. Identify duplicate, contradictory, draft, and expired material before importing it.
{{< /step >}}
{{< step title="Rewrite the difficult answers" >}}
Give each policy a clear title, scope, effective date, and concrete procedure. Keep exceptions beside the rule they qualify, rather than in an unrelated attachment.
{{< /step >}}
{{< step title="Assign access rules" >}}
Mark the permitted audience and connect access checks to the organisation's trusted identity system. Do not let an employee grant themselves access by typing a department name.
{{< /step >}}
{{< step title="Build answers around evidence" >}}
Retrieve only permitted passages, then answer with the source title and a link the employee can open. If the passages do not resolve the question, say so.
{{< /step >}}
{{< step title="Review and improve" >}}
Pilot with representatives from each department. Collect feedback, inspect unresolved questions, and give policy owners a recurring review task.
{{< /step >}}
{{< /steps >}}

Read [Finding and preparing knowledge](../teaching-agents/finding-and-preparing-knowledge.md) for source selection and [Writing good documents](../teaching-agents/writing-good-documents.md) for clear, self-contained procedures. Better source material often fixes a confusing answer more directly than adding another instruction to the agent.

Use a defined publication process. When a policy changes, update or retire the searchable version and verify that old answers stop appearing. Keep an accountable owner for the change. A document's upload date is not necessarily the date on which its rule took effect.

## Enforce access before the model sees a passage

**Authentication** checks who an employee is; **authorisation** checks what that employee may access. Both are needed. The trusted application should obtain department and role membership from the organisation's identity system, then constrain the search before its results are supplied to the model.

Do not retrieve every document and merely instruct the model not to mention restricted material. That puts information across the boundary before the decision is made. Apply the same access rules to direct document links, conversation history, cached answers, and feedback records. A cache is a stored result reused later; it must not reuse a finance-only answer for an unauthorised employee.

Related: on AIVAX, [collections](../../docs/rag/collections.md) hold searchable documents and [document filters](../../docs/filters/document-filters.md) restrict supported searches using metadata or tags. Filters help express a scope, but a model-supplied filter is not an authorisation system. A trusted application must impose the required restriction. The documented automatic gateway RAG path does not apply document filters, so do not assume that attaching a mixed-access collection makes that path department-safe.

If the chosen retrieval path cannot enforce the required boundary, separate the data or choose an appropriately controlled path before launching. Missing identity or permission information should stop restricted retrieval, not silently widen it. Review [Privacy, LGPD, and GDPR](../safety/privacy-lgpd-gdpr.md) when deciding what employee data to process and retain.

## Make answers checkable

A **citation** identifies the source supporting a claim. It should lead to the relevant document or section, not just the company home page. Mention scope when it changes the answer: “The domestic travel policy says…” is safer than “Everyone may claim…”. Do not treat a citation as decoration; check that the cited passage actually supports the statement.

{{< compare >}}
{{< side title="Confident but unsupported" tone="bad" >}}
“You can expense any home-office equipment. That is probably covered by the general expenses policy.”
{{< /side >}}
{{< side title="Useful uncertainty" tone="good" >}}
“I found the travel expenses policy, but it does not cover home-office equipment. I cannot confirm eligibility from the available guidance. The finance help route can clarify it.”
{{< /side >}}
{{< /compare >}}

“I don't know” should come with a useful next step. State what was found, what remains unresolved, and the responsible team. Do not reveal that a restricted document exists if its existence is itself sensitive. Conflicting policies also require a pause: explain the conflict to the appropriate owner instead of inventing a compromise.

{{< demo name="search" title="Try it: a small fictional employee reference shelf" config=`{"label":"Ask about a policy","placeholder":"equipment or travel","documents":[["Travel expenses","Fictional policy: use the approved travel form and attach the required receipts before submitting for review.",["travel","expenses","receipt"]],["Equipment support","Fictional guide: report broken company equipment through the service desk; do not send passwords in the report.",["equipment","laptop","broken"]],["Leave requests","Fictional guide: consult the policy for your employment location and discuss scheduling with your manager.",["leave","holiday","manager"]]]}` >}}
This small demonstration shows matching against sample documents. It does not implement employee authentication, departmental permissions, or a production semantic search system. Try a question the shelf cannot answer and notice why missing evidence matters.
{{< /demo >}}

## Adapt the answer to the department

The same answer pattern works across teams: identify the question, check scope, find evidence, explain the procedure, and offer the appropriate help route. What changes is the permitted information and the consequence of being wrong.

{{< tabs >}}
{{< tab title="HR" >}}
An employee asks how to request leave. Give the published procedure applicable to their employment location and explain where approval happens. Do not disclose colleagues' leave or infer health information. A personal dispute goes to the confidential HR route, not a general policy answer.
{{< /tab >}}
{{< tab title="IT" >}}
An employee cannot connect a work laptop. Offer approved troubleshooting that does not weaken security. Never ask them to paste passwords or recovery codes. If access recovery is needed, direct them to the verified recovery process instead of treating chat as identity proof.
{{< /tab >}}
{{< tab title="Finance" >}}
An employee asks whether a receipt is required. Cite the applicable expense rule and identify exceptions that are actually documented. Do not claim an expense is approved or reveal another employee's reimbursements. An unusual claim needs the authorised reviewer.
{{< /tab >}}
{{< /tabs >}}

## Add feedback that leads to a correction

Provide a visible feedback button with choices such as “helpful”, “outdated”, “wrong source”, and “still need a person”. Let employees explain the issue, but discourage unnecessary personal details. Feedback should enter a review process with an owner; collecting it without acting on it only creates another unattended inbox.

Review the original question, permitted sources, and answer together. Was the document missing, hard to retrieve, or misunderstood? Fix the correct layer and add the failed case to the test set. Do not automatically publish an employee's suggested correction as policy.

## Measure resolution rather than silence

**Deflection** is the proportion of eligible questions resolved without staff handling. Define the eligible set and observation window before reporting it. Exclude private cases that should go directly to a person, and do not count an abandoned conversation as a success merely because no ticket appeared.

Combine a voluntary “Did this solve your question?” response with sampled answer reviews and repeat-contact analysis where permitted. Track citation accuracy, time to useful answer, appropriate handovers, and access-control test results. Report uncertainty when feedback is sparse; satisfied users and frustrated users may respond at different rates.

Test cross-department questions with several fictional roles, missing identity, expired permissions, outdated policies, and contradictory sources. A privacy failure is a reason to stop and investigate, not a small error to average into a high satisfaction score. Expand the reference shelf only when its owners and access rules are ready.

What's next: compare these patterns across sectors in [Common use cases by industry](use-cases-by-industry.md).

{{< quiz options="Search every department and ask the model to hide restricted passages | Apply trusted access rules before retrieval and provide only authorised evidence | Let the employee type the department they want to access" answer="2" explanation="Access must be enforced before restricted information reaches the model; a prompt or self-declared department does not establish permission." >}}
How should an internal assistant protect department-restricted knowledge?
{{< /quiz >}}
