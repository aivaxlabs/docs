---
title: What is Learn
linkTitle: What is Learn
description: "An orientation: who Learn is for, how the modules and learning paths are organised, what the visual blocks mean, and how to track your progress."
weight: 10
duration: 8
objectives:
  - Recognise who Learn was written for and what it does not try to be.
  - Navigate modules, units, learning paths, knowledge checks and progress.
  - Read the visual blocks you will meet in every unit.
---

Learn is the part of the AIVAX documentation that teaches ideas rather than product features. It exists because most people who need to make decisions about AI agents — founders, directors, product owners, and developers coming from other fields — never had a reason to study how language models work. The reference documentation assumes you already know what a token is; Learn assumes you do not.

That assumption shapes every page. Terms are defined the first time they appear, examples come from ordinary business situations such as support desks, sales teams and internal help, and nothing requires you to open a terminal or read code. When a unit does show a small snippet, it is there to make an idea concrete, not to be copied.

## Who Learn is for

{{< cards >}}
{{< card title="Entrepreneurs and directors" icon="briefcase" >}}
You decide where agents create value, what they cost and which risks are acceptable. Learn gives you vocabulary and judgement without asking you to write code.
{{< /card >}}
{{< card title="Developers" icon="cpu" >}}
You already build software and need the mental model behind prompts, tools, retrieval and evaluation so your first agent is not your last.
{{< /card >}}
{{< card title="Curious people" icon="lightbulb" >}}
You keep hearing *agent*, *RAG* and *context window* and want the real meaning, explained once, properly.
{{< /card >}}
{{< /cards >}}

These three audiences share one need: a common vocabulary. A director who understands what a context window is can ask a developer a precise question about cost; a developer who understands why a retrieval system can still produce a wrong answer can explain a risk to a director without hand-waving. Learn is written so that both can read the same unit and come away with the same picture.

Learn is deliberately neutral. Units describe how agents work in general; when something maps to a feature you can use today on AIVAX, the unit links to the matching page in the [Documentation](../../docs/overview.md). You can read every unit without an account, and nothing in the explanations depends on a particular vendor or model.

## How the content is organised

{{< flow "Module | Unit | Section | Knowledge check" >}}

A **module** is a theme, such as *Agents* or *Safety, ethics and compliance*. Each module has a cover page that lists its **units** in a recommended order and shows how much of it you have completed.

A **unit** is one idea explained end to end in eight to fifteen minutes. Every unit opens with the objectives you should be able to meet by the end, develops the idea with visual blocks, and closes with a **knowledge check** and a button to mark it complete. Inside a unit, **sections** break the idea into steps you can return to later from the table of contents shown on wide screens.

You do not need to follow modules in order. The home page proposes three learning paths, and every unit links to the units it depends on, so you can start wherever your question is and follow the links backwards when something is unfamiliar.

## The three learning paths

A **learning path** is a suggested sequence of modules for a particular kind of reader. The paths overlap on purpose: the Agents module, for example, is the backbone of both the beginner and the developer path, because the same ideas are needed whichever role you have.

{{< cards >}}
{{< card title="Beginner" icon="graduation" >}}
Introduction; Agents; Prompt engineering and context; Safety, ethics and compliance. Start here if you have never built anything with AI and want to understand what an agent is, piece by piece.
{{< /card >}}
{{< card title="Developer" icon="cpu" >}}
Agents; Models and parameters; Tools and integrations; Advanced agents and workflows; Quality, evaluation and observability; Production and scale. Follow this if you will design, connect, test and ship agents.
{{< /card >}}
{{< card title="Business" icon="briefcase" >}}
Introduction; Teaching agents; Quality, evaluation and observability; Safety, ethics and compliance; Practical guides and case studies. Follow this if you need to decide where agents create value, what they cost and which risks to manage.
{{< /card >}}
{{< /cards >}}

Paths are a recommendation, not a gate. Nothing is locked, and the Practical guides module in particular is useful to everyone: it applies the ideas from the other modules to complete scenarios such as a customer-support agent or an internal knowledge assistant.

## The visual blocks you will meet

{{< steps >}}
{{< step title="Step-by-step animations" >}}
Blocks like this one walk through a process one step at a time. Press **Play** to advance automatically, use the arrows, or click any step.
{{< /step >}}
{{< step title="Timelines" >}}
Timelines show how an idea evolved, so you understand *why* the current approach exists and not only *what* it is.
{{< /step >}}
{{< step title="Charts and tables" >}}
Bar, line and pie charts compare numbers; tables compare options. Values in Learn are illustrative unless the unit says otherwise.
{{< /step >}}
{{< step title="Interactive demos" >}}
Small simulations let you move a slider or type a sentence and watch what changes. They run entirely in your browser and never call a model.
{{< /step >}}
{{< step title="Knowledge checks" >}}
One question at the end of each unit. There is no score; it is there to confirm you can apply the idea.
{{< /step >}}
{{< /steps >}}

Two other blocks appear often. A **comparison** places two short examples side by side, usually a weak version and a better one, so you can see the difference rather than read about it. A **flow** is the horizontal chain of boxes you saw above; it shows an order or a pipeline at a glance.

The ideas never live only inside a visual block. If you prefer reading, or if you use a screen reader, the surrounding paragraphs carry the same facts, and the step and timeline blocks can be read top to bottom without pressing anything. Interactive demos are the exception: they exist to be tried, and their caption tells you what to notice.

## Tracking your progress

Progress is stored only in your browser. Nothing is sent anywhere, and switching devices starts fresh.

{{< compare >}}
{{< side title="Marked automatically" tone="good" >}}
When you click **Next unit** at the bottom of a page, the current unit is marked as complete.
{{< /side >}}
{{< side title="Marked by you" tone="good" >}}
Click **Mark as complete** at the end of a unit at any time. Click it again to undo.
{{< /side >}}
{{< /compare >}}

The sidebar shows a check next to each finished unit, and module cards on the home page show a progress bar. If your browser blocks local storage, you can still mark units and read every page; you simply lose the check marks when you leave the page.

## How to get the most out of a unit

Read the objectives first. They tell you what question the unit answers, and if you can already answer it, skip ahead. Try the interactive demos rather than only reading their captions; moving the slider yourself is what turns a definition into intuition. Answer the knowledge check before revealing the explanation, even when the answer seems obvious, because the explanation often adds the nuance the question was designed to surface.

When a unit links to another unit, follow the link only if the term is unfamiliar. The links exist to let you fill gaps on demand, not to send you on a detour every time. And when a unit links to the product documentation, treat that as optional: the concept stands on its own, and the documentation page is there for the moment you want to try the idea for real.

## What Learn is not

Learn is not an API reference, not a course with certificates, and not a comparison of vendors. It avoids benchmarks that go stale within months and avoids claims about specific models. Where prices or sizes appear, they are rounded, typical values chosen to make an idea concrete, and the unit says so.

Learn is also not a substitute for judgement. The units explain how agents behave and why, so that the decisions about where to use one, how much to trust it and when to involve a person remain yours, taken with a clear picture of the trade-offs.

{{< quiz options="Entrepreneurs and directors only | Developers only | Anyone who needs to understand agents, regardless of technical background" answer="3" explanation="Learn assumes no computing background and keeps the writing neutral so that business and technical readers share the same vocabulary." >}}
Who is Learn written for?
{{< /quiz >}}
