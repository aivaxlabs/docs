---
{title: Instruction Refinement,linkTitle: Instruction Refinement,weight: 80,group: Data processing}
---

# Instruction Refinement

Use Instruction Refinement to review system instructions, prompts, and skills before you ship them to a model. The service checks them against a catalog of prompt engineering guidelines compiled from model vendors' documentation, then returns a score, prioritized problems located in your text, the guidelines behind each problem, and suggested fixes with patches you can preview and apply.

It fits prompt reviews in pull requests, audits of AI gateway instructions and skills, and editors that highlight problems as you write. It reports guideline issues; it does not run your prompt or measure how a model performs with it. To test behavior against real conversations, use [Agentic Tests](/docs/inference/agentic-tests.md).

Before calling this endpoint, [create an API key](../authentication.md) and make sure the account has a positive balance.

## Endpoint

<div class="request-item post">
    <span>POST</span>
    <span>/api/v1/generations/instruction-refinement</span>
</div>

## Choose a view

The review runs in one of two views. Each request runs one view and is billed separately, so run both when you want a complete review.

- **`micro`** (default) reviews the wording inside each item: clarity, measurable constraints, structure, examples, emphasis, tool guidance, output format, and similar guidelines. Use it while writing or editing a single prompt.
- **`macro`** reviews how the items work together as one agent. It checks that the agent has a clear purpose and limits of authority, that each behavior lives in a single item responsible for it, that skills can be selected from their descriptions without overlapping or being forced, that the context matches the tools the agent really has, and that it avoids over-specification such as scripted conversations or rules the platform already provides. Use it when you review a whole agent or its skill set.

The macro view needs the related items to judge relationships. Send the base instructions together with the skills, tool descriptions, and knowledge the agent uses; a single item gives it little to compare.

## Request behavior

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `view` | String | No | `micro` or `macro`. Defaults to `micro`. |
| `purpose` | String | No | What the agent is meant to achieve. When omitted, the review infers it from the instructions and documentation, and the summary says so. |
| `context` | Object array | Yes | One or more context items, reviewed together. |
| `context[].type` | String | Yes | The item type, described below. |
| `context[].title` | String | No | A label for the item, such as a file or skill name. |
| `context[].description` | String | No | A description of the item. For skills, send the description the agent uses to select the skill, so the review can check whether it activates when needed. |
| `context[].content` | String | Yes | The item text. Must not be empty. |

| Type | Use for |
| --- | --- |
| `instruction` | System or developer instructions that are always loaded. |
| `prompt` | A prompt sent in the user turn. |
| `skill` | An instruction bundle the agent loads on demand. |
| `tool` | The definition or description of a tool available to the agent. |
| `knowledge` | Factual reference content available to the agent, such as products, contacts, or policies. |
| `documentation` | Notes for people about the agent. The agent never sees them. |

Send in one request the items that the same agent receives. A guideline can be satisfied by another item, and findings can point out items that conflict with or duplicate each other; reviewing items in separate requests misses those relationships. In the micro view, `knowledge` and `documentation` items are used only as context.

An unknown `view` or `type`, an empty `content`, or an empty `context` array returns `400 Bad Request`.

```json
{
  "view": "macro",
  "purpose": "Answer billing questions and hand refunds to the finance team.",
  "context": [
    {
      "type": "instruction",
      "title": "support-agent.md",
      "content": "You are a support agent.\nNever promise refunds."
    },
    {
      "type": "skill",
      "title": "refunds",
      "description": "Refunds.",
      "content": "Promise a refund when the customer asks for one."
    }
  ]
}
```

## Read the response

`data` contains the review of all items:

| Property | Type | Description |
| --- | --- | --- |
| `overallScore` | Number | Overall quality from `0` to `1`. Scores below `0.4` mean at least one `P0` finding; scores near `1` mean only minor improvements apply. |
| `summary` | String | A short assessment of the context and its most important improvement. |
| `findings` | Object array | The problems found, up to 20. Can be empty when the context has no relevant problems. |
| `suggestedFixes` | Object array | Concrete changes that resolve one or more findings. In the macro view, conflicts and risks come first. |

Each finding has these properties:

| Property | Type | Description |
| --- | --- | --- |
| `id` | Integer | Identifier of the finding, referenced by `suggestedFixes[].refFinding`. |
| `priority` | String | `P0` for problems that can cause an improper or irreversible action, a regulatory or privacy risk, or leave the agent without identity or purpose; `P1` for likely recurring wrong decisions; `P2` for localized quality loss; `P3` for clarity or organization improvements. |
| `title` | String | Short name of the problem. |
| `description` | String | The problem and its effect on the agent. |
| `locations` | Object array | Every item the finding involves, such as both sides of a conflict. Each location has the `contextIndex` of the item in `context` (zero-based) and an `evidenceSpan`. Can be empty when the problem is not tied to an item. |
| `sources` | Object array | Guidelines that support the finding, described below. |

`evidenceSpan` gives the location of the problem in that item's `content` as `fromLine`, `toLine`, `fromColumn`, and `toColumn`, all 1-based and inclusive. It is `null` when the problem is an omission, when it lies in a skill's `description`, or when the cited text could not be located. Columns count characters from the start of the line, so line breaks inside `content` must match the text you display when you highlight a span.

Each source has an `id` that identifies the guideline in its catalog, a `number` within its type, a `type`, and `references` with the vendor documentation URLs behind it. `type` reflects the guideline's weight: a `rule` prevents predictable failures, a `practice` reliably improves results, a `tip` is optional and situational, and a `dont` is an anti-pattern to avoid. Some macro guidelines cover agent design rather than vendor guidance and have an empty `references` array.

Each suggested fix has a `refFinding` array with the finding ids it resolves, a `description` of exactly what to change and in which item, a `patches` array described below, and a `type`:

| Type | Meaning |
| --- | --- |
| `modify` | Rewrite the text in place. |
| `remove` | Delete redundant, conflicting, or harmful text. |
| `transfer` | Move the text to another item or type, such as from the instructions into a skill. The description names the destination. |
| `add` | Write content that is missing. The description names the item that should hold it. |

`patches` holds the fix as text changes. Each patch has the `contextIndex` of the item it changes and a `diff` in unified diff format, with three lines of context, against the `content` you sent for that item. The file names in the `---` and `+++` headers are the item's `title` prefixed with `a/` and `b/`, or `context-<index>` when the item has no title. Header lines end with a line feed, and content lines keep the line endings of your `content`. A fix that changes several items, such as a `transfer`, has one patch per item; apply them together.

`patches` is empty when the fix can't be written as a change to the items you sent: it needs content that isn't there, such as a new skill or a tool, it needs facts only you have, such as a limit or a contact, or the text to change couldn't be located unambiguously. Use the `description` in those cases.

Every patch is computed against the original `content`, independently of the other fixes, so two fixes can change the same lines. Apply patches one fix at a time; when a patch no longer applies because an earlier one changed the same text, skip it or request a new review.

`title`, `description`, `summary`, and fix descriptions are written in the language used by most of the analyzed content.

```json
{
  "message": null,
  "data": {
    "overallScore": 0.35,
    "summary": "The instructions and the refunds skill contradict each other about refunds, and the skill description is too vague to be selected reliably.",
    "findings": [
      {
        "id": 1,
        "priority": "P0",
        "title": "Contradictory refund authority",
        "description": "The instructions forbid promising refunds while the skill requires it, so the agent may promise refunds it cannot grant.",
        "locations": [
          {
            "contextIndex": 0,
            "evidenceSpan": { "fromLine": 2, "toLine": 2, "fromColumn": 1, "toColumn": 22 }
          },
          {
            "contextIndex": 1,
            "evidenceSpan": { "fromLine": 1, "toLine": 1, "fromColumn": 1, "toColumn": 48 }
          }
        ],
        "sources": [
          {
            "id": "B.D. 3",
            "number": 3,
            "type": "dont",
            "references": [
              "https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide"
            ]
          }
        ]
      }
    ],
    "suggestedFixes": [
      {
        "refFinding": [ 1 ],
        "type": "modify",
        "description": "In the refunds skill, replace the promise with: \"Explain that the finance team reviews refunds and transfer the request to them.\"",
        "patches": [
          {
            "contextIndex": 1,
            "diff": "--- a/refunds\n+++ b/refunds\n@@ -1,1 +1,1 @@\n-Promise a refund when the customer asks for one.\n\\ No newline at end of file\n+Explain that the finance team reviews refunds and transfer the request to them.\n\\ No newline at end of file\n"
          }
        ]
      }
    ]
  }
}
```

Reviews are model-generated. The score and findings can vary between requests for the same content, and a finding can be wrong or miss context that only you have. A suggested removal can still drop a business rule the review didn't recognize as critical, so check removals against your requirements, read each patch before applying it, and confirm that the changed agent still behaves as expected.

## Pricing and limits

Instruction Refinement is billed in processing units (PUs), covering input and output usage. Usage is recorded once per request. The PU price varies with the processing model that serves the request, and the [plan multiplier](/docs/pricing.md#plan-multipliers) applies. Longer context items consume more input.

Instruction Refinement shares the document limits of [Extraction](extraction.md) and [Summarization](summarization.md). Each item in the request's `context` array counts as one document, not each HTTP request. The number of processed documents per minute and per day depends on the plan; see [Data processing limits](/docs/limits.md#data-processing). A request that would exceed any active window returns `429 Too Many Requests`.

The embedded API reference contains the server-maintained request, response, authentication, and error details:

<script src="https://inference.aivax.net/apidocs?embed-target=Refine%20instructions&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
