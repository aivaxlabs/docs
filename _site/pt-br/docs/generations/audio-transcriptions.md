Source: http://localhost:1313/pt-br/docs/generations/audio-transcriptions.html

# Transcrições de Áudio

Use Transcrições de Áudio para converter fala gravada em texto para busca, revisão, legendas ou automação subsequente. Usos típicos incluem transcrever reuniões e entrevistas, legendar vídeos gravados, tornar notas de voz pesquisáveis e alimentar entrada falada em pipelines de classificação ou RAG.

Autentique solicitações com uma chave de API AIVAX. Consulte [Authentication](http://localhost:1313/pt-br/docs/authentication.md) para orientações de autorização.

## Escolha um modelo de transcrição

Consulte os modelos de transcrição disponíveis para a conta autenticada antes de selecionar um. A disponibilidade pode variar de acordo com a configuração da conta, portanto, não codifique um catálogo fixo em sua aplicação.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Get%20Audio%20Transcription%20Models)

## Transcrever áudio

Envie o áudio em base64 com seu formato (`wav`, `mp3`, `m4a`, `flac`, `ogg`, `webm` ou `aac`). O áudio decodificado não pode exceder 75 MB, e a cobrança segue a duração medida da mídia (veja [Pricing](http://localhost:1313/pt-br/docs/pricing.md)) — arquivos sem duração mensurável são rejeitados.

Forneça a dica opcional `language` quando o idioma falado for conhecido. Isso orienta o reconhecimento para esse idioma e ajuda com fala acentuada e vocabulário de domínio; omita-a quando o idioma variar realmente dentro de um único arquivo e deixe a detecção tratá‑lo.

Revise o texto retornado antes de utilizá‑lo em ações visíveis ao usuário ou irreversíveis: gravações barulhentas, múltiplos falantes, vocabulário especializado e baixa qualidade do microfone podem afetar a qualidade da transcrição. Para arquivos onde a atribuição de falantes é importante, planeje uma etapa de diarização ou revisão subsequente — o endpoint retorna apenas o texto da transcrição, não rótulos de falantes.

A referência incorporada é a fonte de verdade para os formulários de solicitação aceitos, opções e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Transcribe%20audio)

## Após a transcrição

Uma transcrição costuma ser o início de um pipeline, não o fim. Indexe‑a em uma [RAG collection](http://localhost:1313/pt-br/docs/rag/collections.md) para tornar as gravações pesquisáveis, execute‑a através de [Batch](http://localhost:1313/pt-br/docs/features/batch.md) quando houver muitos arquivos, ou alimente‑a em [Text classification](http://localhost:1313/pt-br/docs/rag/classification.md) para rotular conversas em escala. Para conversas ao vivo em vez de áudio gravado, use [Voice Sessions](http://localhost:1313/pt-br/docs/inference/voice-session.md).

## Preços, limites e erros

Para disponibilidade atual, preços e limites da conta, veja [Pricing](http://localhost:1313/pt-br/docs/pricing.md) e [Plans and Limits](http://localhost:1313/pt-br/docs/limits.md). Corrija áudios inválidos ou inacessíveis antes de tentar novamente uma solicitação que falhou.
