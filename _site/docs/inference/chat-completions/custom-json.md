Source: https://docs.aivax.net/docs/inference/chat-completions/custom-json.html

# Custom provider request body

Use `extra_body` to send provider-specific options. When a gateway uses your own provider API key and an OpenAI-compatible provider endpoint, `extra_body` merges custom JSON into the provider request body:

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Explain the tradeoff."
        }
    ],
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

`extra_body` is not allowed with integrated AIVAX models.

Reasoning parameters differ by provider and model. See [how to set reasoning effort across providers](https://aivax.net/blog/reasoning-is-a-protocol-not-just-a-model-setting/) before choosing provider-specific options.

Use `extra_body` for options that AIVAX does not expose as a request field, such as a provider's reasoning switch. Prefer the standard fields, such as `reasoning_effort`, when they exist, because they also work after you change the provider. The JSON is merged at the root of the provider request and can overwrite fields AIVAX sets, so send only the keys the provider documents.

Send `extra_body` as a field of the JSON request body. When using the OpenAI Python SDK, nest it inside the SDK's `extra_body` argument, as in `extra_body={"extra_body": {...}}`, because the SDK's own `extra_body` only adds fields to the request; see [Using via SDKs](https://docs.aivax.net/docs/inference/ai-gateways/using-sdks.md#send-aivax-fields).
