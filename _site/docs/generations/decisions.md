Source: http://localhost:1313/docs/generations/decisions.html

# Semantic decisions

Semantic decisions evaluate named questions against a shared state and return structured answers rather than a generated explanation. Use them to route support requests, select a category, check a condition, or assign an ordered score.

A request supplies the model, the evidence in `state`, and a `questions` object. Each question has an ID you choose; the response uses the same ID in `answers`. You can ask different question types in one request without making separate API calls.

Use [structured responses](http://localhost:1313/docs/inference/structured-responses.md) instead when you need a larger generated object or a written explanation. For embedding-based similarity between documents and labels, see [Text classification](http://localhost:1313/docs/rag/classification.md).

## Choose a model

All models below support `choice`, `noul`, and `score`. See [Pricing](http://localhost:1313/docs/pricing.md#semantic-decisions) for model rates and [Plans and limits](http://localhost:1313/docs/limits.md#semantic-decision-model-limits) for model-specific limits.

| Model |
| --- |
| `@supersonic-labs/julia-1` |
| `@typesafe/jev-1.13` |
| `@respan/span-01` |
| `@respan/span-01-lite` |
| `@jaredpalmer/kev-4b` |
| `@upstage/solar-decide` |
| `@cloudflare/clef` |
| `@cloudflare/clef-flash` |
| `@liquid/d1` |
| `@perplexity/pplx-decider-v1-27b` |
| `@openai/gpt-6-luna-decisions` |

`@typesafe/jev` is also accepted and currently resolves to `@typesafe/jev-1.13`. An unspecified context limit does not mean unlimited input. Model-specific limits and interpretation of scores can differ; validate a model on representative examples before switching production traffic.

An authenticated API key and a positive account balance are required, including when selecting a model with a zero base token price. See [Authentication](http://localhost:1313/docs/authentication.md), [Pricing](http://localhost:1313/docs/pricing.md), and [Plans and limits](http://localhost:1313/docs/limits.md).

### Discover models programmatically

`GET /api/v1/information/decisions-models.json` lists the current decision-model catalog without authentication. The response's `data` array contains:

- `name`: the canonical identifier to use in a decision request.
- `aliases`: other accepted identifiers for that model.
- `contextLength`: the advertised context in tokens, or `null` when unspecified.
- `releaseDate`: the catalog release date in `yyyy-MM-dd` format.
- `capabilities`: supported question types (`noul`, `choice`, and/or `score`).
- `inputPricePerMillionTokens` and `outputPricePerMillionTokens`: base USD prices, before account and plan adjustments.

Use this listing to populate model selectors rather than maintaining a separate hardcoded catalog. It describes configured models, not a real-time provider health check. Model-specific option and question limits are not included in this listing.

## Write the questions

| Type | `criteria` format | Use it for |
| --- | --- | --- |
| `choice` | Object mapping choice IDs to descriptions | Select one destination or category |
| `noul` | Object with nonempty `false` and `true` descriptions | Evaluate a Boolean condition |
| `score` | Ordered array of level descriptions | Evaluate a graded condition |

Every question requires nonempty `instructions`. Use descriptions that distinguish the options, not just opaque IDs. For example, `"billing": "Charges, payments, and refunds"` provides more evidence than `"billing": "B"`.

For `noul`, both criteria are required. Describe what counts as false as carefully as what counts as true, especially when the state might omit the relevant information. For `score`, keep the level order consistent across requests.

## Evaluate a support request

Send the following JSON body to `POST /api/v1/generations/decisions`. The example uses Julia-1; its state may be text, an object, or an array.

```json
{
  "model": "@supersonic-labs/julia-1",
  "state": {
    "message": "I was charged twice. Please return the extra payment."
  },
  "questions": {
    "department": {
      "type": "choice",
      "instructions": "Which team should handle this request?",
      "criteria": {
        "billing": "Charges, payments, and refunds",
        "technical": "Software errors and service outages",
        "sales": "Plans, pricing, and purchases"
      }
    },
    "refund_requested": {
      "type": "noul",
      "instructions": "Does the customer explicitly ask for money back?",
      "criteria": {
        "false": "The customer does not ask for money to be returned",
        "true": "The customer asks for a refund or return of a payment"
      }
    },
    "urgency": {
      "type": "score",
      "instructions": "How urgent is the request based on the stated deadline?",
      "criteria": [
        "No deadline stated",
        "A deadline is stated, but it is not today",
        "The customer explicitly needs resolution today"
      ]
    }
  }
}
```

Keep only relevant evidence in the state. Instructions should explain the decision, not ask for a chain of reasoning or additional text. Avoid overlapping choice descriptions unless that ambiguity is intentional.

### Read the response

The success response is a JSON object directly, **without a `data` envelope**. It contains:

- `id`: the decision identifier.
- `model`: the canonical model identifier used for the request.
- `provider`: the provider reported for the result.
- `answers`: an object keyed by your question IDs.
- `usage`: `input_tokens`, `output_tokens`, and the billed `cost`.

For Julia-1, an illustrative `answers` object for the example above is shown below. These numbers explain the format; they are not a recorded response or a quality guarantee.

```json
{
  "department": {
    "type": "choice",
    "choice": "billing",
    "probabilities": {
      "billing": 0.90,
      "technical": 0.06,
      "sales": 0.04
    }
  },
  "refund_requested": {
    "type": "noul",
    "noul": 0.95,
    "probabilities": {
      "false": 0.05,
      "true": 0.95
    }
  },
  "urgency": {
    "type": "score",
    "score": 0.3,
    "legend": {
      "0": "No deadline stated",
      "1": "A deadline is stated, but it is not today",
      "2": "The customer explicitly needs resolution today"
    },
    "probabilities": {
      "0": 0.8,
      "1": 0.1,
      "2": 0.1
    }
  }
}
```

With Julia-1:

- `choice` is the selected caller-defined ID, not the option description.
- `noul` is the probability assigned to the true criterion, not a JSON Boolean. Your application chooses the threshold and how to handle uncertain cases.
- `score` is the expected **zero-based level index**. In the example, `0 × 0.8 + 1 × 0.1 + 2 × 0.1 = 0.3`. It is not necessarily an integer, and it is not a normalized 0–1 score when there are more than two levels.
- `probabilities` are keyed by choice IDs, `false`/`true`, or score-level indices. `legend` describes the score levels.

Other models may omit optional fields such as `probabilities`, `legend`, or `confidence`. Do not assume that every provider uses the same score scale or confidence definition. A high probability is not proof that the decision is correct; validate thresholds and escalation rules with labeled examples from your own domain.

## Account rate limits

Semantic decision requests share an account-level rate limit across models and API keys. Each request counts once, even when it contains multiple questions. This quota is separate from the daily subscription allowance and applies to both included and paid usage. See [Plans and Limits](http://localhost:1313/docs/limits.md#plan-limits) for the Free, Pro, and Max thresholds.

Requests above the limit return `429 Too Many Requests` before evaluation. Pace calls across the account and retry with backoff after the rate-limit window clears; changing API keys within the same account does not provide a separate quota.

## Model-specific limits

See [Semantic decision model limits](http://localhost:1313/docs/limits.md#semantic-decision-model-limits) for the current context, question, option, and payload limits. Limits interact: shorten descriptions or reduce the option count instead of assuming every maximum can be used at once.

Inputs exceeding the context or question/options budget are rejected, not silently truncated. The literal `<mask>` is reserved and cannot appear in Julia-1 state, instructions, or option descriptions.

## Usage and cost

For Julia-1, input usage sums the encoded sequence for each question, excluding padding. The shared state is therefore counted again for each question. Multiple questions over one state do not have the same input usage as one question over that state. Julia-1 does not generate text, so its `output_tokens` value is zero.

Julia-1 is currently eligible for the daily semantic decision allowance on Free, Pro, and Max. Other decision models are billed normally. The allowance is shared across eligible decision calls, not reserved for each question or API key. See [Plans and Limits](http://localhost:1313/docs/limits.md#included-daily-subscription-allowances) for relative plan capacity and coverage rules.

When not covered, Julia-1 input is billed at the [listed rate](http://localhost:1313/docs/pricing.md#semantic-decisions), subject to account and plan adjustments. Use the returned `usage.cost` for the actual billed amount; it is zero when the input is fully covered by the allowance.

## Errors and reliable use

- **Invalid model or question:** check the exact model identifier, question type, instructions, and criteria shape. Question IDs and choice IDs must be nonempty.
- **Context or option limit exceeded:** shorten the state or descriptions, reduce the option count, or select a model with suitable limits. Retrying the same invalid input will not resolve it.
- **Authentication or balance error:** verify the API key and account balance before retrying. A zero-priced model still requires a positive balance.
- **Rate limit (429):** reduce the account's request rate and retry with backoff. Multiple questions in one request still count as one request, but model-specific payload limits and per-question usage remain applicable.
- **Temporary capacity or provider unavailability:** avoid an immediate parallel retry storm. Reduce concurrency and use bounded retries with backoff for transient failures.

Evaluate `choice`, `noul`, and `score` separately when validating a model: success at routing does not establish reliable scoring or Boolean behavior. Include ambiguous and incomplete states in your test set, and use human review where a wrong decision has material consequences. A retry is a new request; do not assume automatic deduplication or identical model outputs.

## API reference

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Evaluate%20semantic%20decisions)
