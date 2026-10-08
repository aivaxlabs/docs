Source: http://localhost:1313/pt-br/docs/inference/structured-responses.html

# Respostas Estruturadas

AIVAX pode produzir JSON estruturado por duas vias:

- `response_schema`: AIVAX valida a saída final do modelo contra um JSON Schema e tenta novamente com feedback de validação quando a saída está inválida. Este é o caminho de reparo de JSON.
- `response_format`: AIVAX passa um formato de resposta nativo compatível com OpenAI para o provedor, ou aplica reparo quando `healing_options` está presente ou o reparo automático de JSON está habilitado na conta.

Use respostas estruturadas quando outro sistema consumirá a saída e texto livre seria frágil.

## Como o reparo de JSON funciona

Quando `response_schema` está presente, AIVAX adiciona instruções de esquema à requisição do modelo. Depois que o modelo gera uma resposta, AIVAX tenta extrair JSON de:

- O texto completo gerado.
- Variantes reparadas comuns, como chaves de abertura ou fechamento ausentes.
- Blocos de código JSON encontrados no texto gerado.

Se o JSON extraído não validar contra o esquema, AIVAX adiciona uma mensagem de feedback com os erros de validação e pede ao modelo que gere o JSON novamente. Isso continua até que um valor JSON válido seja gerado ou o limite de tentativas configurado seja alcançado.

O reparo de JSON melhora a confiabilidade, mas não é uma garantia absoluta. Se o modelo falhar repetidamente ao esquema, a requisição pode falhar após o limite de tentativas.

## Escolhendo um modo

Use `response_schema` quando AIVAX deve ser responsável pela validação e reparo. Este é o modo mais seguro para modelos que não suportam nativamente saída estruturada, para respostas que usam ferramentas antes de produzir JSON e para sistemas que não podem tolerar JSON malformado.

Use `response_format` com `type: "json_schema"` quando o modelo do provedor deve lidar nativamente com a saída estruturada. AIVAX ainda usará o esquema internamente, e o reparo será aplicado quando `response_format.json_schema.healing_options` for fornecido ou a conta tiver o reparo automático de JSON habilitado.

Use `json_only: true` quando o corpo da resposta HTTP deve conter apenas o JSON final. Isso remove o envelope normal de conclusão de chat, opções, uso e metadados de geração do corpo da resposta.

Para uma lista de verificação de solução de problemas cobrindo recusas, fluxos incompletos e aplicação nativa versus reparo, leia [How to fix invalid JSON from an LLM API with structured outputs](https://aivax.net/blog/structured-output-healing-boundary/).

## Exemplo básico

Referência:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

```json
{
    "model": "@google/gemini-2.5-flash",
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

`builtin_tools` é opcional. Se você habilitar ferramentas, o modelo selecionado deve suportar chamadas de ferramenta ou o gateway deve fornecer um manipulador de ferramentas.

## Saída estruturada nativa

Use `response_format` quando quiser usar o suporte nativo de JSON Schema do provedor:

```json
{
    "model": "@openai/gpt-4o",
    "messages": [
        {
            "role": "user",
            "content": "List 3 European capitals."
        }
    ],
    "response_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
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
            }
        }
    }
}
```

Se o modelo integrado selecionado tem suporte estrito a JSON, AIVAX pode encaminhar o esquema usando o formato de resposta JSON Schema do provedor.

## Habilitando reparo em `response_format`

Você pode habilitar explicitamente o reparo de JSON dentro de `response_format.json_schema`:

```json
{
    "model": "@openai/gpt-4o",
    "messages": [
        {
            "role": "user",
            "content": "Return a short status object."
        }
    ],
    "response_format": {
        "type": "json_schema",
        "json_schema": {
            "schema": {
                "type": "object",
                "properties": {
                    "status": { "type": "string" },
                    "message": { "type": "string" }
                },
                "required": ["status", "message"]
            },
            "healing_options": {
                "max_attempts": 5
            }
        }
    }
}
```

`max_attempts` deve estar entre 1 e 10. Cada nova tentativa é outra geração do modelo e pode aumentar custo e latência.

Se o reparo frequentemente atinge o limite de tentativas, ajuste a instrução e o esquema antes de aumentar o limite. Causas comuns são esquemas excessivamente rígidos, campos `required` ausentes, prompts vagos, resultados de ferramenta ruidosos ou um modelo muito pequeno para a tarefa.

## Modo `json_only`

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

Com `stream: false`, o corpo da resposta HTTP é o JSON final com `Content-Type: application/json`. Com `stream: true`, AIVAX envia o JSON completo como um único evento de dados SSE e depois envia `[DONE]`.

## Recursos de esquema suportados

AIVAX valida o JSON gerado com JSON Schema. Os recursos suportados documentados são:

- `string`: `minLength`, `maxLength`, `pattern`, `format` e `enum`.
- `number` e `integer`: `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum` e `multipleOf`.
- `array`: `items`, `uniqueItems`, `minItems` e `maxItems`.
- `object`: `properties` e `required`.
- `boolean` e `bool`.
- `null`.
- Tipos múltiplos, por exemplo `"type": ["string", "number"]`.

Use `required` para campos que sua aplicação deve receber. Use `items` explícito para arrays. Use `enum`, `format` e restrições de comprimento ou padrão quando os valores aceitos são conhecidos.

## Padrões práticos

Para extração, informe ao modelo quais campos devem ser inferidos, quais campos devem ser `null` quando ausentes e quais campos não devem ser inventados.

Para classificação, use `enum` para o r final e adicione um campo curto `reason` quando humanos precisarem auditar a decisão.

Para JSON com suporte a ferramentas, permita que o modelo use ferramentas antes de produzir o JSON e inclua campos de origem quando a aplicação precisar de procedência.

Para gravações em banco de dados ou chamadas de API externas, valide o JSON novamente em sua aplicação. AIVAX valida a estrutura do JSON, mas sua aplicação continua responsável por regras de negócio como permissões, IDs válidos, intervalos de datas e restrições específicas da conta.
