---
{title: Reconhecimento de fala (STT),linkTitle: Reconhecimento de fala (STT),weight: 30,group: Media generation,sourceHash: 0da3441c64667a25,aliases: [/docs/pt-br/generations/audio-transcriptions.html]}
---

# Reconhecimento de fala (STT)

Use as Transcrições de Áudio para converter fala gravada em texto para busca, revisão, legendas ou automação subsequente. Os usos típicos incluem transcrever reuniões e entrevistas, legendar vídeos gravados, tornar notas de voz pesquisáveis e alimentar a fala em pipelines de classificação ou RAG.

Autentique solicitações com uma chave de API AIVAX. Consulte [Authentication](/docs/pt-br/authentication) para orientações de autorização.

## Escolha um modelo de transcrição

Consulte os modelos de transcrição disponíveis para a conta autenticada antes de selecionar um. A disponibilidade pode variar conforme a configuração da conta, portanto não codifique um catálogo fixo em sua aplicação.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Audio%20Transcription%20Models&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Transcrever áudio

Envie o áudio em base64 com seu formato (`wav`, `mp3`, `m4a`, `flac`, `ogg`, `webm` ou `aac`). O áudio decodificado está sujeito ao limite de tamanho em [Pricing, limits, and errors](#pricing-limits-and-errors). A cobrança segue a duração medida da mídia, e arquivos sem duração mensurável são rejeitados.

Forneça a dica opcional `language` quando o idioma falado for conhecido. Ela orienta o reconhecimento para esse idioma e ajuda com fala acentuada e vocabulário específico; omita‑a quando o idioma realmente varia dentro de um único arquivo e deixe a detecção tratá‑lo.

Revise o texto retornado antes de usá‑lo em ações visíveis ao usuário ou irreversíveis: gravações ruidosas, múltiplos falantes, vocabulário especializado e baixa qualidade do microfone podem afetar a qualidade da transcrição. O endpoint devolve apenas o texto da transcrição, não rótulos de falante, portanto planeje uma etapa de diarização ou revisão subsequente para arquivos onde a atribuição de falante seja importante.

A referência incorporada é a fonte de verdade para os formulários de solicitação aceitos, opções e campos de resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Transcribe%20audio&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Após a transcrição

Uma transcrição geralmente é o início de um pipeline, não o fim. Indexe‑a em uma [RAG collection](/docs/pt-br/rag/collections.md) para tornar as gravações pesquisáveis, execute‑a via [Batch](/docs/pt-br/inference/batch.md) quando houver muitos arquivos, ou alimente‑a na [Text classification](/docs/pt-br/data-processing/classification.md) para rotular conversas em escala. Para conversas ao vivo em vez de áudio gravado, use [Voice Sessions](/docs/pt-br/inference/voice-session).

## Preços, limites e erros

O preço da transcrição varia conforme o modelo; as tarifas atuais estão listadas no catálogo de Modelos.

| Limite | Gratuito | Pro | Máx |
| --- | --- | --- | --- |
| Solicitações de transcrição de áudio autônomas | 3/min e 40/hora | 30/min | 300/min |

Solicitações de transcrição têm uma cota separada da geração de fala, com os mesmos valores. O áudio decodificado está limitado a 75 MB por solicitação. Corrija áudio inválido ou inacessível antes de tentar novamente uma solicitação que falhou.
