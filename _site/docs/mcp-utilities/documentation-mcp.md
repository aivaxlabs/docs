Source: https://docs.aivax.net/docs/mcp-utilities/documentation-mcp.html

# Documentation MCP

The AIVAX documentation MCP exposes AIVAX documentation, API reference content, and model metadata to MCP-compatible clients. It is designed for assistants, IDEs, internal agents, and implementation workflows that need current AIVAX context before they answer, write code, configure a gateway, or troubleshoot an integration.

This MCP is read-oriented. It does not expose a generic account API invocation tool. Use it when an agent needs to understand AIVAX features, find the right API route, compare model capabilities, or ground its answer in the product manual. Use the [account management MCP](https://docs.aivax.net/docs/mcp-utilities/account-management-mcp.md) only when the client also needs to inspect or change authenticated account resources through API calls.

> [!NOTE]
> Do not configure the documentation MCP together with the [account management MCP](https://docs.aivax.net/docs/mcp-utilities/account-management-mcp.md) in the same client unless you have a specific reason to duplicate tools. The account management MCP already includes documentation search functions. Adding both servers usually creates redundant documentation tools and can make tool selection less predictable.

## Endpoint

This is the address for the documentation MCP. Connect a client here when it should search the product manual, the API reference, or integrated chat models for the account plan.

```text
https://inference.aivax.net/v1/mcp/documentation
```

Authenticate with an AIVAX account API key:

```text
Authorization: Bearer <AIVAX_PRIVATE_API_KEY>
```

For key types and authentication options, see [Authentication](https://docs.aivax.net/docs/authentication.md).

## Configuration example

Client configuration tells the MCP client where to connect. The exact shape depends on the client. For clients that accept a Streamable HTTP server entry, configure the AIVAX documentation endpoint and pass the API key as a header.

```json
{
  "servers": {
    "aivax-docs": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/documentation",
      "headers": {
        "Authorization": "Bearer <AIVAX_PRIVATE_API_KEY>"
      }
    }
  }
}
```

After the client connects, it can discover the tools exposed by the server. Tool names are prefixed with `aivax_` so they remain clear when the client also has project, database, browser, or code tools available.

## Available tools

The server exposes two read tools. Use them when the assistant needs product context or a model list before it answers or acts.

### `aivax_search_documentation`

`aivax_search_documentation` searches AIVAX documentation and API reference content. Use this tool when the assistant needs product context before answering or acting.

The tool accepts:

| Argument | Type | Required | Description |
| --- | --- | --- | --- |
| `search_terms` | `string[]` | Yes | Search terms to query against AIVAX documentation and API reference. |
| `search_type` | `string` | No | Search scope. Use `documentation-manual`, `api-function-reference`, or `all`. |

The search can query the documentation manual, the API function reference, or both. It returns relevant documentation snippets in text form so the client can use them directly as context. Search accepts at most 10 search terms and 500 total characters per call.

Example arguments:

```json
{
  "search_terms": [
    "AI Gateway MCP headers",
    "tool metadata"
  ],
  "search_type": "all"
}
```

Choose terms that match the question:

- Use a complete phrase when the intent is clear, such as `semantic search reranker settings` or `public key chat completion restrictions`.
- Use multiple terms to cover neighboring concepts, alternate names, or likely API-reference terms.

Search calls use the per-account quotas documented in [Plans and limits](https://docs.aivax.net/docs/limits.md#account-limits).

### `aivax_list_models`

`aivax_list_models` lists integrated AIVAX chat models and returns a model-readable summary for each match. Use it when the assistant needs to choose a model, explain whether a model is available to the current plan, compare capabilities, or understand pricing (see [Pricing](https://docs.aivax.net/docs/pricing.md)).

The tool accepts:

| Argument | Type | Required | Description |
| --- | --- | --- | --- |
| `name_filter` | `string` | No | Optional fuzzy filter for model names, such as `gpt 5`, `sonnet`, `qwen coder`, or `@openai/gpt-5-mini`. |

The response includes each model's description, stability, type, capabilities, flags, and availability for the authenticated account plan. For current prices, see [Pricing](https://docs.aivax.net/docs/pricing.md).

Example arguments:

```json
{
  "name_filter": "gemini flash"
}
```

Model listing calls use the per-account quotas documented in [Plans and limits](https://docs.aivax.net/docs/limits.md#account-limits).

## When to use it

Use the documentation MCP when you want an assistant to answer AIVAX questions from source-backed context instead of memory. The sections below match the usual jobs.

### Answer from the manual

Use it in IDEs, support tools, onboarding agents, internal implementation copilots, and evaluation workflows. The assistant should search the manual before it recommends a route, parameter, feature, model, or debugging step.

### Design a gateway

Before creating or editing an [AI Gateway](https://docs.aivax.net/docs/inference/ai-gateways/concepts.md), the assistant can search for the relevant feature, check model capabilities, then explain what configuration to use and why. For example, it can compare:

- built-in tools;
- MCP functions;
- server-side functions;
- workers;
- RAG collections;
- structured responses;
- multimodal pre-processing.

### Troubleshoot an error

The assistant can move from an error message to the likely product boundary. It can search for authentication rules, plan limits, multimodal balance requirements, RAG search parameters, gateway behavior, or public-key restrictions. It can then produce a focused checklist that reflects AIVAX behavior.

### Choose a model

Combine `aivax_search_documentation` with `aivax_list_models`:

1. Search the manual for the feature requirement, such as tool calling, video input, structured output, or long context.
2. List matching models.
3. Choose one that is available to the account plan.

## Choosing search terms

Good search terms describe the user's goal, not only one keyword. Use this section when a search returns noise or misses the page you expected.

Prefer:

```text
public key chat completion restrictions
semantic search include references
AI Gateway MCP source headers
multimodal preprocess video
```

Over:

```text
key
search
headers
video
```

Choose `search_type` from the kind of answer you need:

- Use `search_type: "all"` when the assistant is unsure which page contains the answer.
- Use `api-function-reference` when it needs route names, request bodies, or endpoint behavior.
- Use `documentation-manual` when it needs conceptual guidance, tradeoffs, or workflow explanations.

## Security guidance

The documentation MCP is safer than a management tool because it is read-oriented, but it still authenticates as an AIVAX account. Connect it only to clients that should know the account's available models and documentation context. It may expose account-plan-sensitive model availability.

- Use a dedicated API key for each MCP client.
- Store the key in the client's secret mechanism or local configuration store.
- Do not store the key in source control.

If a client only needs public documentation and does not need account-specific model availability, prefer linking directly to the public documentation site instead of connecting an authenticated MCP server.
