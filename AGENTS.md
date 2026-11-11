# AIVAX Documentation (Hugo)

## Code Style
- Keep changes focused and minimal; avoid broad reformatting.
- Follow existing naming and structure in docs and templates.
- Prefer editing source inputs over generated outputs.

## Architecture
- English source documentation is in `content/en/`; generated Portuguese is in `content/pt-br/`.
- Front matter `weight` defines ordering; section `_index.md` files define groups.
- `hugo.toml` defines static outputs, languages and rendering.
- `layouts/` contains Hugo templates; `assets/styles/` contains plain CSS bundled by Hugo Pipes.
- `assets/scripts/` contains vanilla JavaScript bundled with js.Build.
- `data/icons.json` contains inline Remix Icon paths.
- `_site/`, `resources/`, and `jsonl-exports/` are generated; never hand-edit them.
- There is no generated .NET API reference, DLL pipeline or DocFX dependency.

## Build and Test
- Install dependencies with `bun install`; build with `bun build.js build`.
- Preview the static output with `php -S localhost:8793` from `_site`; stop the server before rebuilding on Windows.
- Inspect translations without API calls using `bun build.js status`.
- Translation and `all` call external AI APIs and may incur cost. Never run them without an explicit user request. Test translation only with a local mock in an isolated fixture.
- See `bun build.js help` and README.md for commands and JSONL options.

## Conventions
- Never disclose absolute subscription allowance units, token quantities, or numerical allowance balances in public content, including tables, examples, and changelogs. Describe allowances through relative plan comparisons, such as “3× the Pro allowance” or “5× the Max allowance”. Scenario-based operation estimates are also permitted when calculated from actual metering and conservatively rounded without publishing exact internal capacity. Mark estimates with “≈” and disclose their assumptions; do not present scenarios as measured averages or guaranteed limits, or use “Up to” to imply a ceiling. Never invent figures or unsupported conversions. Verify each multiplier against the actual allowances; these examples are illustrative, not fixed product claims. This rule concerns subscription allowances, not independently published technical rate limits. The only exceptions are those in the list below; do not extend them to other plans, services, or pages.
  - Exceções autorizadas pelo usuário:
    - Franquias diárias absolutas do Free na tabela de serviços incluídos de `content/en/docs/limits.md`, autorizadas pelo Gabriel em 10/11/2026. Planos pagos continuam como múltiplos do Free. Não estenda esta exceção a outras páginas, planos ou changelogs.
- Produce and edit documentation only in English source files under `content/en/`.
- Never create, edit, move, or delete generated files under `content/pt-br/` by hand; only the authorized translation pipeline may update them. The initial migration imported the existing generated translations without rewriting prose.
- Do not edit generated API artifacts/binaries under `ref/`.
- Do not edit generated site files under `_site/`.
- Do not run translation generation for `content/pt-br/` unless explicitly requested by the user.
- Document product-specific prices and limits in a `## Pricing and limits` section of the product's own page. Keep `content/en/docs/pricing.md` limited to account-wide billing rules and links to product pricing, without model or product rates, and `content/en/docs/limits.md` limited to account-level limits.
- Treat all documentation as public. Never publish secrets, credentials, confidential data, proprietary operational details, or information intended only for internal use.
- Do not reference non-public source code or expose internal class, method, type, repository, file, parameter, limiter, job, factory, implementation-path, or checkout names. Describe only the supported public contract and user-observable behavior.
- Use explicit placeholders in examples. Never include real or realistic-looking API keys, tokens, nonce hashes, session identifiers, UUIDs, account identifiers, internal hosts, IP addresses, or filesystem paths unless the value is an intentional part of the public contract.
- Mentions of secrets, confidential data, sensitive data, or trade secrets are allowed only for security guidance, legal definitions, and non-disclosure clauses that do not reveal the protected information.
- If changing styles, edit plain CSS in `assets/styles/` and rebuild; do not hand-edit compiled CSS.
- When referencing an AIVAX API endpoint in documentation, use the embedded API reference script instead of a `curl` example. Look up the correct endpoint name in `https://inference.aivax.net/apidocs/llms.txt`, then embed it as `<script src="https://inference.aivax.net/apidocs?embed-target=ENDPOINT%20NAME&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>`.

## Changelog authoring
- Maintain `content/en/docs/legal/changelogs.md` as the shared public changelog for backend and UI changes. Include every change that affects a product or service used by users or the public API, including visible UI changes. Exclude internal-only refactors, dependencies, tests, and operational maintenance without a user-facing effect.
- Write in English using a level-two date heading such as `## Monday, September 21st, 2026`. Verify the weekday and English ordinal suffix. Under each date, use the labels `Breaking changes:`, `Fixes:`, and `Changes:` in that order, each followed by a bulleted list; omit empty groups. Do not use tables.
- Group removed or incompatible behavior requiring a compatibility review or migration under `Breaking changes:`, corrected behavior under `Fixes:`, and improvements or user-facing maintenance under `Changes:`. Do not hide incompatibilities under another group. Start each bullet with the product category and a concise summary, for example `- **Gateways — Summary.** Description`. Use product categories, not internal subsystem names.
- Describe what changes for the reader, affected users or configurations, and any required action. Mention relevant limits, cost effects, defaults, or compatibility details only when supported by evidence. Breaking entries must explain the impact and migration or alternative when one exists; do not imply an alternative is equivalent when it is not.
- Describe only public contracts and observable behavior. Never include source code, source filenames or paths, classes, methods, commit hashes, repository details, internal infrastructure, credentials, confidential data, or implementation mechanisms. Public API fields, model identifiers, and product options may be named when necessary for users to act.
- Verify descriptions against the actual change and current behavior, not commit titles alone. Avoid speculative benefits, unsupported guarantees, and invented release dates. Keep implementation evidence outside the public page.
- NEVER use `Unreleased`, `Not scheduled`, or any undated/pending section. Every new or updated entry must appear under the current date of the changelog update, written out in the level-two heading using the format above. This also applies to entries based on uncommitted changes or older commits: use the changelog update date, not the commit date. The date records a documentation update, not proof of deployment; do not invent availability claims.
- The changelog is public and read by customers and competitors. Before keeping a sentence, ask whether a user can observe or act on it through the API, dashboard, or published guides. If not, rewrite it as the user-visible outcome or remove it. Common leaks to avoid:
  - Upstream suppliers, resellers, or catalogs not listed in `content/en/docs/legal/third-party-processors.md`, including their prices or formats ("OpenRouter list price" → the AIVAX catalog price or the Models page).
  - Background jobs, polling cadences, retry windows, or reconciliation logic ("invoices are checked every few minutes" → "paid invoices are confirmed even when the notification is delayed").
  - Internal flags, states, or response fields that are not documented in the API reference, and how billing records are stored.
  - Margins, markups, cost structure, negotiated terms, or exceptions for specific plans or accounts that the public plan pages do not state.
  - How a bug happened internally ("left extraction running indefinitely" → "extraction no longer stalls after a cancellation").
  - Legacy or internal names for renamed plans, products, or features; use the current public name.
- Keep dated sections newest first. Consolidate changes with the same user-facing outcome, including backend/UI work, instead of adding one entry per commit or file. When updating an entry, move it to the current update date without duplicating it; leave unrelated historical entries and their dates unchanged.
- Link to relevant product guides rather than duplicating them. Check links, date headings, group placement, factual accuracy, and confidentiality before finishing. Follow the existing build and translation restrictions when validating the page.

## Key References
- README.md for setup, migration limitations, endpoint embeds and publication.
- build.js and config.json.example for build, JSONL and incremental sourceHash translation.
- hugo.toml for languages and output formats; data/legacy.json for legacy link resolution.
- Preserve the external endpoint scripts in HTML. Markdown and llms outputs link to the endpoint reference instead of executing scripts.
- Preserve aliases, absolute Markdown links, hreflang and per-language Pagefind search.
- Run builds with zero unresolved-link warnings. Do not change English prose to hide content-caused errors; report them.
