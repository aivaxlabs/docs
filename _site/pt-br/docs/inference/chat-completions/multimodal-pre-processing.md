Source: https://docs.aivax.net/pt-br/docs/inference/chat-completions/multimodal-pre-processing.html

# Pré-processamento multimodal

Use `multimodal_resolver` quando o modelo principal deve receber uma descrição textual da mídia em vez do objeto de mídia original. Isso é útil para modelos focados em texto ou quando você deseja que a AIVAX normalize os arquivos antes da inferência principal. O objeto escolhe um mecanismo (engine) para cada tipo de conteúdo; os tipos omitidos ou `null` são enviados ao modelo principal inalterados.

```json
{
    "model": "@meta/llama-3.3-70b",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Descreva este arquivo brevemente."
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

| Campo | Mecanismos aceitos |
| --- | --- |
| `imageEngine` | `InferenceLow`, `InferenceHigh`, `Ocr` |
| `audioEngine` | `InferenceLow`, `InferenceHigh`, `Stt` |
| `videoEngine` | `InferenceLow`, `InferenceHigh` |
| `fileEngine` | `InferenceLow`, `InferenceHigh`, `Ocr` |

`Inference` é aceito como um alias de `InferenceLow`. Os mecanismos funcionam da seguinte maneira:

- `InferenceLow` descreve o conteúdo com um modelo multimodal menor e de custo mais baixo.
- `InferenceHigh` descreve o conteúdo com um modelo multimodal maior, mais preciso e de custo mais elevado.
- `Ocr` extrai o texto de imagens e arquivos usando o mesmo serviço de extração do [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md), cobrado em Unidades de Processamento. Aceita dados URI base64 e URLs públicos.
- `Stt` transcreve a fala no áudio usando o modelo padrão de [speech-to-text](https://docs.aivax.net/pt-br/docs/pricing.md) e é cobrado por segundo de áudio. Música e sons ambientes não são descritos.

Com `InferenceLow` ou `InferenceHigh`, `fileEngine` envia PDFs para o modelo multimodal e converte outros tipos de arquivo com OCR. Com `Ocr`, todo arquivo, incluindo PDFs, é convertido com OCR.

Os resultados são armazenados em cache por conteúdo e mecanismo para reutilização, portanto, a mesma mídia resolvida com o mesmo mecanismo não é cobrada novamente. Alterar o mecanismo processa e cobra o conteúdo novamente. Consulte [Caching](https://docs.aivax.net/pt-br/docs/inference/chat-completions/caching.md).

## Escolher um mecanismo

| Conteúdo | Mecanismo | Quando |
| --- | --- | --- |
| Documentos digitalizados, capturas de tela de texto, formulários | `Ocr` | O texto é mais importante do que o layout ou o conteúdo visual. |
| Fotos, gráficos, diagramas | `InferenceLow` ou `InferenceHigh` | O modelo precisa entender o que a imagem mostra. Use `InferenceHigh` quando pequenos detalhes forem importantes. |
| Chamadas, notas de voz, reuniões | `Stt` | As palavras faladas são o que importa. |
| Áudio onde tom, música ou sons são importantes | `InferenceLow` ou `InferenceHigh` | Uma transcrição perderia as informações. |
| Vídeo | `InferenceLow` ou `InferenceHigh` | Apenas descrições multimodais estão disponíveis. |

O modelo principal recebe apenas o texto resultante, portanto, não pode responder a perguntas sobre detalhes que a descrição omitiu. Se os usuários fizerem perguntas de acompanhamento sobre a mesma mídia, um modelo que aceita a mídia diretamente geralmente fornece melhores respostas. Para definir os mecanismos para todas as solicitações, configure-os em um [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md#multimodal-pre-processing) como `multimodalResolverParameters`.

## `multimodal_preprocess` obsoleto

As flags `multimodal_preprocess` continuam sendo aceitas para compatibilidade, mas estão obsoletas. Use `multimodal_resolver` em vez disso; quando ambas são enviadas, `multimodal_resolver` é usado. As flags mapeiam para os novos mecanismos da seguinte forma:

| Flag legada | Equivalente |
| --- | --- |
| `Image` | `imageEngine: "InferenceLow"` |
| `Audio` | `audioEngine: "InferenceLow"` |
| `Video` | `videoEngine: "InferenceLow"` |
| `File` | `fileEngine: "InferenceLow"` |
| `OtherFiles` | `fileEngine: "Ocr"` |
| `All` | Todos os acima, com `fileEngine: "InferenceLow"` |

Como um único mecanismo agora cobre todos os tipos de arquivo, `OtherFiles` sozinho também converte PDFs com OCR, e `File` sozinho também converte arquivos não-PDF com OCR. Anteriormente, os tipos de arquivo fora da flag selecionada eram enviados ao modelo principal inalterados.
