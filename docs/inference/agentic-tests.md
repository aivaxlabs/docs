# Agentic Tests

Agentic Tests evaluates how an AI Gateway behaves across a complete, goal-oriented conversation instead of grading one isolated response. AIVAX simulates the user's next message, sends each turn to the selected gateway, and uses an independent judge to determine whether the conversation reached its goal, remains recoverable, or has persistently moved away from the expected outcome.

Use Agentic Tests to create repeatable regression checks for support, sales, onboarding, tool use, RAG, and other multi-turn agent flows. Because a test runs through the configured AI Gateway, it exercises the gateway's model, instructions, tools, skills, knowledge, and inference settings together.

## Persistent tests in the dashboard

Open **Agentic Tests** in the AIVAX dashboard to create and manage reusable test cases. A test stores:

- the AI Gateway under test;
- a goal that describes the expected conversational outcome and is shared with the simulated user and judge;
- optional validation criteria used only by the judge;
- optional starting messages and an external user identifier;
- simulated-user sampling, turn limits, exit behavior, and evaluation thresholds;
- an optional recurring schedule;
- failure and recovery notification settings.

The test definition is reusable. Each execution creates a separate run, so changing a test later does not replace the history already collected for previous runs.

### Create a useful test

Write the goal as an observable outcome rather than as instructions for the assistant. The goal is shared with both the simulated user, which pursues it, and the judge, which evaluates it. For example:

> Identify the customer's team size, recommend the correct plan, explain why it fits, and provide the next signup step.

Use **Validation criteria** for optional requirements that should affect only the judge's evaluation, not the simulated user's behavior. For example:

> The recommendation must name the selected plan and connect it to the stated team size. The final response must include a direct signup step.

Keeping these criteria separate prevents the simulated user from unnaturally steering the conversation toward the checks that the judge will apply.

Use **Start messages** when the scenario requires an established context, such as a customer objection, a prior assistant response, or a specific point in an existing flow. Use `external_user_id` when the gateway behavior depends on an identity from your own application. The value is forwarded to gateway inference for every run of that test.

A focused test usually gives more actionable results than one broad scenario. Separate unrelated goals into different tests so that a failure identifies the behavior that regressed.

### Run and inspect a test

Select **Run test** to queue an execution. Runs can be `pending`, `running`, `succeeded`, `failed`, or `cancelled`. Account-level concurrency depends on the current plan:

| Plan | Concurrent runs per account |
| --- | ---: |
| Free | 1 |
| Pro | 4 |
| Max | 8 |

A run processes its conversation sequentially, while eligible runs from the same account can execute concurrently. Every turn checks that the account can continue operating. A run can fail if the balance is exhausted or inference cannot continue, and a pending or running run can be cancelled from the dashboard.

The run inspector retains:

- simulated-user, assistant, and judge messages in chronological order;
- a precise timestamp for every retained message;
- prompt, cached prompt, and completion token usage per message;
- every judge opinion, including its reasoning, score, state, and trajectory values;
- the final evaluation result, failure information, and total cost charged to the run.

Use the judge opinions to identify the turn where the conversation improved, became at risk, succeeded, or entered a persistent loss. The run detail can also be exported as JSON for offline review.

### Schedule recurring tests

A test can run automatically from a standard five-field cron expression. The minimum supported interval is five minutes. For example, `*/15 * * * *` runs every 15 minutes.

Disable scheduling when you want to preserve the test definition without creating new scheduled runs. Manual runs remain available from the test page.

### Failure and recovery notifications

Enable failure notifications when repeated run execution failures should alert the account owner. **Notification threshold** controls how many consecutive runs in the `failed` state are required before AIVAX sends an alert. The default is `1`.

When **Recovery notification** is enabled, AIVAX also notifies the account after a run completes successfully following enough consecutive execution failures to reach the configured threshold. A successfully completed run resets the consecutive-failure counter.

### Retention

Succeeded and failed runs are retained for one month. Cancelled runs are retained for one day. Export any result that must remain available beyond those periods.

## Evaluation settings

| Setting | Default | Accepted values | Description |
| --- | ---: | --- | --- |
| `validation_criteria` | `null` | String, message part, or list of message parts | Optional requirements supplied only to the judge. They do not guide the simulated user or the gateway under test. |
| `profile` | `medium` | `low`, `medium`, `high` | Selects the capability and price tier used by the simulated user and judge. It does not replace the model configured on the gateway under test. |
| `max_turns` | `10` | `2`–`64` | Maximum number of simulated-user turns before the run ends. |
| `minimum_turns` | `1` | `1`–`63`, less than `max_turns` | First turn when the simulated user may receive the option to end the conversation. |
| `allow_user_exit` | `true` | Boolean | When enabled, the simulated-user prompt exposes the conversation exit token from `minimum_turns` onward. When disabled, that option is omitted from every simulated-user prompt. |
| `judge_start_turn` | `1` | `1`–`63`, less than `max_turns` | First turn evaluated by the judge. The final turn is always evaluated. |
| `loss_threshold` | `0.2` | `0.01`–`0.99` | Boundary used to identify a persistently unsuccessful trajectory. |
| `base_threshold` | `0.9` | `0.01`–`0.99` | Score at or above which the goal is considered reached. It must be greater than `loss_threshold`, with more than `0.1` between them. |
| `user_sampling.top_k` | `0.4` | `0`–`2` | Controls how many sampled communication characteristics guide the simulated user. Higher values increase variation. |
| `user_sampling.max_decay` | `0.02` | `0`–`1` | Controls how sampled user characteristics may change between turns. |

Reduce `max_turns` for fast, bounded regression checks. Increase it for flows that naturally require discovery or several tool calls. `minimum_turns` and `judge_start_turn` must each be less than `max_turns`; they are otherwise independent. Delay `judge_start_turn` when early clarification is expected and intermediate scores are not useful. Disable `allow_user_exit` when only the judge or the turn budget should end the test; `minimum_turns` controls only when the simulated user sees its exit option and does not delay judge decisions. Keep a wide gap between the loss and success thresholds unless the policy has been calibrated against representative conversations.

Agentic Tests bills the selected gateway inference plus simulated-user and judge usage at the rates of the selected profile. See [Pricing](../pricing.md#agentic-tests) for current rates.

## Direct API execution

Use the direct generation endpoint when an application needs to run an ephemeral test and consume its events immediately. A direct execution does **not** create a persistent test case or run in the dashboard.

Authenticate with a private AIVAX API key, send `Accept: text/event-stream`, and keep the key on a trusted backend. Do not expose a private key in browser code or a distributed application bundle.

<script src="https://inference.aivax.net/apidocs?embed-target=Evaluate%20Tests&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

The request accepts the same core evaluation settings as a persistent test. Use `model` for the AI Gateway slug, `goal` for the desired outcome shared with the simulated user and judge, `validation_criteria` for optional judge-only requirements, `minimum_turns` and `allow_user_exit` to control when the simulated user sees its exit option, `judge_start_turn` to schedule judge evaluation, `start` for optional initial messages, and `external_user_id` for an identity forwarded to gateway inference.

Every Server-Sent Events message contains this envelope:

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

Route messages by `event.type` and concatenate streamed content chunks in order. The examples below show the `event` object inside the SSE envelope.

- **`chat.start`** — Starts a turn and reports its number and remaining turn budget.

  ```json
  {
    "type": "chat.start",
    "data": {
      "turn_number": 1,
      "max_remaining_turns": 10
    }
  }
  ```

- **`chat.user_message.start_generation`** — Marks the start of simulated-user message generation.

  ```json
  {
    "type": "chat.user_message.start_generation",
    "data": null
  }
  ```

- **`chat.user_message.reasoning`** — Streams one reasoning chunk exposed by the simulated-user model. Use this for debugging only.

  ```json
  {
    "type": "chat.user_message.reasoning",
    "data": {
      "reasoning_content": "Okay, the user is"
    }
  }
  ```

- **`chat.user_message.content`** — Streams one simulated-user message content chunk. Concatenate consecutive chunks in arrival order.

  ```json
  {
    "type": "chat.user_message.content",
    "data": {
      "content": "Can you explain the refund policy?"
    }
  }
  ```

- **`chat.user_message.end_generation`** — Marks the end of simulated-user message generation.

  ```json
  {
    "type": "chat.user_message.end_generation",
    "data": null
  }
  ```

- **`chat.user_message.end_conversation`** — Reports a permitted simulated-user exit after `minimum_turns`. This event is not emitted when `allow_user_exit` is disabled.

  ```json
  {
    "type": "chat.user_message.end_conversation",
    "data": {
      "reason": "simulated_user_ended_conversation"
    }
  }
  ```

- **`chat.assistant_message.start_generation`** — Marks the start of the selected gateway response.

  ```json
  {
    "type": "chat.assistant_message.start_generation",
    "data": null
  }
  ```

- **`chat.assistant_message.reasoning`** — Streams one reasoning chunk exposed by the gateway model.

  ```json
  {
    "type": "chat.assistant_message.reasoning",
    "data": {
      "reasoning_content": "I should answer with the applicable policy and next steps."
    }
  }
  ```

- **`chat.assistant_message.content`** — Streams one assistant response content chunk. Concatenate consecutive chunks in arrival order.

  ```json
  {
    "type": "chat.assistant_message.content",
    "data": {
      "content": "Refunds are available within 30 days."
    }
  }
  ```

- **`chat.assistant_message.end_generation`** — Marks the end of the selected gateway response.

  ```json
  {
    "type": "chat.assistant_message.end_generation",
    "data": null
  }
  ```

- **`chat.judge.turn_analysis_start`** — Marks the start of an evaluation against the goal and any judge-only validation criteria.

  ```json
  {
    "type": "chat.judge.turn_analysis_start",
    "data": null
  }
  ```

- **`chat.judge.turn_analysis_result_ready`** — Returns the judge reasoning, normalized score, current state, trajectory measurements, and continuation decision. `score` ranges from `0.001` to `0.999`; `pass` is false only after a persistent loss is established.

  ```json
  {
    "type": "chat.judge.turn_analysis_result_ready",
    "data": {
      "result": {
        "reasoning": "The response satisfied the requested outcome and validation criteria.",
        "score": 0.92,
        "pass": true,
        "should_continue": false,
        "state": "success",
        "turn_delta": 0.84,
        "conversation_delta": 1.0,
        "loss_streak": 0,
        "required_loss_streak": 2
      }
    }
  }
  ```

- **`chat.judge.turn_analysis_end`** — Marks the end of the current turn evaluation.

  ```json
  {
    "type": "chat.judge.turn_analysis_end",
    "data": null
  }
  ```

- **`usage_updated`** — Reports prompt, cached prompt, and completion token usage. `role` is `user`, `assistant`, or `judge` depending on the inference that produced the usage.

  ```json
  {
    "type": "usage_updated",
    "data": {
      "role": "judge",
      "usage": {
        "prompt_tokens": 1240,
        "cached_prompt_tokens": 320,
        "completion_tokens": 180
      }
    }
  }
  ```

- **`unhandled_error`** — Reports an inference error, its scope, and whether the operation will be retried. `scope` is `user_inference`, `gateway_inference`, or `judge_analysis`.

  ```json
  {
    "type": "unhandled_error",
    "data": {
      "error": "The inference provider is temporarily unavailable.",
      "scope": "gateway_inference",
      "will_retry": true
    }
  }
  ```

- **`chat.validation.end`** — Reports the final outcome and closes the evaluation. The legacy event name is preserved for compatibility. `score` is included when the final outcome follows a judge evaluation, but may be absent when the turn budget is exhausted.

  ```json
  {
    "type": "chat.validation.end",
    "data": {
      "outcome": "success",
      "reason": "baseline_reached",
      "state": "success",
      "turn_number": 3,
      "score": 0.92,
      "conversation_delta": 1.0,
      "loss_streak": 0
    }
  }
  ```

The judge state can be `active`, `at_risk`, `success`, or `loss`. A weak turn does not immediately fail a recoverable conversation: the low score and cumulative trajectory must remain at or below the configured loss threshold for the required consecutive evaluations.

Final outcomes are:

| Outcome | Meaning |
| --- | --- |
| `success` | The judge reached `base_threshold`, or the simulated user declared the goal complete. |
| `loss` | The score and cumulative trajectory remained at or below `loss_threshold` for the required consecutive judged turns. |
| `incomplete` | The conversation exhausted `max_turns` without reaching success or a persistent loss. |

A missing or invalid key returns `401 Unauthorized`; a public API key returns `403 Forbidden`; insufficient balance returns `402 Payment Required`; and malformed fields, unavailable gateway slugs, or invalid threshold combinations return `400 Bad Request`. An inference failure can instead arrive as an SSE event after streaming begins.
