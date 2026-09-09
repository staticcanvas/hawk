---
title: Animation Plugins
description: The reveal-animation driver contract, the built-in drivers, and how to write your own.
eyebrow: Guide
category: Guides
---

## The contract

An animation driver controls how the preview pane's title/content reveal, and how an optional
header placeholder rotates:

```ts
interface HawkAnimationDriver {
  typeTitle(el, text, options?: { isAnchor?: boolean }): unknown;
  typeContent(el, html, options?): unknown;
  rotatePlaceholder(el, strings, options?): unknown;
  stop(controller): void;
}
```

`typeTitle`/`typeContent`/`rotatePlaceholder` may return a controller (anything with whatever
shape the driver itself understands) or `null`. Hawk never inspects it — it only ever passes it
back into `stop()`, which runs before every preview re-render and on `destroy()`.

## Built-in drivers

- **`instant`** (default, zero dependencies) — direct `textContent`/`innerHTML` writes.
- **`typeflow`** — wraps `TypeFlow.type()` / `TypeFlow.rotate()`. Anchor/section titles
  scramble-decode; page titles type plainly; preview content types HTML-aware.

```js
import { HawkSearch } from '@staticcanvas/hawk';
import { HawkAnimationTypeflow } from '@staticcanvas/hawk/animation-typeflow';

HawkSearch.registerAnimation('typeflow', HawkAnimationTypeflow);
new HawkSearch({ index: '/pagefind/', animation: 'typeflow' });
```

The adapter imports the released `@staticcanvas/typeflow` package directly. For advanced
configuration, `createHawkAnimationTypeflow(TypeFlow, options)` remains available as a factory.

### TypeFlow reveal styles

The factory accepts complete TypeFlow configuration objects for `title`, `anchorTitle`,
`content`, and the rotating placeholder's nested `typeConfig` and `eraseConfig`.

| Style | Supported surfaces | Behaviour |
|---|---|---|
| `char` | Type | Character-by-character reveal. |
| `word` | Type | Word-by-word reveal. |
| `scramble` | Type and erase | Resolves text through a configurable glyph set. |
| `fade-trail` | Type and erase | Adds a trailing opacity ramp. |
| `word-fade` | Type and erase | Fades words without changing their final layout. |
| `float-in-top`, `float-in-bottom` | Type and erase | Moves words vertically while changing opacity. |
| `float-in-left`, `float-in-right` | Type and erase | Moves words horizontally while changing opacity. |
| `zoom-in-space` | Type and erase | Uses perspective depth and scale. |
| `end`, `start`, `center`, `fade`, `instant` | Erase | Additional erase-only strategies. |

```js
import TypeFlow from '@staticcanvas/typeflow';
import { createHawkAnimationTypeflow } from '@staticcanvas/hawk/animation-typeflow';

const animation = createHawkAnimationTypeflow(TypeFlow, {
  title: { typeStyle: 'word-fade', direction: 'center' },
  anchorTitle: { typeStyle: 'zoom-in-space', wordOrder: 'random' },
  content: { typeStyle: 'float-in-bottom', wordMotionDistance: 18 },
  rotate: {
    typeConfig: { typeStyle: 'fade-trail' },
    eraseConfig: { eraseStyle: 'float-in-top' },
  },
});

HawkSearch.registerAnimation('typeflow-spatial', animation);
new HawkSearch({ index: '/pagefind/', animation: 'typeflow-spatial' });
```

Omit `animation` to prefer `'typeflow'` when it's registered, falling back to `'instant'`
otherwise. Pass `animation: false` to force instant regardless.

## Rotating placeholder text

`rotatePlaceholder` sat in the contract unused by core until `config.rotatingPlaceholders` wired
it up:

```js
new HawkSearch({
  index: '/pagefind/',
  rotatingPlaceholders: ['Try "getting started"...', 'Try "tabs"...', 'Try "theming"...'],
});
```

Cycles through the list in a `.hawk-input-ghost` overlay positioned over the search input — a
native `<input>` `placeholder` attribute can't be typed character-by-character by a driver, since
it's browser-rendered, not a DOM node. Only runs while the modal is open and the input is empty;
never in the background while closed, and stops the instant there's real input value. With the
`instant` driver, "rotating" just shows the first string statically (no timers) — real cycling
needs the `typeflow` driver.

## Writing your own

Any object implementing the four methods works. A CSS-fade driver in a few lines:

```js
HawkSearch.registerAnimation('fade', {
  typeTitle(el, text) {
    el.style.opacity = 0;
    el.textContent = text;
    requestAnimationFrame(() => {
      el.style.transition = 'opacity .2s';
      el.style.opacity = 1;
    });
    return null;
  },
  typeContent(el, html) {
    el.innerHTML = html;
    return null;
  },
  rotatePlaceholder(el, strings) {
    el.textContent = strings[0] ?? '';
    return null;
  },
  stop() {},
});
```
