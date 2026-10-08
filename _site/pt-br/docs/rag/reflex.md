Source: http://localhost:1313/pt-br/docs/rag/reflex.html

# Reflex

Reflex é a pesquisa sem coleção da AIVAX para RAG. Envie uma consulta junto com strings de documentos candidatos e receba os itens mais relevantes em ordem classificada — sem indexação, armazenamento ou manutenção prévia de uma coleção RAG.

Reflex é o ranker padrão do endpoint autônomo de [re‑ranking](http://localhost:1313/pt-br/docs/rag/reranking.md): chamar esse endpoint sem especificar um `model` seleciona o Reflex. Esta página cobre quando usar o Reflex; a outra página aprofunda a preparação de candidatos e a comparação de rankers.

Use o Reflex quando sua aplicação já possui os documentos candidatos, o conjunto de candidatos muda com frequência ou você deseja uma etapa de recuperação sem indexação e armazenamento de coleção. Use a [Busca Semântica](http://localhost:1313/pt-br/docs/rag/semantic-search.md) quando a AIVAX deve armazenar, indexar e pesquisar uma base de conhecimento persistente ou um corpus demasiado grande para ser enviado como candidatos a cada requisição.

## Reflex ou Busca Semântica?

| Escolha Reflex quando… | Escolha Busca Semântica quando… |
| --- | --- |
| Sua aplicação já tem as strings dos documentos candidatos. | Os documentos devem viver em coleções gerenciadas pela AIVAX. |
| Você precisa de recuperação imediata, sem etapa de indexação. | A base de conhecimento é persistente e pesquisada repetidamente. |
| O conjunto de candidatos é dinâmico ou específico por requisição. | O corpus é grande demais para ser enviado como candidatos a cada requisição. |
| Você quer classificação sem coleção. | Você quer filtragem de coleção, metadados armazenados, referências de documentos e recuperação gerenciada. |

Reflex devolve candidatos de texto classificados; ele não gera uma resposta. Passe os documentos selecionados ao seu modelo de linguagem ou ao AI Gateway como contexto de RAG.

## Usando o Reflex

Chame a API de reranking com uma consulta e os documentos candidatos que sua aplicação deseja comparar. Os resultados são retornados em ordem de relevância e mantêm a posição de entrada necessária para associá‑los aos dados da sua aplicação.

Use documentos candidatos concisos e focados. O reranking pode melhorar a ordem, mas não pode recuperar informações que não foram incluídas nos candidatos. Se o documento esperado estiver consistentemente ausente, melhore a seleção de candidatos, a fragmentação ou a formulação da consulta antes de ajustar o ranker.

Reflex aceita até 10 000 documentos candidatos por requisição e devolve no máximo 200 resultados classificados. Se seu pool de candidatos ultrapassar 10 000 documentos, reduza‑o primeiro — com pré‑filtragem lexical, um rank de primeira passagem barato ou recuperação de coleção — e deixe o Reflex ordenar a lista curta.

Para o contrato de requisição, resposta, autenticação e erros suportado, use a Referência da API:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Rerank%20documents)

## Usando o Reflex com RAG

Reflex também é o reranker padrão após a AIVAX recuperar candidatos de coleções RAG. Nesse fluxo, ele pode melhorar a ordem dos candidatos recuperados, mas não pode recuperar um documento que a etapa de recuperação não selecionou. Se documentos relevantes estiverem consistentemente ausentes, ajuste a recuperação, a fragmentação, a formulação da consulta ou a contagem de candidatos antes de afinar o reranking.

Free, Pro e Max incluem uma cota diária de reranking para o Reflex, compartilhada entre chamadas autônomas e reranking de RAG. Entradas em cache e sem cache consomem essa cota. Ela é separada da cota de embeddings de RAG e do limite de tempo de processamento; outros rerankers são cobrados normalmente. Para capacidade relativa do plano e regras de cobertura, veja [Planos e Limites](http://localhost:1313/pt-br/docs/limits.md#included-daily-subscription-allowances).
