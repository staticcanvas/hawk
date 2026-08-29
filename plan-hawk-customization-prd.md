# Hawk PRD — theming depth, pins, structured query filters, scrollbars, input effects

Status: draft, **for review — do not implement until approved.** Builds directly on
`plan-hawk-prd.md` (tabs/density/keyboard-nav/initial-state, all landed) — this is the next
feature pass, not a rewrite. Scope is hawk (`hawk/`) only.

Verified against the current code before writing this (not guessed):

- `rotatePlaceholder` is defined in the animation-driver contract and implemented by both
  shipped drivers, but **`hawk.js` never calls it** — a real, addressable gap, not a rename.
- No mouse-wheel-blocking code exists anywhere in `hawk.js` (no `wheel` listener, nothing that
  calls `preventDefault()` on scroll) and `.hawk-results-pane`/`.hawk-preview-pane` both already
  have `overflow-y: auto`. **Mouse-wheel scrolling should already work.** See §5's note — I
  can't reproduce "can't scroll" from the code, so that part of the ask may be about the missing
  *scrollbar visual* (easy to mistake "no visible scrollbar" for "doesn't scroll"), not a
  functional bug. Flagging rather than guessing at a fix for something I can't reproduce.
- No `font-family`/base font-size token exists anywhere in `hawk.css` — it fully inherits the
  host page's font today. Real gap.
- `.hawk-result-desc mark` / `.hawk-preview-content mark` already read `--hawk-accent-glow` for
  background, but there's no dedicated mark-specific token set (color, weight, style) — a theme
  *can* already override `mark` styling today via plain CSS specificity, this is about giving it
  a clean token surface instead of needing to fight hawk.css's specificity.

## 1. Theme object: fonts, and a JS-only tokens path

### Font tokens (new)

`hawk.css` gets font tokens, consumed by the dialog root so every element inherits unless a rule
overrides it:

```css
.hawk-modal-dialog {
  font-family: var(--hawk-font-family, inherit);
  font-size: var(--hawk-font-size-base, 1rem);
}
```

Documented in the same token table as colors (`architecture/theme-contract.md`). No structural
change — themes already set custom properties, this just adds two more they can set.

### `theme.tokens`: a JS-only theming path alongside the CSS-file path

Today theming means writing a CSS file (`hawk-theme-typeflow.css`'s pattern: a
`[data-hawk-theme="name"]`-scoped stylesheet, loaded separately). That's right for a
redistributable theme, but heavyweight for "I just want to tweak 3 colors and a font for my
site." Add an optional `tokens` map to the theme contract:

```ts
interface HawkTheme {
  name: string;
  apply(rootEl: HTMLElement): void;
  tokens?: Record<string, string>; // e.g. { '--hawk-accent': '#22d3ee', '--hawk-font-family': '"Inter", sans-serif' }
}
```

`apply()` (already called once on mount) additionally does
`Object.entries(theme.tokens ?? {}).forEach(([k, v]) => rootEl.style.setProperty(k, v))` if
present. A consumer can now do `theme: { name: 'custom', apply(el) { el.dataset.hawkTheme = 'custom'; }, tokens: { '--hawk-accent': '#22d3ee' } }`
inline, or even simpler, `theme: { tokens: { ... } }` with `apply` defaulted to a no-op by hawk
itself if omitted (a "tokens-only, no named theme" mode) — makes the common case (a few color/font
tweaks) a config object, not a CSS file + JS module.

## 2. Markdown styling override escape hatch

`config.disableDefaultMarkdownStyles` (boolean, default `false`). When `true`, hawk stamps
`data-hawk-markdown-styles="off"` on the root, and every element-selector rule in hawk.css's
"Markdown element styling" block (`h1`-`h6`, `p`, `ul`, `code`, `pre`, `table`, ...) gets scoped
`.hawk-preview-content:not([data-hawk-markdown-styles="off"]) h1 { ... }` etc. A consumer who
wants full control over preview typography (their own prose CSS, e.g. reusing Tailwind Typography
or their site's existing `.prose` class) sets this and targets `.hawk-preview-content` themselves
— hawk still narrows/extracts the HTML, just stops opinion-ing about how it looks.

## 3. Modal/trigger size — open question, see bottom

Covered in **Open Question 1**. `density` (`fit`/`medium`/`compact`) already exists and governs
the *opened modal's* sizing. What's proposed below in §3 is a *different* thing: a built-in
trigger element, which doesn't exist today at all (today `triggerSelector` only ever points at
markup the consumer builds themselves).

**Proposed (pending Open Question 1):** `config.trigger` — if set, hawk renders its own trigger
button into `container` (or a `triggerContainer` selector) instead of requiring the consumer to
build one:

```ts
interface HawkTriggerConfig {
  kind?: 'minimal' | 'compact' | 'default'; // 'minimal': icon only. 'compact': icon + "Search". 'default': icon + "Search..." + kbd hint (today's docs-site trigger)
  container?: string; // selector to render into; defaults to prepending into `container`
}
```

If `config.trigger` is omitted entirely (today's only mode), nothing changes — `triggerSelector`
keeps working exactly as it does now for hand-built triggers.

## 4. "Powered by Pagefind" attribution

```ts
interface HawkSearchConfig {
  showPoweredBy?: boolean; // default true
  poweredByHref?: string;  // default 'https://pagefind.app/'
}
```

Renders a small line in the modal footer, right-aligned next to (or replacing, on narrow/compact
layouts) the existing counter — `<a class="hawk-powered-by" href="...">Search powered by
Pagefind</a>`, styled via a new `--hawk-powered-by-color`/`-opacity` token pair (small, muted,
matches the existing `.hawk-hint` treatment). **Text-only, no logo asset** — see Open Question 2
for why, and what I'd need to make it a real logo mark instead.

## 5. Pin system

New capability: a visitor can pin a result from within the results list, independent of any
search — pins persist across sessions and surface without needing to re-search.

```ts
interface HawkSearchConfig {
  enablePins?: boolean;      // default true
  pinStorageKey?: string;    // default 'hawk:pins' — localStorage key, {url, title, isAnchor}[]
  maxPins?: number;          // default 20
}
```

- Each `.hawk-result-item` gets a pin toggle (a small button in `.hawk-result-header`, `aria-pressed`
  reflecting state) — click toggles pin state without triggering the row's own click-to-navigate.
- A synthetic **Pinned** tab is prepended to the tab list (like `includeAllTab`'s "All", but for
  pins — filterless, but sourced from localStorage instead of a Pagefind search) when at least one
  pin exists and `enablePins` is true. Selecting it lists pinned items directly (no Pagefind call
  needed — pins already carry title/url), each still individually un-pinnable from that view.
  `eagerResults`'s empty-query listing does **not** auto-switch to it — it's an explicit tab like
  any other.
- `state.pins` exposed for consumers who want their own pinned-items UI instead of (or in addition
  to) the built-in tab.
- Storage failures (private browsing, quota) degrade to "pins don't persist this session" — same
  fallback tier as `density`'s `localStorage` handling, never throws.

## 6. Scrollbars — themed, idle-low-opacity, brighten on scroll/hover

Applies to `.hawk-results-pane`, `.hawk-preview-pane`, and `.hawk-modal-filters` (horizontal).
Two layers, because no single CSS API does all of "themeable color" + "idle low-opacity, brighten
on interaction" across engines yet:

- **Baseline (Firefox, and any engine without the WebKit pseudo-elements):**
  `scrollbar-width: thin; scrollbar-color: var(--hawk-scrollbar-thumb, rgba(148,163,184,.35)) transparent;`
  — themeable color, but standards-track `scrollbar-color` doesn't support a separate
  hover/active state, so no brighten-on-scroll here; it's just always-visible-thin.
- **WebKit/Blink (`::-webkit-scrollbar*`)**, which *does* support per-state styling — this is
  where the actual "low opacity idle, brightens on hover/active" interaction lives:
  ```css
  .hawk-results-pane::-webkit-scrollbar,
  .hawk-preview-pane::-webkit-scrollbar { width: 8px; }
  .hawk-results-pane::-webkit-scrollbar-thumb,
  .hawk-preview-pane::-webkit-scrollbar-thumb {
    background: var(--hawk-scrollbar-thumb, rgba(148, 163, 184, 0.35));
    border-radius: 999px;
    transition: background-color 0.15s ease;
  }
  .hawk-results-pane::-webkit-scrollbar-thumb:hover,
  .hawk-results-pane:hover::-webkit-scrollbar-thumb,
  .hawk-preview-pane::-webkit-scrollbar-thumb:hover,
  .hawk-preview-pane:hover::-webkit-scrollbar-thumb {
    background: var(--hawk-scrollbar-thumb-active, rgba(148, 163, 184, 0.7));
  }
  ```
- New tokens: `--hawk-scrollbar-thumb` (idle), `--hawk-scrollbar-thumb-active` (hover/scrolling).
  Both get neutral fallbacks (same tier as every other token — themeless hawk still looks fine).
- `.hawk-modal-filters` (already `overflow-x: auto` for many tabs) gets the same treatment, thin
  horizontal.

## 7. TypeFlow-driven rotating placeholder in the search input

Wires up the already-defined-but-unused `rotatePlaceholder` driver method.

```ts
interface HawkSearchConfig {
  rotatingPlaceholders?: string[]; // e.g. ['Search guides...', 'Try "pagefind filters"...']
}
```

An `<input>`'s native `placeholder` attribute can't be animated character-by-character (it's
browser-rendered, not a DOM node) — this needs an overlay element sitting where the placeholder
would visually appear:

```html
<div class="hawk-modal-header">
  <div class="hawk-input-wrap">
    <input class="hawk-modal-input" ... placeholder="" />
    <span class="hawk-input-ghost" aria-hidden="true"></span>
  </div>
  ...
</div>
```

- `.hawk-input-ghost` is absolutely positioned over the (now placeholder-less, so no double text)
  input, `pointer-events: none`, and is what `animation.rotatePlaceholder(ghostEl, rotatingPlaceholders)`
  targets — reusing the exact contract every driver already implements.
- Hidden the instant the input has a value or gains focus (`.hawk-input-wrap[data-hawk-input-active]`
  toggled from the existing `input`/`focus` listeners) — rotation only runs while the input is
  genuinely empty and idle, not fighting real typing.
- **Performance**: only starts once, lazily, on first `open()` — never runs while the modal is
  closed. Falls back to the static `inputPlaceholder` string (today's behavior, unchanged) if
  `rotatingPlaceholders` isn't configured, or if the resolved driver is `instant` (which already
  implements `rotatePlaceholder` as a plain textContent swap — still works, just not typed).
- `stop()` is called (same as every other animation controller) on `close()`/`destroy()`.

## 8. Match-highlight styling tokens

New tokens, replacing the direct `--hawk-accent-glow` reference in `mark` rules:

```css
.hawk-result-desc mark,
.hawk-preview-content mark {
  background: var(--hawk-mark-bg, var(--hawk-accent-glow, rgba(56, 189, 248, 0.25)));
  color: var(--hawk-mark-color, inherit);
  font-weight: var(--hawk-mark-weight, inherit);
  font-style: var(--hawk-mark-style, inherit);
  border-radius: 3px;
}
```

For a gradient-text effect specifically (not just a background highlight), document the standard
`background-clip: text` recipe directly in the theme-contract doc rather than inventing a new
token for one specific effect — a theme sets it itself:

```css
[data-hawk-theme='mytheme'] .hawk-preview-content mark {
  background: var(--hawk-mark-bg) linear-gradient(90deg, #f97316, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

This was already technically possible (themes can always override `mark`); the token change just
means a theme doesn't have to out-specificity hawk.css to do the *common* case (flat color/weight/
style), only the gradient case needs real CSS.

## 9. Structured inline filter syntax (`category:Guides`, `tag:api`, ...)

Lets a visitor type `category:Guides responsive nav` into the search box and have hawk parse
`category:Guides` out as a filter (reusing the exact tab `filter` shape from `plan-hawk-prd.md`
§2 — a raw Pagefind filters object) instead of literal search text, searching only `responsive
nav`.

```ts
interface HawkSearchConfig {
  inlineFilters?: boolean; // default false — opt-in, see Open Question 3 for why not on by default
}
```

- Parser (`#parseInlineFilters(query)`): matches `/(\w+):("[^"]*"|\S+)/g` tokens anywhere in the
  string, extracts each as `{ dimension: value }` (quoted values keep spaces), strips them from
  the query, returns `{ filters, remainingQuery }`. Multiple tokens for the same dimension become
  an array (OR, matching Pagefind's own multi-value filter shape from day one of `tabs`).
- These parsed filters **merge with** (don't replace) the active tab's own `filter` — a visitor
  narrowing further within a tab, not fighting it. Precedence: active tab's filter first, then
  inline-parsed filters spread over it (inline wins on a dimension collision, since it's the more
  specific, just-typed intent).
- Recognized dimensions aren't restricted to `categoryFilterName` — any `word:` token is treated
  as a filter attempt on that literal dimension name, same as `tabs[].filter`'s keys. An unknown
  dimension just means Pagefind's `filters()` has nothing under that name, so it naturally
  filters to zero results — not a hawk-level error, same as a manually mistyped filter today.
- Documented in the Pagefind setup guide right next to the existing filter-dimension explanation,
  since it's literally the same underlying mechanism exposed as a typed shortcut.

## 10. Result/page metadata

- `match.meta` — expose Pagefind's full `data.meta` object on every flattened match (today only
  `.title` is read out of it; the rest is already fetched, just discarded). Free — no extra
  Pagefind calls.
- If `meta.section` is present, render it as a small badge (reusing the existing anchor-badge
  visual, `.hawk-section-badge`) in both the result row and the preview header — opt-in by
  presence, not a new config flag, same pattern as the anchor/section badge already has.
- Counter text: `matchingResults`/`entries` (the `strings` functions from `plan-hawk-prd.md` §5)
  gain a second argument, page count, alongside the existing flattened-row count:
  `matchingResults: (count, pageCount) => ...`. **This changes the function signature** for any
  consumer who already overrode `strings.matchingResults`/`entries` — see Open Question 4. Default
  implementations stay single-argument-compatible (`(count) => ...` still works, `pageCount` is
  just an unused second parameter for anyone who doesn't care).

## 11. Non-goals for this pass

- A real Pagefind logo asset — text-only attribution for now (Open Question 2).
- Full markdown-renderer replacement — §2 is an *escape hatch* (dev brings their own CSS), not a
  new rendering pipeline.
- Anything in typeflow/lume — still out of scope per the standing instruction to finish hawk
  first.

## Open questions (need your call before I implement)

1. **§3, modal/trigger "kind."** Your wording ("some search bars are just small input windows
   with Ctrl+K... or normal size ones... compact, minimal, default") reads to me as wanting a
   **built-in trigger element** hawk can render (icon-only / pill / full search-bar-with-hint),
   which is a different thing from `density` (which already exists and sizes the *opened* modal,
   not the closed trigger). Is that the right read, or did you mean something narrower — e.g. just
   renaming `density`'s `'medium'` to `'default'` and adding a 4th `'minimal'` density level to
   the *modal itself*? I've spec'd the trigger-element reading above since it seems to match "small
   input window" language, but it's a materially bigger addition (a whole new rendered component)
   than a 4th density value, so I want to confirm before building the bigger one.
2. **§4, powered-by logo.** Proposing text-only ("Search powered by Pagefind", linking to
   pagefind.app) since I don't have a Pagefind logo asset to vendor and don't want to guess at
   one. If you want an actual logo mark, point me at an asset (or confirm using Pagefind's public
   brand SVG, if they publish one) and I'll wire it in instead.
3. **§9, inline filters default.** Proposing `inlineFilters: false` by default because turning it
   on changes how a literal colon in a normal query behaves (`"ratio: 16:9"` would get `ratio:`
   parsed as a filter attempt) — a behavior change a site should opt into deliberately, not get for
   free on upgrade. Agree, or should it default on?
4. **§10, `strings.matchingResults`/`entries` signature change.** Adding a second `pageCount`
   parameter is additive/non-breaking for anyone using the defaults, but breaking for anyone who
   already wrote a custom single-argument override function (mismatched arity — the function
   still gets called, `pageCount` is just ignored, so it's not a hard break, but I want to flag it
   explicitly since `plan-hawk-prd.md` shipped this exact function shape a few phases ago).

## Implementation plan (phased, pending review + your answers above)

1. Font tokens + `theme.tokens` (§1) + markdown-override escape hatch (§2) — smallest, most
   self-contained, no open questions blocking it.
2. Scrollbar theming (§6) + mark-highlight tokens (§8) — pure CSS/token work, no open questions.
3. Rotating placeholder via `rotatePlaceholder` (§7) — depends on nothing above, no open questions.
4. Metadata exposure (§10) — depends on your answer to Open Question 4 for the `strings` signature.
5. Powered-by attribution (§4) — depends on Open Question 2.
6. Pin system (§5) — biggest net-new subsystem, no open questions blocking the design, but
   sequenced after the smaller wins so review-and-implement isn't blocked waiting on it.
7. Inline filter syntax (§9) — depends on Open Question 3.
8. Trigger element (§3) — depends on Open Question 1; sequenced last since it's the least certain.

Each phase: implement in `src/hawk.js`/`hawk.css`/`hawk.d.ts`, extend `tests/hawk.test.js` +
(where a real browser matters — scrollbar visuals, rotating placeholder timing) `tests/e2e/`,
`npm run check:quality` green, then update `README.md`, the relevant `docs/content/` page(s), and
a `CHANGELOG.md` entry per phase — per your instruction to keep docs/README/changelog current as
this lands, not as one pass at the end.
