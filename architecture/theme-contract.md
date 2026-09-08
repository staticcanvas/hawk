# Theme contract

A theme is two things:

1. A **CSS file** that defines `--hawk-*` custom properties, scoped under a
   `[data-hawk-theme="<name>"]` attribute selector so multiple themes can be loaded on the same
   page without clobbering each other (see `src/hawk-theme-typeflow.css` for the reference
   implementation).
2. A **plugin object** matching this shape:

   ```ts
   interface HawkTheme {
     name: string;
     apply(rootEl: HTMLElement): void;
     tokens?: Record<string, string>;
   }
   ```

`apply()` runs once, when `HawkSearch` mounts (and again on the built-in trigger button, if
`config.trigger` is used — it renders outside `#root`, so it needs the same `data-hawk-theme`
attribute stamped on it separately to reach a theme's CSS-file tokens at all), and its only job
is to stamp `rootEl.dataset.hawkTheme = name` so the theme's CSS selector matches. It does **not**
inject the stylesheet itself — loading the CSS is the consumer's responsibility, via a `<link>`
tag or a bundler CSS import (`import '@staticcanvas/hawk/theme-typeflow/css'`). This matches the
existing org convention of a `"./css"` subpath export (lume's `package.json` exports
`"./css": "./src/lume.css"`) rather than runtime stylesheet injection, which is fragile across
the UMD/ESM/CJS builds hawk ships.

`tokens`, if present, is a JS-only alternative/supplement to a CSS file — applied as inline
`--hawk-*` custom property overrides on `apply()`'s target element. Useful for a one-off site
tweaking a few colors/fonts without writing a redistributable theme's worth of CSS.

## The token list

`hawk.css` (structural, ships with core) reads every color through a `--hawk-*` custom property
with a neutral fallback, so hawk renders (unstyled but usable) with zero theme loaded. A theme
only needs to redefine tokens — never hawk.css's structural rules.

| Token | Purpose |
| --- | --- |
| `--hawk-bg-canvas`, `--hawk-bg-surface`, `--hawk-bg-surface-elevated` | Background layers |
| `--hawk-border-subtle`, `--hawk-border-default`, `--hawk-border-strong` | Border weights |
| `--hawk-text-primary`, `--hawk-text-secondary`, `--hawk-text-muted` | Text hierarchy |
| `--hawk-accent`, `--hawk-accent-dim`, `--hawk-accent-glow` | Primary accent (selection, match highlight, active filter pill) |
| `--hawk-accent-alt`, `--hawk-accent-alt-dim`, `--hawk-accent-alt-glow` | Secondary accent (anchor/section badge) |
| `--hawk-backdrop` | Modal backdrop overlay color |
| `--hawk-preview-bg` | Preview pane background |
| `--hawk-shadow`, `--hawk-radius` | Dialog chrome |
| `--hawk-font-family`, `--hawk-font-size-base` | Typography, set on `.hawk-modal-dialog` |
| `--hawk-mark-bg`, `--hawk-mark-color`, `--hawk-mark-weight`, `--hawk-mark-style` | Search-match `<mark>` styling (`-bg` falls back to `--hawk-accent-glow`) |
| `--hawk-scrollbar-thumb`, `--hawk-scrollbar-thumb-active` | Results/preview/filter-strip scrollbars (idle / hover-or-scrolling — the active state is Blink/WebKit-only) |
| `--hawk-powered-by-color`, `--hawk-powered-by-opacity` | The "Search powered by Pagefind" attribution link |

## A known bug this contract exists to prevent

The original typeflow docs search (which this package was ported from) hardcoded several brand
hex values directly in CSS rules (`#ff6b2b`, `#38bdf8`, and their light-theme equivalents) instead
of reading `--tf-accent-orange`/`--tf-accent`, and `--tf-text-secondary` had no dark-mode default
at all (only defined under `[data-theme="light"]`, silently inheriting the wrong color in dark
mode everywhere it was used). `hawk.css` never hardcodes a color — every single one goes through
a token — specifically so a theme swap is guaranteed complete, and `hawk-theme-typeflow.css`
defines `--hawk-text-secondary` in its base (dark) block, not only under `[data-theme="light"]`.
