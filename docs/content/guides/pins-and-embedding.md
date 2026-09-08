---
title: Pins, the built-in trigger, and attribution
description: Letting visitors pin results, embedding hawk without hand-built trigger markup, and the powered-by-Pagefind attribution.
eyebrow: Guide
category: Guides
---

## Pins

A pin toggle renders on every result row by default (`enablePins: true`) — clicking it doesn't
navigate or trigger `onSelect`, just pins the result:

```js
new HawkSearch({
  index: '/pagefind/',
  enablePins: true,   // default
  pinStorageKey: 'hawk:pins',
  maxPins: 20,
});
```

Pins persist to `localStorage` as `{url, title, isAnchor}[]`. The moment at least one exists, a
synthetic "Pinned" tab is prepended to the tab list — selecting it lists pins directly with no
Pagefind call (they already carry their own title/url), and clears any typed query, since it
isn't a search scope. Unpinning the last item while that tab is active falls back to the "All"
tab and resumes a real search in place, rather than leaving the view stuck on a tab that just
disappeared.

For a custom pinned-items UI instead of (or alongside) the built-in tab, read `search.state.pins`
directly — it updates live as pins are added/removed.

Falls back silently (no error) if `localStorage` is unavailable (private browsing, quota) — pins
still work for the current session, they just don't survive a reload.

## Built-in trigger

Hawk doesn't render a trigger button by default — `triggerSelector` (default
`'[data-search-trigger]'`) just listens for clicks on whatever markup you build. `config.trigger`
is the alternative: hawk renders its own button for you.

```js
new HawkSearch({
  index: '/pagefind/',
  trigger: {
    kind: 'default',           // 'minimal' | 'compact' | 'default'
    container: '#search-slot', // required — a selector or an element
  },
});
```

- `'minimal'` — icon only, `aria-label` set for accessibility.
- `'compact'` — icon + "Search".
- `'default'` — icon + "Search..." + a Ctrl/Cmd+K hint (omitted automatically when
  `hotkeys.open` is disabled, since the hint would be misleading otherwise).

The rendered button is always marked `[data-search-trigger]`, so it's picked up by the same
click-wiring `triggerSelector` already uses — no separate event listener code runs for it. It
renders outside the modal's own root element, so a theme's `apply()`/`tokens` are applied to it
too (see [Theming — a JS-only theming path]({{< relref "/guides/theming" >}}#a-js-only-theming-path-themetokens))
— otherwise it wouldn't inherit a CSS-file theme's `#root`-scoped custom properties at all.

`search.destroy()` removes the built-in trigger along with the modal.

## Powered-by-Pagefind attribution

```js
new HawkSearch({
  index: '/pagefind/',
  showPoweredBy: true,                    // default
  poweredByHref: 'https://pagefind.app/', // default
});
```

A small text link ("Search powered by Pagefind") in the modal footer, styled via
`--hawk-powered-by-color`/`-opacity`. Text-only — no logo asset is vendored. Set
`showPoweredBy: false` to remove it entirely.
