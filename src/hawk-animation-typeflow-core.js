/**
 * @fileoverview Registry-neutral implementation of Hawk's TypeFlow animation adapter.
 * Runtime-specific entrypoints inject the TypeFlow singleton so npm and JSR can resolve
 * their native dependency specifiers independently.
 * @module hawk-animation-typeflow-core
 */

const DEFAULT_TITLE_CONFIG = {
  speed: 2,
  cursor: '',
  cursorBlink: false,
  typeStyle: 'zoom-in-space',
  direction: 'left',
  respectReducedMotion: true,
};

const DEFAULT_ANCHOR_TITLE_CONFIG = { ...DEFAULT_TITLE_CONFIG };

const DEFAULT_CONTENT_CONFIG = {
  html: true,
  typeStyle: 'zoom-in-space',
  direction: 'left',
  allowedTags: [
    'article', 'section', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'strong',
    'em', 'blockquote', 'p', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'details',
    'summary', 'figure', 'figcaption', 'mark', 'a', 'kbd', 'span', 'b', 'i',
    'br', 'hr', 'del',
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
 * @param {object} TypeFlow The TypeFlow singleton.
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
