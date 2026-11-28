---
{title: Reflex,linkTitle: Reflex,weight: 70,group: RAG and collections}
---

# Reflex

Reflex is AIVAX's collection-less search for RAG. Send a query together with candidate document strings and receive the most relevant items in ranked order—without indexing, storing, or maintaining a RAG collection first.

Reflex is the default ranker of the autonomous [reranking endpoint](reranking.md): calling that endpoint without a `model` selects Reflex. This page explains when to choose Reflex; the reranking page covers candidate preparation and ranker comparison in depth.

Use Reflex when your application already owns the candidate documents, the candidate set changes frequently, or you want a retrieval step without collection indexing and storage. Use [Semantic Search](semantic-search.md) when AIVAX should store, index, and search a persistent knowledge base or narrow a corpus that is too large to submit as candidates on every request.

## Reflex or Semantic Search?

| Choose Reflex when... | Choose Semantic Search when... |
| --- | --- |
| Your application already has the candidate document strings. | Documents should live in managed AIVAX collections. |
| You need retrieval immediately, without an indexing step. | The knowledge base is persistent and searched repeatedly. |
| The candidate set is dynamic or request-specific. | The corpus is too large to submit as candidates on every request. |
| You want collection-less ranking. | You want collection filtering, stored metadata, document references, and managed retrieval. |

Reflex returns ranked text candidates; it does not generate an answer. Pass the selected documents to your language model or AI Gateway as RAG context. To decide between Reflex and a model reranker, see [best reranker for RAG](https://aivax.net/blog/reflex-retrieval-built-for-recurring-documents/).

## Use Reflex

Call the reranking API with a query and the candidate documents your application wants to compare. Results are returned in relevance order. Each result keeps its input position, so you can map it back to your application data.

Use concise, focused candidate documents. Reranking can improve their order, but it cannot recover information that was not included in the candidates. If the expected document is consistently absent, improve candidate selection, chunking, or query formulation before tuning the ranker.

Reflex limits the number of candidate documents per request and the number of ranked results returned; see [Pricing and limits](#pricing-and-limits). If your candidate pool exceeds the candidate limit, narrow it first — with lexical pre-filtering, a cheap first-pass rank, or collection retrieval — and let Reflex order the shortlist.

For the supported request, response, authentication, and error contract, use the API Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Use Reflex with RAG

Reflex is also the default reranker after AIVAX retrieves candidates from RAG collections. It improves the order of retrieved candidates but cannot recover a document the retrieval stage did not select.

Every plan includes a daily reranking allowance for Reflex, shared between autonomous calls and RAG reranking and separate from the RAG embedding allowance. Other rerankers are billed normally. See [Plans and Limits](../pricing/plans-and-limits.md#included-daily-subscription-allowances) for plan capacity.

## Async generation

The reranking API accepts `"async": true` to queue the request. The API answers with HTTP `202` and an ID, and you fetch the stored result later or receive a webhook when it is done. See [Async generations](/docs/inference/batch/async-generations.md) and [Rerankers](reranking.md#async-generation).

## Pricing and limits

Reflex is billed by input tokens, with a lower rate for cached input. Accounts with [Data Sharing](../pricing/data-sharing.md) enabled receive a discount on eligible reranking operations.

| Description | Pricing |
| --- | ---: |
| Reflex - cache miss | **$0.015/M tokens** |
| Reflex - cache hit | **$0.005/M tokens** |

Each request accepts up to 15,000 candidate documents and returns up to 50 ranked results on every plan. Reflex processing time per day and reranking requests per minute depend on the plan; see [RAG and collections limits](../pricing/plans-and-limits.md#rag-and-collections).

The processing-time limit covers Reflex requests on the reranking endpoint and in RAG searches. The reranking request limit applies to the reranking endpoint and to RAG searches that use a reranker, including through AI Gateways and MCP tools. Requests above a limit return `429 Too Many Requests`.
