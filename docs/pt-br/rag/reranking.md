# Re-ranqueadores

Re-ranqueadores reordenam um conjunto existente de documentos candidatos para uma consulta. Eles não pesquisam uma coleção nem recuperam um texto ausente da entrada. Use o endpoint autônomo quando sua aplicação já possui os candidatos ou use a [Busca semântica](semantic-search.md) para recuperar candidatos de uma coleção AIVAX antes de re-ranqueá-los.

## Re-ranquear documentos diretamente

Autentique a requisição com uma chave de API AIVAX conforme descrito em [Autenticação](../authentication.md). O endpoint recebe as strings dos documentos diretamente, portanto não é necessário criar uma coleção RAG antes.

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/rerank</span>
</div>

A requisição aceita:

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `model` | `string` | Não | Identificador determinístico no formato `@provider/name`. O padrão é `@aivax/reflex-v1`. |
| `query` | `string` | Sim | Texto não vazio usado para avaliar a relevância. |
| `documents` | `string[]` | Sim | Uma ou mais strings de documentos candidatos. O limite `maxDocuments` do modelo selecionado é aplicado quando declarado. |
| `top_n` | `number` | Não | Número de documentos classificados retornados. O padrão é cinco ou a quantidade de documentos quando menos de cinco são enviados. |
| `min_score` | `number` | Não | Pontuação mínima final de relevância de `0` a `1`. O padrão é `0`. |

Somente itens com `autonomousUse: true` podem ser usados aqui. O `rrf` depende das posições produzidas durante a recuperação RAG, e `none` desabilita o re-ranqueamento, portanto nenhum dos dois é aceito por esse endpoint. A rota antiga `/api/v1/generations/reflex/rerank` continua como alias; use a rota genérica em novas integrações.

Exemplo de requisição:

```json
{
  "model": "@qwen/qwen3-reranker-0.6b",
  "query": "Como cancelar uma assinatura anual?",
  "documents": [
    "Assinaturas anuais podem ser canceladas nas configurações de cobrança.",
    "As faturas são geradas no primeiro dia de cada mês."
  ],
  "top_n": 2,
  "min_score": 0.2
}
```

## Interpretar a resposta

O serviço aplica `min_score`, retorna no máximo `top_n` resultados e preserva o `index` original de base zero de cada documento.

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
        "text": "Assinaturas anuais podem ser canceladas nas configurações de cobrança."
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

Apenas um documento aparece porque o outro candidato não atingiu o `min_score` do exemplo.

O `usage` é normalizado pelo AIVAX, portanto seus campos dependem de como o modelo selecionado mede o consumo:

| Campo | Quando aparece | Significado |
| --- | --- | --- |
| `input_tokens` | Modelos cobrados por tokens | Tokens de entrada informados na execução ou inferidos quando o modelo não os informa. |
| `cached_input_tokens` | Reflex | Tokens de entrada servidos pelo cache da conta. |
| `total_tokens` | Quando o consumo de tokens está disponível | Total medido de tokens de entrada. No Reflex, equivale a `input_tokens + cached_input_tokens`. |
| `search_units` | Modelos cobrados por unidade de busca | Unidades de busca consumidas pela requisição. |
| `estimated` | Quando o AIVAX precisou inferir o consumo de tokens | `true` indica que a contagem não foi informada diretamente. |
| `request_id` | Quando disponível | Identificador da execução, útil para investigar uma requisição específica. |
| `cost` | Sempre | Custo final registrado na conta AIVAX, após os ajustes aplicáveis à conta. |

Para modelos cobrados por unidade de busca, a base de cobrança vem do custo exato informado para aquela execução, e não de uma estimativa por tokens. Custos usados internamente para calcular a cobrança não são copiados para a resposta pública como campos `cost` adicionais.

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Consultar o catálogo de modelos

Use o catálogo em tempo real em vez de fixar nomes, preços, capacidades ou limites no código:

<div class="request-item get">
    <span>GET</span>
    <span>/api/v1/information/rerankers-models.json</span>
</div>

Cada item fornece `name`, `description`, `pricingDescription`, `autonomousUse`, `technicalInformation.contextSize`, `technicalInformation.maxDocuments` e `isDefault`.

`contextSize` é o contexto máximo de tokens declarado, enquanto `maxDocuments` é a quantidade máxima de documentos aplicada pelo endpoint público. Um valor `null` indica que o catálogo não declara aquele limite.

O catálogo atual inclui:

| Nome | Autônomo | Limites declarados | Preço |
| --- | --- | --- | --- |
| `@aivax/reflex-v1` | Sim | Contexto de 1.948 tokens; 10.000 documentos | `$0.015/mtokens` sem cache; `$0.003/mtokens` com cache |
| `@jina/reranker-v3` | Sim | Contexto de 131.072 tokens | `$0.05/mtokens` |
| `@qwen/qwen3-reranker-0.6b` | Sim | Contexto de 32.768 tokens; 1.024 documentos | `$0.01/mtokens` |
| `@qwen/qwen3-reranker-4b` | Sim | Contexto de 32.768 tokens; 1.024 documentos | `$0.025/mtokens` |
| `@qwen/qwen3-reranker-8b` | Sim | Contexto de 32.768 tokens; 1.024 documentos | `$0.05/mtokens` |
| `@nvidia/llama-nemotron-rerank-vl-1b-v2` | Sim | Contexto de 10.240 tokens; 1.024 documentos | `$0.01/mtokens` |
| `@cohere/rerank-4-pro` | Sim | Contexto de 32.768 tokens; 10.000 documentos | `$0.0025/search unit` |
| `@cohere/rerank-4-fast` | Sim | Contexto de 32.768 tokens; 10.000 documentos | `$0.002/search unit` |
| `@cohere/rerank-3.5` | Sim | Contexto de 4.096 tokens; 10.000 documentos | `$0.001/search unit` |
| `lexical` | Sim | Sem limite declarado no catálogo | Sem custo |
| `rrf` | Não | Somente RAG | Sem custo |
| `none` | Não | Somente RAG | Sem custo |

`smart` continua como alias de compatibilidade aceito para `@aivax/reflex-v1`, mas não é um modelo separado do catálogo. Prefira nomes canônicos nas configurações persistidas e em novas integrações.

## Escolha do re-ranqueador

Comece pelo Reflex quando quiser o modelo padrão, baixa latência e reaproveitamento do processamento de consultas e documentos. Escolha outro modelo quando sua cobertura de idiomas, janela de contexto, qualidade, latência ou unidade de cobrança for mais adequada à carga. Use `lexical` para um re-ranqueamento local, sensível às palavras e sem custo. Use `rrf` somente depois da recuperação RAG quando quiser combinar as posições dos rankings vetorial e lexical.

O re-ranqueamento melhora apenas a ordem entre os candidatos fornecidos. Se o documento relevante estiver ausente, melhore a recuperação de candidatos, a fragmentação, a formulação da consulta ou o `min_score` antes de comparar modelos.

## Limites e falhas

O endpoint retorna `400 Bad Request` para modelos desconhecidos ou não autônomos, `top_n` ou `min_score` inválidos, entrada vazia ou quantidade de documentos acima do limite declarado pelo modelo. O Reflex retorna no máximo 200 resultados, embora aceite até 10.000 documentos.

Todas as operações de re-ranqueamento diferentes de `none` compartilham a cota de requisições de re-ranqueamento da conta. O Reflex também possui uma cota de tokens. Exceder qualquer uma delas retorna `429 Too Many Requests`; veja [Planos e limites](../limits.md). Falhas de capacidade e execução usam mensagens genéricas do serviço de re-ranqueamento e não identificam a infraestrutura interna.
