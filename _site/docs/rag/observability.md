Source: https://docs.aivax.net/docs/rag/observability.html

# RAG Observability

The [AIVAX Console](https://console.aivax.net) shows how your collections are indexed, which searches they receive, and how well those searches score. Use it to confirm that an import finished, find questions your knowledge base answers poorly, and spot content that is never retrieved.

## Collections overview

Open **RAG Collections** in the Console sidebar. Each collection shows its **Current state** as a bar with three parts:

| State | Meaning |
| --- | --- |
| Indexed | Documents that are searchable with the collection's current embedding model. |
| Queued | Documents waiting for indexing. They are not searchable yet. |
| Outdated | Documents indexed with a different embedding model than the collection's current one. They remain searchable, but their vectors may be less accurate. |

A large Queued share after an import is normal and decreases as indexing proceeds. If Outdated documents remain, use **Update outdated documents** in the collection settings to regenerate their vectors; see [Maintain a collection](https://docs.aivax.net/docs/rag/collections.md#maintain-a-collection).

## Collection health

Select **View** on a collection to open its **Browse documents** tab. The cards at the top summarize the collection:

| Card | What it tells you |
| --- | --- |
| Total documents | All documents in the collection, queued and indexed. |
| Query coverage | Percentage of documents that appeared in at least one search result among the recorded searches. A low value means much of the content is never retrieved. |
| Avg. Performance | Average processing time of a search, in milliseconds. |
| Avg. Score | Average score of the returned results, from 0 to 1. Higher is better. |

Low query coverage is not always a problem: a broad knowledge base can contain content that users rarely ask about. It deserves attention when documents you expect to be used never appear, which often points to documents that are too long, mixed-topic, or written differently from how users ask.

The document list below the cards shows each document's state, tags, reference, and token count, and can be filtered by state. Open **Details** on a document to see its timestamps, including when it was last indexed, and its character, word, and approximate token counts. The document editor warns when a document has too many or too few words for reliable retrieval; see [Write good documents](https://docs.aivax.net/docs/rag/documents.md#write-good-documents).

## Search history

The **Transactions** tab lists the searches performed on the collection, including searches made by AI Gateways, MCP clients, and your applications. Searches are kept for 2 hours on Free, 7 days on Pro, and 30 days on Max.

Use the **View** selector to choose what to review:

- **Recent** shows the newest searches.
- **Low quality** shows the lowest-scoring searches. Start here to find questions the collection answers poorly.
- **High quality** shows the highest-scoring searches.

Each search shows its moment, query, number of results, and three scores:

| Score | Meaning |
| --- | --- |
| Original score | Vector similarity between the query and the documents, before reranking. |
| Reranker score | Score assigned by the reranker, with the reranker name. A dash means no reranker was used. |
| Final score | Score used to rank the results. |

Open **Details** on a search to see its processing time, cost, scores, and the documents it returned, each with its original, reranker, and final score and a preview of the text. A document that was later deleted is shown as no longer existing.

### Diagnose a low-quality search

1. Read the query and compare it with the returned documents. If the right document is absent, the problem is retrieval, not ranking.
2. If the right document exists but scored low, check whether its text uses the same terms and language as the query, and whether it mixes several topics.
3. If the original score is good but the final score drops, compare rerankers; see [Rerankers](https://docs.aivax.net/docs/rag/reranking.md).
4. If no document covers the question, add the missing knowledge to the collection.

## Test searches in the playground

Select **Playground** on a collection to run a search without writing code. Set the search text, minimum score, maximum results, reranker, reference expansion, and [advanced filters](https://docs.aivax.net/docs/rag/document-filters.md), then select **Run query**. The **Visual** tab shows the ranked documents with their scores, contents, and metadata, and the generated answer when you use answer generation; the **JSON** tab shows the raw result.

Use the playground to reproduce a low-quality search from the history, adjust options, and confirm an improvement before changing an AI Gateway. For processing time, cost, and per-stage scores, use the search details in **Transactions**.

## Media Injector jobs

Files imported with [Media Injector](https://docs.aivax.net/docs/rag/documents.md#import-from-files-with-media-injector) are processed as background jobs. Follow them under **Batch > Media Processing**, which refreshes automatically and shows each job's collection, files, state, elapsed time, number of documents produced, current cost, and estimated cost. Cancel queued or processing jobs, and retry or delete failed or cancelled ones.

After a job completes, its documents appear in the collection as Queued until they are indexed.

## Cost and storage

- **Analytics > Usage per resource** groups usage by resource, including each collection, and links to it.
- **Analytics > Monthly Reports** shows the month's RAG cost, which includes embeddings, queries, and reranking.
- **Usage and limits** shows storage used against your plan quota.

De-duplication runs report their result through account notifications; see [De-duplicator](https://docs.aivax.net/docs/rag/collections.md#de-duplicator).
