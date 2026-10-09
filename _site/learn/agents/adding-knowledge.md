Source: https://docs.aivax.net/learn/agents/adding-knowledge.html

Imagine hiring an experienced customer-service adviser. They know how to explain a return politely, but they do not know your company's return policy. Experience is not a substitute for your handbook. The same distinction applies to an agent: a language model can write a convincing answer about refunds without knowing what your business actually promises.

**Knowledge**, in this unit, means reference material the agent can consult: approved policies, product catalogues, operating manuals, and other documents. Giving the agent this material is different from teaching it a new writing style. You are providing evidence for particular answers, not assuming that the model's general training contains your company's facts.

## Why general knowledge is not your company knowledge

A model learned patterns from material used during its training. That may help it explain common concepts, but it is not a dependable record of your current policies. Your delivery regions may have changed. Your catalogue may include a service launched after the model was trained. An internal exception might never have appeared in public at all.

Even familiar questions need local evidence. “Can I exchange this item?” sounds simple, yet the answer can depend on the product category, condition, sales channel, and applicable policy. A fluent explanation of how exchanges usually work could be completely wrong for this customer. The agent needs the relevant rule and enough information about the situation to apply it.

Knowledge also creates accountability. A supervisor can compare an answer with an approved document rather than debating whether it sounds reasonable. This does not make every answer correct automatically. The agent can still choose the wrong passage or misunderstand an exception. It does, however, give your team something concrete to inspect and improve.

## Retrieve first, answer second

**Retrieval-augmented generation**, usually shortened to **RAG**, means finding relevant documents before asking the model to answer with their help. Think of an adviser opening the right handbook page rather than reading the entire filing cabinet before every call. The system searches the available material, places useful passages alongside the question, and asks the model to produce an answer supported by those passages. This normally does not retrain the model or permanently change what it learned. The detailed mechanics belong in [What is a RAG](https://docs.aivax.net/learn/teaching-agents/what-is-a-rag.md); for now, remember the order: find evidence, then explain it.

Customer question → Find relevant documents → Read the evidence → Answer with a source


Searching is not the same as answering. A search can find a document about returns without finding the clause that covers a damaged item. Before relying on a passage, the agent must consider whether it addresses the actual question, applies to the right product or audience, and is still valid. If the needed evidence is missing, asking a follow-up question or contacting a person is better than completing the policy from imagination.

## Try a small knowledge collection

The demonstration below uses invented documents for a fictional shop. It illustrates selecting reference material, not the behaviour or accuracy of a production search service. Try terms such as “damaged,” “delivery,” or “manual,” then think about what the matching document does and does not establish.

> **Interactive demo: Try it: find the relevant company document.** This interactive demo is available on the web page. Notice that finding the damaged-delivery document supports an explanation of the review process. It does not establish that a particular replacement has been approved.



A useful exercise is to ask a question the collection cannot answer, such as whether a particular parcel has arrived. None of these documents is a live shipment record. A good knowledge design makes that boundary visible. The agent should use an authorised tracking tool or explain that it cannot confirm the current status from these documents.

## Choose the first documents deliberately

Start with a recurring task, not every file the company owns. For a support agent, that task might be explaining returns and warranty coverage. For an internal assistant, it might be helping employees request equipment. For sales, it might be explaining product differences without inventing contractual promises.

Ask the people doing that work which questions recur, where the authoritative answers live, and which mistakes cause the most rework. Select documents that answer those questions directly. A short, approved policy is often a better starting point than a large folder of presentations containing contradictory drafts. More material is useful only when it adds relevant, trustworthy evidence.


- **Policies** — State what is allowed, what is excluded, and who can approve an exception. Include the scope and effective date.

- **Catalogues** — Describe products and services consistently. Distinguish stable specifications from prices or availability that need a live check.

- **Manuals** — Explain how to complete a task, including prerequisites, warnings, and the point at which a person must take over.




Before adding a document, read it as a newcomer would. Does “standard package” refer to a named offer? Does “contact the usual team” identify an actual responsibility? Does the exception appear beside the rule it modifies? Material that depends on unwritten background knowledge is difficult for both a new employee and an agent to use reliably.

Keep private information out unless the use case genuinely requires it and access is appropriately restricted. An internal salary policy and a public product guide do not belong in the same unrestricted answer pool. The fact that a document is searchable must not mean that every user is entitled to receive its contents.

## Make freshness somebody's responsibility

**Freshness** means how current the information is for its purpose. A cleaning guide may remain useful for a long time, while a promotion can become obsolete overnight. Upload date alone is not enough: a file added today may contain a policy withdrawn last year.

Assign a business owner to each subject. That owner decides which version is authoritative, when it takes effect, and what should happen to the previous version. Keep those decisions visible through a title, owner, scope, review date, and source reference. These details are often called **metadata**: information describing a document rather than the main document text.


1. **Choose the authoritative source**

Ask the policy owner which document should govern answers. Resolve competing drafts before adding them.


2. **Prepare and publish the approved version**

Make headings and exceptions explicit. Check that the searchable content matches the approved original.


3. **Test ordinary and difficult questions**

Include questions with missing facts, conflicting wording, and no answer in the collection. Check the evidence as well as the final wording.


4. **Review and retire**

Recheck answers after changes. Remove or clearly exclude superseded material from current-policy searches while preserving records where required.





A review calendar helps, but event-driven updates matter too. When the business changes a policy, updating the agent's sources should be part of the same release checklist. Otherwise the website and the agent can give different answers even though both teams believe they published the new rules.

On AIVAX, groups of searchable documents are called [collections](https://docs.aivax.net/docs/rag/collections.md). [Semantic search](https://docs.aivax.net/docs/rag/semantic-search.md) finds relevant material by meaning rather than requiring an exact wording match. These features support retrieval; your team still owns document quality, access decisions, and the business meaning of the answer.

What's next: learn when an agent should leave its stored documents and [connect to the world](https://docs.aivax.net/learn/agents/connecting-to-the-world.md) for current information.

**Knowledge check.** What is the most reliable starting point for an agent that explains your company's policies?

1. Add every historical draft so the agent has more text
2. Give the agent approved sources, an owner, and a process for retiring outdated versions
3. Tell the model to sound certain about company policies

Answer: option 2. Reliable company answers need authoritative evidence and ongoing maintenance. More text or a more confident tone cannot replace current, approved sources.
