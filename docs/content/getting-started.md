---
title: Getting started
description: Install hawk, index a built site with Pagefind, and mount the search modal.
eyebrow: Guide
category: Guides
tags:
  - installation
  - npm
  - esm
  - umd
  - quick start
  - pagefind index
related:
  - /guides/pagefind-setup
  - /api
  - /guides/theming
---

## Install

```bash
npm install @staticcanvas/hawk
npm install --save-dev pagefind
# Optional: the official TypeFlow animation driver
npm install @staticcanvas/typeflow
```

`pagefind` is a real dependency — hawk has nothing to search without an index, so it's installed
automatically. `@staticcanvas/typeflow` is an optional peer dependency, only needed when you
import Hawk's official TypeFlow animation adapter.

## Build an index

Mark your page's main content region with `data-pagefind-body`, and mark chrome you don't want
indexed (nav, header, footer) with `data-pagefind-ignore` — see
[Pagefind setup]({{< relref "/guides/pagefind-setup" >}}) for why this matters. Then, against
your already-built site:

```bash
npx pagefind --site dist
```

That writes a `pagefind/` folder into `dist/` containing the index and a small runtime.

## Mount Hawk without TypeFlow

Hawk's structural stylesheet and instant content driver are part of core. This is a complete,
configurable mount with no TypeFlow package, adapter, or theme import:

```js
import { HawkSearch } from '@staticcanvas/hawk';
import '@staticcanvas/hawk/css';

const search = new HawkSearch({
  index: '/pagefind/',
  triggerSelector: '[data-search-trigger]',
  animation: 'instant',
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

`animation: 'instant'` uses Hawk's built-in zero-dependency driver. The two reveal options above
also remove modal and result-row motion; omit either one if you want those CSS reveals while
keeping preview content instant. The theme object is optional—without it, `hawk.css` uses its
neutral fallback tokens.

## Add TypeFlow (optional)

Register the TypeFlow visual theme and animation driver when you want the packaged animated
experience:

```js
import { HawkSearch } from '@staticcanvas/hawk';
import '@staticcanvas/hawk/theme-typeflow/css';
import { HawkThemeTypeflow } from '@staticcanvas/hawk/theme-typeflow';
import { HawkAnimationTypeflow } from '@staticcanvas/hawk/animation-typeflow';

HawkSearch.registerTheme('typeflow', HawkThemeTypeflow);
HawkSearch.registerAnimation('typeflow', HawkAnimationTypeflow);

const search = new HawkSearch({
  index: '/pagefind/',
  triggerSelector: '[data-search-trigger]',
  theme: 'typeflow',
  animation: 'typeflow',
});
```

Any element matching `triggerSelector` opens the modal — hawk builds its own DOM, so no other
markup is required. Ctrl/Cmd+K and `/` open it by default (configurable via `hotkeys`).

## Browser / CDN

Hawk ships UMD builds too, for script-tag usage without a bundler:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@staticcanvas/hawk@latest/dist/hawk.css"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@staticcanvas/hawk@latest/dist/hawk-theme-typeflow.css"
/>
<script src="https://cdn.jsdelivr.net/npm/@staticcanvas/hawk@latest/dist/hawk.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@staticcanvas/hawk@latest/dist/hawk-theme-typeflow.js"></script>
<script>
  new Hawk({ index: '/pagefind/' }); // hawk-theme-typeflow.js already self-registered as 'typeflow'
</script>
```

Loaded in this order, `hawk-theme-typeflow.js` registers itself against `window.Hawk` automatically
— no `Hawk.registerTheme(...)` call needed. Add `typeflow.js` and `hawk-animation-typeflow.js` (in
that order, both before the final `<script>`) for the typewriter animation driver too, which
self-registers the same way once it sees both `window.Hawk` and `window.TypeFlow`.

## Next

- [Pagefind setup]({{< relref "/guides/pagefind-setup" >}}) — index scoping, dev-controlled tabs, and inline filter syntax
- [Density and keyboard navigation]({{< relref "/guides/density-and-navigation" >}})
- [Theming]({{< relref "/guides/theming" >}})
- [Animation plugins]({{< relref "/guides/animation-plugins" >}})
- [Pins, the built-in trigger, and attribution]({{< relref "/guides/pins-and-embedding" >}})
