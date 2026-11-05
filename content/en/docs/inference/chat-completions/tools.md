---
{title: Tools,linkTitle: Tools,weight: 70,group: Inference}
---

# Tools

Tools let the model request actions and data. AIVAX supports two execution models, and one request can use both:

| | Client-side tools | Server-side tools |
| --- | --- | --- |
| Defined by | `tools` in the request or in the gateway | Gateway MCP sources, protocol functions, skills, shell, and built-in tools; `builtin_tools` in the request |
| Executed by | Your application | AIVAX |
| Returned to you | As `tool_calls`, which end the response | As `servertool` events while streaming; the final answer includes their effect |
| Results | Your application sends them back as `tool` messages | AIVAX adds them to the conversation and continues |

Use client-side tools when the action must run in your application, for example because it needs the user's local state or a credential that must not leave your system. Use server-side tools when AIVAX can perform the action, so a single request completes the whole task. See [MCP and protocol functions](mcp-and-protocol-functions.md) and [Built-in tools](built-in-tools.md).

## Client-side tools

Define client-side tools with the OpenAI `tools` format:

```json
{
    "model": "@openai/gpt-5-mini",
    "messages": [
        {
            "role": "user",
            "content": "What's the weather in Lisbon?"
        }
    ],
    "tools": [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Returns the current weather for a city.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": { "type": "string" }
                    },
                    "required": ["city"]
                }
            }
        }
    ]
}
```

When the model calls a client-side tool, the response ends with `finish_reason: "tool_calls"`, and the calls are returned in `choices[].message.tool_calls`, or as `delta.tool_calls` when streaming. Run each call, then send the assistant message with its `tool_calls` and one `tool` message per call, using the same `tool_call_id`:

```json
{
    "model": "@openai/gpt-5-mini",
    "conversation_token": "weather-thread-7",
    "messages": [
        { "role": "user", "content": "What's the weather in Lisbon?" },
        {
            "role": "assistant",
            "content": null,
            "tool_calls": [
                {
                    "id": "call_abc123",
                    "type": "function",
                    "function": { "name": "get_weather", "arguments": "{\"city\":\"Lisbon\"}" }
                }
            ]
        },
        {
            "role": "tool",
            "tool_call_id": "call_abc123",
            "content": "{\"temperature\":21,\"condition\":\"sunny\"}"
        }
    ],
    "tools": [ "..." ]
}
```

Send the same `tools` definitions again in the follow-up request. `tool_choice` and `parallel_tool_calls` are forwarded to the provider when the model supports them.

Tools defined in the gateway's raw `tools` parameter behave the same way: they are sent to the model, and your client runs them.

## Mixing client-side and server-side tools

In one request, AIVAX runs the server-side tools the model calls and continues generating. When the model calls a client-side tool, the response ends and returns those calls to you; any server-side tools requested in the same step have already run. After you send the client tool results, send the same `conversation_token` so the model still sees the server-side results of earlier steps; see [Session reuse](session-reuse.md).

## Requirements

- The model must support function calling. For a model without reliable native tool calling, a gateway can use a [tool handler](/docs/inference/ai-gateways/concepts.md#tool-handler).
- Tool names must be unique across all tools of the request. The names `shell` and `read_skill` are reserved when the gateway uses the shell.
- Public API keys can send `tools`, but the gateway's server-side tools are not used; see [Limits](limits.md#public-api-keys).

Every tool adds its name, description, and schema to the input of each request. Expose only the tools the task needs, and give them specific names and restrictive schemas; see [Choosing the function name](/docs/tools/mcp.md#choosing-the-function-name).
