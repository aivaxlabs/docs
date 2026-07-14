# Reordenação

Use o endpoint de reordenação autônomo quando você já tem texto candidato e precisa que o AIVAX o ordene em relação a uma consulta. Ele não pesquisa uma coleção, cria embeddings ou recupera documentos adicionais. Ele aplica o reranker lexical local às strings exatas fornecidas pelo chamador.

Use [Semantic Search](semantic-search.md) em vez disso quando o AIVAX deve encontrar candidatos dentro de uma coleção RAG. O Semantic Search pode então aplicar `rrf`, `lexical` ou `smart` reordenação após a recuperação vetorial.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/rank</span>
</div>

## Limites de solicitação

| Limite | Valor |
| --- | ---: |
| Documentos por solicitação | 1.024 |
| Consulta mais todo o texto do documento | 32.768 caracteres |
| `top_n` | 1 até o número de documentos fornecidos |

`query` deve ser uma string não vazia. `documents` deve ser um array não vazio de strings. Quando `top_n` é omitido, o endpoint retorna uma pontuação para cada documento fornecido.

O reranker lexical considera tokens exatos, correspondências fuzzy de tokens, cobertura de termos, proximidade de termos e comprimento do documento. Os resultados contêm o `index` original baseado em zero e um `relevanceScore` normalizado; pontuações maiores indicam relevância lexical mais forte. O texto do documento não é repetido na resposta, portanto mapeie cada índice de resultado de volta ao array original `documents`.

## Faturamento e cota compartilhada

O endpoint registra um preço base de uso de US$0,0001 por solicitação, equivalente a US$1 por 10.000 buscas. O multiplicador de comissão do [plano](/docs/pt-br/pricing#usage-billing) da conta é aplicado quando o uso é registrado. Esse preço pertence apenas a `/api/v1/rank`; usar um reranker local dentro do Semantic Search não adiciona essa cobrança de endpoint autônomo.

A reordenação tem um [limite compartilhado por conta](/docs/pt-br/limits#rag-and-collection-limits) entre o endpoint autônomo e todo reranker não-`none` usado pela busca RAG.

Uma solicitação de Semantic Search com `reranker: "none"` não consome a cota de reordenação. Outros limites de busca RAG, limites de chave pública e limites de modelo permanecem independentes.

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

A reordenação melhora a ordenação apenas entre os candidatos fornecidos. Se o texto relevante estiver ausente da entrada, a reordenação não pode recuperá-lo; melhore a recuperação de candidatos ou use o Semantic Search primeiro.