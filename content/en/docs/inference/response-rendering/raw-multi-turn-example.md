---
{title: Raw Multi-turn Example,linkTitle: Raw multi-turn example,weight: 20,group: Response rendering}
---

# Raw multi-turn example

The example below shows the shape of a streamed response when server-side reasoning is visible to the client, [`tool_invocation_explanations`](tool-explanations.md) is enabled, and [`textual_blocks`](chat-presentation-guidance.md#response-rendering-mode) is used to keep the response timeline textual. The exact tool result attributes can vary by renderer, but the important behavior is the ordering: reasoning, assistant answer fragments, tool activity, more reasoning, and the final answer can all belong to the same assistant turn.

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Which cheap and fast multimodal models should I use for security camera analysis?"
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true,
    "rendering_mode": "textual_blocks",
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

Raw streamed assistant timeline:

```text
<thinking-group>
<think>
The user is asking for cheap, fast multimodal models for security camera analysis.
I should list available AIVAX models and search the documentation before recommending options.
</think>
</thinking-group>

<assistant-answer>
I will check the available multimodal models and identify the best options for security camera analysis.
</assistant-answer>

<thinking-group>
<div class="tool-result reason" data-tool-name="aivax_list_models"><b>aivax_list_models</b><span>Listing the available models in AIVAX</span></div>

<div class="tool-result reason" data-tool-name="aivax_search_context"><b>aivax_search_context</b><span>Searching documentation about multimodal models and image analysis in AIVAX</span></div>

<think>
The relevant models should support VideoInput or ImageInput, have low input cost, and be fast enough for camera workflows.
I found several candidates and should rank them by cost, speed, and modality support.
</think>
</thinking-group>

<assistant-answer>
For security camera analysis, prioritize models with VideoInput, low input pricing, and high speed.

Model availability and prices change over time; the picks below are example output — see [Pricing](/docs/pricing.md) for current values.

Top picks:

1. @google/gemini-3.5-flash-lite: fast, inexpensive, and supports video.
2. @qwen/qwen3.5-9b: low input cost in this example output with video support.
3. @amazon/nova-lite: low input cost and a large context window.

Use VideoInput for clips when possible. If a model only supports ImageInput, extract frames from the camera stream before sending them.
</assistant-answer>
```

When the user replies, keep the conversation history focused on the user-visible assistant result. Store reasoning and tool details as timeline or audit metadata if your product needs them, but do not turn them into a new user message. The assistant message should use the content from the final `<assistant-answer>` block, not the full reasoning transcript.

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Which cheap and fast multimodal models should I use for security camera analysis?"
        },
        {
            "role": "assistant",
            "content": "For security camera analysis, prioritize models with VideoInput, low input pricing, and high speed.\n\nModel availability and prices change over time; the picks below are example output — see [Pricing](/docs/pricing.md) for current values.\n\nTop picks:\n\n1. @google/gemini-3.5-flash-lite: fast, inexpensive, and supports video.\n2. @qwen/qwen3.5-9b: low input cost in this example output with video support.\n3. @amazon/nova-lite: low input cost and a large context window.\n\nUse VideoInput for clips when possible. If a model only supports ImageInput, extract frames from the camera stream before sending them."
        },
        {
            "role": "user",
            "content": "Now recommend one model for real-time alerts and one for deeper review."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true,
    "rendering_mode": "textual_blocks",
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```
