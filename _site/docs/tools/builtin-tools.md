Source: https://docs.aivax.net/docs/tools/builtin-tools.html

# Built-in Tools

Built-in tools are capabilities maintained by AIVAX, such as web search, URL reading, code execution, memory, and file generation, that you can enable for a model without writing your own callback. You can combine them with your own [protocol functions](https://docs.aivax.net/docs/tools/protocol-functions.md) and [MCP](https://docs.aivax.net/docs/tools/mcp.md) tools.

Some tools have usage charges. See [Pricing and limits](#pricing-and-limits) before enabling them in a production workflow.

The model decides which tool to call and which arguments to send. Not every model follows tool-call rules reliably.

## How to Choose and Combine Tools

Built-in tools should be enabled as work capabilities, not as agent decoration. Each tool adds a decision to the model: it needs to perceive that the tool exists, understand when to use it, assemble valid arguments, wait for the result, and continue the response. The more similar tools are available at the same time, the higher the chance of redundant use or poor choice. Start with the smallest set that solves the use case and write clear instructions on when to use each.

Pick each tool by the kind of need it covers:

- `WebSearch`: the answer depends on public, recent, or changing information.
- `OpenUrl`: the user already provided a URL and wants the assistant to analyze that specific content.
- `Code`: calculations, data transformations, and small algorithmic tasks.
- `Request`: the model must call an HTTP API with a specific method, headers, or body.
- `Remember`: only in chat clients or calls with an identifiable user, because memory tools store and retrieve persistent information for that user.
- `AdvancedWebUsage`: disabled; it returns an unavailable response. See [Changelogs](https://docs.aivax.net/docs/legal/changelogs.md).

Treat generation tools (image, document, and web page) as output actions. They do more than improve an answer: they create artifacts that are hosted or attached to the conversation. Tell the model when to generate an artifact and when to reply in text. In support, for example, a document fits a quote, proposal, or formal summary; a web page fits a visual report; an image fits creative ideation. When the user only asks for an explanation, plain text is usually enough.

You can enable tools in two places:

- **In the request**, through `builtin_tools`. The calling application chooses the list for each inference. Use this for testing, internal routines, and flows where the application truly needs to choose tools dynamically.
- **In the [AI Gateway](https://docs.aivax.net/docs/inference/ai-gateway.md)**. The list is centralized and can be combined with skills, workers, MCP, protocol functions, and shell. Prefer the gateway for permanent production policies, because it prevents different clients from enabling different tools without control.

The values in `builtin_tools.tools` are configuration flags such as `WebSearch`, `Code`, and `OpenUrl`. The model sees runtime function names such as `web_search`, `evaluate_code`, and `open_url`. Use runtime function names when configuring skill tool allowlists or shell tool allowlists.

## Current Date and Time

Enable `DateTime` to expose `get_date_time`. This tool takes no arguments and reads the current time when it is called. It returns the date, time, day of the week, time zone, UTC offset, and an ISO 8601 timestamp.

The tool reports the gateway time zone, set in the gateway's `parameters.timeZone` with an IANA identifier. The default is `America/Sao_Paulo`, and daylight-saving changes are applied automatically. In the dashboard, edit **Time zone** under **Date and time** in the gateway's **Parameters + Tuning** tab. The same zone is used by scheduling tools and by the Bash tool, so every date the model reads or writes uses one time zone. The browser or user-context time zone does not change it.

To use another zone for a single request to `/v1/chat/completions`, send `time_zone`, such as `"time_zone": "Asia/Tokyo"`. Invalid identifiers are rejected. Batch workflows use the time zone of the AI Gateway they run on, or `America/Sao_Paulo` when they name a model directly.

Activation via `builtin_tools`:

```json
{
    "tools": ["DateTime"]
}
```

For a saved gateway, include `DateTime` in `parameters.sentinelOptions.enabledFunctions`. For a Batch workflow, use `enabledTools.enabledFunctions`.

Example tool result (illustrative, not a live reading):

```json
{
    "date": "2026-07-15",
    "time": "09:30:00",
    "day_of_week": "Wednesday",
    "time_zone": "America/Los_Angeles",
    "utc_offset": "-07:00",
    "date_time": "2026-07-15T09:30:00-07:00"
}
```

The date uses `yyyy-MM-dd`, time uses 24-hour `HH:mm:ss`, and weekday names are returned in English. All fields describe the same instant.

## Internet Search

Enable `WebSearch` to let the model search the internet for specific or real-time information, such as weather, news, or game results.

AIVAX runs searches through a mix of providers, chosen by network availability and latency.

You can choose between two search modes in the dashboard:

- **Full**: inserts the entire content of each result into the conversation context.
- **Summarized**: inserts an AI-generated summary of the results, produced by the search provider.

`Full` can give more precise results but may consume more input tokens. See [Pricing and limits](#pricing-and-limits) before enabling internet search in production.

> [!NOTE]
>
> The `Full` mode is not always available.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "WebSearch"
    ],
    "options": {
        "web_search_max_results": 10,
        "web_search_mode": "full"
    }
}
```

## Advanced Internet Search

`AdvancedWebUsage` is disabled and returns an unavailable response. See [Changelogs](https://docs.aivax.net/docs/legal/changelogs.md) for details.

## Code Execution

Enable `Code` to let the model run JavaScript and inspect the result. Use it for mathematical expressions and other problems that are easier to solve with code than with text.

The code runs in a protected JavaScript environment. It is intended for calculations and small transformations, not for file I/O, network access, or importing external scripts.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "Code"
    ],
    "options": {
    }
}
```

## URL Context

Enable `OpenUrl` to let the model read the content of URLs and links provided by the user.

The tool sends a simple `GET` request to the destination; it does not crawl. Some sites may identify the access as a bot and block it.

AIVAX handles the returned content by type:

- **HTML**: tags, scripts, CSS, and other noise are removed, keeping only the page's plain text.
- **Other text**: the content is read as is.
- **Non-text content**: when the response indicates a filename (in the path or the `Content-Disposition` header), AIVAX tries to convert the downloaded file to text.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "OpenUrl"
    ],
    "options": {
    }
}
```

## Memory

Enable `Remember` when the assistant needs to save information across conversations and retrieve it when relevant. It exposes exactly two tools: `memory_save` and `memory_search`.

Both tools require an identified user: set a stable `tag` in a [chat client](https://docs.aivax.net/docs/inference/chat-clients.md), or `$.user` in a chat/completions request. Without that identifier, the tools return an error. Memory searches are automatically restricted to the current user. Each memory records the gateway that saved it, and `parameters.builtinFunctionsOptions.allowSharedMemory` controls visibility:

| `allowSharedMemory` | Behavior |
| --- | --- |
| `true` (default) | The gateway reads, replaces, and deletes the user's memories saved by any gateway in the account. |
| `false` | The gateway only reads, replaces, and deletes the user's memories that it saved itself. |

In the dashboard, this is the **Memory visibility** option in the gateway's tool settings. Memories saved outside a saved gateway, and memories migrated from the earlier memory tools, have no gateway and are visible only to gateways with shared memory.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "Remember"
    ]
}
```

Memories are **not automatically added to system instructions**. Tell the model when to call `memory_search`, such as before answering a question about a saved preference. The removed `include_all_memory_context` option, including its `IncludeAllMemoryContext` spelling, is ignored if sent.

### Save, Replace, or Delete a Memory

`memory_save(id?, content?, expiresInDays?)` combines creation, replacement, and deletion. `id` is the memory's ID; `content` is the text to save, limited to 10 KB per saved memory; `expiresInDays` is an optional whole number of days, from 1 to 365, after which the memory is deleted automatically.

| Arguments | Result |
| --- | --- |
| `content`, with `id` omitted or `null` | Creates a memory and returns its ID. Without `expiresInDays`, it never expires. |
| `id` and `content` | Replaces that memory's content. Without `expiresInDays`, the current expiration is kept. |
| `id` and `expiresInDays`, with `content` omitted or `null` | Changes only that memory's expiration, counted from now. |
| Only `id` | Deletes that memory. |
| `id` and `content` both omitted or `null` | Returns an error. |

Only memories belonging to the current user can be replaced or deleted. The former `memory_update`, `memory_remove`, and `memory_clear` tools are no longer available; update instructions and tool-call handling to use `memory_save` for individual changes.

### Search Memories

`memory_search(query?, filter?)` requires **exactly one** argument: `query` or `filter`. Sending both, or neither, returns an error.

| Argument | Behavior |
| --- | --- |
| `query` | A text query for semantic search over the current user's memories, reranked with `rrf` (Reciprocal Rank Fusion). Returns up to 10 results. |
| `filter` | A string using [AIVAX document filter syntax](https://docs.aivax.net/docs/rag/document-filters.md). Returns up to 10 matching memories, newest first, without generating query embeddings. |

Each result contains `id`, `content`, `createdAt`, `updatedAt`, and `expiresAt` (`null` when the memory never expires). Expired memories are never returned. Use `query` to find meaning; use `filter` for exact text, metadata, or creation and update dates:

| Goal | `filter` |
| --- | --- |
| Created in the last 7 days | `createdAt >= now-7d` |
| Changed in the last 24 hours | `updatedAt >= now-24h` |
| Created in October 2026 | `createdAt >= "2026-10-01" and createdAt < "2026-11-01"` |
| Not updated for 90 days, for example stale candidates to review | `updatedAt < now-90d` |
| Mentions a birthday and was created in the last 30 days | `content contains "birthday" and createdAt >= now-30d` |
| Saved in a specific conversation | `metadata.conversation_token = "<conversation token>"` |

Dates and timestamps without an offset use the server reference time zone described in [Document filters — Dates](https://docs.aivax.net/docs/rag/document-filters.md#dates). A memory's creation or update date is not the date of an event mentioned in its text.

### Storage and Management

Memories are documents in the `@memories` RAG collection in your AIVAX account. The collection is created automatically on the first save. Each document's content is the memory text, and its metadata identifies the user and originating conversation:

```json
{
    "external_user_id": "<user tag>",
    "conversation_token": "<conversation token>",
    "gateway_id": "<gateway ID>",
    "expires_at": 1791580376
}
```

When no conversation token is available, `conversation_token` is JSON `null`, not a string. `gateway_id` is the ID of the gateway that saved the memory, or `null` when it was not saved by a saved gateway. `expires_at` is a Unix timestamp in seconds, or `null` when the memory never expires. Newly saved or updated memories become searchable after indexing completes, usually within a few seconds.

Memories saved with `expiresInDays` are deleted in a periodic cleanup after they expire; until then they are hidden from `memory_search`. Memories without an expiration are kept until deleted. When managing the collection directly, set or remove `metadata.expires_at` to control expiration. Inspect and manage them in the dashboard's Collections and Documents pages or through the [Collections and Documents APIs](https://docs.aivax.net/docs/rag/collections.md). The dedicated Memories API and dashboard Memories page are removed. **Deleting the `@memories` collection erases every user's memories in the account**; the collection is recreated on the next save.

The automatic user restriction applies to the memory tools. When managing the collection directly, use `metadata.external_user_id` to select the intended user's records and preserve the user metadata.

### Billing, Limits, and Errors

Saving or replacing memory content indexes it like any collection document, with document-embedding charges. A `query` search is billed as a RAG query embedding. A `filter` search has no embedding cost, and the `rrf` reranker has no reranking cost. Memory has no separate tool charge; see [Pricing and limits](#pricing-and-limits).

Both memory tools use the account's [RAG rate limits](https://docs.aivax.net/docs/rag/collections.md#pricing-and-limits). If the account has no balance or reaches a rate limit, the tool returns an error to the model. Instruct the model to report the failure rather than claim it saved or recalled information. For a recent save that is not yet found, allow indexing to finish before searching again.

### Migration from Earlier Memory and Calendar Tools

Existing non-expired memories were moved to each account's `@memories` collection, preserving their original IDs, user identifiers in `external_user_id`, creation dates, and expiration dates in `expires_at`. Migrated records have `conversation_token: null`. They are re-indexed, which is billed as document embedding.

The `Calendar` built-in tool and its appointment tools were removed from the API and dashboard. Existing gateways and Batch workflows have the flag removed automatically, but requests that still include `Calendar` in `builtin_tools.tools` fail: remove it from your requests. Non-expired calendar reminders were migrated to text memories in the form `Reminder at <date> (<n> minutes): <description>`. These are stored text, not scheduled reminders or a replacement calendar service.

The former Memories API, including list, get, delete, and migration prompt generation, is no longer available. Move application-level memory management to the Collections and Documents APIs. Update gateway instructions to search explicitly. Gateways with private memory do not see migrated memories, because migrated records have no `gateway_id`. The former `retentionDays` argument is now `expiresInDays`; omitting it creates a memory that never expires, where the old default was 30 days.

For application-level controls around memory writes, deletion policies, and review, see [How to protect LLM agent memory from poisoning](https://aivax.net/blog/persistent-memory-is-a-write-path/).

## Image Generation

Enable `ImageGeneration` to let the model create images. The available image generation models are listed in the AIVAX console.

Generated images are attached to the conversation context, but the assistant cannot see them directly. They are stored on AIVAX servers for a few months before being permanently removed.

Image generation can incur usage charges. See [Pricing and limits](#pricing-and-limits) before enabling it in production.

You can also allow explicit and adult images with `image_generation_allow_mature_content`. When this feature is enabled, the model will be allowed to generate adult material. For this to happen, the model must also “agree” to generate such content. Some models have a lower security filter than others. For example, Gemini models have the lowest security filter, making them a viable option for role‐play and generating such material.

You are always responsible for the [material you generate](https://docs.aivax.net/docs/legal/terms-of-service.md), and it must comply with our terms of service.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "ImageGeneration"
    ],
    "options": {
        "image_generation_model_name": "grok-imagine",
        "image_generation_allow_reference_usage": true,
        "image_generation_quality": "high",
        "image_generation_max_results": 2,
        "image_generation_allow_mature_content": false
    }
}
```

## X Posts Search

Enable `XPostsSearch` to let the model search posts on X (formerly Twitter) and read a specific post when it has the post ID.

It is a direct alternative to [internet search](#internet-search) (`web_search`) for real-time information, such as news or game results, and returns much more recent results. Avoid enabling both tools together, because they serve the same purpose.

This function can incur usage charges. See [Pricing and limits](#pricing-and-limits) before enabling it in production.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "XPostsSearch"
    ],
    "options": {
    }
}
```

## Document Generation

Enable `GenerateDocument` to let the model create PDFs from HTML.

AIVAX hosts the created files and the assistant shares them in the conversation. They are kept for a few months before being permanently deleted.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "GenerateDocument"
    ],
    "options": {
    }
}
```

## Web Page Generation

Enable `GenerateWebPage` to let the model host HTML pages on AIVAX servers, such as reports, landing pages, and infographics.

The pages are kept for a few months before being permanently deleted.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "GenerateWebPage"
    ],
    "options": {
    }
}
```

## Advanced Request

Enable `Request` to give the model a full HTTP request tool. The model can set the method, headers, form fields, and body of each request.

Text responses are read up to the platform content limit. Binary responses are not expanded into the context; the tool returns a short binary-content marker with the content type and size when available.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "Request"
    ],
    "options": {
    }
}
```

## Pricing and limits

Web and X searches are billed per search. The [plan multiplier](https://docs.aivax.net/docs/pricing.md#plan-multipliers) applies to token-based charges. Model inference used to invoke a tool is still billed at its regular rate. Image generation is billed at the selected model's rates; see [Image generation](https://docs.aivax.net/docs/generations/images.md).

| Description | Pricing |
| --- | ---: |
| Web search | **$5/1k searches** |
| X (Twitter) search | **$5/1k searches** |
| [Memory](#memory) | Saving or replacing content: document embedding; semantic `query` search: RAG query embedding; `filter` search: no embedding cost; `rrf` reranking: no cost |
| Advanced requests | No separate charge |
| Document generation | No separate charge |
| Web page generation | No separate charge |

An em dash (`—`) means the plan does not impose a limit, and `Not available` means the tool is unavailable on the plan.

| Limit | Free | Pro | Max |
| --- | --- | --- | --- |
| Web search | 15/day | 1,000/day | 10,000/day |
| X/Twitter search | Not available | 1,000/day | 10,000/day |
| Document and web page generation | 5/day | 1,000/day | 50,000/day |
| Image generation and editing | 5/day | 500/day | 5,000/day |
| General service actions | 30/day | 5,000/day | 100,000/day |
| [Bash commands](https://docs.aivax.net/docs/tools/shell.md#pricing-and-limits) | 300/hour | 30,000/hour | — |

General service actions share one daily service-action quota. Each memory's content is limited to 10 KB.

## Tool Diagnosis

Use these checks when a tool is not called, is called too often, or fails.

### The tool is not called

1. Confirm that the tool is enabled in the gateway or in the request's `builtin_tools` field.
2. Check whether the selected model supports function calls, or whether a tool handler is configured for models without native support.
3. Review the instructions. If they do not say when to search, open a URL, generate an image, or query memory, the model may answer only from its own knowledge.
4. Test a direct question that clearly requires the tool, such as asking for a recent news article for `WebSearch` or asking to open a specific URL for `OpenUrl`.

### The tool is called too often

Reduce ambiguity. Tools like `WebSearch`, `AdvancedWebUsage`, and `XPostsSearch` compete for recent information; `OpenUrl` and `Request` can seem similar when the user sends a link. For `Remember`, distinguish a request to save information from a question that requires retrieving an existing memory. Remove unnecessary tools, make gateway instruction descriptions more restrictive, and, when possible, use [workers](https://docs.aivax.net/docs/inference/workers.md) to block or replace calls in specific scenarios.

### The tool fails

Treat tool failures as a normal part of the experience. Searches may return little content, URLs may block bots, APIs may deny authorization, image generation may refuse content, and code execution may receive ambiguous input. Instruct the model to explain the limitation objectively and offer the next step, such as requesting another link, trying a more specific query, asking for authorization, or responding based only on the available context. Do not rely on an external tool as the sole way to conclude a critical conversation without an experience fallback.
