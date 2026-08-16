# Reflex

Reflex é a busca rápida e sem coleção da AIVAX para RAG. Envie uma consulta junto com strings de documentos candidatos e receba os itens mais relevantes em ordem classificada — sem indexação, armazenamento ou manutenção de uma coleção RAG primeiro.

`@aivax/reflex-v1` também é o reranker padrão da AIVAX. Ele combina relevância semântica de baixa latência com evidência lexical limitada e armazena em cache o processamento de consultas e documentos dentro de cada conta.

Use o Reflex quando sua aplicação já possui os documentos candidatos, o conjunto de candidatos muda com frequência ou você deseja uma etapa de recuperação simples sem indexação e armazenamento de coleção. Reutilizar consultas ou documentos exatos pode reduzir o custo de processamento através do cache escopo de conta. Como cada solicitação envia seu conjunto de candidatos, compare o uso de tokens para entradas grandes ou raramente repetidas ao invés de assumir que o Reflex é sempre mais barato.

Use a [Busca Semântica](semantic-search.md) quando a AIVAX deve armazenar, indexar e pesquisar um base de conhecimento persistente ou restringir uma coleção que é grande demais para ser enviada a cada solicitação. Veja [Rerankers](reranking.md) para o catálogo completo de modelos e alternativas.

## Reflex ou Busca Semântica?

| Quando escolher Reflex... | Quando escolher Busca Semântica... |
| --- | --- |
| Sua aplicação já possui as strings dos documentos candidatos. | Os documentos devem viver em coleções gerenciadas da AIVAX. |
| Você precisa de recuperação imediatamente, sem etapa de indexação. | A base de conhecimento é persistente e pesquisada repetidamente. |
| O conjunto de candidatos é dinâmico ou específico da solicitação. | O corpus é grande demais para ser enviado como candidatos a cada solicitação. |
| Você quer RAG sem coleção com precificação baseada em tokens de entrada e reutilização automática de cache. | Você quer filtragem de coleção, metadados armazenados, referências de documentos e recuperação vetorial gerenciada. |

Reflex devolve candidatos de texto classificados; ele não gera uma resposta. Passe os documentos selecionados para seu modelo de linguagem ou AI Gateway como contexto RAG.

## Chamar Reflex

Envie solicitações para `POST /api/v1/generations/rerank`. Omitir `model` para usar o Reflex por padrão, ou enviar `"model": "@aivax/reflex-v1"` explicitamente.

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `model` | `string` | Não | `@aivax/reflex-v1`. |
| `query` | `string` | Sim | Texto não vazio usado para classificar os documentos. |
| `documents` | `string[]` | Sim | De um a 10 000 strings de documentos. |
| `top_n` | `number` | Não | Número máximo de resultados. O padrão é cinco ou a contagem de documentos quando menos de cinco são fornecidos; o Reflex retorna no máximo 200. |
| `min_score` | `number` | Não | Pontuação mínima de relevância final de `0` a `1`. O padrão é `0`. |

O catálogo declara um contexto de 1 948 tokens e um máximo de 10 000 documentos para o Reflex. A resposta identifica `@aivax/reflex-v1`, devolve resultados em ordem decrescente de relevância e preserva o `index` original baseado em zero de cada documento. Strings de documentos duplicadas não são removidas do contrato de resposta; cada ocorrência mantém seu próprio índice de entrada.

Exemplo de solicitação usando o modelo padrão:

```json
{
  "query": "Qual é o período de cancelamento?",
  "documents": [
    "Planos anuais podem ser cancelados dentro de 30 dias.",
    "Faturas são emitidas no início de cada mês."
  ],
  "top_n": 2,
  "min_score": 0.2
}
```

Veja [Rerankers](reranking.md#read-the-response) para a estrutura de resposta comum e campos `usage`.

<script src="https://inference.aivax.net/apidocs?embed-target=Rerank%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Entender cache e uso

Reflex armazena em cache o processamento de consultas e documentos automaticamente dentro da sua conta. Reutilizar uma consulta ou string de documento exata pode gerar um acerto de cache em uma solicitação posterior. Alterar o texto cria uma entrada de cache diferente; mudar apenas a posição de um documento não altera sua chave de cache.

A disponibilidade do cache não é permanente. Use o objeto `usage` da resposta para inspecionar a solicitação atual:

| Campo | Significado |
| --- | --- |
| `input_tokens` | Tokens de consulta e documento processados como falhas de cache. |
| `cached_input_tokens` | Tokens de consulta e documento servidos a partir do cache. |
| `total_tokens` | Todos os tokens de entrada de consulta e documento; sempre `input_tokens + cached_input_tokens`. |
| `cost` | Cobrança final da conta registrada para a solicitação. |

A resposta pública não separa tokens de consulta de tokens de documento. Os contadores descrevem a entrada completa processada pelo Reflex.

## Faturamento, limites e coleta de dados

Falhas de cache e acertos de cache têm preços base diferentes. O `usage.cost` público é o valor final registrado para a conta após os ajustes aplicáveis. Consulte [Pricing](../pricing.md#pricing-list) para os preços atuais de tokens.

Cada solicitação ao Reflex consome a cota de solicitações de reranking da conta e a cota de tokens do Reflex. A cota de tokens conta `total_tokens`, incluindo entrada em cache. Exceder a cota retorna `429 Too Many Requests`; veja [Plans and Limits](../limits.md).

Quando a configuração opcional de coleta de dados semânticos está habilitada, buscas diretas elegíveis no Reflex recebem o desconto documentado e podem contribuir com a consulta, documentos enviados e resultados de classificação. Consulte [Data Collecting](../data-collecting.md) antes de habilitar.

## Usar Reflex com RAG

Reflex também é o reranker padrão após a AIVAX recuperar candidatos de coleções RAG. O alias de compatibilidade `smart` seleciona o mesmo modelo. Nesse fluxo, o Reflex pode melhorar a ordem dos candidatos recuperados, mas não pode recuperar um documento que a etapa de recuperação não selecionou. Se documentos relevantes estiverem consistentemente ausentes, ajuste a recuperação, fragmentação, formulação da consulta ou contagem de candidatos antes de afinar o reranking.