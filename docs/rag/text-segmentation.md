# Text Segmentation

Text segmentation is a companion to embedding. It divides source documents into semantically cohesive strings that can be embedded or indexed in a RAG collection. The endpoint does not create embeddings or store the submitted documents.

## Segment documents

Authenticate with a private AIVAX API key.

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/segment</span>
</div>

The request accepts:

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `documents` | `string[]` | Yes | Document strings to segment. Each item is processed independently. |
| `sanitize` | `boolean` | No | Defaults to `false`, which keeps the entire document in the returned segments. When `true`, content judged irrelevant to RAG retrieval may be omitted. |

Example request:

```json
{
  "documents": [
    "AIVAX indexes documents with embeddings.\nSemantic search retrieves the most relevant passages.\nReranking can refine their order."
  ],
  "sanitize": false
}
```

Before segmentation, line endings are normalized, surrounding whitespace is removed from each line, and empty lines are discarded. Segments preserve the remaining source text and line order.

## Read the response

The standard response envelope contains one result for each submitted document:

```json
{
  "message": null,
  "data": {
    "result": [
      {
        "index": 0,
        "count": 2,
        "segments": [
          "AIVAX indexes documents with embeddings.\nSemantic search retrieves the most relevant passages.",
          "Reranking can refine their order."
        ]
      }
    ],
    "usage": {
      "total_tokens": 62,
      "cost": 0.00002325
    }
  }
}
```

| Field | Meaning |
| --- | --- |
| `data.result[].index` | Zero-based position of the source document in `documents`. Use this field to associate results with inputs; array order is not guaranteed. |
| `data.result[].count` | Number of segments returned for the source document. |
| `data.result[].segments` | Semantically cohesive text segments in source order. |
| `data.usage.total_tokens` | Total input and output tokens measured across all submitted documents. |
| `data.usage.cost` | Final cost recorded for the authenticated account. |

The endpoint returns `400 Bad Request` for malformed payloads, `401 Unauthorized` for a missing or invalid API key, `403 Forbidden` for public API keys, and `429 Too Many Requests` when the account quota is exceeded.

<script src="https://inference.aivax.net/apidocs?embed-target=Segment%20text&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
