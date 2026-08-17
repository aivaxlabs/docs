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
| `file` | `file.filename` plus `file.file_data` | Extracts the structure and text of PDF files. Other file formats are not supported by this endpoint. |

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

The response contains one resolver-generated JSON object for each input item in the same order. The object shape depends on the content type. For example, an image and a PDF produce objects like these:

```json
{
  "message": null,
  "data": [
    {
      "foregroundSubjects": [
        {
          "description": "A person standing beside a table.",
          "position": "center"
        }
      ],
      "backgroundSubjects": [],
      "parsedText": [],
      "imageData": {
        "format": "JPEG",
        "hasTransparency": false,
        "isUnsafe": false
      }
    },
    {
      "textContent": "The extracted PDF text.",
      "sections": [],
      "fileData": {
        "format": "PDF",
        "language": "English",
        "isUnsafe": false
      }
    }
  ]
}
```

If any item is invalid or cannot be resolved, the request fails instead of returning a partial array. Process unrelated items in separate requests when partial success is required.

<script src="https://inference.aivax.net/apidocs?embed-target=Describe%20media&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Usage and limits

Image, audio, video, and PDF processing can invoke auxiliary integrated models and record inference usage. This endpoint does not provide a cache guarantee: repeated requests for the same content may invoke processing again. There is no dedicated media-description quota; requests are subject to the applicable inference request and token limits. See [Plans and limits](/docs/limits) for the limits that may apply.

A `402 Payment Required` response means that the account either does not have a positive balance or has exceeded its storage quota.
