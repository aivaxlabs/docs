---
title: What is a RAG
linkTitle: What is a RAG
description: "Learn how Retrieval-Augmented Generation finds relevant evidence before a model writes an answer, and why evidence still needs checking."
weight: 20
duration: 11
objectives:
  - Explain Retrieval-Augmented Generation with an everyday analogy.
  - Distinguish preparing knowledge from retrieving it for a question.
  - Recognise how grounding reduces unsupported answers.
  - Identify the limits of answers produced with retrieved evidence.
---

Suppose you ask a librarian whether a local club allows guests at its events. A good librarian does not answer from a vague memory of how clubs usually work. They find the current club handbook, locate the guest policy and help you interpret it. If the handbook says nothing about a particular event, they tell you that the answer is missing rather than inventing a rule.

**Retrieval-Augmented Generation**, usually shortened to **RAG**, gives an AI agent a similar workflow. Retrieval means finding information. Augmented means supplemented. Generation means writing an answer. Put together, the system searches selected sources, gives the relevant passages to a language model and asks it to answer using that evidence. People sometimes call the resulting setup “a RAG”, though the initials describe a technique rather than one particular product.

## Separate the library from the librarian

A language model can write an explanation, but its general training is not a dependable record of your organisation's current rules. A knowledge store provides those rules separately. This separation lets you update a source without retraining the model, which would mean changing the model itself through a learning process.

The library analogy also explains why uploading material is not enough. A shelf full of manuals is useful only if the right manual can be found, its edition is current and the reader interprets it correctly. RAG includes both preparing the searchable material and selecting evidence at answer time. These are related activities, but they can fail independently.

A **chunk** is a portion of a source prepared as a searchable unit. It might be a self-contained section about guest eligibility rather than the entire club handbook. Chunks help the system bring relevant information into a limited reading space without including every page. They need enough context to make sense alone: “This is prohibited” is a poor chunk if the missing previous paragraph identifies what “this” means.

Many retrieval systems use **embeddings**, numerical representations of text that place related meanings near one another. Think of a map where “bringing a visitor” and “guest attendance” occupy nearby areas even though the words differ. The map helps find candidates; it does not certify that a passage is true or applicable. Some systems also search exact words. The unit [Embeddings and semantic search](../models/embeddings-and-semantic-search.md) explains the numerical approach in more detail.

## Follow one question through the system

The **context** is the information available to the model while it produces a response. In RAG, retrieved passages become part of that context alongside instructions and the user's question. The model is not browsing the entire knowledge store in its head; it sees what the surrounding system provides.

{{< steps >}}
{{< step title="Receive the question" >}}
A club member asks whether a guest may attend the introductory workshop. The wording identifies a topic and a particular event.
{{< /step >}}
{{< step title="Retrieve candidate evidence" >}}
The search finds passages about guest access and workshop restrictions. The system selects relevant, authorised material rather than forwarding the whole handbook.
{{< /step >}}
{{< step title="Write from the evidence" >}}
The model combines the selected passages into a plain-language answer. It should preserve conditions and distinguish what the source states from what remains unknown.
{{< /step >}}
{{< step title="Show the basis or the gap" >}}
The response points to the source when available. If the evidence does not cover the workshop, the agent explains that limitation and offers a suitable next step.
{{< /step >}}
{{< /steps >}}

{{< flow "Question | Search approved sources | Select passages | Model reads evidence | Answer with limits" >}}

The order matters. Searching after an answer has already been invented is not equivalent to using evidence before answering. A source added as decoration can make a response look trustworthy even when it does not support the claim. Good checking asks whether each important statement actually follows from the selected passages.

## Try the retrieval idea

{{< demo name="search" title="Try it: find a policy passage" config=`{"label":"Search the example knowledge","placeholder":"guest workshop","documents":[["Guest access","Guests may attend events explicitly marked as open to visitors. Private member meetings exclude guests.",["guest","visitor","access"]],["Workshop attendance","The introductory workshop is open to visitors. Booking is required before attendance.",["workshop","booking","introductory"]],["Equipment","Loan equipment must be returned to the event desk before leaving.",["equipment","loan","return"]]]}` >}}
Try “guest”, “workshop” and “equipment”. This simplified keyword demonstration illustrates selecting passages, not a real embedding model or a guarantee of retrieval quality. Notice that the guest and workshop passages answer different parts of the question.
{{< /demo >}}

In a real conversation, a member might ask “Can my friend come along?” rather than using the word “guest”. A retrieval method needs to handle that language or ask a clarifying question. It may also need the preceding conversation to know which event “along” refers to. Choosing evidence is therefore more than matching a document title to a sentence.

## Grounding changes the answer

**Grounding** means tying an answer's factual claims to evidence available for the task. It does not mean copying entire paragraphs. A helpful grounded answer can summarise, compare or explain, provided that it does not quietly add unsupported conditions.

{{< compare >}}
{{< side title="Without supplied club evidence" tone="bad" >}}
“Guests can usually attend workshops, so your friend can come without booking.”

This sounds plausible but invents the booking condition.
{{< /side >}}
{{< side title="With relevant evidence" tone="good" >}}
“The introductory workshop is open to visitors, and the workshop policy says booking is required before attendance.”

The answer preserves the actual condition instead of borrowing a general expectation.
{{< /side >}}
{{< /compare >}}

The first answer is not necessarily wrong for every club. It is unsupported for this one. That distinction matters: a model's general knowledge can be useful for explaining common concepts, but organisation-specific claims need organisation-specific evidence. A convincing tone is not a substitute for the current policy.

## Why RAG does not eliminate hallucination

A **hallucination** is an invented or unsupported factual statement presented as though it were established. RAG reduces opportunities for such statements by providing relevant material, but it cannot eliminate them. Search may miss the correct passage, a document may be outdated, or the model may ignore a restriction while composing the answer.

Contradictory sources create another risk. If an old handbook permits guests and the new handbook limits access, retrieving both does not tell the model which has authority unless dates and precedence are clear. A citation also proves little by itself: the cited source may discuss guests without supporting the specific promise in the response.

Design the agent to recognise missing evidence. “I found the general guest policy, but not a rule for this private event” is often a better outcome than a confident yes. For decisions with financial, legal or safety consequences, require appropriate review rather than assuming that retrieval makes autonomous decisions safe.

## Connect the technique to an implementation

Related: on AIVAX, [collections](../../docs/rag/collections.md) organise documents, and [semantic search](../../docs/rag/semantic-search.md) retrieves relevant material. Collections can also be connected to an AI gateway so retrieved material is available during a conversation. The feature names describe parts of the workflow, not a guarantee that every answer is correct.

Begin with approved sources and questions whose answers you can check. Look at what was retrieved before judging the final response. If the evidence was absent, improve the knowledge or search. If the evidence was present but misused, improve the instructions and evaluation. This simple distinction avoids trying to repair every problem by changing the model.

What's next: build a reliable source set in [How to find and prepare knowledge](finding-and-preparing-knowledge.md).

{{< quiz options="It retrains the language model every time a policy changes | It retrieves relevant evidence and supplies it to the model before the answer is written | It guarantees that every cited answer is correct | It replaces the need to maintain source documents" answer="2" explanation="RAG adds retrieved evidence to the model's context. Source quality, search quality and faithful interpretation still need maintenance and evaluation." >}}
What is the central idea of Retrieval-Augmented Generation?
{{< /quiz >}}
