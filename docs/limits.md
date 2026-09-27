# Plans and Limits

AIVAX has three account plans: **Free**, **Pro**, and **Max**. The current plan is stored on the account and controls model access, commissions, rate limits, RAG quotas, tool limits, storage quota, conversation retention, and included daily service allowances.

For commercial subscription prices and plan packaging, use the [AIVAX pricing page](https://aivax.net/pricing). This page documents the technical limits of the API.

## How limits are enforced

Limits are enforced at different layers:

- Authentication rejects missing, expired, or unknown API keys.
- Public API keys are restricted to public routes and have key-level and per-IP request and token limits.
- Balance middleware rejects billable requests when the account balance is below the required minimum.
- Storage middleware rejects requests when account storage exceeds the plan quota.
- Inference checks model access, request rate, input-token rate, BYOK rate, and Free-plan context size.
- RAG checks collection count, search rate, insertion rate, and JSONL import size.
- Built-in tools check daily service limits.
- Batch processing checks how many workflow items can be processed per day.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Account%20Balance&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Plan limits

An em dash (`—`) means the plan does not impose a limit. Model, gateway, provider, or endpoint-specific limits may still apply.

| Feature | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inference** |  |  |  |
| Model access | Low-price/basic models | Advanced models | All models |
| Inference commission multiplier | 1.25x | 1.05x | 1.00x |
| Integrated model requests | 20/min and 500/day | 200/min | — |
| Integrated model input tokens | 1,000,000/min | 20,000,000/min | — |
| BYOK requests | 30/min | 200/min | — |
| Maximum context | 65,536 input tokens | — | — |
| LLM subscription coverage | Currently disabled | Currently disabled | Currently disabled |
| Standalone text-to-speech requests | 3/min and 40/hour | 30/min | 300/min |
| Standalone audio-transcription requests | 3/min and 40/hour | 30/min | 300/min |
| Semantic decision requests | 10/min | 50/min | — |
| **RAG and collections** |  |  |  |
| Collections | 5 | — | — |
| Semantic searches | 20/min | 500/min | 3,000/min |
| Text-classification documents | 30/min and 300/day | 1,000/min | 10,000/min |
| Text-segmentation documents | 10/min and 100/day | 300/min | 2,500/min |
| Reranking searches | 30/min | 1,000/min | — |
| Reflex processing time | 30 minutes/day | 6 hours/day | — |
| Document insertions | 500/day | 10,000/day | — |
| JSONL documents per import request | 1,000 | 10,000 | 1,000,000 |
| Media Injector | 2 files/day | 30 files/day | 1,000 files/day |
| **Built-in tools** |  |  |  |
| Web search | 15/day | 1,000/day | 10,000/day |
| X/Twitter search | Not available | 1,000/day | 10,000/day |
| Advanced web search | Not available | 100/day | 1,000/day |
| Document and web page generation | 5/day | 1,000/day | 50,000/day |
| Image generation and editing | 5/day | 500/day | 5,000/day |
| General service actions | 30/day | 5,000/day | 100,000/day |
| Bash commands | 300/hour | 30,000/hour | — |
| **Agentic tests** |  |  |  |
| New runs per account | 5/min | 30/min | — |
| Concurrent runs per account | 1 | 4 | 8 |
| **Batch processing** |  |  |  |
| Workflow items processed | 500/day | 100,000/day | — |
| Files per import request | 1,000 | 1,000 | 1,000 |
| Total import size | 100 MiB/request | 100 MiB/request | 100 MiB/request |
| Single imported file size | 10 MiB | 10 MiB | 10 MiB |
| **Account and support** |  |  |  |
| Storage quota | 30 MB | 2 GB | 20 GB |
| Cost per excess GB | — | $0.50/GB/month | $0.20/GB/month |
| Conversation retention | 2 hours | 2 days | 30 days |
| Support level | Email | Priority | Dedicated |

### Semantic decision and Agentic Test rate limits

These per-minute limits are shared across API keys belonging to the same account. They are independent of subscription allowances and billing: included usage still consumes the applicable request or run quota.

- **Semantic decisions:** each request consumes one unit, regardless of how many questions it contains or which decision model it selects. A request exceeding the account's limit returns `429 Too Many Requests` before evaluation. See [Semantic decisions](generations/decisions.md).
- **Agentic Tests:** manual runs, scheduled runs, and direct evaluations share one new-run quota. A persisted run consumes its unit when it is queued, not again when execution starts; individual conversation turns do not consume additional run units. Excess manual run requests and direct evaluations return `429 Too Many Requests`. A scheduled test without available quota waits for a later scheduling check rather than creating an extra run. Existing runs remain subject to their separate concurrency and inference limits. See [Agentic Tests](inference/agentic-tests.md).

Pace requests across the account and use bounded retries with backoff after a 429. An immediate retry still encounters the active rate-limit window. Max has no plan-imposed limit for these two quotas, but other applicable limits remain in effect.

### Included daily subscription allowances

Free, Pro, and Max include separate daily allowances for the services below. Each comparison refers to the same service on the named plan, not to a shared credit balance or a guaranteed number of requests. Unused allowance from one service cannot cover another. Reseller accounts do not receive subscription allowances.

| Included service | Free | Pro | Max |
| --- | --- | --- | --- |
| RAG search and insertion embeddings | Base allowance | 25× Free | 4× Pro |
| Reranking with Reflex | Base allowance | 5× Free | 10× Pro |
| Semantic decisions with Julia-1 | Base allowance | 2.5× Free | 2× Pro |
| Fetch and OCR extraction | Base allowance | 10× Free | 5× Pro |

RAG searches and document insertions share the embedding allowance. It does not cover answer generation, media processing, text classification, or segmentation. A query embedding served from cache does not consume it. Reflex uses a separate reranking allowance that includes both cached and uncached input. Julia-1 is currently the only decision model covered by the semantic decision allowance; other decision models are billed normally. Optional Fetch JSON conversion is separate from the extraction allowance.

Coverage is evaluated for each metered service item: a document's embedding, an individual query-term embedding, a reranking call, a decision call's input usage, or an extraction operation. Each item is either fully included or billed in full at normal rates. Included items are tracked in subscription consumption, not as zero-cost entries in billing history. The current allowances permit a 10% margin above their base capacity. An item that would exceed that margin leaves the allowance unchanged and is billed normally. One request can contain several items, so some may be included while others are charged.

Daily allowances reset at midnight in the server's local time. Check the account's subscription usage indicators for consumption and reset status; usage can exceed 100% while within the margin. LLM subscription coverage is currently disabled, so text-model inference and RAG answer generation remain metered separately. Allowances do not bypass balance requirements, rate limits, or Reflex's separate processing-time cap. See [Pricing](pricing.md) for charges when an item is not covered.

Reseller accounts support 8 concurrent agentic test runs per account.

Integrated model requests are limited by both request count and input tokens. Model rate-limit groups adjust the request-count thresholds:

| Rate-limit group | Threshold multiplier |
| --- | --- |
| Common | 1.0x |
| Discounted | 0.5x |
| Low | 0.3x |
| Free | 0.1x |

For example, a Pro account normally has 200 integrated-model requests per minute. With a `Discounted` model group, the adjusted threshold is 100 requests per minute.

BYOK uses a provider key configured on the gateway instead of an integrated AIVAX model, but requests still pass through AIVAX infrastructure and use the plan's BYOK limit.

Text-classification and text-segmentation quotas each count every item in the request's `documents` array, not each HTTP request. A request that would exceed any active window returns `429 Too Many Requests`. Text classification uses the default embedding model and is billed for the embedding work performed.

Standalone text-to-speech and audio transcription each use their own plan request quota. Voice Sessions use the selected realtime model and are subject to applicable model access, balance, and inference limits instead of these standalone request quotas. Input transcription is not currently supported inside Voice Sessions.

The JSONL import endpoint rejects a request when it reaches the plan's per-request document limit. The reranking limit applies to the autonomous reranking endpoint and to RAG searches that use a reranker, including searches performed through AI Gateways and MCP tools.

The Reflex limit counts the time spent processing Reflex requests. It applies to the autonomous reranking endpoint and RAG searches that use Reflex; cached input does not consume the quota separately. Requests that exceed the plan limit return `429 Too Many Requests`. See [Reflex](rag/reflex.md) for request limits, cache behavior, and pricing.

General service actions share the service-action quota shown above. Batch processing is asynchronous; if processing is paused or fails because of quota, retry after the quota window resets or upgrade the account.

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

Public keys can be used for RAG semantic search, RAG answer generation, speech generation, media descriptions, image generation, and chat completions. For chat completions, public keys also require a full AI Gateway UUID, restrict request parameters, and omit server-side tool surfaces. See [Authentication](authentication.md).
