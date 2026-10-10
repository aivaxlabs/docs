Source: https://docs.aivax.net/learn/safety/bias-fairness-responsible-ai.html

A support assistant responds patiently to one customer's polished writing but dismisses another customer's broken grammar as suspicious. Both customers describe the same valid problem. The assistant may be fluent, quick and technically on topic, yet still provide an unfair service.

**Bias** is a systematic tendency that distorts a judgement or outcome. In AI, it can produce differences unrelated to the legitimate needs of the task. **Fairness** asks whether people are treated appropriately and whether benefits, mistakes and burdens are distributed unjustly. **Responsible AI** is the broader practice of assigning people responsibility for these effects, along with safety, privacy and transparency.

These are practical operating concerns, not only abstract principles. A business should be able to explain what an agent is allowed to decide, how it checks for unequal outcomes, and how someone can challenge a mistake.

## Where bias enters the workflow

A language model learns patterns from **training data**, the examples used to develop it. Those examples can reflect historical exclusion, stereotypes or gaps in representation. But the model is only one source of bias. Your own instructions and business processes can add it even if the underlying model behaves reasonably.

**Retrieval** means finding documents to help answer a question. If the knowledge source contains detailed policies for one customer group but incomplete guidance for another, the agent may answer unevenly. Search ranking can compound the problem by repeatedly showing the most common cases while hiding less common but relevant guidance.


- **Training data** — Repeated associations in historical text may lead a model to make assumptions about a person's ability, needs or trustworthiness.

- **Instructions** — A rule such as prioritising people who “sound professional” can turn a vague stylistic preference into unequal access to service.

- **Examples** — If all successful examples use the same language style or customer profile, the agent may treat that profile as the normal or preferred case.

- **Retrieved knowledge** — Missing, outdated or unevenly indexed documents can give some users better evidence and more complete answers than others.




A **proxy** is an apparently neutral detail that stands in for another characteristic. A postcode, school name or writing style can correlate with socioeconomic circumstances or protected characteristics. Removing explicit demographic fields does not remove every proxy. Conversely, a relevant accessibility or language preference should not be discarded merely because it describes a difference between users.

## Notice the everyday consequences

In support, bias may appear as different politeness, different willingness to investigate, or different rates of unnecessary transfer. An assistant might accept a clear complaint from a fluent speaker but repeatedly request clarification from a user describing the same issue in a regional dialect.

In sales, an agent might offer a consultation only to prospects whose job titles resemble past buyers. That can exclude qualified people with unfamiliar titles. A useful qualification criterion is whether the product meets a stated need, not whether the customer resembles a favourite example.

In human resources, or **HR**, the consequences are especially serious because recommendations can affect employment. An agent summarising applications might overvalue familiar institutions or penalise career gaps without a job-related reason. Legal requirements vary, and consequential employment decisions need domain expertise, appropriate safeguards and meaningful human review. Automating an existing practice does not make that practice fair.


**An unsupported judgement**

“This customer writes informally, so the request is probably not serious. Do not offer an appointment.” Writing style is being used as a substitute for the actual qualification criteria.


**A task-related judgement**

“The customer describes a need the service supports. Ask the same eligibility questions used for other prospects, in clear language, and offer an appointment if those criteria are met.”





Fair treatment does not always mean identical wording. A customer who asks for simpler language may need a different explanation to receive equivalent help. The goal is consistent rights and decision standards, with suitable accommodations, rather than forcing every person through exactly the same conversational path.

## Test comparable cases

Start by defining the decision you want to examine. “Is the agent fair?” is too broad to test. “Does writing style change whether equally eligible customers receive an appointment?” identifies a concrete action, a relevant comparison and an expected outcome.

A **paired test** compares two cases that are equivalent for the decision but differ in a characteristic that should not change it. Use synthetic, invented examples and authorised data practices. Do not casually collect sensitive demographic information or infer it from names merely to fill a report.


1. **Define the legitimate criteria**

Write down what should affect the outcome and why. Have a business owner and appropriate domain specialists review these criteria before testing the agent.


2. **Build comparable cases**

Vary language style or another justified test characteristic while keeping eligibility facts stable. Include different ways of expressing the same request and realistic edge cases.


3. **Run the same workflow**

Use the same instructions, tools and knowledge sources. Inspect the action taken, the explanation, the tone and the amount of effort demanded from the user.


4. **Investigate differences**

Check whether a difference follows from a legitimate criterion, missing evidence or an unsupported assumption. Examine both individual cases and patterns across the test set.


5. **Change and retest**

Correct the relevant instruction, examples, knowledge gap or decision process. Repeat the tests and check that the change did not introduce another kind of harm.





Use more than a single paraphrase. Model responses can vary between runs, and a tiny sample can exaggerate or hide a pattern. Record which version of the agent was tested so a later improvement can be compared with the same conditions. Include people with relevant language and domain knowledge in reviewing subtle cases.

## Read numbers as evidence, not a verdict

An **approval rate** is the share of reviewed cases that receive an approval. For this example, approval means an invitation to a sales appointment, not a loan or employment decision. The chart uses invented, equally eligible test cases divided into two writing-style groups.


**Appointment approval rates before and after mitigation (illustrative)**

| Item | Value |
| --- | --- |
| Style A before | 80% |
| Style B before | 60% |
| Style A after | 79% |
| Style B after | 77% |

Invented teaching data for comparable, eligible cases. The gap falls from 20 to 2 percentage points; this is not a benchmark or proof of fairness.



The narrower gap is a reason to inspect the change, not to declare the problem solved. Perhaps the assistant now approves everyone, including ineligible cases. Perhaps it still uses a dismissive tone with one group. Check decision correctness, access to human review, unnecessary questions and user effort alongside the headline rate.

A **percentage point** is the difference between two percentages: moving from 60% to 80% is a difference of 20 percentage points. Keep the denominator visible in real reports: a rate based on a handful of cases is much less informative than a well-designed larger evaluation. Group membership and lawful measurement methods also require careful definition.

**Should every group always have exactly the same outcome rate?**

Not necessarily. Relevant circumstances and the purpose of the decision matter, and different fairness measures can conflict. Equal rates can hide incorrect decisions; unequal rates can reveal a problem without explaining its cause. Choose measures with legal and domain advice, investigate differences, and give affected people a route to challenge errors.



## Mitigate and keep someone accountable

Mitigation means reducing an identified risk. Replace vague criteria with evidence-based ones, diversify examples, repair missing knowledge and remove irrelevant assumptions. For consequential actions, narrow the agent's role to gathering facts or drafting a recommendation until the decision process has appropriate validation and oversight.

A human reviewer must have enough time, information and authority to disagree. A person who automatically clicks approval is not meaningful oversight. Show the evidence behind the recommendation, highlight uncertainty and allow the reviewer to correct both the individual outcome and the underlying rule. Do not make affected users argue with the same automation repeatedly.

Document the task, criteria, excluded uses, test coverage, observed differences, mitigations and unresolved limits. Assign an owner and a review point when instructions, knowledge or business policies change. Include an accessible way to report unfair treatment, and treat reports as evidence for investigation rather than proof that the user misunderstood.

Related on AIVAX: [Agentic Tests](https://docs.aivax.net/docs/inference/agentic-tests.md) can support repeatable conversational checks. They do not, by themselves, certify fairness or replace specialist review of consequential decisions.

What's next: turn acceptable behaviour into explicit rules in [Content moderation and usage policies](https://docs.aivax.net/learn/safety/content-moderation-and-policies.md).

**Knowledge check.** What is the most useful first approach when writing style appears to affect appointment offers?

1. Remove all demographic fields and assume bias is impossible
2. Compare otherwise equivalent cases, inspect the differences and retest targeted changes
3. Require identical wording for every customer regardless of accessibility needs
4. Accept equal approval rates as proof that all decisions are fair

Answer: option 2. Comparable tests help isolate irrelevant influences. Fairness also requires reviewing correctness, context and user impact; neither field removal nor equal headline rates is a complete guarantee.
