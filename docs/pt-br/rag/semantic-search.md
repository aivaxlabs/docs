# Busca Semântica

A API de busca semântica procura em uma ou mais coleções e retorna os documentos indexados mais relevantes para os termos de busca fornecidos.

Se sua aplicação já possui as strings dos documentos candidatos, considere [Reflex](reflex.md): uma busca RAG rápida, sem necessidade de coleção, que classifica os documentos fornecidos sem indexação ou armazenamento. O Reflex é especialmente útil para conjuntos de candidatos dinâmicos ou específicos de requisição e pode reutilizar consultas e processamento de documentos em cache. Use a busca semântica gerenciada quando a AIVAX deve armazenar e buscar um corpus persistente ou quando o corpus é grande demais para ser enviado a cada requisição.

A busca é realizada em etapas:

1. Cada termo de consulta é incorporado no modo de consulta.
2. Documentos são incorporados no modo de recuperação durante a indexação.
3. A busca pré‑filtra candidatos com hashes de incorporação compactos.
4. Documentos candidatos são pontuados com similaridade de incorporação.
5. Candidatos abaixo de `minScore` são removidos após o cálculo da similaridade de incorporação.
6. O reranker configurado pode ajustar a ordem restante antes de aplicar o limite final `top`.

Após criar uma coleção, use seu ID de coleção no array `collections` ao buscar.

> [!WARNING]
> A busca semântica tem custo. O custo da incorporação da consulta baseia‑se nos tokens do termo de busca. Rerankers de provedores podem adicionar custo por token ou por unidade de busca para os candidatos que processam.

<script src="https://inference.aivax.net/apidocs?embed-target=Semantic%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Parâmetros da Solicitação

| Parâmetro | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `collections` | `string[]` | Required | IDs das coleções a serem pesquisadas. Cada coleção deve pertencer à conta autenticada. |
| `term` | `string` | Required if `terms` is absent | Um termo de busca. |
| `terms` | `string[]` | Required if `term` is absent | Um ou mais termos de busca. |
| `top` | `number` | `5` | Número máximo de documentos retornados. A validação atual permite de 1 a 128. |
| `minScore` | `number` | `0.2` | Pontuação mínima de similaridade de incorporação antes do reranking. A validação atual permite valores de 0.01 a 0.99. |
| `reranker` | `string` | `@aivax/reflex-v1` | Um `@provider/name` can, `lexical`, `rrf` ou `none`. O alias de compatibilidade `smart` também seleciona o Reflex. |
| `includeReferences` | `boolean` | `false` | Inclui documentos relacionados com o mesmo ID de referência quando um documento correspondido tem uma referência. |

A resposta inclui o ID do documento correspondido, ID da coleção, nome do documento, conteúdo do documento, metadados, pontuação e documentos referenciados quando a expansão de referência está habilitada.

## Reranking

A AIVAX aplica o reranker selecionado após os candidatos vetoriais serem encontrados. O padrão é `@aivax/reflex-v1`; o alias legado `smart` resolve para o mesmo modelo. Envie `"reranker": "none"` para preservar a ordem de similaridade vetorial, `lexical` para reranking local sensível a palavras ou `rrf` para fundir posições de classificação vetorial e lexical.

Modelos de provedores usam identificadores determinísticos `@provider/name`. Consulte o catálogo ao vivo `/api/v1/information/rerankers-models.json` para os modelos disponíveis, preços, capacidade de uso autônomo e limites técnicos. Veja [Rerankers](reranking.md) para a lista atual de modelos e orientações de seleção.

Todos os rerankers diferentes de `none` compartilham o [limite de reranking-search](/docs/pt-br/limits#plan-limits) da conta.

> [!NOTE]
> O reranking não busca documentos adicionais. Ele apenas reordena candidatos já encontrados na etapa de busca vetorial.

## Termos Múltiplos

Termos múltiplos funcionam como uma união classificada pelo melhor ajuste, não como uma interseção obrigatória.

Cada documento é comparado com todos os termos fornecidos. A pontuação do documento usa o melhor ajuste entre esses termos. Um documento pode obter boa classificação ao corresponder fortemente a um termo, mesmo que não corresponda aos outros termos.

Exemplo:

Procurando por:

```text
cancelamento
multa
reembolso
```

nas coleções `suporte` e `contratos` significa:

```text
melhores documentos de suporte ou contrato que correspondam a cancelamento ou multa ou reembolso
```

Não significa:

```text
documentos que correspondam a cancelamento e multa e reembolso ao mesmo tempo
```

Nem significa:

```text
documentos que existam tanto em suporte quanto em contratos
```

Se a intenção do usuário for uma ideia composta, envie essa ideia como um único termo:

```text
cancelamento de assinatura anual sem multa
```

Use termos múltiplos quando quiser cobrir sinônimos, formulações alternativas ou vários caminhos de recuperação aceitáveis.

## Qualidade da Busca

Uma consulta completa geralmente tem desempenho melhor que uma lista de palavras‑chave desconexas porque preserva a relação entre os conceitos.

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
- Valores maiores de `top` são úteis quando a resposta precisa comparar várias políticas, procedimentos ou trechos de origem.
- Valores menores de `top` são melhores para respostas diretas no estilo FAQ.

Se a busca retornar resultados insatisfatórios:

1. Confirme que os documentos estão indexados.
2. Consulte a coleção diretamente antes de testar através de um AI Gateway.
3. Compare consultas curtas, perguntas completas e formulações alternativas.
4. Verifique se o documento relevante é muito curto, muito longo ou não está auto‑contido.
5. Verifique se o idioma da consulta corresponde ao idioma do documento.
6. Se o gateway reescrever perguntas antes da busca, teste com o caminho de consulta simples para isolar problemas de reescrita.

## MCP de Coleções

Para expor coleções da AIVAX como ferramentas para um cliente MCP externo, veja [Collections MCP](/docs/pt-br/mcp-utilities/collections-mcp).