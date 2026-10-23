Source: https://docs.aivax.net/docs/limits.html

# Plans and Limits

AIVAX has three account plans: **Free**, **Pro**, and **Max**. The current plan controls model access, account-level rate limits, storage quota, conversation retention, and included daily service allowances.

For commercial subscription prices and plan packaging, use the [AIVAX pricing page](https://aivax.net/pricing). This page documents account-level limits only. Limits that belong to a specific product, such as RAG searches, web search, Agentic Tests, or Batch, are documented in that product's page.

## Account limits

An em dash (`—`) means the plan does not impose a limit. Model, gateway, provider, or product-specific limits may still apply.

| Feature | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inference** |  |  |  |
| Model access | Low-price models | All models | All models |
| Inference commission multiplier | 1.25x | 1.05x | 1.00x |
| Integrated model requests | 20/min and 500/day | 200/min | — |
| Integrated model input tokens | 1,000,000/min | 20,000,000/min | — |
| BYOK requests | 30/min | 200/min | — |
| Maximum context | 65,536 input tokens | — | — |
| LLM subscription coverage | Currently disabled | Currently disabled | Currently disabled |
| **Account and support** |  |  |  |
| Storage quota | 30 MB | 2 GB | 20 GB |
| Cost per excess GB | — | $0.50/GB/month | $0.20/GB/month |
| Conversation retention | 2 hours | 2 days | 30 days |
| Support level | Email | Priority | Dedicated |

Integrated model requests are limited by both request count and input tokens. Model rate-limit groups adjust the request-count thresholds:

| Rate-limit group | Threshold multiplier |
| --- | --- |
| Common | 1.0x |
| Discounted | 0.5x |
| Low | 0.3x |
| Free | 0.1x |

For example, a Pro account normally has 200 integrated-model requests per minute. With a `Discounted` model group, the adjusted threshold is 100 requests per minute.

BYOK uses a provider key configured on the gateway instead of an integrated AIVAX model, but requests still pass through AIVAX infrastructure and use the plan's BYOK limit.

Rate limits are shared across all API keys of the same account. A request that would exceed an active window returns `429 Too Many Requests`; pace requests and use bounded retries with backoff.

Custom accounts use the Pro plan limits multiplied by a factor agreed for the account, or have no plan rate limits when no factor is set.

## Included daily subscription allowances

Free, Pro, and Max include separate daily allowances for the services below. Each comparison refers to the same service on the named plan, not to a shared credit balance or a guaranteed number of requests. Unused allowance from one service cannot cover another. Custom accounts do not receive subscription allowances.

| Included service | Free | Pro | Max |
| --- | --- | --- | --- |
| RAG search and insertion embeddings | Base allowance | 25× Free | 4× Pro |
| Reranking with Reflex | Base allowance | 5× Free | 10× Pro |
| Semantic decisions with eligible models | Base allowance | 2.5× Free | 2× Pro |
| Fetch and OCR extraction | Base allowance | 10× Free | 5× Pro |

RAG searches and document insertions share the embedding allowance. It does not cover answer generation, media processing, text classification, or segmentation. A query embedding served from cache does not consume it. Reflex uses a separate reranking allowance that includes both cached and uncached input. The semantic decision allowance covers only eligible decision models; see [Semantic Decisions](https://docs.aivax.net/docs/data-processing/decisions.md#usage-and-cost). Optional Fetch JSON conversion is separate from the extraction allowance.

Coverage is evaluated for each metered service item: a document's embedding, an individual query-term embedding, a reranking call, a decision call's input usage, or an extraction operation. Each item is either fully included or billed in full at normal rates. Included items are tracked in subscription consumption, not as zero-cost entries in billing history. The current allowances permit a 10% margin above their base capacity. An item that would exceed that margin leaves the allowance unchanged and is billed normally. One request can contain several items, so some may be included while others are charged.

Daily allowances reset at midnight in the server's local time. Check the account's subscription usage indicators for consumption and reset status; usage can exceed 100% while within the margin. LLM subscription coverage is currently disabled, so text-model inference and RAG answer generation remain metered separately. Allowances do not bypass balance requirements or rate limits. See [Pricing](https://docs.aivax.net/docs/pricing.md) for how uncovered items are billed. For a walkthrough of testing a retrieval pipeline within these allowances, see [Free RAG API: embeddings, reranking and OCR limits](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

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

Public keys can be used for RAG semantic search, RAG answer generation, speech generation, media descriptions, image generation, and chat completions. For chat completions, public keys also require a full AI Gateway UUID, restrict request parameters, and omit server-side tool surfaces. See [Authentication](https://docs.aivax.net/docs/authentication.md).
