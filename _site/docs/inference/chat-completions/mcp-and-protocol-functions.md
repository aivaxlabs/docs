Source: https://docs.aivax.net/docs/inference/chat-completions/mcp-and-protocol-functions.html

# MCP and protocol functions in inference

MCP tools and protocol functions are server-side tools that call your systems. AIVAX lists or loads their definitions, offers them to the model, and calls your server when the model selects one. Your client application does not run them and does not see their calls as messages.

| | [MCP sources](https://docs.aivax.net/docs/tools/mcp.md) | [Protocol functions](https://docs.aivax.net/docs/tools/protocol-functions.md) |
| --- | --- | --- |
| What you run | An MCP server with Streamable HTTP | An HTTP endpoint per function, or a source URL that lists functions |
| Tool definitions | Discovered from the server's tool list | Declared in the gateway, or returned by a function source |
| Results | Text, images, and audio | Text |
| Best for | Catalogs of tools, systems that already speak MCP, tools shared by several agents | One or a few specific actions |

## Where to configure them

MCP sources and protocol functions are configured on an [AI Gateway](https://docs.aivax.net/docs/inference/ai-gateways/concepts.md#tools). The `chat/completions` request has no field to add them, so call the gateway by its ID or slug to use them.

A [worker](https://docs.aivax.net/docs/inference/workers.md) can add an MCP source or a tool for a single request during the `message.received` event. Use it when the available tools depend on the user, such as tools scoped to the user's account.

## What happens during the request

1. Before the model runs, AIVAX loads the tool definitions. MCP tool lists and function sources are cached; see [Caching](https://docs.aivax.net/docs/inference/chat-completions/caching.md#remote-definitions).
2. When the model calls one of these tools, AIVAX calls your server with the arguments.
3. The result is added to the conversation, and the model continues.
4. With streaming, each call produces `servertool` events with the states `Created`, then `Completed` or `Failed`; see [Streaming](https://docs.aivax.net/docs/inference/chat-completions/streaming.md#server-side-tool-events).

The tool calls and results are not returned as messages. Send the same `conversation_token` on the next turn so the model keeps their results; see [Server-side context](https://docs.aivax.net/docs/inference/chat-completions/server-side-context.md).

Return clear error text from your tool when an action cannot be completed, so the model can explain the failure or try another path. A [worker](https://docs.aivax.net/docs/inference/workers.md) can replace the result of a tool call through the `tool.called` event.

## Public keys

Requests authenticated with a public API key do not use the gateway's MCP sources or protocol functions. Call a gateway with these tools from your server with a private key, or through a [chat client](https://docs.aivax.net/docs/inference/chat-clients/overview.md).
