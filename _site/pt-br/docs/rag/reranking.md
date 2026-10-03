Source: https://docs.aivax.net/pt-br/docs/rag/reranking.html

# Reordenadores

Os reordenadores reorganizam um conjunto existente de documentos candidatos para uma consulta. Eles não pesquisam uma coleção nem recuperam texto que está ausente da entrada. Use a API de reordenação autônoma quando sua aplicação já possui os candidatos ou use [Semantic Search](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) para recuperar candidatos de uma coleção AIVAX antes de reordená-los.

## Reordenar documentos diretamente

Autentique-se com uma chave de API AIVAX e envie uma consulta com as strings dos documentos candidatos. A API devolve os candidatos em ordem de relevância, com a posição de entrada necessária para associar cada resultado aos dados da sua aplicação.

Use a reordenação direta quando os candidatos são dinâmicos, vêm de outro sistema de busca ou não precisam ser armazenados em uma coleção AIVAX. Use a busca semântica gerenciada quando a AIVAX deve recuperar candidatos de um corpus persistente.

Para a solicitação, resposta, autenticação e contrato de erro suportados, consulte a Referência da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Rerank%20documents)

## Escolhendo um reordenador

Comece com o reordenador padrão, a menos que você tenha um motivo mensurado para selecionar outra opção disponível. Avalie mudanças usando consultas representativas, idiomas, comprimentos de documentos e julgamentos de relevância do seu próprio workload.

A reordenação melhora a ordem apenas entre os candidatos fornecidos a ela. Se o documento relevante estiver ausente, melhore a recuperação de candidatos, segmentação, formulação da consulta ou a quantidade de candidatos antes de comparar os reordenadores.

Para a disponibilidade atual, opções suportadas e limites de conta, consulte a Referência da API e [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md).
