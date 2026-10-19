---
{title: Collections,linkTitle: Collections,weight: 10,group: RAG and collections,aliases: [/docs/platform/rag-collections.html]}
---

# Collections

AIVAX provides a RAG (Retrieval-Augmented Generation) service for storing knowledge and retrieving it later through semantic search. A collection is an account-owned knowledge base: it groups the [documents](documents.md) that belong together and is the unit you search, attach to an AI Gateway, and maintain.

Compare vector storage with the surrounding ingestion and retrieval pipeline in [RAG vs vector database](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/).

## When to create a collection

Use collections to separate knowledge that belongs to different knowledge bases, products, tenants, languages, or operational purposes. For example, a support collection can hold help-center answers, a legal collection can hold contract clauses, and a product collection can hold descriptions, policies, and troubleshooting notes.

Prefer several focused collections over one large collection when the content is searched by different audiences or applications. A search can include several collections at once, while a collection boundary keeps unrelated content out of results, simplifies maintenance, and keeps [advanced filters](document-filters.md) fast.

## What a collection contains

Each collection has:

- A unique collection ID.
- A name.
- Optional context and contextual tags.
- A set of documents and their indexing state.
- Usage statistics based on the searches performed on it.

The **collection context** describes the knowledge base to an AI Gateway when the collection is used for RAG, for example the audience, scope, and how the content should be used. Keep it durable and collection-wide; source-specific import guidance belongs in the import itself.

## Use a collection

After adding and indexing documents, you can:

- Search it directly with [Search](semantic-search.md), optionally narrowed with [advanced filters](document-filters.md) and reordered with a [reranker](reranking.md).
- Attach it to an [AI Gateway](../inference/ai-gateway.md) so retrieved documents are placed into the model context automatically.
- Expose it to MCP clients through the [Collections and RAG MCP](../mcp-utilities/collections-mcp.md).
- Monitor its retrieval quality and search history in the Console; see [RAG Observability](observability.md).

## Maintain a collection

Collection settings in the Console also provide maintenance actions:

- **Update outdated documents** regenerates vectors for documents indexed with an embedding model that differs from the collection's current model. Regenerating vectors incurs document-embedding charges.
- **Reset collection** removes the collection's documents while keeping the collection itself.
- **Delete collection** removes the collection and its documents.

Reset and delete cannot be undone. Export the collection as JSONL through the API first when you may need its documents again.

## De-duplicator

The collection de-duplicator removes repeated documents from a collection. Use it after merging several sources, re-importing content under new document names, or generating documents with [Media Injector](documents.md#import-from-files-with-media-injector), when the same knowledge may exist more than once and crowd search results with near-identical matches.

Start it from the collection settings in the Console, under **Advanced settings > De-duplicate collection**, or through the API. Choose how aggressive the comparison should be:

| Level | Behavior |
| --- | --- |
| Low | Removes only exact duplicates and near-identical semantic documents. |
| Medium | Recommended default. Balances recall and safety. |
| High | More aggressive semantic matching; can remove documents that are only very similar. |

The de-duplicator runs in two passes. It first removes documents whose text is exactly the same, then compares indexed documents with their closest neighbors in the collection and removes those above the selected similarity level. One document of each duplicate group is kept. Documents still waiting for indexing are only compared in the exact pass, so wait for indexing to finish before running it.

Before starting, the Console shows an estimate of the processing units and cost for the current number of documents. The task runs in the background, and only one de-duplication can run per collection at a time. When it finishes or fails, the account receives a notification.

Removed documents are deleted, not hidden. Before deleting them, AIVAX backs them up as JSONL files with their name, text, reference, and tags, and the completion notification links to these backups. Metadata is not included in the backup, so export the collection first when document metadata matters.

The de-duplicator is billed by processing time: one processing unit (PU) per second of processing, with a minimum of one PU per task. The plan multiplier applies.

<script src="https://inference.aivax.net/apidocs?embed-target=Estimate%20Collection%20De-duplication&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=Start%20Collection%20De-duplication&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Manage collections through the API

Collections can be created, listed, inspected, edited, reset, exported, and deleted through the API. See the [API reference](https://inference.aivax.net/apidocs) for the Collections endpoints.

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Collection&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Pricing and limits

Indexing and search are billed by token usage. Generated RAG answers are charged separately from query embedding, and their price varies with the summarization model. The plan multiplier applies.

| Description | Pricing |
| --- | ---: |
| Collection text embedding | **$0.10/M tokens** |
| Search - query cache miss | **$0.10/M tokens** |
| Search - query cache hit | Zero |
| RAG answer generation | **~$0.50/M tokens**, excluding query rates |
| Collection de-duplication | **$0.05/1k PUs** |

Free, Pro, and Max include a daily embedding allowance shared by searches and document insertions; see [Included daily subscription allowances](../limits.md#included-daily-subscription-allowances). Accounts with [Data Sharing](../data-sharing.md) enabled receive a discount on eligible query embeddings. Reranking and [Reflex](reflex.md#pricing-and-limits) are billed separately.

| Limit | Free | Pro | Max |
| --- | --- | --- | --- |
| Collections | 5 | — | — |
| Searches | 20/min | 500/min | 3,000/min |
| Reranking searches | 30/min | 1,000/min | — |

An em dash (`—`) means the plan does not impose a limit. Requests above a limit return `429 Too Many Requests`. Document insertion and import limits are listed in [Documents](documents.md#pricing-and-limits).
