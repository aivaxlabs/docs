Source: https://docs.aivax.net/docs/inference/batch/async-generations.html

# Async Generations

Async generations queue a single API request and run it in the background. Instead of keeping a connection open until the result is ready, you receive an ID, and then fetch the stored result later or let AIVAX notify your service when it is done.

Use async generations when one request is slow, when a caller cannot hold a connection open, or when many independent requests should run without client-side concurrency control. Use [Batch workflows](https://docs.aivax.net/docs/inference/batch/workflows.md) when the same instruction should be applied to a list of inputs with validation, retries, and export.

## Queue a request

Add `async` to the body of any [supported request](#supported-endpoints). The rest of the body is the same as the synchronous request.

```json
{
  "model": "@openai/gpt-6-luna#cheapest",
  "messages": [{ "role": "user", "content": "Summarize this report." }],
  "async": true
}
```

Nothing is generated while the request is open. AIVAX validates it, queues it, and returns HTTP `202`:

```json
{
  "message": "The generation was queued.",
  "data": {
    "async_generation": {
      "id": "<generation-id>",
      "status": "pending"
    }
  }
}
```

Keep the `id`: it identifies the item in the [management API](#manage-queued-generations).

### Options

Use the object form to tag the item, register webhooks, or change the timeout:

```json
{
  "async": {
    "enabled": true,
    "tags": ["nightly-report", "customer-42"],
    "webhooks": ["https://example.com/hooks/async-generations"],
    "timeout": 300
  }
}
```

| Field | Description |
| --- | --- |
| `enabled` | Set to `true` to queue the request. |
| `tags` | Up to 16 labels, each 1–64 characters. Use them to find items later. |
| `webhooks` | Up to 4 public HTTP or HTTPS URLs notified when the item is done. See [Webhooks](#webhooks). |
| `timeout` | Seconds allowed for each execution attempt, from 10 to 3,600. The default is 3,600. |

`"async": true` is the same as `{ "enabled": true }`. Tags can also be sent as a top-level `async_tags` array.

### Restrictions

- `async` cannot be combined with `stream: true`; the request fails with `400`.
- Queuing is not available with [public API keys](https://docs.aivax.net/docs/authentication.md#public-keys).
- An account can turn the feature off with the **Async generations** account parameter, which is on by default. While it is off, queuing requests fail with `403`, and items already queued wait until it is turned back on.
- Each plan limits how many items an account can queue per hour; above it, queuing returns `429`. See [Batch and Agentic Tests limits](https://docs.aivax.net/docs/pricing/plans-and-limits.md#batch-and-agentic-tests).
- A request body above 12 MB is rejected with `400`.

## Supported endpoints

The same `async` field works on these requests:

| Product | Endpoint |
| --- | --- |
| [Chat completions](https://docs.aivax.net/docs/inference/chat-completions/concepts.md#async-generation) | `POST /v1/chat/completions` |
| [Responses and Messages](https://docs.aivax.net/docs/inference/ai-gateways/using-sdks.md#async-generation) | `POST /v1/responses`, `POST /v1/messages` |
| [Semantic decisions](https://docs.aivax.net/docs/data-processing/decisions.md#async-generation) | `POST /api/v1/generations/decisions` |
| [Extraction](https://docs.aivax.net/docs/data-processing/extraction.md#async-generation) | `POST /api/v1/generations/extract` |
| [Summarization](https://docs.aivax.net/docs/data-processing/summarization.md#async-generation) | `POST /api/v1/generations/summarize` |
| [Translations](https://docs.aivax.net/docs/data-processing/translations.md#async-generation) | `POST /api/v1/generations/translate` |
| [Text segmentation](https://docs.aivax.net/docs/data-processing/text-segmentation.md#async-generation) | `POST /api/v1/generations/segment` |
| [Text classification](https://docs.aivax.net/docs/data-processing/classification.md#async-generation) | `POST /api/v1/generations/classify` |
| [Image generation](https://docs.aivax.net/docs/generations/images.md#async-generation) | `POST /api/v1/generations/images` |
| [Speech-to-text](https://docs.aivax.net/docs/generations/audio-transcriptions.md#async-generation) | `POST /api/v1/generations/audio/transcriptions` |
| [Text-to-speech](https://docs.aivax.net/docs/generations/speech.md#async-generation) | `POST /api/v1/generations/speech` |
| [Agentic Tests](https://docs.aivax.net/docs/inference/agentic-tests.md#async-generation) | `POST /api/v1/generations/agentic-tests` |
| [Rerankers](https://docs.aivax.net/docs/rag/reranking.md#async-generation) | `POST /api/v1/generations/rerank` |
| [Web Search](https://docs.aivax.net/docs/web-foundation/web-search.md#async-generation) | `POST /api/v1/web/search` |
| [Fetch and OCR](https://docs.aivax.net/docs/web-foundation/fetch-and-ocr.md#async-generation) | `POST /api/v1/web/fetch` |

## How an item runs

Queued items run in the background; do not rely on them finishing in the order they were queued.

When an item runs, AIVAX executes the original request exactly as sent: the same endpoint and the same body. The result is stored with the original HTTP status code, content type, and cost, so a failed generation is stored as a failed result rather than as a platform error.

An item moves through these statuses:

| Status | Meaning |
| --- | --- |
| `pending` | Queued and waiting to run. |
| `retrying` | A previous attempt failed with a retryable error and another attempt is scheduled. |
| `processing` | Running now. |
| `done` | Finished. The stored result may be a success or an error; check its status code. |
| `cancelled` | Cancelled by you. It will not run again. |

### Retries

Temporary failures are retried automatically. When the retries run out, the item finishes as `done` with the error status code of the last attempt.

Other outcomes are final:

- An attempt that exceeds its `timeout` is stored with status `408` and is not retried.
- A response larger than 12 MB is not stored; the item finishes with status `507`.
- When the API key that queued the item was deleted or expired before the item ran, the item finishes with status `401`.

### Retention

Items are deleted automatically:

| Item | Deleted |
| --- | --- |
| `pending` or `retrying` | 15 days after creation. |
| `cancelled` | 1 hour after cancellation. |
| `done` | 90 days after completion. |

Fetch and store the results you need before they expire.

An item keeps its request and response for the periods above, even when conversation logging is turned off for the account. Delete items you no longer need with the [management API](#manage-queued-generations).

## Webhooks

When an item reaches `done`, AIVAX sends a `POST` request with a JSON body to each URL in `webhooks`:

```json
{
  "id": "<generation-id>",
  "status": "done"
}
```

The notification carries no result and no outcome, so `done` also covers a stored error. Use the `id` to [fetch the result](#manage-queued-generations) with your API key, and check its status code.

Webhook URLs must be public HTTP or HTTPS URLs. When the account has a hook key, each request includes `X-Request-Nonce`; verify it as described in [Hook authentication](https://docs.aivax.net/docs/authentication.md#hook-authentication) before trusting the notification.

Delivery is not retried. If your service can be unavailable, also poll the [list endpoint](#manage-queued-generations) for `done` items.

For a Python example that collects results by tag, re-queues only the failures, and verifies the webhook nonce, see [Async LLM API: queue the request, get an ID, fetch the result later](https://aivax.net/blog/async-llm-api-queue-request-fetch-result-later/).

## Manage queued generations

Authenticate management requests with an AIVAX API key. All routes are under `/api/v1/async-generations`.

| Request | Description |
| --- | --- |
| `GET /api/v1/async-generations` | Lists items as summaries, without request or response bodies. Filter with `status`, `tags` (comma-separated; an item must have all of them), `limit` (default 50, maximum 100), and `offset`. |
| `GET /api/v1/async-generations/<id>` | Returns the item with its request and response. JSON bodies are embedded as JSON; other content is returned as base64. |
| `GET /api/v1/async-generations/<id>/response` | Returns the stored response as it was produced, with its original status code and content type. Use it to consume the result as if the request had been synchronous. Returns `404` until the item has a stored response. |
| `PUT /api/v1/async-generations/<id>/cancel` | Cancels an item that is `pending`, `retrying`, or `done` with an error status code. Any other item returns `409`. |
| `PUT /api/v1/async-generations/cancel?scope=<scope>` | Cancels in bulk. `scope` is `pending`, `failed`, or `all`. |
| `DELETE /api/v1/async-generations/<id>` | Deletes an item. Returns `409` while it is `processing`. |

For example, to list the finished items tagged for a nightly job:

```text
GET /api/v1/async-generations?status=done&tags=nightly-report&limit=100
```

## Pricing

A queued request costs the same as the equivalent synchronous request, and its cost is stored with the result.

## Reduce cost

Queued work rarely needs the fastest provider, so async generations use the `Cheapest` [routing preference](https://docs.aivax.net/docs/inference/routing/setup-routing.md) by default. `Cheapest` can select [special providers](https://docs.aivax.net/docs/inference/routing/special-providers.md), which are not zero data retention providers. To favor speed or quality for a queued item, set the preference explicitly with `routing_options.preset` or a [model name suffix](https://docs.aivax.net/docs/inference/routing/inline-routing.md):

```json
{
  "model": "@openai/gpt-6-luna",
  "routing_options": { "preset": "Fastest" },
  "messages": [{ "role": "user", "content": "Classify this ticket." }],
  "async": { "enabled": true, "tags": ["triage"] }
}
```
