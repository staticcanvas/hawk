---
title: Theming
description: The token contract hawk themes implement, and how to write your own.
eyebrow: Guide
category: Guides
---

## The contract

A theme is two things: a CSS file that defines `--hawk-*` custom properties scoped under
`[data-hawk-theme="<name>"]`, and a small plugin object:

```js
{
  name: 'my-theme',
  apply(rootEl) {
    rootEl.dataset.hawkTheme = 'my-theme';
  },
}
```

`apply()` runs once when `HawkSearch` mounts. It doesn't inject the stylesheet — loading the CSS
is the consumer's job, via a `<link>` tag or `import '@staticcanvas/hawk/theme-typeflow/css'`.

## Token list

`hawk.css` (structural, ships with core) reads every color through a `--hawk-*` custom property
with a neutral fallback, so hawk renders — unstyled but usable — with zero theme loaded. A theme
only needs to redefine tokens:

**Color/chrome**: `--hawk-bg-canvas` · `--hawk-bg-surface` · `--hawk-bg-surface-elevated` ·
`--hawk-border-subtle` · `--hawk-border-default` · `--hawk-border-strong` · `--hawk-text-primary`
· `--hawk-text-secondary` · `--hawk-text-muted` · `--hawk-accent` · `--hawk-accent-dim` ·
`--hawk-accent-glow` · `--hawk-accent-alt` · `--hawk-accent-alt-dim` · `--hawk-accent-alt-glow` ·
`--hawk-backdrop` · `--hawk-preview-bg` · `--hawk-shadow` · `--hawk-radius`

**Type**: `--hawk-font-family` · `--hawk-font-size-base`

**Match highlighting**: `--hawk-mark-bg` (falls back to `--hawk-accent-glow`) · `--hawk-mark-color`
· `--hawk-mark-weight` · `--hawk-mark-style`

**Scrollbars** (results pane, preview pane, filter strip): `--hawk-scrollbar-thumb` (idle) ·
`--hawk-scrollbar-thumb-active` (hover/scrolling — Blink/WebKit only, `scrollbar-color` has no
separate hover state on Firefox/standards-track engines)

**Powered-by attribution**: `--hawk-powered-by-color` · `--hawk-powered-by-opacity`

## A JS-only theming path: `theme.tokens`

Writing a full CSS file is right for a redistributable theme, but heavyweight for tweaking a few
colors and a font for one site. A theme object can carry a `tokens` map instead — applied as
inline `--hawk-*` custom properties on `apply()`, no stylesheet needed:

```js
new HawkSearch({
  index: '/pagefind/',
  theme: {
    name: 'brand',
    apply(el) { el.dataset.hawkTheme = 'brand'; },
    tokens: { '--hawk-accent': '#22d3ee', '--hawk-font-family': '"Inter", sans-serif' },
  },
});
```

If `config.trigger` (see [API reference — Built-in trigger]({{< relref "/api" >}}#built-in-trigger))
is also used, the same `tokens`/`apply()` are applied to the trigger button too — it renders
outside the modal's root element, so it wouldn't otherwise inherit `#root`-scoped custom
properties from a theme's CSS file.

## Opting out of the built-in preview typography

`config.disableDefaultMarkdownStyles: true` turns off every `h1`-`h6`/`p`/`ul`/`table`/`code`/etc.
rule hawk.css defines for `.hawk-preview-content` — target that class with your own CSS instead
(an existing site-wide `.prose` class, for example) rather than out-specificity-ing hawk's rules.

## Registering a theme

```js
import { HawkSearch } from '@staticcanvas/hawk';
import { HawkThemeTypeflow } from '@staticcanvas/hawk/theme-typeflow';

HawkSearch.registerTheme('typeflow', HawkThemeTypeflow);
new HawkSearch({ index: '/pagefind/', theme: 'typeflow' });
```

Or pass a theme object directly without registering it by name — `theme: HawkThemeTypeflow` works
too.
