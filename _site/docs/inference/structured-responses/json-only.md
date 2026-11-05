Source: https://docs.aivax.net/docs/inference/structured-responses/json-only.html

# JSON-only responses

Set `json_only: true` when the client should receive only the generated JSON:

```json
{
    "model": "@openai/gpt-4o",
    "messages": [
        {
            "role": "user",
            "content": "List 3 European capitals."
        }
    ],
    "response_schema": {
        "type": "object",
        "properties": {
            "capitals": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "city": { "type": "string" },
                        "country": { "type": "string" }
                    },
                    "required": ["city", "country"]
                }
            }
        },
        "required": ["capitals"]
    },
    "json_only": true
}
```

With `stream: false`, the HTTP response body is the final JSON with `Content-Type: application/json`. With `stream: true`, AIVAX sends the complete JSON as one SSE data event and then sends `[DONE]`.
