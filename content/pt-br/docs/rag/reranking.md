---
{title: Classificadores,linkTitle: Classificadores,weight: 130,group: RAG and collections,sourceHash: 2b0e194fc052cb89,aliases: [/docs/pt-br/rag/reranking.html]}
---

# Classificadores

Classificadores reordenam um conjunto existente de documentos candidatos para uma consulta. Eles não pesquisam uma coleção nem recuperam texto que esteja ausente da entrada. Use a API de reordenação autônoma quando sua aplicação já possui os candidatos, ou use a [Pesquisa Semântica](semantic-search.md) para recuperar candidatos de uma coleção AIVAX antes de reordená‑los.

[Reflex](reflex.md) é a experiência de pesquisa sem coleção construída neste mesmo endpoint com o classificador padrão — veja essa página quando quiser classificação no estilo de recuperação sem gerenciar uma coleção.

## Reordenar documentos diretamente

Autentique‑se com uma chave de API AIVAX e envie uma consulta com as strings dos documentos candidatos. A API devolve os candidatos em ordem de relevância, com a posição de entrada necessária para associar cada resultado aos dados da sua aplicação.

Use a reordenação direta quando os candidatos são dinâmicos, vêm de outro sistema de pesquisa ou não precisam ser armazenados em uma coleção AIVAX. Use a pesquisa semântica gerenciada quando o AIVAX deve recuperar candidatos de um corpus persistente.

Para a solicitação, resposta, autenticação e contrato de erro suportados, use a Referência da API:

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Construa candidatos que valham a pena classificar

A reordenação apenas reordena o que recebe, portanto a qualidade dos candidatos determina o teto. Mantenha cada string de candidato focada em uma ideia — um parágrafo ou uma seção curta, em vez de uma página inteira — para que a pontuação de relevância reflita um único tópico ao invés de uma média de vários. Quando os candidatos vêm de fragmentação, prefira limites que preservem declarações completas; veja a [Segmentação de Texto](text-segmentation.md).

Use a [lista de verificação do pipeline RAG](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) para distinguir falhas de preparação, recuperação e ordenação.

Envie candidatos suficientes para cobrir respostas plausíveis (primeiro super‑recuperação, depois classificação precisa) e use `top_n` para manter apenas o início da lista classificada. Use `min_score` para descartar resultados de cauda de baixa relevância, mas calibre o limiar nas suas próprias consultas: as escalas de pontuação diferem entre classificadores e um ponto de corte ajustado para uma carga de trabalho raramente se transfere para outra.

## Escolhendo um classificador

Comece com o classificador padrão a menos que tenha um motivo mensurado para selecionar outra opção disponível. O padrão é Reflex; as alternativas incluem correspondência lexical, fusão de ranking recíproco de vários sinais e cross‑encoders de terceiros. Observe que a fusão (`rrf`) é apenas de recuperação e é rejeitada por este endpoint — ela existe para combinar sinais dentro da pesquisa de coleção, não para classificação autônoma.

Para comparar opções, defina um conjunto de consultas representativas com documentos relevantes conhecidos a partir da sua própria carga de trabalho — cobrindo seus idiomas, comprimentos de documentos e jargão — e meça se trocar de classificadores eleva o documento correto. Se o documento relevante estiver ausente dos candidatos, melhore a recuperação de candidatos, a fragmentação, a formulação da consulta ou a quantidade de candidatos antes de comparar classificadores: nenhum classificador recupera o que nunca foi enviado.

Para separar falhas de candidato ausente de falhas de ordenação ruim antes de adicionar um classificador, veja [Preciso de um classificador para RAG?](https://aivax.net/blog/semantic-search-vs-reranking/). Para avaliar quando o Reflex é suficiente em comparação a um cross‑encoder, veja [reordenar resultados RAG sem um cross‑encoder](https://aivax.net/blog/reflex-retrieval-built-for-recurring-documents/).

Para disponibilidade atual, opções suportadas e limites de conta, veja a Referência da API e [Planos e Limites](../limits.md).
