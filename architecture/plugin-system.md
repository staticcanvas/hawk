# Plugin system

Hawk has two plugin kinds — **themes** and **animation drivers** — registered through the same
shape: a static `Map` on the `HawkSearch` class.

```js
HawkSearch.registerTheme(name, themeObject);
HawkSearch.registerAnimation(name, driverObject);
```

## Two ways to use a plugin

**Direct pass-in (bundler/ESM consumers, no global registration needed):**

```js
import { HawkSearch } from '@staticcanvas/hawk';
import { HawkThemeTypeflow } from '@staticcanvas/hawk/theme-typeflow';
import { HawkAnimationTypeflow } from '@staticcanvas/hawk/animation-typeflow';

new HawkSearch({
  index: '/pagefind/',
  theme: HawkThemeTypeflow,
  animation: HawkAnimationTypeflow,
});
```

**Script-tag / global registration:** each plugin module self-attaches to `window.Hawk<Name>` when
loaded, mirroring how `typeflow-metrics.js`/`typeflow-debug.js` attach `window.TypeFlowMetrics` /
`window.TypeFlowDebug`. In this load order, `hawk-theme-typeflow.js` and `hawk-animation-typeflow.js`
also *self-register* — `hawk-theme-typeflow.js` sees `window.Hawk` already set (from `hawk.js`
loading first) and calls `Hawk.registerTheme('typeflow', ...)` itself;
`hawk-animation-typeflow.js` does the same for `registerAnimation` once it also sees
`window.TypeFlow` (from `typeflow.js` loading before it). No manual registration calls needed for
this pairing:

```html
<script src=".../hawk.js"></script>
<script src=".../hawk-theme-typeflow.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@staticcanvas/typeflow@latest/dist/typeflow.js"></script>
<script src=".../hawk-animation-typeflow.js"></script>
<script>
  new Hawk({ index: '/pagefind/' }); // theme/animation already default to 'typeflow'
</script>
```

Self-registration is a script-tag convenience. For ESM/bundler imports, pass the ready driver
directly as in the example above, or register it explicitly when several instances share it.

## Why this shape, not an event bus

No `X.use()` / plugin-registry precedent exists anywhere else in this org (see
`README.md#why-no-hawkuse`). The closest existing convention is `TypeFlowEngine.active` — a
plain public `Map` extensions *read* from. Hawk's registries are the same shape, just *written to*
by plugins instead of read from by them. Lifecycle integration points a bare state map can't
replace (`onOpen`, `onClose`, `onSelect`) are plain config callbacks, not an event emitter —
kept deliberately minimal rather than growing into a general-purpose event system.

## Resolution order

`HawkSearch`'s `theme`/`animation` config accepts a registered name (string), a plugin object
directly, or is omitted:

- `theme` omitted → resolves to whatever is registered as `'typeflow'`, if anything (throws
  nothing — a theme is optional; hawk.css has neutral fallbacks for every color token).
- `animation` omitted → resolves to `'typeflow'` if registered, else falls back to the built-in
  `'instant'` driver. Passing `animation: false` forces `'instant'` even if a typeflow driver is
  registered.
