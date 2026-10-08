---
title: FAQ and learning paths by profile
linkTitle: FAQ and learning paths
description: "Answer common questions about agent projects and choose a practical learning route for beginners, developers, or business owners."
weight: 60
duration: 12
objectives:
  - Set realistic expectations for cost, accuracy, and build effort.
  - Choose a learning path that matches your responsibilities.
  - Plan a first week focused on one bounded use case.
  - Identify the people and evidence needed before a pilot.
---

You can learn about agents without learning everything at once. A business owner needs to judge whether a project is worthwhile. A developer needs to connect systems safely. A first-time learner needs a clear picture of how the pieces fit together. These goals overlap, but they need not follow the same reading order.

An **agent** combines a model that processes language with instructions, information, and permitted actions. It is useful to think of it as a new employee working through a controlled workstation: the quality of the work depends on the reference material, permissions, supervision, and clarity of the job, not only on the employee's conversational ability.

## Common questions

{{< accordion title="1. How much does an agent cost?" >}}
There is no useful universal figure. Cost depends on the model, the amount of information processed, tool use, traffic, and repeated attempts. Include document preparation, integration work, human review, and maintenance. Compare total cost per correctly resolved task with the current process; a cheap answer that creates rework may be expensive overall.
{{< /accordion >}}
{{< accordion title="2. Can I make the answers completely accurate?" >}}
No general design guarantees perfect answers. Clear sources, limited scope, testing, and verification can improve reliability, but uncertainty remains. Define which errors are tolerable and which require a stop or human decision. An assistant should say when evidence is missing rather than producing a plausible answer just to remain conversational.
{{< /accordion >}}
{{< accordion title="3. Is company data safe to send to a model?" >}}
That depends on the actual service, configuration, contracts, and data involved. Review processing purposes, retention, access, deletion, and third-party handling with the responsible team. Do not assume that all providers use or retain data in the same way. Start with public or invented material and minimise personal or confidential information.
{{< /accordion >}}
{{< accordion title="4. How long does it take to build?" >}}
A demonstration can be quick; a dependable service needs more than a working chat box. Source quality, integrations, permissions, approval processes, and review capacity determine the effort. Define a small milestone, such as correctly answering a reviewed set of policy questions, rather than promising a launch date before inspecting those dependencies.
{{< /accordion >}}
{{< accordion title="5. Do I need developers?" >}}
You can explore instructions and organise knowledge without writing software. Developers or appropriately skilled implementers become important when connecting private systems, enforcing access, handling failures, or changing records. Business and domain experts remain necessary even when coding is involved: they define valid answers, acceptable risks, and the service's real boundaries.
{{< /accordion >}}
{{< accordion title="6. Which model should I choose?" >}}
Choose from the requirements, not a universal ranking. Check support for the required language, media, tools, response time, and data controls. Compare candidates on representative tasks using the same evidence and evaluation rules. A larger or more expensive model is not automatically the most suitable choice for a narrow, well-supported task.
{{< /accordion >}}
{{< accordion title="7. Do I need to train a model on my documents?" >}}
Often, retrieval is the more direct starting point. Retrieval means finding relevant passages and supplying them with the question. It lets you update the reference material without changing the model itself. Training and retrieval solve different problems; inspect source quality and retrieval results before assuming that training is necessary.
{{< /accordion >}}
{{< accordion title="8. Can the agent use our CRM or order system?" >}}
Yes, when the system exposes a suitable connection and your application implements the necessary controls. A CRM is a customer relationship management system. Start with narrow read-only operations, then add confirmed writes if justified. The connected service must enforce identity and permissions; a sentence telling the model to be careful is insufficient.
{{< /accordion >}}
{{< accordion title="9. Can it replace the whole support team?" >}}
Do not use that as the first design goal. Agents can help with repeated, well-supported tasks, while people handle exceptions, distress, disputes, and judgement. Measure whether customers receive useful resolutions and timely human help. Reducing visible tickets by making support difficult to reach is not a successful service improvement.
{{< /accordion >}}
{{< accordion title="10. What happens when a tool fails?" >}}
The agent should explain the practical limitation without claiming the action succeeded. The application needs bounded retries, duplicate prevention, and a fallback route. A fallback is a predefined alternative, such as creating a review request. If a timed-out write may already have happened, verify the result before repeating it.
{{< /accordion >}}
{{< accordion title="11. How do I know whether a pilot worked?" >}}
Define outcomes before launch and record the existing process as a baseline. Review correct resolutions, appropriate handovers, customer effort, privacy incidents, and total operating cost. Include difficult and unsuccessful cases, not just favourable examples. Keep a named owner who can pause the pilot when a serious boundary fails.
{{< /accordion >}}
{{< accordion title="12. What is the best way to start?" >}}
Choose one recurring question with approved information and an obvious owner. Write what the agent should and should not do, then create a small set of ordinary and difficult examples. Begin without consequential external actions. Improve the sources and boundaries before expanding the task, audience, or permissions.
{{< /accordion >}}

## Choose a learning path

These paths are suggested reading orders, not certifications or prerequisites. Follow the lessons related to your current responsibility, and return to the others when the project reaches that stage. Each path deliberately includes safety and evaluation, because neither is an optional final polish.

{{< tabs >}}
{{< tab title="Beginner" >}}
Start here if the vocabulary is unfamiliar and you want to understand one complete example before discussing integrations.

1. [Introduction to AI](../introduction/introduction-to-ai.md): understand what models learn and why fluent answers can still be wrong.
2. [Introduction to AI agents](../agents/introduction-to-ai-agents.md): see how instructions, knowledge, and tools form an agent.
3. [Anatomy of a prompt](../prompt-engineering/anatomy-of-a-prompt.md): practise giving a clear task and useful context.
4. [What is a RAG](../teaching-agents/what-is-a-rag.md): understand how an assistant consults approved information.
5. [Transparency and human escalation](../safety/transparency-and-human-escalation.md): design an honest introduction and a real route to a person.
6. [Customer support agent](customer-support-agent.md): connect the concepts in a bounded worked case.
{{< /tab >}}
{{< tab title="Developer" >}}
Start here if you will implement connections and operate the service; inspect public contracts rather than assuming that model behaviour enforces them.

1. [From LLMs to agents](../agents/from-llms-to-agents.md): identify the application responsibilities surrounding the model.
2. [Function calling](../tools-and-integrations/function-calling.md): learn how tool requests become executable operations.
3. [Authentication and permissions](../tools-and-integrations/authentication-and-permissions.md): separate identity from authority.
4. [Retrieval strategies](../teaching-agents/retrieval-strategies.md): select evidence while preserving the permitted scope.
5. [Errors, retries, and fallbacks](../advanced-agents/errors-retries-and-fallbacks.md): handle uncertain results without duplicate side effects.
6. [Testing and evaluating agents](../quality/testing-and-evaluating-agents.md): verify behaviour with representative and adversarial cases.
7. [Deployment checklist](../production/deployment-checklist.md): prepare ownership, monitoring, and recovery before release.
{{< /tab >}}
{{< tab title="Business" >}}
Start here if you own the outcome, budget, policies, or customer experience; you do not need to implement every connection to judge its boundaries.

1. [Common use cases by industry](use-cases-by-industry.md): identify a specific problem rather than buying a broad promise.
2. [Finding and preparing knowledge](../teaching-agents/finding-and-preparing-knowledge.md): assess whether the organisation has reliable answers to supply.
3. [Human in the loop](../advanced-agents/human-in-the-loop.md): decide which actions require an accountable reviewer.
4. [Privacy, LGPD, and GDPR](../safety/privacy-lgpd-gdpr.md): identify data-handling decisions for qualified review.
5. [Metrics](../quality/metrics.md): choose outcomes that reflect real service quality.
6. [Cost optimisation and caching](../production/cost-optimization-and-caching.md): understand the drivers of sustainable operation.
7. [Continuous improvement](../quality/continuous-improvement.md): organise learning from failures after the pilot begins.
{{< /tab >}}
{{< /tabs >}}

## Plan a practical first week

The sequence below is a suggested learning schedule, not a promise that a production system can be delivered in a week. Move more slowly when data, approvals, or technical dependencies need investigation. Finish the week with an evidence-backed decision, even if that decision is to postpone a pilot.

{{< steps >}}
{{< step title="Day one: choose one job" >}}
Write who needs help, what outcome matters, and what remains outside scope. Name the business owner and the person who can stop the experiment.
{{< /step >}}
{{< step title="Day two: inspect the evidence" >}}
Collect approved sources, find contradictions, and identify sensitive material. Assign document owners. Do not import private records merely because they are available.
{{< /step >}}
{{< step title="Day three: design the boundaries" >}}
Draft the instructions, allowed tools, access rules, and handover route. Keep external actions disabled unless their permissions and approval path are understood.
{{< /step >}}
{{< step title="Day four: test the difficult cases" >}}
Use invented examples to check missing information, hostile instructions, unavailable tools, and requests for a person. Record failures alongside successes.
{{< /step >}}
{{< step title="Day five: make the pilot decision" >}}
Review the evidence with business, technical, and domain owners. Decide what to fix, what to measure, and whether a limited supervised pilot is justified.
{{< /step >}}
{{< /steps >}}

## Keep a small set of working artefacts

{{< cards >}}
{{< card title="One-page scope" icon="compass" >}}
Record the user, task, exclusions, owner, and handover route. This is the reference for deciding whether a requested feature belongs in the first version.
{{< /card >}}
{{< card title="Evidence and test set" icon="flask" >}}
Keep approved sources beside representative questions and expected outcomes. Include the cases where refusing, admitting uncertainty, or transferring is the correct behaviour.
{{< /card >}}
{{< card title="Pilot decision record" icon="list-check" >}}
State what passed, what remains unresolved, who accepted the remaining risk, and how to pause the service. Do not turn an attractive demonstration into an implied launch approval.
{{< /card >}}
{{< /cards >}}

Related: when ready to map these ideas to AIVAX, an [AI gateway](../../docs/inference/ai-gateway.md) stores reusable agent configuration. Read the relevant product documentation for exact setup; these learning paths explain design choices rather than replacing implementation instructions.

What's next: return to [What is Learn](../introduction/what-is-learn.md) to choose another module or revisit the path that matches your next responsibility.

{{< quiz options="Connect every business system before testing | Pick one bounded task, inspect its sources, and define evidence for a safe pilot | Choose a model solely because it has the largest advertised capacity" answer="2" explanation="A bounded task with owned evidence and clear evaluation criteria provides a useful starting point; more integrations or model capacity do not replace preparation." >}}
What is the strongest first step for a new agent project?
{{< /quiz >}}
