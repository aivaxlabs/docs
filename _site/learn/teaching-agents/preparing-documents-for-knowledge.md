Source: https://docs.aivax.net/learn/teaching-agents/preparing-documents-for-knowledge.html

A support colleague receives a folder containing the Trail Lamp manual, a warranty spreadsheet and photographs of packaging. The folder contains useful knowledge, but handing it over is not the same as making it easy to use. Repeated page headings interrupt sentences. Spreadsheet cells depend on column labels. A photograph may contain a warning that never appears in the manual.

Preparing documents means turning these sources into accurate, understandable material that an agent can search. The aim is not to make every file look identical. It is to preserve the meaning while removing obstacles to finding and interpreting it. Keep the originals: a clean copy should remain traceable to the evidence it came from.

## Begin with a preparation path

**Ingestion** is the process of bringing source material into a knowledge system. It can involve extraction, cleaning, segmentation and indexing. **Indexing** prepares the material for search. These are separate jobs: successfully uploading a file does not prove that its contents were read correctly or that useful passages are searchable.

Approved source → Convert and clean → Divide by meaning → Label and review → Index and test

Start with a small, representative sample rather than the whole archive. Include a straightforward document and a difficult one, such as a scanned warranty sheet. Decide what questions the agent should answer from each source. These questions become practical checks: can the prepared text still explain whether the Trail Lamp battery is covered, including any exceptions?

1. **Confirm the source**

Check ownership, approval, currency and permission to use the content. Keep a reference to the original and identify which version is authoritative.

2. **Inspect the extracted text**

Read the converted result beside the original. Check headings, reading order, tables and warnings before making it searchable.

3. **Prepare complete knowledge units**

Separate unrelated topics, retain necessary conditions and attach useful labels to each passage.

4. **Test representative questions**

Search for facts, exceptions and common paraphrases. Review the passages returned, not only the final answer.

## Clean noise without deleting meaning

**Boilerplate** is repeated standard text, such as a navigation menu or a promotional slogan. Headers and footers often repeat the company name on every page. Removing this noise can make paragraphs easier to read and reduce irrelevant search matches. Fix broken words, accidental line breaks and duplicated paragraphs when the original makes the intended text clear.

Do not remove every repeated line automatically. A footer might identify the effective date, product version or confidentiality restriction. Preserve that information somewhere appropriate before removing repeated copies. A safety warning repeated beside several procedures may be essential in each procedure, not disposable decoration.

Keep cleaning different from rewriting policy. If the source says that a battery fault requires inspection, replacing this with “faulty batteries are covered” changes the rule. Likewise, an unclear sentence is not permission to guess. Flag ambiguity for the document owner, the person responsible for keeping the source accurate, and keep unapproved interpretations out of published knowledge.

## Convert the format, preserve the relationships

**Extraction** turns information from a source into text or another usable representation. Some PDFs contain selectable text; others contain page images. **Optical character recognition**, usually called OCR, recognises letters in images. OCR can misread small print, punctuation and numbers, so apparently fluent output still needs checking against the source.

- **PDF documents** — Check page order, columns and footnotes. A sentence from a neighbouring column must not become part of the warranty rule.

- **Presentation slides** — Keep slide titles and explanatory notes together. A short bullet may rely on a diagram or the presenter's explanation.

- **Spreadsheets** — Carry column headings, units and relevant sheet names into the text. A cell value without its product and condition is not a complete fact.

- **Images** — Use OCR for written text and descriptions for visual relationships. Preserve uncertainty when a label or symbol cannot be read reliably.

For slides, “Extended coverage” beneath a product photograph may not explain what is covered or for whom. Obtain an approved explanation rather than generating missing policy from the picture. For spreadsheets, preserve the difference between a displayed result and the formula used to calculate it. A prepared passage should name the product, the measure and any conditions instead of listing disconnected cells.

A **media description** expresses visual or audible information in words. It can explain that a diagram places the charging port beneath a protective cover, something OCR alone may miss. Descriptions are interpretations, not perfect copies. Check consequential details such as connector labels and safety symbols, and do not infer an unseen feature from a familiar-looking product.

Related: on AIVAX, [Fetch and OCR](https://docs.aivax.net/docs/web-foundation/fetch-and-ocr.md) extracts readable content, while [Media Descriptions](https://docs.aivax.net/docs/generations/media-descriptions.md) creates reusable descriptions. [Media Injector](https://docs.aivax.net/docs/rag/media-injector.md) processes supported media into collection documents. Choose the documented path for the source type; converting slides or spreadsheets may require preparation outside that media-import workflow.

## Divide by meaning, not only by length

A **chunk** is a passage stored or handled as a searchable unit. **Segmentation** divides longer text into these units. Imagine replacing a large binder with labelled reference cards: each card should cover a useful topic without sending the reader to another card just to understand its subject.

Start with natural boundaries such as headings, complete answers and procedure sections. Keep a rule with its conditions and exceptions. Retain the product name when a passage would otherwise begin with “this device”. If the source already consists of short, self-contained answers, additional splitting may create work without improving retrieval.

**Chunk too big**

A single Trail Lamp passage contains charging instructions, warranty rules, packaging disposal and the entire accessory catalogue.

A battery-coverage question brings back a large amount of unrelated material, making the important exception harder to identify.

**Right-sized for the question**

A passage named “Trail Lamp battery warranty” contains the coverage rule, inspection requirement and exclusions from the approved source.

The passage stays focused while preserving the conditions needed to answer accurately.

Too small is also a problem. “Requires inspection” is not useful alone if the product and relevant fault appear in another passage. **Overlap** means repeating some text across neighbouring chunks to preserve continuity. It can help with boundaries, but excessive overlap produces duplicate results and more maintenance. Prefer sensible structure before adding repeated text.

On AIVAX, [Text Segmentation](https://docs.aivax.net/docs/rag/text-segmentation.md) returns coherent text segments for review and later use. Segmentation itself does not store the submitted documents or create the search index. Review what the process produced before treating it as finished knowledge.

## Add labels that make maintenance possible

**Metadata** is information about the content rather than the content itself. Useful examples include the document owner, product, source reference, effective date and review date. Distinguish these dates: uploading an old manual today does not make its policy current. When passages are separated, carry the relevant metadata with them so their identity is not lost.

**Classification** assigns content to categories, such as warranty, setup or safety. Categories help people organise material and can support search selection. Define what each category means and how to handle a passage that fits more than one. Review uncertain assignments instead of forcing every document into a misleading label. On AIVAX, this capability is called [Document Classification](https://docs.aivax.net/docs/rag/classification.md).

Labels do not automatically enforce permissions. An “internal” label only protects a document if trusted application rules use it to restrict access. Likewise, a product label cannot repair a passage that silently mixes several products. Combine accurate text, accurate metadata and actual access controls.

Before publishing, try a routine question, an exception and a question the source cannot answer. Confirm that the prepared material supports the first cases without encouraging a guess in the last. When a source changes, replace or retire its outdated passages; otherwise the clean new version may compete with the old one.

What's next: combine durable knowledge with facts that change during a conversation in [Dynamic context](https://docs.aivax.net/learn/teaching-agents/dynamic-context.md).

**Knowledge check.** What is the safest way to prepare a warranty document for retrieval?

1. Remove every repeated line, including dates and warnings
2. Split every document into the smallest possible fragments
3. Preserve complete rules and exceptions, attach source metadata and check the result against the original
4. Treat a successful upload as proof that all facts are searchable

Answer: option 3. Useful preparation preserves meaning and traceability. Cleaning, conversion and segmentation need review because each can lose information even when processing succeeds.
