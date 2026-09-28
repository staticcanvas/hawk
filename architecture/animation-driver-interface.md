# Animation driver interface

An animation driver defines how the preview pane's title/content get revealed and how the
(optional) header placeholder rotates. Hawk calls exactly four methods and never assumes
anything about how they're implemented — `hawk-animation-instant.js` writes text/HTML directly;
`hawk-animation-typeflow.js` wraps `TypeFlow.type()`/`TypeFlow.rotate()`.

```ts
interface HawkAnimationDriver {
  typeTitle(el: HTMLElement, text: string, options?: { isAnchor?: boolean }): unknown;
  typeContent(el: HTMLElement, html: string, options?: Record<string, unknown>): unknown;
  rotatePlaceholder(el: HTMLElement, strings: string[], options?: Record<string, unknown>): unknown;
  stop(controller: unknown): void;
}
```

- `typeTitle`/`typeContent`/`rotatePlaceholder` may return a **controller** (anything with a
  `.stop()` method the driver itself knows how to call back) or `null`. Hawk never inspects the
  controller directly — it only ever passes it back into `stop()`.
- `stop(controller)` is called before every re-render of the preview pane (so re-selecting a
  different result doesn't leave two typing animations racing into the same element) and on
  `destroy()`.
- `options.isAnchor` on `typeTitle` distinguishes a page-level result from an in-page section
  match (Pagefind's `sub_results`) — `hawk-animation-typeflow.js` uses this to pick
  scramble-decode vs. plain char-typing, but a driver is free to ignore it.
- `rotatePlaceholder` is called by core (`#updatePlaceholderVisibility`) when `config.rotatingPlaceholders`
  is set — targeting a `.hawk-input-ghost` overlay positioned over the search input, since a
  native `<input>` `placeholder` attribute can't be typed character-by-character. Only while the
  modal is open and the input is empty. See the API reference's
  [Rotating placeholder](../docs/content/api.md#rotating-placeholder) section.

## Why this shape

Ported directly from what typeflow's docs search already did in practice (see
`docs/static/assets/docs.js:1733-1809` in the typeflow repo) — it called `TypeFlow.type()` with
different configs for anchor vs. non-anchor titles, for HTML-aware content, and for the header
placeholder rotation, always stopping the previous controller before starting a new one. The
interface generalizes those four call sites so the typewriter engine isn't
hardwired in.

## Writing your own driver

Any object implementing the four methods works — you don't need typeflow at all. A minimal
driver that just wraps a CSS fade instead of `el.textContent =` is a handful of lines:

```js
HawkSearch.registerAnimation('fade', {
  typeTitle(el, text) {
    el.style.opacity = 0;
    el.textContent = text;
    requestAnimationFrame(() => (el.style.transition = 'opacity .2s', (el.style.opacity = 1)));
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
