Source: https://docs.aivax.net/docs/generations/audio-transcriptions.html

# Audio Transcriptions

Use Audio Transcriptions to convert recorded speech into text for search, review, captions, or downstream automation. Typical uses include transcribing meetings and interviews, captioning recorded videos, making voice notes searchable, and feeding spoken input into classification or RAG pipelines.

Authenticate requests with an AIVAX API key. See [Authentication](https://docs.aivax.net/docs/authentication.md) for authorization guidance.

## Choose a transcription model

Query the available transcription models for the authenticated account before selecting one. Availability can vary by account configuration, so do not hard-code a catalog in your application.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Get%20Audio%20Transcription%20Models)

## Transcribe audio

Send the audio as base64 with its format (`wav`, `mp3`, `m4a`, `flac`, `ogg`, `webm`, or `aac`). Decoded audio must not exceed 75 MB, and billing follows the measured media duration (see [Pricing](https://docs.aivax.net/docs/pricing.md)) — files with no measurable duration are rejected.

Provide the optional `language` hint when the spoken language is known. It steers recognition toward that language and helps with accented speech and domain vocabulary; omit it when the language genuinely varies within one file and let detection handle it.

Review the returned text before using it in user-visible or irreversible actions: noisy recordings, multiple speakers, specialized vocabulary, and poor microphone quality can affect transcription quality. For files where speaker attribution matters, plan a diarization or review step downstream — the endpoint returns the transcript text, not speaker labels.

The embedded reference is the source of truth for accepted request forms, options, and response fields.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Transcribe%20audio)

## After the transcript

A transcript is usually the start of a pipeline, not the end. Index it into a [RAG collection](https://docs.aivax.net/docs/rag/collections.md) to make recordings searchable, run it through [Batch](https://docs.aivax.net/docs/features/batch.md) when there are many files, or feed it to [Text classification](https://docs.aivax.net/docs/rag/classification.md) to label conversations at scale. For live conversation instead of recorded audio, use [Voice Sessions](https://docs.aivax.net/docs/inference/voice-session.md).

## Pricing, limits, and errors

For current availability, pricing, and account limits, see [Pricing](https://docs.aivax.net/docs/pricing.md) and [Plans and Limits](https://docs.aivax.net/docs/limits.md). Correct invalid or inaccessible audio before retrying a failed request.
