Source: https://docs.aivax.net/learn/learn-with-pipi/keeping-ai-on-track.html

The brain answers everyone. But not every message is well meant, and sometimes the brain wants to please too much. This episode adds three layers of protection.

[Video: AIVAX Learn #5 — Keeping AI on track](https://public.aivax.net/file/aivax-public/learn/pipi/05-seguranca.mp4) — Pipi's videos are only available in Portuguese for now.

*Episode 5 · 1 minute 20 seconds*

## What the video shows

- **Moderation: the sieve** — Checks messages at the entrance. Dangerous or offensive messages are held back and never reach the brain.

- **Guardrails: the road barriers** — Your business rules. If the brain tries to offer a 90% discount, it hits the barrier and returns to the road.

- **Observability: the logbook** — Every conversation is recorded: the question, the tools used, the cost and the errors.

Message → Moderation → Model within guardrails → Answer → Logbook

## Why three layers

Each layer catches a different problem. **Moderation** stops harmful input before it costs anything or influences the answer. **Guardrails** stop well-meaning but wrong behaviour, like an assistant inventing a discount to make a customer happy. Some guardrails live in the instructions; firm ones, such as discount limits or permission checks, belong in your own systems, because a rule written only in a prompt can still be talked around.

**Observability** is what you use when something has already gone wrong. When a customer complains, you open the conversation, see what was asked, which tools ran, what they returned and what it cost, and find the problem instead of guessing.

> [!TIP]
> No single layer is enough. Moderation does not know your prices, guardrails do not catch abusive users, and logs only help after the fact. Use all three.

## Go deeper

- In Learn: [Adding guardrails](https://docs.aivax.net/learn/agents/adding-guardrails.md), [Content moderation and usage policies](https://docs.aivax.net/learn/safety/content-moderation-and-policies.md), [Prompt injection and jailbreaks](https://docs.aivax.net/learn/safety/prompt-injection-and-jailbreaks.md) and [Logs, traces and monitoring](https://docs.aivax.net/learn/quality/logs-traces-and-monitoring.md).
- In the Documentation: [AI gateways](https://docs.aivax.net/docs/inference/ai-gateway.md) is where moderation is enabled, with a link to what it covers. [AI workers](https://docs.aivax.net/docs/inference/workers.md) let your own service allow, stop or change a request at runtime, a good place for firm business rules. [Agentic tests](https://docs.aivax.net/docs/inference/agentic-tests.md) simulate full conversations to catch problems before customers do.

The next episode teaches the brain to see and hear.

**Knowledge check.** A customer complains about an answer from last week. Which layer helps you find out what happened?

1. Moderation
2. Guardrails
3. Observability

Answer: option 3. Observability is the logbook: it records the question, tools, cost and errors of each conversation so you can investigate.
