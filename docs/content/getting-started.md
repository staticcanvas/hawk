---
title: Getting started
description: Install hawk, index a built site with Pagefind, and mount the search modal.
eyebrow: Guide
category: Guides
---

## Install

```bash
npm install @staticcanvas/hawk
npm install --save-dev pagefind
```

`pagefind` and `@staticcanvas/typeflow` are optional peer dependencies. `pagefind` is required at
runtime — hawk has nothing to search without an index. `@staticcanvas/typeflow` is only needed if
you use the typeflow animation driver instead of the built-in instant one.

## Build an index

Mark your page's main content region with `data-pagefind-body`, and mark chrome you don't want
indexed (nav, header, footer) with `data-pagefind-ignore` — see
[Pagefind setup]({{< relref "/guides/pagefind-setup" >}}) for why this matters. Then, against
your already-built site:

```bash
npx pagefind --site dist
```

That writes a `pagefind/` folder into `dist/` containing the index and a small runtime.

## Mount hawk

```js
import { HawkSearch } from '@staticcanvas/hawk';
import '@staticcanvas/hawk/theme-typeflow/css';
import { HawkThemeTypeflow } from '@staticcanvas/hawk/theme-typeflow';

HawkSearch.registerTheme('typeflow', HawkThemeTypeflow);

const search = new HawkSearch({
  index: '/pagefind/',
  triggerSelector: '[data-search-trigger]',
  theme: 'typeflow',
});
```

Any element matching `triggerSelector` opens the modal — hawk builds its own DOM, so no other
markup is required. Ctrl/Cmd+K and `/` open it by default (configurable via `hotkeys`).

## Browser / CDN

Hawk ships UMD builds too, for script-tag usage without a bundler:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@staticcanvas/hawk@latest/dist/hawk.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@staticcanvas/hawk@latest/dist/hawk-theme-typeflow.css">
<script src="https://cdn.jsdelivr.net/npm/@staticcanvas/hawk@latest/dist/hawk.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@staticcanvas/hawk@latest/dist/hawk-theme-typeflow.js"></script>
<script>
  Hawk.registerTheme('typeflow', window.HawkThemeTypeflow);
  new Hawk({ index: '/pagefind/', theme: 'typeflow' });
</script>
```

## Next

- [Theming]({{< relref "/guides/theming" >}})
- [Animation plugins]({{< relref "/guides/animation-plugins" >}})
