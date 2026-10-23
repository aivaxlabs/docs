Source: https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.html

# Coleções e RAG MCP

O Collections MCP expõe uma ou mais coleções RAG da AIVAX como ferramentas para clientes MCP compatíveis. Use‑o quando um modelo externo, agente, IDE ou assistente de desktop precisar decidir quando pesquisar em uma base de conhecimento da AIVAX.

Para informações sobre como criar coleções, preparar documentos e melhorar a qualidade de recuperação, veja [Collections and Documents](https://docs.aivax.net/pt-br/docs/rag/collections.md) e [Semantic Search](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md).

## Endpoint

```text
https://inference.aivax.net/v1/mcp/collections
```

## Headers

| Cabeçalho | Descrição | Padrão |
| --- | --- | --- |
| `Authorization` | Token Bearer da sua chave de API. | Required |
| `X-Mcp-Collection-Id` | Um ou mais IDs de coleção. Use vírgulas para múltiplas coleções. | Required |
| `X-Mcp-Collection-Name` | Nome da coleção usado para gerar nomes de ferramentas. | `collection` |
| `X-Mcp-Reranker` | Seleciona o ranqueador usado para ordenar os resultados da pesquisa. Use um `@provider/name` canônico, `lexical`, `rrf`, `smart` ou `none`. | `@aivax/reflex-v1` |
| `X-Mcp-Top-K` | Número máximo de resultados a retornar. | `5` |
| `X-Mcp-Min-Score` | Pontuação mínima de relevância maior que 0 e até 1,0. | `0.4` |
| `X-Mcp-Use-References` | Defina como `none` para habilitar referências nos resultados da pesquisa; omita o cabeçalho para desativá‑las. | disabled |
| `X-Mcp-Allow-Write` | Use `yes` para expor ferramentas de escrita e exclusão de documentos. | disabled |
| `X-Mcp-Naming-Convention` | Controla como as ferramentas geradas são nomeadas. Use `default` ou `agent`. | `default` |

## Configuration example

Visual Studio Code:

```json
{
  "servers": {
    "my-rag-collection-mcp": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/collections",
      "headers": {
        "Authorization": "Bearer <AIVAX_API_KEY>",
        "X-Mcp-Collection-Id": "<COLLECTION_ID>",
        "X-Mcp-Collection-Name": "my_collection",
        "X-Mcp-Top-K": "5",
        "X-Mcp-Min-Score": "0.4",
        // Habilita referências nos resultados da pesquisa.
        "X-Mcp-Use-References": "none"
      }
    }
  }
}
```

## Generated tools

Com a convenção de nomeação padrão, a ferramenta de leitura é nomeada:

```text
{collection_name}_search
```

Ela aceita:

- `search_terms` (`string[]`): um ou mais termos de pesquisa.
- `filter` (`string`, opcional): um [filtro de documento](https://docs.aivax.net/pt-br/docs/rag/document-filters.md) aplicado antes da pesquisa semântica, como `tags has "faq" and updatedAt >= now-30d`.

A ferramenta de leitura MCP aceita no máximo 10 termos de pesquisa e 500 caracteres totais por chamada.

Quando `X-Mcp-Allow-Write` está desativado, apenas a ferramenta de pesquisa é exposta. Este é o modo recomendado para assistentes que só precisam ler uma base de conhecimento.

Quando `X-Mcp-Allow-Write: yes` é enviado, o servidor também expõe ferramentas de criação/atualização e exclusão de documentos. Habilite isso apenas para clientes confiáveis, pois um modelo com acesso de escrita pode alterar o conteúdo da coleção.

Use Collections MCP quando um modelo externo ou cliente MCP deve decidir quando pesquisar. Para um cliente de chat típico da AIVAX, costuma ser mais simples anexar a coleção diretamente a um [gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) e deixar o pipeline RAG do gateway recuperar documentos automaticamente.
