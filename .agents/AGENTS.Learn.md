---
description: Authoring rules, front matter, and visual shortcodes for the Learn section (content/en/learn). Load when writing or reviewing Learn modules and units.
---
# AIVAX Learn — authoring guide

Learn (`content/en/learn/`) is a Microsoft-Learn-style teaching section. It teaches concepts about AI agents to people without a computing background: entrepreneurs, directors and developers. It is **not** product documentation; link to `content/en/docs/` pages when a concept maps to an AIVAX feature.

All rules in `docs/AGENTS.md` apply (English source only, never edit `content/pt-br/`, no secrets, no internal names, no allowance numbers, zero unresolved links).

## Structure

- `content/en/learn/_index.md` — hub (learning paths in front matter).
- `content/en/learn/<module>/_index.md` — module: `title`, `description`, `weight`, `icon`, `level` (`beginner`|`intermediate`|`advanced`), `cover: images/learn/<module>.webp` (file under `assets/images/learn/`), short body paragraph.
- `content/en/learn/<module>/<unit>.md` — unit. Units are ordered by `weight` (10, 20, 30...).

Unit front matter:

```yaml
---
title: Adding tools
linkTitle: Adding tools          # short sidebar label
description: "One sentence shown under the title and on the module page. Quote it."
weight: 50
duration: 10                     # minutes, integer
level: beginner                  # optional; inherits from the module
objectives:
  - Verb-first outcome the reader can do after the unit.
  - Three to five items.
---
```

Do not add a `# H1` in the body; the layout renders the title. Start with a paragraph, use `##` sections (they feed the table of contents), optional `###`.

## Writing rules

- Audience is lay: explain every term the first time it appears, use analogies from everyday work (a new employee, a receptionist, a filing cabinet), prefer concrete examples over abstractions.
- Neutral and vendor-agnostic. Never name a specific commercial model as "the best", never quote benchmark leaderboards, never state prices as facts. Illustrative numbers must be labelled *illustrative* or *typical* in the caption.
- Each unit: 900–1,600 words of prose plus visual blocks, 8–15 minutes. One idea per unit, developed end to end.
- Every unit ends with exactly one `quiz` block. Before the quiz, a short paragraph bridging to the next unit is welcome.
- Use **at least three different visual blocks** per unit, chosen because they clarify *what*, *how*, or *why* — not as decoration. Prefer `steps` for processes, `timeline` for history/evolution, `flow` for pipelines, `compare` for good/bad or A/B, `cards` for taxonomies, `chart` for quantitative comparisons, `demo` for things the reader should feel by manipulating.
- Markdown tables are fine for option comparisons (they render well in HTML and Markdown outputs).
- GitHub-style alerts are available: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]`.
- Mermaid diagrams are supported with a ```` ```mermaid ```` fence (flowchart, sequence). Keep them small (≤ 10 nodes) and label edges in plain words.
- Links between units: relative Markdown, e.g. `[Adding tools](adding-tools.md)` or `[What is a RAG](../teaching-agents/what-is-a-rag.md)`. Links to docs: `[AI gateways](../../docs/inference/ai-gateway.md)`. Every link must resolve; the build warns on unresolved links.
- Do not reference AIVAX internals, class names, or unpublished behaviour. Mentioning "On AIVAX, this is called an AI gateway" with a link is fine.

## Shortcodes

Quote JSON parameters with backticks, never single quotes (Hugo rejects mixed quoting).

### Step-by-step animation

```
{{</* steps */>}}
{{</* step title="The user asks" */>}}
Markdown body. Can contain lists, code, links.
{{</* /step */>}}
{{</* step title="The model decides to call a tool" */>}}
...
{{</* /step */>}}
{{</* /steps */>}}
```

### Timeline

```
{{</* timeline */>}}
{{</* event date="2017" title="The transformer" */>}}Text.{{</* /event */>}}
{{</* event date="2022 onwards" title="Conversational models" */>}}Text.{{</* /event */>}}
{{</* /timeline */>}}
```

### Flow (pipeline)

```
{{</* flow "User message | Retrieval | Model | Answer" */>}}
{{</* flow items="Plan | Act | Observe | Repeat" direction="vertical" */>}}
```

Use `items=` whenever `direction` is given (Hugo forbids mixing positional and named parameters).

```
```

### Charts

```
{{</* chart type="bar" title="Cost per 1,000 conversations (illustrative)" unit=" USD" data=`[{"label":"Small model","value":4},{"label":"Large model","value":38}]` caption="Typical orders of magnitude, not a price list." */>}}

{{</* chart type="pie" title="Where latency goes" unit="%" data=`[{"label":"Retrieval","value":20},{"label":"Model","value":70},{"label":"Tools","value":10}]` */>}}

{{</* chart type="line" title="Accuracy as examples are added" data=`{"labels":["0","1","3","5","10"],"series":[{"name":"Few-shot","values":[52,70,81,86,88]}]}` */>}}
```

`type="donut"` is also accepted. Line charts accept several series.

### Compare (good/bad or side-by-side)

```
{{</* compare */>}}
{{</* side title="Vague prompt" tone="bad" */>}}Body.{{</* /side */>}}
{{</* side title="Specific prompt" tone="good" */>}}Body.{{</* /side */>}}
{{</* /compare */>}}
```

`tone` is optional; omit for neutral A/B.

### Concept cards

```
{{</* cards */>}}
{{</* card title="Short-term memory" icon="time" */>}}One or two sentences.{{</* /card */>}}
{{</* card title="Long-term memory" icon="database" */>}}...{{</* /card */>}}
{{</* /cards */>}}
```

### Stats

```
{{</* stats */>}}
{{</* stat value="~4" label="characters per token in English" */>}}
{{</* stat value="128k" label="tokens in a typical large context window" */>}}
{{</* /stats */>}}
```

### Quiz (one per unit, at the end)

```
{{</* quiz options="Option one | Option two | Option three" answer="2" explanation="Why option two is right." */>}}
Question text in Markdown.
{{</* /quiz */>}}
```

### Tabs, accordion, figure

```
{{</* tabs */>}}
{{</* tab title="Support" */>}}...{{</* /tab */>}}
{{</* tab title="Sales" */>}}...{{</* /tab */>}}
{{</* /tabs */>}}

{{</* accordion title="Why not just use a bigger model?" */>}}Body.{{</* /accordion */>}}

{{</* figure src="/assets/learn/<module>/<name>.png" alt="Describe the image" caption="Optional caption." */>}}
```

Static images go in `static/assets/learn/<module>/`. Only add images that already exist; do not reference images you have not created.

### Interactive demos

```
{{</* demo name="tokenizer" title="Try it: text becomes tokens" config=`{"text": "Any sentence."}` */>}}Intro text.{{</* /demo */>}}
{{</* demo name="temperature" title="..." config=`{"prefix": "Tomorrow the weather will be", "candidates": [["sunny", 0.52], ["cloudy", 0.22], ["rainy", 0.14], ["windy", 0.08], ["purple", 0.04]]}` */>}}...{{</* /demo */>}}
{{</* demo name="context" title="..." config=`{"blocks": [["System instructions", 400, "#7a3fd1"], ["Knowledge", 1200, "#1a7f37"], ["Message 1", 300, "#0b6bcb"], ["New question", 200, "#7f2942"]]}` */>}}...{{</* /demo */>}}
{{</* demo name="conversation" title="..." config=`{"messages": [["system", "You are a support agent..."], ["user", "Where is my order?"], ["tool", "lookup_order(id=123) → shipped"], ["assistant", "Your order shipped yesterday."]]}` */>}}...{{</* /demo */>}}
{{</* demo name="search" title="..." config=`{"label": "Ask a question", "placeholder": "refund policy", "documents": [["Refunds", "Refunds take 5 business days...", ["refund", "money"]], ["Shipping", "Orders ship within 48 hours...", ["delivery"]]]}` */>}}...{{</* /demo */>}}
{{</* demo name="cost" title="..." config=`{"labels": {"conversations": "Conversations per month", "inputTokens": "Input tokens per conversation", "outputTokens": "Output tokens per conversation", "inputPrice": "Input price per million tokens (USD)", "outputPrice": "Output price per million tokens (USD)", "perConversation": "Cost per conversation"}, "max": 500}` */>}}...{{</* /demo */>}}
```

The `conversation` demo accepts roles `system`, `user`, `assistant`, `tool`. The `context` demo drops the oldest blocks first and always keeps the last one.

Available icons for `card`/`icon=`: `robot, chat, database, plug, shield, flask, rocket, compass, cpu, git, eye, lightbulb, book, graduation, time, user, settings, lock, briefcase, list-check, message, refresh, stack, sparkle, layout, tools, coin, globe, check, close, question, play, pause, arrow-right`.

## Validation

From `docs/`: `bun build.js build` (or `hugo -d "$TEMP/learn-check"` without `--quiet`, which hides build errors) must finish with no `WARN`/`ERROR` lines (unresolved links are warnings). The Markdown output of a unit is at `_site/learn/<module>/<unit>.md`; the shortcodes degrade to plain Markdown there.
