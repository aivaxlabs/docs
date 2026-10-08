Source: http://localhost:1313/learn/agents/adding-context.html

A colleague asks, “Can we approve this?” The question means little until you know what *this* refers to, who is asking and which rules apply. Language models face the same problem. **Context** is the information available to the model while it produces a response. A useful answer depends not only on the model's general ability but also on the specific situation it has been shown.

Consider a support assistant asked whether a customer can return a product. The general concept of a return is familiar, but the correct response may depend on the purchase date, product type, current policy and actions already taken. If these details are absent, a model may ask for them or make an unsupported assumption. Good context design makes the necessary evidence available while avoiding unrelated or unauthorised information.

## What is on the model's desk?

Think of context as a desk prepared before each piece of work. The assistant can use what is on the desk, together with patterns learned during training. It cannot automatically open every filing cabinet in the building. The application decides which materials to place there and which tools, if any, can bring more information.

A request commonly contains **system instructions**, meaning higher-priority directions supplied by the application; **conversation history**, meaning selected earlier messages; the current user request; and relevant information supplied by the application. That last category may include verified user details, document excerpts or results returned by tools. Not every system uses the same message structure, but the distinction between instructions and evidence remains important.

- **System instructions** — Define the assistant's role and limits: answer delivery questions, distinguish confirmed facts from estimates and escalate exceptional cases.

- **Conversation history** — Preserve relevant details already discussed, such as which product the customer means and which clarification they have answered.

- **Verified user data** — Provide permitted facts about the current case. A verified account relationship is different from a user merely claiming ownership.

- **Retrieved evidence** — Supply relevant passages from approved documents or results from a current lookup, with enough source information to assess their relevance.

**Retrieved** simply means found and brought into the request. A policy might live in a document store until a search selects the relevant section. This can be more effective than inserting the entire handbook into every conversation. It also makes the source easier to maintain: the organisation updates the policy rather than hoping the model's earlier training already reflects it.

## The conversation must be supplied

A conversational screen can create the impression that the model remembers everything automatically. In practice, the application typically sends the messages or a representation of the relevant history with each new request. The visible conversation and the exact information supplied to the model are not necessarily identical.

If the application omits an earlier correction, the model may not be able to use it. If a summary drops an important exception, the new answer may be wrong even though the customer mentioned the exception previously. This is why “the user already told us” is not enough when diagnosing an answer. Ask whether the information actually reached the model in the current request.

> **Interactive demo: Inspect what the assistant receives.** This interactive demo is available on the web page. This illustrative conversation shows different sources of context. The customer's urgency explains the need, while the tool result limits what the assistant can honestly promise. The demo displays prepared messages; it does not query an order system.

A tool result is evidence about a particular operation, not a new set of rules for the assistant. The same applies to document excerpts and messages quoted from other people. Keeping these sources clearly labelled helps prevent the model from confusing a statement it should analyse with an instruction it should obey.

## The context window is a limited desk

The **context window** is the maximum amount of token-based information a model can work with at once, under its supported limits. Tokens are small pieces of text rather than a fixed number of words. Instructions, conversation and supplied evidence all consume space; the application must also account for the room needed to generate the answer according to the model's limits.

A larger desk can hold more papers, but it does not decide which papers matter. Too much unrelated material can distract from the useful evidence, increase processing work and make contradictions harder to notice. Choosing relevant information remains important even when a model accepts long inputs.

> **Interactive demo: Try it: fit the case onto the desk.** This interactive demo is available on the web page. The token quantities are illustrative. This simplified demo drops the oldest blocks first and keeps the last block. Real applications must choose their own context policy; they should not blindly discard essential instructions just because those instructions were added first.

When the desk fills up, an application can select relevant history, summarise older discussion or retrieve only the passages needed for the question. Each choice has trade-offs. A summary saves space but may lose a detail; a narrow search may miss a relevant exception. Preserve decisions, unresolved questions and important source references rather than only keeping the most recent sentences.

## Why start with context instead of fine-tuning?

**Fine-tuning** is additional training that adjusts a model using selected examples. It can help shape a recurring style or task behaviour when there is a clear need and suitable training data. It is not usually the simplest way to keep business facts current, enforce record access or provide the latest state of a customer case.

For most business questions about changing policies and records, start by supplying reliable context. It is easier to replace an outdated policy excerpt than retrain a model every time the policy changes. Context also lets the application give different authorised information to different users. A model trained on a fact does not itself establish who should be allowed to receive that fact.

**Provide current context**

Supply the approved policy excerpt for this question. Update the source when the policy changes and select material according to the user's access.

**Change model behaviour**

Consider fine-tuning when repeated examples are needed to shape a stable behaviour. It still needs evaluation, current evidence and separate permission checks.

Context is not magic either. The model can misread supplied material, and a wrong source can produce a well-grounded explanation of the wrong rule. Before adding training complexity, check whether the right information was supplied, whether the instructions were clear and whether the task is supported by appropriate tools. These are often more direct improvements.

## Prepare context like a useful case file

For the return question, include the relevant policy section and the verified facts required to apply it. Label dates and sources so the model can distinguish an old policy from a current one. If the customer's description conflicts with the order record, present that as a conflict to resolve, not a reason to quietly select the more convenient version.

Use only information needed for the task. An address or unrelated account history should not be included just because the application can access it. Protect sensitive data before it reaches the model, not only by asking the model to avoid repeating it. Context preparation is both a quality decision and a privacy decision.

**Related:** On AIVAX, [collections](http://localhost:1313/docs/rag/collections.md) organise reference material for retrieval. They support the knowledge side of context; they do not replace the need to select appropriate conversation and case information.

**What's next:** Learn how an agent can request fresh information or a permitted action in [Adding tools](http://localhost:1313/learn/agents/adding-tools.md).

**Knowledge check.** What is the strongest first approach for an assistant answering questions about changing business records?

1. Fine-tune the model whenever a delivery status changes
2. Supply relevant authorised case information and current policy in the request
3. Include every document and customer record regardless of relevance
4. Assume the model remembers all previous conversations automatically

Answer: option 2. Current context is the direct way to supply changing facts for a specific case. Relevance, permissions and source quality still need to be checked.
