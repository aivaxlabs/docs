---
{title: Decisões semânticas,linkTitle: Decisões semânticas,weight: 250,group: Generations,sourceHash: 6b9e533cc520179a,aliases: [/docs/pt-br/generations/decisions.html]}
---

# Decisões semânticas

Decisões semânticas avaliam perguntas nomeadas contra um estado compartilhado e retornam respostas estruturadas em vez de uma explicação gerada. Use-as para encaminhar solicitações de suporte, selecionar uma categoria, verificar uma condição ou atribuir uma pontuação ordenada.

Uma solicitação fornece o modelo, as evidências em `state` e um objeto `questions`. Cada pergunta tem um ID que você escolhe; a resposta usa o mesmo ID em `answers`. Você pode fazer diferentes tipos de pergunta em uma única solicitação sem precisar de chamadas de API separadas.

Use [structured responses](../inference/structured-responses.md) quando precisar de um objeto gerado maior ou de uma explicação escrita. Para similaridade baseada em embeddings entre documentos e rótulos, veja [Text classification](../rag/classification.md).

## Escolha um modelo

Todos os modelos abaixo suportam `choice`, `noul` e `score`. Consulte [Pricing](../pricing.md#semantic-decisions) para as tarifas dos modelos e [Plans and limits](../limits.md#semantic-decision-model-limits) para limites específicos de cada modelo.

| Modelo |
| --- |
| `@supersonic-labs/julia-1` |
| `@typesafe/jev-1.13` |
| `@respan/span-01` |
| `@respan/span-01-lite` |
| `@jaredpalmer/kev-4b` |
| `@upstage/solar-decide` |
| `@cloudflare/clef` |
| `@cloudflare/clef-flash` |
| `@liquid/d1` |
| `@perplexity/pplx-decider-v1-27b` |
| `@openai/gpt-6-luna-decisions` |

`@typesafe/jev` também é aceito e atualmente resolve para `@typesafe/jev-1.13`. Um limite de contexto não especificado não significa entrada ilimitada. Limites específicos de modelo e interpretação de pontuações podem diferir; valide um modelo em exemplos representativos antes de mudar o tráfego de produção.

É necessária uma chave de API autenticada e um saldo de conta positivo, inclusive ao selecionar um modelo com preço base de token zero. Consulte [Authentication](../authentication.md), [Pricing](../pricing.md) e [Plans and limits](../limits.md).

### Descobrir modelos programaticamente

`GET /api/v1/information/decisions-models.json` lista o catálogo atual de modelos de decisão sem autenticação. O array `data` da resposta contém:

- `name`: o identificador canônico a ser usado em uma solicitação de decisão.
- `aliases`: outros identificadores aceitos para esse modelo.
- `contextLength`: o contexto anunciado em tokens, ou `null` quando não especificado.
- `releaseDate`: a data de lançamento do catálogo no formato `yyyy-MM-dd`.
- `capabilities`: tipos de pergunta suportados (`noul`, `choice` e/ou `score`).
- `inputPricePerMillionTokens` e `outputPricePerMillionTokens`: preços base em USD, antes de ajustes de conta e plano.

Use esta lista para preencher seletores de modelo em vez de manter um catálogo codificado separado. Ela descreve os modelos configurados, não um verificação de saúde do provedor em tempo real. Limites de opções e perguntas específicas de modelo não estão incluídos nesta lista.

## Escreva as perguntas

| Tipo | formato `criteria` | Use para |
| --- | --- | --- |
| `choice` | Objeto que mapeia IDs de escolha para descrições | Selecionar um destino ou categoria |
| `noul` | Objeto com descrições não vazias de `false` e `true` | Avaliar uma condição booleana |
| `score` | Array ordenado de descrições de níveis | Avaliar uma condição graduada |

Toda pergunta requer `instructions` não vazias. Use descrições que distingam as opções, não apenas IDs opacos. Por exemplo, `"billing": "Charges, payments, and refunds"` fornece mais evidência do que `"billing": "B"`.

Para `noul`, ambos os critérios são necessários. Descreva o que conta como falso com tanto cuidado quanto o que conta como verdadeiro, especialmente quando o estado pode omitir a informação relevante. Para `score`, mantenha a ordem dos níveis consistente entre as solicitações.

## Avaliar uma solicitação de suporte

Envie o seguinte corpo JSON para `POST /api/v1/generations/decisions`. O exemplo usa Julia-1; seu estado pode ser texto, um objeto ou um array.

```json
{
  "model": "@supersonic-labs/julia-1",
  "state": {
    "message": "I was charged twice. Please return the extra payment."
  },
  "questions": {
    "department": {
      "type": "choice",
      "instructions": "Which team should handle this request?",
      "criteria": {
        "billing": "Charges, payments, and refunds",
        "technical": "Software errors and service outages",
        "sales": "Plans, pricing, and purchases"
      }
    },
    "refund_requested": {
      "type": "noul",
      "instructions": "Does the customer explicitly ask for money back?",
      "criteria": {
        "false": "The customer does not ask for money to be returned",
        "true": "The customer asks for a refund or return of a payment"
      }
    },
    "urgency": {
      "type": "score",
      "instructions": "How urgent is the request based on the stated deadline?",
      "criteria": [
        "No deadline stated",
        "A deadline is stated, but it is not today",
        "The customer explicitly needs resolution today"
      ]
    }
  }
}
```

Mantenha apenas as evidências relevantes no estado. As instruções devem explicar a decisão, não solicitar uma cadeia de raciocínio ou texto adicional. Evite descrições de escolha sobrepostas, a menos que a ambiguidade seja intencional.

### Ler a resposta

A resposta de sucesso é um objeto JSON direto, **sem um envelope `data`**. Ele contém:

- `id`: o identificador da decisão.
- `model`: o identificador canônico do modelo usado na solicitação.
- `provider`: o provedor relatado para o resultado.
- `answers`: um objeto indexado pelos IDs das suas perguntas.
- `usage`: `input_tokens`, `output_tokens` e o `cost` faturado.

Para Julia-1, um objeto `answers` ilustrativo para o exemplo acima é mostrado abaixo. Esses números explicam o formato; eles não são uma resposta registrada nem uma garantia de qualidade.

```json
{
  "department": {
    "type": "choice",
    "choice": "billing",
    "probabilities": {
      "billing": 0.90,
      "technical": 0.06,
      "sales": 0.04
    }
  },
  "refund_requested": {
    "type": "noul",
    "noul": 0.95,
    "probabilities": {
      "false": 0.05,
      "true": 0.95
    }
  },
  "urgency": {
    "type": "score",
    "score": 0.3,
    "legend": {
      "0": "No deadline stated",
      "1": "A deadline is stated, but it is not today",
      "2": "The customer explicitly needs resolution today"
    },
    "probabilities": {
      "0": 0.8,
      "1": 0.1,
      "2": 0.1
    }
  }
}
```

Para Julia-1:

- `choice` é o ID definido pelo chamador selecionado, não a descrição da opção.
- `noul` é a probabilidade atribuída ao critério verdadeiro, não um Boolean JSON. Seu aplicativo escolhe o limiar e como lidar com casos incertos.
- `score` é o **índice de nível baseado em zero** esperado. No exemplo, `0 × 0.8 + 1 × 0.1 + 2 × 0.1 = 0.3`. Não é necessariamente um inteiro e não é uma pontuação normalizada de 0–1 quando há mais de dois níveis.
- `probabilities` são indexadas por IDs de escolha, `false`/`true`, ou índices de nível de pontuação. `legend` descreve os níveis de pontuação.

Outros modelos podem omitir campos opcionais como `probabilities`, `legend` ou `confidence`. Não presuma que todo provedor use a mesma escala de pontuação ou definição de confiança. Uma alta probabilidade não prova que a decisão está correta; valide limiares e regras de escalonamento com exemplos rotulados do seu próprio domínio.

## Limites de taxa da conta

Solicitações de decisão semântica compartilham um limite de taxa a nível de conta entre modelos e chaves de API. Cada solicitação conta uma vez, mesmo contendo múltiplas perguntas. Essa cota é separada da alocação diária de assinatura e se aplica tanto ao uso incluído quanto ao pago. Consulte [Plans and Limits](../limits.md#plan-limits) para os limites do Free, Pro e Max.

Solicitações acima do limite retornam `429 Too Many Requests` antes da avaliação. Distribua as chamadas ao longo da conta e tente novamente com backoff após a janela de limite de taxa ser liberada; mudar chaves de API dentro da mesma conta não fornece uma cota separada.

## Limites específicos de modelo

Consulte [Semantic decision model limits](../limits.md#semantic-decision-model-limits) para os limites atuais de contexto, pergunta, opção e payload. Os limites interagem: encurte descrições ou reduza a contagem de opções ao invés de assumir que todo máximo pode ser usado simultaneamente.

Entradas que excedem o orçamento de contexto ou de perguntas/opções são rejeitadas, não truncadas silenciosamente. O literal `<mask>` é reservado e não pode aparecer no estado, instruções ou descrições de opção do Julia-1.

## Uso e custo

Para Julia-1, o uso de entrada soma a sequência codificada para cada pergunta, excluindo preenchimento. O estado compartilhado, portanto, é contado novamente para cada pergunta. Múltiplas perguntas sobre um estado não têm o mesmo uso de entrada que uma única pergunta sobre esse estado. Julia-1 não gera texto, portanto seu valor `output_tokens` é zero.

Julia-1 está atualmente elegível para a alocação diária de decisões semânticas nos planos Free, Pro e Max. Outros modelos de decisão são cobrados normalmente. A alocação é compartilhada entre chamadas de decisão elegíveis, não reservada para cada pergunta ou chave de API. Consulte [Plans and Limits](../limits.md#included-daily-subscription-allowances) para a capacidade relativa do plano e regras de cobertura.

Quando não coberto, a entrada do Julia-1 é cobrada à [tarifa listada](../pricing.md#semantic-decisions), sujeita a ajustes de conta e plano. Use o `usage.cost` retornado para o valor efetivamente cobrado; ele é zero quando a entrada está totalmente coberta pela alocação.

## Erros e uso confiável

- **Modelo ou pergunta inválido:** verifique o identificador exato do modelo, o tipo de pergunta, as instruções e a forma dos critérios. IDs de perguntas e de escolha devem ser não vazios.
- **Limite de contexto ou opção excedido:** encurte o estado ou as descrições, reduza a contagem de opções ou selecione um modelo com limites adequados. Repetir a mesma entrada inválida não a resolverá.
- **Erro de autenticação ou saldo:** verifique a chave de API e o saldo da conta antes de tentar novamente. Um modelo com preço zero ainda requer saldo positivo.
- **Limite de taxa (429):** reduza a taxa de requisições da conta e tente novamente com backoff. Múltiplas perguntas em uma única solicitação ainda contam como uma requisição, mas limites de payload específicos do modelo e uso por pergunta permanecem aplicáveis.
- **Capacidade temporária ou indisponibilidade do provedor:** evite uma tempestade de tentativas paralelas imediatas. Reduza a concorrência e use tentativas limitadas com backoff para falhas transitórias.

Avalie `choice`, `noul` e `score` separadamente ao validar um modelo: sucesso no roteamento não garante pontuação ou comportamento booleano confiáveis. Inclua estados ambíguos e incompletos no seu conjunto de testes e use revisão humana onde uma decisão errada tem consequências materiais. Uma nova tentativa é uma nova solicitação; não presuma deduplicação automática ou saídas idênticas do modelo.

## Referência da API

<script src="https://inference.aivax.net/apidocs?embed-target=Evaluate%20semantic%20decisions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
