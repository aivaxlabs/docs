---
{title: Built-in Tools,linkTitle: Built-in tools,weight: 340,group: Tools,aliases: [/docs/platform/memories.html]}
---

# Built-in Tools

AIVAX provides a list of built-in tools for you to enable in your model. These tools can be used together with the [server-side functions](/docs/tools/protocol-functions).

Some functions have usage charges. See [Pricing](../pricing.md) before enabling them in a production workflow.

Note that each model decides which function to call and its parameters. Not all models can obey the call rules.

## How to Choose and Combine Tools

Built-in tools should be enabled as work capabilities, not as agent decoration. Each tool adds a decision to the model: it needs to perceive that the tool exists, understand when to use it, assemble valid arguments, wait for the result, and continue the response. The more similar tools are available at the same time, the higher the chance of redundant use or poor choice. Start with the smallest set that solves the use case and write clear instructions on when to use each.

Use `WebSearch` when the answer depends on public, recent, or variable information. Use `OpenUrl` when the user has already provided a URL and wants the assistant to analyze that specific content. `AdvancedWebUsage` is disabled and returns an unavailable response; see [Changelogs](../changelogs.md). Use `Code` for calculation, data transformation, and small algorithmic reasoning. Use `Request` when the model needs to call an HTTP API with method, headers, or custom body. Use `Remember` only in chat clients or calls with an identifiable user, because memory tools store and retrieve persistent information for that user.

Generation tools, such as image, document, and web page, should be treated as output actions. They do more than improve an answer; they create artifacts hosted or attached to the conversation. Therefore, instruct the model on when to generate an artifact and when to reply in text. In support, for example, generating a document can be useful for a quote, proposal, or formal summary; generating a web page can be useful for a visual report; generating an image can be useful for creative ideation. If the user only asked for an explanation, plain text is usually sufficient.

When tools are available via `builtin_tools` in a direct call, the application making the request decides the list for each inference. When configured in the AI Gateway, the list is centralized and can be combined with skills, workers, MCP, protocol functions, and shell. In production, prefer the gateway for permanent policies, because it prevents different clients from enabling different tools without control. Use direct calls for testing, internal routines, and flows where the application truly needs to choose tools dynamically.

The values in `builtin_tools.tools` are configuration flags such as `WebSearch`, `Code`, and `OpenUrl`. The model sees runtime function names such as `web_search`, `evaluate_code`, and `open_url`. Use runtime function names when configuring skill tool allowlists or shell tool allowlists.

## Current Date and Time

Enable `DateTime` to expose `get_date_time`. This tool takes no arguments and reads the current time when it is called. It returns the date, time, day of the week, time zone, UTC offset, and an ISO 8601 timestamp.

In the dashboard, select **Current date and time** in the gateway's built-in tools, then edit its **Time zone** under **Current date and time configuration**. The Functions playground and Batch workflow tool options also expose this setting.

Configure `dateTimeTimeZone` with an IANA time zone identifier. The default is `America/Los_Angeles` (Pacific Time), which automatically follows PST/PDT daylight-saving changes rather than using a fixed UTC offset. For example, use `America/Sao_Paulo` for São Paulo or `UTC` for UTC. Invalid identifiers are rejected. The tool uses this configured zone, not the browser or user-context time zone.

Activation via `builtin_tools`:

```json
{
    "tools": ["DateTime"],
    "options": {
        "dateTimeTimeZone": "America/Los_Angeles"
    }
}
```

For a saved gateway, include `DateTime` in `parameters.sentinelOptions.enabledFunctions` and set `parameters.builtinFunctionsOptions.dateTimeTimeZone`. For a Batch workflow, use `enabledTools.enabledFunctions` and `enabledTools.options.dateTimeTimeZone`.

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

This function enables internet search in your model. With this, the model can query specific or real‐time information such as weather data, news, game results, etc.

Internet search is performed by multiple providers, chosen based on network availability and latency. AIVAX uses a mix of providers to perform internet searches.

AIVAX provides two types of searches configurable via its dashboard:

- **Full**: the performed search is complete, inserting the entire content of each result into the conversation context.
- **Summarized**: the performed search is summarized, inserting into the conversation context a summary generated by AI by the search provider itself.

The `Full` mode may consume more input tokens from the conversation, but can provide more precise results. See [Pricing](../pricing.md) and [Plans and limits](../limits.md) before enabling internet search in production.

> [!NOTE] 
>
> **Important:** the `Full` search is not always available.

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

`AdvancedWebUsage` is disabled and returns an unavailable response. See [Changelogs](../changelogs.md) for details.

## Code Execution

This function allows the model to execute JavaScript code and inspect the execution result. With this, the model can evaluate algorithmic results of mathematical expressions and other situations that are better represented through code.

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

This function allows the model to access external content at URLs and links provided by the user. With this function, the model can access links and evaluate their content.

Note that some destinations may identify the access as a bot and block it, as this function is not crawling but a simple GET to the destination.

Upon obtaining link content, the system checks the return content and handles it according to each type:

- HTML content is rendered: HTML tags, scripts, CSS, and “noise” are removed from the access result, keeping only the plain text of the link.
- Other textual content: the content is read directly and no transformation is performed.
- Non‐textual content: when the link responds with non‐textual content and the response indicates a filename (either by path or by the `Content‐Disposition` header), the system attempts to convert the downloaded file to a textual version.

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

Both tools require an identified user: set a stable `tag` in a [chat client](/docs/features/chat-clients), or `$.user` in a chat/completions request. Without that identifier, the tools return an error. Memory searches are automatically restricted to the current user. Each memory records the gateway that saved it, and `parameters.builtinFunctionsOptions.allowSharedMemory` controls visibility:

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

`memory_save(id?, content?, expiresInDays?)` combines creation, replacement, and deletion. `id` is the memory's ID; `content` is the text to save, limited to **10 KB**; `expiresInDays` is an optional whole number of days, from 1 to 365, after which the memory is deleted automatically.

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
| `filter` | A string using [AIVAX document filter syntax](/docs/filters/document-filters). Returns up to 10 matching memories, newest first, without generating query embeddings. |

Each result contains `id`, `content`, `createdAt`, `updatedAt`, and `expiresAt` (`null` when the memory never expires). Expired memories are never returned. Use `query` to find meaning; use `filter` for exact text, metadata, or creation and update dates:

| Goal | `filter` |
| --- | --- |
| Created in the last 7 days | `createdAt >= now-7d` |
| Changed in the last 24 hours | `updatedAt >= now-24h` |
| Created in October 2026 | `createdAt >= "2026-10-01" and createdAt < "2026-11-01"` |
| Not updated for 90 days, for example stale candidates to review | `updatedAt < now-90d` |
| Mentions a birthday and was created in the last 30 days | `content contains "birthday" and createdAt >= now-30d` |
| Saved in a specific conversation | `metadata.conversation_token = "<conversation token>"` |

Dates and timestamps without an offset use the server reference time zone described in [Document filters — Dates](/docs/filters/document-filters#dates). A memory's creation or update date is not the date of an event mentioned in its text.

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

Memories saved with `expiresInDays` are deleted in a periodic cleanup after they expire; until then they are hidden from `memory_search`. Memories without an expiration are kept until deleted. When managing the collection directly, set or remove `metadata.expires_at` to control expiration. Inspect and manage them in the dashboard's Collections and Documents pages or through the [Collections and Documents APIs](../rag/collections.md). The dedicated Memories API and dashboard Memories page are removed. **Deleting the `@memories` collection erases every user's memories in the account**; the collection is recreated on the next save.

The automatic user restriction applies to the memory tools. When managing the collection directly, use `metadata.external_user_id` to select the intended user's records and preserve the user metadata.

### Billing, Limits, and Errors

Saving or replacing memory content indexes it like any collection document, with document-embedding charges. A `query` search is billed as a RAG query embedding. A `filter` search has no embedding cost, and the `rrf` reranker has no reranking cost. See [Pricing](../pricing.md).

Both memory tools use the account's [RAG rate limits](../limits.md#plan-limits). If the account has no balance or reaches a rate limit, the tool returns an error to the model. Instruct the model to report the failure rather than claim it saved or recalled information. For a recent save that is not yet found, allow indexing to finish before searching again.

### Migration from Earlier Memory and Calendar Tools

Existing non-expired memories were moved to each account's `@memories` collection, preserving their original IDs, user identifiers in `external_user_id`, creation dates, and expiration dates in `expires_at`. Migrated records have `conversation_token: null`. They are re-indexed, which is billed as document embedding.

The `Calendar` built-in tool and its appointment tools were removed from the API and dashboard. Existing gateways and Batch workflows have the flag removed automatically, but requests that still include `Calendar` in `builtin_tools.tools` fail: remove it from your requests. Non-expired calendar reminders were migrated to text memories in the form `Reminder at <date> (<n> minutes): <description>`. These are stored text, not scheduled reminders or a replacement calendar service.

The former Memories API, including list, get, delete, and migration prompt generation, is no longer available. Move application-level memory management to the Collections and Documents APIs. Update gateway instructions to search explicitly. Gateways with private memory do not see migrated memories, because migrated records have no `gateway_id`. The former `retentionDays` argument is now `expiresInDays`; omitting it creates a memory that never expires, where the old default was 30 days.

For application-level controls around memory writes, deletion policies, and review, see [How to protect LLM agent memory from poisoning](https://aivax.net/blog/persistent-memory-is-a-write-path/).

## Image Generation

This function allows the model to create AI images.

AI‐generated images are attached to the conversation context, but are not directly visible to the assistant.

Image generation can incur usage charges. See [Pricing](../pricing.md) before enabling it in production.

You can also enable the generation of explicit and adult images in image generation. When this feature is enabled, the model will be allowed to generate adult material. For this to happen, the model must also “agree” to generate such content. Some models have a lower security filter than others. For example, Gemini models have the lowest security filter, making them a viable option for role‐play and generating such material.

You are always responsible for the [material you generate](/docs/legal/terms-of-service) and the generated material must be compatible with our terms of service.

The available image generation models are listed in the AIVAX console.

Generated images are stored on AIVAX servers for a few months before being permanently removed.

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

This function allows the model to search for posts on X (formerly Twitter), and to read a specific post when the model has a post ID.

It is a direct alternative to `web_search`, as it can be used to look for up‐to‐date information in real time, such as news, information, game results, etc. This tool provides much more recent results than the conventional internet search tool.

It is not recommended to use both functions together because they have the same purpose.

This function can incur usage charges. See [Pricing](../pricing.md) before enabling it in production.

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

This function allows the model to create PDFs from HTML text.

The created files are hosted on AIVAX servers and made available by the assistant.

The content is hosted for a few months before being permanently deleted.

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

This function allows the model to host HTML pages on AIVAX servers.

This allows the model to host reports, landing pages, and other HTML infographics.

The content is hosted for a few months before being permanently deleted.

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

This function provides the model with an advanced HTTP request tool. With this function, the model can set headers, forms, contents, and methods to perform advanced HTTP requests.

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

## Tool Diagnosis

When a tool is not called, first confirm that it is enabled in the gateway or in the `builtin_tools` field of the request. Then, check whether the selected model supports function calls or if a tool handler is configured for models without native support. Next, review the instruction: if it does not specify when to search, open a URL, generate an image, or query memory, the model may respond only with its own knowledge. Finally, test a direct question that clearly requires the tool, such as requesting a recent news article for `WebSearch` or asking to open a specific URL for `OpenUrl`.

When a tool is called too often, reduce ambiguity. Tools like `WebSearch`, `AdvancedWebUsage`, and `XPostsSearch` compete for recent information; `OpenUrl` and `Request` can seem similar when the user sends a link. For `Remember`, distinguish a request to save information from a question that requires retrieving an existing memory. Remove unnecessary tools, make gateway instruction descriptions more restrictive, and, when possible, use workers to block or replace calls in specific scenarios.

When a tool fails, treat it as a normal part of the experience. Searches may return little content, URLs may block bots, APIs may deny authorization, image generation may refuse content, and code execution may receive ambiguous input. Instruct the model to explain the limitation objectively and offer the next step, such as requesting another link, trying a more specific query, asking for authorization, or responding based only on the available context. Do not rely on an external tool as the sole way to conclude a critical conversation without an experience fallback.
