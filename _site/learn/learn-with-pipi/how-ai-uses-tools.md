Source: https://docs.aivax.net/learn/learn-with-pipi/how-ai-uses-tools.html

The brain knows how to talk, but it has no hands. It cannot look up your order or book an appointment. This episode gives it buttons.

[Video: AIVAX Learn #4 — How AI uses tools](https://public.aivax.net/file/aivax-public/learn/pipi/04-ferramentas-mcp.mp4) — Pipi's videos are only available in Portuguese for now.

*Episode 4 · 1 minute 17 seconds*


## What the video shows

A **tool** is like a button with a label: it has a name and says what it does. The model never presses the button itself. It asks for it, and the system around it does the pressing.


1. **The model asks**

The customer wants to know about an order, so the model requests *"view order, number 42"*.


2. **The system presses the button**

Your system runs the action, for example a lookup in the store's database.


3. **The result comes back**

The system returns the result to the model as text: *"shipped yesterday"*.


4. **The model answers**

With real data in hand, the model answers correctly instead of guessing.





This separation is what keeps tools safe: the model only chooses which button and with which values; your system decides what the button is allowed to do.

## The tangle of wires, and the socket

Every system connects in its own way: the calendar one way, the store another, the spreadsheet a third. In the video this becomes a tangle of wires around the jar.

**MCP** (*Model Context Protocol*) is the standard socket. Each system arrives with its tools already described in the same format, so connecting it is just plugging it in, and the brain can use those tools right away.


**Without a standard**

Each system needs its own connection, written and maintained separately.


**With MCP**

Systems that speak MCP expose their tools the same way, so one connection pattern serves all of them.





On AIVAX, a gateway can use several kinds of tools: AIVAX built-in tools, MCP servers you connect, and protocol functions that call your own HTTP endpoint when the model asks for them.

## Go deeper

- In Learn: [Adding tools](https://docs.aivax.net/learn/agents/adding-tools.md), [Function calling step by step](https://docs.aivax.net/learn/tools-and-integrations/function-calling.md), [MCP and tool standards](https://docs.aivax.net/learn/tools-and-integrations/model-context-protocol.md) and [Authentication and permissions for tools](https://docs.aivax.net/learn/tools-and-integrations/authentication-and-permissions.md).
- In the Documentation: [MCP functions](https://docs.aivax.net/docs/tools/mcp.md) shows how to bind an MCP server to a gateway, [Protocol functions](https://docs.aivax.net/docs/tools/protocol-functions.md) cover server-side actions such as checking an order, and [Built-in tools](https://docs.aivax.net/docs/tools/builtin-tools.md) lists what is ready to use.

Once the brain can act, it also needs limits. That is the next episode.

**Knowledge check.** When the brain looks up order 42, who actually runs the lookup?

1. The model runs the action directly on your database
2. The model requests the action by name, and your system runs it and returns the result
3. MCP answers the customer instead of the model

Answer: option 2. The model only asks for a tool with values. The surrounding system executes it and sends the result back for the model to use.
