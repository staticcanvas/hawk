---
title: Pagefind Setup
description: The data-pagefind-body / data-pagefind-ignore scoping that makes match quality good.
eyebrow: Guide
category: Guides
---

## Scope the index before you run it

Pagefind indexes whatever it finds in `<body>` by default. Without scoping, every result gets
polluted with your repeated nav/header/footer text, and broad queries surface pages that only
matched on chrome, not content. This one step is the difference between a good and a bad hawk
setup:

```html
<body>
  <header data-pagefind-ignore>...</header>

  <main data-pagefind-body>
    <!-- your actual page content -->
  </main>

  <footer data-pagefind-ignore>...</footer>
</body>
```

Once at least one element on the site carries `data-pagefind-body`, Pagefind switches to
"ignore everything outside marked regions" mode automatically.

## Build the index

```bash
node scripts/pagefind-index.mjs --site dist
# equivalent to: npx pagefind --site dist
```

This writes a `pagefind/` folder into `dist/` — the index plus a small WASM-backed runtime hawk
loads lazily (only once you actually open the search modal, and only the WASM/JS runtime once
per session; per-query it fetches just the relevant index chunks and page fragments, not your
entire site as one blob).

## Category filters (tabs)

Hawk's filter pills — rendered as a proper ARIA tablist, Left/Right/Home/End to move between
them — are derived automatically from Pagefind's `filters()` API by default. No hardcoded
category list to maintain, and no hawk-side config for a new tab to show up: flag a page by
marking a filter dimension anywhere inside its `data-pagefind-body` region:

```html
<article data-pagefind-filter="category:Guides">...</article>
```

A page isn't limited to one tab — add more than one marker to flag it for several:

```html
<article>
  <span hidden data-pagefind-filter="category:Guides"></span>
  <span hidden data-pagefind-filter="category:Reference"></span>
  ...
</article>
```

(This is exactly what hawk's own `docs/layouts/_default/single.html` and `list.html` do,
generated from frontmatter — `category: Guides` for one tab, or
`categories: [Guides, Reference]` for several.)

Hawk reads the `category` filter dimension by default (`categoryFilterName` in the config to use
a different one), and falls back to a single "All" pill with no filtering if nothing is marked.

### Taking manual control with `tabs`

Auto-derivation covers the common case — one `category` frontmatter field, one filter dimension.
For anything more (multiple filter dimensions per tab, a fixed tab order independent of what's
in the index yet, per-tab search tuning), pass `tabs` explicitly:

```js
new HawkSearch({
  index: '/pagefind/',
  tabs: [
    { label: 'Guides', filter: { category: 'Guides' } },
    { id: 'ref', label: 'Reference', filter: { category: ['Reference', 'API'] } },
    { label: 'v2 only', filter: { category: 'Guides', version: '2.x' } },
  ],
  defaultTab: 'ref',
});
```

`filter` is a raw Pagefind `filters` object, passed straight into `search()`/`debouncedSearch()`
— an array of values within one dimension is an OR (`category: ['Reference', 'API']` matches
either), multiple dimensions are ANDed together. When `tabs` is given, `filters()` is never
called and the pills render synchronously on mount instead of waiting for Pagefind to load. See
[API reference — Tabs]({{< relref "/api" >}}#tabs) for the full shape, including per-tab
`pagefindOptions`.

## Inline filter syntax

Tabs are one way to scope by filter — `inlineFilters: true` lets a visitor do it themselves,
typing the same `dimension:value` shape directly into the search box:

```js
new HawkSearch({ index: '/pagefind/', inlineFilters: true });
```

```
category:Guides responsive nav
```

parses out `{ category: 'Guides' }` as a filter and searches only `responsive nav` — the same
filter dimensions `data-pagefind-filter` already marks pages with, `tags`/`category`/anything
else, no separate configuration to keep in sync. A quoted value (`tag:"multi word"`) keeps its
spaces; repeating a dimension collects an array, same OR semantics as `tabs[].filter`. It merges
with whichever tab is active rather than replacing it — inline wins on a dimension collision.

Off by default, because it changes how a literal colon in a normal query behaves — `"ratio: 16:9"`
would get `ratio:` parsed as a filter attempt. Turn it on for a docs set where visitors are likely
to know (or discover) the filter dimensions in play; leave it off otherwise.
