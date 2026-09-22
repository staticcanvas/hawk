---
title: Theming
description: The token contract hawk themes implement, and how to write your own.
eyebrow: Guide
category: Guides
tags:
  - theming
  - css tokens
  - javascript tokens
  - theme with javascript
  - customize theme
  - custom properties
  - dark mode
  - light mode
related:
  - /themes
  - /playground
  - /api
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

## Light, dark, and Dark Reader

The Typeflow theme is dark-first. It switches to its light palette when an ancestor has
`data-theme="light"`; `data-theme="dark"` keeps the dark palette authoritative. If the host has
not declared either value, Typeflow follows `prefers-color-scheme` automatically.

Sites that already provide a complete light/dark theme can prevent Dark Reader from recoloring
Hawk and the surrounding interface a second time:

```html
<meta name="color-scheme" content="dark light">
<meta name="darkreader-lock">
```

Place both elements in `<head>` before stylesheets. Hawk's documentation uses this arrangement so
the page, sticky header, search modal, and browser-native controls remain on the same palette.

## Token list

`hawk.css` (structural, ships with core) reads every color through a `--hawk-*` custom property
with a neutral fallback, so hawk renders — unstyled but usable — with zero theme loaded. A theme
only needs to redefine tokens:

| Group | Token | Controls |
|---|---|---|
| Canvas | `--hawk-bg-canvas` | Base canvas behind Hawk surfaces. |
| Canvas | `--hawk-bg-surface` | Dialog, header, filters, footer, and result surfaces. |
| Canvas | `--hawk-bg-surface-elevated` | Elevated controls and selected states. |
| Border | `--hawk-border-subtle` | Internal separators and quiet outlines. |
| Border | `--hawk-border-default` | Dialog and interactive-control borders. |
| Border | `--hawk-border-strong` | Hover, focus, and stronger separators. |
| Text | `--hawk-text-primary` | Titles and primary content. |
| Text | `--hawk-text-secondary` | Descriptions and supporting content. |
| Text | `--hawk-text-muted` | Hints, dates, and inactive controls. |
| Accent | `--hawk-accent` | Primary interactive and selected-state color. |
| Accent | `--hawk-accent-dim` | Low-emphasis accent surface. |
| Accent | `--hawk-accent-glow` | Accent glow and default match background. |
| Accent | `--hawk-accent-alt` | Secondary accent. |
| Accent | `--hawk-accent-alt-dim` | Low-emphasis secondary accent surface. |
| Accent | `--hawk-accent-alt-glow` | Secondary accent glow. |
| Overlay | `--hawk-backdrop` | Viewport backdrop behind the dialog; `config.backdrop.color` sets this per-instance. |
| Overlay | `--hawk-backdrop-gradient` | Replaces `--hawk-backdrop` when set; `config.backdrop.gradient` sets this per-instance. |
| Overlay | `--hawk-backdrop-opacity` | Backdrop opacity; `config.backdrop.opacity` sets this per-instance. |
| Overlay | `--hawk-backdrop-blur` | Backdrop `backdrop-filter` blur radius; `config.backdrop.blur` sets this per-instance. |
| Overlay | `--hawk-dialog-blur` | The dialog's own `backdrop-filter` — `none` unless a translucent theme wants the dialog itself to keep reading page content behind it. |
| Overlay | `--hawk-preview-bg` | Preview-column background. |
| Shape | `--hawk-shadow` | Dialog shadow. |
| Shape | `--hawk-radius` | Dialog corner radius. |
| Typography | `--hawk-font-family` | Font stack used by Hawk. |
| Typography | `--hawk-font-size-base` | Base type size. |
| Match | `--hawk-mark-bg` | Highlight background; falls back to `--hawk-accent-glow`. |
| Match | `--hawk-mark-color` | Highlighted text color. |
| Match | `--hawk-mark-weight` | Highlighted text weight. |
| Match | `--hawk-mark-style` | Highlighted text style. |
| Scrollbar | `--hawk-scrollbar-thumb` | Idle results, preview, and filter scrollbar thumb. |
| Scrollbar | `--hawk-scrollbar-thumb-active` | Active thumb in Blink/WebKit; Firefox has no separate hover state. |
| Attribution | `--hawk-powered-by-color` | Powered-by link color. |
| Attribution | `--hawk-powered-by-opacity` | Powered-by link opacity. |
| Result | `--hawk-result-date-font-family` | Result date font; falls back to `--hawk-font-family`. |
| Result | `--hawk-result-date-opacity` | Result date opacity — lower it to read as quieter/secondary metadata. |
| Result | `--hawk-result-accent` | Set inline per result row by `config.resultAccentColors`; colors title/tags/badges uniformly for that row. |
| Result | `--hawk-tag-accent` | Set inline per tag by `config.tagAccentColors`; falls back to `--hawk-result-accent`, then `--hawk-accent`. |
| Shape | `--hawk-corner-shape` | Chromium-only corner interpolation (`corner-shape`); defaults to `squircle` where supported. |

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

## Gallery preset CSS files

Every theme shown in the [gallery]({{< relref "/themes" >}}) — built-in and palette-template alike
— also ships as its own tiny, standalone CSS file at `assets/themes/<id>.css` (e.g.
`assets/themes/simple-dark.css`), generated from that theme's tokens by
`scripts/generate-theme-css.mjs`. Each file only ever contains one theme's `--hawk-*` properties
scoped under `[data-hawk-theme-preset='<id>']` (typically well under 1&nbsp;KB), so linking one
costs nothing for the other thirteen:

```html
<link rel="stylesheet" href="/assets/themes/simple-dark.css">
```

```js
theme: {
  name: 'simple-dark',
  apply(el) {
    el.dataset.hawkTheme = 'typeflow'; // structural base — see "The contract" above
    el.dataset.hawkThemePreset = 'simple-dark'; // matches the linked file's selector
  },
}
```

These files are generated, not hand-authored — re-run `npm run themes:css` after changing a
theme's tokens in `HAWK_GALLERY_THEMES` or a `theme-templates/*.json` palette, rather than editing
a file under `assets/themes/` directly.

## Registering a theme

```js
import { HawkSearch } from '@staticcanvas/hawk';
import { HawkThemeTypeflow } from '@staticcanvas/hawk/theme-typeflow';

HawkSearch.registerTheme('typeflow', HawkThemeTypeflow);
new HawkSearch({ index: '/pagefind/', theme: 'typeflow' });
```

Or pass a theme object directly without registering it by name — `theme: HawkThemeTypeflow` works
too.
