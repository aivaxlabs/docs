Source: https://docs.aivax.net/docs/legal/changelogs.html

# Changelogs

Technical changes that affect AIVAX products, services, or the public API. Dates identify when entries were added or updated, not confirmed production rollout dates. Each item identifies the affected product or service; maintenance with no user-facing effect is omitted.

This page lists the changes from the last 14 days. Older entries are kept in the [changelog archive](https://github.com/aivaxlabs/docs/blob/master/archive/changelogs.md).

## Tuesday, November 17th, 2026

Fixes:

- **Chat clients — Session metadata in messaging integrations.** Replies and scheduled messages from WhatsApp, Telegram, and other messaging integrations now carry the session metadata to MCP servers, protocol functions, gateway workers, and stored conversations, as web chat sessions already did.
- **Gateways — Reserved MCP metadata keys.** Custom metadata keys beginning with `_aiv` no longer make MCP tool calls fail. They are ignored, and the AIVAX fields keep their values.
- **Tools — Tool explanations no longer break MCP and protocol function calls.** With tool explanations enabled, AIVAX now removes `_tool_reason` and `_tool_goal` from the arguments it sends to MCP servers and protocol function callbacks. MCP servers that reject unknown arguments no longer fail these calls. Streamed `servertool` events still include both fields and `explanation`. See [Tool explanations](https://docs.aivax.net/docs/inference/response-rendering/tool-explanations.md).
- **Account — Inactive accounts with a balance are kept.** Disabled or inactive accounts are no longer deleted by the scheduled cleanup while they still hold a balance.
- **Models — Model lookup with suffixes.** The `name` filter of `GET /api/v1/information/models.json` now ignores a `#` provider tag or a `:` variant suffix and returns the matching base model.

Changes:

- **Models — GPT-6.2 Astra and GPT-6.2 Sol.** Adds `@openai/gpt-6.2-astra`, `@openai/gpt-6.2-astra:pro`, `@openai/gpt-6.2-sol`, and `@openai/gpt-6.2-sol:pro`, with reasoning, image and file input, tool calling, and structured output. `@model-router/openai:frontier` now routes to `@openai/gpt-6.2-astra` instead of `@openai/gpt-6-astra`; select `@openai/gpt-6-astra` directly to keep the previous model.
- **Decisions — Liquid d1.2 and d1.2-ultra.** Adds `@liquid/d1.2` and `@liquid/d1.2-ultra`, with a 64K context, image input, and yes/no, multiple-choice, and score questions. `@liquid/d:latest` now resolves to `@liquid/d1.2` instead of `@liquid/d1.1`. Check prices in the [decision model listing](https://docs.aivax.net/docs/data-processing/decisions.md#discover-models-programmatically).
- **Gateways — Metadata in every MCP request.** AIVAX now sends the calling context and custom metadata in `params._meta` of every request to an MCP server, including `initialize`, `tools/list`, `skills/list`, and `resources/read`, not only `tools/call`. Discovery results are cached per calling context, so MCP servers may receive more discovery requests than before. See [Metadata sent with MCP requests](https://docs.aivax.net/docs/tools/mcp.md#metadata-sent-with-mcp-requests).
- **Chat clients — Reasoning and tool activity in the hosted chat.** The hosted web chat now groups reasoning and tool calls into collapsible blocks with a summary such as "Thought, called web_search". A block opens while the model is working, scrolls within a fixed height, and collapses when the answer starts; opening or closing a block by hand keeps it that way. While a tool runs, the status line shows the tool's explanation instead of the generic thinking label. Tool results are not shown in the conversation. When **Tool call visibility** (`showToolCalls`) is off, these blocks are hidden and only the status line remains. See [Publish the hosted chat](https://docs.aivax.net/docs/inference/chat-clients/web-client.md#publish-the-hosted-chat) and [Tool explanations](https://docs.aivax.net/docs/inference/response-rendering/tool-explanations.md).

## Monday, November 16th, 2026

Fixes:

- **Account — Top-ups paid with a saved payment method.** Adding credits no longer opens an empty browser tab when a saved payment method settles the payment immediately. The dashboard confirms the payment instead.

Changes:

- **Account — Brazilian taxes on payments.** New payments now include Brazilian taxes, added on top of the amount due: credit top-ups, subscription payments and renewals, and bills issued by the AIVAX team. The charged total is the amount divided by (1 - 0.1333), which corresponds to approximately 11.33% of the total in service taxes and 2% in IOF. For example, a $19.00 subscription payment charges $21.92. Taxes are not added to the balance, and listed plan prices do not include them. Before you confirm a top-up, the dashboard now lists the credits, the service fee, the taxes, and the total charged. The amount due shown for a plan change already includes taxes, and receipts list each tax. Invoices created before this change keep their amount. See [Taxes on payments](https://docs.aivax.net/docs/pricing.md#taxes-on-payments).
- **Account — Service invoices.** When AIVAX issues a service invoice (nota fiscal de serviços) for a payment, you receive a dashboard notification and an e-mail, and the invoice gets a **Service invoice** download link in the Invoices tab of Analytics. Usage data returns the link in `serviceInvoiceLocation`, which is `null` until the service invoice is issued.
- **Decisions — Conversation input and media.** Decision requests now accept `input`, an array of conversation messages, instead of `state`. The two fields are mutually exclusive. The conversation becomes the first state item, and image, audio, video, and document parts are evaluated as media. Models that list `audioinput`, `videoinput`, or `fileinput` in the [decision model listing](https://docs.aivax.net/docs/data-processing/decisions.md#discover-models-programmatically) accept those parts; Gemini Decision 1 accepts all four. See [Send media](https://docs.aivax.net/docs/data-processing/decisions.md#send-media).
- **Routing — Auxiliary steps stay on zero data retention providers.** Content moderation, the complexity router, RAG query rewriting (`UserRewrite` and `FullRewrite`), the summary read aloud by chat clients with `summarizeTextBeforeAudioSynthesis`, the rewrite of text with voice instructions for speech generation, and Media Injector now always run on a zero data retention provider, even when **Zero data retention providers only** is disabled. When none is available for one of these steps, the request fails with an error stating that no zero data retention provider is available, instead of falling back to another provider; retry later. Only content moderation still moves on to its other models. These steps can cost about twice as much as before, depending on the provider selected. See [Zero data retention providers only](https://docs.aivax.net/docs/inference/routing/zdr.md).
- **Analytics — Cost origin and payment totals in the monthly report.** The monthly report now splits the billed amount into provider costs, passed through from third-party providers, and service costs, charged directly by AIVAX. It also totals the payments confirmed in the month, with their taxes and, when available, the payment method and its fees. Get Monthly Usage Report returns these totals in `providerCost`, `directServiceCost`, and `payments`.
- **RAG — Reflex v1.5 reranker.** The rerank endpoint accepts `@aivax/reflex-v1.5`, a higher-accuracy option to `@aivax/reflex-v1`. It ranks up to 15,000 documents per request and returns at most 50 results, so requests with a larger `top_n` are rejected. It costs $0.015 per 1M input tokens, and documents already processed recently for the same account cost $0.005 per 1M tokens. Requests count toward the subscription allowance, like Reflex v1. The default reranker is still `@aivax/reflex-v1`; select the new model with `model`. See [Reranking](https://docs.aivax.net/docs/rag/reranking.md).

## Friday, November 13th, 2026

Breaking changes:

- **Chat clients — `allowedFrameOrigins` removed.** The deprecated `allowedFrameOrigins` chat client option is no longer returned when you read a chat client. Requests that still send it keep working, and the value is ignored. Embedding the hosted chat in an iframe is not affected; see [Publish the hosted chat](https://docs.aivax.net/docs/inference/chat-clients/web-client.md#publish-the-hosted-chat).

Fixes:

- **Batch — Jobs resume after the daily item limit.** A job paused because the plan's daily limit of processed items was reached now resumes automatically after the limit window resets, as described in [Batch and Agentic Tests limits](https://docs.aivax.net/docs/limits.md#batch-and-agentic-tests). Previously, these jobs could stay paused until they were resumed manually. Jobs that are already stuck can be resumed by setting their state to active. Temporary model provider failures still pause the job after repeated errors and still require a manual resume.
- **Chat clients — Session token count after Send Prompt.** Sessions that receive messages through Send Prompt now report their token count in the session listing. Previously, these sessions always showed 0 tokens. Counts are updated on the next prompt of each session.

Changes:

- **Chat clients — Insert messages into a session.** The new `POST /api/v1/web-chat-client/<chat-client-id>/sessions/insert-message` endpoint appends user, assistant, or tool messages to an active session, identified by `sessionId` or `tag`, without running inference and without consuming balance. The inserted messages are used as context by the next prompt. The request fails with 409 while an inference is running for the session.

## Thursday, November 12th, 2026

Breaking changes:

- **Image generation — DreamShaper 8 LCM removed.** `@lykon/dreamshaper-8-lcm` is no longer available, and requests that name it are rejected. Choose another text-to-image model, such as `@black-forest-labs/flux-schnell`. See [Image generation](https://docs.aivax.net/docs/generations/images.md).

Changes:

- **Chat clients — Disposable context in Send Prompt.** Send Prompt accepts a new `context` field with text or OpenAI-compatible content parts, including images, audio, video, and files. The parts are added to the beginning of the last user message for that request only and are never saved to the session history or the stored conversation. See [Add disposable context to the last user message](https://docs.aivax.net/docs/inference/chat-clients/web-client.md#add-disposable-context-to-the-last-user-message).
- **Image generation — GPT Image 2.6 Flare and Sunburst.** Adds `@openai/gpt-image-2.6-flare`, for fast generation, and `@openai/gpt-image-2.6-sunburst`, for detailed compositions. Both support reference-image editing and are priced at $0.025 per output image plus $0.025 per reference image per output.
- **Image generation — Older models deprecated.** `@openai/gpt-image-2.5-flare`, `@openai/gpt-image-2.5-sunburst` and `@openai/gpt-image-1-mini` are now marked as deprecated. They keep working for now; move to `@openai/gpt-image-2.6-flare`, `@openai/gpt-image-2.6-sunburst` or `@openai/gpt-image-2`.
- **Image generation — Lower prices.** `@bytedance/seedream-5-pro` now costs $0.035 per output image, down from $0.09, and `@recraft/recraft-v4.1-flash` costs $0.007, down from $0.008.

## Wednesday, November 11th, 2026

Fixes:

- **Account — Credit top-ups add the chosen amount to the balance.** A new top-up now adds exactly the amount you choose to your balance. The payment processor fee and the service fee are charged with the payment and are not added to the balance. Credits already added are unchanged. See [Credit top-ups](https://docs.aivax.net/docs/pricing.md#credit-top-ups).

Changes:

- **Dashboard — Redesigned home page.** The dashboard home now shows your credit balance with a reminder to add credits when it runs out, usage for the last 24 hours, 7, 30, or 90 days with token and request trends, and shortcuts to AI Gateways, RAG Collections, Chat clients, and Voice. **Get started**, **Copy Prompt**, and the yearly daily token usage chart remain available. Token totals now count only token-based usage, and request totals count each request once. The code sample panel was removed; see the [Overview](https://docs.aivax.net/docs/overview.md) for examples.
- **Dashboard — More consistent page layout.** Section titles on the Usage page now include a short description, and section spacing on Analytics and Batch is aligned with other pages. On the Generations page, the text tools and the image and reranking tools are grouped under their own labels in the tab list.
- **AI Gateways — New `tool.fetched` and `message.completed` worker events.** Gateway workers now receive `tool.fetched` after a server-side tool returns its result, and can keep, block, or replace that result with a `tool.fetched.response` action. Workers also receive `message.completed` after each inference finishes, with the messages, errors, whether the failure was fatal, and usage; this event is a notification and its response is ignored. Workers that return `2xx` for unknown events need no change. See [Gateway Workers](https://docs.aivax.net/docs/inference/workers.md).
- **Account — No service fee on credit top-ups for Pro, Max, and Ultimate.** Adding credits on Pro, Max, and Ultimate no longer includes the AIVAX service fee. The payment processor fee still applies, and Free keeps the service fee. The dashboard shows each fee before you confirm. See [Credit top-ups](https://docs.aivax.net/docs/pricing.md#credit-top-ups).
- **Account — Daily ceiling on the inference commission.** The plan's inference commission on integrated-model inference is now limited to $1.50 per day on Free, $1.20 on Pro, and $1.00 on Max. After the ceiling is reached, model inference is charged at the model's rates until midnight in the America/Sao_Paulo time zone. Other services that include the plan multiplier in their rates are not covered by the ceiling. See [Plan multipliers](https://docs.aivax.net/docs/pricing.md#plan-multipliers).
- **Account — Inference commission as a separate usage entry.** For integrated-model inference, the plan's commission is now recorded as its own usage entry, `inference.commission`, under the same model as the request. Token entries now show the model's rates without the commission; the total charged for a request is unchanged while the daily ceiling has not been reached. If you calculate unit prices from usage entries, add the `inference.commission` entries to get the full cost.
- **Account — Model names on moderation and Agentic Tests usage.** Input moderation usage is now recorded under `@aivax/layered-moderation` and attributed to the same resources as the request, such as the API key and AI gateway. Simulated-user and judge usage of Agentic Tests is recorded under `@aivax/agentic-tests:user-<profile>` and `@aivax/agentic-tests:judge-<profile>`, such as `@aivax/agentic-tests:judge-medium`, instead of the underlying model. Remote resources fetched by a test are attributed to its run. Prices are unchanged.

## Tuesday, November 10th, 2026

Breaking changes:

- **Chat clients — New webhook URLs for messaging integrations.** Telegram, Z-API, Evolution API, and Kapso integrations now have a webhook URL that contains a key generated for each integration. Copy the new URL from the integration settings in the dashboard and update it in the provider, or use **Update hooks** for Telegram. Current URLs keep working until December 1st, 2026 and are rejected after that date. You can rotate the key at any time with **Rotate webhook key** or `POST /api/v1/web-chat-client/<id>/integrations/<name>/hook-key`; the previous URL stops working immediately. Telegram webhooks registered with the new URL also require the secret token that **Update hooks** configures. See [Chat clients](https://docs.aivax.net/docs/inference/chat-clients/integrations.md#webhook-urls).
- **Chat clients — Changing context goes back into the system instructions.** The November 9th change is reverted: the content loaded from a session's `contextLocation` and the `instructions` of `POST /api/v1/public/chat-clients/<access-key>/prompt` are again appended to the system instructions, after the session `extraContext`, instead of being sent as a user message after the last user message. `instructions` again accepts only a string or an array of strings, joined with blank lines; content parts such as images and files are no longer accepted. See [Choose where to put context](https://docs.aivax.net/docs/inference/chat-clients/managing-sessions.md#choose-where-to-put-context).
- **Chat clients — Kapso webhook signatures are verified.** When **Webhook secret key** is set on a Kapso integration, requests whose `X-Webhook-Signature` doesn't match are rejected. Leave it empty if you haven't configured a secret in Kapso. Media attachments are now downloaded only from the Kapso API.

Fixes:

- **Chat clients — Scheduled messages keep running when an account is unavailable.** Scheduled messages for other chat clients are no longer held back by a chat client whose account is disabled.
- **Chat clients — Schedule details require ownership of the chat client.** Viewing or cancelling a scheduled message or recurring task now returns an error unless the chat client belongs to your account.
- **Language models — Invalid routing presets are rejected.** Numeric values in `routing_preset` or `routing_options.preset` that don't match a routing option now return a validation error instead of a server error. A numeric model `#` suffix that doesn't match a routing option is now read as a provider tag.
- **Language models — Providers that can't fit the input are skipped.** Routing no longer picks a provider whose context window is known to be smaller than the request input.

Changes:

- **Data processing — Patches in instruction refinement.** Each item of `suggestedFixes` returned by `POST /api/v1/generations/instruction-refinement` now has a `patches` array with the fix as unified diffs against the context items sent in the request, one per changed item, so you can preview and apply a fix without rewriting it by hand. `patches` is empty when a fix needs content or facts that aren't in the request. Existing response fields are unchanged. See [Instruction Refinement](https://docs.aivax.net/docs/data-processing/instruction-refinement.md).
- **Chat clients — Longer session access keys.** New chat client sessions get longer access keys. Existing keys keep working.
- **Language models — Provider names in the model catalog.** The model catalog and the models endpoint now show each provider's public name only, without internal suffixes. Provider tags are unchanged.
- **Conversations — Moderation refusals are identified in the conversation list.** Conversations refused by AI gateway moderation now show a **Moderated** label with the violated categories in the dashboard conversation list, instead of **Error**. `GET /api/v1/conversations` returns these categories in the new `moderationCategories` field, which is `null` for conversations that moderation didn't refuse.

## Monday, November 9th, 2026

Breaking changes:

- **Chat clients — Changing context no longer goes into the system instructions.** The content loaded from a session's `contextLocation` and the `instructions` of `POST /api/v1/public/chat-clients/<access-key>/prompt` are now sent as a user message right after the last user message, instead of being appended to the system instructions. Neither is saved to the session history or returned in `createdMessages`, and changing them on each request no longer invalidates the prompt cache of the conversation. Models usually give user messages less weight than system instructions: if you used `instructions` or `contextLocation` for rules the assistant must always follow, move those rules to the session `extraContext` or the AI gateway instructions. `extraContext` is unchanged and stays in the system instructions. `instructions` now also accepts one OpenAI-compatible content part or an array of them, including images and files; strings and arrays of strings keep working, but array items are now sent as separate text parts instead of being joined with blank lines. See [Choose where to put context](https://docs.aivax.net/docs/inference/chat-clients/managing-sessions.md#choose-where-to-put-context).

Fixes:

- **Language models — Failing providers are retried and avoided.** When a provider fails before it sends the first response token, including errors reported inside a streaming response, the request is now retried on another eligible provider instead of returning `Provider returned error`. Providers that keep failing are ranked lower by every routing preference and are temporarily removed from routing when they fail repeatedly. Requests limited by `allowed_providers` to a single unavailable provider can still fail; add `"*"` as the last item to allow a fallback. See [Routing setup](https://docs.aivax.net/docs/inference/routing/setup-routing.md).
- **Dashboard — AI gateway settings show their saved values.** In the AI gateway editor, **Moderation mode** could show **Layered guardrail** even when **Self-assessment** was saved, and the **Routing preference** and **Communication protocol** pickers opened with no option selected. The editor now shows and highlights the saved option. The saved values were not changed.

Changes:

- **Chat clients — Streaming and inference options in Send Prompt.** `POST /api/v1/public/chat-clients/<access-key>/prompt` accepts `stream: true` to return server-sent events with text, reasoning and tool updates, followed by a `result` event with the usual response body. The new `inferenceOptions` object overrides `reasoningEffort`, `renderingMode` (`default` or `textual_blocks`) and `toolInvocationExplanations` for one request, and the new `tools` field adds OpenAI-compatible client-side tools that are available only for that request. Temporary provider failures that happen before any output are now retried automatically. See [Sending prompts from your application](https://docs.aivax.net/docs/inference/chat-clients/web-client.md#sending-prompts-from-your-application).
- **Data processing — Instruction refinement.** The new `POST /api/v1/generations/instruction-refinement` endpoint reviews system instructions, prompts, skills, tool descriptions and knowledge against prompt engineering guidelines from model vendors' documentation. The `micro` view reviews the wording of each item, and the `macro` view reviews how the items work together as one agent: purpose, limits of authority, where each rule lives, skill selection and configured capabilities. It returns an overall score, a summary, prioritized findings with the line and column range of the affected text and the guideline sources behind them, and suggested fixes. See [Instruction Refinement](https://docs.aivax.net/docs/data-processing/instruction-refinement.md). Requests are billed in processing units, and each context item counts as one document toward the document-processing rate limit.

## Sunday, November 8th, 2026

Changes:

- **Dashboard — Cached input share on Conversations.** The **Conversations** list has a new **Cached %** column showing how much of each conversation's input was served from the prompt cache. For conversations with more than 1K input tokens, the value is green above 95%, yellow above 90%, and shows a warning below that. A dash means no cached input was reported, which usually means the model or provider doesn't support prompt caching. `GET /api/v1/conversations` now also returns `cachedInputTokenCount`.
- **Dashboard — BYOK usage in Analytics.** **Usage per model** in **Analytics** now includes models used through AI gateways with your own provider key (BYOK). BYOK cost is an estimate based on the catalog price of the matching AIVAX model and is never charged; BYOK models with no catalog match show their tokens with no cost. The new **Effective usage** column shows the amount actually charged, and models used both ways show the AIVAX share of their tokens on hover. Past BYOK usage is estimated from stored conversations, so it only covers conversations that were kept. Balance, period spend, invoices, and monthly reports are unchanged.

## Saturday, November 7th, 2026

Changes:

- **Language models — Higher prices on Grand Anak routes.** Requests served by the `grand-anak-<route>` special providers now cost twice the previous token rates for input, cached input, and output. Other providers are not affected. Check current rates in `GET /api/v1/information/models.json`, and remove these tags from `allowed_providers` or use the `Balanced` preference to keep requests off special providers. See [Special providers](https://docs.aivax.net/docs/inference/routing/special-providers.md).

## Friday, November 6th, 2026

Breaking changes:

- **Account — Lower Pro and Max limits.** Pro and Max now have lower rate limits, storage, retention, and daily allowances. Max has fixed limits where it previously had none, a 10 GB storage quota with excess at $0.30/GB/month, 14-day conversation retention, and a 1.02x inference commission multiplier. Pro integrated model requests are 150/min and Pro search history is kept for 3 days. Review the new values in [Plans and limits](https://docs.aivax.net/docs/limits.md) and pace requests that could now return `429 Too Many Requests`.
- **Language models — Special provider routes renamed.** Each special provider route now has its own name and routing tag, such as `Grand Anak (Cyan Route)` with the tag `grand-anak-cyan`. The previous tags `grand-anak`, `grand-anak-flex`, and `grand-anak-route-<n>` no longer match any provider. If `allowed_providers`, an AI gateway's **Allowed providers**, or a `#tag` model suffix lists one of them, replace it with a current tag from `GET /api/v1/information/models.json`. See [Special providers](https://docs.aivax.net/docs/inference/routing/special-providers.md).

Fixes:

- **RAG — Collection tags update immediately.** The tags returned in collection details now reflect added, edited, and deleted documents right after the change, instead of possibly showing an earlier list for a few minutes.

Changes:

- **Models — LFM3-1.7B and DeepSeek V4.1 Flash 1017 abliterated.** Adds `@liquid/lfm-3-1.7b`, a compact reasoning model with tool calling and structured output, and `@deepseek/deepseek-v4.1-flash-1017-abliterated`, an uncensored variant of DeepSeek V4.1 Flash 1017 with tool calling and image input.
- **Dashboard — Avi Assistant conversations are not stored.** Conversations with the Avi Assistant in the dashboard no longer appear on the **Conversations** page. Usage and billing records are still created.
- **Account — Ultimate plan.** A new Ultimate plan is available at $199 per month. It keeps the limits previously offered by Max: no plan limit on integrated model requests, BYOK requests, or new Agentic Test runs, 20 GB of storage, 30-day retention, a 1.00x inference commission multiplier, and dedicated support. `GET /api/v1/information/plans.json` now also returns Ultimate. See [Plans and limits](https://docs.aivax.net/docs/limits.md) and [subscription pricing](https://aivax.net/pricing).
- **Docs — Plan limits on one page.** Every per-plan limit, including RAG, data processing, speech, built-in tools, Batch, and Agentic Tests, is now listed in [Plans and limits](https://docs.aivax.net/docs/limits.md#product-limits). Product pages link to it instead of repeating the values. The page also gives approximate PU and token sizes for common content, such as scanned PDFs, web pages, and RAG queries; see [Estimating PUs and tokens](https://docs.aivax.net/docs/limits.md#estimating-pus-and-tokens).
- **Dashboard — Plan comparison with Ultimate.** The **Plan** page in **My account** compares Free, Pro, Max, and Ultimate side by side, with list prices loaded from the public plan list.
- **Dashboard — Faster switching between saved accounts.** Switching to a saved account reuses its active console session when it is still valid, so the console no longer signs in again or asks for a two-factor code in that case. When the session has expired, the regular sign-in runs.
- **Docs — Inference pipeline pages.** The Inference section has new pages for [Processing pipeline](https://docs.aivax.net/docs/inference/chat-completions/processing-pipeline.md), with the order in which gateway steps run and how they affect each other, [Moderation](https://docs.aivax.net/docs/inference/chat-completions/moderation.md), [Context truncation](https://docs.aivax.net/docs/inference/chat-completions/context-truncation.md), and [Function interpreter](https://docs.aivax.net/docs/inference/chat-completions/function-interpreter.md). The previous standalone Processing pipeline page now redirects to the new one. The function interpreter (`knownToolHandlerName`) is now documented as deprecated; use a model with native tool calling instead.
- **Dashboard — Warning before discarding unsaved edits.** Editors for AI gateways, chat clients and their integrations, skills, Agentic Tests, Batch workflows, documents, and collection settings now ask for confirmation before you leave the page with unsaved changes, including through the browser back button, a reload, or closing the tab. The same applies when a dialog with a text or code field has been edited and is still open. Saving the page, or confirming or closing the dialog, clears the warning.
- **Dashboard — Clearer two-factor code fields.** The six code fields in the two-factor dialog are larger, show a placeholder dot in each empty field, highlight filled fields, and are centered in the dialog. The code is submitted as soon as all six digits are typed or pasted, and pressing Enter also confirms it.
- **Dashboard — Budget model for AI-assisted edits.** The panel for editing content with AI now preselects `@model-router/openai:budget`, and the panel is wider so all of its options fit. You can still choose another model before requesting the edit.

## Wednesday, November 4th, 2026

Breaking changes:

- **Inference — Chat completion IDs use the `aivx_` format.** In `/v1/chat/completions`, the response `id` and the `id` of every streamed chunk, including tool and error chunks, are now the assistant message ID in the `aivx_` format, instead of a UUID or a `chatcmpl-` value. Every chunk of a response shares the same ID. Tool call IDs are also longer. Update clients that validate the `chatcmpl-` prefix or expect a different ID per chunk.

Fixes:

- **Conversations — Conversation tokens are scoped to the account.** Two accounts that sent the same `idempotency_key` or `conversation_token` could update the same stored conversation record. Each account now keeps its own record for the same token. No action is required.

Changes:

- **Inference — Session reuse with `conversation_token`.** `/v1/chat/completions` accepts `conversation_token`. When the same token is sent in every request of a conversation, AIVAX restores the calls and results of server-side tools from earlier turns before the model runs, including turns that ended with a text-only answer. Responses return `conversation_token` at the root (in the last chunk when streaming) and the assistant message ID in `id` and `choices[].message.id` (in every chunk `id` when streaming). When no token is sent, AIVAX generates and returns one. `idempotency_key` remains a deprecated alias; sending both with different values returns `400 Bad Request`. See [Session reuse](https://docs.aivax.net/docs/inference/chat-completions/session-reuse.md).
- **Dashboard — Usage per model and per provider in Analytics.** On the **Analytics** page, the **Usage per model** table now shows one row per model with **Input tokens**, **Cached tokens**, **Output tokens** and **Total usage**, instead of one row per SKU. A new **Usage per provider** tab shows each provider with its top model by cost, token volume and total usage.
- **Generations — Inline reference images.** `POST /api/v1/generations/images` accepts `data:` URIs in `referenceImages` — `image/png`, `image/jpeg`, `image/webp` or `image/gif` with base64 data, up to 8 MB each — alongside HTTP(S) URLs. Invalid data URIs return `400 Bad Request`. See [Image generation](https://docs.aivax.net/docs/generations/images.md).

## Tuesday, November 3rd, 2026

Breaking changes:

- **Models — `is_deprecated` now means old or deprecated.** In `GET /v1/models` and `GET /api/v1/models`, `_details.provider_model.is_deprecated` was inverted: models released in the last 12 months were reported as deprecated, and older models were reported as current. It is now `true` only when the model is flagged as deprecated or its release date is more than 12 months before the current day. Models with no release date are not marked deprecated by age. Clients that hid or selected models from the previous value should invert that check. See [Deprecated models](https://docs.aivax.net/docs/inference/routing/setup-routing.md#deprecated-models).

Fixes:

- **API — Malformed resource identifiers return 400.** A path identifier that cannot be read, such as an incomplete ID on an AI Gateway or another resource route, now returns `400 Bad Request` instead of `500 Internal Server Error`. Treat that response as an invalid request and do not retry it as a server failure. See [Troubleshoot requests](https://docs.aivax.net/docs/inference/chat-completions/troubleshooting.md).
- **API — Browser clients can read request and cost headers.** Cross-origin responses now expose `X-Request-ID` and `Consumed-Credits`, so browser JavaScript can read the request identifier and the request cost when those headers are present. See [Request cost header](https://docs.aivax.net/docs/pricing.md#request-cost-header).
- **RAG — Indexing no longer fails when long documents are embedded together.** Indexing a collection no longer fails only because several long documents were embedded in one request. Split very large documents before import when you need precise retrieval; see [Document size](https://docs.aivax.net/docs/rag/documents.md#document-size).
- **Dashboard — OAuth authorization page no longer stuck loading.** When an application sends you to the console to request access, the page now shows the application name, the reason, the requested permissions and the **Authorize** and **Deny** buttons, instead of staying on "Loading the authorization request...". Invalid or expired requests show their error message again. See [OAuth](https://docs.aivax.net/docs/oauth.md).
- **Dashboard — Two-factor code prompt no longer stuck loading.** When signing in or switching to a saved account with two-factor authentication, the authentication code dialog shows the code fields instead of staying on "Getting things ready...".
- **RAG — JSONL imports with `insert-mode=sync` no longer time out in large collections.** After `END`, the **Index Documents (JSONL WebSocket)** endpoint could fail with an execution time error while removing documents absent from the stream, leaving those documents in the collection. Sync imports now finish in large collections, and imports with many lines complete faster. The multipart **Index Documents (JSONL)** endpoint also benefits for sync removals. A document changed by another request while a sync import is running is no longer removed by that import. If a previous sync import failed this way, send it again: unchanged documents are skipped and only the removal runs. Error messages now report the exact line that failed.

Changes:

- **Account — Pro and Max list prices.** The public Pro subscription is $19 per month, down from $39. Max is $99 per month, down from $399. These are list prices, not a negotiated account price. See [subscription pricing](https://aivax.net/pricing) and [Plan list prices](https://docs.aivax.net/docs/pricing.md#plan-list-prices).
- **Account — Public plan list prices.** `GET /api/v1/information/plans.json` returns the Free, Pro, and Max list prices without authentication. Each entry has `plan` and `monthlyPrice` in USD. Free is `0`. It does not return negotiated prices. See [Plan list prices](https://docs.aivax.net/docs/pricing.md#plan-list-prices).
- **Models — GLM-5.3-FlashX-Legal and Particle 1.** Adds `@z-ai/glm-5.3-flashx-legal` and `@particle-ai/particle-1` as selectable text models, billed per provider at published token rates. Existing account and plan adjustments still apply. Existing model identifiers remain unchanged.
- **RAG — Document text counts as UTF-8 bytes.** Text stored in a collection now counts toward the storage quota as UTF-8 bytes. Text that uses only basic Latin characters is unchanged. Text with accents or other non-Latin characters can use more of the quota than it did before. Other stored data is counted as before. See [Account limits](https://docs.aivax.net/docs/limits.md#account-limits).
- **Analytics — Printable monthly usage statement.** The **Monthly Reports** tab now produces a compact black-and-white document designed for printing and PDF export, showing the account name. Totals appear as a statement with a short description of each charge: **Inference**, **RAG** and **Services**, adding up to **Total billed**. The **Models used** table now lists input tokens, cached tokens, the cached share of the input, and output tokens for each model. Select **Include BRL values** to add a Brazilian real column beside each US dollar amount, converted at the exchange rate when the report is generated. Amounts in the report are shown with two decimal places. Through the API, `GET /api/v1/information/usage/monthly-report` returns the new `accountName` and `usdBrlRate` fields and per-model `inputTokens`, `cachedTokens` and `outputTokens`, and accepts `includeBrl=true`.
- **Dashboard — Simpler OAuth authorization page.** When an application requests access to your account, the console now shows a single centered card with the application name, the reason, the list of what it will be able to do, the access duration, and the **Authorize** and **Deny** buttons. The signed-in account is shown below the card, with a **Switch account** link that returns to the same request after signing in. See [OAuth](https://docs.aivax.net/docs/oauth.md).
- **Account — Step-by-step authenticator setup.** Adding an authenticator in the **Security** tab's two-factor authentication dialog now goes through separate steps. The first step shows the QR code and the secret in **QR code** and **Secret** tabs, with the reminder to save the secret. **Continue** opens the name and six-digit code fields. When the account already has an authenticator, a following step asks for a code from a current one. A confirmation step ends the setup. Invalid codes are shown inside the dialog, and **Back** returns to the previous step without clearing what was typed.
