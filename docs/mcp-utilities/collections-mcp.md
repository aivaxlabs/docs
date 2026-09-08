# Collections MCP

The Collections MCP exposes one or more AIVAX RAG collections as tools for compatible MCP clients. Use it when an external model, agent, IDE, or desktop assistant should decide when to search an AIVAX knowledge base.

For information about creating collections, preparing documents, and improving retrieval quality, see [Collections and Documents](/docs/rag/collections) and [Semantic Search](/docs/rag/semantic-search).

## Endpoint

```text
https://inference.aivax.net/v1/mcp/collections
```

## Headers

| Header | Description | Default |
| --- | --- | --- |
| `Authorization` | Bearer token of your API key. | Required |
| `X-Mcp-Collection-Id` | One or more collection IDs. Use commas for multiple collections. | Required |
| `X-Mcp-Collection-Name` | Collection name used to generate tool names. | `collection` |
| `X-Mcp-Reranker` | Selects the ranker used to order search results. Use a canonical `@provider/name`, `lexical`, `rrf`, `smart`, or `none`. | `@aivax/reflex-v1` |
| `X-Mcp-Top-K` | Maximum number of results to return. | `5` |
| `X-Mcp-Min-Score` | Minimum relevance score greater than 0 and up to 1.0. | `0.4` |
| `X-Mcp-Use-References` | Current server behavior enables references when this header value is `none`; omit the header to disable references. | disabled |
| `X-Mcp-Allow-Write` | Use `yes` to expose document write and delete tools. | disabled |
| `X-Mcp-Naming-Convention` | Controls how generated tools are named. Use `default` or `agent`. | `default` |

## Configuration example

Visual Studio Code:

```json
{
  "servers": {
    "my-rag-collection-mcp": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/collections",
      "headers": {
        "Authorization": "Bearer <AIVAX_API_KEY>",
        "X-Mcp-Collection-Id": "<COLLECTION_ID>",
        "X-Mcp-Collection-Name": "my_collection",
        "X-Mcp-Top-K": "5",
        "X-Mcp-Min-Score": "0.4",
        "X-Mcp-Use-References": "none"
      }
    }
  }
}
```

## Generated tools

With the default naming convention, the read tool is named:

```text
{collection_name}_search
```

It accepts:

- `search_terms` (`string[]`): one or more search terms.

The MCP read tool enforces two request-shaping limits:

- At most 10 search terms per call.
- At most 500 total characters across all search terms.

When `X-Mcp-Allow-Write` is disabled, only the search tool is exposed. This is the recommended mode for assistants that only need to read a knowledge base.

When `X-Mcp-Allow-Write: yes` is sent, the server also exposes document creation/update and delete tools. Enable this only for trusted clients, because a model with write access can change collection contents.

Use Collections MCP when an external model or MCP client should decide when to search. For a typical AIVAX chat client, it is often simpler to attach the collection directly to an [AI Gateway](/docs/inference/ai-gateway) and let the gateway RAG pipeline retrieve documents automatically.
