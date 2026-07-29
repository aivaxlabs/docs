# Reflex

`@aivax/reflex-v1` é o reranker padrão da AIVAX. Ele combina relevância semântica de baixa latência com evidência lexical limitada e armazena em cache o processamento de consultas e documentos dentro de cada conta.

Use o Reflex quando sua aplicação possui um conjunto de documentos dinâmico e se beneficia ao reutilizar consultas ou documentos repetidos. Use [Pesquisa Semântica](semantic-search.md) quando os documentos devem estar em coleções RAG gerenciadas. Veja [Rerankers](reranking.md) para o catálogo completo de modelos e alternativas.

## Chamar Reflex

Envie solicitações para `POST /api/v1/generations/rerank`. Omitir `model` para usar o Reflex por padrão, ou enviar explicitamente `"model": "@aivax/reflex-v1"`.

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `model` | `string` | Não | `@aivax/reflex-v1`. |
| `query` | `string` | Sim | Texto não vazio usado para classificar os documentos. |
| `documents` | `string[]` | Sim | De um a 10.000 strings de documentos. |
| `top_n` | `number` | Não | Número máximo de resultados. O padrão é cinco ou a contagem de documentos quando menos de cinco são fornecidos; o Reflex retorna no máximo 200. |
| `min_score` | `number` | Não | Pontuação final mínima de relevância de `0` a `1`. O padrão é `0`. |

O catálogo declara um contexto de 1.948 tokens e um máximo de 10.000 documentos para o Reflex. A resposta identifica `@aivax/reflex-v1`, devolve resultados em ordem decrescente de relevância e preserva o `index` zero‑based original de cada documento. Strings de documentos duplicadas não são removidas do contrato de resposta; cada ocorrência mantém seu próprio índice de entrada.

Exemplo de solicitação usando o modelo padrão:

```json
{
  "query": "What is the cancellation period?",
  "documents": [
    "Annual plans may be cancelled within 30 days.",
    "Invoices are issued at the start of each month."
  ],
  "top_n": 2,
  "min_score": 0.2
}
```

Veja [Rerankers](reranking.md#read-the-response) para a estrutura de resposta comum e os campos `usage`.

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Entender cache e uso

O Reflex armazena em cache o processamento de consultas e documentos automaticamente dentro da sua conta. Reutilizar uma consulta ou string de documento exatamente igual pode gerar um acerto de cache em uma solicitação posterior. Alterar o texto cria uma entrada de cache diferente; mudar apenas a posição de um documento não altera sua chave de cache.

A disponibilidade do cache não é permanente. Use o objeto `usage` da resposta para inspecionar a solicitação atual:

| Campo | Significado |
| --- | --- |
| `input_tokens` | Tokens de consulta e documento processados como falhas de cache. |
| `cached_input_tokens` | Tokens de consulta e documento servidos a partir do cache. |
| `total_tokens` | Todos os tokens de entrada de consulta e documento; sempre `input_tokens + cached_input_tokens`. |
| `cost` | Cobrança final da conta registrada para a solicitação. |

A resposta pública não separa tokens de consulta dos tokens de documento. Os contadores descrevem a entrada completa processada pelo Reflex.

## Cobrança, limites e coleta de dados

Falhas e acertos de cache têm preços base diferentes. O `usage.cost` público é o valor final registrado na conta após os ajustes aplicáveis. Veja [Pricing](../pricing.md#reflex) para os preços atuais dos tokens.

Cada solicitação do Reflex consome a cota de solicitações de reranking da conta e a cota de tokens do Reflex. A cota de tokens conta `total_tokens`, incluindo entrada em cache. Exceder uma cota retorna `429 Too Many Requests`; veja [Plans and Limits](../limits.md).

Quando a configuração opcional de coleta de dados semânticos está ativada, pesquisas diretas elegíveis do Reflex recebem o desconto documentado e podem contribuir com a consulta, documentos enviados e resultados de classificação. Veja [Data Collecting](../data-collecting.md) antes de ativá-la.

## Usar o Reflex com RAG

O Reflex também é o reranker padrão após a AIVAX recuperar candidatos de coleções RAG. O alias de compatibilidade `smart` seleciona o mesmo modelo. Neste fluxo, o Reflex pode melhorar a ordem dos candidatos recuperados, mas não pode recuperar um documento que a etapa de recuperação não selecionou. Se documentos relevantes estiverem continuamente ausentes, ajuste a recuperação, segmentação, formulação da consulta ou a contagem de candidatos antes de ajustar o reranking.