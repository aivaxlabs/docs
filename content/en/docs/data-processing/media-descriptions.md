---
{title: Media Descriptions,linkTitle: Media Descriptions,weight: 10,group: Data processing,aliases: [/docs/generations/media-descriptions.html]}
---

# Media Descriptions

Use Media Descriptions when an application needs structured information from audio, images, video, or PDF content. Typical uses include preparing media for search, moderation review, accessibility workflows, and downstream automation.

Choose the more specialized API when the task is limited to a single medium, such as [Audio Transcriptions](/docs/generations/audio-transcriptions) for speech-to-text.

## Media Descriptions, Extraction, or Fetch

- **Media Descriptions** interprets images, PDFs, audio, and video and returns generated text guided by your instructions. Use it to explain a chart, describe a photo, or answer a question about a video.
- **[Extraction](extraction.md)** reads text, images, and PDFs and returns the fields defined by your JSON schema, one object per document. Use it when you need the same fields, such as totals or identifiers, from every document. [Summarization](summarization.md) is its counterpart for short summaries.
- **[Fetch and OCR](/docs/web-foundation/fetch-and-ocr)** returns the readable text of web pages and documents. Use it when you need the full text, for example to index it.

## Describe media or reason over it directly

There are two ways to extract information from media, and they serve different needs:

- **Describe media, then decide** — use this endpoint when you need a reusable text artifact: a description stored for search, a transcript-like record for audit, or input text for a later workflow stage that runs independently.
- **Multimodal inference in one request** — send the media straight to a chat model that supports the input type when the model should reason over it immediately and no intermediate artifact is needed. See [Inference](/docs/inference/inference.md).

Prefer Media Descriptions when the extraction guidance is stable and the result feeds several consumers. Prefer direct multimodal inference when the question about the media changes on every request.

## Describe media

Provide media that AIVAX can access, and use guidance that focuses the extraction on the information your workflow needs. The optional `extractionGuidance` instruction narrows the output — "identify the main subject and visible text" for an image, "summarize the sequence of events" for a video — so write it as the question your workflow needs answered.

Each submitted item is handled independently and results come back in input order, so keep the positions aligned when correlating results with the original media. Under the `auto` preset, remote file URLs are downloaded before processing, within a size limit (see [Pricing, limits, and errors](#pricing-limits-and-errors)). Switch to `high` when the service should receive the remote URL directly.

For remote media, make sure the resource remains accessible for the duration of processing and does not require interactive sign-in. Avoid sending credentials, personal data, or other content that must not appear in a generated description.

The embedded reference is the source of truth for accepted media forms, request options, and response fields.

<script src="https://inference.aivax.net/apidocs?embed-target=Describe%20media&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Pricing, limits, and errors

| Description | Pricing |
| --- | ---: |
| Media descriptions | **~$1.50/M tokens** |

The price is approximate and depends on the available processing model.

Under the `auto` preset, remote files are downloaded by AIVAX up to 5 MB each. For account-level limits, see [Plans and Limits](/docs/limits).

Correct inaccessible media or invalid content before retrying.
