---
{title: AI Gateway Concepts,linkTitle: Concepts,weight: 10,group: AI Gateways,aliases: [/docs/platform/ai-gateways.html,/docs/inference/ai-gateway.html]}
---

# AI Gateway concepts

An AI Gateway stores a reusable inference configuration. Pass the gateway's ID or slug in the request's `model` field, and AIVAX applies its model settings, instructions, RAG collections, tools, skills, workers, moderation, and context controls before calling the model.

Use a gateway when the same behavior must be reused by multiple clients or changed without redeploying the calling application. Use a [direct inference call](/docs/inference/chat-completions/concepts.md) when the application controls the model, prompt, tools, and context of every request.

Treat the gateway configuration as sensitive: `GET /api/v1/ai-gateways/<id>` returns the full parameters to the owning account, including `apiKey` in plain text when the gateway uses an external provider key.

## Responsibility boundary

A gateway separates two roles:

- **The client application** sends messages and, with a private key, optional request overrides.
- **The gateway administrator** controls the operational policy: which model runs, what it is told, what it can read, which tools it can call, and which limits apply.

This boundary lets you change a model, a prompt, or a tool list in one place while every client keeps calling the same identifier. Each resource below is optional. Start with a model and system instructions, and add other resources only when the use case requires them: every tool, skill, or collection adds input tokens, cost, and one more path the model can choose wrongly.

The sections below describe what each resource does and when to use it. [Processing pipeline](/docs/inference/chat-completions/processing-pipeline.md) documents the detailed behavior of each step.

## Model and provider

The gateway's model is either an integrated AIVAX model or a model served by your own provider key (BYOK).

- **Integrated models** use `baseAddress: "@integrated"` and a model name such as `@openai/gpt-5-mini`. AIVAX selects the provider, bills the account, and applies [provider routing](/docs/inference/routing/setup-routing.md).
- **BYOK models** use the base address of an OpenAI-compatible provider endpoint, your provider `apiKey`, and the provider's model name. AIVAX still runs the gateway pipeline, but the provider bills you directly and provider routing does not apply. BYOK requests use the plan's BYOK rate limit; see [Plans and limits](/docs/limits.md).

Use an integrated model unless you need a model, contract, or region that only your provider account offers. See [Models and gateway names](models-and-gateway-names.md) for how the model is identified.

## Model routing

Model routing selects a different model for each request. The complexity router classifies the latest user request as low, medium, or high complexity and runs the model configured for that level, with an optional reasoning effort per level. The response carries the `X-Model-Routed-Complexity` header when a level was selected.

Use it when most requests are simple but some need a stronger model, so you do not pay the stronger model's price on every request. Do not use it when every answer must come from the same model for consistency or compliance. To measure what the classifier adds to each request before you adopt it, see [what a complexity router costs](https://aivax.net/blog/route-by-complexity-price-by-task/).

Model routing differs from [provider routing](/docs/inference/routing/setup-routing.md), which keeps the model and chooses which provider serves it.

## Instructions

Instruction settings shape the prompt the model receives:

| Resource | What it does | When to use |
| --- | --- | --- |
| System instructions | Text added to the system instructions of every request. | Always. Describe the role, audience, sources of truth, and limits. |
| Remote instruction sources | URLs fetched as text and appended to the system instructions, with a configurable cache. | Instructions maintained in another system, such as a CMS or a repository, that must change without editing the gateway. |
| User prompt template | Replaces `{prompt}` with the text of each user message. | Every user message must be wrapped in the same frame, such as a fixed task description. |
| Assistant prefill | Initial assistant text placed before generation. | The answer must start with a fixed format. Some models do not support prefill. |

Write instructions about behavior, not about settings the gateway already controls, such as truncation limits or the tool list. See [Instructions](/docs/inference/chat-completions/processing-pipeline.md#instructions) for the remote source size limit and failure rules.

## Model parameters

The gateway can set default values for `temperature`, `top_p`, `presence_penalty`, `frequency_penalty`, `stop`, `max_completion_tokens`, `reasoning_effort`, and `verbosity`. `seed` is accepted only per request. Requests sent with a private key can override most of them; see [Override gateway values](using-an-ai-gateway.md#override-gateway-values).

Set parameters on the gateway when the behavior must be the same for every client, for example a low temperature for an extraction assistant. Some integrated models reject parameters such as temperature, stop sequences, or reasoning effort; AIVAX rejects the gateway configuration when the limitation is known.

## Context window and truncation

`contextMaximumSize` limits the approximate number of input tokens sent to the model, and `contextOverflowAction` decides what happens when a conversation exceeds it:

- `Throw` returns an error instead of calling the model. This is the default.
- `Truncate` removes the oldest non-system messages until the conversation fits, then continues.
- `TruncateHard` truncates like `Truncate`, but fails the request if the prompt still does not fit.

Use truncation for long-lived chats in which old turns lose relevance, such as support conversations. Keep `Throw` when every message matters, such as a document review, so the application decides what to remove. On the Free plan, the input context is capped regardless of this setting; see [Limits](/docs/inference/chat-completions/limits.md). See [Context truncation](/docs/inference/chat-completions/context-truncation.md) for how messages are removed and when the check runs.

## Tool message truncation

`toolContextCount` keeps only the most recent tool results intact. Older tool messages stay in the conversation, but their content is replaced with a short note asking the model to call the tool again.

Use it in long agentic conversations whose tools return large payloads that are only relevant once, such as search results. Avoid it when an early tool result remains important later. Rewriting old messages also changes the request prefix, which can reduce [prompt caching](/docs/inference/chat-completions/caching.md).

## Flags

Flags change how AIVAX prepares the provider request for models with specific behavior. Configure them in **Flags and normalization switches** in the gateway editor or in `parameters.flags`.

| Flag | Effect | When to use |
| --- | --- | --- |
| `DisableMultiModalInput` | Images, audio, video, and files are not sent to the model, even when it supports them. | The gateway must stay text-only, for cost or policy reasons. |
| `ThinkingProcess` | Declares that the model reasons internally without returning its reasoning tokens. | A model that reasons but hides its reasoning. |
| `DiffusingStream` | Declares that the model is a diffusion model whose output is refined as a whole instead of produced token by token. | Diffusion models only. |
| `PreserveThinkingTokens` | Keeps the `<think>` blocks of earlier assistant messages in the conversation sent to the model. | Models that need their previous reasoning to continue a multi-step task. |
| `RewriteToolCallsAsUserMessages` | Rewrites tool calls and tool results as plain conversation messages. | Models or providers that reject the native tool message format. |
| `StrictUserAssistantTurns` | Enforces strict alternation between user and assistant messages. This disables tool messages. | Models that fail when two messages with the same role are adjacent. |
| `DisableReasoningSummary` | Stops streaming reasoning content to the client. | Clients that must never receive reasoning. |

Flags compensate for model limitations. Leave them unset unless you observe the problem a flag solves.

## Multimodal pre-processing

Multimodal pre-processing converts images, audio, video, and files into text before the main model runs. Each media type uses its own engine: a smaller or larger multimodal model, OCR, or speech-to-text.

Use it when the main model is text-only, or when a cheaper model can describe media once and a stronger text model can reason about the description. Do not use it when the main model must see the original media, such as when comparing visual details. See [Multimodal pre-processing](/docs/inference/chat-completions/multimodal-pre-processing.md) for the engines and their billing.

## Knowledge (RAG)

A gateway can link [collections](/docs/rag/collections.md) so the model answers from your documents. The gateway controls the result limit, minimum score, reranker, reference behavior, and query strategy. Choose the strategy by conversation type:

- `Plain` searches with the last user message. Use it for standalone questions.
- `Concatenate` joins recent user messages. Use it when users split one question across several messages.
- `UserRewrite` and `FullRewrite` rewrite recent messages into search queries with a resolver model. Use them when follow-up questions depend on earlier turns, at the cost of an extra inference.
- `QueryFunction` gives the model a search tool so it decides when to search. Use it when many messages do not need retrieval. It requires a model with tool calling.

See [RAG](/docs/inference/chat-completions/processing-pipeline.md#rag) for the full behavior.

## Tools

Tools let the model act and read live data. A gateway can expose several kinds:

| Kind | Executed by | When to use |
| --- | --- | --- |
| [Built-in tools](/docs/tools/builtin-tools.md) | AIVAX | Common capabilities: date and time, web search, opening URLs, code, memory, and image, document, or page generation. |
| [MCP sources](/docs/tools/mcp.md) | Your MCP server, called by AIVAX | You already have an MCP server or a catalog of business tools shared by several agents. |
| [Protocol functions](/docs/tools/protocol-functions.md) | Your HTTP callback, called by AIVAX | One or a few specific actions, without running a full MCP server. |
| [Shell](/docs/tools/shell.md) | An AIVAX sandbox | Tasks easier to express as commands, or many tools moved behind a command line. |
| Raw `tools` | Your client application | The client must execute the action itself; see [Tools](/docs/inference/chat-completions/tools.md). |

Built-in tools, MCP tools, protocol functions, and the shell are server-side tools: AIVAX runs them during the request and returns only the final answer. Enable only tools with a clear role, and give them specific names and restrictive schemas.

## Skills

[Skills](/docs/inference/skills.md) are instruction packs the model loads on demand. Use them for specialized procedures that only some requests need, so their text does not occupy the system instructions of every request.

## Tool handler

The tool handler, or function interpreter, is deprecated. It adds tool calling for models that do not produce reliable native tool calls: `native` or no value uses the model's native tool calling; `react.v1.selfcall` uses a ReAct-style handler.

Do not use it in new gateways; choose a model with native tool calling instead. See [Function interpreter (deprecated)](/docs/inference/chat-completions/function-interpreter.md).

## Tool explanations

`toolInvocationExplanations` asks the model to explain each server-side tool call with a short reason and goal, which AIVAX returns with the tool event. Use it when the client shows tool activity to end users. See [Tool explanations](/docs/inference/response-rendering/tool-explanations.md).

## Moderation

Input moderation evaluates the textual conversation before the main model runs and makes the model refuse requests that reach the configured sensitivity in a category. Use it for broad safety policy in user-facing assistants. It does not moderate output or media, and it is not an authorization mechanism. See [Moderation](/docs/inference/chat-completions/moderation.md).

## Workers

[Workers](/docs/inference/workers.md) call your endpoint during gateway events, so your code can block a message, rewrite context, add tools, or replace a tool result. Use them when a decision depends on data only your system has, such as the user's account state. The worker runs in the critical path, so keep it fast and deterministic.

## Time zone

`timeZone` sets the IANA time zone the model uses to read and write dates. It applies to `get_date_time`, scheduling tools, and the shell, and defaults to `America/Sao_Paulo`. Set it to your users' time zone; a request can override it with `time_zone`.

## Pricing

A gateway has no separate fee. Requests are billed by the model and the resources the gateway uses: inference tokens, rewrite or pre-processing inferences, moderation, tools, and RAG. See [Inference pricing](/docs/inference/chat-completions/concepts.md#pricing).
