Source: https://docs.aivax.net/learn/learn-with-pipi/how-ai-reads-your-documents.html

The brain is clever, but it has never seen the bakery's menu. If nobody tells it, it guesses. This episode shows how to give it the facts at the moment it needs them.

[Video: AIVAX Learn #3 — How AI reads your documents](https://public.aivax.net/file/aivax-public/learn/pipi/03-rag.mp4) — Pipi's videos are only available in Portuguese for now.

*Episode 3 · 1 minute 11 seconds*


## What the video shows

Pipi stores the bakery's documents in a **collection**. Each small piece of a document becomes an index card. Small pieces matter: when the model receives only the relevant passage, it reads less and is less likely to mix topics.

Next comes a problem. One card says *"diet cake"*, but the customer asks for something *"sugar-free"*. A search that matches word by word finds nothing, because nobody wrote "sugar-free".


**Keyword search**

Looks for the same words. "Sugar-free" does not match "diet cake", so the right card is missed.


**Semantic search**

Looks for the same meaning. Similar ideas sit close together, so the question lands next to the right card.





**Semantic search** turns each card and each question into a position on a map of meaning. Cards about similar things end up near each other, and the question falls beside the card that answers it.

## RAG: search before answering

The card that was found travels with the question to the brain, and the brain answers based on it. That combination is called **RAG**, short for *retrieval-augmented generation*: retrieve the relevant passages, then generate the answer with them in view.

Question → Semantic search in the collection → Relevant cards + question → Model → Grounded answer


Pipi sums it up as *"no guessing, only facts"*. In practice, RAG reduces guessing but does not remove it: the answer is only as good as the documents and the search. That is why Learn spends a whole module on preparing knowledge.

## Go deeper

- In Learn: [What is a RAG](https://docs.aivax.net/learn/teaching-agents/what-is-a-rag.md), [Embeddings and semantic search](https://docs.aivax.net/learn/models/embeddings-and-semantic-search.md), [Preparing documents for knowledge](https://docs.aivax.net/learn/teaching-agents/preparing-documents-for-knowledge.md) and [Measuring adherence and hallucination](https://docs.aivax.net/learn/teaching-agents/measuring-adherence-and-hallucination.md).
- In the Documentation: [Collections](https://docs.aivax.net/docs/rag/collections.md) explains how documents are stored, [Semantic search](https://docs.aivax.net/docs/rag/semantic-search.md) covers filters and search quality, [Reranking](https://docs.aivax.net/docs/rag/reranking.md) reorders results, and [Best practices](https://docs.aivax.net/docs/rag/documents.md#write-good-documents) collects practical advice. Collections are attached to an [AI gateway](https://docs.aivax.net/docs/inference/ai-gateway.md).

Documents let the brain know things. The next episode lets it do things.

**Knowledge check.** Why did the "sugar-free" question fail to find the "diet cake" card in the video?

1. The customer typed the question wrong
2. Keyword search looks for the same words, and the card used different words with the same meaning
3. The collection was too small

Answer: option 2. Semantic search compares meaning instead of exact words, so 'sugar-free' can find the 'diet cake' card.
