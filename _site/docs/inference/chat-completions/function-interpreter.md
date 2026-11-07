Source: https://docs.aivax.net/docs/inference/chat-completions/function-interpreter.html

# Function interpreter (deprecated)

> **Deprecated.** The function interpreter is kept only for existing gateways. Do not use it in new gateways. Choose a model with native tool calling instead; the **Models** page of the dashboard lists which models support it.

The function interpreter, also called the tool handler, adds tool calling to models that do not produce reliable native tool calls. Instead of sending the tool definitions to the provider, AIVAX asks the model to choose a tool in a text format and converts its answer into a tool call. Configure it in **Tool calling handler** in the gateway editor or in `parameters.knownToolHandlerName`.

## Values

| Value | Behavior |
| --- | --- |
| `native` or `null` | Uses the model's native tool calling. This is the default and the recommended value. |
| `react.v1.selfcall` | Uses a ReAct-style interpreter that runs on the same model as the gateway. |

Any other value makes requests to the gateway fail with an error saying the tool handler is not recognized.

## How `react.v1.selfcall` works

On every generation in which tools are available, the interpreter runs before the main generation:

1. AIVAX makes an extra call to the same model with the conversation, the tool definitions as text, and instructions to either pick one tool and its arguments or answer the user.
2. If the model picks a tool, AIVAX converts its text into a tool call and runs it like any other tool call: server-side tools run inside AIVAX, and client-side tools are returned to your application.
3. If the model chooses to answer, the main generation runs without tool definitions.

See [Processing pipeline](https://docs.aivax.net/docs/inference/chat-completions/processing-pipeline.md) for where this step runs.

## Limitations

- **One tool per step.** The interpreter selects at most one tool per generation, so parallel tool calls are not possible.
- **More cost and latency.** Every generation with tools adds an extra model call, billed like any other inference.
- **Weaker reliability.** Tool names and arguments are parsed from text. The model can produce invalid JSON or call a tool that does not exist, and the arguments are not constrained by the provider.
- **Tool calling becomes available to any model.** A gateway with an interpreter accepts tools and features that require tool calling, such as `QueryFunction` RAG or `SelfAssessment` [moderation](https://docs.aivax.net/docs/inference/chat-completions/moderation.md), even when the model has no native support. Their quality depends on how well the model follows the interpreter format.

## Migrate away from the interpreter

1. Choose a model with native tool calling that fits the gateway's cost and quality requirements.
2. Change the gateway model and set the tool calling handler to `native`, or remove `knownToolHandlerName`.
3. Test the gateway's tool flows, for example with [Agentic Tests](https://docs.aivax.net/docs/inference/agentic-tests.md), before switching production traffic.
