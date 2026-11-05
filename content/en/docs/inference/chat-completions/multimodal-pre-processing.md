---
{title: Multimodal Pre-processing,linkTitle: Multimodal pre-processing,weight: 130,group: Inference}
---

# Multimodal pre-processing

Use `multimodal_resolver` when the main model should receive a textual description of media instead of the original media object. This is useful for text-first models or when you want AIVAX to normalize files before the main inference. The object chooses an engine for each content type; omitted or `null` types are sent to the main model unchanged.

```json
{
    "model": "@meta/llama-3.3-70b",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe this file briefly."
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
    ],
    "multimodal_resolver": {
        "imageEngine": "InferenceLow",
        "audioEngine": "Stt",
        "fileEngine": "InferenceHigh"
    }
}
```

| Field | Accepted engines |
| --- | --- |
| `imageEngine` | `InferenceLow`, `InferenceHigh`, `Ocr` |
| `audioEngine` | `InferenceLow`, `InferenceHigh`, `Stt` |
| `videoEngine` | `InferenceLow`, `InferenceHigh` |
| `fileEngine` | `InferenceLow`, `InferenceHigh`, `Ocr` |

`Inference` is accepted as an alias of `InferenceLow`. The engines work as follows:

- `InferenceLow` describes the content with a smaller, lower-cost multimodal model.
- `InferenceHigh` describes the content with a larger multimodal model that is more accurate and costs more.
- `Ocr` extracts the text of images and files with the same extraction service as [Fetch and OCR](/docs/web-foundation/fetch-and-ocr.md), billed in Processing Units. It accepts base64 data URIs and public URLs.
- `Stt` transcribes the speech in the audio with the default [speech-to-text](/docs/pricing.md) model and is billed per second of audio. Music and ambient sounds are not described.

With `InferenceLow` or `InferenceHigh`, `fileEngine` sends PDFs to the multimodal model and converts other file types with OCR. With `Ocr`, every file, including PDFs, is converted with OCR.

Results are cached by content and engine for reuse, so the same media resolved with the same engine is not billed again. Changing the engine processes and bills the content again. See [Caching](caching.md).

## Choose an engine

| Content | Engine | When |
| --- | --- | --- |
| Scanned documents, screenshots of text, forms | `Ocr` | The text matters more than the layout or the visual content. |
| Photos, charts, diagrams | `InferenceLow` or `InferenceHigh` | The model must understand what the image shows. Use `InferenceHigh` when small details matter. |
| Calls, voice notes, meetings | `Stt` | The words spoken are what matters. |
| Audio where tone, music, or sounds matter | `InferenceLow` or `InferenceHigh` | A transcription would lose the information. |
| Video | `InferenceLow` or `InferenceHigh` | Only multimodal descriptions are available. |

The main model receives only the resulting text, so it cannot answer questions about details the description left out. If users ask follow-up questions about the same media, a model that accepts the media directly usually gives better answers. To set the engines for every request, configure them on an [AI Gateway](/docs/inference/ai-gateways/concepts.md#multimodal-pre-processing) as `multimodalResolverParameters`.

## Deprecated `multimodal_preprocess`

The `multimodal_preprocess` flags remain accepted for compatibility but are deprecated. Use `multimodal_resolver` instead; when both are sent, `multimodal_resolver` is used. The flags map to the new engines as follows:

| Legacy flag | Equivalent |
| --- | --- |
| `Image` | `imageEngine: "InferenceLow"` |
| `Audio` | `audioEngine: "InferenceLow"` |
| `Video` | `videoEngine: "InferenceLow"` |
| `File` | `fileEngine: "InferenceLow"` |
| `OtherFiles` | `fileEngine: "Ocr"` |
| `All` | All of the above, with `fileEngine: "InferenceLow"` |

Because one engine now covers every file type, `OtherFiles` alone also converts PDFs with OCR, and `File` alone also converts non-PDF files with OCR. Previously, the file types outside the selected flag were sent to the main model unchanged.

