# Project Guidelines

## Code Style
- Keep changes focused and minimal; avoid broad reformatting.
- Follow existing naming and structure in docs and templates.
- Prefer editing source inputs over generated outputs.

## Architecture
- `docs/` contains source documentation pages and section folders.
- `docs/toc.yml` and root `toc.yml` define navigation.
- `docfx.json` controls site generation and templates.
- `template/modern/` contains custom DocFX template assets.
- `template/style/src/*.xcss` contains Cascadium style sources.
- `template/style/public/main.css` is generated from Cascadium sources.
- `_site/` is generated output and should not be manually edited.

## Build and Test
- Full build (includes translation pipeline): run `build.sh`.
- Fast rebuild (CSS + DocFX only): run `comp.ps1`.
- Manual equivalents:
  - `cascadium build`
  - `docfx build`
  - `docfx serve` (after build)
- Translation scripts call external AI APIs and may incur cost. Do not run translation unless explicitly requested.

## Conventions
- Produce and edit documentation only in English source files under `docs/`.
- Never create, edit, move, or delete anything under `docs/pt-br/`.
- Do not edit generated API artifacts/binaries under `ref/`.
- Do not edit generated site files under `_site/`.
- Do not run translation generation for `docs/pt-br/` unless explicitly requested by the user.
- Treat all documentation as public. Never publish secrets, credentials, confidential data, proprietary operational details, or information intended only for internal use.
- Do not reference non-public source code or expose internal class, method, type, repository, file, parameter, limiter, job, factory, implementation-path, or checkout names. Describe only the supported public contract and user-observable behavior.
- Use explicit placeholders in examples. Never include real or realistic-looking API keys, tokens, nonce hashes, session identifiers, UUIDs, account identifiers, internal hosts, IP addresses, or filesystem paths unless the value is an intentional part of the public contract.
- Mentions of secrets, confidential data, sensitive data, or trade secrets are allowed only for security guidance, legal definitions, and non-disclosure clauses that do not reveal the protected information.
- If changing styles, edit `template/style/src/*.xcss` and rebuild; do not hand-edit compiled CSS.
- When referencing an AIVAX API endpoint in documentation, use the embedded API reference script instead of a `curl` example. Look up the correct endpoint name in `https://inference.aivax.net/apidocs/llms.txt`, then embed it as `<script src="https://inference.aivax.net/apidocs?embed-target=ENDPOINT%20NAME&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>`.

## Changelog authoring
- Maintain `docs/changelogs.md` as the shared public changelog for backend and UI changes. Include every change that affects a product or service used by users or the public API, including visible UI changes. Exclude internal-only refactors, dependencies, tests, and operational maintenance without a user-facing effect.
- Write in English using a level-two date heading such as `## Monday, September 21st, 2026`. Verify the weekday and English ordinal suffix. Under each date, use the labels `Breaking changes:`, `Fixes:`, and `Changes:` in that order, each followed by a bulleted list; omit empty groups. Do not use tables.
- Group removed or incompatible behavior requiring a compatibility review or migration under `Breaking changes:`, corrected behavior under `Fixes:`, and improvements or user-facing maintenance under `Changes:`. Do not hide incompatibilities under another group. Start each bullet with the product category and a concise summary, for example `- **Gateways — Summary.** Description`. Use product categories, not internal subsystem names.
- Describe what changes for the reader, affected users or configurations, and any required action. Mention relevant limits, cost effects, defaults, or compatibility details only when supported by evidence. Breaking entries must explain the impact and migration or alternative when one exists; do not imply an alternative is equivalent when it is not.
- Describe only public contracts and observable behavior. Never include source code, source filenames or paths, classes, methods, commit hashes, repository details, internal infrastructure, credentials, confidential data, or implementation mechanisms. Public API fields, model identifiers, and product options may be named when necessary for users to act.
- Verify descriptions against the actual change and current behavior, not commit titles alone. Avoid speculative benefits, unsupported guarantees, and invented release dates. Keep implementation evidence outside the public page.
- NEVER use `Unreleased`, `Not scheduled`, or any undated/pending section. Every new or updated entry must appear under the current date of the changelog update, written out in the level-two heading using the format above. This also applies to entries based on uncommitted changes or older commits: use the changelog update date, not the commit date. The date records a documentation update, not proof of deployment; do not invent availability claims.
- Keep dated sections newest first. Consolidate changes with the same user-facing outcome, including backend/UI work, instead of adding one entry per commit or file. When updating an entry, move it to the current update date without duplicating it; leave unrelated historical entries and their dates unchanged.
- Link to relevant product guides rather than duplicating them. Check links, date headings, group placement, factual accuracy, and confidentiality before finishing. Follow the existing build and translation restrictions when validating the page.

## Key References
- `readme.md` for setup constraints and contribution notes.
- `build.sh` and `comp.ps1` for canonical build workflows.
- `translate.js` and `clean-translations.js` for translation behavior.
- `cascadium.json5` for CSS build output mapping.
