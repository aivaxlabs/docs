Source: https://docs.aivax.net/learn/production/versioning.html

A restaurant records changes to its recipe, ingredients and preparation instructions. If customers report a problem, the team needs to know which combination produced their meals. An agent needs the same discipline. Changing a sentence in its instructions, replacing a policy document or adding a tool can change what users receive, even when the application itself looks unchanged.

**Versioning** means keeping named, recoverable records of changes. An **artefact** is something maintained as part of a system, such as an instruction document or tool definition. A version is useful only when it identifies what actually ran. Calling everything “latest” makes it difficult to explain why yesterday's answer differed from today's.

## Version the whole working arrangement

A **prompt** is the set of instructions and other text provided to a model for a particular job. It may combine stable rules with changing user messages. Keep the stable instructions and the recipe for assembling them under version control: a system that records their history. A shared document with tracked changes can be a starting point; the essential requirement is an unambiguous record and a way to recover it.

Do not stop at the prompt. An agent also depends on tool definitions, permissions, model choices and knowledge sources. A tool definition describes an available action, its required inputs and the meaning of its results. Changing “create a draft” to “send a message” is a material behaviour change, not a wording correction. The release record must make that difference visible.


- **Instructions** — Record the role, boundaries, examples and rules for assembling context. Keep a reason for each meaningful change.

- **Tools and access** — Record tool definitions, expected behaviour and permission policies. Reference secret locations without copying secret values into version history.

- **Knowledge** — Record which approved documents were available, their revisions and when they were reviewed for freshness.

- **Model and settings** — Record the selected model, relevant settings and routing rules, meaning the rules that choose a model for a request.




A **release** is an approved combination of those artefacts made available to users. Give each release a clear label and keep a short inventory of its parts. This avoids a common mistake: testing one prompt against one knowledge set, then accidentally publishing it with a different tool configuration. The label should travel into operational records so a reported problem can be connected to the right combination.

Related: on AIVAX, the reusable configuration that brings these choices together is called an [AI gateway](https://docs.aivax.net/docs/inference/ai-gateway.md). Keeping a release inventory is an operating practice; do not assume a configuration editor automatically provides your complete approval, versioning or rollback process.

## Write a change log for decisions

A **change log** is a concise account of what changed and why. “Improved prompt” is not enough. A useful entry says that the support instructions now require a source for an exchange deadline, identifies the relevant evaluation, records who approved the change and notes its expected effect. Include known limitations, especially if a change helps one task while making another slower or less reliable.

An example version history below follows a fictional support assistant. The labels describe releases, not product versions or calendar commitments. Notice that the reason for each step is visible, including the decision not to promote one candidate.


- **Release A — Policy answers only**: The approved assistant answers from reviewed policy documents and hands account-specific requests to a person. The release record includes its evaluation results.

- **Candidate B — Add an order lookup**: A staging version introduces read-only order access. Tests find that ambiguous customer identity is not handled safely, so the candidate is held back.

- **Release B — Publish the corrected lookup flow**: Identity checks and tool-failure messages are corrected and retested. A limited pilot is approved with the previous release retained.

- **Release C — Refresh the policy knowledge**: An approved exchange-policy revision replaces the older document. Relevant evaluations are rerun, and cached answers affected by the change are removed.




Separate the release label from the document's effective date. An exchange policy can be uploaded today but apply only to purchases made after a later date. Record which date governs the customer's situation rather than simply telling the agent to use the newest file. Archive older material where needed for legitimate historical questions, while preventing it from being mistaken for the current rule.

## Test the version that you will publish

An **evaluation**, often shortened to **eval**, is a structured test of the agent against representative tasks and acceptance criteria. Save the test cases, expected behaviour, scoring method and results alongside the release record. Otherwise, “passed testing” might refer to a different prompt, model or knowledge set from the one now serving users.

Include both intended improvements and **regression checks**, tests that confirm previously working behaviour has not been broken. If a new prompt makes answers shorter, check that it still states important exceptions. If a document changes, test questions where the answer should change and questions where it should not. [Testing and evaluating agents](https://docs.aivax.net/learn/quality/testing-and-evaluating-agents.md) explains how to turn these expectations into repeatable evidence.

**Staging** is a controlled environment for checking a candidate before it reaches ordinary users. **Production** is the environment serving those users. Keep their purpose and access boundaries separate. Use synthetic or appropriately protected test data, and prevent staging tools from sending real messages or modifying real accounts accidentally. A harmless-looking test can still cause an external action if connected to a live tool.


**Unversioned change**

Someone edits the live instructions and uploads a policy. Reports of incorrect answers arrive, but nobody can identify the earlier configuration or the tests used.


**Versioned change**

A candidate combines named instruction, tool and knowledge revisions. Its evaluation record, approval and rollout scope are saved before it reaches users.





For suitable low-risk cases, an **A/B test** compares two versions with separate groups under defined conditions. Record which release each group receives and what outcome will decide the comparison. Do not combine several unrelated changes and then claim to know which caused an improvement. [A/B testing](https://docs.aivax.net/learn/quality/ab-testing.md) covers the design and limits of that approach.

## Pin models where possible, and plan replacement

**Pinning** means selecting a specific available model version rather than a moving name that may later point somewhere else. Where a provider supports it, pinning helps distinguish your changes from changes to the underlying model. Record the provider's model identifier and any relevant settings. If only a moving name is available, record that limitation and monitor for changes.

Pinning does not guarantee identical answers forever. Model outputs can vary, services can change, and an old version can be retired. Keep a replacement plan: identify a candidate, run the same evaluations and schedule a controlled switch before the current option disappears. Do not treat the old model as an indefinitely available emergency escape route.

## Release and restore deliberately

A **rollback** restores a previously approved configuration when a newer one causes problems. It is easier when the whole release inventory is known, including knowledge and tool compatibility. Decide beforehand who can trigger it, what evidence justifies it and how the team confirms that the intended version is actually serving requests.


1. **Assemble the candidate**

Freeze the intended instruction, tool, knowledge and model revisions in a release record. Explain the purpose and risks of the change.


2. **Evaluate in staging**

Run representative and regression checks against that exact combination. Resolve blocking failures and record the remaining limitations.


3. **Approve and pilot**

Assign an accountable reviewer and expose the candidate to a limited, suitable audience. Keep the prior safe configuration available where compatible.


4. **Observe and decide**

Compare the pilot with acceptance criteria. Expand, pause or roll back, then record the decision and the version that remains active.





Restoring configuration does not reverse external actions. A message already sent remains sent; an approved transaction may require a separate correction. It also may be wrong to restore obsolete knowledge after a legally required policy update. In that case, stop the affected capability or publish a corrected release rather than reintroducing information known to be false.

**How do freshness dates differ from versions?**

A version identifies a specific revision. A freshness date records when someone checked whether its contents were still accurate. An unchanged document can become stale because the world changed. Give important sources an owner, an effective date where relevant and a review schedule; trigger earlier review when a policy owner announces a change.



What's next: bring these release habits together in the [Deployment checklist](https://docs.aivax.net/learn/production/deployment-checklist.md).

**Knowledge check.** What should a useful agent release record identify?

1. Only the latest prompt text, because everything else is external
2. A release label linked to instructions, tools, knowledge, model choices and evaluation evidence
3. A screenshot of one successful answer
4. An old model name with no knowledge or permission records

Answer: option 2. An agent's behaviour depends on the whole configuration. A release record connects that combination to its tests and approvals, helping the team investigate changes and plan a safe restoration.
