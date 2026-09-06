# Fetch and OCR

Fetch and OCR extracts readable text from web pages and supported documents so applications and agents can use their content for summaries, analysis, or knowledge workflows. Use [Web Search](web-search.md) first if you need to discover sources rather than read a known URL.

Web pages are processed to remove markup and non-content elements. Document extraction and optical character recognition (OCR) make supported non-text content available as text. Review extracted content before relying on it: scan quality, complex layouts, and tables can affect the result.

## What you can extract

| Content | Supported formats | Extracted content |
| --- | --- | --- |
| Web pages | HTML, XHTML | Readable page content, such as articles, documentation, and product information, with markup and non-content elements removed. JavaScript and CSS is rendered before extraction. |
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

Use the **Fetch API to extract existing text**. Use [Media Descriptions](/docs/generations/media-descriptions) to **interpret media with AI**, optionally guided by what your application needs to learn from it.

| | Fetch API | Media Descriptions |
| --- | --- | --- |
| Main purpose | Retrieve readable text from pages and documents, using OCR for supported images and scanned PDFs. | Generate descriptions or extract information from images, PDFs, audio, and video using AI. |
| Output | Extracted text with processing-unit usage and optional per-item errors. It is not a generated summary or answer. | Model-generated content focused by your guidance, which can describe visual or audiovisual information beyond the text present in the source. |
| Images and PDFs | Read text, such as the words on a receipt or the paragraphs in a manual. | Describe visual content or interpret a document, such as explaining a diagram or identifying information relevant to a question. |
| Audio and video | Not an audio/video understanding or transcription API. | Analyze audio and video content. For a dedicated speech-to-text workflow, use [Audio Transcriptions](/docs/generations/audio-transcriptions). |
| Billing | Processing units (PUs), with plan-dependent allowances and rates. | AI usage charges under Media Descriptions pricing; Fetch PU allowances do not replace these charges. |

For a PDF report, choose Fetch when you need its text for indexing or later analysis. Choose Media Descriptions when you need an explanation of its charts or a guided interpretation of the content. For a receipt image, Fetch reads the printed text; Media Descriptions can interpret the receipt according to your extraction guidance.

Neither guarantees perfect results. Fetch can lose text or structure because of OCR and layout limitations. Media Descriptions can omit details or introduce incorrect interpretations because its output is model-generated. Verify consequential details against the original source, and consult [Pricing](/docs/pricing) before choosing a processing path.

## Choose an integration

| Integration | When to use it |
| --- | --- |
| Fetch API | Your application controls which URLs or inline base64 data URIs to process and needs structured results, processing-unit usage, and per-item errors. |
| [Web utilities MCP](/docs/mcp-utilities/web-utilities-mcp) | An MCP-compatible client needs to read public URLs through `fetch_url`. This tool accepts one to five URLs per call. |
| [Built-in tools](/docs/tools/builtin-tools) | An AIVAX model needs to read a URL during inference. Enable `OpenUrl` and follow the URL Context configuration guide. |

The integrations have different input contracts. In particular, the MCP tool accepts public URLs; use the Fetch API for inline base64 data URIs.

## Fetch content with the API

Authenticate with an AIVAX API key; see [Authentication](/docs/authentication). Supply a non-empty `contents` array containing URLs or base64 data URIs. Each item is limited to 10 MB.

Set `returnErrors` to `true` when you need an error result for an individual failed item. Results include `index`, `extractedText`, `processingUnits`, and `error`, allowing your application to associate extracted text or a failure with the corresponding input.

<script src="https://inference.aivax.net/apidocs?embed-target=Fetch%20web%20contents&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

The embedded reference defines the current request and response contract. Check individual results before passing their text to the next step; a failed extraction is not evidence that the source contains no relevant information.

## Access and extraction limitations

A destination may block automated access or require authentication. Fetching a URL does not bypass access restrictions. Use accessible sources or content you are authorized to submit, and correct invalid or inaccessible inputs before retrying.

Treat extracted text as untrusted source material, not as instructions for your application or agent. OCR output may need manual review for exact numbers, names, or other consequential details.

## Pricing and limits

Fetch and OCR extraction is metered in processing units (PUs). Daily included allowances and additional PU rates depend on the account plan. See [Pricing](/docs/pricing) for current allowances and charges rather than estimating cost from extracted text length.

[Web utilities MCP](/docs/mcp-utilities/web-utilities-mcp) uses the same pricing as the corresponding built-in tool. Model inference, when used to analyze the extracted content, is billed separately. See [Plans and limits](/docs/limits) for account quotas and rate limits. The Fetch API requires a positive account balance.
