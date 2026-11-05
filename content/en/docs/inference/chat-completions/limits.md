---
{title: Inference Limits,linkTitle: Limits,weight: 140,group: Inference}
---

# Inference limits

This page lists the limits that apply to `chat/completions` requests. Account-wide request rates and plan limits are documented in [Plans and limits](/docs/limits.md).

## Rate limits

Requests count toward the account's plan limits for integrated models or BYOK, and return `429 Too Many Requests` when a limit is reached. See [Plans and limits](/docs/limits.md).

## Context window

The context window is the model's maximum input size. A gateway can set a lower limit with `contextMaximumSize` and choose what happens when a conversation exceeds it; see [Context window and truncation](/docs/inference/ai-gateways/concepts.md#context-window-and-truncation).

On the Free plan, the input context is capped at 64,000 tokens, even when the model or the gateway allows more. Token counts for this check are approximate and include system instructions and tool definitions.

## Output length

`max_completion_tokens` limits the generated output. `max_tokens` is accepted as an alias. When omitted, the model's default applies.

## Conversation token

- `conversation_token` accepts any non-empty string with 128 characters or less.
- Server-side tool state is kept for one hour after its last use.
- `idempotency_key` is a deprecated alias; when both are sent, they must have the same value.

See [Session reuse](session-reuse.md).

## Structured output

JSON Healing makes 3 attempts by default. `healing_options.max_attempts` accepts 1 to 10. See [JSON Healing](/docs/inference/structured-responses/json-healing.md).

## Media

- Requests with files or videos require a higher minimum account balance than requests with images or audio.
- External media URLs must be reachable without authentication. Provider-specific size limits apply.
- Large videos should be sent by URL instead of base64.

See [Input and multimodality](input-and-multimodality.md#media-requirements).

## Request duration

A request can run several generations and tool calls. On `https://inference.aivax.net`, a non-streaming request that exceeds the proxy timeout returns `524`. Use streaming, or send long requests to the direct inference host; see [Long-running inference](concepts.md#long-running-inference).

## Public API keys

Public keys are designed for code that runs in a browser. With a public key, `chat/completions`:

- accepts only a gateway's full ID in `model`, not slugs or integrated model names;
- accepts only these request fields: `model`, `messages`, `prompt`, `temperature`, `top_p`, `top_k`, `seed`, `tools`, `reasoning_effort`, `max_completion_tokens`, `stream`, `conversation_token`, and `idempotency_key`. Any other field returns `400 Bad Request`;
- does not use the gateway's MCP sources, protocol functions, built-in tools, shell, or skills;
- applies request and token rate limits per key and per remote address. See [Public API keys](/docs/limits.md#public-api-keys) for the values.

See [Authentication](/docs/authentication.md) before exposing a public key.
