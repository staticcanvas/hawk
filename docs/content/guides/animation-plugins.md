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
import { createHawkAnimationTypeflow } from '@staticcanvas/hawk/animation-typeflow';
import TypeFlow from '@staticcanvas/typeflow';

HawkSearch.registerAnimation('typeflow', createHawkAnimationTypeflow(TypeFlow));
new HawkSearch({ index: '/pagefind/', animation: 'typeflow' });
```

Omit `animation` to prefer `'typeflow'` when it's registered, falling back to `'instant'`
otherwise. Pass `animation: false` to force instant regardless.

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
