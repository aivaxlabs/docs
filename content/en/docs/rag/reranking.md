---
{title: Rerankers,linkTitle: Rerankers,weight: 130,group: RAG and collections}
---

# Rerankers

Rerankers reorder an existing set of candidate documents for a query. They do not search a collection or recover text that is absent from the input. Use the autonomous reranking API when your application already owns the candidates, or use [Semantic Search](semantic-search.md) to retrieve candidates from an AIVAX collection before reranking them.

[Reflex](reflex.md) is the default ranker of this endpoint and AIVAX's collection-less search experience. See that page when you want retrieval-style ranking without managing a collection.

## Rerank documents directly

Authenticate with an [AIVAX API key](../authentication.md) and send a query with the candidate document strings. The API returns the candidates in relevance order. Each result keeps its input position, so you can map it back to your application data.

Use direct reranking when candidates are dynamic, come from another search system, or do not need to be stored in an AIVAX collection. Use managed semantic search when AIVAX should retrieve candidates from a persistent corpus.

For the supported request, response, authentication, and error contract, use the API Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Build candidates worth ranking

Reranking only reorders what it receives, so candidate quality decides the ceiling. Keep each candidate string focused on one idea — a paragraph or a short section rather than a whole page — so the relevance score reflects one topic instead of an average over many. When candidates come from chunking, prefer boundaries that preserve complete statements; see [Text segmentation](text-segmentation.md).

Use the [RAG pipeline checklist](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) to distinguish preparation, retrieval, and ordering failures.

Send enough candidates to cover plausible answers: over-retrieve first, then rank precisely. Use `top_n` to keep only the head of the ranked list, and `min_score` to drop low-relevance tail results. Calibrate that threshold on your own queries, because score scales differ between rankers and a cutoff tuned on one workload rarely transfers to another.

## Choosing a reranker

Start with the default reranker unless you have a measured reason to select another available option. The default is Reflex; alternatives include lexical matching, reciprocal-rank fusion of several signals, and third-party cross-encoders. Fusion (`rrf`) is retrieval-only and is rejected by this endpoint: it exists for combining signals inside collection search, not for autonomous ranking.

To compare options, fix a set of representative queries with known relevant documents from your own workload — covering your languages, document lengths, and jargon — and measure whether swapping rankers moves the right document upward. If the relevant document is missing from the candidates entirely, no ranker can recover it; improve candidate retrieval, chunking, query formulation, or candidate count before comparing rerankers.

To separate missing-candidate failures from poor-ordering failures before you add a reranker, see [Do I need a reranker for RAG?](https://aivax.net/blog/semantic-search-vs-reranking/). To judge when Reflex is enough compared with a cross-encoder, see [reranking RAG results without a cross-encoder](https://aivax.net/blog/reflex-retrieval-built-for-recurring-documents/).

For current availability, supported options, and account limits, see the API Reference and [Plans and Limits](../limits.md).
