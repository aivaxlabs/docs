# Descrições de Mídia

Use descrições de mídia quando sua aplicação precisa de texto extraído da mídia, mas não necessita de uma resposta separada de conclusão de chat. Cada item de entrada é processado independentemente com o mesmo resolvedor multimodal usado pela inferência AIVAX, e a resposta preserva a ordem de entrada.

Isso é útil para transcrição, extração de documentos, análise de imagens e descrição de vídeo antes de enviar o texto resultante para outro sistema. Se você também precisar que um modelo responda a uma pergunta sobre a mídia, use [Inference](/docs/pt-br/inference/inference) com `multimodal_preprocess` em vez disso.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/descriptions</span>
</div>

A propriedade `input` é um array não vazio de partes de conteúdo multimodal compatíveis com OpenAI:

| Tipo de conteúdo | Carga útil | Comportamento |
| --- | --- | --- |
| `image_url` | `image_url.url` | Produz uma descrição visual detalhada, texto visível e metadados da imagem. |
| `input_audio` | Base64 `input_audio.data` mais `input_audio.format` | Transcreve fala e descreve música, som ambiente e outros artefatos de áudio. |
| `video_url` | `video_url.url` | Descreve o conteúdo visual e transcreve fala ou outro áudio. |
| `file` | `file.filename` mais `file.file_data` | Extrai a estrutura e o texto de PDF, ou usa extração local para outros formatos de documento suportados. |

Todos os tipos de mídia suportados são elegíveis. URLs de arquivos remotos são baixados pela AIVAX antes da resolução e são limitados a 5 MB. A URL deve ser absoluta, segura, publicamente acessível e não deve exigir JavaScript no lado do navegador ou autenticação interativa. Você também pode enviar arquivos como valores `data:<mime-type>;base64,<content>`.

Cada item de resposta tem este formato:

```json
{
    "type": "text",
    "text": "The textual media description"
}
```

O resolvedor armazena em cache as descrições por hash de conteúdo para a conta autenticada. Um item repetido pode reutilizar o texto em cache. O processamento de imagens, áudio, vídeo e PDF pode invocar modelos auxiliares integrados e registrar o uso de inferência; arquivos não‑PDF suportados podem usar extração de texto local em vez disso.

Atualmente não há quota dedicada para descrições de mídia. As chamadas a modelos auxiliares ainda passam pelos limites de taxa de solicitações e tokens do modelo integrado, enquanto acertos de cache e extração local de arquivos não criam uma transação separada de limite de taxa multimodal. Consulte [Plans and limits](/docs/pt-br/limits) para os limites de inferência que podem ser aplicados.

<script src="https://inference.aivax.net/apidocs?embed-target=Describe%20media&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Após resolver a mídia, armazene o texto retornado quando sua aplicação precisar de sua própria cópia durável. O cache do resolvedor da AIVAX é uma otimização e não deve substituir os dados de propriedade da aplicação.