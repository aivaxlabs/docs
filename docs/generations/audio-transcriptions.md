# Audio Transcriptions

Use Audio Transcriptions to convert recorded speech into text for search, review, captions, or downstream automation. Send the audio in a supported request form and use the returned transcription in the next stage of your workflow.

Authenticate requests with an AIVAX API key. See [Authentication](/docs/authentication) for authorization guidance.

## Choose a transcription model

Query the available transcription models for the authenticated account before selecting one. Availability can vary by account configuration, so do not hard-code a catalog in your application.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Audio%20Transcription%20Models&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Transcribe audio

Provide audio that is accessible to AIVAX and preserve the original language context when it matters to your use case. Review the returned text before using it in user-visible or irreversible actions: noisy recordings, multiple speakers, specialized vocabulary, and poor microphone quality can affect transcription quality.

The embedded reference is the source of truth for accepted request forms, options, and response fields.

<script src="https://inference.aivax.net/apidocs?embed-target=Transcribe%20audio&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Pricing, limits, and errors

For current availability, pricing, and account limits, see [Pricing](/docs/pricing) and [Plans and Limits](/docs/limits). Correct invalid or inaccessible audio before retrying a failed request.
