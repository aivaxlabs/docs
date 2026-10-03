---
{title: Media generation MCP,linkTitle: Media generation MCP,weight: 420,group: MCP Utilities}
---

# Media generation MCP

The media generation MCP exposes AIVAX image generation and speech generation (text-to-speech) to any MCP-compatible client. Use it when an agent, IDE, desktop assistant, or automation environment needs to create images or spoken audio without calling the generation APIs directly or running an AIVAX model inference.

AIVAX hosts this MCP server and performs the generations for the authenticated account. The tools use the same models, billing, and applicable limits as [Image Generation](/docs/generations/images) and [Speech Generation](/docs/generations/speech).

## Endpoint

```text
https://inference.aivax.net/v1/mcp/media-generation
```

The server uses Streamable HTTP. Authenticate requests with an account API key:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

For key types and authentication options, see [Authentication](/docs/authentication).

## Configuration example

The exact configuration shape depends on the MCP client. The following example enables all tools:

```json
{
  "servers": {
    "aivax-media": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/media-generation",
      "headers": {
        "Authorization": "Bearer <AIVAX_API_KEY>",
        "X-Mcp-Enabled-Tools": "list_models, generate_image, generate_speech"
      }
    }
  }
}
```

After the client connects, it can discover and call the enabled tools through the standard MCP `tools/list` and `tools/call` methods.

## Select which tools are exposed

Use the optional `X-Mcp-Enabled-Tools` request header to control which tools the server exposes to that client. Provide a comma-separated allowlist containing any of `list_models`, `generate_image`, and `generate_speech`.

Expose only image generation:

```text
X-Mcp-Enabled-Tools: list_models, generate_image
```

Expose only speech generation:

```text
X-Mcp-Enabled-Tools: list_models, generate_speech
```

Tool names are case-insensitive, and spaces around comma-separated values are ignored.

- If the header is omitted, all tools are exposed.
- If the header lists recognized tools, only those tools are exposed.
- If the header is empty or contains no recognized tool names, no tools are exposed.

Keep `list_models` enabled alongside a generation tool so the agent can discover valid model names instead of guessing them. Because tool discovery may be cached by the MCP client, reconnect or refresh the server after changing this header.

## Tools

### `list_models`

Lists the models available for image generation or speech generation, including each model's description and pricing. Image models also indicate whether they accept reference images. Deprecated image models are not listed.

Input:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | string | Yes | `image` to list image generation models, or `audio` to list speech generation models. |

Example arguments:

```json
{
  "type": "audio"
}
```

The tool returns the model list as MCP text. Use the returned model name as the `model` argument of the corresponding generation tool. Calling this tool has no charge.

### `generate_image`

Generates one to four images from a prompt and returns their URLs.

Input:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `prompt` | string | Yes | A non-empty description of the image to generate. |
| `model` | string | Yes | An image model name returned by `list_models` with `type` set to `image`. Case-insensitive. |
| `count` | integer | No | How many images to generate, from 1 to 4. Defaults to 1. |
| `reference_images` | array of strings | No | Up to four public HTTP(S) image URLs that guide the result. Only accepted by models that support reference images. |

Example arguments:

```json
{
  "prompt": "A flat illustration of a lighthouse at dusk, warm palette, no text",
  "model": "<IMAGE_MODEL_NAME>",
  "count": 2
}
```

The tool returns the generated image URLs as MCP text. The URLs are publicly accessible, so anyone with a URL can open the image. Download and store the images if your workflow needs to keep them under its own access control.

For prompt guidance and reference-image behavior, see [Image Generation](/docs/generations/images).

### `generate_speech`

Synthesizes speech from text and returns the URL of the generated MP3 audio.

Input:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `input` | string | Yes | The non-empty text to synthesize. |
| `model` | string | Yes | A speech model name returned by `list_models` with `type` set to `audio`. Case-insensitive. |
| `voice` | string | No | A voice supported by the selected model. The model's default voice is used when omitted. |
| `instructions` | string | No | Guidance about tone, emotion, or pacing for the generated speech. |

Example arguments:

```json
{
  "input": "Your order has shipped and should arrive on Thursday.",
  "model": "<SPEECH_MODEL_NAME>",
  "instructions": "Friendly and calm, moderate pace."
}
```

The tool returns the URL of the MP3 audio as MCP text. The URL is publicly accessible, so anyone with it can play the audio. Unlike the Speech Generation API, this tool does not return the audio inline and does not offer other output formats; convert the downloaded file if your workflow needs WAV or OGG.

Voices differ per speech model. For voice selection and text preparation guidance, see [Speech Generation](/docs/generations/speech).

## Pricing and limits

Generation calls use the same pricing as [Image Generation](/docs/generations/images) and [Speech Generation](/docs/generations/speech) and are charged to the authenticated account. See [Pricing](/docs/pricing) for current charges and billing rules.

Generations are subject to the account's applicable service quotas and rate limits. See [Plans and Limits](/docs/limits) for current limits and enforcement behavior.

A positive account balance is required to use these tools.

## Security guidance

Use the MCP only from trusted clients and keep the API key in the client's secure secret storage. Do not place the key in source control, browser-side code, shared prompts, or logs.

Generated media URLs are public. Do not generate images or audio containing personal, confidential, or otherwise sensitive information unless the workflow accounts for that exposure. Review generated assets for accuracy and suitability before publishing them.
