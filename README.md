<div align="left">

![Hawk Banner](https://r2os.staticcanvas.me/logos/hawk/hawk-banner.svg)

[![license](https://img.shields.io/gitlab/license/staticcanvas/hawk?style=flat-square&logo=gitlab&labelColor=%232c3e50&color=%232c3e50&logoColor=%234ca1af)](https://gitlab.com/staticcanvas/hawk)
[![gitlab-pipeline](https://img.shields.io/gitlab/pipeline-status/staticcanvas/hawk?style=flat-square&logo=gitlab&labelColor=%232c3e50&color=%232c3e50&logoColor=%234ca1af)](https://gitlab.com/staticcanvas/hawk/-/pipelines)
[![codecov](https://codecov.io/gl/staticcanvas/hawk/branch/v0.11.0-release/graph/badge.svg?token=)](https://codecov.io/gl/staticcanvas/hawk)
[![documentation](https://img.shields.io/badge/docs-online-2c3e50?style=flat-square&logo=gitbook&logoColor=4ca1af)](https://staticcanvas.gitlab.io/hawk)
[![gitlab-issues](https://img.shields.io/gitlab/issues/open/staticcanvas/hawk?style=flat-square&logo=gitlab&labelColor=%232c3e50&color=%232c3e50&logoColor=%234ca1af)](https://gitlab.com/staticcanvas/hawk/-/work_items?sort=created_date&state=opened&first_page_size=20)

[![gitlab-release](https://img.shields.io/gitlab/v/release/staticcanvas/hawk?style=flat-square&logo=gitlab&labelColor=%232c3e50&color=%232c3e50&logoColor=%234ca1af)](https://gitlab.com/staticcanvas/hawk/-/releases/permalink/latest)
[![gitlab-tag](https://img.shields.io/gitlab/v/tag/staticcanvas/hawk?style=flat-square&logo=gitlab&labelColor=%232c3e50&color=%232c3e50&logoColor=%234ca1af)](https://gitlab.com/staticcanvas/hawk/-/tags)

[![npm-version](https://img.shields.io/npm/v/@staticcanvas/hawk?style=flat-square&logo=npm&labelColor=%232c3e50&color=%232c3e50&logoColor=%234ca1af)](https://www.npmjs.com/package/@staticcanvas/hawk)
[![npm-downloads](https://img.shields.io/npm/dw/@staticcanvas/hawk?style=flat-square&logo=npm&labelColor=%232c3e50&color=%232c3e50&logoColor=%234ca1af)](https://www.npmjs.com/package/@staticcanvas/hawk)

[![jsr-version](https://img.shields.io/jsr/v/%40staticcanvas/hawk?style=flat-square&logo=jsr&labelColor=%232c3e50&color=%232c3e50&logoColor=%234ca1af)](https://jsr.io/%40staticcanvas/hawk)
[![jsdelivr-hitsperweek](https://img.shields.io/jsdelivr/npm/hw/@staticcanvas/hawk?style=flat-square&logo=jsdelivr&labelColor=%232c3e50&color=%232c3e50&logoColor=%234ca1af)](https://cdn.jsdelivr.net/package/npm/@staticcanvas/hawk)

[![runtime-badge](https://gitlab.com/api/v4/projects/staticcanvas%2Fhawk/jobs/artifacts/v0.10.0/raw/runtime-badge-flat.svg?job=generate-runtime-badge)](https://gitlab.com/api/v4/projects/staticcanvas%2Fhawk/jobs/artifacts/main/raw/runtime-badge-flat.svg?job=generate-runtime-badge)

> **Hawk** is a themeable, pluggable command-palette search UI for static sites, powered by Pagefind indexing with swappable reveal animations and visual themes.

</div>

## Overview

Hawk is a themeable, pluggable command-palette search widget for static sites: `npm install` + a
constructor call, no host markup beyond a trigger element required. [Pagefind](https://pagefind.app/)
owns indexing, ranking, and typo-tolerant matching; hawk owns the modal, keyboard navigation, and
result rendering, with visual theme and reveal animation as swappable plugins rather than
hardcoded choices.

Full usage, configuration, and theming detail lives in the docs site linked below — this README
stays a short pitch plus what you need to build the project from source.

---

> 🔹 Read the full documentation [here](https://staticcanvas.gitlab.io/hawk/)

> 🔹 Use the playground [here](https://staticcanvas.gitlab.io/hawk/playground/)

<details>
<summary><strong>📚Table of Contents</strong></summary>

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Build from source](#build-from-source)
- [Resources](#resources)
- [Development & NPM Scripts](#development-npm-scripts)
- [License](#license)

</details>

## Features

- **Pagefind-backed** — chunked, lazily-loaded, typo-tolerant search index.
- **Dev-controlled tabs** — auto-derived category pills, or explicit Pagefind-filter tabs.
- **Fit / medium / compact** density modes with a persisted in-modal toggle.
- **Two-pane keyboard navigation** — Tab between input, filters, results, and preview.
- **Configurable layout** — scale, position, offset, columns, and a JS-driven breakpoint.
- **Theme and animation plugin systems** — a TypeFlow typewriter driver ships built-in, alongside
  a zero-dependency instant driver.
- **Structured inline filters** — `category:Guides responsive` parses out a filter as you type.
- **Result metadata** — dates, tags, related pages, and a pin system, each independently themeable
  and configurable.
- **Built-in trigger element** and Pagefind attribution, so no hand-built markup is required.
- **Accessible by default** — a real modal focus trap, graceful fallback if Pagefind fails to
  load, and full i18n via `config.strings`.

See [Resources](#resources) below for the full feature reference.

## Installation

```bash
npm install @staticcanvas/hawk
npm install --save-dev pagefind
# Optional: the official TypeFlow animation driver
npm install @staticcanvas/typeflow
```

`pagefind` is a real dependency (hawk has nothing to search without an index).
`@staticcanvas/typeflow` is an optional peer dependency — only needed when importing Hawk's
official TypeFlow animation adapter. Hawk core and the TypeFlow visual theme remain independent.

## Quick start

```js
import { HawkSearch } from '@staticcanvas/hawk';
import '@staticcanvas/hawk/css';

new HawkSearch({
  index: '/pagefind/',
  trigger: { container: 'body' },
});
```

That is the complete zero-config path — `trigger` renders hawk's own trigger button, so no
host markup is required. See [Getting started](https://staticcanvas.gitlab.io/hawk/getting-started/)
in the docs for the full TypeFlow-themed setup, frontmatter/metadata mapping, and every config
option.

## Build from source

```bash
git clone https://gitlab.com/staticcanvas/hawk.git
cd hawk
npm install
npm run build   # core + optional (theme-typeflow, animation-typeflow, debug, metrics) bundles
npm test        # vitest, jsdom
```

To build and preview the docs site itself (Hugo + Pagefind, requires
[Hugo](https://gohugo.io/) on `PATH`):

```bash
npm run docs:serve
```

See [Development & NPM Scripts](#development-npm-scripts) for the full script reference.

## Resources

- **Documentation**: https://staticcanvas.gitlab.io/hawk/
- **Playground**: https://staticcanvas.gitlab.io/hawk/playground/
- **API reference**: [`docs/content/api.md`](docs/content/api.md)
- **Guides**: [Pagefind setup, tabs, and inline filters](docs/content/guides/pagefind-setup.md) ·
  [Density and keyboard navigation](docs/content/guides/density-and-navigation.md) ·
  [Theming](docs/content/guides/theming.md) ·
  [Animation plugins](docs/content/guides/animation-plugins.md) ·
  [Pins, the built-in trigger, and attribution](docs/content/guides/pins-and-embedding.md)
- **Architecture**: [`architecture/README.md`](architecture/README.md) (design rationale) ·
  [`plugin-system.md`](architecture/plugin-system.md) ·
  [`theme-contract.md`](architecture/theme-contract.md) ·
  [`animation-driver-contract.md`](architecture/animation-driver-contract.md)
- **Changelog**: [`CHANGELOG.md`](CHANGELOG.md)
- **Issues**: https://gitlab.com/staticcanvas/hawk/-/issues

## Development & NPM Scripts

| Script                                      | Purpose                                                                                                                                                                                                                                                               |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                               | Vite dev server                                                                                                                                                                                                                                                       |
| `npm run build`                             | Builds core + optional (`theme-typeflow`, `animation-typeflow`) bundles                                                                                                                                                                                               |
| `npm run dev:typeflow`                      | Builds hawk and copies the bundle + a preview Pagefind index into the sibling typeflow checkout's docs site, for live prototyping                                                                                                                                     |
| `npm run pagefind:index`                    | Wraps `pagefind --site <dir>` — see `scripts/pagefind-index.mjs`                                                                                                                                                                                                      |
| `npm test` / `npm run test:coverage`        | Vitest (jsdom) — unit coverage                                                                                                                                                                                                                                        |
| `npm run test:e2e`                          | Playwright, real Chromium against a real built docs site + Pagefind index (not a fixture) — builds the docs site with a `localhost` `baseURL` override first. Runs in CI as `test:e2e` (`allow_failure: true` until it's proven stable there — see `.gitlab-ci.yml`). |
| `npm run lint` / `npm run lint:fix`         | ESLint                                                                                                                                                                                                                                                                |
| `npm run docs:build` / `npm run docs:serve` | Builds and serves hawk's own Hugo docs site                                                                                                                                                                                                                           |
| `npm run themes:css`                        | Generates one small standalone CSS file per gallery/template theme into `docs/static/assets/themes/` — see `scripts/generate-theme-css.mjs`                                                                                                                           |
| `npm run docs:scss`                         | Compiles `docs/static/assets/scss/*.scss` into `docs/static/assets/docs.css`/`playground.css` — see `scripts/compile-docs-scss.mjs`. Also runs automatically as part of `docs:build`/`docs:serve`                                                                     |
| `npm run check:size`                        | Enforces the gzip bundle size budget                                                                                                                                                                                                                                  |
| `npm run validate:release`                  | CI release-artifact validation                                                                                                                                                                                                                                        |

## License

MIT
