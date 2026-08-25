# Media Descriptions

Use Media Descriptions when an application needs structured information from audio, images, video, or PDF content. It is useful for preparing media for search, moderation review, accessibility workflows, and downstream automation.

Choose the more specialized API when the task is limited to a single medium, such as [Audio Transcriptions](/docs/generations/audio-transcriptions) for speech-to-text.

## Describe media

Provide media that AIVAX can access, and use guidance that focuses the extraction on the information your workflow needs. Each submitted item is handled independently, so preserve input order when correlating results with the original media.

For remote media, make sure the resource remains accessible for the duration of processing and does not require interactive sign-in. Avoid sending credentials, personal data, or other content that must not appear in a generated description.

The embedded reference is the source of truth for accepted media forms, request options, and response fields.

<script src="https://inference.aivax.net/apidocs?embed-target=Describe%20media&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Pricing, limits, and errors

For current pricing, media availability, and account limits, see [Pricing](/docs/pricing) and [Plans and Limits](/docs/limits). Correct inaccessible media or invalid content before retrying.
