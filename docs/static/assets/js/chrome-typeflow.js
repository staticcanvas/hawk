/**
 * @fileoverview Types the table of contents and breadcrumb trail back in with TypeFlow, once per
 * page load. Both are already fully rendered, real, working navigation server-side — a failed or
 * slow module load, or `prefers-reduced-motion`, just leaves the original static content in
 * place rather than an empty element.
 *
 * Imports the raw `@staticcanvas/typeflow` singleton (resolved through the page's own import map
 * in baseof.html), not hawk's `createHawkAnimationTypeflow` wrapper — this is general page
 * chrome with nothing to do with the search modal, and the module is already loaded on every
 * page for `HawkAnimationTypeflow`'s own sake (site-search.js), so this adds no new network
 * request; the bare specifier just resolves to the same cached module.
 *
 * Typing the *container's* full `innerHTML` (an earlier version of this) broke both: passing
 * `<li>`/`<ul>` markup through TypeFlow's HTML mode silently dropped every `<li>`/`<ul>` wrapper
 * — parsed outside a real list's context, per HTML5's own parsing rules for those elements —
 * which is also why the breadcrumb "/" separators (a CSS `::after` on `li:not(:last-child)`)
 * vanished: no `<li>` siblings left for it to key off. It also made the TOC's animation easy to
 * miss entirely: reconstructing one large nested-list HTML string visibly took longer than the
 * page took to become interactive, so by the time anyone looked it had already finished (or was
 * still catching up) rather than reading as a deliberate effect. Typing each *link* individually
 * instead — TypeFlow only ever touches an `<a>`/`<span>`'s own content, never the `<li>`/`<ul>`
 * structure around it — fixes both: structure (and the CSS separator) survives untouched, and
 * each per-link animation is short enough to actually be seen.
 * @module chrome-typeflow
 */

import TypeFlow from '@staticcanvas/typeflow';

/**
 * Per-region TypeFlow config, keyed by `[data-typeflow-target]`'s value — each value is a plain
 * TypeFlow `type()` options object (`typeStyle`, `direction`, `speed`, `cursor`; see the released
 * `@staticcanvas/typeflow` package's own docs for the full option set). `html: true` is applied
 * per call below, scoped to one link's own markup (e.g. the Theming TOC entry's
 * `<code>theme.tokens</code>`) — never a list, so no list-parsing context is involved.
 * @type {Record<string, object>}
 */
const TYPEFLOW_CHROME_CONFIGS = {
  // float-in-left for the TOC specifically (vs. breadcrumbs' zoom-in-space) — requested
  // directly; the two are read as distinct chrome regions, not one repeated effect.
  toc: { typeStyle: 'float-in-left', direction: 'left', speed: 2, cursor: '' },
  breadcrumbs: { typeStyle: 'zoom-in-space', direction: 'left', speed: 2, cursor: '' },
};

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  document.querySelectorAll('[data-typeflow-target]').forEach((container) => {
    const config = TYPEFLOW_CHROME_CONFIGS[container.dataset.typeflowTarget];
    if (!config) return;
    container.querySelectorAll('a, span').forEach((link) => {
      TypeFlow.type(link, link.innerHTML, { ...config, html: true });
    });
  });
}
