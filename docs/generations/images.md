# Image Generation

Use image generation when your application needs one or more images from a text prompt without asking a chat model to call the built-in image tool. A request can contain one prompt or an array of prompts, and AIVAX returns the generated image URLs grouped by the prompt that produced them.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/images</span>
</div>

## Choose a model

`model` is required and must match a model exposed by `/api/v1/information/image-models.json`. Model names are matched case-insensitively. The model listing also exposes capability flags, including whether a model supports reference images.

The request fields are:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `string` or `string[]` | Required | One prompt or multiple prompts. Empty prompts are rejected. |
| `count` | `integer` | `1` | Images generated for each prompt. Minimum 1; maximum 4. |
| `model` | `string` | Required | Public image-generation model name. |
| `referenceImages` | `string[]` | Empty | Up to four safe, absolute image URLs. The selected model must support references. |

For example, two prompts with `count: 4` request eight images in total. The response keeps each prompt beside its own `images` array so the caller does not need to infer which URL belongs to which input.

Reference URLs are fetched and normalized by AIVAX before generation. Use publicly reachable image URLs with an image content type. Each reference is limited by the media-fetch path, and unsupported or inaccessible images are not usable by the provider.

## Billing and limits

The endpoint uses the same image-generation service and [daily plan quota](/docs/limits#built-in-tool-limits) as the built-in image tool. Each prompt consumes one image-generation operation from the quota; `count` controls how many images that operation requests and affects provider cost.

Generated images are stored by AIVAX and returned as URLs. Download or copy them to application-owned storage if you require a separate retention policy.

<script src="https://inference.aivax.net/apidocs?embed-target=Generate%20images&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

For model-driven image generation inside a conversation, enable the Image Generation built-in tool instead. The direct endpoint is better when your application already knows that an image must be created and wants a predictable response shape.
