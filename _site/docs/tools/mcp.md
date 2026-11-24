Source: https://docs.aivax.net/docs/tools/mcp.html

# Support for Model Context Protocol (MCP)

MCP binds external tools to an [AI Gateway](https://docs.aivax.net/docs/inference/ai-gateways/concepts.md). Use it when the assistant must call live services through a standard tool protocol.

The protocol defines tools that run on the server side and enable the assistant to interact with real-time services.

AIVAX acts as an MCP client for gateway inference. For each configured source, it:

1. Connects to the MCP server.
2. Lists tools.
3. Converts each tool schema into a model-callable function.
4. Calls the remote MCP server when the model selects that tool.

<img src="/assets/diagrams/mcp-1.drawio.svg">

## When to use MCP

Use MCP when you already have external tools that need to be discovered and called by models in a standardized way. An MCP server fits:

- Tool catalogs.
- Integrations with internal systems.
- Stateful operations.
- Tools shared among multiple agents.
- Environments where you want to keep logic outside of AIVAX.

Do not use MCP only to replace a single simple HTTP call.

- Use [protocol functions](https://docs.aivax.net/docs/tools/protocol-functions.md) when you need one isolated function with a specific callback and nonce authentication. They are usually simpler.
- Use [built-in tools](https://docs.aivax.net/docs/tools/builtin-tools.md) when the capability already exists in AIVAX, such as web search, URL opening, code execution, or image generation. They are usually the most direct path.
- Use MCP when there is a set of tools with their own schema, when another system already speaks MCP, or when you want the same server to be used by different clients.

In production, treat the MCP server as an API exposed to an agent:

- Write clear tool descriptions.
- Keep schemas restrictive.
- Configure authentication in the server headers.
- Do not offer overly generic tools such as `execute`, `request`, or `search` without strong descriptions and controlled parameters.

Ambiguous tools increase wrong calls. Specific tools like `lookup_customer_by_email` or `create_support_ticket` help the model decide better.

A long tool list also has a cost: every tool offered to the model adds its name, description, and schema to each request. To measure that overhead and reduce it, see [how to measure and cut tool-definition tokens](https://aivax.net/blog/reduce-mcp-tool-definition-tokens-too-many-tools/).

### Choosing the function name

Use a name that states the action. Keep it simple and deterministic. Avoid names that are hard to guess or that do not hint at the function's role. Otherwise the assistant may not call the function when it should.

For a function that queries a user in an external database, prefer:

- `search_user`
- `query_user`

Avoid:

- `search` (implicit, possibly ambiguous)
- `search user` (name with improper characters)

After the name is settled, write the description.

### Choosing the function description

Use the description to tell the assistant what the function does and when to call it.

Include:

- Scenarios where the assistant should call it.
- Scenarios where it should not be called.
- A few one-shot call examples, or explicit function rules.

### Defining MCP servers

Define MCP servers on the gateway when the assistant should discover and call that server's tools. Send a JSON array:

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

Your MCP server must support **Streamable HTTP** to work with AIVAX as a gateway tool source. You can define custom headers in your MCP server configuration to set up authentication or other needs. Discovered tools, server instructions, and remote skills are reused for `cacheDuration` seconds; the default is 600.

Each MCP source accepts the following fields. Use them to name the source, authenticate the connection, and control what the model sees:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | Required | Display name of the source, with at least 3 characters. It identifies the source in tool names (see `prefixTools`), server instructions, and remote skill descriptions. |
| `url` | `string` | Required | Absolute HTTP or HTTPS URL of the MCP server's Streamable HTTP endpoint. |
| `description` | `string` | `null` | Optional note describing what the source provides. It is informational only: it is not sent to the model or to the MCP server. |
| `headers` | `object` | `{}` | Map of HTTP header names to string values sent on every connection to the server, both during discovery and on each tool call. Use it for authentication, such as `Authorization`. |
| `cacheDuration` | `integer` | `600` | Time, in seconds, that discovered tools, server instructions, and remote skills are reused before AIVAX lists them again. Accepts values from `0` to `86400`. Tool calls are never cached. |
| `prefixTools` | `boolean` | `true` | When `true`, each tool is exposed to the model as `mcp_<source>_<tool>`, where `<source>` is the `name` in lowercase with spaces replaced by hyphens and other non-alphanumeric characters removed. For example, the `get_weather` tool of `My MCP server` becomes `mcp_my-mcp-server_get_weather`. When `false`, the server's original tool name is used; make sure it does not collide with tools from other sources or functions in the same gateway. The server always receives its original tool name. |
| `allowClientInstructions` | `boolean` | `true` | Adds the usage instructions advertised by the server to the gateway context. See [server instructions and remote skills](#server-instructions-and-remote-skills). |
| `allowRemoteSkills` | `boolean` | `true` | Imports verified remote skills from servers that advertise the skills extension. See [server instructions and remote skills](#server-instructions-and-remote-skills). |

If your server targets MCP `2026-07-28`, see [Stateless MCP: migrating off Mcp-Session-Id](https://aivax.net/blog/mcp-stateless-core-moves-session-state-into-your-application/) for how it interacts with this gateway.

## Server instructions and remote skills

Use these options when a trusted MCP server should add instructions or skills to the gateway. Each MCP source accepts `allowClientInstructions` and `allowRemoteSkills`. Both are enabled by default. Set either option to `false` to exclude that content.

Only connect servers whose content you trust:

- Server instructions are added to the gateway context.
- Remote skills become available through `read_skill` alongside your account skills.

To be imported, a server must advertise the `resources` capability and the `io.modelcontextprotocol/skills` extension when the connection is initialized. Remote skills never replace your account skills or same-named skills from another source.

For how skill discovery, verification and activation are split between server and host, and which clients support it, see [MCP skills vs tools](https://aivax.net/blog/mcp-skills-extension-workflows/).

Only each skill's root `SKILL.md` is imported, and it must match the content the server advertised. Supporting files and scripts are not imported, and skill frontmatter does not grant tool permissions: your existing tool policies still apply. Disable remote skills if you need per-skill approval.

Before connecting a third-party server, review [MCP server security best practices for third-party servers](https://aivax.net/blog/mcp-is-a-trust-boundary-not-just-a-tool-catalog/), which covers tool poisoning, credentials, worker-based blocking and server-side approval.

The same options apply to MCP sources added by gateway workers.

## Metadata sent with MCP requests

Use this section when your MCP server must identify the calling context or receive application values with a request.

AIVAX adds the calling context in `params._meta` to every request and notification it sends to the server: `initialize`, `notifications/initialized`, `tools/list`, `skills/list`, `resources/read`, and `tools/call`.

- In `tools/call`, arguments contain the tool input.
- Metadata identifies the calling context and carries application-supplied values.

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

These fields identify the calling context. All paths below are relative to `params._meta`. Names beginning with `_aiv` are reserved; do not use them for custom metadata.

| Field | JSON type | Meaning and availability |
| --- | --- | --- |
| `_aiv_nonce` | `string` or `null` | BCrypt hash derived from the calling account's hook key. Without a configured hook key, its value is `null`. Verify the configured plain-text hook key against this hash as described in [hook authentication](https://docs.aivax.net/docs/authentication.md#hook-authentication); do not compare hash strings or expect the hook key itself. |
| `_aiv_external_user_id` | `string` or `null` | External user identifier carried by the inference context. For chat clients it comes from the session; for chat completions it comes from the request's `user` field. It can be `null` when no user was identified. Use it to look up the user in your application, not as an AIVAX account ID or proof of authorization. |
| `_aiv_call_source` | `string` | Origin of the inference, not the outbound tool transport. An MCP tool called during web chat inference still receives `WebChatClient`, not `McpClient`. See the values below. |
| `_aiv_conversation_token` | `string` or `null` | Conversation correlation token. For chat completions, it is the request's `conversation_token`, or the token AIVAX generated when none was sent. It can be `null`. It is not a credential or a unique tool-call ID; calls in the same conversation can share it. |
| `_aiv_moment` | `string` | ISO 8601 timestamp, with a UTC offset, of when AIVAX sent the request. It is not the user's local time. |

### Call source values

Use the source to route and diagnose the call, not to authorize it. The same string values are used by protocol functions in `context.callSource`:

| Value | Inference origin |
| --- | --- |
| `WebChatClient` | AIVAX web chat client. |
| `ChatCompletionsApi` | OpenAI-compatible chat completions API; the default origin for that API. |
| `FunctionsApi` | Functions API. |
| `IntegrationBot` | Messaging integration bot. |
| `OpenWebUiClient` | Open WebUI client. |
| `McpClient` | Inference initiated through an MCP client. |
| `ValidationApi` | Agentic test validation. |

Consumers should tolerate future source values.

### Custom metadata and security

Custom inference metadata is a map of string keys to string values. It comes from request `metadata` for chat completions or session metadata for chat clients, including sessions created by messaging integrations.

AIVAX copies these entries directly into `params._meta`. Custom keys beginning with `_aiv` are ignored. In the example, `tenant_id` and `request_id` are application-defined. There is no nested `metadata` object in the MCP envelope.

Before you rely on metadata:

- Do not send secrets in custom metadata. These values are forwarded to the remote tool server.
- Validate tenant and user access against your own trusted records before using metadata to select data or perform writes.
- Do not treat an external user ID, a conversation token, or a call-source label as permission by itself.
- Treat the nonce as proof of the configured account hook key only. It is not a signature of the arguments, a unique request ID, or a replay-prevention mechanism.
- Keep HTTPS and the MCP server's configured authentication headers.
- Apply your own authorization and duplicate-operation controls.
- If your server requires nonce authentication, reject a missing or invalid nonce.

For the equivalent HTTP callback envelope, see [protocol function context](https://docs.aivax.net/docs/tools/protocol-functions.md#context-fields).

## Tool results

A tool result is what the MCP server returns after a call. AIVAX adds supported blocks back into the conversation so the model can continue.

- Text is added directly to the tool result.
- Image and audio blocks are attached back into the conversation as multimodal content with generated IDs.
- Unsupported content block types are reported as unsupported text.

If something goes wrong, check the symptom:

- **The tool does not appear for the model:** verify that the remote server is reachable, supports Streamable HTTP, has the correct authentication headers, and is configured as an MCP source in the gateway.
- **The tool appears but is not called:** review the name, description, and schema.
- **The tool is called with bad arguments:** restrict the JSON Schema and include property descriptions.
- **The call fails:** make the MCP server return readable errors so the model can decide whether to try another argument, ask the user for information, or stop the action.
