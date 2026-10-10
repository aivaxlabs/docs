Source: https://docs.aivax.net/docs/inference/inference.html

# Inference

AIVAX exposes an OpenAI-compatible `chat/completions` API with additional AIVAX parameters. The additions are optional and are designed to support gateways, RAG, built-in tools, structured responses, multimodal pre-processing, model routing, and billing metadata.

Use this page for direct inference calls. Use [AI Gateway](https://docs.aivax.net/docs/inference/ai-gateway.md) when the same configuration must be reused or centrally managed.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>
        /v1/chat/completions
    </span>
</div>

The endpoint also has the API alias `/api/v1/chat/completions`.

Reference:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

## Provider routing

Some integrated models are available through more than one provider. Provider routing lets AIVAX choose among those providers without changing the model requested by your application. This differs from model routing, which can select a different model based on request complexity.

AIVAX considers providers that are currently available and compatible with the request. If only one provider is eligible, the routing preference does not change the result. Provider routing applies only to integrated AIVAX models; a bring-your-own-key gateway uses the provider endpoint configured in that gateway.

Available routing preferences are:

| Preference | Behavior |
|---|---|
| `Balanced` | Balances price, speed, and quality. This is the default. |
| `Cheapest` | Selects the provider with the lowest applicable input and output token price. |
| `Fastest` | Prioritizes the provider with the highest available throughput. |
| `Quality` | Selects the provider that AIVAX ranks highest for quality, without optimizing for price or speed. |

### Configure routing in an AI Gateway

Use an AI Gateway when the same routing should apply to every request. In the gateway editor, select an integrated model, choose the strategy in **Routing preference**, list provider tags in order in **Allowed providers**, and save the gateway.

The equivalent gateway configuration uses `parameters.routingOption` and `parameters.allowedProviders`:

```json
{
    "name": "Cost-optimized assistant",
    "parameters": {
        "baseAddress": "@integrated",
        "modelName": "YOUR_INTEGRATED_MODEL",
        "routingOption": "Cheapest",
        "allowedProviders": [ "azure-us", "azure-eu", "*" ]
    }
}
```

`allowedProviders` follows the same rules as `routing_options.allowed_providers` below. It defaults to `["*"]`, and an empty list is rejected when saving the gateway.

After saving, call the gateway normally by using its ID or slug as `model`. AIVAX applies the stored routing preference while preserving the gateway's instructions, tools, RAG configuration, and other settings. See [AI Gateway](https://docs.aivax.net/docs/inference/ai-gateway.md) for the complete gateway workflow.

### Override routing in `chat/completions`

Use `routing_options` to choose how providers are selected for one request. The override works with a direct integrated model or an AI Gateway that uses an integrated model:

```json
{
    "model": "YOUR_INTEGRATED_MODEL_OR_GATEWAY_ID",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this incident report."
        }
    ],
    "routing_options": {
        "preset": "Balanced",
        "allowed_providers": [
            "azure-us",
            "azure-eu",
            "*"
        ]
    }
}
```

| Field | Description |
|---|---|
| `preset` | Routing preference: `Balanced`, `Cheapest`, `Fastest`, or `Quality`. When omitted, the gateway's saved `routingOption` is used. |
| `allowed_providers` | Ordered list of provider tags. AIVAX tries the first tag and moves to the next one only when no matching provider is available or compatible with the request. `"*"` matches any provider. When omitted, the gateway's saved `allowedProviders` is used, which defaults to `["*"]`. |

Within each step, `preset` chooses among the matching providers. Without `"*"` at the end, the request fails when none of the listed providers is available. An empty `allowed_providers` list is rejected. Tag matching is case-insensitive.

Each provider's tag is shown in the provider details of the dashboard **Models** page, where it can be copied, and returned as `tag` in the provider list of `GET /v1/models`. A tag identifies a provider endpoint, including its region or variant when one exists, such as `azure-us` or `azure-eu`.

`GET /v1/models` accepts an optional `filter` query parameter with a model name, such as `?filter=@openai/gpt-4o`. The response then contains only entries whose name equals it or is a dated snapshot of it (a trailing numeric suffix of at least four digits), ordered from the closest match, with the newest snapshot first. Without `filter`, the full list is returned.

The request values override the gateway's saved routing for that request only; they do not update the gateway. Because `routing_options` is an AIVAX extension, send it as an extra request-body field when using an OpenAI-compatible SDK.

The previous `routing_preset` field is deprecated but still accepted. Replace `"routing_preset": "Fastest"` with `"routing_options": { "preset": "Fastest" }`. When both are sent, `routing_options.preset` takes precedence.

### Zero data retention providers only

Enable **Zero data retention providers only** in the dashboard account settings to route text inference with integrated models only to providers that do not retain prompts. Providers that are not zero data retention are excluded before `allowed_providers` and `preset` are applied. When the model has no zero data retention provider available, the request fails instead of falling back to another provider; choose a model with a zero data retention provider or disable the option.

The option applies only to text inference. It does not change conversation logging; use `allow_logging` or the account's conversation logging setting for that.

### Provider in responses

Responses for integrated models include a `provider` field next to `model` with the tag of the provider that served the request. In streaming responses, every chunk includes it. The field is `null` for gateways that use your own provider credentials.

```json
{
    "object": "chat.completion.chunk",
    "model": "@openai/gpt-5-mini",
    "provider": "azure-us",
    "choices": [ ... ]
}
```

If a provider fails and AIVAX retries the request on another provider, `provider` reflects the provider that produced the response.

## Input and multimodality

AIVAX accepts OpenAI-compatible message content parts for text, images, audio, videos, and files. The selected model must support the modality unless you ask AIVAX to pre-process the media into text.

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe these inputs briefly."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:image/png;base64,<BASE64_PNG_CONTENT>",
                        "detail": "auto"
                    }
                },
                {
                    "type": "input_audio",
                    "input_audio": {
                        "data": "base64-encoded-audio",
                        "format": "wav"
                    }
                },
                {
                    "type": "file",
                    "file": {
                        "filename": "document.pdf",
                        "file_data": "data:application/pdf;base64,<BASE64_PDF_CONTENT>"
                    }
                }
            ]
        }
    ]
}
```

Supported content part mappings:

- `text`: Plain text.
- `image_url`: Image content. `image_url.url` can be an external URL or a base64 data URL. `image_url.detail` can be `low`, `high`, or `auto` when the model supports it.
- `video_url`: Video content. `video_url.url` can be an external URL or a base64 data URL. Prefer URLs for large videos.
- `input_audio`: Audio content. `input_audio.data` is base64 audio data, and `input_audio.format` names the format.
- `file`: File content. `file.filename` names the file, and `file.file_data` can be an external URL or a base64 data URL.

For video input, send a `video_url` content part. The following example uses a base64 Data URL; prefer a publicly reachable URL for large videos:

```json
{
    "model": "@google/gemini-3-flash",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Summarize the main actions in this video and identify any visible safety risks."
                },
                {
                    "type": "video_url",
                    "video_url": {
                        "url": "data:video/mp4;base64,<BASE64_MP4_CONTENT>"
                    }
                }
            ]
        }
    ]
}
```

External links must be accessible to AIVAX without authentication, firewall restrictions, or JavaScript-only rendering. Failed downloads, redirects, blocked URLs, unsupported formats, or provider-specific size limits can fail the inference.

You can also send a simple text request with `prompt`:

```json
{
    "model": "@google/gemini-3-flash",
    "prompt": "Say hello"
}
```

## Request idempotency

Set `idempotency_key` when your integration needs repeat calls to update the same stored conversation record instead of creating a new conversation token. AIVAX uses this value to correlate the AI Gateway context and conversation logging.

```json
{
    "model": "your-model-or-gateway-id",
    "messages": [
        {
            "role": "user",
            "content": "Summarize order 123."
        }
    ],
    "idempotency_key": "order-123-summary"
}
```

The value must be a non-empty string with 128 characters or less. When omitted, AIVAX generates a conversation token automatically.

To keep conversation state in your application and gateway configuration in AIVAX, see [migrating Assistants threads to Responses](https://aivax.net/blog/migrating-from-openai-assistants-without-rebuilding-the-same-coupling/).

## Request metadata

Set `metadata` to attach string key/value information to the inference request. AIVAX stores this object with the logged conversation and exposes it to gateway events, so it is useful for operational correlation such as an order ID, tenant, workflow, or internal trace key.

```json
{
    "model": "your-model-or-gateway-id",
    "messages": [
        {
            "role": "user",
            "content": "Summarize this support ticket."
        }
    ],
    "metadata": {
        "ticket_id": "SUP-1042",
        "workflow": "support-triage"
    }
}
```

`metadata` must be a JSON object whose property names and values are strings. Do not place secrets, credentials, payment data, or large payloads in this field.

## Response and conversation records

The standard `/v1/chat/completions` response envelope includes `generation_context`. Its `generated_usage` entries contain `sku`, `amount`, `unit_price`, `quantity`, and `description`. Set `json_only: true` to return only the final JSON without this envelope.

Set `allow_logging: false` in a `/v1/chat/completions` request to keep that request out of the account conversation logs. It defaults to `true`, and it cannot enable logging when conversation logging is disabled for the account. Usage and billing records are still created.

When conversation logging is enabled, the stored record includes its ID, origin, model name, request ID, response schema, tools and tool input schemas, usage, linked resources, created and updated timestamps, token count, external user ID, error message, messages, and metadata. Gateway and API key context is available through the linked resources.

Use `idempotency_key` and `metadata` to correlate these records with your own workflow.

## Multimodal pre-processing

Use `multimodal_resolver` when the main model should receive a textual description of media instead of the original media object. This is useful for text-first models or when you want AIVAX to normalize files before the main inference. The object chooses an engine for each content type; omitted or `null` types are sent to the main model unchanged.

```json
{
    "model": "@metaai/llama-3.3-70b",
    "messages": [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe this file briefly."
                },
                {
                    "type": "file",
                    "file": {
                        "filename": "document.pdf",
                        "file_data": "data:application/pdf;base64,BASE64_PDF_CONTENT"
                    }
                }
            ]
        }
    ],
    "multimodal_resolver": {
        "imageEngine": "InferenceLow",
        "audioEngine": "Stt",
        "fileEngine": "InferenceHigh"
    }
}
```

| Field | Accepted engines |
| --- | --- |
| `imageEngine` | `InferenceLow`, `InferenceHigh`, `Ocr` |
| `audioEngine` | `InferenceLow`, `InferenceHigh`, `Stt` |
| `videoEngine` | `InferenceLow`, `InferenceHigh` |
| `fileEngine` | `InferenceLow`, `InferenceHigh`, `Ocr` |

`Inference` is accepted as an alias of `InferenceLow`. The engines work as follows:

- `InferenceLow` describes the content with a smaller, lower-cost multimodal model.
- `InferenceHigh` describes the content with a larger multimodal model that is more accurate and costs more.
- `Ocr` extracts the text of images and files with the same extraction service as [Fetch and OCR](https://docs.aivax.net/docs/web-foundation/fetch-and-ocr.md), billed in Processing Units. It accepts base64 data URIs and public URLs.
- `Stt` transcribes the speech in the audio with the default [speech-to-text](https://docs.aivax.net/docs/pricing.md) model and is billed per second of audio. Music and ambient sounds are not described.

With `InferenceLow` or `InferenceHigh`, `fileEngine` sends PDFs to the multimodal model and converts other file types with OCR. With `Ocr`, every file, including PDFs, is converted with OCR.

Results are cached by content and engine for reuse, so the same media resolved with the same engine is not billed again. Changing the engine processes and bills the content again.

### Deprecated `multimodal_preprocess`

The `multimodal_preprocess` flags remain accepted for compatibility but are deprecated. Use `multimodal_resolver` instead; when both are sent, `multimodal_resolver` is used. The flags map to the new engines as follows:

| Legacy flag | Equivalent |
| --- | --- |
| `Image` | `imageEngine: "InferenceLow"` |
| `Audio` | `audioEngine: "InferenceLow"` |
| `Video` | `videoEngine: "InferenceLow"` |
| `File` | `fileEngine: "InferenceLow"` |
| `OtherFiles` | `fileEngine: "Ocr"` |
| `All` | All of the above, with `fileEngine: "InferenceLow"` |

Because one engine now covers every file type, `OtherFiles` alone also converts PDFs with OCR, and `File` alone also converts non-PDF files with OCR. Previously, the file types outside the selected flag were sent to the main model unchanged.

Multimodal inputs can have account requirements. Review [Pricing](https://docs.aivax.net/docs/pricing.md) and [Plans and limits](https://docs.aivax.net/docs/limits.md) before using them in production.

When a multimodal inference fails, narrow down the problem:

1. Test a simple text message with the same model.
2. Test one small attachment.
3. Test the same attachment with `multimodal_resolver`.
4. Review the URL, format, size, and model modality support.

## Structured responses

AIVAX supports structured responses through `response_schema`, `response_format`, and `json_only`.

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Search for recent news about electric vehicles.",
    "stream": true,
    "builtin_tools": {
        "tools": [
            "WebSearch"
        ],
        "options": {
            "web_search_mode": "full"
        }
    },
    "response_schema": {
        "type": "object",
        "properties": {
            "news": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "News title"
                        },
                        "summary": {
                            "type": "string",
                            "description": "News summary"
                        }
                    },
                    "required": ["title", "summary"]
                }
            }
        },
        "required": ["news"]
    }
}
```

`response_schema` enables JSON Healing. AIVAX asks the model for JSON, extracts JSON from the generated text or markdown blocks, validates it against the schema, and retries with validation feedback until the output is valid or the attempt limit is reached.

Read more on [Structured responses](https://docs.aivax.net/docs/inference/structured-responses.md).

If your application cannot parse or validate the result, follow the [invalid JSON troubleshooting guide](https://aivax.net/blog/structured-output-healing-boundary/) before increasing the retry budget.

## On-demand functions

Use `builtin_tools` to enable AIVAX built-in tools for a direct request without creating a gateway:

```json
{
    "model": "@google/gemini-2.5-flash",
    "prompt": "Search for recent news about electric vehicles.",
    "stream": true,
    "builtin_tools": {
        "tools": [
            "WebSearch"
        ],
        "options": {
            "web_search_mode": "full",
            "web_search_max_results": 5
        }
    }
}
```

Built-in tools include `DateTime`, `WebSearch`, `AdvancedWebUsage` (disabled; returns an unavailable response; see [Changelogs](https://docs.aivax.net/docs/changelogs.md)), `OpenUrl`, `Code`, `Request`, `Remember`, `GenerateWebPage`, `GenerateDocument`, `XPostsSearch`, and `ImageGeneration`.

`DateTime` exposes `get_date_time`, a no-argument tool returning the current date, time, English weekday, time zone, UTC offset, and ISO 8601 timestamp. Set `builtin_tools.options.dateTimeTimeZone` to an IANA identifier; the default is `America/Los_Angeles` (Pacific Time), with automatic daylight-saving adjustments. This setting is independent of the user's browser time zone. See [Current Date and Time](https://docs.aivax.net/docs/tools/builtin-tools.md#current-date-and-time) for configuration and output examples.

On-demand tools are suitable for occasional calls, prototypes, and integrations that do not need a persistent gateway. If the same application always uses the same tools, prefer configuring them in an AI Gateway so the policy is centralized.

## Custom provider request body

When a gateway uses a provided API key and an OpenAI-compatible provider endpoint, `extra_body` can merge custom JSON into the provider request body:

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Explain the tradeoff."
        }
    ],
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

`extra_body` is not allowed with integrated AIVAX models.

Reasoning parameters differ by provider and model. See [how to set reasoning effort across providers](https://aivax.net/blog/reasoning-is-a-protocol-not-just-a-model-setting/) before choosing provider-specific options.

## Tool explanations

Set `tool_invocation_explanations: true` to ask AIVAX to include explanation fields in server-side tool arguments. When the model supplies `_tool_reason` and `_tool_goal`, `servertool.explanation` contains a client-friendly copy:

```json
{
    "model": "@x-ai/grok-4.3",
    "messages": [
        {
            "role": "user",
            "content": "What's the weather forecast for today?"
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true
}
```

Example stream event:

```json
{
    "choices": [],
    "servertool": {
        "name": "web_search",
        "id": "call-example-id-0",
        "contents": "{\"query\":\"weather forecast today\",\"_tool_reason\":\"Searching for today's weather forecast online\",\"_tool_goal\":\"I need current weather information to answer accurately.\"}",
        "state": "Created",
        "explanation": {
            "reason": "Searching for today's weather forecast online",
            "goal": "I need current weather information to answer accurately."
        }
    },
    "usage": null
}
```

## Response rendering mode

Set `rendering_mode: "textual_blocks"` when your client wants AIVAX to place reasoning and server-side tool activity in the same textual response flow that the chat UI already renders. This is useful for clients that build a single response timeline and want to turn reasoning and tool activity into visible components without keeping separate event-handling paths for every marker type.

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

In this mode, reasoning can be emitted as `<thinking-group>` and `<think>` blocks, assistant-facing text can be emitted as `<assistant-answer>` blocks, and server-side tool markers can appear as tool result elements such as `<div class="tool-result reason" data-tool-name="...">`. Treat these blocks as presentation markers inside the response stream: parse them into chat timeline components, collapsible reasoning sections, assistant answer fragments, or tool status rows, but do not blindly concatenate every marker into the final assistant answer.

Clients that do not understand this markup should keep the default rendering mode and handle the structured stream events directly. In the default mode, reasoning arrives through `delta.reasoning`, and server-side tool activity arrives through `servertool` events. Preserve the order in which stream events arrive so reasoning, tool activity, partial content, and the final answer remain in the same response timeline.

### Raw multi-turn example

The example below shows the shape of a streamed response when server-side reasoning is visible to the client, `tool_invocation_explanations` is enabled, and `textual_blocks` is used to keep the response timeline textual. The exact tool result attributes can vary by renderer, but the important behavior is the ordering: reasoning, assistant answer fragments, tool activity, more reasoning, and the final answer can all belong to the same assistant turn.

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

Model availability and prices change over time; the picks below are example output — see [Pricing](https://docs.aivax.net/docs/pricing.md) for current values.

Top picks:

1. @google/gemini-2.5-flash-lite: fast, inexpensive, and supports video.
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
            "content": "For security camera analysis, prioritize models with VideoInput, low input pricing, and high speed.\n\nModel availability and prices change over time; the picks below are example output — see [Pricing](https://docs.aivax.net/docs/pricing.md) for current values.\n\nTop picks:\n\n1. @google/gemini-2.5-flash-lite: fast, inexpensive, and supports video.\n2. @qwen/qwen3.5-9b: low input cost in this example output with video support.\n3. @amazon/nova-lite: low input cost and a large context window.\n\nUse VideoInput for clips when possible. If a model only supports ImageInput, extract frames from the camera stream before sending them."
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

### Presentation guidance

During generation, reasoning is useful because it lets the user follow what the model is doing before the final answer exists. The assistant can "speak" while it reasons by emitting user-facing process updates or provisional answer fragments. These updates may be interleaved with reasoning blocks, tool calls, and partial answer content as the response develops.

Once the final assistant answer is generated, that answer becomes the main product of the inference. The intermediate reasoning is still useful for audit, orientation, and debugging, but it usually stops being the user's primary goal. Collapse or minimize reasoning by default after completion so the final answer receives the strongest visual emphasis, while keeping the process available for users who want to inspect it.

Use progressive disclosure around that lifecycle. Reasoning can be visible while the model is still working, then become a quieter, secondary element after the final answer appears. Tool activity should read as status, not speech: use concise labels such as "Searching", "Opening source", "Running tool", "Finished", or "Failed", and keep each tool invocation grouped as one timeline item even if its state changes over time.

A good visual hierarchy is:

- Assistant answer: highest prominence, normal reading typography, part of the main conversation.
- In-progress reasoning: visible enough to show what the model is doing while the response is being generated.
- Completed reasoning: lower prominence, subdued color or container, collapsed or minimized by default.
- Tool blocks: compact status rows with clear loading, success, and error states.
- Raw details: hidden by default unless the client is a developer, audit, or debugging surface.

Avoid exposing noisy internals directly to end users. Show tool names, states, source labels, or short summaries when they help the user understand what happened. Hide raw arguments, large payloads, and implementation details unless the user explicitly asks for details or the product surface is built for technical inspection.

For accessibility, make every collapsed block keyboard-toggleable, give each status row a readable label, avoid relying on color alone for state, and keep motion subtle. A streaming response should feel stable while it updates: new reasoning or tool rows can appear in order, but existing content should not jump around or force the user to lose their reading position.

## Direct call or gateway

Use a direct call for simple tasks, tests, internal routines, and integrations where the application controls the model, prompt, tools, and context for each request.

Use an AI Gateway when behavior needs to be stable, auditable, and reusable. Gateways are better for support assistants, chat bots, RAG agents, permanent tools, workers, skills, and configurations shared by multiple clients.
