# Speech Generation

Use speech generation when your application already has the final text and needs playable audio without running a chat completion. AIVAX sends the text to the selected text-to-speech model, converts the result to WAV or MP4, records the model usage, and returns either binary audio or base64 inside the standard JSON response envelope.

Before calling this endpoint, [create an API key](/docs/authentication) and make sure the account has a positive balance. The model name identifies the speech engine; `voice` is provider-specific, so use a voice supported by the selected model.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/speech</span>
</div>

Supported model names are:

| Model | Backing model | Default voice when omitted |
| --- | --- | --- |
| `Gpt4oTts` | `gpt-4o-mini-tts` | `nova` |
| `ElevenMultilingualV2` | `eleven-multilingual-v2` | `nova` |
| `ElevenV3` | `eleven-v3` | `nova` |
| `GrokVoice` | `x-ai/grok-voice-tts-1.0` | `Eve` |

## Request behavior

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `string` | Required | One of the supported model names above. Matching is case-insensitive. |
| `input` | `string` | Required | Non-empty text to synthesize. |
| `voice` | `string` | Model default | Provider-specific voice name. |
| `format` | `string` | `wav` | Output container: `wav` or `mp4`. |
| `raw` | `boolean` | `false` | Returns binary audio when `true`; returns base64 JSON when `false`. |

When `raw` is `true`, the response content type is `audio/wav` or `audio/mp4`, and the filename is exposed through `Content-Disposition`. When `raw` is `false`, `data.format`, `data.mimeType`, and `data.data` describe the generated audio; `data.data` is the base64 value.

The endpoint records the text-to-speech costs returned by the selected model and associates the usage with the authenticated API key. The normal [plan commission multiplier](/docs/pricing#usage-billing) applies. There is currently no dedicated speech-generation plan quota; authentication-level request limits still apply to public API keys.

The embedded API reference below contains the request and response examples used by the server documentation:

<script src="https://inference.aivax.net/apidocs?embed-target=Generate%20speech&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

After receiving base64 JSON, decode `data.data` using the format in `data.format`. If the consumer can stream or save the HTTP body directly, set `raw` to `true` to avoid base64 overhead.
