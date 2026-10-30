Source: https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.html

# Coleções e RAG MCP

O MCP de Coleções expõe uma ou mais coleções AIVAX RAG como ferramentas para clientes MCP compatíveis. Utilize-o quando um modelo externo, agente, IDE ou assistente de desktop precisar decidir quando pesquisar em uma base de conhecimento AIVAX.

Para um cliente de chat AIVAX típico, geralmente é mais simples anexar a coleção diretamente a um [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) e permitir que o pipeline RAG do gateway recupere documentos automaticamente.

Para informações sobre como criar coleções, preparar documentos e melhorar a qualidade da recuperação, consulte [Coleções](https://docs.aivax.net/pt-br/docs/rag/collections.md), [Documentos](https://docs.aivax.net/pt-br/docs/rag/documents.md) e [Pesquisa Semântica](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md).

## Endpoint

```text
https://inference.aivax.net/v1/mcp/collections
```

## Cabeçalhos

| Cabeçalho | Descrição | Padrão |
| --- | --- | --- |
| `Authorization` | Token Bearer da sua chave de API. | Obrigatório |
| `X-Mcp-Collection-Id` | Um ou mais IDs de coleção. Use vírgulas para múltiplas coleções. | Obrigatório |
| `X-Mcp-Collection-Name` | Nome da coleção usado para gerar os nomes das ferramentas. | `collection` |
| `X-Mcp-Reranker` | Seleciona o classificador usado para ordenar os resultados da pesquisa. Use um `@provider/name`, `lexical`, `rrf`, `smart` ou `none` canônicos. | `@aivax/reflex-v1` |
| `X-Mcp-Top-K` | Número máximo de resultados a retornar. | `5` |
| `X-Mcp-Min-Score` | Pontuação mínima de relevância maior que 0 e até 1,0. | `0.4` |
| `X-Mcp-Use-References` | Defina como `none` para habilitar referências nos resultados da pesquisa; omita o cabeçalho para desabilitá-las. | desativado |
| `X-Mcp-Allow-Write` | Use `yes` para expor ferramentas de gravação e exclusão de documentos. | desativado |
| `X-Mcp-Naming-Convention` | Controla como as ferramentas geradas são nomeadas. Use `default` ou `agent`. | `default` |
| `X-Mcp-Enabled-Tools` | Lista de permissão separada por vírgulas dos tipos de ferramentas a expor: `search`, `browse`, `get`, `write`, `delete`. Consulte [Selecionar quais ferramentas são expostas](#selecionar-quais-ferramentas-são-expostas). | todas as ferramentas disponíveis |

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
        // Habilita referências nos resultados da pesquisa.
        "X-Mcp-Use-References": "none"
      }
    }
  }
}
```

## Ferramentas geradas

O servidor gera até cinco ferramentas por configuração: pesquisa, navegação, obter documento e, quando as gravações são permitidas, escrever e excluir. Os nomes das ferramentas são construídos a partir de `X-Mcp-Collection-Name` e da convenção de nomenclatura.

### Ferramenta de Pesquisa

Com a convenção de nomenclatura padrão, a ferramenta de leitura é nomeada:

```text
{collection_name}_search
```

Ela aceita:

- `search_terms` (`string[]`): um ou mais termos de pesquisa.
- `filter` (`string`, opcional): um [filtro de documento](https://docs.aivax.net/pt-br/docs/rag/document-filters.md) aplicado antes da pesquisa semântica, como `tags has "faq" and updatedAt >= now-30d`.

A ferramenta de leitura MCP aceita no máximo 10 termos de pesquisa e 500 caracteres totais por chamada.

### Ferramenta de Navegação

A ferramenta de navegação lista documentos indexados em uma ordem fixa, sem pesquisa semântica. Use-a quando o modelo precisar ver o que uma coleção contém, percorrer página por página todos os documentos ou ler um documento pelo seu nome exato. Com a convenção de nomenclatura padrão, ela é nomeada:

```text
{collection_name}_browse_documents
```

Com a convenção de nomenclatura `agent`, ela é nomeada `{collection_name}_list`. Ela aceita:

- `filter` (`string`, opcional): um [filtro de documento](https://docs.aivax.net/pt-br/docs/rag/document-filters.md), como `name = "setup.md"`, `reference = "manual-v2"` ou `tags has "faq"`.
- `sort` (`string`, opcional): `createdAt`, `updatedAt`, `indexedAt` ou `name`. O padrão é `createdAt`.
- `descending` (`boolean`, opcional): lista os mais recentes primeiro, ou de Z a A ao classificar por nome. O padrão é `false`.
- `include_content` (`boolean`, opcional): adiciona o conteúdo e os metadados de cada documento. O padrão é `false`, então a ferramenta retorna apenas nomes, tags, referências e datas. Para ler um único documento, prefira a ferramenta de obter documento.
- `limit` (`number`, opcional): documentos por página, de 1 a 50. O padrão é 20.
- `cursor` (`string`, opcional): o `next_cursor` retornado pela chamada anterior. Envie-o com os mesmos valores de `filter`, `sort` e `descending` para ler a próxima página. Os cursores não expiram.

A ferramenta de navegação não incorpora nem reclassifica nada, portanto, não tem custo de pesquisa, mas cada chamada conta para o limite de taxa de pesquisa do seu plano. Os documentos aparecem nela apenas após serem indexados.

### Ferramenta de Obter Documento

A ferramenta de obter documento lê um único documento pelo seu nome exato, como um nome retornado pela ferramenta de navegação. Com a convenção de nomenclatura padrão, ela é nomeada:

```text
{collection_name}_get_document
```

Com a convenção de nomenclatura `agent`, ela é nomeada `{collection_name}_get`. Ela aceita:

- `name` (`string`): o nome exato do documento.
- `start_line` e `end_line` (`number`, opcionais): um intervalo de linhas baseado em 1 e inclusivo. Sem eles, o documento inteiro é retornado.

Ela retorna o nome, tags, referência, metadados, datas, se o documento já está indexado e o intervalo de linhas selecionado, seguido pelo conteúdo.

- Uma única chamada retorna no máximo 100.000 caracteres. Leia documentos mais longos em partes usando `start_line` e `end_line`.
- Documentos que ainda estão aguardando indexação também podem ser lidos.
- Quando várias coleções estão configuradas, a primeira coleção em `X-Mcp-Collection-Id` que possui um documento com esse nome é usada.
- Como a ferramenta de navegação, ela não tem custo de pesquisa e conta para o limite de taxa de pesquisa.

### Ferramentas de Gravação e Exclusão

Quando `X-Mcp-Allow-Write` está desativado, apenas as ferramentas de pesquisa, navegação e obter documento são expostas. Este é o modo recomendado para assistentes que precisam apenas ler uma base de conhecimento.

Quando `X-Mcp-Allow-Write: yes` é enviado, o servidor também expõe ferramentas de criação/atualização e exclusão de documentos. Habilite isso apenas para clientes confiáveis, pois um modelo com acesso de gravação pode alterar o conteúdo da coleção.

## Selecionar quais ferramentas são expostas

Use o cabeçalho opcional `X-Mcp-Enabled-Tools` para expor apenas algumas das ferramentas geradas. Forneça uma lista de permissão separada por vírgulas dos tipos de ferramentas, não os nomes das ferramentas geradas, para que o mesmo valor funcione com qualquer nome de coleção e convenção de nomenclatura:

- `search`: a ferramenta de leitura.
- `browse`: a ferramenta de navegação.
- `get`: a ferramenta de obter documento.
- `write`: a ferramenta de criação/atualização de documento.
- `delete`: a ferramenta de exclusão de documento.

Por exemplo, para permitir que um cliente adicione documentos e pesquise sem poder excluí-los:

```text
X-Mcp-Allow-Write: yes
X-Mcp-Enabled-Tools: search, write
```

Para permitir que um cliente liste e leia documentos sem pesquisa semântica:

```text
X-Mcp-Enabled-Tools: browse, get
```

Para expor apenas a ferramenta de gravação, para um agente de ingestão que não deve ler a coleção:

```text
X-Mcp-Allow-Write: yes
X-Mcp-Enabled-Tools: write
```

A lista de permissão apenas reduz o conjunto de ferramentas. `write` e `delete` ainda exigem `X-Mcp-Allow-Write: yes`; sem ele, elas não são expostas mesmo quando listadas. Sem `X-Mcp-Enabled-Tools`, o servidor expõe todas as ferramentas permitidas pelos outros cabeçalhos. Os valores não diferenciam maiúsculas de minúsculas, espaços em torno das vírgulas são ignorados e valores desconhecidos são ignorados.
