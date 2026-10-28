Source: https://docs.aivax.net/pt-br/docs/data-processing/decisions.html

# Decisões semânticas

Decisões semânticas avaliam perguntas nomeadas contra um estado compartilhado e retornam respostas estruturadas ao invés de uma explicação gerada. Use-as para encaminhar solicitações de suporte, selecionar uma categoria, verificar uma condição ou atribuir uma pontuação ordenada.

Uma requisição fornece o modelo, as evidências em `state` e um objeto `questions`. Cada pergunta tem um ID que você escolhe; a resposta usa o mesmo ID em `answers`. Você pode fazer diferentes tipos de perguntas em uma única requisição sem precisar de chamadas de API separadas.

Use [structured responses](https://docs.aivax.net/pt-br/docs/inference/structured-responses.md) em vez disso quando precisar de um objeto gerado maior ou de uma explicação escrita. Para similaridade baseada em embeddings entre documentos e rótulos, veja [Text classification](https://docs.aivax.net/pt-br/docs/data-processing/classification.md).

## Escolha um modelo

Todos os modelos abaixo suportam `choice`, `noul` e `score`. Consulte [Usage and cost](#usage-and-cost) para taxas de modelo e [Model-specific limits](#model-specific-limits) para limites de modelo.

| Modelo |
| --- |
| `@supersonic-labs/julia-1` |
| `@typesafe/jev-1.13` |
| `@typesafe/jev-1.14` |
| `@respan/span-02` |
| `@respan/span-01` |
| `@respan/span-01-lite` |
| `@jaredpalmer/kev-4b` |
| `@upstage/solar-decide` |
| `@cloudflare/clef` |
| `@cloudflare/clef-flash` |
| `@liquid/d1-ultra` |
| `@liquid/d1` |
| `@perplexity/pplx-decider-v1.2` |
| `@perplexity/pplx-decider-flash-v1.2` |
| `@perplexity/pplx-decider-v1.1-27b` |
| `@openai/gpt-6-luna-decisions` |
| `@microsoft/microsoft-decision-1` |
| `@nace-ai/drex-v1.5` |
| `@nace-ai/drex-v2.0` |
| `@nace-ai/drex-max` |
| `@cloudflare/clef-omni` |
| `@upstage/solar-decide-flash` |
| `@scaledown/classify-1` |
| `@inception/mercury-decide` |

Cada resposta devolve o nome canônico do modelo em `model`. Esses nomes curtos também são aceitos como aliases e resolvem para um modelo canônico fixo; um alias pode mudar para uma versão mais nova quando for lançada, portanto fixe o nome canônico quando precisar de uma versão estável:

| Alias | Resolve para |
| --- | --- |
| `@supersonic-labs/julia` | `@supersonic-labs/julia-1` |
| `@typesafe/jev` | `@typesafe/jev-1.14` |
| `@respan/span` | `@respan/span-01` |
| `@respan/span-lite` | `@respan/span-01-lite` |
| `@jaredpalmer/kev` | `@jaredpalmer/kev-4b` |
| `@liquid/d` | `@liquid/d1` |
| `@perplexity/pplx-decider` | `@perplexity/pplx-decider-v1.1-27b` |
| `@perplexity/pplx-decider-flash` | `@perplexity/pplx-decider-flash-v1.2` |
| `@nace-ai/drex` | `@nace-ai/drex-v1.5` |

Um limite de contexto não especificado não significa entrada ilimitada. Limites específicos de modelo e interpretação de pontuações podem diferir; valide um modelo em exemplos representativos antes de mudar o tráfego de produção.

É necessária uma chave de API autenticada e um saldo de conta positivo, inclusive ao selecionar um modelo com preço base de token zero. Consulte [Authentication](https://docs.aivax.net/pt-br/docs/authentication.md), [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) e [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md).

### Descobrir modelos programaticamente

`GET /api/v1/information/decisions-models.json` lista o catálogo atual de modelos de decisão sem autenticação. O array `data` da resposta contém:

- `name`: o identificador canônico para usar em uma requisição de decisão.
- `aliases`: outros identificadores aceitos para esse modelo.
- `contextLength`: o contexto anunciado em tokens, ou `null` quando não especificado.
- `maxImages`: o número de imagens aceitas por requisição, ou `0` para modelos apenas de texto.
- `releaseDate`: a data de lançamento do catálogo no formato `yyyy-MM-dd`.
- `capabilities`: tipos de pergunta suportados (`noul`, `choice` e/ou `score`).
- `inputPricePerMillionTokens` e `outputPricePerMillionTokens`: preços base de tokens antes de ajustes de conta e plano; veja [Usage and cost](#usage-and-cost).

Use esta lista para preencher seletores de modelo ao invés de manter um catálogo codificado separado. Ela descreve modelos configurados, não um verificador de saúde do provedor em tempo real. Limites específicos de opções e perguntas de modelo não estão incluídos nesta lista.

## Escreva as perguntas

| Tipo | Formato `criteria` | Use para |
| --- | --- | --- |
| `choice` | Objeto que mapeia IDs de escolha para descrições | Selecionar um destino ou categoria |
| `noul` | Objeto com descrições não vazias para `false` e `true` | Avaliar uma condição booleana |
| `score` | Array ordenado de descrições de nível | Avaliar uma condição graduada |

Toda pergunta requer `instructions` não vazias. Use descrições que distingam as opções, não apenas IDs opacos. Por exemplo, `"billing": "Charges, payments, and refunds"` fornece mais evidência do que `"billing": "B"`.

Para `noul`, ambos os critérios são necessários. Descreva o que conta como falso com a mesma atenção que o que conta como verdadeiro, especialmente quando o estado pode omitir a informação relevante. Para `score`, mantenha a ordem dos níveis consistente entre requisições.

## Avalie uma solicitação de suporte

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

Para um passo a passo com código de roteamento e preços de modelo, veja [Decisions API example: triage a support ticket](https://aivax.net/blog/support-triage-typed-decisions/).

### Enviar imagens

`@cloudflare/clef`, `@cloudflare/clef-flash`, `@cloudflare/clef-omni` e `@openai/gpt-6-luna-decisions` aceitam imagens. Coloque cada imagem diretamente em um array `state` de nível superior como uma parte `image_url`, ao lado de itens de texto escritos como strings simples:

```json
{
  "model": "@cloudflare/clef-omni",
  "state": [
    "Listing title: Red square sticker",
    { "type": "image_url", "image_url": { "url": "data:image/png;base64,<BASE64_IMAGE>" } }
  ],
  "questions": {
    "matches_title": {
      "type": "noul",
      "instructions": "The photo shows the item in the title.",
      "criteria": { "true": "The item in the title is visible", "false": "The item is not visible" }
    }
  }
}
```

- `url` deve ser um URL de dados base64 do tipo `image/png`, `image/jpeg` ou `image/webp`. URLs remotas `http(s)` não são buscadas e são rejeitadas.
- Imagens aninhadas dentro de objetos em `state` não são lidas como imagens. Um campo `images` de nível superior, partes `input_image` e base64 sem o prefixo `data:image/...;base64,` não são suportados.
- Apenas alguns modelos aceitam imagens, cada um até um máximo por requisição. Enviar imagens para qualquer outro modelo, ou mais do que o modelo aceita, retorna `400`. Veja [Model-specific limits](#model-specific-limits).
- Clef e Clef Flash também limitam o tamanho da imagem e a quantidade de texto que leem de `state`; veja a mesma seção de limites. A cobrança usa os tokens de entrada que o modelo processa, conforme relatado em `usage.input_tokens`.

### Leia a resposta

A resposta de sucesso é um objeto JSON direto, **sem um envelope `data`**. Ele contém:

- `id`: o identificador da decisão.
- `model`: o identificador canônico do modelo usado na requisição.
- `provider`: o provedor relatado para o resultado.
- `answers`: um objeto indexado pelos seus IDs de pergunta.
- `usage`: `input_tokens`, `output_tokens` e o `cost` cobrado.

Para Julia-1, um objeto `answers` ilustrativo para o exemplo acima é mostrado abaixo. Esses números explicam o formato; eles não são uma resposta registrada ou garantia de qualidade.

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
- `noul` é a probabilidade atribuída ao critério verdadeiro, não um Boolean JSON. Sua aplicação escolhe o limiar e como lidar com casos incertos.
- `score` é o **índice de nível baseado em zero** esperado. No exemplo, `0 × 0.8 + 1 × 0.1 + 2 × 0.1 = 0.3`. Não é necessariamente um inteiro, e não é uma pontuação normalizada 0–1 quando há mais de dois níveis.
- `probabilities` são indexados por IDs de escolha, `false`/`true`, ou índices de nível de pontuação. `legend` descreve os níveis de pontuação.

Outros modelos podem omitir campos opcionais como `probabilities`, `legend` ou `confidence`. Não presuma que todo provedor use a mesma escala de pontuação ou definição de confiança. Uma alta probabilidade não é prova de que a decisão está correta; valide limites e regras de escalonamento com exemplos rotulados do seu próprio domínio.

## Limites de taxa da conta

As solicitações de decisão semântica compartilham um limite de taxa a nível de conta entre modelos e chaves de API. Cada solicitação conta uma vez, mesmo quando contém múltiplas perguntas. Essa cota é separada da alocação diária de assinatura e se aplica tanto ao uso incluído quanto ao pago. Um travessão (`—`) significa que o plano não impõe limite.

| Limite | Gratuito | Pro | Máx |
| --- | --- | --- | --- |
| Solicitações de decisão semântica | 10/min | 50/min | — |

Esses limites por minuto são compartilhados entre chaves de API pertencentes à mesma conta. Eles são independentes das alocações de assinatura e faturamento: o uso incluído ainda consome a cota de solicitações. Cada solicitação consome uma unidade, independentemente de quantas perguntas contém ou qual modelo de decisão seleciona.

Solicitações acima do limite retornam `429 Too Many Requests` antes da avaliação. Distribua as chamadas pela conta e faça nova tentativa com backoff após a janela de limite de taxa limpar; mudar chaves de API dentro da mesma conta não fornece uma cota separada. Uma tentativa imediata ainda encontra a janela de limite de taxa ativa. Max não tem limite imposto pelo plano para esta cota, mas outros limites aplicáveis permanecem em vigor.

## Limites específicos de modelo

Esses limites específicos de modelo se aplicam além da cota de solicitações a nível de conta acima. Um limite de contexto não especificado não implica entrada ilimitada.

| Modelo | Contexto |
| --- | --- |
| `@supersonic-labs/julia-1` | 1.024 tokens por pergunta |
| `@typesafe/jev-1.13` | 262.144 tokens |
| `@typesafe/jev-1.14` | 262.144 tokens |
| `@respan/span-02` | 131.072 tokens |
| `@respan/span-01` | Não especificado no catálogo atual |
| `@respan/span-01-lite` | Não especificado no catálogo atual |
| `@jaredpalmer/kev-4b` | 8.192 tokens |
| `@upstage/solar-decide` | 524.288 tokens |
| `@cloudflare/clef` | 65.536 tokens |
| `@cloudflare/clef-flash` | 24.576 tokens |
| `@liquid/d1-ultra` | 32.768 tokens |
| `@liquid/d1` | 65.536 tokens |
| `@perplexity/pplx-decider-v1.2` | 262.144 tokens |
| `@perplexity/pplx-decider-flash-v1.2` | 262.144 tokens |
| `@perplexity/pplx-decider-v1.1-27b` | 262.144 tokens |
| `@openai/gpt-6-luna-decisions` | 1.050.000 tokens |
| `@microsoft/microsoft-decision-1` | 32.768 tokens |
| `@nace-ai/drex-v1.5` | 131.072 tokens |
| `@cloudflare/clef-omni` | 65.536 tokens |
| `@nace-ai/drex-v2.0` | 131.072 tokens |
| `@nace-ai/drex-max` | 262.144 tokens |
| `@upstage/solar-decide-flash` | 524.288 tokens |
| `@scaledown/classify-1` | 1.000.000 tokens |
| `@inception/mercury-decide` | 65.536 tokens |

Entrada de imagem por requisição: `@cloudflare/clef`, `@cloudflare/clef-flash` e `@cloudflare/clef-omni` aceitam até 4 imagens; `@inception/mercury-decide` aceita até 16; `@openai/gpt-6-luna-decisions` aceita até 128. Outros modelos de decisão são apenas texto. O campo `maxImages` da lista de modelos é o valor autoritário.

`@cloudflare/clef` e `@cloudflare/clef-flash` rejeitam requisições que excedam sua janela de processamento, portanto mantenha cada imagem abaixo de aproximadamente 300 KB antes da codificação. Eles também leem aproximadamente os primeiros 2.000 tokens de texto em `state`; imagens são contadas separadamente.

Julia-1 tem limites de serviço adicionais:

| Limite | Valor |
| --- | --- |
| Perguntas por requisição | 1–32 |
| Escolhas ou níveis de pontuação por pergunta | 2–20 |
| Opções booleanas | Exatamente duas: false e true |
| Contexto combinado por pergunta | 1.024 tokens, incluindo estado, pergunta, opções e tokens especiais |
| Orçamento de pergunta e opções | 256 tokens dentro do contexto combinado |
| Descrição de uma opção individual | No máximo 48 tokens |
| Limite de payload de decisão | 256 KiB |

Esses limites interagem: vinte opções podem exceder o orçamento combinado de pergunta/opções mesmo que cada descrição caiba em seu limite individual. Os atuais limites de serviço AIVAX Julia-1 se aplicam mesmo que um cartão de modelo upstream liste um contexto maior. Encurte descrições ou reduza a contagem de opções ao invés de supor que todo máximo pode ser usado de uma vez.

Entradas que excedem o contexto ou o orçamento de pergunta/opções são rejeitadas, não truncadas silenciosamente. O literal `<mask>` é reservado e não pode aparecer no estado, instruções ou descrições de opção do Julia-1.

## Uso e custo

As taxas de modelos de decisão abaixo são preços base em USD por milhão de tokens de entrada, antes de ajustes de conta e plano (veja o [plan multiplier](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers)). Tokens de saída não têm custo no catálogo atual de modelos de decisão. Julia-1 é elegível à alocação diária descrita abaixo; outros modelos de decisão são cobrados normalmente.

| Modelo | Preço de entrada por milhão de tokens |
| --- | --- |
| `@supersonic-labs/julia-1` | **$0.008** |
| `@typesafe/jev-1.13` | **$0.042** |
| `@typesafe/jev-1.14` | **$0.042** |
| `@respan/span-02` | **$0.010** |
| `@respan/span-01` | **$0.020** |
| `@respan/span-01-lite` | **$0.000** |
| `@jaredpalmer/kev-4b` | **$0.042** |
| `@upstage/solar-decide` | **$0.100** |
| `@cloudflare/clef` | **$0.240** |
| `@cloudflare/clef-flash` | **$0.038** |
| `@liquid/d1-ultra` | **$0.042** |
| `@liquid/d1` | **$0.020** |
| `@perplexity/pplx-decider-v1.2` | **$0.020** |
| `@perplexity/pplx-decider-flash-v1.2` | **$0.010** |
| `@perplexity/pplx-decider-v1.1-27b` | **$0.020** |
| `@openai/gpt-6-luna-decisions` | **$0.100** |
| `@microsoft/microsoft-decision-1` | **$0.042** |
| `@nace-ai/drex-v1.5` | **$0.040** |
| `@cloudflare/clef-omni` | **$0.150** |
| `@nace-ai/drex-v2.0` | **$0.060** |
| `@nace-ai/drex-max` | **$0.060** |
| `@upstage/solar-decide-flash` | **$0.100** |
| `@scaledown/classify-1` | **$0.050** |
| `@inception/mercury-decide` | **$0.040** |

Para Julia-1, o uso de entrada soma a sequência codificada para cada pergunta, excluindo preenchimento. O estado compartilhado, portanto, é contado novamente para cada pergunta. Várias perguntas sobre um único estado não têm o mesmo uso de entrada que uma única pergunta sobre esse estado. Julia-1 não gera texto, então seu valor `output_tokens` é zero.

Julia-1 está atualmente elegível à alocação diária de decisões semânticas nos planos Free, Pro e Max. Outros modelos de decisão são cobrados normalmente. A alocação é compartilhada entre chamadas de decisão elegíveis, não reservada para cada pergunta ou chave de API. Consulte [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances) para capacidade relativa do plano e regras de cobertura.

Quando não coberto, a entrada do Julia-1 é cobrada na [taxa listada](#usage-and-cost), sujeita a ajustes de conta e plano. Use o `usage.cost` retornado para o valor efetivamente cobrado; ele é zero quando a entrada está totalmente coberta pela alocação.

## Erros e uso confiável

- **Modelo ou pergunta inválidos:** verifique o identificador exato do modelo, tipo de pergunta, instruções e formato dos critérios. IDs de perguntas e de escolha devem ser não vazios.
- **Limite de contexto ou opção excedido:** encurte o estado ou descrições, reduza a contagem de opções ou selecione um modelo com limites adequados. Repetir a mesma entrada inválida não resolverá o problema.
- **Erro de autenticação ou saldo:** verifique a chave de API e o saldo da conta antes de tentar novamente. Um modelo com preço zero ainda requer saldo positivo.
- **Limite de taxa (429):** reduza a taxa de solicitações da conta e tente novamente com backoff. Múltiplas perguntas em uma única requisição ainda contam como uma solicitação, mas limites de carga específicos de modelo e uso por pergunta permanecem aplicáveis.
- **Capacidade temporária ou indisponibilidade do provedor:** evite uma tempestade de tentativas paralelas imediatas. Reduza a simultaneidade e use tentativas limitadas com backoff para falhas transitórias.

Avalie `choice`, `noul` e `score` separadamente ao validar um modelo: sucesso no roteamento não garante pontuação ou comportamento booleano confiáveis. Inclua estados ambíguos e incompletos no seu conjunto de testes e use revisão humana onde uma decisão errada tem consequências materiais. Uma nova tentativa é uma nova requisição; não presuma deduplicação automática ou saídas de modelo idênticas.

## Referência da API

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Evaluate%20semantic%20decisions)
