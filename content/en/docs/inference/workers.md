---
{title: Gateway Workers,linkTitle: Gateway Workers,weight: 70,group: Inference}
---

# Gateway Workers

Gateway Workers are HTTP hooks that let your service control an AI Gateway while a request is running. Use one when a rule has to be decided outside the prompt.

A worker can:

- allow an event;
- stop an event;
- rewrite context;
- add instructions or tools;
- replace a server-side tool result.

Use a worker when the decision depends on your own systems. Typical cases:

- subscription checks;
- CRM enrichment;
- tenant-specific policy;
- audit logging;
- dynamic tool blocking;
- replacing a model-visible tool result with data from an internal system.

Workers run on the path of every inference they handle. Each event adds an HTTP request before the gateway can continue, so keep the endpoint fast and predictable.

## Request format

The request is the event AIVAX posts to your worker. It arrives when a configured worker event fires, before the gateway continues.

AIVAX sends this `POST` to the gateway's worker URL:

```json
{
    "gatewayId": "your-gateway-id",
    "moment": "2025-12-29T17:04:39",
    "event": {
        "name": "message.received",
        "data": {
            "messages": [
                {
                    "role": "user",
                    "content": "Good morning"
                }
            ],
            "origin": "ChatCompletionsApi",
            "externalUserId": "customer-123",
            "metadata": {}
        }
    }
}
```

Read the body before you act:

1. Validate `gatewayId` when one endpoint serves more than one gateway.
2. Branch on `event.name`.
3. Read `event.data`. The exact shape depends on the event.

Treat the JSON above as the envelope. Do not assume every event carries the same `data` fields.

## Authentication

Use the nonce to confirm that AIVAX sent the request. Validate it before you trust the body, especially when the worker releases private data, changes context, or authorizes tool use.

When the account has a hook key, AIVAX sends `X-Request-Nonce`. The nonce is a BCrypt hash derived from the account hook key.

Treat these fields as untrusted input:

- `externalUserId`
- `metadata`
- messages
- tool arguments

## Response behavior

The response tells AIVAX whether to continue, stop, or apply an action. Choose it on purpose: optional enrichment can fail open, and an authorization or compliance check should fail closed.

After AIVAX sends the request, it handles your response as follows:

| Response | Behavior |
|---|---|
| `Content-Type: application/json+worker-action` | Execute the action described in the JSON body. |
| `2xx` without `application/json+worker-action` | Continue normally. |
| Non-OK response without `application/json+worker-action` | Stop the event. |

If the worker request fails with an HTTP request exception, AIVAX logs the failure and stops the event.

### When to continue or stop

Use the status that matches the risk:

1. Return `Content-Type: application/json+worker-action` when AIVAX should apply the JSON action.
2. Return `2xx` without that content type when the worker only adds optional enrichment, or when your logic has nothing to add. The conversation continues.
3. Return a non-OK response without that content type when authorization, compliance, or business policy cannot fail open. AIVAX stops the event.

## `message.received`

`message.received` is the hook for the prepared prompt. Use it to inspect, rewrite, or stop the context before the model runs. It fires after the gateway prepares the incoming message context and before the model call.

```json
{
    "name": "message.received",
    "data": {
        "messages": [],
        "origin": "ChatCompletionsApi",
        "externalUserId": "customer-123",
        "metadata": {}
    }
}
```

To change the context, return `Content-Type: application/json+worker-action` with `type: "message.received.response"`. Return `2xx` with no action when the message can continue unchanged. This example adds one system instruction:

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "add-system",
                "message": "Answer in formal English."
            }
        ]
    }
}
```

Use a rewrite when the prepared context is not what the model should see. Available actions:

| Action | Description | Parameters |
|---|---|---|
| `clear` | Removes context elements. | `argument`: `messages`, `meta`, `system`, `tools`, `skills`, `all`, or omitted. |
| `add-message` | Adds a message to the conversation. | `message`: OpenAI-compatible message object. |
| `remove-message` | Removes a message by index. | `index`: zero-based message index. |
| `add-system` | Adds a system instruction. | `message`: instruction text. |
| `add-tool` | Adds an OpenAI-compatible tool definition. | `tool`: tool JSON object. |
| `add-protocol-tool` | Adds a [protocol function](/docs/tools/protocol-functions). | `tool`: protocol function definition. |
| `add-mcp-source` | Adds the tools discovered from an [MCP](/docs/tools/mcp) source to the context. | `source`: MCP source object with `url`, `headers`, `name`, and/or `cacheDuration`. |

### Replace the user context

Use this pattern when policy should replace the original user input. The example runs `clear`, then adds a replacement message, so the model answers the policy message instead of the original input:

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "clear"
            },
            {
                "type": "add-message",
                "message": {
                    "role": "user",
                    "content": "The original message was removed by an external policy check. Tell the user they need an active subscription to continue."
                }
            }
        ]
    }
}
```

### Remove a message

Use `remove-message` when one message should leave the context and the rest should stay. This example removes the first message, using its zero-based index:

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "remove-message",
                "index": 0
            }
        ]
    }
}
```

### Add a temporary MCP source

Use `add-mcp-source` when the tool list must depend on this message, user, channel, or an external policy, and only for the current inference. This example exposes the tools of an internal MCP server:

```json
{
    "type": "message.received.response",
    "data": {
        "rewrites": [
            {
                "type": "add-mcp-source",
                "source": {
                    "name": "Internal CRM",
                    "url": "https://crm.example.com/mcp",
                    "headers": {
                        "Authorization": "Bearer <INTERNAL_CRM_TOKEN>"
                    },
                    "cacheDuration": 600
                }
            }
        ]
    }
}
```

For this inference only, AIVAX:

1. Lists the tools from the MCP server.
2. Converts each schema into a model-callable function.
3. Makes those tools available only for that inference.

For a source that should stay on the gateway, configure MCP directly in the AI Gateway.

## `tool.called`

`tool.called` is the hook for an internal server-side tool. Use it to allow the call, block it, or replace the result the model will see. The event fires before AIVAX executes that tool.

```json
{
    "name": "tool.called",
    "data": {
        "toolName": "check_order",
        "toolArguments": {
            "order_id": "A123"
        },
        "origin": "ChatCompletionsApi",
        "externalUserId": "customer-123",
        "metadata": {}
    }
}
```

Choose one outcome:

1. Return a non-OK response to block the tool call.
2. Return `2xx` to let AIVAX execute the tool normally.
3. Return `Content-Type: application/json+worker-action` with `type: "tool.called.response"` to replace the tool result:

```json
{
    "type": "tool.called.response",
    "data": {
        "result": "Order A123 is paid and scheduled for delivery tomorrow.",
        "messages": []
    }
}
```

`result` is the text injected as the tool result. `messages` is optional and attaches extra OpenAI-format messages to the conversation context. Fields of `data`:

| Field | Description |
|---|---|
| `result` | Textual content injected as the tool result. |
| `messages` | Optional additional OpenAI-format messages attached to the conversation context. |

When you return `tool.called.response`, AIVAX uses the worker-provided result instead of executing the default tool handler.

## Example: blocking unauthorized users

Use this pattern when only an allow list of external users may reach one gateway. The example is a Cloudflare Worker. It stops `message.received` for everyone else and lets other gateways and events continue.

The worker decides in this order:

1. Reject methods other than `POST`.
2. Return an empty `2xx` for any other gateway, so that call continues.
3. Return an empty `2xx` for any other event.
4. Return `403` when `externalUserId` is outside the allow list. That stops `message.received`.
5. Return an empty `2xx` for an allowed user, so the gateway continues.

```js
export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const body = await request.json();

    if (body.gatewayId !== env.CHECKING_GATEWAY_ID) {
      return new Response();
    }

    if (body.event?.name !== "message.received") {
      return new Response();
    }

    const externalUserId = body.event.data.externalUserId;
    const allowedUsers = new Set((env.ALLOWED_USERS || "").split(","));

    if (!allowedUsers.has(externalUserId)) {
      return new Response("User is not authorized", { status: 403 });
    }

    return new Response();
  }
};
```

## Example: replacing a tool with an internal system

Use this pattern when the model should see a tool result, but the data should come from your system instead of the default tool handler. The example replaces `check_order` and lets every other event continue.

```js
export default {
  async fetch(request, env) {
    const body = await request.json();

    if (body.event?.name !== "tool.called") {
      return new Response();
    }

    const { toolName, toolArguments, externalUserId } = body.event.data;

    if (toolName !== "check_order") {
      return new Response();
    }

    const orderId = toolArguments?.order_id;
    const orderResponse = await fetch(`${env.INTERNAL_API}/orders/${orderId}`, {
      headers: {
        "Authorization": `Bearer ${env.INTERNAL_API_TOKEN}`
      }
    });

    if (!orderResponse.ok) {
      return new Response(JSON.stringify({
        type: "tool.called.response",
        data: {
          result: `The order ${orderId} could not be retrieved for user ${externalUserId}. Ask the user to confirm the order number.`
        }
      }), {
        headers: {
          "Content-Type": "application/json+worker-action"
        }
      });
    }

    const order = await orderResponse.json();

    return new Response(JSON.stringify({
      type: "tool.called.response",
      data: {
        result: `Order ${order.id}: status ${order.status}, estimated delivery ${order.eta}.`
      }
    }), {
      headers: {
        "Content-Type": "application/json+worker-action"
      }
    });
  }
};
```

This pattern keeps the internal API off the model context. The worker remains responsible for:

1. Authenticating the request.
2. Validating the user.
3. Calling the internal system.
4. Deciding how much data can return to the model context.

For how workers fit into gateway execution, see [Pipelines](/docs/inference/pipelines).
