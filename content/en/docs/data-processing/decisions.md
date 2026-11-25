---
{title: Semantic Decisions,linkTitle: Semantic Decisions,weight: 20,group: Data processing,aliases: [/docs/generations/decisions.html]}
---

# Semantic Decisions

Semantic decisions evaluate named questions against a shared state and return structured answers rather than a generated explanation. Use them to route support requests, select a category, check a condition, or assign an ordered score.

A request supplies the model, the evidence in `state`, and a `questions` object. Each question has an ID you choose; the response uses the same ID in `answers`. You can ask different question types in one request without making separate API calls.

To evaluate a chat conversation, send it in `input` as an array of OpenAI-style messages instead of `state`. Use one of the two fields, never both. See [Evaluate a conversation](#evaluate-a-conversation).

Use [structured responses](/docs/inference/structured-responses/concepts.md) instead when you need a larger generated object or a written explanation. For embedding-based similarity between documents and labels, see [Text classification](classification.md).

## Choose a model

The available decision models, with their aliases, supported question types, context, and prices, are listed in the [Models catalog](https://aivax.net/models#decisions).

Each response returns the canonical model name in `model`. You can also send a model alias, such as `@supersonic-labs/julia:latest`. An alias can move to a newer version when one is released, so pin the canonical name when you need a stable version.

Limits and score interpretation differ between models, so validate a model on representative examples before switching production traffic. For a labeled 40-ticket comparison of four decision models, including how option order changed some answers, see [Gemini Decision 1 vs Jev vs OpenAI Decisions](https://aivax.net/blog/gemini-decision-1-vs-jev-vs-openai-decisions/).

An authenticated API key and a positive account balance are required, including when selecting a model with a zero base token price. See [Authentication](../authentication.md), [Pricing](../pricing.md), and [Plans and limits](../limits.md).

### Discover models programmatically

`GET /api/v1/information/decisions-models.json` lists the current decision-model catalog without authentication. The response's `data` array contains:

- `name`: the canonical identifier to use in a decision request.
- `aliases`: other accepted identifiers for that model.
- `contextLength`: the advertised context in tokens, or `null` when unspecified.
- `maxImages`: the number of images accepted per request, or `0` for text-only models.
- `releaseDate`: the catalog release date in `yyyy-MM-dd` format.
- `capabilities`: question types the model answers (`noul`, `choice`, `score`) and media it accepts (`imageinput`, `audioinput`, `videoinput`, `fileinput`).
- `inputPricePerMillionTokens` and `outputPricePerMillionTokens`: base token prices before account and plan adjustments; see [Usage and cost](#usage-and-cost).

Use this listing to populate model selectors rather than maintaining a separate hardcoded catalog. Model-specific option and question limits are described in [Model-specific limits](#model-specific-limits).

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

Tips for reliable answers:

- Keep only relevant evidence in the state.
- Write instructions that explain the decision, not ones that ask for a chain of reasoning or additional text.
- Avoid overlapping choice descriptions unless that ambiguity is intentional.

For one triage request run unchanged on Jev, GPT-6 Luna Decisions and Gemini Decision 1, with routing code and measured cost, see [Jev and OpenAI Decisions API example: triage a support ticket](https://aivax.net/blog/support-triage-typed-decisions/).

### Evaluate a conversation

Use `input` when the evidence is a chat between a customer and an agent, a bot transcript, or any conversation you already store in the [chat completions](/docs/inference/chat-completions/concepts.md) message format. Send `input` instead of `state`; a request with both returns `400`.

```json
{
  "model": "@supersonic-labs/julia-1",
  "input": [
    { "role": "user", "content": "My order arrived damaged." },
    { "role": "assistant", "content": "Sorry about that. Do you want a refund or a replacement?" },
    { "role": "user", "content": "A replacement, please. I need it before Friday." }
  ],
  "questions": {
    "refund_requested": {
      "type": "noul",
      "instructions": "Does the customer ask for money back?",
      "criteria": {
        "false": "The customer does not ask for money to be returned",
        "true": "The customer asks for a refund or return of a payment"
      }
    }
  }
}
```

- `input` must be a non-empty array. Each message has a `role` (`system`, `user`, `assistant`, or `tool`; `user` when omitted) and a `content` that is a string or an array of content parts.
- Media parts inside messages follow the same formats, capability checks, and image limits as [media sent in `state`](#send-media). A conversation with an image sent to a text-only model returns `400`.
- Long conversations consume more input tokens and count against the model's context limit. Trim messages that do not affect the decision.

### Send media

Some decision models accept media; check `capabilities` and `maxImages` in the [model listing](#discover-models-programmatically). Put each part directly in a top-level `state` array, next to text items written as plain strings. In a conversation, put the same parts in a message's `content` array instead.

| Media | Part | Required capability | Accepted data |
| --- | --- | --- | --- |
| Image | `image_url` | `imageinput` and `maxImages` above zero | Base64 data URL of type `image/png`, `image/jpeg`, or `image/webp` |
| Audio | `input_audio` | `audioinput` | Raw base64 in `data` and a supported `format` |
| Video | `video_url` | `videoinput` | Base64 data URL of type `video/*` |
| Document | `file` | `fileinput` | Base64 data URL or public `https://` URL in `file_data` |

Images use an `image_url` part:

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

- `url` must be a base64 data URL of type `image/png`, `image/jpeg`, or `image/webp`. Remote `http(s)` URLs are rejected.
- Only some models accept images, each up to a per-request maximum. Sending images to any other model, or more than the model accepts, returns `400`. See [Model-specific limits](#model-specific-limits).

#### Audio, video, and documents

Models that list `audioinput`, `videoinput`, or `fileinput`, such as `@google/gemini-decision-1`, accept those parts in the same top-level `state` array. Each part can be combined with text and other media in one request:

```json
{
  "model": "@google/gemini-decision-1",
  "state": [
    "Support call recording and the invoice the customer mentioned.",
    { "type": "input_audio", "input_audio": { "data": "<RAW_BASE64_AUDIO>", "format": "mp3" } },
    { "type": "video_url", "video_url": { "url": "data:video/mp4;base64,<BASE64_VIDEO>" } },
    { "type": "file", "file": { "file_data": "data:application/pdf;base64,<BASE64_PDF>", "filename": "invoice.pdf" } }
  ],
  "questions": {
    "charge_disputed": {
      "type": "noul",
      "instructions": "Does the customer dispute a charge that appears on the invoice?",
      "criteria": { "true": "The customer disputes an invoiced charge", "false": "No invoiced charge is disputed" }
    }
  }
}
```

- **Audio:** `data` is raw base64, without a `data:` prefix. `format` is one of `wav`, `mp3`, `mpeg`, `m4a`, `mp4`, `aac`, `aiff`, `aif`, `flac`, `ogg`, `opus`, or `webm`.
- **Video:** `url` must be a `data:video/...;base64,` URL. Remote video URLs are rejected.
- **Documents:** `file_data` is a base64 data URL, such as `data:application/pdf;base64,...`, or a public `https://` URL. `filename` is optional.
- Sending a part to a model that does not list the matching capability returns `400`.

### Read the response

The success response is a JSON object directly, **without a `data` envelope**. It contains:

- `id`: the decision identifier.
- `model`: the canonical model identifier used for the request.
- `provider`: the provider reported for the result.
- `answers`: an object keyed by your question IDs.
- `usage`: `input_tokens`, `output_tokens`, and the billed `cost`.

For Julia-1, an illustrative `answers` object for the example above is shown below.

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

Other models may omit optional fields such as `probabilities`, `legend`, or `confidence`, and may use a different score scale. Validate thresholds and escalation rules with labeled examples from your own domain.

## Async generation

Add `"async": true` to queue the evaluation. The API answers with HTTP `202` and an ID, and you fetch the stored result later or receive a webhook when it is done. See [Async generations](/docs/inference/batch/async-generations.md).

```json
{
  "model": "@supersonic-labs/julia-1",
  "state": "I was charged twice. Please return the extra payment.",
  "questions": {
    "department": {
      "type": "choice",
      "instructions": "Which team should handle this request?",
      "criteria": {
        "billing": "Charges, payments, and refunds",
        "technical": "Software errors and service outages"
      }
    }
  },
  "async": true
}
```

## Account rate limits

Semantic decision requests share one per-minute rate limit per account, across all decision models and API keys. Each request counts once, regardless of how many questions it contains. The number of requests per minute depends on the plan; see [Data processing limits](../limits.md#data-processing).

Requests above the limit return `429 Too Many Requests`. Pace calls across the account and retry with backoff.

## Model-specific limits

These limits apply in addition to the account-level request quota above. Each model's context is listed in the [Models catalog](https://aivax.net/models#decisions).

Most decision models are text-only. The `maxImages` field of the [model listing](#discover-models-programmatically) is the number of images a model accepts per request.

For `@cloudflare/clef` and `@cloudflare/clef-flash`, keep each image under about 300 KB before encoding and the text in `state` under roughly 2,000 tokens.

Julia-1 has these limits:

| Limit | Value |
| --- | --- |
| Questions per request | 1–32 |
| Choices or score levels per question | 2–20 |
| Boolean options | Exactly two: false and true |
| Combined context per question | 1,024 tokens, including state, question, options, and special tokens |
| Question and options budget | 256 tokens within the combined context |
| Description of an individual option | At most 48 tokens |
| Decision payload limit | 256 KiB |

These limits interact: twenty options can exceed the question and options budget even if each description fits its individual limit. Inputs that exceed a limit are rejected, not truncated; shorten descriptions or reduce the option count. The literal `<mask>` is reserved and cannot appear in Julia-1 state, instructions, or option descriptions.

## Usage and cost

Decision models are billed per input token at the base USD rates listed in the [Models catalog](https://aivax.net/models#decisions), before account and plan adjustments (see the [plan multiplier](../pricing.md#plan-multipliers)).

For Julia-1, the shared state is counted again for each question, so input usage grows with the number of questions. Julia-1 does not generate text, so its `output_tokens` value is zero.

Julia-1 is eligible for the daily semantic decision allowance on every plan, shared across the account. Other decision models are billed normally. See [Plans and Limits](../limits.md#included-daily-subscription-allowances) for relative plan capacity.

Use the returned `usage.cost` for the billed amount; it is zero when the input is covered by the allowance.

## Errors and reliable use

- **Invalid model or question:** check the model identifier, question type, instructions, and criteria shape. Question IDs and choice IDs must be nonempty.
- **Context or option limit exceeded:** shorten the state or descriptions, reduce the option count, or select a model with suitable limits.
- **Authentication or balance error:** verify the API key and account balance. A zero-priced model still requires a positive balance.
- **Rate limit (429):** reduce the account's request rate and retry with backoff.
- **Temporary unavailability:** retry with backoff and reduced concurrency.

Evaluate `choice`, `noul`, and `score` separately when validating a model, include ambiguous and incomplete states in your test set, and use human review where a wrong decision has material consequences.

## API reference

<script src="https://inference.aivax.net/apidocs?embed-target=Evaluate%20semantic%20decisions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
