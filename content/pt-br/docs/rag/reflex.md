---
{title: Reflex,linkTitle: Reflex,weight: 70,group: RAG and collections,sourceHash: 29489e9f5afc71c2,aliases: [/docs/pt-br/rag/reflex.html]}
---

# Reflex

Reflex é a pesquisa sem coleção da AIVAX para RAG. Envie uma consulta junto com strings de documentos candidatos e receba os itens mais relevantes em ordem classificada—sem indexação, armazenamento ou manutenção prévia de uma coleção RAG.

Reflex é o ranker padrão do [endpoint de reranking autônomo](reranking.md): chamar esse endpoint sem um `model` seleciona o Reflex. Esta página explica quando escolher o Reflex; a página de reranking cobre a preparação de candidatos e a comparação de rankers em profundidade.

Use o Reflex quando sua aplicação já possui os documentos candidatos, o conjunto de candidatos muda com frequência ou você deseja uma etapa de recuperação sem indexação e armazenamento de coleção. Use a [Pesquisa Semântica](semantic-search.md) quando a AIVAX deve armazenar, indexar e pesquisar uma base de conhecimento persistente ou restringir um corpus que é grande demais para ser enviado como candidatos em cada requisição.

## Reflex ou Pesquisa Semântica?

| Escolha o Reflex quando… | Escolha a Pesquisa Semântica quando… |
| --- | --- |
| Sua aplicação já possui as strings dos documentos candidatos. | Os documentos devem residir em coleções gerenciadas da AIVAX. |
| Você precisa de recuperação imediatamente, sem uma etapa de indexação. | A base de conhecimento é persistente e pesquisada repetidamente. |
| O conjunto de candidatos é dinâmico ou específico por requisição. | O corpus é grande demais para ser enviado como candidatos em cada requisição. |
| Você quer classificação sem coleção. | Você quer filtragem de coleção, metadados armazenados, referências de documentos e recuperação gerenciada. |

Reflex devolve candidatos de texto classificados; ele não gera uma resposta. Passe os documentos selecionados para seu modelo de linguagem ou gateway de IA como contexto RAG. Para decidir entre o Reflex e um ranker cross‑encoder, veja [reranking RAG results without a cross-encoder](https://aivax.net/blog/reflex-retrieval-built-for-recurring-documents/).

## Use o Reflex

Chame a API de reranking com uma consulta e os documentos candidatos que sua aplicação deseja comparar. Os resultados são retornados em ordem de relevância. Cada resultado mantém sua posição de entrada, permitindo que você o mapeie de volta aos dados da sua aplicação.

Use documentos candidatos concisos e focados. O reranking pode melhorar a ordem deles, mas não pode recuperar informações que não foram incluídas nos candidatos. Se o documento esperado estiver consistentemente ausente, melhore a seleção de candidatos, o chunking ou a formulação da consulta antes de ajustar o ranker.

O Reflex limita o número de documentos candidatos por requisição e o número de resultados classificados retornados; veja [Pricing and limits](#pricing-and-limits). Se seu pool de candidatos exceder o limite, reduza‑o primeiro — com pré‑filtragem lexical, um rank de primeira passagem barato ou recuperação de coleção — e deixe o Reflex ordenar a lista curta.

Para o contrato de requisição, resposta, autenticação e erros suportados, use a Referência da API:

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Use o Reflex com RAG

O Reflex também é o ranker padrão após a AIVAX recuperar candidatos de coleções RAG. Nesse fluxo, ele pode melhorar a ordem dos candidatos recuperados, mas não pode recuperar um documento que a etapa de recuperação não selecionou. Se documentos relevantes estiverem consistentemente ausentes, ajuste a recuperação, o chunking, a formulação da consulta ou a contagem de candidatos antes de afinar o reranking.

Free, Pro e Max incluem uma cota diária de reranking para o Reflex, compartilhada entre chamadas autônomas e reranking RAG. Entradas em cache e fora de cache consomem essa cota. Ela é separada da cota de embeddings RAG e do limite de tempo de processamento; outros rankers são cobrados normalmente. Para capacidade relativa do plano e regras de cobertura, veja [Plans and Limits](../limits.md#included-daily-subscription-allowances).

## Preços e limites

O Reflex é cobrado por tokens de entrada. Entradas servidas a partir do cache escopo da conta são cobradas a uma taxa menor. Contas com [Data Sharing](../data-sharing.md) habilitado recebem desconto em operações de reranking elegíveis.

| Descrição | Preço |
| --- | --- |
| Reflex - falha de cache | **$0.015/M tokens** |
| Reflex - acerto de cache | **$0.003/M tokens** |

| Limite | Free | Pro | Max |
| --- | --- | --- | --- |
| Tempo de processamento do Reflex | 30 minutos/dia | 6 horas/dia | — |
| Solicitações de reranking | 30/min | 1.000/min | — |
| Documentos candidatos por requisição | 10.000 | 10.000 | 10.000 |
| Resultados classificados retornados | 200 | 200 | 200 |

O limite de tempo de processamento conta o tempo gasto processando requisições do Reflex, tanto no endpoint de reranking quanto nas buscas RAG que utilizam o Reflex; entradas em cache não o consomem separadamente. O limite de solicitações de reranking aplica‑se ao endpoint de reranking e às buscas RAG que utilizam um ranker, incluindo buscas através de gateways de IA e ferramentas MCP. Um travessão (`—`) indica que o plano não impõe limite. Requisições acima do limite retornam `429 Too Many Requests`.
