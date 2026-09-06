# Media Injector

Media Injector turns a source file into focused, self-contained documents inside an AIVAX RAG collection. It examines the source, identifies materially useful knowledge, writes concise factual documents in the source's predominant language, and queues those documents for semantic indexing.

Use Media Injector when you have a file whose useful knowledge has not already been split into retrieval-ready text. If you already have clean document strings, use [Create or Update Document or JSONL import](collections.md#document-fields) instead; those paths are more predictable and avoid the additional processing needed to interpret a source file.

## When to use it

Media Injector is useful for:

- PDFs such as reports, manuals, and policies that contain several independent topics.
- Images or scanned pages whose visible content should become searchable knowledge.
- Audio and video whose material facts should be available through RAG.

It is not a general file-storage feature and does not preserve the source as one searchable document. The output is a set of generated RAG documents. Review those documents after processing when wording, coverage, legal fidelity, or sensitive-data handling is important.

Use direct document import when you need exact source wording, deterministic boundaries, stable document names, or application-controlled metadata. Use [Text Segmentation](text-segmentation.md) when you only need cohesive source-text segments returned to your application without creating collection documents.

## How ingestion works

In the AIVAX dashboard:

1. Open the target collection and choose **Import from files**.
2. Select one or more source files.
3. Optionally provide processing context. The same context is applied to every selected file.
4. Confirm the import. The dashboard uploads the files sequentially, and a separate job is created for each file after all of its chunks have reached AIVAX.
5. Follow the jobs under **Batch > Media Processing**.
6. After each job completes, review the generated documents and wait for their indexing state before testing [Semantic Search](semantic-search.md).

A job can be `queued`, `processing`, `completed`, `failed`, or `cancelled`. The dashboard reports the source file, elapsed time, number of documents produced, and current cost. Failed or cancelled jobs may be retried when their recoverable uploaded data is still available.

Audio and video can be divided into time-based segments for processing. Segmentation is automatic and does not change the original file name shown for the job. See [Plans and limits](../limits.md) for current upload limits.

## Define processing context

Processing context is an optional instruction that helps Media Injector decide which facts are most valuable for your knowledge base. It is considered together with the source, but it is not treated as a factual source and cannot add facts that are absent from the file.

Good context describes:

- The source's identity and purpose.
- The audience that will search the collection.
- The topics, products, jurisdictions, periods, or fields that matter.
- Ambiguous labels or internal terminology that the source itself establishes.
- Content that should be deprioritized, such as repeated headers or administrative boilerplate.

Example:

```text
This is the 2026 support policy for Acme Cloud customers in Brazil. Prioritize eligibility rules, deadlines, plan differences, exceptions, and the steps a support agent must communicate. Ignore repeated page headers and signature blocks.
```

Avoid asking the mechanism to infer conclusions, supply missing information, or use outside knowledge. For example, do not instruct it to decide whether a contract is legally enforceable or to calculate values the source does not report.

Processing context is different from a collection's context. Processing context guides this import only. Collection context describes the knowledge base to an AI Gateway when the collection is used later. Put source-specific ingestion guidance here; keep durable collection-wide guidance in the collection settings.

## Accepted source types

The dashboard accepts four source groups for Media Injector:

| Source group | Processing behavior |
| --- | --- |
| PDF documents | Reads document structure, text, and relevant visual content. |
| Images | Interprets visible text and content to produce textual RAG documents. |
| Audio | Interprets spoken and other relevant audible content; large files are segmented automatically. |
| Video | Interprets relevant visual and audible content; large files are segmented automatically. |

Use the original, accurate file extension because AIVAX uses it to identify the media type. A mislabeled extension can select the wrong processing path or make the job fail. Container and codec support can vary; if an audio or video file fails, convert it to a common format and retry.

## Generated documents

Each generated item is designed to be a useful knowledge unit rather than a page-by-page transcription. Media Injector:

- Prioritizes source identity, scope, principal facts, relationships, exceptions, and material distinctions.
- Combines closely related facts instead of creating one document per label, table cell, or repeated value.
- Ignores decorative text, pagination, repeated summaries, and incidental metadata unless they change meaning.
- Preserves the source's language, terminology, displayed dates, and number formats.
- Stops when the source has no materially new knowledge to add.

Generated documents are tagged so they can be identified as automatically produced content. They are then indexed like other collection documents and incur the collection's normal text-embedding cost in addition to Media Injector processing.

For retrieval-quality guidance after ingestion, see [Best Practices for RAG](best-practices.md). In particular, inspect documents generated from tables, scans, and sources with repeated layouts before relying on them in production.

## Usage, pricing, and limits

Media Injector usage depends on the source, optional context, generated questions and answers, cache reuse, and media tokens when applicable. Billing aggregates input, cached input, output, and media usage for the processing job without exposing the underlying processing model. See [Pricing](../pricing.md#media-injector) for the final rates.

Media Injector availability and operational limits depend on the account configuration. See [Pricing](../pricing.md) and [Plans and limits](../limits.md) before uploading files in production.
