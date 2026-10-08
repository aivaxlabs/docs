---
title: "Multimodality: images, audio, documents, video"
linkTitle: Multimodality
description: "Choose how an assistant receives and produces media, and understand what can be lost when pictures, recordings, and documents become text."
weight: 30
duration: 12
objectives:
  - Distinguish media input capabilities from media generation capabilities.
  - Compare direct media understanding with conversion to text first.
  - Select a processing approach for an invoice, voice note, or document.
  - Identify quality, privacy, and verification limits in media workflows.
---

A customer does not always describe a problem in a typed message. They may photograph a damaged package, record a voice note, attach an invoice, or send a screen recording. **Multimodality** means working with more than one kind of information, such as text, images, and audio. These different kinds are called **modalities**.

Think of a colleague receiving a folder containing a letter, a photograph, and a recording. Reading the letter is not the same skill as listening to the recording or recognising damage in the photograph. An AI assistant also needs the right capability for each input. A text model cannot inspect a picture merely because its instructions say “look carefully.”

## Input and output are separate capabilities

A model may accept images and return text, accept text and produce speech, or handle several combinations. Understanding an image does not imply being able to create one. Likewise, turning a recording into written words does not imply the ability to hold a live spoken conversation. Check both sides of the task: what goes in and what must come out.

{{< cards >}}
{{< card title="Images" icon="eye" >}}
Inputs may include photographs, screenshots, or diagrams. Outputs may be descriptions or extracted facts; creating or editing an image requires an appropriate generation capability.
{{< /card >}}
{{< card title="Audio" icon="message" >}}
Inputs may include speech or other sounds. Tasks include transcription and audio interpretation. Spoken output uses speech generation or a compatible live voice system.
{{< /card >}}
{{< card title="Documents" icon="book" >}}
A document can mix selectable text, scanned pages, charts, and tables. Its file extension alone does not tell you which information can be extracted reliably.
{{< /card >}}
{{< card title="Video" icon="play" >}}
A recording combines images over time and may include audio. Summarising it requires deciding which moments and sounds are available to the processing system.
{{< /card >}}
{{< /cards >}}

A document format is a container rather than a single kind of meaning. One PDF might contain clean text that can be extracted directly. Another might be a collection of scanned photographs. A third might contain a chart whose message depends on colours and spatial layout. Treating all three as plain text can produce very different results.

The same distinction matters for video. A system that inspects a selection of frames may recognise objects but miss a brief event between them. A transcript may capture what a presenter said while losing the diagram they pointed at. Be precise about which parts of the recording were processed before claiming to have analysed the whole event.

## Two routes from media to an answer

The first route is **direct media input**: send the media to a model or service that supports that input and ask the relevant question. The second route is **pre-processing**: convert the useful information into text first, then give that text to a language model. Both can be appropriate, and a workflow can combine them.

**Transcription** turns spoken words into written text. **Optical character recognition**, usually called **OCR**, reads characters from images or scanned pages. A **media description** expresses visible or audible information in words, such as “a cardboard box with a torn corner.” These are different products: a description of a receipt is not necessarily a faithful transcription of every amount.

{{< compare >}}
{{< side title="Direct media" >}}
Ask a vision-capable model about the original package photo. This can retain useful visual relationships, such as where the damage appears. Supported formats, detail, cost, and quality depend on the selected service.
{{< /side >}}
{{< side title="Text first" >}}
Create a description or transcript, then let a text model handle the conversation. The text can be reused and searched, but anything omitted during conversion is unavailable to that later model.
{{< /side >}}
{{< /compare >}}

A text-first route is useful when the important information is mainly words and will be reused. A support voice note can become a transcript that is easier to search and review. A direct route is useful when the task depends on layout, visual relationships, or other information that a text conversion may lose. Neither route guarantees that small print or unclear speech will be understood correctly.

{{< flow "Receive media | Check access and format | Read directly or convert to text | Answer the specific question | Verify consequential details" >}}

Before processing, state what you need to learn. “Read this invoice” is less useful than “Extract the supplier name, invoice date, total, and currency; mark anything unreadable.” A focused request makes it easier to evaluate success and avoids collecting unrelated details from a document or recording.

## Choose the route for the work

{{< tabs >}}
{{< tab title="Invoice photograph" >}}
Use OCR or image understanding to extract required fields. Check the original image for ambiguous digits, decimal separators, and currency. Require review before creating or approving a payment.
{{< /tab >}}
{{< tab title="Customer voice note" >}}
Transcribe the recording when the task is to capture the customer's words. Preserve uncertainty around names, addresses, and dates. Ask for confirmation before acting on a detail that sounds unclear.
{{< /tab >}}
{{< tab title="Product PDF" >}}
Extract selectable text when available. Use OCR for scanned pages and image understanding when diagrams matter. Keep page references so a reviewer can find the evidence behind the answer.
{{< /tab >}}
{{< tab title="Training video" >}}
Decide whether speech, screen changes, or both are essential. A transcript alone may explain the narration while missing which button the presenter selected. Validate against the relevant moment in the recording.
{{< /tab >}}
{{< /tabs >}}

For the invoice example, separate recognition from business validation. A model can read a total that appears on a page, but that does not prove the invoice is genuine, the supplier is approved, or the payment is authorised. Those checks belong to the surrounding business process. A clear photograph improves recognition; it does not establish trust in the document.

For the voice note, accents, background noise, overlapping speakers, and unfamiliar product names can affect the transcript. A fluent sentence can conceal a misheard word. Where a detail matters, show the extracted value to the user or a reviewer. Do not automatically turn an uncertain transcription into an instruction to change an order.

For the PDF, preserve headings and nearby explanations when possible. A table value without its column heading can be misleading. A sentence separated from its exception may reverse the policy's meaning. Reading more text is not enough if the conversion removes the relationships needed to interpret it.

## Limits are part of the design

Every media service has supported formats and practical limits, such as file size, image detail, audio duration, or the amount of content processed in one request. A successful upload does not by itself prove that every page, sound, or frame was considered. Check the selected service's documented behaviour and make the processed scope visible when it affects the answer.

Media also takes time to transfer and process. Converting once and reusing the result may help repeated questions, but retaining transcripts or descriptions creates additional stored information that needs access controls and deletion rules. Direct processing avoids some intermediate files but does not eliminate privacy obligations. Choose based on the complete workflow, not only the first response time.

> [!WARNING]
> Media can contain instructions written by someone other than the user, including text inside a screenshot or document. Treat that content as evidence to examine, not authority to change the assistant's permissions or business rules.

Generated media needs a separate review. A synthetic product image may show features the product does not have. Spoken output may pronounce names incorrectly. A convincing voice or polished picture is not evidence of authenticity. Make the intended use clear and check content before sharing it with customers.

## Related AIVAX capabilities

On AIVAX, converting media into text is available through [media descriptions](../../docs/generations/media-descriptions.md), [audio transcription](../../docs/generations/audio-transcriptions.md), and [fetch and OCR](../../docs/web-foundation/fetch-and-ocr.md). Choose the service according to whether you need a description, spoken words, or written text from a page; do not assume their outputs are interchangeable.

For output, see [speech generation](../../docs/generations/speech.md) and [image generation](../../docs/generations/images.md). A live spoken exchange is a separate interaction pattern covered by [voice sessions](../../docs/inference/voice-session.md). These guides describe supported options; this unit's examples are workflow choices rather than promises that every model supports every modality.

What's next: learn how [embeddings and semantic search](embeddings-and-semantic-search.md) help find relevant information after it has been prepared.

{{< quiz options="Transcribe the narration and assume it includes every visual action | Choose a workflow that examines the relevant screen images as well as the audio | Use any text-only model with a higher temperature | Generate a new video instead" answer="2" explanation="The correct button may be visible without being named aloud. The processing route must preserve the information the task depends on; a transcript alone can lose visual evidence." >}}
A team needs to learn which button a presenter clicked in a training video. Which approach fits the task?
{{< /quiz >}}
