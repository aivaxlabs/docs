# Rerankers

Rerankers reordenam um conjunto existente de documentos candidatos para uma consulta. Eles não pesquisam uma coleção nem recuperam texto que está ausente da entrada. Use o endpoint de reranking autônomo quando sua aplicação já possui os candidatos, ou use [Semantic Search](semantic-search.md) para recuperar candidatos de uma coleção AIVAX antes de rerankear.

## Rerank documents directly

Autentique esta requisição com uma chave de API AIVAX conforme descrito em [Authentication](../authentication.md). O endpoint aceita strings de documentos diretamente, portanto você não precisa criar uma coleção RAG primeiro.

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/rerank</span>
</div>

A requisição aceita:

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `query` | `string` | Sim | Texto não vazio usado para avaliar a relevância. |
| `documents` | `string[]` | Sim | Uma ou mais strings de documentos candidatos. O limite `maxDocuments` do modelo selecionado se aplica quando declarado. |
| `model` | `string` | Não | Identificador determinístico `@provider/name`. O padrão é `@aivax/reflex-v1`. |
| `top_n` | `number` | Não | Número de documentos classificados retornados. O padrão é cinco ou a contagem de documentos quando menos de cinco são fornecidos. |
| `min_score` | `number` | Não | Pontuação mínima de relevância final de `0` a `1`. O padrão é `0`. |

Somente entradas com `autonomousUse: true` podem ser usadas aqui. `rrf` depende de classificações produzidas durante a recuperação RAG, e `none` desativa o reranking, portanto nenhum deles é aceito por este endpoint. A rota legada `/api/v1/generations/reflex/rerank` continua como um alias; use a rota genérica para novas integrações.

Exemplo de requisição:

```json
{
  "model": "@qwen/qwen3-reranker-0.6b",
  "query": "Como cancelo uma assinatura anual?",
  "documents": [
    "Assinaturas anuais podem ser canceladas nas configurações de faturamento.",
    "Faturas são geradas no primeiro dia de cada mês."
  ],
  "top_n": 2,
  "min_score": 0.2
}
```

## Read the response

O serviço aplica `min_score`, retorna no máximo `top_n` resultados e preserva o `index` original baseado em zero de cada documento.

Exemplo de resposta:

```json
{
  "id": "req_sgoj6yeyux78bqnbza6f8wi6iy",
  "model": "@qwen/qwen3-reranker-0.6b",
  "results": [
    {
      "index": 0,
      "relevance_score": 0.979416906833649,
      "document": {
        "text": "Assinaturas anuais podem ser canceladas nas configurações de faturamento."
      }
    }
  ],
  "usage": {
    "input_tokens": 263,
    "total_tokens": 263,
    "request_id": "RDhp9HavIRUisZ4vToHfTtJZ",
    "cost": 0.0000027615
  }
}
```

Aparece apenas um documento porque o outro candidato não atendeu ao `min_score` do exemplo.

`usage` é normalizado pela AIVAX, portanto seus campos dependem de como o modelo selecionado mede o consumo:

| Campo | Quando aparece | Significado |
| --- | --- | --- |
| `input_tokens` | Modelos baseados em tokens | Tokens de entrada relatados para a execução ou inferidos quando o modelo não os relata. |
| `cached_input_tokens` | Reflex | Tokens de entrada servidos a partir do cache escopo da conta. |
| `total_tokens` | Quando o uso de tokens está disponível | Total de tokens de entrada medidos. Para Reflex, isso equivale a `input_tokens + cached_input_tokens`. |
| `search_units` | Modelos de unidade de busca | Unidades de busca consumidas pela requisição. |
| `estimated` | Quando a AIVAX precisou inferir o uso de tokens | `true` significa que a contagem de tokens não foi relatada diretamente. |
| `request_id` | Quando disponível | Identificador da execução útil ao investigar uma requisição específica. |
| `cost` | Sempre | Custo final registrado na conta AIVAX, após ajustes de conta aplicáveis. |

Para modelos de unidade de busca, a base de faturamento vem do custo exato da requisição relatado para essa execução, em vez de um cálculo inferido de tokens. Custos usados internamente para calcular a cobrança não são copiados na resposta pública como campos `cost` adicionais.

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Available rerankers

O catálogo atual de reranking inclui:

| Nome | Autônomo | Limites declarados | Preços |
| --- | --- | --- | --- |
| `@aivax/reflex-v1` | Sim | Contexto de 2.048 tokens; 10.000 documentos | `$0.015/mtokens` cache miss; `$0.003/mtokens` cache hit |
| `@jina/reranker-v3` | Sim | Contexto de 131.072 tokens | `$0.05/mtokens` |
| `@qwen/qwen3-reranker-0.6b` | Sim | Contexto de 32.768 tokens; 1.024 documentos | `$0.01/mtokens` |
| `@qwen/qwen3-reranker-4b` | Sim | Contexto de 32.768 tokens; 1.024 documentos | `$0.025/mtokens` |
| `@qwen/qwen3-reranker-8b` | Sim | Contexto de 32.768 tokens; 1.024 documentos | `$0.05/mtokens` |
| `@nvidia/llama-nemotron-rerank-vl-1b-v2` | Sim | Contexto de 10.240 tokens; 1.024 documentos | `$0.01/mtokens` |
| `@cohere/rerank-4-pro` | Sim | Contexto de 32.768 tokens; 10.000 documentos | `$0.0025/search unit` |
| `@cohere/rerank-4-fast` | Sim | Contexto de 32.768 tokens; 10.000 documentos | `$0.002/search unit` |
| `@cohere/rerank-3.5` | Sim | Contexto de 4.096 tokens; 10.000 documentos | `$0.001/search unit` |
| `lexical` | Sim | Sem limite de catálogo | Sem custo |
| `rrf` | Não | Apenas RAG | Sem custo |
| `none` | Não | Apenas RAG | Sem custo |

`smart` é um alias de compatibilidade aceito para `@aivax/reflex-v1`, mas não é um modelo de catálogo separado. Prefira nomes de modelo canônicos na configuração armazenada e em novas integrações.

## Choosing a reranker

Comece com Reflex quando quiser o modelo padrão, baixa latência e processamento reutilizável de consultas/documentos. Escolha outro modelo quando sua cobertura de linguagem, janela de contexto, qualidade, latência ou unidade de faturamento combinar melhor com a carga de trabalho. Use `lexical` para reranking local, sem custo e consciente de palavras. Use `rrf` somente após a recuperação RAG quando quiser combinar posições de classificação vetorial e lexical.

## Limits and failures

O endpoint retorna `400 Bad Request` para modelos desconhecidos ou não autônomos, `top_n` ou `min_score` inválidos, entrada vazia ou contagem de documentos acima do limite declarado do modelo. Reflex retorna no máximo 200 resultados, embora aceite até 10.000 documentos.

Todas as operações de reranking que não sejam `none` compartilham a cota de requisições de reranking da conta. Reflex também tem uma cota de taxa de tokens. Exceder qualquer cota retorna `429 Too Many Requests`; veja [Plans and Limits](../limits.md). Falhas de capacidade e execução usam mensagens genéricas de serviço de reranking e não identificam a infraestrutura interna.