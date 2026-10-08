---
title: How to write good documents
linkTitle: Write good documents
description: "Write knowledge documents that remain clear when searched in pieces, with explicit facts, conditions and useful examples."
weight: 40
duration: 11
objectives:
  - Organise a document around one identifiable topic.
  - Write sections that make sense without neighbouring paragraphs.
  - State conditions, dates and quantities explicitly.
  - Review document excerpts from the reader's and retriever's perspectives.
---

A helpful knowledge document works for two readers: a person learning the subject and a search system selecting evidence for a question. You do not need to write in a special machine language. You need to make the facts easy to identify and difficult to misinterpret, even when a section is read separately from the rest.

Think of a recipe card. “Cook it as usual until ready” assumes experience and missing context. “Bake the covered vegetable dish until the centre is hot” gives a clearer action, though an approved recipe would also need its specific temperature and timing. Knowledge writing has the same challenge: replace assumptions with the information someone needs to act correctly, without inventing details merely to sound precise.

## Give each document a clear job

Use one topic per document, where a topic is a coherent question or procedure rather than an arbitrary page length. “Returning an assembled bicycle” is easier to find and maintain than “Various customer information”. A procedure can contain several steps and still be one topic. Splitting each sentence into a separate document would destroy the relationships that make the procedure understandable.

Choose a descriptive title that includes the subject and the reader's purpose. “Expense claims: submitting travel receipts” is more useful than “Expenses update”. A title should distinguish the document from neighbouring material without relying on its folder name. Search results may display the title alone, and a retrieved section may not arrive with the entire folder hierarchy.

Open with a short statement of scope: who the rule applies to, what it covers and any important exclusions. Keep unrelated announcements, historical background and marketing material elsewhere. They may be useful documents in their own right, but they make a procedural answer harder to locate when mixed into the same source.

{{< cards >}}
{{< card title="Descriptive title" icon="book" >}}
Name the subject and task so readers can recognise the right source before opening it.
{{< /card >}}
{{< card title="Clear scope" icon="compass" >}}
State the audience, product, region or version that determines whether the guidance applies.
{{< /card >}}
{{< card title="Complete sections" icon="stack" >}}
Keep a rule together with its conditions and exceptions, even when the section is retrieved alone.
{{< /card >}}
{{< /cards >}}

## Make sections self-contained

A **self-contained section** includes enough information to understand its main claim without reading an unrelated passage first. This matters because retrieval often selects chunks, smaller portions of documents, rather than the complete source. A chunk may be excellent at matching the question but still be unusable if the subject or exception was left behind.

Pronouns such as “it”, “they” and “this” are not inherently wrong. They become risky when their meaning depends on text outside the selected section. Repeat the important noun when a new heading or paragraph begins. Natural, modest repetition is better than an elegant sentence whose subject disappears during retrieval.

The following fictional excerpts illustrate writing quality, not an actual company policy.

{{< compare >}}
{{< side title="Subject lost" tone="bad" >}}
### Exceptions
They cannot be returned after that period. Contact them if it was damaged.
{{< /side >}}
{{< side title="Subject preserved" tone="good" >}}
### Returning assembled bicycles
The standard assembled-bicycle return period does not cover damage claims. Customers reporting delivery damage should contact the support team for the damage-claim procedure.
{{< /side >}}
{{< /compare >}}

The improved excerpt names the product, distinguishes two situations and identifies the next step. It deliberately does not invent a return duration: if the approved source lacks that fact, the writer must obtain it. Good writing exposes missing information instead of concealing it behind confident prose.

A section that refers to another policy should explain why that reference matters. “For delivery damage, follow the damage-claim procedure rather than the standard return procedure” is useful. “See the other document” is not. Where the actual destination exists, include a descriptive link so a person can verify the complete rule.

## Replace vague qualifiers with approved facts

Words such as “soon”, “normally”, “large” and “recent” can hide important decisions. Ask which event starts a deadline, which unit a quantity uses and which conditions change the rule. If the source gives a date, clarify whether it is the publication date, effective date or expiry date. These are different facts.

{{< compare >}}
{{< side title="Vague deadline" tone="bad" >}}
Claims must be submitted quickly. Managers approve larger amounts. The new rule applies from next month.
{{< /side >}}
{{< side title="Explicit illustrative rule" tone="good" >}}
For this fictional policy, travel claims must be submitted within 10 calendar days after the trip ends. Claims above the published approval threshold require a manager's review. The policy takes effect on 1 June 2030.
{{< /side >}}
{{< /compare >}}

The illustrative deadline and date make the structure visible; they are not recommendations for a real expense policy. Notice that the approval threshold still needs a reliable reference or an approved value. Never fill missing amounts or dates from intuition. Precision helps only when the facts are correct.

Separate a promise from an estimate. “The team aims to review requests within the stated service window” is not equivalent to guaranteeing approval by a deadline. Preserve uncertainty when the source genuinely contains it, and explain the conditions behind that uncertainty. Removing all qualifications can make a document shorter while making its meaning less accurate.

## Use questions and tables where they help

A **question-and-answer format**, or Q&A, pairs a realistic question with a direct response. It works well for recurring concerns such as “Can a colleague submit an expense claim for me?” Start with the answer, then explain conditions and the next step. Avoid creating many nearly identical pages for alternate phrasings; those copies are harder to maintain and can crowd search results.

Tables are useful when readers must compare the same attributes across options. Give every column a clear heading, repeat the option name in each row and avoid merged cells that lose their meaning when converted into plain text. The table below is an illustrative structure, not a service offering.

| Request type | Information required | Who reviews it |
|---|---|---|
| Receipt correction | Original receipt and corrected details | Finance team |
| Missing receipt | Expense explanation and available evidence | Finance team under the exception procedure |
| Policy exception | Requested exception and business reason | Named policy owner |

After conversion, check that each row still connects the request type to its requirements. A table that looks attractive in a PDF may become a confusing sequence of values in extracted text. The writing and the document format must work together.

{{< accordion title="Should every document become a FAQ?" >}}
No. A troubleshooting sequence needs ordered steps, and a policy with several interacting conditions may need connected prose. Use Q&A when it reflects how people ask, not as a replacement for structure. A useful document can combine a direct answer, a short table and an ordered procedure without duplicating its facts.
{{< /accordion >}}

## Review the document as evidence

{{< steps >}}
{{< step title="Read one section alone" >}}
Hide neighbouring paragraphs. Can you identify the subject, applicable audience and conditions without guessing?
{{< /step >}}
{{< step title="Ask a realistic question" >}}
Use wording from a customer or colleague. Check whether the section actually answers the question rather than merely mentioning the topic.
{{< /step >}}
{{< step title="Trace every important fact" >}}
Confirm dates, quantities and exceptions with the owner. Mark unresolved facts for review instead of filling them in.
{{< /step >}}
{{< step title="Check the next action" >}}
Make sure the reader knows what to do, what not to assume and where to go when the rule does not cover the situation.
{{< /step >}}
{{< /steps >}}

Keep the review practical. Ask a colleague unfamiliar with the topic to interpret an excerpt and explain what they would do. If their answer differs from the owner's intention, improve the source before blaming retrieval. Repeat the check after major edits because a shortened paragraph can accidentally separate a rule from its exception.

Related: on AIVAX, these passages become [documents in a collection](../../docs/rag/collections.md). Clear structure makes those documents easier to retrieve and evaluate, but writing quality alone does not prove that an agent will use them faithfully.

What's next: check the resulting answers in [Measuring adherence and hallucination](measuring-adherence-and-hallucination.md).

{{< quiz options="Replace every product name with a pronoun to avoid repetition | Keep the subject, rule and applicable conditions together in a self-contained section | Put all exceptions in an unrelated document without references | Add precise deadlines even when no approved source provides them" answer="2" explanation="Retrieved sections need enough context to preserve meaning. Explicit subjects and approved conditions help; invented precision and missing exceptions do not." >}}
Which writing choice makes a document safer to use in retrieved chunks?
{{< /quiz >}}
