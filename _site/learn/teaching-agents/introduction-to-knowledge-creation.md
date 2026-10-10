Source: https://docs.aivax.net/learn/teaching-agents/introduction-to-knowledge-creation.html

Imagine hiring a receptionist who speaks clearly, learns procedures quickly and has never worked at your company. You would not expect that person to know your cancellation policy from general experience. You would provide a handbook, show where current information lives and explain whom to ask when the handbook is incomplete. An AI agent needs the same support.

A language model brings general patterns learned during training, the process that shaped its behaviour from examples. It does not automatically know your approved policies or private product details. **Knowledge creation** means turning what your organisation knows into reliable material that an agent can find and use. The goal is not to upload every file. It is to help the agent answer the questions it is responsible for, with evidence that someone can check.

## Start with the job, not the archive

A customer-support agent might need delivery rules, troubleshooting instructions and refund conditions. A sales assistant might need product capabilities and eligibility rules. An internal assistant might need expense procedures and the route for requesting equipment. Each job creates a different boundary around useful knowledge.

Start by writing a plain sentence: “This agent helps customers understand returns, but it does not approve exceptions.” That sentence tells you which sources matter and which decisions still belong to a person. Without it, a shared drive can become an indiscriminate collection of drafts, contracts and old presentations. More material then means more opportunities to find something irrelevant or wrong.

Consider a fictional bicycle shop. Customers repeatedly ask whether an assembled bicycle can be returned. The approved return policy is useful knowledge. A warehouse employee's informal message saying “we usually make an exception” is not automatically a policy. It may reveal a missing procedure, but an accountable owner must decide what the agent should say. Preparing knowledge often exposes business decisions that were previously implicit.

## What counts as knowledge?

Knowledge is not limited to a formal manual. It includes facts, explanations and procedures that can be approved and reused. The important distinction is between a source that merely exists and a source your organisation is willing to rely on.

- **Policies** — Rules and exceptions: who qualifies, what is allowed and which conditions apply.

- **Questions and answers** — Approved responses to recurring questions, including when an answer needs clarification.

- **Product facts** — Capabilities, compatibility, limitations and supported options for a named product version.

- **Procedures** — Ordered actions, prerequisites and escalation routes for completing a task safely.

A good source also explains its scope. A warranty document should identify the product range and applicable region. An expense policy should say which employees it covers. If two departments use the same word differently, include the distinction rather than expecting the agent to infer it. “Standard delivery” is not a useful fact until the conditions behind that label are clear.

Some information belongs elsewhere. A customer's current delivery status changes too often to treat like a permanent handbook entry. An account password must not become searchable knowledge. Broadly reusable policies belong in a knowledge base, an organised set of approved sources. Customer-specific facts usually belong in a controlled lookup during a conversation. [Adding knowledge](https://docs.aivax.net/learn/agents/adding-knowledge.md) places this component alongside instructions and tools.

## Follow a lifecycle, not a one-time upload

The work repeats because organisations change. A policy can be correct when published and misleading after a product launch. Treat knowledge as a service with an owner, not as a box checked during setup.

Collect → Prepare → Index → Retrieve → Measure → Maintain

**Collect** means locating candidate sources and checking who can approve them. **Prepare** means removing noise, resolving contradictions and preserving conditions. **Index** means organising the prepared information so software can search it. **Retrieve** means selecting relevant material for a particular question. **Measure** means checking whether the resulting answers are supported and useful. **Maintain** means updating or retiring sources and repeating those checks.

These stages depend on one another. Excellent search cannot turn an obsolete policy into a current one. Clear writing cannot help if the relevant document was never indexed. A correct answer in one demonstration cannot prove that the agent will handle a changed policy tomorrow. Looking at the whole lifecycle makes failures easier to diagnose and responsibilities easier to assign.

1. **Choose one narrow question family**

Begin with a recurring topic such as returns. Write the questions customers actually ask, including common exceptions.

2. **Create an approved source set**

Select current documents, record their owners and remove conflicting drafts from the searchable set.

3. **Test before expanding**

Check ordinary questions, ambiguous questions and questions that the sources cannot answer. Improve the source set before adding another topic.

For the bicycle shop, the first cycle might reveal that the policy mentions unopened accessories but says nothing about assembled bicycles. The right next step is not to encourage a more confident answer. It is to ask the policy owner for a decision, publish the approved wording and test that wording with realistic questions. Until then, the agent should explain that it cannot confirm the condition and direct the customer to support.

## Make ownership visible

A **content owner** is the person or team responsible for whether a source remains correct. This is different from the person who uploads it. Operations may own shipping procedures, product teams may own compatibility information and human resources may own employee policies. A technical administrator can make material searchable without having the authority to approve its meaning.

Record an owner, an effective date, an audience and a review trigger for each important source. A review trigger is an event that requires a check, such as a policy change or product release. A calendar reminder is useful, but it should not be the only mechanism: a critical change should not wait for the next routine review. Decide how withdrawn information will be removed from search as well as how new information will be added.

Ownership also includes permissions. A source that is appropriate for employees may be inappropriate for customers. Decide who may search each body of knowledge before connecting it to an agent. Do not rely on the model to hide restricted details after receiving them. Give it only the information the current task and audience are entitled to use.

## Define a small, observable result

A useful initial result is a set of approved sources that answers a defined group of questions, with a named owner and a repeatable review process. “All files uploaded” is an activity, not evidence of success. Look for answers that quote the correct condition, acknowledge missing information and avoid inventing exceptions.

Keep a short record of failures. Was the answer absent from the source, difficult to find, or present but misused? Those cases need different repairs. This record turns feedback into a maintenance queue instead of a vague instruction to make the agent smarter.

Related: on AIVAX, searchable knowledge is organised in [collections and documents](https://docs.aivax.net/docs/rag/collections.md). The platform feature stores and retrieves material; your organisation still owns the decisions about what should be trusted.

What's next: learn how an agent looks up evidence before answering in [What is a RAG](https://docs.aivax.net/learn/teaching-agents/what-is-a-rag.md).

**Knowledge check.** What is the strongest foundation for an agent's knowledge?

1. Upload every available file and let the model resolve disagreements
2. Assign an owner, approve relevant sources and repeatedly test and maintain them
3. Replace all company policies with the model's general knowledge

Answer: option 2. Reliable knowledge requires accountable sources and ongoing checks. Uploading files alone does not establish which information is current, authorised or correct.
