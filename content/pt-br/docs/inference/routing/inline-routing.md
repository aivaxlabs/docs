---
{title: Roteamento Inline,linkTitle: Roteamento inline,weight: 20,group: Routing,sourceHash: b612b8dfdc77d572,aliases: [/docs/pt-br/inference/routing/inline-routing.html]}
---

# Roteamento inline no nome do modelo

Um nome de modelo integrado aceita um sufixo de roteamento após o `#`. Use-o quando seu cliente puder alterar apenas a string `model`, como em uma ferramenta ou SDK compatível com OpenAI que não envia campos extras no corpo da requisição:

| Nome do modelo | Efeito |
|---|---|
| `@openai/gpt-6-luna#cheapest` | Usa a preferência `Cheapest`. Qualquer [preferência de roteamento](setup-routing.md) funciona, sem distinção entre maiúsculas e minúsculas. |
| `@openai/gpt-6-luna#azure-us` | Usa apenas o provedor com a tag `azure-us`, como `"allowed_providers": [ "azure-us" ]`. |

Um sufixo que corresponde a um nome de preferência é interpretado como uma preferência; qualquer outro valor é interpretado como uma tag de provedor. Uma tag de provedor não possui fallback com `"*"`, portanto, a solicitação falhará caso esse provedor não esteja disponível. Apenas um sufixo é suportado por nome.

```json
{
    "model": "@openai/gpt-6-luna#fastest",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this incident report."
        }
    ]
}
```

O sufixo também funciona no nome do modelo salvo em um Gateway de IA e nos nomes dos modelos do roteador de complexidade, para que cada modelo roteado possa ter seu próprio roteamento:

```json
{
    "name": "Cost-optimized assistant",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "@openai/gpt-6-luna#cheapest"
    }
}
```

O sufixo é resolvido em tempo de execução, em cada solicitação. Ele tem precedência sobre o `routingOption` e os `allowedProviders` salvos pelo gateway, mas as `routing_options` em `chat/completions` permanecem como a última sobrecarga. Por exemplo, `"model": "@openai/gpt-6-luna#cheapest"` com `"routing_options": { "preset": "Quality" }` usa `Quality`. O `model` retornado nas respostas é o nome do modelo sem o sufixo.
