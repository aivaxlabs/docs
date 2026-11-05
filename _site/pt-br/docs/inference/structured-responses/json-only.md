Source: https://docs.aivax.net/pt-br/docs/inference/structured-responses/json-only.html

# Respostas apenas em JSON

Defina `json_only: true` quando o cliente deve receber apenas o JSON gerado:

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

Com `stream: false`, o corpo da resposta HTTP é o JSON final com `Content-Type: application/json`. Com `stream: true`, o AIVAX envia o JSON completo como um único evento de dados SSE e, em seguida, envia `[DONE]`.
