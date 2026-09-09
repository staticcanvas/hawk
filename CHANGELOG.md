# Changelog

All notable changes to this project are documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Hawk is pre-1.0 and hasn't cut a
tagged release yet — the versions below track `package.json`'s history, not published tags.

## [Unreleased]

### Added

- Frontmatter-to-Pagefind mapping in the Hugo docs for category, author, tags, and last-modified
  date metadata/filter/sort values.
- Result-row date and tag metadata with configurable keys and independent visibility controls;
  Pagefind anchor/sub-results are now indented beneath their parent page.
- `headerControls` can hide the density switcher and Escape button independently, or hide both
  for a minimal search-input-only header.
- Recently viewed search history, persisted in `localStorage` and exposed through a synthetic
  tab after the first result selection. Configure it with `enableRecentlyViewed`,
  `recentlyViewedStorageKey`, and `maxRecentlyViewed`.
- `enableSecondColumn` controls whether the preview pane is available; it defaults to `true` and
  forces a single results column when disabled.
- `excludePages` provides a small, URL-based result exclusion list; excluding a page also omits
  its Pagefind section/anchor matches. Hawk's own docs use it to keep the home page out of search.
- The TypeFlow animation adapter now integrates the released `@staticcanvas/typeflow` 0.34 line
  directly and exports a ready-to-use `HawkAnimationTypeflow` driver; the configurable factory
  remains available. Its typed configuration and playground now expose character, word,
  scramble, fade-trail, word-fade, directional float, spatial zoom, and expanded erase styles
  across titles, preview content, and rotating placeholders.
- The Typeflow theme now follows `prefers-color-scheme` when its host has no explicit
  `data-theme` selection, while preserving explicit light/dark and Dark Reader scheme state.
- `pagefindInitOptions` and `pagefindMergeIndexes` expose Pagefind browser configuration,
  ranking, cache/worker controls, and multi-index search before Hawk derives its tabs.

- **`@staticcanvas/hawk/debug`** — optional, non-invasive console diagnostics for a `HawkSearch`
  instance (opens/closes/query changes/settled results/tab switches/pin changes/errors), routed
  through `@staticcanvas/logcad` when installed, else a styled `console.*` fallback.
- **`@staticcanvas/hawk/metrics`** — optional, headless counters/timings for a `HawkSearch`
  instance: Pagefind query stats (`zeroResultRate`, `averageMatches`, `averageQueryLatencyMs`),
  tab/pin usage, and session duration. No DOM of its own — draw a UI from `.snapshot()`.
  Both follow the same shape (wrap the instance's public methods/callbacks, poll its public
  `state` getter) as `@staticcanvas/lume`'s own `lume-debug`/`lume-metrics`; see
  `architecture/README.md`.
- **Playground page** (`/playground/`) — a real, linked page on hawk's own docs site with controls
  to toggle theme, animation driver, modal reveal animation, results reveal, scale/position/
  columns/density live against the site's own real Pagefind index, plus Debug/Metrics toggles.

## [0.5.2] - 2026-08-31

### Security

- **Reflected XSS via the search query.** `strings.noResults(query)` interpolated the visitor's
  typed query directly into a template literal assigned to `innerHTML`, with no escaping —
  confirmed exploitable: typing `<img src=x onerror="...">` executed arbitrary JS in the page's
  context. Distinct from the documented preview-pane trust boundary (which is specifically about
  *your own site's already-built content*, not visitor input). Fixed by escaping the `query`
  argument before it reaches `noResults` — protects a custom `strings.noResults` override too,
  not just the default. Added regression tests, including one confirming a custom override still
  receives an escaped query.

### Fixed

- `test:bun`/`test:coverage:bun` were picking up `tests/e2e/hawk.spec.mjs` (a Playwright file, not
  a unit test) and failing on every `test.describe()` call. Scoped both scripts to `tests/*.test.js`.
  Bun's own `vi` mock still doesn't implement `vi.stubGlobal`/`vi.unstubAllGlobals`
  (used in `tests/hawk.test.js`'s `beforeEach`/`afterEach`), so `test:bun` remains broken beyond
  this — not attempted here; tracked as a known gap, not fixed.

### Docs

- API reference's trust-boundary note now explicitly distinguishes "your site's content" (not
  sanitized, deliberately) from "the visitor's typed query" (escaped, always).

## [0.5.1] - 2026-08-31

### Fixed

- **Out-of-order search results.** `#executeSearch` could apply a stale, earlier-started call's
  results after a newer one had already committed, if the earlier call happened to resolve
  second (e.g. `eagerResults`' own empty-query listing racing a query typed right after `open()`
  — both await the same in-flight Pagefind load, with no guarantee `debouncedSearch()`/`search()`
  settle in call order). Added `#searchGeneration`, a monotonic counter captured before any
  `await` and checked before committing — the same staleness-guard pattern `#loadPreviewContent`
  already used for `#previewKey`. Also the source of real (not just theoretical) e2e flakiness:
  `tests/e2e/hawk.spec.mjs`'s wait conditions now wait for query-specific content (the "N matching
  results" counter text) instead of "any result exists", which the transient eager listing could
  satisfy on its own.
- **Modal chrome (header/filter-tabs/footer) could compress vertically at a narrow width.**
  `.hawk-modal-dialog`'s column-flex layout had no `flex-shrink: 0` on any row but
  `.hawk-modal-body` — if the footer's hint text ever wrapped onto a second line (nothing in it
  was `nowrap`-protected either), the resulting height deficit got redistributed across every
  row once the body hit its own `min-height` floor, squeezing filter-pill padding down to ~10px
  (from 24px) at some width/height combinations. Fixed with `flex-shrink: 0` on the header,
  filter-tabs, and footer rows, plus `overflow-x: auto` + `white-space: nowrap` on the footer's
  hints so they scroll instead of wrapping in the first place.
- **A markdown table could overflow its column and run past the page's TOC.** `table { width:
  100% }` is only ever a *preferred* width under the default `table-layout: auto` — a cell with a
  long unbroken token (e.g. a `code`-spanned union type) still forces the table to its content's
  real minimum width. `api.md`'s config-option table rendered ~920px wide inside a ~570px column.
  Fixed with `display: block; overflow-x: auto` directly on `.doc-content table` (a Hugo
  render-hook wrapper div would be the more conventional fix, but table render hooks aren't
  supported until Hugo v0.134 — this project's Hugo build is v0.131).
- **A long unbroken word in prose could overflow the article column** (e.g. a real sentence in
  the density-and-navigation guide: `ArrowUp/ArrowDown/PageUp/PageDown/Home/End`, where `/` isn't
  a CSS line-break opportunity) — on a narrow viewport this took the whole page past its own
  width. Fixed with `overflow-wrap: break-word` on `.doc-content`.
- **The header's icon-link row overflowed the viewport by a few px on every page at ~375px
  width** — `.header-inner`'s content needed more room than a phone-width viewport has, and
  nothing in the row shrank to compensate. Fixed by hiding the "Ctrl+K" hint (genuinely
  meaningless on a touch device with no physical keyboard) below 480px, which reclaims more than
  the row was short by.
- **The homepage hero's content column didn't align with the feature/guides sections below it.**
  `.hero-inner` added its own `max-width: 720px` on top of `.shell`'s shared 1100px container,
  re-centering a narrower box and pulling its left edge inward relative to everything below it.
  Removed; the tagline's own `max-width: 56ch` already handles readable line length locally.

### Changed

- Homepage feature grid refreshed from 6 to 9 cards for parity with hawk's actual feature surface
  — added modal reveal animations, real (fetched, not excerpt) page previews with section
  outlines, density modes, and curated/JSON-driven tabs, none of which were mentioned before.
  Added a "Features" heading above the grid, matching the existing "Guides" section's own pattern.

## [0.5.0] - 2026-08-30

### Added

- **Curated/sorted tabs**: `HawkTab.sort` (sugar for `pagefindOptions.sort`) turns a tab into a
  listing ordered by a Pagefind-indexed field instead of relevance — e.g. `{ sort: { date: 'desc'
  } }` for a "Recently updated" tab, given pages marked with `data-pagefind-sort="date"`. Wired
  into hawk's own docs site as a working example (every content page now carries a
  `data-pagefind-sort="date"` marker from its Hugo `.Lastmod`).
- **Loading tabs from JSON**: `config.tabsUrl` fetches a JSON file (the same shape as
  `config.tabs`) once Pagefind loads, instead of requiring the tab list to live in the mount
  script — lets a non-JS site maintainer, or a separate build step, edit tabs directly. Falls back
  to auto-derived tabs (with a console warning) on a fetch failure, invalid JSON, or a
  non-array response. Ignored if `config.tabs`/`config.categories` is also given.

### Testing

- Unit test count: 115 (0.4.0) → 120 (0.5.0).

## [0.4.0] - 2026-08-30

### Added

- **Section-outline previews**: `config.previewSections` renders a page-level match's preview as
  clickable heading+excerpt rows (one per heading matching `previewSectionSelector`, default
  `'h2, h3'`) instead of the full page dump. An anchor/sub-result match is unaffected — it still
  shows its one matched section in full. Falls back to the full page dump if the page has no
  matching headings. New `previewSectionExcerptLength` (default `140`).
- **Per-tab default previews**: `HawkTab.defaultPreviewUrl`/`defaultPreviewTitle` set a landing
  page for one tab specifically, shown whenever that tab is active and nothing is selected (zero
  matches, or no query typed yet) — overriding `config.defaultPreviewUrl` while that tab is
  active, falling back to it otherwise.
- **Modal reveal animations**: `config.revealAnimation` — 5 built-in named CSS-keyframe reveals
  (`'fade'`, `'scale-fade'` (default), `'slide-down'`, `'blur-zoom'`, `'spring'`), `false` for
  instant show/hide, or a custom name paired with your own `[data-hawk-reveal="name"]` keyframes.
  `config.revealDuration` overrides the built-in per-name timing. Always skipped (instant) under
  `prefers-reduced-motion: reduce`.

### Fixed

- **Empty-query listings never actually populated against a real Pagefind index.** `eagerResults`
  and a just-activated tab's own initial listing both called `pagefind.search('', options)` —
  Pagefind treats `''` as a real (zero-match) search term, not "no term". Its documented
  filter-only listing mode is `search(null, options)`. Every unit test mocked Pagefind and never
  caught the distinction; found by testing hawk's own docs site against its real built index. Now
  passes `null`, so the results pane actually lists matching pages on open/tab-switch as designed.

### Changed

- Docs site header: the top nav (`Overview`, `Get started`, `Guides`, ...) only renders on the
  home page now — every interior page already carries the same tree in the sidebar, so repeating
  it in the header was pure duplication. Even on the home page, the `Overview`/home entry itself
  is dropped, since the brand logo already links there.
- Docs site tabs (`Guides`/`Reference`/`Resources`) each get a `defaultPreviewUrl` computed at
  build time: a same-named section's index page if one exists (`Guides` → `/guides/`), else the
  earliest matching content page (`Reference` → `/api/`).
- Bundle-size budget raised 9KB → 10KB gzip, tracking the reveal animations and per-tab defaults
  above — see `scripts/check-bundle-size.mjs` for the itemized history.

### Testing

- Unit test count: 90 (0.3.0) → 115 (0.4.0).

## [0.3.0] - 2026-08-29

Customization and reliability pass — see `plan-hawk-customization-prd.md` for the full design
rationale behind each item.

### Added

- **Theming depth**: `--hawk-font-family`/`--hawk-font-size-base` tokens; `theme.tokens`, an
  optional `Record<string, string>` of `--hawk-*` overrides applied inline on `apply()` — a
  JS-only theming path alongside writing a full CSS file; `config.disableDefaultMarkdownStyles`,
  an escape hatch that opts out of hawk.css's own preview-content prose rules entirely so a
  consumer can bring their own.
- **Themed scrollbars**: results pane, preview pane, and the filter strip — `scrollbar-color` for
  Firefox/standards-track, `::-webkit-scrollbar*` for the idle-low-opacity/brighten-on-hover
  interaction. New `--hawk-scrollbar-thumb`/`-active` tokens.
- **Match-highlight tokens**: `mark` styling moved off a direct `--hawk-accent-glow` reference
  onto dedicated `--hawk-mark-bg`/`-color`/`-weight`/`-style` tokens.
- **Rotating placeholder**: `config.rotatingPlaceholders` cycles example queries through the
  search input via the animation driver's `rotatePlaceholder` (defined in the driver contract
  since 0.2.0, previously never called). Only runs while the modal is open and the input is
  empty.
- **Result/page metadata**: `match.meta` now carries Pagefind's full `data.meta` object (not just
  `.title`); `meta.section`, when present, renders as a badge on the result row and preview
  header. `pageCount` (distinct pages among the current matches) exposed on `state` and passed
  as a second argument to `strings.matchingResults`/`entries`.
- **Powered-by-Pagefind attribution**: `config.showPoweredBy` (default `true`) /
  `config.poweredByHref`, text-only.
- **Pin system**: a pin toggle on every result row (`config.enablePins`, default `true`),
  persisted to `localStorage` (`config.pinStorageKey`, `config.maxPins`). A synthetic "Pinned"
  tab appears once at least one pin exists, listing pins directly with no Pagefind call.
  `state.pins` exposed for a custom pinned-items UI.
- **Structured inline filter syntax**: `config.inlineFilters` (default `false`) lets a visitor
  type `dimension:value` tokens (`category:Guides`, `tag:"multi word"`) directly into the search
  box — parsed out as a Pagefind filters object merged over the active tab's own `filter`, and
  stripped from the text actually searched.
- **Built-in trigger element**: `config.trigger` (`kind: 'minimal' | 'compact' | 'default'`,
  `container`) renders hawk's own trigger button instead of requiring the consumer to build one.

### Fixed

- **Focus trap**: Tab/Shift+Tab now cycle within the modal instead of escaping to the page behind
  the backdrop (WAI-ARIA modal dialog requirement, previously missing).
- **Search/load error handling**: a failed Pagefind runtime load, or any rejecting search call,
  now renders a "search unavailable" state instead of an unhandled promise rejection. Surfaced on
  `state.error`.
- **`respectReducedMotion`** now defaults `true` in every typeflow animation config (was `false`
  — a visitor with OS-level reduced motion still got the full typewriter effect).
- iOS Safari auto-zoom-on-focus: the search input's font-size is now clamped to the 16px
  threshold.

### Changed

- `pagefind` moved from an optional `peerDependency` to a real `dependency` — it's required at
  runtime. `@staticcanvas/typeflow` stays an optional `peerDependency` (not published to npm yet).
- `hawk-theme-typeflow.js`/`hawk-animation-typeflow.js` self-register against `window.Hawk` in
  script-tag usage — no manual `registerTheme`/`registerAnimation` calls needed in that load order.
- Every UI string is now `DEFAULT_STRINGS`, overridable via `config.strings` (no i18n before).
- Bundle-size budget raised 6KB → 9KB gzip across this and the prior release, tracking real added
  functionality — see `scripts/check-bundle-size.mjs` for the itemized history.

### Testing

- Added real-browser Playwright coverage (`tests/e2e/`) against hawk's own docs site build and a
  real Pagefind index — not a synthetic fixture. Wired into CI (`test:e2e`, `allow_failure: true`
  pending a track record there).
- Unit test count: 19 (0.1.0) → 53 (0.2.0) → 90 (0.3.0).

## [0.2.0] - 2026-08-29

Dev-controlled tabs, search QOL, and widget positioning — see `plan-hawk-prd.md`.

### Added

- **Tabs**: explicit `config.tabs` (each tab's `filter` a raw Pagefind filters object — full
  multi-dimension/multi-value power) alongside the existing auto-derived-from-`filters()` default.
  `config.categories` kept as sugar over `tabs`. `includeAllTab`, `defaultTab`.
- **`pagefindOptions`**: a raw options passthrough merged into every search call, at the
  top level and per-tab.
- **Density modes**: `params.density` (`'fit' | 'medium' | 'compact'`), an in-modal switcher
  persisted to `localStorage`.
- **Two-pane keyboard navigation**: results pane and preview pane are real Tab stops;
  `aria-activedescendant` on the results listbox instead of individually-tabbable rows; arrow keys
  scroll the preview pane when it has focus.
- **Initial popup state**: `defaultPreviewUrl`/`defaultPreviewTitle` (show a page before any
  selection), `eagerResults` (default `true` — a populated listing on open instead of empty).

### Changed

- Repositioned hawk as a general-purpose, JS-embeddable search widget rather than
  "the typeflow docs search" — README/docs rewritten accordingly.

## [0.1.0]

Initial extraction from typeflow's docs site search: the core Pagefind-backed search engine,
the default (`instant`) and `typeflow` animation driver plugins, the `hawk-theme-typeflow` theme
plugin, the theme/animation-driver plugin registries, category filter pills derived from
Pagefind's `filters()`, rich preview content (fetched and narrowed to `contentSelector`, not just
Pagefind's excerpt), and the Hugo docs site / Pagefind indexing recipe scaffold.
