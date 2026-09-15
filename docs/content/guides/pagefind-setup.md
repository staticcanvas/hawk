---
title: Pagefind Setup
description: The data-pagefind-body / data-pagefind-ignore scoping that makes match quality good.
eyebrow: Guide
category: Guides
tags:
  - Pagefind
  - metadata
  - frontmatter
  - category
  - tags
  - related pages
related:
  - /getting-started
  - /api
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

## Browser configuration and additional indexes

Use `pagefindInitOptions` for settings Pagefind must receive before initialization. Hawk passes
these to `pagefind.options()` and then initializes the runtime before deriving filter tabs:

```js
new HawkSearch({
  index: '/pagefind/',
  pagefindInitOptions: {
    excerptLength: 24,
    exactDiacritics: false,
    noWorker: false,
    ranking: {
      termFrequency: 1,
      termSimilarity: 1,
      pageLength: 0.75,
      termSaturation: 1.4,
      diacriticSimilarity: 0.8,
      metaWeights: { title: 5 },
    },
  },
  pagefindOptions: {
    filters: { category: 'Guides' },
    sort: { date: 'desc' },
  },
});
```

`pagefindOptions` remains the per-search layer and can be overridden by individual tabs. To
search another Pagefind bundle, configure it before tab derivation:

```js
new HawkSearch({
  index: '/pagefind/',
  pagefindMergeIndexes: [
    {
      bundlePath: 'https://docs.example.com/pagefind',
      options: { indexWeight: 0.65, mergeFilter: { source: 'External docs' } },
    },
  ],
});
```

Cross-origin index hosts must return CORS headers. Pagefind automatically chooses the index that
matches the document's `lang` attribute; a merged index can specify its own `language` option.

If a page belongs in the index but should not appear in a particular Hawk instance, exclude it
at runtime instead of changing the shared Pagefind build:

```js
new HawkSearch({ index: '/pagefind/', excludePages: ['/', '/internal/'] });
```

Use `data-pagefind-ignore` when content should never be indexed; use `excludePages` when the same
index feeds multiple search experiences or a page should remain available for other consumers.

## Mapping frontmatter into Pagefind

Pagefind reads the generated HTML, not the source frontmatter. A layout must print each
frontmatter value into a Pagefind attribute inside the page's `data-pagefind-body` region.

| Attribute                    | Purpose                                                | Available through Hawk                                                     |
| ---------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| `data-pagefind-meta="key"`   | Returns the element text as `result.data().meta[key]`. | Every `HawkMatch.meta`; dates and tags can render beneath result excerpts. |
| `data-pagefind-filter="key"` | Adds the element text as a filter value.               | Auto-derived tabs, explicit tab filters, and inline filters.               |
| `data-pagefind-sort="key"`   | Adds the element text as a sortable value.             | `pagefindOptions.sort` and `HawkTab.sort`.                                 |

Keep the emitted names (`category`, `author`, `date`, `tag`, `tags`, and `related`) consistent
across generators so one Hawk configuration can search every index. The examples below belong in
the layout that wraps an individual content page.

`related` is the odd one out — every other key mirrors a frontmatter value onto the page's own
element, but `related` names *other* pages (e.g. a `related: [guides/theming, api]` frontmatter
list), so the layout resolving it needs to look each one up and emit *their* titles, not the raw
paths — `result.data().meta.related` then reads as page names a caller can show directly, without
a second lookup. This site's own `docs/layouts/partials/pagefind-frontmatter.html` does this via
Hugo's `site.GetPage`, silently dropping any path that doesn't resolve (a typo, a moved/renamed
page) instead of emitting a broken entry.

### Hugo

Hugo exposes page frontmatter through `.Params` and the resolved modification date through
`.Lastmod`:

```go-html-template
<article data-pagefind-body>
  <span hidden data-pagefind-meta="author">{{ .Params.author }}</span>
  <span hidden data-pagefind-meta="date" data-pagefind-sort="date">
    {{ .Lastmod.Format "2006-01-02" }}
  </span>

  {{ range .Params.tags }}
  <span hidden data-pagefind-filter="tag">{{ . }}</span>
  {{ end }}
  <span hidden data-pagefind-meta="tags">{{ delimit .Params.tags ", " }}</span>

  {{ $relatedTitles := slice }}
  {{ range .Params.related }}
    {{ with site.GetPage . }}{{ $relatedTitles = $relatedTitles | append .Title }}{{ end }}
  {{ end }}
  {{ with $relatedTitles }}
  <span hidden data-pagefind-meta="related">{{ delimit . ", " }}</span>
  {{ end }}

  {{ .Content }}
</article>
```

### Astro

An Astro layout assigned by a Markdown page receives its source frontmatter on
`Astro.props.frontmatter`. Normalize scalar-or-array values before rendering markers:

```astro
---
const { frontmatter } = Astro.props;
const asList = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const categories = [...new Set([...asList(frontmatter.category), ...asList(frontmatter.categories)])];
const authors = [...new Set([...asList(frontmatter.author), ...asList(frontmatter.authors)])];
const tags = asList(frontmatter.tags);
const date = frontmatter.date
  ? new Date(frontmatter.date).toISOString().slice(0, 10)
  : undefined;
---

<article data-pagefind-body>
  {categories.map((category) => <span hidden data-pagefind-ignore data-pagefind-filter="category">{category}</span>)}
  {categories.length > 0 && <span hidden data-pagefind-ignore data-pagefind-meta="category">{categories.join(', ')}</span>}
  {authors.map((author) => <span hidden data-pagefind-ignore data-pagefind-filter="author">{author}</span>)}
  {authors.length > 0 && <span hidden data-pagefind-ignore data-pagefind-meta="author">{authors.join(', ')}</span>}
  {date && <span hidden data-pagefind-ignore data-pagefind-meta="date" data-pagefind-sort="date">{date}</span>}
  {tags.map((tag) => <span hidden data-pagefind-ignore data-pagefind-filter="tag">{tag}</span>)}
  {tags.length > 0 && <span hidden data-pagefind-ignore data-pagefind-meta="tags">{tags.join(', ')}</span>}
  <slot />
</article>
```

### Jekyll

Jekyll makes custom frontmatter available on `page`; its layout content is already rendered in
`content`. Jekyll normalizes post categories and tags as arrays:

```liquid
<article data-pagefind-body>
  {% for category in page.categories %}
  <span hidden data-pagefind-ignore data-pagefind-filter="category">{{ category | escape }}</span>
  {% endfor %}
  <span hidden data-pagefind-ignore data-pagefind-meta="category">{{ page.categories | join: ", " | escape }}</span>

  {% if page.author %}
  <span hidden data-pagefind-ignore data-pagefind-filter="author">{{ page.author | escape }}</span>
  <span hidden data-pagefind-ignore data-pagefind-meta="author">{{ page.author | escape }}</span>
  {% endif %}

  <span hidden data-pagefind-ignore data-pagefind-meta="date" data-pagefind-sort="date">
    {{ page.date | date: "%Y-%m-%d" }}
  </span>
  {% for tag in page.tags %}
  <span hidden data-pagefind-ignore data-pagefind-filter="tag">{{ tag | escape }}</span>
  {% endfor %}
  <span hidden data-pagefind-ignore data-pagefind-meta="tags">{{ page.tags | join: ", " | escape }}</span>

  {{ content }}
</article>
```

### Eleventy (11ty)

This Nunjucks layout expects `categories` and `tags` to be arrays in the content data. Eleventy's
`page.date` is a JavaScript `Date`, so it can emit Pagefind's sortable ISO date directly:

```njk
<article data-pagefind-body>
  {% for category in categories or [] %}
  <span hidden data-pagefind-ignore data-pagefind-filter="category">{{ category }}</span>
  {% endfor %}
  <span hidden data-pagefind-ignore data-pagefind-meta="category">{{ (categories or []) | join(", ") }}</span>

  {% if author %}
  <span hidden data-pagefind-ignore data-pagefind-filter="author">{{ author }}</span>
  <span hidden data-pagefind-ignore data-pagefind-meta="author">{{ author }}</span>
  {% endif %}

  <span hidden data-pagefind-ignore data-pagefind-meta="date" data-pagefind-sort="date">
    {{ page.date.toISOString().slice(0, 10) }}
  </span>
  {% for tag in tags or [] %}
  <span hidden data-pagefind-ignore data-pagefind-filter="tag">{{ tag }}</span>
  {% endfor %}
  <span hidden data-pagefind-ignore data-pagefind-meta="tags">{{ (tags or []) | join(", ") }}</span>

  {{ content | safe }}
</article>
```

If your Eleventy project permits untrusted frontmatter, add an HTML-escape filter to the marker
values; `safe` is only for Eleventy's already-rendered page body.

### Attribute reference matrix

Frontmatter fields map to Pagefind indexing attributes according to how Hawk and Pagefind consume them:

| Frontmatter field        | Formats supported          | Pagefind HTML attribute                                              | Role in Hawk                                                                                                                                      |
| ------------------------ | -------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `category`, `categories` | String or array of strings | `data-pagefind-filter="category"`<br>`data-pagefind-meta="category"` | Filter & Metadata: powers auto-derived tabs, inline query filters (`category:Guides`), and `item.meta.category`.                                  |
| `author`, `authors`      | String or array of strings | `data-pagefind-filter="author"`<br>`data-pagefind-meta="author"`     | Filter & Metadata: filterable via inline queries (`author:Ada`) and accessible on `item.meta.author`.                                             |
| `date`, `.Lastmod`       | ISO string (`YYYY-MM-DD`)  | `data-pagefind-meta="date"`<br>`data-pagefind-sort="date"`           | Metadata & Sort: renders beneath excerpts via `showResultDate` and enables chronology ordering via `sort: { date: 'desc' }`.                      |
| `tags`                   | String or array of strings | `data-pagefind-filter="tag"`<br>`data-pagefind-meta="tags"`          | Filter & Metadata: individual tags enable filtering (`tag:Metadata`), comma-delimited metadata enables result-item tag badges with deduplication. |

```js
new HawkSearch({
  index: '/pagefind/',
  showResultDate: true,
  resultDateMetaKey: 'date',
  showResultTags: true,
  resultTagsMetaKey: 'tags',
});
```

Set `showResultDate: false` or `showResultTags: false` independently when that metadata
should remain available through `HawkMatch.meta` but not appear in the results column.
When `discoveryRow` is enabled, it consumes this same result contract: marked indexed excerpts
provide query terms, `meta.title` and result URLs provide page links, and Pagefind `sub_results`
provide heading fragments. It does not read source frontmatter or fetch pages to build the row.
See Pagefind's [metadata](https://pagefind.app/docs/metadata/),
[filtering](https://pagefind.app/docs/filtering/), and
[sorting](https://pagefind.app/docs/sorts/) references for attribute behavior.

## Category filters (tabs)

Hawk's filter pills — rendered as a proper ARIA tablist, Left/Right/Home/End to move between
them — are derived automatically from Pagefind's `filters()` API by default. No hardcoded
category list to maintain, and no hawk-side config for a new tab to show up: flag a page by
marking a filter dimension anywhere inside its `data-pagefind-body` region:

```html
<article>
  <span hidden data-pagefind-filter="category">Guides</span>
  ...
</article>
```

A page isn't limited to one tab — add more than one marker to flag it for several:

```html
<article>
  <span hidden data-pagefind-filter="category">Guides</span>
  <span hidden data-pagefind-filter="category">Reference</span>
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
