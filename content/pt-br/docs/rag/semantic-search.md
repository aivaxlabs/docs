---
{title: Busca,linkTitle: Busca,weight: 30,group: RAG and collections,sourceHash: 7381cb2f85dd4b23,aliases: [/docs/pt-br/rag/semantic-search.html]}
---

# Busca

AIVAX procura nos documentos indexados de uma ou mais coleções através de três pontos de extremidade:

| Endpoint | Path | Use it to | Cost |
| --- | --- | --- | --- |
| Query collections | `POST /api/v2/query` | Find the documents that best answer a question. | Query embedding and, when used, reranking. |
| Find similar documents | `POST /api/v2/query/similar` | Find documents close in meaning to a document you already have. | No embedding or reranking cost. |
| Browse documents | `POST /api/v2/query/browse` | List documents in a fixed order, optionally filtered, without relevance. | No embedding or reranking cost. |

A geração de respostas RAG e coleções anexadas a um gateway de IA usam o mesmo mecanismo de recuperação.

Se sua aplicação já possui as strings dos documentos candidatos, considere o [Reflex](reflex.md): uma busca sem coleção que classifica documentos fornecidos sem indexação ou armazenamento. Use busca gerenciada quando a AIVAX deve armazenar e buscar um corpus persistente ou quando o corpus é grande demais para ser enviado como candidatos a cada requisição.

Antes de buscar, adicione [documents](documents.md) a uma [collection](collections.md) e aguarde a indexação. Apenas documentos indexados são retornados. Compare a [busca vetorial com o pipeline completo RAG](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/) antes de decidir o que construir.

## Consultar coleções

<script src="https://inference.aivax.net/apidocs?embed-target=Query%20collections&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Uma consulta executa na seguinte ordem:

1. Se um filtro for definido, a AIVAX restringe cada coleção aos documentos que o correspondem.
2. Cada termo de busca é embutido e comparado com os documentos restantes.
3. Documentos abaixo de `minScore` são descartados, e os `candidates` documentos mais próximos formam o pool de candidatos.
4. O reranker reordena o pool, a menos que o reranking esteja desativado.
5. O pool é ordenado e retornado em páginas de `limit` resultados.

```json
{
  "collections": [ "<collection-id>" ],
  "terms": "How do I request a refund?"
}
```

| Opção | Padrão | Descrição |
| --- | --- | --- |
| `collections` | Required | IDs das coleções pertencentes à conta. Um item também pode ser `{ "id": "<collection-id>", "filter": "..." }` para filtrar apenas essa coleção. |
| `terms` | Required | Um texto de busca ou uma lista de textos alternativos. |
| `filter` | — | Uma expressão de [filtro avançado](document-filters.md) ou uma lista de expressões que devem todas corresponder. |
| `minScore` | 0.2 | Similaridade vetorial mínima, de 0 a 0.99, para que um documento entre no pool de candidatos. Aumente para descartar correspondências fracas; diminua quando documentos relevantes estiverem faltando. |
| `candidates` | `limit` × 3 | Tamanho do pool de candidatos, de `limit` até 1000. Um pool maior oferece ao reranker e às páginas subsequentes mais documentos para trabalhar. |
| `reranker` | `smart` (Reflex) | Reranker que ordena o pool: `smart`, `lexical`, `rrf`, `none`, ou o nome completo de um reranker. Veja [Rerankers](reranking.md). |
| `sort` | Score, descending | `{ "by": "score" \| "createdAt" \| "updatedAt" \| "indexedAt" \| "name", "dir": "asc" \| "desc" }`. Sem `dir`, score ordena decrescente e os outros campos ascendente. |
| `limit` | 10 | Resultados por página, de 1 a 128. |
| `cursor` | — | `page.cursor` da resposta anterior, para ler a próxima página. |
| `include` | `content`, `metadata` | Campos de documento opcionais: `content`, `metadata` e `references`. `references` anexa os outros documentos que compartilham a referência de cada resultado. |

### Ordenação e reranqueamento

Um reranker ordena por relevância, portanto só se aplica quando os resultados são ordenados por score:

| Request | Behavior |
| --- | --- |
| No `sort` and no `reranker` | Reflex rerankeia o pool; os resultados são ordenados por score. |
| `reranker` without `sort` | Esse reranker rerankeia o pool; os resultados são ordenados por score. |
| `sort` other than score, without `reranker` | Reranking está desativado. O pool é selecionado por similaridade e então ordenado pelo campo solicitado. |
| `sort` other than score with `reranker: "none"` | Mesmo que acima. |
| `sort` other than score with any other `reranker` | Rejeitado com `400 Bad Request`. |

Para obter os documentos relevantes mais recentes, selecione um pool por significado e ordene-o por data:

```json
{
  "collections": [ "<collection-id>" ],
  "terms": "pricing change",
  "candidates": 100,
  "sort": { "by": "createdAt", "dir": "desc" }
}
```

Cada reranker tem um número máximo de documentos que aceita; um valor de `candidates` acima desse limite é rejeitado.

### Resultados

Cada resultado tem um `rank`, um `document` e `scores`:

- `document` contém `id`, `collectionId`, `name`, `reference`, `tags`, `createdAt`, `updatedAt`, `indexedAt` e os campos solicitados em `include`.
- `scores.similarity` é a similaridade vetorial, `scores.rerank` é a pontuação do reranker (ou `null`), e `scores.final` é a pontuação final quando um reranker foi executado, caso contrário a similaridade.

A resposta também contém `page.cursor`, `page.hasMore`, `page.candidates` (o tamanho do pool) e o `reranker` que foi executado.

### Páginas

A primeira requisição calcula o pool de candidatos e retorna sua primeira página. Para ler a próxima página, envie o mesmo corpo de requisição com `cursor` definido para o `page.cursor` anterior. Páginas subsequentes são lidas do pool armazenado, portanto não são cobradas novamente e mantêm a mesma ordem.

Um cursor expira após 10 minutos sem uso e então retorna `410 Gone`; repita a requisição sem `cursor` para executar a consulta novamente. Um cursor enviado com um corpo de requisição diferente é rejeitado com `400 Bad Request`. O pool nunca cresce: para ver mais de `candidates` resultados, aumente `candidates`.

## Encontrar documentos semelhantes

<script src="https://inference.aivax.net/apidocs?embed-target=Find%20similar%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Encontrar documentos semelhantes usa o vetor armazenado de um documento indexado como consulta, como em um recurso "mais como este". O documento fonte nunca é retornado. Aceita `documentId` e as mesmas opções `collections`, `filter`, `minScore`, `candidates`, `sort`, `limit`, `cursor` e `include` de uma consulta; sem `collections`, busca na coleção do documento fonte.

```json
{
  "documentId": "<document-id>",
  "limit": 5
}
```

Nada é embutido ou rerankeado, portanto `scores.rerank` é sempre `null`. O documento fonte deve estar indexado; um documento ainda aguardando indexação é rejeitado com `400 Bad Request`.

## Navegar documentos

<script src="https://inference.aivax.net/apidocs?embed-target=Browse%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Navegar documentos lista documentos indexados sem busca semântica. Por padrão, os documentos são retornados na ordem de inserção, os mais antigos primeiro. Sem filtro, todo documento indexado das coleções é listado.

```json
{
  "collections": [ "<collection-id>" ],
  "filter": "createdAt >= now-7d",
  "sort": { "by": "createdAt", "dir": "desc" },
  "limit": 50
}
```

Aceita `collections`, `filter`, `sort`, `limit`, `cursor` e `include`. `sort.by` pode ser `createdAt`, `updatedAt`, `indexedAt` ou `name`; ordenação por score é rejeitada. Os resultados contêm apenas `document`, sem `rank` ou `scores`.

Os cursores de navegação apontam para o último documento retornado em vez de um pool armazenado, portanto não expiram. Documentos adicionados ou alterados entre requisições aparecem em páginas posteriores de acordo com a ordem de classificação.

## Filtrar resultados

Filtros restringem os documentos que uma busca pode retornar, usando condições exatas nos campos dos documentos em vez de similaridade semântica. Use-os quando a resposta deve vir de um subconjunto conhecido, como um produto, locatário, idioma, tipo de documento ou período.

| Filtrar em | Exemplo | Uso para |
| --- | --- | --- |
| Name | `name startswith "policy-"` | Famílias de documentos que seguem uma convenção de nomenclatura. |
| Tags | `tags has "finance"` | Rótulos operacionais atribuídos na importação. |
| Metadata | `metadata.region = "br"` | Valores estruturados armazenados com cada documento, como região, versão ou autor. |
| Contents | `content contains "refund"` | Palavras ou identificadores obrigatórios no texto. |
| Dates | `updatedAt >= now-30d` | Documentos criados ou atualizados recentemente. |

Combine condições com `and`, `or`, `not` e parênteses, por exemplo `tags has "finance" and createdAt >= now-30d`. Quando `filter` é uma lista, toda expressão deve corresponder. Um filtro definido em um item de coleção é combinado com o `filter` de nível superior para aquela coleção.

Filtros são avaliados antes que os termos de busca sejam embutidos. Apenas documentos correspondentes são classificados, portanto os resultados nunca incluem documentos fora do filtro. Quando nenhum documento corresponde, a consulta retorna um resultado vazio sem gerar embeddings nem cobrar pela consulta.

Filtros não substituem um bom texto de documento: o significado que o usuário procura deve aparecer no conteúdo. Veja [Advanced filters](document-filters.md) para a sintaxe completa, operadores, limites e erros, ou [How to filter RAG results by metadata, tags and date](https://aivax.net/blog/filter-rag-results-by-metadata-tags-date/) para um guia prático.

## Múltiplos termos

Múltiplos termos cobrem caminhos alternativos de recuperação em vez de exigir que cada termo corresponda ao mesmo documento. Cada documento recebe pontuação pela melhor correspondência entre os termos. Use-os para sinônimos, reformulações alternativas ou várias formas aceitáveis de encontrar uma resposta.

Se a pergunta do usuário combina várias condições relacionadas, mantenha-as juntas em um único termo de busca. Por exemplo, prefira:

```text
How do I cancel an annual subscription without a penalty?
```

Em vez de palavras‑chave desconexas:

```text
cancellation
annual subscription
penalty
```

Uma consulta completa costuma ter melhor desempenho do que uma lista de palavras‑chave desconexas porque preserva a relação entre os conceitos. Se os usuários buscam por códigos de produto, IDs de política, nomes de plano ou nomes de procedimento, inclua esses identificadores no texto do documento.

## Reranking

Um reranker ajusta a ordem do pool de candidatos retornado pela busca vetorial. Ele não busca documentos adicionais nem recupera texto que a fase de recuperação não selecionou; aumente `candidates` para fornecer mais documentos. Veja [Rerankers](reranking.md) para orientações de seleção.

## Erros

| Status | Cause |
| --- | --- |
| `400 Bad Request` | Campo inválido, coleção ou documento desconhecido, [filtro inválido](document-filters.md#errors), um reranker combinado com um sort diferente de score, ou um cursor enviado com um corpo de requisição diferente. |
| `410 Gone` | O cursor da consulta expirou. Repita a requisição sem `cursor`. |
| `429 Too Many Requests` | O limite de taxa de busca ou reranking do plano foi excedido. |

## Qualidade da busca

Se a busca retornar resultados ruins:

1. Confirme que os documentos estão indexados.
2. Consulte a coleção diretamente antes de testar através de um gateway de IA.
3. Compare perguntas completas com reformulações alternativas.
4. Verifique se o documento relevante é muito curto, muito longo ou não autônomo; veja [Write good documents](documents.md#write-good-documents).
5. Verifique se o idioma da consulta corresponde ao idioma do documento.
6. Se o gateway reescreve perguntas antes de buscar, teste com o caminho de consulta simples para isolar problemas de reescrita.
7. Revise buscas com baixa pontuação e cobertura de consultas em [RAG Observability](observability.md).

Para expor coleções como ferramentas para um cliente MCP externo, veja [Collections and RAG MCP](../mcp-utilities/collections-mcp.md). Para preços e limites de taxa de busca, veja [Collections](collections.md#pricing-and-limits).
