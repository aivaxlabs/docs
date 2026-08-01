# Inference MCP

The Inference MCP exposes an AIVAX integrated model or AI Gateway as a tool for compatible MCP clients. Use it when another model, agent, IDE, or desktop assistant should call the configured AIVAX model or gateway as a sub-agent.

For information about configuring models, instructions, RAG, tools, and workers on the underlying gateway, see [AI Gateways](/docs/inference/ai-gateway).

## Endpoint

```text
https://inference.aivax.net/v1/mcp/inference
```

## Headers

| Header | Description | Required |
| --- | --- | --- |
| `Authorization` | Bearer token for your AIVAX API key. | Yes |
| `X-Mcp-Model-Name` | Integrated model tag, gateway full ID, or gateway slug. | Yes |
| `X-Mcp-Tool-Name` | Base tool name. AIVAX converts it to identifier format and exposes `invoke_{tool_name}`. | No, defaults to `ai_model` |
| `X-Mcp-Tool-Description` | Description shown to the MCP client. | No |
| `X-Mcp-Tool-Title` | Friendly title shown to the MCP client. | No |
| `X-Mcp-User` | External user ID stored in the inference context. | No |

## Configuration example

```json
{
  "servers": {
    "my-ai-gateway-mcp": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/inference",
      "headers": {
        "Authorization": "Bearer <AIVAX_API_KEY>",
        "X-Mcp-Model-Name": "<MODEL_TAG_OR_GATEWAY_ID>",
        "X-Mcp-Tool-Name": "data_assistant",
        "X-Mcp-Tool-Description": "Use this tool to invoke the specialized assistant for data analysis.",
        "X-Mcp-Tool-Title": "Data Analysis Assistant"
      }
    }
  }
}
```

The generated MCP tool accepts one argument:

| Parameter | Type | Description |
| --- | --- | --- |
| `prompt` | string | Prompt sent to the configured model or gateway. |

The MCP tool returns the gateway response as text and shares the same inference billing and rate-limit path as the underlying chat completion.
