---
{title: Setup Provider Routing,linkTitle: Setup routing,weight: 10,group: Routing}
---

# Setup provider routing

Some integrated models are available through more than one provider. Provider routing lets AIVAX choose among those providers without changing the model requested by your application. This differs from [model routing](/docs/inference/ai-gateways/concepts.md#model-routing), which can select a different model based on request complexity.

AIVAX considers providers that are currently available and compatible with the request. If only one provider is eligible, the routing preference does not change the result. Provider routing applies only to integrated AIVAX models; a bring-your-own-key gateway uses the provider endpoint configured in that gateway.

You can set routing in three places, from the most general to the most specific: the [AI Gateway](#configure-routing-in-an-ai-gateway), a suffix in the [model name](inline-routing.md), and the [request](#override-routing-per-request). Account privacy settings can further restrict the eligible providers; see [ZDR](zdr.md) and [Special providers](special-providers.md).

Available routing preferences are:

| Preference | Behavior |
|---|---|
| `Balanced` | Balances price, speed, and quality. This is the default. |
| `Cheapest` | Selects the provider with the lowest applicable input and output token price. |
| `Fastest` | Prioritizes the provider with the highest available throughput. |
| `Quality` | Selects the provider that AIVAX ranks highest for quality, without optimizing for price or speed. |
| `Special` | Works like `Balanced`, but also includes [special providers](special-providers.md) and gives them priority. |

## Configure routing in an AI Gateway

Use an AI Gateway when the same routing should apply to every request. In the gateway editor, select an integrated model, choose the strategy in **Routing preference**, list provider tags in order in **Allowed providers**, and save the gateway.

The equivalent gateway configuration uses `parameters.routingOption` and `parameters.allowedProviders`:

```json
{
    "name": "Cost-optimized assistant",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "YOUR_INTEGRATED_MODEL",
        "routingOption": "Cheapest",
        "allowedProviders": [ "azure-us", "azure-eu", "*" ]
    }
}
```

`allowedProviders` follows the same rules as `routing_options.allowed_providers` below. It defaults to `["*"]`, and an empty list is rejected when saving the gateway.

After saving, call the gateway normally by using its ID or slug as `model`. AIVAX applies the stored routing preference while preserving the gateway's instructions, tools, RAG configuration, and other settings. See [Using an AI Gateway](/docs/inference/ai-gateways/using-an-ai-gateway.md) for the complete gateway workflow.

## Override routing per request

Use `routing_options` to choose how providers are selected for one request. The override works with a direct integrated model or an AI Gateway that uses an integrated model:

```json
{
    "model": "YOUR_INTEGRATED_MODEL_OR_GATEWAY_ID",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this incident report."
        }
    ],
    "routing_options": {
        "preset": "Balanced",
        "allowed_providers": [
            "azure-us",
            "azure-eu",
            "*"
        ]
    }
}
```

| Field | Description |
|---|---|
| `preset` | Routing preference: `Balanced`, `Cheapest`, `Fastest`, `Quality`, or `Special`. When omitted, the gateway's saved `routingOption` is used. |
| `allowed_providers` | Ordered list of provider tags. AIVAX tries the first tag and moves to the next one only when no matching provider is available or compatible with the request. `"*"` matches any provider. When omitted, the gateway's saved `allowedProviders` is used, which defaults to `["*"]`. |

Within each step, `preset` chooses among the matching providers. Without `"*"` at the end, the request fails when none of the listed providers is available. An empty `allowed_providers` list is rejected. Tag matching is case-insensitive.

Each provider's tag is shown in the provider details of the dashboard **Models** page, where it can be copied, and returned as `tag` in the provider list of `GET /v1/models`. A tag identifies a provider endpoint, including its region or variant when one exists, such as `azure-us` or `azure-eu`.

`GET /v1/models` accepts an optional `filter` query parameter with a model name, such as `?filter=@openai/gpt-4o`. The response then contains only entries whose name equals it or is a dated snapshot of it (a trailing numeric suffix of at least four digits), ordered from the closest match, with the newest snapshot first. Without `filter`, the full list is returned. See [Deprecated models](#deprecated-models) for how to tell a current model from an old one.

The request values override the gateway's saved routing for that request only; they do not update the gateway. Because `routing_options` is an AIVAX extension, send it as an extra request-body field when using an OpenAI-compatible SDK.

The previous `routing_preset` field is deprecated but still accepted. Replace `"routing_preset": "Fastest"` with `"routing_options": { "preset": "Fastest" }`. When both are sent, `routing_options.preset` takes precedence.
## Provider in responses

Responses for integrated models include a `provider` field next to `model` with the tag of the provider that served the request. In streaming responses, every chunk includes it. The field is `null` for gateways that use your own provider credentials.

```json
{
    "object": "chat.completion.chunk",
    "model": "@openai/gpt-5-mini",
    "provider": "azure-us",
    "choices": [ ... ]
}
```

If a provider fails and AIVAX retries the request on another provider, `provider` reflects the provider that produced the response.

## Deprecated models

Use `_details.provider_model.is_deprecated` in `GET /v1/models` when you need to prefer a current integrated model. It is `true` when the model is flagged as deprecated, or when it has a release date more than 12 months before the current day. A model with no release date is not marked deprecated by age alone. The flag does not by itself remove the model from the list.
