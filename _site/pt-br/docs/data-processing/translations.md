Source: https://docs.aivax.net/pt-br/docs/data-processing/translations.html

# Traduções

Use Translations para traduzir texto, o texto visível em imagens e a fala em áudio para qualquer idioma. É adequado para conteúdo de produto, mensagens de suporte, placas e capturas de tela, e notas de voz que precisam alcançar usuários em outro idioma.

Antes de chamar este endpoint, [crie uma chave de API](https://docs.aivax.net/pt-br/docs/authentication.md) e verifique se a conta tem saldo positivo.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/translate</span>
</div>

## Request behavior

| Propriedade | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `toLanguage` | String | Yes | Idioma para o qual traduzir. |
| `fromLanguage` | String | No | Idioma dos documentos. Quando omitido, é detectado a partir do conteúdo de cada documento. |
| `documents` | Content part array | Yes | Um ou mais documentos como partes de conteúdo compatíveis com OpenAI: `text`, `image_url` ou `input_audio`. |

Os idiomas são de forma livre: um nome como `Japanese`, um código como `pt-BR`, ou uma variante como `Spanish (Mexico, informal)`. O mesmo idioma se aplica a cada documento na requisição.

O serviço devolve apenas o conteúdo traduzido. Ele preserva formatação, quebras de linha, Markdown, código, URLs, números e nomes próprios, e trata o conteúdo como texto a ser traduzido, não como instruções. Para imagens, traduz o texto visível; para áudio, traduz o conteúdo falado. Outros tipos de conteúdo, como arquivos ou vídeo, retornam `400 Bad Request` com o índice do documento rejeitado.

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

## Ler a resposta

`data` contém uma string traduzida por documento, na mesma ordem de `documents`. Os documentos são traduzidos de forma independente e em paralelo. Se algum documento falhar, a requisição retorna um erro em vez de resultados parciais.

```json
{
  "message": null,
  "data": [
    "Seu pedido foi enviado e deve chegar em até três dias úteis.",
    "Proibido estacionar"
  ]
}
```

As traduções são geradas por modelo. Revise-as antes de publicar conteúdo legal, médico, financeiro ou outro conteúdo de consequência, e mantenha o original disponível para referência.

## Preços e limites

As traduções são cobradas em unidades de processamento (PUs), cobrindo o uso de entrada e saída. O uso é registrado por documento. O preço da PU varia com o modelo de processamento selecionado para o tipo de conteúdo, e o [plan multiplier](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers) se aplica.

Um travessão (`—`) indica que o plano não impõe limite.

| Limite | Gratuito | Pro | Máximo |
| --- | --- | --- | --- |
| Solicitações de tradução | 30/min e 300/dia | 200/min | 2,500/min |

O limite conta requisições HTTP, não documentos. Uma requisição que excederia qualquer janela ativa retorna `429 Too Many Requests`. Para limites a nível de conta, veja [Plans and Limits](https://docs.aivax.net/pt-br/docs/limits.md).

A referência de API incorporada contém os detalhes de requisição, resposta, autenticação e erro mantidos pelo servidor:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Translate%20documents)
