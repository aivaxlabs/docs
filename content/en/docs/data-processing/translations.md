---
{title: Translations,linkTitle: Translations,weight: 70,group: Data processing}
---

# Translations

Use Translations to translate text, the visible text in images, and the speech in audio into any language. It fits product content, support messages, signs and screenshots, and voice notes that need to reach users in another language.

Before calling this endpoint, [create an API key](../authentication.md) and make sure the account has a positive balance.

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

The service returns only the translated content and preserves formatting, Markdown, code, URLs, numbers, and proper names. Content is always treated as text to translate, not as instructions. For images, it translates the visible text; for audio, the spoken content. Other content types, such as files or video, return `400 Bad Request`.

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

`data` contains one translated string per document, in the same order as `documents`. If any document fails, the request returns an error instead of partial results. Documents that finished before the failure are still billed, so fix or remove the failing document before retrying.

```json
{
  "message": null,
  "data": [
    "Seu pedido foi enviado e deve chegar em até três dias úteis.",
    "Proibido estacionar"
  ]
}
```

Translations are model-generated. Review them before publishing legal, medical, financial, or other consequential content.

## Async generation

Add `"async": true` to queue the translation. The API answers with HTTP `202` and an ID, and you fetch the stored result later or receive a webhook when it is done. See [Async generations](/docs/inference/batch/async-generations.md).

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

## Pricing and limits

Translations are billed in processing units (PUs), covering input and output usage, and the [plan multiplier](/docs/pricing/product-pricing.md#plan-multipliers) applies.

The number of translation requests per minute and per day depends on the plan; see [Data processing limits](/docs/pricing/plans-and-limits.md#data-processing). The limit counts HTTP requests, not documents. A request that would exceed any active window returns `429 Too Many Requests`.

The embedded API reference contains the server-maintained request, response, authentication, and error details:

<script src="https://inference.aivax.net/apidocs?embed-target=Translate%20documents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
