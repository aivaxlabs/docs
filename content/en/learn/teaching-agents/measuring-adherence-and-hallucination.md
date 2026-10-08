---
title: Measuring adherence and hallucination
linkTitle: Measure knowledge quality
description: "Evaluate whether an agent's answers follow the evidence, cover the intended questions and acknowledge what the sources do not establish."
weight: 50
duration: 12
objectives:
  - Distinguish groundedness, hallucination and coverage.
  - Build a question set with reviewable expected answers.
  - Compare manual review with automated judging.
  - Interpret evaluation results as evidence for improvement rather than guarantees.
---

An agent can answer politely, cite a document and still misstate the rule that matters. Evaluating knowledge-based answers means looking past fluency. You need to ask whether the evidence supports the claims, whether the agent answered the actual question and whether it recognised missing information.

Think of checking a colleague's report. A polished layout does not prove that the conclusions follow from the supporting records. You inspect important statements, compare them with their sources and distinguish a reasonable summary from an unsupported leap. Agent evaluation follows the same principle, but a repeatable question set makes it possible to compare versions rather than relying on a few memorable conversations.

## Name what you are measuring

**Adherence** means following a defined requirement. In this unit, *knowledge adherence* means that the answer follows the supplied evidence. **Groundedness** is the closely related question of whether factual claims are supported by that evidence. An agent can follow a friendly tone instruction while failing knowledge adherence, so always state which kind you mean.

A **hallucination** is a factual claim that is invented or unsupported but presented as established. For knowledge evaluation, distinguish an unsupported claim from a contradicted claim. A policy may say nothing about refund speed, making an invented deadline unsupported. If the policy explicitly gives a different deadline, the answer also contradicts the source. Both matter, but they may reveal different mistakes.

**Coverage** concerns whether the approved knowledge contains answers to the intended questions. Missing coverage is not necessarily a generation failure. If the source does not describe a product's compatibility, an honest “I cannot confirm that from the available information” can be the correct response. An answer can also be fully grounded yet incomplete because it addresses only part of a question.

{{< stats >}}
{{< stat value="Evidence" label="Does the source support the claims?" >}}
{{< stat value="Coverage" label="Does the knowledge contain the needed answer?" >}}
{{< stat value="Usefulness" label="Does the response resolve the actual question?" >}}
{{< /stats >}}

These are complementary lenses, not interchangeable scores. A system that refuses every question might avoid making unsupported claims, yet be useless. A system that answers everything might appear helpful while inventing conditions. Evaluate the balance using the agent's actual responsibilities and the consequences of mistakes.

## Build a question set before tuning

A **question set** is a collection of representative prompts or conversation scenarios with an agreed basis for judging the result. Start with real question patterns, rewritten to remove unnecessary personal information. Include routine questions, exceptions, ambiguous wording, missing information and topics outside the agent's remit. A collection made only of easy questions will give reassuring but weak evidence.

For each case, record the question, applicable source version, expected facts, prohibited claims and acceptable next steps. An **expected answer** need not be a single exact sentence. It can be a checklist: name the eligibility condition, ask for the missing product version and do not promise approval. This allows different helpful phrasings without rewarding unsupported additions.

{{< steps >}}
{{< step title="Choose representative cases" >}}
Sample common tasks and deliberately include consequential edge cases. Keep a separate label for each topic so failures are not hidden in one overall result.
{{< /step >}}
{{< step title="Write the evidence-based expectation" >}}
Have a knowledgeable reviewer identify the source passages and required conditions. Mark questions that should lead to clarification or escalation.
{{< /step >}}
{{< step title="Run and preserve the result" >}}
Record the question, retrieved passages, answer and relevant configuration. Keep the source version so later reviewers know what the agent could see.
{{< /step >}}
{{< step title="Review and classify failures" >}}
Separate missing knowledge, failed retrieval, misread evidence and poor communication. Assign the repair to the responsible part of the process.
{{< /step >}}
{{< /steps >}}

Do not silently rewrite expected answers to match whatever the agent produced. If the approved policy changes, update the expectation with a documented reason. Keep some cases aside while improving the system, then check them later. These held-back cases help reveal whether improvements generalise beyond examples repeatedly used during tuning.

## Review the claims, not the tone

Consider a fictional workshop policy: visitors may attend introductory sessions, but booking is required. The question is whether a friend can arrive without booking. A reviewer should inspect both the permission and its condition.

{{< compare >}}
{{< side title="Sounds helpful but fails" tone="bad" >}}
“Yes, your friend is welcome. Just arrive with them and the team will make space.”

The answer preserves visitor access but invents an exception to booking.
{{< /side >}}
{{< side title="Follows the evidence" tone="good" >}}
“Visitors are welcome at introductory sessions, but booking is required. I cannot confirm a place without a booking.”

The answer retains the restriction and does not turn eligibility into a guaranteed place.
{{< /side >}}
{{< /compare >}}

A citation to the workshop page would not repair the first answer. The source must support the claim being made, not merely share its topic. Reviewers should also check omissions: leaving out a restriction can mislead even when every sentence that remains is technically true.

## Combine people and automated judges

**Manual review** means a person applies the evaluation criteria. It is particularly useful for creating the initial question set, resolving disputed cases and reviewing high-consequence answers. Ask reviewers to explain a failure with the unsupported claim and the relevant source passage. This makes feedback actionable and helps different reviewers apply the same standard.

An **automated judge** is software, often another language model, that assesses a response against criteria and evidence. It can review many cases consistently enough to identify patterns, but it can also misunderstand a rule, favour fluent wording or accept a fabricated explanation. Agreement with a judge is not independent proof of truth.

Give the judge the expected criteria and appropriate evidence. Periodically compare its decisions with human review, especially after changing the judge, instructions or source material. If reviewers disagree, inspect the criterion before concluding that the agent is wrong. A vague requirement such as “answer well” produces unreliable grading regardless of who grades it.

Related: AIVAX [Agentic Tests](../../docs/inference/agentic-tests.md) evaluates complete conversations using a simulated user and an independent judge. Use that feature for conversational outcomes, while still checking the quality of the evidence and criteria supplied to the evaluation. [Testing and evaluating agents](../quality/testing-and-evaluating-agents.md) covers the broader testing process.

## Read metrics as trends

A **metric** is a defined measure calculated from observations. For example, you might report the proportion of reviewed answers whose factual claims are all supported. State what counts as a pass and whether the measure is calculated per claim, per answer or per conversation. Those denominators, the totals being counted, produce different numbers.

{{< chart type="line" title="Fully grounded answers across revisions (illustrative)" unit="%" data=`{"labels":["Baseline","Source cleanup","Retrieval adjustment","Instruction revision"],"series":[{"name":"Reviewed answers passing","values":[62,75,79,86]}]}` caption="Fictional results on the same question set and rubric. The upward line is not a product benchmark or a guarantee that each change improves every topic." >}}

Compare revisions using the same cases and review rules when possible. If you add harder questions, a lower score may reflect a better test rather than a worse agent. Break results down by topic and failure severity. An improving average can conceal a new failure on a policy exception with serious consequences.

Also track useful answers, appropriate refusals and retrieval failures. [Metrics](../quality/metrics.md) explains how to choose measures that reflect the job. Repeat selected cases when behaviour varies, and avoid treating a small sample as a precise prediction of all future conversations.

## Turn findings into repairs

When the expected fact is absent from the knowledge, assign a content task. When it exists but was not retrieved, investigate search and document structure. When it was retrieved but the answer changes its meaning, inspect instructions and response behaviour. Retest the failing case and related cases after the repair so that solving one question does not break another.

What's next: improve which evidence reaches the model in [Retrieval strategies](retrieval-strategies.md).

{{< quiz options="The answer contains a citation and sounds confident | Every factual claim follows from applicable evidence, and required conditions are preserved | The answer uses the same words as the expected answer | The agent never says that information is missing" answer="2" explanation="Groundedness depends on support for the claims and faithful handling of conditions. Citations, identical wording and confidence are not sufficient evidence of correctness." >}}
Which review standard best tests knowledge adherence?
{{< /quiz >}}
