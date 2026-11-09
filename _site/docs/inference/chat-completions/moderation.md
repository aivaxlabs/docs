Source: https://docs.aivax.net/docs/inference/chat-completions/moderation.html

# Moderation

Moderation enforces safety policy on user requests before the main model answers them. Use it to block unsafe or out-of-policy requests in user-facing assistants. Configure it in the **Content Moderation** section of the gateway editor or in `parameters.moderationParameters`.

Moderation is an AI Gateway setting; direct `chat/completions` calls with a model name do not run it, and requests cannot change it.

## Choose a mode

The `moderationParameters.mode` field selects how moderation runs:

| | `LayeredGuardrail` (default) | `SelfAssessment` |
| --- | --- | --- |
| Who decides | An independent safeguard model, before the main model | The main model itself |
| Extra inference | Yes, billed as moderation usage | No |
| Added latency | One safeguard inference | None |
| Isolation | Independent from the main model and its instructions | Depends on the main model's judgment |
| Model requirements | None | The main model must support tool calling |

- `LayeredGuardrail`: An independent safeguard model analyzes the conversation's input text before the main model. Flagged conversations are blocked, and the main model responds with a refusal. Moderation usage is billed as described in [Inference pricing](https://docs.aivax.net/docs/inference/chat-completions/concepts.md#pricing).
- `SelfAssessment`: No separate safeguard model runs, so there is no moderation analysis charge. The main model receives moderation instructions built from the same category sensitivity levels and additional rules, plus an internal refusal tool. When the model judges that the latest request reaches the boundary of an enabled category, it calls the tool with a reason, the violated categories, and a final message for the user. The inference ends immediately, other tool calls from that turn are skipped, the final message is returned as the assistant reply, and the response is marked as a refusal.

Because `SelfAssessment` relies on the main model's judgment instead of an independent classifier, it trades lower latency and cost for weaker isolation: it is not an independent layer, and enforcement quality depends on the model. Prefer `LayeredGuardrail` when jailbreak attempts are a real risk.

## Categories

In `LayeredGuardrail` mode, when at least one moderation category is enabled, AIVAX sends the available textual conversation to a safeguard model. The safeguard evaluates the latest user request in the context established by the conversation and returns a score from 0 to 10 for every category.

| Category | Gateway property | What the safeguard evaluates |
| --- | --- | --- |
| **Violence and hate speech** | `violenceThreshold` | Violence, hate, extremism, threats, or encouragement of physical harm. |
| **Sexual and explicit content** | `sexualExplicitThreshold` | Sexually explicit or adult content. |
| **Political topics** | `politicalThreshold` | Political persuasion, campaigning, manipulation, or highly political content. |
| **Dangerous content** | `dangerousContentThreshold` | Weapons, explosives, cyber abuse, self-harm, or other dangerous acts and instructions. |
| **Jailbreak attempts** | `jailbreakThreshold` | Attempts to override instructions, reveal protected instructions, exfiltrate data, or inject prompts. |

## Understand sensitivity levels

The value configured in the gateway is a **sensitivity level** from `0` to `10`, not the safeguard score itself. A higher level lowers the score required to block the input. Values outside this range are rejected when the gateway is saved.

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

## Add gateway-specific rules

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
    "mode": "LayeredGuardrail",
    "violenceThreshold": 4,
    "sexualExplicitThreshold": 4,
    "politicalThreshold": 2,
    "dangerousContentThreshold": 6,
    "jailbreakThreshold": 7,
    "additionalRules": "Allow descriptions of accidents and injuries for insurance support. Treat instructions to cause accidents or harm someone as dangerous content."
  }
}
```

## What happens when an input is blocked

When any enabled category reaches its cutoff:

1. AIVAX marks the original conversation messages as unavailable to the main inference request.
2. AIVAX replaces them with an instruction identifying the categories that caused the block.
3. The main model generates a refusal instead of answering the original request.

The refusal is model-generated; moderation does not return a fixed response body. In `SelfAssessment` mode, the main model produces the refusal itself through the refusal tool, as described above. Blocked requests are still billed for the moderation analysis and for the refusal generation.

In `LayeredGuardrail` mode, if every moderation model fails to produce a valid result, the request is not rejected. The main model instead receives strict instructions derived from the configured categories, sensitivity levels, and additional rules, and applies the policy itself. If your application must fail closed when moderation is unavailable, enforce that in your application or in a worker.

## Where moderation runs in the pipeline

Moderation runs once per request, before the agentic loop starts. See [Processing pipeline](https://docs.aivax.net/docs/inference/chat-completions/processing-pipeline.md) for the full order. As a consequence:

- [Workers](https://docs.aivax.net/docs/inference/workers.md) run first. A worker can block a request before moderation runs, and moderation evaluates the conversation as changed by the worker.
- Documents retrieved by injection [RAG strategies](https://docs.aivax.net/docs/inference/chat-completions/processing-pipeline.md#rag) are already in the last user message, so the safeguard evaluates them together with the user's text.
- Tool results produced later in the same request, including `QueryFunction` search results, are not moderated.
- [Multimodal pre-processing](https://docs.aivax.net/docs/inference/chat-completions/multimodal-pre-processing.md) runs afterwards, so media descriptions are not moderated.

## Context and current limitations

In `LayeredGuardrail` mode, the safeguard receives the available conversation history, not only the latest message. Message roles and text are preserved as untrusted serialized conversation data to reduce the chance that instructions inside the conversation override the safeguard policy. If the conversation exceeds the safeguard context window, older context can be truncated.

Moderation currently applies only to input text:

- Generated output is not moderated.
- Images, audio, video, and file contents are not analyzed. The safeguard receives only a marker indicating that media was present.
- Tool or worker authorization still requires application-level policy; moderation is not an authorization mechanism.
- In `LayeredGuardrail` mode, moderation adds a safeguard inference before the main inference, which adds latency and billable moderation usage (see [Inference pricing](https://docs.aivax.net/docs/inference/chat-completions/concepts.md#pricing)). `SelfAssessment` mode adds no separate inference.

Use moderation for broad safety policy. Use workers when the decision depends on external identity, account state, or business-specific policy.

For a decision guide on system prompts, a separate moderation step, and authorization, see [LLM input moderation: system prompt or separate moderation step?](https://aivax.net/blog/aivax-gateway-moderation/).
