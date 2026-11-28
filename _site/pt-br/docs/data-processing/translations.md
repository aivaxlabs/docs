Source: https://docs.aivax.net/pt-br/docs/data-processing/translations.html

# Traduções

Use Traduções para traduzir texto, o texto visível em imagens e a fala em áudio para qualquer idioma. Ele se adapta ao conteúdo do produto, mensagens de suporte, placas e capturas de tela, e notas de voz que precisam alcançar usuários em outro idioma.

Antes de chamar este endpoint, [crie uma chave de API](https://docs.aivax.net/pt-br/docs/authentication.md) e certifique-se de que a conta tenha um saldo positivo.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/translate</span>
</div>

## Comportamento da solicitação

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `toLanguage` | String | Sim | Idioma para o qual traduzir. |
| `fromLanguage` | String | Não | Idioma dos documentos. Quando omitido, é detectado a partir do conteúdo de cada documento. |
| `documents` | Matriz de partes de conteúdo | Sim | Um ou mais documentos como partes de conteúdo compatíveis com OpenAI: `text`, `image_url` ou `input_audio`. |

Os idiomas são livres: um nome como `Japanese`, um código como `pt-BR` ou uma variante como `Spanish (Mexico, informal)`. Os mesmos idiomas se aplicam a todos os documentos na solicitação.

O serviço retorna apenas o conteúdo traduzido e preserva a formatação, Markdown, código, URLs, números e nomes próprios. O conteúdo é sempre tratado como texto a ser traduzido, não como instruções. Para imagens, traduz o texto visível; para áudio, o conteúdo falado. Outros tipos de conteúdo, como arquivos ou vídeo, retornam `400 Bad Request`.

```json
{
  "fromLanguage": "English",
  "toLanguage": "Brazilian Portuguese",
  "documents": [
    {
      "type": "text",
      "text": "Your order has shipped and should arrive within three business days."
    },
    {
      "type": "image_url",
      "image_url": {
        "url": "https://example.com/sign.png"
      }
    }
  ]
}
```

## Leia a resposta

`data` contém uma string traduzida por documento, na mesma ordem que `documents`. Se algum documento falhar, a solicitação retorna um erro em vez de resultados parciais. Documentos que foram concluídos antes da falha ainda são cobrados, então corrija ou remova o documento com falha antes de tentar novamente.

```json
{
  "message": null,
  "data": [
    "Seu pedido foi enviado e deve chegar em até três dias úteis.",
    "Proibido estacionar"
  ]
}
```

As traduções são geradas por modelos. Revise-as antes de publicar conteúdo legal, médico, financeiro ou outro de consequências significativas.

## Geração assíncrona

Adicione `"async": true` para colocar a tradução na fila. A API responde com HTTP `202` e um ID, e você busca o resultado armazenado posteriormente ou recebe um webhook quando estiver concluído. Veja [Gerações assíncronas](https://docs.aivax.net/pt-br/docs/inference/batch/async-generations.md).

```json
{
  "fromLanguage": "English",
  "toLanguage": "Brazilian Portuguese",
  "documents": [
    { "type": "text", "text": "Your order has shipped." }
  ],
  "async": true
}
```

## Preços e limites

As traduções são cobradas em unidades de processamento (PUs), cobrindo o uso de entrada e saída, e o [multiplicador de plano](https://docs.aivax.net/pt-br/docs/pricing/product-pricing.md#plan-multipliers) se aplica.

O número de solicitações de tradução por minuto e por dia depende do plano; veja [Limites de processamento de dados](https://docs.aivax.net/pt-br/docs/pricing/plans-and-limits.md#data-processing). O limite conta solicitações HTTP, não documentos. Uma solicitação que excederia qualquer janela ativa retorna `429 Too Many Requests`.

A referência de API embutida contém os detalhes de solicitação, resposta, autenticação e erro mantidos pelo servidor:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Translate%20documents)
