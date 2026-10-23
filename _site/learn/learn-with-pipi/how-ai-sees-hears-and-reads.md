Source: https://docs.aivax.net/learn/learn-with-pipi/how-ai-sees-hears-and-reads.html

The brain from the series only reads text. Little notes slip in easily, but customers also send photos and voice messages, and those do not fit through the slot.

[Video: AIVAX Learn #6 — How AI sees, hears and reads](https://public.aivax.net/file/aivax-public/learn/pipi/06-multimodal.mp4) — Pipi's videos are only available in Portuguese for now.

*Episode 6 · 1 minute 13 seconds*


## What the video shows

Some models are **multimodal**: they see images, listen to audio and read files. In the video, each type of content has its own little entrance on the jar. A customer sends a photo of a cake, and the brain looks closely: carrot cake with chocolate frosting.

But not every model can see. Some only read text. For those, AIVAX uses a translator machine: it looks at the media first and prints a note describing it. The note fits through the text slot, and the brain understands just the same. This step is called **preprocessing**.


**Multimodal model**

Photo → Multimodal model → Answer


The model receives the original image. Best when fine visual detail matters and the chosen model supports that kind of media.


**Preprocessing**

Photo → Description written by AIVAX → Text-only model → Answer


The main model receives a text description instead of the image. Useful for text-only models, or to keep one model for every channel regardless of what customers send.





## Choosing between them

Preprocessing adds a step, so it adds some cost and waiting time, and a description can leave out details that the original media had. Sending media directly avoids that, but limits you to models that accept it. Many teams start with preprocessing for audio and documents and send images directly when the model supports them.

## Go deeper

- In Learn: [Multimodality: images, audio, documents, video](https://docs.aivax.net/learn/models/multimodality.md) and [Model families and how to choose](https://docs.aivax.net/learn/models/model-families-and-choosing.md).
- In the Documentation: [Inference](https://docs.aivax.net/docs/inference/inference.md) explains how to send media in a request and how the multimodal resolver replaces media with a description. [Pipelines](https://docs.aivax.net/docs/inference/pipelines.md) covers the gateway setting for this. [Media descriptions](https://docs.aivax.net/docs/data-processing/media-descriptions.md) and [Audio transcriptions](https://docs.aivax.net/docs/generations/audio-transcriptions.md) are available as standalone tools.

The last episode takes the same brain to the website, WhatsApp and Telegram.

**Knowledge check.** Your chosen model only reads text, and a customer sends a photo. What does the video show?

1. It cannot be used with photos at all
2. AIVAX can describe the photo as text first, and the model reads the description
3. The customer must describe the photo in words

Answer: option 2. Preprocessing writes a text description of the media, so a text-only model can still understand it.
