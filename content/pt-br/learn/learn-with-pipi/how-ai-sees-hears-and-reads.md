---
{title: "Como a IA vê, ouve e lê",linkTitle: "#6 Multimodalidade",description: "Um cliente envia uma foto de um bolo, uma mensagem de áudio e um arquivo. Pipi mostra modelos que entendem mídia diretamente e como a AIVAX transforma mídia em texto para modelos que só leem.",weight: 60,duration: 5,objectives: [Definir um modelo multimodal.,"Reconhecer que nem todo modelo aceita imagens, áudio ou arquivos.",Explicar como o pré-processamento transforma mídia em uma descrição textual.],sourceHash: d6fa954c982bc288}
---

O cérebro da série só lê texto. Pequenas notas entram facilmente, mas os clientes também enviam fotos e mensagens de voz, e essas não cabem na entrada.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/06-multimodal.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/06-multimodal.webp" title="AIVAX Learn #6 — How AI sees, hears and reads" lang="pt-BR" caption="Episode 6 · 1 minute 13 seconds" >}}

## O que o vídeo demonstra

Alguns modelos são **multimodais**: eles veem imagens, escutam áudio e leem arquivos. No vídeo, cada tipo de conteúdo tem sua própria pequena entrada no pote. Um cliente envia uma foto de um bolo, e o cérebro observa atentamente: bolo de cenoura com cobertura de chocolate.

Mas nem todo modelo pode ver. Alguns apenas leem texto. Para esses, a AIVAX usa uma máquina tradutora: ela observa a mídia primeiro e gera uma nota descrevendo‑a. A nota cabe na entrada de texto, e o cérebro entende da mesma forma. Essa etapa é chamada de **pré-processamento**.

{{< tabs >}}
{{< tab title="Modelo multimodal" >}}
{{< flow "Foto | Modelo multimodal | Resposta" >}}
{{< /tab >}}
{{< tab title="Pré-processamento" >}}
{{< flow "Foto | Descrição escrita pela AIVAX | Modelo somente texto | Resposta" >}}
{{< /tab >}}
{{< /tabs >}}

## Escolhendo entre eles

O pré-processamento adiciona uma etapa, portanto acrescenta algum custo e tempo de espera, e uma descrição pode omitir detalhes que a mídia original possuía. Enviar mídia diretamente evita isso, mas limita você a modelos que a aceitam. Muitas equipes começam com pré-processamento para áudio e documentos e enviam imagens diretamente quando o modelo as suporta.

## Aprofunde-se

- Em Learn: [Multimodalidade: imagens, áudio, documentos, vídeo](../models/multimodality.md) e [Famílias de modelos e como escolher](../models/model-families-and-choosing.md).
- Na Documentação: [Inferência](../../docs/inference/inference.md) explica como enviar mídia em uma requisição e como o resolvedor multimodal substitui a mídia por uma descrição. [Pipelines](../../docs/inference/pipelines.md) cobre a configuração de gateway para isso. [Descrições de mídia](../../docs/generations/media-descriptions.md) e [Transcrições de áudio](../../docs/generations/audio-transcriptions.md) estão disponíveis como ferramentas independentes.

O último episódio leva o mesmo cérebro para o site, WhatsApp e Telegram.

{{< quiz options="Não pode ser usado com fotos de forma alguma | A AIVAX pode descrever a foto como texto primeiro, e o modelo lê a descrição | O cliente deve descrever a foto em palavras" answer="2" explanation="O pré-processamento gera uma descrição textual da mídia, permitindo que um modelo somente texto ainda a entenda." >}}
Seu modelo escolhido só lê texto, e um cliente envia uma foto. O que o vídeo demonstra?
{{< /quiz >}}
