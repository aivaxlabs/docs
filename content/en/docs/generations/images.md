---
{title: Image Generation,linkTitle: Image generation,weight: 10,group: Media generation}
---

# Image Generation

Use Image Generation to create images from a text prompt in an application workflow. Typical uses include draft illustrations for editorial review, product mockups, marketing variations for A/B testing, and placeholder art that a designer refines later.

Authenticate requests with an AIVAX API key. See [Authentication](/docs/authentication) for authorization guidance.

## Choose a model

Select an image-generation model available to the authenticated account. Model availability and capabilities can change, so obtain current options from the platform instead of depending on a fixed list in this guide.

When several models are available, compare them by capability:

- **Reference images:** only some models accept `referenceImages`.
- **Variations:** decide how many images you need per prompt; `count` accepts 1 to 4.
- **Wait time:** image requests on some models take a while. For those, send the request to `https://direct.inference.aivax.net` and raise your client timeout, as described in [long-running inference](../overview.md#long-running-inference).

## Generate an image

Use prompts that state the outcome you need rather than relying on vague visual labels. Include the important details, such as the subject, environment, framing, and any text that must be present. One request can carry a single prompt or an array of prompts. Each prompt generates `count` images, and their URLs come back grouped by input prompt.

Supply up to four HTTP(S) reference images when the selected model supports them and the output must follow an existing subject, style, or composition. References guide the result; they do not guarantee identity preservation, so inspect the output before publishing.

Treat generated assets as drafts and review them for accuracy, brand suitability, and unintended content before release. When the first result is close but not right, iterate by tightening one element at a time — subject detail, composition, style constraint — rather than rewriting the whole prompt at once.

The embedded reference is the source of truth for the request shape, supported options, and response fields.

<script src="https://inference.aivax.net/apidocs?embed-target=Generate%20images&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

To let an MCP-compatible agent or IDE generate images without calling this endpoint directly, use the [Media generation MCP](/docs/mcp-utilities/media-generation-mcp).

## Pricing, limits, and errors

Image generation is charged per delivered image, with an additional charge per reference image on some models. Failed or undelivered outputs are not charged. Each output is priced at the selected model's fixed output tariff, plus that model's per-reference tariff for every reference image sent with it. Prompt processing is included. For token- and megapixel-priced providers, the charge uses rounded-up estimates rather than exact provider-cost pass-through. No additional AIVAX image-generation markup or account and plan multiplier applies. Current tariffs for each model are listed in the Models catalog.

The built-in image generation and editing tool has these daily plan limits:

| Limit | Free | Pro | Max |
| --- | --- | --- | --- |
| Built-in image generation and editing | 5/day | 500/day | 5,000/day |

If a request fails, revise the reported validation issue before retrying.
