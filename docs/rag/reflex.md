# Reflex

Reflex is AIVAX's collection-less search for RAG. Send a query together with candidate document strings and receive the most relevant items in ranked order—without indexing, storing, or maintaining a RAG collection first.

Reflex is the default ranker of the autonomous [reranking endpoint](reranking.md): calling that endpoint without a `model` selects Reflex. This page covers when to reach for Reflex; that page covers candidate preparation and ranker comparison in depth.

Use Reflex when your application already owns the candidate documents, the candidate set changes frequently, or you want a retrieval step without collection indexing and storage. Use [Semantic Search](semantic-search.md) when AIVAX should store, index, and search a persistent knowledge base or narrow a corpus that is too large to submit as candidates on every request.

## Reflex or Semantic Search?

| Choose Reflex when... | Choose Semantic Search when... |
| --- | --- |
| Your application already has the candidate document strings. | Documents should live in managed AIVAX collections. |
| You need retrieval immediately, without an indexing step. | The knowledge base is persistent and searched repeatedly. |
| The candidate set is dynamic or request-specific. | The corpus is too large to submit as candidates on every request. |
| You want collection-less ranking. | You want collection filtering, stored metadata, document references, and managed retrieval. |

Reflex returns ranked text candidates; it does not generate an answer. Pass the selected documents to your language model or AI Gateway as RAG context.

## Use Reflex

Call the reranking API with a query and the candidate documents your application wants to compare. Results are returned in relevance order and retain the input position needed to associate them with your application data.

Use concise, focused candidate documents. Reranking can improve their order, but it cannot recover information that was not included in the candidates. If the expected document is consistently absent, improve candidate selection, chunking, or query formulation before tuning the ranker.

Reflex returns at most 200 documents per request. When the candidate pool is larger, narrow it first — with lexical pre-filtering, a cheap first-pass rank, or collection retrieval — and let Reflex order the shortlist.

For the supported request, response, authentication, and error contract, use the API Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Use Reflex with RAG

Reflex is also the default reranker after AIVAX retrieves candidates from RAG collections. In this flow, it can improve the order of retrieved candidates but cannot recover a document that the retrieval stage did not select. If relevant documents are consistently absent, adjust retrieval, chunking, query formulation, or candidate count before tuning reranking.

For current service availability and account limits, see [Plans and Limits](../limits.md).
