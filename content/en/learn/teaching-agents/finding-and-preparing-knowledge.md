---
title: How to find and prepare knowledge
linkTitle: Find and prepare knowledge
description: "Build an approved knowledge inventory by finding useful sources, prioritising real questions and resolving gaps before indexing."
weight: 30
duration: 11
objectives:
  - Inventory knowledge sources and identify their owners.
  - Prioritise sources using question frequency and consequences.
  - Resolve duplicate, outdated and contradictory information.
  - Screen material for access restrictions and sensitive data.
---

The answer to a customer's question may be scattered across a help article, an old presentation and the experience of someone in the support team. Finding knowledge is therefore closer to preparing a new employee's handbook than copying a folder. You need to discover what people rely on, decide what is trustworthy and turn unwritten habits into approved guidance.

A **source inventory** is a simple record of candidate knowledge and its status. It might be a spreadsheet, a shared table or an existing content-management view. Its purpose is to make decisions visible: what exists, which questions it answers, who owns it and whether it is ready for an agent. It is not necessary to buy a new system to begin.

## Search beyond the obvious folder

Start with the channels people already use when they need an answer. A **wiki** is a set of collaboratively maintained pages; it may contain useful procedures but also abandoned drafts. PDFs may contain signed policies or exported brochures. Support tickets record actual questions and attempted solutions. E-mails reveal exceptions and unresolved disagreements. Experienced colleagues may carry essential rules that have never been written down.

These sources do not have equal authority. A resolved ticket shows what happened in one case, not necessarily what should happen in every case. An e-mail from a specialist may explain a workaround but lack approval as a standard procedure. Treat such material as evidence for drafting better knowledge, not as automatic permission to publish the original conversation.

{{< cards >}}
{{< card title="Published guidance" icon="book" >}}
Check help centres, manuals and policy libraries for current, approved explanations.
{{< /card >}}
{{< card title="Work records" icon="message" >}}
Use tickets and e-mails to discover real questions and gaps, after appropriate privacy screening.
{{< /card >}}
{{< card title="Product records" icon="database" >}}
Locate approved specifications and compatibility information, with version and audience clearly identified.
{{< /card >}}
{{< card title="People's experience" icon="user" >}}
Interview specialists to uncover unwritten steps, then ask the responsible owner to approve the resulting document.
{{< /card >}}
{{< /cards >}}

For each source, record its location, topic, owner, intended audience, effective date and review status. Add the questions it should answer. A file named “final policy” is not enough evidence of approval; look for a responsible team and a current decision. If nobody can explain whether the material still applies, mark it as requiring review rather than quietly treating it as trusted.

## Prioritise useful coverage

**Coverage** means how much of a defined question set your approved knowledge can answer. It is not the proportion of your shared drive that has been uploaded. A short, clear return policy may cover many more customer questions than a long company-history presentation.

Group recurring questions by intent, meaning what the person wants to accomplish. “Can I send this back?” and “How do returns work?” belong to a related group even though their wording differs. Count how often groups occur in an appropriate sample, without retaining unnecessary personal data. Then map each group to an approved source or an explicit gap.

{{< chart type="bar" title="Support questions covered by each source alone (illustrative)" unit="%" data=`[{"label":"Approved FAQ","value":46},{"label":"Returns policy","value":31},{"label":"Product manual","value":24},{"label":"Expert notes after approval","value":16}]` caption="Fictional planning example. Sources overlap, so these percentages must not be added. Coverage depends on the sampled questions, not document length." >}}

Question frequency is only one priority signal. A rare safety question can matter more than a common opening-hours question. Consider the consequence of an incorrect answer, the effort needed to prepare the source and whether a reliable source already exists. Do not turn the chart into a promise of automation: having an answer in a source does not prove that retrieval and response generation will use it correctly.

Start with a manageable question family. For example, prepare returns before attempting all customer support. This gives reviewers a coherent subject to approve and lets you see whether the process works before expanding it. Keep uncovered topics visible so the agent can acknowledge its limits rather than pretending the collection is complete.

## Turn candidates into approved knowledge

{{< steps >}}
{{< step title="Group duplicates" >}}
Find copies and near-copies of the same policy. Identify the authoritative version and preserve its provenance, meaning where it came from and who approved it.
{{< /step >}}
{{< step title="Resolve disagreements" >}}
List conflicting statements and ask the accountable owner which rule applies. Check whether apparently conflicting rules actually cover different products, regions or dates.
{{< /step >}}
{{< step title="Retire stale material" >}}
Exclude expired drafts from the searchable set. Keep any required archive separately, with its access and retention rules intact.
{{< /step >}}
{{< step title="Fill and review gaps" >}}
Draft missing answers from approved decisions, confirm them with the owner and record when they become effective.
{{< /step >}}
{{< /steps >}}

**Deduplication** means removing unnecessary repeated copies. It helps because repeated passages can occupy search results that should contain different useful evidence. It also prevents an obsolete version from appearing more authoritative simply because many teams copied it. Preserve legitimate differences: a regional variation is not a duplicate if it changes the rule.

Do not ask the agent to settle policy disputes. If one document permits cancellation and another forbids it, the model may choose whichever wording appears more relevant. The correct repair is an organisational decision. Publish one clear rule or explicitly label the conditions under which each rule applies. Record that resolution so the disagreement does not return during the next import.

## Adapt the process to the team

{{< tabs >}}
{{< tab title="Support" >}}
Begin with repeated ticket topics. Convert successful resolutions into general instructions, remove customer details and have support operations approve the result. Separate normal procedures from discretionary exceptions.
{{< /tab >}}
{{< tab title="Sales" >}}
Compare presentations with the current product catalogue. Remove expired offers and unsupported promises. Ask product owners to confirm capabilities, limitations and which claims require qualification.
{{< /tab >}}
{{< tab title="HR" >}}
Separate organisation-wide policies from individual employee cases. Confirm location and employment-category scope. Keep personal records out of the general knowledge collection and route sensitive questions appropriately.
{{< /tab >}}
{{< /tabs >}}

Interviewing a specialist works best with concrete situations. Ask, “What do you check before approving this request?” rather than “Tell me everything you know.” Follow with questions about exceptions, evidence and when to stop. Read the resulting procedure back to the specialist using a fictional case. This often reveals missing conditions that a broad interview would miss.

## Screen before sharing

**Sensitive data screening** is the review that identifies information requiring removal, restriction or special handling. Look for passwords, credentials, personal identifiers, private correspondence and details that do not belong in the agent's task. A document being accessible to you does not mean every user of the agent may see it.

Removing a person's name may not be sufficient: a distinctive combination of events, dates and job details can still identify someone. Prefer a general procedure or a fictional example when the original case is not necessary. Decide the permitted purpose, audience and retention period before indexing. [Privacy, LGPD and GDPR](../safety/privacy-lgpd-gdpr.md) explains the broader privacy considerations; local obligations still need appropriate professional review.

Keep restricted sources separate from public-facing knowledge, and enforce access in the surrounding application. Instructions asking the model not to disclose information are not a replacement for controlling which information it receives. Review exported attachments and copied text as carefully as the original source.

## Know when a source is ready

A prepared source should have an owner, a clear audience, current content and an identified question family. It should also pass a simple reading test: can someone unfamiliar with the topic answer the target questions using only this source? If not, the document needs clarification before search settings become the focus.

Related: AIVAX's [RAG best practices](../../docs/rag/best-practices.md) connects source preparation to usable retrieval. Keep the inventory after launch: it becomes the place to track changes, retirements and newly discovered gaps.

What's next: turn approved facts into searchable explanations in [How to write good documents](writing-good-documents.md).

{{< quiz options="Index both policies and let the model choose the more persuasive wording | Ask the accountable owner to resolve the difference and publish the applicable rule | Delete whichever policy is shorter | Repeat the newest file several times so it dominates search" answer="2" explanation="Conflicting policy is an ownership problem before it is a search problem. An approved rule with clear scope gives the agent evidence it can use reliably." >}}
Two candidate sources give different answers to the same return question. What should happen before indexing?
{{< /quiz >}}
