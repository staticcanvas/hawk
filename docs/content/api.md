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
| `trigger` | `object` | — | Renders hawk's own trigger button instead of requiring hand-built markup. See [Built-in trigger](#built-in-trigger). |
| `container` | `HTMLElement` | `document.body` | Where the modal is mounted. |
| `params` | `object` | see below | Layout: `scale`, `position`, `offset`, `alignment`, `columns`, `breakpoint`, `density`, `allowDensityToggle`. |
| `theme` | `string \| HawkTheme` | `'typeflow'` if registered | A registered theme name or a theme object. See [Theming](#theming). |
| `animation` | `string \| HawkAnimationDriver \| false` | `'typeflow'` if registered, else `'instant'` | A registered driver name, a driver object, or `false` to force instant. |
| `tabs` | `HawkTab[]` | derived from Pagefind `filters()` | Explicit tab list — see [Tabs](#tabs) below. Replaces auto-derivation entirely; renders synchronously on mount. |
| `categories` | `string[]` | — | Shorthand for `tabs`: one tab per category name, each filtering on `categoryFilterName`. Ignored if `tabs` is given. |
| `includeAllTab` | `boolean` | `true` | Prepends a filterless "All" tab to `tabs`/`categories`/the auto-derived list. |
| `defaultTab` | `string` | `'all'` | Tab id active on open. Falls back to `'all'` (with a console warning) if it matches no resolved tab. |
| `pagefindOptions` | `object` | `{}` | Raw options merged into every `search()`/`debouncedSearch()` call (`sort`, `ranking`, `language`, ...). A tab's own `pagefindOptions` overrides this per-tab. |
| `inlineFilters` | `boolean` | `false` | Parses `dimension:value` tokens out of the typed query as filters. See [Inline filter syntax](#inline-filter-syntax). |
| `categoryFilterName` | `string` | `'category'` | The Pagefind filter dimension used for the auto-derived tabs and the `categories` shorthand. |
| `maxResults` | `number` | `18` | Maximum rendered result rows. |
| `contentSelector` | `string` | `'[data-pagefind-body]'` | Selects the preview pane's content from a fetched result page. See [Rich preview content](#rich-preview-content). |
| `disableDefaultMarkdownStyles` | `boolean` | `false` | Opts out of hawk.css's own preview-content prose rules. See [Theming](#theming). |
| `hotkeys` | `object` | `{ open: true, slash: true, escape: true }` | Enables/disables Ctrl/Cmd+K, `/`, and Escape. |
| `strings` | `object` | see [Strings and localization](#strings-and-localization) | Overrides for any UI text. |
| `defaultPreviewUrl` | `string` | — | Shows this page's content in the preview pane on mount, before any result is selected. Replaced the instant real results exist. |
| `defaultPreviewTitle` | `string` | `''` | Title shown above `defaultPreviewUrl`'s content. |
| `eagerResults` | `boolean` | `true` | Runs an empty-query search as soon as Pagefind loads, populating the results pane instead of leaving it on "Type to search". |
| `rotatingPlaceholders` | `string[]` | — | Example queries cycled through the input's placeholder. See [Rotating placeholder](#rotating-placeholder). |
| `showPoweredBy` | `boolean` | `true` | Shows a "Search powered by Pagefind" link in the modal footer. |
| `poweredByHref` | `string` | `'https://pagefind.app/'` | Link target for the powered-by attribution. |
| `enablePins` | `boolean` | `true` | Lets a visitor pin a result. See [Pins](#pins). |
| `pinStorageKey` | `string` | `'hawk:pins'` | `localStorage` key pins persist to. |
| `maxPins` | `number` | `20` | Caps the number of pins; pinning past the cap is a silent no-op. |
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

### Inline filter syntax

With `inlineFilters: true`, typing `category:Guides responsive nav` parses out
`{ category: 'Guides' }` as a filter and searches only `responsive nav`. A quoted value
(`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array (OR, the same
shape as `HawkTab.filter`). Merges with the active tab's own `filter` — inline wins on a
dimension collision. Off by default: enabling it changes how a literal colon in a normal query
behaves (e.g. `"ratio: 16:9"` would get `ratio:` parsed as a filter attempt). See
[Pagefind setup]({{< relref "/guides/pagefind-setup" >}}#inline-filter-syntax).

## Theming

Beyond the `--hawk-*` custom properties documented in `architecture/theme-contract.md`:

- `--hawk-font-family` / `--hawk-font-size-base` — set on `.hawk-modal-dialog`, inherited by
  everything inside it.
- `--hawk-mark-bg` / `-color` / `-weight` / `-style` — search-match highlight styling
  (`--hawk-mark-bg` falls back to `--hawk-accent-glow` if unset, matching pre-0.3.0 behavior). A
  gradient-text effect isn't a token — set it directly in a theme's CSS:
  ```css
  [data-hawk-theme='mytheme'] .hawk-preview-content mark {
    background: linear-gradient(90deg, #f97316, #ec4899);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  ```
- `--hawk-scrollbar-thumb` / `-active` — the results pane, preview pane, and filter strip's
  scrollbars (idle / hover-or-actively-scrolling). Firefox and standards-track engines get the
  idle color only (`scrollbar-color` has no separate hover/active state); Blink/WebKit get the
  full idle-to-active transition, triggered by both `::-webkit-scrollbar-thumb:hover` and a
  `scroll` event (`[data-hawk-scrolling]`, fading back to idle ~500ms after the last one) — so
  keyboard-driven scrolling (the preview pane's arrow-key handler) lights it up too, not only a
  mouse sitting over the pane.
- `--hawk-powered-by-color` / `-opacity` — the powered-by attribution link.

### `theme.tokens`: a JS-only theming path

```ts
interface HawkTheme {
  name: string;
  apply(rootEl: HTMLElement): void;
  tokens?: Record<string, string>;
}
```

`tokens`, if present, is applied as inline `--hawk-*` custom properties on `apply()` — a few
color/font tweaks without writing a full CSS file:

```js
new HawkSearch({
  index: '/pagefind/',
  theme: { name: 'brand', apply(el) { el.dataset.hawkTheme = 'brand'; }, tokens: { '--hawk-accent': '#22d3ee' } },
});
```

If `config.trigger` is also used, the same `tokens` (and `apply()`) are applied to the trigger
button too — it renders outside the modal's root element, so it wouldn't otherwise inherit
`#root`-scoped custom properties from a theme's CSS file.

### Opting out of hawk's markdown styling

`disableDefaultMarkdownStyles: true` stamps `data-hawk-markdown-styles="off"` on the modal root,
which scopes every element-selector rule in hawk.css's markdown block
(`h1`-`h6`/`p`/`ul`/`table`/`code`/etc.) so none of them apply. Target `.hawk-preview-content`
with your own CSS instead — an existing site-wide `.prose` class, for example.

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

**Trust boundary:** this HTML — and Pagefind's `<mark>`-highlighted excerpts — is injected via
`innerHTML` with no sanitization pass. That's deliberate: hawk assumes the content is your own
site's already-built, already-trusted output (the same trust level as the page itself), and
stripping/escaping markup would break the "renders exactly as your build produced it" guarantee
above (syntax-highlighted code blocks, tables, etc. rely on real markup surviving intact). If
your `data-pagefind-body` region can contain unsanitized user-generated content (comments, a
wiki, forum posts), that content reaches the preview pane and result list unsanitized too — treat
it the same way you'd treat rendering that content anywhere else on the page, and sanitize it at
your own build/render step if it isn't already.

## Metadata

Every match carries `meta: Record<string, string>` — Pagefind's full `data.meta` object for that
page (sub_results/anchors reuse their parent page's `meta`, so it's consistent whichever row you
look at). If `meta.section` is present, it renders as a badge on the result row and, once
selected, the preview header — nothing to configure, it's opt-in by presence in your Pagefind
metadata the same way `data-pagefind-meta="section:Guides"` already works.

`state.pageCount` is the number of distinct pages among the current matches (as opposed to the
flattened row count, which includes anchor/section sub-results) — passed as a second argument to
`strings.matchingResults(count, pageCount)` / `strings.entries(count, pageCount)`.

## Pins

A pin toggle renders on every result row when `enablePins` (default `true`). Pinning persists to
`localStorage` as `{url, title, isAnchor}[]`, capped at `maxPins`. A synthetic "Pinned" tab is
prepended to the tab list the moment at least one pin exists, and removed the moment the last one
is — selecting it lists pins directly (no Pagefind call) and clears any typed query, since it
isn't a search scope. `state.pins` is the current list, for a custom pinned-items UI instead of
(or alongside) the built-in tab.

## Rotating placeholder

`rotatingPlaceholders: string[]` cycles example queries through the search input via the
animation driver's `rotatePlaceholder` method (defined in the driver contract, previously never
called by core — see `architecture/animation-driver-contract.md`). Implemented as an absolutely
positioned overlay (`.hawk-input-ghost`) rather than the native `placeholder` attribute, which
can't be typed character-by-character. Only runs while the modal is open and the input is empty;
never in the background while closed.

## Built-in trigger

```ts
interface HawkTriggerConfig {
  kind?: 'minimal' | 'compact' | 'default'; // icon only / icon+"Search" / icon+"Search..."+kbd hint
  container: string | HTMLElement;           // required — where the button is appended
}
```

An alternative to hand-building `[data-search-trigger]` markup — `new HawkSearch({ index,
trigger: { container: '#header-search-slot' } })` renders hawk's own button there, already
wired to open the modal (it's marked `[data-search-trigger]`, so the existing `triggerSelector`
click handling picks it up automatically). `kind: 'default'`'s kbd hint is omitted when
`hotkeys.open` is disabled.

## Strings and localization

Every piece of UI text hawk renders is overridable via `config.strings`:

```ts
interface HawkStrings {
  dialogLabel: string;             // 'Search'
  inputPlaceholder: string;        // 'Search...'
  densityGroupLabel: string;       // 'Result density'
  densityFit: string;              // 'Fit'
  densityMedium: string;           // 'Medium'
  densityCompact: string;          // 'Compact'
  escKey: string;                  // 'ESC'
  filtersLabel: string;            // 'Filter by category'
  previewLabel: string;            // 'Preview'
  hintNavigate: string;            // 'Navigate'
  hintSelect: string;              // 'Select'
  hintClose: string;               // 'Close'
  previewEmpty: string;            // 'Type to search, or select a result to preview it here.'
  previewLoading: string;          // 'Loading…'
  sectionBadge: string;            // 'Section'
  untitled: string;                // 'Untitled'
  typeToSearch: string;            // 'Type to search'
  noResults: (query: string) => string;
  matchingResults: (count: number, pageCount: number) => string;
  entries: (count: number, pageCount: number) => string;
  unavailable: string;             // 'Search is unavailable right now. Try again later.'
  unavailableCounter: string;      // 'Search unavailable'
  poweredBy: string;               // 'Search powered by Pagefind'
  pinnedTab: string;               // 'Pinned'
  pinAction: string;               // 'Pin'
  unpinAction: string;             // 'Unpin'
}
```

`noResults`/`matchingResults`/`entries` are functions, not plain strings, so a locale can supply
real pluralization/interpolation instead of hawk guessing at it. `matchingResults`/`entries`'s
`pageCount` argument is additive — a single-argument override still works, `pageCount` is just
ignored.

## Instance methods

- `search.open()` / `search.close()` — open/close the modal.
- `search.setParams(partialParams)` — merges and re-applies layout params at runtime.
- `search.destroy()` — removes the modal (and the built-in trigger, if `config.trigger` was used)
  from the DOM and detaches listeners.
- `search.state` — read-only, updates live:
  ```ts
  interface HawkState {
    open: boolean;
    query: string;
    selectedIndex: number;
    matches: HawkMatch[];       // { title, url, excerpt, isAnchor, meta }
    pageCount: number;
    pins: { url: string; title: string; isAnchor: boolean }[];
    activeTab: string;
    error: Error | null;        // set when Pagefind failed to load, or a search call rejected
  }
  ```

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
