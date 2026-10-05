---
{title: Reclassificadores,linkTitle: Reclassificadores,weight: 130,group: RAG and collections,sourceHash: 2e882f68fced600e,aliases: [/docs/pt-br/rag/reranking.html]}
---

# Reclassificadores

Os reclassificadores reordenam um conjunto existente de documentos candidatos para uma consulta. Eles não pesquisam uma coleção nem recuperam texto que está ausente da entrada. Use a API de reclassificação autônoma quando sua aplicação já possui os candidatos, ou use [Semantic Search](semantic-search.md) para recuperar candidatos de uma coleção AIVAX antes de reclassificá-los.

[Reflex](reflex.md) é a experiência de busca sem coleção construída neste mesmo endpoint com o classificador padrão — veja essa página quando quiser classificação no estilo de recuperação sem gerenciar uma coleção.

## Reclassificar documentos diretamente

Autentique-se com uma chave de API AIVAX e envie uma consulta com as strings dos documentos candidatos. A API devolve os candidatos em ordem de relevância, com a posição de entrada necessária para associar cada resultado aos dados da sua aplicação.

Use a reclassificação direta quando os candidatos são dinâmicos, vêm de outro sistema de busca ou não precisam ser armazenados em uma coleção AIVAX. Use a busca semântica gerenciada quando a AIVAX deve recuperar candidatos de um corpus persistente.

Para a solicitação, resposta, autenticação e contrato de erro suportados, use a Referência da API:

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Construir candidatos que valem a classificação

A reclassificação apenas reordena o que recebe, portanto a qualidade dos candidatos determina o teto. Mantenha cada string de candidato focada em uma ideia — um parágrafo ou uma seção curta, em vez de uma página inteira — para que a pontuação de relevância reflita um tópico único em vez de uma média de vários. Quando os candidatos são obtidos por segmentação, prefira limites que preservem declarações completas; veja [Text segmentation](text-segmentation.md).

Use a [RAG pipeline checklist](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) para distinguir falhas de preparação, recuperação e ordenação.

Envie candidatos suficientes para cobrir respostas plausíveis (primeiro sobre-recuperação, depois classificação precisa) e use `top_n` para manter apenas o início da lista classificada. Use `min_score` para descartar resultados de baixa relevância, mas calibre o limiar nas suas próprias consultas: as escalas de pontuação diferem entre classificadores e um ponto de corte ajustado em uma carga de trabalho raramente se transfere para outra.

## Escolhendo um reclassificador

Comece com o reclassificador padrão a menos que tenha um motivo mensurável para selecionar outra opção disponível. O padrão é Reflex; as alternativas incluem correspondência lexical, fusão de ranking recíproco de vários sinais e cross-encoders de terceiros. Observe que a fusão (`rrf`) é apenas para recuperação e é rejeitada por este endpoint — ela existe para combinar sinais dentro da busca em coleção, não para classificação autônoma.

Para comparar opções, fixe um conjunto de consultas representativas com documentos relevantes conhecidos a partir da sua própria carga de trabalho — cobrindo seus idiomas, comprimentos de documentos e jargão — e meça se trocar de classificadores eleva o documento correto. Se o documento relevante estiver ausente dos candidatos, melhore a recuperação de candidatos, a segmentação, a formulação da consulta ou a quantidade de candidatos antes de comparar reclassificadores: nenhum classificador recupera o que nunca foi submetido.

Para disponibilidade atual, opções suportadas e limites de conta, consulte a Referência da API e [Plans and Limits](../limits.md).
