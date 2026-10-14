---
title: What is an AI gateway?
linkTitle: "#1 AI gateway"
description: "Pipi shows why a language model alone is just a brilliant brain in a jar, and how a gateway builds everything around it."
weight: 10
duration: 5
objectives:
  - Tell the difference between a language model and the gateway around it.
  - Name the five things a gateway adds to a model.
  - Explain why a gateway lets you swap models without rebuilding the rest.
---

In the first episode, Pipi introduces the drawing that the whole series reuses: a pink brain inside a glass jar. The brain is the language model. Everything Pipi builds around the jar is the gateway.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/01-gateway.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/01-gateway.webp" title="AIVAX Learn #1 — What is an AI gateway?" lang="pt-BR" caption="Episode 1 · 1 minute" >}}

## What the video shows

A **large language model** (LLM) is software trained on a huge amount of text. It reads, writes and answers almost anything, which is why Pipi calls it a brilliant brain. On its own, though, it has three gaps: it does not know your company, it does not follow your rules, and it cannot use any tools.

Three question balloons float up to the jar, "My company?", "Rules?", "Tools?", and each one deflates. Pipi puts on a hard hat and assembles a machine around the jar, one part per word:

{{< cards >}}
{{< card title="Instructions" icon="list-check" >}}Who the assistant is and how it should behave, read in every conversation.{{< /card >}}
{{< card title="Knowledge" icon="book" >}}Your documents, so answers come from facts instead of guesses.{{< /card >}}
{{< card title="Tools" icon="tools" >}}Actions the model can request, such as looking up an order.{{< /card >}}
{{< card title="Safety" icon="shield" >}}Moderation and rules that keep answers within bounds.{{< /card >}}
{{< card title="Costs" icon="coin" >}}Limits and usage tracking so spending stays predictable.{{< /card >}}
{{< /cards >}}

The machine turns green. Then comes the twist: Pipi takes the pink brain out and plugs in a blue one. The machine keeps working.

## Why the twist matters

New models appear every few months, and the best choice for a task changes over time. When instructions, knowledge, tools and safety live in the gateway rather than in your application code, changing the model is a configuration change. Your website, your WhatsApp number and your internal tools keep calling the same gateway.

{{< flow "Your application | AI gateway (instructions, knowledge, tools, safety, costs) | Language model | Answer" >}}

On AIVAX, you send the gateway's ID in the `model` field of an OpenAI-compatible request, and AIVAX applies everything stored in it. The person who manages the gateway controls behaviour; the application only sends messages.

## Go deeper

- In Learn: [What is an LLM](../agents/what-is-an-llm.md), [From LLMs to agents](../agents/from-llms-to-agents.md) and [Model families and how to choose](../models/model-families-and-choosing.md).
- In the Documentation: [AI gateways](../../docs/inference/ai-gateway.md) explains what a gateway stores and a recommended production configuration. The [Overview](../../docs/overview.md) shows when to call a model directly instead.

The next episode opens the first part of the machine: the instructions badge and the shelf of skills.

{{< quiz options="The gateway trains a new model on your data | The gateway stores instructions, knowledge, tools and safety around the model, so the model can be swapped | The gateway is a faster version of the same model" answer="2" explanation="The gateway does not change the model itself. It keeps the configuration around it, which is why Pipi can swap the brain and the machine keeps running." >}}
In Pipi's machine, what does the gateway do?
{{< /quiz >}}
