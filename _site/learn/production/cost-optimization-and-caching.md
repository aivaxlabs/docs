Source: https://docs.aivax.net/learn/production/cost-optimization-and-caching.html

An agent's cost is more like a restaurant bill than a flat admission ticket. The main course is the model answering, but extra requests, document searches and outside services can add to the total. A short customer message can trigger substantial work behind the counter. Reducing cost starts with finding that work, not automatically choosing the cheapest model.

The useful question is: **what does a successfully completed task cost?** A cheap answer that sends a customer back through the same conversation may cost more than a careful answer that resolves the issue. Include retries, human correction and unnecessary follow-up turns when comparing alternatives.

## Read the whole bill

A **token** is a small piece of text processed by a model, sometimes a word and sometimes part of one. **Input tokens** are what the model reads; **output tokens** are what it produces. The input includes more than the latest question: instructions, conversation history, document excerpts and descriptions of available tools can all count. Some models also charge for additional reasoning work under their own billing rules.

In a support conversation, the first question may be brief, but the next request often includes earlier messages again. Re-sending history is like handing the receptionist the entire case folder whenever you add a sentence. Long conversations can therefore become progressively more expensive. [Context window, tokens and cost](https://docs.aivax.net/learn/prompt-engineering/context-window-tokens-and-cost.md) explains how the amount of material a model can read relates to this expense.


- **Reading and writing** — Instructions and context contribute input tokens. Long explanations and repeated drafts contribute output tokens.

- **Searching knowledge** — Retrieval means finding relevant material in a knowledge source. Preparing documents, searching them and ranking results may have separate costs.

- **Calling tools** — A tool is an outside capability, such as looking up an order. It may charge separately and trigger another model request to interpret its result.




Measure these parts separately before changing anything. A team might blame long answers when repeated searches actually dominate the bill. Record usage by task category as well as by day: sales qualification, support and overnight document processing have different cost patterns. Compare them using the same definition of success.

> **Interactive demo: Try it: an illustrative token-cost estimate.** This interactive demo is available on the web page. Change conversation volume, input length and output length separately. Treat every price in this exercise as illustrative. This simplified estimate excludes tools, retrieval, retries and other charges, so it is not a complete bill or a product quotation.



## Spend effort where it matters

**Routing** means choosing a path for a request. A simple classification, such as identifying whether a message concerns shipping or billing, may suit a smaller model. A disputed invoice involving several documents may need a more capable model and human review. Route by the task's difficulty and consequences, not just message length: “Cancel everything” is short but potentially serious.

Routing itself can require work, so compare the saving with its added cost. Keep a route for uncertain cases rather than forcing every message into the cheaper path. Use representative examples to test each choice; a smaller model is only cheaper in practice if it completes the task reliably. [Model families and choosing](https://docs.aivax.net/learn/models/model-families-and-choosing.md) develops those selection criteria.

Next, trim **context**, the material supplied to help the model answer. Retrieve the relevant policy section instead of sending the whole handbook. Limit tool results to fields needed for the decision. Ask for a concise answer when a concise answer meets the user's need, but do not remove explanations needed for safe decisions or accurate disclosures.

Summarising history replaces a long conversation with a shorter account of its important facts. Keep the customer's goal, agreed decisions, unresolved questions and essential source references. A summary can omit or distort details, and producing it also costs work. Preserve authoritative records elsewhere; do not let a conversational summary become the only record of an approval or payment instruction.

## Reuse work with caching

A **cache** is stored work that can be reused, like keeping a prepared form instead of recreating it. There are two different opportunities here. They have different safety rules and should not be treated as interchangeable.

**Prompt caching** reuses processing of an identical beginning, or **prefix**, of a request when the provider supports it. Stable instructions and shared reference material can form that prefix, followed by the changing question. Matching rules, minimum lengths, retention periods and pricing vary. Changing an early section may prevent reuse of the later prefix. It does not mean the previous answer is reused, and cache savings are not automatic for every provider or request.

**Response caching** stores a completed answer and returns it for an eligible repeated question. This can avoid a model call altogether. A public opening-hours answer may be a candidate; an account balance usually is not. Match on every factor that changes the answer, including language, permissions and knowledge version. Similar wording alone is not proof that two users should receive the same response.


**Prompt cache**

Reuse processing of an unchanged request prefix. The model still produces a new answer to the current question. Check the provider's matching and retention rules.


**Response cache**

Reuse a previously completed answer. Define who may receive it, how long it remains valid and which changes must remove it from the cache.





Set an **expiry**, a point after which a cached response must be refreshed. Also support **invalidation**, removing a stored answer when something important changes. If a returns policy changes this morning, yesterday's cached explanation may already be wrong even though its expiry is tomorrow. Never share customer-specific results through a public cache, and apply access checks before reuse.

## Compare changes fairly

The chart below shows made-up cost units for the same completed workload. Each pair represents a separate experiment from its own baseline, not a sequence of cumulative savings. Real results depend on usage, pricing and task quality; the values demonstrate how to present evidence rather than promise a reduction.


**Before and after each cost lever (illustrative)**

| Item | Value |
| --- | --- |
| Model routing: before | 100 cost units |
| Model routing: after | 72 cost units |
| Context trimming: before | 100 cost units |
| Context trimming: after | 81 cost units |
| Eligible response caching: before | 100 cost units |
| Eligible response caching: after | 65 cost units |

Illustrative independent experiments, not prices or expected savings. Accept a change only if task quality and safety remain acceptable.



For **batch processing**, independent items are handled as a group in the background rather than during a live conversation. An overnight ticket-classification job can tolerate waiting in a way an active customer cannot. Batch work can simplify scheduling, control simultaneous work and avoid repeating completed items. Do not assume it is automatically discounted: provider terms and the chosen workflow determine its cost.

Related: on AIVAX, processing lists of independent items this way is called [Batch](https://docs.aivax.net/docs/features/batch.md). For actual rates, [see current pricing](https://docs.aivax.net/docs/pricing.md) rather than using the illustrative figures in this unit.

## Put a budget around the experiment

A **budget** is the amount of spending you are prepared to permit for a defined period or workload. An **alert** tells someone that a condition needs attention; it does not necessarily stop spending. Assign an owner who can respond, and decide what happens when a limit is reached: pause background jobs, restrict optional work or offer a human route.


1. **Measure a baseline**

Record cost per completed task, quality and failure rates before making a change. Include unsuccessful attempts.


2. **Change one lever**

Test routing, context size or a cache policy separately so the reason for any difference is visible.


3. **Set operating controls**

Define usage alerts, bounded retries and spending limits where supported. Test what the user sees when work stops.


4. **Review actual outcomes**

Compare saved spending with correction effort and customer outcomes. Keep the change only when the whole task improves.





Watch unusual patterns as well as totals. A sudden rise in requests per conversation may indicate a tool loop rather than healthy demand. Review spending after instruction, model or knowledge changes, because each can alter how much work the agent performs. Savings that disappear under real traffic are a signal to investigate, not to remove safeguards.

What's next: examine how the same work affects waiting time in [Performance and latency](https://docs.aivax.net/learn/production/performance-and-latency.md).

**Knowledge check.** Which cost-saving approach is most appropriate for repeated policy questions?

1. Cache every answer using only the question text
2. Reuse eligible public answers with permission, freshness and version checks
3. Remove all conversation history regardless of the task
4. Choose the cheapest model without evaluating outcomes

Answer: option 2. Response caching can avoid repeated work, but only when the stored answer is valid for the current user and situation. Permissions, freshness and version checks protect correctness and privacy.
