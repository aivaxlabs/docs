---
{title: Reflexo,linkTitle: Reflexo,weight: 70,group: RAG and collections,sourceHash: 8928abc6ea7e94d2,aliases: [/docs/pt-br/rag/reflex.html]}
---

# Reflex

Reflex é a busca sem coleções do AIVAX para RAG. Envie uma consulta junto com strings de documentos candidatos e receba os itens mais relevantes em ordem classificada — sem precisar indexar, armazenar ou manter uma coleção RAG previamente.

O Reflex é o classificador padrão do endpoint de [reranking autônomo](reranking.md): chamar esse endpoint sem um `model` seleciona o Reflex. Esta página explica quando escolher o Reflex; a página de reranking aborda em profundidade a preparação de candidatos e a comparação entre classificadores.

Use o Reflex quando seu aplicativo já possui os documentos candidatos, o conjunto de candidatos muda frequentemente ou você deseja uma etapa de recuperação sem indexação e armazenamento de coleções. Use a [Busca Semântica](semantic-search.md) quando o AIVAX deve armazenar, indexar e buscar em uma base de conhecimento persistente ou reduzir um corpus que seja grande demais para ser submetido como candidatos em cada solicitação.

## Reflex ou Busca Semântica?

| Escolha o Reflex quando... | Escolha a Busca Semântica quando... |
| --- | --- |
| Seu aplicativo já possui as strings dos documentos candidatos. | Os documentos devem viver em coleções gerenciadas pelo AIVAX. |
| Você precisa de recuperação imediatamente, sem uma etapa de indexação. | A base de conhecimento é persistente e pesquisada repetidamente. |
| O conjunto de candidatos é dinâmico ou específico da solicitação. | O corpus é grande demais para ser submetido como candidatos em cada solicitação. |
| Você deseja classificação sem coleções. | Você deseja filtragem por coleções, metadados armazenados, referências de documentos e recuperação gerenciada. |

O Reflex retorna candidatos de texto classificados; ele não gera uma resposta. Passe os documentos selecionados para seu modelo de linguagem ou Gateway de IA como contexto de RAG. Para decidir entre o Reflex e um reranker baseado em modelo, consulte [melhor reranker para RAG](https://aivax.net/blog/reflex-retrieval-built-for-recurring-documents/).

## Usar o Reflex

Chame a API de reranking com uma consulta e os documentos candidatos que seu aplicativo deseja comparar. Os resultados são retornados em ordem de relevância. Cada resultado mantém sua posição de entrada, permitindo mapeá-lo de volta aos dados do seu aplicativo.

Use documentos candidatos concisos e focados. O reranking pode melhorar sua ordem, mas não pode recuperar informações que não foram incluídas nos candidatos. Se o documento esperado estiver consistentemente ausente, melhore a seleção de candidatos, o chunking (fragmentação) ou a formulação da consulta antes de ajustar o classificador.

O Reflex limita o número de documentos candidatos por solicitação e o número de resultados classificados retornados; consulte [Preços e limites](#preços-e-limites). Se seu pool de candidatos exceder o limite de candidatos, reduza-o primeiro — com pré-filtragem léxica, um primeiro passo de classificação barato ou recuperação por coleção — e deixe o Reflex ordenar a lista curta.

Para o contrato de solicitação, resposta, autenticação e erro suportado, use a Referência da API:

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Usar o Reflex com RAG

O Reflex também é o reranker padrão após o AIVAX recuperar candidatos das coleções de RAG. Nesse fluxo, ele pode melhorar a ordem dos candidatos recuperados, mas não pode recuperar um documento que a etapa de recuperação não tenha selecionado. Se documentos relevantes estiverem consistentemente ausentes, ajuste a recuperação, o chunking, a formulação da consulta ou a contagem de candidatos antes de ajustar o reranking.

Todos os planos incluem uma cota diária de reranking para o Reflex, compartilhada entre chamadas autônomas e reranking de RAG. Entradas em cache e fora do cache consomem essa cota. Ela é separada da cota de embedding de RAG e do limite de tempo de processamento; outros rerankers são cobrados normalmente. Para capacidade relativa do plano e regras de cobertura, consulte [Planos e Limites](../limits.md#included-daily-subscription-allowances).

## Preços e limites

O Reflex é cobrado por tokens de entrada. A entrada servida a partir do cache escopo da conta é cobrada a uma taxa menor. Contas com [Compartilhamento de Dados](../data-sharing.md) habilitado recebem um desconto nas operações de reranking elegíveis.

| Descrição | Preço |
| --- | ---: |
| Reflex - cache miss | **$0,015/M tokens** |
| Reflex - cache hit | **$0,003/M tokens** |

Cada solicitação aceita até 10.000 documentos candidatos e retorna até 200 resultados classificados em todos os planos. O tempo de processamento do Reflex por dia e as solicitações de reranking por minuto dependem do plano; consulte [Limites de RAG e coleções](../limits.md#rag-and-collections).

O limite de tempo de processamento conta o tempo gasto processando solicitações do Reflex, tanto no endpoint de reranking quanto nas buscas de RAG que usam o Reflex; a entrada em cache não consome isso separadamente. O limite de solicitações de reranking aplica-se ao endpoint de reranking e às buscas de RAG que usam um reranker, incluindo buscas através de Gateways de IA e ferramentas MCP. Solicitações acima de um limite retornam `429 Too Many Requests`.
