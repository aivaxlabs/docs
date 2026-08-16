# Agentic Validations API

Agentic Validations tests how an AI model or Gateway behaves across a complete, goal-oriented conversation rather than evaluating one isolated answer. AIVAX simulates the user's next message, sends each turn to the selected model or gateway, and uses an independent judge to measure whether the conversation reached the stated goal, remains recoverable, or has persistently moved away from it.

The validation runs for up to 64 turns and returns a Server-Sent Events (SSE) stream containing the simulated conversation, token usage, judge analyses, and final outcome. When you select an AI Gateway, the validation exercises its instructions, model, tools, RAG, and other configured behavior.

## When to use

Use Agentic Validations when you need to:

- test whether an agent can complete a multi-step support, sales, onboarding, or operational flow;
- detect conversations that appear acceptable turn by turn but fail to reach their goal;
- compare gateway instructions, models, tools, or knowledge configurations against the same goal;
- run regression checks after changing an AI Gateway;
- inspect the turn where a conversation succeeds, becomes at risk, or becomes irrecoverable.

Use a regular chat completion when you need the assistant's response to a real user. Agentic Validations generates a synthetic user and may intentionally vary that user's communication style, so it is intended for evaluation rather than production conversations.

## Integration and events

Authenticate with a private AIVAX API key and an account with a positive balance.

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/validations</span>
</div>

Send `Accept: text/event-stream`. Every SSE message contains a JSON object in its `data` field:

```json
{
  "timestamp": 1786329000000,
  "event": {
    "type": "chat.start",
    "data": {
      "turn_number": 1,
      "max_remaining_turns": 10
    }
  }
}
```

Route messages by `event.type`. The examples below show the contents of `event.data`; each is wrapped in the envelope shown above.

| Event | Example `event.data` | Meaning |
| --- | --- | --- |
| `chat.start` | `{ "turn_number": 1, "max_remaining_turns": 10 }` | Starts a turn and reports its number and remaining turn budget. |
| `chat.user_message.start_generation` | `{}` | Starts generation of a simulated user message. It is omitted when `start` already ends with a user message. |
| `chat.user_message.reasoning` | `{ "reasoning_content": "The user still needs to provide the team size." }` | Streams available reasoning for the simulated user. |
| `chat.user_message.content` | `{ "content": "We have a team of " }` | Streams one simulated-user text chunk. Concatenate `content` chunks in order. |
| `chat.user_message.end_generation` | `{}` | Completes the simulated user message. |
| `chat.user_message.end_conversation` | `{ "reason": "simulated_user_declared_goal_reached" }` | Reports that the simulated user considers the goal reached. |
| `chat.assistant_message.start_generation` | `{}` | Starts the selected model or gateway response. |
| `chat.assistant_message.reasoning` | `{ "reasoning_content": "I should compare the plans against the stated requirements." }` | Streams reasoning exposed by the selected model or gateway. |
| `chat.assistant_message.content` | `{ "content": "The Pro plan is the best fit" }` | Streams one assistant text chunk. Concatenate `content` chunks in order. |
| `chat.assistant_message.end_generation` | `{}` | Completes the selected model or gateway response. |
| `chat.judge.turn_analysis_start` | `{}` | Starts evaluation of the conversation against `goal`. |
| `chat.judge.turn_analysis_result_ready` | `{ "result": { "reasoning": "The assistant met the goal.", "score": 0.91, "pass": true, "should_continue": false, "state": "success", "turn_delta": 0.82, "conversation_delta": 1.0, "loss_streak": 0, "required_loss_streak": 2 } }` | Returns the turn score, reasoning, trajectory, state, and whether validation should continue. |
| `chat.judge.turn_analysis_end` | `{}` | Completes evaluation of the turn. |
| `usage_updated` | `{ "role": "assistant", "usage": { "prompt_tokens": 420, "cached_prompt_tokens": 120, "completion_tokens": 85 } }` | Reports token usage. `role` is `user`, `assistant`, or `judge`. |
| `unhandled_error` | `{ "error": "The inference provider is temporarily unavailable.", "scope": "gateway_inference", "will_retry": true }` | Reports an inference error after streaming has started. `scope` is `user_inference`, `gateway_inference`, or `judge_analysis`; `will_retry` indicates whether the operation will be attempted again. |
| `chat.validation.end` | `{ "outcome": "success", "reason": "baseline_reached", "state": "success", "turn_number": 3, "score": 0.91, "conversation_delta": 1.0, "loss_streak": 0 }` | Final event. Its fields depend on how the validation ended, as shown below. |

The judge result includes a normalized `score` for the latest evaluation and a cumulative `conversation_delta`. Its `state` is `active`, `at_risk`, `success`, or `loss`. A low score must persist for two judged turns before the conversation ends as a loss, which prevents one weak answer or clarification request from failing an otherwise recoverable validation.

The final `chat.validation.end` outcome is:

| Outcome | Example `event.data` | Meaning |
| --- | --- | --- |
| `success` | `{ "outcome": "success", "reason": "baseline_reached", "state": "success", "turn_number": 3, "score": 0.91, "conversation_delta": 1.0, "loss_streak": 0 }` | The judge reached `base_threshold`. When the simulated user declares the goal complete, `reason` is `simulated_user_declared_goal_reached` and `score` is omitted. |
| `loss` | `{ "outcome": "loss", "reason": "loss_threshold_persisted", "state": "loss", "turn_number": 4, "score": 0.12, "conversation_delta": 0.08, "loss_streak": 2 }` | The latest score stayed at or below `loss_threshold` for two consecutive judged turns and the cumulative trajectory was also at or below that threshold. |
| `incomplete` | `{ "outcome": "incomplete", "reason": "max_turns_reached", "state": "max_turns", "turn_number": 8, "conversation_delta": 0.56, "loss_streak": 0 }` | The validation exhausted `max_turns` without success or persistent loss; `score` is omitted. |

The connection closes after the final event. A missing or invalid key returns `401 Unauthorized`; a public API key returns `403 Forbidden`; insufficient balance returns `402 Payment Required`; malformed fields, unresolved gateway slugs, and invalid threshold combinations return `400 Bad Request`. A model-provider or inference failure can instead be reported after the SSE connection has started.

## Adjust parameters for your needs

The request accepts:

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `model` | `string` | Yes | — | Model identifier or AI Gateway slug to validate. Use a gateway slug to exercise its complete configured behavior. |
| `goal` | `string`, content object, or content array | Yes | — | Non-empty description of what the conversation should achieve. Multimodal message content is accepted in the same format as inference message content. |
| `start` | message array | No | `[]` | Existing conversation used as the starting context. If its final message has the `user` role, the gateway responds to it before another user message is simulated. |
| `profile` | `string` | No | `medium` | Model tier used for simulated-user generation and judging. Accepted values are `low`, `medium`, and `high`. |
| `max_turns` | `integer` | No | `10` | Maximum number of assistant turns, from `1` through `64`. |
| `judge_start_turn` | `integer` | No | `1` | First turn evaluated by the judge, from `1` through `max_turns`. The final turn is always evaluated. |
| `loss_threshold` | `number` | No | `0.2` | Score and cumulative-trajectory boundary used to identify a persistent loss, from `0.01` through `0.99`. |
| `base_threshold` | `number` | No | `0.9` | Score at or above which the goal is considered reached, from `0.01` through `0.99`. It must be greater than `loss_threshold`, with more than `0.1` between them. |
| `user_sampling.top_k` | `number` | No | `0.4` | Controls how many randomly sampled communication characteristics guide the simulated user, from `0` through `2`. Higher values increase variation. |
| `user_sampling.max_decay` | `number` | No | `0.02` | Controls whether sampled user characteristics are refreshed between turns, from `0` through `1`. With the current sampler, `0` and `1` keep the initial sample; values between them refresh more often as the value approaches `0`. |
| `user` | `string` | No | — | External user identifier propagated through the selected gateway's inference context. |
| `metadata` | string-valued object | No | `{}` | Metadata propagated through the selected gateway's inference context. |
| `stream` | `boolean` | No | `false` | Accepted for request compatibility. The current endpoint always returns an SSE stream, including when this value is `false`. |

Choose `low` for economical smoke tests and high-volume checks, `medium` for a balance of evaluation quality and cost, or `high` when complex behavior benefits from the strongest judge. Start with the default `medium` profile for general regression checks.

Reduce `max_turns` for fast, bounded tests. Increase it for flows that naturally require discovery or several tool calls. Delay `judge_start_turn` when early clarification is expected and you do not need intermediate scores, which also avoids judge usage for those early turns. Keep a wide gap between the two thresholds unless your evaluation policy has been calibrated against representative conversations.

Agentic Validations bills the selected gateway inference plus the simulated-user and judge token usage at the rates of the selected `profile`. See [Pricing](../pricing.md#agentic-validations) for the current rates. Lower-cost profiles, fewer turns, and later judge evaluation generally reduce total usage.

## Integration example

The following Node.js example starts a validation and reads complete SSE frames without assuming that each network chunk contains one event:

```js
const response = await fetch("https://inference.aivax.net/api/v1/generations/validations", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.AIVAX_API_KEY}`,
    Accept: "text/event-stream",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "<GATEWAY_SLUG>",
    goal: "Help the customer choose the correct plan and clearly explain the next step.",
    start: [
      {
        role: "user",
        content: "We have a small team and need to search our internal documentation."
      }
    ],
    profile: "medium",
    max_turns: 8,
    judge_start_turn: 2,
    loss_threshold: 0.2,
    base_threshold: 0.9,
    user_sampling: {
      top_k: 0.4,
      max_decay: 0.02
    },
    metadata: {
      test_suite: "plan-recommendation"
    }
  })
});

if (!response.ok) {
  throw new Error(`Validation failed with HTTP ${response.status}: ${await response.text()}`);
}

const decoder = new TextDecoder();
let buffer = "";

for await (const chunk of response.body) {
  buffer += decoder.decode(chunk, { stream: true }).replaceAll("\r\n", "\n");
  const frames = buffer.split("\n\n");
  buffer = frames.pop() ?? "";

  for (const frame of frames) {
    const data = frame
      .split("\n")
      .filter(line => line.startsWith("data:"))
      .map(line => line.slice(5).trimStart())
      .join("\n");

    if (!data) continue;

    const message = JSON.parse(data);
    const { type, data: eventData } = message.event;

    if (type === "chat.assistant_message.content") {
      process.stdout.write(eventData.content);
    } else if (type === "chat.judge.turn_analysis_result_ready") {
      console.log("\nJudge:", eventData.result);
    } else if (type === "chat.validation.end") {
      console.log("\nValidation:", eventData);
    }
  }
}
```

Keep the private API key on a trusted backend. Do not expose this request directly from browser code or a distributed application bundle.
