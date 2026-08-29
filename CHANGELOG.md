# Changelog

All notable changes to this project are documented in this file. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Hawk is pre-1.0 and hasn't cut a
tagged release yet — the versions below track `package.json`'s history, not published tags.

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
