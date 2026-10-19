Source: https://docs.aivax.net/pt-br/docs/data-processing/classification.html

# Classificação de Texto

Use a classificação de texto para ordenar um conjunto fixo de rótulos para um ou mais documentos sem treinar um classificador personalizado. Ela se adequa a tarefas como marcação, triagem ou roteamento de solicitações, onde as categorias são conhecidas previamente e você precisa de um ranqueamento por similaridade em vez de uma resposta gerada.

AIVAX incorpora cada documento e rótulo com o modelo de incorporação padrão e compara seus vetores usando similaridade de cosseno. Para cada documento, retorna cada rótulo ordenado do mais similar ao menos similar.

Antes de chamar este endpoint, [crie uma chave de API](https://docs.aivax.net/pt-br/docs/authentication.md) e verifique se a conta tem saldo positivo.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/classify</span>
</div>

## Comportamento da requisição

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `documents` | `string[]` | Sim | Um ou mais documentos não vazios para classificar. Os resultados preservam esta ordem e o índice baseado em zero de cada documento. |
| `labels` | `string[]` | Sim | Um ou mais rótulos não vazios. Cada rótulo recebe pontuação para cada documento. |

Documentos e rótulos duplicados são preservados. O endpoint sempre usa o modelo de incorporação padrão atual e não aceita parâmetro de modelo, limiar de pontuação ou limite de resultados.

A requisição a seguir classifica três documentos, um deles em alemão, contra três rótulos:

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

O `results` contém um item para cada documento de entrada. Cada array `scores` contém todos os rótulos fornecidos, ordenados por similaridade de cosseno decrescente. Rótulos com pontuações iguais preservam a ordem original. O exemplo abaixo está abreviado para o primeiro documento:

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

Uma pontuação mede a similaridade vetorial, não uma probabilidade calibrada. Compare pontuações dentro da mesma requisição e modelo de incorporação ao invés de interpretar um valor como porcentagem de confiança. Pontuações negativas são válidas e permanecem na resposta porque o endpoint não filtra rótulos.

O uso de incorporação é cobrado para textos que requerem inferência e está associado à chave de API autenticada. Textos repetidos podem ser servidos a partir de um cache interno, reduzindo latência e custos. Como o endpoint retorna cada par documento‑rótulo, o tamanho da resposta e o trabalho de comparação crescem com `documents × labels`.

## Preços e limites

A classificação de texto usa o modelo de incorporação padrão e é cobrada pelo trabalho de incorporação realizado.

| Descrição | Preço |
| --- | --- |
| Classificação de texto | **$0.10/M tokens** |

Um travessão (`—`) indica que o plano não impõe um limite.

| Limite | Gratuito | Pro | Máx |
| --- | --- | --- | --- |
| Documentos de classificação de texto | 30/min e 300/dia | 1.000/min | 10.000/min |

A cota conta cada item no array `documents` da requisição, não cada requisição HTTP. Uma requisição que excederia qualquer janela ativa retorna `429 Too Many Requests`.

A referência da API embutida contém a solicitação, resposta, autenticação e detalhes de erro mantidos pelo servidor:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Classify%20documents)
