---
{title: Changelogs,linkTitle: Changelogs,weight: 70,group: Introduction}
---

# Changelogs

Technical changes that affect AIVAX products, services, or the public API. Dates identify when entries were added or updated, not confirmed production rollout dates. Each item identifies the affected product or service; maintenance with no user-facing effect is omitted.

## Monday, October 5th, 2026

Breaking changes:

- **Chat clients — Current date and time are no longer added to the instructions.** Telegram and WhatsApp integrations, including scheduled messages, no longer add the server date and time to the model instructions. Models must get the current time from a tool. To keep date-aware behavior, such as reminders, enable the date and time built-in function or the shell (`date` command) on the AI gateway used by the chat client.

Fixes:

- **AI gateways — Shell tool commands without parameters now run.** In the gateway shell, calling a tool that has no parameters, such as `list_scheduled_jobs`, now runs it instead of printing its help. Use `--help` to view the help.

- **Collections — De-duplication no longer stops before removing documents.** A de-duplication task that found duplicate documents could stop with zero documents removed and no backup files, because saving the backup of the removed documents failed. These tasks now save the backup files, remove the duplicates, and include the download links in the completion notification. Tasks that stopped this way did not remove any documents; start a new task to retry.

Changes:

- **AI gateways — Time zone and culture for the shell.** The gateway shell options accept `timeZone`, an IANA time zone such as `America/Sao_Paulo`, and `culture`, such as `pt-BR`. The `date` command uses the time zone for its output and for dates without an explicit offset, and uses the culture for day and month names. The defaults remain UTC and the invariant culture; `date -u` always prints UTC.
- **RAG — Document filters for semantic search and answer generation.** The semantic search and answer generation endpoints accept an optional `filter` field that restricts the search to documents matching conditions on name, content, tags, creation and update dates, or metadata, such as `tags has "finance" and createdAt >= now-30d`. The field accepts a string or an array of strings combined with `and`. Filters are applied before the search terms are embedded; when no document matches, the request returns an empty result without embedding or search charges. Invalid filters return `400 Bad Request` with the error position. Filters are not yet available in AI gateway RAG or the Collections MCP. See [Document Filters](filters/document-filters.md).
- **RAG — Filters and visual results in the collection playground.** The collection playground has a Filters section where each line is a document filter; all lines must match and are sent as the `filter` array. Results can be viewed as Visual, showing the generated answer and each document with its score, metadata, and referenced documents, or as raw JSON. The playground now uses the `rrf` reranker by default; you can still choose another reranker.

## Saturday, October 3rd, 2026

Changes:

- **Documentation — Updated reading and search experience.** Documentation adds language-specific search, light and dark themes, mobile navigation, and a page menu for viewing or copying Markdown. AI agents can use the documentation index and full-text files. Existing documentation URLs continue to resolve; some older guides redirect to their current product documentation.

## Friday, October 2nd, 2026

Changes:

- **Models — Claude Sonnet 5.5 and GPT-6.1 Sol added.** Adds `@anthropic/claude-5.5-sonnet` (Claude Sonnet 5.5), the direct successor to Claude Sonnet 5, and `@openai/gpt-6.1-sol` (GPT-6.1 Sol), an upgrade to GPT-6 Sol, to the text model catalog. Both support thinking, image and file input, and tool calling; GPT-6.1 Sol also supports structured output. The `@model-router/claude:mid` and `@model-router/openai:mid` aliases now select Claude Sonnet 5.5 and GPT-6.1 Sol, replacing Claude Sonnet 5 and GPT-6 Sol, respectively. Applications using these aliases may see changes in response quality, latency, and cost. Existing explicit model identifiers remain unchanged.

## Thursday, October 1st, 2026

Breaking changes:

- **API — Error status codes reflect the failure source.** Failures are no longer all returned as `400 Bad Request` by account, RAG, web, and generation endpoints. Invalid requests still return `400`, and authentication, balance, and permission failures that previously surfaced as `400` now return `401`, `402`, or `403`. Unexpected AIVAX failures return `500 Internal Server Error` with a generic message, and unavailable external services, including model providers, return `503 Service Unavailable` with a `Retry-After` header. On OpenAI-compatible endpoints, the error `code` is now `invalid_request_error`, `service_unavailable`, or `server_error` instead of always `server_error`. Clients that treat every non-2xx response as a request error should retry `500` and `503` responses, honoring `Retry-After`. See [Troubleshoot the first request](getting-started.md#troubleshoot-the-first-request).

Fixes:

- **Chat completions — Malformed tool declarations rejected as invalid requests.** Requests whose `tools` entries have missing or wrongly typed fields now return `400 Bad Request` instead of a server error.

- **Gateways — Bash tool reports invalid options to the model.** Unknown options or values that do not match a tool's parameters now return a command error that the model can correct, instead of failing the tool call.

Changes:

- **MCP utilities — Media generation MCP.** A new hosted MCP server at `https://inference.aivax.net/v1/mcp/media-generation` exposes `list_models`, `generate_image`, and `generate_speech` to MCP-compatible clients. `list_models` takes a `type` of `image` or `audio`; generated images and MP3 speech are returned as public URLs. Use the optional `X-Mcp-Enabled-Tools` header to choose which tools a client sees. Generations use the same pricing and limits as the Image Generation and Speech Generation APIs and require a positive balance. See [Media generation MCP](mcp-utilities/media-generation-mcp.md).

## Monday, September 28th, 2026

Fixes:

- **Gateways — Bash tool help accepts nullable parameters.** Requesting help for tools whose parameters accept multiple types, including `null`, no longer fails while listing their arguments. Help preserves the accepted types and nested parameter paths. No tool schema changes are required.

- **Chat integrations — Failure notifications restored.** Streaming and non-streaming conversations again attempt to send “System: something went wrong. Please, try again later.” after an unrecoverable generation failure, exhausted recovery attempts, or a turn that sends no message. A final failure is reported even if an earlier partial reply was delivered. Notification delivery still depends on the messaging service being available.

Changes:

- **Gateways / MCP — Server instructions and remote skills.** MCP sources can include server instructions and root skill documents alongside tools, including sources added by workers. Both options default to enabled; set `allowClientInstructions` or `allowRemoteSkills` to `false` to exclude that content. Skill discovery requires the remote server to advertise compatible capabilities; account skills remain available. Remote skill content is checked against its advertised size, digest, and frontmatter. Dynamic skills, supporting files, scripts, and servers requiring the newer discovery protocol are not supported. See [MCP functions](tools/mcp.md#server-instructions-and-remote-skills) for compatibility and trust limits.

- **Gateways — Time zone selection.** The current date and time setting now offers a time zone dropdown grouped by region, including UTC. Existing saved time zones are preserved when reopening the setting.

- **Models — Seven new text models.** Adds `@cohere/command-a-plus`, `@upstage/solar-mini4`, `@aion-labs/aion-3.5`, `@aion-labs/aion-3.5-mini`, `@qwen/qwen3.8-max-prime`, `@z-ai/glm-5.3-prime`, and `@fireworks/ember-1` as selectable text models, billed per provider at published token rates with existing account and plan adjustments still applying. Upstage and Fireworks models now display their provider icons instead of the generic fallback. Existing model identifiers remain unchanged.

## Sunday, September 27th, 2026

Changes:

- **Telegram — Compact tool progress.** Streamed replies show only the latest tool preamble in the thinking indicator when tool-call visibility is enabled, instead of accumulating tool-name blocks in the response. The final reply contains no tool-progress blocks. Other messaging channels and non-streamed replies are unchanged.

- **Gateways — Bash tool selection.** The Bash tool list now includes a shortcut for `get_date_time` (Current date and time). Inclusion and exclusion lists accept case-insensitive wildcard patterns: `*` matches any number of characters, as in `something_*`, and `?` matches one character. Exact tool names remain supported.

- **Semantic decisions and Agentic Tests — Account rate limits.** Per-minute account limits apply to semantic decision requests and new Agentic Test runs; manual, scheduled, and direct evaluations share the test-run limit. Requests above the limit return HTTP 429, while scheduled tests wait for a later scheduling check. Clients should pace requests and retry after the rate-limit window clears. Existing inference limits still apply. See [Plans and Limits](limits.md#semantic-decision-and-agentic-test-rate-limits), [Semantic decisions](generations/decisions.md#account-rate-limits), and [Agentic Tests](inference/agentic-tests.md#run-and-inspect-a-test).

- **Models — Consistent speech synthesis prices.** Text-to-speech catalog prices now derive from the same per-character rates used to calculate synthesis usage, displayed per 1,000 characters. Existing model identifiers and billing rates remain unchanged.

- **Models — Comparable transcription prices.** Speech-to-text model prices are displayed consistently in USD per minute, converting hourly and per-second rates for comparison without changing billing rates or duration measurement.

- **Image generation — Fixed output and reference prices.** Image generation uses a fixed price per delivered output plus a per-reference price for each output. Models whose providers bill tokens or megapixels now use rounded-up estimates instead of metered token charges. Prompt processing is included in the output estimate; models without a separate reference charge list a zero reference rate. These are fixed tariffs, not receipts for the provider's actual consumption. Image charges no longer include the AIVAX image-generation markup or account and plan pricing multipliers. See [Image generation](generations/images.md).
- **Models — Subscription coverage.** The Models page now includes a “Subscription Usage” column for rerankers and semantic decision models. “Included” identifies models eligible for daily plan allowances; “-” identifies models without coverage. Eligibility does not indicate an account's remaining allowance. Both service catalogs expose this eligibility as `subscriptionUsage`.

- **Subscriptions — Included daily usage allowances.** Free, Pro, and Max subscriptions include separate daily allowances for RAG search and insertion embeddings, Reflex input (including cached input), and Julia-1 semantic decisions. Each metered item is either fully included or billed at normal rates; a request with multiple items can combine included and paid usage. This also applies to OCR extraction, replacing partial coverage. Included items appear in subscription consumption without zero-cost billing-history entries; usage indicators may exceed the base allowance within the permitted margin. Uncovered items retain normal billing records. `includesSubscriptionModels` is false while inference subscriptions are disabled; LLM subscription coverage remains disabled. Reflex's daily processing-time cap remains separate, and reseller accounts do not receive subscription allowances. See [Plans and Limits](limits.md#included-daily-subscription-allowances) and [Pricing](pricing.md).

## Saturday, September 26th, 2026

Breaking changes:

- **Image generation — Deprecated models removed.** Removes `majicMIX-realistic`, `AbsoluteReality`, `CyberRealistic`, `CyberRealistic-Pony`, `RealCartoon-Realistic`, `Hassaku-XL`, and `Meina-Mix` from the available models. Direct API requests using these identifiers now fail; select an active model instead. Built-in image generation uses `flux-schnell` when no valid model is configured, replacing the deprecated `AbsoluteReality` default. Review saved configurations; output style and pricing differ.

Changes:

- **Image generation — Additional Pollinations models.** Adds 16 official raster-image models, including FLUX 1.1 Pro and FLUX 2 variants, MAI Image variants, GPT Image 2.5 Flare and Sunburst, Qwen Image 2.1 and 3, Grok Imagine Image 2.0, Recraft V4.1 Flash, Krea 2 Medium, DreamShaper 8 LCM, and Seedream 5 Pro, with model-generated previews in the image picker. Community and SVG models are excluded. The catalog displays the billing units. See the September 27th entry for the subsequent fixed-price billing change. Failed generations are not counted as delivered images. See [Image generation](generations/images.md).

- **Models — Service model catalogs.** The Models page now includes tables for image generation, speech-to-text, text-to-speech, reranking, and semantic decisions, with backend-provided descriptions, release dates, base USD pricing with billing units, and an Actions dropdown in every service-model table for copying model names and opening integration documentation. Model names show a friendly label when available while copying the identifier accepted by the API. Pricing uses compact input, cached-input, output, image, character, and duration units separated by arrows where applicable, with full rates and units available in the tooltip. Catalogs are ordered newest first. OpenRouter catalog dates and friendly names supplement missing launch metadata; catalog dates are explicitly labeled rather than presented as manufacturer release dates. Models without either date remain last. Failed catalog requests can be retried independently. The public information catalogs expose these details, including the new `GET /api/v1/information/speech-models.json` catalog. Account and plan pricing adjustments still apply. See [Pricing](pricing.md) and [Semantic decisions](generations/decisions.md).

- **Privacy — Judicial disclosure and retention clarified.** The [Privacy Policy](legal/privacy-policy.md) and [Terms of Use](legal/terms-of-service.md) specify Brazilian court orders for disclosure, foreign requests to preserve existing logs for up to 1 year, and up to 1 year of technical logs and metadata. They clarify that conversation content is collected only when Conversations is enabled for the request or account, and that available account resources and backups dating back up to 3 months may be disclosed under a Brazilian court order. The content license in the Terms is expressly subject to these limits.

- **Generations — Additional decision models.** The [Semantic decisions guide](generations/decisions.md) explains question types and response interpretation. The public `GET /api/v1/information/decisions-models.json` endpoint lists canonical names, aliases, supported question types, context lengths, release dates, and base token prices. Adds `@respan/span-01`, `@respan/span-01-lite`, `@jaredpalmer/kev-4b`, and `@supersonic-labs/julia-1` as model choices for semantic decisions. Julia-1 supports `choice`, `score`, and `noul`; its input usage includes the state repeated for each question. Existing account and plan pricing adjustments apply, and model identifiers and request formats remain unchanged. See [Plans and Limits](limits.md#semantic-decision-model-limits) and [Pricing](pricing.md#semantic-decisions) for current limits and rates.

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
