# Descrições de Mídia

Use descrições de mídia para transformar uma ou mais partes de conteúdo multimodal em texto sem solicitar uma resposta de conclusão de chat separada. Cada item é processado de forma independente, e a resposta preserva a ordem de entrada.

Este endpoint é útil para extração de documentos, análise de imagens, descrição de vídeos, transcrição de áudio e descrição de música, som ambiente ou outros artefatos de áudio antes de enviar o texto resultante para outro sistema.

Escolha a API mais especializada quando apropriado:

- Use [Transcrições de Áudio](audio-transcriptions.md) para conversão dedicada de fala para texto a partir de um arquivo de áudio, modelos de transcrição selecionáveis, uma dica opcional de idioma e preço baseado em duração.
- Use [Inferência](/docs/pt-br/inference/inference) com `multimodal_preprocess` quando um modelo deve responder a uma pergunta sobre a mídia após ela ser resolvida.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/descriptions</span>
</div>

A propriedade `input` deve ser um array não vazio de partes de conteúdo multimodal compatíveis com OpenAI:

| Tipo de conteúdo | Payload | Comportamento |
| --- | --- | --- |
| `image_url` | `image_url.url` | Produz uma descrição visual detalhada, texto visível e metadados da imagem. |
| `input_audio` | Base64 `input_audio.data` mais `input_audio.format` | Transcreve fala e descreve música, som ambiente e outros artefatos de áudio. |
| `video_url` | `video_url.url` | Descreve conteúdo visual e transcreve fala ou outro áudio. |
| `file` | `file.filename` mais `file.file_data` | Extrai a estrutura e o texto de arquivos PDF. Outros formatos de arquivo não são suportados por este endpoint. |

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

URLs de arquivos remotos são baixadas pelo AIVAX antes da resolução e são limitadas a 5 MB. A URL deve ser absoluta, segura, publicamente acessível e não pode exigir JavaScript do lado do navegador ou autenticação interativa. Você também pode enviar arquivos como valores `data:<mime-type>;base64,<content>`.

## Resposta e ordenação

A resposta contém um objeto JSON gerado pelo resolvedor para cada item de entrada na mesma ordem. O formato do objeto depende do tipo de conteúdo. Por exemplo, uma imagem e um PDF produzem objetos como estes:

```json
{
  "message": null,
  "data": [
    {
      "foregroundSubjects": [
        {
          "description": "Uma pessoa de pé ao lado de uma mesa.",
          "position": "centro"
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
      "textContent": "O texto extraído do PDF.",
      "sections": [],
      "fileData": {
        "format": "PDF",
        "language": "Inglês",
        "isUnsafe": false
      }
    }
  ]
}
```

Se algum item for inválido ou não puder ser resolvido, a requisição falha em vez de retornar um array parcial. Processe itens não relacionados em requisições separadas quando for necessário sucesso parcial.

<script src="https://inference.aivax.net/apidocs?embed-target=Describe%20media&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Uso e limites

Processamento de imagem, áudio, vídeo e PDF pode invocar modelos auxiliares integrados e registrar uso de inferência. Este endpoint não oferece garantia de cache: requisições repetidas para o mesmo conteúdo podem invocar o processamento novamente. Não há cota dedicada para descrições de mídia; as requisições estão sujeitas aos limites aplicáveis de requisições e tokens de inferência. Veja [Planos e limites](/docs/pt-br/limits) para os limites que podem ser aplicados.

Uma resposta `402 Payment Required` indica que a conta ou não tem saldo positivo ou excedeu sua cota de armazenamento.