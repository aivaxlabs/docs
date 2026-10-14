---
title: How AI sees, hears and reads
linkTitle: "#6 Multimodality"
description: "A customer sends a photo of a cake, an audio message and a file. Pipi shows models that understand media directly, and how AIVAX turns media into text for models that only read."
weight: 60
duration: 5
objectives:
  - Define a multimodal model.
  - Recognise that not every model accepts images, audio or files.
  - Explain how preprocessing turns media into a text description.
---

The brain from the series only reads text. Little notes slip in easily, but customers also send photos and voice messages, and those do not fit through the slot.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/06-multimodal.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/06-multimodal.webp" title="AIVAX Learn #6 — How AI sees, hears and reads" lang="pt-BR" caption="Episode 6 · 1 minute 13 seconds" >}}

## What the video shows

Some models are **multimodal**: they see images, listen to audio and read files. In the video, each type of content has its own little entrance on the jar. A customer sends a photo of a cake, and the brain looks closely: carrot cake with chocolate frosting.

But not every model can see. Some only read text. For those, AIVAX uses a translator machine: it looks at the media first and prints a note describing it. The note fits through the text slot, and the brain understands just the same. This step is called **preprocessing**.

{{< tabs >}}
{{< tab title="Multimodal model" >}}
{{< flow "Photo | Multimodal model | Answer" >}}

The model receives the original image. Best when fine visual detail matters and the chosen model supports that kind of media.
{{< /tab >}}
{{< tab title="Preprocessing" >}}
{{< flow "Photo | Description written by AIVAX | Text-only model | Answer" >}}

The main model receives a text description instead of the image. Useful for text-only models, or to keep one model for every channel regardless of what customers send.
{{< /tab >}}
{{< /tabs >}}

## Choosing between them

Preprocessing adds a step, so it adds some cost and waiting time, and a description can leave out details that the original media had. Sending media directly avoids that, but limits you to models that accept it. Many teams start with preprocessing for audio and documents and send images directly when the model supports them.

## Go deeper

- In Learn: [Multimodality: images, audio, documents, video](../models/multimodality.md) and [Model families and how to choose](../models/model-families-and-choosing.md).
- In the Documentation: [Inference](../../docs/inference/inference.md) explains how to send media in a request and how the multimodal resolver replaces media with a description. [Pipelines](../../docs/inference/pipelines.md) covers the gateway setting for this. [Media descriptions](../../docs/generations/media-descriptions.md) and [Audio transcriptions](../../docs/generations/audio-transcriptions.md) are available as standalone tools.

The last episode takes the same brain to the website, WhatsApp and Telegram.

{{< quiz options="It cannot be used with photos at all | AIVAX can describe the photo as text first, and the model reads the description | The customer must describe the photo in words" answer="2" explanation="Preprocessing writes a text description of the media, so a text-only model can still understand it." >}}
Your chosen model only reads text, and a customer sends a photo. What does the video show?
{{< /quiz >}}
