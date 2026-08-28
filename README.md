# Hawk

Themeable, pluggable command-palette search for static sites.

## Overview

Hawk is a search modal extracted from typeflow's docs site search. It owns the DOM, keyboard
navigation, and result rendering; [Pagefind](https://pagefind.app/) owns indexing, ranking, and
typo-tolerant matching; visual theme and reveal animation are swappable plugins rather than
hardcoded choices. A TypeFlow-typewriter animation driver ships alongside a zero-dependency
instant driver, so TypeFlow is never a hard dependency of the core bundle.

See `architecture/README.md` for the design rationale, and `architecture/plugin-system.md` /
`architecture/theme-contract.md` / `architecture/animation-driver-contract.md` for the plugin
interfaces.

## Features

- Pagefind-backed search — chunked, lazily-loaded index; scales past a hand-rolled
  substring-scored in-browser index.
- Dynamic category filter pills, derived from Pagefind's `filters()` API by default.
- Keyboard navigation (arrow keys, wraparound selection, Enter to navigate, Escape to close,
  Ctrl/Cmd+K and `/` to open).
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

`pagefind` and `@staticcanvas/typeflow` are optional peer dependencies.

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
  params: { scale: 1, position: 'top-center', columns: 2, breakpoint: 768 },
});
```

Any element matching `triggerSelector` opens the modal — hawk builds its own DOM, no other markup
required. Call `search.setParams({...})` to change layout at runtime, `search.state` to read
`{ open, query, selectedIndex, matches }`, and `search.destroy()` to tear it down.

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
| `npm test` / `npm run test:coverage` | Vitest |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run docs:build` / `npm run docs:serve` | Builds and serves hawk's own Hugo docs site |
| `npm run check:size` | Enforces the gzip bundle size budget |
| `npm run validate:release` | CI release-artifact validation |

## License

MIT
