Source: https://docs.aivax.net/learn/production/deployment-checklist.html

A demonstration proves that an agent can work in a selected situation. **Deployment** makes it available in its intended environment; going live means real people can depend on it. That changes the question from “Can it answer?” to “Can we operate it responsibly when the answer is wrong, the service is slow or the request is outside its remit?”

Use this checklist as a launch review, not a ceremony. Each checked item should point to evidence and an accountable owner. A configuration screenshot may prove that a setting exists; a test result shows whether it works. Neither replaces a named person who can make a decision when something goes wrong.

## Define what readiness means

Start with a precise service promise. A support agent that explains published policies has different risks from one that changes account details. State who may use it, which tasks it handles and which actions remain human decisions. The launch decision should apply to that scope, not to an undefined idea of an “intelligent assistant”.

A **blocking issue** is a problem serious enough to prevent release, such as private information reaching the wrong customer or an unauthorised action succeeding. Other issues may be acceptable within a restricted pilot if they have an owner, a mitigation and a review date. Record those decisions explicitly; a nearly complete checklist is not a reason to ignore the remaining safety issue.

- **Service promise** — Goals, instructions and knowledge define what the agent is meant to do and what supports its answers.

- **Boundaries** — Tools, permissions, safety and privacy define which information and actions must remain protected.

- **Evidence and operation** — Evaluation, monitoring and cost controls show whether the service works and stays within agreed limits.

- **People and release** — Support, escalation and rollout establish who responds, who decides and how exposure increases safely.

The grouped checklist below is intended for a joint review by the service owner and the people responsible for operations, data and customer support. Add evidence references in your working copy. A task is not complete merely because someone plans to finish it after launch. If a requirement does not apply, record why rather than silently removing it.

## Review the launch checklist

**Goals and scope**

- [ ] Define the audience and supported tasks — this sets shared service expectations.
- [ ] List excluded requests and forbidden actions — this prevents open-ended promises.
- [ ] Name the owner and success criteria — this makes launch accountable and measurable.

**Instructions**

- [ ] State the role, boundaries and uncertainty behaviour — this guides responses when information is missing.
- [ ] Check for conflicting rules — this reduces unpredictable choices.
- [ ] Save the approved instruction version — this connects behaviour to its reviewed configuration.

**Knowledge**

- [ ] Confirm source ownership, effective dates and freshness — this reduces obsolete answers.
- [ ] Test retrieval with realistic wording — this checks whether evidence is findable.
- [ ] Separate knowledge by access permissions — this protects restricted material.

**Tools and permissions**

- [ ] Enable only necessary actions and minimum access — this limits potential damage.
- [ ] Require approval for consequential actions — this preserves human control.
- [ ] Test timeouts and duplicate prevention — this avoids repeated actions after lost confirmations.

**Safety and privacy**

- [ ] Review malicious instructions in messages and documents — this tests resistance to attempts to redirect the agent.
- [ ] Document data purpose, access, retention and deletion — this makes personal-data handling deliberate and reviewable.
- [ ] Explain the AI role and relevant limitations — this helps people decide when to ask for human assistance.

**Evaluation**

- [ ] Run representative, difficult and out-of-scope cases — this tests beyond easy examples.
- [ ] Confirm accuracy, safety and failure criteria — this exposes harmful mistakes.
- [ ] Save results for the exact release — this links approval to what launches.

**Observability**

- [ ] Record outcomes, timings and release labels — this helps locate failures.
- [ ] Remove unnecessary sensitive content from logs — this reduces diagnostic exposure.
- [ ] Test alerts and assign responders — this ensures issues reach someone able to act.

**Cost controls**

- [ ] Estimate cost per completed task and volume — this connects spending to outcomes.
- [ ] Bound retries, tool loops and concurrent work — this limits runaway processing.
- [ ] Define budget alerts and safe stop behaviour — this makes overspending manageable.

**Support and escalation**

- [ ] Provide a visible route to a person — this gives users an alternative when automation cannot help.
- [ ] Test handoff details and service availability — this prevents cases from disappearing between teams.
- [ ] Assign incident and communication owners — this gives staff a clear route for urgent decisions.

**Rollout plan**

- [ ] Start with a limited, suitable pilot audience — this reveals problems before expansion.
- [ ] Define expansion and pause criteria beforehand — this reduces pressure to excuse poor results.
- [ ] Rehearse stopping and restoring a safe configuration — this makes recovery practical.

## Inspect the boundaries, not just the answers

**Permissions** determine what a user or system is allowed to read or change. Do not rely only on an instruction saying “Never access another customer's order”. The application and connected service must enforce that boundary. Test with a user who should be refused, a missing identity and an expired connection as well as a valid request. Correct refusal is a successful safety outcome, not a defect to bypass.

**Personal data** is information relating to an identifiable person. Decide what the agent genuinely needs and avoid collecting the rest. Conversation records, tool results and diagnostic logs can each contain sensitive material. Confirm who can access them, how long they are retained and how deletion requests are handled. Legal requirements depend on the situation; use [Privacy, LGPD and GDPR](https://docs.aivax.net/learn/safety/privacy-lgpd-gdpr.md) to frame the questions for your responsible privacy or legal reviewer.

Knowledge checks should test access as well as freshness. An internal handbook may be current but inappropriate for a public support channel. A successful search is not enough: the retrieved passage must apply to the user's situation and be permitted for that audience. Where the source does not answer the question, test that the agent admits the gap and takes the agreed next step.

## Make failures visible and actionable

**Observability** means being able to understand what a system is doing from its recorded signals. A **log** records events; a **trace** connects steps belonging to one request. Capture enough information to distinguish a failed search from a failed tool or an unsuitable model answer, without recording unnecessary private content. [Logs, traces and monitoring](https://docs.aivax.net/learn/quality/logs-traces-and-monitoring.md) explains how to turn those signals into useful operational evidence.

Test an alert by deliberately creating a safe failure in a test environment. Confirm that it reaches the right person and includes enough context for action. A dashboard nobody checks is not an incident response plan. Write down how to pause the affected capability, preserve appropriate evidence and explain the situation to users without guessing about the cause.

A **human escalation** transfers a case or decision to a person. Specify what triggers it: unresolved uncertainty, an explicit user request, a sensitive decision or repeated failures. Include the relevant history and attempted steps, with only the information the receiving team needs. [Human in the loop](https://docs.aivax.net/learn/advanced-agents/human-in-the-loop.md) describes where human approval and review belong in an agent workflow.

Do not promise immediate help when the support team is unavailable. Explain the next available route and what the user should expect. Test what happens when the handoff itself fails, and ensure that the user can distinguish “Your case was received” from “Someone has resolved your case”. Those are different commitments.

## Roll out gradually, using evidence

A **pilot** is a deliberately limited period of real use with a suitable audience. It is not permission to expose users to known unsafe behaviour. Choose lower-risk tasks first, keep support available and explain the service's limitations. Gradual rollout then increases exposure only after the current stage meets predefined acceptance criteria.

1. **Rehearse in a controlled environment**

Run the complete journey with protected test data, including denied access, unavailable tools and the stop procedure.

2. **Run a limited pilot**

Offer the approved scope to a small, suitable audience. Review failures and handoffs alongside successful interactions.

3. **Expand in stages**

Increase the audience or task scope deliberately, not both by accident. Recheck capacity, quality, cost and support readiness.

4. **Operate and review**

Maintain owners and regular reviews after launch. Repeat relevant readiness checks when instructions, tools, knowledge or models change.

Use task completion, unsafe outcomes, waiting time, escalation and cost together. A high completion rate is not acceptable if the agent achieves it by making unauthorised promises. Infrequent serious failures deserve individual review rather than being hidden by a strong average. Decide before launch what evidence would cause expansion to stop.

For an illustrative review, imagine that most items are complete but one access-control issue remains. Counting completed boxes helps coordinate work, but it cannot outweigh that blocker. The numbers below describe only that fictional review and are not recommended thresholds or proof of readiness.

- **27** — checks complete in an illustrative review

- **2** — checks awaiting evidence in the same review

- **1** — blocking access issue: launch remains paused

**Can we launch with an incomplete checklist?**

Only within a scope that remains safe and explicitly approved. A missing feature may be excluded from the pilot; a broken permission boundary cannot be excused by limiting the audience. Record each exception, owner, mitigation and review date. If the team cannot explain how users remain protected, keep the affected capability unavailable.

What's next: apply this checklist to a concrete service in [Customer support agent](https://docs.aivax.net/learn/guides/customer-support-agent.md).

**Knowledge check.** A launch review finds one unresolved issue that exposes another customer's records. What should the team do?

1. Launch because most boxes are checked
2. Ignore the issue if the pilot audience is small
3. Pause the affected launch until the access boundary is corrected and verified
4. Remove the failed test from the release evidence

Answer: option 3. A permission failure is a launch blocker even when other checks pass. A smaller audience does not make unauthorised access safe; correct and verify the boundary before exposing users to that capability.
