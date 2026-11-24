---
{title: Configuração de Roteamento do Provedor,linkTitle: Configuração de roteamento,weight: 10,group: Routing,sourceHash: bd6a68c215e3bf82,aliases: [/docs/pt-br/inference/routing/setup-routing.html]}
---

# Configuração de roteamento de provedores

Alguns modelos integrados estão disponíveis por meio de mais de um provedor. O roteamento de provedores permite que o AIVAX escolha entre esses provedores sem alterar o modelo solicitado pelo seu aplicativo. Isso difere do [roteamento de modelos](/docs/pt-br/inference/ai-gateways/concepts.md#model-routing), que pode selecionar um modelo diferente com base na complexidade da solicitação.

O AIVAX considera os provedores que estão atualmente disponíveis e compatíveis com a solicitação. Se apenas um provedor for elegível, a preferência de roteamento não altera o resultado. Quando o provedor selecionado falha antes de começar a responder, o AIVAX tenta novamente a solicitação em outro provedor elegível. O roteamento de provedores aplica-se apenas aos modelos integrados do AIVAX; um gateway bring-your-own-key (traga sua própria chave) usa o endpoint do provedor configurado nesse gateway.

Você pode definir o roteamento em três locais, do mais geral ao mais específico: no [AI Gateway](#configure-roteamento-em-um-ai-gateway), em um sufixo no [nome do modelo](inline-routing.md) e na [solicitação](#substituir-roteamento-por-solicitação). As configurações de privacidade da conta podem restringir ainda mais os provedores elegíveis; consulte [ZDR](zdr.md) e [Provedores especiais](special-providers.md).

As preferências de roteamento disponíveis são:

| Preferência | Comportamento |
|---|---|
| `Balanced` | Equilibra preço, velocidade e qualidade. Esta é a padrão. |
| `Cheapest` | Seleciona o provedor com o menor preço aplicável de tokens de entrada e saída. |
| `Fastest` | Prioriza o provedor com a maior taxa de transferência disponível. |
| `Quality` | Seleciona o provedor que o AIVAX classifica como o melhor em qualidade, sem otimizar para preço ou velocidade. |
| `Special` | Inclui [provedores especiais](special-providers.md) e seleciona o menor preço combinado aplicável de tokens de entrada e saída. |

## Configurar roteamento em um AI Gateway

Use um AI Gateway quando o mesmo roteamento deve ser aplicado a todas as solicitações. No editor do gateway, selecione um modelo integrado, escolha a estratégia em **Preferência de roteamento**, liste as tags dos provedores em ordem em **Provedores permitidos** e salve o gateway.

A configuração equivalente do gateway usa `parameters.routingOption` e `parameters.allowedProviders`:

```json
{
    "name": "Assistente otimizado de custos",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "SEU_MODELO_INTEGRADO",
        "routingOption": "Cheapest",
        "allowedProviders": [ "azure-us", "azure-eu", "*" ]
    }
}
```

`allowedProviders` segue as mesmas regras que `routing_options.allowed_providers` abaixo. O valor padrão é `["*"]`, e uma lista vazia é rejeitada ao salvar o gateway.

Após salvar, chame o gateway normalmente usando seu ID ou slug como `model`. O AIVAX aplica a preferência de roteamento armazenada enquanto preserva as instruções do gateway, ferramentas, configuração de RAG e outras configurações. Consulte [Usando um AI Gateway](/docs/pt-br/inference/ai-gateways/using-an-ai-gateway.md) para o fluxo de trabalho completo do gateway.

## Substituir roteamento por solicitação

Use `routing_options` para escolher como os provedores são selecionados para uma única solicitação. A substituição funciona com um modelo integrado direto ou com um AI Gateway que usa um modelo integrado:

```json
{
    "model": "SEU_MODELO_INTEGRADO_OU_ID_DO_GATEWAY",
    "messages": [
        {
            "role": "user",
            "content": "Resuma este relatório de incidente."
        }
    ],
    "routing_options": {
        "preset": "Balanced",
        "allowed_providers": [
            "azure-us",
            "azure-eu",
            "*"
        ]
    }
}
```

| Campo | Descrição |
|---|---|
| `preset` | Preferência de roteamento: `Balanced`, `Cheapest`, `Fastest`, `Quality` ou `Special`. Quando omitido, é usada a `routingOption` salva no gateway. |
| `allowed_providers` | Lista ordenada de tags de provedores. O AIVAX tenta a primeira tag e passa para a próxima apenas quando nenhum provedor correspondente está disponível ou é compatível com a solicitação. `"*"` corresponde a qualquer provedor. Quando omitido, é usado o `allowedProviders` salvo no gateway, que tem como padrão `["*"]`. |

Dentro de cada etapa, `preset` escolhe entre os provedores correspondentes. Sem `"*"` no final, a solicitação falhará se nenhum dos provedores listados estiver disponível. Uma lista vazia de `allowed_providers` é rejeitada. A correspondência de tags não diferencia maiúsculas de minúsculas.

A tag de cada provedor é mostrada nos detalhes do provedor na página **Models** do painel, onde pode ser copiada, e retornada como `tag` na lista de provedores de `GET /v1/models`. Uma tag identifica um endpoint de provedor, incluindo sua região ou variante, quando existente, como `azure-us` ou `azure-eu`.

`GET /v1/models` aceita um parâmetro de consulta opcional `filter` com um nome de modelo, como `?filter=@openai/gpt-4o`. A resposta conterá então apenas esse modelo e seus instantâneos datados, começando pela correspondência mais próxima. Sem `filter`, a lista completa é retornada. Consulte [Modelos descontinuados](#modelos-descontinuados) para saber como distinguir um modelo atual de um antigo.

Os valores da solicitação substituem o roteamento salvo do gateway apenas para essa solicitação; eles não atualizam o gateway. Como `routing_options` é uma extensão do AIVAX, envie-o como um campo extra no corpo da solicitação ao usar um SDK compatível com OpenAI.

O campo anterior `routing_preset` está descontinuado, mas ainda é aceito. Substitua `"routing_preset": "Fastest"` por `"routing_options": { "preset": "Fastest" }`. Quando ambos forem enviados, `routing_options.preset` terá precedência.

## Provedor nas respostas

As respostas para modelos integrados incluem um campo `provider` ao lado de `model` com a tag do provedor que atendeu à solicitação. Nas respostas em streaming, cada chunk inclui esse campo. O campo é `null` para gateways que usam suas próprias credenciais de provedor.

```json
{
    "object": "chat.completion.chunk",
    "model": "@openai/gpt-5-mini",
    "provider": "azure-us",
    "choices": [ ... ]
}
```

Se um provedor falhar e o AIVAX tentar novamente a solicitação em outro provedor, `provider` refletirá o provedor que produziu a resposta.

## Modelos descontinuados

Use `_details.provider_model.is_deprecated` em `GET /v1/models` quando precisar preferir um modelo integrado atual. Ele será `true` quando o modelo estiver marcado como descontinuado ou tiver sido lançado há mais de 12 meses. Os modelos descontinuados permanecem na lista.

Um provedor também pode redirecionar um ID retirado para outro modelo em vez de rejeitá-lo, como a API Gemini faz para o Gemini 2.5 Pro e Flash a partir de 1º de dezembro de 2026. Consulte [fixar um ID de modelo versus usar um alias](https://aivax.net/blog/pin-llm-model-id-or-use-alias-model-deprecations/).
