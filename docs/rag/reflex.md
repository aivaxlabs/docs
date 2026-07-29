# Reflex

`@aivax/reflex-v1` is the default AIVAX reranker. It combines low-latency semantic relevance with bounded lexical evidence and caches query and document processing within each account.

Use Reflex when your application owns a dynamic document set and benefits from reusing repeated queries or documents. Use [Semantic Search](semantic-search.md) when documents should live in managed RAG collections. See [Rerankers](reranking.md) for the full model catalog and alternatives.

## Call Reflex

Send requests to `POST /api/v1/generations/rerank`. Omit `model` to use Reflex by default, or send `"model": "@aivax/reflex-v1"` explicitly.

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `model` | `string` | No | `@aivax/reflex-v1`. |
| `query` | `string` | Yes | Non-empty text used to rank the documents. |
| `documents` | `string[]` | Yes | One to 10,000 document strings. |
| `top_n` | `number` | No | Maximum number of results. Defaults to five or the document count when fewer than five are supplied; Reflex returns at most 200. |
| `min_score` | `number` | No | Minimum final relevance score from `0` through `1`. Defaults to `0`. |

The catalog declares a 1,948-token context and a maximum of 10,000 documents for Reflex. The response identifies `@aivax/reflex-v1`, returns results in descending relevance order, and preserves each document's original zero-based `index`. Duplicate document strings are not removed from the response contract; each occurrence keeps its own input index.

Example request using the default model:

```json
{
  "query": "What is the cancellation period?",
  "documents": [
    "Annual plans may be cancelled within 30 days.",
    "Invoices are issued at the start of each month."
  ],
  "top_n": 2,
  "min_score": 0.2
}
```

See [Rerankers](reranking.md#read-the-response) for the common response structure and `usage` fields.

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Understand cache and usage

Reflex caches query and document processing automatically within your account. Reusing an exact query or document string can produce a cache hit in a later request. Changing the text creates a different cache entry; changing only a document's position does not change its cache key.

Cache availability is not permanent. Use the response's `usage` object to inspect the current request:

| Field | Meaning |
| --- | --- |
| `input_tokens` | Query and document tokens processed as cache misses. |
| `cached_input_tokens` | Query and document tokens served from cache. |
| `total_tokens` | All query and document input tokens; always `input_tokens + cached_input_tokens`. |
| `cost` | Final account charge recorded for the request. |

The public response does not split query tokens from document tokens. The counters describe the complete input processed by Reflex.

## Billing, limits, and data collection

Cache misses and cache hits have different base prices. The public `usage.cost` is the final amount recorded for the account after applicable account adjustments. See [Pricing](../pricing.md#reflex) for the current token prices.

Every Reflex request consumes the account's reranking request quota and Reflex token quota. The token quota counts `total_tokens`, including cached input. Exceeding a quota returns `429 Too Many Requests`; see [Plans and Limits](../limits.md).

When the optional semantic data collection setting is enabled, eligible direct Reflex searches receive the documented discount and may contribute the query, submitted documents, and ranking results. See [Data Collecting](../data-collecting.md) before enabling it.

## Use Reflex with RAG

Reflex is also the default reranker after AIVAX retrieves candidates from RAG collections. The compatibility alias `smart` selects the same model. In this flow, Reflex can improve the order of retrieved candidates but cannot recover a document that the retrieval stage did not select. If relevant documents are consistently absent, adjust retrieval, chunking, query formulation, or candidate count before tuning reranking.
