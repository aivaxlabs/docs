Source: https://docs.aivax.net/docs/mcp-utilities/collections-mcp.html

# Collections and RAG MCP

The Collections MCP exposes one or more AIVAX RAG collections as tools for compatible MCP clients. Use it when an external model, agent, IDE, or desktop assistant should decide when to search an AIVAX knowledge base.

For a typical AIVAX chat client, it is often simpler to attach the collection directly to an [AI Gateway](https://docs.aivax.net/docs/inference/ai-gateway.md) and let the gateway RAG pipeline retrieve documents automatically.

For information about creating collections, preparing documents, and improving retrieval quality, see [Collections](https://docs.aivax.net/docs/rag/collections.md), [Documents](https://docs.aivax.net/docs/rag/documents.md), and [Semantic Search](https://docs.aivax.net/docs/rag/semantic-search.md).

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
| `X-Mcp-Enabled-Tools` | Comma-separated allowlist of tool types to expose: `search`, `browse`, `get`, `write`, `delete`. See [Select which tools are exposed](#select-which-tools-are-exposed). | all available tools |

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

The server generates up to five tools per configuration: search, browse, get document, and, when writes are allowed, write and delete. Tool names are built from `X-Mcp-Collection-Name` and the naming convention.

### Search tool

With the default naming convention, the read tool is named:

```text
{collection_name}_search
```

It accepts:

- `search_terms` (`string[]`): one or more search terms.
- `filter` (`string`, optional): a [document filter](https://docs.aivax.net/docs/rag/document-filters.md) applied before the semantic search, such as `tags has "faq" and updatedAt >= now-30d`.

The MCP read tool accepts at most 10 search terms and 500 total characters per call.

### Browse tool

The browse tool lists indexed documents in a fixed order, without semantic search. Use it when the model needs to see what a collection contains, page through every document, or read a document by its exact name. With the default naming convention, it is named:

```text
{collection_name}_browse_documents
```

With the `agent` naming convention, it is named `{collection_name}_list`. It accepts:

- `filter` (`string`, optional): a [document filter](https://docs.aivax.net/docs/rag/document-filters.md), such as `name = "setup.md"`, `reference = "manual-v2"`, or `tags has "faq"`.
- `sort` (`string`, optional): `createdAt`, `updatedAt`, `indexedAt`, or `name`. Defaults to `createdAt`.
- `descending` (`boolean`, optional): lists newest first, or from Z to A when sorting by name. Defaults to `false`.
- `include_content` (`boolean`, optional): adds the content and metadata of each document. Defaults to `false`, so the tool returns only names, tags, references, and dates. To read one document, prefer the get document tool.
- `limit` (`number`, optional): documents per page, from 1 to 50. Defaults to 20.
- `cursor` (`string`, optional): the `next_cursor` returned by the previous call. Send it with the same `filter`, `sort`, and `descending` values to read the next page. Cursors do not expire.

The browse tool does not embed or rerank anything, so it has no search cost, but each call counts toward the search rate limit of your plan. Documents appear in it only after they are indexed.

### Get document tool

The get document tool reads one document by its exact name, such as a name returned by the browse tool. With the default naming convention, it is named:

```text
{collection_name}_get_document
```

With the `agent` naming convention, it is named `{collection_name}_get`. It accepts:

- `name` (`string`): the exact document name.
- `start_line` and `end_line` (`number`, optional): a 1-based, inclusive line range. Without them, the whole document is returned.

It returns the name, tags, reference, metadata, dates, whether the document is already indexed, and the selected line range, followed by the content.

- A single call returns at most 100,000 characters. Read longer documents in parts with `start_line` and `end_line`.
- Documents that are still waiting to be indexed can also be read.
- When several collections are configured, the first collection in `X-Mcp-Collection-Id` that has a document with that name is used.
- Like the browse tool, it has no search cost and counts toward the search rate limit.

### Write and delete tools

When `X-Mcp-Allow-Write` is disabled, only the search, browse, and get document tools are exposed. This is the recommended mode for assistants that only need to read a knowledge base.

When `X-Mcp-Allow-Write: yes` is sent, the server also exposes document creation/update and delete tools. Enable this only for trusted clients, because a model with write access can change collection contents.

## Select which tools are exposed

Use the optional `X-Mcp-Enabled-Tools` header to expose only some of the generated tools. Provide a comma-separated allowlist of tool types, not generated tool names, so the same value works with any collection name and naming convention:

- `search`: the read tool.
- `browse`: the browse tool.
- `get`: the get document tool.
- `write`: the document creation/update tool.
- `delete`: the document delete tool.

For example, to let a client add documents and search without being able to delete them:

```text
X-Mcp-Allow-Write: yes
X-Mcp-Enabled-Tools: search, write
```

To let a client list and read documents without semantic search:

```text
X-Mcp-Enabled-Tools: browse, get
```

To expose only the write tool, for an ingestion agent that should not read the collection:

```text
X-Mcp-Allow-Write: yes
X-Mcp-Enabled-Tools: write
```

The allowlist only narrows the tool set. `write` and `delete` still require `X-Mcp-Allow-Write: yes`; without it, they are not exposed even when listed. Without `X-Mcp-Enabled-Tools`, the server exposes every tool allowed by the other headers. Values are case-insensitive, spaces around commas are ignored, and unknown values are ignored.
