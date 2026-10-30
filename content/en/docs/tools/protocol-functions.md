---
{title: Protocol Functions,linkTitle: Protocol functions,weight: 30,group: Tools}
---

# Protocol Functions

Protocol functions are AIVAX server-side tools. The model requests a named action, and AIVAX executes it from the server by calling your HTTP callback or an internal AIVAX callback URL.

Use them when an assistant needs a controlled way to interact with your application, such as checking an order, opening a support ticket, or querying a private service. The model sees the tool name, description, and JSON argument schema. It does not see the callback URL or headers.

<img src="/assets/diagrams/protocol-functions-1.drawio.svg">

A protocol function has two contracts:

- **The model contract:** the public tool name, description, and JSON Schema that guide the model's tool call.
- **The callback contract:** the hidden URL and optional headers that AIVAX uses to execute the tool after the model calls it.

This separation keeps implementation details out of the prompt while still giving the model a precise capability to use.

## When to use protocol functions

Use protocol functions to expose a specific HTTP action to an AI Gateway without building a full MCP server. They fit point integrations, such as fetching a user, registering a lead, or invoking an internal automation. AIVAX keeps the URL hidden from the model, sends the request from the server side, and adds the textual result to the conversation context.

Protocol functions sit between other tool types: they are simpler than [MCP](/docs/tools/mcp) and more specific than [workers](/docs/inference/workers), while still giving the model a controlled tool for an external action. Use this rule of thumb:

| Need | Prefer |
|---|---|
| One or a few stable HTTP callbacks owned by your app | Protocol functions |
| A larger tool catalog, standardized discovery, or an existing MCP server | [MCP](/docs/tools/mcp) |
| Web search, URL reading, code execution, image generation, memory, or HTTP request tools maintained by AIVAX | [Built-in tools](/docs/tools/builtin-tools) |
| Event-time policy, message rewriting, dynamic tool injection, or blocking a tool call before execution | [Workers](/docs/inference/workers) |
| Provider-native tool definitions that your own client will execute | Raw `tools` in an OpenAI-compatible request |

Every protocol function has four parts:

- **Name**: helps the model recognize the action. It must be a valid JavaScript identifier with at least three characters.
- **Description**: tells the model when to call the function.
- **Argument schema** (`contentFormat`): limits the format of the arguments.
- **Callback URL** (`callbackUrl`): where AIVAX sends the call. The model never sees it or its authentication details.

Because the callback stays hidden, you can create specialized tools without exposing internal endpoints. Your service must still validate the `X-Request-Nonce`, validate the received arguments, and apply its own authorization when the call depends on the user.

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

In the snippet above, the gateway exposes `list_clients` and `view_client` to the model. The model decides whether to call one of them during generation. If it calls `view_client`, AIVAX validates the arguments against `contentFormat`, then sends the callback request to your service, as described in [Handling function calls](#handling-function-calls).

> [!IMPORTANT]
>
> Every function definition, including its name, description, and schema, consumes input tokens. The more functions you define, the more input tokens you consume.

## Protocol function sources

Protocol function sources let a gateway load its protocol functions from one or more remote endpoints instead of storing every function inline. Use sources when the function catalog belongs to another service, changes independently from the gateway, or is shared by multiple gateways.

- Use inline `protocolFunctions` for stable, gateway-owned tools.
- Use `protocolFunctionSources` for remotely managed catalogs. It is an array of URL strings, not an array of source objects.

You can use both in the same gateway. Function names must remain unique after inline functions, sourced functions, MCP tools, built-in tools, and raw tools are combined.

Each source URL is an HTTP endpoint that returns a JSON object with a `functions` array. AIVAX fetches the source before preparing the inference options and converts each returned definition into a server-side tool. The result is cached for 10 minutes per account and source URL; during that window, AIVAX reuses the definitions instead of making another listing request.

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

## Handling function calls

When the model calls a function, inline or sourced, AIVAX sends an HTTP `POST` request to its `callbackUrl` with `Content-Type: application/json` and a body equivalent to:

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
        "externalUserId": "<EXTERNAL_USER_ID>",
        "metadata": {
            "tenant_id": "<TENANT_ID>",
            "request_id": "<APPLICATION_REQUEST_ID>"
        },
        "callSource": "WebChatClient",
        "conversationToken": "<CONVERSATION_TOKEN>",
        "moment": "2025-05-18T03:36:27+00:00"
    }
}
```

`function.content` holds the model-generated arguments, and `context` describes the inference that triggered the call.

Your callback must return a successful HTTP status (2xx), even when the assistant made a mistake in the call. A non-success response is logged, and the model receives a generic tool-call error instead of your response body.

### Context fields

AIVAX builds `context` separately from the model-generated arguments in `function.content`. Your callback should validate the arguments against the function schema and use context to correlate the request with your application. Context is not an additional set of model-selected function arguments.

| Field | JSON type | Meaning and availability |
| --- | --- | --- |
| `context.externalUserId` | `string` or `null` | External user identifier from the inference context. For a [chat session](/docs/inference/chat-clients), this is the session's external user ID; for chat completions, it comes from the request's `user` field. It can be `null` when no user was identified. It is not an AIVAX account ID or an authentication credential. |
| `context.metadata` | `object` | Application-supplied string key/value pairs from the inference request or chat session. For chat completions, these are the request's `metadata` entries. The object is empty (`{}`) when none are supplied. The example's `tenant_id` and `request_id` are custom fields, not names generated by AIVAX. |
| `context.callSource` | `string` | Origin of the inference, such as `WebChatClient`, `ChatCompletionsApi`, or `IntegrationBot`. It does not describe the callback transport: calling a protocol function does not automatically make the value `FunctionsApi`. See the shared [call source values](/docs/tools/mcp#call-source-values) for all current values. |
| `context.conversationToken` | `string` or `null` | Conversation correlation token carried by the session or inference request. For chat completions, it comes from `idempotency_key` when supplied. It can be `null`, and multiple function calls may share it. Do not treat it as a unique callback ID, a credential, or a guarantee that an operation has not already run. |
| `context.moment` | `string` | JSON date-time timestamp created when AIVAX prepares the callback, using the server's local clock. It is not the user's local time or the conversation start time. Parse it as a date-time with its UTC offset rather than relying on a fixed fractional-second precision; convert to your application's timezone when needed. |

Custom metadata stays nested under `context.metadata`; it is not merged into `context`. This differs from [MCP metadata](/docs/tools/mcp#metadata-sent-with-tool-calls), where the same custom entries sit alongside reserved `_aiv_*` fields in `params._meta`.

The authentication nonce is **not** a `context` or `metadata` field. Protocol functions receive it in the `X-Request-Nonce` HTTP header when the account has a hook key. MCP tool calls carry the equivalent value in `params._meta._aiv_nonce` instead. These context fields describe execution POST requests; do not assume that function source-listing requests have this JSON body.

### Response format

Return a textual response body. AIVAX attaches it to the conversation as the function result exactly as your endpoint returns it. No JSON structure is required, but a short, human-readable answer is easiest for the assistant to use.

Write the response for the model, not for the end user. It may contain data, warnings, and short instructions on how to use the result. For example:

- If an order search finds the order, return its status, expected date, and relevant restrictions.
- If the order is not found, say so and indicate which data the assistant should ask the user for.

Expected errors, such as a client ID that does not exist or a field in the wrong format, are common. Return them with a 2xx status and describe the error and how the assistant can work around it in the response body.

Avoid returning huge objects, HTML, raw logs, or internal messages. This content enters the context and can confuse the next response.

AIVAX validates arguments against the JSON Schema before execution. Your callback should still validate them, because a schema limits structure but cannot replace business authorization or consistency checks. Functions that take no arguments should use an empty object schema.

### Authentication

Request authentication is done via the `X-Request-Nonce` header sent in protocol function calls and source-listing requests.

See the [authentication](/docs/authentication) manual to understand how to authenticate reverse requests from AIVAX.

### User authentication

Use `context.externalUserId` to look up the caller in your application, then check whether that user may access the requested resource or perform the requested action. If a function requires an identified user, reject calls without a usable identifier rather than silently granting anonymous access.

Validate the nonce and enforce your own user and tenant authorization rules. Request and session metadata can contain caller-supplied values: a `tenant_id`, `callSource`, or `conversationToken` is not proof of permission. Avoid putting secrets in metadata because it is forwarded to your callback. The nonce verifies the account hook key, not the individual user's permissions, and does not sign the body or prevent replay; use your own duplicate-operation controls for writes. For a worked pattern that derives an operation key and returns the stored result on repeats, see [how to make LLM tool calls idempotent](https://aivax.net/blog/make-llm-tool-calls-idempotent-protocol-functions/).

### Security considerations

The model sees only the function's name, description, and argument schema. It cannot see the callback endpoint or the callback headers configured for the function. Treat all callback requests as privileged server-to-server calls: validate the nonce, validate arguments, enforce authorization, and avoid exposing broad write actions unless your application has its own approval rules.

## Specialist functions

Specialist functions are protocol functions whose callback is an AIVAX capability instead of your own endpoint. Unlike [built-in tools](/docs/tools/builtin-tools), you name and describe them yourself, so you can point several functions at different resources in your AIVAX account.

Define a specialist function by setting `callbackUrl` to an `aivax://` URL:

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

This function lets the model query a specific [document collection](/docs/rag/collections). Its description tells the assistant what to search in that collection and what to expect back. Define one function per collection to give an assistant several sources of specialist content.

The JSON Schema structure of a specialist function is fixed, but you can customize its property descriptions. Specialist function settings are passed as query parameters in the URL.

Currently, only one specialist function exists:

- `query-collection`: performs a RAG search on a specified collection.

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
