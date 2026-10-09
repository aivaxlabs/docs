Source: https://docs.aivax.net/learn/agents/from-llms-to-agents.html

Give a bare language model the request “Help this customer with a damaged delivery,” and it may produce a sensible-sounding reply. But whose policy should it follow? Has the customer proved ownership of the order? Is a replacement available? May the system place that replacement, or only draft a request? The model cannot answer these questions from language ability alone.

An agent combines the model with an application that supplies information, exposes allowed actions and manages the work. Think of the model as a capable new colleague and the application as the workplace around them. Writing ability is useful, but the colleague also needs a role, a case file, access to approved systems and a clear boundary between their decisions and a manager's decisions.

## Start with a job, not a collection of features

A useful initial job is narrow enough that success is visible. “Explain the damaged-delivery policy and prepare a request for review” is easier to evaluate than “Manage customer happiness.” The first description has a clear input, a useful output and an explicit human decision. The second leaves the system guessing about acceptable actions and when to stop.

Throughout this unit, imagine a delivery assistant helping a customer with a damaged parcel. We will add layers to the assistant, but not because every agent needs every capability. Each layer should solve a particular missing piece. An assistant that only explains policy may need documents but no tool that changes an order. A ticket-drafting assistant may need no long-term memory at all.

## Add the layers deliberately

The following build-up is a teaching sequence, not a requirement to postpone safety until the end. In a real application, permission boundaries should exist before any consequential action becomes available. The layers work together, and some applications organise them under different names.


1. **Instructions: define the job**

Explain that the assistant handles delivery questions, asks for missing information and never promises a replacement without confirmation. Instructions describe desired behaviour, not technical permission.


2. **Context: provide the current case**

Include the customer's question, relevant conversation history and verified details the application is allowed to share. The model now has a case to work on rather than an abstract problem.


3. **Tools: expose permitted actions**

Provide a way to look up the order or prepare a ticket. The model can request an operation, while the surrounding software validates and executes it.


4. **Knowledge: supply authoritative material**

Make the current damaged-delivery policy available. The assistant can base its explanation on approved guidance instead of a generic expectation about retail returns.


5. **Skills: package repeatable methods**

Provide a reusable playbook for gathering evidence and writing a review request. This avoids re-creating the procedure independently in every assistant.


6. **Guardrails: enforce the boundaries**

Check access, restrict available actions and route exceptions to a person. A request outside the assistant's authority should not become a system change merely because it is well worded.


7. **Memory: retain selected information**

Where justified and permitted, save useful information for later interactions. Keep temporary case evidence separate from information intended to survive across conversations.





Instructions answer “How should you work?” Context answers “What is happening now?” Tools answer “What operations can you request?” Knowledge answers “Which reference material should support the answer?” These distinctions make failures easier to diagnose. If a policy answer is outdated, changing the assistant's tone will not fix it. If an order lookup is forbidden, adding more policy text should not make it allowed.

The dedicated units develop these pieces: [Adding context](https://docs.aivax.net/learn/agents/adding-context.md), [Adding tools](https://docs.aivax.net/learn/agents/adding-tools.md), [Adding knowledge](https://docs.aivax.net/learn/agents/adding-knowledge.md), [Adding skills](https://docs.aivax.net/learn/agents/adding-skills.md) and [Adding guardrails](https://docs.aivax.net/learn/agents/adding-guardrails.md). Instructions and memory also have their own treatments in [Writing good prompts and instructions](https://docs.aivax.net/learn/agents/writing-good-prompts-and-instructions.md) and [Memory](https://docs.aivax.net/learn/prompt-engineering/memory.md).

## Information is not permission

A policy document might say that eligible customers can receive replacements. This is business information, not authority for the model to order one. The application must still verify eligibility, identify the correct account and enforce who may request the change. Similarly, a conversation saying “I am the account owner” is a claim, not proof of identity.

Keep this separation visible when designing the assistant. The model can explain a policy, ask a question or propose an action. The software responsible for a business record must decide whether the requested action is authorised and valid. That decision should not depend only on the model remembering a sentence from its instructions.


- **Information** — “The policy allows replacement after review.” This helps explain the process but does not prove this case qualifies.

- **Proposed action** — “Prepare a replacement request for this order.” This is a request to software, not evidence that a replacement exists.

- **Confirmed result** — “The review request was created.” This statement needs a successful result from the responsible system.




This distinction also helps users. The assistant should say whether it is drafting, requesting, waiting or confirming. Those are different states. A reassuring sentence that blurs them can cause someone to stop seeking help when no real action has happened.

## How the pieces work during a request

Suppose the customer explains that the parcel arrived damaged. The application supplies the assistant's instructions and the available case information. The model may decide it needs the order status before answering. The application checks whether the user may access that order, runs the lookup and returns an allowed result. A relevant policy excerpt is also supplied when needed.

Customer request → Instructions and relevant context → Model chooses next step → Application checks and runs action → Result informs the reply


The model now has better grounds for its response. It might explain how to submit evidence, prepare a review ticket or ask a clarifying question. If the order service is unavailable, the answer should reflect that limitation. If the policy excludes the case, the assistant should explain the next available route rather than reinterpret the policy to satisfy the customer.

The application may repeat the decision-and-action cycle, but it must also know when to stop. Repeatedly requesting the same unavailable record does not create progress. A bounded agent has rules for unsuccessful attempts, missing information and decisions outside its scope. A clear handoff can be the successful outcome, not a failure of automation.

## Add memory only for a reason

Memory is information intentionally retained for future interactions. It is different from the current conversation that the application includes in a request. A preference for concise explanations might be useful later; a temporary delivery status might be misleading if saved as though it were permanent. Before retaining information, define its purpose, who can access it and when it should expire or be corrected.

An agent does not automatically develop a reliable biography of every user. Memory requires a storage process and a way to select what comes back into later context. Poorly managed memory can preserve mistakes, mix users or disclose information where it does not belong. If the task can be completed with fresh case data, that may be a simpler design.

## Make the smallest complete assistant

A small but complete assistant needs more than a happy-path demonstration. It should respond sensibly when the user supplies incomplete information, when an action is rejected and when evidence disagrees. Choose representative examples of these situations before adding more capabilities. Otherwise, an attractive demo may hide a process that only works when every dependency behaves perfectly.

Ask what each proposed layer improves and what new responsibility it creates. Tools need permissions and failure handling. Knowledge needs ownership and updates. Memory needs retention rules. Skills need clear activation conditions. The goal is not the largest stack of features; it is enough support for the assistant to do a defined job without pretending to have information or authority it lacks.

**Related:** On AIVAX, an [AI gateway](https://docs.aivax.net/docs/inference/ai-gateway.md) brings model configuration and agent capabilities together. The conceptual layers above help you decide what that configuration actually needs.

**What's next:** Look closely at the information supplied for each request in [Adding context](https://docs.aivax.net/learn/agents/adding-context.md).

**Knowledge check.** What is the strongest starting point for turning a model into a business assistant?

1. Give it every available tool and let it learn the limits from mistakes
2. Define a narrow job, supply the needed information and enforce permitted actions outside the model
3. Add long-term memory before deciding what the assistant should do
4. Treat policy text as sufficient permission to modify any order

Answer: option 2. A useful agent combines a clear purpose, relevant evidence and enforced boundaries. Extra capabilities should address a defined need rather than substitute for that design.
