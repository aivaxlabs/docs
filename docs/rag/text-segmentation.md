# Text Segmentation

Text segmentation divides source documents into semantically cohesive strings that can be embedded or indexed in a RAG collection. It returns segments to your application; it does not create embeddings or store submitted documents.

Use it when a source document needs reviewable, retrieval-ready boundaries before you create or update collection documents. If you already have focused, self-contained text, you can import it directly. If you want AIVAX to process source files into collection documents, see [Media Injector](media-injector.md).

## Skip segmentation when the text is already focused

Segmentation earns its keep on long, multi-topic sources — manuals, articles, transcripts — where one embedding per page would blur distinct subjects together. Do not segment text that is already one idea per unit: FAQ answers, product descriptions, short policies, or pre-chunked passages can go straight into the collection. Each unnecessary split adds indexing work and risks separating statements that only make sense together.

## What makes a good segment

A good segment is the smallest span that still answers a question on its own: a complete statement or a tight group of statements about one subtopic, typically a paragraph or a short section. Segments are most useful when the source has clear headings, paragraphs, and complete statements — the segmenter preserves those boundaries instead of cutting mid-thought.

Watch the failure modes of messy sources. Tables lose their headers, OCR drops line structure, transcripts ramble across topics, and exported documents repeat running headers on every page. Review results from those sources before indexing, and prefer cleaning the source (fixing headings, removing boilerplate) over asking the segmenter to guess around it.

## Prepare source text

Supply complete source text whenever possible. Segments are most useful when the source has clear headings, paragraphs, and complete statements. Review results from tables, OCR, transcripts, or documents with repeated headers before indexing them.

Use sanitization only when omitted content is genuinely irrelevant to retrieval. When exact source wording, legal fidelity, or full traceability matters, retain and review the source text instead.

For the supported request, response, authentication, and error contract, use the API Reference:

<script src="https://inference.aivax.net/apidocs?embed-target=Segment%20text&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

For current service availability and account limits, see [Plans and Limits](../limits.md).
