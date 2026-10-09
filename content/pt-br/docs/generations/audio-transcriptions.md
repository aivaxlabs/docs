---
{title: Transcrições de Áudio,linkTitle: Transcrições de áudio,weight: 270,group: Generations,sourceHash: 98c28d552881a3be,aliases: [/docs/pt-br/generations/audio-transcriptions.html]}
---

# Transcrições de Áudio

Use Transcrições de Áudio para converter fala gravada em texto para busca, revisão, legendas ou automação downstream. Usos típicos incluem transcrever reuniões e entrevistas, legendar vídeos gravados, tornar notas de voz pesquisáveis e alimentar entrada falada em pipelines de classificação ou RAG.

Autentique solicitações com uma chave de API AIVAX. Veja [Autenticação](/docs/pt-br/authentication) para orientações de autorização.

## Escolha um modelo de transcrição

Consulte os modelos de transcrição disponíveis para a conta autenticada antes de selecionar um. A disponibilidade pode variar conforme a configuração da conta, portanto não codifique um catálogo na sua aplicação.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Audio%20Transcription%20Models&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Transcrever áudio

Envie o áudio em base64 com seu formato (`wav`, `mp3`, `m4a`, `flac`, `ogg`, `webm` ou `aac`). O áudio decodificado está sujeito a um limite de tamanho (veja [Limites de solicitação e carga útil](/docs/pt-br/limits#request-and-payload-limits)), e a cobrança segue a duração medida da mídia (veja [Preços](/docs/pt-br/pricing)) — arquivos sem duração mensurável são rejeitados.

Forneça a dica opcional `language` quando o idioma falado for conhecido. Isso orienta o reconhecimento para esse idioma e ajuda com fala acentuada e vocabulário de domínio; omita quando o idioma realmente varia dentro de um único arquivo e deixe a detecção tratá‑lo.

Revise o texto retornado antes de usá‑lo em ações visíveis ao usuário ou irreversíveis: gravações ruidosas, múltiplos falantes, vocabulário especializado e baixa qualidade do microfone podem afetar a qualidade da transcrição. Para arquivos onde a atribuição de falante importa, planeje uma etapa de diarização ou revisão downstream — o endpoint retorna apenas o texto da transcrição, não rótulos de falante.

A referência embutida é a fonte de verdade para os formulários de solicitação aceitos, opções e campos de resposta.

<script src="https://inference.aivax.net/apidocs?embed-target=Transcribe%20audio&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Após a transcrição

Uma transcrição costuma ser o início de um pipeline, não o fim. Indexe‑a em uma [coleção RAG](/docs/pt-br/rag/collections.md) para tornar gravações pesquisáveis, execute‑a via [Batch](/docs/pt-br/features/batch.md) quando houver muitos arquivos, ou alimente‑a em [Classificação de texto](/docs/pt-br/rag/classification.md) para rotular conversas em escala. Para conversas ao vivo em vez de áudio gravado, use [Sessões de voz](/docs/pt-br/inference/voice-session).

## Preços, limites e erros

Para disponibilidade, preços e limites de conta atuais, veja [Preços](/docs/pt-br/pricing) e [Planos e limites](/docs/pt-br/limits). Corrija áudio inválido ou inacessível antes de tentar novamente uma solicitação falhada.
