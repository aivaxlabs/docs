# Speech Generation

Use Speech Generation when your application already has final text and needs playable audio without running a chat completion. Typical uses include narrating an article or notification, voicing an IVR prompt, producing a draft voice-over for review, or generating audio files for offline playback.

Authenticate requests with an AIVAX API key. See [Authentication](/docs/authentication) for authorization guidance.

## Choose the delivery form

The endpoint can return audio in two forms, and the right choice depends on the consumer:

- **Binary audio (`raw: true`)** — the response body is the audio file itself, served inline with its MIME type. Use this when a player, browser `<audio>` element, or download flow consumes the response directly.
- **Base64 in the JSON envelope (`raw: false`)** — the response contains the format, MIME type, and base64-encoded audio inside the standard envelope. Use this when the result travels through JSON pipelines, gets stored in a database, or needs to be inspected alongside billing metadata.

Supported formats are `mp3`, `wav`, and `ogg`. When the consumer accepts any of them, prefer `mp3` for smaller payloads and `wav` for maximum compatibility with audio tooling.

## Generate speech

Write text that is ready to be spoken aloud, including punctuation and formatting that communicate pauses or emphasis. Expand abbreviations and numerals the way they should be heard ("twenty twenty-six", "doctor" instead of "Dr.") rather than trusting the voice to guess.

Test the selected voice with representative content before using it in production, especially for names, abbreviations, or specialized terms. Voices differ per speech model, so confirm the voice against the model you will use rather than assuming one model's voices exist in another.

The embedded reference is the source of truth for available models and voices, request options, output formats, and response fields.

<script src="https://inference.aivax.net/apidocs?embed-target=Generate%20speech&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Speech or Voice Sessions

Use Speech Generation for one-shot synthesis of known text. Use [Voice Sessions](/docs/inference/voice-session) when the experience is an interactive spoken conversation with interruptions, turn-taking, and tool calls — chaining transcription, inference, and synthesis manually adds latency that the realtime session avoids.

## Pricing, limits, and errors

For current pricing, availability, and account limits, see [Pricing](/docs/pricing) and [Plans and Limits](/docs/limits). Review reported validation errors before retrying a failed request.
