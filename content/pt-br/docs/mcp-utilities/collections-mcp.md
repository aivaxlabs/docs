---
{title: Coleções MCP,linkTitle: Coleções MCP,weight: 380,group: MCP Utilities,aliases: [/docs/pt-br/tools/collections-mcp.html,/docs/pt-br/mcp-utilities/collections-mcp.html],sourceHash: 7a04089574f69d59}
---

# Coleções MCP

O Collections MCP expõe uma ou mais coleções AIVAX RAG como ferramentas para clientes MCP compatíveis. Use-o quando um modelo externo, agente, IDE ou assistente de desktop deve decidir quando pesquisar em uma base de conhecimento AIVAX.

Para informações sobre como criar coleções, preparar documentos e melhorar a qualidade da recuperação, veja [Collections and Documents](/docs/pt-br/rag/collections) e [Semantic Search](/docs/pt-br/rag/semantic-search).

## Endpoint

```text
https://inference.aivax.net/v1/mcp/collections
```

## Cabeçalhos

| Header | Description | Default |
| --- | --- | --- |
| `Authorization` | Token Bearer da sua chave de API. | Obrigatório |
| `X-Mcp-Collection-Id` | Um ou mais IDs de coleção. Use vírgulas para múltiplas coleções. | Obrigatório |
| `X-Mcp-Collection-Name` | Nome da coleção usado para gerar nomes de ferramentas. | `collection` |
| `X-Mcp-Reranker` | Seleciona o ranker usado para ordenar resultados de busca. Use um `@provider/name` canônico, `lexical`, `rrf`, `smart` ou `none`. | `@aivax/reflex-v1` |
| `X-Mcp-Top-K` | Número máximo de resultados a retornar. | `5` |
| `X-Mcp-Min-Score` | Pontuação mínima de relevância maior que 0 e até 1,0. | `0.4` |
| `X-Mcp-Use-References` | Defina como `none` para habilitar referências nos resultados de busca; omita o cabeçalho para desativá-las. | disabled |
| `X-Mcp-Allow-Write` | Use `yes` para expor ferramentas de escrita e exclusão de documentos. | disabled |
| `X-Mcp-Naming-Convention` | Controla como as ferramentas geradas são nomeadas. Use `default` ou `agent`. | `default` |

## Exemplo de configuração

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
        // Habilita referências nos resultados de busca.
        "X-Mcp-Use-References": "none"
      }
    }
  }
}
```

## Ferramentas geradas

Com a convenção de nomes padrão, a ferramenta de leitura é nomeada:

```text
{collection_name}_search
```

Ela aceita:

- `search_terms` (`string[]`): um ou mais termos de busca.

A ferramenta de leitura MCP impõe dois limites de model de requisição:

- No máximo 10 termos de busca por chamada.
- No máximo 500 caracteres no ao todo em todos os termos de busca.

Quando `X-Mcp-Allow-Write` está desativado, apenas a ferramenta de pesquisa é exposta. Este é o modo recomendado para assistentes que só precisam ler uma base de conhecimento.

Quando `X-Mcp-Allow-Write: yes` é enviado, o servidor também expõe ferramentas de criação/atualização e exclusão de documentos. Habilite isso apenas para clientes confiáveis, pois um modelo com acesso de gravação pode alterar o conteúdo da coleção.

Use Collections MCP quando um modelo externo ou cliente MCP deve decidir quando pesquisar. Para um cliente de chat típico da AIVAX, costuma ser mais simples anexar a coleção diretamente a um [AI Gateway](/docs/pt-br/inference/ai-gateway) e deixar que o pipeline RAG do gateway recupere documentos automaticamente.
