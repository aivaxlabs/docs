Source: https://docs.aivax.net/learn/agents/what-is-an-llm.html

A **large language model**, usually shortened to **LLM**, is a model trained on large amounts of text to recognise and generate patterns in language. A model is a mathematical system whose internal values have been adjusted through examples. It can draft an e-mail, summarise a complaint or suggest the next question in a conversation. It does not need a separate hand-written rule for every sentence it encounters.

Imagine an unusually capable text-completion system. Instead of completing only a word, it can continue a conversation, an explanation or a structured document. That comparison helps explain the basic mechanism, but it does not mean the output is limited to copying familiar phrases. Learning from many examples lets the model combine patterns in new ways, including ways that are useful and ways that are mistaken.

## Text becomes pieces called tokens

A **token** is a unit of text handled by the model. Depending on the system and language, it might be a word, part of a word, punctuation or another small piece. A **tokenizer** is the component that splits text into those pieces and represents them as numbers. There is no universal rule that a word always equals a token.

The model receives a sequence of tokens. For each next position, it estimates which tokens would fit, selects one and repeats the process using the expanded sequence. This is **next-token prediction**. Repeated small selections can produce a long answer, much as individual notes can form a melody. The quality of the whole answer depends on more than any single selection.

> **Interactive demo: Try it: text becomes tokens.** This interactive demo is available on the web page. Change the sentence, add punctuation or try another language. This is a simplified teaching demonstration, not an exact measurement for a particular model. Real tokenizers can split the same text differently.



Token counts matter because there is a limit to how much text a model can work with in a request, and usage is often measured through input and output tokens. For now, remember that a longer message usually consumes more of that space, but character counts are not a precise substitute. [Context window, tokens and cost](https://docs.aivax.net/learn/prompt-engineering/context-window-tokens-and-cost.md) explores the practical consequences.

## Training is different from answering

During **training**, the model repeatedly works with examples and adjusts its internal values to improve its predictions. Those values are often called **parameters**. They are not a filing cabinet of complete documents that the system opens one at a time. They encode patterns learned across the training material, including language structure, relationships between concepts and many factual associations.

After this broad training, additional training can encourage following instructions, responding helpfully or refusing certain requests. This changes tendencies, not the need for checking. When you later send a question, the model normally uses its existing parameters rather than being retrained on the spot. Producing an answer with an already trained model is called **inference**.


- **Before use — Learn patterns**: Training adjusts the model using examples of text. It learns regularities that can transfer to questions it has not seen before.

- **Before use — Shape behaviour**: Further training can encourage instruction following and other desired responses. It does not turn every answer into a verified fact.

- **During use — Generate a response**: The application supplies instructions and information. The model generates tokens using what it learned and what it receives now.




This distinction explains a common misunderstanding: correcting a model in a conversation does not necessarily teach the underlying model permanently. It can use the correction while that information remains available in the conversation. Lasting memory or a later training process is a separate mechanism. Likewise, sending a company document gives the model material for the current work; it does not automatically update every future conversation.

## Why it seems to know things

If training material repeatedly connects a place with its country, the model may learn that association and reproduce it when asked. It also learns ways to explain relationships, organise an argument or translate a sentence. These abilities can look like searching an encyclopaedia, even when no search happened.

But a model's learned information is not a live connection to the world. It may be outdated, incomplete or distorted by the material available during training. It will not know today's status of a private order just because it can explain delivery processes. A reliable business assistant needs current evidence from documents or tools when its answer depends on current or private facts.

A **hallucination** is an output that presents invented, incorrect or unsupported information as though it were grounded. For example, a model may produce a plausible-looking policy exception or citation when no supporting source was supplied. This is not evidence of deliberate deception. The process that produces useful language can also produce a convincing continuation where the correct response would have been “I do not have enough information.”


**Plausible wording**

“Your replacement has already been approved.” The sentence sounds helpful, but no approval record has been checked.


**Grounded wording**

“I do not have an approval result yet. I can check the request or help you contact the team responsible.” The reply distinguishes evidence from possibility.





## Temperature changes variety, not truth

The model may assign a high probability to several possible next tokens. **Temperature** is a generation setting that changes how strongly selection favours the more probable candidates. Lower settings usually make output more focused or repetitive. Higher settings usually introduce more variety and can also produce less suitable choices. The exact behaviour depends on the model and how generation is implemented.

> **Interactive demo: Try it: choose the next word.** This interactive demo is available on the web page. These probabilities are illustrative, not a weather forecast. Change the temperature and draw several continuations. Notice how the distribution affects variety without adding any evidence about tomorrow's weather.



A low temperature does not make an unsupported claim factual. It may simply make the same wrong answer more repeatable. A high temperature does not give the model more knowledge. For a creative title, variation can be useful; for an order status, the decisive improvement is a trustworthy lookup. Treat generation settings and evidence as different controls.

## Strengths to use and limits to design around

LLMs are often useful when the task involves interpreting or transforming language. A manager can ask for a shorter version of a long memo. A support team can organise incoming messages into categories. A salesperson can turn approved product notes into an initial draft. In each case, the model helps with expression and interpretation rather than becoming the authority for the business decision.


- **Strong fit: transform supplied text** — Summarise, rewrite or translate material while preserving its important meaning. Check that exceptions and qualifications survive the transformation.

- **Strong fit: interpret varied wording** — Recognise that different customer phrases may describe the same need. Ask a clarifying question when several interpretations remain possible.

- **Needs support: exact or live facts** — Use dependable calculation software and current records rather than relying on a plausible answer produced from training alone.




A model can also make reasoning mistakes, overlook a condition in a long document or choose an inappropriate next action. Supplying better information helps, but it is not a guarantee of correct use. For important tasks, define what counts as a successful answer, compare it with trusted examples and decide who reviews the result. The model is a capable component in a system, not the entire system.

**What's next:** See how that component becomes useful in a business process in [From LLMs to agents](https://docs.aivax.net/learn/agents/from-llms-to-agents.md).

**Knowledge check.** Why should a business not treat fluent output as proof that a claim is true?

1. Lower temperature guarantees factual answers
2. The model always searches an up-to-date database before replying
3. A fluent answer can be unsupported because generating likely text is not the same as verifying a fact
4. Sending a correction always retrains the model permanently

Answer: option 3. The model generates text from learned patterns and supplied information. Factual reliability depends on evidence and validation, not fluency or temperature alone.
