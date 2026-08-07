# Pricing

AIVAX uses a prepaid account balance. Paid invoices add credit to the account, and usage records subtract from that balance.

The backend calculates balance as:

```text
balance = paid, unexpired invoice total - usage total
```

Use the [AIVAX pricing page](https://aivax.net/pricing) for current commercial plan prices. This page documents billing behavior that is visible in the API source.

## Credits and invoices

Credits are represented as invoices.

- Paid invoices increase the usable account balance until their expiration date.
- Unpaid payment invoices are created with a one-year expiration.
- Unpaid invoices older than three days are removed by cleanup.
- Expired paid invoices no longer count toward balance.
- Payment invoice creation requires at least 3 USD and is rate-limited.

## Usage billing

Every billable operation writes one or more usage records. Each usage record has:

- Description.
- Unit price.
- Quantity.
- Optional model name.
- Usage category.
- Resources such as API key, gateway, or collection.

The final unit price is multiplied by the account tax multiplier and the current plan commission multiplier.

| Plan | Commission multiplier |
| --- | --- |
| Free | 1.25x |
| Pro | 1.05x |
| Max | 1.00x |

## Pricing list

| Service | Pricing |
| ------- | ------------ |
| **Account** |
| Storage | - Free Plan: **30 MB** included, no expansion<br>- Pro Plan: **2 GB** included, **$0.50/GB/month** for excess, billed hourly<br>- Max Plan: **20 GB** included, **$0.20/GB/month** for excess, billed hourly |
| **Inference** |
| Moderation | - Input: **$0.10/M tokens**<br>- Cache: **$0.0375/M tokens**<br>- Output: **$0.30/M tokens**<br>- Context size: 16K tokens |
| **RAG and collections** |
| Collections | Text embedding: **$0.015/M tokens** |
| Semantic search | Query: **$0.015/M tokens** |
| RAG responses | ~**$0.50/M tokens** (3) |
| Text segmentation | **$0.30/M tokens** |
| Text classification | **$0.015/M tokens** |
| Reflex | - Cache miss: **$0.015/M tokens**<br>- Cache hit: **$0.003/M tokens** |
| **Voice and speech** |
| Voice Sessions | **$0.05/minute** |
| **Internet access** |
| Web search | **$5/1k searches** |
| X (Twitter) search | **$5/1k searches** |
| Advanced web search | ~**$0.75/M tokens** (1) |
| Fetch and OCR extraction | - Free Plan: **1,000 PU/day free**, **$0.15/1k PUs**<br>- Pro Plan: **10,000 PU/day free**, **$0.05/1k PUs**<br>- Max Plan: **50,000 PU/day free**, **$0.02/1k PUs** (2) |
| **Media generation** |
| Image generation | Varies by model |
| Speech-to-text | Varies by model |
| Text-to-speech | Varies by model |
| Media descriptions | **~$1.50/mtokens** (2) |
| **Other tools** |
| Memory and calendar | No cost |
| Advanced requests | No cost |
| Document generation | No cost |
| Web page generation | No cost |

- <small>(1) Advanced internet search pricing applies to an external model connected to internet and search tools; the price varies based on the number of interactions performed by the agent.</small>
- <small>(2) Pricing for text extraction from media applies to a small omni-modal model, subject to availability.</small>
- <small>(3) Pricing for RAG response generation does not include the cost of query embedding; the price varies based on the summarization model.</small>
## Inference billing

Integrated model billing uses the model's pricing table from the backend. Pricing can vary by model and by input-token threshold. Usage can include:

- Text input tokens.
- Cached input tokens, when the selected model has cached-input pricing.
- Audio input tokens, when applicable.
- Output tokens.

BYOK (Bring-Your-Own-Key) calls use your external provider key, but AIVAX still enforces BYOK request limits because the request passes through AIVAX infrastructure.

## Balance requirements

Billable routes check balance before running. The generic balance middleware rejects balances below the route minimum; chat clients, integrations, and batch processing also stop when the balance is zero or negative. Some multimodal chat-completion inputs require a minimum balance before the model call starts:

| Input type | Minimum balance |
| --- | --- |
| Image or audio | $0.10 |
| File or video | $0.50 |

If the account balance is too low, the API returns `402 Payment Required`.

## Plans and limits

Plans affect both price and operation:

- Model access.
- Commission multiplier.
- Request and token rate limits.
- BYOK request limits.
- RAG quotas.
- Tool limits.
- Storage quota and overage price.
- Conversation retention.
- Subscription-model reserve windows.

See [Plans and limits](limits.md) for the technical quota matrix.
