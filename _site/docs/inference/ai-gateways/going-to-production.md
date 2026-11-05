Source: https://docs.aivax.net/docs/inference/ai-gateways/going-to-production.html

# Taking an AI Gateway to production

Start with a conservative configuration: clear system instructions, a model that supports the required modalities and tools, one well-prepared RAG collection, and only the tools that are actually needed. Add resources one at a time and measure their effect on quality, cost, and latency.

## System instructions

Write the system instructions so the model understands its role, audience, sources of truth, and limits. Include when to use RAG, when to use tools, and how to respond when information is unavailable. Avoid repeating operational settings that already exist in the gateway, such as truncation limits or tool lists.

If your prompts currently live in OpenAI Prompt Objects or Agent Builder, see [what you lose when they shut down and where each piece can live](https://aivax.net/blog/openai-prompt-objects-agent-builder-shutdown-what-you-lose/).

## Knowledge

Link collections with short, self-contained, well-named documents, and choose the query strategy by conversation type; see [Knowledge (RAG)](https://docs.aivax.net/docs/inference/ai-gateways/concepts.md#knowledge-rag). Start with a small result count and raise it only when the model lacks evidence, because each result adds input tokens.

## Tools

Enable only tools with a clear role. Built-in tools cover common capabilities. External MCP is better when you already have an MCP server with business tools. Protocol functions are useful when you want to expose specific HTTP callbacks without installing a full MCP server. Every tool adds its name, description, and schema to each request; see [how to measure and cut tool-definition tokens](https://aivax.net/blog/reduce-mcp-tool-definition-tokens-too-many-tools/).

Use a tool handler only when the selected model needs help producing tool calls.

## Memory

When enabling [memory](https://docs.aivax.net/docs/tools/builtin-tools.md#memory), define what the assistant may retain and when it must call `memory_search`: memories are not automatically included in system instructions. By default, memories are shared across the account's gateways for the same identified user; disable shared memory to restrict a gateway to its own memories. Memories only expire when saved with `expiresInDays`. Plan how your application will review and remove documents in the `@memories` collection. The [memory-poisoning guide](https://aivax.net/blog/persistent-memory-is-a-write-path/) outlines these controls.

## Workers and moderation

Use workers when an external system must decide something during the inference flow. Because the worker is called in the critical path, keep it fast and deterministic.

When you enable moderation, see [LLM input moderation: system prompt or separate moderation step?](https://aivax.net/blog/aivax-gateway-moderation/) for what it covers, its failure behavior, and what still needs application-level checks.

## Client integration

- Keep private keys on the server. Use a public key or a [chat client](https://docs.aivax.net/docs/inference/chat-clients.md) for code that runs in a browser.
- Send one [`conversation_token`](https://docs.aivax.net/docs/inference/chat-completions/session-reuse.md) per conversation and store the message IDs AIVAX returns.
- Configure retries for `429` and `503` responses; see [Troubleshooting](https://docs.aivax.net/docs/inference/chat-completions/troubleshooting.md).
- Use [streaming](https://docs.aivax.net/docs/inference/chat-completions/streaming.md) for user-facing chats, or the direct inference host for long non-streaming requests.

## Validate before release

Validate the configuration with a [simulated-user and LLM-judge scenario](https://docs.aivax.net/docs/inference/agentic-tests.md) before relying on it in production, and run the same scenarios again after changing the model, instructions, or tools.

Review [Pricing](https://docs.aivax.net/docs/pricing.md) and [Plans and limits](https://docs.aivax.net/docs/limits.md) before increasing traffic.
