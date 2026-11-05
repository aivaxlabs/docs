---
{title: Input and Multimodality,linkTitle: Input and multimodality,weight: 50,group: Inference}
---

# Input and multimodality

Send the conversation in `messages`, using the OpenAI roles `system`, `user`, `assistant`, and `tool`. With an AI Gateway, the gateway's system instructions are added to the `system` messages you send.

## Content parts

AIVAX accepts OpenAI-compatible message content parts for text, images, audio, videos, and files. The selected model must support the modality unless you ask AIVAX to [pre-process the media into text](multimodal-pre-processing.md).

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe these inputs briefly."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/png;base64,<BASE64_PNG_CONTENT>",
                        "detail": "auto"
                    }
                },
                {
                    "type": "input_audio",
                    "input_audio": {
                        "data": "<BASE64_WAV_CONTENT>",
                        "format": "wav"
                    }
                },
                {
                    "type": "file",
                    "file": {
                        "filename": "document.pdf",
                        "file_data": "data:application/pdf;base64,<BASE64_PDF_CONTENT>"
                    }
                }
            ]
        }
    ]
}
```

Supported content part mappings:

- `text`: Plain text.
- `image_url`: Image content. `image_url.url` can be an external URL or a base64 data URL. `image_url.detail` can be `low`, `high`, or `auto` when the model supports it.
- `video_url`: Video content. `video_url.url` can be an external URL or a base64 data URL. Prefer URLs for large videos.
- `input_audio`: Audio content. `input_audio.data` is base64 audio data, and `input_audio.format` names the format.
- `file`: File content. `file.filename` names the file, and `file.file_data` can be an external URL or a base64 data URL.

For video input, send a `video_url` content part. The following example uses a base64 data URL; for large videos, prefer a publicly reachable URL:

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Summarize the main actions in this video and identify any visible safety risks."
                },
                {
                    "type": "video_url",
                    "video_url": {
                        "url": "data:video/mp4;base64,<BASE64_MP4_CONTENT>"
                    }
                }
            ]
        }
    ]
}
```

External links must be accessible to AIVAX without authentication, firewall restrictions, or JavaScript-only rendering. The inference can fail because of failed downloads, redirects, blocked URLs, unsupported formats, or provider-specific size limits.

## Prompt shortcut

For a simple text-only request, you can send `prompt` instead of `messages`:

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Say hello"
}
```

## Media requirements

Requests with media require a minimum account balance: files and videos need a higher balance than images and audio. Media is billed by the selected model according to its input rates. Review [Pricing](/docs/pricing.md) and [Plans and limits](/docs/limits.md) before using media in production.

When the selected model does not support a modality, convert the media into text with [multimodal pre-processing](multimodal-pre-processing.md).

## When a multimodal request fails

Narrow down the problem:

1. Test a simple text message with the same model.
2. Test one small attachment.
3. Test the same attachment with `multimodal_resolver`.
4. Review the URL, format, size, and model modality support.
