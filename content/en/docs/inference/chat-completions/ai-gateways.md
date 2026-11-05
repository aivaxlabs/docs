---
{title: Inference with AI Gateways,linkTitle: AI Gateways,weight: 40,group: Inference}
---

# Inference with AI Gateways

An AI Gateway pre-configures an inference. When `model` is a gateway ID or slug, the request you send is only part of the request the model receives: AIVAX merges it with the gateway configuration first.

```json
{
    "model": "support:50c3",
    "messages": [
        {
            "role": "user",
            "content": "Where is my order 123?"
        }
    ]
}
```

With a gateway configured with instructions, a collection, and a protocol function, the model receives the gateway's system instructions, the documents retrieved for the question, and the function definition, in addition to the user message. The same request sent with `"model": "@openai/gpt-5-mini"` would reach the model with only the user message.

## What the gateway sets

| Area | Set by the gateway | Can the request change it |
| --- | --- | --- |
| Model and provider | Model, BYOK endpoint, model routing, provider routing | Provider routing, with [`routing_options`](/docs/inference/routing/setup-routing.md#override-routing-per-request) |
| Instructions | System instructions, remote sources, prompt template, prefill | No. The request can add its own `system` messages. |
| Parameters | Temperature, top-p, penalties, stop, output limit, reasoning effort, verbosity, seed | Yes, except `frequency_penalty` |
| Knowledge | Collections, query strategy, result limits, reranker | No |
| Tools | Built-in tools, MCP sources, protocol functions, skills, shell, raw tools | The request can add `tools` and `builtin_tools`, but cannot remove gateway tools. |
| Media | Multimodal pre-processing engines, `DisableMultiModalInput` | Engines, with `multimodal_resolver` |
| Context | Context window, overflow action, tool message truncation | No |
| Policy | Moderation, workers | No |
| Presentation | Tool explanations, time zone | Yes |

The full list of request overrides is in [Override gateway values](/docs/inference/ai-gateways/using-an-ai-gateway.md#override-gateway-values). Values in the request apply to that request only and never change the gateway.

## Precedence

When the same setting comes from several places, the most specific one wins:

1. The request field, such as `temperature` or `routing_options`.
2. A suffix in the gateway's model name, for routing; see [Inline routing](/docs/inference/routing/inline-routing.md).
3. The gateway configuration.
4. The model's defaults.

Account settings, such as [ZDR](/docs/inference/routing/zdr.md) or [special providers](/docs/inference/routing/special-providers.md), restrict the result regardless of these values.

## Public keys

Public API keys can call only gateways, by full ID, and accept a reduced set of request fields. With a public key, the gateway's MCP sources, protocol functions, built-in tools, shell, and skills are not used, so the gateway configuration is the only place where its behavior is defined. See [Limits](limits.md#public-api-keys).

## When to move settings into a gateway

Move a setting from the request into a gateway when every client sends the same value, when non-developers need to change it, or when it must not be controlled by the client, such as instructions, tools, or moderation. Keep it in the request when it varies per call, such as `metadata`, `conversation_token`, or a per-task `response_schema`.
