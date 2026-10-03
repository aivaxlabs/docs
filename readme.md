# AIVAX documentation

Static Hugo documentation for https://docs.aivax.net, adapted from the Sisk Hugo implementation while retaining AIVAX's logo, system fonts, burgundy/pink palette and product navigation.

## Build and preview

Requirements: Bun and Hugo 0.154 or newer. Hugo Extended, .NET, DocFX and Cascadium are not required.

```sh
bun install
bun build.js build
cd _site
php -S localhost:8793
```

Stop the PHP server before rebuilding on Windows: its working directory can lock `_site`. `bun build.js serve` runs Hugo's development server; run a complete build first so Pagefind and Mermaid's local bundle exist. No command stages, commits, pushes or deploys.

`bun build.js help` (or no arguments) documents `build`, `serve`, `status [lang]`, `translate [lang] [--force]`, `all`, `--debug` and JSONL options. `all` includes paid translation; never run it casually.

## Source structure and authoring

- `content/en/`: the only hand-edited documentation sources. `content/en/docs/changelogs.md` is the shared public changelog.
- `content/pt-br/`: generated Portuguese; never hand-edit, move or delete it. The migration imported existing translations without rewriting prose.
- `_index.md` pages define groups; front matter `weight` preserves TOC order. The previously unlisted Portuguese decisions page is included at the end of its group.
- `layouts/`: Hugo templates and render hooks. `assets/scripts/`: vanilla JavaScript bundled with `js.Build`.
- `assets/styles/`: plain CSS bundled, minified and fingerprinted by Hugo Pipes. This replaces Cascadium and Bootstrap because these styles no longer need a separate compiler/runtime; the AIVAX pricing, model-capability, tab and request-item classes remain available.
- `data/icons.json`: inline Remix Icons. `static/assets/`: original assets. The existing generated favicon was recovered because the configured source favicon was missing.
- `_site/`, `resources/`, `jsonl-exports/`: generated outputs, not editing surfaces. Do not edit generated API artifacts/binaries under `ref/` if encountered; this project does not generate or consume them.

Read **AGENTS.md in full before changing content**. It carries all confidentiality, allowance, translation and changelog rules from the previous project. In particular:

- Documentation is public. No secrets, confidential data, private implementation details, internal code/repository names or realistic credentials/identifiers. Use explicit placeholders.
- Never publish absolute subscription allowances, token capacities or numerical allowance balances. Use verified relative plan comparisons; conservative scenario estimates must state assumptions and use ≈, not guarantees. Independently published technical rate limits are distinct.
- Endpoint documentation uses the official embed script, not curl examples. Look up endpoint names in https://inference.aivax.net/apidocs/llms.txt. Fix incorrect endpoint descriptions in the service that generates the reference.
- Changelogs include user-visible product/service/API changes, not internal maintenance. Use a verified current-date English H2, newest first, and `Breaking changes:`, `Fixes:`, `Changes:` in that order with bullet lists, omitting empty groups. No tables or undated sections. Each bullet starts with a public product category and explains impact/actions without implementation details or invented deployment claims. Consolidate outcomes, move updated entries to the current date without duplication, preserve unrelated history, and verify linked guides. The full binding rules are in AGENTS.md.

Keep prose and source examples intact during structural migrations. Use standard Markdown alerts (`> [!NOTE]`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`) and titled fences such as ```` ```js {title="example.js"} ````. Mermaid fences render with the local Mermaid bundle. Tabs use `.tab-group`, `role="tablist"`, `role="tab"` with `aria-controls`, and matching `role="tabpanel"` IDs; keyboard arrows/Home/End are supported. No active source articles used DocFX tabs, xref, script-header, tilde-root paths or Mermaid at migration time; the only old Mermaid pages were superseded build-only articles.

## Translations

```sh
bun build.js status pt-br
```

Only after an explicit request authorizing paid translation:

```sh
bun build.js translate pt-br
```

`config.json` and `config.json.example` specify the OpenAI-compatible endpoint, model, API-key environment variable, concurrency and retry limit. Defaults: `https://inference.aivax.net/v1/chat/completions`, `@inception/mercury-2`, `AIVAX_API_KEY`. Never store a key in either file.

Each generated page stores the first 16 hex characters of SHA-256 of the English source with normalized LF line endings. `status` reports current, outdated, missing and orphan files without API calls. Imported translations have `sourceHash: legacy-unverified`: their freshness cannot be established from the previous pipeline, so they intentionally count as outdated. Missing Portuguese media-generation documentation remains missing; the language menu falls back to the Portuguese home rather than inventing a translation.

Translation preserves non-translatable front matter, validates fence/heading/alert counts and exact endpoint embeds, localizes documentation links, skips matching hashes, retries 429/5xx with numeric/date Retry-After, prints progress/ETA, logs processing in `debug.log`, and writes failures to `translate.errors.txt`. A failed page does not overwrite the existing translation. Orphans are reported, never automatically deleted. Tests must use an isolated local mock and dummy key, not the real paid endpoint.

## Search and agent outputs

Pagefind indexes only the 46 English and 45 Portuguese articles, using language-specific indexes within `/pagefind/`. Homes, section summaries, aliases, navigation and action controls are excluded. Search supports Ctrl/Cmd K, `/`, arrow navigation and Enter.

Each page/section has an adjacent `.md` output, a Markdown alternate link and language alternates. Each language has `llms.txt` and `llms-full.txt`. Internal Markdown links resolve to absolute public `.md` URLs; descriptions are unescaped before/after truncation to avoid double-escaped entities.

The original API scripts remain unchanged in HTML and load the public cross-origin endpoint iframe. No CSP or sanitizer blocks them. The iframe inherits the chosen color scheme; light and dark are supported. This is a fully static **build**, but embedded API details still require the remote service at browsing time. Markdown/llms replace each script with a link to its endpoint reference; remote schemas are not fetched or duplicated. JSONL deliberately retains the old packer's behavior of stripping scripts entirely.

## JSONL export

`bun build.js build` writes `jsonl-exports/aivax-documentation.jsonl` after Hugo and Pagefind. It is English-only, split at `#`/`##` headings outside fences, and retains the exact old record shape: `docid`, `text`, `__ref`, `__tags`, `__meta` (`title`, `heading`, `path`, `url`). The migrated corpus produces 295 records and was compared byte-for-byte against the original exporter.

```sh
bun build.js build --single-page
bun build.js build -i content/en/docs -o output.jsonl -u https://docs.aivax.net/docs
bun build.js build -o - > output.jsonl
```

The historical single-page `docid` suffix `#section` is intentionally retained for compatibility. `_index.md` navigation pages are excluded. Build/log output goes to stderr when JSONL uses stdout.

## Legacy URLs and migration limits

English canonical URLs remain `/docs/...html`. Portuguese canonical URLs are `/pt-br/docs/...html`; every original `/docs/pt-br/...html` URL has a Hugo redirect alias. `data/legacy.json` resolves references to moved product guides, and front matter stores their aliases. Redirect aliases point to the public canonical hostname, as in Hugo/Sisk; local preview should use canonical local paths.

All **133 tracked legacy HTML paths** remain present, including 36 aliases for articles that existed only in the old generated build. Those 36 obsolete texts were not republished: direct equivalents are used for classification/MCP, and current product guides replace platform UI articles. Analytics/logs point to account-management MCP; account balance to pricing; conversations to inference; memories to built-in tools; models to getting started. These are partial substitutes, not promises of equivalent UI instructions. `/AGENTS.html` and `/readme.html` redirect home instead of publishing internal contributor instructions.

The old generated JS/CSS/search manifests are not retained: 153 non-HTML paths disappear (146 `public/` assets plus old TOC/search/DocFX metadata and `logo.svg`). None is referenced by the new site. Original source assets are retained. Portuguese translations contain 21 inherited broken fragment references; their text is preserved pending an authorized regeneration/content review. These do not produce unresolved-page warnings.

## Validation of this migration

- `bun build.js build`: successful with zero unresolved-link warnings; 46 EN / 45 PT Pagefind articles, 295 default JSONL records.
- All 91 article bodies and the English homepage matched the current source working tree after front matter/line-ending normalization. All 94 source embeds were preserved.
- Default JSONL (295 records) and `--single-page -o -` (46 records) were byte-identical to the legacy packer. Help, status and JavaScript syntax checks passed.
- Local mock translation: 15/15 scenarios passed, including all four status states, incremental/force, CRLF hashing, restricted front matter, localized aliases and inline/reference/autolinks, structural/embed rejection preserving existing files, and 429/503 Retry-After seconds/date retries. No paid translation ran.
- Chrome over PHP static serving: home, Getting Started, AI Gateway with a real remote embed, pricing, changelogs, Portuguese pricing, light/dark, 390px mobile navigation, EN/PT search, Ctrl K and `/`, result arrow navigation, and copy-page menu inspected. No console errors remained after clipboard error handling. Local Mermaid renderer produced an SVG in a temporary DOM probe.
- Real clipboard success could not be verified: the remote Chrome document was not focused. Failure feedback was verified without unhandled errors; View as Markdown remains available. No claim is made about successful OS clipboard writes.
- `.md`, llms outputs and sitemaps inspected; 113 sitemap URLs point to existing output. Final output: 200 HTML files and 312 other files. Legacy comparison: 133/133 HTML retained, 0 removed; 67 additional HTML; 153 obsolete non-HTML paths removed.
- Original and Sisk directories were not modified by this migration. A separate authorized thread committed only an existing model-access line in the original repository during the work; working-tree content was unchanged by that operation.
- Preview/mock servers were stopped and temporary fixtures/configuration removed. Nothing was staged, committed, pushed or deployed by this migration.

## Publishing — separate authorization required

Cloudflare Pages project `open-indexer-docs`, repository `aivaxlabs/docs`, was inspected read-only. The dashboard shows:

- Build command: empty.
- Build output directory: empty.
- Root directory: `_site`.
- Production branch: `master`; automatic deployments enabled; build system v2.

The existing setup therefore consumes prebuilt files from the repository's `_site` directory. Publishing this migration requires a separately authorized replacement/review in that repository, committing the rebuilt `_site` with its sources, then pushing the production branch (which triggers deployment). Alternatively, configure a Cloudflare build with pinned Bun/Hugo and `_site` as output, but that is a separate infrastructure decision. No Pages settings were changed and nothing was deployed.
