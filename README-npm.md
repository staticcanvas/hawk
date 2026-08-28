# hawk

Themeable, pluggable command-palette search for static sites. [Pagefind](https://pagefind.app/)
does indexing and ranking; hawk owns the modal, keyboard navigation, and result rendering; themes
and reveal animations are swappable plugins.

## Installation

```bash
npm install @staticcanvas/hawk
npm install --save-dev pagefind
```

`pagefind` and `@staticcanvas/typeflow` are optional peer dependencies — `pagefind` is required
at runtime (hawk has nothing to search without an index), `@staticcanvas/typeflow` only if you
use the typeflow animation driver.

## Quick start

```bash
npx pagefind --site <your-built-site-dir>
```

Mark your page's main content region with `data-pagefind-body` and any chrome (nav/header/footer)
you don't want indexed with `data-pagefind-ignore` before running the command above — see
`scripts/pagefind-index.mjs` for the full recipe.

```js
import { HawkSearch } from '@staticcanvas/hawk';
import '@staticcanvas/hawk/theme-typeflow/css';
import { HawkThemeTypeflow } from '@staticcanvas/hawk/theme-typeflow';

HawkSearch.registerTheme('typeflow', HawkThemeTypeflow);

new HawkSearch({
  index: '/pagefind/',
  triggerSelector: '[data-search-trigger]',
  theme: 'typeflow',
});
```

Any element matching `triggerSelector` opens the modal. No other markup is required — hawk builds
its own DOM.

## Documentation

Full docs, theming/animation-driver guides, and API reference:
https://staticcanvas.gitlab.io/hawk

## License

MIT
