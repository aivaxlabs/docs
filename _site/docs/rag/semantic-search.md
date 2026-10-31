Source: https://docs.aivax.net/docs/rag/semantic-search.html

# Search

AIVAX searches the indexed documents of one or more collections through three endpoints:

| Endpoint | Path | Use it to | Cost |
| --- | --- | --- | --- |
| Query collections | `POST /api/v2/query` | Find the documents that best answer a question. | Query embedding and, when used, reranking. |
| Find similar documents | `POST /api/v2/query/similar` | Find documents close in meaning to a document you already have. | No embedding or reranking cost. |
| Browse documents | `POST /api/v2/query/browse` | List documents in a fixed order, optionally filtered, without relevance. | No embedding or reranking cost. |

RAG answer generation and collections attached to an AI Gateway use the same retrieval engine.

If your application already owns the candidate document strings, consider [Reflex](https://docs.aivax.net/docs/rag/reflex.md): a collection-less search that ranks supplied documents without indexing or storage. Use managed search when AIVAX should store and search a persistent corpus or when the corpus is too large to submit as candidates with every request.

Before searching, add [documents](https://docs.aivax.net/docs/rag/documents.md) to a [collection](https://docs.aivax.net/docs/rag/collections.md) and wait for indexing. Only indexed documents are returned. Compare [vector search with the complete RAG pipeline](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) before deciding what to build.

## Query collections

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Query%20collections)

A query runs in this order:

1. If a filter is set, AIVAX restricts each collection to the documents that match it.
2. Each search term is embedded and compared with the remaining documents.
3. Documents below `minScore` are discarded, and the closest `candidates` documents form the candidate pool.
4. The reranker reorders the pool, unless reranking is disabled.
5. The pool is sorted and returned in pages of `limit` results.

```json
{
  "collections": [ "<collection-id>" ],
  "terms": "How do I request a refund?"
}
```

| Option | Default | Description |
| --- | --- | --- |
| `collections` | Required | Collection IDs owned by the account. An item can also be `{ "id": "<collection-id>", "filter": "..." }` to filter only that collection. |
| `terms` | Required | One search text or a list of alternative texts. |
| `filter` | — | An [advanced filter](https://docs.aivax.net/docs/rag/document-filters.md) expression, or a list of expressions that must all match. |
| `minScore` | 0.2 | Minimum vector similarity, from 0 to 0.99, for a document to enter the candidate pool. Raise it to drop weak matches; lower it when relevant documents are missing. |
| `candidates` | `limit` × 3 | Size of the candidate pool, from `limit` to 1000. A larger pool gives the reranker and later pages more documents to work with. |
| `reranker` | `smart` (Reflex) | Reranker that orders the pool: `smart`, `lexical`, `rrf`, `none`, or a full reranker name. See [Rerankers](https://docs.aivax.net/docs/rag/reranking.md). |
| `sort` | Score, descending | `{ "by": "score" \| "createdAt" \| "updatedAt" \| "indexedAt" \| "name", "dir": "asc" \| "desc" }`. Without `dir`, score sorts descending and the other fields ascending. |
| `limit` | 10 | Results per page, from 1 to 128. |
| `cursor` | — | `page.cursor` from the previous response, to read the next page. |
| `include` | `content`, `metadata` | Optional document fields: `content`, `metadata`, and `references`. `references` attaches the other documents that share the reference of each result. |

### Sorting and reranking

A reranker orders by relevance, so it only applies when results are sorted by score:

| Request | Behavior |
| --- | --- |
| No `sort` and no `reranker` | Reflex reranks the pool; results are sorted by score. |
| `reranker` without `sort` | That reranker reranks the pool; results are sorted by score. |
| `sort` other than score, without `reranker` | Reranking is disabled. The pool is selected by similarity and then sorted by the requested field. |
| `sort` other than score with `reranker: "none"` | Same as above. |
| `sort` other than score with any other `reranker` | Rejected with `400 Bad Request`. |

To get the most recent relevant documents, select a pool by meaning and sort it by date:

```json
{
  "collections": [ "<collection-id>" ],
  "terms": "pricing change",
  "candidates": 100,
  "sort": { "by": "createdAt", "dir": "desc" }
}
```

Each reranker has a maximum number of documents it accepts; a `candidates` value above it is rejected.

### Results

Each result has a `rank`, a `document`, and `scores`:

- `document` contains `id`, `collectionId`, `name`, `reference`, `tags`, `createdAt`, `updatedAt`, `indexedAt`, and the fields requested in `include`.
- `scores.similarity` is the vector similarity, `scores.rerank` is the reranker score (or `null`), and `scores.final` is the rerank score when a reranker ran, otherwise the similarity.

The response also contains `page.cursor`, `page.hasMore`, `page.candidates` (the size of the pool), and the `reranker` that ran.

### Pages

The first request computes the candidate pool and returns its first page. To read the next page, send the same request body with `cursor` set to the previous `page.cursor`. Later pages are read from the stored pool, so they are not charged again and keep the same order.

A cursor expires after 10 minutes without use and then returns `410 Gone`; repeat the request without `cursor` to run the query again. A cursor sent with a different request body is rejected with `400 Bad Request`. The pool never grows: to see more than `candidates` results, raise `candidates`.

## Find similar documents

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Find%20similar%20documents)

Find similar documents uses the stored vector of an indexed document as the query, as in a "more like this" feature. The source document is never returned. It accepts `documentId` and the same `collections`, `filter`, `minScore`, `candidates`, `sort`, `limit`, `cursor`, and `include` options as a query; without `collections`, it searches the collection of the source document.

```json
{
  "documentId": "<document-id>",
  "limit": 5
}
```

Nothing is embedded or reranked, so `scores.rerank` is always `null`. The source document must be indexed; a document still waiting for indexing is rejected with `400 Bad Request`.

## Browse documents

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Browse%20documents)

Browse documents lists indexed documents without semantic search. By default, documents are returned in insertion order, oldest first. Without a filter, every indexed document of the collections is listed.

```json
{
  "collections": [ "<collection-id>" ],
  "filter": "createdAt >= now-7d",
  "sort": { "by": "createdAt", "dir": "desc" },
  "limit": 50
}
```

It accepts `collections`, `filter`, `sort`, `limit`, `cursor`, and `include`. `sort.by` can be `createdAt`, `updatedAt`, `indexedAt`, or `name`; sorting by score is rejected. Results contain only `document`, without `rank` or `scores`.

Browse cursors point to the last returned document instead of a stored pool, so they do not expire. Documents added or changed between requests appear in later pages according to the sort order.

## Filter results

Filters narrow the documents a search can return, using exact conditions on document fields rather than semantic similarity. Use them when the answer must come from a known subset, such as one product, tenant, language, document type, or period.

| Filter on | Example | Use for |
| --- | --- | --- |
| Name | `name startswith "policy-"` | Document families that follow a naming convention. |
| Tags | `tags has "finance"` | Operational labels assigned on import. |
| Metadata | `metadata.region = "br"` | Structured values stored with each document, such as region, version, or author. |
| Contents | `content contains "refund"` | Required words or identifiers in the text. |
| Dates | `updatedAt >= now-30d` | Recently created or updated documents. |

Combine conditions with `and`, `or`, `not`, and parentheses, for example `tags has "finance" and createdAt >= now-30d`. When `filter` is a list, every expression must match. A filter set on a collection item is combined with the top-level `filter` for that collection.

Filters are evaluated before the search terms are embedded. Only matching documents are ranked, so results never include documents outside the filter. When no document matches, a query returns an empty result without generating embeddings or charging for the query.

Filters do not replace good document text: the meaning a user searches for must appear in the contents. See [Advanced filters](https://docs.aivax.net/docs/rag/document-filters.md) for the complete syntax, operators, limits, and errors, or [How to filter RAG results by metadata, tags and date](https://aivax.net/blog/filter-rag-results-by-metadata-tags-date/) for a worked guide.

## Multiple terms

Multiple terms cover alternative retrieval paths rather than requiring every term to match the same document. Each document is scored by its best match among the terms. Use them for synonyms, alternative phrasings, or several acceptable ways to find an answer.

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

A reranker adjusts the order of the candidate pool returned by vector search. It does not search additional documents or recover text that the retrieval stage did not select; raise `candidates` to give it more documents. See [Rerankers](https://docs.aivax.net/docs/rag/reranking.md) for selection guidance.

## Errors

| Status | Cause |
| --- | --- |
| `400 Bad Request` | Invalid field, unknown collection or document, [invalid filter](https://docs.aivax.net/docs/rag/document-filters.md#errors), a reranker combined with a sort other than score, or a cursor sent with a different request body. |
| `410 Gone` | The query cursor expired. Repeat the request without `cursor`. |
| `429 Too Many Requests` | The plan's search or reranking rate limit was exceeded. |

## Search quality

If search returns poor results:

1. Confirm that the documents are indexed.
2. Query the collection directly before testing through an AI Gateway.
3. Compare complete questions with alternative phrasings.
4. Check whether the relevant document is too short, too long, or not self-contained; see [Write good documents](https://docs.aivax.net/docs/rag/documents.md#write-good-documents).
5. Check whether the query language matches the document language.
6. If the gateway rewrites questions before searching, test with the plain query path to isolate rewriting issues.
7. Review low-scoring searches and query coverage in [RAG Observability](https://docs.aivax.net/docs/rag/observability.md).

To expose collections as tools for an external MCP client, see [Collections and RAG MCP](https://docs.aivax.net/docs/mcp-utilities/collections-mcp.md). For search pricing and rate limits, see [Collections](https://docs.aivax.net/docs/rag/collections.md#pricing-and-limits).
