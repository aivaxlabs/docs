---
title: How AI reads your documents
linkTitle: "#3 RAG and semantic search"
description: "Pipi turns the bakery's documents into index cards, finds the right one by meaning instead of by word, and hands it to the brain before it answers."
weight: 30
duration: 5
objectives:
  - Explain why a model guesses when it lacks your information.
  - Describe how a collection splits documents into small pieces.
  - Tell the difference between keyword search and semantic search.
  - Define RAG as searching before answering.
---

The brain is clever, but it has never seen the bakery's menu. If nobody tells it, it guesses. This episode shows how to give it the facts at the moment it needs them.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/03-rag.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/03-rag.webp" title="AIVAX Learn #3 — How AI reads your documents" lang="pt-BR" caption="Episode 3 · 1 minute 11 seconds" >}}

## What the video shows

Pipi stores the bakery's documents in a **collection**. Each small piece of a document becomes an index card. Small pieces matter: when the model receives only the relevant passage, it reads less and is less likely to mix topics.

Next comes a problem. One card says *"diet cake"*, but the customer asks for something *"sugar-free"*. A search that matches word by word finds nothing, because nobody wrote "sugar-free".

{{< compare >}}
{{< side title="Keyword search" tone="bad" >}}Looks for the same words. "Sugar-free" does not match "diet cake", so the right card is missed.{{< /side >}}
{{< side title="Semantic search" tone="good" >}}Looks for the same meaning. Similar ideas sit close together, so the question lands next to the right card.{{< /side >}}
{{< /compare >}}

**Semantic search** turns each card and each question into a position on a map of meaning. Cards about similar things end up near each other, and the question falls beside the card that answers it.

## RAG: search before answering

The card that was found travels with the question to the brain, and the brain answers based on it. That combination is called **RAG**, short for *retrieval-augmented generation*: retrieve the relevant passages, then generate the answer with them in view.

{{< flow "Question | Semantic search in the collection | Relevant cards + question | Model | Grounded answer" >}}

Pipi sums it up as *"no guessing, only facts"*. In practice, RAG reduces guessing but does not remove it: the answer is only as good as the documents and the search. That is why Learn spends a whole module on preparing knowledge.

## Go deeper

- In Learn: [What is a RAG](../teaching-agents/what-is-a-rag.md), [Embeddings and semantic search](../models/embeddings-and-semantic-search.md), [Preparing documents for knowledge](../teaching-agents/preparing-documents-for-knowledge.md) and [Measuring adherence and hallucination](../teaching-agents/measuring-adherence-and-hallucination.md).
- In the Documentation: [Collections](../../docs/rag/collections.md) explains how documents are stored, [Semantic search](../../docs/rag/semantic-search.md) covers filters and search quality, [Reranking](../../docs/rag/reranking.md) reorders results, and [Best practices](../../docs/rag/documents.md#write-good-documents) collects practical advice. Collections are attached to an [AI gateway](../../docs/inference/ai-gateway.md).

Documents let the brain know things. The next episode lets it do things.

{{< quiz options="The customer typed the question wrong | Keyword search looks for the same words, and the card used different words with the same meaning | The collection was too small" answer="2" explanation="Semantic search compares meaning instead of exact words, so 'sugar-free' can find the 'diet cake' card." >}}
Why did the "sugar-free" question fail to find the "diet cake" card in the video?
{{< /quiz >}}
