# Decisões semânticas

Decisões semânticas avaliam perguntas nomeadas contra um estado compartilhado e retornam respostas estruturadas em vez de uma explicação gerada. Use-as para encaminhar solicitações de suporte, selecionar uma categoria, verificar uma condição ou atribuir uma pontuação ordenada.

Uma solicitação fornece o modelo, as evidências em `state` e um objeto `questions`. Cada pergunta tem um ID que você escolhe; a resposta usa o mesmo ID em `answers`. Você pode fazer diferentes tipos de perguntas em uma única solicitação sem precisar de chamadas de API separadas.

Use [respostas estruturadas](../inference/structured-responses.md) em vez disso quando precisar de um objeto gerado maior ou de uma explicação escrita. Para similaridade baseada em incoracamento entre documentos e rótulos, veja [Classificação de texto](../rag/classification.md).

## Escolha um modelo

Todos os modelos abaixo suportam `choice`, `noul` e `score`. Os preços são preços base em USD por milhão de tokens de entrada; ajustes de conta e plano ainda se aplicam. Tokens de saída não têm custo no catálogo atual de modelos de decisão.

| Modelo | Preço de entrada por milhão de tokens | Contexto |
| --- | ---: | --- |
| `@supersonic-labs/julia-1` | $0.008 | 1.024 tokens por pergunta |
| `@typesafe/jev-1.13` | $0.042 | 32.768 tokens |
| `@respan/span-01` | $0.020 | Não especificado no catálogo atual |
| `@respan/span-01-lite` | $0.000 | Não especificado no catálogo atual |
| `@jaredpalmer/kev-4b` | $0.042 | 8.192 tokens |

`@typesafe/jev` também é aceito e atualmente resolve para `@typesafe/jev-1.13`. Um limite de contexto não especificado não significa entrada ilimitada. Limites específicos do modelo e interpretação de pontuações podem diferir; valide um modelo em exemplos representativos antes de mudar o tráfego de produção.

É necessária uma chave de API autenticada e um saldo de conta positivo, inclusive ao selecionar um modelo com preço base de token zero. Veja [Autenticação](../authentication.md), [Preços](../pricing.md) e [Planos e limites](../limits.md).

### Descobrir modelos programaticamente

`GET /api/v1/information/decisions-models.json` lista o catálogo atual de modelos de decisão sem autenticação. O array `data` da resposta contém:

- `name`: o identificador canônico a ser usado em uma solicitação de decisão.
- `aliases`: outros identificadores aceitos para esse modelo.
- `contextLength`: o contexto anunciado em tokens, ou `null` quando não especificado.
- `releaseDate`: a data de lançamento do catálogo no formato `yyyy-MM-dd`.
- `capabilities`: tipos de pergunta suportados (`noul`, `choice` e/ou `score`).
- `inputPricePerMillionTokens` e `outputPricePerMillionTokens`: preços base em USD, antes de ajustes de conta e plano.

Use esta lista para preencher seletores de modelo em vez de manter um catálogo codificado separado. Ela descreve modelos configurados, não uma verificação de saúde do provedor em tempo real. Limites de opções e perguntas específicos do modelo não estão incluídos nesta lista.

## Escreva as perguntas

| Tipo | `criteria` formato | Use para |
| --- | --- | --- |
| `choice` | Objeto que mapeia IDs de escolha para descrições | Selecionar um destino ou categoria |
| `noul` | Objeto com descrições não vazias de `false` e `true` | Avaliar uma condição booleana |
| `score` | Array ordenado de descrições de níveis | Avaliar uma condição graduada |

Cada pergunta requer `instructions` não vazias. Use descrições que distingam as opções, não apenas IDs opacos. Por exemplo, `"billing": "Charges, payments, and refunds"` fornece mais evidência do que `"billing": "B"`.

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

Mantenha apenas evidências relevantes no estado. As instruções devem explicar a decisão, não solicitar uma cadeia de raciocínio ou texto adicional. Evite descrições de escolha sobrepostas a menos que a ambiguidade seja intencional.

### Ler a resposta

A resposta de sucesso é um objeto JSON direto, **sem um envelope `data`**. Ela contém:

- `id`: o identificador da decisão.
- `model`: o identificador canônico do modelo usado na solicitação.
- `provider`: o provedor relatado para o resultado.
- `answers`: um objeto indexado pelos seus IDs de pergunta.
- `usage`: `input_tokens`, `output_tokens` e o `cost` cobrado.

Para Julia-1, um objeto ilustrativo `answers` para o exemplo acima é mostrado abaixo. Esses números explicam o formato; eles não são uma resposta registrada ou garantia de qualidade.

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

Com Julia-1:

- `choice` é o ID definido pelo chamador selecionado, não a descrição da opção.
- `noul` é a probabilidade atribuída ao critério verdadeiro, não um Boolean JSON. Sua aplicação escolhe o limite e como lidar com casos incertos.
- `score` é o **índice de nível baseado em zero** esperado. No exemplo, `0 × 0.8 + 1 × 0.1 + 2 × 0.1 = 0.3`. Não é necessariamente um inteiro, e não é uma pontuação normalizada 0–1 quando há mais de dois níveis.
- `probabilities` são indexados por IDs de escolha, `false`/`true`, ou índices de nível de pontuação. `legend` descreve os níveis de pontuação.

Outros modelos podem omitir campos opcionais como `probabilities`, `legend` ou `confidence`. Não presuma que todo provedor use a mesma escala de pontuação ou definição de confiança. Uma alta probabilidade não prova que a decisão está correta; valide limites e regras de escalonamento com exemplos rotulados do seu próprio domínio.

## Limites do Julia-1

| Limite | Valor |
| --- | --- |
| Perguntas por solicitação | 1–32 |
| Escolhas ou níveis de pontuação por pergunta | 2–20 |
| Opções booleanas | Exatamente duas: false e true |
| Contexto combinado por pergunta | 1.024 tokens, incluindo estado, pergunta, opções e tokens especiais |
| Orçamento de pergunta e opções | 256 tokens dentro do contexto combinado |
| Descrição de uma opção individual | No máximo 48 tokens |
| Limite de payload de decisão | 256 KiB |

Os limites interagem: vinte opções podem exceder o orçamento combinado de pergunta/opções mesmo que cada descrição seja individualmente curta o suficiente. Encurte as descrições ou reduza a contagem de opções ao invés de supor que todo máximo pode ser usado de uma vez.

Entradas que excedem o contexto ou o orçamento de pergunta/opções são rejeitadas, não truncadas silenciosamente. O literal `<mask>` é reservado e não pode aparecer no estado, nas instruções ou nas descrições das opções. Estes são os limites atuais de serviço do AIVAX Julia-1; números de contexto maiores em um cartão de modelo upstream não os substituem.

## Uso e custo

Para Julia-1, o uso de entrada soma a sequência codificada para cada pergunta, excluindo preenchimento. O estado compartilhado, portanto, é contado novamente para cada pergunta. Quatro perguntas sobre um estado não têm o mesmo uso de entrada que uma pergunta sobre esse estado. Julia-1 não gera texto, portanto seu valor `output_tokens` é zero.

Ao preço base de $0,008 por milhão de tokens de entrada, 10.000 tokens de entrada custam $0,00008 antes de ajustes de conta e plano. Use o `usage.cost` retornado para o valor realmente cobrado ao invés de calculá-lo apenas a partir do preço base.

## Erros e uso confiável

- **Modelo ou pergunta inválidos:** verifique o identificador exato do modelo, o tipo de pergunta, as instruções e a forma dos critérios. IDs de perguntas e IDs de escolha devem ser não vazios.
- **Limite de contexto ou opção excedido:** encurte o estado ou as descrições, reduza a contagem de opções ou selecione um modelo com limites adequados. Repetir a mesma entrada inválida não a resolverá.
- **Erro de autenticação ou saldo:** verifique a chave de API e o saldo da conta antes de tentar novamente. Um modelo com preço zero ainda requer saldo positivo.
- **Capacidade temporária ou indisponibilidade do provedor:** evite uma tempestade de tentativas paralelas imediatas. Reduza a simultaneidade e use tentativas limitadas com backoff para falhas transitórias.

Avalie `choice`, `noul` e `score` separadamente ao validar um modelo: sucesso no roteamento não estabelece pontuação ou comportamento booleano confiáveis. Inclua estados ambíguos e incompletos no seu conjunto de testes e use revisão humana onde uma decisão errada tem consequências materiais. Uma tentativa novamente é uma nova solicitação; não presuma deduplicação automática ou saídas de modelo idênticas.

## Referência da API

<script src="https://inference.aivax.net/apidocs?embed-target=Evaluate%20semantic%20decisions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>