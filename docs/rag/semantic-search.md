# Semantic Search

The semantic search API searches one or more collections and returns the most relevant indexed documents for the supplied search terms.

If your application already owns the candidate document strings, consider [Reflex](reflex.md): a collection-less RAG search that ranks supplied documents without indexing or storage. Use managed semantic search when AIVAX should store and search a persistent corpus or when the corpus is too large to submit as candidates with every request.

After creating a collection, search it with complete terms that reflect the question a user would ask. The response can include the matched documents and their associated collection data for use in your application or AI Gateway flow.

For the supported request, response, authentication, and error contract, use the API Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Reranking

A reranker can adjust the order of candidates returned by semantic search. It does not search additional documents or recover text that the retrieval stage did not select. See [Rerankers](reranking.md) for selection guidance.

## Multiple Terms

Multiple terms cover alternative retrieval paths rather than requiring every term to match the same document. Use them for synonyms, alternative phrasings, or several acceptable ways to find an answer.

If the user intent is one composite idea, send that idea as one complete term. For example, prefer:

```text
How do I cancel an annual subscription without a penalty?
```

Over disconnected keywords:

```text
cancellation
annual subscription
penalty
```

## Search Quality

A complete query usually performs better than a list of disconnected keywords because it preserves the relationship between concepts.

If search returns poor results:

1. Confirm that the documents are indexed.
2. Query the collection directly before testing through an AI Gateway.
3. Compare complete questions with alternative phrasings.
4. Check whether the relevant document is too short, too long, or not self-contained.
5. Check whether the query language matches the document language.
6. If the gateway rewrites questions before searching, test with the plain query path to isolate rewriting issues.

## Collections MCP

To expose AIVAX collections as tools for an external MCP client, see [Collections MCP](/docs/mcp-utilities/collections-mcp).

For current service availability and account limits, see [Plans and Limits](../limits.md).
