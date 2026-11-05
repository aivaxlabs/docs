---
{title: Inline Routing,linkTitle: Inline routing,weight: 20,group: Routing}
---

# Inline routing in the model name

An integrated model name accepts a routing suffix after `#`. Use it when your client can only change the `model` string, such as an OpenAI-compatible tool or SDK that does not send extra body fields:

| Model name | Effect |
|---|---|
| `@openai/gpt-6-luna#cheapest` | Uses the `Cheapest` preference. Any [routing preference](setup-routing.md) works, case-insensitive. |
| `@openai/gpt-6-luna#azure-us` | Uses only the provider with the `azure-us` tag, like `"allowed_providers": [ "azure-us" ]`. |

A suffix that matches a preference name is read as a preference; any other value is read as a provider tag. A provider tag has no `"*"` fallback, so the request fails when that provider is not available. Only one suffix is supported per name.

```json
{
    "model": "@openai/gpt-6-luna#fastest",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this incident report."
        }
    ]
}
```

The suffix also works in the model name saved in an AI Gateway and in the model names of the complexity router, so each routed model can have its own routing:

```json
{
    "name": "Cost-optimized assistant",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "@openai/gpt-6-luna#cheapest"
    }
}
```

The suffix is resolved at runtime, on every request. It takes precedence over the gateway's saved `routingOption` and `allowedProviders`, but `routing_options` in `chat/completions` stays the final override. For example, `"model": "@openai/gpt-6-luna#cheapest"` with `"routing_options": { "preset": "Quality" }` uses `Quality`. The `model` returned in responses is the model name without the suffix.
