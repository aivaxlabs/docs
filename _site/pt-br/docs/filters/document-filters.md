Source: https://docs.aivax.net/pt-br/docs/filters/document-filters.html

# Filtros de Documento

Um filtro de documento restringe uma busca RAG aos documentos que correspondem a uma condição, como uma tag, um valor de metadado ou um intervalo de datas. Apenas os documentos que passam pelo filtro são classificados por similaridade semântica, portanto os resultados nunca incluem documentos fora do filtro.

Os filtros são avaliados **antes** que os termos de busca sejam incorporados. Quando nenhum documento nas coleções solicitadas corresponde ao filtro, a requisição retorna um resultado vazio sem gerar embeddings ou cobrar pela busca.

```text
tags has "finance" and createdAt >= now-30d
```

## Onde os Filtros São Suportados

Envie o filtro no campo `filter` desses endpoints:

- [Semantic search](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md)
- Geração de resposta

O campo aceita uma string ou um array de strings. Os itens do array são combinados com `and`:

```json
{
  "term": "How do I request a refund?",
  "collections": [ "<collection-id>" ],
  "filter": [
    "tags has \"billing\"",
    "metadata.region = \"latam\""
  ]
}
```

Um campo ausente ou `null` significa sem filtro. O nome do campo é `filter`; outros nomes, como `filters`, são ignorados e a busca é executada sem filtro.

Os modelos também podem enviar uma string de filtro no argumento opcional `filter` dessas ferramentas:

- A ferramenta de busca do [Collections MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md#generated-tools).
- A ferramenta `query` de gateways de IA que usam a [estratégia de consulta](https://docs.aivax.net/pt-br/docs/inference/pipelines.md).

A ferramenta [`memory_search`](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#search-memories) também aceita uma string de filtro, mas requer exatamente um de `query` ou `filter`, não ambos. Seu modo somente filtro retorna até 10 memórias correspondentes para o usuário atual, das mais recentes para as mais antigas, sem embeddings de consulta.

O RAG automático de gateway, que busca antes da chamada ao modelo, não aplica filtros. Um filtro inválido em uma chamada de ferramenta é retornado ao modelo como um erro de ferramenta com a mesma mensagem da API.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Semantic%20search)

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Answer%20generation)

## Sintaxe

Um filtro é uma ou mais condições unidas por `and`, `or` e `not`. Cada condição tem a forma `campo operador valor`:

```text
name startswith "contract-"
metadata.pages > 10
not tags has "draft"
(tags has "finance" or tags has "legal") and updatedAt >= "2026-01-01"
```

- `not` tem precedência maior que `and`, e `and` tem precedência maior que `or`. Use parênteses para agrupar explicitamente.
- Palavras-chave, operadores e nomes de campos não diferenciam maiúsculas de minúsculas: `AND`, `And` e `and` são equivalentes.
- Strings usam aspas duplas ou simples. Dentro de uma string, escape a mesma asa com barra invertida: `"say \"hi\""`, `'it\'s'`. As sequências de escape suportadas são `\"`, `\'`, `\\`, `\/`, `\n`, `\r`, `\t` e `\uXXXX`.
- Números usam ponto como separador decimal e podem usar expoente: `10`, `-2.5`, `1e3`.
- Os outros literais são `true`, `false`, `null` e `now` (apenas em condições de data).

Um valor deve ser um literal. Funções, aritmética, conversões de tipo e comparações entre dois campos não são suportados.

## Campos

| Campo | Tipo | Origem |
| --- | --- | --- |
| `name` | texto | O nome do documento (`docid` em importações JSONL). |
| `content` | texto | O texto indexado do documento. |
| `tags` | lista de texto | As tags do documento (`__tags`). |
| `createdAt` | data e hora | Quando o documento foi criado. |
| `updatedAt` | data e hora | Quando o documento foi atualizado pela última vez. |
| `metadata.<key>` | valor JSON | Um valor dentro dos metadados do documento (`__meta`). |

Consulte [Collections](https://docs.aivax.net/pt-br/docs/rag/collections.md#document-fields) para saber como esses campos são definidos.

## Operadores

| Campo | `=` `!=` | `>` `>=` `<` `<=` | `contains` `startswith` `endswith` | `in` | `has` | `exists` |
| --- | --- | --- | --- | --- | --- | --- |
| `name`, `content` | texto | — | texto | lista de texto | — | — |
| `tags` | — | — | — | lista de texto | texto | — |
| `createdAt`, `updatedAt` | data | data | — | — | — | — |
| `metadata.<key>` | texto, número, booleano, `null` | número | texto | qualquer lista | qualquer valor | ✓ |

- `field in (a, b, c)` é equivalente a `field = a ou field = b ou field = c`. Para `tags`, combina com documentos que possuam ao menos uma das tags listadas.
- `has` verifica se uma lista contém um valor: `tags has "x"`, ou `metadata.<key> has value` quando o valor do metadado é um array JSON.
- `exists` verifica se um caminho de metadado está presente, inclusive quando seu valor é `null`.
- `x != v` é exatamente `not x = v`.
- Qualquer outra combinação, como `tags = "x"` ou `name > "a"`, é rejeitada.

## Comparação de Texto

As comparações de texto ignoram maiúsculas/minúsculas e acentos: `name = "relatorio"` combina com um documento chamado `Relatório`.

- `=` e `in` ignoram espaços à direita: `"report "` combina com `"report"`.
- `contains`, `startswith` e `endswith` combinam literalmente, sem curingas. Os caracteres `%` e `_` combinam apenas consigo mesmos.
- `contains` requer ao menos 3 caracteres.

As comparações de texto não dividem palavras nem correspondem a sinônimos. Use os termos de busca para significado e o filtro para restrições exatas.

## Metadados

Use um ponto para ler metadados aninhados. Chaves que não são identificadores simples vão entre aspas:

```text
metadata.author.name = "Ana"
metadata."file-path" startswith "/contracts/2026/"
metadata."a.b" = 1
```

O último exemplo lê uma chave chamada `a.b`, não um caminho aninhado. Índices de array não são suportados; use `has` para verificar se um array contém um valor.

O tipo literal seleciona a comparação, e **os tipos nunca são convertidos**:

| Literal | Corresponde a valores armazenados do tipo |
| --- | --- |
| texto | string JSON |
| número | número JSON |
| `true` / `false` | booleano JSON |
| `null` | JSON `null` |

Portanto `metadata.year = 2026` não corresponde a `{"year": "2026"}`, e `metadata.public = true` não corresponde a `{"public": "true"}`. Se seus dados misturam tipos, liste ambos: `metadata.year in (2026, "2026")`.

Operadores de ordenação (`>`, `>=`, `<`, `<=`) funcionam apenas em números nos metadados. Datas armazenadas nos metadados não podem ser comparadas como datas; use `createdAt` e `updatedAt`, ou armazene um número ordenável como um timestamp Unix ou `20260915`.

Uma chave ausente nunca corresponde a uma condição positiva, portanto `metadata.lang != "en"` também corresponde a documentos sem `lang`. Para excluí-los, adicione `metadata.lang exists`.

Armazene metadados com tipos consistentes por chave e prefira chaves compostas por letras ASCII, dígitos, `-` e `_`.

## Datas

`createdAt` e `updatedAt` aceitam datas absolutas e tempos relativos.

**Datas absolutas** usam ISO 8601:

```text
createdAt >= "2026-09-01"
updatedAt < "2026-09-01T18:30"
createdAt >= "2026-09-01T00:00:00-03:00"
createdAt >= "2026-09-01T03:00:00Z"
```

- Uma data sem hora significa meia-noite.
- Um valor sem `Z` ou offset é interpretado no fuso horário do serviço AIVAX, America/Sao_Paulo (UTC−03:00). Adicione `Z` ou um offset quando precisar de um instante exato.
- Outros formatos, como `15/06/2025`, são rejeitados.

**Tempos relativos** usam `now`, opcionalmente seguidos por `+` ou `-` e uma quantidade com unidade:

| Unidade | Significado |
| --- | --- |
| `m` | minutos |
| `h` | horas |
| `d` | dias |
| `w` | semanas |
| `mo` | meses calendário |
| `y` | anos calendário |

```text
createdAt >= now-7d
updatedAt >= now-12h and updatedAt < now
```

## Limites

| Limite | Valor |
| --- | --- |
| Comprimento do filtro | 2,048 characters por string |
| Condições | 32 por string |
| Nível de aninhamento de parênteses e `not` | 8 níveis |
| Valores em uma lista `in` | 100 |
| Comprimento de um valor de texto ou chave de metadado | 256 caracteres |
| Chaves em um caminho de metadado | 8 |
| Comprimento mínimo de `contains` | 3 caracteres |

Um filtro deve ser concluído em até 10 segundos. Condições em `content`, `endswith`, tags e metadados examinam cada documento nas coleções solicitadas, portanto demoram mais em coleções grandes. Se um filtro exceder o limite de tempo, a requisição falha e solicita condições mais seletivas. Priorize condições em `name` (`=`, `in`, `startswith`), divida corpora muito grandes em coleções menores e reserve `content contains` para coleções onde ele permanece rápido.

## Erros

Um filtro inválido retorna `400 Bad Request` com uma mensagem que indica o problema e a posição do caractere onde foi encontrado:

```json
{
  "error": "Invalid filter: Unknown field 'author'. Expected name, content, tags, createdAt, updatedAt or metadata.<key>. (at 0)"
}
```

Para um array, a mensagem inclui o índice do item inválido, como `Invalid filter at index 1: ...`. Um `filter` que não seja uma string ou um array de strings também é rejeitado.

## Exemplos

| Objetivo | Filtro |
| --- | --- |
| Documentos com uma tag | `tags has "finance"` |
| Qualquer uma de várias tags | `tags in ("finance", "legal")` |
| Excluir rascunhos | `not tags has "draft"` |
| Um documento específico | `name = "refund-policy"` |
| Documentos de uma família | `name startswith "manual-v2-"` |
| Conteúdo mencionando um termo | `content contains "late fee"` |
| Criado nos últimos 30 dias | `createdAt >= now-30d` |
| Atualizado em setembro de 2026 | `updatedAt >= "2026-09-01" and updatedAt < "2026-10-01"` |
| Um valor de metadado | `metadata.department = "finance"` |
| Vários valores de metadado | `metadata.author.name in ("Ana", "Bruno")` |
| Intervalo numérico | `metadata.pages > 10 and metadata.pages <= 200` |
| Indicador booleano | `metadata.public = true` |
| Array de metadado contém | `metadata.languages has "pt-BR"` |
| Chave presente e não nula | `metadata.reviewer exists and metadata.reviewer != null` |
| Chave ausente | `not metadata.archived exists` |
| Combinado | `(tags has "finance" or metadata.department = "finance") and createdAt >= now-1mo` |

## Erros Comuns

| Em vez de | Escreva |
| --- | --- |
| `name == "x"` | `name = "x"` |
| `lower(name) = "x"` | `name = "x"` (já case-insensitive) |
| `tags = "x"` | `tags has "x"` |
| `metadata.price > "100"` | `metadata.price > 100`, com o preço armazenado como número |
| `createdAt >= "15/06/2025"` | `createdAt >= "2025-06-15"` |
| `metadata.date >= "2025-06-15"` | `createdAt >= "2025-06-15"`, ou um valor numérico de metadado |
| `content contains "ai"` | Um termo com pelo menos 3 caracteres |
| `"filters": [ ... ]` | `"filter": [ ... ]` |
