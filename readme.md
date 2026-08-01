# AIVAX Documentation

This repository contains the source files for the AIVAX documentation website.

## Build

Use the project scripts when possible:

1. Run `comp.ps1` for a fast rebuild of Cascadium styles and DocFX.
2. Run `build.ps1` only when the translation pipeline is intentionally needed.
3. Run `docfx serve` after a build to preview the generated site.

Generated static files are written to `_site/`.

## Contribute

Keep documentation changes focused and edit source files, not generated output.

- Root navigation is defined in `toc.yml`.
- Section navigation is defined in `docs/toc.yml`.
- Documentation pages live under `docs/`.
- Portuguese documentation lives under `docs/pt-br/`.
- Generated API artifacts live under `ref/`.
- Generated site output lives under `_site/`.

Do not edit `_site/`, `ref/`, or generated translation output by hand. If an API endpoint description is wrong, update the API source in the service repository that generates the reference.
