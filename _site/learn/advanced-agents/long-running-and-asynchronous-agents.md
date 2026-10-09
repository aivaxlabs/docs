Source: https://docs.aivax.net/learn/advanced-agents/long-running-and-asynchronous-agents.html

A customer asking for opening hours expects an answer while the conversation is open. A manager asking for a review of a large document collection may be willing to return later. Both are agent tasks, but they need different delivery arrangements. Keeping a chat window spinning for hours does not make long work reliable. The application needs a record of the work that exists independently of the conversation.

Long-running tasks include researching a market, processing a list of records and preparing reports from several sources. Scheduled follow-ups add another kind of waiting: the work should happen at an agreed future time. In each case, the agent needs a defined scope, an owner and a way to report what actually happened, including partial completion or failure.

## Synchronous and asynchronous work

**Synchronous** work keeps the caller waiting for the result of the current request. **Asynchronous** work acknowledges the request and completes it separately, so the caller can leave and check later. Think of waiting at a counter for a copy versus leaving a print order and collecting it when notified. Asynchronous does not mean faster; it means the result is delivered through a different lifecycle.


**Synchronous response**

The user waits in the current interaction. It suits short, bounded questions and actions whose results are needed immediately. A slow dependency can keep the whole interaction waiting.


**Asynchronous job**

The application returns a receipt and maintains a separate work record. It suits longer tasks, queued work and later delivery. The interface must explain status, cancellation and where the result will appear.





A **background job** is a recorded unit of work processed independently of the original request. A **queue** holds jobs waiting to run, and a **worker** is the process that takes a job and performs its steps. These are ordinary software responsibilities around the model. A model saying “I will keep working” is not proof that a background job was created.

A **scheduled task** has an agreed time or trigger for starting. Be precise about the time zone, recurrence and stopping rule. A recurring customer follow-up also needs permission for future contact and a way to cancel it. Verify the customer's current status when the task runs; a message that made sense when scheduled may become inappropriate after the issue is resolved.

## Match expectations to the kind of task

A research job may spend time finding and comparing sources. A batch job repeats a process over independent records. A follow-up may spend most of its lifetime waiting for its due time rather than using a model. The user should be able to distinguish time in a queue, time waiting for approval and time actively processing.


**Example active processing durations (illustrative)**

| Item | Value |
| --- | --- |
| Brief research task | 12 minutes |
| Document comparison | 25 minutes |
| Independent-record batch | 90 minutes |

Invented planning examples, not benchmarks, service promises or product limits. Queue time and scheduled waiting are excluded; real duration depends on scope, tools and failures.



Do not present these examples as a delivery estimate for a real task. Estimate from observed workloads where possible, state what the estimate includes and update it when conditions change. An exact finish time is misleading when the amount of work is still being discovered. A clear current stage can be more useful than a precise-looking countdown.

## Give the job a visible lifecycle

A **lifecycle** is the set of stages a job passes through, from acceptance to a final outcome. “Accepted” means the application has recorded the request, not that the task is finished. “Completed” should mean the agreed deliverable exists and passed its checks. Make blocked, failed, cancelled and partially completed outcomes visible rather than grouping all stopped work under success.


- **Accepted — Record the agreement**: Store the goal, scope, owner, delivery channel, limits and a receipt the user can revisit.

- **Queued — Wait without pretending to work**: Show that the job is waiting for capacity or its scheduled start. Preserve the ability to cancel.

- **Running — Work and save progress**: Process the next permitted unit, validate its result and record a checkpoint before moving on.

- **Paused if needed — Request a concrete decision**: Explain missing information, exhausted budget or required approval. Do not keep spending while a human decision is needed.

- **Finished — Deliver an honest outcome**: Make the checked result available, disclose omissions and notify the user through the agreed channel.




A job needs a durable record: information stored so it survives a closed browser, a lost connection or a restarted worker. That record should identify completed items, current work, unresolved errors, approved actions and remaining budget. Do not rely on the model's conversation alone as the only record. Conversation history may be shortened or become too large, while the job still needs an accurate account of what changed.

## Use checkpoints to resume safely

A **checkpoint** is a saved position from which work can resume. Imagine placing a bookmark after each verified section of a report. For a record-processing job, save the result of each completed item or manageable group of items. After an interruption, continue from the saved state instead of rerunning the entire list.


1. **Define a unit of work**

Choose an item that can be checked and recorded independently, such as one document or one input row. Document any dependency on earlier results.


2. **Perform and validate the unit**

Run the permitted operation, check the output and distinguish success from a missing or invalid result.


3. **Save outcome and position together**

Record the result, completion state and information needed to avoid repeating its external effects. A progress counter alone is not enough.


4. **Resume from confirmed state**

Skip verified completed work, reconcile uncertain actions and retry only the remaining eligible items within the original limits.





Some operations create a dangerous gap between the external effect and the checkpoint. An e-mail may be sent just before the worker stops, leaving no local record of completion. Blindly resuming could send it again. **Idempotency** means repeated processing of the same intended operation does not create additional effects. A service can support this by recognising a stable operation reference and returning the earlier outcome rather than repeating the action.

That protection must exist in the receiving system or in a carefully designed action process; adding a label to a prompt does not make an operation idempotent. When the remote outcome cannot be established, pause for reconciliation instead of assuming it failed. Distinguish “retry this same operation” from “the user deliberately requested a new operation”. They must not accidentally share the same completion record.

## Report progress without inventing it

For a fixed list, show counts of completed, failed and remaining items, with clear definitions. If a retry is in progress, do not count the same record twice. For open-ended research, use stages and findings: “Source collection complete; comparing conflicting delivery terms” is more honest than an unsupported percentage. Progress should describe verified work, not how much text the agent has written.


- **Useful progress** — Show completed work, the current stage and any decision blocking the next step. Label estimates as estimates.

- **Controlled cancellation** — Stop starting new work and explain whether an operation is already in progress. Cancellation does not undo a completed external action.

- **Reliable notification** — Send an agreed completion notice with a safe link to the result. Keep the result accessible even if notification delivery fails.

- **Bounded spending** — Count model calls, tool use, retries and delegated work toward the same task budget. Pause before authorised resources are exhausted.




Notifications deserve their own status. “The report is ready” and “the user received the notification” are different facts. Avoid putting sensitive results directly into an e-mail or notification that might be viewed on a shared screen. Prefer the agreed channel and an authenticated route to the full result. Do not notify a new recipient merely because the original contact failed.

## Keep long work within its original authority

Time can change the context. Before a consequential action, recheck permissions, approval validity and facts that may have become stale. An approved draft is not permission to send a materially changed version tomorrow. Longer execution makes this separation more important, because people may update records or cancel instructions while the job is waiting.

A **cost cap** is an enforced maximum spending budget for the task. Apply it across retries and workers, and check the remaining allowance before starting more work. Also set a deadline and a limit on simultaneously active workers. More simultaneous work may shorten a queue but can increase rate-limit errors and make spending harder to control. When a cap is reached, preserve progress and ask whether to stop or extend the authorised scope.

**Related:** On AIVAX, [Batch](https://docs.aivax.net/docs/features/batch.md) processes the same workflow over independent items in the background. It is not a general replacement for dependent multi-step jobs. [Gateway pipelines](https://docs.aivax.net/docs/inference/pipelines.md) describe processing within gateway requests, not a durable background-job scheduler. Use [Webhooks, events and automations](https://docs.aivax.net/learn/tools-and-integrations/webhooks-events-and-automations.md) to understand event-driven coordination around these capabilities.

What's next: learn to prove that these designs work in [Testing and evaluating agents](https://docs.aivax.net/learn/quality/testing-and-evaluating-agents.md).

**Knowledge check.** A background job restarts after an interruption. Which recovery approach is most reliable?

1. Restart the entire job because repeated work is always safer
2. Resume from confirmed checkpoints, reconcile uncertain external actions and preserve the original limits
3. Mark the job complete because some results were saved
4. Remove the cost cap until every item succeeds

Answer: option 2. Durable checkpoints avoid unnecessary repetition, but uncertain external effects still need reconciliation or idempotency protection. A restart does not grant new spending or action authority.
