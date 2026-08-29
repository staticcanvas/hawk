# Hawk PRD — widget positioning, dev-controlled tabs, and search QOL

Status: draft, implementation in progress. Scope is hawk (`hawk/`) only — no changes to
typeflow's docs site (`lume`/Hugo integration, `docs/static/hawk-playground.html`) until this
lands and we circle back.

## 1. Positioning: hawk is a widget, not "the typeflow docs search"

Hawk already mounts the way a widget should: `new HawkSearch({ index, theme, animation, ... })`
(or `new Hawk(...)` off the global when script-tag-loaded) builds its own DOM, needs no host
markup beyond a trigger element, and is fully teardown-able via `destroy()`. That mechanism is
correct and doesn't change.

What changes is framing, not mounting: hawk is a general-purpose search widget for any
Pagefind-indexed static site, that a dev drops in via `npm install` + a constructor call, or a
`<script>` tag + a constructor call. typeflow is one theme/animation pairing it ships with, not
its reason for existing. This PRD's API additions (§2-§5) are all designed to work with zero
typeflow-specific assumptions — every new config key is plain data (strings, objects) or a
callback, same as today.

**Deferred, not in scope here:** an inline (non-modal) embed mode — e.g. a widget permanently
docked in a page region instead of a command-palette overlay. Nothing today prevents a consumer
from styling `.hawk-modal` as non-fixed/always-visible via `container` + CSS overrides, but hawk
doesn't yet have a first-class "inline" mode (no backdrop, no open/close lifecycle). Flagging as
a future item — revisit only if asked for.

## 2. Dev-controlled tabs (hawk as Pagefind's own front end)

### Current behavior (keep as the zero-config default)

Tabs are always derived from Pagefind's `filters()` for a single dimension
(`categoryFilterName`, default `'category'`), or replaced by a flat `categories: string[]` label
list that still filters on that same one dimension. This is good zero-config behavior for the
common case (one `category` frontmatter field) and stays the default when a site does nothing
extra.

### New: explicit `tabs` config

```ts
interface HawkTab {
  id?: string;              // slug of label if omitted
  label: string;
  filter?: Record<string, string | string[]>; // raw Pagefind filters object — full power, zero translation
  pagefindOptions?: Record<string, unknown>;   // merged over config.pagefindOptions for this tab only
}

interface HawkSearchConfig {
  tabs?: HawkTab[];
  includeAllTab?: boolean;      // default true — prepend a filterless "All" tab
  defaultTab?: string;          // tab id active on open; default 'all'
  pagefindOptions?: Record<string, unknown>; // merged into every search()/debouncedSearch() call
  // ...existing keys unchanged
}
```

- `filter` is *literally* a Pagefind `filters` object (`{ category: 'Guides' }`,
  `{ category: ['Guides', 'Reference'] }` for an OR within one dimension, or
  `{ category: 'Guides', version: '2.x' }` for an AND across dimensions). No hawk-side
  translation layer — whatever Pagefind's `search(term, { filters })` accepts, a tab's `filter`
  accepts. This is what "hawk is Pagefind's own front end" means concretely: the filter object
  in hawk's config *is* the filter object hawk hands to Pagefind.
- When `tabs` is given, it fully replaces auto-derivation — `filters()` is never called, tabs
  render synchronously on mount (no waiting on Pagefind to load), same as today's `categories`
  shorthand.
- `categories: string[]` keeps working, as sugar that expands to
  `tabs: categories.map(c => ({ id: c, label: c, filter: { [categoryFilterName]: c } }))`.
- `pagefindOptions` (top-level) is a raw passthrough merged into every search call — the escape
  hatch for `sort`, `ranking`, `language`, or any future Pagefind search option hawk doesn't
  wrap. A tab's own `pagefindOptions` merges over the top-level one for that tab's searches only.
  Hawk never validates the shape of this object — if Pagefind rejects it, that's surfaced as a
  normal promise rejection, same as any other Pagefind error today.

### Why this shape

- Reuses Pagefind's own filter object verbatim instead of inventing hawk syntax for something
  Pagefind already has a shape for — one less thing to document, one less translation layer to
  keep in sync with Pagefind's own filter feature set (which already supports multi-dimension AND
  and multi-value OR).
- `tabs` is additive over `categories`, not a breaking replacement — existing consumers using
  `categories` see no change.

## 3. QOL: density modes (fit-to-page / medium / compact)

### Current behavior (keep)

`params.scale` (numeric multiplier), `params.columns` (1|2), and a JS-driven
`params.breakpoint` (px) that force-collapses to 1 column and hides the preview pane below that
viewport width. These stay as the low-level knobs.

### New: `params.density`

```ts
type HawkDensity = 'fit' | 'medium' | 'compact';

interface HawkParams {
  // ...existing keys
  density?: HawkDensity;        // default 'medium' (== today's fixed 860x680 sizing)
  allowDensityToggle?: boolean; // default true — show the in-modal density switcher
}
```

- `medium` — today's existing sizing/behavior, unchanged (860×680 max, 2 columns, current
  paddings). This is the default, so nobody's current setup changes visually.
- `fit` — near-viewport modal (`96vw` / `92vh`), for a "dedicated search page" feel; roomier
  paddings, 2 columns down to a lower breakpoint.
- `compact` — smaller modal (e.g. `560px` / `70vh`), tighter paddings, forced 1 column with the
  preview pane reachable via focus-zone navigation (§4) rather than always visible — the same
  end state today's `breakpoint` auto-collapse produces, but user-selectable rather than only
  viewport-triggered.
- Density and the viewport `breakpoint` compose: whichever forces single-column wins (i.e.
  `compact` OR below-breakpoint ⇒ 1 column), so a `fit`/`medium` density still degrades
  gracefully on narrow viewports.
- **In-modal control:** three small buttons in the modal header (or footer — final placement is
  an implementation detail, not a config surface) that call `this.setParams({ density })`
  internally. Gated by `allowDensityToggle` for consumers who want to fix density via config only
  and not expose the switcher. The user's last choice persists to `localStorage`
  (`hawk:density:<id>` or a shared `hawk:density` key — see open question below) so it survives
  modal close/reopen and page reloads; falls back silently (no throw) if `localStorage` is
  unavailable (private browsing, SSR, etc.).

**Open question for review:** should density persistence be scoped per-`id` (multiple hawk
instances on one page remember separately) or global (one shared preference)? Defaulting to
**global** (`hawk:density`, no id suffix) since density is a user viewing preference, not
per-instance config — flag if that's wrong.

## 4. QOL: two-pane keyboard navigation (results / preview scrolling)

### Problem

Today, `ArrowUp`/`ArrowDown` while the search input is focused (the only place focus lives during
normal use) move the *selection* in the results pane. There's no way to scroll a long preview
(the right pane) with the keyboard at all, and no way to scroll the results list independent of
changing selection.

### Design: focus-zone navigation, not new global hotkeys

Rather than overload arrow keys with a mode flag, make the two panes real focus stops and give
each one its own arrow-key behavior — standard "roving focus zone" pattern, same category as the
existing filter-tablist Left/Right/Home/End handling:

- **Tab order:** input → filter tabs (already a roving tablist) → results pane → preview pane →
  close button → (wraps to) input. Standard DOM tab order via `tabindex`, so this is also free
  screen-reader/keyboard-only-user accessibility, not just a power-user shortcut.
- **Input focused (default, unchanged):** `ArrowUp`/`ArrowDown` move selection exactly as today.
  This is the primary flow and must not regress.
- **Results pane focused** (`tabindex="0"` on the pane, roving `tabindex` on the selected row,
  mirroring the filter tablist pattern): `ArrowUp`/`ArrowDown` move selection identically to the
  input-focused case; `Enter` selects; typing any printable character refocuses the input and
  forwards the keystroke (so a user who tabbed away can just start typing again without an extra
  click) — implementation detail, not a new config surface.
- **Preview pane focused** (`tabindex="0"` on `.hawk-preview-pane`): `ArrowUp`/`ArrowDown` scroll
  the pane by a fixed step (~48px, roughly one line-and-a-half at default font size);
  `PageUp`/`PageDown` scroll by the pane's visible height; `Home`/`End` jump to top/bottom.
  Implemented explicitly in JS (`scrollTop` math) rather than relying on native
  focused-scroll-container behavior, because that native behavior isn't consistent across
  browsers and doesn't exist in jsdom at all — this needs to be unit-testable.
- Nothing here is user-configurable (no new config keys) — it's baseline keyboard-accessibility
  behavior, same tier as the existing wraparound arrow-key selection.

## 5. QOL: initial popup state — default tab, default preview, eager results

Three related gaps, one section because they all shape what the modal shows the instant it
opens, before the user has typed or clicked anything:

```ts
interface HawkSearchConfig {
  // ...
  defaultTab?: string;        // §2 — tab id active on open, default 'all'
  defaultPreviewUrl?: string; // show this page's content in the preview pane on open,
                               // before any result is selected — same fetch/extract path
                               // #loadPreviewContent already uses for a real match
  eagerResults?: boolean;     // default true — run an empty-query search on open instead of
                               // leaving the results pane on "Type to search"
}
```

- `defaultTab`: applies the same way clicking that tab would — active pill state + scoped
  search — just pre-applied instead of requiring a click. Must be a valid id from `tabs` (or
  `'all'`); an unknown id logs a console warning and falls back to `'all'` rather than throwing
  (opening the modal should never hard-fail on a config typo).
- `defaultPreviewUrl`: reuses `#fetchFragment`/`contentSelector` extraction exactly as a real
  selected result does, so it's real rendered page content, not a special-cased fixture. Renders
  once on mount (not re-fetched on every open) and is replaced the moment the user selects an
  actual result. If the fetch fails, falls back to the existing empty-state placeholder rather
  than showing an error — same fallback tier as today's excerpt-fallback behavior.
- `eagerResults` — **behavior change, default true.** Today, opening the modal with no query
  shows "Type to search" and nothing in the results pane until the `input` event fires once.
  Defaulting this to `true` means: once Pagefind loads, run `search('', options)` (which
  `#executeSearch` already supports — it's the same call it makes today for an empty query, just
  currently only reachable via the `input` listener) and populate the results pane immediately,
  scoped to whatever tab is active. This is called out explicitly because it changes what
  existing consumers see on open (a populated list instead of an empty state) — set
  `eagerResults: false` to keep the current empty-first behavior.

## 6. Non-goals for this pass

- Inline/non-modal embed mode (§1) — future item.
- Multi-index / federated search across more than one Pagefind bundle — not requested.
- Any change to `docs/static/hawk-playground.html`, typeflow's `baseof.html`, or the real
  `docs.js`/`#typeflow-search-modal` — explicitly deferred until hawk itself is finished.
- Theme or animation-driver contract changes — §2-§5 are all core (`hawk.js`/`hawk.css`)
  changes; `hawk-theme-typeflow`/`hawk-animation-typeflow` need no changes since they only touch
  colors and reveal timing, neither of which this PRD's features alter.

## 7. Implementation plan

Phased so each lands with its own tests and its own commit (conventional-commits style: `feat(...)`).

1. **Tabs + pagefindOptions** (§2) — `tabs`/`includeAllTab`/`defaultTab`/`pagefindOptions`
   config, `#deriveCategories`/`#renderFilters`/`#activateFilter`/`#executeSearch` reworked
   around a unified tab model that both the auto-derived and explicit paths feed into.
   `categories` becomes sugar over `tabs`.
2. **Density modes** (§3) — `params.density`, `hawk.css` `[data-hawk-density]` rules, the
   in-modal switcher UI + `localStorage` persistence, gated by `allowDensityToggle`.
3. **Two-pane keyboard navigation** (§4) — `tabindex`/roving-focus wiring on results + preview
   panes, scroll-by-arrow-keys handlers on the preview pane.
4. **Initial popup state** (§5) — `defaultTab`, `defaultPreviewUrl`, `eagerResults`.
5. **Docs pass** — update `README.md`, `docs/content/getting-started.md`,
   `docs/content/guides/pagefind-setup.md` (tabs section), add a `docs/content/guides/` page for
   density + keyboard nav, update `src/hawk.d.ts`, add a `CHANGELOG.md` entry, bump `package.json`
   version per this repo's semver conventions.

Each phase: implement in `src/hawk.js` (+ `src/hawk.css`, `src/hawk.d.ts`), extend
`tests/hawk.test.js` coverage for the new behavior, `npm test` green before moving on, then a
commit for that phase. Full `npm run check:quality` (build + bundle-size check + tests) before
the final docs commit.
