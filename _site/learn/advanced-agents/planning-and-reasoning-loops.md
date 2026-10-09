Source: https://docs.aivax.net/learn/advanced-agents/planning-and-reasoning-loops.html

Suppose you ask an assistant to find a supplier and draft an enquiry. A useful result requires more than a convincing paragraph. The assistant must understand what you need, find current offers, compare equivalent products and handle missing details. Some of those decisions become possible only after an earlier search returns. A plan helps organise the work; a loop lets the assistant adapt when the facts change.

An **agent loop** is a repeated cycle of deciding what to do, taking an action, examining the result and choosing what comes next. Think of a buyer with a checklist, not a machine that writes a complete purchasing decision from memory. The checklist can change, but the buyer's authority and budget do not expand just because the task becomes difficult.

## Plan, act, observe, revise

The **plan** states the next useful steps toward a defined result. To **act**, the agent requests an operation from a tool: software that can search, calculate or interact with another system. To **observe**, it reads what actually happened. To **revise**, it changes the remaining plan in light of that evidence. One trip around the cycle is an **iteration**.

Plan the next useful step → Act through an authorised tool → Observe the actual result → Revise, then continue or stop


This approach is often called **ReAct-style**: reasoning and acting alternate. In plain words, the agent does not settle everything before checking the world. It considers the current evidence, acts, and considers the new evidence. You do not need a transcript of the model's private internal reasoning to supervise it. A short action summary, the tool result and the reason for the next step provide a more useful operational record.

The distinction between a plan and evidence matters. “Check delivery costs” is an intention. “The supplier's quote includes delivery” is a claim that needs a source. A search that returned no result is not evidence that delivery is free. The loop should preserve these differences so that a confident draft cannot quietly turn an unknown into a fact.

## Why a loop can beat a one-shot answer

A **one-shot answer** is produced in a single model response without an application-controlled sequence of external checks. It can be perfectly appropriate for rewriting an e-mail or summarising a document already supplied. Adding searches and reviews to that task may only introduce delay. Use a loop when the next action genuinely depends on information that is not yet available.

For a supplier comparison, a first search might reveal that an attractive offer has the wrong pack size. The next search should narrow the product specification rather than collect more of the same offers. A fixed answer written before that discovery could compare unlike products. The loop earns its cost by making a materially better decision, not by appearing busy.

A model designed for more deliberate reasoning and an agent loop are different choices. A model can spend more effort on one response without contacting a supplier database. An application can also run a tool loop with a standard model. [Reasoning versus standard models](https://docs.aivax.net/learn/models/reasoning-vs-standard-models.md) explains the model choice; neither choice removes the need to check external facts.

## Worked example: find the cheapest supplier and draft an e-mail

Begin by defining “cheapest” and “finished”. For this example, the buyer wants the lowest total quoted cost for a specified product and quantity, including delivery, among suppliers the business is allowed to use. The result is a comparison and an unsent enquiry draft. Placing an order and sending the e-mail are outside scope. If the buyer has not supplied a destination or deadline, ask before pretending the comparison is meaningful.


1. **Agree the comparison**

Record the product specification, quantity, delivery destination and acceptable suppliers. Mark any missing requirement that would change the choice.


2. **Gather current offers**

Use an authorised search or catalogue tool. Keep each offer's source, date, pack size, stock status and delivery terms together.


3. **Observe a mismatch**

The lowest advertised price is for a smaller pack. Exclude it or convert it to an equivalent quantity using a calculation tool; do not compare headline prices directly.


4. **Revise the next action**

One otherwise suitable offer omits delivery. Ask for that missing information or mark the total as unknown rather than quietly ranking it first.


5. **Return the bounded result**

Present the lowest verified total among the offers checked, note unresolved quotes and draft the enquiry. Stop without sending or purchasing.





Notice the wording “among the offers checked”. It is a defensible conclusion, unlike “the cheapest supplier anywhere”. The agent cannot establish a universal claim from a limited search. A useful final response explains the comparison boundary and any fact that might change the recommendation. The draft can ask an unresolved delivery question without implying that the supplier has already answered it.

Tool descriptions also shape the loop. If a search tool and a purchasing tool are both available, the agent must know their different effects. Software should enforce the allowed operations rather than relying only on a sentence in the prompt. Review [Adding tools](https://docs.aivax.net/learn/agents/adding-tools.md) for the difference between requesting an action and executing it.

## Design the exits before the entry

A loop needs **stopping conditions**: explicit situations in which it must finish, pause or hand control back. “Continue until confident” is too vague. Models can sound certain without better evidence, and repeated searches can keep uncovering something else to check. Decide what evidence is sufficient for this particular business decision.


- **Success** — The agreed comparison is complete and the unsent draft is ready. More searching would not satisfy an additional requirement.

- **Missing authority or information** — The next step needs permission or a material detail from the user. Pause and ask a focused question.

- **No useful progress** — Repeated attempts return the same missing or unusable evidence. Explain the gap instead of circling indefinitely.

- **Resource limit** — The step, time or spending budget is reached. Return a clearly labelled partial result, not a false success.




A **step limit** bounds how many actions or model calls the application permits. Define which events count: a retry still consumes resources, and a delegated search should not escape the budget. Add an elapsed-time limit and a spending limit as separate controls. Software outside the model should enforce these limits, because an instruction to be economical is not a reliable spending barrier.

Keep the success test observable. “Compared the permitted suppliers with equivalent quantities and recorded missing delivery costs” can be inspected. “Researched thoroughly” cannot. When the agent stops early, the user should see what was completed, what remains unknown and what decision is needed. Partial work can still be valuable if its boundaries are visible.

## Every iteration has a price

Model calls process **tokens**, the pieces of text a model reads and writes. Each iteration may repeat instructions, previous messages and tool results as input, then generate a new response. Tool services may add their own charges. As history grows, later iterations can cost more than earlier ones; twice as many iterations need not mean only twice the total cost.


**Cumulative work cost versus iterations (illustrative)**

| | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- |
| Growing conversation history | 1 cost units | 2.3 cost units | 3.9 cost units | 5.8 cost units | 8 cost units |

Arbitrary teaching units, not prices or measured performance. Later calls in this example process more accumulated context.



Reduce waste by requesting focused tool results, keeping a concise factual work record and avoiding repeated checks of unchanged information. Summaries should preserve important evidence, uncertainty and approval boundaries; shortening history must not remove the fact that sending is forbidden. Choose a budget appropriate to the value of the decision, then measure completed outcomes rather than rewarding longer plans.

**Related:** On AIVAX, reusable instructions, tools and context settings belong to an [AI gateway](https://docs.aivax.net/docs/inference/ai-gateway.md). Those settings are part of configuring the agent; your application still needs explicit completion criteria and control over the overall task.

What's next: explore how the same boundaries apply when work is divided in [Multi-agent architectures and orchestration](https://docs.aivax.net/learn/advanced-agents/multi-agent-architectures.md).

**Knowledge check.** The buyer requested a supplier comparison and an e-mail draft, not a purchase. Which outcome best respects the task?

1. Keep searching until the model says it is completely confident
2. Stop with a comparison of verified totals, label missing information and leave the e-mail unsent
3. Send an enquiry to every supplier automatically because more evidence is always better
4. Remove the iteration limit whenever a quote is missing

Answer: option 2. The task is a bounded comparison and draft. Clear evidence, visible uncertainty and respect for the sending boundary matter more than endless searching or self-reported confidence.
