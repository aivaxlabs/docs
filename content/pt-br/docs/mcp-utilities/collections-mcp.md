---
{title: Coleções e RAG MCP,linkTitle: Coleções e RAG MCP,weight: 10,group: MCP Utilities,aliases: [/docs/pt-br/tools/collections-mcp.html,/docs/pt-br/mcp-utilities/collections-mcp.html],sourceHash: e032fad40ae4e7cc}
---

# Coleções e RAG MCP

O Collections MCP expõe uma ou mais coleções AIVAX RAG como ferramentas para clientes MCP compatíveis. Use-o quando um modelo externo, agente, IDE ou assistente de desktop precisar decidir quando buscar em uma base de conhecimento AIVAX.

Para informações sobre como criar coleções, preparar documentos e melhorar a qualidade da recuperação, veja [Coleções e Documentos](/docs/pt-br/rag/collections) e [Busca Semântica](/docs/pt-br/rag/semantic-search).

## Ponto de Acesso

```text
https://inference.aivax.net/v1/mcp/collections
```

## Cabeçalhos

| Cabeçalho | Descrição | Padrão |
| --- | --- | --- |
| `Authorization` | Token Bearer da sua chave de API. | Obrigatório |
| `X-Mcp-Collection-Id` | Um ou mais IDs de coleção. Use vírgulas para múltiplas coleções. | Obrigatório |
| `X-Mcp-Collection-Name` | Nome da coleção usado para gerar nomes das ferramentas. | `collection` |
| `X-Mcp-Reranker` | Seleciona o ranker usado para ordenar os resultados da busca. Use um `@provider/name` canônico, `lexical`, `rrf`, `smart` ou `none`. | `@aivax/reflex-v1` |
| `X-Mcp-Top-K` | Número máximo de resultados a retornar. | `5` |
| `X-Mcp-Min-Score` | Pontuação mínima de relevância maior que 0 e até 1.0. | `0.4` |
| `X-Mcp-Use-References` | Defina como `none` para habilitar referências nos resultados da busca; omita o cabeçalho para desativá-las. | desativado |
| `X-Mcp-Allow-Write` | Use `yes` para expor ferramentas de escrita e exclusão de documentos. | desativado |
| `X-Mcp-Naming-Convention` | Controla como as ferramentas geradas são nomeadas. Use `default` ou `agent`. | `default` |
| `X-Mcp-Enabled-Tools` | Lista separada por vírgulas de tipos de ferramentas a expor: `search`, `write`, `delete`. Veja [Selecione quais ferramentas são expostas](#select-which-tools-are-exposed). | todas as ferramentas disponíveis |

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
        // Habilita referências nos resultados da busca.
        "X-Mcp-Use-References": "none"
      }
    }
  }
}
```

## Ferramentas geradas

Com a convenção de nomenclatura padrão, a ferramenta de leitura recebe o nome:

```text
{collection_name}_search
```

Ela aceita:

- `search_terms` (`string[]`): um ou mais termos de busca.
- `filter` (`string`, opcional): um [filtro de documento](../rag/document-filters.md) aplicado antes da busca semântica, como `tags has "faq" and updatedAt >= now-30d`.

A ferramenta de leitura do MCP aceita no máximo 10 termos de busca e 500 caracteres no por chamada.

Quando `X-Mcp-Allow-Write` está desativado, somente a ferramenta de busca é exposta. Este é o modo recomendado para assistentes que precisam apenas ler uma base de conhecimento.

Quando `X-Mcp-Allow-Write: yes` é enviado, o servidor também expõe ferramentas de criação/atualização e exclusão de documentos. Habilite isso apenas para clientes confiáveis, pois um modelo com acesso de escrita pode alterar o conteúdo da coleção.

## Selecione quais ferramentas são expostas

Use o cabeçalho opcional `X-Mcp-Enabled-Tools` para expor apenas algumas das ferramentas geradas. Forneça uma lista separada por vírgulas de tipos de ferramentas, não de nomes de ferramentas geradas, para que o mesmo valor funcione com qualquer nome de coleção e convenção de nomenclatura:

- `search`: a ferramenta de leitura.
- `write`: a ferramenta de criação/atualização de documento.
- `delete`: a ferramenta de exclusão de documento.

Por exemplo, para permitir que um cliente adicione documentos e busque sem poder excluí‑los:

```text
X-Mcp-Allow-Write: yes
X-Mcp-Enabled-Tools: search, write
```

Para expor apenas a ferramenta de escrita, para um agente de ingestão que não deve ler a coleção:

```text
X-Mcp-Allow-Write: yes
X-Mcp-Enabled-Tools: write
```

A lista de permissão apenas restringe o conjunto de ferramentas. `write` e `delete` ainda requerem `X-Mcp-Allow-Write: yes`; sem ele, não são expostas mesmo quando listadas. Sem `X-Mcp-Enabled-Tools`, o servidor expõe todas as ferramentas permitidas pelos outros cabeçalhos. Valores são insensíveis a maiúsculas/minúsculas, espaços ao redor das vírgulas são ignorados e valores desconhecidos são ignorados.

Use Collections MCP quando um modelo externo ou cliente MCP precisar decidir quando buscar. Para um cliente de chat típico da AIVAX, costuma ser mais simples anexar a coleção diretamente a um [gateway de IA](/docs/pt-br/inference/ai-gateway) e deixar que o pipeline RAG do gateway recupere documentos automaticamente.
