Source: https://docs.aivax.net/docs/mcp-utilities/collections-mcp.html

# Collections and RAG MCP

The Collections MCP exposes one or more AIVAX RAG collections as tools for compatible MCP clients. Use it when an external model, agent, IDE, or desktop assistant should decide when to search an AIVAX knowledge base.

For information about creating collections, preparing documents, and improving retrieval quality, see [Collections and Documents](https://docs.aivax.net/docs/rag/collections.md) and [Semantic Search](https://docs.aivax.net/docs/rag/semantic-search.md).

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
| `X-Mcp-Use-References` | Set to `none` to enable references in search results; omit the header to disable them. | disabled |
| `X-Mcp-Allow-Write` | Use `yes` to expose document write and delete tools. | disabled |
| `X-Mcp-Naming-Convention` | Controls how generated tools are named. Use `default` or `agent`. | `default` |
| `X-Mcp-Enabled-Tools` | Comma-separated allowlist of tool types to expose: `search`, `write`, `delete`. See [Select which tools are exposed](#select-which-tools-are-exposed). | all available tools |

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
        // Enables references in search results.
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
- `filter` (`string`, optional): a [document filter](https://docs.aivax.net/docs/rag/document-filters.md) applied before the semantic search, such as `tags has "faq" and updatedAt >= now-30d`.

The MCP read tool accepts at most 10 search terms and 500 total characters per call.

When `X-Mcp-Allow-Write` is disabled, only the search tool is exposed. This is the recommended mode for assistants that only need to read a knowledge base.

When `X-Mcp-Allow-Write: yes` is sent, the server also exposes document creation/update and delete tools. Enable this only for trusted clients, because a model with write access can change collection contents.

## Select which tools are exposed

Use the optional `X-Mcp-Enabled-Tools` header to expose only some of the generated tools. Provide a comma-separated allowlist of tool types, not generated tool names, so the same value works with any collection name and naming convention:

- `search`: the read tool.
- `write`: the document creation/update tool.
- `delete`: the document delete tool.

For example, to let a client add documents and search without being able to delete them:

```text
X-Mcp-Allow-Write: yes
X-Mcp-Enabled-Tools: search, write
```

To expose only the write tool, for an ingestion agent that should not read the collection:

```text
X-Mcp-Allow-Write: yes
X-Mcp-Enabled-Tools: write
```

The allowlist only narrows the tool set. `write` and `delete` still require `X-Mcp-Allow-Write: yes`; without it, they are not exposed even when listed. Without `X-Mcp-Enabled-Tools`, the server exposes every tool allowed by the other headers. Values are case-insensitive, spaces around commas are ignored, and unknown values are ignored.

Use Collections MCP when an external model or MCP client should decide when to search. For a typical AIVAX chat client, it is often simpler to attach the collection directly to an [AI Gateway](https://docs.aivax.net/docs/inference/ai-gateway.md) and let the gateway RAG pipeline retrieve documents automatically.
