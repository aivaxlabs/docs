---
title: Introduction to AI agents
linkTitle: Introduction to AI agents
description: "Understand how an AI agent combines language, information and permitted actions to help complete a task."
weight: 10
duration: 10
objectives:
  - Distinguish an agent from a chatbot and a fixed script.
  - Explain the perceive, decide and act loop using a business example.
  - Identify useful agent tasks in support, sales and back-office work.
  - Recognise tasks that need stricter rules or human judgement.
---

A customer writes, “My delivery has not arrived, and I need it for an event.” A useful response requires more than a friendly paragraph. Someone must understand the problem, find the order, check the latest delivery information and decide which permitted options to offer. An **AI agent** is a software system that uses a model to choose steps towards a goal, with information and actions made available by its application.

The word *agent* does not mean a digital person or an employee without supervision. It describes how software works. The system can choose a next step rather than follow only a fixed sequence, but its competence and authority still depend on its design. A support agent might investigate a late delivery while remaining unable to issue a refund.

## Imagine a new employee

Imagine welcoming a new colleague on their first morning. They are good at reading and writing, but they do not know your company. You give them a handbook, explain their responsibilities, show them the customer service screen and provide a phone. You also tell them which decisions require a supervisor.

A language model supplies part of the reading and writing ability. Instructions act like the job description. Business documents act like the handbook. Tools provide controlled access to systems. Rules and human review establish the limits. Without these additions, even a capable model is like a new colleague answering customers from general experience rather than company evidence.

The analogy has limits. A person can notice physical events, develop relationships and accept responsibility in ways software cannot. An agent sees only information its application supplies. It does not automatically know that a parcel arrived, that a policy changed or that a customer is authorised to access a record. Those facts need reliable sources.

## Chatbot, script or agent?

A **chatbot** is a conversational interface: something you can message and receive a reply from. It may follow fixed rules, use a language model or front an agent. A **script** is a program that follows steps written in advance. An agent uses a model to choose some steps as the situation unfolds. These categories overlap rather than form a ladder of quality.

{{< compare >}}
{{< side title="Fixed script" >}}
When a delivery becomes overdue, send a standard notification. The condition and action are specified in advance. This is a good fit when every case should follow the same rule.
{{< /side >}}
{{< side title="Agent behind a chatbot" >}}
Read the customer's concern, decide whether an order lookup is needed, inspect the result and choose a permitted response. The conversation can adapt to missing information or an unexpected result.
{{< /side >}}
{{< /compare >}}

A script can send an e-mail and an agent can produce only text. Taking an action is therefore not the only distinction. The important question is where decisions about the next step come from. For a precisely defined task such as adding invoice totals, ordinary software may be simpler and more reliable than asking a model to decide what to do.

A chatbot can also be useful without becoming an agent. If visitors need opening hours and directions, a clear answer may be enough. Adding tools and a decision loop introduces more things to test. Start from the work the user needs done, not from a desire to attach the agent label to every conversation.

## The perceive, decide and act loop

**Perceive** means receive information: a message, a document or a tool result. **Decide** means choose a next step using the goal, instructions and available evidence. **Act** means request an allowed operation or produce a response. The application returns the outcome, allowing another decision. This repeated pattern is called a **loop**.

{{< flow "Perceive the request | Decide the next step | Request a permitted action | Observe the result | Continue or stop" >}}

For the late delivery, the first decision may be to ask which order the customer means. Once the application identifies an authorised order, the agent can request its status. If tracking reports a delay, the agent can explain the available options. If the lookup fails, it should not pretend to have checked successfully. The new information changes the next step.

{{< steps >}}
{{< step title="Receive the problem" >}}
The customer reports a missing delivery. The agent recognises that a live order record is needed, not a general explanation of shipping.
{{< /step >}}
{{< step title="Gather enough evidence" >}}
The application verifies access and runs an order lookup. The returned result becomes information the model can use.
{{< /step >}}
{{< step title="Choose a bounded response" >}}
The agent explains the recorded status, offers permitted options or routes the case to a person. It stops when the goal is met or it reaches a defined boundary.
{{< /step >}}
{{< /steps >}}

The loop needs a stopping rule. “Keep trying until the customer is happy” is too open-ended: a system could repeat failed calls or make increasingly unsupported promises. Better stopping conditions include receiving a confirmed result, encountering an unavailable service or reaching a decision reserved for a person. The application should enforce limits on work as well as on permissions.

## Where agents help

Good starting tasks involve varied language but a recognisable business process. Customers describe the same problem in many ways. Employees ask questions without knowing a document's title. A model can help interpret these requests while ordinary software remains responsible for reliable record access and changes.

{{< cards >}}
{{< card title="Customer support" icon="chat" >}}
Find a relevant policy, check an order and prepare an explanation. Escalate exceptions instead of inventing a promise.
{{< /card >}}
{{< card title="Sales" icon="briefcase" >}}
Ask about the buyer's needs, collect relevant requirements and prepare a handoff. Do not invent product capabilities to secure interest.
{{< /card >}}
{{< card title="Back-office work" icon="list-check" >}}
Read a request, gather missing details and draft a ticket for approval. Keep the record change separate from the draft.
{{< /card >}}
{{< card title="Internal assistance" icon="book" >}}
Locate approved guidance and explain it in everyday language. Respect which documents each employee is allowed to access.
{{< /card >}}
{{< /cards >}}

Notice that these examples have a clear finish: an answered question, a completed set of requirements or a prepared ticket. They do not ask the agent to “run the department.” Smaller responsibilities are easier to explain to users, evaluate against examples and hand over when something goes wrong.

## What agents are not good at

Agents can misunderstand ambiguous requests, miss relevant evidence and confidently state something false. They are especially risky when asked to make exact calculations without a calculation tool, infer private facts they have not received or handle long chains of dependent decisions without checks. A fluent explanation does not prove that a task was completed correctly.

Some decisions also involve responsibility that cannot sensibly be delegated to a text-generating system. Approving an exceptional payment, interpreting a serious complaint or making a consequential employment decision may require accountable human judgement. An agent can organise evidence for the person without making the final decision itself.

Before choosing an agent, ask what a wrong answer could change. A weak draft can be edited; an unauthorised payment may be difficult to reverse. Start with assistance that a person can inspect, then expand authority only where evidence, permissions and evaluation justify it. More independence is a design choice, not an automatic measure of progress.

**Related:** On AIVAX, the configured runtime that brings a model, instructions and capabilities together is called an [AI gateway](../../docs/inference/ai-gateway.md).

**What's next:** Meet the engine at the centre of this system in [What is an LLM](what-is-an-llm.md).

{{< quiz options="It must operate without any human oversight | It uses a model to choose steps towards a goal within the application's limits | It can access any business system because it understands language | It is always more appropriate than a fixed script" answer="2" explanation="An agent can choose a next step using information and allowed actions. The application still defines its access, stopping rules and human oversight." >}}
What most usefully distinguishes an AI agent in a business application?
{{< /quiz >}}
