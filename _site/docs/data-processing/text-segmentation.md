Source: https://docs.aivax.net/docs/data-processing/text-segmentation.html

# Text Segmentation

Text segmentation divides source documents into semantically cohesive strings that can be embedded or indexed in a RAG collection. It returns segments to your application; it does not create embeddings or store submitted documents.

Use it when a source document needs reviewable, retrieval-ready boundaries before you create or update collection documents. If you already have focused, self-contained text, you can import it directly. If you want AIVAX to process source files into collection documents, see [Media Injector](https://docs.aivax.net/docs/rag/documents.md#import-from-files-with-media-injector). For a full walkthrough that turns a PDF into segmented, importable chunks, see [PDF to Markdown for RAG](https://aivax.net/blog/pdf-to-markdown-for-rag-chunks-jsonl/).

To see how segmentation relates to storage, updates, and retrieval, read [where segmentation fits in a RAG pipeline](https://aivax.net/blog/a-vector-database-is-not-a-rag-system/).

## Skip segmentation when the text is already focused

Segmentation earns its keep on long, multi-topic sources — manuals, articles, transcripts — where one embedding per page would blur distinct subjects together. Do not segment text that is already one idea per unit: FAQ answers, product descriptions, short policies, or pre-chunked passages can go straight into the collection. Each unnecessary split adds indexing work and risks separating statements that only make sense together.

## What makes a good segment

A good segment is the smallest span that still answers a question on its own: a complete statement or a tight group of statements about one subtopic, typically a paragraph or a short section. Segments are most useful when the source has clear headings, paragraphs, and complete statements — the segmenter preserves those boundaries instead of cutting mid-thought.

Messy sources, such as tables without headers, OCR output, rambling transcripts, and exports that repeat page headers, benefit from cleaning first. Fix headings and remove boilerplate, then review the results before indexing.

## Prepare source text

Supply complete source text whenever possible, cleaned as described above.

Segments target about 300 tokens and cover the whole document in source order. Boundaries follow the document structure and the meaning of neighboring passages; documents of about that size or smaller are returned as one segment.

Use sanitization only when omitted content is genuinely irrelevant to retrieval. Sanitized requests take longer. When exact source wording or full traceability matters, retain and review the source text instead.

For the supported request, response, authentication, and error contract, use the API Reference:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Segment%20text)

## Async generation

Add `"async": true` to queue the segmentation, which is useful for long documents and sanitized requests. The API answers with HTTP `202` and an ID, and you fetch the stored result later or receive a webhook when it is done. See [Async generations](https://docs.aivax.net/docs/inference/batch/async-generations.md).

```json
{
  "documents": ["<long document text>"],
  "sanitize": true,
  "async": true
}
```

## Pricing and limits

| Description | Pricing |
| --- | ---: |
| Text segmentation | **$0.10/M tokens** |

The number of segmented documents per minute and per day depends on the plan; see [Data processing limits](https://docs.aivax.net/docs/pricing/plans-and-limits.md#data-processing). The quota counts every item in the request's `documents` array, not each HTTP request. A request that would exceed any active window returns `429 Too Many Requests`.
