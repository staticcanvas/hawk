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
| `params` | `object` | see below | Layout: `scale`, `position`, `offset`, `alignment`, `columns`, `breakpoint`, `density`, `allowDensityToggle`. |
| `theme` | `string \| HawkTheme` | `'typeflow'` if registered | A registered theme name or a theme object. |
| `animation` | `string \| HawkAnimationDriver \| false` | `'typeflow'` if registered, else `'instant'` | A registered driver name, a driver object, or `false` to force instant. |
| `tabs` | `HawkTab[]` | derived from Pagefind `filters()` | Explicit tab list — see [Tabs](#tabs) below. Replaces auto-derivation entirely; renders synchronously on mount. |
| `categories` | `string[]` | — | Shorthand for `tabs`: one tab per category name, each filtering on `categoryFilterName`. Ignored if `tabs` is given. |
| `includeAllTab` | `boolean` | `true` | Prepends a filterless "All" tab to `tabs`/`categories`/the auto-derived list. |
| `defaultTab` | `string` | `'all'` | Tab id active on open. Falls back to `'all'` (with a console warning) if it matches no resolved tab. |
| `pagefindOptions` | `object` | `{}` | Raw options merged into every `search()`/`debouncedSearch()` call (`sort`, `ranking`, `language`, ...). A tab's own `pagefindOptions` overrides this per-tab. |
| `categoryFilterName` | `string` | `'category'` | The Pagefind filter dimension used for the auto-derived tabs and the `categories` shorthand. |
| `maxResults` | `number` | `18` | Maximum rendered result rows. |
| `contentSelector` | `string` | `'[data-pagefind-body]'` | Selects the preview pane's content from a fetched result page. See [Rich preview content](#rich-preview-content). |
| `hotkeys` | `object` | `{ open: true, slash: true, escape: true }` | Enables/disables Ctrl/Cmd+K, `/`, and Escape. |
| `defaultPreviewUrl` | `string` | — | Shows this page's content in the preview pane on mount, before any result is selected. Replaced the instant real results exist. |
| `defaultPreviewTitle` | `string` | `''` | Title shown above `defaultPreviewUrl`'s content. |
| `eagerResults` | `boolean` | `true` | Runs an empty-query search as soon as Pagefind loads, populating the results pane instead of leaving it on "Type to search". |
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
  columns: 2,             // 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
  breakpoint: 768,        // px
  density: 'medium',      // 'fit' | 'medium' | 'compact'
  allowDensityToggle: true,
}
```

### Tabs

```ts
interface HawkTab {
  id?: string;              // slug of label if omitted
  label: string;
  filter?: Record<string, string | string[]>; // a raw Pagefind filters object, passed through verbatim
  pagefindOptions?: Record<string, unknown>;   // merged over the top-level pagefindOptions for this tab only
}
```

`filter` is literally what Pagefind's `search(term, { filters })` accepts — `{ category: 'Guides' }`,
`{ category: ['Guides', 'Reference'] }` (OR within one dimension), or
`{ category: 'Guides', version: '2.x' }` (AND across dimensions). See
[Pagefind setup]({{< relref "/guides/pagefind-setup" >}}) for the auto-derived (zero-config)
tabs path, and [Density and keyboard navigation]({{< relref "/guides/density-and-navigation" >}})
for `density`/`defaultPreviewUrl`/`eagerResults`.

## Rich preview content

The preview pane doesn't render Pagefind's short excerpt — it fetches the selected result's own
page (`item.url`, same-origin), narrows it to `contentSelector`, and injects that HTML directly.
That means full markdown structure (headings, lists, tables) and syntax-highlighted code blocks
render exactly as your site's own build already produced them — nothing gets re-rendered or
re-highlighted by hawk. For an anchor/section match, only that heading's subsection is extracted
(the heading itself, plus siblings up to the next heading of the same or higher level).

Falls back to Pagefind's excerpt automatically if `fetch`/`DOMParser` aren't available, the
request fails, or `contentSelector` matches nothing on the fetched page. Fetched pages are
cached per session (by URL, not per anchor) so re-selecting a section you've already viewed, or a
different section of the same page, doesn't re-fetch.

## Instance methods

- `search.open()` / `search.close()` — open/close the modal.
- `search.setParams(partialParams)` — merges and re-applies layout params at runtime.
- `search.destroy()` — removes the modal from the DOM and detaches listeners.
- `search.state` — `{ open, query, selectedIndex, matches, activeTab }`, read-only, updates live.

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
