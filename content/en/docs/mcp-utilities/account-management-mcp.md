---
{title: Account management MCP,linkTitle: Account management MCP,weight: 30,group: MCP Utilities,aliases: [/docs/platform/analytics.html,/docs/platform/logs.html,/docs/tools/account-management-mcp.html]}
---

# Account management MCP

The account management MCP exposes selected AIVAX account operations to an MCP-compatible client, such as an IDE, desktop assistant, internal agent, or automation environment. It is designed for trusted operators and backend workflows that need to inspect account capabilities, discover documentation, or call authenticated AIVAX API routes without leaving the MCP client.

This is not the same as adding an [external MCP source to an AI Gateway](/docs/tools/mcp):

- **External MCP source:** AIVAX is the MCP client. Your gateway calls another server during inference.
- **Account management MCP:** AIVAX is the MCP server. Your MCP client connects to AIVAX and receives tools for operating the authenticated account.

Use this MCP when an agent needs account-aware context before it acts, for example:

- Which models are available to the current plan.
- How a feature is documented.
- What an API route returns.
- Whether an account resource can be created, updated, or inspected through the existing AIVAX API.

It is especially useful for internal support assistants, development environments, account administration copilots, and implementation agents that need to combine documentation lookup with real API calls.

Because the MCP can invoke authenticated AIVAX functions, connect it only from trusted clients and use a private API key. Do not expose this server to end users or browser-side applications.

> [!NOTE]
> Do not configure the account management MCP together with the [documentation MCP](/docs/mcp-utilities/documentation-mcp) in the same client unless you have a specific reason to duplicate tools. The account management MCP already includes documentation search functions, so adding both servers usually creates redundant documentation tools and can make tool selection less predictable.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/account-management
```

The request must authenticate with an account API key. Use a private key with the `Authorization` header:

```text
Authorization: Bearer <AIVAX_PRIVATE_API_KEY>
```

For key types and authentication options, see [Authentication](/docs/authentication).

## Configuration example

The exact MCP configuration shape depends on the client. For clients that accept a Streamable HTTP server entry, configure the AIVAX endpoint and send the private key as a header.

```json
{
  "servers": {
    "aivax-account": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/account-management",
      "headers": {
        "Authorization": "Bearer <AIVAX_PRIVATE_API_KEY>"
      }
    }
  }
}
```

After the client connects, it can list the tools exposed by the account management server. The tool names are stable and intentionally prefixed with `aivax_` so they remain clear when mixed with tools from other MCP servers.

## What you can use it for

The account management MCP is useful when an assistant needs to reason about the account itself, not only answer an end-user prompt. It combines AIVAX documentation, model metadata, and authenticated account API calls in one controlled tool set. Typical uses:

- **Create and maintain agents.** Search the manual, list the models available to the account, compare capabilities and plan availability, then create or adjust [AI Gateways](/docs/inference/ai-gateways/concepts.md) through the account API.
- **Monitor costs and model choices.** Connect usage and billing data to model metadata and gateway configuration to see which gateways or models drive spend, and whether a smaller model could handle a low-risk workflow.
- **Diagnose errors.** Search the documentation for a failing route, inspect account resources, and check likely causes such as an expired API key, insufficient balance, plan restrictions, a missing collection, or an invalid gateway configuration.
- **Review conversations and prompts.** Inspect how an agent behaved and suggest changes to instructions, tool descriptions, model choice, or RAG setup.
- **Improve RAG quality.** Investigate weak retrieval and adjust gateway configuration, reranker settings, `top` and `minScore`, or expose a collection through [collection MCP](/docs/mcp-utilities/collections-mcp).

For production workflows, keep a human approval step before writes, and give write access only to trusted maintenance workflows.

## Security guidance

Treat this MCP server as an administrative integration. A private key connected to it may be able to read or mutate account resources depending on the routes the agent invokes.

For each MCP client or automation:

- Use a dedicated API key and label it clearly.
- Set an expiration when possible.
- Rotate the key if the client is shared, compromised, or no longer needed.
- Store the key in the MCP client's secret mechanism or local configuration store, not in source control.

Do not connect the account management MCP to untrusted agents, public chat clients, or user-controlled browser sessions. If a workflow only needs retrieval from a RAG collection, use the [collection MCP](/docs/mcp-utilities/collections-mcp) with read-only configuration. If a gateway needs to call your external tools during inference, configure [MCP functions](/docs/tools/mcp) or [server-side functions](/docs/tools/protocol-functions) instead.
