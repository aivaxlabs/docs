---
{title: Search,linkTitle: Search,weight: 30,group: RAG and collections}
---

# Search

The search API looks up one or more collections and returns the most relevant indexed documents for the supplied search terms. The same retrieval options are used by RAG answer generation and by collections attached to an AI Gateway.

If your application already owns the candidate document strings, consider [Reflex](reflex.md): a collection-less search that ranks supplied documents without indexing or storage. Use managed search when AIVAX should store and search a persistent corpus or when the corpus is too large to submit as candidates with every request.

Before searching, add [documents](documents.md) to a [collection](collections.md) and wait for indexing. Compare [vector search with the complete RAG pipeline](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) before deciding what to build.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## How a search runs

1. If a `filter` is set, AIVAX first restricts the requested collections to the documents that match it.
2. Each search term is embedded and compared with the indexed documents that remain.
3. Candidates below the minimum score are discarded.
4. The reranker reorders the candidates, and the best results, up to the requested count, are returned.
5. When reference expansion is enabled, documents that share a reference with a result are attached to it.

Each result includes the document ID, name, contents, score, and metadata.

## Search options

| Option | Default | Description |
| --- | --- | --- |
| `collections` | Required | One or more collection IDs owned by the account. |
| `terms` | — | One search term or a list of alternative terms. Optional only when `filter` is set. |
| `top` | 5 | Maximum number of results, from 1 to 128. |
| `minScore` | 0.2 | Minimum vector similarity, from 0 to 0.99, applied before reranking. Raise it to drop weak matches; lower it when relevant documents are missing. |
| `reranker` | Reflex | Reranker that orders the candidates. Use `none` to keep the vector-similarity order. See [Rerankers](reranking.md). |
| `filter` | — | An [advanced filter](document-filters.md) expression, or a list of expressions that must all match. |
| `includeReferences` | `false` | Attaches the other documents that share the reference of each result. |

The embedded API reference is the source of truth for the request and response contract.

## Filter results

Filters narrow the documents a search can return, using exact conditions on document fields rather than semantic similarity. Use them when the answer must come from a known subset, such as one product, tenant, language, document type, or period.

| Filter on | Example | Use for |
| --- | --- | --- |
| Name | `name startswith "policy-"` | Document families that follow a naming convention. |
| Tags | `tags has "finance"` | Operational labels assigned on import. |
| Metadata | `metadata.region = "br"` | Structured values stored with each document, such as region, version, or author. |
| Contents | `content contains "refund"` | Required words or identifiers in the text. |
| Dates | `updatedAt >= now-30d` | Recently created or updated documents. |

Combine conditions with `and`, `or`, `not`, and parentheses, for example `tags has "finance" and createdAt >= now-30d`. When `filter` is a list, every expression must match.

Filters are evaluated before the search terms are embedded. Only matching documents are ranked, so results never include documents outside the filter. When no document matches, the search returns an empty result without generating embeddings or charging for the query. Sending a filter without `terms` returns the newest matching documents, up to `top`, without embedding or reranking.

Filters do not replace good document text: the meaning a user searches for must appear in the contents. See [Advanced filters](document-filters.md) for the complete syntax, operators, limits, and errors, or [How to filter RAG results by metadata, tags and date](https://aivax.net/blog/filter-rag-results-by-metadata-tags-date/) for a worked guide.

## Multiple terms

Multiple terms cover alternative retrieval paths rather than requiring every term to match the same document. Use them for synonyms, alternative phrasings, or several acceptable ways to find an answer.

If the user's question combines several related conditions, keep them together in one search term. For example, prefer:

```text
How do I cancel an annual subscription without a penalty?
```

Over disconnected keywords:

```text
cancellation
annual subscription
penalty
```

A complete query usually performs better than a list of disconnected keywords because it preserves the relationship between concepts. If users search by product codes, policy IDs, plan names, or procedure names, include those identifiers in the document text.

## Reranking

A reranker adjusts the order of candidates returned by vector search. It does not search additional documents or recover text that the retrieval stage did not select. See [Rerankers](reranking.md) for selection guidance.

## Search quality

If search returns poor results:

1. Confirm that the documents are indexed.
2. Query the collection directly before testing through an AI Gateway.
3. Compare complete questions with alternative phrasings.
4. Check whether the relevant document is too short, too long, or not self-contained; see [Write good documents](documents.md#write-good-documents).
5. Check whether the query language matches the document language.
6. If the gateway rewrites questions before searching, test with the plain query path to isolate rewriting issues.
7. Review low-scoring searches and query coverage in [RAG Observability](observability.md).

To expose collections as tools for an external MCP client, see [Collections and RAG MCP](../mcp-utilities/collections-mcp.md). For search pricing and rate limits, see [Collections](collections.md#pricing-and-limits).
