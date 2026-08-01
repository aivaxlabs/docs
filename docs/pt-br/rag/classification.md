# Classificação de Texto

Use a classificação de texto para classificar um conjunto fixo de rótulos para um ou mais documentos sem treinar um classificador personalizado. AIVAX incorpora cada documento e rótulo com o modelo de incorporação padrão, compara seus vetores usando similaridade do cosseno e devolve cada rótulo do mais similar ao menos similar para cada documento.

Antes de chamar este endpoint, [crie uma chave de API](../authentication.md) e certifique-se de que a conta tem saldo positivo.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/classify</span>
</div>

## Comportamento da solicitação

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `documents` | `string[]` | Yes | Um ou mais documentos não vazios para classificar. Os resultados preservam esta ordem e o índice zero‑based de cada documento. |
| `labels` | `string[]` | Yes | Um ou mais rótulos não vazios. Cada rótulo recebe uma pontuação para cada documento. |

Documentos e rótulos duplicados são preservados. O endpoint sempre usa o modelo de incorporação padrão atual e não aceita um parâmetro de modelo, limiar de pontuação ou limite de resultados.

Exemplo de solicitação:

```json
{
  "documents": [
    "Calculate the compound interest on a principal of $10,000 invested for 5 years at an annual rate of 5%, compounded quarterly",
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

## Ler a resposta

`results` contém um item para cada documento de entrada. Cada array `scores` contém todos os rótulos fornecidos, ordenados por similaridade do cosseno decrescente. Rótulos com pontuações iguais preservam sua ordem original.

```json
{
  "results": [
    {
      "index": 0,
      "document": "Calculate the compound interest on a principal of $10,000 invested for 5 years at an annual rate of 5%, compounded quarterly",
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

Uma pontuação mede a similaridade de vetores, não uma probabilidade calibrada. Compare pontuações dentro da mesma solicitação e modelo de incorporação em vez de interpretar um valor como confiança percentual. Pontuações negativas são válidas e permanecem na resposta porque o endpoint não filtra rótulos.

O uso de incorporação é cobrado para texto que requer inferência e está associado à chave de API autenticada. Texto repetido pode ser servido a partir de um cache interno, reduzindo latência e custos. Como o endpoint retorna cada par documento‑rótulo, o tamanho da resposta e o trabalho de comparação aumentam com `documents × labels`.

A referência de API incorporada contém a solicitação, resposta, autenticação e detalhes de erro mantidos pelo servidor:

<script src="https://inference.aivax.net/apidocs?embed-target=Classify%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>