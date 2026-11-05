Source: https://docs.aivax.net/pt-br/docs/inference/chat-completions/structured-output.html

# Saída estruturada

Use respostas estruturadas quando seu aplicativo precisar de uma saída JSON que corresponda a um esquema. O AIVAX oferece suporte a eles por meio de `response_schema`, `response_format` e `json_only`.

```json
{
    "model": "@google/gemini-3.8-flash",
    "prompt": "Pesquise notícias recentes sobre veículos elétricos.",
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
                            "description": "Título da notícia"
                        },
                        "summary": {
                            "type": "string",
                            "description": "Resumo da notícia"
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

O `response_schema` permite o Curativo de JSON (JSON Healing). O AIVAX solicita ao modelo que gere JSON, extrai o JSON do texto ou dos blocos de markdown gerados, valida-o contra o esquema e tenta novamente com base no feedback de validação até que a saída seja válida ou o limite de tentativas seja atingido.


Se o seu aplicativo não conseguir analisar ou validar o resultado, siga o [guia de solução de problemas para JSON inválido](https://aivax.net/blog/structured-output-healing-boundary/) antes de aumentar o orçamento de retentativas.

## Escolha um campo

| Campo | Validação | Use quando |
| --- | --- | --- |
| `response_schema` | O AIVAX valida a saída e tenta novamente com feedback ([Curativo de JSON](https://docs.aivax.net/pt-br/docs/inference/structured-responses/json-healing.md)). | Qualquer modelo, incluindo modelos sem saída estruturada nativa, e respostas que usam ferramentas antes do JSON. |
| `response_format` com `json_schema` | O provedor aplica o esquema nativamente; o AIVAX também realiza curativos quando `healing_options` está definido ou o Curativo de JSON automático está habilitado na conta. | O modelo suporta saída estruturada nativa e você deseja que o provedor restrinja a geração. |
| `json_only` | Retorna apenas o JSON final, sem o envelope de conclusão de chat. | O consumidor é um programa que espera um corpo JSON puro; consulte [Apenas JSON](https://docs.aivax.net/pt-br/docs/inference/structured-responses/json-only.md). |

Com ferramentas ou raciocínio, o modelo pode chamar ferramentas e raciocinar primeiro; o JSON é extraído apenas da resposta final. Consulte [Raciocínio e ferramentas](https://docs.aivax.net/pt-br/docs/inference/structured-responses/reasoning-and-tools.md).

Os campos de saída estruturada não estão disponíveis com chaves de API públicas. Quando o limite de tentativas é atingido, a solicitação falha com `503 Service Unavailable`; consulte [Curativo de JSON](https://docs.aivax.net/pt-br/docs/inference/structured-responses/json-healing.md#when-healing-fails).
