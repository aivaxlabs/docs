---
title: Keeping AI on track
linkTitle: "#5 Moderation and observability"
description: "A sieve at the entrance, guardrails on the road and a logbook of every conversation: Pipi shows three layers that keep an assistant safe and explainable."
weight: 50
duration: 5
objectives:
  - Explain what input moderation filters out.
  - Describe guardrails as your business rules applied to the assistant.
  - Explain how observability helps you investigate a complaint.
---

The brain answers everyone. But not every message is well meant, and sometimes the brain wants to please too much. This episode adds three layers of protection.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/05-seguranca.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/05-seguranca.webp" title="AIVAX Learn #5 — Keeping AI on track" lang="pt-BR" caption="Episode 5 · 1 minute 20 seconds" >}}

## What the video shows

{{< cards >}}
{{< card title="Moderation: the sieve" icon="shield" >}}Checks messages at the entrance. Dangerous or offensive messages are held back and never reach the brain.{{< /card >}}
{{< card title="Guardrails: the road barriers" icon="lock" >}}Your business rules. If the brain tries to offer a 90% discount, it hits the barrier and returns to the road.{{< /card >}}
{{< card title="Observability: the logbook" icon="eye" >}}Every conversation is recorded: the question, the tools used, the cost and the errors.{{< /card >}}
{{< /cards >}}

{{< flow "Message | Moderation | Model within guardrails | Answer | Logbook" >}}

## Why three layers

Each layer catches a different problem. **Moderation** stops harmful input before it costs anything or influences the answer. **Guardrails** stop well-meaning but wrong behaviour, like an assistant inventing a discount to make a customer happy. Some guardrails live in the instructions; firm ones, such as discount limits or permission checks, belong in your own systems, because a rule written only in a prompt can still be talked around.

**Observability** is what you use when something has already gone wrong. When a customer complains, you open the conversation, see what was asked, which tools ran, what they returned and what it cost, and find the problem instead of guessing.

> [!TIP]
> No single layer is enough. Moderation does not know your prices, guardrails do not catch abusive users, and logs only help after the fact. Use all three.

## Go deeper

- In Learn: [Adding guardrails](../agents/adding-guardrails.md), [Content moderation and usage policies](../safety/content-moderation-and-policies.md), [Prompt injection and jailbreaks](../safety/prompt-injection-and-jailbreaks.md) and [Logs, traces and monitoring](../quality/logs-traces-and-monitoring.md).
- In the Documentation: [AI gateways](../../docs/inference/ai-gateway.md) is where moderation is enabled, with a link to what it covers. [AI workers](../../docs/inference/workers.md) let your own service allow, stop or change a request at runtime, a good place for firm business rules. [Agentic tests](../../docs/inference/agentic-tests.md) simulate full conversations to catch problems before customers do.

The next episode teaches the brain to see and hear.

{{< quiz options="Moderation | Guardrails | Observability" answer="3" explanation="Observability is the logbook: it records the question, tools, cost and errors of each conversation so you can investigate." >}}
A customer complains about an answer from last week. Which layer helps you find out what happened?
{{< /quiz >}}
