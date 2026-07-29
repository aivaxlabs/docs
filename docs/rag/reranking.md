# Rerankers

Rerankers reorder an existing set of candidate documents for a query. They do not search a collection or recover text that is absent from the input. Use the autonomous reranking endpoint when your application already owns the candidates, or use [Semantic Search](semantic-search.md) to retrieve candidates from an AIVAX collection before reranking them.

## Rerank documents directly

Authenticate this request with an AIVAX API key as described in [Authentication](../authentication.md). The endpoint accepts document strings directly, so you do not need to create a RAG collection first.

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/rerank</span>
</div>

The request accepts:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `model` | `string` | No | Deterministic `@provider/name` identifier. Defaults to `@aivax/reflex-v1`. |
| `query` | `string` | Yes | Non-empty text used to evaluate relevance. |
| `documents` | `string[]` | Yes | One or more candidate document strings. The selected model's `maxDocuments` limit applies when declared. |
| `top_n` | `number` | No | Number of ranked documents returned. Defaults to five or the document count when fewer than five are supplied. |
| `min_score` | `number` | No | Minimum final relevance score from `0` through `1`. Defaults to `0`. |

Only entries with `autonomousUse: true` can be used here. `rrf` depends on ranks produced during RAG retrieval, and `none` disables reranking, so neither is accepted by this endpoint. The legacy `/api/v1/generations/reflex/rerank` route remains an alias; use the generic route for new integrations.

Example request:

```json
{
  "model": "@qwen/qwen3-reranker-0.6b",
  "query": "How do I cancel an annual subscription?",
  "documents": [
    "Annual subscriptions can be cancelled from Billing settings.",
    "Invoices are generated on the first day of each month."
  ],
  "top_n": 2,
  "min_score": 0.2
}
```

## Read the response

The service applies `min_score`, returns at most `top_n` results, and preserves each document's original zero-based `index`.

Example response:

```json
{
  "id": "req_sgoj6yeyux78bqnbza6f8wi6iy",
  "model": "@qwen/qwen3-reranker-0.6b",
  "results": [
    {
      "index": 0,
      "relevance_score": 0.979416906833649,
      "document": {
        "text": "Annual subscriptions can be cancelled from Billing settings."
      }
    }
  ],
  "usage": {
    "input_tokens": 263,
    "total_tokens": 263,
    "request_id": "RDhp9HavIRUisZ4vToHfTtJZ",
    "cost": 0.0000027615
  }
}
```

Only one document appears because the other candidate did not meet the example's `min_score`.

`usage` is normalized by AIVAX, so its fields depend on how the selected model measures consumption:

| Field | When it appears | Meaning |
| --- | --- | --- |
| `input_tokens` | Token-based models | Input tokens reported for the execution or inferred when the model does not report them. |
| `cached_input_tokens` | Reflex | Input tokens served from the account-scoped cache. |
| `total_tokens` | When token usage is available | Total measured input tokens. For Reflex, this equals `input_tokens + cached_input_tokens`. |
| `search_units` | Search-unit models | Search units consumed by the request. |
| `estimated` | When AIVAX had to infer token usage | `true` means the token count was not reported directly. |
| `request_id` | When available | Execution identifier useful when investigating a specific request. |
| `cost` | Always | Final cost recorded against the AIVAX account, after applicable account adjustments. |

For search-unit models, the billing base comes from the exact request cost reported for that execution rather than an inferred token calculation. Costs used internally to calculate the charge are not copied into the public response as additional `cost` fields.

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Read the live model catalog

Use the live catalog instead of hardcoding model names, prices, capabilities, or limits:

<div class="request-item get">
    <span>GET</span>
    <span>/api/v1/information/rerankers-models.json</span>
</div>

Each item provides `name`, `description`, `pricingDescription`, `autonomousUse`, `technicalInformation.contextSize`, `technicalInformation.maxDocuments`, and `isDefault`.

`contextSize` is the declared maximum token context, while `maxDocuments` is the maximum document count enforced by the public endpoint. A `null` value means that the catalog does not declare that limit.

The current catalog includes:

| Name | Autonomous | Declared limits | Pricing |
| --- | --- | --- | --- |
| `@aivax/reflex-v1` | Yes | 1,948-token context; 10,000 documents | `$0.015/mtokens` cache miss; `$0.003/mtokens` cache hit |
| `@jina/reranker-v3` | Yes | 131,072-token context | `$0.05/mtokens` |
| `@qwen/qwen3-reranker-0.6b` | Yes | 32,768-token context; 1,024 documents | `$0.01/mtokens` |
| `@qwen/qwen3-reranker-4b` | Yes | 32,768-token context; 1,024 documents | `$0.025/mtokens` |
| `@qwen/qwen3-reranker-8b` | Yes | 32,768-token context; 1,024 documents | `$0.05/mtokens` |
| `@nvidia/llama-nemotron-rerank-vl-1b-v2` | Yes | 10,240-token context; 1,024 documents | `$0.01/mtokens` |
| `@cohere/rerank-4-pro` | Yes | 32,768-token context; 10,000 documents | `$0.0025/search unit` |
| `@cohere/rerank-4-fast` | Yes | 32,768-token context; 10,000 documents | `$0.002/search unit` |
| `@cohere/rerank-3.5` | Yes | 4,096-token context; 10,000 documents | `$0.001/search unit` |
| `lexical` | Yes | No catalog limit | No cost |
| `rrf` | No | RAG only | No cost |
| `none` | No | RAG only | No cost |

`smart` remains an accepted compatibility alias for `@aivax/reflex-v1`, but it is not a separate catalog model. Prefer canonical model names in stored configuration and new integrations.

## Choosing a reranker

Start with Reflex when you want the default model, low latency, and reusable query/document processing. Choose another model when its language coverage, context window, quality, latency, or billing unit better matches the workload. Use `lexical` for local, no-cost word-aware reranking. Use `rrf` only after RAG retrieval when you want to fuse vector and lexical rank positions.

Reranking improves order only among the candidates supplied to it. If the relevant document is missing, improve candidate retrieval, chunking, query formulation, or `min_score` before comparing rerankers.

## Limits and failures

The endpoint returns `400 Bad Request` for unknown or non-autonomous models, invalid `top_n` or `min_score`, empty input, or a document count above the model's declared limit. Reflex returns at most 200 results even though it accepts up to 10,000 documents.

All non-`none` reranking operations share the account's reranking request quota. Reflex also has a token-rate quota. Exceeding either quota returns `429 Too Many Requests`; see [Plans and Limits](../limits.md). Capacity and execution failures use generic reranking-service messages and do not identify internal infrastructure.
