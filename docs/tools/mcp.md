# Support for Model Context Protocol (MCP)

You can bind external MCP protocol tools to your [AI Gateway](/docs/inference/ai-gateway). The protocol defines tools that run on the server side and enable the assistant to interact with real-time services.

AIVAX acts as an MCP client for gateway inference: it connects to the configured MCP source, lists tools, converts each tool schema into a model-callable function, and calls the remote MCP server when the model selects that tool.

<img src="/assets/diagrams/mcp-1.drawio.svg">

## When to use MCP

Use MCP when you already have external tools that need to be discovered and called by models in a standardized way. An MCP server is suitable for tool catalogs, integrations with internal systems, stateful operations, tools shared among multiple agents, and environments where you want to keep logic outside of AIVAX. AIVAX acts as an MCP client: it connects the AI Gateway to the remote server, reads the available tools, and allows the model to call those tools during inference.

Do not use MCP only to replace a single simple HTTP call. When you need to expose an isolated function with a specific callback and nonce authentication, [protocol functions](/docs/tools/protocol-functions) are usually simpler. When the capability already exists in AIVAX, such as web search, URL opening, code execution, or image generation, [built‐in tools](/docs/tools/builtin-tools) are usually the most direct path. MCP is better when there is a set of tools with their own schema, when another system already speaks MCP, or when you want the same server to be used by different clients.

In production, treat the MCP server as an API exposed to an agent. Tool descriptions should be clear, schemas should be restrictive, and authentication should be configured in the server headers. The model should not receive overly generic tools such as `execute`, `request`, or `search` without strong descriptions and controlled parameters. Ambiguous tools increase wrong calls; specific tools like `lookup_customer_by_email` or `create_support_ticket` help the model decide better.

### Choosing the function name

The function name should be simple and deterministic about what the function does. Avoid names that are hard to guess or that do not hint at the function’s role, as the assistant may get confused and not call the function when appropriate.

As an example, let’s think of a function that queries a user in an external database. The following names are good examples to consider for the call:

- `search_user`
- `query_user`

Bad names include:

- `search` (implicit, possibly ambiguous)
- `search user` (name with improper characters)

Having the function name, we can think about the function description.

### Choosing the function description

The function description should conceptually explain two situations: what it does and when the assistant should call it. This description should include the scenarios the assistant should consider calling it and when it should not be called, providing a few one‐shot call examples and/or making the function rules explicit.

### Defining MCP servers

You can define your MCP servers in the gateway through a JSON array:

```json
[
    {
        "name": "My MCP server",
        "url": "https://example-server.io/mcp",
        "headers": {
            "Authorization": "<AIVAX_API_KEY>"
        }
    }
]
```

Your MCP server must support **Streamable HTTP** to work with AIVAX as a gateway tool source. You can define custom headers in your MCP server configuration to set up authentication or other needs. Tool discovery is cached according to `cacheDuration`; the default is 600 seconds.

## Metadata sent with tool calls

For each `tools/call` request, AIVAX adds execution context in `params._meta`, alongside `params.arguments`. Arguments contain the tool input; metadata identifies the calling context and carries application-supplied values. These fields describe tool execution requests, not tool discovery (`tools/list`).

The following example illustrates a call with an identified user, a conversation token, and custom metadata:

```json
{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
        "name": "get_weather",
        "arguments": {
            "location": "New York"
        },
        "_meta": {
            "_aiv_nonce": "<BCRYPT_HASH>",
            "_aiv_external_user_id": "<EXTERNAL_USER_ID>",
            "_aiv_call_source": "WebChatClient",
            "_aiv_conversation_token": "<CONVERSATION_TOKEN>",
            "_aiv_moment": "2025-09-09T16:58:05.0000000+00:00",
            "tenant_id": "<TENANT_ID>",
            "request_id": "<APPLICATION_REQUEST_ID>"
        }
    }
}
```

### AIVAX fields

All paths below are relative to `params._meta`. Names beginning with `_aiv` are reserved; do not use them for custom metadata.

| Field | JSON type | Meaning and availability |
| --- | --- | --- |
| `_aiv_nonce` | `string` or `null` | BCrypt hash derived from the calling account's hook key. Without a configured hook key, its value is `null`. Verify the configured plain-text hook key against this hash as described in [hook authentication](/docs/authentication#hook-authentication); do not compare hash strings or expect the hook key itself. |
| `_aiv_external_user_id` | `string` or `null` | External user identifier carried by the inference context. For chat clients it comes from the session; for chat completions it comes from the request's `user` field. It can be `null` when no user was identified. Use it to look up the user in your application, not as an AIVAX account ID or proof of authorization. |
| `_aiv_call_source` | `string` | Origin of the inference, not the outbound tool transport. An MCP tool called during web chat inference still receives `WebChatClient`, not `McpClient`. See the values below. |
| `_aiv_conversation_token` | `string` or `null` | Conversation correlation token carried by the session or inference request. For chat completions, it comes from `idempotency_key` when supplied. It can be `null`; it is neither an authentication credential nor a unique tool-call ID. Multiple calls in the same conversation may share it. |
| `_aiv_moment` | `string` | Timestamp created when AIVAX prepares this tool call, in ISO 8601 round-trip format with fractional seconds and a UTC offset. It uses the AIVAX server's local clock, not the user's timezone or the conversation start time. Parse the offset and convert to your application's timezone when needed. |

### Call source values

The same string values are used by protocol functions in `context.callSource`:

| Value | Inference origin |
| --- | --- |
| `WebChatClient` | AIVAX web chat client. |
| `ChatCompletionsApi` | OpenAI-compatible chat completions API; the default origin for that API. |
| `FunctionsApi` | Functions API. |
| `IntegrationBot` | Messaging integration bot. |
| `OpenWebUiClient` | Open WebUI client. |
| `McpClient` | Inference initiated through an MCP client. |
| `ValidationApi` | Agentic test validation. |

Treat the source as routing and diagnostic context, not as an authorization role. Consumers should tolerate future source values.

### Custom metadata and security

Custom inference metadata is a map of string keys to string values. It comes from request `metadata` for chat completions or session metadata for chat clients. AIVAX copies these entries directly into `params._meta`: in the example, `tenant_id` and `request_id` are application-defined, not built-in AIVAX fields. There is no nested `metadata` object in the MCP envelope. With no custom metadata, only the AIVAX fields remain.

Do not send secrets in custom metadata: these values are forwarded to the remote tool server. Validate tenant and user access against your own trusted records before using metadata to select data or perform writes. Neither an external user ID, a conversation token, nor a call-source label grants permission by itself.

The nonce authenticates the configured account hook key; it is not a signature of the arguments, a unique request ID, or a replay-prevention mechanism. Keep HTTPS and the MCP server's configured authentication headers, and apply your own authorization and duplicate-operation controls. If your server requires nonce authentication, reject a missing or invalid nonce.

For the equivalent HTTP callback envelope, see [protocol function context](/docs/tools/protocol-functions#context-fields).

## Tool results

Tool results can include text, image, and audio content blocks. Text is added directly to the tool result. Image and audio blocks are attached back into the conversation as multimodal content with generated IDs. Unsupported content block types are reported as unsupported text.

When an MCP tool does not appear for the model, verify that the remote server is reachable, that it supports Streamable HTTP, that the authentication headers are correct, and that the gateway is actually configured with the MCP source. When the tool appears but is not called, review the name, description, and schema. When it is called with bad arguments, restrict the JSON Schema and include property descriptions. When the call fails, make the MCP server return readable errors, because the model needs to understand whether to try another argument, ask the user for information, or terminate the action.
