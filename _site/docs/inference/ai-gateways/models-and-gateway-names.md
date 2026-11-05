Source: https://docs.aivax.net/docs/inference/ai-gateways/models-and-gateway-names.html

# Models and gateway names

The `model` field of `/v1/chat/completions` selects what runs the request. It accepts three kinds of value:

| Value | Example | Runs |
| --- | --- | --- |
| Integrated model name | `@openai/gpt-5-mini` | The model directly, with no gateway configuration. |
| Gateway full ID | `<GATEWAY_UUID>` | The AI Gateway with that ID. |
| Gateway slug | `support:50c3` | The AI Gateway whose slug matches, in the format `name:final-id`. |

Integrated model names start with `@` and follow `@creator/model-name`. List them with `GET /v1/models`; the same list includes the gateways of your account.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Model%20listing)

Public API keys accept only a gateway's full ID. Slugs and integrated model names are rejected; see [Authentication](https://docs.aivax.net/docs/authentication.md).

An integrated model name can carry a provider routing suffix, such as `@openai/gpt-6-luna#cheapest`. See [Inline routing](https://docs.aivax.net/docs/inference/routing/inline-routing.md).

## Choose a model for a gateway

Validate three points before putting a model into production:

- The model supports the input modalities you intend to send, such as image, audio, video, or file. Otherwise, enable [multimodal pre-processing](https://docs.aivax.net/docs/inference/chat-completions/multimodal-pre-processing.md).
- The model supports function calling if the gateway uses tools, `QueryFunction` RAG, MCP, protocol functions, skills, or built-in tools.
- The model accepts the parameters you configure. Some integrated models reject assistant prefill, temperature, stop sequences, or reasoning effort.

## Replace a model

A gateway lets you change the model behind a stable name, so client applications do not change when a model is retired. You still need to qualify the replacement with your own prompts and tools before switching. To tell a current model from an old one, see [Deprecated models](https://docs.aivax.net/docs/inference/routing/setup-routing.md#deprecated-models).

See [pinning a model ID versus using an alias](https://aivax.net/blog/pin-llm-model-id-or-use-alias-model-deprecations/) for a replacement checklist. For the GPT-4o and GPT-4.1 shutdown on January 14, 2027, see [how to migrate to gpt-6-luna](https://aivax.net/blog/migrate-gpt-4o-and-gpt-4-1-to-gpt-6-luna/). For the GPT-5 and o3 shutdown on December 11, 2026, see [how to migrate to GPT-5.6 Sol, Terra and Luna](https://aivax.net/blog/migrate-gpt-5-and-o3-to-gpt-5-6-before-december-11/).
