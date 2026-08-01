# Descrições de Mídia

Use descrições de mídia para transformar uma ou mais partes de conteúdo multissensorial em texto sem solicitar uma resposta de chat separada. Cada item é processado de forma independente e a resposta preserva a ordem de entrada.

Esse endpoint é útil para extração de documentos, análise de imagens, descrição de vídeos, transcrição de áudio e descrição de música, som ambiente ou outros artefatos de áudio antes de enviar o texto resultante para outro sistema.

Escolha a API mais especializada quando apropriado:

- Use [Transcrições de Áudio](audio-transcriptions.md) para conversão dedicada de fala para texto a partir de um arquivo de áudio, modelos de transcrição selecionáveis, uma dica opcional de idioma e precificação baseada em duração.
- Use [Inferência](/docs/pt-br/inference/inference) com `multimodal_preprocess` quando um modelo precisar responder a uma pergunta sobre a mídia após ela ser resolvida.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/descriptions</span>
</div>

A propriedade `input` deve ser um array não vazio de partes de conteúdo multissensorial compatíveis com OpenAI:

| Tipo de conteúdo | Payload | Comportamento |
| --- | --- | --- |
| `image_url` | `image_url.url` | Produz uma descrição visual detalhada, texto visível e metadados da imagem. |
| `input_audio` | Base64 `input_audio.data` mais `input_audio.format` | Transcreve fala e descreve música, som ambiente e outros artefatos de áudio. |
| `video_url` | `video_url.url` | Descreve o conteúdo visual e transcreve fala ou outro áudio. |
| `file` | `file.filename` mais `file.file_data` | Extrai a estrutura e o texto de PDF, ou usa extração local para outros formatos de documento suportados. |

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

URLs de arquivos remotos são baixados pelo AIVAX antes da resolução e são limitados a 5 MB. A URL deve ser absoluta, segura, publicamente acessível e não deve exigir JavaScript no navegador ou autenticação interativa. Você também pode enviar arquivos como valores `data:<mime-type>;base64,<content>`.

## Resposta e ordenação

A resposta contém uma parte de conteúdo de texto para cada item de entrada na mesma ordem:

```json
{
  "message": null,
  "data": [
    {
      "type": "text",
      "text": "A primeira descrição da mídia."
    },
    {
      "type": "text",
      "text": "A segunda descrição da mídia."
    }
  ]
}
```

Se algum item for inválido ou não puder ser resolvido, a requisição falha ao invés de retornar um array parcial. Proces­se itens não relacionados em requisições separadas quando for necessário sucesso parcial.

<script src="https://inference.aivax.net/apidocs?embed-target=Describe%20media&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Cache, uso e limites

O resolvedor armazena em cache as descrições por hash de conteúdo para a conta autenticada. Conteúdo repetido pode reutilizar texto em cache, mas a disponibilidade do cache não é permanente. Armazene o texto retornado quando sua aplicação precisar de uma cópia durável.

Processamento de imagens, áudio, vídeo e PDF pode invocar modelos auxiliares integrados e registrar uso de inferência. Arquivos não PDF suportados podem usar extração de texto local ao invés disso. Não há quota dedicada para descrições de mídia; chamadas a modelos auxiliares ainda passam pelos limites de requisição e token do modelo integrado, enquanto acertos de cache e extração local não criam uma transação de limite de taxa multissensor. separ. Consulte [Planos e limites](/docs/pt-br/limits) para os limites de inferência que podem ser aplicados.