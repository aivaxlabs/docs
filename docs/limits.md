# Plans and Limits

AIVAX has three account plans: **Free**, **Pro**, and **Max**. The current plan is stored on the account and controls model access, commissions, rate limits, RAG quotas, tool limits, storage quota, conversation retention, and subscription-model reserve windows.

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
| Subscription model reserve | Not included | 250 units/6h and 3,000 units/week | 1,000 units/6h and 15,000 units/week |
| Text-to-speech requests | 3/min and 15/hour | 30/min | 300/min |
| **RAG and collections** |  |  |  |
| Collections | 5 | — | — |
| Semantic searches | 20/min | 500/min | 3,000/min |
| Reranking searches | 30/min | 1,000/min | — |
| Reflex input tokens | 128,000/min | 1,000,000/min | 50,000,000/min |
| Document insertions | 500/day | 10,000/day | — |
| JSONL documents per import request | 1,000 | 10,000 | 1,000,000 |
| Compound file processing | Not available | 3 files/day | 10 files/day |
| **Built-in tools** |  |  |  |
| Web search | 15/day | 1,000/day | 10,000/day |
| X/Twitter search | Not available | 1,000/day | 10,000/day |
| Advanced web search | Not available | 100/day | 1,000/day |
| Document and web page generation | 5/day | 1,000/day | 50,000/day |
| Image generation and editing | 5/day | 500/day | 5,000/day |
| General service actions | 30/day | 5,000/day | 100,000/day |
| Bash commands | 30/hour | 1,500/hour | 10,000/hour |
| **Batch processing** |  |  |  |
| Workflow items processed | 500/day | 100,000/day | — |
| Files per import request | 1,000 | 1,000 | 1,000 |
| Total import size | 100 MB/request | 100 MB/request | 100 MB/request |
| Single imported file size | 10 MB | 10 MB | 10 MB |
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

The JSONL import endpoint rejects a request when it reaches the plan's per-request document limit. The reranking limit applies to RAG searches that use a reranker, including searches performed through AI Gateways and MCP tools.

The Reflex limit counts all query and document input tokens reported for a request, including cached input tokens. Requests that exceed the plan limit return `429 Too Many Requests`. See [Reflex](rag/reflex.md) for request limits, cache behavior, and pricing.

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
