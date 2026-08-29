/**
 * @fileoverview Default theme plugin: the visual identity ported from typeflow's docs search
 * (docs/static/assets/docs.css). Theme "application" is intentionally lightweight — it stamps
 * a `data-hawk-theme` attribute hawk's structural CSS and this theme's own stylesheet
 * (hawk-theme-typeflow.css) both key off; the actual colors live in that CSS file's custom
 * properties, loaded separately by the consumer (matches the org's existing "./css" subpath
 * export convention, e.g. lume's package.json `"./css": "./src/lume.css"`), not injected here.
 * @module hawk-theme-typeflow
 */

/** @typedef {{name: string, apply: (rootEl: HTMLElement) => void}} HawkTheme */

/** @type {HawkTheme} */
export const HawkThemeTypeflow = {
  name: 'typeflow',
  apply(rootEl) {
    rootEl.dataset.hawkTheme = 'typeflow';
  },
};

if (typeof window !== 'undefined') {
  window.HawkThemeTypeflow = HawkThemeTypeflow;
  // Self-registers when loaded after hawk.js (script-tag order: hawk.js, then this file) so
  // `new Hawk({ index })` gets the typeflow theme with no explicit registerTheme call — see
  // architecture/plugin-system.md's "Two ways to use a plugin".
  window.Hawk?.registerTheme?.('typeflow', HawkThemeTypeflow);
}

export default HawkThemeTypeflow;
