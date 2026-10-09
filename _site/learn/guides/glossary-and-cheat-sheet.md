Source: https://docs.aivax.net/learn/guides/glossary-and-cheat-sheet.html

You do not need to memorise every technical term before building a useful assistant. You do need a shared vocabulary when discussing what it may know, what it may do, and who checks its work. Use this page like a workshop reference card: find the unfamiliar word, then follow its link when the distinction affects your design.

The terms below describe general concepts, not guarantees about a particular product. “Structured” does not mean “true”, “authenticated” does not mean “allowed to do everything”, and “automated” does not mean “unaccountable”. These distinctions matter more than remembering the abbreviations.

## Glossary

The tabs group terms alphabetically. Each entry gives a short meaning and points to a lesson that explains its practical use.


**A–C**

**A/B test** — A comparison that assigns comparable users or cases to different versions so their outcomes can be evaluated fairly; see [A/B testing](https://docs.aivax.net/learn/quality/ab-testing.md).

**Agent** — Software that combines a model with instructions, context, and permitted tools to pursue a bounded task; see [Introduction to AI agents](https://docs.aivax.net/learn/agents/introduction-to-ai-agents.md).

**API** — An application programming interface is a defined way for one program to request information or actions from another; see [Connecting to existing systems](https://docs.aivax.net/learn/agents/connecting-to-existing-systems.md).

**Authentication** — A process that checks who a user or system is, rather than deciding every action they may perform; see [Authentication and permissions](https://docs.aivax.net/learn/tools-and-integrations/authentication-and-permissions.md).

**Authorisation** — The decision about which information or actions an identified user may access in a particular situation; see [Authentication and permissions](https://docs.aivax.net/learn/tools-and-integrations/authentication-and-permissions.md).

**Bias** — A systematic tendency that can produce unfair or unrepresentative outcomes rather than random mistakes; see [Bias, fairness, and responsible AI](https://docs.aivax.net/learn/safety/bias-fairness-responsible-ai.md).

**Cache** — Stored information or a previous result reused to avoid repeated work, subject to freshness and access restrictions; see [Cost optimisation and caching](https://docs.aivax.net/learn/production/cost-optimization-and-caching.md).

**Channel** — The place where people interact with an assistant, such as a website chat or messaging service; see [Integrating channels](https://docs.aivax.net/learn/tools-and-integrations/integrating-channels.md).

**Chunk** — A smaller passage made from a larger document so relevant information can be retrieved without sending everything; see [Preparing documents for knowledge](https://docs.aivax.net/learn/teaching-agents/preparing-documents-for-knowledge.md).

**Citation** — A reference that lets the reader inspect the source supporting an answer's particular claim; see [Writing good documents](https://docs.aivax.net/learn/teaching-agents/writing-good-documents.md).

**Context** — The instructions, messages, facts, and tool results supplied to the model for its current response; see [Adding context](https://docs.aivax.net/learn/agents/adding-context.md).

**Context window** — The model's capacity for the tokens considered within a request, with accounting details depending on the model; see [Context window, tokens, and cost](https://docs.aivax.net/learn/prompt-engineering/context-window-tokens-and-cost.md).


**D–H**

**Deflection** — An eligible issue resolved without human handling, which should not be confused with an abandoned or blocked conversation; see [Metrics](https://docs.aivax.net/learn/quality/metrics.md).

**Deployment** — Making a tested version available to its intended users with monitoring, ownership, and a recovery plan; see [Deployment checklist](https://docs.aivax.net/learn/production/deployment-checklist.md).

**Embedding** — A numerical representation used to compare the meaning or characteristics of text and other content; see [Embeddings and semantic search](https://docs.aivax.net/learn/models/embeddings-and-semantic-search.md).

**Escalation** — Moving an issue to a person or process with the authority needed to handle it; see [Transparency and human escalation](https://docs.aivax.net/learn/safety/transparency-and-human-escalation.md).

**Evaluation** — A planned assessment against defined examples and criteria, rather than judging an agent from one impressive answer; see [Testing and evaluating agents](https://docs.aivax.net/learn/quality/testing-and-evaluating-agents.md).

**Fallback** — A defined alternative used when the preferred operation cannot complete, without silently weakening safety or permissions; see [Errors, retries, and fallbacks](https://docs.aivax.net/learn/advanced-agents/errors-retries-and-fallbacks.md).

**Function calling** — A model's structured request for software to execute a named operation with specified inputs; see [Function calling](https://docs.aivax.net/learn/tools-and-integrations/function-calling.md).

**Grounding** — Connecting an answer to supplied evidence instead of relying only on patterns learned during training; see [What is a RAG](https://docs.aivax.net/learn/teaching-agents/what-is-a-rag.md).

**Guardrail** — A behavioural or software boundary intended to keep an agent within its permitted scope and actions; see [Adding guardrails](https://docs.aivax.net/learn/agents/adding-guardrails.md).

**Hallucination** — An unsupported or incorrect model-generated claim that may sound fluent and confident despite lacking evidence; see [Measuring adherence and hallucination](https://docs.aivax.net/learn/teaching-agents/measuring-adherence-and-hallucination.md).

**Human in the loop** — A person deliberately involved at a defined decision or approval point rather than merely observing afterwards; see [Human in the loop](https://docs.aivax.net/learn/advanced-agents/human-in-the-loop.md).


**I–P**

**Idempotency** — A property that lets repeated requests for the same operation avoid creating additional unintended effects; see [Errors, retries, and fallbacks](https://docs.aivax.net/learn/advanced-agents/errors-retries-and-fallbacks.md).

**Inference** — Running a trained model on new input to obtain an output, rather than changing the model through training; see [What is an LLM](https://docs.aivax.net/learn/agents/what-is-an-llm.md).

**Instruction** — A statement telling an assistant how to behave, which still needs software enforcement for consequential permissions; see [Writing good prompts and instructions](https://docs.aivax.net/learn/agents/writing-good-prompts-and-instructions.md).

**Latency** — The time between a request and a useful response, including search, tools, and model processing; see [Performance and latency](https://docs.aivax.net/learn/production/performance-and-latency.md).

**LLM** — A large language model is a trained system that generates language by predicting successive pieces of text; see [What is an LLM](https://docs.aivax.net/learn/agents/what-is-an-llm.md).

**Log** — A recorded event that helps operators understand what happened without needing to reproduce every user interaction; see [Logs, traces, and monitoring](https://docs.aivax.net/learn/quality/logs-traces-and-monitoring.md).

**MCP** — Model Context Protocol is a shared protocol for exposing tools and resources to compatible applications; see [Model Context Protocol](https://docs.aivax.net/learn/tools-and-integrations/model-context-protocol.md).

**Memory** — Information intentionally retained and later supplied to an assistant, not automatic human-like recollection by the model; see [Memory](https://docs.aivax.net/learn/prompt-engineering/memory.md).

**Metadata** — Descriptive information about a document, such as its owner, audience, or effective date; see [Finding and preparing knowledge](https://docs.aivax.net/learn/teaching-agents/finding-and-preparing-knowledge.md).

**Multimodality** — The ability to handle more than one form of information, such as text, images, or audio; see [Multimodality](https://docs.aivax.net/learn/models/multimodality.md).

**Prompt** — The input that asks the model to do something and supplies relevant guidance or material; see [Anatomy of a prompt](https://docs.aivax.net/learn/prompt-engineering/anatomy-of-a-prompt.md).

**Prompt injection** — An attempt to make an assistant treat untrusted content as instructions that override its intended task or boundaries; see [Prompt injection and jailbreaks](https://docs.aivax.net/learn/safety/prompt-injection-and-jailbreaks.md).


**R–W**

**RAG** — Retrieval-augmented generation retrieves relevant evidence and includes it when asking the model to produce an answer; see [What is a RAG](https://docs.aivax.net/learn/teaching-agents/what-is-a-rag.md).

**Rate limit** — A restriction on how often requests may be made, which applications must respect rather than bypass; see [Errors, retries, and fallbacks](https://docs.aivax.net/learn/advanced-agents/errors-retries-and-fallbacks.md).

**Reranking** — Reordering retrieved candidates using another relevance assessment before choosing which passages to use; see [Retrieval strategies](https://docs.aivax.net/learn/teaching-agents/retrieval-strategies.md).

**Retrieval** — Finding candidate information relevant to a question within the sources the current user may access; see [Retrieval strategies](https://docs.aivax.net/learn/teaching-agents/retrieval-strategies.md).

**Retry** — Another attempt after a failed or uncertain operation, subject to limits and duplicate-action checks; see [Errors, retries, and fallbacks](https://docs.aivax.net/learn/advanced-agents/errors-retries-and-fallbacks.md).

**Schema** — A description of the required shape and types of data, not proof that the values are factually correct; see [structured responses](https://docs.aivax.net/docs/inference/structured-responses.md).

**Semantic search** — Finding content by meaning rather than relying only on exact word matches; see [Embeddings and semantic search](https://docs.aivax.net/learn/models/embeddings-and-semantic-search.md).

**Skill** — A reusable instruction bundle for a task or method, distinct from an executable tool; see [Adding skills](https://docs.aivax.net/learn/agents/adding-skills.md).

**Temperature** — A setting affecting how model outputs are sampled, not a dial that guarantees factual accuracy; see [Parameters](https://docs.aivax.net/learn/models/parameters.md).

**Token** — A small unit of text processed by a model, which may be a word, part of a word, or punctuation; see [Context window, tokens, and cost](https://docs.aivax.net/learn/prompt-engineering/context-window-tokens-and-cost.md).

**Tool** — A defined software operation an agent may request, such as searching a database or creating a ticket; see [Adding tools](https://docs.aivax.net/learn/agents/adding-tools.md).

**Trace** — A connected record of the steps within an operation that helps locate failures or delays; see [Logs, traces, and monitoring](https://docs.aivax.net/learn/quality/logs-traces-and-monitoring.md).

**Webhook** — A notification sent to another system when a defined event occurs, often to start follow-up work; see [Webhooks, events, and automations](https://docs.aivax.net/learn/tools-and-integrations/webhooks-events-and-automations.md).

**Workflow** — An organised sequence of tasks and decisions that defines how work proceeds and where it stops; see [Workflows as skills](https://docs.aivax.net/learn/agents/workflows-as-skills.md).





## The working cheat sheet

These rules fit on a project review agenda. They are questions to verify, not magic phrases to paste into every prompt. Apply them to the actual sources, systems, and people involved.


- **Prompts: specify the job** — State the goal, relevant context, output format, and limits. Include an example when the format is hard to describe. Remove contradictory rules. Tell the assistant what to do when information is missing.

- **Knowledge: maintain the evidence** — Use approved, current documents with owners and clear scope. Keep exceptions next to their rules. Test whether the relevant passage is actually retrieved before changing the wording of the model's answer.

- **Tools: keep permissions narrow** — Give each operation a clear purpose and validate inputs outside the model. Distinguish reading from writing. Confirm consequential changes, prevent duplicate actions, and verify the result before claiming success.

- **Safety: provide a real exit** — Collect only necessary data, enforce access before retrieval, and treat external content as untrusted. Explain that the assistant is automated. Make the route to a person visible and operational.

- **Cost: measure useful outcomes** — Track the whole task, including search, tools, retries, review, and rework. Reduce unnecessary context before sacrificing evidence. Compare cost per successfully resolved issue rather than cost per message alone.




## Resolve common confusions

**Does adding knowledge train the model?**

Usually not. Retrieval places selected documents into the current request, much like putting reference pages on a desk. Training changes the model itself. Updating a searchable document and retraining a model are different operations with different costs and controls.


**Does a tool call mean the task succeeded?**

No. The model may request an operation, but software must validate and execute it. The operation can fail or have an uncertain result. Success should be reported only after the system confirms the intended outcome.


**Does a citation make an answer correct?**

No. The source might be outdated, outside the user's scope, or unrelated to the claim. Check both the source's authority and whether its actual text supports the answer. A credible-looking link is not evidence by itself.



What's next: choose a route through the material with [FAQ and learning paths by profile](https://docs.aivax.net/learn/guides/faq-and-learning-paths.md).

**Knowledge check.** Which term describes deciding whether an identified employee may access a restricted policy?

1. Authorisation
2. Temperature
3. Tokenisation

Answer: option 1. Authorisation determines what an identified user may access or do; authentication only establishes who they are.
