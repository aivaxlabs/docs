Source: https://docs.aivax.net/docs/inference/response-rendering/chat-presentation-guidance.html

# Chat presentation guidance

A streamed assistant turn can contain reasoning, server-side tool activity, partial answers, and the final answer. This page explains how AIVAX delivers each of them and how to present them in a chat interface. See [Streaming](https://docs.aivax.net/docs/inference/chat-completions/streaming.md) for the event format and [Raw multi-turn example](https://docs.aivax.net/docs/inference/response-rendering/raw-multi-turn-example.md) for a complete response.

## Response rendering mode

Set `rendering_mode: "textual_blocks"` when your client wants AIVAX to place reasoning and server-side tool activity in the same textual response flow that the chat UI already renders. This suits clients that build a single response timeline.

```json
{
    "model": "@openai/gpt-5-mini",
    "messages": [
        {
            "role": "user",
            "content": "Search for recent product updates and summarize the important changes."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "rendering_mode": "textual_blocks"
}
```

In this mode, reasoning can be emitted as `<thinking-group>` and `<think>` blocks, assistant-facing text can be emitted as `<assistant-answer>` blocks, and server-side tool markers can appear as tool result elements such as `<div class="tool-result reason" data-tool-name="...">`. Parse these blocks into timeline components, collapsible reasoning sections, answer fragments, or tool status rows; do not concatenate every marker into the final assistant answer.

Clients that do not understand this markup should keep the default rendering mode and handle the structured stream events directly. In the default mode, reasoning arrives through `delta.reasoning`, and server-side tool activity arrives through `servertool` events. Keep events in arrival order so reasoning, tool activity, and the answer stay in one timeline.

## Presentation guidance

During generation, reasoning is useful because it lets the user follow what the model is doing before the final answer exists. The assistant can "speak" while it reasons by emitting user-facing process updates or provisional answer fragments. These updates may be interleaved with reasoning blocks, tool calls, and partial answer content as the response develops.

Once the final assistant answer is generated, that answer becomes the main product of the inference. Collapse reasoning by default after completion so the final answer gets the strongest emphasis, and keep it available for users who want to inspect it.

Tool activity should read as status, not speech: use concise labels such as "Searching", "Opening source", "Running tool", "Finished", or "Failed", and keep each tool invocation grouped as one timeline item even if its state changes over time.

A good visual hierarchy is:

- Assistant answer: highest prominence, normal reading typography, part of the main conversation.
- In-progress reasoning: visible enough to show what the model is doing while the response is being generated.
- Completed reasoning: lower prominence, subdued color or container, collapsed or minimized by default.
- Tool blocks: compact status rows with clear loading, success, and error states.
- Raw details: hidden by default unless the client is a developer, audit, or debugging surface.

Show tool names, states, source labels, or short summaries. Hide raw arguments and large payloads unless the user asks for details or the surface is built for technical inspection.

For accessibility, make every collapsed block keyboard-toggleable, give each status row a readable label, avoid relying on color alone for state, and keep motion subtle. A streaming response should feel stable while it updates: new reasoning or tool rows can appear in order, but existing content should not jump around or force the user to lose their reading position.
