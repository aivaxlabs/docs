---
title: Retrieval strategies
linkTitle: Retrieval strategies
description: "Choose search and ranking techniques that bring the right evidence into an agent's context without overwhelming it."
weight: 60
duration: 12
objectives:
  - Compare keyword, semantic and hybrid retrieval.
  - Explain how reranking and metadata filters affect evidence selection.
  - Describe trade-offs in result count and chunk size.
  - Use question-based evaluation to choose retrieval changes.
---

Finding the right evidence resembles asking a colleague to pull useful pages from a filing cabinet. Sometimes you know the exact form name. Sometimes you can describe the problem but not the official terminology. Sometimes several pages look relevant until someone reads them carefully. Different retrieval strategies address these different situations.

A **retrieval strategy** is the method used to select information for a question. It can include searching, restricting the eligible sources and putting candidates in a useful order. There is no universal setting that makes every collection work well. The right approach depends on the questions, document structure, language and consequences of missing or mixing evidence.

## Match words, meanings or both

**Keyword search** looks for matching words or phrases. It is useful for exact product names, error messages and reference codes. If a user asks about a particular model designation, preserving that exact text may matter more than finding a passage that sounds broadly similar. Keyword systems can also account for word variations, but they still depend substantially on textual overlap.

**Semantic search** looks for related meaning, often using embeddings, numerical representations that help compare text. It can connect “I cannot sign in” with a document titled “Account access problems”. This helps when users do not know the organisation's preferred wording. Similarity is not the same as applicability, however: two different products may have almost identical troubleshooting instructions.

**Hybrid search** combines signals from keyword and semantic retrieval. It aims to keep exact matches while also handling paraphrases, different ways of expressing the same idea. Combining methods adds choices about how results are merged and ranked, so it still needs evaluation. “Hybrid” describes an approach, not a promise of better answers in every collection.

{{< cards >}}
{{< card title="Keyword" icon="book" >}}
Useful when the precise words carry the identity, such as a named form or a copied error message.
{{< /card >}}
{{< card title="Semantic" icon="compass" >}}
Useful when the user describes a need in everyday language rather than repeating the document's wording.
{{< /card >}}
{{< card title="Hybrid" icon="stack" >}}
Useful when both exact terms and broader meaning matter within the same question set.
{{< /card >}}
{{< /cards >}}

Imagine a fictional device called the Trail Lamp. A question about “Trail Lamp battery replacement” benefits from the exact product name. “My outdoor light no longer holds a charge” benefits from meaning-based matching, but may first require clarification about which product the person owns. Search should not silently guess the product merely because one document happens to rank first.

## Distinguish finding candidates from choosing evidence

**Reranking** is a second pass that reorders an initial set of search results by relevance to the question. The first search gathers plausible pages quickly. The reranker takes a closer look, like a colleague reading a shortlist before choosing the pages worth forwarding.

A reranker can improve the order of available candidates, but it cannot rescue a document that never entered the candidate set. It also adds processing, which may affect response time and cost. Use it when relevant passages are being found but buried below weaker matches, and verify whether the improvement matters to final answers.

{{< flow "Question | Select eligible documents | Retrieve candidates | Rerank if useful | Select evidence | Generate answer" >}}

Related: on AIVAX, [reranking](../../docs/rag/reranking.md) provides relevance reordering, and [Reflex](../../docs/rag/reflex.md) is one documented reranking option. These product guides describe the available choices. The general lesson is to judge the selected evidence, not to assume that adding another processing stage automatically improves it.

## Restrict the search with metadata

**Metadata** is information about a document, such as its product, language, region, owner or effective date. A **filter** restricts which documents may participate in a search. If the user is asking about a confirmed product version, filtering to that version can prevent a highly similar but inapplicable manual from appearing.

Filters are especially important when rules differ between audiences or organisations. Apply permissions in trusted application logic rather than letting a user request any scope through ordinary chat. A relevance score does not establish authorisation. Similarly, do not treat an unverified user statement about their account as permission to retrieve restricted material.

On AIVAX, [document filters](../../docs/filters/document-filters.md) are supported on documented search surfaces. Availability depends on the retrieval path; the documentation distinguishes direct and tool-based searches from automatic gateway retrieval. Check that your chosen integration actually applies the intended filter rather than assuming every retrieval path behaves identically.

Filtering can also remove the answer accidentally. A document with missing or incorrect metadata may disappear from an otherwise valid search. When results are empty, check both the question and the eligible document set. Never broaden an access restriction just to return an answer; clarify the question or explain the lack of available evidence.

## Balance result count and passage size

**Top-k** means keeping the highest-ranked *k* results, where *k* is a chosen count. A small count gives the model a focused reading packet but may omit an exception or supporting procedure. A larger count can improve the chance of including needed evidence while also adding irrelevant, duplicate or contradictory text.

**Chunk size** is the amount of source material placed in each searchable unit. Smaller chunks can match a narrow question precisely but separate a rule from its conditions. Larger chunks preserve surrounding explanation but may mix several topics. A fixed length is a practical control, not a definition of good meaning boundaries.

| Choice | Potential benefit | Potential cost |
|---|---|---|
| Fewer results | Less distracting evidence | Missing a needed condition or second source |
| More results | Broader evidence for complex questions | More reading time and irrelevant content |
| Smaller chunks | Precise topic matching | Lost subject, exceptions or sequence |
| Larger chunks | More surrounding context | Weaker focus and unnecessary detail |

Change these settings using real examples. A question about a single definition needs less evidence than a comparison across policies. Before raising the result count, inspect whether current results are duplicates. Before shrinking chunks, check whether each smaller passage still makes sense on its own. Improving document structure may help more than adjusting a number.

## Rewrite unclear searches without changing intent

**Query rewriting** turns a user's wording into a clearer search request. In a conversation about the Trail Lamp, “Does that cover the battery?” might become “Trail Lamp warranty coverage for the battery.” The rewrite resolves a reference using known context; it should not invent a purchase date, product version or desired answer.

Rewriting can expand abbreviations, preserve exact terms and split a compound question into separate searches. Keep the original question available for comparison. If the missing detail cannot be inferred safely from the conversation, ask the user instead. A fluent rewrite of the wrong question can produce very convincing irrelevant evidence.

{{< tabs >}}
{{< tab title="Exact error message" >}}
Preserve the error wording and confirmed product version. Start by checking exact matches, then use broader meaning if the approved documentation uses a different explanation.
{{< /tab >}}
{{< tab title="Everyday question" >}}
Use semantic retrieval for paraphrased needs. Confirm the subject before applying restrictive product filters, and check that the selected passage answers the user's intent.
{{< /tab >}}
{{< tab title="Several plausible passages" >}}
Inspect the candidate set and consider reranking. If all candidates are weak, improve the source or initial search rather than only reordering the same weak evidence.
{{< /tab >}}
{{< /tabs >}}

## Choose with evidence, not a leaderboard

**Precision** measures how much of the retrieved material is relevant under a defined review rule. It differs from **recall**, which asks how much of the needed relevant material was found. A very short result list can be precise while missing an essential exception. Evaluate both retrieval and final answer quality.

{{< chart type="bar" title="Relevant passages in a fictional evaluation (illustrative)" unit="%" data=`[{"label":"Keyword","value":61},{"label":"Semantic","value":68},{"label":"Hybrid","value":73},{"label":"Hybrid plus reranking","value":79}]` caption="Invented precision figures for one teaching scenario, not a benchmark or expected ordering. Exact-code questions or different documents can reverse this pattern." >}}

Use the same labelled questions when comparing a change, and record response time alongside quality. Select the simplest approach that meets the task's requirements. Keep examples where the change helped and where it hurt, so the next adjustment addresses observed weaknesses rather than an attractive chart.

What's next: improve the material being searched in [Preparing documents for knowledge](preparing-documents-for-knowledge.md).

{{< quiz options="Reranking can recover any document missing from the initial candidates | The largest top-k always produces the best answer | Metadata filters restrict eligible documents, while ranking orders the candidates | Semantic similarity proves that a document applies to the current customer" answer="3" explanation="Filtering and ranking have different jobs. Filters restrict scope; ranking selects relevance within the available candidates. Neither similarity nor result count alone proves correctness." >}}
Which statement correctly describes retrieval controls?
{{< /quiz >}}
