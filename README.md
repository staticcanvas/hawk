# Hawk

Themeable, pluggable command-palette search widget for static sites.

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

## Features

- Pagefind-backed search — chunked, lazily-loaded index; scales past a hand-rolled
  substring-scored in-browser index.
- Dev-controlled tabs: auto-derived category filter pills by default (from Pagefind's
  `filters()`), or an explicit `tabs` config where each tab's `filter` is a raw Pagefind filters
  object (multi-dimension AND, multi-value OR — full Pagefind filtering power, no translation
  layer) with its own optional `pagefindOptions` override. A top-level `pagefindOptions` escape
  hatch merges into every search call for `sort`/`ranking`/`language` tuning hawk doesn't
  otherwise wrap.
- Fit / medium / compact density modes (`params.density`), switchable via config or an in-modal
  toggle whose choice persists to `localStorage`.
- Two-pane keyboard navigation: Tab moves between the search input, filter tabs, results pane,
  and preview pane; arrow keys change selection in the results pane and scroll the preview pane,
  depending on which has focus (plus the underlying arrow-key wraparound selection, Enter to
  navigate, Escape to close, Ctrl/Cmd+K and `/` to open).
- Configurable initial state: `defaultTab`, `defaultPreviewUrl` (shows a specific page's content
  on mount, before any selection), and `eagerResults` (an empty-query listing on open instead of
  an empty "Type to search" state, on by default).
- Configurable layout: `scale`, `position`, `offset`, `alignment`, `columns`, and a JS-driven
  `breakpoint` (not a fixed CSS media query) that collapses to a single column and hides the
  preview pane below the configured width.
- Theme plugin system: every color in `hawk.css` is a `--hawk-*` custom property with a neutral
  fallback — a theme only needs to redefine tokens. Ships with `hawk-theme-typeflow`, the visual
  identity ported from typeflow's docs search.
- Animation driver plugin system: `typeTitle` / `typeContent` / `rotatePlaceholder` / `stop`.
  Ships with `hawk-animation-instant` (default, zero dependencies) and `hawk-animation-typeflow`
  (wraps `TypeFlow.type()`/`TypeFlow.rotate()`, including anchor-title scramble-decode).

## Installation

```bash
npm install @staticcanvas/hawk
npm install --save-dev pagefind
```

`pagefind` is a real dependency (hawk has nothing to search without an index).
`@staticcanvas/typeflow` is an optional peer dependency — only needed for the typeflow
theme/animation driver instead of the built-in unstyled/instant ones.

## Usage

Build a Pagefind index against your built site (see `scripts/pagefind-index.mjs` — content region
must carry `data-pagefind-body`, chrome should carry `data-pagefind-ignore`):

```bash
node scripts/pagefind-index.mjs --site dist
```

Mount hawk against it:

```js
import { HawkSearch } from '@staticcanvas/hawk';
import '@staticcanvas/hawk/theme-typeflow/css';
import { HawkThemeTypeflow } from '@staticcanvas/hawk/theme-typeflow';

HawkSearch.registerTheme('typeflow', HawkThemeTypeflow);

const search = new HawkSearch({
  index: '/pagefind/',
  triggerSelector: '[data-search-trigger]',
  theme: 'typeflow',
  params: { scale: 1, position: 'top-center', columns: 2, breakpoint: 768, density: 'medium' },
  tabs: [
    { label: 'Guides', filter: { category: 'Guides' } },
    { id: 'ref', label: 'Reference', filter: { category: ['Reference', 'API'] } },
  ],
  defaultTab: 'guides',
  defaultPreviewUrl: '/getting-started/',
});
```

Any element matching `triggerSelector` opens the modal — hawk builds its own DOM, no other markup
required. Call `search.setParams({...})` to change layout at runtime, `search.state` to read
`{ open, query, selectedIndex, matches, activeTab }`, and `search.destroy()` to tear it down. See
[docs/content/api.md](docs/content/api.md) for the full config reference and
[docs/content/guides/pagefind-setup.md](docs/content/guides/pagefind-setup.md) /
[docs/content/guides/density-and-navigation.md](docs/content/guides/density-and-navigation.md)
for tabs, density, and keyboard-navigation guides.

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

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Builds core + optional (`theme-typeflow`, `animation-typeflow`) bundles |
| `npm run dev:typeflow` | Builds hawk and copies the bundle + a preview Pagefind index into the sibling typeflow checkout's docs site, for live prototyping |
| `npm run pagefind:index` | Wraps `pagefind --site <dir>` — see `scripts/pagefind-index.mjs` |
| `npm test` / `npm run test:coverage` | Vitest (jsdom) — unit coverage |
| `npm run test:e2e` | Playwright, real Chromium against a real built docs site + Pagefind index (not a fixture) — builds the docs site with a `localhost` `baseURL` override first. Runs in CI as `test:e2e` (`allow_failure: true` until it's proven stable there — see `.gitlab-ci.yml`). |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run docs:build` / `npm run docs:serve` | Builds and serves hawk's own Hugo docs site |
| `npm run check:size` | Enforces the gzip bundle size budget |
| `npm run validate:release` | CI release-artifact validation |

## License

MIT
