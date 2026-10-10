Source: https://docs.aivax.net/docs/filters/document-filters.html

# Document Filters

A document filter restricts a RAG search to the documents that match a condition, such as a tag, a metadata value, or a date range. Only documents that pass the filter are ranked by semantic similarity, so results never include documents outside the filter.

Filters are evaluated **before** the search terms are embedded. When no document in the requested collections matches the filter, the request returns an empty result without generating embeddings or charging for the search.

```text
tags has "finance" and createdAt >= now-30d
```

## Where Filters Are Supported

Send the filter in the `filter` field of these endpoints:

- [Semantic search](https://docs.aivax.net/docs/rag/semantic-search.md)
- Answer generation

The field accepts a string or an array of strings. Array items are combined with `and`:

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

A missing or `null` field means no filter. The field name is `filter`; other names, such as `filters`, are ignored and the search runs without a filter.

Models can also send a filter string in the optional `filter` argument of these tools:

- The search tool of the [Collections MCP](https://docs.aivax.net/docs/mcp-utilities/collections-mcp.md#generated-tools).
- The `query` tool of AI gateways that use the `QueryFunction` [query strategy](https://docs.aivax.net/docs/inference/pipelines.md).

The [`memory_search` tool](https://docs.aivax.net/docs/tools/builtin-tools.md#search-memories) also accepts a filter string, but requires exactly one of `query` or `filter`, not both. Its filter-only mode returns up to 10 matching memories for the current user, newest first, without query embeddings.

Automatic gateway RAG, which searches before the model call, does not apply filters. An invalid filter in a tool call is returned to the model as a tool error with the same message as the API.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Semantic%20search)

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Answer%20generation)

## Syntax

A filter is one or more conditions joined by `and`, `or`, and `not`. Each condition has the form `field operator value`:

```text
name startswith "contract-"
metadata.pages > 10
not tags has "draft"
(tags has "finance" or tags has "legal") and updatedAt >= "2026-01-01"
```

- `not` binds tighter than `and`, and `and` binds tighter than `or`. Use parentheses to group explicitly.
- Keywords, operators, and field names are case-insensitive: `AND`, `And`, and `and` are equivalent.
- Strings use double or single quotes. Inside a string, escape the same quote with a backslash: `"say \"hi\""`, `'it\'s'`. Supported escapes are `\"`, `\'`, `\\`, `\/`, `\n`, `\r`, `\t`, and `\uXXXX`.
- Numbers use a dot as the decimal separator and may use an exponent: `10`, `-2.5`, `1e3`.
- The other literals are `true`, `false`, `null`, and `now` (only in date conditions).

A value must be a literal. Functions, arithmetic, type conversions, and comparisons between two fields are not supported.

## Fields

| Field | Type | Source |
| --- | --- | --- |
| `name` | text | The document name (`docid` in JSONL imports). |
| `content` | text | The indexed document text. |
| `tags` | list of text | The document tags (`__tags`). |
| `createdAt` | date and time | When the document was created. |
| `updatedAt` | date and time | When the document was last updated. |
| `metadata.<key>` | JSON value | A value inside the document metadata (`__meta`). |

See [Collections](https://docs.aivax.net/docs/rag/collections.md#document-fields) for how these fields are set.

## Operators

| Field | `=` `!=` | `>` `>=` `<` `<=` | `contains` `startswith` `endswith` | `in` | `has` | `exists` |
| --- | --- | --- | --- | --- | --- | --- |
| `name`, `content` | text | — | text | text list | — | — |
| `tags` | — | — | — | text list | text | — |
| `createdAt`, `updatedAt` | date | date | — | — | — | — |
| `metadata.<key>` | text, number, boolean, `null` | number | text | any list | any value | ✓ |

- `field in (a, b, c)` is equivalent to `field = a or field = b or field = c`. For `tags`, it matches documents that have at least one of the listed tags.
- `has` checks whether a list contains a value: `tags has "x"`, or `metadata.<key> has value` when the metadata value is a JSON array.
- `exists` checks whether a metadata path is present, including when its value is `null`.
- `x != v` is exactly `not x = v`.
- Any other combination, such as `tags = "x"` or `name > "a"`, is rejected.

## Text Comparison

Text comparisons ignore letter case and accents: `name = "relatorio"` matches a document named `Relatório`.

- `=` and `in` ignore trailing spaces: `"report "` matches `"report"`.
- `contains`, `startswith`, and `endswith` match literally, without wildcards. The characters `%` and `_` match only themselves.
- `contains` requires at least 3 characters.

Text comparisons do not split words or match synonyms. Use the search terms for meaning and the filter for exact constraints.

## Metadata

Use a dot to read nested metadata. Keys that are not simple identifiers go in quotes:

```text
metadata.author.name = "Ana"
metadata."file-path" startswith "/contracts/2026/"
metadata."a.b" = 1
```

The last example reads one key named `a.b`, not a nested path. Array indexes are not supported; use `has` to check whether an array contains a value.

The literal type selects the comparison, and **types are never converted**:

| Literal | Matches stored values of type |
| --- | --- |
| text | JSON string |
| number | JSON number |
| `true` / `false` | JSON boolean |
| `null` | JSON `null` |

So `metadata.year = 2026` does not match `{"year": "2026"}`, and `metadata.public = true` does not match `{"public": "true"}`. If your data mixes types, list both: `metadata.year in (2026, "2026")`.

Ordering operators (`>`, `>=`, `<`, `<=`) work only on numbers in metadata. Dates stored in metadata cannot be compared as dates; use `createdAt` and `updatedAt`, or store a sortable number such as a Unix timestamp or `20260915`.

A missing key never matches a positive condition, so `metadata.lang != "en"` also matches documents without `lang`. To exclude them, add `metadata.lang exists`.

Store metadata with consistent types per key, and prefer keys made of ASCII letters, digits, `-`, and `_`.

## Dates

`createdAt` and `updatedAt` accept absolute dates and relative times.

**Absolute dates** use ISO 8601:

```text
createdAt >= "2026-09-01"
updatedAt < "2026-09-01T18:30"
createdAt >= "2026-09-01T00:00:00-03:00"
createdAt >= "2026-09-01T03:00:00Z"
```

- A date without a time means midnight.
- A value without `Z` or an offset is interpreted in the AIVAX service time zone, America/Sao_Paulo (UTC−03:00). Add `Z` or an offset when you need an exact instant.
- Other formats, such as `15/06/2025`, are rejected.

**Relative times** use `now`, optionally followed by `+` or `-` and an amount with a unit:

| Unit | Meaning |
| --- | --- |
| `m` | minutes |
| `h` | hours |
| `d` | days |
| `w` | weeks |
| `mo` | calendar months |
| `y` | calendar years |

```text
createdAt >= now-7d
updatedAt >= now-12h and updatedAt < now
```

## Limits

| Limit | Value |
| --- | --- |
| Filter length | 2,048 characters per string |
| Conditions | 32 per string |
| Nesting of parentheses and `not` | 8 levels |
| Values in one `in` list | 100 |
| Length of a text value or metadata key | 256 characters |
| Keys in a metadata path | 8 |
| Minimum `contains` length | 3 characters |

A filter must finish within 10 seconds. Conditions on `content`, `endswith`, tags, and metadata examine every document in the requested collections, so they take longer in large collections. If a filter exceeds the time limit, the request fails and asks for more selective conditions. Prefer conditions on `name` (`=`, `in`, `startswith`), split very large corpora into smaller collections, and reserve `content contains` for collections where it stays fast.

## Errors

An invalid filter returns `400 Bad Request` with a message that names the problem and the character position where it was found:

```json
{
  "error": "Invalid filter: Unknown field 'author'. Expected name, content, tags, createdAt, updatedAt or metadata.<key>. (at 0)"
}
```

For an array, the message includes the index of the invalid item, such as `Invalid filter at index 1: ...`. A `filter` that is not a string or an array of strings is also rejected.

## Examples

| Goal | Filter |
| --- | --- |
| Documents with a tag | `tags has "finance"` |
| Any of several tags | `tags in ("finance", "legal")` |
| Exclude drafts | `not tags has "draft"` |
| A specific document | `name = "refund-policy"` |
| Documents from one family | `name startswith "manual-v2-"` |
| Content mentioning a term | `content contains "late fee"` |
| Created in the last 30 days | `createdAt >= now-30d` |
| Updated in September 2026 | `updatedAt >= "2026-09-01" and updatedAt < "2026-10-01"` |
| One metadata value | `metadata.department = "finance"` |
| Several metadata values | `metadata.author.name in ("Ana", "Bruno")` |
| Numeric range | `metadata.pages > 10 and metadata.pages <= 200` |
| Boolean flag | `metadata.public = true` |
| Metadata array contains | `metadata.languages has "pt-BR"` |
| Key present and not null | `metadata.reviewer exists and metadata.reviewer != null` |
| Key absent | `not metadata.archived exists` |
| Combined | `(tags has "finance" or metadata.department = "finance") and createdAt >= now-1mo` |

## Common Mistakes

| Instead of | Write |
| --- | --- |
| `name == "x"` | `name = "x"` |
| `lower(name) = "x"` | `name = "x"` (already case-insensitive) |
| `tags = "x"` | `tags has "x"` |
| `metadata.price > "100"` | `metadata.price > 100`, with the price stored as a number |
| `createdAt >= "15/06/2025"` | `createdAt >= "2025-06-15"` |
| `metadata.date >= "2025-06-15"` | `createdAt >= "2025-06-15"`, or a numeric metadata value |
| `content contains "ai"` | A term with at least 3 characters |
| `"filters": [ ... ]` | `"filter": [ ... ]` |
