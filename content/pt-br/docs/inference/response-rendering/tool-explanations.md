---
{title: Explicações das Ferramentas,linkTitle: Explicações das ferramentas,weight: 30,group: Response rendering,sourceHash: 101d0bab987125fb,aliases: [/docs/pt-br/inference/response-rendering/tool-explanations.html]}
---

# Explicações de ferramentas

Use explicações de ferramentas quando seu cliente mostrar aos usuários por que uma ferramenta do lado do servidor está sendo executada. A configuração também pode ser armazenada em um [AI Gateway](/docs/pt-br/inference/ai-gateways/concepts.md#tool-explanations) como `toolInvocationExplanations`. Defina `tool_invocation_explanations: true` para solicitar ao AIVAX que inclua campos de explicação nos argumentos de ferramentas do lado do servidor. Quando o modelo fornece `_tool_reason` e `_tool_goal`, `servertool.explanation` contém uma versão amigável ao cliente:

```json
{
    "model": "@x-ai/grok-4.3",
    "messages": [
        {
            "role": "user",
            "content": "Qual é a previsão do tempo para hoje?"
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true
}
```

Exemplo de evento de stream:

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

O `state` é `Created` quando a chamada da ferramenta começa, e depois `Completed` ou `Failed` quando termina. Todos os eventos de uma única chamada compartilham o mesmo `id`, portanto, renderize-os como uma única linha de status que muda de estado. `explanation` será `null` quando o modelo não fornecer ambos os campos; nesse caso, use o nome da ferramenta como fallback.

Exiba `reason` como o rótulo de status, como "Buscando a previsão do tempo de hoje online". `goal` é útil em uma visualização expandida ou de auditoria. Não exiba `contents` para os usuários finais, a menos que a interface seja construída para inspeção técnica, pois ele contém os argumentos brutos da ferramenta.
