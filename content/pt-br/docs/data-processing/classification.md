---
{title: Classificação de Texto,linkTitle: Classificação de Texto,weight: 30,group: Data processing,aliases: [/docs/pt-br/generations/classification.html,/docs/pt-br/rag/classification.html,/docs/pt-br/data-processing/classification.html],sourceHash: 01c5e2a97676537d}
---

# Classificação de Texto

Use a classificação de texto para ranquear um conjunto fixo de rótulos para um ou mais documentos sem precisar treinar um classificador personalizado. É adequado para tarefas como etiquetagem, triagem ou roteamento de solicitações, nas quais as categorias são conhecidas antecipadamente e você precisa de um ranqueamento por similaridade em vez de uma resposta gerada.

A AIVAX incorpora (embeds) cada documento e rótulo com o modelo de incorporação padrão e compara seus vetores usando similaridade cosseno. Para cada documento, ele retorna todos os rótulos ordenados do mais semelhante ao menos semelhante.

Antes de chamar este endpoint, [crie uma chave de API](../authentication.md) e certifique-se de que a conta tenha um saldo positivo.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/classify</span>
</div>

## Comportamento da solicitação

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `documents` | `string[]` | Sim | Um ou mais documentos não vazios para classificar. Os resultados preservam essa ordem e o índice baseado em zero de cada documento. |
| `labels` | `string[]` | Sim | Um ou mais rótulos não vazios. Cada rótulo é pontuado para cada documento. |

O endpoint usa o modelo de incorporação padrão e não aceita parâmetro de modelo, limite de pontuação ou limite de resultados.

A solicitação a seguir classifica três documentos, sendo um deles em alemão, contra três rótulos:

```json
{
  "documents": [
    "Compare the total cost of two loans for a principal of $10,000 over 5 years at different annual rates",
    "Erklären Sie die Unterschiede zwischen Merge-Sort und Quicksort-Algorithmen in Bezug auf Zeitkomplexität, Platzkomplexität und Leistung in der Praxis.",
    "Write a poem about the beauty of nature and its healing power on the human soul"
  ],
  "labels": [
    "Creative writing",
    "Complex problem",
    "Simple task"
  ]
}
```

## Leia a resposta

`results` contém um item para cada documento de entrada. Cada array `scores` contém todos os rótulos fornecidos, ordenados por similaridade cosseno decrescente. O exemplo abaixo está abreviado para o primeiro documento:

```json
{
  "results": [
    {
      "index": 0,
      "document": "Compare the total cost of two loans for a principal of $10,000 over 5 years at different annual rates",
      "scores": [
        {
          "label": "Complex problem",
          "score": 0.98828
        },
        {
          "label": "Simple task",
          "score": 0.45272
        },
        {
          "label": "Creative writing",
          "score": 0.06823
        }
      ]
    }
  ]
}
```

Uma pontuação mede a similaridade vetorial, não uma probabilidade. Compare as pontuações dentro da mesma solicitação em vez de interpretar um valor como uma confiança percentual.

## Preços e limites

| Descrição | Preço |
| --- | ---: |
| Classificação de texto | **$0,015/M tokens** |

O número de documentos classificados por minuto e por dia depende do plano; consulte [Limites de processamento de dados](../limits.md#data-processing). A cota conta cada item no array `documents` da solicitação, não cada solicitação HTTP. Uma solicitação que excederia qualquer janela ativa retornará `429 Too Many Requests`.

A referência de API embutida contém os detalhes mantidos pelo servidor sobre solicitações, respostas, autenticação e erros:

<script src="https://inference.aivax.net/apidocs?embed-target=Classify%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
