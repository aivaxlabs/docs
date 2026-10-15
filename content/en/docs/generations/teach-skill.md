---
{title: Teach Skill,linkTitle: Teach Skill,weight: 290,group: Generations}
---

# Teach Skill

Use Teach Skill to turn recorded demonstrations into reusable, step-by-step skill instructions. Typical uses include capturing an expert's screen workflow so support agents repeat it consistently, converting onboarding walkthroughs into assistant behavior, and bootstrapping a skill draft that a human then tightens.

Submit tutorial videos as `video_url` content parts, using either hosted URLs or base64 data URIs. Because analysis of longer recordings takes a while, the API recommends `direct.inference.aivax.net`.

## Record a demonstration that teaches well

The quality of the draft follows the quality of the recording. Before submitting:

- Show the workflow in the order it should be understood, one step at a time, without jumping between screens.
- Narrate or caption the intent behind each action ("I open this panel because..."), not just the click itself — silent recordings leave the required context implicit and force the model to guess.
- Keep credentials, personal data, and customer information out of frame; anything visible can end up in the resulting instructions.
- Prefer a few short, focused recordings over one long session when the procedure has natural phases.

## Create a skill draft

Organize recordings in the order in which the procedure should be understood. The response uses the standard JSON envelope:

- `data.resultText` contains a structured Markdown draft that can include front matter, steps, notes, and assumptions when the recording leaves required context implicit.
- `data.usage.processedUnits` reports the processed usage units for the request.

A generated draft is not automatically published as an account skill. Before saving it:

1. Validate every step against the real workflow.
2. Remove recording-specific details, such as window sizes, test names, and one-off values.
3. Confirm the prerequisites.
4. Rewrite vague steps as imperative instructions.

See [Skills](/docs/features/skills) for skill structure and activation guidance.

The embedded reference is the source of truth for accepted video input and response behavior.

<script src="https://inference.aivax.net/apidocs?embed-target=Teach%20skill&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Pricing, limits, and errors

For current pricing, availability, and account limits, see [Pricing](/docs/pricing) and [Plans and Limits](/docs/limits). Correct invalid or inaccessible video content before retrying a failed request.
