# Busca Semântica

A API de busca semântica pesquisa uma ou mais coleções e retorna os documentos indexados mais relevantes para os termos de pesquisa fornecidos.

Se sua aplicação já possui as strings dos documentos candidatos, use a API autônoma [Rerankers](reranking.md) em vez de criar e manter uma coleção RAG.

A busca é realizada em etapas:

1. Cada termo de consulta é incorporado no modo de consulta.  
2. Os documentos são incorporados no modo de recuperação durante a indexação.  
3. A busca pré‑filtra candidatos com hashes de incorporação compactos.  
4. Os documentos candidatos são pontuados com similaridade de incorporação.  
5. Candidatos abaixo de `minScore` são removidos após o cálculo da similaridade de incorporação.  
6. O reranker configurado pode ajustar a ordem restante antes de aplicar o limite final `top`.

Depois de criar uma coleção, use seu ID de coleção no array `collections` ao pesquisar.

> [!WARNING]
> A busca semântica gera custo. O custo de incorporação da consulta é baseado nos tokens do termo de pesquisa. Rerankers de provedores podem adicionar custo baseado em tokens ou unidades de pesquisa para os candidatos que processam.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Parâmetros da Solicitação

| Parâmetro | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `collections` | `string[]` | Obrigatório | IDs das coleções a pesquisar. Cada coleção deve pertencer à conta autenticada. |
| `term` | `string` | Obrigatório se `terms` estiver ausente | Um termo de pesquisa. |
| `terms` | `string[]` | Obrigatório se `term` estiver ausente | Um ou mais termos de pesquisa. |
| `top` | `number` | `5` | Número máximo de documentos retornados. A validação atual permite de 1 a 128. |
| `minScore` | `number` | `0.2` | Pontuação mínima de similaridade de incorporação antes do reranking. A validação atual permite valores de 0.01 a 0.99. |
| `reranker` | `string` | `@aivax/reflex-v1` | Um `@provider/name` canônico, `lexical`, `rrf` ou `none`. O alias de compatibilidade `smart` também seleciona Reflex. |
| `includeReferences` | `boolean` | `false` | Inclui documentos relacionados com o mesmo ID de referência quando um documento correspondido tem uma referência. |

A resposta inclui o ID do documento correspondido, ID da coleção, nome do documento, conteúdo do documento, metadados, pontuação e documentos referenciados quando a expansão de referência está habilitada.

## Reranking

AIVAX aplica o reranker selecionado após os candidatos vetoriais serem encontrados. O padrão é `@aivax/reflex-v1`; o alias legado `smart` resolve para o mesmo modelo. Envie `"reranker": "none"` para preservar a ordem de similaridade vetorial, `lexical` para reranking local sensível a palavras, ou `rrf` para combinar posições de ranking vetorial e lexical.

Modelos de provedores usam identificadores determinísticos `@provider/name`. Consulte o catálogo ao vivo `/api/v1/information/rerankers-models.json` para os modelos disponíveis, preços, capacidade de uso autônomo e limites técnicos. Veja [Rerankers](reranking.md) para a lista atual de modelos e orientações de seleção.

Todos os rerankers diferentes de `none` compartilham o [limite de reranking-search](/docs/pt-br/limits#rag-and-collection-limits) da conta.

> [!NOTE]
> Reranking não busca documentos adicionais. Ele apenas reordena candidatos já encontrados na etapa de busca vetorial.

## Termos Múltiplos

Múltiplos termos funcionam como uma união classificada pela melhor correspondência, não como uma interseção obrigatória.

Cada documento é comparado com todos os termos fornecidos. A pontuação do documento usa a melhor correspondência entre esses termos. Um documento pode ter boa classificação ao corresponder fortemente a um termo, mesmo que não corresponda aos outros termos.

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

Use múltiplos termos quando quiser cobrir sinônimos, frases alternativas ou vários caminhos de recuperação aceitáveis.

## Qualidade da Busca

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
- Valores maiores de `top` são úteis quando a resposta deve comparar várias políticas, procedimentos ou trechos de origem.  
- Valores menores de `top` são melhores para respostas diretas no estilo FAQ.

Se a busca retornar resultados ruins:

1. Confirme que os documentos estão indexados.  
2. Consulte a coleção diretamente antes de testar através de um AI Gateway.  
3. Compare consultas curtas, perguntas completas e frases alternativas.  
4. Verifique se o documento relevante é muito curto, muito longo ou não está auto‑contido.  
5. Verifique se o idioma da consulta corresponde ao idioma do documento.  
6. Se o gateway reescrever perguntas antes da busca, teste com o caminho de consulta simples para isolar problemas de reescrita.

## MCP

Você pode expor coleções RAG como ferramentas MCP (Model Context Protocol). Isso permite que clientes MCP compatíveis pesquisem uma coleção diretamente.

Endpoint:

```text
https://inference.aivax.net/v1/mcp/collections
```

Headers:

| Cabeçalho | Descrição | Padrão |
| --- | --- | --- |
| `Authorization` | Token Bearer da sua chave de API. | Obrigatório |
| `X-Mcp-Collection-Id` | Um ou mais IDs de coleção. Use vírgulas para múltiplas coleções. | Obrigatório |
| `X-Mcp-Collection-Name` | Nome da coleção usado para gerar nomes de ferramentas. | `collection` |
| `X-Mcp-Reranker` | Um `@provider/name` canônico, `lexical`, `rrf`, `smart` ou `none`. | `@aivax/reflex-v1` |
| `X-Mcp-Top-K` | Número máximo de resultados a retornar. | `5` |
| `X-Mcp-Min-Score` | Pontuação mínima de relevância maior que 0 e até 1.0. | `0.4` |
| `X-Mcp-Use-References` | O comportamento atual do servidor habilita referências quando este cabeçalho tem valor `none`; omita o cabeçalho para desativar referências. | disabled |
| `X-Mcp-Allow-Write` | Use `yes` para expor ferramentas de escrita e exclusão de documentos. | disabled |
| `X-Mcp-Naming-Convention` | `default` ou `agent`. | `default` |

### Exemplo de Configuração

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

### Ferramentas Geradas

Com a convenção de nomes padrão, a ferramenta de leitura é nomeada:

```text
{collection_name}_search
```

Ela aceita:

- `search_terms` (`string[]`): um ou mais termos de pesquisa.

A ferramenta de leitura MCP impõe dois limites de modelagem de solicitações:

- No máximo 10 termos de pesquisa por chamada.  
- No máximo 500 caracteres totais em todos os termos de pesquisa.

Quando `X-Mcp-Allow-Write` está desativado, apenas a ferramenta de busca é exposta. Este é o modo recomendado para assistentes que só precisam ler uma base de conhecimento.

Quando `X-Mcp-Allow-Write: yes` é enviado, o servidor também expõe ferramentas de criação/atualização e exclusão de documentos. Habilite isso apenas para clientes confiáveis, pois um modelo com acesso de escrita pode alterar o conteúdo da coleção.

Use MCP de coleção quando um modelo externo ou cliente MCP deve decidir quando buscar. Para um cliente típico de chat AIVAX, costuma ser mais simples anexar a coleção diretamente ao AI Gateway e deixar que o pipeline RAG do gateway recupere documentos automaticamente.