/**
 * @fileoverview Light/dark theme toggle for the docs site chrome.
 *
 * Reuses hawk-theme-typeflow.css's existing `[data-theme='light']` token overrides (already
 * shipped for the search modal) for the whole site's chrome too — no separate light-mode color
 * CSS needed in docs.css: every `--hawk-*` custom property docs.css reads inherits from `<html>`,
 * and hawk-theme-typeflow.css's light-mode selector already matches any `[data-theme='light']`
 * ancestor of the `[data-hawk-theme='typeflow']` element (`<body>` carries that attribute
 * already), so toggling `documentElement.dataset.theme` re-themes everything at once.
 *
 * The *initial* theme (before this module even loads) is set by a separate, deliberately tiny
 * inline `<script>` in `<head>` (baseof.html) that runs before first paint, so a returning
 * visitor's stored choice never flashes dark-then-light — this module only owns the toggle
 * button's behavior from here on, not the first-paint value.
 * @module theme-toggle
 */

/**
 * Applies a theme to the document root and syncs the toggle button's pressed state.
 * @param {'light'|'dark'} theme
 * @param {HTMLElement|null} toggleButton The `.theme-toggle` button, or `null` if absent.
 * @returns {void}
 * @example
 * applyTheme('light', document.querySelector('.theme-toggle'));
 */
function applyTheme(theme, toggleButton) {
  document.documentElement.dataset.theme = theme;
  if (toggleButton) toggleButton.setAttribute('aria-pressed', String(theme === 'light'));
}

const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next, themeToggle);
    try {
      localStorage.setItem('hawk-docs:theme', next);
    } catch {
      // private browsing / storage disabled — the choice still applies this session.
    }
  });
}
applyTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark', themeToggle);
