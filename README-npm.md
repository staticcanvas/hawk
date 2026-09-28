<img src="https://gitlab.com/staticcanvas/hawk/-/raw/main/branding/hawk-logo.svg" width="64" height="64" alt="Hawk logo" />

# **@staticcanvas/hawk**

[![npm-version](https://img.shields.io/npm/v/@staticcanvas/hawk?style=flat-square&color=%237fffd4)](https://www.npmjs.com/package/@staticcanvas/hawk)
[![jsr-version](https://img.shields.io/jsr/v/%40staticcanvas/hawk?style=flat-square&logo=jsr&color=%237fffd4)](https://jsr.io/%40staticcanvas/hawk)
[![codecov](https://codecov.io/gl/staticcanvas/hawk/branch/v0.43.3-release/graph/badge.svg?token=)](https://codecov.io/gl/staticcanvas/hawk)
[![license](https://img.shields.io/npm/l/@staticcanvas/hawk?style=flat-square&color=%237fffd4)](https://gitlab.com/staticcanvas/hawk)

> Themeable, pluggable command-palette search UI for static sites, powered by Pagefind.

---

> 🔹 Read the full documentation [here](https://staticcanvas.gitlab.io/hawk/)

> 🔹 Use the playground [here](https://staticcanvas.gitlab.io/hawk/playground/)

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
  showResultDate: true,
  showResultTags: true,
  headerControls: false,
});
```

Any element matching `triggerSelector` opens the modal. No other markup is required — hawk builds
its own DOM.

## Documentation

Full docs, theming/animation-driver guides, and API reference:
https://staticcanvas.gitlab.io/hawk

## License

MIT
