---
{title: Pesquisar,linkTitle: Pesquisar,weight: 30,group: RAG and collections,sourceHash: cf11387675c54b70,aliases: [/docs/pt-br/rag/semantic-search.html]}
---

# Pesquisa

A pesquisa retorna documentos indexados de uma ou mais coleções. Utilize a pesquisa gerenciada quando o AIVAX deve armazenar e pesquisar em um corpus persistente, ou quando o corpus é grande demais para ser enviado como candidatos em cada solicitação.

O AIVAX realiza pesquisas através de três endpoints:

| Endpoint | Caminho | Use-o para | Custo |
| --- | --- | --- | --- |
| Consultar coleções | `POST /api/v2/query` | Encontrar os documentos que melhor respondem a uma pergunta. | Embedding da consulta e, quando utilizado, reranking. |
| Encontrar documentos semelhantes | `POST /api/v2/query/similar` | Encontrar documentos com significado próximo ao de um documento que você já possui. | Sem custo de embedding ou reranking. |
| Navegar por documentos | `POST /api/v2/query/browse` | Listar documentos em uma ordem fixa, opcionalmente filtrados, sem relevância. | Sem custo de embedding ou reranking. |

A geração de respostas RAG e as coleções anexadas a um AI Gateway utilizam o mesmo mecanismo de recuperação.

Se sua aplicação já possui as strings dos documentos candidatos, considere o [Reflex](reflex.md). O Reflex é uma pesquisa sem coleções que classifica documentos fornecidos sem indexação ou armazenamento.

Antes de pesquisar:

1. Adicione [documentos](documents.md) a uma [coleção](collections.md).
2. Aguarde a indexação. Apenas documentos indexados são retornados.
3. Compare [pesquisa vetorial com o pipeline RAG completo](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) antes de decidir o que construir.

## Consultar coleções

Utilize este endpoint para encontrar os documentos que melhor respondem a uma pergunta.

<script src="https://inference.aivax.net/apidocs?embed-target=Query%20collections&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Uma consulta é executada nesta ordem:

1. Se um filtro estiver definido, o AIVAX restringe cada coleção aos documentos que correspondem a ele.
2. Cada termo de busca é embutido (embedded) e comparado com os documentos restantes.
3. Documentos abaixo de `minScore` são descartados, e os `candidates` documentos mais próximos formam o pool de candidatos.
4. O reranker reordena o pool, a menos que o reranking esteja desabilitado.
5. O pool é ordenado e retornado em páginas de `limit` resultados.

```json
{
  "collections": [ "<collection-id>" ],
  "terms": "Como solicito um reembolso?"
}
```

Utilize estas opções para restringir o corpus, dimensionar o pool e paginar os resultados.

| Opção | Padrão | Descrição |
| --- | --- | --- |
| `collections` | Obrigatório | IDs de coleções pertencentes à conta. Um item também pode ser `{ "id": "<collection-id>", "filter": "..." }` para filtrar apenas essa coleção. |
| `terms` | Obrigatório | Um texto de busca ou uma lista de textos alternativos. |
| `filter` | — | Uma expressão de [filtro avançado](document-filters.md) ou uma lista de expressões que devem ser todas atendidas. |
| `minScore` | 0.2 | Similaridade vetorial mínima, de 0 a 0.99, para que um documento entre no pool de candidatos. Aumente para eliminar correspondências fracas; diminua quando documentos relevantes estiverem faltando. |
| `candidates` | `limit` × 3 | Tamanho do pool de candidatos, de `limit` a 1000. Um pool maior oferece mais documentos para o reranker e para páginas subsequentes trabalharem. |
| `reranker` | `smart` (Reflex) | Reranker que ordena o pool: `smart`, `lexical`, `rrf`, `none` ou um nome completo de reranker. Consulte [Rerankers](reranking.md). |
| `sort` | Score, descendente | `{ "by": "score" \| "createdAt" \| "updatedAt" \| "indexedAt" \| "name", "dir": "asc" \| "desc" }`. Sem `dir`, score ordena descendente e os outros campos ascendente. |
| `limit` | 10 | Resultados por página, de 1 a 128. |
| `cursor` | — | `page.cursor` da resposta anterior, para ler a próxima página. |
| `include` | `content`, `metadata` | Campos opcionais do documento: `content`, `metadata` e `references`. `references` anexa os outros documentos que compartilham a referência de cada resultado. |

### Ordenação e reranking

Utilize esta tabela quando precisar saber se um reranker será executado. Um reranker ordena por relevância, portanto, aplica-se apenas quando os resultados são ordenados por score:

| Solicitação | Comportamento |
| --- | --- |
| Sem `sort` e sem `reranker` | O Reflex reranca o pool; os resultados são ordenados por score. |
| `reranker` sem `sort` | Esse reranker reranca o pool; os resultados são ordenados por score. |
| `sort` diferente de score, sem `reranker` | O reranking é desabilitado. O pool é selecionado por similaridade e depois ordenado pelo campo solicitado. |
| `sort` diferente de score com `reranker: "none"` | Igual ao acima. |
| `sort` diferente de score com qualquer outro `reranker` | Rejeitado com `400 Bad Request`. |

Para obter os documentos relevantes mais recentes, selecione um pool por significado e ordene-o por data:

```json
{
  "collections": [ "<collection-id>" ],
  "terms": "mudança de preço",
  "candidates": 100,
  "sort": { "by": "createdAt", "dir": "desc" }
}
```

Cada reranker tem um número máximo de documentos que aceita; um valor de `candidates` acima disso é rejeitado.

### Resultados

Cada resultado informa qual documento correspondeu e como foi pontuado. Ele possui um `rank`, um `document` e `scores`:

- `document` contém `id`, `collectionId`, `name`, `reference`, `tags`, `createdAt`, `updatedAt`, `indexedAt` e os campos solicitados em `include`.
- `scores.similarity` é a similaridade vetorial, `scores.rerank` é o score do reranker (ou `null`) e `scores.final` é o score do rerank quando um reranker foi executado, caso contrário, é a similaridade.

A resposta também contém `page.cursor`, `page.hasMore`, `page.candidates` (o tamanho do pool) e o `reranker` que foi executado.

### Páginas

Utilize um cursor quando a primeira página não for suficiente e você quiser a próxima fatia do mesmo pool.

1. A primeira solicitação computa o pool de candidatos e retorna sua primeira página.
2. Para ler a próxima página, envie o mesmo corpo da solicitação com `cursor` definido como o `page.cursor` anterior.
3. Páginas posteriores são lidas a partir do pool armazenado, portanto, não são cobradas novamente e mantêm a mesma ordem.

Um cursor expira após 10 minutos sem uso e então retorna `410 Gone`. Repita a solicitação sem `cursor` para executar a consulta novamente. Um cursor enviado com um corpo de solicitação diferente é rejeitado com `400 Bad Request`. O pool nunca cresce. Para ver mais de `candidates` resultados, aumente `candidates`.

## Encontrar documentos semelhantes

Utilize este endpoint para um recurso "mais parecido com isto". Ele pesquisa com o vetor armazenado de um documento indexado que você já possui.

<script src="https://inference.aivax.net/apidocs?embed-target=Find%20similar%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

O documento fonte nunca é retornado. A solicitação aceita `documentId` e as mesmas opções `collections`, `filter`, `minScore`, `candidates`, `sort`, `limit`, `cursor` e `include` de uma consulta. Sem `collections`, ela pesquisa na coleção do documento fonte.

```json
{
  "documentId": "<document-id>",
  "limit": 5
}
```

Nada é embutido (embedded) ou rerancado.

- `scores.rerank` é sempre `null`.
- O documento fonte deve estar indexado.
- Um documento ainda aguardando indexação é rejeitado com `400 Bad Request`.

## Navegar por documentos

Utilize este endpoint para listar documentos indexados em uma ordem fixa, sem classificação por significado.

<script src="https://inference.aivax.net/apidocs?embed-target=Browse%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Por padrão, os documentos são retornados na ordem de inserção, do mais antigo para o mais recente. Sem um filtro, todos os documentos indexados das coleções são listados.

```json
{
  "collections": [ "<collection-id>" ],
  "filter": "createdAt >= now-7d",
  "sort": { "by": "createdAt", "dir": "desc" },
  "limit": 50
}
```

Ele aceita `collections`, `filter`, `sort`, `limit`, `cursor` e `include`.

- `sort.by` pode ser `createdAt`, `updatedAt`, `indexedAt` ou `name`.
- A ordenação por score é rejeitada.
- Os resultados contêm apenas `document`, sem `rank` ou `scores`.

Os cursores de navegação apontam para o último documento retornado em vez de um pool armazenado, portanto, não expiram. Documentos adicionados ou alterados entre as solicitações aparecem nas páginas seguintes de acordo com a ordem de classificação.

## Filtrar resultados

Os filtros restringem os documentos que uma pesquisa pode retornar, utilizando condições exatas nos campos dos documentos em vez de similaridade semântica. Utilize-os quando a resposta deve vir de um subconjunto conhecido, como um produto, inquilino, idioma, tipo de documento ou período.

| Filtre em | Exemplo | Use para |
| --- | --- | --- |
| Nome | `name startswith "policy-"` | Famílias de documentos que seguem uma convenção de nomenclatura. |
| Tags | `tags has "finance"` | Rótulos operacionais atribuídos na importação. |
| Metadados | `metadata.region = "br"` | Valores estruturados armazenados com cada documento, como região, versão ou autor. |
| Conteúdos | `content contains "refund"` | Palavras ou identificadores obrigatórios no texto. |
| Datas | `updatedAt >= now-30d` | Documentos criados ou atualizados recentemente. |

Como os filtros se combinam:

- Combine condições com `and`, `or`, `not` e parênteses, por exemplo `tags has "finance" and createdAt >= now-30d`.
- Quando `filter` é uma lista, todas as expressões devem corresponder.
- Um filtro definido em um item de coleção é combinado com o `filter` de nível superior para essa coleção.
- Os filtros são executados antes que os termos de busca sejam embutidos.
- Apenas documentos correspondentes são classificados, portanto, os resultados nunca incluem documentos fora do filtro.
- Quando nenhum documento corresponde, uma consulta retorna um resultado vazio sem gerar embeddings ou cobrar pela consulta.

Os filtros não substituem um bom texto de documento. O significado que o usuário procura deve aparecer nos conteúdos. Consulte [Filtros avançados](document-filters.md) para a sintaxe completa, operadores, limites e erros, ou [Como filtrar resultados RAG por metadados, tags e data](https://aivax.net/blog/filter-rag-results-by-metadata-tags-date/) para um guia prático.

## Múltiplos termos

Utilize múltiplos termos para sinônimos, formulações alternativas ou várias maneiras aceitáveis de encontrar uma resposta. Eles cobrem caminhos de recuperação alternativos. Não exigem que cada termo corresponda ao mesmo documento. Cada documento é pontuado por sua melhor correspondência entre os termos.

Se a pergunta do usuário combina várias condições relacionadas, mantenha-as juntas em um único termo de busca. Prefira:

```text
Como cancelo uma assinatura anual sem penalidade?
```

Não divida essa pergunta em palavras-chave desconectadas:

```text
cancelamento
assinatura anual
penalidade
```

Uma consulta completa geralmente performa melhor do que uma lista de palavras-chave desconectadas porque preserva a relação entre conceitos. Se os usuários pesquisarem por códigos de produto, IDs de política, nomes de plano ou nomes de procedimento, inclua esses identificadores no texto do documento.

## Reranking

Utilize um reranker quando a pesquisa vetorial já retornou um pool de candidatos e você deseja uma ordem mais relevante. Ele ajusta essa ordem. Ele não pesquisa documentos adicionais nem recupera texto que a etapa de recuperação não selecionou. Aumente `candidates` para oferecer mais documentos a ele. Consulte [Rerankers](reranking.md) para orientação de seleção.

## Erros

Utilize esta tabela para associar uma pesquisa falhada à próxima ação.

| Status | Causa |
| --- | --- |
| `400 Bad Request` | Campo inválido, coleção ou documento desconhecido, [filtro inválido](document-filters.md#errors), um reranker combinado com uma ordenação diferente de score ou um cursor enviado com um corpo de solicitação diferente. |
| `410 Gone` | O cursor da consulta expirou. Repita a solicitação sem `cursor`. |
| `429 Too Many Requests` | O limite de taxa de pesquisa ou reranking do plano foi excedido. |

## Qualidade da pesquisa

Utilize esta lista de verificação quando a pesquisa retornar resultados ruins:

1. Confirme que os documentos estão indexados.
2. Consulte a coleção diretamente antes de testar através de um AI Gateway.
3. Compare perguntas completas com formulações alternativas.
4. Verifique se o documento relevante é muito curto, muito longo ou não autocontido; consulte [Escreva bons documentos](documents.md#write-good-documents).
5. Verifique se o idioma da consulta corresponde ao idioma do documento.
6. Se o gateway reescreve perguntas antes de pesquisar, teste com o caminho de consulta simples para isolar problemas de reescrita.
7. Revise pesquisas de baixo score e cobertura de consulta em [Observabilidade RAG](observability.md).

Para expor coleções como ferramentas para um cliente MCP externo, consulte [Coleções e RAG MCP](../mcp-utilities/collections-mcp.md). Para preços e limites de taxa de pesquisa, consulte [Coleções](collections.md#pricing-and-limits).
