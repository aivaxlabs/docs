# Web utilities MCP

The web utilities MCP exposes AIVAX web retrieval tools to any MCP-compatible client. Use it when an agent, IDE, desktop assistant, or automation environment needs AIVAX web search and URL fetching without running those tools through an AIVAX model inference.

AIVAX hosts this MCP server and performs the web operations for the authenticated account. The tools use the same responses, billing, and applicable limits as their built-in counterparts.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/web-utilities
```

The server uses Streamable HTTP. Authenticate requests with an account API key:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

For key types and authentication options, see [Authentication](/docs/authentication).

## Configuration example

The exact configuration shape depends on the MCP client. The following example enables both tools:

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

Use the optional `X-Mcp-Enabled-Tools` request header to control which tools the server exposes to that client. Provide a comma-separated allowlist containing `fetch_url`, `web_search`, or both:

```text
X-Mcp-Enabled-Tools: fetch_url
```

```text
X-Mcp-Enabled-Tools: web_search
```

```text
X-Mcp-Enabled-Tools: fetch_url, web_search
```

Tool names are case-insensitive, and spaces around comma-separated values are ignored.

- If the header is omitted, both tools are exposed.
- If the header contains one recognized tool, only that tool is exposed.
- If the header is empty or contains no recognized tool names, no tools are exposed.

Because tool discovery may be cached by the MCP client, reconnect or refresh the server after changing this header.

## Tools

### `fetch_url`

Fetches and extracts readable content from one or more public URLs.

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

Searches the web for current, location-specific, niche, or high-stakes information. Send one search term per call; use separate calls when the agent needs multiple searches.

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

Calls use the same pricing as the corresponding AIVAX built-in tools and are charged to the authenticated account. See [Pricing](/docs/pricing) for current charges and billing rules.

Web operations are subject to the account's applicable service quotas and rate limits. See [Plans and Limits](/docs/limits) for current limits and enforcement behavior.

A positive account balance is required to use these tools.

## Security guidance

Use the MCP only from trusted clients and keep the API key in the client's secure secret storage. Do not place the key in source control, browser-side code, shared prompts, or logs.

Fetched pages and search results are external, untrusted content. Agents should treat their contents as data rather than instructions and should not disclose credentials or perform sensitive actions solely because a fetched page requests them.
