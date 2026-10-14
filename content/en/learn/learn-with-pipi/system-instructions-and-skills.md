---
title: System instructions and skills
linkTitle: "#2 Instructions and skills"
description: "Pipi sticks a badge on the jar so the brain knows who it is, then moves long procedures to a shelf of labelled booklets it opens only when needed."
weight: 20
duration: 5
objectives:
  - Explain what a system instruction is and when the model reads it.
  - Recognise why putting everything in the system instruction becomes expensive.
  - Describe how skills are chosen by their description and loaded on demand.
---

The brain from episode 1 is brilliant, but it still does not know who it is or how to behave. In this episode it becomes the assistant of "Pipi's Bakery".

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/02-instrucoes-skills.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/02-instrucoes-skills.webp" title="AIVAX Learn #2 — System instructions and skills" lang="pt-BR" caption="Episode 2 · 1 minute 13 seconds" >}}

## What the video shows

Pipi sticks a badge on the jar: *"You are the assistant of Pipi's Bakery. Be kind."* That badge is the **system instruction**: text that tells the model who it is and how to act. It is read in every conversation, which is why the video stamps it "always on".

Then Pipi tries to fit everything on the badge: recipes, deliveries, exchanges. The badge turns into a scroll that unrolls to the floor, the brain starts sweating and a coin meter climbs. A model is billed by the amount of text it reads, so a huge instruction that is read on every message costs more on every message, even when most of it is irrelevant.

Pipi cuts the scroll and builds a shelf of three booklets labelled *Recipes*, *Deliveries* and *Exchanges*. These are **skills**: packages of instructions, each with a short label saying what it is for.

{{< steps >}}
{{< step title="A question arrives" >}}
A customer asks: *"Do you deliver on Saturday?"*
{{< /step >}}
{{< step title="The brain reads the labels" >}}
Only the short descriptions of each skill are visible to the model at first.
{{< /step >}}
{{< step title="One booklet opens" >}}
The *Deliveries* label lights up; that booklet flies into the jar and its instructions enter the conversation.
{{< /step >}}
{{< step title="The rest stay on the shelf" >}}
*Recipes* and *Exchanges* are not loaded, so they add nothing to this answer's cost.
{{< /step >}}
{{< /steps >}}

## Badge or booklet?

| | System instruction | Skill |
|---|---|---|
| When it applies | Always | Only when relevant |
| Ideal size | Short and focused | Can be long |
| Cost | Paid on every message | Paid only when loaded |
| Best for | Identity, tone, base rules | Specialised procedures |

A good rule of thumb: if something must hold for every answer, such as tone, scope or "never promise refunds", keep it in the system instruction. If it is a procedure for one kind of request, make it a skill and write a clear description, because the description is what the model uses to decide whether to open it.

## Go deeper

- In Learn: [Writing good prompts and instructions](../agents/writing-good-prompts-and-instructions.md), [Adding skills](../agents/adding-skills.md) and [Context window, tokens and cost management](../prompt-engineering/context-window-tokens-and-cost.md).
- In the Documentation: [Skills](../../docs/features/skills.md) covers how skills are listed and loaded, when to use them and how they compare with system instructions. [AI gateways](../../docs/inference/ai-gateway.md) shows where both are configured. [Teach Skill](../../docs/generations/teach-skill.md) drafts a skill from a recorded demonstration.

The next episode answers a different question: what happens when the answer is in your documents, not in the instructions?

{{< quiz options="Put all of them in the system instruction so the model never misses one | Turn each procedure into a skill with a clear description | Create one gateway per procedure" answer="2" explanation="Skills keep the always-on instruction short. The model reads only the descriptions and loads a procedure when a question needs it." >}}
Pipi's Bakery has long procedures for recipes, deliveries and exchanges. What does the video suggest?
{{< /quiz >}}
