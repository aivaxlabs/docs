---
title: How AI uses tools
linkTitle: "#4 Tools and MCP"
description: "The brain can talk but has no hands. Pipi gives it labelled buttons to press, then a standard socket so every system can plug its tools in the same way."
weight: 40
duration: 5
objectives:
  - Explain why a model needs tools to act on real systems.
  - Follow a tool call from the model's request to the answer.
  - Describe MCP as a standard way to connect tools.
---

The brain knows how to talk, but it has no hands. It cannot look up your order or book an appointment. This episode gives it buttons.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/04-ferramentas-mcp.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/04-ferramentas-mcp.webp" title="AIVAX Learn #4 — How AI uses tools" lang="pt-BR" caption="Episode 4 · 1 minute 17 seconds" >}}

## What the video shows

A **tool** is like a button with a label: it has a name and says what it does. The model never presses the button itself. It asks for it, and the system around it does the pressing.

{{< steps >}}
{{< step title="The model asks" >}}
The customer wants to know about an order, so the model requests *"view order, number 42"*.
{{< /step >}}
{{< step title="The system presses the button" >}}
Your system runs the action, for example a lookup in the store's database.
{{< /step >}}
{{< step title="The result comes back" >}}
The system returns the result to the model as text: *"shipped yesterday"*.
{{< /step >}}
{{< step title="The model answers" >}}
With real data in hand, the model answers correctly instead of guessing.
{{< /step >}}
{{< /steps >}}

This separation is what keeps tools safe: the model only chooses which button and with which values; your system decides what the button is allowed to do.

## The tangle of wires, and the socket

Every system connects in its own way: the calendar one way, the store another, the spreadsheet a third. In the video this becomes a tangle of wires around the jar.

**MCP** (*Model Context Protocol*) is the standard socket. Each system arrives with its tools already described in the same format, so connecting it is just plugging it in, and the brain can use those tools right away.

{{< compare >}}
{{< side title="Without a standard" tone="bad" >}}Each system needs its own connection, written and maintained separately.{{< /side >}}
{{< side title="With MCP" tone="good" >}}Systems that speak MCP expose their tools the same way, so one connection pattern serves all of them.{{< /side >}}
{{< /compare >}}

On AIVAX, a gateway can use several kinds of tools: AIVAX built-in tools, MCP servers you connect, and protocol functions that call your own HTTP endpoint when the model asks for them.

## Go deeper

- In Learn: [Adding tools](../agents/adding-tools.md), [Function calling step by step](../tools-and-integrations/function-calling.md), [MCP and tool standards](../tools-and-integrations/model-context-protocol.md) and [Authentication and permissions for tools](../tools-and-integrations/authentication-and-permissions.md).
- In the Documentation: [MCP functions](../../docs/tools/mcp.md) shows how to bind an MCP server to a gateway, [Protocol functions](../../docs/tools/protocol-functions.md) cover server-side actions such as checking an order, and [Built-in tools](../../docs/tools/builtin-tools.md) lists what is ready to use.

Once the brain can act, it also needs limits. That is the next episode.

{{< quiz options="The model runs the action directly on your database | The model requests the action by name, and your system runs it and returns the result | MCP answers the customer instead of the model" answer="2" explanation="The model only asks for a tool with values. The surrounding system executes it and sends the result back for the model to use." >}}
When the brain looks up order 42, who actually runs the lookup?
{{< /quiz >}}
