---
{title: Plans and Limits,linkTitle: Plans and limits,weight: 40,group: Introduction}
---

# Plans and Limits

AIVAX has four account plans: **Free**, **Pro**, **Max**, and **Ultimate**. The current plan controls model access, account and product rate limits, storage quota, retention periods, and included daily service allowances. Every plan limit is listed on this page; product pages link here instead of repeating the values.

For subscription prices, see the [AIVAX pricing page](https://aivax.net/pricing).

An em dash (`—`) means the plan does not impose a limit, and `Not available` means the feature is unavailable on the plan. Model, gateway, provider, or product-specific limits may still apply. Limits that are the same on every plan, such as file sizes or results per request, are documented on each product page.

## Account limits

| Limit | Free | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| **Inference** |  |  |  |  |
| Model access | Low-price models | All models | All models | All models |
| Inference commission multiplier | 1.25x | 1.05x | 1.02x | 1.00x |
| Daily inference commission ceiling | $1.50 | $1.20 | $1.00 | No commission |
| Integrated model requests | 20/min and 500/day | 150/min | 1,000/min | — |
| Integrated model input tokens | 1,000,000/min | 15,000,000/min | 60,000,000/min | — |
| BYOK requests | 30/min | 150/min | 1,000/min | — |
| Maximum context | 64,000 input tokens | — | — | — |
| Monthly subscription model quota | Not available | Included | Included | Included |
| **Account and support** |  |  |  |  |
| Storage quota | 30 MB | 2 GB | 10 GB | 20 GB |
| Cost per excess GB | Not available | $0.50/GB/month | $0.30/GB/month | $0.20/GB/month |
| Conversation retention | 2 hours | 2 days | 14 days | 30 days |
| RAG search history retention | 2 hours | 3 days | 14 days | 30 days |
| Service fee on credit top-ups | 5% (minimum $0.20) | None | None | None |
| Support level | Email | Priority | Priority | Dedicated |

RAG search history is the list of searches shown in [RAG Observability](rag/observability.md#search-history).

Integrated model requests are limited by both request count and input tokens. Model rate-limit groups adjust the request-count thresholds:

| Rate-limit group | Threshold multiplier |
| --- | --- |
| Common | 1.0x |
| Discounted | 0.5x |
| Low | 0.3x |
| Free | 0.1x |

For example, a Pro account normally has 150 integrated-model requests per minute. With a `Discounted` model group, the adjusted threshold is 75 requests per minute.

BYOK requests use a provider key configured on the gateway and count toward the plan's BYOK limit.

Rate limits are shared across all API keys of the same account. A request that would exceed an active window returns `429 Too Many Requests`; pace requests and use bounded retries with backoff.

Custom accounts have limits agreed with the AIVAX team.

## Product limits

Product limits use the same rules as account limits: they are shared across the account's API keys, and a request above an active window returns `429 Too Many Requests`. Where a limit counts items instead of HTTP requests, the note below its table says so.

### RAG and collections

| Limit | Free | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Collections | 5 | 100 | 1,000 | — |
| Documents per account | 2,000 | 200,000 | — | — |
| Documents per collection | 1,000 | 50,000 | 250,000 | 500,000 |
| Searches | 20/min | 300/min | 1,500/min | 3,000/min |
| Reranking requests | 30/min | 500/min | 3,000/min | — |
| Reflex processing time | 30 minutes/day | 3 hours/day | 12 hours/day | — |
| Document insertions | 500/day | 5,000/day | 50,000/day | — |
| Documents per multipart JSONL import | 1,000 | 5,000 | 100,000 | 1,000,000 |
| Documents per WebSocket JSONL import | 10,000 | 50,000 | 1,000,000 | 10,000,000 |
| Media Injector files | 2/day | 20/day | 250/day | 1,000/day |

The reranking request limit applies to the [reranking endpoint](rag/reflex.md) and to RAG searches that use a reranker. If an import exceeds the per-import limit, split it into multiple imports. Document limits count stored documents; updating an existing document is not affected. Once a limit is reached, creating a document returns `400 Bad Request`. See [Collections](rag/collections.md), [Documents](rag/documents.md), and [Reflex](rag/reflex.md).

### Data processing

| Limit | Free | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Text-classification documents | 30/min and 300/day | 500/min | 2,500/min | 10,000/min |
| Extraction, summarization, and instruction refinement documents | 10/min and 300/day | 100/min | 1,000/min | 2,500/min |
| Text-segmentation documents | 10/min and 100/day | 300/min | 1,000/min | 2,500/min |
| Translation requests | 30/min and 300/day | 100/min | 1,000/min | 2,500/min |
| Media description requests | 10/min and 30/hour | 40/min | 100/min | 200/min |
| Semantic decision requests | 10/min | 30/min | 200/min | — |

Classification, extraction, summarization, and segmentation limits count every item in the request's `documents` array; extraction, summarization, and instruction refinement share one quota. Translation, media description, and semantic decision limits count HTTP requests. See [Classification](data-processing/classification.md), [Extraction](data-processing/extraction.md), [Summarization](data-processing/summarization.md), [Instruction Refinement](data-processing/instruction-refinement.md), [Text segmentation](data-processing/text-segmentation.md), [Translations](data-processing/translations.md), [Media descriptions](data-processing/media-descriptions.md), and [Semantic Decisions](data-processing/decisions.md).

### Speech

| Limit | Free | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Standalone text-to-speech requests | 3/min and 40/hour | 20/min | 100/min | 300/min |
| Standalone audio-transcription requests | 3/min and 40/hour | 20/min | 100/min | 300/min |

Text-to-speech and transcription have separate quotas with the same values. [Voice Sessions](inference/voice-session.md) are not subject to these standalone quotas. See [Text-to-speech](generations/speech.md) and [Speech-to-text](generations/audio-transcriptions.md).

### Built-in tools and web search

| Limit | Free | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Web search | 15/day | 500/day | 4,000/day | 10,000/day |
| X/Twitter search | Not available | 200/day | 3,000/day | 10,000/day |
| Document and web page generation | 5/day | 500/day | 15,000/day | 50,000/day |
| Image generation and editing | 5/day | 150/day | 1,500/day | 5,000/day |
| General service actions | 30/day | 2,500/day | 30,000/day | 100,000/day |
| Bash commands | 300/hour | 30,000/hour | 100,000/hour | — |

The image generation limit is shared by the built-in tool, the [image generation API](generations/images.md), and the [Media generation MCP](mcp-utilities/media-generation-mcp.md). See [Built-in tools](tools/builtin-tools.md), [Web Search](web-foundation/web-search.md), and [Shell](tools/shell.md).

### Batch and Agentic Tests

| Limit | Free | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Batch workflow items processed | 500/day | 25,000/day | 250,000/day | — |
| New Agentic Test runs | 5/min | 20/min | 100/min | — |
| Concurrent Agentic Test runs | 1 | 4 | 6 | 8 |
| Queued async generations | 1,000/hour | 50,000/hour | 250,000/hour | 750,000/hour |

Batch processing paused by the daily quota resumes after the window resets. Async generations above the hourly limit are rejected when queued. See [Batch](inference/batch/workflows.md#limits), [Async generations](inference/batch/async-generations.md), and [Agentic Tests](inference/agentic-tests.md#pricing-and-limits).

## Included daily subscription allowances

Every plan includes separate daily allowances for the services below. Each comparison refers to the same service on the Free plan. Unused allowance from one service cannot cover another.

| Included service | Free | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| RAG search and insertion embeddings | 10,000 tokens | 25× Free | 500× Free | 2,500× Free |
| Reranking with Reflex | 2,000 input tokens | 4× Free | 20× Free | 50× Free |
| Semantic decisions with eligible models | 20,000 input tokens | 2× Free | 3× Free | 5× Free |
| Fetch and OCR extraction | 1,000 PUs | 8× Free | 25× Free | 50× Free |

RAG searches and document insertions share the embedding allowance. It does not cover answer generation, media processing, extraction, summarization, classification, or segmentation. The semantic decision allowance covers only eligible decision models; see [Semantic Decisions](data-processing/decisions.md#usage-and-cost).

Usage beyond an allowance is billed at normal rates; see [Pricing](pricing.md). Allowances reset daily, and the dashboard shows current consumption. They do not cover text-model inference; subscription models use a separate [monthly quota](#monthly-subscription-model-quota). For a walkthrough, see [Free RAG API on AIVAX Free](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

## Monthly subscription model quota

Pro, Max, and Ultimate include a monthly quota for subscription models. The quota renews one month after its first use in each cycle, and all subscription models share it. Max includes 5× the Pro quota, and Ultimate includes 12.5× the Pro quota. For the available models and the usage each plan includes, see [Subscription models](inference/subscription-models/overview.md).

Subscription models are the catalog models whose names start with `@aivax-subscription/`. Using them never debits the account balance; every other model is charged to the balance as usual. To identify them, check `flags.isSubscription` in `GET /api/v1/information/models.json` or `_details.provider_model.subscription` in `GET /v1/models`.

When the quota is exhausted, or the plan has none, a request to a subscription model returns `429 Too Many Requests`. Until the quota renews, select another model or upgrade the plan.

The account balance response reports the quota as a used percentage, in a subscription consumption of type `InferenceMonthly`. See [Get Account Balance](https://inference.aivax.net/apidocs/llms.txt?endpoint=GET%20%2Fapi%2Fv1%2Finformation%2Fbalance).

## Estimating PUs and tokens

Usage is metered in processing units (PUs) or tokens, depending on the service. The examples below help you estimate the size of a workload. They are approximations (`≈`), not guaranteed values: the exact amount is reported in each response's usage fields.

**Fetch and OCR processing units**

| Content | Approximate PUs |
| --- | --- |
| Plain text or Markdown file | 0 |
| Native-text PDF or DOCX, 10 pages | ≈ 1 (minimum of 1 PU per item) |
| Web page that renders in 1 to 3 seconds | ≈ 10–30 (10 PUs per second of rendering) |
| Photo or screenshot with text | ≈ 40–50 |
| Scanned PDF, 10 pages | ≈ 400–500 |

Pages with a text layer cost almost nothing; scanned pages and images go through OCR and drive the total.

**Tokens**

| Content | Approximate tokens |
| --- | --- |
| RAG search query, such as "how do I reset my password if I lost access to my email?" | ≈ 10–30 |
| One page of English text, about 500 words | ≈ 650–750 |
| RAG document chunk of 1,500 characters | ≈ 350–400 |
| Reflex reranking of 50 candidates with about 300 tokens each | ≈ 15,000–16,000, since the query is scored with every candidate |
| A 300-page book, about 300 words per page | ≈ 110,000–130,000 |

Token estimates assume English text, where one token is about four characters. Other languages, code, and JSON usually need more tokens for the same content. In chat completions, the conversation history and system instructions are sent again on every turn.

## Public API keys

Public keys have additional limits independent of the account plan.

| Scope | Request limits |
| --- | --- |
| Per remote address | 3/5s, 20/min, 300/hour, 1,000/day |
| Global per key | 10/5s, 60/min, 1,500/hour, 10,000/day |

| Scope | Token limits |
| --- | --- |
| Per remote address | 100,000/5min, 500,000/30min, 2,000,000/6h, 5,000,000/day |
| Global per key | 500,000/5min, 2,000,000/30min, 10,000,000/6h, 25,000,000/day |

Public keys can be used for chat completions, the `/api/v1/generations/*` endpoints, RAG semantic search, and RAG answer generation. For chat completions, public keys also require a full AI Gateway UUID, restrict request parameters, and omit server-side tool surfaces. See [Authentication](authentication.md).
