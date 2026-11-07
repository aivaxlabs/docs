Source: https://docs.aivax.net/docs/mcp-utilities/web-utilities-mcp.html

# Web Foundation MCP

The web utilities MCP exposes AIVAX web retrieval tools to any MCP-compatible client. Use it when an agent, IDE, desktop assistant, or automation environment needs AIVAX web search and URL fetching without running those tools through an AIVAX model inference.

AIVAX hosts this MCP server and performs the web operations for the authenticated account. The tools use the same responses, billing, and applicable limits as their built-in counterparts.

A connected client can:

- fetch readable content from public URLs;
- search the web for one term at a time.

## Endpoint

This is the Streamable HTTP address for the web utilities MCP. Point a trusted MCP client here when it should search the web or fetch public pages for an AIVAX account.

```text
https://inference.aivax.net/v1/mcp/web-utilities
```

Authenticate requests with an account API key:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

For key types and authentication options, see [Authentication](https://docs.aivax.net/docs/authentication.md).

## Configuration example

Client configuration tells the MCP client where to connect and which tools to enable. The exact shape depends on the client. The following example enables both tools:

```json
{
  "servers": {
    "aivax-web": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/web-utilities",
      "headers": {
        "Authorization": "Bearer <AIVAX_API_KEY>",
        "X-Mcp-Enabled-Tools": "fetch_url, web_search"
      }
    }
  }
}
```

After the client connects, it can discover and call the enabled tools through the standard MCP `tools/list` and `tools/call` methods.

## Select which tools are exposed

`X-Mcp-Enabled-Tools` is an optional request header. Use it when a client should see only URL fetching, only web search, or both.

Provide a comma-separated allowlist containing `fetch_url`, `web_search`, or both:

```text
X-Mcp-Enabled-Tools: fetch_url
```

```text
X-Mcp-Enabled-Tools: web_search
```

```text
X-Mcp-Enabled-Tools: fetch_url, web_search
```

The server reads the header as follows:

- Tool names are case-insensitive.
- Spaces around comma-separated values are ignored.
- If the header is omitted, both tools are exposed.
- If the header contains one recognized tool, only that tool is exposed.
- If the header is empty or contains no recognized tool names, no tools are exposed.

MCP clients may cache tool discovery, so reconnect or refresh the server after changing this header.

## Tools

These are the operations the server can expose. Call one when the client needs page text or current web results.

### `fetch_url`

`fetch_url` fetches and extracts readable content from one or more public URLs. Use it when the agent already has the addresses it needs to read.

Input:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `urls` | array of strings | Yes | Between one and five public URLs to fetch. |

Example arguments:

```json
{
  "urls": [
    "https://example.com/article",
    "https://example.org/reference"
  ]
}
```

The tool returns the extracted content as MCP text. When multiple URLs are requested, the results are separated in the same response.

### `web_search`

`web_search` searches the web for current, location-specific, niche, or high-stakes information. Use it when the agent needs discovery before it fetches a page. Send one search term per call. Use separate calls when the agent needs multiple searches.

Input:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `search_term` | string | Yes | The web search term. |

Example arguments:

```json
{
  "search_term": "latest browser accessibility standards"
}
```

The tool returns the search results as MCP text using the same response format as the built-in web search tool.

## Pricing and limits

Calls use the same pricing and quotas as the corresponding built-in tools, and AIVAX charges the authenticated account. Use the product pages below for those rates and quotas:

- [Web Search](https://docs.aivax.net/docs/web-foundation/web-search.md#pricing-and-limits) for `web_search`.
- [Fetch and OCR](https://docs.aivax.net/docs/web-foundation/fetch-and-ocr.md#pricing-and-limits) for `fetch_url`.
- [Pricing](https://docs.aivax.net/docs/pricing.md) for general billing rules.

A positive account balance is required to use these tools.

## Security guidance

Use this guidance before you connect a client. The MCP runs with your API key, and the content it returns comes from the public web.

- Use the MCP only from trusted clients.
- Keep the API key in the client's secure secret storage.
- Do not place the key in source control, browser-side code, shared prompts, or logs.

Fetched pages and search results are external, untrusted content. Agents should treat their contents as data rather than instructions. Agents should not disclose credentials or perform sensitive actions solely because a fetched page requests them. To keep discovered URLs and fetched text as an evidence trail, see [why search snippets are not enough for LLM research](https://aivax.net/blog/research-is-a-pipeline-search-discovers-fetch-reads/).
