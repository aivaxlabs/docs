Source: https://docs.aivax.net/docs/inference/chat-completions/structured-output.html

# Structured output

Use structured responses when your application needs JSON output that matches a schema. AIVAX supports them through `response_schema`, `response_format`, and `json_only`.

```json
{
    "model": "@google/gemini-3.8-flash",
    "prompt": "Search for recent news about electric vehicles.",
    "stream": true,
    "builtin_tools": {
        "tools": [
            "WebSearch"
        ],
        "options": {
            "web_search_mode": "full"
        }
    },
    "response_schema": {
        "type": "object",
        "properties": {
            "news": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "News title"
                        },
                        "summary": {
                            "type": "string",
                            "description": "News summary"
                        }
                    },
                    "required": ["title", "summary"]
                }
            }
        },
        "required": ["news"]
    }
}
```

`response_schema` enables JSON Healing. AIVAX asks the model for JSON, extracts JSON from the generated text or markdown blocks, validates it against the schema, and retries with validation feedback until the output is valid or the attempt limit is reached.


If your application cannot parse or validate the result, follow the [invalid JSON troubleshooting guide](https://aivax.net/blog/structured-output-healing-boundary/) before increasing the retry budget.

## Choose a field

| Field | Validation | Use when |
| --- | --- | --- |
| `response_schema` | AIVAX validates the output and retries with feedback ([JSON Healing](https://docs.aivax.net/docs/inference/structured-responses/json-healing.md)). | Any model, including models without native structured output, and responses that use tools before the JSON. |
| `response_format` with `json_schema` | The provider enforces the schema natively; AIVAX also heals when `healing_options` is set or automatic JSON Healing is enabled on the account. | The model supports native structured output and you want the provider to constrain generation. |
| `json_only` | Returns only the final JSON, without the chat completion envelope. | The consumer is a program that expects a bare JSON body; see [JSON-only](https://docs.aivax.net/docs/inference/structured-responses/json-only.md). |

With tools or reasoning, the model can call tools and reason first; the JSON is extracted from the final answer only. See [Reasoning and tools](https://docs.aivax.net/docs/inference/structured-responses/reasoning-and-tools.md).

Structured output fields are not available with public API keys. When the attempt limit is reached, the request fails with `503 Service Unavailable`; see [JSON Healing](https://docs.aivax.net/docs/inference/structured-responses/json-healing.md#when-healing-fails).
