---
{title: Tool Explanations,linkTitle: Tool explanations,weight: 30,group: Response rendering}
---

# Tool explanations

Use tool explanations when your client shows users why a server-side tool is running. The setting can also be stored on an [AI Gateway](/docs/inference/ai-gateways/concepts.md#tool-explanations) as `toolInvocationExplanations`. Set `tool_invocation_explanations: true` to ask AIVAX to include explanation fields in server-side tool arguments. When the model supplies `_tool_reason` and `_tool_goal`, `servertool.explanation` contains a client-friendly copy:

```json
{
    "model": "@x-ai/grok-4.3",
    "messages": [
        {
            "role": "user",
            "content": "What's the weather forecast for today?"
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true
}
```

Example stream event:

```json
{
    "choices": [],
    "servertool": {
        "name": "web_search",
        "id": "call-example-id-0",
        "contents": "{\"query\":\"weather forecast today\",\"_tool_reason\":\"Searching for today's weather forecast online\",\"_tool_goal\":\"I need current weather information to answer accurately.\"}",
        "state": "Created",
        "explanation": {
            "reason": "Searching for today's weather forecast online",
            "goal": "I need current weather information to answer accurately."
        }
    },
    "usage": null
}
```

`state` is `Created` when the tool call starts, then `Completed` or `Failed` when it ends. All events of one call share the same `id`, so render them as a single status row that changes state. `explanation` is `null` when the model did not supply both fields; fall back to the tool name in that case.

Show `reason` as the status label, such as "Searching for today's weather forecast online". `goal` is useful in an expanded or audit view. Do not show `contents` to end users unless the surface is built for technical inspection, because it contains the raw tool arguments.
