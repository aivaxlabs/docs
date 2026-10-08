Source: http://localhost:1313/docs/web-foundation/web-search.html

# Web Search

Web Search retrieves current information from the internet for research, fact checking, and answers that need sources beyond the model's training data. Use it to discover relevant pages; use [Fetch and OCR](http://localhost:1313/docs/web-foundation/fetch-and-ocr.md) when you already have a URL or need to read a source in more detail.

## Choose how to use Web Search

| Integration | When to use it |
| --- | --- |
| [Built-in tools](http://localhost:1313/docs/tools/builtin-tools.md) | Let an AIVAX model decide when to search during inference. Enable `WebSearch` in the gateway or request's `builtin_tools` configuration. |
| [Web utilities MCP](http://localhost:1313/docs/mcp-utilities/web-utilities-mcp.md) | Give an MCP-compatible agent, IDE, or automation client access to the `web_search` tool without running an AIVAX model inference. |
| Direct API | Call the search endpoint from your backend when no model or agent is involved — scheduled monitors, dataset enrichment, or pre-fetching context before inference. |

`AdvancedWebUsage` is disabled and returns an unavailable response. See [Changelogs](http://localhost:1313/docs/changelogs.md) for details.

## Search and verify sources

Write a focused query that includes the topic and any relevant date, product version, or location. For several independent questions, use separate searches rather than combining unrelated topics into one query.

For direct API requests, narrow results with `country` (a two-letter country code), `language` (a language code), and `includeDomains` (trusted domains). Set `topn` to request up to 25 results when recall matters, such as when surveying competing sources; otherwise, keep the default small count. For parameters of the built-in Web Search tool, see its [reference](http://localhost:1313/docs/tools/builtin-tools.md).

Search results help locate evidence; they do not guarantee that a source is accurate or current. Check publication dates, prefer primary sources, and fetch the relevant pages before relying on details that a result summary may omit. Keep source links with the answer so readers can verify the claims.

Treat retrieved text as external, untrusted content, not as instructions for your agent.

## API reference

For the supported request, response, authentication, and error contract, use the API Reference:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Search%20the%20web)

## Pricing and limits

Web Search is billed per search. Calls through [Web utilities MCP](http://localhost:1313/docs/mcp-utilities/web-utilities-mcp.md) use the same pricing as the corresponding built-in tool and are charged to the authenticated account. Model inference, when used, is billed separately.

See [Pricing](http://localhost:1313/docs/pricing.md) for current Web Search and advanced search charges, and [Plans and limits](http://localhost:1313/docs/limits.md) for account quotas and rate limits.
