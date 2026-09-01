/**
 * @fileoverview Optional animation driver backed by @staticcanvas/typeflow's typewriter
 * engine. Implements the same driver contract as hawk-animation-instant.js. TypeFlow is never
 * hard-imported (matches this org's framework-adapter convention, e.g. createTypeFlowReact in
 * typeflow.js) — the running TypeFlow instance is passed in by the consumer (ESM) or read off
 * `window.TypeFlow` (script-tag, for self-registration below) — so hawk's core bundle never
 * depends on it, and this optional bundle only needs it at the point a consumer actually loads
 * this module.
 *
 * The specific type/scramble/rotate configs below are the defaults extracted from typeflow's
 * own docs search (docs/static/assets/docs.js) — anchor/section titles scramble-decode, page
 * titles type plainly, preview content types HTML-aware, and the header placeholder rotates.
 * Every config is overridable via `options`.
 * @module hawk-animation-typeflow
 */

const DEFAULT_TITLE_CONFIG = {
  speed: 2,
  cursor: '|',
  cursorBlink: false,
  respectReducedMotion: true,
};

const DEFAULT_ANCHOR_TITLE_CONFIG = {
  ...DEFAULT_TITLE_CONFIG,
  typeStyle: 'scramble',
  scrambleCharset: 'cyber',
  scrambleRounds: 1,
};

const DEFAULT_CONTENT_CONFIG = {
  html: true,
  allowedTags: [
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
  typeConfig: { speed: 2, cursor: '|', cursorBlink: true },
  eraseConfig: { speed: 2, eraseStyle: 'end' },
};

/**
 * Builds an animation driver backed by a running TypeFlow instance.
 * @param {object} TypeFlow The TypeFlow singleton (e.g. `import TypeFlow from '@staticcanvas/typeflow'`).
 * @param {object} [options] Overrides merged into the default title/content/rotate configs.
 * @param {object} [options.title] Overrides for plain (non-anchor) title typing.
 * @param {object} [options.anchorTitle] Overrides for anchor/section title scramble-decode typing.
 * @param {object} [options.content] Overrides for preview content typing.
 * @param {object} [options.rotate] Overrides for placeholder rotation.
 * @returns {import('./hawk-animation-instant.js').HawkAnimationDriver}
 */
export function createHawkAnimationTypeflow(TypeFlow, options = {}) {
  if (!TypeFlow || typeof TypeFlow.type !== 'function') {
    throw new Error('createHawkAnimationTypeflow requires a running TypeFlow instance.');
  }

  const titleConfig = { ...DEFAULT_TITLE_CONFIG, ...options.title };
  const anchorTitleConfig = { ...DEFAULT_ANCHOR_TITLE_CONFIG, ...options.anchorTitle };
  const contentConfig = { ...DEFAULT_CONTENT_CONFIG, ...options.content };
  const rotateConfig = { ...DEFAULT_ROTATE_CONFIG, ...options.rotate };

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

if (typeof window !== 'undefined') {
  window.HawkAnimationTypeflow = { create: createHawkAnimationTypeflow };
  // Self-registers when loaded after both hawk.js and typeflow.js (script-tag order: hawk.js,
  // typeflow.js, then this file) so `new Hawk({ index })` gets the typeflow animation driver
  // with no explicit registerAnimation call — see architecture/plugin-system.md's "Two ways to
  // use a plugin". Silently skipped if TypeFlow isn't loaded yet; ESM/bundler consumers still
  // call createHawkAnimationTypeflow(TypeFlow) themselves, since import order isn't guaranteed
  // there the way script-tag order is.
  if (window.TypeFlow && window.Hawk) {
    window.Hawk.registerAnimation('typeflow', createHawkAnimationTypeflow(window.TypeFlow));
  }
}

export default createHawkAnimationTypeflow;
