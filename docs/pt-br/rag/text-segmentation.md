# Segmentação de Texto

A segmentação de texto é um complemento ao embedding. Ela divide documentos de origem em strings semanticamente coesas que podem ser embutidas ou indexadas em uma coleção RAG. O endpoint não cria embeddings nem armazena os documentos enviados.

## Segmentar documentos

Autentique-se com uma chave de API privada da AIVAX.

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/segment</span>
</div>

A solicitação aceita:

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `documents` | `string[]` | Sim | Strings de documento para segmentar. Cada item é processado independentemente. |
| `sanitize` | `boolean` | Não | Padrão `false`, que mantém o documento inteiro nos segmentos retornados. Quando `true`, conteúdo considerado irrelevante para a recuperação RAG pode ser omitido. |

Exemplo de solicitação:

```json
{
  "documents": [
    "AIVAX indexes documents with embeddings.\nSemantic search retrieves the most relevant passages.\nReranking can refine their order."
  ],
  "sanitize": false
}
```

Antes da segmentação, os finais de linha são normalizados, espaços em branco ao redor são removidos de cada linha e linhas vazias são descartadas. Os segmentos preservam o texto fonte restante e a ordem das linhas.

## Ler a resposta

O envelope de resposta padrão contém um resultado para cada documento enviado:

```json
{
  "message": null,
  "data": {
    "result": [
      {
        "index": 0,
        "count": 2,
        "segments": [
          "AIVAX indexes documents with embeddings.\nSemantic search retrieves the most relevant passages.",
          "Reranking can refine their order."
        ]
      }
    ],
    "usage": {
      "total_tokens": 62,
      "cost": 0.00002325
    }
  }
}
```

| Campo | Significado |
| --- | --- |
| `data.result[].index` | Posição baseada em zero do documento fonte em `documents`. Use este campo para associar resultados às entradas; a ordem do array não é garantida. |
| `data.result[].count` | Número de segmentos retornados para o documento fonte. |
| `data.result[].segments` | Segmentos de texto semanticamente coesos na ordem original. |
| `data.usage.total_tokens` | Total de tokens de entrada e saída medidos em todos os documentos enviados. |
| `data.usage.cost` | Custo final registrado para a conta autenticada. |

O endpoint retorna `400 Bad Request` para payloads malformados, `401 Unauthorized` para uma chave de API ausente ou inválida, `403 Forbidden` para chaves de API públicas, e `429 Too Many Requests` quando a cota da conta é excedida.

<script src="https://inference.aivax.net/apidocs?embed-target=Segment%20text&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>