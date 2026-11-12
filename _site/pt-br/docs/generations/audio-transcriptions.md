Source: https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.html

# Fala para Texto (STT)

Use Transcrições de Áudio para converter fala gravada em texto para busca, revisão, legendas ou automação posterior. Os usos típicos incluem transcrever reuniões e entrevistas, legendar vídeos gravados, tornar notas de voz pesquisáveis e alimentar entradas faladas em pipelines de classificação ou RAG.

Autentique as solicitações com uma chave de API da AIVAX. Consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md) para orientações de autorização.

## Escolha um modelo de transcrição

Consulte os modelos de transcrição disponíveis para a conta autenticada antes de selecionar um. A disponibilidade pode variar conforme a configuração da conta, portanto, não codifique fixamente um catálogo em seu aplicativo.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Get%20Audio%20Transcription%20Models)

## Transcreva áudio

Envie o áudio como base64 com seu formato (`wav`, `mp3`, `m4a`, `flac`, `ogg`, `webm` ou `aac`). O áudio decodificado está sujeito ao limite de tamanho em [Preços, limites e erros](#precos-limites-e-erros). A cobrança segue a duração medida da mídia, e arquivos sem duração mensurável são rejeitados.

Forneça a dica opcional `language` quando o idioma falado for conhecido. Ela direciona o reconhecimento para esse idioma e ajuda com sotaques e vocabulário específico; omita-a quando o idioma variar genuinamente dentro de um único arquivo e deixe a detecção cuidar disso.

Revise o texto retornado antes de usá-lo em ações visíveis ao usuário ou irreversíveis: gravações ruidosas, múltiplos falantes, vocabulário especializado e má qualidade do microfone podem afetar a qualidade da transcrição. O endpoint retorna o texto da transcrição, não rótulos de falante, então planeje uma etapa de diarização ou revisão no fluxo subsequente para arquivos onde a atribuição do falante é importante.

A referência embutida é a fonte da verdade para formas de solicitação aceitas, opções e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Transcribe%20audio)

## Após a transcrição

Uma transcrição geralmente é o início de um pipeline, não o fim. Indexe-a em uma [coleção RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md) para tornar as gravações pesquisáveis, execute-a pelo [Batch](https://docs.aivax.net/pt-br/docs/inference/batch.md) quando houver muitos arquivos ou alimente-a na [Classificação de Texto](https://docs.aivax.net/pt-br/docs/data-processing/classification.md) para rotular conversas em escala. Para conversas ao vivo em vez de áudio gravado, use [Sessões de Voz](https://docs.aivax.net/pt-br/docs/inference/voice-session.md).

## Preços, limites e erros

O preço da transcrição varia conforme o modelo; as tarifas atuais estão listadas no [Catálogo de Modelos](https://aivax.net/models#speech-to-text).

As solicitações independentes de transcrição de áudio têm limite por minuto e, no plano Free, por hora; consulte [Limites de fala](https://docs.aivax.net/pt-br/docs/limits.md#speech). As solicitações de transcrição possuem uma cota separada da geração de fala, com os mesmos valores. O áudio decodificado tem limite de 75 MB por solicitação. Corrija áudios inválidos ou inacessíveis antes de tentar novamente uma solicitação com falha.
