Source: https://docs.aivax.net/learn/learn-with-pipi/ai-gateway.html

In the first episode, Pipi introduces the drawing that the whole series reuses: a pink brain inside a glass jar. The brain is the language model. Everything Pipi builds around the jar is the gateway.

[Video: AIVAX Learn #1 — What is an AI gateway?](https://public.aivax.net/file/aivax-public/learn/pipi/01-gateway.mp4) — Pipi's videos are only available in Portuguese for now.

*Episode 1 · 1 minute*

## What the video shows

A **large language model** (LLM) is software trained on a huge amount of text. It reads, writes and answers almost anything, which is why Pipi calls it a brilliant brain. On its own, though, it has three gaps: it does not know your company, it does not follow your rules, and it cannot use any tools.

Three question balloons float up to the jar, "My company?", "Rules?", "Tools?", and each one deflates. Pipi puts on a hard hat and assembles a machine around the jar, one part per word:

- **Instructions** — Who the assistant is and how it should behave, read in every conversation.

- **Knowledge** — Your documents, so answers come from facts instead of guesses.

- **Tools** — Actions the model can request, such as looking up an order.

- **Safety** — Moderation and rules that keep answers within bounds.

- **Costs** — Limits and usage tracking so spending stays predictable.

The machine turns green. Then comes the twist: Pipi takes the pink brain out and plugs in a blue one. The machine keeps working.

## Why the twist matters

New models appear every few months, and the best choice for a task changes over time. When instructions, knowledge, tools and safety live in the gateway rather than in your application code, changing the model is a configuration change. Your website, your WhatsApp number and your internal tools keep calling the same gateway.

Your application → AI gateway (instructions, knowledge, tools, safety, costs) → Language model → Answer

On AIVAX, you send the gateway's ID in the `model` field of an OpenAI-compatible request, and AIVAX applies everything stored in it. The person who manages the gateway controls behaviour; the application only sends messages.

## Go deeper

- In Learn: [What is an LLM](https://docs.aivax.net/learn/agents/what-is-an-llm.md), [From LLMs to agents](https://docs.aivax.net/learn/agents/from-llms-to-agents.md) and [Model families and how to choose](https://docs.aivax.net/learn/models/model-families-and-choosing.md).
- In the Documentation: [AI gateways](https://docs.aivax.net/docs/inference/ai-gateway.md) explains what a gateway stores and a recommended production configuration. The [Overview](https://docs.aivax.net/docs/overview.md) shows when to call a model directly instead.

The next episode opens the first part of the machine: the instructions badge and the shelf of skills.

**Knowledge check.** In Pipi's machine, what does the gateway do?

1. The gateway trains a new model on your data
2. The gateway stores instructions, knowledge, tools and safety around the model, so the model can be swapped
3. The gateway is a faster version of the same model

Answer: option 2. The gateway does not change the model itself. It keeps the configuration around it, which is why Pipi can swap the brain and the machine keeps running.
