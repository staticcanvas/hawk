<img src="https://bucket.s3.silvercottage.dev/logos/hawk/dist/webp/hawk-banner-1024x410.webp" width="512" height="205" alt="Hawk logo" />

# **@staticcanvas/hawk**

[![npm-version](https://img.shields.io/npm/v/@staticcanvas/hawk?style=flat-square&color=%237fffd4)](https://www.npmjs.com/package/@staticcanvas/hawk)
[![jsr-version](https://img.shields.io/jsr/v/%40staticcanvas/hawk?style=flat-square&logo=jsr&color=%237fffd4)](https://jsr.io/%40staticcanvas/hawk)
[![codecov](https://codecov.io/gh/staticcanvas/hawk/graph/badge.svg)](https://codecov.io/gh/staticcanvas/hawk)
[![license](https://img.shields.io/npm/l/@staticcanvas/hawk?style=flat-square&color=%237fffd4)](https://github.com/staticcanvas/hawk/blob/main/LICENSE)

> Themeable, pluggable command-palette search UI for static sites, powered by Pagefind.

Hawk provides a search dialog with keyboard navigation, page previews, configurable
size controls, theme tokens, and optional TypeFlow animation. Pagefind supplies the
index and ranking; Hawk renders the results and handles the dialog interaction.

---

> 🔹 Read the full documentation [here](https://staticcanvas.github.io/hawk/)

> 🔹 Use the playground [here](https://staticcanvas.github.io/hawk/playground/)

## Installation

```bash
npm install @staticcanvas/hawk
npm install --save-dev pagefind
```

`pagefind` is a package dependency and is required to build the search index.
`@staticcanvas/typeflow` is an optional peer dependency used only by the TypeFlow animation
driver.

## Quick start

```bash
npx pagefind --site <your-built-site-dir>
```

Mark your page's main content region with `data-pagefind-body` and any chrome (nav/header/footer)
you don't want indexed with `data-pagefind-ignore` before running the command above — see
`scripts/pagefind-index.mjs` for the full recipe.

Frontmatter is not read directly by Pagefind. Emit it from the site layout as metadata, filters,
or sort values:

```html
<span hidden data-pagefind-meta="date" data-pagefind-sort="date">2026-09-09</span>
<span hidden data-pagefind-filter="tag">Pagefind</span>
<span hidden data-pagefind-meta="tags">Pagefind, Search</span>
```

```js
import { HawkSearch } from '@staticcanvas/hawk';
import '@staticcanvas/hawk/theme-typeflow/css';
import { HawkThemeTypeflow } from '@staticcanvas/hawk/theme-typeflow';

HawkSearch.registerTheme('typeflow', HawkThemeTypeflow);

new HawkSearch({
  index: '/pagefind/',
  triggerSelector: '[data-search-trigger]',
  theme: 'typeflow',
  preload: true,
  resultHydrationConcurrency: 6,
  maxCandidateResults: 54,
  showResultDate: true,
  showResultTags: true,
  headerControls: false,
});
```

Any element matching `triggerSelector` opens the modal. No other markup is required — hawk builds
its own DOM.

`preload: true` warms search during idle time after page load, without opening the
dialog. It honors Save-Data. The library keeps lazy loading as the default; call
`await search.preload()` when the host application needs to control the timing.
Concurrent preloads and opening share initialization, and a failed preload can be
retried when the visitor opens search.

To keep selected size controls visible instead of the input-only header above:

```js
new HawkSearch({
  index: '/pagefind/',
  headerControls: { density: { fit: false, medium: true, compact: true } },
});
```

Result fragments load through a bounded, ordered concurrency pool and render progressively. The
defaults allow 6 simultaneous Pagefind `data()` calls and inspect at most `maxResults * 3`
candidates, keeping Hawk's request and DOM work bounded as an index grows. Most sites should keep
these defaults; lower `resultHydrationConcurrency` for constrained origins, or raise
`maxCandidateResults` when a large `excludePages` list requires deeper backfilling.

## Documentation

Full docs, theming/animation-driver guides, and API reference:
https://staticcanvas.github.io/hawk

## License

MIT
