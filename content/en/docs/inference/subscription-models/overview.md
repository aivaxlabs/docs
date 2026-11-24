---
{title: Subscription Models Overview,linkTitle: Overview,weight: 10,group: Inference,aliases: [/docs/inference/subscription-models.html]}
---

# Subscription models

Subscription models are text models included in the Pro, Max, and Ultimate plans. Their names start with `@aivax-subscription/`. They use the plan's [monthly subscription model quota](/docs/limits.md#monthly-subscription-model-quota) instead of the account balance, so a request to one of them never debits your credits.

Use them like any other integrated model: in API requests, in AI Gateways, in coding agents and other OpenAI-compatible tools, or for everyday tasks. Free and Custom plans do not include the quota.

## Available models

The table lists each model's context window and the usage included every month, expressed as the equivalent at the model's integrated catalog price. All subscription models share the same quota.

| Model | Context window | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| DeepSeek V4.1 Flash<br>`@aivax-subscription/deepseek-v4.1-flash-1017` | 500K tokens | ≈ $40 | ≈ $160<br>5× Pro | ≈ $380<br>12.5× Pro |
| GLM 5.3<br>`@aivax-subscription/glm-5.3` | 500K tokens | ≈ $40 | ≈ $160<br>5× Pro | ≈ $400<br>12.5× Pro |
| GLM 5.3 Flash<br>`@aivax-subscription/glm-5.3-flash` | 500K tokens | ≈ $40 | ≈ $160<br>5× Pro | ≈ $400<br>12.5× Pro |
| Kimi K3.1 Pro<br>`@aivax-subscription/kimi-k3.1-pro` | 500K tokens | ≈ $40 | ≈ $200<br>5× Pro | ≈ $490<br>12.5× Pro |
| MiniMax M3.1 Flash<br>`@aivax-subscription/minimax-m3.1-flash` | 500K tokens | ≈ $40 | ≈ $160<br>5× Pro | ≈ $400<br>12.5× Pro |
| Qwen3.8 Max<br>`@aivax-subscription/qwen3.8-max` | 500K tokens | ≈ $40 | ≈ $190<br>5× Pro | ≈ $460<br>12.5× Pro |
| Step 5 Preview<br>`@aivax-subscription/step-5-preview` | 500K tokens | ≈ $40 | ≈ $200<br>5× Pro | ≈ $480<br>12.5× Pro |
| Grok 4.7<br>`@aivax-subscription/grok-4.7` | 500K tokens | ≈ $70 | ≈ $320<br>5× Pro | ≈ $800<br>12.5× Pro |

The values are approximate. Spreading usage across several subscription models divides the same quota between them.

The quota window starts with the first request that uses it and lasts one month: using it for the first time on October 15 renews the quota on November 15. See [Monthly subscription model quota](/docs/limits.md#monthly-subscription-model-quota).

## Consumption rate

The rate at which a model consumes the quota can change over time, so similar requests may use slightly more or less of your quota. The included equivalents above change with it.

## Availability

A subscription model runs the model it names. A subscription model can occasionally become unavailable. Requests fail while it is unavailable; use another subscription model or a regular integrated model in the meantime.

## When the quota is exhausted

When the quota is exhausted, or the plan does not include it, a request to a subscription model returns `429 Too Many Requests`. The request is not routed to a model outside the subscription and is never charged to the account balance. To continue before the quota renews, select another model explicitly; regular models are charged to the balance at their rates.

## Data retention

Subscription models are not zero data retention. Prompts sent to them are collected and kept for an indefinite period for moderation and internal control. According to the providers' terms, they are not used for training.

With [Zero data retention providers only](/docs/inference/routing/zdr.md) enabled, requests to subscription models fail. Do not send personal, confidential, or regulated data to these models unless that retention is acceptable. AIVAX's own records follow the account's conversation logging setting; see [Data Processors](/docs/legal/third-party-processors.md#inference).

## Identify subscription models

Subscription models have no per-token prices in the catalog. To identify them from an application, check `flags.isSubscription` in `GET /api/v1/information/models.json` or `_details.provider_model.subscription` in `GET /v1/models`. See [Models and gateway names](/docs/inference/ai-gateways/models-and-gateway-names.md).
