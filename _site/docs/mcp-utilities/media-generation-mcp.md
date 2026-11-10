Source: https://docs.aivax.net/docs/mcp-utilities/media-generation-mcp.html

# Media generation MCP

The media generation MCP gives an MCP client hosted image generation and speech generation (text-to-speech). Use it when an agent, IDE, desktop assistant, or automation environment needs to create images or spoken audio without calling the generation APIs directly or running an AIVAX model inference.

AIVAX hosts this MCP server and performs the generations for the authenticated account. The tools use the same models, billing, and applicable limits as [Image Generation](https://docs.aivax.net/docs/generations/images.md) and [Speech Generation](https://docs.aivax.net/docs/generations/speech.md).

With the tools enabled, a client can:

- list available image or speech models;
- generate one to four images from a prompt;
- synthesize speech and receive an MP3 URL.

## Endpoint

This is the Streamable HTTP address for the media generation MCP. Point a trusted MCP client here when it should create images or speech for an AIVAX account.

```text
https://inference.aivax.net/v1/mcp/media-generation
```

Authenticate requests with an account API key:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

For key types and authentication options, see [Authentication](https://docs.aivax.net/docs/authentication.md).

## Configuration example

Client configuration tells the MCP client where to connect and which tools to enable. The exact shape depends on the client; for Claude Code, see [how to generate images in Claude Code with this MCP](https://aivax.net/blog/generate-images-and-speech-from-claude-code-with-mcp/). Use the following example when the client should see every tool:

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

`X-Mcp-Enabled-Tools` is an optional request header. Use it when a client should see only image generation, only speech generation, or a smaller set of tools.

Provide a comma-separated allowlist containing any of `list_models`, `generate_image`, and `generate_speech`.

Expose only image generation:

```text
X-Mcp-Enabled-Tools: list_models, generate_image
```

Expose only speech generation:

```text
X-Mcp-Enabled-Tools: list_models, generate_speech
```

The server reads the header as follows:

- Tool names are case-insensitive.
- Spaces around comma-separated values are ignored.
- If the header is omitted, all tools are exposed.
- If the header lists recognized tools, only those tools are exposed.
- If the header is empty or contains no recognized tool names, no tools are exposed.

Keep `list_models` enabled alongside a generation tool. The agent can then discover valid model names instead of guessing them. MCP clients may cache tool discovery, so reconnect or refresh the server after changing this header.

## Tools

These are the operations the server can expose. Call one when the client needs a model list, an image, or spoken audio.

### `list_models`

`list_models` lists the models available for image generation or speech generation. Use it before a generation call when the agent needs a valid model name, a description, or pricing.

Each result includes the model's description and pricing. Image models also indicate whether they accept reference images. Deprecated image models are not listed.

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

`generate_image` creates one to four images from a prompt and returns their URLs. Use it when the client needs images and already has an image model name from `list_models`.

Input:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `prompt` | string | Yes | A non-empty description of the image to generate. |
| `model` | string | Yes | An image model name returned by `list_models` with `type` set to `image`. Case-insensitive. |
| `count` | integer | No | How many images to generate, from 1 to 4. Defaults to 1. |
| `reference_images` | array of strings | No | Up to four public HTTP(S) image URLs that guide the result. Only accepted by models that support reference images. |
| `size` | string | No | Output size as `<width>x<height>`, such as `1024x1024`. Each side from 64 to 4096 pixels. Defaults to 1080x1920. |
| `format` | string | No | `png`, `jpeg` or `webp`. Defaults to the format produced by the model. |
| `quality` | integer | No | Encoding quality from 1 to 100 for `jpeg` and `webp`. |

Example arguments:

```json
{
  "prompt": "A flat illustration of a lighthouse at dusk, warm palette, no text",
  "model": "<IMAGE_MODEL_NAME>",
  "count": 2
}
```

The tool returns MCP text with:

- the URL and cost of each generated image;
- the error of each failed image;
- the total cost.

Failed images are not charged. The URLs are publicly accessible, so anyone with a URL can open the image. Download and store the images if your workflow needs to keep them under its own access control.

For prompt guidance and reference-image behavior, see [Image Generation](https://docs.aivax.net/docs/generations/images.md).

### `generate_speech`

`generate_speech` synthesizes speech from text and returns the URL of the generated MP3 audio. Use it when the client needs spoken audio and already has a speech model name from `list_models`.

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

The tool returns the URL of the MP3 audio as MCP text. The URL is publicly accessible, so anyone with it can play the audio.

Unlike the Speech Generation API:

- It does not return the audio inline.
- It does not offer other output formats.
- Convert the downloaded file if your workflow needs WAV or OGG.

Voices differ per speech model. For voice selection and text preparation guidance, see [Speech Generation](https://docs.aivax.net/docs/generations/speech.md).

## Pricing and limits

Generation calls use the same pricing and quotas as the generation APIs, and AIVAX charges the authenticated account. Use the product pages below for those rates and quotas:

- [Image Generation](https://docs.aivax.net/docs/generations/images.md#pricing-limits-and-errors) for `generate_image`.
- [Speech Generation](https://docs.aivax.net/docs/generations/speech.md#pricing-limits-and-errors) for `generate_speech`.
- [Pricing](https://docs.aivax.net/docs/pricing.md) for general billing rules.

A positive account balance is required to use these tools.

## Security guidance

Use this guidance before you connect a client or publish a generated file. The MCP runs with your API key, and the media URLs it returns are public.

- Use the MCP only from trusted clients.
- Keep the API key in the client's secure secret storage.
- Do not place the key in source control, browser-side code, shared prompts, or logs.

Generated media URLs are public. Do not generate images or audio containing personal, confidential, or otherwise sensitive information unless the workflow accounts for that exposure. Review generated assets for accuracy and suitability before publishing them.
