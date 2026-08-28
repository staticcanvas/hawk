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

## Category filters

Hawk's filter pills are derived automatically from Pagefind's `filters()` API by default — no
hardcoded category list to maintain. Mark a filter dimension in your HTML:

```html
<article data-pagefind-filter="category:Guides">...</article>
```

Hawk reads the `category` filter dimension by default (`categoryFilterName` in the config to use
a different one), and falls back to a single "All" pill with no filtering if nothing is marked.
