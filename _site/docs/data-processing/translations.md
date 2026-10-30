Source: https://docs.aivax.net/docs/data-processing/translations.html

# Translations

Use Translations to translate text, the visible text in images, and the speech in audio into any language. It fits product content, support messages, signs and screenshots, and voice notes that need to reach users in another language.

Before calling this endpoint, [create an API key](https://docs.aivax.net/docs/authentication.md) and make sure the account has a positive balance.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/translate</span>
</div>

## Request behavior

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `toLanguage` | String | Yes | Language to translate into. |
| `fromLanguage` | String | No | Language of the documents. When omitted, it is detected from each document's content. |
| `documents` | Content part array | Yes | One or more documents as OpenAI-compatible content parts: `text`, `image_url`, or `input_audio`. |

Languages are free-form: a name such as `Japanese`, a code such as `pt-BR`, or a variant such as `Spanish (Mexico, informal)`. The same languages apply to every document in the request.

The service returns only the translated content. It preserves formatting, line breaks, Markdown, code, URLs, numbers, and proper names, and treats the content as text to translate, not as instructions. For images, it translates the visible text; for audio, it translates the spoken content. Other content types, such as files or video, return `400 Bad Request`. The error does not identify which document was rejected, so check the content type of each document in the request.

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

## Read the response

`data` contains one translated string per document, in the same order as `documents`. Documents are translated independently and in parallel. If any document fails, the request returns an error instead of partial results. Documents that finished before the failure are still billed, so retry only after fixing the failing document.

```json
{
  "message": null,
  "data": [
    "Seu pedido foi enviado e deve chegar em até três dias úteis.",
    "Proibido estacionar"
  ]
}
```

Translations are model-generated. Review them before publishing legal, medical, financial, or other consequential content, and keep the original available for reference.

## Pricing and limits

Translations are billed in processing units (PUs), covering input and output usage. Usage is recorded for each document. The PU price varies with the processing model selected for the content type, and the [plan multiplier](https://docs.aivax.net/docs/pricing.md#plan-multipliers) applies.

An em dash (`—`) means the plan does not impose a limit.

| Limit | Free | Pro | Max |
| --- | --- | --- | --- |
| Translation requests | 30/min and 300/day | 200/min | 2,500/min |

The limit counts HTTP requests, not documents. A request that would exceed any active window returns `429 Too Many Requests`. For account-level limits, see [Plans and Limits](https://docs.aivax.net/docs/limits.md).

The embedded API reference contains the server-maintained request, response, authentication, and error details:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Translate%20documents)
