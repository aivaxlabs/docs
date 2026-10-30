---
{title: Changelogs,linkTitle: Changelogs,weight: 40,group: Legal documents,aliases: [/docs/changelogs.html]}
---

# Changelogs

Technical changes that affect AIVAX products, services, or the public API. Dates identify when entries were added or updated, not confirmed production rollout dates. Each item identifies the affected product or service; maintenance with no user-facing effect is omitted.

## Friday, October 30th, 2026

Changes:

- **AI Gateways — Moderation mode.** AI gateway parameters accept `moderationParameters.mode`, with `LayeredGuardrail` (the default and previous behavior) and `SelfAssessment`. `LayeredGuardrail` analyzes the conversation's input text with an independent safeguard model before the main model and blocks flagged conversations. `SelfAssessment` runs no separate moderation call, so there is no moderation analysis charge: the main model receives moderation instructions built from the same category sensitivity levels and additional rules, plus an internal refusal tool, and ends the inference with a refusal when the latest request reaches an enabled category's boundary. It requires a model that supports tool calling and trades lower latency and cost for judgment that is not independent from the main model. The AI gateway editor's Content Moderation section includes a **Moderation mode** selector, and the gateway pipeline summary shows the active mode when moderation is enabled. See [Processing pipeline](/docs/inference/pipelines.md#moderation).
- **Dashboard — Agent setup prompt options.** The home page **Copy Prompt** button opens a menu with two setup prompts for coding agents: **Agent MCP + Skills**, which configures the account management MCP and the AIVAX agent skills, and **Agent CLI**, which installs the [AIVAX CLI](/docs/cli.md) and links the account as a CLI profile. The `GET /api/v1/accounts/agent-setup-prompt` endpoint accepts an optional `type` query parameter (`mcp`, the default, or `cli`).
- **CLI — Log in with an API key.** `aivax auth login --api-key <API_KEY>` links an account profile using an existing API key, without the account login key or authenticator code. See [CLI tool](/docs/cli.md#install).
- **Accounts — Get the authenticated account.** The new `GET /api/v1/accounts` endpoint returns the identifier, display name and e-mail of the account that owns the API key.
- **Conversations — Follow conversations in progress.** The new `GET /api/v1/conversations/management/live` Server-Sent Events stream sends the status of conversations being generated in the account: origin, model, elapsed time, partial token usage, and input and output previews. A finished conversation stays in the stream for 10 seconds with status `completed` and the stored `conversationId`, which is `null` when the conversation was not stored. `GET /api/v1/conversations/<id>` also accepts the live identifier and returns the current messages, and `GET /api/v1/conversations/<id>/sse` streams them until the conversation finishes. Only conversations that would be stored are tracked, so requests with conversation logging disabled do not appear. Server-side tool calls are only shown after the conversation is stored. On the **Conversations** page, conversations in progress appear above the stored list and the list refreshes when they finish; opening one follows it live and switches to the stored conversation when it is saved.

## Thursday, October 29th, 2026

Fixes:

- **Account — Adding the first authenticator.** Confirming the first authenticator no longer fails with a required-property error. The current authenticator code is only needed when the account already has one.

Changes:

- **Account — Compact two-factor authentication dialog.** The **Security** tab's two-factor authentication dialog is narrower. When adding an authenticator, the QR code is shown next to the secret, followed by the name and six-digit code fields. The dialog closes from its header, and **Cancel** returns to the authenticator list.

## Wednesday, October 28th, 2026

Breaking changes:

- **Language models — Special providers require opt-in.** Integrated text models no longer route to special discounted providers by default. Requests for a model that is currently available only through special providers fail unless they use the new `Special` routing preference, or the account enables **Allow special providers** and uses a preference other than `Balanced`. See [Special providers](/docs/inference/inference.md#special-providers).

Changes:

- **Account — Allow special providers.** The account privacy settings include **Allow special providers**, disabled by default. When enabled, the `Cheapest`, `Fastest`, and `Quality` routing preferences also consider special providers, which serve models at discounted prices under conditions that may be less transparent. `Balanced` never uses them.
- **Language models — `Special` routing preference.** AI Gateways (`parameters.routingOption`) and `routing_options.preset` accept `Special`, which works like `Balanced` but also includes special providers and gives them priority, regardless of the account setting.

## Tuesday, October 27th, 2026

Breaking changes:

- **Language models — Models removed and router alias updated.** `@arcee-ai/trinity-large-thinking` is no longer in the model catalog; requests that name it are rejected. `@poolside/laguna-xs-2.1` and `@poolside/laguna-s-2.1` are removed; both were already deprecated and their provider endpoints expire on October 31, 2026. `@model-router/openai:mid` now selects `@openai/gpt-6.1-terra` instead of `@openai/gpt-6.1-sol`.
- **Decisions — Decider V1.1 removed and aliases retargeted.** `@perplexity/pplx-decider-v1.1-27b` is no longer in the decisions catalog; requests that name it are rejected. `@perplexity/pplx-decider` now resolves to `@perplexity/pplx-decider-v1.2` instead of Decider V1.1, and `@liquid/d` now resolves to `@liquid/d1.1` instead of `@liquid/d1`. The replacements keep the same $0.02 per million input tokens price.

Changes:

- **RAG — Filter documents by reference.** Document filters accept the `reference` field with `=`, `!=`, `in`, `contains`, `startswith`, and `endswith`, for example `reference = "manual-v2"` to select every chunk of one source. Documents without a reference never match a positive condition on it, and match `reference != "..."`. Previously, `reference` was rejected as an unknown field. This applies wherever filters are accepted, including search, browse, and the Collections MCP tools. See [Document filters](/docs/rag/document-filters.md#fields).
- **MCP — Collections MCP browse and get document tools.** The Collections MCP now exposes two tools besides semantic search. The browse tool (`{collection_name}_browse_documents`, or `{collection_name}_list` with the `agent` naming convention) lists indexed documents with an optional document filter, sorting by creation, update, or indexing date, or name, and cursor pagination, and returns names, tags, and dates, with content only when requested. The get document tool (`{collection_name}_get_document`, or `{collection_name}_get`) reads one document by its exact name, optionally by line range, including documents still waiting to be indexed. Neither has search cost; both count toward the search rate limit. Clients that connect to the Collections MCP see two more tools; use `X-Mcp-Enabled-Tools` to hide them. See [Collections and RAG MCP](/docs/mcp-utilities/collections-mcp.md#generated-tools).
- **MCP — Choose which Collections MCP tools are exposed.** The Collections MCP accepts the optional `X-Mcp-Enabled-Tools` header with a comma-separated list of `search`, `browse`, `get`, `write`, and `delete`, so a client can, for example, add and search documents without being able to delete them. `write` and `delete` still require `X-Mcp-Allow-Write: yes`. Without the header, every tool allowed by the other headers is exposed. See [Collections and RAG MCP](/docs/mcp-utilities/collections-mcp.md#select-which-tools-are-exposed).
- **Language models — New models.** Added `@openai/gpt-6.1-terra`, the mid-tier GPT-6.1 model ($1.10 per million input tokens, $5.50 per million output tokens, 1.05M-token context), and `@reflection/beam-1.0-501b-a23b`, Reflection's open-weight reasoning model ($0.40 per million input tokens, $1.20 per million output tokens, 1M-token context).
- **Language models — GLM reasoning efforts.** `@z-ai/glm-5.2`, `@z-ai/glm-5.1`, and `@z-ai/glm-5` now accept the `max` and `high` reasoning effort levels, matching the provider's documentation.
- **Image generation — Qwen Image 2.1 Pro.** Added `qwen-image-2.1-pro`, including reference images, at an estimated $0.04 per output image.
- **Speech to text — New transcription models.** Added Mistral's Voxtral Small Transcribe 3 ($0.004 per minute) and Voxtral Mini Transcribe 3 ($0.0035 per minute) to the transcription catalog.
- **Text to speech — New synthesis models.** Added ElevenLabs V4 ($0.08 per 1,000 characters) and V4 Turbo ($0.04), Mistral Voxtral Mini TTS 3 ($0.013), HeyGen Voice 1 Turbo ($0.004) and Voice 1 ($0.015), and Fish Audio S2.1 Pro ($0.015) as audio synthesis sources in AI gateways and chat clients.
- **RAG — New rerankers.** Added `@jina/reranker-v3.5` and `@nvidia/nemotron-3.5-rerank-8b` ($0.05 per million input tokens) to the reranker catalog.
- **Decisions — New decision model.** Added `@liquid/d1.1` ($0.02 per million input tokens, no output charge), accepting text with a 64K context.
- **Language models — Providers grouped by routing tier.** The model details dialog on the dashboard Models page groups providers into Default, Flex, Priority, and Special sections when a model offers more than one tier.

## Monday, October 26th, 2026

Changes:

- **Language models — More models list their reasoning efforts.** `modelInformation.reasoningEfforts` in `GET /api/v1/information/models.json`, and the model details dialog on the dashboard Models page, now list the accepted levels for `@qwen/qwen3.8-max`, `@qwen/qwen3.8-flash`, `@qwen/qwen3.8-omni-flash`, `@anthropic/claude-4.5-opus`, `@openai/o3`, `@openai/o3-mini`, `@openai/o4-mini`, `@google/gemini-2.5-pro`, `@google/gemini-2.5-flash`, `@google/gemini-2.5-flash-lite`, `@bytedance/seed-2.1-turbo`, and `@nvidia/nemotron-3.5-super-vl`. Requests and gateways are unchanged.
- **Data processing — New Extraction endpoint.** `POST /api/v1/generations/extract` reads text, JPEG, PNG, TIFF, and PDF documents and returns one JSON object per document, shaped by the required `responseSchema`, in input order. Each schema property is one field to find, and its description is the search criterion; `$ref` and `$defs` are not supported. Images and files accept base64 data URLs or public URLs. Public URLs are downloaded up to 5 MB, base64 data URLs are limited only by the request size, and other content types are rejected. Only input tokens are billed, at $0.04 per million. You can also run it from the Extraction tab on the dashboard Generations page. See [Extraction](/docs/data-processing/extraction.md).
- **Data processing — New Summarization endpoint.** `POST /api/v1/generations/summarize` accepts the same document types and returns one summary string per document, optionally guided by `instructions`. Only input tokens are billed, at $0.04 per million. Extraction and Summarization share a per-document limit of 10 per minute and 300 per day on Free, 200 per minute on Pro, and 2,500 per minute on Max. You can also run it from the Summarization tab on the dashboard Generations page. See [Summarization](/docs/data-processing/summarization.md).
- **Data processing — New Translations endpoint.** `POST /api/v1/generations/translate` translates text, the visible text in images, and the speech in audio into any `toLanguage`, and returns one translated string per document, in input order. `fromLanguage` is optional and is detected from the content when omitted. Usage is billed in processing units. Limits are 30 requests per minute and 300 per day on Free, 200 per minute on Pro, and 2,500 per minute on Max. You can also run it from the Translation tab on the dashboard Generations page. See [Translations](/docs/data-processing/translations.md).
- **Data processing — Clearer guidance between Extraction, Fetch, and Media Descriptions.** The Media Descriptions and Fetch and OCR pages now explain when to use each service. See [Extraction, Fetch, or Media Descriptions](/docs/data-processing/extraction.md#extraction-fetch-or-media-descriptions).
- **Account — Console two-factor authentication and login recovery.** The console **My account** page has a **Security** tab. Account holders can add one or more authenticator apps; the QR code and secret are shown only until the six-digit code is confirmed, and sign-in asks for a code only after at least one authenticator is confirmed. Switching to a saved account asks for the same code when that account has two-factor authentication. `POST /api/v1/auth/login` accepts `totpCode` and returns `requiresTwoFactor` instead of a session when the code is still required. Accounts without an authenticator are unchanged, and API keys are not affected. The sign-in page links to account support, where **Recover login key** e-mails a one-hour one-time sign-in link and a login-key reset link after asking for the registration e-mail. The confirmation is the same whether or not that e-mail belongs to an account. The reset link, and **Reset login key** in **Security**, create a new login key, e-mail it, and sign the account out of every console session. They do not revoke API keys or disable two-factor authentication. Disabling two-factor authentication without a current authenticator code is handled by [AIVAX support](https://aivax.net/contact/). See [Console sign-in](/docs/authentication.md#console-sign-in).

## Sunday, October 25th, 2026

Breaking changes:

- **Language models — MiniMax router alias now selects M3.1 Flash.** `@model-router/minimax:latest` now selects `@minimax/m3.1-flash` instead of `@minimax/m3`. The new model accepts text, images, and video, improves agentic, coding, and cybersecurity results over M3, and its current OpenRouter list price is $0.15 per million input tokens and $0.60 per million output tokens, lower than M3. Call `@minimax/m3` directly to keep using the previous model.

Changes:

- **RAG — New search endpoints.** Added `POST /api/v2/query` (Query collections), `POST /api/v2/query/similar` (Find similar documents), and `POST /api/v2/query/browse` (Browse documents). Queries now return paginated results with a reusable candidate pool, separate similarity, rerank, and final scores, sorting by score, creation, update, or indexing date, or name, and filters per collection. Later pages of a query are not charged again; a Query collections cursor stays valid for 10 minutes after its last use, and an expired cursor returns `410 Gone`, so repeat the request without a cursor. Find similar documents searches by the stored vector of an indexed document, and Browse documents lists indexed documents by creation date, oldest first by default, optionally filtered; neither has embedding or reranking cost. Sending a `reranker` together with a sort other than score is rejected; without a `reranker`, the default reranker is skipped for those sorts. All three endpoints are also available on the direct host. See [Search](/docs/rag/semantic-search.md).
- **RAG — Previous search endpoint deprecated.** `POST /api/v1/query` keeps working for existing integrations but is deprecated. To migrate, send `terms` to `POST /api/v2/query`, replace `top` with `limit` (if you omit it, `limit` defaults to 10, while `top` defaulted to 5, and the reranker scores `limit` × 3 candidates, so set `limit` explicitly to keep the same cost per query) and `includeReferences` with `"include": ["content", "metadata", "references"]`, and read results from `data.results[].document` and `data.results[].scores`. Requests without search terms move to `POST /api/v2/query/browse`, which, unlike the previous endpoint that returned the newest documents first, returns the oldest documents first unless `sort` is set. `POST /api/v1/answer` is not deprecated.

## Friday, October 23rd, 2026

Breaking changes:

- **Language models — Router aliases now select newer models.** `@model-router/kimi:latest` now selects `@moonshotai/kimi-k3.1-pro` instead of `@moonshotai/kimi-k3`. The new model accepts text, images, and video. Its price in the AIVAX catalog is $2 per million input tokens and $10 per million output tokens, lower than Kimi K3 ($3 and $15). `@model-router/mercury:latest` now selects `@inception/mercury-3` instead of `@inception/mercury-2.5`. `@model-router/pareto:latest` now selects `@unbiased/pareto-26.10` instead of `@unbiased/pareto-26.9`. Pareto 26.10 does not accept structured output; keep calling `@unbiased/pareto-26.9` when a request needs `response_format`. The previous models remain available under their own identifiers.
- **Image generation — Amazon Nova Canvas removed.** `nova-canvas` is no longer in the image catalog. An image API request that names it is rejected, and saving a gateway that still stores that name fails validation. If a gateway already stores it, the chat image tool falls back to the default image model, FLUX Schnell (`flux-schnell`). Choose another listed image model if that fallback is not suitable.

Fixes:

- **Language models — Retired Xiaomi endpoints are no longer selected.** The deprecated models `@xiaomi/mimo-v2.5` and `@xiaomi/mimo-v2.5-pro` no longer route to Xiaomi's direct API, which shut down on October 21, 2026. Requests use the remaining providers. Both models stay deprecated.

Changes:

- **Language models — New models and video input.** Added `@moonshotai/kimi-k3.1-pro`, `@minimax/m3.1-flash`, `@inception/mercury-3`, and `@unbiased/pareto-26.10`. `@moonshotai/kimi-k3` now accepts video as well as text and images.
- **Language models — Groq cached input price.** Cached input tokens for `@openai/gpt-oss-20b` on Groq are now billed at $0.037 per million tokens. Before this change, they were billed at the regular input price of $0.075 per million.
- **Image generation — FLUX.3 Image Klein.** Added `flux-3-image-klein`, including reference images, at an estimated $0.019 per output image for the provider's default size.
- **Decisions — New text decision models.** Added `@perplexity/pplx-decider-v1.2` ($0.02 per million input tokens), `@perplexity/pplx-decider-flash-v1.2` ($0.01), `@nace-ai/drex-max` ($0.06), `@respan/span-02` ($0.01), and `@liquid/d1-ultra` ($0.042). `@typesafe/jev` now resolves to JEV 1.14 instead of 1.13 at the same price, and new aliases were added for the Perplexity, Nace, Respan, and Liquid decision models.

## Monday, October 19th, 2026

Breaking changes:

- **Gateways — One time zone per gateway.** AI Gateways now have a `timeZone` parameter (IANA identifier, default `America/Sao_Paulo`) used for every date the model reads or writes: `get_date_time`, scheduling tools, and the bash environment. It replaces `builtinFunctionsOptions.dateTimeTimeZone` (previous default `America/Los_Angeles`) and `bashOptions.timeZone` (previous default `UTC`), which are no longer read. Gateways and Batch workflows that relied on the old defaults now report São Paulo time; set `timeZone` on the gateway to keep another zone. In `/v1/chat/completions`, send `time_zone` instead of `builtin_tools.options.dateTimeTimeZone` to override the zone for one request. In the dashboard, the setting moved to **Date and time** in the gateway's **Parameters + Tuning** tab and was removed from Batch tool options. See [Current Date and Time](/docs/tools/builtin-tools.md#current-date-and-time).

Fixes:

- **Chat clients — Scheduled messages no longer run alongside a reply.** In Telegram and WhatsApp integrations, a scheduled message that becomes due while the assistant is still answering the same conversation now waits for that answer to finish instead of running a second reply in parallel. Messages received during a reply also wait and are answered afterwards. Previously, both runs could act on the same conversation, and one reply could be dropped from its history. A delayed scheduled message is still sent if the conversation becomes free within 30 minutes of its scheduled time.

Changes:

- **Chat clients — Scheduling uses the gateway time zone.** `schedule_assistant_message` now reads times without a UTC offset in the gateway time zone, `create_recurring_job` evaluates cron expressions in that zone, and `list_scheduled_jobs` returns scheduled times in it. They previously used the server time zone. Times with an explicit UTC offset keep their exact instant. `get_date_time` is now always available alongside the scheduling tools. Set the gateway `timeZone` to your users' time zone so reminders fire at the expected local time. See [Current Date and Time](/docs/tools/builtin-tools.md#current-date-and-time).

## Sunday, October 18th, 2026

Changes:

- **RAG — More details in the collection documents list.** The documents table of a collection now shows the creation date, the last update date, and the approximate token count of each document, and scrolls horizontally when the columns do not fit. Rows with more than three tags show the first three and a **+N more** badge; hover over it to see the remaining tags. `GET /api/v1/collections/{collection-id}/documents` now also returns `createdAt` and `approximateTokenCount` for each document. See [Collections](/docs/rag/documents.md).
- **RAG — Formatted documents in the search playground.** The collection search playground renders the content of returned and referenced documents as Markdown, in the same layout used by conversation messages, and adds a **Read docs** button next to **View code** that opens the [semantic search documentation](/docs/rag/semantic-search.md).
- **Account — Custom plan badge.** Accounts on a Custom plan now show a plan badge with the same size and style as the Free, Pro, and Max badges.

## Saturday, October 17th, 2026

Changes:

- **Batch — Cost-optimized routing for workflows that do not use an AI Gateway.** Workflows that process items with an integrated model instead of an AI Gateway now always use the `Cheapest` routing preference, selecting the available provider with the lowest input and output token price for that model. The `Balanced` default no longer applies in this case, so items may route to a different provider than before. To keep the default preference or choose `Fastest` or `Quality`, use an AI Gateway with that routing preference in the workflow. See [Batch](/docs/inference/batch.md#model-and-routing).

## Friday, October 16th, 2026

Fixes:

- **Gateways — Blocked `read_skill` calls keep the active skill.** When a gateway hides tools without a skill, a `read_skill` call blocked by a gateway worker or rejected as invalid no longer removes the tools of the skill activated by the previous successful call. Only successful `read_skill` calls change the active skills. See [Skills](/docs/inference/skills.md#structure-and-operation).
- **Built-in tools — Current date and time returns JSON.** `get_date_time` now returns the documented JSON object with `date`, `time`, `day_of_week`, `time_zone`, `utc_offset`, and `date_time` fields. It previously returned a text summary with a different layout. Instructions or workers that parse the previous text should read these fields instead. See [Current Date and Time](/docs/tools/builtin-tools.md#current-date-and-time).

Changes:

- **Account — Self-service Pro and Max subscriptions.** The **My account** page now shows the subscription state under the current plan and offers **Subscribe to plan** on Free accounts, **Cancel subscription** and **Change plan** on paid accounts, and **Resubscribe** while a cancellation is pending. Plan selection shows Pro and Max side by side with their monthly price, main resources, and the amount due today or the date a downgrade starts. Plans are purchased for the calendar month: a first purchase or upgrade is charged now for the remaining days of the month, minus the unused part of what was already paid for the current month, and applies as soon as the payment is confirmed; a downgrade or cancellation takes effect at the next renewal on the first day of the month. Renewals are charged automatically on the first day of each month using the saved payment method; while a renewal is unpaid, a reminder is sent every two days until the tenth day, after which the account returns to Free. Custom plans are managed by the AIVAX team and cannot be changed from the page. The same operations are available through `GET /api/v1/subscriptions`, `POST /api/v1/subscriptions/plan`, `POST /api/v1/subscriptions/cancel`, and `POST /api/v1/subscriptions/resubscribe`. See [subscription pricing](https://aivax.net/pricing) and [Plans and limits](/docs/limits.md).
- **Account — Saved payment methods.** Paid accounts can open **Payment methods** from the **My account** page to add, remove, or set the default card used for automatic renewals, or list them through `GET /api/v1/subscriptions/payment-methods`.
- **Account — Credits and subscriptions are paid through Mixtic.** The **Add credits** dialog no longer asks for a payment method: credit purchases and subscription charges use Mixtic payment links or the saved payment method, and the fees shown before payment reflect this provider. `POST /api/v1/payments` and `GET /api/v1/payments` now ignore the `method` field and query parameter; unknown methods are no longer rejected. Unpaid invoices created in the last 24 hours are also checked with Mixtic every few minutes, so a paid invoice is confirmed even when the payment notification does not arrive.
- **Analytics — Invoice type, payment link, and receipt.** The **Invoices** tab now shows whether each invoice is a credit purchase or a subscription payment, a **Pay** link while an invoice is open and not expired, and a **Receipt** link once it is paid. `GET /api/v1/information/balance` returns the same data in the `type`, `paymentLocation`, and `receiptLocation` fields of each invoice. Unpaid subscription invoices are removed when they expire and can no longer be paid.

## Thursday, October 15th, 2026

Breaking changes:

- **Models — Retired models removed.** `@anthropic/claude-4-sonnet`, `@anthropic/claude-3-haiku`, `@kwaipilot/kat-coder-pro-v2.5`, `@kwaipilot/kat-coder-air-v2.5`, `@nex-agi/nex-n2-pro`, `@nex-agi/nex-n2-mini`, `@qwen/qwen3-max`, `@qwen/qwen3-coder-plus`, and `@unbiased/pareto` are no longer available because they were retired or are no longer served upstream. Switch to a current model of the same family, for example `@unbiased/pareto-26.9` instead of `@unbiased/pareto`.
- **Transcription — Qwen3 ASR Flash removed.** `qwen/qwen3-asr-flash-2026-02-10` is no longer available because it has no active provider. Use `qwen/qwen3-asr-0.6b` or another transcription model.
- **Models — `@openai/gpt-5.4-pro` now uses the Pro model.** The model previously ran and was billed as GPT-5.4. It now routes to GPT-5.4 Pro and is billed at $30 input and $180 output per 1M tokens. Review budgets for gateways that use it.

Changes:

- **Models — New text models.** Adds `@meta/muse-spark-open`, `@nvidia/nemotron-3.5-super-vl`, `@openai/gpt-6.1-sol:pro`, `@qwen/qwen3.8-omni-flash`, `@inclusionai/ling-3.1-flash`, `@stepfun/step-5-preview` (preview), `@sakana/fugu-ultra-v2`, and `@bytedance/seed-2.1-turbo`. See the models page of the dashboard for capabilities and pricing.
- **Models — Deprecated models.** Gemini 2.5 Pro, Flash and Flash-Lite, Xiaomi MiMo V2.5 and V2.5 Pro, Qwen3.5 9B, Poolside Laguna XS 2.1 and S 2.1, GLM 4.7, Claude 4.5 Sonnet, Claude 4.1 Opus, GPT-5, GPT-5 mini, GPT-5 nano, GPT-5.1, GPT-5.3 Codex, GPT-5.4 nano, Gemini 3 Flash, Gemini 3.5 Flash, and Gemini 3.7 Flash are now marked as deprecated. Some of them are scheduled to be retired by their providers in the coming weeks, so move to a newer model.
- **Models — Provider and release date updates.** `@minimax/m2.7` and `@qwen/qwen3.8-max` now route to their current provider versions, `@openai/gpt-6-astra:pro` uses the dedicated Pro version, and several models received corrected or newly added release dates. Groq no longer serves some Llama, Qwen, and Kimi models; those models stay available through other providers.
- **Image generation — New models.** Adds `flux-3-image`, `nanobanana-2.1`, `seedream-5-flash`, and `qwen-image-2.1-turbo`. `mai-image-2.5-flash` and `nova-canvas` are deprecated; `mai-image-2.5-flash` is now an alias of `mai-image-2.6-flash` upstream, and `nova-canvas` is no longer listed by its provider.
- **Transcription — New models.** Adds `nvidia/nemotron-3.5-asr-streaming-multilingual-0.6b` and `qwen/qwen3-asr-0.6b`. The `x-ai/grok-stt-1.0` display name is now "SpaceXAI: Grok STT 1.0"; its identifier and default status are unchanged.
- **Speech synthesis — ElevenLabs Flash v2.5 and Fish Audio Drama 3.** Adds ElevenLabs Flash v2.5 (`ElevenFlash`) and Fish Audio Drama 3 (`FishDrama3`) as speech synthesis sources. Drama 3 accepts speech direction in square brackets, such as `[whispering]`, and uses the provider's default voice when none is requested.
- **Re-ranking — Voyage Rerank 3.** Adds `@voyageai/rerank-3` ($0.05 per 1M tokens) and `@voyageai/rerank-3-lite` ($0.02 per 1M tokens), both with a 32K context.
- **Semantic decisions — New models and price updates.** Adds `@nace-ai/drex-v2.0`, `@upstage/solar-decide-flash`, `@scaledown/classify-1`, and `@inception/mercury-decide`. `@liquid/d1` input price drops from $0.04 to $0.02 per 1M tokens, while `@upstage/solar-decide` rises from $0.05 to $0.10 per 1M tokens. `@cloudflare/clef-flash` context is now 24K and `@typesafe/jev` context is now 262,144 tokens.

## Wednesday, October 14th, 2026

Fixes:

- **Gateways — Skill tools visible when tools without a skill are hidden.** When a gateway hides tools without a skill, the tools listed in a skill's `allowedToolsNames` now become available after the model activates that skill with `read_skill`. Previously, only the always-visible tools and `read_skill` were offered. Only the skills from the most recent successful `read_skill` call count as active, so a call blocked by a gateway worker or rejected as invalid does not expose the skill's tools. See [Skills](/docs/inference/skills.md#structure-and-operation).

## Tuesday, October 13th, 2026

Changes:

- **Models — Supported reasoning efforts.** `GET /api/v1/information/models.json` now returns `modelInformation.reasoningEfforts` for each model, listing the reasoning effort levels the model accepts, such as `low`, `medium`, `high`, `xhigh`, or `max`. The list is empty when the supported levels are unknown. The model details dialog on the dashboard Models page shows these levels when the model has at least one.

## Saturday, October 10th, 2026

Changes:

- **RAG — WebSocket JSONL import.** A new **Index Documents (JSONL WebSocket)** endpoint replaces the multipart JSONL upload for new integrations. Clients stream UTF-8 JSONL lines over a WebSocket and finish with an `END` line. Every 100 lines are checked against balance, storage, and collection access, saved, and queued for indexing, with progress messages reporting committed lines. Each import accepts 10× the plan's per-request JSONL line limit; the other insertion limits are unchanged. Each message must arrive within 30 seconds, and only one import per collection runs at a time. The multipart **Index Documents (JSONL)** endpoint remains available but is deprecated. See [Batch Import](/docs/rag/documents.md#batch-import).
- **API — `Consumed-Credits` response header documented.** Responses that charge usage include `Consumed-Credits` with the request's total cost in USD, including the plan multiplier. It is omitted when nothing was charged and does not cover streamed responses or usage recorded after the response. See [Request cost header](/docs/pricing.md#request-cost-header).
- **Account — Zero data retention providers only.** The account settings page has a new **Zero data retention providers only** option, disabled by default. When enabled, text inference with integrated models is routed only to providers that do not retain prompts, and other providers are excluded. Requests fail when the model has no zero data retention provider available. The option does not change conversation logging. See [Zero data retention providers only](/docs/inference/inference.md#zero-data-retention-providers-only).
- **Semantic decisions — Perplexity Decider V1.1, price and limit updates.** `@perplexity/pplx-decider-v1.1-27b` replaces Perplexity Decider V1, which is no longer available upstream; the previous name `@perplexity/pplx-decider-v1-27b` keeps working and now resolves to V1.1. Its input price drops from $0.04 to $0.02 per 1M tokens. `@cloudflare/clef-flash` input price drops from $0.09 to $0.038 per 1M tokens, and the `@typesafe/jev-1.13` context limit increases from 32,768 to 64,000 tokens. See [Decisions](/docs/data-processing/decisions.md).
- **Inference — `allow_logging` per request.** Chat completions accept `allow_logging`. Set it to `false` to keep that request out of the account conversation logs; it defaults to `true` and cannot enable logging when it is disabled for the account. See [Response and conversation records](/docs/inference/inference.md#response-and-conversation-records).

## Friday, October 9th, 2026

Breaking changes:

- **Chat clients — Local date is no longer added to web chat conversations.** Messages sent from the hosted web chat no longer add a system message with the user's local date and time zone at the start of the conversation, and the public chat client endpoint ignores the `userLocalTime` and `userTimeZone` fields. This keeps the start of the conversation stable between turns, which improves prompt caching. Gateways that need the current date or time should enable the `DateTime` built-in tool, which returns the current date and time in the configured time zone when the model calls it. See [Current Date and Time](/docs/tools/builtin-tools.md#current-date-and-time).
- **Gateways — System instructions follow declaration order.** The parts of an AI gateway's system instructions are now combined in the order they are declared: the gateway's own instruction first, followed by MCP server instructions, remote system instruction sources in their configured order, and instructions added during the request. Previously, these parts could appear in reverse order, and remote sources were added in the order they finished loading. Identical requests now produce the same system instructions, which improves prompt caching. Gateways whose prompts depend on the previous relative order should review their instructions.

- **Built-in tools — Calendar removed.** The `Calendar` flag and `appointment_create`, `appointment_search`, `appointment_find`, `appointment_update`, and `appointment_delete` tools are removed from the API and dashboard. Existing gateways and Batch workflows have the flag removed automatically. Requests containing `Calendar` in `builtin_tools.tools` now fail; remove the flag and update instructions that depend on appointment tools. Migrated reminder text is not a replacement calendar or scheduling service.
- **Memory — Tool calls and management changed.** `Remember` now exposes only `memory_save` and `memory_search`. Replace `memory_update` and `memory_remove` calls with `memory_save` using an ID and content, or an ID without content to delete. `memory_clear` is removed. The Memories API (`/api/v1/memories`, including list, get, delete, and migration prompt generation) and dashboard Memories page are removed; manage records through the [Collections and Documents APIs and dashboard pages](/docs/rag/collections.md). Deleting `@memories` erases all users' memories in the account.
- **Gateways — Memory retrieval and visibility changed.** Memories are no longer added to system instructions automatically: update prompts to call `memory_search` explicitly. The `include_all_memory_context` / `IncludeAllMemoryContext` option is removed and ignored if sent. `allowSharedMemory` keeps controlling whether a gateway sees the user's memories from other gateways or only its own; migrated memories have no gateway and are visible only to gateways with shared memory. Expiration is now optional: `memory_save` accepts `expiresInDays` (1–365), and memories saved without it never expire, where the old default was 30 days. Review access assumptions and retention needs. See [Memory](/docs/tools/builtin-tools.md#memory).

Changes:

- **Models — Three new semantic decision models.** Adds `@microsoft/microsoft-decision-1` (Microsoft-Decision-1), `@nace-ai/drex-v1.5` (Nace.AI Drex v1.5), and `@cloudflare/clef-omni` (Cloudflare Clef Omni) to the semantic decision catalog. All three support `noul`, `choice`, and `score` questions and are billed per input token at $0.042, $0.04, and $0.15 per million tokens respectively, with no output token charge. They are not covered by the daily semantic decision allowance. See [Semantic decisions](/docs/data-processing/decisions.md) and [Pricing](/docs/data-processing/decisions.md#usage-and-cost).
- **Semantic decisions — Image input.** Image-capable decision models (`@cloudflare/clef`, `@cloudflare/clef-flash`, `@cloudflare/clef-omni`, and `@openai/gpt-6-luna-decisions`) now accept images in `state` as `image_url` parts with base64 `image/png`, `image/jpeg`, or `image/webp` data URLs, in the same format as OpenRouter. Clef models accept up to 4 images and GPT-6 Luna Decisions up to 128; other models reject images with `400`. `GET /api/v1/information/decisions-models.json` now returns `maxImages` for each model. See [Send images](/docs/data-processing/decisions.md#send-images).
- **Memory — Collection storage and search.** Memories are stored as documents in the account's `@memories` collection, created on first save, with user and conversation metadata. `memory_search` accepts exactly one of a semantic `query` or a document `filter`, returning up to 10 results restricted to the current user. Semantic searches use no-cost `rrf` reranking; filter searches return newest matches first without embedding charges. Saves and updates incur document-embedding charges, semantic searches incur query-embedding charges, and both tools use the account's RAG rate limits and return tool errors when balance or rate limits prevent access. Allow a few seconds for indexing after writes. See [Memory](/docs/tools/builtin-tools.md#memory) and [Pricing](/docs/pricing.md).
- **Memory — Existing records migrated.** Non-expired memories moved to `@memories`, preserving their IDs, user identifiers, creation dates, and expiration dates, with `conversation_token` set to `null`. Non-expired calendar reminders became text memories in the form `Reminder at <date> (<n> minutes): <description>`. Migrated records are re-indexed and incur document-embedding charges. Review the collection and update integrations that used the removed memory or calendar features.

## Thursday, October 8th, 2026

Changes:

- **Documentation — New Learn section.** The documentation site now includes [Learn](/learn/), a set of 11 modules and 63 short units that explain AI agents from first concepts to production for readers without a computing background: what an agent is, language models, prompts and context, model selection and parameters, tools and integrations, knowledge and RAG, advanced workflows, evaluation and observability, safety and compliance, cost and scale, and practical case studies. Units include interactive examples, step-by-step walkthroughs, comparison tables, charts, and short quizzes, and each one can be marked as complete in the browser. Three suggested learning paths (Beginner, Developer, Business) group the modules by goal. Learn is available in English and Portuguese and is included in site search.
- **Models — Claude Haiku 5.5 added.** Adds `@anthropic/claude-5.5-haiku` (Claude Haiku 5.5), the direct successor to Claude Haiku 4.5, to the text model catalog. It supports image and file input and tool calling, with a 1M-token context window. The `@model-router/claude:budget` alias now selects Claude Haiku 5.5, replacing Claude Haiku 4.5. Applications using this alias may see changes in response quality, latency, and cost. Existing explicit model identifiers remain unchanged.
- **Inference — Provider selection with `routing_options`.** Chat completions accept `routing_options` with `preset` (`Balanced`, `Cheapest`, `Fastest`, or `Quality`) and `allowed_providers`, an ordered list of provider tags such as `["azure-us", "azure-eu", "*"]`. AIVAX tries each tag in order and moves to the next only when no matching provider is available; `"*"` matches any provider. `allowed_providers` defaults to `["*"]`, and an empty list is rejected. Without `"*"`, the request fails when none of the listed providers is available. `routing_preset` is deprecated: it still works, but use `routing_options.preset` instead. AI gateways accept the same ordered list in `parameters.allowedProviders` (default `["*"]`), editable in the gateway editor under **Allowed providers** for integrated models; request values override it for that request only. See [Provider routing](/docs/inference/inference.md#provider-routing).
- **Inference — Serving provider in responses.** Chat completion responses and every streamed chunk include a `provider` field next to `model` with the tag of the provider that served an integrated model. It is `null` for gateways that use your own provider credentials.
- **Models — `filter` on `GET /v1/models`.** The model list accepts an optional `filter` query parameter with a model name and returns only matching entries: the exact name or its dated snapshots, ordered from the closest match. Without it, the list is unchanged.
- **Models — Provider tags.** The provider details on the dashboard Models page show each provider's tag with a copy button, and `GET /v1/models` returns it as `tag` in each provider entry. Provider endpoints in different regions or variants have distinct tags, such as `azure-us` and `azure-eu`.

## Wednesday, October 7th, 2026

Breaking changes:

- **Inference — `File` and `OtherFiles` pre-processing now cover every file.** Gateways and requests that enable only the `OtherFiles` multimodal flag now convert PDF files with OCR instead of sending them to the main model unchanged. Those that enable only the `File` flag now convert non-PDF files with OCR as well, also billed in Processing Units. Gateways and requests with both flags or `All` are not affected. To leave files unchanged, set `multimodal_resolver` (or the gateway's `multimodalResolverParameters`) without a `fileEngine`; no file type is then pre-processed.

Changes:

- **Inference — Per-media multimodal resolver engines.** Chat completions accept `multimodal_resolver`, and AI gateways accept `multimodalResolverParameters`, with `imageEngine`, `audioEngine`, `videoEngine`, and `fileEngine` fields. Each one selects how that content type is converted to text before inference: `InferenceLow` (smaller multimodal model; `Inference` is an alias), `InferenceHigh` (larger, more accurate multimodal model at a higher cost), `Ocr` for images and files (billed in Processing Units, like Fetch and OCR), or `Stt` for audio (speech-to-text, billed per second). OCR accepts base64 data URIs and public URLs. Results of every engine are cached per content and engine, so repeated media is not billed again. The `multimodal_preprocess` flags and the gateway `enabledMultimodalFeatures` setting are deprecated but keep working with the equivalent engines; the new settings take precedence when present. The gateway editor now configures one engine per content type. See [Multimodal pre-processing](/docs/inference/inference.md#multimodal-pre-processing).
- **RAG — Document filters in the Collections MCP and the gateway query tool.** The search tool of the Collections MCP and the `query` tool of AI gateways using the `QueryFunction` query strategy accept an optional `filter` argument with the same syntax as the semantic search `filter` field, such as `tags has "faq" and updatedAt >= now-30d`. Filters are applied before the search terms are embedded; when no document matches, the tool returns no results without embedding or search charges. An invalid filter is returned to the model as a tool error. Automatic gateway RAG still does not apply filters. See [Document Filters](/docs/rag/document-filters.md).

## Tuesday, October 6th, 2026

Changes:

- **RAG — Faster text segmentation without sanitization.** `POST /api/v1/generations/segment` requests with `sanitize` omitted or `false` no longer use a language model. Boundaries are now chosen from the document structure (headings, lists, tables, code blocks, paragraphs, and sentence ends) and the semantic similarity of neighboring passages, targeting segments of about 300 tokens. Segments cover the whole document in source order without overlap and keep the original line breaks; a boundary may fall at a sentence end inside a line. Documents of about 300 tokens or less are returned as a single segment. The response format, quotas, and per-token price are unchanged; `usage.processing_units` now reports the tokens of the submitted documents. Requests with `sanitize: true` keep the previous behavior. See [Text segmentation](/docs/data-processing/text-segmentation.md).

- **Models — Six new semantic decision models.** Adds `@upstage/solar-decide` (Upstage Solar Decide), `@cloudflare/clef` (Cloudflare Clef), `@cloudflare/clef-flash` (Cloudflare Clef Flash), `@liquid/d1` (LiquidAI d1), `@perplexity/pplx-decider-v1-27b` (Perplexity Decider V1 27B), and `@openai/gpt-6-luna-decisions` (OpenAI GPT-6 Luna Decisions) to the semantic decision catalog. All six support `noul`, `choice`, and `score` questions through `POST /api/v1/generations/decisions` and are billed per input token at published rates with no output token charge, with existing account and plan adjustments still applying. They are not covered by the daily semantic decision allowance, which remains limited to Julia-1. Existing model identifiers remain unchanged. See [Semantic decisions](/docs/data-processing/decisions.md) and [Pricing](/docs/data-processing/decisions.md#usage-and-cost).

## Monday, October 5th, 2026

Breaking changes:

- **Chat clients — Current date and time are no longer added to the instructions.** Telegram and WhatsApp integrations, including scheduled messages, no longer add the server date and time to the model instructions. Models must get the current time from a tool. To keep date-aware behavior, such as reminders, enable the date and time built-in function or the shell (`date` command) on the AI gateway used by the chat client.
- **Account — Reseller plan renamed to Custom.** Accounts on the Reseller plan now report the plan as `Custom` instead of `Reseller` in API responses, such as the balance endpoint, and in the `X-Authenticated-Account-Plan` response header. Integrations that compare the plan name with `Reseller` must accept `Custom`. Custom accounts can have rate limits defined as a multiple of the Pro plan limits; accounts without a configured multiple keep having no plan rate limits. See [Plans and Limits](/docs/limits.md).

Fixes:

- **AI gateways — Shell tool commands without parameters now run.** In the gateway shell, calling a tool that has no parameters, such as `list_scheduled_jobs`, now runs it instead of printing its help. Use `--help` to view the help.

- **Collections — De-duplication no longer stops before removing documents.** A de-duplication task that found duplicate documents could stop with zero documents removed and no backup files, because saving the backup of the removed documents failed. These tasks now save the backup files, remove the duplicates, and include the download links in the completion notification. Tasks that stopped this way did not remove any documents; start a new task to retry.

Changes:

- **Conversations — Provider and routing details.** Conversations now record the provider that served the latest response, its data collection policy, the model variant (`fast`, `flex`, or `priority`) when one was used, and the routing option used to select the provider. The View Conversation endpoint returns them in the `providerName`, `providerDataCollection`, `modelVariant`, and `routingOption` fields, and the List Conversations endpoint returns `providerName`, `modelVariant`, and `routingOption`. These fields are `null` for gateways that use your own provider credentials and for conversations stored before this change. The conversation list in the dashboard shows Provider, Routing, and Variant columns; Provider shows BYOK when no provider was recorded. The table scrolls horizontally, and the row actions stay visible.
- **AI gateways — Time zone and culture for the shell.** The gateway shell options accept `timeZone`, an IANA time zone such as `America/Sao_Paulo`, and `culture`, such as `pt-BR`. The `date` command uses the time zone for its output and for dates without an explicit offset, and uses the culture for day and month names. The defaults remain UTC and the invariant culture; `date -u` always prints UTC.
- **RAG — Document filters for semantic search and answer generation.** The semantic search and answer generation endpoints accept an optional `filter` field that restricts the search to documents matching conditions on name, content, tags, creation and update dates, or metadata, such as `tags has "finance" and createdAt >= now-30d`. The field accepts a string or an array of strings combined with `and`. Filters are applied before the search terms are embedded; when no document matches, the request returns an empty result without embedding or search charges. Invalid filters return `400 Bad Request` with the error position. Filters are not yet available in AI gateway RAG or the Collections MCP. See [Document Filters](/docs/rag/document-filters.md).
- **RAG — Filters and visual results in the collection playground.** The collection playground has a Filters section where each line is a document filter; all lines must match and are sent as the `filter` array. Results can be viewed as Visual, showing the generated answer and each document with its score, metadata, and referenced documents, or as raw JSON. The playground now uses the `rrf` reranker by default; you can still choose another reranker.

## Saturday, October 3rd, 2026

Changes:

- **Documentation — Updated reading and search experience.** Documentation adds language-specific search, light and dark themes, mobile navigation, and a page menu for viewing or copying Markdown. AI agents can use the documentation index and full-text files. Existing documentation URLs continue to resolve; some older guides redirect to their current product documentation.

## Friday, October 2nd, 2026

Changes:

- **Models — Claude Sonnet 5.5 and GPT-6.1 Sol added.** Adds `@anthropic/claude-5.5-sonnet` (Claude Sonnet 5.5), the direct successor to Claude Sonnet 5, and `@openai/gpt-6.1-sol` (GPT-6.1 Sol), an upgrade to GPT-6 Sol, to the text model catalog. Both support thinking, image and file input, and tool calling; GPT-6.1 Sol also supports structured output. The `@model-router/claude:mid` and `@model-router/openai:mid` aliases now select Claude Sonnet 5.5 and GPT-6.1 Sol, replacing Claude Sonnet 5 and GPT-6 Sol, respectively. Applications using these aliases may see changes in response quality, latency, and cost. Existing explicit model identifiers remain unchanged.

## Thursday, October 1st, 2026

Breaking changes:

- **API — Error status codes reflect the failure source.** Failures are no longer all returned as `400 Bad Request` by account, RAG, web, and generation endpoints. Invalid requests still return `400`, and authentication, balance, and permission failures that previously surfaced as `400` now return `401`, `402`, or `403`. Unexpected AIVAX failures return `500 Internal Server Error` with a generic message, and unavailable external services, including model providers, return `503 Service Unavailable` with a `Retry-After` header. On OpenAI-compatible endpoints, the error `code` is now `invalid_request_error`, `service_unavailable`, or `server_error` instead of always `server_error`. Clients that treat every non-2xx response as a request error should retry `500` and `503` responses, honoring `Retry-After`. See [Troubleshoot the first request](/docs/inference/inference.md#troubleshoot-requests).

Fixes:

- **Chat completions — Malformed tool declarations rejected as invalid requests.** Requests whose `tools` entries have missing or wrongly typed fields now return `400 Bad Request` instead of a server error.

- **Gateways — Bash tool reports invalid options to the model.** Unknown options or values that do not match a tool's parameters now return a command error that the model can correct, instead of failing the tool call.

Changes:

- **MCP utilities — Media generation MCP.** A new hosted MCP server at `https://inference.aivax.net/v1/mcp/media-generation` exposes `list_models`, `generate_image`, and `generate_speech` to MCP-compatible clients. `list_models` takes a `type` of `image` or `audio`; generated images and MP3 speech are returned as public URLs. Use the optional `X-Mcp-Enabled-Tools` header to choose which tools a client sees. Generations use the same pricing and limits as the Image Generation and Speech Generation APIs and require a positive balance. See [Media generation MCP](/docs/mcp-utilities/media-generation-mcp.md).

## Monday, September 28th, 2026

Fixes:

- **Gateways — Bash tool help accepts nullable parameters.** Requesting help for tools whose parameters accept multiple types, including `null`, no longer fails while listing their arguments. Help preserves the accepted types and nested parameter paths. No tool schema changes are required.

- **Chat integrations — Failure notifications restored.** Streaming and non-streaming conversations again attempt to send “System: something went wrong. Please, try again later.” after an unrecoverable generation failure, exhausted recovery attempts, or a turn that sends no message. A final failure is reported even if an earlier partial reply was delivered. Notification delivery still depends on the messaging service being available.

Changes:

- **Gateways / MCP — Server instructions and remote skills.** MCP sources can include server instructions and root skill documents alongside tools, including sources added by workers. Both options default to enabled; set `allowClientInstructions` or `allowRemoteSkills` to `false` to exclude that content. Skill discovery requires the remote server to advertise compatible capabilities; account skills remain available. Remote skill content is checked against its advertised size, digest, and frontmatter. Dynamic skills, supporting files, scripts, and servers requiring the newer discovery protocol are not supported. See [MCP functions](/docs/tools/mcp.md#server-instructions-and-remote-skills) for compatibility and trust limits.

- **Gateways — Time zone selection.** The current date and time setting now offers a time zone dropdown grouped by region, including UTC. Existing saved time zones are preserved when reopening the setting.

- **Models — Seven new text models.** Adds `@cohere/command-a-plus`, `@upstage/solar-mini4`, `@aion-labs/aion-3.5`, `@aion-labs/aion-3.5-mini`, `@qwen/qwen3.8-max-prime`, `@z-ai/glm-5.3-prime`, and `@fireworks/ember-1` as selectable text models, billed per provider at published token rates with existing account and plan adjustments still applying. Upstage and Fireworks models now display their provider icons instead of the generic fallback. Existing model identifiers remain unchanged.

## Sunday, September 27th, 2026

Changes:

- **Telegram — Compact tool progress.** Streamed replies show only the latest tool preamble in the thinking indicator when tool-call visibility is enabled, instead of accumulating tool-name blocks in the response. The final reply contains no tool-progress blocks. Other messaging channels and non-streamed replies are unchanged.

- **Gateways — Bash tool selection.** The Bash tool list now includes a shortcut for `get_date_time` (Current date and time). Inclusion and exclusion lists accept case-insensitive wildcard patterns: `*` matches any number of characters, as in `something_*`, and `?` matches one character. Exact tool names remain supported.

- **Semantic decisions and Agentic Tests — Account rate limits.** Per-minute account limits apply to semantic decision requests and new Agentic Test runs; manual, scheduled, and direct evaluations share the test-run limit. Requests above the limit return HTTP 429, while scheduled tests wait for a later scheduling check. Clients should pace requests and retry after the rate-limit window clears. Existing inference limits still apply. See [Plans and Limits](/docs/data-processing/decisions.md#account-rate-limits), [Semantic decisions](/docs/data-processing/decisions.md#account-rate-limits), and [Agentic Tests](/docs/inference/agentic-tests.md#run-and-inspect-a-test).

- **Models — Consistent speech synthesis prices.** Text-to-speech catalog prices now derive from the same per-character rates used to calculate synthesis usage, displayed per 1,000 characters. Existing model identifiers and billing rates remain unchanged.

- **Models — Comparable transcription prices.** Speech-to-text model prices are displayed consistently in USD per minute, converting hourly and per-second rates for comparison without changing billing rates or duration measurement.

- **Image generation — Fixed output and reference prices.** Image generation uses a fixed price per delivered output plus a per-reference price for each output. Models whose providers bill tokens or megapixels now use rounded-up estimates instead of metered token charges. Prompt processing is included in the output estimate; models without a separate reference charge list a zero reference rate. These are fixed tariffs, not receipts for the provider's actual consumption. Image charges no longer include the AIVAX image-generation markup or account and plan pricing multipliers. See [Image generation](/docs/generations/images.md).
- **Models — Subscription coverage.** The Models page now includes a “Subscription Usage” column for rerankers and semantic decision models. “Included” identifies models eligible for daily plan allowances; “-” identifies models without coverage. Eligibility does not indicate an account's remaining allowance. Both service catalogs expose this eligibility as `subscriptionUsage`.

- **Subscriptions — Included daily usage allowances.** Free, Pro, and Max subscriptions include separate daily allowances for RAG search and insertion embeddings, Reflex input (including cached input), and Julia-1 semantic decisions. Each metered item is either fully included or billed at normal rates; a request with multiple items can combine included and paid usage. This also applies to OCR extraction, replacing partial coverage. Included items appear in subscription consumption without zero-cost billing-history entries; usage indicators may exceed the base allowance within the permitted margin. Uncovered items retain normal billing records. `includesSubscriptionModels` is false while inference subscriptions are disabled; LLM subscription coverage remains disabled. Reflex's daily processing-time cap remains separate, and reseller accounts do not receive subscription allowances. See [Plans and Limits](/docs/limits.md#included-daily-subscription-allowances) and [Pricing](/docs/pricing.md).

## Saturday, September 26th, 2026

Breaking changes:

- **Image generation — Deprecated models removed.** Removes `majicMIX-realistic`, `AbsoluteReality`, `CyberRealistic`, `CyberRealistic-Pony`, `RealCartoon-Realistic`, `Hassaku-XL`, and `Meina-Mix` from the available models. Direct API requests using these identifiers now fail; select an active model instead. Built-in image generation uses `flux-schnell` when no valid model is configured, replacing the deprecated `AbsoluteReality` default. Review saved configurations; output style and pricing differ.

Changes:

- **Image generation — Additional Pollinations models.** Adds 16 official raster-image models, including FLUX 1.1 Pro and FLUX 2 variants, MAI Image variants, GPT Image 2.5 Flare and Sunburst, Qwen Image 2.1 and 3, Grok Imagine Image 2.0, Recraft V4.1 Flash, Krea 2 Medium, DreamShaper 8 LCM, and Seedream 5 Pro, with model-generated previews in the image picker. Community and SVG models are excluded. The catalog displays the billing units. See the September 27th entry for the subsequent fixed-price billing change. Failed generations are not counted as delivered images. See [Image generation](/docs/generations/images.md).

- **Models — Service model catalogs.** The Models page now includes tables for image generation, speech-to-text, text-to-speech, reranking, and semantic decisions, with backend-provided descriptions, release dates, base USD pricing with billing units, and an Actions dropdown in every service-model table for copying model names and opening integration documentation. Model names show a friendly label when available while copying the identifier accepted by the API. Pricing uses compact input, cached-input, output, image, character, and duration units separated by arrows where applicable, with full rates and units available in the tooltip. Catalogs are ordered newest first. OpenRouter catalog dates and friendly names supplement missing launch metadata; catalog dates are explicitly labeled rather than presented as manufacturer release dates. Models without either date remain last. Failed catalog requests can be retried independently. The public information catalogs expose these details, including the new `GET /api/v1/information/speech-models.json` catalog. Account and plan pricing adjustments still apply. See [Pricing](/docs/pricing.md) and [Semantic decisions](/docs/data-processing/decisions.md).

- **Privacy — Judicial disclosure and retention clarified.** The [Privacy Policy](/docs/legal/privacy-policy.md) and [Terms of Use](/docs/legal/terms-of-service.md) specify Brazilian court orders for disclosure, foreign requests to preserve existing logs for up to 1 year, and up to 1 year of technical logs and metadata. They clarify that conversation content is collected only when Conversations is enabled for the request or account, and that available account resources and backups dating back up to 3 months may be disclosed under a Brazilian court order. The content license in the Terms is expressly subject to these limits.

- **Generations — Additional decision models.** The [Semantic decisions guide](/docs/data-processing/decisions.md) explains question types and response interpretation. The public `GET /api/v1/information/decisions-models.json` endpoint lists canonical names, aliases, supported question types, context lengths, release dates, and base token prices. Adds `@respan/span-01`, `@respan/span-01-lite`, `@jaredpalmer/kev-4b`, and `@supersonic-labs/julia-1` as model choices for semantic decisions. Julia-1 supports `choice`, `score`, and `noul`; its input usage includes the state repeated for each question. Existing account and plan pricing adjustments apply, and model identifiers and request formats remain unchanged. See [Plans and Limits](/docs/data-processing/decisions.md#model-specific-limits) and [Pricing](/docs/data-processing/decisions.md#usage-and-cost) for current limits and rates.

## Tuesday, September 22nd, 2026

Changes:

- **Models — GPT-6 Sol and Luna added.** Adds `@openai/gpt-6-sol` and `@openai/gpt-6-luna`, including their `:pro` reasoning variants. The `@model-router/openai:mid` and `@model-router/openai:budget` aliases now select GPT-6 Sol and GPT-6 Luna, respectively. Applications using these aliases may see changes in response quality, latency, and cost. Existing explicit model identifiers remain unchanged.

## Monday, September 21st, 2026

Breaking changes:

- **Gateways — Off-topic moderation was removed.** The dedicated off-topic threshold no longer blocks requests that stray from the conversation's purpose. If your application relies on this check, review its topic restrictions before adopting this change; the remaining moderation categories are not an equivalent replacement.
- **Built-in tools — Advanced web research is disabled.** The `AdvancedWebUsage` tool returns an unavailable response instead of performing research. Remove reliance on this tool from gateway instructions and workflows. Standard [Web Search](/docs/web-foundation/web-search.md) and URL extraction remain separate alternatives, not equivalent replacements for multi-step research.
- **Models — Mercury 2.5 model identifier changed.** Replace `@inception/mercury-2.5-preview` with `@inception/mercury-2.5` in requests and gateway settings. The preview identifier is no longer listed, and the replacement is no longer marked as preview.
- **Gateways / MCP — MCP tool names are source-qualified.** Tools from different MCP sources no longer share an unqualified name in the gateway. Review gateway instructions, tool-selection rules, and workers that match exact tool names. The original tool name at the connected MCP server is unchanged. See [MCP functions](/docs/tools/mcp.md).

Fixes:

- **Collections, Gateways, and Generations — Service model availability.** Collection answer generation, gateway routing, chat utilities, and media-processing services avoid selecting temporarily unavailable models. Teach Skill and multimodal preprocessing can try another available model after a retryable failure; success still depends on service availability.
- **Teach Skill — Usage calculation.** Teach Skill processing charges use the model pricing associated with the completed request, including when a retry changes the model used. See [Teach Skill](/docs/inference/skills.md) and [Pricing](/docs/pricing.md).
- **Fetch and OCR — More reliable page extraction.** Cancelled or timed-out page-content requests no longer leave page extraction running indefinitely. This addresses cases where web content extraction could stall.
- **Chat clients — Final reply and message history.** `completionText` now selects the final generated assistant reply rather than combining it with earlier assistant text during tool use. The added `createdMessages` response field preserves newly generated messages in order, including tool interactions; submitted messages are not repeated. Use this field when you need the complete generated turn.
- **Gateways / MCP — Structured MCP results are retained.** Assistants receive structured result content in addition to supported content blocks, avoiding missing information when an MCP tool returns structured output.
- **Fetch and OCR — X post extraction.** Improved readable-text extraction from public X post links. Content availability and access restrictions still apply.
- **Fetch and OCR — Plain-text normalization changed.** Plain-text conversion no longer collapses internal whitespace or normalizes Unicode characters. Surrounding whitespace may still be trimmed in extraction results. Applications that compare extracted text exactly or require normalized spacing should perform that normalization themselves.

Changes:

- **Fetch and OCR — Optional structured extraction.** Supply `responseSchema` to convert extracted content into JSON. Results add `extractedObject` and `jsonProcessingUnits` while retaining `extractedText` on success. Without a schema, the new fields are null and zero respectively. JSON conversion is billed separately from extraction and is not covered by the daily extraction allowance. See [Fetch and OCR](/docs/web-foundation/fetch-and-ocr.md).
- **Generations — Semantic decisions.** Evaluate multiple named questions against a shared JSON state using `noul` (true/false criteria), `choice`, or `score`. Responses include named answers, token usage, and cost. The service requires a positive balance, and its token usage contributes to account usage totals.
- **Built-in tools — Current date and time.** The `DateTime` option lets assistants request the current date, time, weekday, time zone, and UTC offset. Set `dateTimeTimeZone` to the desired time zone; the default is `America/Los_Angeles`, with daylight-saving adjustments, independent of the browser's time zone. Invalid time zones are rejected.
- **Models — Additional model choices.** Adds GLM-5.3-FlashX, Fugu Max, Pareto, Ling 3.0 Flash VL, MiMo-V2.6-Pro, MiMo-V2.6-Flash, MiMo-V2.6-Pro-UltraSpeed, and Grok 4.7 to the inference catalog. The Xiaomi frontier, mid, and budget aliases now select MiMo V2.6 models, while `@model-router/grok:latest` selects Grok 4.7. Alias users may see different response quality, latency, and cost; availability and supported capabilities depend on the selected model and account plan.
- **Inference — Transient-failure recovery.** Inference requests can make additional recovery attempts when a provider is temporarily unavailable. This may avoid some failed requests, but can also increase response time before an error is returned.
- **Avi Assistant — Updated default model.** The AIVAX console assistant changes its default model, which may change response style, latency, and usage cost. This does not change the model selected in your own gateways.
- **Documentation — Updated service guidance.** The API documentation overview and Avi Assistant guidance cover voice sessions, agentic tests, classification, segmentation, reranking, and web extraction, with current documentation links and service-specific billing guidance. This is a guidance update, not the introduction of those services.
- **Models — DeepSeek V4.1 Flash added.** The inference catalog includes `@deepseek/deepseek-v4.1-flash` with tool-calling support. Check model availability and plan eligibility before selecting it.
- **Models — Router selections updated.** `@model-router/deepseek:latest` and `@model-router/deepseek:budget` now select DeepSeek V4.1 Flash. Applications using these aliases may see different response quality, latency, and cost without changing the alias. Adds `@model-router/claude:frontier-mythos` and `@model-router/mercury:latest` as additional choices.
- **Chat clients — Structured prompt input.** Synchronous chat-client prompts accept plain text, a single message, or an ordered array of messages, including assistant tool calls and matching tool results. Existing single-message input remains supported. Optional `instructions` adds context for that request without replacing saved session context. See [Chat clients](/docs/inference/chat-clients.md).
- **Chat clients — Turns without session persistence.** Set `commit` to false to generate a reply without saving the submitted and generated messages to session history. The default remains true. This is not a free preview: inference and tool actions still run. To continue an uncommitted tool interaction, send the assistant tool-call message together with its tool results.
- **Agentic Tests — Optional testing notifications.** Account notification preferences can enable weekly test summaries and alerts when a test reaches three consecutive failures. These complement existing failure and recovery notifications. See [Agentic Tests](/docs/inference/agentic-tests.md).
- **Fetch and OCR — Rendered web content.** HTML extraction supports rendered page content, improving coverage of pages whose readable text depends on scripts. Rendering is metered in processing units; this does not guarantee access to every website or restricted page. See [Fetch and OCR](/docs/web-foundation/fetch-and-ocr.md).
