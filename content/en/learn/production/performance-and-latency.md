---
title: Performance and latency
linkTitle: Performance and latency
description: "Find where an agent spends time and make waiting shorter, clearer and more predictable without sacrificing correctness."
weight: 20
duration: 12
objectives:
  - Separate first-response time from total task completion time.
  - Identify retrieval, model and tool delays in an agent workflow.
  - Choose safe opportunities for streaming and parallel work.
  - Measure typical and slow experiences with latency percentiles.
---

A receptionist who says “I am checking your booking” feels different from a silent telephone line. Both callers may wait equally long for the booking, but one knows that the request was understood. A good agent needs both kinds of performance: work that finishes promptly and an experience that makes any necessary wait understandable.

**Latency** is the time between an event and its response. For an agent, that might mean the time from sending a question to seeing the first word, or the time until a requested action is confirmed. Always say which interval you measure. A quick greeting does not prove that an order lookup or account correction finished quickly.

## Follow the request through its journey

Consider a customer asking whether a delivered item can be exchanged. The application receives the message, checks access, searches a policy, looks up the order, asks the model to interpret the results, and sends the answer. A real workflow may revisit several stages. If the model requests another tool, there may be another round of reading and answering.

**Retrieval** is finding relevant information in a knowledge source. It can include searching documents and sorting the results by relevance. The **first token** is the first small piece of text the model emits. Before that appears, the provider may queue the request and process its input. **Generation** is the subsequent production of the answer. **Tools** are outside capabilities, such as a stock check or order lookup, with their own waiting times.

{{< flow "Receive and check access | Retrieve policy | Look up order | Generate answer | Deliver response" >}}

This flow shows a simple sequence, not a requirement that every stage run separately. Instrument each real boundary: record when it starts, ends or fails. **Instrumentation** means adding measurements to the application, like placing clocks at stations along a delivery route. Include network travel, waiting for an available worker and preparation of the response; otherwise missing time can be mistaken for slow model generation.

{{< chart type="donut" title="Where one request spends time (illustrative)" unit="%" data=`[{"label":"Retrieval","value":18},{"label":"Waiting for model first token","value":32},{"label":"Generating the answer","value":25},{"label":"Tools","value":20},{"label":"Other application work","value":5}]` caption="Illustrative shares for one serial request, not a benchmark. Overlapping work cannot simply be added as separate elapsed-time shares." >}}

The biggest slice is a starting point for investigation, not proof of the right fix. An order service may be slow only during a busy period; generation may dominate only when the agent writes unnecessarily long replies. Group measurements by task and outcome. Combining a brief policy answer with a detailed report hides useful differences.

## Show useful text sooner with streaming

**Streaming** sends an answer in pieces as it is generated rather than holding the entire response until the end. A reader can start reading an explanation while later sentences are still arriving. This often improves perceived responsiveness, but it does not necessarily reduce the time needed to finish the answer or complete an external action.

Measure **time to first token** from the model request to its first emitted text, and separately measure the time from the user's submission to the first useful visible content. These are not always equal. Retrieval might happen first, and an application or network intermediary may hold pieces before displaying them. Test the experience through the real customer channel, not only in a developer's console.

Streaming is not suitable for every output. An application expecting a complete structured record may need to wait until the whole record is valid. Safety-sensitive content may require checking before display. A partial sentence that sounds like a refund approval must not appear before authorisation is confirmed. If interruption occurs, clearly mark an incomplete answer rather than presenting it as finished.

{{< compare >}}
{{< side title="Fast-looking but misleading" tone="bad" >}}
“Your exchange is approved” appears immediately while the order check is still running. A later refusal contradicts the first message and damages trust.
{{< /side >}}
{{< side title="Responsive and accurate" tone="good" >}}
“I’m checking the order and exchange policy” appears while those steps run. Approval appears only after the required checks complete.
{{< /side >}}
{{< /compare >}}

## Shorten the work that must happen

A smaller or faster model can handle a straightforward step, such as classifying an incoming ticket, while a more demanding step receives a model that meets its quality needs. Smaller does not guarantee faster under every workload: queueing, provider capacity, input size and output length all matter. Compare candidates on the same tasks before routing real users to them.

Keep requests focused. Sending irrelevant documents increases reading work, while asking for an essay when the customer needs a delivery date increases generation work. Remove unnecessary repeated searches and tool calls. Preserve context needed for correct decisions, and compare the rate of follow-up questions: a shorter answer is not a gain if everyone has to ask again.

**Parallel work** means running independent operations at the same time. Checking a public shipping policy and fetching an authorised order record may be independent after the necessary access checks. When both start together, the combined wait is closer to the slower operation than to the sum of both. This is like asking two colleagues to check different folders rather than asking one colleague to do both in sequence.

Do not parallelise steps that depend on one another. A refund must wait for approval, and an order lookup may require a customer identity check first. Simultaneous requests can also overload a downstream service or increase cost. Set a limit on concurrent work, meaning how many operations may run at once, and ensure each operation has the permissions it needs.

{{< cards >}}
{{< card title="Independent lookups" icon="database" >}}
Consider parallel execution when both requests already have valid inputs and neither changes what the other should do.
{{< /card >}}
{{< card title="Dependent actions" icon="lock" >}}
Keep required order: verify identity, check eligibility, obtain approval, then perform the authorised action.
{{< /card >}}
{{< card title="Focused generation" icon="chat" >}}
Give the model relevant context and an appropriate answer length. Brevity must still answer the actual question.
{{< /card >}}
{{< /cards >}}

Related: on AIVAX, reusable choices about a model, knowledge and tools are stored in an [AI gateway](../../docs/inference/ai-gateway.md). Treat any configuration change as something to measure, not as a promise that every conversation becomes faster.

## Bound waiting and handle failure honestly

A **timeout** is a limit on how long an operation may wait. Give individual tools sensible limits within an overall deadline for the task. Without an overall deadline, several retries can each meet their own limit while the user waits far too long. A **retry** repeats a failed attempt; a **fallback** uses an alternative route when the preferred route is unavailable.

A timeout does not always mean that nothing happened. A payment or ticket creation might have succeeded even if its confirmation was lost. Check its status before trying the action again, using duplicate-prevention controls where available. Offer a safe next step when you cannot establish the outcome. [Errors, retries and fallbacks](../advanced-agents/errors-retries-and-fallbacks.md) explains how to avoid turning a delay into repeated side effects.

## Measure the ordinary and the slow experience

A **percentile** describes where a value falls in an ordered set of measurements. **p50**, the median, is the point at or below which half the measured requests fall. **p95** is the point at or below which 95% fall; the remaining requests are slower. These measures distinguish a normal experience from a slow one better than a single average can.

Report the observation period, sample size and what happened to timed-out or failed requests. Excluding every failure can make performance look healthier than it is. Compare similar workloads, and inspect first-use behaviour separately from repeated work that benefits from caching. Use [Metrics](../quality/metrics.md) to combine time measurements with success and reliability, rather than rewarding speed alone.

{{< steps >}}
{{< step title="Define the experience" >}}
Choose an interval such as first useful content or confirmed task completion, and agree what acceptable waiting means for that task.
{{< /step >}}
{{< step title="Measure the full route" >}}
Capture stage timings alongside overall duration, failures and request categories. Find which stage causes slow cases.
{{< /step >}}
{{< step title="Test one improvement" >}}
Try a focused request, eligible parallel lookups or streaming. Check task accuracy and downstream load as well as speed.
{{< /step >}}
{{< step title="Watch real use" >}}
Compare p50 and p95 after a limited rollout. Keep the previous configuration available if reliability or safety worsens.
{{< /step >}}
{{< /steps >}}

A “typing…” indicator is a useful acknowledgement, not a substitute for progress. Prefer truthful messages such as “The order service is taking longer than usual” when that state is known. Do not invent a percentage complete or a completion time. For longer work, allow cancellation where supported and explain if stopping the wait cannot undo an action already performed.

What's next: make performance changes traceable and reversible with [Versioning prompts, agents and knowledge](versioning.md).

{{< quiz options="Stream an approval before the eligibility check finishes | Measure only successful requests and ignore timeouts | Run authorised, independent lookups in parallel and measure total completion time | Give every tool unlimited waiting time" answer="3" explanation="Independent lookups can overlap safely when their inputs and permissions are ready. Measuring completion time verifies the benefit; approvals, dependent actions and failure reporting still need their normal safeguards." >}}
Which change can reduce waiting without skipping required checks?
{{< /quiz >}}
