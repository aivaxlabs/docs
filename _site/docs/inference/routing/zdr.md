Source: https://docs.aivax.net/docs/inference/routing/zdr.html

# Zero data retention providers only

Enable **Zero data retention providers only** in the dashboard account settings to route text inference with integrated models only to providers that declare zero data retention for prompts. The classification is based on the data retention policy each provider declares.

## How it affects routing

Providers that are not classified as zero data retention are excluded before `allowed_providers` and `preset` are applied. When the model has no zero data retention provider available, the request fails instead of falling back to another provider. In that case, choose a model with a zero data retention provider or disable the option.

## What it does not change

The option applies to text inference. It does not change conversation logging; use `allow_logging` or the account's conversation logging setting for that.

## Platform steps

Platform steps that run around a request, such as content moderation, the complexity router, and RAG query rewriting, always use a zero data retention provider, whether or not the account option is enabled. If none is available for one of them, the request fails and can be retried later.
