# Reflex

Reflex é a busca sem coleção da AIVAX para RAG. Envie uma consulta junto com strings de documentos candidatos e receba os itens mais relevantes em ordem classificada — sem indexação, armazenamento ou manutenção de uma coleção RAG primeiro.

Use o Reflex quando sua aplicação já possui os documentos candidatos, o conjunto de candidatos muda com frequência, ou você deseja uma etapa de recuperação sem indexação e armazenamento de coleção. Use [Pesquisa Semântica](semantic-search.md) quando a AIVAX deve armazenar, indexar e pesquisar uma base de conhecimento persistente ou restringir um corpus que é grande demais para ser enviado como candidatos em cada requisição.

## Reflex ou Pesquisa Semântica?

| Quando escolher Reflex... | Quando escolher Pesquisa Semântica... |
| --- | --- |
| Sua aplicação já tem as strings dos documentos candidatos. | Os documentos devem residir em coleções gerenciadas da AIVAX. |
| Você precisa de recuperação imediata, sem etapa de indexação. | A base de conhecimento é persistente e pesquisada repetidamente. |
| O conjunto de candidatos é dinâmico ou específico por requisição. | O corpus é grande demais para ser enviado como candidatos em cada requisição. |
| Você deseja classificação sem coleção. | Você deseja filtragem de coleção, metadados armazenados, referências de documentos e recuperação gerenciada. |

Reflex devolve candidatos de texto classificados; ele não gera uma resposta. Passe os documentos selecionados para seu modelo de linguagem ou AI Gateway como contexto RAG.

## Usar Reflex

Chame a API de reclassificação com uma consulta e os documentos candidatos que sua aplicação deseja comparar. Os resultados são retornados em ordem de relevância e mantêm a posição de entrada necessária para associá‑los aos dados da sua aplicação.

Use documentos candidatos concisos e focados. A reclassificação pode melhorar a ordem deles, mas não pode recuperar informações que não foram incluídas nos candidatos. Se o documento esperado estiver consistentemente ausente, melhore a seleção de candidatos, a fragmentação ou a formulação da consulta antes de ajustar o ranker.

Para a solicitação, resposta, autenticação e contrato de erro suportados, use a Referência da API:

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Usar Reflex com RAG

Reflex também é o reclassificador padrão após a AIVAX recuperar candidatos de coleções RAG. Nesse fluxo, ele pode melhorar a ordem dos candidatos recuperados, mas não pode recuperar um documento que a etapa de recuperação não selecionou. Se documentos relevantes estiverem consistentemente ausentes, ajuste a recuperação, a fragmentação, a formulação da consulta ou a contagem de candidatos antes de ajustar a reclassificação.

Para disponibilidade atual do serviço e limites de conta, veja [Planos e Limites](../limits.md).