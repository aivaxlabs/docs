# Teach Skill

Use Teach Skill to turn recorded demonstrations into reusable, step-by-step skill instructions. Submit tutorial videos showing a workflow, then review and refine the returned Markdown before using it as an account skill.

Teach Skill works best when the relevant actions, screens, and spoken guidance are clear. Do not include credentials, personal data, or other information that should not become part of the resulting instructions.

## Create a skill draft

Organize recordings in the order in which the procedure should be understood. The response uses the standard JSON envelope. `data.resultText` contains a structured Markdown draft that can include front matter, steps, notes, and assumptions when the recording leaves required context implicit. `data.usage.processedUnits` reports the processed usage units for the request.

A generated draft is not automatically published as an account skill. Validate every step, remove recording-specific details, and confirm prerequisites before saving it. See [Skills](/docs/features/skills) for skill structure and activation guidance.

The embedded reference is the source of truth for accepted video input and response behavior.

<script src="https://inference.aivax.net/apidocs?embed-target=Teach%20skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Pricing, limits, and errors

For current availability and account limits, see [Pricing](/docs/pricing) and [Plans and Limits](/docs/limits). Correct invalid or inaccessible video content before retrying a failed request.
