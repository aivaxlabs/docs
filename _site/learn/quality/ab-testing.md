Source: https://docs.aivax.net/learn/quality/ab-testing.html

An **A/B test** compares two versions, called **variants**, to learn whether a deliberate change improves an outcome. Variant A is usually the current configuration; variant B changes something meaningful, such as the instructions or the model. Instead of asking which reply a team member prefers, you ask a measurable question: does B resolve more eligible support requests without increasing incorrect promises or unacceptable waiting?

Think of trying two versions of a customer-service script. If one employee handles routine enquiries in the morning and another handles complaints in the evening, their results are not a fair comparison of the scripts. The work they received was different. Agent tests face the same problem, along with variation in model responses, changing knowledge and differences between the people who answer feedback surveys.

## Choose offline or online evidence

An **offline test** runs variants against a fixed collection of cases outside live customer use. Both variants receive the same starting cases and are judged by the same rules. It is useful for checking correctness, safety and expected tool behaviour before exposing people to a change. In a simulated conversation, follow-up messages may differ because each agent replies differently; preserve the same scenario and goals rather than forcing an unnatural identical dialogue.

An **online test** compares variants during real use. Assign eligible users or conversations to A or B randomly, meaning by chance rather than according to expected difficulty. The variants receive comparable portions of traffic during the same period, not duplicate copies of each live conversation. Keep assignment stable for the whole conversation, or for the user when repeated visits could influence the outcome.

**Offline comparison**

Use the same case set, controlled conditions and safe tools. Good for repeatable quality checks and catching obvious regressions before release. It cannot fully reproduce real users' behaviour.

**Online A/B test**

Use randomly assigned live traffic with agreed safeguards. Good for measuring actual completion and experience. It requires sufficient traffic, monitoring and a way to stop harmful exposure.

Do not send the same live action to both variants simply to compare them. Two agents could create duplicate bookings or send conflicting messages. A **shadow test** observes how a candidate would respond without letting it act on the user, but it needs explicit isolation of side effects and careful handling of private data. For many teams, an offline comparison followed by a small controlled rollout is simpler and safer.

## Define the decision before seeing the results

Write a **hypothesis**, a specific prediction about the change. For example: “A shorter instruction that separates eligibility checks from explanation will reduce incorrect refund promises without increasing unnecessary handoffs.” Change one important factor when possible. Replacing the model, documents and prompt together can reveal whether the package performs better, but not which component caused the difference.

Choose a **primary metric**, the main measurement that answers the question, before the test begins. Then choose **guardrail metrics**, measurements that must remain acceptable even if the primary result improves. A support test might prioritise verified resolution while guarding accuracy, privacy, waiting time and cost per completed task. Use [Metrics: accuracy, latency, cost, satisfaction](https://docs.aivax.net/learn/quality/metrics.md) to define the measurements consistently, including their denominators and failure cases.

- **Primary outcome** — Choose the result that represents the user's task, such as a correctly completed request. Avoid substituting reply length or confident tone.

- **Protective checks** — Watch for serious errors, unauthorised actions, excessive cost and slow experiences. A gain elsewhere does not excuse these failures.

- **Decision record** — Record the variants, eligible traffic, evaluation rules and release criteria. Preserve the evidence needed to interpret the result later.

Agree on stopping rules too. Severe safety failures can require immediate suspension. Ordinary fluctuations usually need more evidence, not a new decision after every dashboard refresh. Decide the evaluation period or use an appropriate statistical method designed for repeated checking. Otherwise, stopping as soon as one variant happens to look better increases the chance of selecting a lucky fluctuation.

## Understand sample size without a formula

**Sample size** is the amount of independent evidence in the comparison, often the number of users or conversations. A few favourable examples cannot establish a reliable improvement. Larger samples usually make random variation easier to distinguish from a real difference, but the required size depends on how variable the results are and how small an improvement matters to the business.

Counting every message as an independent customer exaggerates the evidence. Messages within a conversation influence each other, and repeated conversations from the same person may be related. Choose the unit of comparison to match the assignment and business outcome. A specialist can help plan sample size and analysis when the decision is consequential, the data are highly variable or the test design is complex.

A **confidence interval** expresses a range of plausible effect sizes under the statistical method's assumptions. In plain terms, it reminds you that the measured difference is an estimate, not an exact property of the agent. If the evidence is consistent with both a useful improvement and no improvement, call the result inconclusive. Collecting more observations may help; declaring the larger displayed number the winner does not.

**Offline resolution results for variants A and B (illustrative)**

| Item | Value |
| --- | --- |
| Variant A | 84% |
| Variant B | 88% |

Invented rates for teaching. No sample size or uncertainty estimate is shown, so the chart alone cannot establish a reliable improvement or justify release.

The illustrative chart makes B look better, but it omits crucial evidence. Were the same cases used? Were outcomes judged consistently? How many cases were there, and did B introduce a severe failure? The gap shown is a difference in percentage points, not proof of a business benefit. Review the underlying cases and the uncertainty before turning a visual difference into a decision.

## Guard against biased comparisons

**Bias** is a systematic distortion that favours one variant for reasons unrelated to the intended change. Running A during an outage and B after recovery is one example. Giving B only short questions is another. Keep traffic allocation, knowledge access, tools and evaluation rules comparable. Record unexpected events and configuration changes so they can be considered during analysis rather than explained away afterwards.

For offline judging, hide variant names where practical and vary the order in which answers are presented. Reviewers, including model judges, can prefer a familiar label, the first answer or a longer explanation. Use the same rubric, meaning the same evaluation checklist, for both variants and inspect disagreements. Keep some cases separate from prompt tuning so the comparison is not merely testing memorised examples.

Inspect important groups such as task type, language and conversation channel, while avoiding a search through countless subgroups until one happens to look favourable. A change can help the average user and hurt a critical group. Decide important group checks ahead of time. Report exclusions, failures and missing feedback consistently; removing abandoned sessions from only one variant can reverse the apparent result.

**What if the test shows no clear winner?**

An inconclusive result is useful information. Keep the current version unless other justified criteria favour a change, improve the hypothesis or gather enough additional evidence under a sound plan. Do not repeatedly alter the rules until the desired variant wins. A genuinely similar-quality option might still be attractive for simpler operations, but that is a separate, documented decision.

## Roll out the chosen version carefully

1. **Pass offline checks**

Reject variants that fail critical requirements. Confirm safe tool behaviour and review changed outcomes before involving live users.

2. **Run the planned comparison**

Assign eligible traffic consistently, monitor guardrails and preserve version records. Stop promptly if a serious safety condition is breached.

3. **Review evidence and uncertainty**

Check the primary outcome, important groups and guardrails. Document whether the result supports release, further investigation or no change.

4. **Expand exposure gradually**

Increase use while watching real outcomes. Keep a known working version available and a clear trigger for returning to it.

A **rollback** returns traffic to a known working configuration. It requires more than remembering the old prompt: identify the model settings, knowledge and tool behaviour that belonged together. [Versioning](https://docs.aivax.net/learn/production/versioning.md) explains how to keep that record. Continue monitoring after full rollout because the mix of work, documents and external services can change even when the agent configuration does not.

**Related on AIVAX:** [Agentic Tests](https://docs.aivax.net/docs/inference/agentic-tests.md) can provide reusable scenarios for offline comparison. Keep scenario definitions and judging criteria consistent between variants. Live traffic assignment and safe rollout still need an explicit plan in the application serving your users; do not assume an evaluation run performs an online A/B experiment.

**What's next:** Protect the agent from malicious instructions in [Prompt injection and jailbreaks](https://docs.aivax.net/learn/safety/prompt-injection-and-jailbreaks.md).

**Knowledge check.** Which approach makes an A/B comparison most trustworthy?

1. Release B whenever its displayed score is slightly higher
2. Give A difficult cases and B easy cases
3. Compare equivalent cases or randomly assigned traffic using predefined outcomes and guardrails
4. Stop the test at the first favourable fluctuation

Answer: option 3. Comparable conditions and predefined rules help separate a real improvement from biased traffic or chance. Safety guardrails remain necessary even when the primary measurement improves.
