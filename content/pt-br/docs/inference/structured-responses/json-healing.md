---
{title: Cura em JSON,linkTitle: Cura em JSON,weight: 20,group: Structured Responses,sourceHash: a85a3e2c1875739a,aliases: [/docs/pt-br/inference/structured-responses/json-healing.html]}
---

# Cura de JSON

A Cura de JSON é a forma como a AIVAX faz com que qualquer modelo retorne um JSON que corresponda a um esquema, incluindo modelos sem suporte nativo a saída estruturada. Use-a quando a aplicação precisar analisar um valor JSON previsível em vez de texto livre.

Ative-a de uma destas formas:

- Envie `response_schema`.
- Envie `healing_options` em `response_format`.
- Ative a Cura de JSON automática nas configurações da conta.

Use `response_format` quando quiser o suporte nativo ao JSON Schema do provedor. Adicione `healing_options` dentro de `response_format.json_schema` quando essa solicitação também deve usar a Cura de JSON.

## Como funciona a Cura de JSON

Quando `response_schema` está presente, a AIVAX segue este loop.

1. A AIVAX adiciona instruções de esquema à solicitação do modelo.
2. Após o modelo gerar uma resposta, a AIVAX tenta extrair JSON de:
   - Todo o texto gerado.
   - Blocos de código JSON encontrados no texto gerado.
3. Se o JSON extraído não for válido conforme o esquema, a AIVAX adiciona uma mensagem de feedback com os erros de validação e solicita ao modelo que gere o JSON novamente.
4. Isso continua até que um valor JSON válido seja gerado ou o limite de tentativas configurado seja atingido.

Se o modelo continuar falhando na validação do esquema, a solicitação falhará após o limite de tentativas; consulte [Quando a cura falha](#quando-a-cura-falha).

## Exemplo básico

Use `response_schema` quando quiser a Cura de JSON em uma conclusão de chat, inclusive após a execução de ferramentas. A solicitação abaixo permite que o modelo pesquise na web e retorne os resultados como JSON validado contra `response_schema`.

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

`builtin_tools` é opcional. Se você ativar ferramentas, o modelo selecionado deve suportar chamada de ferramentas ou o gateway deve fornecer um manipulador de ferramentas.

## Saída estruturada nativa

Use `response_format` quando quiser o suporte nativo ao JSON Schema do provedor. Se o modelo integrado selecionado tiver suporte estrito a JSON, a AIVAX pode encaminhar o esquema usando o formato de resposta JSON Schema do provedor.

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

## Ativando a cura em `response_format`

Use `healing_options` quando a solicitação já usa `response_format` e você também deseja a Cura de JSON. Coloque as opções dentro de `response_format.json_schema`:

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

`max_attempts` deve estar entre 1 e 10. Cada nova tentativa é outra geração do modelo e pode aumentar o custo e a latência.

## Quando a cura falha

A cura falha quando todas as tentativas produzem JSON inválido. A solicitação então falha com a mensagem `Failed to generate a valid JSON response. Please, try again later.`

O que o cliente recebe:

- Sem streaming, a resposta é HTTP `503` com o código de erro `service_unavailable` e o cabeçalho `Retry-After: 5`.
- Com streaming, o stream termina com um chunk cujo `finish_reason` é `error` e cujo objeto `error` contém o código e a mensagem, seguido por `[DONE]`. Consulte [Streaming](/docs/pt-br/inference/chat-completions/streaming.md).

Se a cura frequentemente atingir o limite de tentativas, ajuste a instrução e o esquema antes de aumentar o limite. As causas comuns são esquemas excessivamente rígidos, prompts vagos, resultados de ferramentas ruidosos ou um modelo pequeno demais para a tarefa.

## Recursos de esquema suportados

A AIVAX valida o JSON gerado com JSON Schema. Recursos suportados:

- `string`: `minLength`, `maxLength`, `pattern`, `format` e `enum`.
- `number` e `integer`: `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum` e `multipleOf`.
- `array`: `items`, `uniqueItems`, `minItems` e `maxItems`.
- `object`: `properties` e `required`.
- `boolean`.
- `null`.
- Múltiplos tipos, por exemplo `"type": ["string", "number"]`.

Aplique restrições desta forma:

- Use `required` para campos que sua aplicação deve receber.
- Use `items` explícitos para arrays.
- Use `enum`, `format` e restrições de comprimento ou padrão quando os valores aceitos forem conhecidos.

## Padrões práticos

Use estes padrões ao projetar o esquema, não apenas ao ativar a cura.

### Extração

Informe ao modelo quais campos devem ser inferidos, quais campos devem ser `null` quando ausentes e quais campos não devem ser inventados.

### Classificação

Use `enum` para o rótulo final. Adicione um campo `reason` curto quando humanos precisarem auditar a decisão.

### JSON baseado em ferramentas

Permita que o modelo use ferramentas antes de produzir o JSON. Inclua campos de origem quando a aplicação precisar de proveniência.

### Gravações em outros sistemas

Para gravações em banco de dados ou chamadas de API externas, valide o JSON novamente em sua aplicação. A AIVAX valida a estrutura do JSON, mas sua aplicação permanece responsável por regras de negócio, como permissões, IDs válidos, intervalos de datas e restrições específicas da conta.
