# Reflex

Reflex é uma API de busca de latência baixa para classificar strings de documentos fornecidas diretamente em uma requisição. Ela combina relevância semântica com um impulso lexical limitado, ajudando termos exatos, grafias próximas, cobertura da consulta e proximidade de termos sem permitir que evidências lexicais substituam a pontuação semântica.

Ao contrário do RAG baseado em coleções, o Reflex não exige que você crie, preencha e gerencie uma coleção permanente antes de pesquisar. Envie a consulta e as strings de documentos atuais; o Reflex as processa imediatamente e reutiliza automaticamente embeddings de documentos em cache quando disponíveis.

Use o Reflex para conjuntos de documentos dinâmicos ou de propriedade da aplicação que precisam ser pesquisáveis imediatamente. Use [Semantic Search](semantic-search.md) quando os documentos devem viver em coleções RAG gerenciadas, serem compartilhados por múltiplas integrações ou serem anexados a um AI Gateway.

## Request

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `query` | `string` | Yes | Texto não vazio usado para classificar os documentos. |
| `documents` | `string[]` | Yes | De um a 1.000 strings de documentos para buscar. Strings duplicadas exatas são removidas antes do processamento. |
| `top_n` | `number` | No | Número máximo de resultados a retornar. O padrão é `5`, ou todos os documentos distintos quando menos de cinco são fornecidos. O máximo é `200` ou o número de documentos distintos, o que for menor. |
| `min_score` | `number` | No | Pontuação mínima de similaridade semântica de `0` a `1`, aplicada antes do impulso lexical. O padrão é `0`. |

A resposta identifica a requisição e o modelo Reflex, então devolve os resultados classificados e o uso de tokens de documento. Cada resultado contém o texto do documento, um `relevance_score` de `0` a `1`, e seu `index` baseado em zero. Como duplicatas exatas são removidas primeiro, `index` refere‑se à sequência de documentos desduplicada.

<script src="https://inference.aivax.net/apidocs?embed-target=Reflex%20search&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Cache behavior

### Comportamento de cache

O Reflex armazena em cache o processamento de documentos automaticamente dentro da sua conta. Uma string de documento exata pode ser reutilizada em requisições e em diferentes conjuntos de documentos. Alterar o texto cria uma entrada de cache diferente, enquanto mudar apenas sua posição na requisição não o faz.

A disponibilidade do cache não é permanente. Use o objeto `usage` da resposta para ver como a requisição atual foi cobrada:

| Campo | Significado |
| --- | --- |
| `input_tokens` | Tokens de documento processados como falhas de cache. |
| `cached_input_tokens` | Tokens de documento servidos a partir do cache. |
| `total_tokens` | Total de tokens nos documentos distintos da requisição. |

A consulta não está incluída nesses contadores de tokens de documento.

## Pricing

### Preços

Veja [Preços](../pricing.md#reflex) para os preços atuais de tokens de entrada do Reflex e detalhes de faturamento.