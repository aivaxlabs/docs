---
{title: Cura em JSON,linkTitle: Cura em JSON,weight: 20,group: Structured Responses,sourceHash: ebe9e76ef82e758c,aliases: [/docs/pt-br/inference/structured-responses/json-healing.html]}
---

# Cura de JSON

A Cura de JSON (JSON Healing) é a forma como a AIVAX faz com que qualquer modelo retorne um JSON que corresponda a um esquema, incluindo modelos sem saída estruturada nativa. Ela é habilitada por meio de `response_schema`, por `healing_options` em `response_format` ou pela Cura de JSON automática nas configurações da conta.

## Como funciona a Cura de JSON

Quando `response_schema` está presente, a AIVAX adiciona instruções de esquema à solicitação do modelo. Após o modelo gerar uma resposta, a AIVAX tenta extrair o JSON de:

- O texto gerado completo.
- Variantes comuns reparadas, como chaves de abertura ou fechamento ausentes.
- Blocos de código JSON encontrados no texto gerado.

Se o JSON extraído não for validado contra o esquema, a AIVAX adiciona uma mensagem de feedback com os erros de validação e solicita ao modelo que gere o JSON novamente. Isso continua até que um valor JSON válido seja gerado ou o limite de tentativas configurado seja atingido.

A Cura de JSON melhora a confiabilidade, mas não é uma garantia absoluta. Se o modelo falhar repetidamente na validação do esquema, a solicitação poderá falhar após o limite de tentativas; consulte [Quando a cura falha](#quando-a-cura-falha).

## Exemplo básico

A solicitação abaixo permite que o modelo pesquise na web e retorne os resultados como JSON validado contra `response_schema`.

Referência:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

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

Use `response_format` quando desejar usar o suporte nativo ao JSON Schema do provedor:

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

Se o modelo integrado selecionado tiver suporte estrito para JSON, a AIVAX pode encaminhar o esquema usando o formato de resposta JSON Schema do provedor.

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

## Quando a cura falha

Quando todas as tentativas produzem JSON inválido, a solicitação falha com a mensagem `Failed to generate a valid JSON response. Please, try again later.`:

- Sem streaming, a resposta é HTTP `503` com o código de erro `service_unavailable` e o cabeçalho `Retry-After: 5`.
- Com streaming, o stream termina com um chunk cujo `finish_reason` é `error` e cujo objeto `error` contém o código e a mensagem, seguido por `[DONE]`. Consulte [Streaming](/docs/pt-br/inference/chat-completions/streaming.md).

Se a cura frequentemente atingir o limite de tentativas, ajuste a instrução e o esquema antes de aumentar o limite. As causas comuns são esquemas excessivamente rígidos, campos `required` ausentes, prompts vagos, resultados de ferramentas ruidosos ou um modelo muito pequeno para a tarefa.

## Recursos de esquema suportados

A AIVAX valida o JSON gerado com JSON Schema. Os recursos documentados suportados são:

- `string`: `minLength`, `maxLength`, `pattern`, `format` e `enum`.
- `number` e `integer`: `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum` e `multipleOf`.
- `array`: `items`, `uniqueItems`, `minItems` e `maxItems`.
- `object`: `properties` e `required`.
- `boolean` e `bool`.
- `null`.
- Múltiplos tipos, por exemplo `"type": ["string", "number"]`.

Use `required` para campos que sua aplicação deve receber. Use `items` explícitos para arrays. Use `enum`, `format` e restrições de comprimento ou padrão quando os valores aceitos forem conhecidos.

## Padrões práticos

Para extração, informe ao modelo quais campos devem ser inferidos, quais campos devem ser `null` quando ausentes e quais campos não devem ser inventados.

Para classificação, use `enum` para o rótulo final e adicione um campo `reason` curto quando humanos precisarem auditar a decisão.

Para JSON baseado em ferramentas, permita que o modelo use ferramentas antes de produzir o JSON e inclua campos de origem quando a aplicação precisar de proveniência.

Para gravações em banco de dados ou chamadas de API externas, valide o JSON novamente em sua aplicação. A AIVAX valida a estrutura do JSON, mas sua aplicação permanece responsável pelas regras de negócio, como permissões, IDs válidos, intervalos de datas e restrições específicas da conta.
