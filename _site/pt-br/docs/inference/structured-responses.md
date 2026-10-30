Source: https://docs.aivax.net/pt-br/docs/inference/structured-responses.html

# Respostas Estruturadas

AIVAX pode produzir JSON estruturado por meio de dois caminhos:

- `response_schema`: AIVAX valida a saída final do modelo contra um Esquema JSON e tenta novamente com feedback de validação quando a saída é inválida. Este é o caminho de Cura de JSON (JSON Healing).
- `response_format`: AIVAX passa um formato de resposta nativo compatível com OpenAI ao provedor, ou aplica cura quando `healing_options` está presente ou a Cura de JSON automática está habilitada na conta.

Use respostas estruturadas quando outro sistema consumir a saída e o texto livre fosse frágil.

## Como funciona a Cura de JSON

Quando `response_schema` está presente, AIVAX adiciona instruções de esquema à solicitação do modelo. Após o modelo gerar uma resposta, AIVAX tenta extrair JSON de:

- O texto gerado completo.
- Variantes reparadas comuns, como chaves de abertura ou fechamento ausentes.
- Blocos de código JSON encontrados no texto gerado.

Se o JSON extraído não for válido em relação ao esquema, AIVAX adiciona uma mensagem de feedback com os erros de validação e solicita que o modelo gere o JSON novamente. Isso continua até que um valor JSON válido seja gerado ou o limite de tentativas configurado seja atingido.

A Cura de JSON melhora a confiabilidade, mas não é uma garantia absoluta. Se o modelo falhar repetidamente na validação do esquema, a solicitação poderá falhar após o limite de tentativas.

## Escolhendo um modo

Use `response_schema` quando a AIVAX deve assumir a validação e o reparo. Este é o modo mais seguro para modelos que não suportam nativamente saída estruturada, para respostas que usam ferramentas antes de produzir JSON e para sistemas que não podem tolerar JSON malformado.

Use `response_format` com `type: "json_schema"` quando o modelo do provedor deve lidar com a saída estruturada nativamente. AIVAX ainda usará o esquema internamente, e a cura será aplicada quando `response_format.json_schema.healing_options` for fornecido ou a conta tiver a Cura de JSON automática habilitada.

Use `json_only: true` quando o corpo da resposta HTTP deve conter apenas o JSON final. Isso remove o envelope normal de conclusão de chat, escolhas, uso e metadados de geração do corpo da resposta.

Para uma lista de verificação de solução de problemas que cobre recusas, streams incompletos e aplicação nativa versus cura, leia [Como corrigir JSON inválido de uma API LLM com saídas estruturadas](https://aivax.net/blog/structured-output-healing-boundary/).

## Exemplo básico

A solicitação abaixo permite que o modelo pesquise na web e retorne os resultados como JSON validado contra `response_schema`.

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

`builtin_tools` é opcional. Se você habilitar ferramentas, o modelo selecionado deve suportar chamada de ferramentas ou o gateway deve fornecer um manipulador de ferramentas.

## Saída estruturada nativa

Use `response_format` quando quiser usar o suporte nativo ao JSON Schema do provedor:

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

Se o modelo integrado selecionado tiver suporte estrito a JSON, a AIVAX pode encaminhar o esquema usando o formato de resposta JSON Schema do provedor.

## Habilitando a cura em `response_format`

Você pode habilitar explicitamente a Cura de JSON dentro de `response_format.json_schema`:

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

`max_attempts` deve estar entre 1 e 10. Cada nova tentativa é outra tentativa de geração do modelo e pode aumentar o custo e a latência.

Se a cura frequentemente atingir o limite de tentativas, ajuste as instruções e o esquema antes de aumentar o limite. As causas comuns são esquemas excessivamente rígidos, campos `required` ausentes, prompts vagos, resultados de ferramentas ruidosos ou um modelo muito pequeno para a tarefa.

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

Com `stream: false`, o corpo da resposta HTTP é o JSON final com `Content-Type: application/json`. Com `stream: true`, a AIVAX envia o JSON completo como um único evento de dados SSE e depois envia `[DONE]`.

## Recursos de esquema suportados

A AIVAX valida o JSON gerado com JSON Schema. Os recursos documentados suportados são:

- `string`: `minLength`, `maxLength`, `pattern`, `format` e `enum`.
- `number` e `integer`: `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum` e `multipleOf`.
- `array`: `items`, `uniqueItems`, `minItems` e `maxItems`.
- `object`: `properties` e `required`.
- `boolean` e `bool`.
- `null`.
- Múltiplos tipos, por exemplo `"type": ["string", "number"]`.

Use `required` para campos que seu aplicativo deve receber. Use `items` explícitos para arrays. Use `enum`, `format` e restrições de comprimento ou padrão quando os valores aceitos forem conhecidos.

## Padrões práticos

Para extração, diga ao modelo quais campos devem ser inferidos, quais campos devem ser `null` quando ausentes e quais campos não devem ser inventados.

Para classificação, use `enum` para o rótulo final e adicione um campo `reason` curto quando humanos precisarem auditar a decisão.

Para JSON baseado em ferramentas, permita que o modelo use ferramentas antes de produzir o JSON e inclua campos de origem quando o aplicativo precisar de proveniência.

Para gravações em banco de dados ou chamadas de API externas, valide o JSON novamente em seu aplicativo. A AIVAX valida a forma do JSON, mas seu aplicativo permanece responsável pelas regras de negócios, como permissões, IDs válidos, intervalos de datas e restrições específicas da conta.
