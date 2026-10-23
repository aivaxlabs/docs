---
{title: Decisões Semânticas,linkTitle: Decisões Semânticas,weight: 20,group: Data processing,aliases: [/docs/pt-br/generations/decisions.html,/docs/pt-br/data-processing/decisions.html],sourceHash: b74f8e7bbbf973b2}
---

# Decisões Semânticas

Decisões semânticas avaliam perguntas nomeadas contra um estado compartilhado e retornam respostas estruturadas ao invés de uma explicação gerada. Use-as para encaminhar solicitações de suporte, selecionar uma categoria, verificar uma condição ou atribuir uma pontuação ordenada.

Uma solicitação fornece o modelo, as evidências em `state` e um objeto `questions`. Cada pergunta tem um ID que você escolhe; a resposta usa o mesmo ID em `answers`. Você pode fazer diferentes tipos de perguntas em uma única solicitação sem precisar de chamadas de API separadas.

Use [Respostas estruturadas](../inference/structured-responses.md) quando precisar de um objeto gerado maior ou de uma explicação escrita. Para similaridade baseada em embeddings entre documentos e rótulos, veja [Classificação de texto](classification.md).

## Escolha um modelo

Todos os modelos abaixo suportam `choice`, `noul` e `score`. Consulte [Uso e custo](#usage-and-cost) para as tarifas dos modelos e [Limites específicos do modelo](#model-specific-limits) para os limites dos modelos.

| Model |
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
| `@perplexity/pplx-decider-v1.1-27b` |
| `@openai/gpt-6-luna-decisions` |
| `@microsoft/microsoft-decision-1` |
| `@nace-ai/drex-v1.5` |
| `@cloudflare/clef-omni` |

`@typesafe/jev` também é aceito e atualmente resolve para `@typesafe/jev-1.13`. `@perplexity/pplx-decider-v1-27b` também é aceito e resolve para `@perplexity/pplx-decider-v1.1-27b`. Um limite de contexto não especificado não significa entrada ilimitada. Limites específicos do modelo e interpretação de pontuações podem diferir; valide um modelo em exemplos representativos antes de mudar o tráfego de produção.

Uma chave de API autenticada e um saldo de conta positivo são necessários, inclusive ao selecionar um modelo com preço base de token zero. Veja [Autenticação](../authentication.md), [Precificação](../pricing.md) e [Planos e limites](../limits.md).

### Descubra modelos programaticamente

`GET /api/v1/information/decisions-models.json` lista o catálogo atual de modelos de decisão sem autenticação. O array `data` da resposta contém:

- `name`: o identificador canônico a ser usado em uma solicitação de decisão.
- `aliases`: outros identificadores aceitos para esse modelo.
- `contextLength`: o contexto anunciado em tokens, ou `null` quando não especificado.
- `maxImages`: o número de imagens aceitas por solicitação, ou `0` para modelos apenas texto.
- `releaseDate`: a data de lançamento do catálogo no formato `yyyy-MM-dd`.
- `capabilities`: tipos de pergunta suportados (`noul`, `choice` e/ou `score`).
- `inputPricePerMillionTokens` e `outputPricePerMillionTokens`: preços base por token antes de ajustes de conta e plano; veja [Uso e custo](#usage-and-cost).

Use essa listagem para preencher seletores de modelo ao invés de manter um catálogo codificado separado. Ela descreve modelos configurados, não um verificador de saúde do provedor em tempo real. Limites de opções e perguntas específicas do modelo não estão incluídos nesta listagem.

## Escreva as perguntas

| Tipo | Formato de `criteria` | Use para |
| --- | --- | --- |
| `choice` | Objeto mapeando IDs de escolha para descrições | Selecionar um destino ou categoria |
| `noul` | Objeto com descrições não vazias para `false` e `true` | Avaliar uma condição booleana |
| `score` | Array ordenado de descrições de nível | Avaliar uma condição graduada |

Cada pergunta requer `instructions` não vazias. Use descrições que diferenciem as opções, não apenas IDs opacos. Por exemplo, `"billing": "Charges, payments, and refunds"` fornece mais evidência que `"billing": "B"`.

Para `noul`, ambos os critérios são obrigatórios. Descreva o que conta como falso com tanto cuidado quanto o que conta como verdadeiro, especialmente quando o estado pode omitir a informação relevante. Para `score`, mantenha a ordem dos níveis consistente entre solicitações.

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

Mantenha apenas evidências relevantes no estado. As instruções devem explicar a decisão, não solicitar uma cadeia de raciocínio ou texto adicional. Evite descrições de escolha sobrepostas a menos que a ambiguidade seja intencional.

Para um passo‑a‑passo com código de roteamento e preços dos modelos, veja [Exemplo de API de Decisões: triagem de ticket de suporte](https://aivax.net/blog/support-triage-typed-decisions/).

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
- Apenas alguns modelos aceitam imagens, cada um até um máximo por solicitação. Enviar imagens para qualquer outro modelo, ou mais do que o modelo aceita, retorna `400`. Veja [Limites específicos do modelo](#model-specific-limits).
- Clef e Clef Flash também limitam o tamanho da imagem e a quantidade de texto que leem de `state`; veja a mesma seção de limites. A cobrança usa os tokens de entrada que o modelo processa, conforme relatado em `usage.input_tokens`.

### Leia a resposta

A resposta de sucesso é um objeto JSON direto, **sem um envelope `data`**. Ele contém:

- `id`: o identificador da decisão.
- `model`: o identificador canônico do modelo usado na solicitação.
- `provider`: o provedor relatado para o resultado.
- `answers`: um objeto indexado pelos seus IDs de pergunta.
- `usage`: `input_tokens`, `output_tokens` e o `cost` cobrado.

Para Julia-1, um objeto `answers` ilustrativo para o exemplo acima é mostrado abaixo. Esses números explicam o formato; não são uma resposta gravada nem garantia de qualidade.

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
- `score` é o **índice de nível baseado em zero** esperado. No exemplo, `0 × 0.8 + 1 × 0.1 + 2 × 0.1 = 0.3`. Não é necessariamente um inteiro, e não é uma pontuação normalizada de 0–1 quando há mais de dois níveis.
- `probabilities` são indexadas por IDs de escolha, `false`/`true`, ou índices de nível de pontuação. `legend` descreve os níveis de pontuação.

Outros modelos podem omitir campos opcionais como `probabilities`, `legend` ou `confidence`. Não presuma que todo provedor use a mesma escala de pontuação ou definição de confiança. Uma alta probabilidade não prova que a decisão está correta; valide limiares e regras de escalonamento com exemplos rotulados do seu próprio domínio.

## Limites de taxa da conta

Solicitações de decisão semântica compartilham um limite de taxa ao nível da conta entre modelos e chaves de API. Cada solicitação conta uma vez, mesmo contendo múltiplas perguntas. Essa cota é separada da concessão diária de assinatura e se aplica tanto ao uso incluído quanto ao pago. Um travessão (`—`) indica que o plano não impõe limite.

| Limite | Free | Pro | Max |
| --- | --- | --- | --- |
| Solicitações de decisão semântica | 10/min | 50/min | — |

Esses limites por minuto são compartilhados entre chaves de API pertencentes à mesma conta. Eles são independentes das concessões de assinatura e da cobrança: o uso incluído ainda consome a cota de solicitações. Cada solicitação consome uma unidade, independentemente de quantas perguntas contenha ou qual modelo de decisão seja selecionado.

Solicitações acima do limite retornam `429 Too Many Requests` antes da avaliação. Modere as chamadas na conta e tente novamente com retentiva após a janela de limite de taxa limpar; mudar de chave de API dentro da mesma conta não fornece cota separada. Uma nova tentativa imediata ainda encontra a janela de limite de taxa ativa. O plano Max não tem limite imposto de plano para esta cota, mas outros limites aplicáveis permanecem em vigor.

## Limites específicos do modelo

Esses limites específicos do modelo se aplicam além da cota de solicitações ao nível da conta acima. Um limite de contexto não especificado não implica entrada ilimitada.

| Model | Contexto |
| --- | --- |
| `@supersonic-labs/julia-1` | 1.024 tokens por pergunta |
| `@typesafe/jev-1.13` | 64.000 tokens |
| `@respan/span-01` | Não especificado no catálogo atual |
| `@respan/span-01-lite` | Não especificado no catálogo atual |
| `@jaredpalmer/kev-4b` | 8.192 tokens |
| `@upstage/solar-decide` | 524.288 tokens |
| `@cloudflare/clef` | 65.536 tokens |
| `@cloudflare/clef-flash` | 65.536 tokens |
| `@liquid/d1` | 65.536 tokens |
| `@perplexity/pplx-decider-v1.1-27b` | 262.144 tokens |
| `@openai/gpt-6-luna-decisions` | 1.050.000 tokens |
| `@microsoft/microsoft-decision-1` | 32.768 tokens |
| `@nace-ai/drex-v1.5` | 131.072 tokens |
| `@cloudflare/clef-omni` | 65.536 tokens |

Entrada de imagem por solicitação: `@cloudflare/clef`, `@cloudflare/clef-flash` e `@cloudflare/clef-omni` aceitam até 4 imagens; `@openai/gpt-6-luna-decisions` aceita até 128. Outros modelos de decisão são apenas texto.

`@cloudflare/clef` e `@cloudflare/clef-flash` rejeitam solicitações que excedam sua janela de processamento, portanto mantenha cada imagem abaixo de aproximadamente 300 KB antes da codificação. Eles também leem aproximadamente os primeiros 2.000 tokens de texto em `state`; imagens são contadas separadamente.

Julia-1 tem limites de serviço adicionais:

| Limite | Valor |
| --- | --- |
| Perguntas por solicitação | 1–32 |
| Escolhas ou níveis de pontuação por pergunta | 2–20 |
| Opções booleanas | Exatamente duas: false e true |
| Contexto combinado por pergunta | 1.024 tokens, incluindo estado, pergunta, opções e tokens especiais |
| Orçamento de pergunta e opções | 256 tokens dentro do contexto combinado |
| Descrição de uma opção individual | No máximo 48 tokens |
| Limite de carga útil da decisão | 256 KiB |

Esses limites interagem: vinte opções podem exceder o orçamento combinado de pergunta/opções mesmo que cada descrição caiba em seu limite individual. Os limites atuais de serviço do AIVAX Julia-1 se aplicam mesmo que um cartão de modelo upstream liste um contexto maior. Reduza descrições ou diminua a contagem de opções ao invés de presumir que todo máximo pode ser usado de uma só vez.

Entradas que excedem o contexto ou o orçamento de pergunta/opções são rejeitadas, não truncadas silenciosamente. O literal `<mask>` é reservado e não pode aparecer no estado, nas instruções ou nas descrições de opções do Julia-1.

## Uso e custo

As tarifas dos modelos de decisão abaixo são preços base em USD por milhão de tokens de entrada, antes de ajustes de conta e plano (veja o [multiplicador de plano](../pricing.md#plan-multipliers)). Tokens de saída não têm custo no catálogo atual de modelos de decisão. Julia-1 tem direito à concessão diária descrita abaixo; outros modelos de decisão são cobrados normalmente.

| Model | Preço de entrada por milhão de tokens |
| --- | ---: |
| `@supersonic-labs/julia-1` | **$0.008** |
| `@typesafe/jev-1.13` | **$0.042** |
| `@respan/span-01` | **$0.020** |
| `@respan/span-01-lite` | **$0.000** |
| `@jaredpalmer/kev-4b` | **$0.042** |
| `@upstage/solar-decide` | **$0.050** |
| `@cloudflare/clef` | **$0.240** |
| `@cloudflare/clef-flash` | **$0.038** |
| `@liquid/d1` | **$0.040** |
| `@perplexity/pplx-decider-v1.1-27b` | **$0.020** |
| `@openai/gpt-6-luna-decisions` | **$0.100** |
| `@microsoft/microsoft-decision-1` | **$0.042** |
| `@nace-ai/drex-v1.5` | **$0.040** |
| `@cloudflare/clef-omni` | **$0.150** |

Para Julia-1, o uso de entrada soma a sequência codificada para cada pergunta, excluindo preenchimento. O estado compartilhado, portanto, é contado novamente para cada pergunta. Múltiplas perguntas sobre um mesmo estado não têm o mesmo uso de entrada de uma única pergunta sobre esse estado. Julia-1 não gera texto, então seu valor `output_tokens` é zero.

Julia-1 está atualmente elegível à concessão diária de decisão semântica nos planos Free, Pro e Max. Outros modelos de decisão são cobrados normalmente. A concessão é compartilhada entre chamadas de decisão elegíveis, não reservada por pergunta ou chave de API. Veja [Planos e limites](../limits.md#included-daily-subscription-allowances) para capacidade relativa do plano e regras de cobertura.

Quando não coberto, a entrada do Julia-1 é cobrada na [tarifa listada](#usage-and-cost), sujeita a ajustes de conta e plano. Use o `usage.cost` retornado para o valor efetivamente cobrado; ele é zero quando a entrada é totalmente coberta pela concessão.

## Erros e uso confiável

- **Modelo ou pergunta inválidos:** verifique o identificador exato do modelo, o tipo de pergunta, as instruções e a forma dos critérios. IDs de perguntas e de escolha devem ser não vazios.
- **Limite de contexto ou opção excedido:** encurte o estado ou as descrições, reduza a contagem de opções ou selecione um modelo com limites adequados. Repetir a mesma entrada inválida não a resolverá.
- **Erro de autenticação ou saldo:** verifique a chave de API e o saldo da conta antes de tentar novamente. Um modelo com preço zero ainda requer saldo positivo.
- **Limite de taxa (429):** reduza a taxa de solicitações da conta e tente novamente com retentiva. Múltiplas perguntas em uma única solicitação ainda contam como uma solicitação, mas limites de carga útil específicos do modelo e uso por pergunta permanecem aplicáveis.
- **Capacidade temporária ou indisponibilidade do provedor:** evite uma tempestade imediata de tentativas paralelas. Reduza a simultaneidade e use tentativas limitadas com retentiva para falhas transitórias.

Avalie `choice`, `noul` e `score` separadamente ao validar um modelo: sucesso no roteamento não garante pontuação ou comportamento booleano confiáveis. Inclua estados ambíguos e incompletos no seu conjunto de testes e use revisão humana quando uma decisão errada tiver consequências materiais. Uma nova tentativa é uma nova solicitação; não presuma deduplicação automática ou saídas idênticas do modelo.

## Referência da API

<script src="https://inference.aivax.net/apidocs?embed-target=Evaluate%20semantic%20decisions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
