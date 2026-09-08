# Image Generation

Use Image Generation to create images from a text prompt in an application workflow. Typical uses include draft illustrations for editorial review, product mockups, marketing variations for A/B testing, and placeholder art that a designer refines later.

Authenticate requests with an AIVAX API key. See [Authentication](/docs/authentication) for authorization guidance.

## Choose a model

Select an image-generation model available to the authenticated account. Model availability and capabilities can change, so obtain current options from the platform instead of depending on a fixed list in this guide.

When several models are available, decide by capability: whether you need reference-image support (only some models accept `referenceImages`), how many variations per prompt you need (`count` accepts 1 to 4), and how long your application can wait — image requests on some models take a while, in which case the API recommends the long inference host described in the reference.

## Generate an image

Use prompts that state the outcome you need rather than relying on vague visual labels. Include the important details, such as the subject, environment, framing, and any text that must be present. One request can carry a single prompt or an array of prompts, and each prompt generates `count` images whose URLs come back grouped by input prompt.

Supply up to four HTTP(S) reference images when the selected model supports them and the output must follow an existing subject, style, or composition. References guide the result; they do not guarantee identity preservation, so inspect the output before publishing.

Treat generated assets as drafts and review them for accuracy, brand suitability, and unintended content before release. When the first result is close but not right, iterate by tightening one element at a time — subject detail, composition, style constraint — rather than rewriting the whole prompt at once.

The embedded reference is the source of truth for the request shape, supported options, and response fields.

<script src="https://inference.aivax.net/apidocs?embed-target=Generate%20images&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Pricing, limits, and errors

For current pricing, availability, and account limits, see [Pricing](/docs/pricing) and [Plans and Limits](/docs/limits). If a request fails, revise the reported validation issue before retrying.
