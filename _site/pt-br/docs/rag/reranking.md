Source: https://docs.aivax.net/pt-br/docs/rag/reranking.html

# Reclassificadores

Reclassificadores reordenam um conjunto existente de documentos candidatos para uma consulta. Eles não pesquisam uma coleção nem recuperam texto que está ausente da entrada. Use a API de reranking autônoma quando sua aplicação já possui os candidatos, ou use [Semantic Search](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) para recuperar candidatos de uma coleção AIVAX antes de reordená-los.

[Reflex](https://docs.aivax.net/pt-br/docs/rag/reflex.md) é o ranker padrão deste endpoint e da experiência de pesquisa sem coleção da AIVAX. Veja essa página quando quiser classificação ao estilo de recuperação sem gerenciar uma coleção.

## Reclassificar documentos diretamente

Autentique-se com uma [chave de API AIVAX](https://docs.aivax.net/pt-br/docs/authentication.md) e envie uma consulta com as strings dos documentos candidatos. A API devolve os candidatos em ordem de relevância. Cada resultado mantém sua posição de entrada, permitindo que você o mapeie de volta aos dados da sua aplicação.

Use reranking direto quando os candidatos são dinâmicos, provêm de outro sistema de busca ou não precisam ser armazenados em uma coleção AIVAX. Use pesquisa semântica gerenciada quando a AIVAX deve recuperar candidatos de um corpus persistente.

Para a solicitação, resposta, autenticação e contrato de erro suportados, use a Referência da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Rerank%20documents)

## Construir candidatos que valem a classificação

O reranking apenas reordena o que recebe, portanto a qualidade dos candidatos determina o teto. Mantenha cada string de candidato focada em uma ideia — um parágrafo ou uma seção curta ao invés de uma página inteira — para que a pontuação de relevância reflita um único tópico em vez de uma média de vários. Quando os candidatos provêm de fragmentação, prefira limites que preservem declarações completas; veja [Text segmentation](https://docs.aivax.net/pt-br/docs/data-processing/text-segmentation.md).

Use o [RAG pipeline checklist](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) para distinguir falhas de preparação, recuperação e ordenação.

Envie candidatos suficientes para cobrir respostas plausíveis: recupere em excesso primeiro, depois classifique com precisão. Use `top_n` para manter apenas o início da lista classificada e `min_score` para descartar resultados de baixa relevância. Calibre esse limiar nas suas próprias consultas, pois as escalas de pontuação diferem entre os rankers e um ponto de corte ajustado para uma carga de trabalho raramente se transfere para outra.

## Escolhendo um re‑ranker

Comece com o re‑ranker padrão, a menos que você tenha um motivo mensurado para selecionar outra opção disponível. O padrão é o Reflex; as alternativas incluem correspondência lexical, fusão de ranking recíproco de vários sinais e cross‑encoders de terceiros. A fusão (`rrf`) é apenas de recuperação e é rejeitada por este endpoint: ela existe para combinar sinais dentro da pesquisa de coleção, não para classificação autônoma.

Para comparar opções, defina um conjunto de consultas representativas com documentos relevantes conhecidos do seu próprio fluxo de trabalho — cobrindo seus idiomas, tamanhos de documentos e jargão — e meça se trocar os rankers eleva o documento correto. Se o documento relevante estiver totalmente ausente dos candidatos, nenhum ranker pode recuperá‑lo; melhore a recuperação de candidatos, a fragmentação, a formulação da consulta ou a quantidade de candidatos antes de comparar re‑rankers.

Para separar falhas de candidato ausente de falhas de ordenação ruim antes de adicionar um re‑ranker, veja [Do I need a reranker for RAG?](https://aivax.net/blog/semantic-search-vs-reranking/). Para avaliar quando o Reflex é suficiente em comparação com um cross‑encoder, veja [reranking RAG results without a cross-encoder](https://aivax.net/blog/reflex-retrieval-built-for-recurring-documents/).

Para disponibilidade atual, opções suportadas e limites de conta, veja a Referência da API e [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md).
