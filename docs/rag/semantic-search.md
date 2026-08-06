# Semantic Search

The semantic search API searches one or more collections and returns the most relevant indexed documents for the supplied search terms.

If your application already owns the candidate document strings, consider [Reflex](reflex.md): a fast, collection-less RAG search that ranks supplied documents without indexing or storage. Reflex is especially useful for dynamic or request-specific candidate sets and can reuse cached query and document processing. Use managed semantic search when AIVAX should store and search a persistent corpus or when the corpus is too large to submit with every request.

Search is performed in stages:

1. Each query term is embedded in query mode.
2. Documents are embedded in retrieval mode during indexing.
3. The search prefilters candidates with compact embedding hashes.
4. Candidate documents are scored with embedding similarity.
5. Candidates below `minScore` are removed after embedding similarity is calculated.
6. The configured reranker can adjust the remaining order before the final `top` limit is applied.

After creating a collection, use its collection ID in the `collections` array when searching.

> [!WARNING]
> Semantic search incurs cost. Query embedding cost is based on the search term tokens. Provider rerankers can add token- or search-unit-based cost for the candidates they process.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Request Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `collections` | `string[]` | Required | Collection IDs to search. Each collection must belong to the authenticated account. |
| `term` | `string` | Required if `terms` is absent | One search term. |
| `terms` | `string[]` | Required if `term` is absent | One or more search terms. |
| `top` | `number` | `5` | Maximum number of documents returned. Current validation allows 1 to 128. |
| `minScore` | `number` | `0.2` | Minimum embedding-similarity score before reranking. Current validation allows values from 0.01 to 0.99. |
| `reranker` | `string` | `@aivax/reflex-v1` | A canonical `@provider/name`, `lexical`, `rrf`, or `none`. The compatibility alias `smart` also selects Reflex. |
| `includeReferences` | `boolean` | `false` | Includes related documents with the same reference ID when a matched document has a reference. |

The response includes the matched document ID, collection ID, document name, document content, metadata, score, and referenced documents when reference expansion is enabled.

## Reranking

AIVAX applies the selected reranker after vector candidates are found. The default is `@aivax/reflex-v1`; the legacy `smart` alias resolves to the same model. Send `"reranker": "none"` to preserve vector-similarity order, `lexical` for local word-aware reranking, or `rrf` to fuse vector and lexical rank positions.

Provider models use deterministic `@provider/name` identifiers. Read the live `/api/v1/information/rerankers-models.json` catalog for the available models, prices, autonomous-use capability, and technical limits. See [Rerankers](reranking.md) for the current model list and selection guidance.

All non-`none` rerankers share the account's [reranking-search limit](/docs/limits#plan-limits).

> [!NOTE]
> Reranking does not search additional documents. It only reorders candidates already found by the vector search stage.

## Multiple Terms

Multiple terms work as a ranked union by best match, not as a mandatory intersection.

Each document is compared against all supplied terms. The document score uses the best match among those terms. A document can rank well by matching one term strongly, even if it does not match the other terms.

Example:

Searching for:

```text
cancelamento
multa
reembolso
```

in the `suporte` and `contratos` collections means:

```text
best support or contract documents that match cancelamento or multa or reembolso
```

It does not mean:

```text
documents that match cancelamento and multa and reembolso at the same time
```

It also does not mean:

```text
documents that exist in both support and contracts
```

If the user intent is one composite idea, send that idea as one term:

```text
cancelamento de assinatura anual sem multa
```

Use multiple terms when you want to cover synonyms, alternative phrasings, or several acceptable retrieval paths.

## Search Quality

A complete query usually performs better than a list of disconnected keywords because it preserves the relationship between concepts.

Prefer:

```text
como cancelar assinatura anual sem multa
```

Over:

```text
cancelamento
assinatura
multa
```

Tune `top` and `minScore` together:

- Lower `minScore` values return more candidates and more noise.
- Higher `minScore` values reduce noise but may return few or no results.
- Higher `top` values are useful when the answer must compare several policies, procedures, or source excerpts.
- Lower `top` values are better for direct FAQ-style answers.

If search returns poor results:

1. Confirm that the documents are indexed.
2. Query the collection directly before testing through an AI Gateway.
3. Compare short queries, complete questions, and alternative phrasings.
4. Check whether the relevant document is too short, too long, or not self-contained.
5. Check whether the query language matches the document language.
6. If the gateway rewrites questions before searching, test with the plain query path to isolate rewriting issues.

## Collections MCP

To expose AIVAX collections as tools for an external MCP client, see [Collections MCP](/docs/mcp-utilities/collections-mcp).
