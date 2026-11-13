Source: https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.html

# Descrições de Mídia

Use Descrições de Mídia quando um aplicativo precisar de informações estruturadas a partir de áudio, imagens, vídeo ou conteúdo PDF. Os usos típicos incluem preparar mídia para busca, revisão de moderação, fluxos de trabalho de acessibilidade e automação posterior.

Escolha a API mais especializada quando a tarefa for limitada a um único tipo de mídia, como [Transcrições de Áudio](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) para fala-para-texto.

## Descrições de Mídia, Extração ou Busca

- **Descrições de Mídia** interpreta imagens, PDFs, áudio e vídeo e retorna texto gerado guiado pelas suas instruções. Use-o para explicar um gráfico, descrever uma foto ou responder a uma pergunta sobre um vídeo.
- **[Extração](https://docs.aivax.net/pt-br/docs/data-processing/extraction.md)** lê texto, imagens e PDFs e retorna os campos definidos pelo seu esquema JSON, um objeto por documento. Use-o quando precisar dos mesmos campos, como totais ou identificadores, em todos os documentos. O [Resumo](https://docs.aivax.net/pt-br/docs/data-processing/summarization.md) é o seu equivalente para resumos curtos.
- **[Buscar e OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md)** retorna o texto legível de páginas da web e documentos. Use-o quando precisar do texto completo, por exemplo, para indexá-lo.

## Descrever mídia ou raciocinar diretamente sobre ela

Existem duas maneiras de extrair informações da mídia, e elas atendem a necessidades diferentes:

- **Descrever a mídia e depois decidir** — use este endpoint quando você precisa de um artefato de texto reutilizável: uma descrição armazenada para busca, um registro semelhante a uma transcrição para auditoria ou texto de entrada para uma etapa posterior do fluxo de trabalho que é executada independentemente.
- **Inferência multimodal em uma única solicitação** — envie a mídia diretamente para um modelo de chat que suporte o tipo de entrada quando o modelo deve raciocinar sobre ela imediatamente e nenhum artefato intermediário for necessário. Consulte [Inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md).

Prefira Descrições de Mídia quando a orientação de extração for estável e o resultado alimentar vários consumidores. Prefira a inferência multimodal direta quando a pergunta sobre a mídia mudar a cada solicitação.

## Descrever mídia

Forneça mídia que o AIVAX possa acessar e use orientações que concentrem a extração nas informações que seu fluxo de trabalho precisa. A instrução opcional `extractionGuidance` restringe a saída — "identifique o assunto principal e o texto visível" para uma imagem, "resuma a sequência de eventos" para um vídeo — então escreva-a como a pergunta que seu fluxo de trabalho precisa ter respondida.

Cada item enviado é tratado independentemente e os resultados retornam na ordem de entrada, portanto, mantenha as posições alinhadas ao correlacionar os resultados com a mídia original. URLs de arquivos remotos são baixados antes do processamento, dentro de um limite de tamanho (consulte [Preços, limites e erros](#precos-limites-e-erros)).

## Escolher os motores

O objeto `options` opcional seleciona o motor que resolve cada tipo de conteúdo. Motores omitidos usam `InferenceLow`.

```json
{
    "options": {
        "imageEngine": "InferenceHigh",
        "audioEngine": "Stt",
        "videoEngine": "InferenceLow",
        "fileEngine": "Ocr"
    },
    "input": [ ... ]
}
```

| Campo | Valores aceitos |
| --- | --- |
| `imageEngine` | `InferenceLow`, `InferenceHigh`, `Ocr` |
| `audioEngine` | `InferenceLow`, `InferenceHigh`, `Stt` |
| `videoEngine` | `InferenceLow`, `InferenceHigh` |
| `fileEngine` | `InferenceLow`, `InferenceHigh`, `Ocr` |

- `InferenceLow` descreve o conteúdo com um modelo multimodal menor, mais rápido e mais barato.
- `InferenceHigh` usa um modelo multimodal maior que é mais preciso e custa mais. Use-o quando pequenos detalhes forem importantes.
- `Ocr` extrai o texto de imagens e arquivos. Com `fileEngine: "Ocr"`, qualquer documento suportado é convertido, não apenas PDFs.
- `Stt` transcreve a fala no áudio com um modelo de fala-para-texto.

Os motores de inferência retornam uma descrição estruturada cuja forma depende do tipo de conteúdo. `Ocr` e `Stt` retornam `{ "textContent": "..." }` e ignoram `extractionGuidance`. Os motores correspondem aos do [Pré-processamento Multimodal](https://docs.aivax.net/pt-br/docs/inference/chat-completions/multimodal-pre-processing.md).

A propriedade `preset` está obsoleta. Ela não pode ser combinada com `options`; uma solicitação que envia ambos é rejeitada com `400`.

Para mídia remota, certifique-se de que o recurso permaneça acessível durante a duração do processamento e não exija login interativo. Evite enviar credenciais, dados pessoais ou outro conteúdo que não deve aparecer em uma descrição gerada.

A referência embutida é a fonte da verdade para formas de mídia aceitas, opções de solicitação e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Describe%20media)

## Preços, limites e erros

| Descrição | Preço |
| --- | ---: |
| Descrições de mídia | **~$1,50/M tokens** |

O preço é aproximado e depende do motor selecionado. `InferenceHigh` custa mais que `InferenceLow`; `Ocr` e `Stt` são cobrados conforme o uso de OCR e fala-para-texto.

Arquivos remotos são baixados pelo AIVAX até 5 MB cada. O número de solicitações por minuto depende do plano; consulte [Limites de processamento de dados](https://docs.aivax.net/pt-br/docs/limits.md#data-processing).

Corrija mídia inacessível ou conteúdo inválido antes de tentar novamente.
