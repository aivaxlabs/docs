Source: https://docs.aivax.net/learn/models/embeddings-and-semantic-search.html

A customer asks, “When will I get my money back?” Your help centre uses the heading “Refund processing times.” A search system that depends only on identical words may miss the connection. **Semantic search** aims to find material related in meaning, even when the question and the document use different wording.

One common ingredient is an **embedding**: a list of numbers produced by a model to represent aspects of a piece of content. You do not need to read those numbers yourself. Their purpose is to let software compare pieces of content efficiently, much as a map lets a delivery service compare locations without rereading every street description.

## A map of meaning, with important limits

On a geographical map, places near each other have similar coordinates. In an embedding system, content with related patterns tends to receive nearby numerical representations. “Refund,” “money back,” and “return my payment” may therefore lead to similar documents. The relationship is learned from training, not from a person writing a complete dictionary of synonyms.

The map is only an analogy. An embedding has many numerical coordinates, not just a north–south and east–west position. Individual coordinates usually do not have simple labels such as “refund” or “customer happiness.” The representation compresses information into a form useful for comparison; it is not a complete, readable copy of the original meaning.

- **Text** — The question or passage you want to compare, such as a customer's request or a paragraph from a returns policy.

- **Embedding** — A numerical representation created by an embedding model. The same compatible model setup must be used for the material being compared.

- **Similarity** — A measure of how close two representations are. It helps rank candidates, but it does not prove that a passage answers the question.

An embedding model does not write the answer a customer sees. It helps locate promising source material. A separate language model can read that material and compose a reply, or an ordinary application can display the matching documents without generating anything. Keeping search and answer writing separate makes problems easier to diagnose.

The original text still matters. If you retain only numbers without a connection back to the source, you cannot show the policy, check its date, or quote the relevant passage. A practical search system stores or references both the representation and the content it represents, along with useful information such as a title and access rules.

## From a document to a search result

**Indexing** means preparing content so the system can search it efficiently later. Long documents are often divided into **chunks**, smaller passages that stay focused on a topic. Splitting a policy at a sensible section boundary helps; splitting a sentence away from its exception can make the resulting passage misleading.

1. **Prepare useful passages**

Keep a policy rule together with the conditions needed to understand it. Retain a source reference and remove obsolete duplicates.

2. **Create and store representations**

An embedding model converts each passage into numbers. The search system stores those numbers with a way to recover the original passage.

3. **Represent the question**

The system converts the user's question using a compatible embedding model and compares it with the stored representations.

4. **Return candidates**

The closest eligible passages become candidate results. Check relevance and permissions before using them as evidence in an answer.

**Candidates** are possible matches, not verified answers. A question about refund timing might retrieve a general returns policy, a bank-processing note, and an old promotional exception. All may be related to refunds, but only some apply to the customer's situation. Search narrows the reading task; it does not remove the need to interpret the evidence.

A model change can also change the map. Embeddings from unrelated models, or incompatible versions and settings, should not be mixed as though their coordinates mean the same thing. Updating an embedding setup may require rebuilding stored representations. Plan that as a search-system change and test the results rather than treating it as a harmless label change.

## Try related wording

> **Interactive demo: Try it: different words can point to the same topic.** This interactive demo is available on the web page. Try “money back,” “refund,” and “delivery.” This is a simplified local teaching demo with predefined matching terms, not a live embedding model or a measure of search quality. Real semantic search represents content numerically rather than relying on this small term list.

The useful observation is the change in vocabulary, not a score from the demo. People describe the same need in different ways. Search tests should therefore include customers' language, abbreviations, misspellings, and the terminology used inside your organisation. A test made only from document headings can look successful while failing ordinary user questions.

Also test questions whose answers are absent. A search system can usually return something related even when nothing answers the question. An internal assistant asked about an unpublished policy should say that the evidence is missing, not turn the nearest available paragraph into an invented rule.

## Where exact matching still matters

Similarity is especially useful for concepts and paraphrases. It is less dependable for exact identifiers and fine numerical distinctions. Two product codes can look almost identical while referring to different items. Policies that say “before renewal” and “after renewal” share much of their vocabulary but may imply opposite outcomes.

For order references, invoice numbers, or exact codes, use an exact lookup or a search method that preserves those values. **Keyword search** matches words or terms more directly. **Hybrid search** combines meaning-based and keyword-based signals. **Filters** restrict which documents are eligible using explicit properties, such as department, date, or product category. These approaches complement embeddings rather than compete with them.

Do not use similarity as an access-control decision. Whether a person may read a salary document is a permissions question, not a question about how relevant the document is. Restrict the eligible material before exposing results or passing them into an answer generator. Sensitive passages should not be included merely because they score highly.

## How search powers RAG

**Retrieval-augmented generation**, or **RAG**, means finding relevant source material and giving it to a model before it writes an answer. The material supplements what the model learned during training. It can provide current company policies or internal instructions that the model would not otherwise know.

User question → Eligible source search → Relevant passages → Model reads evidence → Answer with source references

RAG does not retrain the model with each search. It places evidence in the current request. If the right passage is missing, outdated, or misunderstood, the answer can still be wrong. An answer with a citation also needs checking: the cited passage must actually support the claim, not merely discuss the same topic.

A **reranker** takes an existing set of candidates and reorders them for the question. It can make the most useful passage easier to select, but cannot recover a document that was never retrieved. This distinction prevents an expensive mistake: adding a reranker when the real problem is missing source material or an incorrect eligibility filter.

- **3** — separate checks: evidence exists, retrieval finds it, answer uses it

- **0** — new documents recovered by reranking an unchanged candidate set

For a practical review, collect questions with known supporting passages. Check whether the passages appear among the candidates, whether they are near the top, and whether unrelated material is being included. Then review the final answers separately. This separates a search failure from a writing failure and gives the team a specific place to improve.

Related: on AIVAX, [semantic search](https://docs.aivax.net/docs/rag/semantic-search.md) retrieves indexed documents, and [reranking](https://docs.aivax.net/docs/rag/reranking.md) adjusts candidate order. Continue with [What is a RAG?](https://docs.aivax.net/learn/teaching-agents/what-is-a-rag.md) for the complete evidence-to-answer process, or [retrieval strategies](https://docs.aivax.net/learn/teaching-agents/retrieval-strategies.md) for choosing how to search.

What's next: compare [reasoning and standard models](https://docs.aivax.net/learn/models/reasoning-vs-standard-models.md) to decide how much processing an answer needs after the evidence is available.

**Knowledge check.** The correct refund rule never appears in the retrieved candidates. What should you investigate first?

1. Increase the reranker until it invents the missing passage
2. Fix document preparation or retrieval so the relevant passage becomes a candidate
3. Treat the highest similarity score as proof that the answer exists
4. Increase the answer's temperature

Answer: option 2. Reranking only reorders supplied candidates. If the needed evidence is absent, investigate the source content, indexing, query, and eligibility filters before adjusting how candidates are ordered.
