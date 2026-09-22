![Hawk Banner](https://r2os.staticcanvas.me/logos/hawk/hawk-banner.svg)

Themeable, pluggable command-palette search for static sites. [Pagefind](https://pagefind.app/)
does indexing and ranking; hawk owns the modal, keyboard navigation, and result rendering; themes
and reveal animations are swappable plugins.

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
