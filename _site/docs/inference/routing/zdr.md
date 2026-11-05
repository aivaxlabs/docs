Source: https://docs.aivax.net/docs/inference/routing/zdr.html

# Zero data retention providers only

Enable **Zero data retention providers only** in the dashboard account settings to route text inference with integrated models only to providers that do not retain prompts. Providers that are not zero data retention are excluded before `allowed_providers` and `preset` are applied. When the model has no zero data retention provider available, the request fails instead of falling back to another provider; choose a model with a zero data retention provider or disable the option.

The option applies only to text inference. It does not change conversation logging; use `allow_logging` or the account's conversation logging setting for that.
