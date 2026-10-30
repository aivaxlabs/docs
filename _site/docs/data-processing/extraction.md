Source: https://docs.aivax.net/docs/data-processing/extraction.html

# Extraction

Use Extraction to turn text, images, and PDFs into JSON shaped by a schema you define. It fits invoices, receipts, forms, contracts, and other documents where your application needs the same fields from every document, such as a number, a company name, a total, or a list of line items.

Before calling this endpoint, [create an API key](https://docs.aivax.net/docs/authentication.md) and make sure the account has a positive balance.

## Extraction, Fetch, or Media Descriptions

These three services read documents, but they return different things:

| | Extraction | [Fetch and OCR](https://docs.aivax.net/docs/web-foundation/fetch-and-ocr.md) | [Media Descriptions](https://docs.aivax.net/docs/data-processing/media-descriptions.md) |
| --- | --- | --- | --- |
| Main purpose | Find specific fields in each document and return them as JSON. | Retrieve the readable text of web pages and documents, using OCR when needed. | Interpret media with AI and return a text description guided by your instructions. |
| Input | Text, JPEG, PNG, TIFF, and PDF content. | Web pages and many document formats, including Office files, spreadsheets, and e-books. | Images, PDFs, audio, and video. |
| Output | One JSON object per document, shaped by your schema. | Extracted text, plus optional JSON converted from that text. | Generated text. |
| Billing | Input tokens only. | Processing units with daily plan allowances; JSON conversion is billed separately. | AI usage charges for input and output. |

Choose Extraction when you already know which fields you need and want them read directly from the document. Choose Fetch when you need the document's full text, for example to index it or to read a web page. Choose Media Descriptions when you need an explanation of visual or audiovisual content, such as a chart, a photo, or a video, rather than specific fields.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/extract</span>
</div>

## Build the request

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `responseSchema` | JSON Schema object | Yes | Object schema whose `properties` describe the fields to extract. It must have at least one property. |
| `documents` | Content part array | Yes | One or more documents as OpenAI-compatible content parts: `text`, `image_url`, or `file`. |
| `instructions` | String | No | Guidance that applies to every document, such as which party counts as the vendor. |

Each property in `responseSchema` is one field to find. Its `description` is the search criterion, so write it as a short, specific definition, such as "total amount due" instead of "total". Nested objects and arrays of objects are supported. `$ref` and `$defs` are not; inline every definition instead.

Images and files accept base64 data URLs or public HTTP(S) URLs:

- Supported formats are JPEG, PNG, TIFF, and PDF, including multi-page PDFs.
- AIVAX downloads remote URLs before processing, up to 5 MB each. The resource must be reachable without sign-in.
- Other content types, such as audio or video, return `400 Bad Request`. The error does not identify which document was rejected, so check the content type of each document in the request.

The following request extracts invoice fields from a text document and a PDF:

```json
{
  "instructions": "Only consider the issuing company as the vendor.",
  "responseSchema": {
    "type": "object",
    "properties": {
      "invoice_number": { "type": "string", "description": "invoice number" },
      "vendor": { "type": "string", "description": "company that issued the invoice" },
      "total": { "type": "number", "description": "total amount due" },
      "line_items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "product": { "type": "string", "description": "product name" },
            "quantity": { "type": "integer", "description": "number of units" }
          }
        }
      }
    }
  },
  "documents": [
    {
      "type": "text",
      "text": "Invoice 1042 from Acme Corp. 2 x Widget at $10.00. Total: 20.00 USD."
    },
    {
      "type": "file",
      "file": {
        "filename": "invoice.pdf",
        "file_data": "https://example.com/invoice.pdf"
      }
    }
  ]
}
```

## Read the response

`data` contains one object per document, in the same order as `documents`. Each object uses the property names from your schema. Values are converted to the `number`, `integer`, or `boolean` type declared in the schema when possible. A field that is not found is `null`, and an array with no matches is empty.

```json
{
  "message": null,
  "data": [
    {
      "invoice_number": "1042",
      "vendor": "Acme Corp",
      "total": 20,
      "line_items": [
        { "product": "Widget", "quantity": 2 }
      ]
    }
  ]
}
```

Documents are processed independently and in parallel. If any document fails, the whole request returns an error instead of partial results. Correct or remove that document and retry. Documents that finished before the failure are still billed and count toward your quota, so retry only after fixing the failing document.

Extracted values are model-generated. They can be missing, incomplete, or wrong, especially in low-quality scans or complex layouts. Validate the structure and verify consequential values, such as amounts and identifiers, against the original document.

## Pricing and limits

Extraction is billed for the input tokens of each document. Output tokens are not billed.

| Description | Pricing |
| --- | ---: |
| Extraction input | **$0.04/M tokens** |

Extraction and [Summarization](https://docs.aivax.net/docs/data-processing/summarization.md) share the same document limits. An em dash (`—`) means the plan does not impose a limit.

| Limit | Free | Pro | Max |
| --- | --- | --- | --- |
| Processed documents | 10/min and 300/day | 200/min | 2,500/min |

The quota counts every item in the request's `documents` array, not each HTTP request. A request that would exceed any active window returns `429 Too Many Requests`. For account-level limits, see [Plans and Limits](https://docs.aivax.net/docs/limits.md).

The embedded API reference contains the server-maintained request, response, authentication, and error details:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Extract%20data%20from%20documents)
