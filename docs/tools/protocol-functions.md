# Protocol Functions

Protocol functions are AIVAX server-side tools. They let a model request a named action while AIVAX executes the action from the server by calling your HTTP callback or an internal AIVAX callback URL.

Use them when an assistant needs a controlled way to interact with your application, such as checking an order, opening a support ticket, validating a coupon, registering a lead, or querying a private service. The model sees the tool name, description, and JSON argument schema. It does not see the callback URL or headers.

<img src="/assets/diagrams/protocol-functions-1.drawio.svg">

A protocol function has two contracts:

- **The model contract:** the public tool name, description, and JSON Schema that guide the model's tool call.
- **The callback contract:** the hidden URL and optional headers that AIVAX uses to execute the tool after the model calls it.

This separation keeps implementation details out of the prompt while still giving the model a precise capability to use.

## When to use protocol functions

Use protocol functions when you want to expose a specific HTTP action to an AI Gateway without creating a full MCP server. They are good for point integrations, such as checking an order, opening a ticket, fetching a user, validating a coupon, registering a lead, or invoking an internal automation. AIVAX keeps the URL invisible to the model, sends the request from the server side, and adds the textual result to the conversation context.

If you have many tools, dynamic tools, or a system that already implements Model Context Protocol, prefer [MCP](/docs/tools/mcp). If you want to use capabilities already maintained by AIVAX, prefer [built-in tools](/docs/tools/builtin-tools). If you need to make decisions before or after inference events, prefer [workers](/docs/inference/workers). Protocol functions sit in the middle: they are simpler than MCP and more specific than workers, but still give the model a controlled tool to execute an external action.

A protocol function must have a tool name, a description, a callback URL, and an argument schema. The name helps the model recognize the action; the description explains when to call; the schema limits the argument format. Function names must be valid JavaScript identifiers with at least three characters. The callback URL and authentication details are not visible to the model. This allows creating specialized tools without exposing internal endpoints, provided your service validates the `X-Request-Nonce`, validates received arguments, and applies its own authorization when the call depends on the user.

Use the following rule of thumb:

| Need | Prefer |
|---|---|
| One or a few stable HTTP callbacks owned by your app | Protocol functions |
| A larger tool catalog, standardized discovery, or an existing MCP server | [MCP](/docs/tools/mcp) |
| Web search, URL reading, code execution, image generation, memory, calendar, or HTTP request tools maintained by AIVAX | [Built-in tools](/docs/tools/builtin-tools) |
| Event-time policy, message rewriting, dynamic tool injection, or blocking a tool call before execution | [Workers](/docs/inference/workers) |
| Provider-native tool definitions that your own client will execute | Raw `tools` in an OpenAI-compatible request |

### Choosing the function name

The function name should be simple and specific about what the function does. Avoid names that are hard to guess or that do not reflect the function's role, because the assistant may not call the function when it should.

For example, consider a function that queries a user in an external database. Good names include:

- `search_user`
- `query_user`

Weak names include:

- `search` (too broad)
- `query_user_in_database_data` (long and noisy)
- `pesquisa-usuario` (name not in English)
- `search user` (name with improper characters)

Having the function name, we can think about the function description.

### Choosing the function description

The function description should explain what the function does, when the assistant should call it, and when it should not call it. Good descriptions include the expected input, the kind of result returned, and any decision rule the assistant should follow before calling the tool.

For example, a useful description is:

> Use this tool to fetch a customer profile by customer ID when the user asks about account status, recent orders, or support eligibility. Do not call it when the user only provides a name or email; ask for the customer ID first.

That gives the model a clear action, trigger, and limitation. A vague description such as "Search customers" gives the model much less guidance.

## Defining protocol functions

Protocol functions are defined in the [AI Gateway](/docs/inference/ai-gateway). You can declare them directly in the gateway when the list is stable, or provide a remote source that returns the function list when the catalog is managed by another service.

The direct form is the simplest option. Use it when the function list changes rarely and belongs to the gateway configuration itself.

Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20AI%20Gateway&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

```json
{
    "name": "my-ai-gateway",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "@openai/gpt-5-mini",
        "protocolFunctions": [
            {
                "name": "list_clients",
                "description": "Use this tool to list and search for the user's clients.",
                "callbackUrl": "https://my-external-api.com/api/scp/users",
                "contentFormat": {
                    "type": "object",
                    "properties": {}
                }
            },
            {
                "name": "view_client",
                "description": "Use this tool to obtain details and orders of a client via its ID.",
                "callbackUrl": "https://my-external-api.com/api/scp/users",
                "contentFormat": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string",
                            "format": "uuid"
                        }
                    },
                    "required": ["user_id"]
                }
            }
        ]
    }
}
```

In the snippet above, the gateway exposes `list_clients` and `view_client` to the model. The model decides whether to call one of them during generation. If it calls `view_client`, AIVAX validates the arguments against `contentFormat`, then sends the callback request to your service.

## Protocol function sources

Protocol function sources let a gateway load its protocol functions from one or more remote endpoints instead of storing every function inline. In the gateway configuration, `protocolFunctionSources` is an array of URL strings, not an array of source objects. Use sources when the function catalog belongs to another service, changes independently from the gateway, or needs to be shared by multiple gateways.

Each source URL is an HTTP endpoint that returns a JSON object with a `functions` array. AIVAX fetches the source before preparing the inference options, converts each returned definition into a server-side tool, and caches the result for 10 minutes per account and source URL. During the cache window, AIVAX reuses the function definitions instead of making another listing request.

Use inline `protocolFunctions` for stable, gateway-owned tools. Use `protocolFunctionSources` for remotely managed catalogs. You can use both in the same gateway, but function names must remain unique after inline functions, sourced functions, MCP tools, built-in tools, and raw tools are combined.

<img src="/assets/diagrams/protocol-functions-2.drawio.svg">

Define the function listing endpoints in your AI Gateway:

```json
{
    "name": "my-ai-gateway",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "@openai/gpt-5-mini",
        "protocolFunctionSources": [
            "https://my-external-api.com/api/scp/listings"
        ]
    }
}
```

The function source endpoint receives a `GET` request. It must return a successful HTTP status and a JSON object in this format:

<div class="request-item get">
    <span>GET</span>
    <span>
        https://my-external-api.com/api/scp/listings
    </span>
</div>

```json
{
    "functions": [
        {
            "name": "list_clients",
            "description": "Use this tool to list and search for the user's clients.",
            "callbackUrl": "https://my-external-api.com/api/scp/users",
            "contentFormat": {
                "type": "object",
                "properties": {}
            }
        },
        {
            "name": "view_client",
            "description": "Use this tool to obtain details and orders of a client via its ID.",
            "callbackUrl": "https://my-external-api.com/api/scp/users",
            "contentFormat": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "string",
                        "format": "uuid"
                    }
                },
                "required": ["user_id"]
            }
        }
    ]
}
```

The returned function objects use the same shape as inline `protocolFunctions`: `name`, `description`, `callbackUrl`, optional `headers`, and `contentFormat`.

If the source endpoint returns a non-success status, AIVAX logs the error and the inference request fails while preparing the tools. Make the source endpoint fast, stable, and small enough to return only the functions the gateway should expose. If the catalog is user- or tenant-specific, use the request nonce and your own authorization rules to decide which functions to return.

### Handling function calls

Functions are invoked at the provided endpoint in `callbackUrl` via an HTTP POST request. AIVAX sends `Content-Type: application/json` and a body equivalent to:

```json
{
    "type": "tool_call",
    "function": {
        "name": "view_client",
        "content": {
            "user_id": "example-user-id"
        }
    },
    "context": {
        "externalUserId": "...",
        "metadata": {},
        "callSource": "WebChatClient",
        "conversationToken": "...",
        "moment": "2025-05-18T03:36:27"
    }
}
```

The response to this action must return a successful HTTP status (2xx), even for errors the assistant may have made. A non-success response is logged and the model receives a generic tool-call error instead of your response body.

#### Response format

Successful responses should be textual and will be attached as the function response in whatever way the endpoint returns. There is no JSON format or structure for this response, but it is advisable to give a simple, human-readable answer so that the assistant can read the action result.

Errors can be common, such as not finding a client by ID or a field not being in the desired format. In these cases, respond with an OK status and include a human description of the error in the response body and how the assistant can work around it.

Arguments are validated against the JSON Schema before execution. Your callback should still validate received arguments, because schemas can limit structure but cannot replace business authorization or consistency checks. Functions that do not expect arguments should use an empty object schema.

The function response should be written for the model, not for the end user. It may contain data, warnings, and short instructions on how to use the result. For example, if an order search finds the status, respond with the status, expected date, and relevant restrictions. If not found, respond that the order was not located and indicate which data the assistant should ask the user for. Avoid returning huge objects, HTML, raw logs, or internal messages, because this content enters the context and can confuse the next response.

> [!IMPORTANT]
>
> The more functions you define, the more input tokens you will consume in the reasoning process. The function definition, as well as its format, consumes tokens from the reasoning process.

#### Authentication

Request authentication is done via the `X-Request-Nonce` header sent in protocol function calls and source-listing requests.

See the [authentication](/docs/authentication) manual to understand how to authenticate reverse requests from AIVAX.

#### User authentication

Function calls send `$.context.externalUserId` when the call comes from an identified [chat session](/docs/features/chat-clients). They also include `metadata`, `callSource`, `conversationToken`, and `moment`. Use these fields for correlation and user-level authorization, but do not treat them as the only security boundary; validate the nonce and apply your own authorization rules.

#### Security considerations

For the AI model, only the name, description, and format of the function are visible. It cannot see the endpoint the function points to. It also does not receive the callback headers configured for the function. Treat all callback requests as privileged server-to-server calls: validate the nonce, validate arguments, enforce authorization, and avoid exposing broad write actions unless your application has its own approval rules.

## Specialist functions

In addition to [built-in functions](/docs/tools/builtin-tools), you can define specialist functions that perform specific tasks in your AIVAX account.

You define specialist functions using the `aivax://` URL scheme, following the example below:

```json
{
    "name": "my-ai-gateway",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "@openai/gpt-5-mini",
        "protocolFunctions": [
            {
                "name": "search_disease",
                "description": "Use this tool to search for diseases, treatments, and symptoms.",
                "callbackUrl": "aivax://query-collection?collection-id=your-collection-id&top=5&min=0.4",
                "contentFormat": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "Name of the disease, treatment, or symptoms."
                        }
                    },
                    "required": [
                        "query"
                    ]
                }
            }
        ]
    }
}
```

The above function creates a tool for the AI to query a specific [document collection](/docs/rag/collections), guiding the assistant on what to search in that collection and what to expect from a response. This way, you can link multiple RAG collections for an assistant to retrieve specialist content.

You can customize the description of the JSON Schema properties for specialist functions, but their structure is fixed. Specialist function parameters are supplied in the URL via query parameters.

Currently, only one specialist function exists:

- `query-collection`: performs an RAG search on a specified collection.

Query parameters:

- `collection-id`: the UUID of the collection to be searched.
- `top`: a number indicating how many documents should be returned in the search.
- `min`: a decimal indicating the minimum similarity score of the search.
- `refs`: when present, includes referenced parent documents in the RAG result.

Function JSON format:

```json
{
    "type": "object",
    "properties": {
        "query": {
            "type": "string",
            "description": "Search content."
        }
    },
    "required": [
        "query"
    ]
}
```
