Source: https://docs.aivax.net/docs/inference/ai-gateways/using-an-ai-gateway.html

# Using an AI Gateway

Create a gateway in the dashboard or with the API, then call it through the OpenAI-compatible `chat/completions` endpoint by passing its ID or slug as `model`.

## Create and manage gateways

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20AI%20Gateway)

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Edit%20AI%20Gateway)

An edit request may contain only the fields to change; omitted fields keep their current values.

## Call the gateway

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

```json
{
    "model": "support:50c3",
    "messages": [
        {
            "role": "user",
            "content": "How do I reset my password?"
        }
    ]
}
```

The request carries only the conversation. The gateway adds its instructions, retrieved documents, and tools before the model runs. To understand how this pre-configuration changes the request, see [Inference with AI Gateways](https://docs.aivax.net/docs/inference/chat-completions/ai-gateways.md).

## Override gateway values

Requests sent with a private key can override supported gateway values for that request only. The gateway itself is not changed.

| Request field | Overrides |
| --- | --- |
| `temperature`, `top_p`, `seed`, `presence_penalty` | Sampling parameters. |
| `reasoning_effort`, `verbosity` | Reasoning and verbosity settings, when the model supports them. |
| `max_completion_tokens`, `stop` | Output length and stop sequences. |
| `tools` | Adds client-side tools to the gateway tools. |
| `builtin_tools` | Enables additional [built-in tools](https://docs.aivax.net/docs/inference/chat-completions/built-in-tools.md). |
| `response_schema`, `response_format` | [Structured output](https://docs.aivax.net/docs/inference/chat-completions/structured-output.md). |
| `time_zone` | The gateway time zone. |
| `multimodal_resolver` | The [multimodal pre-processing](https://docs.aivax.net/docs/inference/chat-completions/multimodal-pre-processing.md) engines. |
| `tool_invocation_explanations` | [Tool explanations](https://docs.aivax.net/docs/inference/response-rendering/tool-explanations.md). |
| `routing_options` | [Provider routing](https://docs.aivax.net/docs/inference/routing/setup-routing.md#override-routing-per-request). |

`frequency_penalty` is configured only on the gateway. Instructions, RAG, MCP sources, protocol functions, skills, workers, and moderation cannot be overridden per request.

Public API keys accept only a small set of request fields and reject the others; see [Limits](https://docs.aivax.net/docs/inference/chat-completions/limits.md#public-api-keys).

## Test incrementally

When a gateway behaves unexpectedly, test a plain prompt first, then add RAG, tools, media, or structured output one at a time. This isolates the resource that causes the problem. See [Troubleshooting](https://docs.aivax.net/docs/inference/chat-completions/troubleshooting.md).

## Use a gateway from MCP clients

To expose an integrated model or an AI Gateway as a tool for an external MCP client, see [Inference MCP](https://docs.aivax.net/docs/mcp-utilities/inference-mcp.md).
