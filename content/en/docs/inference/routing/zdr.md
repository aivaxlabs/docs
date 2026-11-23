---
{title: Zero Data Retention Providers,linkTitle: ZDR,weight: 30,group: Routing}
---

# Zero data retention providers only

Enable **Zero data retention providers only** in the dashboard account settings to route text inference with integrated models only to providers that declare zero data retention for prompts. Providers that are not classified as zero data retention are excluded before `allowed_providers` and `preset` are applied. When the model has no zero data retention provider available, the request fails instead of falling back to another provider; choose a model with a zero data retention provider or disable the option.

The zero data retention classification reflects what each provider or aggregator declares. AIVAX does not audit, verify, or guarantee that third parties do not collect, retain, or use prompts, and is not responsible for a third party's failure to honor those declarations.

The option applies to text inference. It does not change conversation logging; use `allow_logging` or the account's conversation logging setting for that.

Platform steps that run before or around a request always use a zero data retention provider, whether or not the account option is enabled: content moderation, the complexity router, RAG query rewriting, the summary read aloud by chat clients, the rewrite of text with voice instructions for speech generation, and Media Injector. Disabling the option does not move those steps to another provider. When no zero data retention provider is available for one of them, the request fails and should be retried later.
