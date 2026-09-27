# Changelogs

Technical changes that affect AIVAX products, services, or the public API. Dates identify when entries were added or updated, not confirmed production rollout dates. Each item identifies the affected product or service; maintenance with no user-facing effect is omitted.

## Sunday, September 27th, 2026

Changes:

- **Models — Consistent speech synthesis prices.** Text-to-speech catalog prices now derive from the same per-character rates used to calculate synthesis usage, displayed per 1,000 characters. Existing model identifiers and billing rates remain unchanged.

- **Models — Comparable transcription prices.** Speech-to-text model prices are displayed consistently in USD per minute, converting hourly and per-second rates for comparison without changing billing rates or duration measurement.

- **Image generation — Fixed output and reference prices.** Image generation uses a fixed price per delivered output plus a per-reference price for each output. Models whose providers bill tokens or megapixels now use rounded-up estimates instead of metered token charges. Prompt processing is included in the output estimate; models without a separate reference charge list a zero reference rate. These are fixed tariffs, not receipts for the provider's actual consumption. Image charges no longer include the AIVAX image-generation markup or account and plan pricing multipliers. See [Image generation](generations/images.md).

## Saturday, September 26th, 2026

Breaking changes:

- **Image generation — Deprecated models removed.** Removes `majicMIX-realistic`, `AbsoluteReality`, `CyberRealistic`, `CyberRealistic-Pony`, `RealCartoon-Realistic`, `Hassaku-XL`, and `Meina-Mix` from the available models. Direct API requests using these identifiers now fail; select an active model instead. Built-in image generation uses `flux-schnell` when no valid model is configured, replacing the deprecated `AbsoluteReality` default. Review saved configurations; output style and pricing differ.

Changes:

- **Image generation — Additional Pollinations models.** Adds 16 official raster-image models, including FLUX 1.1 Pro and FLUX 2 variants, MAI Image variants, GPT Image 2.5 Flare and Sunburst, Qwen Image 2.1 and 3, Grok Imagine Image 2.0, Recraft V4.1 Flash, Krea 2 Medium, DreamShaper 8 LCM, and Seedream 5 Pro, with model-generated previews in the image picker. Community and SVG models are excluded. The catalog displays the billing units. See the September 27th entry for the subsequent fixed-price billing change. Failed generations are not counted as delivered images. See [Image generation](generations/images.md).

- **Models — Service model catalogs.** The Models page now includes tables for image generation, speech-to-text, text-to-speech, reranking, and semantic decisions, with backend-provided descriptions, release dates, base USD pricing with billing units, and an Actions dropdown in every service-model table for copying model names and opening integration documentation. Model names show a friendly label when available while copying the identifier accepted by the API. Pricing uses compact input, cached-input, output, image, character, and duration units separated by arrows where applicable, with full rates and units available in the tooltip. Catalogs are ordered newest first. OpenRouter catalog dates and friendly names supplement missing launch metadata; catalog dates are explicitly labeled rather than presented as manufacturer release dates. Models without either date remain last. Failed catalog requests can be retried independently. The public information catalogs expose these details, including the new `GET /api/v1/information/speech-models.json` catalog. Account and plan pricing adjustments still apply. See [Pricing](pricing.md) and [Semantic decisions](generations/decisions.md).

- **Privacy — Judicial disclosure and retention clarified.** The [Privacy Policy](legal/privacy-policy.md) and [Terms of Use](legal/terms-of-service.md) specify Brazilian court orders for disclosure, foreign requests to preserve existing logs for up to 1 year, and up to 1 year of technical logs and metadata. They clarify that conversation content is collected only when Conversations is enabled for the request or account, and that available account resources and backups dating back up to 3 months may be disclosed under a Brazilian court order. The content license in the Terms is expressly subject to these limits.

- **Generations — Additional decision models.** The new [Semantic decisions guide](generations/decisions.md) explains question types, response interpretation, model pricing, and Julia-1 limits. The public `GET /api/v1/information/decisions-models.json` endpoint lists canonical names, aliases, supported question types, context lengths, release dates, and base token prices. Adds `@respan/span-01`, `@respan/span-01-lite`, `@jaredpalmer/kev-4b`, and `@supersonic-labs/julia-1` as model choices for semantic decisions. Julia-1 supports `choice`, `score`, and `noul`, with a 1,024-token combined context per question and 2–20 choices or score levels. Its base price is $0.008 per million input tokens, with no output-token charge; existing account and plan pricing adjustments still apply. Input usage includes the state repeated for each question. Existing model identifiers and request formats remain unchanged.

## Tuesday, September 22nd, 2026

Changes:

- **Models — GPT-6 Sol and Luna added.** Adds `@openai/gpt-6-sol` and `@openai/gpt-6-luna`, including their `:pro` reasoning variants. The `@model-router/openai:mid` and `@model-router/openai:budget` aliases now select GPT-6 Sol and GPT-6 Luna, respectively. Applications using these aliases may see changes in response quality, latency, and cost. Existing explicit model identifiers remain unchanged.

## Monday, September 21st, 2026

Breaking changes:

- **Gateways — Off-topic moderation is being removed.** The dedicated off-topic threshold will no longer block requests that stray from the conversation's purpose. If your application relies on this check, review its topic restrictions before adopting this change; the remaining moderation categories are not an equivalent replacement.
- **Built-in tools — Advanced web research is being disabled.** The `AdvancedWebUsage` tool will return an unavailable response instead of performing research. Remove reliance on this tool from gateway instructions and workflows. Standard [Web Search](web-foundation/web-search.md) and URL extraction remain separate alternatives, not equivalent replacements for multi-step research.
- **Models — Mercury 2.5 model identifier changed.** Replace `@inception/mercury-2.5-preview` with `@inception/mercury-2.5` in requests and gateway settings. The preview identifier is no longer listed, and the replacement is no longer marked as preview.
- **Gateways / MCP — MCP tool names are source-qualified.** Tools from different MCP sources no longer share an unqualified name in the gateway. Review gateway instructions, tool-selection rules, and workers that match exact tool names. The original tool name at the connected MCP server is unchanged. See [MCP functions](tools/mcp.md).

Fixes:

- **Collections, Gateways, and Generations — Service model availability.** Collection answer generation, gateway routing, chat utilities, and media-processing services avoid selecting temporarily unavailable models. Teach Skill and multimodal preprocessing can try another available model after a retryable failure; success still depends on service availability.
- **Teach Skill — Usage calculation.** Teach Skill processing charges use the model pricing associated with the completed request, including when a retry changes the model used. See [Teach Skill](generations/teach-skill.md) and [Pricing](pricing.md).
- **Fetch and OCR — More reliable page extraction.** Cancelled or timed-out page-content requests no longer leave page extraction running indefinitely. This addresses cases where web content extraction could stall.
- **Chat clients — Final reply and message history.** `completionText` now selects the final generated assistant reply rather than combining it with earlier assistant text during tool use. The added `createdMessages` response field preserves newly generated messages in order, including tool interactions; submitted messages are not repeated. Use this field when you need the complete generated turn.
- **Gateways / MCP — Structured MCP results are retained.** Assistants receive structured result content in addition to supported content blocks, avoiding missing information when an MCP tool returns structured output.
- **Fetch and OCR — X post extraction.** Improved readable-text extraction from public X post links. Content availability and access restrictions still apply.
- **Fetch and OCR — Plain-text normalization changed.** Plain-text conversion no longer collapses internal whitespace or normalizes Unicode characters. Surrounding whitespace may still be trimmed in extraction results. Applications that compare extracted text exactly or require normalized spacing should perform that normalization themselves.

Changes:

- **Fetch and OCR — Optional structured extraction.** Supply `responseSchema` to convert extracted content into JSON. Results add `extractedObject` and `jsonProcessingUnits` while retaining `extractedText` on success. Without a schema, the new fields are null and zero respectively. JSON conversion is billed separately from extraction and is not covered by the daily extraction allowance. See [Fetch and OCR](web-foundation/fetch-and-ocr.md).
- **Generations — Semantic decisions.** Evaluate multiple named questions against a shared JSON state using `noul` (true/false criteria), `choice`, or `score`. Responses include named answers, token usage, and cost. The service requires a positive balance, and its token usage contributes to account usage totals.
- **Built-in tools — Current date and time.** The `DateTime` option lets assistants request the current date, time, weekday, time zone, and UTC offset. Set `dateTimeTimeZone` to the desired time zone; the default is `America/Los_Angeles`, with daylight-saving adjustments, independent of the browser's time zone. Invalid time zones are rejected.
- **Models — Additional model choices.** Adds GLM-5.3-FlashX, Fugu Max, Pareto, Ling 3.0 Flash VL, MiMo-V2.6-Pro, MiMo-V2.6-Flash, MiMo-V2.6-Pro-UltraSpeed, and Grok 4.7 to the inference catalog. The Xiaomi frontier, mid, and budget aliases now select MiMo V2.6 models, while `@model-router/grok:latest` selects Grok 4.7. Alias users may see different response quality, latency, and cost; availability and supported capabilities depend on the selected model and account plan.
- **Inference — Transient-failure recovery.** Inference requests can make additional recovery attempts when a provider is temporarily unavailable. This may avoid some failed requests, but can also increase response time before an error is returned.
- **Avi Assistant — Updated default model.** The AIVAX console assistant changes its default model, which may change response style, latency, and usage cost. This does not change the model selected in your own gateways.
- **Documentation — Updated service guidance.** The API documentation overview and Avi Assistant guidance cover voice sessions, agentic tests, classification, segmentation, reranking, and web extraction, with current documentation links and service-specific billing guidance. This is a guidance update, not the introduction of those services.
- **Models — DeepSeek V4.1 Flash added.** The inference catalog includes `@deepseek/deepseek-v4.1-flash` with tool-calling support. Check model availability and plan eligibility before selecting it.
- **Models — Router selections updated.** `@model-router/deepseek:latest` and `@model-router/deepseek:budget` now select DeepSeek V4.1 Flash. Applications using these aliases may see different response quality, latency, and cost without changing the alias. Adds `@model-router/claude:frontier-mythos` and `@model-router/mercury:latest` as additional choices.
- **Chat clients — Structured prompt input.** Synchronous chat-client prompts accept plain text, a single message, or an ordered array of messages, including assistant tool calls and matching tool results. Existing single-message input remains supported. Optional `instructions` adds context for that request without replacing saved session context. See [Chat clients](features/chat-clients.md).
- **Chat clients — Turns without session persistence.** Set `commit` to false to generate a reply without saving the submitted and generated messages to session history. The default remains true. This is not a free preview: inference and tool actions still run. To continue an uncommitted tool interaction, send the assistant tool-call message together with its tool results.
- **Agentic Tests — Optional testing notifications.** Account notification preferences can enable weekly test summaries and alerts when a test reaches three consecutive failures. These complement existing failure and recovery notifications. See [Agentic Tests](inference/agentic-tests.md).
- **Fetch and OCR — Rendered web content.** HTML extraction supports rendered page content, improving coverage of pages whose readable text depends on scripts. Rendering is metered in processing units; this does not guarantee access to every website or restricted page. See [Fetch and OCR](web-foundation/fetch-and-ocr.md).
