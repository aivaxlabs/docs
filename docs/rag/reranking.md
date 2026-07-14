# Reranking

Use the standalone reranking endpoint when you already have candidate text and need AIVAX to order it against a query. It does not search a collection, create embeddings, or retrieve additional documents. It applies the local lexical reranker to the exact strings supplied by the caller.

Use [Semantic Search](semantic-search.md) instead when AIVAX must find candidates inside a RAG collection. Semantic Search can then apply `rrf`, `lexical`, or `smart` reranking after vector retrieval.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/rank</span>
</div>

## Request limits

| Limit | Value |
| --- | ---: |
| Documents per request | 1,024 |
| Query plus all document text | 32,768 characters |
| `top_n` | 1 through the number of supplied documents |

`query` must be a non-empty string. `documents` must be a non-empty array of strings. When `top_n` is omitted, the endpoint returns a score for every supplied document.

The lexical reranker considers exact tokens, fuzzy token matches, term coverage, term proximity, and document length. Results contain the original zero-based `index` and a normalized `relevanceScore`; higher scores indicate stronger lexical relevance. The document text is not repeated in the response, so map each result index back to the original `documents` array.

## Billing and shared quota

The endpoint records a base usage price of US$0.0001 per request, equivalent to US$1 per 10,000 searches. The account's [plan commission multiplier](/docs/pricing#usage-billing) is applied when usage is recorded. This price belongs only to `/api/v1/rank`; using a local reranker inside Semantic Search does not add this standalone endpoint charge.

Reranking has a [shared per-account limit](/docs/limits#rag-and-collection-limits) across the standalone endpoint and every non-`none` reranker used by RAG search.

A Semantic Search request with `reranker: "none"` does not consume the reranking quota. Other RAG search limits, public-key limits, and model limits remain independent.

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Reranking improves ordering only among supplied candidates. If the relevant text is missing from the input, reranking cannot recover it; improve candidate retrieval or use Semantic Search first.
