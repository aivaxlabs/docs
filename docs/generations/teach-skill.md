# Teach Skill

Use Teach Skill to turn recorded demonstrations into reusable, step-by-step skill instructions. Typical uses include capturing an expert's screen workflow so support agents repeat it consistently, converting onboarding walkthroughs into assistant behavior, and bootstrapping a skill draft that a human then tightens.

Submit tutorial videos as `video_url` content parts — hosted URLs or base64 data URIs. Since analysis takes a while on longer recordings, the API recommends the long inference host described in the reference.

## Record a demonstration that teaches well

The quality of the draft follows the quality of the recording. Before submitting:

- Show the workflow in the order it should be understood, one step at a time, without jumping between screens.
- Narrate or caption the intent behind each action ("I open this panel because..."), not just the click itself — silent recordings leave the required context implicit and force the model to guess.
- Keep credentials, personal data, and customer information out of frame; anything visible can end up in the resulting instructions.
- Prefer a few short, focused recordings over one long session when the procedure has natural phases.

## Create a skill draft

Organize recordings in the order in which the procedure should be understood. The response uses the standard JSON envelope. `data.resultText` contains a structured Markdown draft that can include front matter, steps, notes, and assumptions when the recording leaves required context implicit. `data.usage.processedUnits` reports the processed usage units for the request.

A generated draft is not automatically published as an account skill. Validate every step against the real workflow, remove recording-specific details (window sizes, test names, one-off values), confirm prerequisites, and rewrite vague steps as imperative instructions before saving it. See [Skills](/docs/features/skills) for skill structure and activation guidance.

The embedded reference is the source of truth for accepted video input and response behavior.

<script src="https://inference.aivax.net/apidocs?embed-target=Teach%20skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Pricing, limits, and errors

For current availability and account limits, see [Pricing](/docs/pricing) and [Plans and Limits](/docs/limits). Correct invalid or inaccessible video content before retrying a failed request.
