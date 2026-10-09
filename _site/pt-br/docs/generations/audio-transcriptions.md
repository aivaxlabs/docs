Source: https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.html

# Transcrições de Áudio

Use Transcrições de Áudio para converter fala gravada em texto para busca, revisão, legendas ou automação downstream. Usos típicos incluem transcrever reuniões e entrevistas, legendar vídeos gravados, tornar notas de voz pesquisáveis e alimentar entrada falada em pipelines de classificação ou RAG.

Autentique solicitações com uma chave de API AIVAX. Veja [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md) para orientações de autorização.

## Escolha um modelo de transcrição

Consulte os modelos de transcrição disponíveis para a conta autenticada antes de selecionar um. A disponibilidade pode variar conforme a configuração da conta, portanto não codifique um catálogo na sua aplicação.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Get%20Audio%20Transcription%20Models)

## Transcrever áudio

Envie o áudio em base64 com seu formato (`wav`, `mp3`, `m4a`, `flac`, `ogg`, `webm` ou `aac`). O áudio decodificado está sujeito a um limite de tamanho (veja [Limites de solicitação e carga útil](https://docs.aivax.net/pt-br/docs/limits.md#request-and-payload-limits)), e a cobrança segue a duração medida da mídia (veja [Preços](https://docs.aivax.net/pt-br/docs/pricing.md)) — arquivos sem duração mensurável são rejeitados.

Forneça a dica opcional `language` quando o idioma falado for conhecido. Isso orienta o reconhecimento para esse idioma e ajuda com fala acentuada e vocabulário de domínio; omita quando o idioma realmente varia dentro de um único arquivo e deixe a detecção tratá‑lo.

Revise o texto retornado antes de usá‑lo em ações visíveis ao usuário ou irreversíveis: gravações ruidosas, múltiplos falantes, vocabulário especializado e baixa qualidade do microfone podem afetar a qualidade da transcrição. Para arquivos onde a atribuição de falante importa, planeje uma etapa de diarização ou revisão downstream — o endpoint retorna apenas o texto da transcrição, não rótulos de falante.

A referência embutida é a fonte de verdade para os formulários de solicitação aceitos, opções e campos de resposta.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Transcribe%20audio)

## Após a transcrição

Uma transcrição costuma ser o início de um pipeline, não o fim. Indexe‑a em uma [coleção RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md) para tornar gravações pesquisáveis, execute‑a via [Batch](https://docs.aivax.net/pt-br/docs/features/batch.md) quando houver muitos arquivos, ou alimente‑a em [Classificação de texto](https://docs.aivax.net/pt-br/docs/rag/classification.md) para rotular conversas em escala. Para conversas ao vivo em vez de áudio gravado, use [Sessões de voz](https://docs.aivax.net/pt-br/docs/inference/voice-session.md).

## Preços, limites e erros

Para disponibilidade, preços e limites de conta atuais, veja [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md). Corrija áudio inválido ou inacessível antes de tentar novamente uma solicitação falhada.
