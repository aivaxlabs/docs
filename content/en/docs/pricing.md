---
{title: Pricing,linkTitle: Pricing,weight: 30,group: Introduction,aliases: [/docs/platform/account-balance.html]}
---

# Pricing

AIVAX charges usage to the account balance in USD. Each product documents its own rates in a dedicated pricing section, linked below. This page covers the rules shared by every product: subscription allowances, storage, the request cost header, the data sharing discount, and plan multipliers.

See [subscription pricing](https://aivax.net/pricing) for monthly plan prices and [Plans and limits](limits.md) for account-level quotas. **M** means one million tokens; **1k** means one thousand units. Approximate prices (`~`) vary with the model used and the work performed.

## Product pricing

| Area | Where to find rates |
| --- | --- |
| Inference and moderation | [Inference](inference/inference.md#pricing) |
| Agentic Tests | [Agentic Tests](inference/agentic-tests.md#pricing-and-limits) |
| Voice and Realtime | [Voice and Realtime](inference/voice-session.md#billing-and-limits) |
| RAG collections, search, and answers | [Collections](rag/collections.md#pricing-and-limits) |
| Media Injector | [Documents](rag/documents.md#pricing-and-limits) |
| Reflex | [Reflex](rag/reflex.md#pricing-and-limits) |
| Web search and X search | [Web Search](web-foundation/web-search.md) |
| Fetch and OCR | [Fetch and OCR](web-foundation/fetch-and-ocr.md) |
| Image generation | [Image generation](generations/images.md) |
| Text-to-speech and speech-to-text | [Text-to-speech](generations/speech.md) and [Speech-to-text](generations/audio-transcriptions.md) |
| Media descriptions, decisions, classification, and segmentation | [Data processing](data-processing/media-descriptions.md) pages |
| Document extraction and summarization | [Extraction](data-processing/extraction.md) and [Summarization](data-processing/summarization.md) |
| Translations | [Translations](data-processing/translations.md) |
| Built-in tools and memory | [Built-in tools](tools/builtin-tools.md) |

## Included daily allowances

Free, Pro, and Max include separate daily allowances for eligible RAG embeddings, Reflex reranking, eligible semantic decisions, and Fetch/OCR extraction. Product rates apply when a metered item is not covered. Coverage is all-or-nothing per item, not necessarily per complete request: an item that cannot fit within the remaining allowance and its permitted margin is billed in full. Compare the allowances and check exclusions in [Plans and limits](limits.md#included-daily-subscription-allowances). LLM subscription coverage is currently disabled. For what each allowance covers, see [Free RAG API: embeddings, reranking and OCR limits](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

## Storage

Each plan includes storage. Pro and Max overages are billed hourly at the monthly rates below; Free storage cannot be expanded.

| Description | Pricing |
| --- | ---: |
| Free storage | **30 MB included**; no expansion |
| Pro storage | **2 GB included**; excess **$0.50/GB/month** |
| Max storage | **20 GB included**; excess **$0.20/GB/month** |

## Request cost header

API responses include a `Consumed-Credits` header when the request charged usage to your account balance. Its value is the total charged by that request in USD, written as a decimal number with a dot separator, for example `Consumed-Credits: 0.000184`. It already includes the plan multiplier and covers every item charged during the request, such as inference, embeddings, reranking, and tool usage.

The header is omitted when the request charged nothing, including requests rejected by validation or covered entirely by a daily subscription allowance. Treat a missing header as zero.

The value only covers charges recorded before the response is sent. Usage recorded later, such as asynchronous [Batch](inference/batch.md) work, is not included. Streamed responses send their headers before generation completes, so do not rely on this header for them; read the usage reported at the end of the stream instead. Use your account usage records as the source of truth for billing.

## Data Sharing discount

Accounts that enable [Data Sharing](data-sharing.md) receive a 10% discount on eligible RAG query-embedding usage and eligible reranking operations performed while sharing is enabled. Other services keep their regular prices.

## Plan multipliers

Usage rates are subject to the plan's inference tax:

| Plan | Inference tax |
| --- | ---: |
| Free | +25% |
| Pro | +5% |
| Max | 0% |

BYOK usage is not affected by inference taxes. Product pages state when a rate is exempt from the plan multiplier, as with image generation.
