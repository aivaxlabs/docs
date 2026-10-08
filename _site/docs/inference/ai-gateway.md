Source: http://localhost:1313/docs/inference/ai-gateway.html

# AI Gateway

An AI Gateway stores a reusable inference configuration. Pass the gateway's ID or slug in the request's `model` field, and AIVAX applies its model settings, instructions, RAG collections, tools, skills, workers, moderation, and context controls.

Use a gateway when the same behavior must be reused by multiple clients or changed without redeploying the calling application.

## How to think about a gateway

A direct call to `/v1/chat/completions` can call an integrated AIVAX model directly, for example `@openai/gpt-5-mini`. A gateway stores the decisions you do not want to repeat on every request:

- Model provider and model name.
- System instructions, remote instruction sources, user prompt template, and assistant prefill.
- RAG collections, result limits, score threshold, reranker, reference behavior, and query strategy.
- OpenAI-compatible tools, AIVAX built-in tools, MCP tools, protocol functions, skills, and the optional bash environment.
- Context window behavior, tool-message truncation, moderation, workers, model routing, and tool-call handling.

This creates a responsibility boundary. The client application sends messages and optional request overrides. The gateway administrator controls the operational policy.

In production, start with a conservative configuration: clear system instructions, a model that supports the required modalities and tools, one well-prepared RAG collection, and only the tools that are actually needed. Adding many tools, skills, or collections increases input tokens, cost, and the chance of the model choosing the wrong path.

## Models and gateway names

There are three common ways to choose what `/v1/chat/completions` uses:

- Use an integrated AIVAX model tag, usually beginning with `@`.
- Use a gateway full ID.
- Use a gateway slug in the format `name:final-id`, such as `support:50c3`.

Private API keys can resolve a gateway by full ID or by slug. Public API keys are more restricted: they can use AI gateways only by full ID, and only a limited set of chat completion request parameters is accepted.

When choosing a model, validate three points before putting it into production:

- The model supports the input modalities you intend to send, such as image, audio, video, or file.
- The model supports function calling if the gateway uses tools, RAG through `QueryFunction`, MCP, protocol functions, skills, or built-in functions.
- The model accepts the parameters you configure. Some integrated models reject assistant prefill, temperature, stop sequences, or reasoning effort.

Plan for retirement too: a gateway lets you change the model behind a stable name, but you still need to qualify the replacement. See [pinning a model ID versus using an alias](https://aivax.net/blog/pin-llm-model-id-or-use-alias-model-deprecations/) for a replacement checklist.

Gateways can also use model routing. For the complexity router, AIVAX classifies the latest user request as low, medium, or high complexity, selects the configured model for that level, and emits `X-Model-Routed-Complexity` on the HTTP response when available.

## Using an AI Gateway

AIVAX provides an OpenAI-compatible chat completions endpoint:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

Gateway values can be overridden by the request for supported parameters such as `temperature`, `top_p`, `seed`, `reasoning_effort`, `max_completion_tokens`, `stop`, `tools`, `response_schema`, `response_format`, `builtin_tools`, `multimodal_resolver`, the deprecated `multimodal_preprocess`, and `tool_invocation_explanations`. For direct inference behavior, including response rendering options, see [Inference](http://localhost:1313/docs/inference/inference.md).

## Using SDKs

Because the endpoint follows the OpenAI chat completions shape, you can use existing OpenAI-compatible SDKs. In the example below, replace `my-gateway:50c3` with your gateway's full ID or slug and load your private API key from secure configuration. See [Getting Started](http://localhost:1313/docs/getting-started.md) for an environment-variable example.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="<AIVAX_API_KEY>"
)

response = client.chat.completions.create(
    model="my-gateway:50c3",
    messages=[
        {"role": "user", "content": "Explain why AI gateways are useful."}
    ]
)

print(response.choices[0].message.content)
```

OpenAI-compatible inference uses `/v1/chat/completions`. The `/v1/responses` endpoint is not supported.

## Recommended production configuration

Write the system instructions so the model understands its role, audience, sources of truth, and limits. Include when to use RAG, when to use tools, and how to respond when information is unavailable. Avoid repeating operational settings that already exist in the gateway, such as truncation limits or tool lists.

For RAG, link collections with short, self-contained, well-named documents. Choose the query strategy based on the conversation type:

- `Plain`: Uses the last user message as the search term.
- `Concatenate`: Joins the last configured number of user messages line by line.
- `UserRewrite`: Rewrites recent user messages into one or more search queries using a resolver model.
- `FullRewrite`: Rewrites recent user and assistant messages using a resolver model.
- `QueryFunction`: Exposes a search function to the model instead of injecting a search result before inference.

For tools, enable only those with a clear role. Built-in tools cover common capabilities such as current date and time, web search, opening URLs, code execution, image generation, document generation, page generation, calendar actions, memory, HTTP requests, and X post lookup. External MCP is better when you already have an MCP server with business tools. Protocol functions are useful when you want to expose specific HTTP callbacks to the model without installing a full MCP server.

When enabling memory, define what the assistant may retain and how your application will review and remove stored records. The [memory-poisoning guide](https://aivax.net/blog/persistent-memory-is-a-write-path/) outlines these controls.

Use a tool handler only when the selected model needs help producing tool calls. The available handler is `react.v1.selfcall`; `native` or no value uses the model's native tool calling.

Use workers when an external system must decide something during the inference flow. A worker can block a message, rewrite context, add tools, or replace a server-side tool result. Because the worker is called in the critical path, keep it fast and deterministic.

Validate your gateway configuration with a [simulated-user and LLM-judge scenario](https://aivax.net/blog/introducing-agentic-tests/) before relying on it in production.

When you enable moderation, see [LLM input moderation: system prompt or separate moderation step?](https://aivax.net/blog/aivax-gateway-moderation/) for what it covers, its failure behavior, and what still needs application-level checks.

## Inference MCP

To expose an integrated model or AI Gateway as a tool for an external MCP client, see [Inference MCP](http://localhost:1313/docs/mcp-utilities/inference-mcp.md).
