# Busca Semântica

A API de busca semântica pesquisa uma ou mais coleções e retorna os documentos indexados mais relevantes para os termos de pesquisa fornecidos.

A busca é realizada em etapas:

1. Cada termo de consulta é incorporado no modo de consulta.
2. Os documentos são incorporados no modo de recuperação durante a indexação.
3. A busca pré-filtra candidatos com hashes de incorporação compactos.
4. Os documentos candidatos são pontuados com base na similaridade de incorporação.
5. Candidatos abaixo de `minScore` são removidos após o cálculo da similaridade de incorporação.
6. O reranker configurado pode ajustar a ordem restante antes de aplicar o limite final `top`.

Depois de criar uma coleção, use seu ID de coleção no array `collections` ao pesquisar.

> [!WARNING]
> A busca semântica tem custo. O custo de incorporação da consulta é baseado nos tokens do termo de pesquisa. O reranker `smart` também gera custo de reclassificação baseado nos tokens da consulta e dos documentos candidatos.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Request Parameters

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `collections` | `string[]` | Required | IDs de coleção para pesquisar. Cada coleção deve pertencer à conta autenticada. |
| `term` | `string` | Required if `terms` is absent | Um termo de pesquisa. |
| `terms` | `string[]` | Required if `term` is absent | Um ou mais termos de pesquisa. |
| `top` | `number` | `5` | Número máximo de documentos retornados. A validação atual permite de 1 a 128. |
| `minScore` | `number` | `0.2` | Pontuação mínima de similaridade de incorporação antes da reclassificação. A validação atual permite valores de 0,01 a 0,99. |
| `reranker` | `string` | `rrf` | `rrf`, `lexical`, `smart` ou `none`. |
| `includeReferences` | `boolean` | `false` | Inclui documentos relacionados com o mesmo ID de referência quando um documento correspondido tem uma referência. |

A resposta inclui o ID do documento correspondido, ID da coleção, nome do documento, conteúdo do documento, metadados, pontuação e documentos referenciados quando a expansão de referência está habilitada.

## Reranking

AIVAX pode aplicar reclassificação após os candidatos vetoriais serem encontrados.

Available rerankers:

| Reranker | Cost | Behavior |
| --- | --- | --- |
| `none` | No reranking cost | Uses vector similarity only. |
| `rrf` | No reranking cost | Fuses the embedding and lexical rank positions. This is the default. |
| `lexical` | No reranking cost | Applies a local boost based on lexical matches, fuzzy token matches, and term proximity in the document name and content. |
| `smart` | Reranking cost applies | Uses Cloudflare Workers AI (`@cf/baai/bge-reranker-base`) to rescore candidate documents against the full query. |

O reranker padrão é `rrf`. Para desativar a reclassificação, envie `"reranker": "none"`. Para preservar a pontuação semântica e adicionar um impulso lexical conservador, use `lexical`. Para usar o reranker baseado em modelo, envie `"reranker": "smart"`.

Todos os rerankers diferentes de `none` compartilham o [limite de reclassificação de busca](/docs/pt-br/limits#rag-and-collection-limits) da conta. A mesma cota se aplica ao endpoint independente de [Reranking](reranking.md).

> [!NOTE]
> A reclassificação não pesquisa documentos adicionais. Ela apenas reordena candidatos já encontrados pela etapa de busca vetorial.

## Multiple Terms

Múltiplos termos funcionam como uma união classada pelo melhor correspondência, não como uma interseção obrigatória.

Cada documento é comparado com todos os termos fornecidos. A pontuação do documento usa a melhor correspondência entre esses termos. Um documento pode ter boa classificação ao corresponder fortemente a um termo, mesmo que não corresponda aos outros termos.

Example:

Searching for:

```text
cancelamento
multa
reembolso
```

nas coleções `suporte` e `contratos` significa:

```text
melhores documentos de suporte ou contrato que correspondam a cancelamento ou multa ou reembolso
```

Isso não significa:

```text
documentos que correspondam a cancelamento e multa e reembolso ao mesmo tempo
```

Isso também não significa:

```text
documentos que existem tanto em suporte quanto em contratos
```

Se a intenção do usuário for uma ideia composta, envie essa ideia como um único termo:

```text
cancelamento de assinatura anual sem multa
```

Use múltiplos termos quando quiser cobrir sinônimos, formulações alternativas ou vários caminhos de recuperação aceitáveis.

## Search Quality

Uma consulta completa geralmente tem melhor desempenho do que uma lista de palavras‑chave desconexas, pois preserva a relação entre os conceitos.

Prefira:

```text
como cancelar assinatura anual sem multa
```

Em vez de:

```text
cancelamento
assinatura
multa
```

Ajuste `top` e `minScore` juntos:

- Valores menores de `minScore` retornam mais candidatos e mais ruído.
- Valores maiores de `minScore` reduzem o ruído, mas podem retornar poucos ou nenhum resultado.
- Valores maiores de `top` são úteis quando a resposta deve comparar várias políticas, procedimentos ou trechos de fonte.
- Valores menores de `top` são melhores para respostas diretas no estilo FAQ.

Se a busca retornar resultados ruins:

1. Confirme que os documentos estão indexados.
2. Interrogue a coleção diretamente antes de testar via AI Gateway.
3. Compare consultas curtas, perguntas completas e formulações alternativas.
4. Verifique se o documento relevante é muito curto, muito longo ou não está autocontido.
5. Verifique se o idioma da consulta corresponde ao idioma do documento.
6. Se o gateway reescrever perguntas antes da busca, teste com o caminho de consulta simples para isolar problemas de reescrita.

## MCP

Você pode expor coleções RAG como ferramentas MCP (Model Context Protocol). Isso permite que clientes MCP compatíveis pesquisem uma coleção diretamente.

Endpoint:

```text
https://inference.aivax.net/v1/mcp/collections
```

Headers:

| Header | Description | Default |
| --- | --- | --- |
| `Authorization` | Token Bearer da sua chave de API. | Required |
| `X-Mcp-Collection-Id` | Um ou mais IDs de coleção. Use vírgulas para múltiplas coleções. | Required |
| `X-Mcp-Collection-Name` | Nome da coleção usado para gerar nomes de ferramentas. | `collection` |
| `X-Mcp-Reranker` | `rrf`, `lexical`, `smart` ou `none`. | `rrf` |
| `X-Mcp-Top-K` | Número máximo de resultados a retornar. | `5` |
| `X-Mcp-Min-Score` | Pontuação mínima de relevância maior que 0 e até 1.0. | `0.4` |
| `X-Mcp-Use-References` | O comportamento atual do servidor habilita referências quando o valor deste cabeçalho é `none`; omita o cabeçalho para desativar referências. | disabled |
| `X-Mcp-Allow-Write` | Use `yes` para expor ferramentas de escrita e exclusão de documentos. | disabled |
| `X-Mcp-Naming-Convention` | `default` ou `agent`. | `default` |

### Configuration Example

Visual Studio Code:

```json
{
  "servers": {
    "my-rag-collection-mcp": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/collections",
      "headers": {
        "Authorization": "Bearer {your_api_key}",
        "X-Mcp-Collection-Id": "your-collection-id",
        "X-Mcp-Collection-Name": "my_collection",
        "X-Mcp-Top-K": "5",
        "X-Mcp-Min-Score": "0.4",
        "X-Mcp-Use-References": "none"
      }
    }
  }
}
```

### Generated Tools

Com a convenção de nomenclatura padrão, a ferramenta de leitura é nomeada:

```text
{collection_name}_search
```

Ela aceita:

- `search_terms` (`string[]`): um ou mais termos de pesquisa.

A ferramenta de leitura MCP impõe dois limites de modelagem de solicitação:

- No máximo 10 termos de pesquisa por chamada.
- No máximo 500 caracteres totais em todos os termos de pesquisa.

Quando `X-Mcp-Allow-Write` está desativado, apenas a ferramenta de pesquisa é exposta. Este é o modo recomendado para assistentes que só precisam ler uma base de conhecimento.

Quando `X-Mcp-Allow-Write: yes` é enviado, o servidor também expõe ferramentas de criação/atualização e exclusão de documentos. Habilite isso apenas para clientes confiáveis, pois um modelo com acesso de escrita pode alterar o conteúdo da coleção.

Use o MCP da coleção quando um modelo externo ou cliente MCP deve decidir quando pesquisar. Para um cliente típico de chat AIVAX, costuma ser mais simples anexar a coleção diretamente ao AI Gateway e deixar que o pipeline RAG do gateway recupere os documentos automaticamente.