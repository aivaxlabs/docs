# Reflex

Reflex is a low-latency search API for ranking document strings supplied directly in a request. It combines semantic relevance with a bounded lexical boost, helping exact terms, close spellings, query coverage, and term proximity without allowing lexical evidence to replace the semantic score.

Unlike collection-based RAG, Reflex does not require you to create, populate, and manage a permanent collection before searching. Send the query and the current document strings; Reflex processes them immediately and automatically reuses cached document embeddings when available.

Use Reflex for dynamic or application-owned document sets that must be searchable immediately. Use [Semantic Search](semantic-search.md) when documents should live in managed RAG collections, be shared by multiple integrations, or be attached to an AI Gateway.

## Request

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `query` | `string` | Yes | Non-empty text used to rank the documents. |
| `documents` | `string[]` | Yes | One to 1,000 document strings to search. Exact duplicate strings are removed before processing. |
| `top_n` | `number` | No | Maximum number of results to return. The default is `5`, or all distinct documents when fewer than five are supplied. The maximum is `200` or the number of distinct documents, whichever is lower. |
| `min_score` | `number` | No | Minimum semantic similarity score from `0` to `1`, applied before the lexical boost. The default is `0`. |

The response identifies the request and Reflex model, then returns the ranked results and document-token usage. Each result contains the document text, a `relevance_score` from `0` to `1`, and its zero-based `index`. Because exact duplicates are removed first, `index` refers to the deduplicated document sequence.

<script src="https://inference.aivax.net/apidocs?embed-target=Reflex%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Cache behavior

Reflex caches document processing automatically within your account. An exact document string can be reused across requests and across different document sets. Changing the text creates a different cache entry, while changing only its position in the request does not.

Cache availability is not permanent. Use the response's `usage` object to see how the current request was billed:

| Field | Meaning |
| --- | --- |
| `input_tokens` | Document tokens processed as cache misses. |
| `cached_input_tokens` | Document tokens served from cache. |
| `total_tokens` | Total tokens across the distinct documents in the request. |

The query is not included in these document-token counters.

## Pricing

Reflex has two document-input prices:

| Input type | Base price |
| --- | ---: |
| Cache miss | US$0.015 per 1 million tokens |
| Cache hit | US$0.003 per 1 million tokens |

Cache-hit pricing applies when a document's processing can be reused. Cache-miss pricing applies when a document must be processed. The account's [plan commission multiplier](/docs/pricing#usage-billing) is applied when usage is recorded.
