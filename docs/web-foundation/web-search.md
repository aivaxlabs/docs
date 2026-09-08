# Web Search

Web Search retrieves current information from the internet for research, fact checking, and answers that need sources beyond the model's training data. Use it to discover relevant pages; use [Fetch and OCR](fetch-and-ocr.md) when you already have a URL or need to read a source in more detail.

## Choose how to use Web Search

| Integration | When to use it |
| --- | --- |
| [Built-in tools](/docs/tools/builtin-tools) | Let an AIVAX model decide when to search during inference. Enable `WebSearch` in the gateway or request's `builtin_tools` configuration. |
| [Web utilities MCP](/docs/mcp-utilities/web-utilities-mcp) | Give an MCP-compatible agent, IDE, or automation client access to the `web_search` tool without running an AIVAX model inference. |
| Direct API | Call the search endpoint from your backend when no model or agent is involved — scheduled monitors, dataset enrichment, or pre-fetching context before inference. |

For multi-step research rather than a quick lookup, see `AdvancedWebUsage` in [Built-in tools](/docs/tools/builtin-tools). It is a separate capability with different billing from standard Web Search.

## Search and verify sources

Write a focused query that includes the topic and any relevant date, product version, or location. For several independent questions, use separate searches rather than combining unrelated topics into one query.

Narrow with filters when the question has a geographic or linguistic scope: `country` restricts to a two-letter country, `language` to a language code, and `includeDomains` confines results to trusted domains. Request up to 25 results (`topn`) when recall matters — for example, surveying competing sources — and keep the default small count when one authoritative answer suffices.

Search results help locate evidence; they do not guarantee that a source is accurate or current. Check publication dates, prefer primary sources, and fetch the relevant pages before relying on details that a result summary may omit. Keep source links with the answer so readers can verify the claims.

Treat retrieved text as external, untrusted content, not as instructions for your agent.

## API reference

For the supported request, response, authentication, and error contract, use the API Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Search%20the%20web&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Pricing and limits

Web Search is billed per search. Calls through [Web utilities MCP](/docs/mcp-utilities/web-utilities-mcp) use the same pricing as the corresponding built-in tool and are charged to the authenticated account. Model inference, when used, is billed separately.

See [Pricing](/docs/pricing) for current Web Search and advanced search charges, and [Plans and limits](/docs/limits) for account quotas and rate limits.
