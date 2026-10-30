---
{title: Agentic Tests,linkTitle: Agentic Tests,weight: 40,group: Inference}
---

# Agentic Tests

Agentic Tests evaluate how an AI Gateway behaves across a complete, goal-oriented conversation instead of grading one isolated response. On each turn, AIVAX:

1. simulates the user's next message;
2. sends it to the selected gateway;
3. asks an independent judge whether the conversation reached its goal, remains recoverable, or has persistently moved away from the expected outcome.

You can run tests in two ways: as [persistent tests in the dashboard](#persistent-tests-in-the-dashboard), with history, schedules, and notifications, or as ephemeral evaluations through [direct API execution](#direct-api-execution).

Use Agentic Tests to create repeatable regression checks for support, sales, onboarding, tool use, RAG, and other multi-turn agent flows. Because a test runs through the configured AI Gateway, it exercises the gateway's model, instructions, tools, skills, knowledge, and inference settings together.

## Persistent tests in the dashboard

Open **Agentic Tests** in the AIVAX dashboard to create and manage reusable test cases. A test stores:

- the AI Gateway under test;
- a goal that describes the expected conversational outcome and is shared with the simulated user and judge;
- optional validation criteria used only by the judge;
- optional starting messages, external resources, and an external user identifier;
- simulated-user sampling, turn limits, exit behavior, and evaluation thresholds;
- an optional recurring schedule;
- failure and recovery notification settings.

The test definition is reusable. Each execution creates a separate run, so changing a test later does not replace the history already collected for previous runs.

### Create a useful test

Write the goal from the simulated user's perspective: describe who they are, what they want, and how they should progress through the conversation. Do not write it as instructions for the assistant. The goal is shared with both the simulated user, which pursues it, and the judge, which evaluates it. For example:

> You are choosing a plan for your team. Explain your team's size and needs when asked, ask which plan fits, and continue until you understand the recommendation and how to sign up.

Use **Validation criteria** for optional requirements that should affect only the judge's evaluation, not the simulated user's behavior. For example:

> The recommendation must name the selected plan and connect it to the stated team size. The final response must include a direct signup step.

Keeping these criteria separate prevents the simulated user from unnaturally steering the conversation toward the checks that the judge will apply.

Use **Start messages** when the scenario requires an established context, such as a customer objection, a prior assistant response, or a specific point in an existing flow.

Use `external_user_id` when the gateway behavior depends on an identity from your own application. The value is forwarded to gateway inference for every run of that test.

Use `resources` to give the simulated user and judge shared context that does not belong in the initial conversation. Provide objects with a `type` and non-empty `data` value; a test accepts up to 16 resources (see [Pricing and limits](#pricing-and-limits)). `Text` uses `data` as literal context; `RemoteResource` retrieves the content from the URL in `data`. For example:

```json
{
  "resources": [
    {
      "type": "Text",
      "data": "The customer has a 14-day refund window."
    },
    {
      "type": "RemoteResource",
      "data": "https://example.com/refund-policy"
    }
  ]
}
```

Keep in mind how resources are used:

- `visibility` decides who receives a resource: `Internal` (the default) shows it to the simulated user and judge only, `Gateway` shows it to the gateway under test only, and `Both` shows it to all three. An `Internal` resource is not sent to the gateway and adds no knowledge to it. A `Gateway` or `Both` resource gives the gateway extra context during the test, so use it only for material your application also supplies at run time, such as current account state. If the assistant must retrieve the same material in production, make it available through the gateway's own knowledge or tools.
- The simulated user may still reveal resource information naturally in its messages, so do not treat resources as hidden judge-only criteria. Use **Validation criteria** for that.

Remote content can change between test runs and contributes to usage. Use only trusted, publicly reachable URLs whose content is appropriate for the test.

A focused test usually gives more actionable results than one broad scenario. Separate unrelated goals into different tests so that a failure identifies the behavior that regressed.

Follow the [multi-turn conversation testing walkthrough](https://aivax.net/blog/introducing-agentic-tests/) to define observable goals, run a simulated conversation, and inspect recovery.

### Validation hooks

Validation hooks let your own service observe a persisted run and stop it when a check fails, for example to inspect the conversation after each gateway response. Configure the `hooks` array when creating or updating a test:

```json
{
  "hooks": [
    {
      "event": "before-test",
      "url": "https://validator.example/hooks/agentic-tests"
    },
    {
      "event": "after-test",
      "url": "https://validator.example/hooks/agentic-tests"
    },
    {
      "event": "before-inference",
      "url": "https://validator.example/hooks/gateway"
    },
    {
      "event": "after-inference",
      "url": "https://validator.example/hooks/gateway"
    },
    {
      "event": "context-changed",
      "url": "https://validator.example/hooks/agentic-tests"
    }
  ]
}
```

The supported events are:

| Event | When it is sent | Event data |
|---|---|---|
| `before-test` | Before the first simulated turn. | `gateway`, `goal`, and `metadata`. |
| `after-test` | After the test reaches a normal terminal outcome and before the final event is emitted. | The final outcome, reason, state, turn number, score, conversation delta, and loss streak. |
| `before-inference` | Once before the primary gateway inference of each turn. | `turn_number` and the current `messages` array. |
| `after-inference` | Once after the primary gateway inference of each turn. | `turn_number` and the current `messages` array. |
| `context-changed` | Once per turn after the gateway response has completed. | `turn_number` and the current `messages` array. |

`before-inference` and `after-inference` are available only when the test targets an AI Gateway. Hooks are supported for persisted dashboard tests and scheduled runs; the direct SSE validation endpoint does not accept `hooks`.

Each hook receives a worker-compatible JSON envelope:

```json
{
  "testId": "<AGENTIC_TEST_ID>",
  "runId": "<AGENTIC_TEST_RUN_ID>",
  "gatewayId": "<GATEWAY_ID>",
  "moment": "2026-08-16T03:00:00Z",
  "event": {
    "name": "before-inference",
    "data": {
      "turn_number": 1,
      "messages": []
    }
  }
}
```

The hook URL must be an absolute HTTP or HTTPS URL without embedded credentials and must not resolve to localhost, loopback, private, link-local, or other blocked local addresses. When the account has a hook key, AIVAX also sends `X-Request-Nonce`; validate it before trusting the payload. Hook requests use `POST` with `Content-Type: application/json`.

Hook responses follow the [worker](/docs/inference/workers) convention:

- Any `2xx` response continues the run.
- A non-`2xx` response or an HTTP request failure interrupts the run immediately.
- The response body does not select another action.

An interrupted run is stored as `failed` and emits a terminal result with `reason: "validation_hook_interrupted"`. The run's `result.hooks` array records an audit entry for each hook call, with the event, URL, timestamp, status or error, whether execution continued, and up to 4,000 characters of the response body.

### Run and inspect a test

Select **Run test** to queue an execution. Runs can be `pending`, `running`, `succeeded`, `failed`, or `cancelled`. Both the rate of new runs and account-level concurrency depend on the current plan. See [Pricing and limits](#pricing-and-limits) for current values.

Manual runs, scheduled runs, and direct API evaluations share one new-run quota across the account's API keys. A persisted run counts when it is queued and does not count again when execution begins. Conversation turns do not consume additional run units, although applicable inference limits still apply. A manual run request above the quota returns HTTP 429 without creating a run; wait for the rate-limit window to clear before retrying.

A run processes its conversation turn by turn, while eligible runs from the same account can execute concurrently. Before every turn, AIVAX checks that the account can continue operating. A run can fail if the balance is exhausted or inference cannot continue. You can cancel a pending or running run from the dashboard.

The run inspector retains:

- simulated-user, assistant, and judge messages in chronological order;
- a precise timestamp for every retained message;
- prompt, cached prompt, and completion token usage per message;
- every judge opinion, including its reasoning, score, state, and trajectory values;
- the final evaluation result, failure information, and total cost charged to the run.

Use the judge opinions to identify the turn where the conversation improved, became at risk, succeeded, or entered a persistent loss. The run detail can also be exported as JSON for offline review.

### Schedule recurring tests

A test can run automatically from a standard five-field cron expression. The minimum supported interval is five minutes. For example, `*/15 * * * *` runs every 15 minutes.

If the account's new-run quota is exhausted, a due scheduled test waits for a later scheduling check without creating a run. Scheduling does not bypass the quota or reserve capacity separately from manual runs and direct evaluations.

Disable scheduling when you want to preserve the test definition without creating new scheduled runs. Manual runs remain available from the test page.

### Failure and recovery notifications

Enable failure notifications when repeated run execution failures should alert the account owner. **Notification threshold** controls how many consecutive runs in the `failed` state are required before AIVAX sends an alert. The default is `1`.

These notifications track execution errors, not behavioral test failures. A run in the `succeeded` state completed without an execution error, but its behavioral outcome can still be `loss` or `incomplete`. Those outcomes do not count toward the failure notification threshold.

When **Recovery notification** is enabled, AIVAX also notifies the account after a run completes successfully following enough consecutive execution failures to reach the configured threshold. A successfully completed run resets the consecutive-failure counter, even if its behavioral outcome is `loss` or `incomplete`. Recovery therefore means execution recovered, not that the assistant passed the behavioral checks.

### Retention

Succeeded and failed runs are retained for one month. Cancelled runs are retained for one day. Export any result that must remain available beyond those periods.

## Evaluation settings

These settings control the simulated conversation and the judge. Persistent tests use them; [direct API execution](#direct-api-execution) accepts the same core settings, but not `hooks`.

| Setting | Default | Accepted values | Description |
| --- | ---: | --- | --- |
| `validation_criteria` | `null` | String, message part, or list of message parts | Optional requirements supplied only to the judge. They do not guide the simulated user or the gateway under test. |
| `resources` | `[]` | `{ "type", "data", "visibility" }` objects | Additional context. `visibility` selects the recipients: `Internal` (default) for the simulated user and judge, `Gateway` for the gateway under test only, or `Both`. Use `Text` for literal `data` or `RemoteResource` for content retrieved from the URL in `data`. |
| `hooks` | `[]` | `{ "event", "url" }` objects | External callbacks for persisted runs. Supported events are `before-test`, `after-test`, `before-inference`, `after-inference`, and `context-changed`; `before-inference` and `after-inference` require an AI Gateway. |
| `profile` | `medium` | `low`, `medium`, `high` | Selects the capability and price tier used by the simulated user and judge. It does not replace the model configured on the gateway under test. |
| `max_turns` | `10` | `2`–`64` | Maximum number of simulated-user turns before the run ends. |
| `minimum_turns` | `1` | `1`–`63`, less than `max_turns` | First turn when the simulated user may receive the option to end the conversation. |
| `allow_user_exit` | `true` | Boolean | When enabled, the simulated-user prompt exposes the conversation exit token from `minimum_turns` onward. When disabled, that option is omitted from every simulated-user prompt. |
| `judge_start_turn` | `1` | `1`–`63`, less than `max_turns` | First turn evaluated by the judge. The final turn is always evaluated. |
| `loss_threshold` | `0.2` | `0.01`–`0.99` | Boundary used to identify a persistently unsuccessful trajectory. |
| `base_threshold` | `0.9` | `0.01`–`0.99` | Score at or above which the goal is considered reached. It must be greater than `loss_threshold`, with more than `0.1` between them. |
| `user_sampling.top_k` | `0.4` | `0`–`2` | Controls how many sampled communication characteristics guide the simulated user. Higher values increase variation. |
| `user_sampling.max_decay` | `0.02` | `0`–`1` | Controls how sampled user characteristics may change between turns. |

Tuning guidance:

- **`max_turns`**: reduce it for fast, bounded regression checks; increase it for flows that naturally require discovery or several tool calls.
- **`minimum_turns` and `judge_start_turn`**: each must be less than `max_turns`; they are otherwise independent. `minimum_turns` controls only when the simulated user sees its exit option and does not delay judge decisions.
- **`judge_start_turn`**: delay it when early clarification is expected and intermediate scores are not useful.
- **`allow_user_exit`**: disable it when only the judge or the turn budget should end the test.
- **`loss_threshold` and `base_threshold`**: keep a wide gap between them unless the policy has been calibrated against representative conversations.

## Pricing and limits

Each test includes the selected model or AI Gateway's inference charges, plus simulated-user and judge usage at the selected profile's rates. The [plan multiplier](../pricing.md#plan-multipliers) applies.

| Description | Pricing |
| --- | ---: |
| Model or AI Gateway under test | Regular inference rates |
| Low profile - simulated user | Input **$0.25/M tokens**; cache **$0.025/M tokens**; output **$1.50/M tokens** |
| Low profile - judge | Input **$0.30/M tokens**; cache **$0.03/M tokens**; output **$2.50/M tokens** |
| Medium profile - simulated user | Input **$0.75/M tokens**; cache **$0.075/M tokens**; output **$3.75/M tokens** |
| Medium profile - judge | Input **$0.75/M tokens**; cache **$0.075/M tokens**; output **$3.75/M tokens** |
| High profile - simulated user | Input **$0.75/M tokens**; cache **$0.075/M tokens**; output **$3.75/M tokens** |
| High profile - judge | Input **$1.25/M tokens**; cache **$0.15/M tokens**; output **$4.25/M tokens** |

An em dash (`—`) means the plan does not impose a limit. Custom accounts support 8 concurrent runs per account.

| Limit | Free | Pro | Max |
| --- | --- | --- | --- |
| New runs per account | 5/min | 30/min | — |
| Concurrent runs per account | 1 | 4 | 8 |

These per-minute limits are shared across API keys belonging to the same account. They are independent of subscription allowances and billing. Manual runs, scheduled runs, and direct evaluations share one new-run quota. A persisted run consumes its unit when it is queued, not again when execution starts; individual conversation turns do not consume additional run units. Excess manual run requests and direct evaluations return `429 Too Many Requests`. A scheduled test without available quota waits for a later scheduling check rather than creating an extra run. Existing runs remain subject to their separate concurrency and inference limits.

Pace requests across the account and use bounded retries with backoff after a 429. An immediate retry still encounters the active rate-limit window. Max has no plan-imposed limit on new runs, but other applicable limits remain in effect.

Each test accepts up to 16 `resources` and 16 `hooks`.

## Direct API execution

Use the direct evaluation endpoint when an application needs to run an ephemeral test and consume its events immediately as a Server-Sent Events (SSE) stream. A direct execution does **not** create a persistent test case or run in the dashboard.

Authenticate with a private AIVAX API key, send `Accept: text/event-stream`, and keep the key on a trusted backend. Do not expose a private key in browser code or a distributed application bundle.

Each direct evaluation consumes one unit from the same account quota as persisted runs. If that quota is exceeded, the request returns HTTP 429 before the SSE stream opens. Check the HTTP status before processing events, and use bounded retries with backoff. See [Pricing and limits](#pricing-and-limits).

<script src="https://inference.aivax.net/apidocs?embed-target=Evaluate%20Agentic%20Test&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

The request accepts the same core [evaluation settings](#evaluation-settings) as a persistent test, except `hooks`. The main fields are:

- `model`: the AI Gateway slug.
- `goal`: the desired outcome, shared with the simulated user and judge.
- `validation_criteria`: optional judge-only requirements.
- `minimum_turns` and `allow_user_exit`: when the simulated user sees its exit option.
- `judge_start_turn`: when judge evaluation starts.
- `start`: optional initial messages.
- `resources`: additional `Text` or `RemoteResource` context.
- `external_user_id`: an identity forwarded to gateway inference.

### Stream events

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

Route messages by `event.type` and concatenate streamed content chunks in order. The examples below show the `event` object inside the SSE envelope. Lifecycle markers (`start_generation`, `end_generation`, `turn_analysis_start`, `turn_analysis_end`) carry an empty object (`data: {}`); reasoning chunks share the `{ "reasoning_content": "..." }` shape. Only content-bearing events are shown in full.

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

- **`chat.user_message.start_generation`** — Marks the start of simulated-user message generation (`data: {}`).

- **`chat.user_message.reasoning`** — Streams one reasoning chunk exposed by the simulated-user model. Use this for debugging only.

- **`chat.user_message.content`** — Streams one simulated-user message content chunk. Concatenate consecutive chunks in arrival order.

  ```json
  {
    "type": "chat.user_message.content",
    "data": {
      "content": "Can you explain the refund policy?"
    }
  }
  ```

- **`chat.user_message.end_generation`** — Marks the end of simulated-user message generation (`data: {}`).

- **`chat.user_message.end_conversation`** — Reports a permitted simulated-user exit after `minimum_turns`. This event is not emitted when `allow_user_exit` is disabled.

  ```json
  {
    "type": "chat.user_message.end_conversation",
    "data": {
      "reason": "simulated_user_ended_conversation"
    }
  }
  ```

- **`chat.assistant_message.start_generation`** — Marks the start of the selected gateway response (`data: {}`).

- **`chat.assistant_message.reasoning`** — Streams one reasoning chunk exposed by the gateway model (same `reasoning_content` shape).

- **`chat.assistant_message.refusal`** — Reports a refusal returned by the gateway model.

- **`chat.assistant_message.tool_call`** — Reports an assistant tool call, including its ID, name, and arguments.

- **`chat.assistant_message.tool_result`** — Reports a tool result, including the associated call ID, name, and content.

- **`chat.assistant_message.content`** — Streams one assistant response content chunk. Concatenate consecutive chunks in arrival order.

  ```json
  {
    "type": "chat.assistant_message.content",
    "data": {
      "content": "Refunds are available within 30 days."
    }
  }
  ```

- **`chat.assistant_message.end_generation`** — Marks the end of the selected gateway response (`data: {}`).

- **`chat.judge.turn_analysis_start`** — Marks the start of an evaluation against the goal and any judge-only validation criteria (`data: {}`).

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

- **`chat.judge.turn_analysis_end`** — Marks the end of the current turn evaluation (`data: {}`).

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

### Judge states and outcomes

The judge state can be `active`, `at_risk`, `success`, or `loss`. A weak turn does not immediately fail a recoverable conversation: the low score and cumulative trajectory must remain at or below the configured loss threshold for the required consecutive evaluations.

Final outcomes are:

| Outcome | Meaning |
| --- | --- |
| `success` | The judge reached `base_threshold`. A permitted simulated-user exit triggers judging but does not itself pass the test; without the threshold the outcome is `incomplete`. |
| `loss` | The score and cumulative trajectory remained at or below `loss_threshold` for the required consecutive judged turns. |
| `incomplete` | The conversation exhausted `max_turns` without reaching success or a persistent loss. |
| `interrupted` | A validation rule stopped the evaluation before it completed. |

### Errors

A missing or invalid key returns `401 Unauthorized`; a public API key returns `403 Forbidden`; insufficient balance returns `402 Payment Required`; and malformed fields, unavailable gateway slugs, or invalid threshold combinations return `400 Bad Request`. An inference failure can instead arrive as an SSE event after streaming begins.

To investigate an inference failure, review the [AI Gateway configuration](/docs/inference/ai-gateway) used by the test.
