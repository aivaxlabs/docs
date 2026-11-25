Source: https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.html

# Fala para Texto (STT)

Use Transcrições de Áudio para converter fala gravada em texto para busca, revisão, legendas ou automação downstream. Os usos típicos incluem transcrever reuniões e entrevistas, legendar vídeos gravados, tornar notas de voz pesquisáveis e alimentar entradas faladas em pipelines de classificação ou RAG.

Autentique as solicitações com uma chave de API da AIVAX. Consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md) para orientações de autorização.

## Escolha um modelo de transcrição

Consulte os modelos de transcrição disponíveis para a conta autenticada antes de selecionar um. A disponibilidade pode variar conforme a configuração da conta, portanto, não codifique fixamente um catálogo em seu aplicativo.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Get%20Audio%20Transcription%20Models)

## Transcreva áudio

Envie o áudio como base64 com seu formato (`wav`, `mp3`, `m4a`, `flac`, `ogg`, `webm` ou `aac`). O áudio decodificado está sujeito ao limite de tamanho em [Preços, limites e erros](#pricing-limits-and-errors). A cobrança segue a duração da mídia.

Forneça a dica opcional `language` quando o idioma falado for conhecido. Ela direciona o reconhecimento para esse idioma e ajuda com sotaques e vocabulário de domínio; omita-a quando o idioma variar genuinamente dentro de um único arquivo e deixe a detecção lidar com isso.

Revise o texto retornado antes de usá-lo em ações visíveis ao usuário ou irreversíveis. O endpoint retorna o texto da transcrição sem rótulos de locutor.

A referência embutida é a fonte da verdade para formas de solicitação aceitas, opções e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Transcribe%20audio)

## Após a transcrição

Uma transcrição geralmente é o início de um pipeline, não o fim. Indexe-a em uma [coleção RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md) para tornar as gravações pesquisáveis, execute-a pelo [Batch](https://docs.aivax.net/pt-br/docs/inference/batch/workflows.md) quando houver muitos arquivos ou alimente-a no [Classificação de Texto](https://docs.aivax.net/pt-br/docs/data-processing/classification.md) para rotular conversas em escala. Para conversas ao vivo em vez de áudio gravado, use [Sessões de Voz](https://docs.aivax.net/pt-br/docs/inference/voice-session.md).

## Geração assíncrona

Adicione `"async": true` para colocar a transcrição em fila, o que é útil para gravações longas. A API responde com HTTP `202` e um ID, e você busca o resultado armazenado mais tarde ou recebe um webhook quando estiver concluído. Consulte [Gerações assíncronas](https://docs.aivax.net/pt-br/docs/inference/batch/async-generations.md).

```json
{
  "input_audio": {
    "data": "<base64-audio>",
    "format": "mp3"
  },
  "language": "en",
  "async": true
}
```

## Preços, limites e erros

O preço da transcrição varia conforme o modelo; as tarifas atuais estão listadas no [Catálogo de Modelos](https://aivax.net/models#speech-to-text).

As solicitações de transcrição de áudio independentes são limitadas por minuto, e por hora na versão Free; consulte [Limites de fala](https://docs.aivax.net/pt-br/docs/limits.md#speech). As solicitações de transcrição têm uma cota separada da geração de fala, com os mesmos valores. O áudio decodificado é limitado a 75 MB por solicitação. Corrija o áudio inválido ou inacessível antes de tentar novamente uma solicitação com falha.
