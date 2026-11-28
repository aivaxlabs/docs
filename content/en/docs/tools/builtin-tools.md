---
{title: Built-in Tools,linkTitle: Built-in tools,weight: 10,group: Tools,aliases: [/docs/platform/memories.html]}
---

# Built-in Tools

Built-in tools are capabilities maintained by AIVAX, such as web search, URL reading, code execution, memory, and file generation, that you can enable for a model without writing your own callback. You can combine them with your own [protocol functions](/docs/tools/protocol-functions) and [MCP](/docs/tools/mcp) tools.

Some tools have usage charges. See [Pricing and limits](#pricing-and-limits) before enabling them in a production workflow.

The model decides which tool to call and which arguments to send.

## How to Choose and Combine Tools

Enable only the tools your use case needs. Each tool adds a decision for the model, and similar tools enabled together can lead to redundant or poor choices. Start with the smallest set that solves the use case and write clear instructions on when to use each.

Pick each tool by the kind of need it covers:

- `WebSearch`: the answer depends on public, recent, or changing information.
- `OpenUrl`: the user already provided a URL and wants the assistant to analyze that specific content.
- `Code`: calculations, data transformations, and small algorithmic tasks.
- `Request`: the model must call an HTTP API with a specific method, headers, or body.
- `Remember`: only in chat clients or calls with an identifiable user, because memory tools store and retrieve persistent information for that user.

Treat generation tools (image, document, and web page) as output actions. They do more than improve an answer: they create artifacts that are hosted or attached to the conversation. Tell the model when to generate an artifact and when to reply in text. In support, for example, a document fits a quote, proposal, or formal summary; a web page fits a visual report; an image fits creative ideation. When the user only asks for an explanation, plain text is usually enough.

You can enable tools in two places:

- **In the request**, through `builtin_tools`. The calling application chooses the list for each inference. Use this for testing, internal routines, and flows where the application truly needs to choose tools dynamically.
- **In the [AI Gateway](/docs/inference/ai-gateways/concepts.md)**. The list is centralized and can be combined with skills, workers, MCP, protocol functions, and shell. Prefer the gateway for permanent production policies, because it prevents different clients from enabling different tools without control.

The values in `builtin_tools.tools` are configuration flags such as `WebSearch`, `Code`, and `OpenUrl`. The model sees runtime function names such as `web_search`, `evaluate_code`, and `open_url`. Use runtime function names when configuring skill tool allowlists or shell tool allowlists.

## Current Date and Time

Enable `DateTime` to expose `get_date_time`. This tool takes no arguments and reads the current time when it is called. It returns the date, time, day of the week, time zone, UTC offset, and an ISO 8601 timestamp.

The tool reports the gateway time zone, set in the gateway's `parameters.timeZone` with an IANA identifier. The default is `America/Sao_Paulo`. In the dashboard, edit **Time zone** under **Date and time** in the gateway's **Parameters + Tuning** tab. Scheduling tools and the Bash tool use the same zone.

To use another zone for a single request to `/v1/chat/completions`, send `time_zone`, such as `"time_zone": "Asia/Tokyo"`. Batch workflows use the time zone of the AI Gateway they run on, or `America/Sao_Paulo` when they name a model directly.

Activation via `builtin_tools`:

```json
{
    "tools": ["DateTime"]
}
```

For a saved gateway, include `DateTime` in `parameters.sentinelOptions.enabledFunctions`. For a Batch workflow, use `enabledTools.enabledFunctions`.

Example tool result:

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

The date uses `yyyy-MM-dd`, time uses 24-hour `HH:mm:ss`, and weekday names are returned in English.

## Internet Search

Enable `WebSearch` to let the model search the internet for specific or real-time information, such as weather, news, or game results.

You can choose between two search modes in the dashboard:

- **Full**: inserts the entire content of each result into the conversation context.
- **Summarized**: inserts an AI-generated summary of the results.

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

The tool sends a simple `GET` request to the destination; it does not crawl. Some sites block automated access.

HTML pages are reduced to their plain text, other text is read as is, and files such as documents are converted to text when possible.

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

Both tools require an identified user: set a stable `tag` in a [chat client](/docs/inference/chat-clients/managing-sessions.md#identify-users-with-a-tag), or `$.user` in a chat/completions request. Without that identifier, the tools return an error. Memory searches are automatically restricted to the current user. Each memory records the gateway that saved it, and `parameters.builtinFunctionsOptions.allowSharedMemory` controls visibility:

| `allowSharedMemory` | Behavior |
| --- | --- |
| `true` (default) | The gateway reads, replaces, and deletes the user's memories saved by any gateway in the account. |
| `false` | The gateway only reads, replaces, and deletes the user's memories that it saved itself. |

In the dashboard, this is the **Memory visibility** option in the gateway's tool settings. Memories saved outside a saved gateway are visible only to gateways with shared memory.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "Remember"
    ]
}
```

Memories are **not automatically added to system instructions**. Tell the model when to call `memory_search`, such as before answering a question about a saved preference.

### Save, Replace, or Delete a Memory

`memory_save(id?, content?, expiresInDays?)` combines creation, replacement, and deletion. `id` is the memory's ID; `content` is the text to save, within the memory size limit in [Pricing and limits](#pricing-and-limits); `expiresInDays` is an optional whole number of days, from 1 to 365, after which the memory is deleted automatically.

| Arguments | Result |
| --- | --- |
| `content`, with `id` omitted or `null` | Creates a memory and returns its ID. Without `expiresInDays`, it never expires. |
| `id` and `content` | Replaces that memory's content. Without `expiresInDays`, the current expiration is kept. |
| `id` and `expiresInDays`, with `content` omitted or `null` | Changes only that memory's expiration, counted from now. |
| Only `id` | Deletes that memory. |
| `id` and `content` both omitted or `null` | Returns an error. |

Only memories belonging to the current user can be replaced or deleted. The former `memory_update`, `memory_remove`, and `memory_clear` tools are no longer available; use `memory_save` instead.

### Search Memories

`memory_search(query?, filter?)` requires **exactly one** argument: `query` or `filter`. Sending both, or neither, returns an error.

| Argument | Behavior |
| --- | --- |
| `query` | A text query for semantic search over the current user's memories. Returns up to 10 results. |
| `filter` | A string using [AIVAX document filter syntax](/docs/rag/document-filters). Returns up to 10 matching memories, newest first. |

Each result contains `id`, `content`, `createdAt`, `updatedAt`, and `expiresAt` (`null` when the memory never expires). Expired memories are never returned. Use `query` to find meaning; use `filter` for exact text, metadata, or creation and update dates:

| Goal | `filter` |
| --- | --- |
| Created in the last 7 days | `createdAt >= now-7d` |
| Changed in the last 24 hours | `updatedAt >= now-24h` |
| Created in October 2026 | `createdAt >= "2026-10-01" and createdAt < "2026-11-01"` |
| Not updated for 90 days, for example stale candidates to review | `updatedAt < now-90d` |
| Mentions a birthday and was created in the last 30 days | `content contains "birthday" and createdAt >= now-30d` |
| Saved in a specific conversation | `metadata.conversation_token = "<conversation token>"` |

For how dates without an offset are interpreted, see [Document filters — Dates](/docs/rag/document-filters#dates).

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

`gateway_id` is `null` when the memory was not saved by a saved gateway, and `expires_at` is a Unix timestamp in seconds, or `null` when the memory never expires. New or updated memories become searchable within a few seconds.

Expired memories are hidden from `memory_search` and removed automatically. Memories without an expiration are kept until deleted. Inspect and manage memories in the dashboard's Collections and Documents pages or through the [Collections and Documents APIs](../rag/collections.md). **Deleting the `@memories` collection erases every user's memories in the account**; the collection is recreated on the next save.

The automatic user restriction applies only to the memory tools. When managing the collection directly, use `metadata.external_user_id` to select the intended user's records and preserve the user metadata.

### Billing, Limits, and Errors

Memory has no separate tool charge; see [Pricing and limits](#pricing-and-limits). Both memory tools use the account's [RAG rate limits](../rag/collections.md#pricing-and-limits). If the account has no balance or reaches a rate limit, the tool returns an error to the model. Instruct the model to report the failure rather than claim it saved or recalled information.

### Migration from Earlier Memory and Calendar Tools

Existing non-expired memories were moved to each account's `@memories` collection, keeping their IDs, user identifiers, creation dates, and expiration dates. Gateways with private memory do not see them, because migrated memories belong to no gateway.

The `Calendar` built-in tool was removed. Requests that still include `Calendar` in `builtin_tools.tools` fail: remove it from your requests. Existing calendar reminders were migrated to text memories.

The former Memories API is no longer available. Move application-level memory management to the Collections and Documents APIs, and update gateway instructions to search explicitly. The former `retentionDays` argument is now `expiresInDays`; omitting it creates a memory that never expires, where the old default was 30 days.

For application-level controls around memory writes, deletion policies, and review, see [How to protect LLM agent memory from poisoning](https://aivax.net/blog/persistent-memory-is-a-write-path/).

## Image Generation

Enable `ImageGeneration` to let the model create images. The available image generation models are listed in the AIVAX console.

Generated images are attached to the conversation context, but the assistant cannot see them directly. They are stored on AIVAX servers for a few months before being permanently removed.

Image generation can incur usage charges. See [Pricing and limits](#pricing-and-limits) before enabling it in production.

You can allow adult images with `image_generation_allow_mature_content`. The selected model must also accept generating such content.

You are always responsible for the [material you generate](/docs/legal/terms-of-service), and it must comply with our terms of service.

Activation via `builtin_tools`:

```json
{
    "tools": [
        "ImageGeneration"
    ],
    "options": {
        "image_generation_model_name": "@x-ai/grok-imagine",
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

Text responses are returned to the model; binary responses are not, and the tool reports only their content type and size.

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

Web and X searches are billed per search. The [plan multiplier](../pricing/product-pricing.md#plan-multipliers) applies to token-based charges. Model inference used to invoke a tool is still billed at its regular rate. Image generation is billed at the selected model's rates; see [Image generation](../generations/images.md).

| Description | Pricing |
| --- | ---: |
| Web search | **$5/1k searches** |
| X (Twitter) search | **$5/1k searches** |
| [Memory](#memory) | Saving or replacing content: document embedding; semantic `query` search: RAG query embedding; `filter` search: no cost |
| Advanced requests | No separate charge |
| Document generation | No separate charge |
| Web page generation | No separate charge |

Web search, X/Twitter search, document and web page generation, image generation and editing, general service actions, and [Bash commands](shell.md#pricing-and-limits) have plan limits; see [Built-in tools and web search limits](../pricing/plans-and-limits.md#built-in-tools-and-web-search). X/Twitter search is not available on Free. General service actions share one daily service-action quota. Each memory's content is limited to 10 KB.

## Tool Diagnosis

Use these checks when a tool is not called, is called too often, or fails.

### The tool is not called

1. Confirm that the tool is enabled in the gateway or in the request's `builtin_tools` field.
2. Check whether the selected model supports function calls, or whether a tool handler is configured for models without native support.
3. Review the instructions. If they do not say when to search, open a URL, generate an image, or query memory, the model may answer only from its own knowledge.
4. Test a direct question that clearly requires the tool, such as asking for a recent news article for `WebSearch` or asking to open a specific URL for `OpenUrl`.

### The tool is called too often

Reduce ambiguity. Tools like `WebSearch` and `XPostsSearch` compete for recent information; `OpenUrl` and `Request` can seem similar when the user sends a link. For `Remember`, distinguish a request to save information from a question that requires retrieving an existing memory. Remove unnecessary tools, make gateway instruction descriptions more restrictive, and, when possible, use [workers](/docs/inference/workers) to block or replace calls in specific scenarios.

### The tool fails

Treat tool failures as a normal part of the experience. Searches may return little content, URLs may block bots, APIs may deny authorization, image generation may refuse content, and code execution may receive ambiguous input. Instruct the model to explain the limitation objectively and offer the next step, such as requesting another link, trying a more specific query, asking for authorization, or responding based only on the available context. Do not rely on an external tool as the sole way to conclude a critical conversation without an experience fallback.
