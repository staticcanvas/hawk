---
title: API reference
description: HawkSearch config, methods, public state, and the plugin registries.
eyebrow: Reference
category: Reference
---

## `new HawkSearch(config)`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `string` | — | Base path to a Pagefind bundle. Required unless `pagefind` is given. |
| `pagefind` | `object` | — | A pre-loaded Pagefind module, instead of dynamically importing one from `index`. |
| `id` | `string` | `hawk-search-N` | DOM id for the modal root. |
| `triggerSelector` | `string` | `'[data-search-trigger]'` | Elements that open the modal on click. |
| `container` | `HTMLElement` | `document.body` | Where the modal is mounted. |
| `params` | `object` | see below | Layout: `scale`, `position`, `offset`, `alignment`, `columns`, `breakpoint`. |
| `theme` | `string \| HawkTheme` | `'typeflow'` if registered | A registered theme name or a theme object. |
| `animation` | `string \| HawkAnimationDriver \| false` | `'typeflow'` if registered, else `'instant'` | A registered driver name, a driver object, or `false` to force instant. |
| `categories` | `string[]` | derived from Pagefind `filters()` | Overrides the category filter pills. |
| `categoryFilterName` | `string` | `'category'` | The Pagefind filter dimension used for category pills. |
| `maxResults` | `number` | `18` | Maximum rendered result rows. |
| `hotkeys` | `object` | `{ open: true, slash: true, escape: true }` | Enables/disables Ctrl/Cmd+K, `/`, and Escape. |
| `onOpen` | `(query) => void` | — | Called when the modal opens. |
| `onClose` | `() => void` | — | Called when the modal closes. |
| `onSelect` | `(item) => void` | — | Called when a result is clicked or Enter-selected. |

### `params` defaults

```js
{
  scale: 1,
  position: 'top-center', // 'top-center' | 'center' | 'top-left' | 'top-right'
  offset: { x: '1rem', y: '6vh' },
  alignment: 'stretch',   // 'stretch' | 'start' | 'center'
  columns: 2,             // 1 | 2 — forced to 1 below `breakpoint` regardless of this value
  breakpoint: 768,        // px
}
```

## Instance methods

- `search.open()` / `search.close()` — open/close the modal.
- `search.setParams(partialParams)` — merges and re-applies layout params at runtime.
- `search.destroy()` — removes the modal from the DOM and detaches listeners.
- `search.state` — `{ open, query, selectedIndex, matches }`, read-only, updates live.

## Static registries

- `HawkSearch.registerTheme(name, theme)` / `HawkSearch.themes` (`Map`)
- `HawkSearch.registerAnimation(name, driver)` / `HawkSearch.animations` (`Map`) — `'instant'` is
  registered by default.

## Plugin modules

- `@staticcanvas/hawk/theme-typeflow` — `HawkThemeTypeflow`
- `@staticcanvas/hawk/theme-typeflow/css` — the stylesheet
- `@staticcanvas/hawk/animation-typeflow` — `createHawkAnimationTypeflow(TypeFlow, options?)`

See [Theming]({{< relref "/guides/theming" >}}) and
[Animation Plugins]({{< relref "/guides/animation-plugins" >}}) for the full contracts.
