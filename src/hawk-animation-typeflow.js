/* @ts-self-types="./hawk-animation-typeflow.d.ts" */

import TypeFlow from '@staticcanvas/typeflow';

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

const DEFAULT_TITLE_CONFIG = {
  speed: 2,
  cursor: '',
  cursorBlink: false,
  typeStyle: 'zoom-in-space',
  direction: 'left',
  respectReducedMotion: true,
};

const DEFAULT_ANCHOR_TITLE_CONFIG = {
  ...DEFAULT_TITLE_CONFIG,
};

const DEFAULT_CONTENT_CONFIG = {
  html: true,
  typeStyle: 'zoom-in-space',
  direction: 'left',
  allowedTags: [
    'article',
    'section',
    'div',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'pre',
    'code',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'strong',
    'em',
    'blockquote',
    'p',
    'ul',
    'ol',
    'li',
    'dl',
    'dt',
    'dd',
    'details',
    'summary',
    'figure',
    'figcaption',
    'mark',
    'a',
    'kbd',
    'span',
    'b',
    'i',
    'br',
    'hr',
    'del',
  ],
  speed: 2,
  cursor: '',
  respectReducedMotion: true,
};

const DEFAULT_ROTATE_CONFIG = {
  holdDuration: 3000,
  pauseBetween: 200,
  respectReducedMotion: true,
  typeConfig: {
    speed: 2,
    cursor: '',
    cursorBlink: false,
    typeStyle: 'zoom-in-space',
    direction: 'left',
  },
  eraseConfig: { speed: 2, eraseStyle: 'end' },
};

/**
 * Builds an animation driver backed by a running TypeFlow instance.
 * @param {object} TypeFlow The TypeFlow singleton (e.g. `import TypeFlow from '@staticcanvas/typeflow'`).
 * @param {object} [options] Overrides merged into the default title/content/rotate configs.
 * @param {object} [options.title] TypeFlow config for plain (non-anchor) title typing.
 * @param {object} [options.anchorTitle] TypeFlow config for anchor/section title typing.
 * @param {object} [options.content] TypeFlow config for preview content typing.
 * @param {object} [options.rotate] TypeFlow rotate config for placeholder rotation.
 * @returns {import('./hawk-animation-instant.js').HawkAnimationDriver}
 */
export function createHawkAnimationTypeflow(TypeFlow, options = {}) {
  if (!TypeFlow || typeof TypeFlow.type !== 'function') {
    throw new Error('createHawkAnimationTypeflow requires a running TypeFlow instance.');
  }

  const titleConfig = { ...DEFAULT_TITLE_CONFIG, ...options.title };
  const anchorTitleConfig = { ...DEFAULT_ANCHOR_TITLE_CONFIG, ...options.anchorTitle };
  const contentConfig = { ...DEFAULT_CONTENT_CONFIG, ...options.content };
  const rotateConfig = {
    ...DEFAULT_ROTATE_CONFIG,
    ...options.rotate,
    typeConfig: { ...DEFAULT_ROTATE_CONFIG.typeConfig, ...options.rotate?.typeConfig },
    eraseConfig: { ...DEFAULT_ROTATE_CONFIG.eraseConfig, ...options.rotate?.eraseConfig },
  };

  return {
    typeTitle(el, text, { isAnchor = false } = {}) {
      return TypeFlow.type(el, text, isAnchor ? anchorTitleConfig : titleConfig);
    },
    typeContent(el, html) {
      return TypeFlow.type(el, html, contentConfig);
    },
    rotatePlaceholder(el, strings) {
      return TypeFlow.rotate(el, strings, rotateConfig);
    },
    stop(controller) {
      controller?.stop?.();
    },
  };
}

/** Ready-to-use driver backed by the released `@staticcanvas/typeflow` package. */
export const HawkAnimationTypeflow = createHawkAnimationTypeflow(TypeFlow);

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
