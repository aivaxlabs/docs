---
title: Introduction to artificial intelligence
linkTitle: Introduction to AI
description: "What artificial intelligence is in plain language, how it differs from ordinary software, where language models fit, and why the word agent suddenly matters."
weight: 20
duration: 12
objectives:
  - Explain the difference between a program that follows rules and a system that learned from examples.
  - Place machine learning, deep learning, language models and agents in relation to each other.
  - Describe, without jargon, what a language model does when it answers.
  - Recognise what today's AI is good at and where it fails.
---

Artificial intelligence is a broad name for software that performs tasks we usually associate with human judgement: understanding a sentence, recognising a face, deciding the next move in a game, or writing an e-mail. The name is old — it was coined in 1956 — but what people mean by it has changed several times. This unit gives you the current meaning and the vocabulary used throughout Learn.

## Rules versus learning

Ordinary software follows rules that a person wrote down. A spreadsheet adds numbers because someone programmed addition. A banking app blocks a transfer because a developer wrote *if the balance is lower than the amount, refuse*. The behaviour is fully specified in advance.

Most of what is called AI today works differently: nobody writes the rules. Instead, the system is shown a very large number of examples and adjusts itself until its answers match the examples. We say the system was **trained**, and the result is a **model**.

{{< compare >}}
{{< side title="Traditional program" tone="bad" >}}
A person writes every rule.

Behaviour is predictable and easy to explain.

Fails on anything the rules did not anticipate.

Example: an invoice validator that checks mandatory fields.
{{< /side >}}
{{< side title="Trained model" tone="good" >}}
The system infers patterns from examples.

Behaviour is statistical; it can be surprising.

Handles variations it has never seen, within limits.

Example: a model that reads any invoice layout and extracts the total.
{{< /side >}}
{{< /compare >}}

Neither approach is better in general. Rules win when the task is precise and the cost of error is high; learned models win when the input is messy, varied or expressed in human language.

## A short history

{{< timeline >}}
{{< event date="1950s" title="The name and the first programs" >}}
Alan Turing asks whether machines can think. The term *artificial intelligence* is coined at a workshop in Dartmouth in 1956. Early programs prove theorems and play checkers using hand-written rules.
{{< /event >}}
{{< event date="1980s" title="Expert systems" >}}
Companies encode the knowledge of specialists as thousands of *if-then* rules. The systems work in narrow fields but are expensive to maintain and brittle outside them.
{{< /event >}}
{{< event date="1990s–2000s" title="Machine learning becomes practical" >}}
Instead of writing rules, researchers train statistical models on data. Spam filters, product recommendations and credit scoring become everyday applications.
{{< /event >}}
{{< event date="2012" title="Deep learning" >}}
Neural networks with many layers, trained on graphics processors, win image-recognition contests by a wide margin. Speech recognition and translation improve rapidly.
{{< /event >}}
{{< event date="2017" title="The transformer" >}}
A new network design makes it practical to train on enormous amounts of text. It becomes the foundation of most widely used large language models.
{{< /event >}}
{{< event date="2022 onwards" title="Conversational models and agents" >}}
Models that write fluent text become available to the public. Developers start connecting them to tools, documents and other systems, and the word **agent** enters everyday vocabulary.
{{< /event >}}
{{< /timeline >}}

## The vocabulary, and how it fits together

The terms you hear most often are not competitors. The first three are nested fields, each a narrower part of the previous one:

{{< flow "Artificial intelligence | Machine learning | Deep learning" >}}

The last two are not fields but things you build. A large language model is one product of deep learning, and an agent is a system built *around* such a model:

{{< flow "Deep-learning model | Large language model | Agent" >}}

{{< cards >}}
{{< card title="Artificial intelligence" icon="sparkle" >}}
The whole field: any technique that lets software do something that seems to require intelligence, with or without learning.
{{< /card >}}
{{< card title="Machine learning" icon="refresh" >}}
The subset where behaviour is learned from examples instead of programmed.
{{< /card >}}
{{< card title="Deep learning" icon="stack" >}}
Machine learning done with large neural networks: many layers of simple numeric operations tuned together.
{{< /card >}}
{{< card title="Language models" icon="chat" >}}
Models trained on text to predict the next word. Small ones existed long before deep learning; the large ones behind today's chat assistants (LLMs) are deep-learning models.
{{< /card >}}
{{< card title="Agents" icon="robot" >}}
Not a kind of model but a system: a language model wrapped with instructions, memory, knowledge and tools so it can carry out tasks, not only answer.
{{< /card >}}
{{< /cards >}}

## What a language model actually does

A language model does one thing: given some text, it estimates which piece of text is likely to come next. It does that over and over, one small piece at a time, until it produces a complete answer. Those small pieces are called **tokens** — roughly a short word or part of a word.

{{< demo name="tokenizer" title="Try it: how text becomes tokens" config=`{"text": "An agent is a model with tools and a goal.", "labels": {"prompt": "Type any sentence"}}` >}}
Models never see letters or words. They see a sequence of numbered pieces. This simplified demo splits text the way a model roughly would; real tokenizers differ in the details, but the idea is the same.
{{< /demo >}}

Two consequences follow from *predict the next token* and explain most of what feels strange about AI:

- **The model has no notion of truth.** It produces what is plausible given its training, which is usually correct and sometimes confidently wrong. The industry calls the wrong case a *hallucination*; a better word is *confabulation*.
- **The model does not remember you.** Each request starts from zero. Everything it should know about the conversation must be sent again with every message. Later units explain how memory and knowledge are built on top of this limitation.

{{< demo name="temperature" title="Try it: the next word is a draw, not a lookup" config=`{"prefix": "Tomorrow the weather will be", "candidates": [["sunny", 0.52], ["cloudy", 0.22], ["rainy", 0.14], ["windy", 0.08], ["purple", 0.04]]}` >}}
The model assigns a probability to every candidate token and then draws one. A setting called *temperature* flattens or sharpens the distribution. Move the slider and draw a few times.
{{< /demo >}}

## What today's AI is good at

{{< chart type="bar" title="Typical fit of language models by task (illustrative)" unit="/10" data=`[{"label":"Summarising text","value":9},{"label":"Drafting and rewriting","value":9},{"label":"Classifying and extracting","value":8},{"label":"Answering from provided documents","value":8},{"label":"Multi-step planning with tools","value":6},{"label":"Exact arithmetic without tools","value":3},{"label":"Knowing recent or private facts","value":2}]` caption="These scores are a teaching device, not a benchmark. The two weakest rows are exactly what tools and knowledge, covered in the Agents module, were invented to fix." >}}

Language models are excellent at tasks whose answer is *written in the input* or that are common in human text: summarising, translating, rephrasing, extracting fields, classifying, and drafting. They are weak at anything that requires precise computation, up-to-date facts, or information that only your company has. Agents exist to compensate for exactly those weaknesses.

## Why the word *agent* matters now

Until recently, using a model meant typing a question and reading an answer. An **agent** keeps the model at the centre but gives it:

{{< steps >}}
{{< step title="Instructions" >}}
A written role, goals and limits — what the model is for and how it should behave.
{{< /step >}}
{{< step title="Context" >}}
The conversation so far, who the user is, and any facts the model should take into account.
{{< /step >}}
{{< step title="Knowledge" >}}
Documents the model can search for evidence before answering. This reduces guessing rather than ending it: the search can miss the right passage, and the model can still misread what it finds.
{{< /step >}}
{{< step title="Tools" >}}
Actions it can request — look up an order, send an e-mail, create a ticket — executed by ordinary software.
{{< /step >}}
{{< step title="Guardrails" >}}
Checks that keep it on topic, safe and compliant, and routes to a human when needed.
{{< /step >}}
{{< /steps >}}

The next module builds exactly that, one piece at a time, starting with [Introduction to AI agents](../agents/introduction-to-ai-agents.md).

{{< quiz options="It looks up the correct answer in a database of facts | It predicts the most likely next token, one piece at a time, based on patterns learned from text | It follows rules written by its developers for each possible question" answer="2" explanation="Prediction, not lookup, is why models are fluent, why they can be wrong with confidence, and why agents add knowledge and tools around them." >}}
Which sentence best describes how a language model produces an answer?
{{< /quiz >}}
