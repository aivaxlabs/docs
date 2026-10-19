Source: https://docs.aivax.net/docs/rag/reflex.html

# Reflex

Reflex is AIVAX's collection-less search for RAG. Send a query together with candidate document strings and receive the most relevant items in ranked order—without indexing, storing, or maintaining a RAG collection first.

Reflex is the default ranker of the autonomous [reranking endpoint](https://docs.aivax.net/docs/rag/reranking.md): calling that endpoint without a `model` selects Reflex. This page explains when to choose Reflex; the reranking page covers candidate preparation and ranker comparison in depth.

Use Reflex when your application already owns the candidate documents, the candidate set changes frequently, or you want a retrieval step without collection indexing and storage. Use [Semantic Search](https://docs.aivax.net/docs/rag/semantic-search.md) when AIVAX should store, index, and search a persistent knowledge base or narrow a corpus that is too large to submit as candidates on every request.

## Reflex or Semantic Search?

| Choose Reflex when... | Choose Semantic Search when... |
| --- | --- |
| Your application already has the candidate document strings. | Documents should live in managed AIVAX collections. |
| You need retrieval immediately, without an indexing step. | The knowledge base is persistent and searched repeatedly. |
| The candidate set is dynamic or request-specific. | The corpus is too large to submit as candidates on every request. |
| You want collection-less ranking. | You want collection filtering, stored metadata, document references, and managed retrieval. |

Reflex returns ranked text candidates; it does not generate an answer. Pass the selected documents to your language model or AI Gateway as RAG context. To decide between Reflex and a cross-encoder reranker, see [reranking RAG results without a cross-encoder](https://aivax.net/blog/reflex-retrieval-built-for-recurring-documents/).

## Use Reflex

Call the reranking API with a query and the candidate documents your application wants to compare. Results are returned in relevance order. Each result keeps its input position, so you can map it back to your application data.

Use concise, focused candidate documents. Reranking can improve their order, but it cannot recover information that was not included in the candidates. If the expected document is consistently absent, improve candidate selection, chunking, or query formulation before tuning the ranker.

Reflex limits the number of candidate documents per request and the number of ranked results returned; see [Pricing and limits](#pricing-and-limits). If your candidate pool exceeds the candidate limit, narrow it first — with lexical pre-filtering, a cheap first-pass rank, or collection retrieval — and let Reflex order the shortlist.

For the supported request, response, authentication, and error contract, use the API Reference:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Rerank%20documents)

## Use Reflex with RAG

Reflex is also the default reranker after AIVAX retrieves candidates from RAG collections. In this flow, it can improve the order of retrieved candidates but cannot recover a document that the retrieval stage did not select. If relevant documents are consistently absent, adjust retrieval, chunking, query formulation, or candidate count before tuning reranking.

Free, Pro, and Max include a daily reranking allowance for Reflex, shared between autonomous calls and RAG reranking. Cached and uncached input both consume this allowance. It is separate from the RAG embedding allowance and the processing-time cap; other rerankers are billed normally. For relative plan capacity and coverage rules, see [Plans and Limits](https://docs.aivax.net/docs/limits.md#included-daily-subscription-allowances).

## Pricing and limits

Reflex is billed by input tokens. Input served from the account-scoped cache is billed at a lower rate. Accounts with [Data Sharing](https://docs.aivax.net/docs/data-sharing.md) enabled receive a discount on eligible reranking operations.

| Description | Pricing |
| --- | ---: |
| Reflex - cache miss | **$0.015/M tokens** |
| Reflex - cache hit | **$0.003/M tokens** |

| Limit | Free | Pro | Max |
| --- | --- | --- | --- |
| Reflex processing time | 30 minutes/day | 6 hours/day | — |
| Reranking requests | 30/min | 1,000/min | — |
| Candidate documents per request | 10,000 | 10,000 | 10,000 |
| Ranked results returned | 200 | 200 | 200 |

The processing-time limit counts the time spent processing Reflex requests, both on the reranking endpoint and in RAG searches that use Reflex; cached input does not consume it separately. The reranking request limit applies to the reranking endpoint and to RAG searches that use a reranker, including searches through AI Gateways and MCP tools. An em dash (`—`) means the plan does not impose a limit. Requests above a limit return `429 Too Many Requests`.
