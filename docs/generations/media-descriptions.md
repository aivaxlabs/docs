# Media Descriptions

Use media descriptions when your application needs text extracted from media but does not need a separate chat-completion answer. Each input item is processed independently with the same multimodal resolver used by AIVAX inference, and the response preserves input order.

This is useful for transcription, document extraction, image analysis, and video description before sending the resulting text to another system. If you also need a model to answer a question about the media, use [Inference](/docs/inference/inference) with `multimodal_preprocess` instead.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/descriptions</span>
</div>

The `input` property is a non-empty array of OpenAI-compatible multimodal content parts:

| Content type | Payload | Behavior |
| --- | --- | --- |
| `image_url` | `image_url.url` | Produces a detailed visual description, visible text, and image metadata. |
| `input_audio` | Base64 `input_audio.data` plus `input_audio.format` | Transcribes speech and describes music, ambient sound, and other audio artifacts. |
| `video_url` | `video_url.url` | Describes visual content and transcribes speech or other audio. |
| `file` | `file.filename` plus `file.file_data` | Extracts PDF structure and text, or uses local extraction for other supported document formats. |

All supported media types are eligible. Remote file URLs are downloaded by AIVAX before resolution and are limited to 5 MB. The URL must be absolute, safe, publicly reachable, and must not require browser-side JavaScript or interactive authentication. You can also send files as `data:<mime-type>;base64,<content>` values.

Each response item has this shape:

```json
{
    "type": "text",
    "text": "The textual media description"
}
```

The resolver caches descriptions by content hash for the authenticated account. A repeated item can reuse the cached text. Images, audio, video, and PDF processing can invoke auxiliary integrated models and record inference usage; supported non-PDF files can use local text extraction instead.

There is currently no dedicated media-description quota. Auxiliary model calls still pass through integrated-model request and token rate limits, while cache hits and local file extraction do not create a separate multimodal rate-limit transaction. See [Plans and limits](/docs/limits) for the inference limits that may apply.

<script src="https://inference.aivax.net/apidocs?embed-target=Describe%20media&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

After resolving media, store the returned text when your application needs its own durable copy. AIVAX's resolver cache is an optimization and should not replace application-owned data.
