---
{title: On-demand Built-in Tools,linkTitle: Built-in tools,weight: 100,group: Inference}
---

# On-demand built-in tools

Use `builtin_tools` to enable AIVAX [built-in tools](/docs/tools/builtin-tools.md) for a direct request without creating a gateway:

```json
{
    "model": "@google/gemini-3.8-flash",
    "prompt": "Search for recent news about electric vehicles.",
    "stream": true,
    "builtin_tools": {
        "tools": [
            "WebSearch"
        ],
        "options": {
            "web_search_mode": "full",
            "web_search_max_results": 5
        }
    }
}
```

Built-in tools include `DateTime`, `WebSearch`, `AdvancedWebUsage` (disabled; returns an unavailable response; see [Changelogs](/docs/legal/changelogs.md)), `OpenUrl`, `Code`, `Request`, `Remember`, `GenerateWebPage`, `GenerateDocument`, `XPostsSearch`, and `ImageGeneration`.

`DateTime` exposes `get_date_time`, a no-argument tool returning the current date, time, English weekday, time zone, UTC offset, and ISO 8601 timestamp. It uses the gateway time zone (default `America/Sao_Paulo`); send `time_zone` with an IANA identifier to override it for one request. This setting is independent of the user's browser time zone. See [Current Date and Time](/docs/tools/builtin-tools.md#current-date-and-time) for configuration and output examples.

On-demand tools are suitable for occasional calls, prototypes, and integrations that do not need a persistent gateway. If the same application always uses the same tools, prefer configuring them in an AI Gateway so the policy is centralized.

## Combine with a gateway

When `model` is a gateway, `builtin_tools` adds tools to the ones the gateway already enables; it does not remove gateway tools. `options` applies to the tools of this request. Public API keys cannot send `builtin_tools`.

Built-in tools are server-side tools: their calls appear as `servertool` events while streaming and are not returned as messages. Reuse the `conversation_token` so later turns keep their results; see [Server-side context](server-side-context.md). Each tool is billed according to its own rates; see [Built-in tools pricing](/docs/tools/builtin-tools.md#pricing-and-limits).
