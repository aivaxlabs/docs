Source: https://docs.aivax.net/docs/inference/providers.html

# Providers

Providers are the services that actually run the integrated models you call through AIVAX. A single model can be offered by several providers, each with its own price, speed, capacity, and data collection policy. AIVAX chooses among them according to your [routing preferences](https://docs.aivax.net/docs/inference/routing/setup-routing.md) and account settings.

## Where providers come from

Each model's providers are listed on the [Models page](https://aivax.net/models). AIVAX works as a marketplace: providers offer the models they distribute, and AIVAX lists those offers. Because the providers decide what they offer, a provider can be added to or removed from a model without prior notice.

Some providers are negotiated directly with AIVAX. Others are aggregators of other services, and AIVAX lists the providers available through them. In both cases, your AIVAX account rules apply to every provider. For example, [Zero data retention providers only](https://docs.aivax.net/docs/inference/routing/zdr.md) excludes any provider that does not declare zero data retention, regardless of how it is reached.

## Data collection

Providers can see the content of your requests. Depending on the provider, prompts and responses may be moderated, collected, retained, or used for training.

The Models page shows the data collection policy of each provider. The policy is declared by the provider itself; when a provider does not declare one, the platform classifies it as **unknown**.

To keep sensitive content away from providers that retain data, you control which providers are eligible:

- Enable [Zero data retention providers only](https://docs.aivax.net/docs/inference/routing/zdr.md) in the account settings.
- Restrict the eligible providers with `allowed_providers`; see [Setup provider routing](https://docs.aivax.net/docs/inference/routing/setup-routing.md).
- Review the provider policies listed on the Models page before sending personal, confidential, or regulated data. See also [Data Processors](https://docs.aivax.net/docs/legal/third-party-processors.md#inference).

## Lower-cost providers

Some providers offer a model at a lower cost than usual, through special agreements or dedicated hardware.

These offers are usually served by [special providers](https://docs.aivax.net/docs/inference/routing/special-providers.md), which are used only when your routing preference and account settings allow them.

## Model authenticity

AIVAX continuously collects anonymous metrics about each provider's performance, latency, and problem-solving ability, including by sending random tasks, to check that the model served is the one advertised. These checks are applied with much more rigor to special providers and to the providers behind subscription models.

When a provider is suspected of serving a different model, AIVAX immediately verifies and audits it. Providers found not to be genuine are removed from the provider pool immediately.

## Special providers

[Special providers](https://docs.aivax.net/docs/inference/routing/special-providers.md) are often dedicated endpoints whose operators agreed directly with AIVAX to supply the models. For this reason, they are classified as **hidden**, and their identity is not disclosed. AIVAX remains committed to the quality and authenticity of these providers, which are subject to the checks described in [Model authenticity](#model-authenticity).

## Subscription model providers

[Subscription models](https://docs.aivax.net/docs/inference/subscription-models/overview.md) are served by special dedicated endpoints from an internal pool of providers. They use your plan's [monthly subscription model quota](https://docs.aivax.net/docs/pricing/plans-and-limits.md#monthly-subscription-model-quota) and are subject to the checks described in [Model authenticity](#model-authenticity).
