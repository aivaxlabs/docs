# Busca Semântica

A API de busca semântica pesquisa uma ou mais coleções e retorna os documentos indexados mais relevantes para os termos de pesquisa fornecidos.

Se sua aplicação já possui as strings dos documentos candidatos, considere [Reflex](reflex.md): uma busca RAG rápida, sem coleção, que classifica documentos fornecidos sem indexação ou armazenamento. Reflex é especialmente útil para conjuntos de candidatos dinâmicos ou específicos de requisição e pode reutilizar consultas em cache e processamento de documentos. Use a busca semântica gerenciada quando a AIVAX deve armazenar e pesquisar um corpus persistente ou quando o corpus é grande demais para ser enviado a cada requisição.

A busca é realizada em etapas:

1. Cada termo de consulta é incorporado no modo de consulta.  
2. Os documentos são incorporados no modo de recuperação durante a indexação.  
3. A busca pré-filtro os candidatos com hashes de incorporação compactos.  
4. Os documentos candidatos são pontuados com similaridade de incorporação.  
5. Candidatos abaixo de `minScore` são removidos após o cálculo da similaridade de incorporação.  
6. O reranker configurado pode ajustar a ordem restante antes que o limite final `top` seja aplicado.

Após criar uma coleção, use seu ID de coleção no array `collections` ao pesquisar.

> [!WARNING]
> Busca semântica tem custo. O custo de incorporação da consulta é baseado nos tokens do termo de pesquisa. Rerankers de provedores podem adicionar custo por token ou por unidade de pesquisa para os candidatos que processam.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Parâmetros da Solicitação

| Parâmetro | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `collections` | `string[]` | Required | IDs das coleções a pesquisar. Cada coleção deve pertencer à conta autenticada. |
| `term` | `string` | Required if `terms` is absent | Um termo de pesquisa. |
| `terms` | `string[]` | Required if `term` is absent | Um ou mais termos de pesquisa. |
| `top` | `number` | `5` | Número máximo de documentos retornados. A validação atual permite de 1 a 128. |
| `minScore` | `number` | `0.2` | Pontuação mínima de similaridade de incorporação antes do reranking. A validação atual permite valores de 0,01 a 0,99. |
| `reranker` | `string` | `@aivax/reflex-v1` | Um `@provider/name` canonical, `lexical`, `rrf` ou `none`. O alias de compatibilidade `smart` também seleciona Reflex. |
| `includeReferences` | `boolean` | `false` | Inclui documentos relacionados com o mesmo ID de referência quando um documento correspondido tem uma referência. |

A resposta inclui o ID do documento correspondido, ID da coleção, nome do documento, conteúdo do documento, metadados, pontuação e documentos referenciados quando a expansão de referência está habilitada.

## Reclassificação

AIVAX aplica o reranker selecionado após os candidatos vetoriais serem encontrados. O padrão é `@aivax/reflex-v1`; o alias legado `smart` resolve para o mesmo modelo. Envie `"reranker": "none"` para preservar a ordem de similaridade vetorial, `lexical` para reranking local sensível a palavras, ou `rrf` para combinar posições de rankeamento vetorial e lexical.

Modelos de provedores usam identificadores determinísticos `@provider/name`. Consulte o catálogo ao vivo `/api/v1/information/rerankers-models.json` para os modelos disponíveis, preços, capacidade de uso autônomo e limites técnicos. Veja [Rerankers](reranking.md) para a lista atual de modelos e orientações de seleção.

Todos os rerankers diferentes de `none` compartilham o [limite de reranking-search](/docs/pt-br/limits#rag-and-collection-limits) da conta.

> [!NOTE]
> Reranking não pesquisa documentos adicionais. Ele apenas reordena os candidatos já encontrados na etapa de busca vetorial.

## Múltiplos Termos

Múltiplos termos funcionam como uma união classificada pelo melhor ajuste, não como uma interseção obrigatória.

Cada documento é comparado com todos os termos fornecidos. A pontuação do documento usa o melhor ajuste entre esses termos. Um documento pode ter boa classificação ao corresponder fortemente a um termo, mesmo que não corresponda aos outros termos.

Exemplo:

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

Se a intenção do usuário é uma ideia composta, envie essa ideia como um único termo:

```text
cancelamento de assinatura anual sem multa
```

Use múltiplos termos quando quiser cobrir sinônimos, formulações alternativas ou vários caminhos de recuperação aceitáveis.

## Qualidade da Busca

Uma consulta completa geralmente tem desempenho melhor do que uma lista de palavras‑chave desconectadas, pois preserva a relação entre os conceitos.

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
- Valores maiores de `top` são úteis quando a resposta deve comparar várias políticas, procedimentos ou trechos de fontes.  
- Valores menores de `top` são melhores para respostas diretas no estilo FAQ.

Se a busca retornar resultados pobres:

1. Confirme que os documentos estão indexados.  
2. Consulte a coleção diretamente antes de testar através de um AI Gateway.  
3. Compare consultas curtas, perguntas completas e formulações alternativas.  
4. Verifique se o documento relevante é muito curto, muito longo ou não é autocontido.  
5. Verifique se o idioma da consulta corresponde ao idioma do documento.  
6. Se o gateway reescrever perguntas antes da busca, teste com o caminho de consulta simples para isolar problemas de reescrita.

## Coleções MCP

Para expor coleções AIVAX como ferramentas para um cliente MCP externo, veja [Collections MCP](/docs/pt-br/mcp-utilities/collections-mcp).