---
title: Density and keyboard navigation
description: Fit/medium/compact density modes, two-pane keyboard navigation, and initial popup state.
eyebrow: Guide
category: Guides
tags:
  - density
  - fit medium compact
  - keyboard navigation
  - layout
  - columns
related:
  - /api
  - /playground
---

## Density modes

`params.density` picks between three sizing presets:

```js
new HawkSearch({
  index: '/pagefind/',
  params: { density: 'fit' }, // 'fit' | 'medium' (default) | 'compact'
});
```

- `medium` — the default sizing (unchanged from before density existed): a fixed-size dialog,
  2 columns.
- `fit` — a near-viewport dialog (`96vw` / `92vh`), for a dedicated "search page" feel.
- `compact` — a smaller dialog, forced to a single column with the preview pane hidden by
  default — see [Reaching the preview pane in compact layouts](#reaching-the-preview-pane-in-compact-layouts).

Density composes with the existing `breakpoint`: whichever forces single-column wins, so a
`fit`/`medium` dialog still degrades gracefully on narrow viewports even without `compact`.

### The in-modal switcher

By default (`params.allowDensityToggle: true`) hawk renders a Fit/Medium/Compact button group in
the modal header, calling `search.setParams({ density })` internally. The visitor's last choice
persists to `localStorage` (`hawk:density`) and is read back on the next construction — unless
`config.params.density` is set explicitly, which always wins over a stored preference. Set
`allowDensityToggle: false` to fix density via config only and hide the switcher.

### Minimal and configurable header controls

`headerControls` controls the two groups to the right of the search input. Pass `false` for
a minimal header containing only the search bar:

```js
new HawkSearch({
  index: '/pagefind/',
  headerControls: false,
});
```

Or control the groups independently:

```js
new HawkSearch({
  index: '/pagefind/',
  headerControls: {
    density: false, // hide Fit / Medium / Compact
    escape: true,   // keep the Escape close button
  },
});
```

`params.allowDensityToggle: false` continues to disable density switching and therefore wins
even when `headerControls.density` is `true`. Hiding the Escape button does not disable the
Escape keyboard shortcut; use `hotkeys.escape: false` when the keyboard behavior must also be
disabled.

## Two-pane keyboard navigation

The modal's Tab order is: search input → filter tabs → results pane → preview pane → close. Both
panes are real focus stops (`tabindex="0"`), so this is reachable from a plain keyboard, not just
the mouse:

- **Input focused (default):** <kbd>↑</kbd>/<kbd>↓</kbd> move the selection, wrapping around;
  <kbd>Enter</kbd> navigates to the selected result.
- **Results pane focused:** identical <kbd>↑</kbd>/<kbd>↓</kbd>/<kbd>Enter</kbd> behavior. Typing
  any printable character refocuses the input and forwards the keystroke, so you can resume
  typing without an extra click.
- **Preview pane focused:** <kbd>↑</kbd>/<kbd>↓</kbd>/<kbd>PgUp</kbd>/<kbd>PgDn</kbd>/<kbd>Home</kbd>/<kbd>End</kbd>
  scroll its content instead of changing selection.

The results pane exposes the current selection via `aria-activedescendant` rather than making
every result individually tabbable (the correct pattern for its `role="listbox"`), so pressing
<kbd>Tab</kbd> moves from "the list" to "the preview" in one step regardless of how many results
are showing.

### Reaching the preview pane in compact layouts

In `compact` density (or below `breakpoint`), only one column is shown and the preview pane is
hidden by default — there's nowhere to put it next to the results. Tabbing into the preview pane
reveals it in place of the results pane (`[data-hawk-show-preview]`); tabbing or clicking away
hides it again. This is the only way to reach the preview in a single-column layout — there's no
separate "view result" button.

### Scrollbars

The results pane, preview pane, and filter strip all get a themed scrollbar (thin, low-opacity at
rest, brightening on hover *or* while actively scrolling — see
[Theming — token list]({{< relref "/guides/theming" >}}#token-list) for
`--hawk-scrollbar-thumb`/`-active`). The scroll trigger fires on a `scroll` event regardless of
cause, so keyboard-driven scrolling (arrow keys in the preview pane) lights it up the same as a
mouse wheel, fading back to idle ~500ms after the last scroll. Both the hover and scroll triggers
are Blink/WebKit-only (`::-webkit-scrollbar-thumb`) — the standards-track `scrollbar-color`
property Firefox uses doesn't support a separate hover/active state, so there the thumb stays at
its idle color throughout.

## Initial popup state

Three config keys shape what the modal shows the instant it opens, before the visitor has typed
or clicked anything:

```js
new HawkSearch({
  index: '/pagefind/',
  defaultTab: 'guides', // active tab on open — see the API reference's Tabs section
  defaultPreviewUrl: '/getting-started/',
  defaultPreviewTitle: 'Getting started',
  eagerResults: true, // default — set false to keep the results pane empty until the visitor types
});
```

- **`defaultPreviewUrl`** shows a specific page's content in the preview pane as soon as the
  modal mounts — before Pagefind even loads, let alone before anything is selected. It uses the
  same fetch/extract path a real selection uses ([Rich preview content]({{< relref "/api" >}}#rich-preview-content)),
  so it's real rendered page content. A real result — from a click, a keyboard selection, or an
  `eagerResults` listing — replaces it automatically.
- **`eagerResults`** (default `true`) runs an empty-query search as soon as Pagefind loads, so
  the results pane shows a default listing instead of "Type to search". This is a behavior
  change from hawk's very first releases, where the results pane stayed empty until the first
  keystroke — set `eagerResults: false` to keep that behavior.
- **`defaultTab`** is documented in [API reference — Tabs]({{< relref "/api" >}}#tabs); it also
  determines which tab's `filter` scopes the `eagerResults` listing.
