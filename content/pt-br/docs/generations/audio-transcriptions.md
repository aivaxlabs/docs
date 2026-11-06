---
{title: Fala para Texto (STT),linkTitle: Fala para texto (STT),weight: 30,group: Media generation,sourceHash: 7f1bd8d67a6705c8,aliases: [/docs/pt-br/generations/audio-transcriptions.html]}
---

# Fala para Texto (STT)

Use Transcrições de Áudio para converter fala gravada em texto, visando busca, revisão, legendas ou automação posterior. Os usos típicos incluem transcrever reuniões e entrevistas, legendar vídeos gravados, tornar notas de voz pesquisáveis e alimentar entradas faladas em pipelines de classificação ou RAG.

Autentique as solicitações com uma chave de API da AIVAX. Consulte [Autenticação](/docs/pt-br/authentication) para orientações sobre autorização.

## Escolha um modelo de transcrição

Consulte os modelos de transcrição disponíveis para a conta autenticada antes de selecionar um. A disponibilidade pode variar conforme a configuração da conta; portanto, não codifique fixamente um catálogo em seu aplicativo.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Audio%20Transcription%20Models&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Transcreva áudio

Envie o áudio como base64 junto com seu formato (`wav`, `mp3`, `m4a`, `flac`, `ogg`, `webm` ou `aac`). O áudio decodificado está sujeito ao limite de tamanho definido em [Preços, limites e erros](#precos-limites-e-erros). A cobrança segue a duração medida da mídia, e arquivos sem duração mensurável são rejeitados.

Forneça a dica opcional `language` quando o idioma falado for conhecido. Ela direciona o reconhecimento para esse idioma e ajuda com sotaques e vocabulário específico do domínio; omita-a quando o idioma variar genuinamente dentro de um único arquivo e deixe que a detecção automática faça o trabalho.

Revise o texto retornado antes de usá-lo em ações visíveis ao usuário ou irreversíveis: gravações ruidosas, múltiplos falantes, vocabulário especializado e má qualidade de microfone podem afetar a qualidade da transcrição. O endpoint retorna apenas o texto da transcrição, sem rótulos de orador, portanto, planeje um passo de diarização ou revisão posterior para arquivos onde a atribuição de fala é importante.

A referência embutida é a fonte da verdade para formas aceitas de solicitação, opções e campos de resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Transcribe%20audio&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Após a transcrição

Uma transcrição geralmente é o início de um pipeline, não o fim. Indexe-a em uma [coleção RAG](/docs/pt-br/rag/collections.md) para tornar as gravações pesquisáveis, execute-a pelo [Batch](/docs/pt-br/inference/batch.md) quando houver muitos arquivos ou alimente-a no [Classificação de Texto](/docs/pt-br/data-processing/classification.md) para rotular conversas em escala. Para conversas ao vivo em vez de áudio gravado, use [Sessões de Voz](/docs/pt-br/inference/voice-session).

## Preços, limites e erros

O preço da transcrição varia conforme o modelo; as tarifas atuais estão listadas no catálogo de Modelos.

As solicitações independentes de transcrição de áudio têm limites por minuto e, na versão Free, por hora; consulte [Limites de fala](/docs/pt-br/limits.md#speech). As solicitações de transcrição possuem uma cota separada da geração de fala, com os mesmos valores. O áudio decodificado tem limite de 75 MB por solicitação. Corrija áudios inválidos ou inacessíveis antes de tentar novamente uma solicitação falha.
