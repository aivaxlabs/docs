---
{title: Troubleshooting Inference,linkTitle: Troubleshooting,weight: 150,group: Inference}
---

# Troubleshooting inference

AIVAX uses two response styles:

- OpenAI-compatible endpoints return an OpenAI-style `error` object.
- Account and administrative endpoints return an AIVAX response envelope with an error or a successful `data` value.

| Status | What to check |
| --- | --- |
| `400 Bad Request` | Confirm the model or gateway identifier and remove unsupported parameters from the request. A malformed resource identifier in the path is an invalid request, not a server error. |
| `401 Unauthorized` | Confirm that the private key is present, complete, active, and sent through the SDK configuration. |
| `402 Payment Required` | Review [Pricing](/docs/pricing.md) and confirm that the account is ready for a billable request. |
| `403 Forbidden` | Confirm that the key type, model, or selected resource allows this operation. |
| `429 Too Many Requests` | Retry later and review [Plans and limits](/docs/limits.md) before increasing request volume. |
| `500 Internal Server Error` | An unexpected AIVAX failure occurred. Retry later; the response does not include internal details. |
| `503 Service Unavailable` | A service AIVAX depends on is temporarily unavailable. Retry after the interval in the `Retry-After` header. |
| `524` or proxy timeout | The request took longer than the proxy allows while AIVAX was still processing it. Send it to the [direct inference host](/docs/overview.md#long-running-inference) with a longer client timeout. |

If the request still fails, verify in this order:

1. `base_url` is `https://inference.aivax.net/v1`.
2. The API key is available to your process and is a private key.
3. The selected model or gateway exists and is available to the account.
4. For a gateway, test a plain prompt before adding RAG, tools, media, or structured output so you can isolate configuration problems.

## Errors during streaming

After a stream starts, the HTTP status is already `200`. A failure is reported as a final chunk with `finish_reason: "error"` and an `error` object with `code` and `message`, followed by `[DONE]`. Check for this chunk instead of relying on the status code; see [Streaming](streaming.md#errors-during-a-stream).

For integrated models, provider error details are not returned; the message says that the provider is unavailable. For gateways that use your own provider key, the provider's error message is returned as is.

## Common problems

| Symptom | What to check |
| --- | --- |
| The model ignores an image, audio, or file. | The model may not support that modality, or the gateway has `DisableMultiModalInput`. See [Input and multimodality](input-and-multimodality.md#when-a-multimodal-request-fails). |
| `Failed to generate a valid JSON response.` | JSON Healing reached its attempt limit. Simplify the schema or the instructions before raising `max_attempts`; see [JSON Healing](/docs/inference/structured-responses/json-healing.md). |
| The model repeats tool calls from earlier turns. | The request does not reuse the same `conversation_token`, or the state expired. See [Session reuse](session-reuse.md). |
| `The 'X' parameter is not allowed with public API keys.` | Public keys accept a reduced set of fields. See [Limits](limits.md#public-api-keys). |
| A conversation suddenly fails with a message-size error. | The conversation exceeded the gateway context limit or the Free plan cap. See [Limits](limits.md#context-window). |
| A routed request fails although the model exists. | No eligible provider remains after routing, ZDR, or special-provider rules. See [Setup routing](/docs/inference/routing/setup-routing.md). |
