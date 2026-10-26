---
{title: Semantic Decisions,linkTitle: Semantic Decisions,weight: 20,group: Data processing,aliases: [/docs/generations/decisions.html]}
---

# Semantic Decisions

Semantic decisions evaluate named questions against a shared state and return structured answers rather than a generated explanation. Use them to route support requests, select a category, check a condition, or assign an ordered score.

A request supplies the model, the evidence in `state`, and a `questions` object. Each question has an ID you choose; the response uses the same ID in `answers`. You can ask different question types in one request without making separate API calls.

Use [structured responses](../inference/structured-responses.md) instead when you need a larger generated object or a written explanation. For embedding-based similarity between documents and labels, see [Text classification](classification.md).

## Choose a model

All models below support `choice`, `noul`, and `score`. See [Usage and cost](#usage-and-cost) for model rates and [Model-specific limits](#model-specific-limits) for model limits.

| Model |
| --- |
| `@supersonic-labs/julia-1` |
| `@typesafe/jev-1.13` |
| `@typesafe/jev-1.14` |
| `@respan/span-02` |
| `@respan/span-01` |
| `@respan/span-01-lite` |
| `@jaredpalmer/kev-4b` |
| `@upstage/solar-decide` |
| `@cloudflare/clef` |
| `@cloudflare/clef-flash` |
| `@liquid/d1-ultra` |
| `@liquid/d1` |
| `@perplexity/pplx-decider-v1.2` |
| `@perplexity/pplx-decider-flash-v1.2` |
| `@perplexity/pplx-decider-v1.1-27b` |
| `@openai/gpt-6-luna-decisions` |
| `@microsoft/microsoft-decision-1` |
| `@nace-ai/drex-v1.5` |
| `@nace-ai/drex-v2.0` |
| `@nace-ai/drex-max` |
| `@cloudflare/clef-omni` |
| `@upstage/solar-decide-flash` |
| `@scaledown/classify-1` |
| `@inception/mercury-decide` |

Each response returns the canonical model name in `model`. These short names are also accepted as aliases and resolve to a fixed canonical model; an alias can move to a newer version when one is released, so pin the canonical name when you need a stable version:

| Alias | Resolves to |
| --- | --- |
| `@supersonic-labs/julia` | `@supersonic-labs/julia-1` |
| `@typesafe/jev` | `@typesafe/jev-1.14` |
| `@respan/span` | `@respan/span-01` |
| `@respan/span-lite` | `@respan/span-01-lite` |
| `@jaredpalmer/kev` | `@jaredpalmer/kev-4b` |
| `@liquid/d` | `@liquid/d1` |
| `@perplexity/pplx-decider` | `@perplexity/pplx-decider-v1.1-27b` |
| `@perplexity/pplx-decider-flash` | `@perplexity/pplx-decider-flash-v1.2` |
| `@nace-ai/drex` | `@nace-ai/drex-v1.5` |

An unspecified context limit does not mean unlimited input. Model-specific limits and interpretation of scores can differ; validate a model on representative examples before switching production traffic.

An authenticated API key and a positive account balance are required, including when selecting a model with a zero base token price. See [Authentication](../authentication.md), [Pricing](../pricing.md), and [Plans and limits](../limits.md).

### Discover models programmatically

`GET /api/v1/information/decisions-models.json` lists the current decision-model catalog without authentication. The response's `data` array contains:

- `name`: the canonical identifier to use in a decision request.
- `aliases`: other accepted identifiers for that model.
- `contextLength`: the advertised context in tokens, or `null` when unspecified.
- `maxImages`: the number of images accepted per request, or `0` for text-only models.
- `releaseDate`: the catalog release date in `yyyy-MM-dd` format.
- `capabilities`: supported question types (`noul`, `choice`, and/or `score`).
- `inputPricePerMillionTokens` and `outputPricePerMillionTokens`: base token prices before account and plan adjustments; see [Usage and cost](#usage-and-cost).

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

For a walkthrough with routing code and model prices, see [Decisions API example: triage a support ticket](https://aivax.net/blog/support-triage-typed-decisions/).

### Send images

`@cloudflare/clef`, `@cloudflare/clef-flash`, `@cloudflare/clef-omni`, and `@openai/gpt-6-luna-decisions` accept images. Put each image directly in a top-level `state` array as an `image_url` part, next to text items written as plain strings:

```json
{
  "model": "@cloudflare/clef-omni",
  "state": [
    "Listing title: Red square sticker",
    { "type": "image_url", "image_url": { "url": "data:image/png;base64,<BASE64_IMAGE>" } }
  ],
  "questions": {
    "matches_title": {
      "type": "noul",
      "instructions": "The photo shows the item in the title.",
      "criteria": { "true": "The item in the title is visible", "false": "The item is not visible" }
    }
  }
}
```

- `url` must be a base64 data URL of type `image/png`, `image/jpeg`, or `image/webp`. Remote `http(s)` URLs are not fetched and are rejected.
- Images nested inside objects in `state` are not read as images. A top-level `images` field, `input_image` parts, and base64 without the `data:image/...;base64,` prefix are not supported.
- Only some models accept images, each up to a per-request maximum. Sending images to any other model, or more than the model accepts, returns `400`. See [Model-specific limits](#model-specific-limits).
- Clef and Clef Flash also bound the image size and the amount of text they read from `state`; see the same limits section. Billing uses the input tokens the model processes, as reported in `usage.input_tokens`.

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

Semantic decision requests share an account-level rate limit across models and API keys. Each request counts once, even when it contains multiple questions. This quota is separate from the daily subscription allowance and applies to both included and paid usage. An em dash (`—`) means the plan does not impose a limit.

| Limit | Free | Pro | Max |
| --- | --- | --- | --- |
| Semantic decision requests | 10/min | 50/min | — |

These per-minute limits are shared across API keys belonging to the same account. They are independent of subscription allowances and billing: included usage still consumes the request quota. Each request consumes one unit, regardless of how many questions it contains or which decision model it selects.

Requests above the limit return `429 Too Many Requests` before evaluation. Pace calls across the account and retry with backoff after the rate-limit window clears; changing API keys within the same account does not provide a separate quota. An immediate retry still encounters the active rate-limit window. Max has no plan-imposed limit for this quota, but other applicable limits remain in effect.

## Model-specific limits

These model-specific limits apply in addition to the account-level request quota above. An unspecified context limit does not imply unlimited input.

| Model | Context |
| --- | --- |
| `@supersonic-labs/julia-1` | 1,024 tokens per question |
| `@typesafe/jev-1.13` | 262,144 tokens |
| `@typesafe/jev-1.14` | 262,144 tokens |
| `@respan/span-02` | 131,072 tokens |
| `@respan/span-01` | Not specified in the current catalog |
| `@respan/span-01-lite` | Not specified in the current catalog |
| `@jaredpalmer/kev-4b` | 8,192 tokens |
| `@upstage/solar-decide` | 524,288 tokens |
| `@cloudflare/clef` | 65,536 tokens |
| `@cloudflare/clef-flash` | 24,576 tokens |
| `@liquid/d1-ultra` | 32,768 tokens |
| `@liquid/d1` | 65,536 tokens |
| `@perplexity/pplx-decider-v1.2` | 262,144 tokens |
| `@perplexity/pplx-decider-flash-v1.2` | 262,144 tokens |
| `@perplexity/pplx-decider-v1.1-27b` | 262,144 tokens |
| `@openai/gpt-6-luna-decisions` | 1,050,000 tokens |
| `@microsoft/microsoft-decision-1` | 32,768 tokens |
| `@nace-ai/drex-v1.5` | 131,072 tokens |
| `@cloudflare/clef-omni` | 65,536 tokens |
| `@nace-ai/drex-v2.0` | 131,072 tokens |
| `@nace-ai/drex-max` | 262,144 tokens |
| `@upstage/solar-decide-flash` | 524,288 tokens |
| `@scaledown/classify-1` | 1,000,000 tokens |
| `@inception/mercury-decide` | 65,536 tokens |

Image input per request: `@cloudflare/clef`, `@cloudflare/clef-flash`, and `@cloudflare/clef-omni` accept up to 4 images; `@inception/mercury-decide` accepts up to 16; `@openai/gpt-6-luna-decisions` accepts up to 128. Other decision models are text-only. The `maxImages` field of the model listing is the authoritative value.

`@cloudflare/clef` and `@cloudflare/clef-flash` reject requests that exceed their processing window, so keep each image under about 300 KB before encoding. They also read roughly the first 2,000 tokens of text in `state`; images are counted separately.

Julia-1 has additional serving limits:

| Limit | Value |
| --- | --- |
| Questions per request | 1–32 |
| Choices or score levels per question | 2–20 |
| Boolean options | Exactly two: false and true |
| Combined context per question | 1,024 tokens, including state, question, options, and special tokens |
| Question and options budget | 256 tokens within the combined context |
| Description of an individual option | At most 48 tokens |
| Decision payload limit | 256 KiB |

These limits interact: twenty options can exceed the combined question/options budget even if each description fits its individual limit. The current AIVAX Julia-1 serving limits apply even if an upstream model card lists a larger context. Shorten descriptions or reduce the option count instead of assuming every maximum can be used at once.

Inputs exceeding the context or question/options budget are rejected, not silently truncated. The literal `<mask>` is reserved and cannot appear in Julia-1 state, instructions, or option descriptions.

## Usage and cost

The decision-model rates below are base USD prices per million input tokens, before account and plan adjustments (see the [plan multiplier](../pricing.md#plan-multipliers)). Output tokens have no charge in the current decision-model catalog. Julia-1 is eligible for the daily allowance described below; other decision models are billed normally.

| Model | Input price / million tokens |
| --- | ---: |
| `@supersonic-labs/julia-1` | **$0.008** |
| `@typesafe/jev-1.13` | **$0.042** |
| `@typesafe/jev-1.14` | **$0.042** |
| `@respan/span-02` | **$0.010** |
| `@respan/span-01` | **$0.020** |
| `@respan/span-01-lite` | **$0.000** |
| `@jaredpalmer/kev-4b` | **$0.042** |
| `@upstage/solar-decide` | **$0.100** |
| `@cloudflare/clef` | **$0.240** |
| `@cloudflare/clef-flash` | **$0.038** |
| `@liquid/d1-ultra` | **$0.042** |
| `@liquid/d1` | **$0.020** |
| `@perplexity/pplx-decider-v1.2` | **$0.020** |
| `@perplexity/pplx-decider-flash-v1.2` | **$0.010** |
| `@perplexity/pplx-decider-v1.1-27b` | **$0.020** |
| `@openai/gpt-6-luna-decisions` | **$0.100** |
| `@microsoft/microsoft-decision-1` | **$0.042** |
| `@nace-ai/drex-v1.5` | **$0.040** |
| `@cloudflare/clef-omni` | **$0.150** |
| `@nace-ai/drex-v2.0` | **$0.060** |
| `@nace-ai/drex-max` | **$0.060** |
| `@upstage/solar-decide-flash` | **$0.100** |
| `@scaledown/classify-1` | **$0.050** |
| `@inception/mercury-decide` | **$0.040** |

For Julia-1, input usage sums the encoded sequence for each question, excluding padding. The shared state is therefore counted again for each question. Multiple questions over one state do not have the same input usage as one question over that state. Julia-1 does not generate text, so its `output_tokens` value is zero.

Julia-1 is currently eligible for the daily semantic decision allowance on Free, Pro, and Max. Other decision models are billed normally. The allowance is shared across eligible decision calls, not reserved for each question or API key. See [Plans and Limits](../limits.md#included-daily-subscription-allowances) for relative plan capacity and coverage rules.

When not covered, Julia-1 input is billed at the [listed rate](#usage-and-cost), subject to account and plan adjustments. Use the returned `usage.cost` for the actual billed amount; it is zero when the input is fully covered by the allowance.

## Errors and reliable use

- **Invalid model or question:** check the exact model identifier, question type, instructions, and criteria shape. Question IDs and choice IDs must be nonempty.
- **Context or option limit exceeded:** shorten the state or descriptions, reduce the option count, or select a model with suitable limits. Retrying the same invalid input will not resolve it.
- **Authentication or balance error:** verify the API key and account balance before retrying. A zero-priced model still requires a positive balance.
- **Rate limit (429):** reduce the account's request rate and retry with backoff. Multiple questions in one request still count as one request, but model-specific payload limits and per-question usage remain applicable.
- **Temporary capacity or provider unavailability:** avoid an immediate parallel retry storm. Reduce concurrency and use bounded retries with backoff for transient failures.

Evaluate `choice`, `noul`, and `score` separately when validating a model: success at routing does not establish reliable scoring or Boolean behavior. Include ambiguous and incomplete states in your test set, and use human review where a wrong decision has material consequences. A retry is a new request; do not assume automatic deduplication or identical model outputs.

## API reference

<script src="https://inference.aivax.net/apidocs?embed-target=Evaluate%20semantic%20decisions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
