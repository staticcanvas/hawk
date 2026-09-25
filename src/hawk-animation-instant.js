/**
 * @fileoverview Zero-dependency animation driver: the default when no animation plugin is
 * configured, and the fallback hawk uses automatically when TypeFlow isn't available at
 * runtime. Implements the same driver contract as hawk-animation-typeflow.js with direct,
 * instant DOM writes instead of typewriter effects.
 * @module hawk-animation-instant
 */

/**
 * @typedef {object} HawkAnimationDriver
 * @property {(el: HTMLElement, text: string, options?: {isAnchor?: boolean}) => unknown} typeTitle
 *   Renders a result title.
 * @property {(el: HTMLElement, html: string, options?: Record<string, unknown>) => unknown} typeContent
 *   Renders result-preview HTML.
 * @property {(el: HTMLElement, strings: string[], options?: Record<string, unknown>) => unknown} rotatePlaceholder
 *   Shows the first configured placeholder.
 * @property {(controller: unknown) => void} stop Stops an active controller when applicable.
 */

/** Instant, synchronous fallback implementation of the Hawk animation contract. @type {HawkAnimationDriver} */
export const HawkAnimationInstant = {
  typeTitle(el, text) {
    el.textContent = text;
    return null;
  },
  typeContent(el, html) {
    el.innerHTML = html;
    return null;
  },
  rotatePlaceholder(el, strings) {
    el.textContent = strings?.[0] ?? '';
    return null;
  },
  stop() {
    // No controllers to tear down — writes are synchronous.
  },
};

if (typeof window !== 'undefined') {
  window.HawkAnimationInstant = HawkAnimationInstant;
}

export default HawkAnimationInstant;
