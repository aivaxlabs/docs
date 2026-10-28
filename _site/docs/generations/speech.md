Source: https://docs.aivax.net/docs/generations/speech.html

# Text-to-Speech (TTS)

Use Speech Generation when your application already has final text and needs playable audio without running a chat completion. Typical uses include narrating an article or notification, voicing an IVR prompt, producing a draft voice-over for review, or generating audio files for offline playback.

Authenticate requests with an AIVAX API key. See [Authentication](https://docs.aivax.net/docs/authentication.md) for authorization guidance.

## Choose the delivery form

The endpoint can return audio in two forms, and the right choice depends on the consumer:

- **Binary audio (`raw: true`)** — the response body is the audio file itself, served inline with its MIME type. Use this when a player, browser `<audio>` element, or download flow consumes the response directly.
- **Base64 in the JSON envelope (`raw: false`)** — the response contains the format, MIME type, and base64-encoded audio inside the standard envelope. Use this when the result travels through JSON pipelines, gets stored in a database, or needs to be inspected alongside billing metadata.

Supported formats are `mp3`, `wav`, and `ogg`. When the consumer accepts any of them, prefer `mp3` for smaller payloads and `wav` for maximum compatibility with audio tooling.

## Generate speech

Write text that is ready to be spoken aloud, including punctuation and formatting that communicate pauses or emphasis. Expand abbreviations and numerals the way they should be heard, such as "doctor" instead of "Dr." or "twenty twenty-six" instead of "2026", rather than trusting the voice to guess.

Test the selected voice with representative content before using it in production, especially for names, abbreviations, or specialized terms. Voices differ per speech model, so confirm the voice against the model you will use rather than assuming one model's voices exist in another.

The embedded reference is the source of truth for available models and voices, request options, output formats, and response fields.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Generate%20speech)

To let an MCP-compatible agent or IDE synthesize speech without calling this endpoint directly, use the [Media generation MCP](https://docs.aivax.net/docs/mcp-utilities/media-generation-mcp.md). It returns a public URL to MP3 audio instead of inline audio.

## Speech or Voice Sessions

Use Speech Generation for one-shot synthesis of known text. Use [Voice Sessions](https://docs.aivax.net/docs/inference/voice-session.md) when the experience is an interactive spoken conversation with interruptions, turn-taking, and tool calls. Chaining transcription, inference, and synthesis manually adds latency that the realtime session avoids.

## Pricing, limits, and errors

Speech generation price varies by model; current tariffs are listed in the Models catalog.

| Limit | Free | Pro | Max |
| --- | --- | --- | --- |
| Standalone text-to-speech requests | 3/min and 40/hour | 30/min | 300/min |

Voice Sessions are not subject to these standalone request quotas; they follow the selected realtime model's access, balance, and inference limits. Review reported validation errors before retrying a failed request.
