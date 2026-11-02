Source: https://docs.aivax.net/pt-br/docs/data-processing/translations.html

# Traduções

Use Traduções para traduzir texto, o texto visível em imagens e a fala em áudio para qualquer idioma. Ele se adapta ao conteúdo do produto, mensagens de suporte, placas e capturas de tela, bem como notas de voz que precisam alcançar usuários em outro idioma.

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

O serviço retorna apenas o conteúdo traduzido. Preserva formatação, quebras de linha, Markdown, código, URLs, números e nomes próprios, e trata o conteúdo como texto a ser traduzido, não como instruções. Para imagens, traduz o texto visível; para áudio, traduz o conteúdo falado. Outros tipos de conteúdo, como arquivos ou vídeo, retornam `400 Bad Request`. O erro não identifica qual documento foi rejeitado, portanto, verifique o tipo de conteúdo de cada documento na solicitação.

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

`data` contém uma string traduzida por documento, na mesma ordem que `documents`. Os documentos são traduzidos independentemente e em paralelo. Se algum documento falhar, a solicitação retornará um erro em vez de resultados parciais. Documentos que foram concluídos antes da falha ainda serão cobrados, portanto, tente novamente apenas após corrigir o documento com falha.

```json
{
  "message": null,
  "data": [
    "Seu pedido foi enviado e deve chegar em até três dias úteis.",
    "Proibido estacionar"
  ]
}
```

As traduções são geradas por modelos. Revise-as antes de publicar conteúdo legal, médico, financeiro ou outro de consequências significativas e mantenha o original disponível para referência.

## Preços e limites

As traduções são cobradas em unidades de processamento (PUs), cobrindo o uso de entrada e saída. O uso é registrado para cada documento. O preço da PU varia conforme o modelo de processamento selecionado para o tipo de conteúdo, e o [multiplicador de plano](https://docs.aivax.net/pt-br/docs/pricing.md#plan-multipliers) se aplica.

Um travessão (`—`) significa que o plano não impõe limite.

| Limite | Gratuito | Pro | Máximo |
| --- | --- | --- | --- |
| Solicitações de tradução | 30/min e 300/dia | 200/min | 2.500/min |

O limite conta solicitações HTTP, não documentos. Uma solicitação que excederia qualquer janela ativa retornará `429 Too Many Requests`. Para limites em nível de conta, consulte [Planos e Limites](https://docs.aivax.net/pt-br/docs/limits.md).

A referência de API embutida contém os detalhes de solicitação, resposta, autenticação e erro mantidos pelo servidor:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Translate%20documents)
