Source: https://docs.aivax.net/docs/generations/images.html

# Image Generation

Use Image Generation to create images from a text prompt in an application workflow. Typical uses include draft illustrations for editorial review, product mockups, marketing variations for A/B testing, and placeholder art that a designer refines later.

Authenticate requests with an AIVAX API key. See [Authentication](https://docs.aivax.net/docs/authentication.md) for authorization guidance.

## Choose a model

Select an image-generation model available to the authenticated account. Model availability and capabilities can change, so obtain current options from the platform instead of depending on a fixed list in this guide.

When several models are available, compare them by capability:

- **Reference images:** only some models accept `referenceImages`.
- **Variations:** decide how many images you need per prompt; `count` accepts 1 to 4.
- **Wait time:** image requests on some models take a while. For those, send the request to `https://direct.inference.aivax.net` and raise your client timeout, as described in [long-running inference](https://docs.aivax.net/docs/overview.md#long-running-inference).

## Generate an image

Use prompts that state the outcome you need rather than relying on vague visual labels. Include the important details, such as the subject, environment, framing, and any text that must be present. One request can carry a single prompt or an array of prompts. Each prompt generates `count` images, and their URLs come back grouped by input prompt.

Control the output with these optional fields:

- `size`: the image dimensions, either as a `"1024x1024"` string or as `{ "width": 1024, "height": 1024 }`. Each side must be between 64 and 4096 pixels. The default is 1080×1920. The model may adjust the size to dimensions it supports, so check the delivered image.
- `format`: `png`, `jpeg` or `webp`. When omitted, the image keeps the format produced by the model.
- `quality`: an integer from 1 to 100 that sets the `jpeg` or `webp` encoding quality. It has no effect on `png`. When the image is converted and `quality` is omitted, 90 is used.

Each prompt group returns `images`, the URLs of the delivered images, and `outputs`, one entry per requested image in request order. Each entry has the image `url`, the `cost` charged for it and, when it failed, an `error` message with a `null` URL. The group `cost` is the sum charged for that prompt. A request can succeed with some failed images, so check `outputs` rather than assuming `images` has `count` entries.

Supply up to four HTTP(S) reference images when the selected model supports them and the output must follow an existing subject, style, or composition. References guide the result; they do not guarantee identity preservation, so inspect the output before publishing.

Treat generated assets as drafts and review them for accuracy, brand suitability, and unintended content before release. When the first result is close but not right, iterate by tightening one element at a time — subject detail, composition, style constraint — rather than rewriting the whole prompt at once.

The embedded reference is the source of truth for the request shape, supported options, and response fields.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Generate%20images)

To let an MCP-compatible agent or IDE generate images without calling this endpoint directly, use the [Media generation MCP](https://docs.aivax.net/docs/mcp-utilities/media-generation-mcp.md).

## Pricing, limits, and errors

Image generation is charged per delivered image, with an additional charge per reference image on some models. Failed or undelivered outputs are not charged. Each output is priced at the selected model's fixed output tariff, plus that model's per-reference tariff for every reference image sent with it. Prompt processing is included. For token- and megapixel-priced providers, the charge uses rounded-up estimates rather than exact provider-cost pass-through. No additional AIVAX image-generation markup or account and plan multiplier applies. Current tariffs for each model are listed in the Models catalog.

The built-in image generation and editing tool has these daily plan limits:

| Limit | Free | Pro | Max |
| --- | --- | --- | --- |
| Built-in image generation and editing | 5/day | 500/day | 5,000/day |

If a request fails, revise the reported validation issue before retrying.
