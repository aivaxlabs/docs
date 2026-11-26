Source: https://docs.aivax.net/pt-br/docs/inference/routing/setup-routing.html

# Configuração de roteamento de provedores

Alguns modelos integrados estão disponíveis por meio de mais de um provedor. O roteamento de provedores permite que o AIVAX escolha entre esses provedores sem alterar o modelo solicitado pelo seu aplicativo. Isso difere do [roteamento de modelos](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md#model-routing), que pode selecionar um modelo diferente com base na complexidade da solicitação.

O AIVAX considera os provedores que estão atualmente disponíveis e compatíveis com a solicitação. Se apenas um provedor for elegível, a preferência de roteamento não altera o resultado. Quando o provedor selecionado falha antes de começar a responder, o AIVAX tenta novamente a solicitação em outro provedor elegível. O roteamento de provedores aplica-se apenas aos modelos integrados do AIVAX; uma gateway com chave própria (bring-your-own-key) usa o endpoint do provedor configurado nessa gateway.

Você pode definir o roteamento em três locais, do mais geral ao mais específico: a [AI Gateway](#configure-routing-in-an-ai-gateway), um sufixo no [nome do modelo](https://docs.aivax.net/pt-br/docs/inference/routing/inline-routing.md) e a [solicitação](#override-routing-per-request). As configurações de privacidade da conta podem restringir ainda mais os provedores elegíveis; consulte [ZDR](https://docs.aivax.net/pt-br/docs/inference/routing/zdr.md) e [Provedores especiais](https://docs.aivax.net/pt-br/docs/inference/routing/special-providers.md).

As preferências de roteamento disponíveis são:

| Preferência | Comportamento |
|---|---|
| `Balanced` | Equilibra preço, velocidade e qualidade. Esta é a padrão, exceto para [gerações assíncronas](https://docs.aivax.net/pt-br/docs/inference/batch/async-generations.md), que usam `Cheapest` como padrão. |
| `Cheapest` | Seleciona o provedor com o menor preço aplicável de tokens de entrada e saída. |
| `Fastest` | Prioriza o provedor com a maior taxa de transferência disponível. |
| `Quality` | Seleciona o provedor que o AIVAX classifica como melhor em qualidade, sem otimizar para preço ou velocidade. |
| `Special` | Inclui [provedores especiais](https://docs.aivax.net/pt-br/docs/inference/routing/special-providers.md) e seleciona o menor preço combinado aplicável de tokens de entrada e saída. |

## Configurar roteamento em uma AI Gateway

Use uma AI Gateway quando o mesmo roteamento deve ser aplicado a todas as solicitações. No editor da gateway, selecione um modelo integrado, escolha a estratégia em **Preferência de roteamento**, liste as tags dos provedores em ordem em **Provedores permitidos** e salve a gateway.

A configuração equivalente da gateway usa `parameters.routingOption` e `parameters.allowedProviders`:

```json
{
    "name": "Assistente otimizado por custo",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "YOUR_INTEGRATED_MODEL",
        "routingOption": "Cheapest",
        "allowedProviders": [ "azure-us", "azure-eu", "*" ]
    }
}
```

`allowedProviders` segue as mesmas regras que `routing_options.allowed_providers` abaixo. O valor padrão é `["*"]`, e uma lista vazia é rejeitada ao salvar a gateway.

Após salvar, chame a gateway normalmente usando seu ID ou slug como `model`. O AIVAX aplica a preferência de roteamento armazenada enquanto preserva as instruções, ferramentas, configuração de RAG e outras definições da gateway. Consulte [Usando uma AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/using-an-ai-gateway.md) para o fluxo de trabalho completo da gateway.

## Substituir roteamento por solicitação

Use `routing_options` para escolher como os provedores são selecionados para uma única solicitação. A substituição funciona com um modelo integrado direto ou com uma AI Gateway que usa um modelo integrado:

```json
{
    "model": "YOUR_INTEGRATED_MODEL_OR_GATEWAY_ID",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this incident report."
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
| `preset` | Preferência de roteamento: `Balanced`, `Cheapest`, `Fastest`, `Quality` ou `Special`. Quando omitido, é usado o `routingOption` salvo na gateway. |
| `allowed_providers` | Lista ordenada de tags de provedores. O AIVAX tenta a primeira tag e passa para a próxima apenas quando nenhum provedor correspondente está disponível ou é compatível com a solicitação. `"*"` corresponde a qualquer provedor. Quando omitido, é usado o `allowedProviders` salvo na gateway, que tem como padrão `["*"]`. |

Dentro de cada etapa, `preset` escolhe entre os provedores correspondentes. Sem `"*"` no final, a solicitação falhará se nenhum dos provedores listados estiver disponível. Uma lista vazia em `allowed_providers` é rejeitada. A correspondência de tags diferencia maiúsculas de minúsculas? Não, é insensível a maiúsculas/minúsculas.

A tag de cada provedor é exibida nos detalhes do provedor na página **Models** do painel, onde pode ser copiada, e retornada como `tag` na lista de provedores de `GET /v1/models`. Uma tag identifica um endpoint de provedor, incluindo sua região ou variante, quando existente, como `azure-us` ou `azure-eu`.

`GET /v1/models` aceita um parâmetro de consulta opcional `filter` com um nome de modelo, como `?filter=@openai/gpt-4o`. A resposta conterá então apenas esse modelo e seus snapshots datados, começando pela correspondência mais próxima. Sem `filter`, a lista completa é retornada. Consulte [Modelos descontinuados](#deprecated-models) para saber como distinguir um modelo atual de um antigo.

Os valores da solicitação substituem o roteamento salvo da gateway apenas para aquela solicitação; eles não atualizam a gateway. Como `routing_options` é uma extensão do AIVAX, envie-o como um campo extra no corpo da solicitação ao usar um SDK compatível com OpenAI.

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

Use `_details.provider_model.is_deprecated` em `GET /v1/models` quando precisar preferir um modelo integrado atual. Ele será `true` quando o modelo for sinalizado como descontinuado ou tiver sido lançado há mais de 12 meses. Os modelos descontinuados permanecem na lista.

Um provedor também pode redirecionar um ID aposentado para outro modelo em vez de rejeitá-lo, como a API Gemini faz para o Gemini 2.5 Pro e Flash a partir de 1º de dezembro de 2026. Consulte [fixar um ID de modelo versus usar um alias para descontinuações de modelos](https://aivax.net/blog/pin-llm-model-id-or-use-alias-model-deprecations/).
