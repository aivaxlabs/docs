Source: https://docs.aivax.net/docs/inference/structured-responses/concepts.html

# Structured responses concepts

AIVAX can produce structured JSON through two paths:

- `response_schema`: AIVAX validates the final model output against a JSON Schema and retries with validation feedback when the output is invalid. This is the JSON Healing path; [When an LLM returns invalid JSON](https://aivax.net/blog/structured-output-healing-boundary/) explains how truncation, refusals, and repair differ.
- `response_format`: AIVAX passes a native OpenAI-compatible response format to the provider, or applies healing when `healing_options` is present or automatic JSON Healing is enabled on the account.

Use structured responses when another system will consume the output and free-form text would be fragile.

## Choosing a mode

Use `response_schema` when AIVAX should own validation and repair. This is the safest mode for models that do not natively support structured output, for responses that use tools before producing JSON, and for systems that cannot tolerate malformed JSON.

Use `response_format` with `type: "json_schema"` when the provider model should handle the structured output natively. AIVAX will still use the schema internally, and healing is applied when `response_format.json_schema.healing_options` is provided or the account has automatic JSON Healing enabled.

Use `json_only: true` when the HTTP response body should contain only the final JSON. This removes the normal chat completion envelope, choices, usage, and generation metadata from the response body. See [JSON-only](https://docs.aivax.net/docs/inference/structured-responses/json-only.md).

| Page | Covers |
| --- | --- |
| [JSON Healing](https://docs.aivax.net/docs/inference/structured-responses/json-healing.md) | How validation and retries work, native structured output, supported schema features, and failures. |
| [Reasoning and tools](https://docs.aivax.net/docs/inference/structured-responses/reasoning-and-tools.md) | How reasoning models and tool calls combine with a schema. |
| [JSON-only](https://docs.aivax.net/docs/inference/structured-responses/json-only.md) | Returning the bare JSON body, with and without streaming. |

## Long-running structured requests

A structured request can take much longer than a plain one: the model may reason, call tools, and then make several healing attempts, each one a full generation. Without streaming, and always with `json_only`, the client receives nothing until the final JSON is ready, so the request can exceed the proxy timeout of `https://inference.aivax.net` and end with HTTP `524` while AIVAX is still working.

Send these requests to the direct inference host `https://direct.inference.aivax.net/v1` and set a client timeout that covers the expected time, including retries. The request body and the response are the same. See [Long-running inference](https://docs.aivax.net/docs/overview.md#long-running-inference).

For a troubleshooting checklist covering refusals, incomplete streams, and native enforcement versus healing, read [How to fix invalid JSON from an LLM API with structured outputs](https://aivax.net/blog/structured-output-healing-boundary/).
