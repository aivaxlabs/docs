Source: https://docs.aivax.net/pt-br/docs/data-processing/decisions.html

# Decisões Semânticas

Decisões semânticas avaliam perguntas nomeadas contra um estado compartilhado e retornam respostas estruturadas em vez de uma explicação gerada. Use-as para rotear solicitações de suporte, selecionar uma categoria, verificar uma condição ou atribuir uma pontuação ordenada.

Uma solicitação fornece o modelo, as evidências no `state` e um objeto `questions`. Cada pergunta tem um ID que você escolhe; a resposta usa o mesmo ID em `answers`. Você pode fazer diferentes tipos de perguntas em uma única solicitação sem fazer chamadas separadas à API.

Use [respostas estruturadas](https://docs.aivax.net/pt-br/docs/inference/structured-responses/concepts.md) quando precisar de um objeto gerado maior ou uma explicação escrita. Para similaridade baseada em embeddings entre documentos e rótulos, consulte [Classificação de texto](https://docs.aivax.net/pt-br/docs/data-processing/classification.md).

## Escolha um modelo

Os modelos de decisão disponíveis, com seus aliases (apelidos), tipos de perguntas suportados, contexto e preços, estão listados no [Catálogo de Modelos](https://aivax.net/models#decisions).

Cada resposta retorna o nome canônico do modelo em `model`. Você também pode enviar um alias de modelo, como `@supersonic-labs/julia:latest`. Um alias pode ser atualizado para uma versão mais nova quando uma for lançada, então fixe o nome canônico quando precisar de uma versão estável.

Um limite de contexto não especificado não significa entrada ilimitada. Limites específicos do modelo e a interpretação das pontuações podem variar; valide um modelo em exemplos representativos antes de direcionar o tráfego de produção.

Uma chave de API autenticada e um saldo positivo na conta são necessários, inclusive ao selecionar um modelo com preço base de token zero. Consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md), [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md).

### Descubra modelos programaticamente

`GET /api/v1/information/decisions-models.json` lista o catálogo atual de modelos de decisão sem autenticação. O array `data` da resposta contém:

- `name`: o identificador canônico a ser usado em uma solicitação de decisão.
- `aliases`: outros identificadores aceitos para esse modelo.
- `contextLength`: o contexto anunciado em tokens, ou `null` quando não especificado.
- `maxImages`: o número de imagens aceitas por solicitação, ou `0` para modelos apenas de texto.
- `releaseDate`: a data de lançamento do catálogo no formato `yyyy-MM-dd`.
- `capabilities`: tipos de perguntas suportados (`noul`, `choice` e/ou `score`).
- `inputPricePerMillionTokens` e `outputPricePerMillionTokens`: preços base de tokens antes dos ajustes de conta e plano; veja [Uso e custo](#usage-and-cost).

Use esta listagem para popular seletores de modelo em vez de manter um catálogo codificado separado. Ela descreve os modelos configurados, não uma verificação de saúde do provedor em tempo real. Limites específicos de opções e perguntas por modelo não estão incluídos nesta listagem.

## Escreva as perguntas

| Tipo | Formato de `criteria` | Use-o para |
| --- | --- | --- |
| `choice` | Objeto mapeando IDs de escolha para descrições | Selecionar um destino ou categoria |
| `noul` | Objeto com descrições não vazias para `false` e `true` | Avaliar uma condição Booleana |
| `score` | Array ordenado de descrições de nível | Avaliar uma condição graduada |

Cada pergunta requer `instructions` não vazios. Use descrições que distingam as opções, não apenas IDs opacos. Por exemplo, `"billing": "Charges, payments, and refunds"` fornece mais evidências do que `"billing": "B"`.

Para `noul`, ambos os critérios são obrigatórios. Descreva o que conta como falso com tanto cuidado quanto o que conta como verdadeiro, especialmente quando o estado pode omitir a informação relevante. Para `score`, mantenha a ordem dos níveis consistente entre as solicitações.

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

Dicas para respostas confiáveis:

- Mantenha apenas evidências relevantes no estado.
- Escreva instruções que expliquem a decisão, não aquelas que pedem uma cadeia de raciocínio ou texto adicional.
- Evite sobreposição nas descrições de escolha, a menos que essa ambiguidade seja intencional.

Para uma solicitação de triage executada inalterada no Jev, GPT-6 Luna Decisions e Gemini Decision 1, com código de roteamento e custo medido, consulte [Exemplo da API de Decisões Jev e OpenAI: triagem de ticket de suporte](https://aivax.net/blog/support-triage-typed-decisions/).

### Envie imagens

Alguns modelos de decisão aceitam imagens; verifique `maxImages` na [listagem de modelos](#discover-models-programmatically). Coloque cada imagem diretamente em um array `state` de nível superior como parte `image_url`, ao lado de itens de texto escritos como strings simples:

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

- `url` deve ser uma URL de dados base64 do tipo `image/png`, `image/jpeg` ou `image/webp`. URLs remotos `http(s)` não são buscados e são rejeitados.
- Imagens aninhadas dentro de objetos em `state` não são lidas como imagens. Um campo `images` de nível superior, partes `input_image` e base64 sem o prefixo `data:image/...;base64,` não são suportados.
- Apenas alguns modelos aceitam imagens, cada um até um máximo por solicitação. Enviar imagens para qualquer outro modelo, ou mais do que o modelo aceita, retorna `400`. Veja [Limites específicos do modelo](#model-specific-limits).
- Clef e Clef Flash também limitam o tamanho da imagem e a quantidade de texto que leem de `state`; veja a mesma seção de limites. A cobrança usa os tokens de entrada processados pelo modelo, conforme relatado em `usage.input_tokens`.

### Leia a resposta

A resposta de sucesso é um objeto JSON diretamente, **sem um envelope `data`**. Ele contém:

- `id`: o identificador da decisão.
- `model`: o identificador canônico do modelo usado na solicitação.
- `provider`: o provedor relatado para o resultado.
- `answers`: um objeto chaveado pelos IDs das suas perguntas.
- `usage`: `input_tokens`, `output_tokens` e o `cost` cobrado.

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

Com Julia-1:

- `choice` é o ID definido pelo chamador selecionado, não a descrição da opção.
- `noul` é a probabilidade atribuída ao critério verdadeiro, não um Booleano JSON. Sua aplicação escolhe o limiar e como lidar com casos incertos.
- `score` é o **índice de nível baseado em zero** esperado. No exemplo, `0 × 0.8 + 1 × 0.1 + 2 × 0.1 = 0.3`. Não é necessariamente um inteiro, e não é uma pontuação normalizada de 0–1 quando há mais de dois níveis.
- `probabilities` são chaves por IDs de escolha, `false`/`true` ou índices de nível de pontuação. `legend` descreve os níveis de pontuação.

Outros modelos podem omitir campos opcionais como `probabilities`, `legend` ou `confidence`. Não assuma que todos os provedores usam a mesma escala de pontuação ou definição de confiança. Uma alta probabilidade não é prova de que a decisão está correta; valide limiares e regras de escalonamento com exemplos rotulados do seu próprio domínio.

## Limites de taxa da conta

Solicitações de decisão semântica compartilham um único limite de taxa por minuto por conta, entre todos os modelos de decisão e chaves de API. Cada solicitação consome uma unidade, independentemente de quantas perguntas ela contenha ou qual modelo de decisão ela selecione. O número de solicitações por minuto depende do plano; veja [Limites de processamento de dados](https://docs.aivax.net/pt-br/docs/limits.md#data-processing).

Esta cota é independente da assinatura diária permitida e da cobrança: o uso incluído ainda consome unidades de solicitação. Ultimate não tem limite imposto pelo plano para esta cota, mas outros limites aplicáveis permanecem em vigor.

Solicitações acima do limite retornam `429 Too Many Requests` antes da avaliação. Uma tentativa imediata ainda encontra a janela ativa de limite de taxa, e alterar chaves de API dentro da mesma conta não fornece uma cota separada. Ritme as chamadas através da conta e tente novamente com backoff após a janela ser liberada.

## Limites específicos do modelo

Esses limites específicos do modelo se aplicam além da cota de solicitação de nível de conta acima. O contexto de cada modelo está listado no [Catálogo de Modelos](https://aivax.net/models#decisions); um limite de contexto não especificado não implica entrada ilimitada.

A maioria dos modelos de decisão é apenas de texto. O campo `maxImages` da [listagem de modelos](#discover-models-programmatically) é o número autoritativo de imagens que um modelo aceita por solicitação.

`@cloudflare/clef` e `@cloudflare/clef-flash` rejeitam solicitações que excedem sua janela de processamento, então mantenha cada imagem abaixo de cerca de 300 KB antes da codificação. Eles também leem aproximadamente os primeiros 2.000 tokens de texto em `state`; as imagens são contadas separadamente.

Julia-1 tem limites de serviço adicionais:

| Limite | Valor |
| --- | --- |
| Perguntas por solicitação | 1–32 |
| Escolhas ou níveis de pontuação por pergunta | 2–20 |
| Opções Booleanas | Exatamente duas: false e true |
| Contexto combinado por pergunta | 1.024 tokens, incluindo estado, pergunta, opções e tokens especiais |
| Orçamento de pergunta e opções | 256 tokens dentro do contexto combinado |
| Descrição de uma opção individual | No máximo 48 tokens |
| Limite de payload de decisão | 256 KiB |

Esses limites interagem: vinte opções podem exceder o orçamento combinado de pergunta/opções mesmo que cada descrição caiba em seu limite individual. Os limites atuais de serviço do AIVAX Julia-1 se aplicam mesmo se um cartão de modelo upstream listar um contexto maior. Encurte as descrições ou reduza o número de opções em vez de assumir que todos os máximos podem ser usados simultaneamente.

Entradas que excedem o contexto ou o orçamento de pergunta/opções são rejeitadas, não truncadas silenciosamente. O literal `<mask>` é reservado e não pode aparecer no estado, instruções ou descrições de opções do Julia-1.

## Uso e custo

Modelos de decisão são cobrados por token de entrada nas taxas base em USD listadas no [Catálogo de Modelos](https://aivax.net/models#decisions), antes dos ajustes de conta e plano (veja o [multiplicador de plano](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers)).

Para Julia-1, o uso de entrada soma a sequência codificada para cada pergunta, excluindo o preenchimento. O estado compartilhado é portanto contado novamente para cada pergunta, então o uso de entrada cresce com o número de perguntas mesmo quando elas compartilham um único estado. Julia-1 não gera texto, então seu valor de `output_tokens` é zero.

Julia-1 é atualmente elegível para a cota diária de decisão semântica em todos os planos. Outros modelos de decisão são cobrados normalmente. A cota é compartilhada entre todas as chamadas de decisão elegíveis da conta, não reservada para cada pergunta ou chave de API. Veja [Planos e Limites](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances) para capacidade relativa do plano e regras de cobertura.

Quando não coberto, a entrada do Julia-1 é cobrada em sua [taxa listada](https://aivax.net/models#decisions), sujeita a ajustes de conta e plano. Use o `usage.cost` retornado para o valor realmente cobrado; ele é zero quando a entrada é totalmente coberta pela cota.

## Erros e uso confiável

- **Modelo ou pergunta inválido:** verifique o identificador exato do modelo, tipo de pergunta, instruções e forma dos critérios. IDs de pergunta e IDs de escolha devem ser não vazios.
- **Limite de contexto ou opção excedido:** encurte o estado ou as descrições, reduza o número de opções ou selecione um modelo com limites adequados. Tentar novamente a mesma entrada inválida não a resolverá.
- **Erro de autenticação ou saldo:** verifique a chave de API e o saldo da conta antes de tentar novamente. Um modelo de preço zero ainda requer um saldo positivo.
- **Limite de taxa (429):** reduza a taxa de solicitação da conta e tente novamente com backoff. Múltiplas perguntas em uma única solicitação ainda contam como uma solicitação, mas os limites de payload específicos do modelo e o uso por pergunta permanecem aplicáveis.
- **Capacidade temporária ou indisponibilidade do provedor:** evite uma tempestade de tentativas paralelas imediatas. Reduza a concorrência e use tentativas limitadas com backoff para falhas transitórias.

Avalie `choice`, `noul` e `score` separadamente ao validar um modelo: o sucesso no roteamento não estabelece pontuação confiável ou comportamento Booleano. Inclua estados ambíguos e incompletos em seu conjunto de testes e use revisão humana onde uma decisão errada tenha consequências materiais. Uma tentativa é uma nova solicitação; não assuma deduplicação automática ou saídas idênticas do modelo.

## Referência da API

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Evaluate%20semantic%20decisions)
