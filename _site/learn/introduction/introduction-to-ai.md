Source: https://docs.aivax.net/learn/introduction/introduction-to-ai.html

Artificial intelligence is a broad name for software that performs tasks we usually associate with human judgement: understanding a sentence, recognising a face, deciding the next move in a game, or writing an e-mail. The name is old — it was coined in 1956 — but what people mean by it has changed several times. This unit gives you the current meaning and the vocabulary used throughout Learn.

## Rules versus learning

Ordinary software follows rules that a person wrote down. A spreadsheet adds numbers because someone programmed addition. A banking app blocks a transfer because a developer wrote *if the balance is lower than the amount, refuse*. The behaviour is fully specified in advance.

Most of what is called AI today works differently: nobody writes the rules. Instead, the system is shown a very large number of examples and adjusts itself until its answers match the examples. We say the system was **trained**, and the result is a **model**.


**Traditional program**

A person writes every rule.

Behaviour is predictable and easy to explain.

Fails on anything the rules did not anticipate.

Example: an invoice validator that checks mandatory fields.


**Trained model**

The system infers patterns from examples.

Behaviour is statistical; it can be surprising.

Handles variations it has never seen, within limits.

Example: a model that reads any invoice layout and extracts the total.





Neither approach is better in general. Rules win when the task is precise and the cost of error is high; learned models win when the input is messy, varied or expressed in human language.

## A short history


- **1950s — The name and the first programs**: Alan Turing asks whether machines can think. The term *artificial intelligence* is coined at a workshop in Dartmouth in 1956. Early programs prove theorems and play checkers using hand-written rules.

- **1980s — Expert systems**: Companies encode the knowledge of specialists as thousands of *if-then* rules. The systems work in narrow fields but are expensive to maintain and brittle outside them.

- **1990s–2000s — Machine learning becomes practical**: Instead of writing rules, researchers train statistical models on data. Spam filters, product recommendations and credit scoring become everyday applications.

- **2012 — Deep learning**: Neural networks with many layers, trained on graphics processors, win image-recognition contests by a wide margin. Speech recognition and translation improve rapidly.

- **2017 — The transformer**: A new network design makes it practical to train on enormous amounts of text. It becomes the foundation of most widely used large language models.

- **2022 onwards — Conversational models and agents**: Models that write fluent text become available to the public. Developers start connecting them to tools, documents and other systems, and the word **agent** enters everyday vocabulary.




## The vocabulary, and how it fits together

The terms you hear most often are not competitors. The first three are nested fields, each a narrower part of the previous one:

Artificial intelligence → Machine learning → Deep learning


The last two are not fields but things you build. A large language model is one product of deep learning, and an agent is a system built *around* such a model:

Deep-learning model → Large language model → Agent



- **Artificial intelligence** — The whole field: any technique that lets software do something that seems to require intelligence, with or without learning.

- **Machine learning** — The subset where behaviour is learned from examples instead of programmed.

- **Deep learning** — Machine learning done with large neural networks: many layers of simple numeric operations tuned together.

- **Language models** — Models trained on text to predict the next word. Small ones existed long before deep learning; the large ones behind today's chat assistants (LLMs) are deep-learning models.

- **Agents** — Not a kind of model but a system: a language model wrapped with instructions, memory, knowledge and tools so it can carry out tasks, not only answer.




## What a language model actually does

A language model does one thing: given some text, it estimates which piece of text is likely to come next. It does that over and over, one small piece at a time, until it produces a complete answer. Those small pieces are called **tokens** — roughly a short word or part of a word.

> **Interactive demo: Try it: how text becomes tokens.** This interactive demo is available on the web page. Models never see letters or words. They see a sequence of numbered pieces. This simplified demo splits text the way a model roughly would; real tokenizers differ in the details, but the idea is the same.



Two consequences follow from *predict the next token* and explain most of what feels strange about AI:

- **The model has no notion of truth.** It produces what is plausible given its training, which is usually correct and sometimes confidently wrong. The industry calls the wrong case a *hallucination*; a better word is *confabulation*.
- **The model does not remember you.** Each request starts from zero. Everything it should know about the conversation must be sent again with every message. Later units explain how memory and knowledge are built on top of this limitation.

> **Interactive demo: Try it: the next word is a draw, not a lookup.** This interactive demo is available on the web page. The model assigns a probability to every candidate token and then draws one. A setting called *temperature* flattens or sharpens the distribution. Move the slider and draw a few times.



## What today's AI is good at


**Typical fit of language models by task (illustrative)**

| Item | Value |
| --- | --- |
| Summarising text | 9/10 |
| Drafting and rewriting | 9/10 |
| Classifying and extracting | 8/10 |
| Answering from provided documents | 8/10 |
| Multi-step planning with tools | 6/10 |
| Exact arithmetic without tools | 3/10 |
| Knowing recent or private facts | 2/10 |

These scores are a teaching device, not a benchmark. The two weakest rows are exactly what tools and knowledge, covered in the Agents module, were invented to fix.



Language models are excellent at tasks whose answer is *written in the input* or that are common in human text: summarising, translating, rephrasing, extracting fields, classifying, and drafting. They are weak at anything that requires precise computation, up-to-date facts, or information that only your company has. Agents exist to compensate for exactly those weaknesses.

## Why the word *agent* matters now

Until recently, using a model meant typing a question and reading an answer. An **agent** keeps the model at the centre but gives it:


1. **Instructions**

A written role, goals and limits — what the model is for and how it should behave.


2. **Context**

The conversation so far, who the user is, and any facts the model should take into account.


3. **Knowledge**

Documents the model can search for evidence before answering. This reduces guessing rather than ending it: the search can miss the right passage, and the model can still misread what it finds.


4. **Tools**

Actions it can request — look up an order, send an e-mail, create a ticket — executed by ordinary software.


5. **Guardrails**

Checks that keep it on topic, safe and compliant, and routes to a human when needed.





The next module builds exactly that, one piece at a time, starting with [Introduction to AI agents](https://docs.aivax.net/learn/agents/introduction-to-ai-agents.md).

**Knowledge check.** Which sentence best describes how a language model produces an answer?

1. It looks up the correct answer in a database of facts
2. It predicts the most likely next token, one piece at a time, based on patterns learned from text
3. It follows rules written by its developers for each possible question

Answer: option 2. Prediction, not lookup, is why models are fluent, why they can be wrong with confidence, and why agents add knowledge and tools around them.
