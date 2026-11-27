/**
 * @fileoverview Zero-dependency animation driver: the default when no animation plugin is
 * configured, and the fallback hawk uses automatically when TypeFlow isn't available at
 * runtime. Implements the same driver interface as hawk-animation-typeflow.js with direct,
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

/** Instant, synchronous fallback implementation of the Hawk animation interface. @type {HawkAnimationDriver} */
export const HawkAnimationInstant = {
  /**
   * Writes a title synchronously as text; markup in the title is not interpreted.
   * @param {HTMLElement} el Result-title element owned by Hawk.
   * @param {string} text Plain page or anchor title.
   * @returns {null} No animation controller is created.
   */
  typeTitle(el, text) {
    el.textContent = text;
    return null;
  },
  /**
   * Writes preview HTML synchronously, preserving its structure and links.
   * @param {HTMLElement} el Preview-content container owned by Hawk.
   * @param {string} html Preview HTML prepared by the caller.
   * @returns {null} No animation controller is created.
   */
  typeContent(el, html) {
    el.innerHTML = html;
    return null;
  },
  /**
   * Shows the first placeholder as text without scheduling rotation timers.
   * @param {HTMLElement} el Placeholder overlay element owned by Hawk.
   * @param {string[]} strings Configured placeholders; an empty list clears the overlay.
   * @returns {null} No rotation controller is created.
   */
  rotatePlaceholder(el, strings) {
    el.textContent = strings?.[0] ?? '';
    return null;
  },
  /**
   * Accepts a previous controller without work because all writes are synchronous.
   * @param {unknown} _controller Previous driver return value, including null.
   * @returns {void}
   */
  stop(_controller) {
    // No controllers to tear down — writes are synchronous.
  },
};

if (typeof window !== 'undefined') {
  window.HawkAnimationInstant = HawkAnimationInstant;
}

export default HawkAnimationInstant;
