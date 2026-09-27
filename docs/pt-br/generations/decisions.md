# Decisões semânticas

Decisões semânticas avaliam perguntas nomeadas contra um estado compartilhado e retornam respostas estruturadas ao invés de uma explicação gerada. Use-as para encaminhar solicitações de suporte, selecionar uma categoria, verificar uma condição ou atribuir uma pontuação ordenada.

Uma solicitação fornece o modelo, as evidências em `state` e um objeto `questions`. Cada pergunta tem um ID que você escolhe; a resposta usa o mesmo ID em `answers`. Você pode fazer tipos de perguntas diferentes em uma única solicitação sem precisar de chamadas de API separadas.

Use [structured responses](../inference/structured-responses.md) quando precisar de um objeto gerado maior ou de uma explicação escrita. Para similaridade baseada em embeddings entre documentos e rótulos, veja [Text classification](../rag/classification.md).

## Escolha um modelo

Todos os modelos abaixo suportam `choice`, `noul` e `score`. Os preços são valores base em USD por milhão de tokens de entrada; ajustes de conta e plano ainda se aplicam. Tokens de saída não têm custo no catálogo atual de modelos de decisão.

| Modelo | Preço de entrada / milhão de tokens | Contexto |
| --- | ---: | --- |
| `@supersonic-labs/julia-1` | $0.008 | 1.024 tokens por pergunta |
| `@typesafe/jev-1.13` | $0.042 | 32.768 tokens |
| `@respan/span-01` | $0.020 | Não especificado no catálogo atual |
| `@respan/span-01-lite` | $0.000 | Não especificado no catálogo atual |
| `@jaredpalmer/kev-4b` | $0.042 | 8.192 tokens |

`@typesafe/jev` também é aceito e atualmente resolve para `@typesafe/jev-1.13`. Um limite de contexto não especificado não significa entrada ilimitada. Limites específicos do modelo e interpretação de pontuações podem diferir; valide um modelo com exemplos representativos antes de mudar o tráfego de produção.

Uma chave de API autenticada e um saldo positivo são necessários, inclusive ao selecionar um modelo com preço base de token zero. Veja [Authentication](../authentication.md), [Pricing](../pricing.md) e [Plans and limits](../limits.md).

### Descobrir modelos programaticamente

`GET /api/v1/information/decisions-models.json` lista o catálogo atual de modelos de decisão sem autenticação. O array `data` da resposta contém:

- `name`: o identificador canônico a ser usado em uma solicitação de decisão.
- `aliases`: outros identificadores aceitos para esse modelo.
- `contextLength`: o contexto anunciado em tokens, ou `null` quando não especificado.
- `releaseDate`: a data de lançamento do catálogo no formato `yyyy-MM-dd`.
- `capabilities`: tipos de pergunta suportados (`noul`, `choice` e/ou `score`).
- `inputPricePerMillionTokens` e `outputPricePerMillionTokens`: preços base em USD, antes de ajustes de conta e plano.

Use esta lista para preencher seletores de modelo ao invés de manter um catálogo codificado separadamente. Ela descreve modelos configurados, não um verificador de saúde do provedor em tempo real. Limites específicos de opção e pergunta não estão incluídos nesta lista.

## Escreva as perguntas

| Tipo | Formato de `criteria` | Use para |
| --- | --- | --- |
| `choice` | Objeto que mapeia IDs de escolha para descrições | Selecionar um destino ou categoria |
| `noul` | Objeto com descrições não vazias de `false` e `true` | Avaliar uma condição booleana |
| `score` | Array ordenado de descrições de nível | Avaliar uma condição graduada |

Cada pergunta requer `instructions` não vazias. Use descrições que distingam as opções, não apenas IDs opacos. Por exemplo, `"billing": "Charges, payments, and refunds"` fornece mais evidência que `"billing": "B"`.

Para `noul`, ambos os critérios são necessários. Descreva o que conta como falso com o mesmo cuidado que o que conta como verdadeiro, especialmente quando o estado pode omitir a informação relevante. Para `score`, mantenha a ordem dos níveis consistente entre solicitações.

## Avaliar uma solicitação de suporte

Envie o seguinte corpo JSON para `POST /api/v1/generations/decisions`. O exemplo usa Julia-1; seu estado pode ser texto, um objeto ou um array.

```json
{
  "model": "@supersonic-labs/julia-1",
  "state": {
    "message": "Fui cobrado duas vezes. Por favor, devolva o pagamento extra."
  },
  "questions": {
    "department": {
      "type": "choice",
      "instructions": "Qual equipe deve lidar com esta solicitação?",
      "criteria": {
        "billing": "Cobranças, pagamentos e reembolsos",
        "technical": "Erros de software e interrupções de serviço",
        "sales": "Planos, preços e compras"
      }
    },
    "refund_requested": {
      "type": "noul",
      "instructions": "O cliente pede explicitamente a devolução do dinheiro?",
      "criteria": {
        "false": "O cliente não pede que o dinheiro seja devolvido",
        "true": "O cliente pede um reembolso ou devolução de um pagamento"
      }
    },
    "urgency": {
      "type": "score",
      "instructions": "Quão urgente é a solicitação com base no prazo declarado?",
      "criteria": [
        "Nenhum prazo declarado",
        "Um prazo foi declarado, mas não é hoje",
        "O cliente precisa explicitamente de resolução hoje"
      ]
    }
  }
}
```

Mantenha apenas evidências relevantes no estado. As instruções devem explicar a decisão, não solicitar uma cadeia de raciocínio ou texto adicional. Evite descrições de escolha sobrepostas a menos que a ambiguidade seja intencional.

### Ler a resposta

A resposta de sucesso é um objeto JSON direto, **sem um envelope `data`**. Ele contém:

- `id`: o identificador da decisão.
- `model`: o identificador canônico do modelo usado na solicitação.
- `provider`: o provedor relatado para o resultado.
- `answers`: um objeto indexado pelos seus IDs de pergunta.
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
      "0": "Nenhum prazo declarado",
      "1": "Um prazo foi declarado, mas não é hoje",
      "2": "O cliente precisa explicitamente de resolução hoje"
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
- `noul` é a probabilidade atribuída ao critério verdadeiro, não um Booleano JSON. Seu aplicativo escolhe o limiar e como lidar com casos incertos.
- `score` é o **índice de nível baseado em zero** esperado. No exemplo, `0 × 0.8 + 1 × 0.1 + 2 × 0.1 = 0.3`. Não é necessariamente um inteiro e não é uma pontuação normalizada de 0–1 quando há mais de dois níveis.
- `probabilities` são indexadas por IDs de escolha, `false`/`true` ou índices de nível de pontuação. `legend` descreve os níveis de pontuação.

Outros modelos podem omitir campos opcionais como `probabilities`, `legend` ou `confidence`. Não presuma que todo provedor usa a mesma escala de pontuação ou definição de confiança. Uma alta probabilidade não prova que a decisão está correta; valide limites e regras de escalonamento com exemplos rotulados do seu próprio domínio.

## Limites de taxa da conta

Solicitações de decisão semântica compartilham um limite de taxa a nível de conta entre modelos e chaves de API. Cada solicitação conta uma vez, mesmo contendo várias perguntas. Essa cota é separada da alocação diária de assinatura e se aplica tanto ao uso incluído quanto ao pago. Veja [Plans and Limits](../limits.md#plan-limits) para os limites Free, Pro e Max.

Solicitações acima do limite retornam `429 Too Many Requests` antes da avaliação. Distribua as chamadas ao longo da conta e faça novas tentativas com backoff após a janela de limite de taxa limpar; mudar chaves de API dentro da mesma conta não fornece uma cota separada.

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

Os limites interagem: vinte opções podem exceder o orçamento combinado de pergunta/opção mesmo que cada descrição seja individualmente curta o suficiente. Encurte as descrições ou reduza a contagem de opções ao invés de assumir que o máximo pode ser usado de uma vez.

Entradas que excedem o contexto ou o orçamento de pergunta/opção são rejeitadas, não truncadas silenciosamente. O literal `<mask>` é reservado e não pode aparecer no estado, nas instruções ou nas descrições de opções. Estes são os limites atuais de serviço AIVAX Julia-1; figuras de contexto maiores em um cartão de modelo upstream não os substituem.

## Uso e custo

Para Julia-1, o uso de entrada soma a sequência codificada para cada pergunta, excluindo preenchimento. O estado compartilhado, portanto, é contado novamente para cada pergunta. Quatro perguntas sobre um estado não têm o mesmo uso de entrada que uma única pergunta sobre esse estado. Julia-1 não gera texto, então seu valor `output_tokens` é zero.

Julia-1 está atualmente elegível para a alocação diária de decisões semânticas nos planos Free, Pro e Max. Outros modelos de decisão são cobrados normalmente. A alocação é compartilhada entre chamadas de decisão elegíveis, não reservada por pergunta ou chave de API. Veja [Plans and Limits](../limits.md#included-daily-subscription-allowances) para capacidade relativa do plano e regras de cobertura.

Quando não coberto, a entrada do Julia-1 é cobrada ao preço base de $0.008 por milhão de tokens antes de ajustes de conta e plano. Use o `usage.cost` retornado para o valor efetivamente faturado; ele é zero quando a entrada está totalmente coberta pela alocação.

## Erros e uso confiável

- **Modelo ou pergunta inválidos:** verifique o identificador exato do modelo, tipo de pergunta, instruções e formato dos critérios. IDs de pergunta e de escolha devem ser não vazios.
- **Limite de contexto ou opção excedido:** encurte o estado ou as descrições, reduza a contagem de opções ou selecione um modelo com limites adequados. Repetir a mesma entrada inválida não a resolverá.
- **Erro de autenticação ou saldo:** verifique a chave de API e o saldo da conta antes de tentar novamente. Um modelo com preço zero ainda requer saldo positivo.
- **Limite de taxa (429):** reduza a taxa de solicitações da conta e tente novamente com backoff. Múltiplas perguntas em uma solicitação ainda contam como uma solicitação, mas limites de payload específicos do modelo e uso por pergunta permanecem aplicáveis.
- **Capacidade temporária ou indisponibilidade do provedor:** evite uma tempestade de tentativas paralelas imediatas. Reduza a simultaneidade e use tentativas limitadas com backoff para falhas transitórias.

Avalie `choice`, `noul` e `score` separadamente ao validar um modelo: sucesso no roteamento não estabelece pontuação confiável ou comportamento booleano. Inclua estados ambíguos e incompletos no seu conjunto de testes e use revisão humana onde uma decisão errada tem consequências materiais. Uma nova tentativa é uma nova solicitação; não presuma deduplicação automática ou saídas idênticas do modelo.

## Referência de API

<script src="https://inference.aivax.net/apidocs?embed-target=Evaluate%20semantic%20decisions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>