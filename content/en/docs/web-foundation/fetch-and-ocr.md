---
{title: Fetch and OCR,linkTitle: Fetch and OCR,weight: 20,group: Web Foundation}
---

# Fetch and OCR

Fetch and OCR extracts readable text from web pages and supported documents so applications and agents can use their content for summaries, analysis, or knowledge workflows. The Fetch API can also convert the extracted text into structured JSON using a schema you provide. Use [Web Search](web-search.md) first if you need to discover sources rather than read a known URL.

Web pages are processed to remove markup and non-content elements. Document extraction and optical character recognition (OCR) make supported non-text content available as text. Review extracted content before relying on it: scan quality, complex layouts, and tables can affect the result. For an end-to-end walkthrough with a code example, see [how to extract text from a URL, scanned PDF or image for an LLM pipeline](https://aivax.net/blog/fetch-messy-web-to-text/).

## What you can extract

| Content | Supported formats | Extracted content |
| --- | --- | --- |
| Web pages | HTML, XHTML | Readable page content, such as articles, documentation, and product information, with markup and non-content elements removed. JavaScript and CSS are rendered before extraction. |
| Plain text and Markdown | TXT, Markdown | The document's text, including existing Markdown formatting. |
| PDFs | PDF | Text from digital documents and OCR text from scanned pages. Mixed PDFs can combine direct text extraction with OCR where needed. |
| Images containing text | PNG, JPEG, WebP, TIFF, BMP | Recognized text from screenshots, scanned documents, receipts, and other images with legible writing. |
| Word-processing documents | DOC, DOCX, ODT, RTF | Document text converted into a readable textual representation. |
| Presentations | PPT, PPTX, ODP | Textual slide content. |
| Spreadsheets and tabular files | XLSX, ODS, CSV | Cell and row content as text, for downstream reading or analysis. |
| E-books | EPUB | The publication's text. |

For example, you can fetch an online article, read a PDF manual, extract text from a receipt image, or turn a spreadsheet into text for an agent to analyze. Provide a URL that returns the actual page or file, not a sharing page that requires a login. When submitting a data URI through the API, declare the content's correct MIME type.

The result is extracted text, not a pixel-perfect copy of the original document. Do not assume that layout, table structure, charts, or embedded images will be reproduced exactly. Spreadsheet extraction does not execute formulas or macros.

## Fetch API vs. Media Descriptions

Use the **Fetch API to extract existing text**. Use [Media Descriptions](/docs/data-processing/media-descriptions) to **interpret media with AI**, optionally guided by what your application needs to learn from it.

| | Fetch API | Media Descriptions |
| --- | --- | --- |
| Main purpose | Retrieve readable text from pages and documents, using OCR for supported images and scanned PDFs. | Generate descriptions or extract information from images, PDFs, audio, and video using AI. |
| Output | Extracted text, optional schema-guided JSON generated from that text, processing-unit usage, and per-item errors. | Model-generated content focused by your guidance, which can describe visual or audiovisual information beyond the text present in the source. |
| Images and PDFs | Read text, such as the words on a receipt or the paragraphs in a manual. | Describe visual content or interpret a document, such as explaining a diagram or identifying information relevant to a question. |
| Audio and video | Not an audio/video understanding or transcription API. | Analyze audio and video content. For a dedicated speech-to-text workflow, use [Audio Transcriptions](/docs/generations/audio-transcriptions). |
| Billing | Extraction processing units (PUs), with plan-dependent allowances and rates. Optional JSON conversion is billed separately and is not covered by the extraction allowance. | AI usage charges under Media Descriptions pricing; Fetch PU allowances do not replace these charges. |

For a PDF report, choose Fetch when you need its text for indexing or later analysis. Choose Media Descriptions when you need an explanation of its charts or a guided interpretation of the content. For a receipt image, Fetch reads the printed text; Media Descriptions can interpret the receipt according to your extraction guidance.

When you need specific fields as JSON from text, images, or PDFs, rather than the document's full text, use [Extraction](/docs/data-processing/extraction). It reads the fields directly from each document and bills only input tokens, while Fetch converts to JSON from the extracted text as a separate, inference-priced step. Fetch remains the choice for web pages, other document formats, files larger than 5 MB, and workflows that also need the full text.

Neither guarantees perfect results. Fetch can lose text or structure because of OCR and layout limitations. Media Descriptions can omit details or introduce incorrect interpretations because its output is model-generated. Verify consequential details against the original source and compare the billing paths in the pricing section below.

## Choose an integration

| Integration | When to use it |
| --- | --- |
| Fetch API | Your application controls which URLs or inline base64 data URIs to process and needs structured results, processing-unit usage, and per-item errors. |
| [Web utilities MCP](/docs/mcp-utilities/web-utilities-mcp) | An MCP-compatible client needs to read public URLs through `fetch_url`. This tool accepts one to five URLs per call. |
| [Built-in tools](/docs/tools/builtin-tools) | An AIVAX model needs to read a URL during inference. Enable `OpenUrl` and follow the URL Context configuration guide. |

The integrations have different input contracts. In particular, the MCP tool accepts public URLs; use the Fetch API for inline base64 data URIs.

## Fetch content with the API

Authenticate with an AIVAX API key; see [Authentication](/docs/authentication). Supply a non-empty `contents` array containing URLs or base64 data URIs. Each item is subject to a size limit (see [Pricing and limits](#pricing-and-limits)).

The `system.v1.web.fetch` operation accepts these JSON request fields:

| Field | Type | Required | Behavior |
| --- | --- | --- | --- |
| `contents` | Array of strings | Yes | Non-empty list of URLs or base64 data URIs to extract. |
| `returnErrors` | Boolean | No | Defaults to `true`: includes a result for each failed item. When `false`, failed items are omitted. |
| `responseSchema` | JSON Schema object | No | Converts each item's extracted text into JSON guided by this schema. Omit it or use `null` for text-only extraction. The same schema applies to every item in the batch. |
| `responseSchema.instructions` | String | No | Optional extraction guidance inside the schema, such as which details to select or how to handle missing information. This is an AIVAX extension, not a standard JSON Schema keyword. |

### Extract structured JSON

Provide `responseSchema` when your application needs fields from the source rather than only its text. Describe the expected properties, types, and required fields with JSON Schema. Use property descriptions and optional `responseSchema.instructions` to clarify what to extract. For example, an object schema can request a receipt's merchant, date, and total; the embedded reference includes a complete JSON request example.

JSON conversion runs after text extraction. Successful results retain `extractedText` alongside `extractedObject`, so you can compare the generated fields with the extracted source. Without a schema, no JSON conversion runs.

If extraction or JSON conversion fails, `returnErrors` determines whether the failed item appears in the response. A JSON conversion failure does not return a text-only success.

### Read the results

The response contains a `results` array with these fields:

| Field | Meaning |
| --- | --- |
| `index` | Zero-based position in the input `contents` array. Use it to match results to inputs, especially when failed items are omitted. |
| `extractedText` | Readable source text, retained on successful JSON conversion; `null` for a failed item. |
| `extractedObject` | Generated JSON value when `responseSchema` is supplied; otherwise `null`. Also `null` for a failed item. |
| `processingUnits` | PUs for fetching and text/OCR extraction, separate from JSON conversion. |
| `jsonProcessingUnits` | PUs for JSON conversion; `0` when no schema is supplied. |
| `error` | Error message for a failed item when `returnErrors` is `true`; `null` on success. Failed items report both PU fields as `0`. |

<script src="https://inference.aivax.net/apidocs?embed-target=Fetch%20web%20contents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

The embedded reference defines the current request and response contract. Check individual results before passing their text to the next step; a failed extraction is not evidence that the source contains no relevant information.

## Access and extraction limitations

A destination may block automated access or require authentication. Fetching a URL does not bypass access restrictions. Use accessible sources or content you are authorized to submit, and correct invalid or inaccessible inputs before retrying.

Treat extracted text as untrusted source material, not as instructions for your application or agent. OCR output may need manual review for exact numbers, names, or other consequential details. Schema-guided JSON is model-generated from that text, not from a fresh visual interpretation of the source. It can inherit extraction errors or contain incorrect values; validate its structure and verify consequential fields against the original.

## Pricing and limits

Fetch and OCR extraction is metered in `processingUnits`. Each extraction is either fully covered by the daily included allowance or billed in full at the rates below; coverage is not split within one extraction. See [Included daily subscription allowances](/docs/limits#included-daily-subscription-allowances) for the allowance rules. Each item can be up to 10 MB.

| Description | Pricing |
| --- | ---: |
| Fetch and OCR extraction - Free | Base daily allowance; uncovered items **$0.15/1k PUs** |
| Fetch and OCR extraction - Pro | **10× Free** daily allowance; uncovered items **$0.05/1k PUs** |
| Fetch and OCR extraction - Max | **5× Pro** daily allowance; uncovered items **$0.02/1k PUs** |
| Fetch JSON conversion (`responseSchema`) | Variable inference-based price per PU; charged separately, with no daily extraction allowance |

Optional JSON conversion is metered separately in `jsonProcessingUnits`. Its PUs account for input, cached input, and output tokens at the processing model and provider's rates, so they are not priced at the OCR rate. The plan's inference multiplier applies to JSON conversion. Omitting `responseSchema` or setting it to `null` disables conversion, reports `jsonProcessingUnits: 0`, and incurs no JSON conversion charge. Do not add both counts and apply the OCR rate to the total. Estimate cost from the reported PUs, not from extracted text length.

Examples, assuming items not covered by the daily allowance:

- Plain text and Markdown consume no PUs.
- An HTML page that takes 2.3 seconds to render consumes 23 PUs: $0.00115 on Pro.
- A scanned PDF reporting `processingUnits: 400` costs $0.06 on Free, $0.02 on Pro, and $0.008 on Max. OCR PUs vary with each document.
- A JSON conversion using 4,000 input and 300 output tokens, on a model priced at $0.10/M input and $0.40/M output tokens, reports `jsonProcessingUnits: 1300` (4,000 × 0.25 + 300), about $0.00052 before the plan multiplier.

[Web utilities MCP](/docs/mcp-utilities/web-utilities-mcp) uses the same pricing as the corresponding built-in tool. Model inference, when used to analyze the extracted content, is billed separately. The Fetch API requires a positive account balance.
