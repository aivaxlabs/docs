Source: https://docs.aivax.net/docs/pricing.html

# Pricing

AIVAX charges usage to the account balance in USD. Each product documents its own rates in a dedicated pricing section, linked below. This page covers the rules shared by every product.

See [subscription pricing](https://aivax.net/pricing) for monthly plan prices and [Plans and limits](https://docs.aivax.net/docs/limits.md) for account-level quotas. **M** means one million tokens; **1k** means one thousand units. Approximate prices (`~`) vary with the model used and the work performed.

## Product pricing

| Area | Where to find rates |
| --- | --- |
| Inference and moderation | [Inference](https://docs.aivax.net/docs/inference/chat-completions/concepts.md#pricing) |
| Agentic Tests | [Agentic Tests](https://docs.aivax.net/docs/inference/agentic-tests.md#pricing-and-limits) |
| Voice and Realtime | [Voice and Realtime](https://docs.aivax.net/docs/inference/voice-session.md#billing-and-limits) |
| RAG collections, search, and answers | [Collections](https://docs.aivax.net/docs/rag/collections.md#pricing-and-limits) |
| Media Injector | [Documents](https://docs.aivax.net/docs/rag/documents.md#pricing-and-limits) |
| Reflex | [Reflex](https://docs.aivax.net/docs/rag/reflex.md#pricing-and-limits) |
| Web search and X search | [Web Search](https://docs.aivax.net/docs/web-foundation/web-search.md) |
| Fetch and OCR | [Fetch and OCR](https://docs.aivax.net/docs/web-foundation/fetch-and-ocr.md) |
| Image generation | [Image generation](https://docs.aivax.net/docs/generations/images.md) |
| Text-to-speech and speech-to-text | [Text-to-speech](https://docs.aivax.net/docs/generations/speech.md) and [Speech-to-text](https://docs.aivax.net/docs/generations/audio-transcriptions.md) |
| Media descriptions, decisions, classification, and segmentation | [Data processing](https://docs.aivax.net/docs/data-processing/media-descriptions.md) pages |
| Document extraction and summarization | [Extraction](https://docs.aivax.net/docs/data-processing/extraction.md) and [Summarization](https://docs.aivax.net/docs/data-processing/summarization.md) |
| Translations | [Translations](https://docs.aivax.net/docs/data-processing/translations.md) |
| Built-in tools and memory | [Built-in tools](https://docs.aivax.net/docs/tools/builtin-tools.md) |

## Included daily allowances

Every plan includes daily allowances for RAG embeddings, Reflex reranking, semantic decisions, and Fetch/OCR extraction. Usage beyond the allowance is charged at the product rates. Compare the allowances in [Plans and limits](https://docs.aivax.net/docs/limits.md#included-daily-subscription-allowances). These allowances do not cover text-model inference; see [Subscription models](#subscription-models).

## Subscription models

Pro, Max, and Ultimate include a monthly quota for subscription models, the catalog models whose names start with `@aivax-subscription/`. Using them never debits the account balance; other models are charged at their rates. When the quota is exhausted, or on plans without one, requests to subscription models return `429 Too Many Requests`. See [Subscription models](https://docs.aivax.net/docs/inference/subscription-models/overview.md) and [Monthly subscription model quota](https://docs.aivax.net/docs/limits.md#monthly-subscription-model-quota).

## Storage

Each plan includes storage. On Pro, Max, and Ultimate, storage beyond the included amount is billed at the monthly rates below; Free storage cannot be expanded.

| Description | Pricing |
| --- | ---: |
| Free storage | **30 MB included**; no expansion |
| Pro storage | **2 GB included**; excess **$0.50/GB/month** |
| Max storage | **10 GB included**; excess **$0.30/GB/month** |
| Ultimate storage | **20 GB included**; excess **$0.20/GB/month** |

## Request cost header

API responses include a `Consumed-Credits` header with the total charged by the request in USD, for example `Consumed-Credits: 0.000184`. The value includes the plan multiplier and every item charged during the request. The header is omitted when nothing was charged; treat a missing header as zero.

Streamed responses and asynchronous work, such as [Batch](https://docs.aivax.net/docs/inference/batch.md), do not include this header. Use your account usage records as the source of truth for billing.

## Data Sharing discount

Accounts that enable [Data Sharing](https://docs.aivax.net/docs/data-sharing.md) receive a 10% discount on RAG query embeddings and reranking while sharing is enabled.

## Plan multipliers

Usage rates are subject to the plan's inference tax:

| Plan | Inference tax | Daily ceiling on model inference |
| --- | ---: | ---: |
| Free | +25% | $1.50 |
| Pro | +5% | $1.20 |
| Max | +2% | $1.00 |
| Ultimate | 0% | Not applicable |

Once the day's inference tax reaches the ceiling, further model inference that day is charged at the model's rates only. Other services include the plan multiplier in their own rates.

BYOK usage is not affected by inference taxes. Product pages state when a rate is exempt from the plan multiplier, as with image generation.

## Credit top-ups

Adding credits charges the amount you choose plus the payment processor fee and the [taxes on payments](#taxes-on-payments). Only the amount you choose is added to your balance. On Free, a service fee of 5% of the amount, with a $0.20 minimum, is also added; paid plans pay no service fee. The dashboard shows the total before you confirm the payment.

## Taxes on payments

Every payment, including credit top-ups and subscriptions, includes Brazilian taxes added on top of the amount due: about 11.33% of the total in service taxes and 2% in IOF. For example, a $19.00 subscription payment charges $21.92. Listed plan prices do not include taxes, and each receipt lists them.
