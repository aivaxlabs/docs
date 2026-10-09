---
{title: Reflex,linkTitle: Reflex,weight: 140,group: RAG and collections,sourceHash: 3dc2f0762932205d,aliases: [/docs/pt-br/rag/reflex.html]}
---

# Reflex

Reflex é a busca sem coleção da AIVAX para RAG. Envie uma consulta junto com strings de documentos candidatos e receba os itens mais relevantes em ordem classificada — sem indexação, armazenamento ou manutenção de uma coleção RAG primeiro.

Reflex é o ranqueador padrão do endpoint autônomo de [reranking endpoint](reranking.md): chamar esse endpoint sem um `model` seleciona o Reflex. Esta página cobre quando usar o Reflex; aquela página cobre a preparação de candidatos e a comparação de ranqueadores em profundidade.

Use o Reflex quando sua aplicação já possui os documentos candidatos, o conjunto de candidatos muda com frequência ou você deseja uma etapa de recuperação sem indexação e armazenamento de coleção. Use a [Semantic Search](semantic-search.md) quando a AIVAX deve armazenar, indexar e pesquisar uma base de conhecimento persistente ou reduzir um corpus que é grande demais para ser enviado como candidatos em cada requisição.

## Reflex ou Semantic Search?

| Escolha Reflex quando... | Escolha Semantic Search quando... |
| --- | --- |
| Sua aplicação já possui as strings dos documentos candidatos. | Os documentos devem estar em coleções gerenciadas da AIVAX. |
| Você precisa de recuperação imediatamente, sem uma etapa de indexação. | A base de conhecimento é persistente e pesquisada repetidamente. |
| O conjunto de candidatos é dinâmico ou específico a cada requisição. | O corpus é grande demais para ser enviado como candidatos em cada requisição. |
| Você deseja ranqueamento sem coleção. | Você deseja filtragem de coleção, metadados armazenados, referências de documentos e recuperação gerenciada. |

Reflex retorna candidatos de texto classificados; ele não gera uma resposta. Passe os documentos selecionados para seu modelo de linguagem ou AI Gateway como contexto RAG. Para decidir entre o Reflex e um reranker de cross-encoder, veja [reranking RAG results without a cross-encoder](https://aivax.net/blog/reflex-retrieval-built-for-recurring-documents/).

## Use Reflex

Chame a API de reranking com uma consulta e os documentos candidatos que sua aplicação deseja comparar. Os resultados são retornados em ordem de relevância e mantêm a posição de entrada necessária para associá-los aos dados da sua aplicação.

Use documentos candidatos concisos e focados. O reranking pode melhorar a ordem deles, mas não pode recuperar informações que não foram incluídas nos candidatos. Se o documento esperado estiver consistentemente ausente, melhore a seleção de candidatos, a fragmentação ou a formulação da consulta antes de ajustar o ranqueador.

Reflex limita o número de documentos candidatos por requisição e o número de resultados classificados retornados; veja [Request and payload limits](../limits.md#request-and-payload-limits). Se seu pool de candidatos exceder o limite, reduza‑o primeiro — com pré‑filtragem lexical, um ranqueamento de primeira passagem barato ou recuperação de coleção — e deixe o Reflex ordenar a lista curta.

Para o contrato suportado de requisição, resposta, autenticação e erro, use a API Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Use Reflex with RAG

Reflex também é o reranker padrão após a AIVAX recuperar candidatos de coleções RAG. Nesse fluxo, ele pode melhorar a ordem dos candidatos recuperados, mas não pode recuperar um documento que a etapa de recuperação não selecionou. Se documentos relevantes estiverem consistentemente ausentes, ajuste a recuperação, a fragmentação, a formulação da consulta ou a quantidade de candidatos antes de ajustar o reranking.

Free, Pro e Max incluem uma cota diária de reranking para o Reflex, compartilhada entre chamadas autônomas e reranking de RAG. Entradas em cache e sem cache consomem essa cota. Ela é separada da cota de incorporação RAG e do limite de tempo de processamento; outros rerankers são cobrados normalmente. Para capacidade e regras de cobertura relativas ao plano, veja [Plans and Limits](../limits.md#included-daily-subscription-allowances).
