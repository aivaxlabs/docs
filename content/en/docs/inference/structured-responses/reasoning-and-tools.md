---
{title: Structured Responses with Reasoning and Tools,linkTitle: Reasoning and tools,weight: 30,group: Structured Responses}
---

# Reasoning and tools

A structured request can use a reasoning model and tools. The model reasons and calls tools as in any other request, and AIVAX validates the JSON only when the model writes its final answer.

## How the request runs

1. The model receives the messages, the tools, and the schema.
2. It can reason and call tools as many times as it needs. Tool calls and their results are not checked against the schema.
3. When the model answers without calling more tools, AIVAX reads the JSON from that answer and validates it against `response_schema`.
4. If the JSON is missing or invalid, AIVAX sends the validation errors back to the model and asks for a new answer. See [JSON Healing](json-healing.md).

Only failed JSON answers count toward `max_attempts`. Tool calls and reasoning do not consume attempts.

## Where the JSON comes from

AIVAX reads the JSON from the final answer content, never from the reasoning. The answer can contain the JSON alone or inside a Markdown code block; AIVAX also tolerates a missing opening or closing brace or bracket. Text around a code block is discarded.

Tell the model to put the JSON in its final answer. A model that writes the result only in its reasoning produces an empty answer, which fails validation.

## Streaming

With `response_schema` and healing, the answer text is not streamed while it is being generated, because a partial or invalid answer could be replaced by a retry. Reasoning, tool call events, and usage are still streamed, so the client can show progress. The validated JSON arrives at the end of the stream.

With `json_only`, the stream carries only the final JSON. See [JSON-only](json-only.md).

## Example

```json
{
    "model": "@google/gemini-2.5-flash",
    "messages": [
        {
            "role": "user",
            "content": "Find the current population of Lisbon and return it as JSON with the source URL."
        }
    ],
    "reasoning_effort": "low",
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "response_schema": {
        "type": "object",
        "properties": {
            "city": { "type": "string" },
            "population": { "type": "integer" },
            "source_url": { "type": "string" }
        },
        "required": ["city", "population", "source_url"]
    }
}
```

The model searches the web first, then writes the final answer. Only that answer must match the schema.

## Recommendations

- Use a model that supports tool calling when the request has tools, or a gateway with a tool handler.
- Add source or evidence fields to the schema when the application needs to know where a value came from.
- Keep tool results short. Long or noisy results make it harder for the model to produce a valid JSON at the end.
- Expect longer requests: reasoning, tool calls, and retries add up. Use the direct inference host for long requests, as described in [Concepts](concepts.md#long-running-structured-requests).
