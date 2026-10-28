Source: https://docs.aivax.net/pt-br/docs/rag/document-filters.html

# Filtros Avançados

Um filtro avançado, também chamado de filtro de documento, restringe uma pesquisa RAG aos documentos que correspondem a uma condição, como uma tag, um valor de metadado ou um intervalo de datas. Apenas os documentos que passam pelo filtro são classificados por similaridade semântica, portanto os resultados nunca incluem documentos fora do filtro. Para um tutorial orientado a tarefas, veja [How to filter RAG results by metadata, tags and date](https://aivax.net/blog/filter-rag-results-by-metadata-tags-date/).

Os filtros são avaliados **antes** que os termos de pesquisa sejam incorporados. Quando nenhum documento nas coleções solicitadas corresponde ao filtro, a requisição retorna um resultado vazio sem gerar embeddings ou cobrar pela pesquisa.

```text
tags has "finance"
metadata.department = "finance" and createdAt >= now-30d
(tags has "finance" or tags has "legal") and not tags has "draft"
```

## Anatomia de um Filtro

Um filtro é uma ou mais **condições** unidas por `and`, `or` e `not`. Cada condição tem três partes:

```text
metadata.pages   >   10
└── field ──┘   └op┘ └value┘
```

- **Campo** — o que observar: `name`, `content`, `tags`, `createdAt`, `updatedAt` ou `metadata.<key>`. Veja [Fields](#fields).
- **Operador** — como comparar: `=`, `>`, `contains`, `in`, `has`, `exists` e outros. Veja [Operators](#operators).
- **Valor** — um literal para comparar: uma string entre aspas, um número, `true`, `false`, `null`, uma data ou uma lista entre parênteses. Veja [Values](#values).

O valor deve ser sempre um literal. Funções, aritmética, conversões de tipo e comparações entre dois campos não são suportadas. Palavras‑chave, operadores e nomes de campos não diferenciam maiúsculas de minúsculas: `AND`, `And` e `and` são equivalentes.

## Campos

| Campo | Tipo | Fonte |
| --- | --- | --- |
| `name` | texto | O nome do documento (`docid` em importações JSONL). |
| `content` | texto | O texto do documento indexado. |
| `tags` | lista de texto | As tags do documento (`__tags`). |
| `createdAt` | data e hora | Quando o documento foi criado. |
| `updatedAt` | data e hora | Quando o documento foi atualizado pela última vez. |
| `metadata.<key>` | valor JSON | Um valor dentro dos metadados do documento (`__meta`). |

Consulte [Documents](https://docs.aivax.net/pt-br/docs/rag/documents.md#anatomy-of-a-document) para saber como esses campos são definidos.

## Operadores

Cada operador funciona apenas com campos e tipos de valor específicos. Qualquer outra combinação, como `tags = "x"` ou `name > "a"`, é rejeitada.

### Igualdade

| Operador | Significado | Campos | Exemplo |
| --- | --- | --- | --- |
| `=` | Igual | `name`, `content`, `createdAt`, `updatedAt`, `metadata.<key>` | `name = "refund-policy"` |
| `!=` | Não igual; exatamente `not field = value` | Mesmo que `=` | `metadata.lang != "en"` |

Para `metadata.<key>`, o valor pode ser texto, número, `true`, `false` ou `null`. A comparação de texto ignora maiúsculas, minúsculas e acentos; veja [Strings](#strings).

### Ordenação

| Operador | Significado | Campos | Exemplo |
| --- | --- | --- | --- |
| `>` `>=` `<` `<=` | Maior ou menor que | `createdAt`, `updatedAt`, `metadata.<key>` numérico | `metadata.pages > 10` |

A ordenação funciona em datas para `createdAt` e `updatedAt`, e apenas em **números** para metadados. Datas ou textos armazenados em metadados não podem ser ordenados; veja [Metadata](#metadata).

### Texto

| Operador | Significado | Campos | Exemplo |
| --- | --- | --- | --- |
| `contains` | Inclui o texto; no mínimo 3 caracteres | `name`, `content`, texto `metadata.<key>` | `content contains "late fee"` |
| `startswith` | Começa com o texto | Mesmo | `name startswith "contract-"` |
| `endswith` | Termina com o texto | Mesmo | `name endswith ".pdf"` |

Esses operadores combinam literalmente, sem curingas: `%` e `_` combinam apenas consigo mesmos. Eles não dividem palavras nem correspondem a sinônimos. Use os termos de pesquisa para significado e o filtro para restrições exatas.

### Listas

| Operador | Significado | Campos | Exemplo |
| --- | --- | --- | --- |
| `in` | Igual a qualquer valor da lista | `name`, `content`, `tags`, `metadata.<key>` | `metadata.region in ("latam", "emea")` |
| `has` | A lista contém o valor | `tags`, array `metadata.<key>` | `tags has "finance"` |

`field in (a, b, c)` é equivalente a `field = a or field = b or field = c`. Para `tags`, `in` corresponde a documentos que tenham ao menos uma das tags listadas. `has` é o único operador estilo igualdade para `tags`; `tags = "x"` é rejeitado.

### Existência

| Operador | Significado | Campos | Exemplo |
| --- | --- | --- | --- |
| `exists` | A chave de metadado está presente, mesmo que seu valor seja `null` | `metadata.<key>` | `metadata.reviewer exists` |

`exists` não recebe valor. Para exigir um valor não nulo, combine com `!=`: `metadata.reviewer exists and metadata.reviewer != null`.

## Valores

### Strings

Strings usam aspas duplas ou simples. Dentro de uma string, escape a mesma aspas com barra invertida: `"say \"hi\""`, `'it\'s'`. As sequências de escape suportadas são `\"`, `\'`, `\\`, `\/`, `\n`, `\r`, `\t` e `\uXXXX`.

Comparações de texto ignoram maiúsculas, minúsculas e acentos: `name = "relatorio"` corresponde a um documento chamado `Relatório`. `=` e `in` também ignoram espaços finais: `"report "` corresponde a `"report"`.

### Números

Números usam ponto como separador decimal e podem usar expoente: `10`, `-2.5`, `1e3`. Números nunca são colocados entre aspas; `"100"` é uma string.

### Booleanos e nulo

`true`, `false` e `null` são literais, escritos sem aspas. Eles são válidos apenas para `metadata.<key>`.

### Datas

`createdAt` e `updatedAt` aceitam datas absolutas e tempos relativos.

**Datas absolutas** usam ISO 8601 entre aspas:

```text
createdAt >= "2026-09-01"
updatedAt < "2026-09-01T18:30"
createdAt >= "2026-09-01T00:00:00-03:00"
createdAt >= "2026-09-01T03:00:00Z"
```

- Uma data sem hora significa meia‑noite.  
- Um valor sem `Z` ou deslocamento é interpretado no fuso horário do serviço AIVAX, America/Sao_Paulo (UTC−03:00). Adicione `Z` ou deslocamento quando precisar de instante exato.  
- Outros formatos, como `15/06/2025`, são rejeitados.

**Tempos relativos** usam `now`, opcionalmente seguido por `+` ou `-` e uma quantidade com unidade, sem aspas:

| Unidade | Significado |
| --- | --- |
| `m` | minutos |
| `h` | horas |
| `d` | dias |
| `w` | semanas |
| `mo` | meses do calendário |
| `y` | anos do calendário |

```text
createdAt >= now-7d
updatedAt >= now-12h and updatedAt < now
```

`now` é válido apenas em condições de data.

### Listas

Uma lista é um ou mais valores separados por vírgulas dentro de parênteses: `("finance", "legal")`, `(2026, "2026")`. Listas são usadas com `in`.

## Combinando Condições

Una condições com `and`, `or` e `not`:

```text
not tags has "draft"
tags has "finance" and createdAt >= now-30d
(tags has "finance" or tags has "legal") and updatedAt >= "2026-01-01"
```

`not` tem precedência maior que `and`, e `and` tem precedência maior que `or`. Portanto, `a or b and c` significa `a or (b and c)`. Use parênteses para agrupar explicitamente.

## Metadados

Use ponto para ler metadados aninhados. Chaves que não são identificadores simples vão entre aspas:

```text
metadata.author.name = "Ana"
metadata."file-path" startswith "/contracts/2026/"
metadata."a.b" = 1
```

O último exemplo lê uma chave chamada `a.b`, não um caminho aninhado. Índices de array não são suportados; use `has` para verificar se um array contém um valor.

**Tipos nunca são convertidos.** O tipo literal determina quais valores armazenados podem corresponder:

| Literal | Corresponde a valores armazenados do tipo |
| --- | --- |
| texto | string JSON |
| número | número JSON |
| `true` / `false` | boolean JSON |
| `null` | `null` JSON |

Assim, `metadata.year = 2026` não corresponde a `{"year": "2026"}`, e `metadata.public = true` não corresponde a `{"public": "true"}`. Se seus dados misturam tipos, liste ambos: `metadata.year in (2026, "2026")`.

Operadores de ordenação funcionam apenas em números nos metadados. Datas armazenadas em metadados não podem ser comparadas como datas; use `createdAt` e `updatedAt`, ou armazene um número ordenável como timestamp Unix ou `20260915`.

Uma chave ausente nunca corresponde a uma condição positiva, portanto `metadata.lang != "en"` também corresponde a documentos sem `lang`. Para excluí‑los, adicione `metadata.lang exists`.

Armazene metadados com tipos consistentes por chave e prefira chaves formadas por letras ASCII, dígitos, `-` e `_`.

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

| Em vez de | Escrever |
| --- | --- |
| `name == "x"` | `name = "x"` |
| `lower(name) = "x"` | `name = "x"` (já insensível a maiúsculas) |
| `tags = "x"` | `tags has "x"` |
| `metadata.price > "100"` | `metadata.price > 100`, com o preço armazenado como número |
| `createdAt >= "15/06/2025"` | `createdAt >= "2025-06-15"` |
| `metadata.date >= "2025-06-15"` | `createdAt >= "2025-06-15"`, ou um valor numérico de metadado |
| `content contains "ai"` | Um termo com pelo menos 3 caracteres |
| `"filters": [ ... ]` | `"filter": [ ... ]` |

## Onde os Filtros são Suportados

Envie o filtro no campo `filter` desses endpoints:

- [Consultar coleções, encontrar documentos semelhantes e navegar documentos](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md)
- Geração de respostas

O campo aceita uma string ou um array de strings. Itens do array são combinados com `and`:

```json
{
  "terms": "How do I request a refund?",
  "collections": [ "<collection-id>" ],
  "filter": [
    "tags has \"billing\"",
    "metadata.region = \"latam\""
  ]
}
```

Os endpoints de pesquisa também aceitam um filtro para uma única coleção, combinado com o `filter` de nível superior para essa coleção:

```json
{
  "terms": "How do I request a refund?",
  "collections": [
    "<collection-id>",
    { "id": "<other-collection-id>", "filter": "metadata.source = \"crm\"" }
  ],
  "filter": "tags has \"billing\""
}
```

Um campo ausente ou `null` significa sem filtro. O nome do campo é `filter`; outros nomes, como `filters`, são ignorados e a pesquisa é executada sem filtro.

Os modelos também podem enviar uma string de filtro no argumento opcional `filter` dessas ferramentas:

- A ferramenta de busca do [Collections MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md#generated-tools).
- A ferramenta `query` de gateways de IA que usam a [estratégia de consulta](https://docs.aivax.net/pt-br/docs/inference/pipelines.md).

A ferramenta [`memory_search`](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#search-memories) também aceita uma string de filtro, mas requer exatamente um de `query` ou `filter`, não ambos. Seu modo somente filtro retorna até 10 memórias correspondentes ao usuário atual, as mais recentes primeiro, sem embeddings de consulta.

O gateway RAG automático, que pesquisa antes da chamada ao modelo, não aplica filtros. Um filtro inválido em uma chamada de ferramenta é retornado ao modelo como erro de ferramenta com a mesma mensagem da API.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Query%20collections)

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Answer%20generation)

## Limites

Estes limites se aplicam a todo filtro, incluindo filtros usados por busca de memória e pelo Collections MCP.

| Limite | Valor |
| --- | --- |
| Comprimento do filtro | 2.048 caracteres por string |
| Condições | 32 por string |
| Aninhamento de parênteses e `not` | 8 níveis |
| Valores em uma lista `in` | 100 |
| Comprimento de um valor de texto ou chave de metadado | 256 caracteres |
| Chaves em um caminho de metadado | 8 |
| Comprimento mínimo de `contains` | 3 caracteres |
| Tempo de execução | 10 segundos |

Condições sobre `content`, `endswith`, tags e metadados examinam cada documento nas coleções solicitadas, portanto demoram mais em coleções grandes. Se um filtro exceder o limite de tempo, a requisição falha e solicita condições mais seletivas. Prefira condições sobre `name` (`=`, `in`, `startswith`), divida corpora muito grandes em coleções menores e reserve `content contains` para coleções onde permaneça rápido.

## Erros

Um filtro inválido retorna `400 Bad Request` com uma mensagem que indica o problema e a posição do caractere onde foi encontrado:

```json
{
  "error": "Invalid filter: Unknown field 'author'. Expected name, content, tags, createdAt, updatedAt or metadata.<key>. (at 0)"
}
```

Para um array, a mensagem inclui o índice do item inválido, como `Invalid filter at index 1: ...`. Um `filter` que não seja uma string ou um array de strings também é rejeitado.
