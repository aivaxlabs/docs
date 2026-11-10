Source: https://docs.aivax.net/pt-br/docs/rag/reranking.html

# Rerankers

Os rerankers reordenam um conjunto existente de documentos candidatos para uma consulta. Eles não buscam em uma coleção nem recuperam texto que esteja ausente da entrada. Use a API de reranking autônomo quando seu aplicativo já possuir os candidatos, ou use a [Busca Semântica](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) para recuperar candidatos de uma coleção AIVAX antes de reranká-los.

O [Reflex](https://docs.aivax.net/pt-br/docs/rag/reflex.md) é o ranker padrão deste endpoint e da experiência de busca sem coleção da AIVAX. Consulte essa página quando desejar rankeamento estilo recuperação sem gerenciar uma coleção.

## Rerankar documentos diretamente

Autentique-se com uma [chave de API da AIVAX](https://docs.aivax.net/pt-br/docs/authentication.md) e envie uma consulta com as strings dos documentos candidatos. A API retorna os candidatos em ordem de relevância. Cada resultado mantém sua posição de entrada, permitindo mapeá-lo de volta aos dados do seu aplicativo.

Use o reranking direto quando os candidatos forem dinâmicos, vierem de outro sistema de busca ou não precisarem ser armazenados em uma coleção AIVAX. Use a busca semântica gerenciada quando a AIVAX deve recuperar candidatos de um corpus persistente.

Para o contrato suportado de solicitação, resposta, autenticação e erro, consulte a Referência da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Rerank%20documents)

## Construa candidatos dignos de reranking

O reranking apenas reordena o que recebe, portanto, a qualidade dos candidatos define o teto. Mantenha cada string de candidato focada em uma única ideia — um parágrafo ou uma seção curta, em vez de uma página inteira — para que a pontuação de relevância reflita um tópico específico, em vez de uma média sobre muitos. Quando os candidatos vêm de chunking (segmentação), prefira limites que preservem declarações completas; veja [Segmentação de texto](https://docs.aivax.net/pt-br/docs/data-processing/text-segmentation.md).

Use a [lista de verificação do pipeline RAG](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) para distinguir falhas de preparação, recuperação e ordenação.

Envie candidatos suficientes para cobrir respostas plausíveis: recupere em excesso primeiro, depois rankee com precisão. Use `top_n` para manter apenas o topo da lista rankeada e `min_score` para descartar resultados de cauda com baixa relevância. Calibre esse limite nas suas próprias consultas, pois as escalas de pontuação diferem entre rankers e um corte ajustado em uma carga de trabalho raramente se transfere para outra.

## Escolhendo um reranker

Comece com o reranker padrão, a menos que tenha uma razão medida para selecionar outra opção disponível. O padrão é o Reflex; as alternativas incluem correspondência léxica, fusão de ranks recíprocos de vários sinais e cross-encoders de terceiros. A fusão (`rrf`) é apenas para recuperação e é rejeitada por este endpoint: ela existe para combinar sinais dentro da busca em coleção, não para rankeamento autônomo.

Para comparar opções, defina um conjunto de consultas representativas com documentos relevantes conhecidos da sua própria carga de trabalho — cobrindo seus idiomas, comprimentos de documento e jargões — e meça se trocar os rankers move o documento relevante para cima. Se o documento relevante estiver ausente dos candidatos completamente, nenhum ranker pode recuperá-lo; melhore a recuperação de candidatos, o chunking, a formulação da consulta ou a contagem de candidatos antes de comparar rerankers.

Para separar falhas de candidato ausente de falhas de má ordenação antes de adicionar um reranker, veja [Preciso de um reranker para RAG?](https://aivax.net/blog/semantic-search-vs-reranking/). Para julgar quando o Reflex é suficiente, veja [como o Reflex compara com os outros rerankers neste endpoint](https://aivax.net/blog/reflex-retrieval-built-for-recurring-documents/).

Para disponibilidade atual, opções suportadas e limites de conta, consulte a Referência da API e [Planos e Limites](https://docs.aivax.net/pt-br/docs/limits.md).
