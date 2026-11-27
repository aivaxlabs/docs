Source: https://docs.aivax.net/docs/legal/changelogs.html

# Changelogs

Changes to AIVAX products, services, and the public API.

This page lists the changes from the last 14 days. Older entries are kept in the [changelog archive](https://github.com/aivaxlabs/docs/blob/master/archive/changelogs.md).

## Upcoming changes

Announced changes that take effect on a future date and may require action.

- **Models — Previous model names stop working on December 1st, 2026.** Model names replaced in the November 1st, 2026 renaming, decision aliases without `:latest`, `@x-ai/grok-imagine-pro` and `@microsoft/mai-image-2.5-flash` will be rejected, and saved AI gateways that still store a previous language model name will fail until updated. Gateways that store a previous image model name can no longer be saved, and their chat image tool switches to `@black-forest-labs/flux-schnell`; replace previous names with the ones returned by the model catalogs, as shown in the [November 1st, 2026 entry](https://github.com/aivaxlabs/docs/blob/master/archive/changelogs.md#sunday-november-1st-2026) and the November 24th entry below.
- **Chat clients — Previous messaging webhook URLs stop working on December 1st, 2026.** Telegram, Z-API, Evolution API, and Kapso webhook URLs without the integration key will be rejected. Copy the new URL from the integration settings and update it in the provider, or use **Update hooks** for Telegram; see [Webhook URLs](https://docs.aivax.net/docs/inference/chat-clients/integrations.md#webhook-urls).

## Friday, November 27th, 2026

Changes:

- **Legal — Terms of Use and Privacy Policy revision 1.5.** The [Terms of Use](https://docs.aivax.net/docs/legal/terms-of-service.md) now set an aggregate liability limit, extend indemnification to your choice of models, providers, and routing options, and allow AIVAX to suspend routing to a provider after a security incident, which can make models that depend on it unavailable. The [Privacy Policy](https://docs.aivax.net/docs/legal/privacy-policy.md) and [Data Processors](https://docs.aivax.net/docs/legal/third-party-processors.md) state that provider data-handling classifications, such as zero data retention, are declared by each provider.
- **Models — New subscription model.** Adds `@aivax-subscription/glm-5.4`, Z.ai's GLM-5.4, to the subscription model catalog. See [Subscription models](https://docs.aivax.net/docs/inference/subscription-models/overview.md).
- **Plans — Larger RAG embedding allowances.** The daily allowance for RAG search and insertion embeddings is now 25× the Free allowance on Pro (was 15×), 500× on Max (was 50×), and 2,500× on Ultimate (was 100×); the Free allowance is unchanged. See [Included daily subscription allowances](https://docs.aivax.net/docs/limits.md#included-daily-subscription-allowances).
- **Plans — Live subscription model metrics.** The [Pricing page](https://aivax.net/pricing) now shows each subscription model's throughput, latency, uptime and estimated included usage per plan over the last 24 hours, with a trend for each, and lets you pick the plan to compare.

## Thursday, November 26th, 2026

Fixes:

- **Inference — `prompt_tokens` includes cached input.** In chat completions, `usage.prompt_tokens` counts the full input, including `prompt_tokens_details.cached_tokens`, as in the OpenAI format, so `total_tokens` equals `prompt_tokens` plus `completion_tokens`. If you added `cached_tokens` to `prompt_tokens`, stop adding it. See [Caching](https://docs.aivax.net/docs/inference/chat-completions/caching.md).

Changes:

- **Models — Speed of subscription models.** Subscription models now show their measured throughput (tokens per second, including reasoning) and latency (seconds to the first token) on the [Models page](https://aivax.net/models) and in the model catalog.

## Wednesday, November 25th, 2026

Changes:

- **Inference — Async generations.** Add `"async": true` to chat completions, Responses, Messages, data processing, image and speech generation, transcription, Agentic Test, reranking, web search, and web fetch requests to queue them: the API answers with HTTP `202` and an ID, and you fetch the stored result or receive a webhook when it is done. Manage queued items under `/api/v1/async-generations`; streaming requests and public API keys cannot be queued. See [Async generations](https://docs.aivax.net/docs/inference/batch/async-generations.md).

## Tuesday, November 24th, 2026

Breaking changes:

- **Image generation — Grok Imagine Pro and MAI-Image-2.5 Flash removed.** `@x-ai/grok-imagine-pro` and `@microsoft/mai-image-2.5-flash` are no longer in the catalog. Until December 1st, 2026, requests and gateways that name them are served by `@x-ai/grok-imagine-image-2.0` and `@microsoft/mai-image-2.7-flash`, at those models' prices; update them before that date. See [Image generation](https://docs.aivax.net/docs/generations/images.md).

Changes:

- **Image generation — New models.** Adds `@microsoft/mai-image-2.7` ($0.029 per output image plus $0.025 per reference image per output), `@microsoft/mai-image-2.7-flash` ($0.008 plus $0.008), `@bytedance/seedream-5.5` ($0.035 plus $0.008), `@minimax/minimax-h3-image` ($0.004 plus $0.006) and `@minimax/minimax-h3-image-highspeed` ($0.008 plus $0.013). All of them support reference-image editing. See [Image generation](https://docs.aivax.net/docs/generations/images.md).
- **Image generation — Older models deprecated.** `@microsoft/mai-image-2.6`, `@microsoft/mai-image-2.6-flash` and `@openai/gpt-image-2` are now marked as deprecated. They keep working for now; move to `@microsoft/mai-image-2.7`, `@microsoft/mai-image-2.7-flash` or `@openai/gpt-image-2.6-flare`.
- **Image generation — Qwen Image 2.1 price update.** `@qwen/qwen-image-2.1` now costs $0.042 per output image, down from $0.06, plus $0.035 per reference image per output, down from $0.13.

## Monday, November 23rd, 2026

Changes:

- **Inference — Responses and Anthropic Messages endpoints.** Adds `POST /v1/responses` (also `/api/v1/responses`), following the Open Responses specification and compatible with OpenAI Responses API clients, and `POST /v1/messages` (also `/api/v1/messages`), compatible with the Anthropic Messages API, its SDKs and Claude Code. Both accept an integrated model name or an AI Gateway as `model`, support streaming, function tools, images, files and reasoning, and are billed like chat completions. The Responses endpoint is stateless, so send the full conversation in `input`. The `x-api-key` header is also accepted for authentication.
- **Observability — Improved conversation search.** Free-text search can now be combined with filters in `GET /api/v1/conversations`, which also accepts `--id`, `--token` and `--rid` filters and returns `conversationToken` and `requestId`. The CLI `conversations list` command adds `--search`, `--id`, `--token` and `--request-id`.

## Friday, November 20th, 2026

Changes:

- **Account — Monthly subscription model quota renewal.** The monthly subscription model quota now renews one month after its first use in each cycle instead of on the 1st of each month. `resetAt` in the account balance response shows the next renewal.
- **Models — New subscription models.** Adds `@aivax-subscription/qwen3.8-max`, `@aivax-subscription/step-5-preview`, and `@aivax-subscription/grok-4.7` to the subscription model catalog. See [Subscription models](https://docs.aivax.net/docs/inference/subscription-models/overview.md).
- **AI gateways — Internet access toggle for the virtual Bash tool.** AI gateway settings now include an **Allow internet access** option for the virtual Bash tool, enabled by default. Disable it to run commands fully offline.

## Thursday, November 19th, 2026

Changes:

- **RAG — Document limits per account and per collection.** Each plan now limits the number of documents stored per account and per collection: Free 2,000 per account and 1,000 per collection, Pro 200,000 and 50,000, Max 250,000 per collection with no account limit, and Ultimate 500,000 per collection with no account limit. When a limit is reached, creating a document returns `400 Bad Request`; delete documents or upgrade the plan to continue. See [Plans and Limits](https://docs.aivax.net/docs/limits.md#rag-and-collections).

## Wednesday, November 18th, 2026

Breaking changes:

- **Models — Subscription model fields.** `GET /api/v1/information/models.json` no longer returns `pricing[].subscriptionMultiplier` and now returns `flags.isSubscription`. In `GET /v1/models`, `_details.provider_model.subscription_multiplier` is replaced by the boolean `_details.provider_model.subscription`. Subscription models return empty pricing arrays. Update clients that read the removed fields to use the new ones; see [Models and gateway names](https://docs.aivax.net/docs/inference/ai-gateways/models-and-gateway-names.md).
- **Audio transcriptions — Grok STT 1.0 removed.** `@x-ai/grok-stt-1.0` (also accepted as `x-ai/grok-stt-1.0`) reached end of life and is no longer available; requests that name it now fail. `@x-ai/grok-stt-2.0` replaces it as the default speech-to-text model at the same price of $0.10 per hour. Update requests that name the old model to use `@x-ai/grok-stt-2.0`, or omit the model to use the default; see [Audio transcriptions](https://docs.aivax.net/docs/generations/audio-transcriptions.md).

Fixes:

- **Speech — Dashboard price labels.** The dashboard now shows the correct price for `@elevenlabs/eleven-v3`, `@elevenlabs/eleven-multilingual-v2` and GPT-4o mini TTS.
- **Models — Look up models by vendor-prefixed ID.** The `name` filter on `GET /api/v1/information/models.json` and the `filter` parameter on `GET /v1/models` now recognize names such as `minimax-m3.1-flash` for `@minimax/m3.1-flash`.

Changes:

- **Account — Monthly subscription model quota.** Pro, Max, and Ultimate now include a monthly quota for subscription models, the models whose names start with `@aivax-subscription/`. Using these models never debits the account balance. When the quota is exhausted, or the plan has none, requests to subscription models return `429 Too Many Requests`. Subscription models are not available when **Zero data retention providers only** is enabled. See [Subscription models](https://docs.aivax.net/docs/inference/subscription-models/overview.md).
- **Summarization and Extraction — PDF URLs.** A `file` part can now point to a public HTTP(S) URL of a PDF.
- **Audio transcriptions — New models and lower Parakeet price.** Added `@nvidia/nemotron-3.5-transcribe` ($0.001 per minute, recordings up to one hour, 40 languages) and `@qwen/qwen3-asr-1.7b` ($0.027 per hour). `@nvidia/parakeet-tdt-0.6b-v3` now costs $0.001 per minute, down from $0.0015.
- **Speech — Speechify Simba 3.5 and updated prices.** Added `@speechify/simba-3.5`, a text-to-speech model covering 48 languages, at $0.0075 per 1,000 characters. `@fish-audio/drama-3` now costs $0.01 per 1,000 characters, up from $0.002, and `@elevenlabs/eleven-flash-v2.5` costs $0.02, up from $0.01.

## Tuesday, November 17th, 2026

Fixes:

- **Chat clients — Session metadata in messaging integrations.** Replies and scheduled messages from WhatsApp, Telegram, and other messaging integrations now carry the session metadata to MCP servers, protocol functions, gateway workers, and stored conversations, as web chat sessions already did.
- **Gateways — Reserved MCP metadata keys.** Custom metadata keys beginning with `_aiv` no longer make MCP tool calls fail.
- **Tools — Tool explanations with strict MCP servers.** With tool explanations enabled, MCP servers and protocol functions that reject unknown arguments now work as expected. See [Tool explanations](https://docs.aivax.net/docs/inference/response-rendering/tool-explanations.md).
- **Models — Model lookup with suffixes.** The `name` filter of `GET /api/v1/information/models.json` now ignores a `#` provider tag or a `:` variant suffix and returns the matching base model.

Changes:

- **Models — GPT-6.2 Astra and GPT-6.2 Sol.** Adds `@openai/gpt-6.2-astra`, `@openai/gpt-6.2-astra:pro`, `@openai/gpt-6.2-sol`, and `@openai/gpt-6.2-sol:pro`, with reasoning, image and file input, tool calling, and structured output. `@model-router/openai:frontier` now routes to `@openai/gpt-6.2-astra` instead of `@openai/gpt-6-astra`; select `@openai/gpt-6-astra` directly to keep the previous model.
- **Decisions — Liquid d1.2 and d1.2-ultra.** Adds `@liquid/d1.2` and `@liquid/d1.2-ultra`, with a 64K context, image input, and yes/no, multiple-choice, and score questions. `@liquid/d:latest` now resolves to `@liquid/d1.2` instead of `@liquid/d1.1`. Check prices in the [decision model listing](https://docs.aivax.net/docs/data-processing/decisions.md#discover-models-programmatically).
- **Gateways — Metadata in every MCP request.** AIVAX now sends the calling context and custom metadata in `params._meta` of every request to an MCP server, including `initialize`, `tools/list`, `skills/list`, and `resources/read`, not only `tools/call`. See [Metadata sent with MCP requests](https://docs.aivax.net/docs/tools/mcp.md#metadata-sent-with-mcp-requests).
- **Chat clients — Reasoning and tool activity in the hosted chat.** The hosted web chat now shows reasoning and tool calls in collapsible blocks, hidden when **Tool call visibility** (`showToolCalls`) is off. See [Publish the hosted chat](https://docs.aivax.net/docs/inference/chat-clients/web-client.md#publish-the-hosted-chat) and [Tool explanations](https://docs.aivax.net/docs/inference/response-rendering/tool-explanations.md).

## Monday, November 16th, 2026

Fixes:

- **Account — Top-ups paid with a saved payment method.** Adding credits no longer opens an empty browser tab when a saved payment method settles the payment immediately. The dashboard confirms the payment instead.

Changes:

- **Account — Brazilian taxes on payments.** New payments, including credit top-ups and subscriptions, now include Brazilian taxes added on top of the amount due. The dashboard shows the total before you confirm, and receipts list each tax. See [Taxes on payments](https://docs.aivax.net/docs/pricing.md#taxes-on-payments).
- **Account — Service invoices.** Service invoices (nota fiscal de serviços) can be downloaded from the Invoices tab of Analytics, and you are notified when one is issued. Usage data returns the link in `serviceInvoiceLocation`.
- **Decisions — Conversation input and media.** Decision requests now accept `input`, an array of conversation messages, instead of `state`. Image, audio, video, and document parts are evaluated on models that support them. See [Send media](https://docs.aivax.net/docs/data-processing/decisions.md#send-media).
- **Routing — Auxiliary steps on zero data retention providers.** Content moderation, the complexity router, RAG query rewriting, chat client audio summaries, speech voice instructions, and Media Injector now always run on zero data retention providers. See [Zero data retention providers only](https://docs.aivax.net/docs/inference/routing/zdr.md).
- **Analytics — Payment totals in the monthly report.** The monthly report now totals the payments confirmed in the month, with their taxes and fees, returned in `payments` by Get Monthly Usage Report.
- **RAG — Reflex v1.5 reranker.** The rerank endpoint accepts `@aivax/reflex-v1.5`, a higher-accuracy option to `@aivax/reflex-v1`. It ranks up to 15,000 documents per request, returns up to 50 results, and costs $0.015 per 1M input tokens. See [Reranking](https://docs.aivax.net/docs/rag/reranking.md).

## Friday, November 13th, 2026

Breaking changes:

- **Chat clients — `allowedFrameOrigins` removed.** The deprecated `allowedFrameOrigins` chat client option is no longer returned when you read a chat client. Requests that still send it keep working, and the value is ignored. See [Publish the hosted chat](https://docs.aivax.net/docs/inference/chat-clients/web-client.md#publish-the-hosted-chat).

Fixes:

- **Batch — Jobs resume after the daily item limit.** Jobs paused by the plan's daily item limit now resume automatically after the limit resets. See [Batch and Agentic Tests limits](https://docs.aivax.net/docs/limits.md#batch-and-agentic-tests).
- **Chat clients — Session token count after Send Prompt.** Sessions that receive messages through Send Prompt now report their token count in the session listing.

Changes:

- **Chat clients — Insert messages into a session.** The new `POST /api/v1/web-chat-client/<chat-client-id>/sessions/insert-message` endpoint appends user, assistant, or tool messages to an active session, identified by `sessionId` or `tag`, without running inference. The inserted messages are used as context by the next prompt.

## Thursday, November 12th, 2026

Breaking changes:

- **Image generation — DreamShaper 8 LCM removed.** `@lykon/dreamshaper-8-lcm` is no longer available, and requests that name it are rejected. Choose another text-to-image model, such as `@black-forest-labs/flux-schnell`. See [Image generation](https://docs.aivax.net/docs/generations/images.md).

Changes:

- **Chat clients — Disposable context in Send Prompt.** Send Prompt accepts a new `context` field with text or OpenAI-compatible content parts, including images, audio, video, and files. The context applies to that request only and is not saved to the session history. See [Add disposable context to the last user message](https://docs.aivax.net/docs/inference/chat-clients/web-client.md#add-disposable-context-to-the-last-user-message).
- **Image generation — GPT Image 2.6 Flare and Sunburst.** Adds `@openai/gpt-image-2.6-flare`, for fast generation, and `@openai/gpt-image-2.6-sunburst`, for detailed compositions. Both support reference-image editing and are priced at $0.025 per output image plus $0.025 per reference image per output.
- **Image generation — Older models deprecated.** `@openai/gpt-image-2.5-flare`, `@openai/gpt-image-2.5-sunburst` and `@openai/gpt-image-1-mini` are now marked as deprecated. They keep working for now; move to `@openai/gpt-image-2.6-flare`, `@openai/gpt-image-2.6-sunburst` or `@openai/gpt-image-2`.
- **Image generation — Lower prices.** `@bytedance/seedream-5-pro` now costs $0.035 per output image, down from $0.09, and `@recraft/recraft-v4.1-flash` costs $0.007, down from $0.008.

## Wednesday, November 11th, 2026

Fixes:

- **Account — Credit top-ups add the chosen amount to the balance.** A top-up now adds exactly the amount you choose to your balance; fees are charged separately. See [Credit top-ups](https://docs.aivax.net/docs/pricing.md#credit-top-ups).

Changes:

- **Dashboard — Redesigned home page.** The dashboard home now shows your credit balance, usage trends for the last 24 hours to 90 days, and shortcuts to the main products.
- **AI Gateways — New `tool.fetched` and `message.completed` worker events.** Gateway workers now receive `tool.fetched` after a server-side tool returns its result, and can keep, block, or replace that result with a `tool.fetched.response` action. Workers also receive `message.completed` after each inference finishes, with the messages, errors, and usage. See [Gateway Workers](https://docs.aivax.net/docs/inference/workers.md).
- **Account — No service fee on credit top-ups for Pro, Max, and Ultimate.** Adding credits on Pro, Max, and Ultimate no longer includes the service fee. See [Credit top-ups](https://docs.aivax.net/docs/pricing.md#credit-top-ups).
- **Account — Daily ceiling on the inference commission.** The plan's inference commission on integrated-model inference is now limited to $1.50 per day on Free, $1.20 on Pro, and $1.00 on Max. After the ceiling is reached, model inference that day is charged at the model's rates only. See [Plan multipliers](https://docs.aivax.net/docs/pricing.md#plan-multipliers).
