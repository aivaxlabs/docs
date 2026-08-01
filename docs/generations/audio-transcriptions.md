# Audio Transcriptions

Use audio transcriptions to convert speech from one audio file into text. The dedicated endpoint accepts base64-encoded audio, lets you select an available speech-to-text model, and returns the transcription in the standard AIVAX JSON envelope.

Use [Media Descriptions](media-descriptions.md) instead when you need to process several media items in one request, describe non-speech audio, analyze images or video, or extract text from documents.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/audio/transcriptions</span>
</div>

## Request

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `input_audio` | `object` | Yes | Contains the base64 audio and its format. |
| `input_audio.data` | `string` | Yes | Raw base64-encoded audio content. Do not include a data-URL prefix. |
| `input_audio.format` | `string` | Yes | One of `wav`, `mp3`, `m4a`, `flac`, `ogg`, `webm`, or `aac`. |
| `model` | `string` | No | Speech-to-text model identifier. When omitted, AIVAX uses the current default model. |
| `language` | `string` | No | Language hint passed to the selected model. Omit it to allow automatic detection when the model supports it. |

The decoded audio file must not be empty or exceed 75 MB. The declared format must match audio that AIVAX can decode.

```json
{
  "model": "x-ai/grok-stt-1.0",
  "input_audio": {
    "data": "UklGRiQAAABXQVZFZm10...",
    "format": "wav"
  },
  "language": "en"
}
```

The available models, default selection, supported formats, and duration-based prices are published by the audio transcription model catalog:

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Audio%20Transcription%20Models&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Response

A successful request returns AIVAX's stable transcription contract inside `data`. The response does not expose provider-specific fields. `usage.cost` is the final amount charged in USD, including the account's applicable multiplier, and `usage.process_time` is the processing time in seconds.

```json
{
  "message": null,
  "data": {
    "text": "Transcribed speech.",
    "usage": {
      "cost": 0.000028,
      "process_time": 1.234
    }
  }
}
```

<script src="https://inference.aivax.net/apidocs?embed-target=Transcribe%20audio&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Billing and errors

Transcription is billed by audio duration at the selected model's published rate. AIVAX measures the decoded file and rounds its duration up to the next whole second for usage accounting.

A request can fail when the model is unavailable, the base64 or format is invalid, the audio cannot be decoded, the account has no positive balance, or a request limit is exceeded. Check the model catalog at runtime instead of hard-coding the available model list or default model.
