# Rerankers

Rerankers reorder an existing set of candidate documents for a query. They do not search a collection or recover text that is absent from the input. Use the autonomous reranking API when your application already owns the candidates, or use [Semantic Search](semantic-search.md) to retrieve candidates from an AIVAX collection before reranking them.

## Rerank documents directly

Authenticate with an AIVAX API key and send a query with the candidate document strings. The API returns the candidates in relevance order, with the input position needed to associate each result with your application data.

Use direct reranking when candidates are dynamic, come from another search system, or do not need to be stored in an AIVAX collection. Use managed semantic search when AIVAX should retrieve candidates from a persistent corpus.

For the supported request, response, authentication, and error contract, use the API Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Choosing a reranker

Start with the default reranker unless you have a measured reason to select another available option. Evaluate changes using representative queries, languages, document lengths, and relevance judgments from your own workload.

Reranking improves order only among the candidates supplied to it. If the relevant document is missing, improve candidate retrieval, chunking, query formulation, or candidate count before comparing rerankers.

For current availability, supported options, and account limits, see the API Reference and [Plans and Limits](../limits.md).
