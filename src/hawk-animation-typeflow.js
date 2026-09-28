/* @ts-self-types="./hawk-animation-typeflow.d.ts" */

import TypeFlow from '@staticcanvas/typeflow';
import { createHawkAnimationTypeflow } from './hawk-animation-typeflow-core.js';

/**
 * @fileoverview Optional animation driver backed by @staticcanvas/typeflow's typewriter
 * engine. Implements the same driver contract as hawk-animation-instant.js. TypeFlow is never
 * imported only by this optional adapter entry, so hawk's core bundle remains independent while
 * consumers of `@staticcanvas/hawk/animation-typeflow` get a ready-to-use official integration.
 * The factory still accepts an explicit TypeFlow-compatible instance for custom wiring and tests.
 *
 * Every surface uses Hawk's explicit spatial baseline instead of TypeFlow's own library default
 * (`char`) — `char` and `scramble` are the most computationally expensive
 * typeStyle values (a per-character DOM update, or a full string re-render, on every tick), so
 * they have a practical minimum speed below which frames start dropping. At Hawk's own default
 * 2ms speed they're liable to look choppy rather than smooth, so none of the defaults below use
 * them. The baseline is `zoom-in-space`, left-to-right, 2ms, with no cursor; all values remain
 * overridable. `char` and `scramble` remain available by passing either value explicitly via
 * `options`, for anyone who wants that effect and is prepared to raise `speed` accordingly.
 * Every config is overridable via `options`.
 * @module hawk-animation-typeflow
 */

/** Ready-to-use driver backed by the released `@staticcanvas/typeflow` package. */
export const HawkAnimationTypeflow = createHawkAnimationTypeflow(TypeFlow);
export { createHawkAnimationTypeflow };

if (typeof window !== 'undefined') {
  window.HawkAnimationTypeflow = {
    ...HawkAnimationTypeflow,
    create: createHawkAnimationTypeflow,
  };
  // Self-registers when loaded after hawk.js (script-tag order: hawk.js, typeflow.js, then this
  // file for UMD, whose external import resolves from the TypeFlow global) so `new Hawk({ index })`
  // gets the typeflow animation driver
  // with no explicit registerAnimation call — see architecture/plugin-system.md's "Two ways to
  // use a plugin". ESM/bundler consumers can pass the exported HawkAnimationTypeflow driver
  // directly, without relying on global registration or wiring the TypeFlow singleton by hand.
  if (window.Hawk) {
    window.Hawk.registerAnimation('typeflow', HawkAnimationTypeflow);
  }
}

export default createHawkAnimationTypeflow;
