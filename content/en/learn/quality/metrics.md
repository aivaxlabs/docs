---
title: "Metrics: accuracy, latency, cost, satisfaction"
linkTitle: Quality metrics
description: "Measure whether an agent solves the right problem at an acceptable speed and cost while giving people a useful experience."
weight: 20
duration: 11
objectives:
  - Define accuracy, latency, cost and satisfaction for an agent's task.
  - Interpret p50 and p95 without relying only on averages.
  - Choose targets that reflect the consequences of the use case.
  - Read a dashboard without hiding failures behind a single score.
---

A **metric** is a consistently defined measurement used to understand performance. For an agent, “good” has several meanings: giving a correct answer, completing work promptly, using resources responsibly and helping the person who asked. These qualities can move in different directions. A shorter answer may arrive faster but leave out a crucial condition. A longer conversation may cost more yet prevent an expensive mistake.

Think of running a delivery service. Arrival time matters, but delivering the wrong parcel quickly is not success. Likewise, an agent dashboard should not celebrate speed while ignoring correctness. Start with the job the agent exists to do, decide what successful completion looks like, and then select measurements. A **dashboard** is simply a shared view of those measurements over a stated period.

## Understand the four perspectives

{{< cards >}}
{{< card title="Accuracy" icon="check" >}}
Does the agent provide the correct information and complete the required task under the stated rules? Evaluate against verified expectations.
{{< /card >}}
{{< card title="Latency" icon="time" >}}
How long does the person wait? Measure a clearly defined interval, such as sending a message to receiving a complete answer.
{{< /card >}}
{{< card title="Cost" icon="coin" >}}
What resources are consumed to deliver the outcome? Include failed attempts, connected services and human work where relevant.
{{< /card >}}
{{< card title="Satisfaction" icon="user" >}}
How useful and understandable was the experience to the person using it? Collect feedback, while recognising who did not respond.
{{< /card >}}
{{< /cards >}}

**Accuracy** needs a definition that fits the task. For extracting invoice fields, compare each required field with a checked reference. For support, review whether the answer follows the policy and addresses the question. For a booking agent, verify the booking and the required confirmation. A common measure is the proportion of evaluated cases that meet all required criteria. Always state which cases were evaluated and what counted as a pass.

Do not confuse accuracy with confidence in the writing. Nor should you compare two scores calculated with different rules. An agent graded only on factual wording has an easier test than one graded on wording, permissions and completed actions. Use [testing and evaluating agents](testing-and-evaluating-agents.md) to establish a stable checklist. Report serious failures separately, even if the overall pass rate is high.

**Latency** means elapsed waiting time. Measure it where the user experiences it, not only inside the model. The full delay can include searching documents, contacting a business system and retrying a failed request. If text appears gradually, distinguish time to first visible text from time to a complete useful answer. Starting quickly can reassure someone, but a premature “Done” must never imply that an unfinished action succeeded.

**Cost** should describe an outcome, not just a single model response. A cheap request that needs repeated attempts and human correction can be expensive overall. Track total operating cost and cost per completed task, with a clear definition of completion. State whether the calculation includes document search, tools, evaluation, storage and human review. Keep the categories visible so a change in accounting is not mistaken for a change in efficiency.

**Satisfaction** is the user's assessment of the experience. A short rating or question such as “Did this resolve your issue?” can help, as can reviewing complaints and follow-up contacts. Satisfaction is not a substitute for correctness: a user may like an answer that is wrong, or dislike a correct refusal. Record how many people were invited to respond and how many did; silent users cannot automatically be counted as satisfied.

## Read percentiles as positions in a queue

An average combines all measurements into one number, which can hide unusually slow experiences. A **percentile** describes a position when measurements are arranged from smallest to largest. **p50**, also called the median, is the middle: about half the observations are at or below it. **p95** describes a value at or below which about ninety-five percent of observations fall. It helps expose the slower end of the experience.

Imagine lining up completed requests from fastest to slowest. The middle request tells you about an ordinary wait; a request near the slow end tells you about a frustrating wait. Neither is the maximum, and p95 does not mean every user will receive an answer before that time. Include the number of observations and the measurement period, because a percentile from a tiny sample is unstable.

{{< stats >}}
{{< stat value="p50" label="The middle observation" >}}
{{< stat value="p95" label="A view of the slower end" >}}
{{< stat value="Maximum" label="The slowest observed case, not a guarantee" >}}
{{< /stats >}}

{{< chart type="bar" title="Complete-answer waiting time (illustrative)" unit=" seconds" data=`[{"label":"Version A p50","value":3},{"label":"Version A p95","value":12},{"label":"Version B p50","value":4},{"label":"Version B p95","value":7}]` caption="Invented observations show why the typical wait and the slow-end wait can move in opposite directions. These are not product benchmarks." >}}

In this illustrative comparison, version B makes the middle experience slower but improves the slow end. Whether that is desirable depends on the service promise and the task. Also count requests that failed or timed out. Excluding them from the chart without a separate failure measure can make an unreliable service appear fast, because its worst experiences disappeared from the calculation.

## Set targets for a specific job

A **target** is the level you aim to achieve; a **guardrail metric** is a measurement that must not become unacceptable while you optimise something else. For a sales assistant, a primary target might be successful qualification using the agreed criteria. Guardrails might cover misleading promises, unauthorised contact and excessive waiting. Decide these rules before choosing which version looks better.

The following targets are qualitative starting points, not universal service guarantees. Turn them into measurable local requirements with the people responsible for the work. A back-office process that runs overnight has different timing needs from a person waiting during a support conversation. The consequences of an error should influence review and escalation requirements, not merely the score displayed on a chart.

| Use case | Primary evidence | Timing expectation | Important guardrail |
| --- | --- | --- | --- |
| Customer support | Correct resolution or appropriate escalation | Prompt conversational feedback | No invented policy exceptions |
| Sales qualification | Required needs captured accurately | Keep the conversation moving | No unsupported commercial promises |
| Internal knowledge assistant | Answer supported by current documents | Useful answer while the employee works | Respect access restrictions |
| Back-office processing | Correct records produced and checked | Finish within the agreed work window | No unauthorised changes |

{{< compare >}}
{{< side title="Optimise one number" tone="bad" >}}
Choose the cheapest response and celebrate lower spending, even though customers repeat questions and staff repair more errors.
{{< /side >}}
{{< side title="Optimise the outcome" tone="good" >}}
Compare cost per successfully completed task while checking accuracy, waiting time, safety and human correction effort.
{{< /side >}}
{{< /compare >}}

## Build a dashboard that supports decisions

Keep the dashboard small enough to read, but show definitions next to the values. Include the period, sample size, agent version and whether results came from tests or real users. Separate important groups, such as conversation channel, language and task type. Otherwise, an influx of easy questions can make overall accuracy rise even when the agent became worse at every difficult task.

Show trends alongside recent values, and mark releases or changes to measurement rules. A trend is a sequence of measurements over time; it helps distinguish a persistent shift from a brief fluctuation. Link concerning results to privacy-safe examples so the team can investigate. Assign an owner to each important measure and an action to each alert, rather than collecting numbers nobody uses.

**Related on AIVAX:** [Agentic Tests](../../docs/inference/agentic-tests.md) provide evaluation outcomes for configured scenarios. Use those as one source of quality evidence alongside your application's timings, business outcomes and user feedback. A test result and a customer-satisfaction response answer different questions and should remain distinguishable.

**What's next:** Learn how to investigate the numbers in [Logs, traces and monitoring](logs-traces-and-monitoring.md).

{{< quiz options="p95 is the longest possible wait | p95 means the agent is correct most of the time | About ninety-five percent of measured waits are at or below that value | Every request takes exactly that long" answer="3" explanation="A latency percentile describes the distribution of observed waiting times. It is neither an accuracy score nor a guarantee about future requests." >}}
What does p95 latency tell you?
{{< /quiz >}}
