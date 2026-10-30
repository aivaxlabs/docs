---
{title: Processing Pipeline,linkTitle: Processing pipeline,weight: 60,group: Inference}
---

# Processing Pipeline

AI Gateway pipelines are the processing steps AIVAX applies before and during inference. They can add context, rewrite queries, expose tools, moderate input, route models, truncate conversations, and call external workers.

Most pipelines are configured in the [AI Gateway](/docs/inference/ai-gateway) parameters. Request-level options can override some inference parameters on direct [`chat/completions`](/docs/inference/inference) calls.

## RAG

The RAG pipeline adds knowledge from your documents to the model context. It links [collections](/docs/rag/collections) to an AI Gateway. The gateway controls:

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
- `QueryFunction`: Adds a query function to the model. The model decides when to search the linked collections, and search results are returned as tool responses. The model can narrow a search with an optional [document filter](/docs/rag/document-filters).

Rewrite strategies add resolver-model cost (see [Pricing](/docs/pricing)) and latency. They are useful when users ask follow-up questions such as "what about this case?" because the resolver can turn the recent conversation into a clearer search query.

Defining many RAG results increases input token usage and can increase final inference cost (see [Pricing](/docs/pricing)). Start with a small result count and raise it only when the model lacks enough evidence.

## Instructions

Instruction settings shape the provider-facing prompt:

- **System instructions**: Added to the system instruction set.
- **Remote system instruction sources**: Fetched from configured URLs and added to the system instruction set.
- **User prompt template**: Replaces `{prompt}` with each user message's text before sending it to the model.
- **Assistant prefill**: Adds initial assistant content before generation when the model supports prefill.

Remote instruction sources are fetched as text, and each response can be at most 5 MB. Their cache duration is configurable from 0 (no caching) to 86,400 seconds; the default is 600 seconds.

If a source cannot be read (response over the limit, failed request, or unsafe URL), it contributes no text and the request itself does not fail. Keep these failure rules in mind:

- A failed fetch (an HTTP error such as 404 or 500, a connection error, a private URL, or a response over the limit) is cached for the full cache duration, like a successful one.
- There is no stale-if-error fallback. If a previously good source expires during an outage, the model receives only the `# <name>` title with no body (or nothing, if the source has no name).
- No error or log entry is shown when this happens.

Some models do not support assistant prefill, temperature, stop sequences, or reasoning effort. Integrated model validation rejects incompatible gateway settings when those limitations are known.

## Skills

Skills are on-demand instruction packs available to the model. Use them for specialized instructions that only some tasks need. When a gateway enables skills, AIVAX loads the account skills configured on the gateway and can expose skill-related built-in functions.

Read more about [skills](/docs/inference/skills).

## Multimodal pre-processing

Multimodal pre-processing converts selected media content into text before the main model call. Each content type (images, audio, video, and files) uses its own engine: a smaller (`InferenceLow`) or larger (`InferenceHigh`) multimodal model, OCR for images and files, or speech-to-text for audio. See [Multimodal pre-processing](/docs/inference/inference#multimodal-pre-processing) for the accepted engines.

The gateway setting `multimodalResolverParameters` replaces the deprecated `enabledMultimodalFeatures` flags. Gateways that still use the flags keep working with the equivalent engines until `multimodalResolverParameters` is set.

Use pre-processing when the main model is text-first or when you want AIVAX to normalize media into textual context. For direct multimodal models, send the original media without pre-processing so the model can inspect it directly.

Results are cached by content and engine for reuse.

## Parameterization

The parameterization pipeline sets default model request options for the gateway, such as:

- `temperature`
- `top_p`
- `presence_penalty`
- `frequency_penalty`
- `stop`
- `max_completion_tokens`
- `reasoning_effort`
- `verbosity`
- `seed`

Request-level values can override gateway values when the endpoint supports the parameter. `frequency_penalty` is configured only on the gateway and is not overridden per request. Some integrated models reject specific parameters, and BYOK providers may have their own restrictions.

## Context truncation

Context truncation keeps long conversations within a maximum input size. It uses an approximate token count. When `ContextMaximumSize` is set and the conversation exceeds the limit, the gateway follows `ContextOverflowAction`:

- `Throw`: Return an error instead of calling the model.
- `Truncate`: Remove the oldest non-system messages until the remaining conversation messages fit. The request continues even if the prompt, including system instructions and retrieved RAG context, still exceeds the limit.
- `TruncateHard`: Truncate as above, but fail the request with a message-size error if the prompt still exceeds the limit afterwards.

Truncation preserves system messages and keeps at least one user message when possible.

On lower plans, the effective input context may be capped even when a larger context is configured; see [Plans and limits](/docs/limits#account-limits).

## Tool message truncation

`ToolContextCount` controls how many recent tool response messages keep their original content. When it is set to a value greater than zero, older tool messages remain in the conversation but their content is replaced with:

```text
[tool response truncated - call this tool again]
```

This can reduce context usage in long agentic conversations. It can also hurt chains where an old tool result remains important, so use it only when the model can safely call the tool again.

Rewriting older tool messages also changes the request prefix, which can lower the prompt cache hit rate; to check this on your own usage, see [why a prompt cache hit rate is low](https://aivax.net/blog/low-prompt-cache-hit-rate-prefix-breakers-compaction/).

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

- `DateTime` — current date and time through `get_date_time`, in the gateway time zone (`parameters.timeZone`, default `America/Sao_Paulo`).

- `WebSearch`
- `AdvancedWebUsage` (disabled; returns an unavailable response. See [Changelogs](../legal/changelogs.md).)
- `OpenUrl`
- `Code`
- `Request`
- `Remember`
- `GenerateWebPage`
- `GenerateDocument`
- `XPostsSearch`
- `ImageGeneration`

See [Built-in tools](/docs/tools/builtin-tools).

## MCP and protocol functions

Tools listed by an MCP source become available to the model with their declared schemas. MCP tool results can include text, images, and audio; media results are attached to the conversation as additional messages when supported.

Protocol functions expose HTTP callbacks or AIVAX callback URLs as model-callable tools. Remote protocol function sources are fetched and cached before their tools become available to the model.

See [Protocol functions](/docs/tools/protocol-functions) and [MCP](/docs/tools/mcp).

## Function interpreter

The function interpreter, also called the tool handler, adds tool-calling behavior for models that do not reliably produce native tool calls. Supported values are:

- `native` or `null`: Use native model tool calling.
- `react.v1.selfcall`: Use the ReAct-style self-call handler.

If a handler name is not recognized, gateway configuration fails at inference time.

## Moderation

Moderation enforces safety policy on user requests before the main model answers them. Use it to block unsafe or out-of-policy requests.

The `moderationParameters.mode` field selects how moderation runs:

- `LayeredGuardrail` (default): An independent safeguard model analyzes the conversation's input text before the main model. Flagged conversations are blocked, and the main model responds with a refusal. Moderation usage is billed as described in [Inference pricing](inference.md#pricing).
- `SelfAssessment`: No separate safeguard model runs, so there is no moderation analysis charge. The main model receives moderation instructions built from the same category sensitivity levels and additional rules, plus an internal refusal tool. When the model judges that the latest request reaches the boundary of an enabled category, it calls the tool with a reason, the violated categories, and a final message for the user. The inference ends immediately, other tool calls from that turn are skipped, the final message is returned as the assistant reply, and the response is marked as a refusal. The request is rejected when the selected model does not support tool calling.

Because `SelfAssessment` relies on the main model's judgment instead of an independent classifier, it trades lower latency and cost for weaker isolation: it is not an independent layer, and enforcement quality depends on the model.

In `LayeredGuardrail` mode, when at least one moderation category is enabled, AIVAX sends the available textual conversation to a safeguard model. The safeguard evaluates the latest user request in the context established by the conversation and returns a score from 0 to 10 for every category.

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

In `SelfAssessment` mode, the same sensitivity levels define the boundary the main model must enforce, although there is no numeric safeguard score.

### Add gateway-specific rules

**Additional moderation rules** let a gateway administrator describe policy that is not fully expressed by the built-in category descriptions. The safeguard reads these rules together with the built-in policy and uses them to calibrate all five scores. In `SelfAssessment` mode, the main model receives the same rules with its moderation instructions.

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

The refusal is model-generated; moderation does not return a fixed response body. In `SelfAssessment` mode, the main model produces the refusal itself through the refusal tool, as described above.

In `LayeredGuardrail` mode, if every moderation model fails to produce a valid result, the request is not rejected. The main model instead receives strict instructions derived from the configured categories, sensitivity levels, and additional rules, and applies the policy itself. If your application must fail closed when moderation is unavailable, enforce that in your application or in a worker.

### Context and current limitations

In `LayeredGuardrail` mode, the safeguard receives the available conversation history, not only the latest message. Message roles and text are preserved as untrusted serialized conversation data to reduce the chance that instructions inside the conversation override the safeguard policy. If the conversation exceeds the safeguard context window, older context can be truncated.

Moderation currently applies only to input text:

- Generated output is not moderated.
- Images, audio, video, and file contents are not analyzed. The safeguard receives only a marker indicating that media was present.
- Tool or worker authorization still requires application-level policy; moderation is not an authorization mechanism.
- In `LayeredGuardrail` mode, moderation adds a safeguard inference before the main inference, which adds latency and billable moderation usage (see [Inference pricing](inference.md#pricing)). `SelfAssessment` mode adds no separate inference.

Use moderation for broad safety policy. Use workers when the decision depends on external identity, account state, or business-specific policy.

For a decision guide on system prompts, a separate moderation step, and authorization, see [LLM input moderation: system prompt or separate moderation step?](https://aivax.net/blog/aivax-gateway-moderation/).

## Workers

Workers call your external endpoint during gateway events, so your own code can allow, stop, or change the request. Configure worker events and endpoint details in the gateway parameters, and implement the event behavior at your endpoint. See [AI Workers](/docs/inference/workers).
