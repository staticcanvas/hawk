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

Hawk is a JS-embeddable search widget: `npm install` + a constructor call (or a `<script>` tag +
a constructor call), no host markup beyond a trigger element required. It owns the DOM, keyboard
navigation, and result rendering; [Pagefind](https://pagefind.app/) owns indexing, ranking, and
typo-tolerant matching — hawk is Pagefind's own front end, exposing Pagefind's filtering and
search-tuning options directly rather than hiding them behind a narrower API. Visual theme and
reveal animation are swappable plugins rather than hardcoded choices. A TypeFlow-typewriter
animation driver ships alongside a zero-dependency instant driver, so TypeFlow is never a hard
dependency of the core bundle. (Hawk started as an extraction of typeflow's own docs site search
— typeflow is one theme/animation pairing it ships with today, not what it's limited to.)

See `architecture/README.md` for the design rationale, and `architecture/plugin-system.md` /
`architecture/theme-contract.md` / `architecture/animation-driver-contract.md` for the plugin
interfaces.

<details>
<summary><strong>📚Table of Contents</strong></summary>

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Frontmatter, metadata, and filters](#frontmatter-metadata-and-filters)
- [Theming](#theming)
- [Animation Drivers](#animation-drivers)
- [API Reference](#api-reference)
- [Development & NPM Scripts](#development-npm-scripts)
- [License](#license)

</details>

## Features

- **Pagefind-backed** search — chunked, lazily-loaded index; scales past a hand-rolled
  substring-scored in-browser index.
- **Dev-controlled tabs**: auto-derived category filter pills by default (from Pagefind's
  `filters()`), or an explicit `tabs` config where each tab's `filter` is a raw Pagefind filters
  object (multi-dimension AND, multi-value OR — full Pagefind filtering power, no translation
  layer) with its own optional `pagefindOptions` override. A top-level `pagefindOptions` escape
  hatch merges into every search call for `sort`/`ranking`/`language` tuning hawk doesn't
  otherwise wrap.
- _Fit_ / _medium_ / _compact_ density modes (`params.density`), switchable via config or an in-modal
  toggle whose choice persists to `localStorage`.
- Two-pane keyboard navigation: Tab moves between the search input, filter tabs, results pane,
  and preview pane; arrow keys change selection in the results pane and scroll the preview pane,
  depending on which has focus (plus the underlying arrow-key wraparound selection, Enter to
  navigate, Escape to close, Ctrl/Cmd+K and `/` to open).
- **Configurable initial state**: `defaultTab`, `defaultPreviewUrl` (shows a specific page's content
  on mount, before any selection), and `eagerResults` (an empty-query listing on open instead of
  an empty "Type to search" state, on by default).
- **Configurable layout**: `scale`, `position`, `offset`, `alignment`, `columns`, and a JS-driven
  `breakpoint` (not a fixed CSS media query) that collapses to a single column and hides the
  preview pane below the configured width.
- Theme plugin system: every color in `hawk.css` is a `--hawk-*` custom property with a neutral
  fallback — a theme only needs to redefine tokens (font, match-highlight, and scrollbar tokens
  included). Ships with `hawk-theme-typeflow`, the visual identity ported from typeflow's docs
  search. `theme.tokens` offers a JS-only alternative to a CSS file for a few color/font tweaks;
  `disableDefaultMarkdownStyles` opts out of the built-in preview-content prose rules entirely.
  The modal dialog opts into a Chromium-only rounded-corner style (`corner-shape: squircle`,
  themeable via `--hawk-corner-shape`) behind an `@supports` check, so it costs nothing and does
  nothing on engines that don't implement the property yet.
- Animation driver plugin system: `typeTitle` / `typeContent` / `rotatePlaceholder` / `stop`.
  Ships with `hawk-animation-instant` (default, zero dependencies) and `hawk-animation-typeflow`
  (wraps `TypeFlow.type()`/`TypeFlow.rotate()`). Every surface (title, anchor title, content, and
  rotating placeholder) defaults to `zoom-in-space`, left direction, 2ms speed, and no cursor.
  The `scramble` and `char` `typeStyle` values are the most computationally
  expensive (a full re-render per keystroke or per-character DOM update) and have a practical
  minimum speed below which frames start dropping, so none of Hawk's own defaults use them — both
  remain fully available via an explicit `typeStyle` override for anyone who wants that effect.
- Structured inline filter syntax (`inlineFilters: true`): typing `category:Guides responsive`
  parses out a Pagefind filter and searches only the remaining text.
- Result/page metadata: every match carries Pagefind's full `meta` object, with configurable
  date/tag rows beneath excerpts (`resultAccentColors`/`tagAccentColors` pastel-color rows/tags
  independently); anchor results are visually indented beneath their parent page by default
  (`showSubpageConnector: false` renders every row flat); `state.pageCount` tracks distinct pages
  separately from the flattened row count. A `related` frontmatter/metadata key is supported for
  editorially curated "related pages," resolved to page titles — see
  [Frontmatter, metadata, and filters](#frontmatter-metadata-and-filters).
  `resultDateFormat: 'relative'` renders the date as relative time ("7 days ago", "1 month ago")
  via the host's own `Intl.RelativeTimeFormat` — no date library needed; the `<time datetime>`
  attribute always keeps the raw value.
- Configurable modal scrim: `config.backdrop` (`color`/`gradient`/`opacity`/`blur`) customizes the
  backdrop independently of the theme's own `--hawk-backdrop` token; `gradient` replaces `color`
  when set.
- Optional discovery row: three independently configurable groups expose marked query terms,
  related pages, and Pagefind heading deep links beneath the main results without changing ranking.
- Configurable search-header controls: show or hide the Fit/Medium/Compact group and Escape
  button independently, or use `headerControls: false` for a minimal search-bar-only header.
- Pin system: a pin toggle on every result, persisted to `localStorage`, surfaced as a synthetic
  "Pinned" tab once at least one exists.
- A built-in trigger element (`config.trigger`, `kind: 'minimal' | 'compact' | 'default'`) for
  sites that don't want to hand-build trigger markup, plus a text-only "Search powered by
  Pagefind" attribution (`showPoweredBy`).
- Accessibility/reliability: a real modal focus trap (Tab/Shift+Tab never escape to the page
  behind the backdrop), a "search unavailable" state instead of an unhandled rejection if
  Pagefind fails to load or a search call rejects, and full i18n via `config.strings`.

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

## Usage

Build a Pagefind index against your built site (see `scripts/pagefind-index.mjs` — content region
must carry `data-pagefind-body`, chrome should carry `data-pagefind-ignore`):

```bash
node scripts/pagefind-index.mjs --site dist
```

Mount hawk against it:

```js
import { HawkSearch } from '@staticcanvas/hawk';
import '@staticcanvas/hawk/css';

const search = new HawkSearch({
  index: '/pagefind/',
  triggerSelector: '[data-search-trigger]',
  animation: 'instant', // built into core; no TypeFlow dependency
  revealAnimation: false,
  resultsReveal: false,
  theme: {
    name: 'site-minimal',
    apply() {},
    tokens: {
      '--hawk-bg-surface': '#111827',
      '--hawk-text-primary': '#f9fafb',
      '--hawk-accent': '#60a5fa',
    },
  },
});
```

That is the complete zero-TypeFlow path. The theme object is optional; core CSS has neutral token
fallbacks. `revealAnimation` and `resultsReveal` can be left enabled independently if only preview
content needs to render instantly.

For the packaged TypeFlow theme and animation experience:

```js
import { HawkSearch } from '@staticcanvas/hawk';
import '@staticcanvas/hawk/theme-typeflow/css';
import { HawkThemeTypeflow } from '@staticcanvas/hawk/theme-typeflow';
import { HawkAnimationTypeflow } from '@staticcanvas/hawk/animation-typeflow';

HawkSearch.registerTheme('typeflow', HawkThemeTypeflow);
HawkSearch.registerAnimation('typeflow', HawkAnimationTypeflow);

const search = new HawkSearch({
  index: '/pagefind/',
  excludePages: ['/'], // omit the home page and all of its section results
  triggerSelector: '[data-search-trigger]',
  theme: 'typeflow',
  params: { scale: 1, position: 'top-center', columns: 2, breakpoint: 768, density: 'medium' },
  tabs: [
    { label: 'Guides', filter: { category: 'Guides' } },
    { id: 'ref', label: 'Reference', filter: { category: ['Reference', 'API'] } },
  ],
  defaultTab: 'guides',
  defaultPreviewUrl: '/getting-started/',
  inlineFilters: true,
  showResultDate: true,
  showResultTags: true,
  headerControls: { density: true, escape: true },
  rotatingPlaceholders: ['Try "tabs"...', 'Try "theming"...'],
  enablePins: true,
});
```

Any element matching `triggerSelector` opens the modal — hawk builds its own DOM, no other markup
required (or skip building a trigger at all with `trigger: { container: '#search-slot' }`). Call
`search.setParams({...})` to change layout at runtime, `search.state` to read
`{ open, query, selectedIndex, matches, pageCount, pins, activeTab, error }`, and
`search.destroy()` to tear it down. See [docs/content/api.md](docs/content/api.md) for the full
config reference, and the guides for [tabs and inline filter
syntax](docs/content/guides/pagefind-setup.md),
[density, keyboard navigation, and scrollbars](docs/content/guides/density-and-navigation.md),
[theming](docs/content/guides/theming.md),
[animation plugins and the rotating placeholder](docs/content/guides/animation-plugins.md), and
[pins, the built-in trigger, and attribution](docs/content/guides/pins-and-embedding.md).

## Frontmatter, metadata, and filters

Pagefind indexes generated HTML, so framework frontmatter must be emitted by the site's layout.
`data-pagefind-meta` returns values on `HawkMatch.meta`; `data-pagefind-filter` makes values
filterable; and `data-pagefind-sort` makes values sortable. Pair `data-pagefind-meta`/
`data-pagefind-filter` with `data-pagefind-ignore` on the *same* element — extraction still
happens, but the element's own text is excluded from the page's indexed body content, so a
value doesn't also resurface verbatim inside that page's own result excerpt (a wrapping ancestor
would skip extraction too; it has to be the same element):

```html
<article data-pagefind-body>
  <span hidden data-pagefind-ignore data-pagefind-meta="author">Ada Lovelace</span>
  <span hidden data-pagefind-ignore data-pagefind-meta="date" data-pagefind-sort="date">2026-09-09</span>
  <span hidden data-pagefind-ignore data-pagefind-filter="category">Guides</span>
  <span hidden data-pagefind-ignore data-pagefind-meta="category">Guides</span>
  <span hidden data-pagefind-ignore data-pagefind-filter="tag">Pagefind</span>
  <span hidden data-pagefind-ignore data-pagefind-meta="tags">Pagefind, Search</span>
  <!-- related: names other pages, resolved to their titles by the layout — see the frontmatter
       mapping guide linked below for how this site's own Hugo partial does it. -->
  <span hidden data-pagefind-ignore data-pagefind-meta="related">Getting started, Theming</span>
  <!-- rendered page content -->
</article>
```

Dates and comma-separated tags render beneath result descriptions by default when the metadata
exists. They can be renamed or independently hidden without removing the metadata from search
results:

```js
new HawkSearch({
  index: '/pagefind/',
  resultDateMetaKey: 'published',
  resultTagsMetaKey: 'topics',
  showResultDate: false,
  showResultTags: true,
  headerControls: false, // minimal header: search input only
});
```

See the [frontmatter mapping guide](docs/content/guides/pagefind-setup.md#mapping-frontmatter-into-pagefind)
and Pagefind's [metadata](https://pagefind.app/docs/metadata/),
[filtering](https://pagefind.app/docs/filtering/), and
[sorting](https://pagefind.app/docs/sorts/) documentation.

## Theming

See `architecture/theme-contract.md` for the full token list and the contract a theme
implements. Load a theme's CSS separately from its JS (`@staticcanvas/hawk/theme-typeflow/css`),
matching this org's existing `"./css"` subpath-export convention.

## Animation Drivers

See `architecture/animation-driver-contract.md`. Pass `animation: false` to force the instant
driver even when a typeflow driver is registered; omit `animation` entirely to prefer typeflow
when registered, falling back to instant otherwise.

## API Reference

Full type declarations in `src/hawk.d.ts` (core), `src/hawk-theme-typeflow.d.ts`, and
`src/hawk-animation-typeflow.d.ts`. Published docs: https://staticcanvas.gitlab.io/hawk/api

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
| `npm run themes:css`                        | Generates one small standalone CSS file per gallery/template theme into `docs/static/assets/themes/` — see `scripts/generate-theme-css.mjs`                                                                                                                          |
| `npm run docs:scss`                         | Compiles `docs/static/assets/scss/*.scss` into `docs/static/assets/docs.css`/`playground.css` — see `scripts/compile-docs-scss.mjs`. Also runs automatically as part of `docs:build`/`docs:serve`                                                                    |
| `npm run check:size`                        | Enforces the gzip bundle size budget                                                                                                                                                                                                                                  |
| `npm run validate:release`                  | CI release-artifact validation                                                                                                                                                                                                                                        |

## License

MIT
