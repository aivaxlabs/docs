Source: https://docs.aivax.net/docs/inference/pipelines.html

# AI Pipelines

AI Gateway pipelines are the processing steps AIVAX applies before and during inference. They can add context, rewrite queries, expose tools, moderate input, route models, truncate conversations, and call external workers.

Most pipelines are configured in the gateway parameters. Request-level options can override some inference parameters on direct `chat/completions` calls.

## RAG

RAG links [collections](https://docs.aivax.net/docs/rag/collections.md) to an AI Gateway. The gateway controls:

- Collections included in retrieval.
- Maximum number of retrieved documents.
- Minimum score.
- Reranker name.
- Whether chunk references are included.
- Query strategy.

When a gateway has knowledge collections and the latest user message contains text, AIVAX can retrieve matching documents before the model call. For injection strategies, the retrieved context is inserted at the beginning of the last user message. If a linked collection has its own context text, that collection context is added to system instructions.

Query strategies:

- `Plain`: Uses the latest user message as the search query.
- `Concatenate`: Joins the latest configured number of user messages line by line and searches with the combined text.
- `UserRewrite`: Rewrites recent user messages into one or more search queries using a resolver model.
- `FullRewrite`: Rewrites recent user and assistant messages into one or more search queries using a resolver model.
- `QueryFunction`: Adds a query function to the model. The model decides when to search the linked collections, and search results are returned as tool responses. The model can narrow a search with an optional [document filter](https://docs.aivax.net/docs/filters/document-filters.md).

Rewrite strategies add resolver-model cost (see [Pricing](https://docs.aivax.net/docs/pricing.md)) and latency. They are useful when users ask follow-up questions such as "what about this case?" because the resolver can turn the recent conversation into a clearer search query.

Defining many RAG results increases input token usage and can increase final inference cost (see [Pricing](https://docs.aivax.net/docs/pricing.md)). Start with a small result count and raise it only when the model lacks enough evidence.

## Instructions

Instruction settings shape the provider-facing prompt:

- **System instructions**: Added to the system instruction set.
- **Remote system instruction sources**: Fetched from configured URLs and added to the system instruction set.
- **User prompt template**: Replaces `{prompt}` with each user message's text before sending it to the model.
- **Assistant prefill**: Adds initial assistant content before generation when the model supports prefill.

Remote instruction sources are fetched as text, within a response size limit (see [Request and payload limits](https://docs.aivax.net/docs/limits.md#request-and-payload-limits)). Their cache duration is configurable; the default is 600 seconds.

Some models do not support assistant prefill, temperature, stop sequences, or reasoning effort. Integrated model validation rejects incompatible gateway settings when those limitations are known.

## Skills

Skills are on-demand instruction packs available to the model. When a gateway enables skills, AIVAX loads the account skills configured on the gateway and can expose skill-related built-in functions.

Read more about [skills](https://docs.aivax.net/docs/features/skills.md).

## Multimodal pre-processing

Multimodal pre-processing converts selected media content into text before the main model call. Each content type (images, audio, video, and files) uses its own engine: a smaller (`InferenceLow`) or larger (`InferenceHigh`) multimodal model, OCR for images and files, or speech-to-text for audio. See [Multimodal pre-processing](https://docs.aivax.net/docs/inference/inference.md#multimodal-pre-processing) for the accepted engines.

The gateway setting `multimodalResolverParameters` replaces the deprecated `enabledMultimodalFeatures` flags. Gateways that still use the flags keep working with the equivalent engines until `multimodalResolverParameters` is set.

Use pre-processing when the main model is text-first or when you want AIVAX to normalize media into textual context. For direct multimodal models, send the original media without pre-processing so the model can inspect it directly.

Results are cached by content and engine for reuse.

## Parameterization

The parameterization pipeline configures model request options such as:

- `temperature`
- `top_p`
- `presence_penalty`
- `frequency_penalty`
- `stop`
- `max_completion_tokens`
- `reasoning_effort`
- `verbosity`
- `seed`

Request-level values can override gateway values when the endpoint supports the parameter. Some integrated models reject specific parameters, and BYOK providers may have their own restrictions.

## Context truncation

The context truncation pipeline uses an approximate token count. When `ContextMaximumSize` is set and the conversation exceeds the limit, the gateway follows `ContextOverflowAction`:

- `Throw`: Return an error instead of calling the model.
- `Truncate`: Remove older non-system messages until the conversation fits.

Truncation preserves system messages and keeps at least one user message when possible. If the remaining user message still exceeds the limit, the request fails with a message-size error.

On lower plans, the effective input context may be capped even when a larger context is configured; see [Plans and limits](https://docs.aivax.net/docs/limits.md#plan-limits).

## Tool message truncation

`ToolContextCount` controls how many recent tool response messages keep their original content. When it is set to a value greater than zero, older tool messages remain in the conversation but their content is replaced with:

```text
[tool response truncated - call this tool again]
```

This can reduce context usage in long agentic conversations. It can also hurt chains where an old tool result remains important, so use it only when the model can safely call the tool again. Rewriting older tool messages also changes the request prefix, which can lower the prompt cache hit rate; to check this on your own usage, see [why a prompt cache hit rate is low](https://aivax.net/blog/low-prompt-cache-hit-rate-prefix-breakers-compaction/).

## Server-side tools

Server-side tools are internal functions executed by AIVAX during inference. They can come from:

- Built-in tools.
- Protocol functions.
- Remote protocol function sources.
- MCP sources.
- QueryFunction RAG.
- Skills.
- Optional bash environment.

Server-side tool events can be streamed to clients as `servertool` updates.

## Built-in tools

Built-in tools can be configured on a gateway or supplied per request with `builtin_tools`. Available built-in tool flags include:

- `DateTime` — current date and time through `get_date_time`; configure `dateTimeTimeZone` in built-in tool options (default: `America/Los_Angeles`, Pacific Time).

- `WebSearch`
- `AdvancedWebUsage` (disabled; returns an unavailable response. See [Changelogs](https://docs.aivax.net/docs/changelogs.md).)
- `OpenUrl`
- `Code`
- `Request`
- `Remember`
- `GenerateWebPage`
- `GenerateDocument`
- `XPostsSearch`
- `ImageGeneration`

See [Built-in tools](https://docs.aivax.net/docs/tools/builtin-tools.md).

## MCP and protocol functions

Tools listed by an MCP source become available to the model with their declared schemas. MCP tool results can include text, images, and audio; media results are attached to the conversation as additional messages when supported.

Protocol functions expose HTTP callbacks or AIVAX callback URLs as model-callable tools. Remote protocol function sources are fetched and cached before their tools become available to the model.

See [Protocol functions](https://docs.aivax.net/docs/tools/protocol-functions.md) and [MCP](https://docs.aivax.net/docs/tools/mcp.md).

## Function interpreter

A tool handler can add tool-calling behavior for models that do not reliably produce native tool calls. Supported values are:

- `native` or `null`: Use native model tool calling.
- `react.v1.selfcall`: Use the ReAct-style self-call handler.

If a handler name is not recognized, gateway configuration fails at inference time.

## Moderation

Moderation is an input gate that runs before the main model. When at least one moderation category is enabled, AIVAX sends the available textual conversation to a safeguard model. The safeguard evaluates the latest user request in the context established by the conversation and returns a score from 0 to 10 for every category.

| Category | Gateway property | What the safeguard evaluates |
| --- | --- | --- |
| **Violence and hate speech** | `violenceThreshold` | Violence, hate, extremism, threats, or encouragement of physical harm. |
| **Sexual and explicit content** | `sexualExplicitThreshold` | Sexually explicit or adult content. |
| **Political topics** | `politicalThreshold` | Political persuasion, campaigning, manipulation, or highly political content. |
| **Dangerous content** | `dangerousContentThreshold` | Weapons, explosives, cyber abuse, self-harm, or other dangerous acts and instructions. |
| **Jailbreak attempts** | `jailbreakThreshold` | Attempts to override instructions, reveal protected instructions, exfiltrate data, or inject prompts. |

### Understand sensitivity levels

The value configured in the gateway is a **sensitivity level**, not the safeguard score itself. A higher level lowers the score required to block the input.

| Sensitivity level | Safeguard scores that block |
| ---: | --- |
| `0` | Category disabled |
| `1` | `10` |
| `3` | `8`–`10` |
| `5` | `6`–`10` |
| `8` | `3`–`10` |
| `10` | `1`–`10` |

For enabled categories, the blocking cutoff is `11 - sensitivity level`. A safeguard score of `0` never blocks. Configure each category independently; the request is blocked when any enabled category reaches its cutoff.

### Add gateway-specific rules

**Additional moderation rules** let a gateway administrator describe policy that is not fully expressed by the built-in category descriptions. The safeguard reads these rules together with the built-in policy and uses them to calibrate all five scores.

For example:

```text
Allow users to describe accidents and injuries when asking for insurance coverage or assistance.
Treat requests for instructions to cause an accident or harm someone as dangerous content.
```

Additional rules guide classification; they do not create a separate score or block an input directly. At least one category must have a sensitivity level above `0` for moderation to run. In the example above, enable **Dangerous content** so the safeguard score can produce a blocking decision.

Write rules as short policy statements with explicit allowed and disallowed cases. Do not include secrets, credentials, or private operational data because the rules are stored with the gateway configuration and sent to the safeguard model during moderation.

The following gateway fragment enables different sensitivity levels and gives the safeguard domain-specific guidance. The values are an example, not a recommended production baseline:

```json
{
  "moderationParameters": {
    "violenceThreshold": 4,
    "sexualExplicitThreshold": 4,
    "politicalThreshold": 2,
    "dangerousContentThreshold": 6,
    "jailbreakThreshold": 7,
    "additionalRules": "Allow descriptions of accidents and injuries for insurance support. Treat instructions to cause accidents or harm someone as dangerous content."
  }
}
```

### What happens when an input is blocked

When any enabled category reaches its cutoff:

1. AIVAX marks the original conversation messages as unavailable to the main inference request.
2. AIVAX replaces them with an instruction identifying the categories that caused the block.
3. The main model generates a refusal instead of answering the original request.

The refusal is model-generated; moderation does not return a fixed response body. If every moderation model fails to produce a valid result, the request is not rejected. The main model instead receives strict instructions derived from the configured categories, sensitivity levels, and additional rules, and applies the policy itself. If your application must fail closed when moderation is unavailable, enforce that in your application or in a worker.

### Context and current limitations

The safeguard receives the available conversation history, not only the latest message. Message roles and text are preserved as untrusted serialized conversation data to reduce the chance that instructions inside the conversation override the safeguard policy. If the conversation exceeds the safeguard context window, older context can be truncated.

Moderation currently applies only to input text:

- Generated output is not moderated.
- Images, audio, video, and file contents are not analyzed. The safeguard receives only a marker indicating that media was present.
- Tool or worker authorization still requires application-level policy; moderation is not an authorization mechanism.
- Moderation adds a safeguard inference before the main inference, which adds latency and billable moderation usage.

Use moderation for broad safety policy. Use workers when the decision depends on external identity, account state, or business-specific policy.

For a decision guide on system prompts, a separate moderation step, and authorization, see [LLM input moderation: system prompt or separate moderation step?](https://aivax.net/blog/aivax-gateway-moderation/).

## Workers

Configure worker events and endpoint details in the gateway parameters; implement the event behavior at your external endpoint. See [AI Workers](https://docs.aivax.net/docs/inference/workers.md).
