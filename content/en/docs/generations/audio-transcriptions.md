---
{title: Speech-to-Text (STT),linkTitle: Speech-to-text (STT),weight: 30,group: Media generation}
---

# Speech-to-Text (STT)

Use Audio Transcriptions to convert recorded speech into text for search, review, captions, or downstream automation. Typical uses include transcribing meetings and interviews, captioning recorded videos, making voice notes searchable, and feeding spoken input into classification or RAG pipelines.

Authenticate requests with an AIVAX API key. See [Authentication](/docs/authentication) for authorization guidance.

## Choose a transcription model

Query the available transcription models for the authenticated account before selecting one. Availability can vary by account configuration, so do not hard-code a catalog in your application.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Audio%20Transcription%20Models&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Transcribe audio

Send the audio as base64 with its format (`wav`, `mp3`, `m4a`, `flac`, `ogg`, `webm`, or `aac`). Decoded audio is subject to the size limit in [Pricing, limits, and errors](#pricing-limits-and-errors). Billing follows the measured media duration, and files with no measurable duration are rejected.

Provide the optional `language` hint when the spoken language is known. It steers recognition toward that language and helps with accented speech and domain vocabulary; omit it when the language genuinely varies within one file and let detection handle it.

Review the returned text before using it in user-visible or irreversible actions: noisy recordings, multiple speakers, specialized vocabulary, and poor microphone quality can affect transcription quality. The endpoint returns the transcript text, not speaker labels, so plan a diarization or review step downstream for files where speaker attribution matters.

The embedded reference is the source of truth for accepted request forms, options, and response fields.

<script src="https://inference.aivax.net/apidocs?embed-target=Transcribe%20audio&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## After the transcript

A transcript is usually the start of a pipeline, not the end. Index it into a [RAG collection](/docs/rag/collections.md) to make recordings searchable, run it through [Batch](/docs/inference/batch.md) when there are many files, or feed it to [Text classification](/docs/data-processing/classification.md) to label conversations at scale. For live conversation instead of recorded audio, use [Voice Sessions](/docs/inference/voice-session).

## Pricing, limits, and errors

Transcription price varies by model; current tariffs are listed in the Models catalog.

| Limit | Free | Pro | Max |
| --- | --- | --- | --- |
| Standalone audio-transcription requests | 3/min and 40/hour | 30/min | 300/min |

Transcription requests have a quota separate from speech generation, with the same values. Decoded audio is limited to 75 MB per request. Correct invalid or inaccessible audio before retrying a failed request.
