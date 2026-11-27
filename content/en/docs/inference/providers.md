---
{title: Providers,linkTitle: Providers,weight: 3,group: Inference}
---

# Providers

Providers are the services that actually run the integrated models you call through AIVAX. A single model can be offered by several providers, each with its own price, speed, capacity, and data collection policy. AIVAX chooses among them according to your [routing preferences](/docs/inference/routing/setup-routing.md) and account settings.

## Where providers come from

Each model's providers are listed on the [Models page](https://aivax.net/models). AIVAX works as a marketplace: providers offer the models they distribute, and AIVAX lists those offers. Because the providers decide what they offer, a provider can be added to or removed from a model without prior notice.

Some providers are negotiated directly with AIVAX. Others are aggregators of other services, such as OpenRouter, Vertex AI, or other routers, and AIVAX lists the providers available through them. In both cases, your AIVAX account rules apply to every provider. For example, [Zero data retention providers only](/docs/inference/routing/zdr.md) excludes any provider that does not declare zero data retention, regardless of how it is reached.

## Data collection

Providers can see the content of your requests. Depending on the provider, prompts and responses may be moderated, collected, retained, or used for training.

The Models page shows the data collection policy of each provider. The policy is declared by the provider itself; when a provider does not declare one, the platform classifies it as **unknown**. These policies are commitments the providers make to AIVAX. AIVAX does not audit or verify that they are followed.

To keep sensitive content away from providers that retain data:

- Enable [Zero data retention providers only](/docs/inference/routing/zdr.md) in the account settings.
- Restrict the eligible providers with `allowed_providers`; see [Setup provider routing](/docs/inference/routing/setup-routing.md).
- Review the provider policies listed on the Models page before sending personal, confidential, or regulated data. See also [Data Processors](/docs/legal/third-party-processors.md#inference).

## Prices below the model's usual rate

Some providers charge much less than the model's usual rate. These offers come from special agreements or serve the model with reduced capacity. They can be obtained in several ways, such as the sale of surplus quota, direct negotiations, or dedicated hardware.

Discounted offers are usually served by [special providers](/docs/inference/routing/special-providers.md), which are used only when your routing preference and account settings allow them.

## Model authenticity

It is rare for a provider to misrepresent which model it serves. AIVAX continuously collects anonymous metrics about each provider's performance, latency, and problem-solving ability, including by sending random tasks, to check that the model served is the one advertised. These checks are applied with much more rigor to special providers and to the providers behind subscription models.

When a provider is suspected of serving a different model, AIVAX immediately verifies and audits it. Providers found not to be genuine are removed from the provider pool immediately.

## Special providers

[Special providers](/docs/inference/routing/special-providers.md) are often dedicated endpoints whose operators agreed directly with AIVAX to supply the models. For this reason, they are classified as **hidden**, and their identity is not disclosed. AIVAX remains committed to the quality and authenticity of these providers, which are subject to the checks described in [Model authenticity](#model-authenticity).

## Subscription model providers

[Subscription models](/docs/inference/subscription-models/overview.md) are served by special dedicated endpoints from an internal pool of providers, with negotiated rates, that supply models according to availability. These rates are volatile and can change from hour to hour, but they always stay below the model's original rates. This is why a subscription model's [consumption rate](/docs/inference/subscription-models/overview.md#consumption-rate) can change over time.
