# Text Classification

Use text classification to rank a fixed set of labels for one or more documents without training a custom classifier. AIVAX embeds every document and label with the default embedding model, compares their vectors using cosine similarity, and returns every label from the most similar to the least similar for each document.

Before calling this endpoint, [create an API key](../authentication.md) and make sure the account has a positive balance.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/classify</span>
</div>

## Request behavior

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `documents` | `string[]` | Yes | One or more non-empty documents to classify. Results preserve this order and each document's zero-based index. |
| `labels` | `string[]` | Yes | One or more non-empty labels. Every label is scored for every document. |

Duplicate documents and labels are preserved. The endpoint always uses the current default embedding model and does not accept a model parameter, score threshold, or result limit.

Example request:

```json
{
  "documents": [
    "Calculate the compound interest on a principal of $10,000 invested for 5 years at an annual rate of 5%, compounded quarterly",
    "Erklären Sie die Unterschiede zwischen Merge-Sort und Quicksort-Algorithmen in Bezug auf Zeitkomplexität, Platzkomplexität und Leistung in der Praxis.",
    "Write a poem about the beauty of nature and its healing power on the human soul"
  ],
  "labels": [
    "Creative writing",
    "Complex problem",
    "Simple task"
  ]
}
```

## Read the response

`results` contains one item for each input document. Each `scores` array contains every supplied label, ordered by descending cosine similarity. Labels with equal scores preserve their original order.

```json
{
  "results": [
    {
      "index": 0,
      "document": "Calculate the compound interest on a principal of $10,000 invested for 5 years at an annual rate of 5%, compounded quarterly",
      "scores": [
        {
          "label": "Complex problem",
          "score": 0.98828
        },
        {
          "label": "Simple task",
          "score": 0.45272
        },
        {
          "label": "Creative writing",
          "score": 0.06823
        }
      ]
    }
  ]
}
```

A score measures vector similarity, not a calibrated probability. Compare scores within the same request and embedding model rather than interpreting a value as a percentage confidence. Negative scores are valid and remain in the response because the endpoint does not filter labels.

Embedding usage is billed for text that requires inference and is associated with the authenticated API key. Repeated text may be served from an internal cache, reducing latency and costs. Because the endpoint returns every document-label pair, response size and comparison work grow with `documents × labels`.

The embedded API reference contains the server-maintained request, response, authentication, and error details:

<script src="https://inference.aivax.net/apidocs?embed-target=Classify%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
