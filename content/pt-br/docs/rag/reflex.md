---
{title: Reflexo,linkTitle: Reflexo,weight: 70,group: RAG and collections,sourceHash: 207b0afa75c0fe79,aliases: [/docs/pt-br/rag/reflex.html]}
---

# Reflex

Reflex é a busca sem coleções do AIVAX para RAG. Envie uma consulta junto com strings de documentos candidatos e receba os itens mais relevantes em ordem classificada — sem precisar indexar, armazenar ou manter uma coleção RAG primeiro.

O Reflex é o classificador padrão do endpoint autônomo de [reranking](reranking.md): chamar esse endpoint sem um `model` seleciona o Reflex. Esta página explica quando escolher o Reflex; a página de reranking cobre a preparação de candidatos e a comparação de classificadores em profundidade.

Use o Reflex quando seu aplicativo já possui os documentos candidatos, o conjunto de candidatos muda frequentemente ou você deseja uma etapa de recuperação sem indexação e armazenamento de coleções. Use a [Busca Semântica](semantic-search.md) quando o AIVAX deve armazenar, indexar e buscar em uma base de conhecimento persistente ou reduzir um corpus que seja grande demais para ser submetido como candidatos em cada solicitação.

## Reflex ou Busca Semântica?

| Escolha o Reflex quando... | Escolha a Busca Semântica quando... |
| --- | --- |
| Seu aplicativo já possui as strings dos documentos candidatos. | Os documentos devem viver em coleções gerenciadas do AIVAX. |
| Você precisa de recuperação imediatamente, sem uma etapa de indexação. | A base de conhecimento é persistente e pesquisada repetidamente. |
| O conjunto de candidatos é dinâmico ou específico da solicitação. | O corpus é grande demais para ser submetido como candidatos em cada solicitação. |
| Você quer classificação sem coleções. | Você quer filtragem por coleções, metadados armazenados, referências de documentos e recuperação gerenciada. |

O Reflex retorna candidatos de texto classificados; ele não gera uma resposta. Passe os documentos selecionados para seu modelo de linguagem ou Gateway de IA como contexto RAG. Para decidir entre o Reflex e um reranker baseado em modelo, consulte [melhor reranker para RAG](https://aivax.net/blog/reflex-retrieval-built-for-recurring-documents/).

## Usar o Reflex

Chame a API de reranking com uma consulta e os documentos candidatos que seu aplicativo deseja comparar. Os resultados são retornados em ordem de relevância. Cada resultado mantém sua posição de entrada, permitindo mapeá-lo de volta aos dados do seu aplicativo.

Use documentos candidatos concisos e focados. O reranking pode melhorar sua ordem, mas não pode recuperar informações que não foram incluídas nos candidatos. Se o documento esperado estiver consistentemente ausente, melhore a seleção de candidatos, o chunking (segmentação) ou a formulação da consulta antes de ajustar o classificador.

O Reflex limita o número de documentos candidatos por solicitação e o número de resultados classificados retornados; consulte [Preços e limites](#precos-e-limites). Se seu pool de candidatos exceder o limite de candidatos, reduza-o primeiro — com pré-filtragem léxica, um primeiro passo de classificação barato ou recuperação por coleção — e deixe o Reflex ordenar a lista curta.

Para a solicitação suportada, contrato de resposta, autenticação e erros, use a Referência da API:

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Usar o Reflex com RAG

O Reflex também é o reranker padrão após o AIVAX recuperar candidatos das coleções RAG. Ele melhora a ordem dos candidatos recuperados, mas não pode recuperar um documento que a etapa de recuperação não selecionou.

Todos os planos incluem uma cota diária de reranking para o Reflex, compartilhada entre chamadas autônomas e reranking de RAG, e separada da cota de embedding de RAG. Outros rerankers são cobrados normalmente. Consulte [Planos e Limites](../limits.md#included-daily-subscription-allowances) para a capacidade do plano.

## Geração assíncrona

A API de reranking aceita `"async": true` para enfileirar a solicitação. A API responde com HTTP `202` e um ID, e você busca o resultado armazenado posteriormente ou recebe um webhook quando estiver concluído. Consulte [Gerações assíncronas](/docs/pt-br/inference/batch/async-generations.md) e [Rerankers](reranking.md#geracao-assincrona).

## Preços e limites

O Reflex é cobrado por tokens de entrada, com uma taxa menor para entradas em cache. Contas com [Compartilhamento de Dados](../data-sharing.md) habilitado recebem um desconto em operações de reranking elegíveis.

| Descrição | Preço |
| --- | ---: |
| Reflex - cache miss | **$0,015/M tokens** |
| Reflex - cache hit | **$0,003/M tokens** |

Cada solicitação aceita até 10.000 documentos candidatos e retorna até 200 resultados classificados em todos os planos. O tempo de processamento do Reflex por dia e as solicitações de reranking por minuto dependem do plano; consulte [Limites de RAG e coleções](../limits.md#rag-and-collections).

O limite de tempo de processamento abrange solicitações do Reflex no endpoint de reranking e nas buscas de RAG. O limite de solicitações de reranking aplica-se ao endpoint de reranking e às buscas de RAG que usam um reranker, incluindo através de Gateways de IA e ferramentas MCP. Solicitações acima de um limite retornam `429 Too Many Requests`.
