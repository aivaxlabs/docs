---
{title: Configuração do roteamento do provedor,linkTitle: Configurar roteamento,weight: 10,group: Routing,sourceHash: 5fa1148960715915,aliases: [/docs/pt-br/inference/routing/setup-routing.html]}
---

# Configurar roteamento de provedores

Alguns modelos integrados estão disponíveis por meio de mais de um provedor. O roteamento de provedores permite que o AIVAX escolha entre esses provedores sem alterar o modelo solicitado pelo seu aplicativo. Isso difere do [roteamento de modelos](/docs/pt-br/inference/ai-gateways/concepts.md#model-routing), que pode selecionar um modelo diferente com base na complexidade da solicitação.

O AIVAX considera os provedores que estão atualmente disponíveis e compatíveis com a solicitação. Se apenas um provedor for elegível, a preferência de roteamento não altera o resultado. O roteamento de provedores aplica-se apenas a modelos integrados do AIVAX; uma gateway bring-your-own-key (traga sua própria chave) usa o endpoint do provedor configurado nessa gateway.

Você pode definir o roteamento em três locais, do mais geral ao mais específico: a [AI Gateway](#configurar-roteamento-em-uma-ai-gateway), um sufixo no [nome do modelo](inline-routing.md) e a [solicitação](#substituir-roteamento-por-solicitação). As configurações de privacidade da conta podem restringir ainda mais os provedores elegíveis; consulte [ZDR](zdr.md) e [Provedores especiais](special-providers.md).

As preferências de roteamento disponíveis são:

| Preferência | Comportamento |
|---|---|
| `Balanced` | Equilibra preço, velocidade e qualidade. Esta é a padrão. |
| `Cheapest` | Seleciona o provedor com o menor preço aplicável de tokens de entrada e saída. |
| `Fastest` | Prioriza o provedor com a maior taxa de transferência disponível. |
| `Quality` | Seleciona o provedor que o AIVAX classifica como mais alto em qualidade, sem otimizar para preço ou velocidade. |
| `Special` | Funciona como `Balanced`, mas também inclui [provedores especiais](special-providers.md) e dá prioridade a eles. |

## Configurar roteamento em uma AI Gateway

Use uma AI Gateway quando o mesmo roteamento deve se aplicar a todas as solicitações. No editor da gateway, selecione um modelo integrado, escolha a estratégia em **Preferência de roteamento**, liste as tags dos provedores em ordem em **Provedores permitidos** e salve a gateway.

A configuração equivalente da gateway usa `parameters.routingOption` e `parameters.allowedProviders`:

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

`allowedProviders` segue as mesmas regras que `routing_options.allowed_providers` abaixo. Ele é definido como `["*"]` por padrão, e uma lista vazia é rejeitada ao salvar a gateway.

Após salvar, chame a gateway normalmente usando seu ID ou slug como `model`. O AIVAX aplica a preferência de roteamento armazenada enquanto preserva as instruções, ferramentas, configuração de RAG e outras configurações da gateway. Consulte [Usando uma AI Gateway](/docs/pt-br/inference/ai-gateways/using-an-ai-gateway.md) para o fluxo de trabalho completo da gateway.

## Substituir roteamento por solicitação

Use `routing_options` para escolher como os provedores são selecionados para uma única solicitação. A substituição funciona com um modelo integrado direto ou uma AI Gateway que usa um modelo integrado:

```json
{
    "model": "SEU_MODELO_INTEGRADO_OU_ID_DA_GATEWAY",
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
| `preset` | Preferência de roteamento: `Balanced`, `Cheapest`, `Fastest`, `Quality` ou `Special`. Quando omitido, o `routingOption` salvo na gateway é usado. |
| `allowed_providers` | Lista ordenada de tags de provedores. O AIVAX tenta a primeira tag e passa para a próxima apenas quando nenhum provedor correspondente está disponível ou é compatível com a solicitação. `"*"` corresponde a qualquer provedor. Quando omitido, o `allowedProviders` salvo na gateway é usado, que é definido como `["*"]` por padrão. |

Dentro de cada etapa, `preset` escolhe entre os provedores correspondentes. Sem `"*"` no final, a solicitação falha quando nenhum dos provedores listados está disponível. Uma lista vazia de `allowed_providers` é rejeitada. A correspondência de tags não diferencia maiúsculas de minúsculas.

A tag de cada provedor é mostrada nos detalhes do provedor na página **Models** do painel, onde pode ser copiada, e retornada como `tag` na lista de provedores de `GET /v1/models`. Uma tag identifica um endpoint de provedor, incluindo sua região ou variante, quando existe, como `azure-us` ou `azure-eu`.

`GET /v1/models` aceita um parâmetro de consulta `filter` opcional com um nome de modelo, como `?filter=@openai/gpt-4o`. A resposta contém apenas entradas cujo nome seja igual ou uma versão datada dele (um sufixo numérico final de pelo menos quatro dígitos), ordenadas da correspondência mais próxima, com a versão mais recente primeiro. Sem `filter`, a lista completa é retornada. Consulte [Modelos obsoletos](#modelos-obsoletos) para saber como distinguir um modelo atual de um antigo.

Os valores da solicitação substituem o roteamento salvo da gateway apenas para essa solicitação; eles não atualizam a gateway. Como `routing_options` é uma extensão do AIVAX, envie-o como um campo extra no corpo da solicitação ao usar um SDK compatível com OpenAI.

O campo anterior `routing_preset` está obsoleto, mas ainda é aceito. Substitua `"routing_preset": "Fastest"` por `"routing_options": { "preset": "Fastest" }`. Quando ambos são enviados, `routing_options.preset` tem precedência.

## Provedor nas respostas

As respostas para modelos integrados incluem um campo `provider` ao lado de `model` com a tag do provedor que atendeu à solicitação. Em respostas em streaming, todos os chunks o incluem. O campo é `null` para gateways que usam suas próprias credenciais de provedor.

```json
{
    "object": "chat.completion.chunk",
    "model": "@openai/gpt-5-mini",
    "provider": "azure-us",
    "choices": [ ... ]
}
```

Se um provedor falhar e o AIVAX tentar novamente a solicitação em outro provedor, `provider` refletirá o provedor que produziu a resposta.

## Modelos obsoletos

Use `_details.provider_model.is_deprecated` em `GET /v1/models` quando precisar preferir um modelo integrado atual. Ele é `true` quando o modelo é marcado como obsoleto ou quando tem uma data de lançamento mais de 12 meses antes do dia atual. Um modelo sem data de lançamento não é marcado como obsoleto apenas por idade. A marcação não remove o modelo da lista por si só.
