Source: https://docs.aivax.net/docs/pricing/coding-plans.html

# Coding Plans

Coding plans are monthly subscriptions built around [subscription models](https://docs.aivax.net/docs/inference/subscription-models/overview.md). They include a larger subscription model quota and higher inference limits than Free, and keep the Free limits for every other platform resource. Use them for coding agents, editors, and personal tools. For RAG, storage, data processing, and production workloads, the Enterprise plans (Pro, Max, and Ultimate) raise the limits of every resource; see [Plans and limits](https://docs.aivax.net/docs/pricing/plans-and-limits.md).

An account has one plan at a time. Subscribing to a coding plan replaces the current plan.

## Plans

| | Coder Lite | Coder Plus |
| --- | --- | --- |
| Monthly price | $8 | $39 |
| Monthly subscription model quota | 3× the Pro quota | 15× the Pro quota, or 3× the Max quota |
| Integrated model requests | 30/min | 50/min |
| Integrated model input tokens | 5,000,000/min | 15,000,000/min |
| BYOK requests | 50/min | 50/min |
| Maximum context | — | — |

An em dash (`—`) means the plan does not impose a limit. Integrated model requests have no daily limit.

Prices do not include the [taxes on payments](https://docs.aivax.net/docs/pricing/product-pricing.md#taxes-on-payments). The quota works like the Enterprise one: it renews one month after its first use in each cycle, and all subscription models share it. See [Monthly subscription model quota](https://docs.aivax.net/docs/pricing/plans-and-limits.md#monthly-subscription-model-quota).

Credit top-ups have no service fee. Every other limit is the same as on Free, including model access, the inference commission, storage, retention, RAG, data processing, and the included daily allowances. See the Free column in [Plans and limits](https://docs.aivax.net/docs/pricing/plans-and-limits.md).

## Choosing between coding and Enterprise plans

Moving from an Enterprise plan to a coding plan lowers every platform limit to the Free values. Before switching, check that the account fits them: storage above the Free quota blocks requests until usage is reduced, and gateways that use models outside the low-price group stop working.

## Subscribing

Subscribe or switch with the subscriptions API, sending `CoderLite` or `CoderPlus` as the plan to [Change Plan](https://inference.aivax.net/apidocs/llms.txt?endpoint=POST%20%2Fapi%2Fv1%2Fsubscriptions%2Fplan). `GET /api/v1/subscriptions` lists every plan with its `category`, `Enterprise` or `Coding`.

Billing follows the same rules as the Enterprise plans. A change to a plan with a higher monthly price is charged now, discounting the unused days of the current plan. A change to a plan with a lower monthly price takes effect at the next renewal.

`GET /api/v1/accounts` reports the plan type in `planType`: `Free`, `Enterprise`, or `Coding`.
