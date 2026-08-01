# Media Descriptions

Use media descriptions to turn one or more multimodal content parts into text without requesting a separate chat-completion answer. Each item is processed independently, and the response preserves input order.

This endpoint is useful for document extraction, image analysis, video description, audio transcription, and describing music, ambient sound, or other audio artifacts before sending the resulting text to another system.

Choose the more specialized API when appropriate:

- Use [Audio Transcriptions](audio-transcriptions.md) for dedicated speech-to-text from one audio file, selectable transcription models, an optional language hint, and duration-based pricing.
- Use [Inference](/docs/inference/inference) with `multimodal_preprocess` when a model must answer a question about the media after it is resolved.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/descriptions</span>
</div>

The `input` property must be a non-empty array of OpenAI-compatible multimodal content parts:

| Content type | Payload | Behavior |
| --- | --- | --- |
| `image_url` | `image_url.url` | Produces a detailed visual description, visible text, and image metadata. |
| `input_audio` | Base64 `input_audio.data` plus `input_audio.format` | Transcribes speech and describes music, ambient sound, and other audio artifacts. |
| `video_url` | `video_url.url` | Describes visual content and transcribes speech or other audio. |
| `file` | `file.filename` plus `file.file_data` | Extracts PDF structure and text, or uses local extraction for other supported document formats. |

```json
{
  "input": [
    {
      "type": "input_audio",
      "input_audio": {
        "data": "UklGRiQAAABXQVZFZm10...",
        "format": "wav"
      }
    },
    {
      "type": "file",
      "file": {
        "filename": "example.pdf",
        "file_data": "https://example.com/example.pdf"
      }
    }
  ]
}
```

Remote file URLs are downloaded by AIVAX before resolution and are limited to 5 MB. The URL must be absolute, safe, publicly reachable, and must not require browser-side JavaScript or interactive authentication. You can also send files as `data:<mime-type>;base64,<content>` values.

## Response and ordering

The response contains one text content part for each input item in the same order:

```json
{
  "message": null,
  "data": [
    {
      "type": "text",
      "text": "The first media description."
    },
    {
      "type": "text",
      "text": "The second media description."
    }
  ]
}
```

If any item is invalid or cannot be resolved, the request fails instead of returning a partial array. Process unrelated items in separate requests when partial success is required.

<script src="https://inference.aivax.net/apidocs?embed-target=Describe%20media&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Caching, usage, and limits

The resolver caches descriptions by content hash for the authenticated account. Repeated content can reuse cached text, but cache availability is not permanent. Store the returned text when your application needs its own durable copy.

Images, audio, video, and PDF processing can invoke auxiliary integrated models and record inference usage. Supported non-PDF files can use local text extraction instead. There is no dedicated media-description quota; auxiliary model calls still pass through integrated-model request and token limits, while cache hits and local extraction do not create a separate multimodal rate-limit transaction. See [Plans and limits](/docs/limits) for the inference limits that may apply.
