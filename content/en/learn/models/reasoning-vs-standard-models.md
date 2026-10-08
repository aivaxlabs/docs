---
title: Reasoning vs standard models
linkTitle: Reasoning models
description: "Decide when additional model reasoning is worth the waiting time and cost, and how to present useful explanations without relying on hidden thought."
weight: 50
duration: 12
objectives:
  - Distinguish additional reasoning computation from an ordinary direct answer.
  - Identify tasks that benefit from reasoning and tasks that usually do not.
  - Treat reasoning effort as a model-dependent resource setting.
  - Request concise explanations, evidence, and verification instead of hidden thought.
---

Some questions are like looking up a meeting time. Others are like rearranging a delivery schedule after a vehicle breaks down: several constraints must fit together, and changing one choice affects the others. Both involve language, but they do not require the same amount of problem-solving work.

A **reasoning model** is designed to spend additional computation working through a problem before or while producing its final answer. People often describe this as a model that “thinks before answering.” That is a useful shorthand for a processing pattern, not a claim that the model has human awareness or that its conclusions are automatically correct.

In this unit, **standard model** means a model used for a more direct response without a separately managed reasoning process. The boundary is not absolute. Standard models can solve difficult problems, and some model families offer both ordinary and extended-reasoning modes. Compare the actual model and configuration rather than assuming the category name predicts the outcome.

## What the extra work is for

Additional reasoning can help when a task involves several dependent decisions, conflicting conditions, or a need to check intermediate conclusions. A scheduling problem may require checking availability, travel time, and service commitments together. A code investigation may require tracing how an error passes through several components. A contract comparison may require combining definitions and exceptions from different sections.

Think of the difference between answering a familiar question immediately and using scratch paper to work through a puzzle. Extra working space and time can help, but neither guarantees that the facts on the paper are correct. A reasoning model with an outdated policy can spend longer reaching a carefully worded, incorrect recommendation.

{{< compare >}}
{{< side title="Direct response" >}}
**Task:** Rewrite an approved delivery notice in friendlier language.

The facts and intended meaning are already supplied. A standard model can often perform the transformation without additional reasoning overhead.
{{< /side >}}
{{< side title="Additional reasoning" >}}
**Task:** Propose a revised delivery plan while respecting driver availability, travel times, and customer time windows.

Several constraints interact. A reasoning model may help explore a plan, but the schedule still needs validation against authoritative data.
{{< /side >}}
{{< /compare >}}

Long text is not automatically difficult reasoning, and short text is not automatically easy. Summarising a long but straightforward meeting transcript may be mostly compression. A short puzzle with several interacting constraints can be much harder. Classify the work by the decisions required, not merely by the number of words in the request.

## The trade-offs: quality, waiting, and cost

**Latency** is the time a user waits for a result. Extra reasoning can increase latency because the system performs more work before the final reply is ready. **Cost** can also increase through additional computation or generated reasoning tokens, according to the model's pricing and usage rules. A short visible answer therefore does not always mean a small amount of work happened.

The possible benefit is better performance on suitable problems. “Possible” matters: extra effort may have little effect on a simple task, and a model can use more computation without finding the right solution. A more capable direct-response model may also beat another model in reasoning mode. Only comparisons on your own tasks establish which arrangement helps.

{{< chart type="bar" title="Illustrative response latency for one imagined task set" unit=" seconds" data=`[{"label":"Standard configuration","value":2},{"label":"Reasoning configuration","value":8}]` caption="Invented teaching values, not measured performance or expected service times. Model, workload, output length, and infrastructure all affect latency." >}}

{{< chart type="bar" title="Illustrative accuracy on the same imagined multi-step tasks" unit="%" data=`[{"label":"Standard configuration","value":70},{"label":"Reasoning configuration","value":85}]` caption="Invented examples of a possible trade-off, not benchmarks. Reasoning does not guarantee this improvement, and simple tasks may show no benefit." >}}

Treat these charts as questions to investigate, not forecasts. How much longer do customers wait? How often does the extra effort prevent a costly mistake? Does a reviewer spend less time correcting the result? Compare the full business outcome, including retries and review, rather than counting only model requests or final answer words.

A live support conversation may need a quick acknowledgement and a clear explanation that a complex case is being checked. An internal overnight analysis can tolerate more delay. The same model setting can therefore be appropriate for one workflow and frustrating in another, even when both produce accurate answers.

## When not to reach for reasoning

{{< cards >}}
{{< card title="Simple transformation" icon="refresh" >}}
Reformatting a supplied paragraph, shortening an approved reply, or extracting an obvious field usually needs clear instructions more than additional reasoning.
{{< /card >}}
{{< card title="Missing facts" icon="database" >}}
An unknown order status needs an authorised lookup. More thought cannot reveal private information that was never supplied.
{{< /card >}}
{{< card title="Exact computation" icon="tools" >}}
Financial totals and strict scheduling constraints benefit from calculators or validating software. A model can explain the result without being the sole calculation engine.
{{< /card >}}
{{< card title="Immediate interaction" icon="time" >}}
A brief voice exchange or autocomplete suggestion may place a high value on responsiveness. Test whether extra delay provides any useful benefit.
{{< /card >}}
{{< /cards >}}

Do not use reasoning as a substitute for knowledge retrieval, permission checks, or a human decision. If the business rule says that a manager must approve a refund, a more elaborate analysis does not grant the assistant that authority. Likewise, if the available sources disagree, the model should surface the disagreement rather than invent a confident compromise.

## Reasoning effort is a dial, not a promise

Some models expose **reasoning effort**, a setting that requests a different amount or style of reasoning work. A service may offer labels such as low, medium, or high; supported labels and their meaning vary. Some models provide no adjustable effort setting at all. A label is not a standard duration or a guarantee of a particular quality level.

Begin with the supported default or a modest effort level, then test whether increasing it improves the outcomes that matter. Keep the question, source material, and scoring rules unchanged. If the model keeps failing because a key policy is missing, fix the evidence instead of turning the dial upward.

Output budgets need attention too. Some models count internal reasoning against a completion token budget. A budget that is sufficient for the visible reply may not be sufficient for reasoning plus the reply. Check completion status and model guidance so that an unfinished answer is not mistaken for a completed one.

{{< steps >}}
{{< step title="Identify the difficult part" >}}
Decide whether the task requires reasoning, missing information, exact calculation, or permission. Choose the remedy for that particular need.
{{< /step >}}
{{< step title="Establish a direct-response baseline" >}}
Use representative examples and a clear definition of success. Include simple requests as well as difficult cases.
{{< /step >}}
{{< step title="Compare additional effort" >}}
Test a supported reasoning configuration with the same evidence. Record correctness, completion, waiting time, and total cost.
{{< /step >}}
{{< step title="Route selectively" >}}
Use the additional processing where it produces a worthwhile improvement. Keep checks and human approval independent of the selected model.
{{< /step >}}
{{< /steps >}}

## What to show the user

A model's internal reasoning may be hidden, unavailable, or represented by a service-provided summary. It is not a dependable audit trail. You should not design a workflow that requires access to private internal thought, and a request to reveal it is not a reliable way to verify correctness.

Instead, ask for the information a person can use: the conclusion, relevant source references, important assumptions, calculations that can be checked, and unresolved uncertainty. A concise explanation can show why a recommendation follows from a policy without reproducing every intermediate step. Verify claims against the sources and results against independent checks.

Hiding a reasoning display does not necessarily disable reasoning computation or reduce its cost. Showing a longer explanation does not prove that more internal reasoning occurred. Presentation and computation are separate choices. Keep the customer-facing explanation proportionate: someone asking for a delivery date usually needs the date and its source, not a long essay.

Related: [prompting techniques](../prompt-engineering/prompting-techniques.md) explains how to give a task structure, and [planning and reasoning loops](../advanced-agents/planning-and-reasoning-loops.md) covers agents that alternate between decisions and actions. On AIVAX, supported reasoning options belong to the [inference configuration](../../docs/inference/inference.md); support depends on the selected model.

What's next: learn [function calling](../tools-and-integrations/function-calling.md), which lets an assistant request real information and actions instead of trying to reason its way around missing access.

{{< quiz options="Always use the highest reasoning effort because a longer wait proves a better answer | Use additional reasoning when representative tests show a useful benefit, while retaining evidence and independent checks | Show all internal thought to guarantee correctness | Replace an order lookup with a reasoning model" answer="2" explanation="Reasoning is an optional resource investment, not a source of missing facts or authority. Test its benefit on suitable tasks and verify consequential results independently." >}}
Which policy makes sense when adopting a reasoning model for a business assistant?
{{< /quiz >}}
