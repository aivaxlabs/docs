Source: https://docs.aivax.net/learn/quality/continuous-improvement.html

An agent is not finished when it first works. Policies change, customers use unexpected wording and connected systems develop new failure modes. **Continuous improvement** means using evidence from real work to make deliberate, verified changes over time. It does not mean rewriting the instructions whenever someone dislikes a reply. The purpose is to improve a repeatable outcome, not to win an argument about one sentence.

Imagine a shop receiving complaints about incorrect deliveries. Training the staff may help, but not if the warehouse labels are wrong. In the same way, a poor agent answer can come from confusing instructions, missing information, an unavailable tool or an unclear business policy. The first job is to understand the cause. Only then can the team choose a correction likely to help more than one conversation.

## Make the loop explicit

Collect evidence → Classify failures → Fix the cause → Re-test → Deploy and observe


**Deploy** means making a tested version available to its intended users. Observation after deployment closes the loop: you check whether the improvement appears in actual work and whether new problems emerge. Keep the evidence linked to the change so another colleague can understand why it was made. Otherwise, instructions accumulate exceptions whose purpose nobody remembers and which may contradict one another.

A **root cause** is the underlying condition that explains the failure, rather than its visible symptom. “The agent gave the wrong answer” is a symptom. “The approved policy was absent from the searchable knowledge” is a candidate root cause. Confirm it using the conversation, the available documents and records of actions. If the evidence is incomplete, label the cause uncertain instead of choosing a convenient explanation.

## Collect a balanced sample

A **sample** is a selected portion of conversations reviewed in detail. Reviewing everything may be impractical or unnecessary, but reviewing only complaints is misleading. Quiet failures can go unreported, while justified refusals may attract complaints. Include randomly selected routine conversations alongside negative feedback, escalations, abandoned sessions and important high-risk tasks. An escalation is a handoff to a person or another authorised process.

Keep track of how cases entered the sample. A review containing many complaints cannot estimate the overall failure rate of all traffic without accounting for that selection. It can still reveal valuable causes. Maintain a representative sample for estimating overall quality and a targeted sample for investigating serious or unusual problems. These serve different purposes and should not be merged into a single unexplained percentage.

Read the whole relevant exchange, not just the last message. A brief answer may be appropriate after a detailed explanation, and a clarification question may be the safest response to missing information. Remove unnecessary personal details before circulating cases. Use access controls and retention rules so improvement work does not create an uncontrolled collection of customer conversations.

## Tag the cause, not just the tone

A **tag** is a consistent label used to group similar cases. Start with a small set of labels your team can apply reliably. Record the user's intended outcome, what happened instead, the supporting evidence and the likely cause. Add severity, meaning the seriousness of the consequence, separately from frequency. A rare unauthorised action can deserve faster attention than a common awkward greeting.


- **Instructions** — The relevant information was available, but the agent's directions were ambiguous or conflicting. Clarify the applicable rule and its limits.

- **Knowledge** — The needed source was missing, outdated or hard to find. Correct the source and check that the agent can retrieve it.

- **Tools and integrations** — A connected action failed, lacked permission or returned an unclear result. Repair the action path and how failure is communicated.

- **Process or unresolved cause** — The business rule itself is unclear, or evidence is insufficient. Assign investigation rather than disguising uncertainty as a prompt problem.




A single case can have several contributing causes. For example, an order lookup may fail and the instructions may fail to say how to communicate that situation. Record both, but use a consistent rule when summarising cases in a chart. If each case has one primary category, say so. If categories overlap, do not present them as slices that supposedly account for the whole.


**Primary causes in a reviewed failure sample (illustrative)**

| Item | Value |
| --- | --- |
| Knowledge gaps | 40% |
| Unclear instructions | 25% |
| Tool problems | 20% |
| Process or unresolved | 15% |

Invented review results, with one primary category per case. This is not the failure rate of all conversations or a product benchmark.



This illustrative distribution suggests where investigation might begin, not what must be fixed first. Consider severity, affected users and the strength of the diagnosis as well as the size of each slice. A frequent knowledge gap may justify an editorial update, while a smaller permission problem may require immediate containment. Assign an owner who can change the actual cause rather than sending every issue to the prompt author.

## Change the smallest thing that addresses the cause

A **hypothesis** is a specific explanation you can test. Write one before making a correction: “The agent misses the exception because it is separated from the main policy; placing them together should improve these cases.” State which examples should change and which must remain unchanged. This turns editing into a testable intervention instead of a general attempt to make the agent sound better.

Avoid appending the failed customer's wording to the instructions as a special exception. That may fix the demonstration while creating contradictions or making nearby cases worse. If the authoritative policy is incomplete, repair it rather than copying a private answer into a global prompt. If a tool is broken, a request to “try harder” does not repair the connection or authorise additional actions.


**Patch the visible example**

Add “always offer a refund” after one complaint. The example now looks friendly, but unrelated customers receive promises outside the policy.


**Correct the underlying rule**

Clarify the eligibility conditions, repair missing source material and check both eligible and ineligible cases before release.





A **regression test** checks that a previously working behaviour still works. Every confirmed failure should suggest a safe, reusable case, but the new case is not enough on its own. Re-run related and critical cases, then the wider evaluation set. See [Testing and evaluating agents](https://docs.aivax.net/learn/quality/testing-and-evaluating-agents.md) for constructing those expectations and reviewing results. Do not accept several serious regressions merely because an overall average improved.

## Give the team a weekly review ritual

A regular review prevents evidence from becoming an unread inbox. Bring a person who understands the business rules, someone who can modify the agent or its connections, and someone responsible for user experience. Keep the meeting focused on decisions: what failed, what evidence supports the cause, who owns the correction and how the team will know it worked.


1. **Prepare the evidence**

Select authorised samples and summarise trends. Include examples of successful behaviour so the team sees what must be preserved.


2. **Agree on priority and ownership**

Separate urgent containment from ordinary improvement. Name an owner and an observable expected outcome for each selected issue.


3. **Review proposed fixes and tests**

Inspect the smallest correction, new test cases and regression results. Keep uncertain diagnoses open rather than declaring them solved.


4. **Check earlier releases**

Compare post-release evidence with the prediction. Close an issue when its outcome is verified, not merely when an edit is saved.





Weekly review is not a reason to postpone a serious incident. Use a separate urgent response route for privacy exposure, harmful actions or widespread failure. For routine improvements, release in a controlled way and retain a known working configuration. [Versioning](https://docs.aivax.net/learn/production/versioning.md) explains how to identify related prompt, knowledge and tool changes so they can be compared and, when necessary, reversed.

**Related on AIVAX:** [Agentic Tests](https://docs.aivax.net/docs/inference/agentic-tests.md) can turn a conversational failure into a reusable scenario. Keep its expected outcome clear and review results alongside real-world evidence. Simulated improvement supports a release decision; it does not replace checking what happens after users encounter the change.

**What's next:** Compare proposed alternatives fairly in [A/B testing prompts and models](https://docs.aivax.net/learn/quality/ab-testing.md).

**Knowledge check.** What is the safest way to learn from a newly discovered agent failure?

1. Add the exact failed answer to the prompt and release immediately
2. Identify the cause, make a focused change and run both the new case and regression tests
3. Ignore the case unless many users complain
4. Change the prompt, model and all knowledge at the same time

Answer: option 2. A focused, evidence-led correction can be evaluated. Regression tests protect previously working behaviour, while simultaneous unrelated changes obscure the cause of improvement or failure.
