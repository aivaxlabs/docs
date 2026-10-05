---
{title: Classificação de Texto,linkTitle: Classificação de texto,weight: 120,group: RAG and collections,aliases: [/docs/pt-br/generations/classification.html,/docs/pt-br/rag/classification.html],sourceHash: 0342552c98a347c6}
---

# Classificação de Texto

Use a classificação de texto para classificar um conjunto fixo de rótulos para um ou mais documentos sem treinar um classificador personalizado. AIVAX incorpora cada documento e rótulo com o modelo de incorporação padrão, compara seus vetores usando similaridade cossena e devolve cada rótulo, do mais similar ao menos similar para cada documento.

Antes de chamar este endpoint, [crie uma chave de API](../authentication.md) e certifique‑se de que a conta tem saldo positivo.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/classify</span>
</div>

## Comportamento da requisição

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `documents` | `string[]` | Sim | Um ou mais documentos não vazios para classificar. Os resultados preservam esta ordem e o índice baseado em zero de cada documento. |
| `labels` | `string[]` | Sim | Um ou mais rótulos não vazios. Cada rótulo recebe uma pontuação para cada documento. |

Documentos e rótulos duplicados são preservados. O endpoint sempre usa o modelo de incorporação padrão atual e não aceita um parâmetro de modelo, limite de pontuação ou limite de resultados.

Exemplo de requisição:

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

`results` contém um item para cada documento de entrada. Cada array `scores` contém todos os rótulos fornecidos, ordenados por similaridade cossena decrescente. Rótulos com pontuações iguais preservam sua ordem original.

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

Uma pontuação mede a similaridade de vetores, não uma probabilidade calibrada. Compare pontuações dentro da mesma requisição e modelo de incorporação, em vez de interpretar um valor como porcentagem de confiança. Pontuações negativas são válidas e permanecem na resposta porque o endpoint não filtra rótulos.

O uso de incorporação é cobrado para textos que exigem inferência e está associado à chave de API autenticada. Textos repetidos podem ser servidos a partir de um cache interno, reduzindo latência e custos. Como o endpoint devolve cada par documento‑rótulo, o tamanho da resposta e o trabalho de comparação crescem com `documents × labels`.

A referência de API incorporada contém os detalhes de requisição, resposta, autenticação e erro mantidos pelo servidor:

<script src="https://inference.aivax.net/apidocs?embed-target=Classify%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
