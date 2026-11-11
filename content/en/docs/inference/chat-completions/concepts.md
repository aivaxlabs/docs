---
{title: Inference Concepts,linkTitle: Concepts,weight: 10,group: Inference,aliases: [/docs/inference/inference.html,/docs/inference/chat-handling.html,/docs/platform/conversations.html]}
---

# Inference concepts

AIVAX exposes an OpenAI-compatible `chat/completions` API with additional AIVAX parameters. The additions are optional and are designed to support gateways, RAG, built-in tools, structured responses, multimodal pre-processing, provider routing, and billing metadata.

These pages cover the request contract. Use an [AI Gateway](/docs/inference/ai-gateways/concepts.md) when the same configuration must be reused or centrally managed.

## Direct call or gateway

Use a direct call for simple tasks, tests, internal routines, and integrations where the application controls the model, prompt, tools, and context for each request.

Use an AI Gateway when behavior needs to be stable, auditable, and reusable. Gateways are better for support assistants, chat bots, RAG agents, permanent tools, workers, skills, and configurations shared by multiple clients. See [Inference with AI Gateways](ai-gateways.md) for how a gateway changes a request.

## How a request runs

One request can involve several model generations. AIVAX prepares the context, calls the model, runs any server-side tools the model requests, calls the model again with their results, and repeats until the model produces a final answer or requests a tool your client must run.

1. **Prepare.** AIVAX resolves the model or gateway, adds gateway instructions and retrieved documents, restores [server-side context](server-side-context.md) from earlier turns, applies [pre-processing](multimodal-pre-processing.md) and moderation, and fits the conversation to the context window.
2. **Generate.** The selected provider generates reasoning, text, or tool calls; see [Routing](/docs/inference/routing/setup-routing.md) for how the provider is chosen.
3. **Run server-side tools.** [Built-in tools](built-in-tools.md), [MCP tools, and protocol functions](mcp-and-protocol-functions.md) run inside AIVAX, and the loop returns to step 2.
4. **Finish.** AIVAX validates [structured output](structured-output.md) when requested, and returns the final answer, or the [client tool calls](tools.md) your application must run.

Only the final result is returned as an assistant message. With [streaming](streaming.md), you also receive reasoning, tool events, and partial text as they happen.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

The endpoint also has the API alias `/api/v1/chat/completions`.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Long-running inference

Because one request can run several generations and tools, it can take minutes. On `https://inference.aivax.net`, a non-streaming request that exceeds the proxy timeout ends with HTTP `524` while AIVAX keeps processing it. Send long requests to the direct inference host instead:

```text
https://direct.inference.aivax.net/v1
```

The request is still synchronous: keep the connection open and set a client timeout that covers the expected processing time. Paths, keys, and request bodies are the same as on the default host. Streaming requests send data continuously and rarely need it. See [Long-running inference](/docs/overview.md#long-running-inference) for an SDK example and the endpoints the direct host serves.

## Request metadata

Set `metadata` to attach string key/value information to the inference request. AIVAX stores this object with the logged conversation and exposes it to gateway events, so it is useful for operational correlation such as an order ID, tenant, workflow, or internal trace key.

```json
{
    "model": "your-model-or-gateway-id",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this support ticket."
        }
    ],
    "metadata": {
        "ticket_id": "SUP-1042",
        "workflow": "support-triage"
    }
}
```

`metadata` must be a JSON object whose property names and values are strings. Do not place secrets, credentials, payment data, or large payloads in this field.

## Response and conversation records

The standard `/v1/chat/completions` response envelope includes `generation_context`. Its `generated_usage` entries contain `sku`, `amount`, `unit_price`, `quantity`, and `description`. Set [`json_only: true`](/docs/inference/structured-responses/json-only.md) to return only the final JSON without this envelope.

`usage` reports `prompt_tokens`, `completion_tokens`, and `total_tokens`. `prompt_tokens` counts only uncached input; cached input is reported separately in `prompt_tokens_details.cached_tokens`. See [Caching](caching.md).

Responses for integrated models also include `provider`, the tag of the provider that served the request; see [Provider in responses](/docs/inference/routing/setup-routing.md#provider-in-responses).

Set `allow_logging: false` in a `/v1/chat/completions` request to keep that request out of the account conversation logs. It defaults to `true`, and it cannot enable logging when conversation logging is disabled for the account. Usage and billing records are still created.

When conversation logging is enabled, the stored record includes its ID, origin, model name, request ID, response schema, tools and tool input schemas, usage, linked resources, created and updated timestamps, token count, external user ID, error message, messages, and metadata. Gateway and API key context is available through the linked resources.

Use `conversation_token` and `metadata` to correlate these records with your own workflow.

## Pricing

Inference rates depend on the selected model, provider, input size, and media type. Moderation is charged separately in Processing Units (PUs), covering input, cached input, and output usage; its PU price varies with the model and provider used. The [plan multiplier](/docs/pricing.md#plan-multipliers) applies to integrated-model inference and moderation. BYOK is not affected by it. In usage records, moderation charges appear under the model `@aivax/layered-moderation`.

| Description | Pricing |
| --- | ---: |
| AI model and AI Gateway inference | Selected model and provider rates |
| Input moderation | Variable price per PU; separate from the main inference charge |

One moderation PU equals one output token of the moderation model, and input tokens count in proportion to their price. For example, with a model priced at $0.10/M input and $0.40/M output tokens, a check using 3,000 input and 50 output tokens consumes 800 PUs (3,000 × 0.25 + 50), about $0.00032 before the plan multiplier.
