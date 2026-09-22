/**
 * @fileoverview Interaction behind every copyable code example on the site: the splash page's
 * install-tabs widget (`[data-install-tabs]`), its per-panel copy buttons (`[data-copy-text]`,
 * shared by the install tabs and the "Minimal usage" block), and the generic copy button appended
 * to every syntax-highlighted `<pre>` in article content (`.doc-content .highlight`). Grouped in
 * one file because all three are "click to copy or switch a code sample," not because they share
 * any state.
 * @module code-examples
 */

// ── Install tabs ────────────────────────────────────────────────────────────────────────────
// A generic ARIA tablist implementation — works for any tab count, arrow-key/Home/End navigation
// included — reused as-is by every `[data-install-tabs]` group on the page (currently one, the
// splash page's npm/pnpm/bun/ESM/UMD/jsDelivr switcher).
document.querySelectorAll('[data-install-tabs]').forEach((tabs) => {
  const tabList = tabs.querySelector('[role="tablist"]');
  const tabButtons = Array.from(tabList.querySelectorAll('[role="tab"]'));

  /**
   * Selects `nextTab`: updates every tab's `aria-selected`/`tabindex` and shows only its panel.
   * @param {HTMLElement} nextTab
   * @param {boolean} [focus] Move keyboard focus to `nextTab` (arrow-key navigation does; a
   *   plain click doesn't need to, the click itself already moved focus).
   * @returns {void}
   */
  function activateTab(nextTab, focus = false) {
    tabButtons.forEach((tab) => {
      const selected = tab === nextTab;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
    });
    if (focus) nextTab.focus();
  }

  tabButtons.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? tabButtons.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabButtons.length) % tabButtons.length;
      activateTab(tabButtons[nextIndex], true);
    });
  });
});

// ── Copy buttons: install tabs + the minimal-usage block ──────────────────────────────────
// Both are marked [data-copy-text] with the literal string to copy — generic, so neither surface
// needs its own per-panel copy logic.
document.querySelectorAll('[data-copy-text]').forEach((button) => {
  const defaultLabel = button.textContent;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copyText);
      button.textContent = 'Copied';
      button.classList.add('is-copied');
    } catch {
      button.textContent = 'Copy failed';
    }
    setTimeout(() => {
      button.textContent = defaultLabel;
      button.classList.remove('is-copied');
    }, 1600);
  });
});

// ── Code-block copy controls ────────────────────────────────────────────────────────────────
// Appends a "Copy" button to every syntax-highlighted block in article content. Unlike the
// install-tabs buttons above (a fixed literal string), this reads the block's own live
// `textContent` at click time, so it works for any Hugo-rendered `.highlight` block without
// per-block wiring.

/**
 * Copies `text` to the clipboard, falling back to a hidden `<textarea>` +
 * `document.execCommand('copy')` when the async Clipboard API is unavailable (older browsers, or
 * an insecure/non-HTTPS context).
 * @param {string} text
 * @returns {Promise<void>}
 * @throws {Error} If both the Clipboard API and the fallback `execCommand` fail.
 */
async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const fallback = document.createElement('textarea');
  fallback.value = text;
  fallback.setAttribute('readonly', '');
  fallback.style.position = 'fixed';
  fallback.style.opacity = '0';
  document.body.appendChild(fallback);
  fallback.select();
  const copied = document.execCommand('copy');
  fallback.remove();
  if (!copied) throw new Error('Copy command failed');
}

document.querySelectorAll('.doc-content .highlight').forEach((block) => {
  const code = block.querySelector('pre code');
  if (!code || block.querySelector('.code-copy-btn')) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'code-copy-btn';
  button.textContent = 'Copy';
  button.setAttribute('aria-label', 'Copy code');
  button.addEventListener('click', async () => {
    clearTimeout(button._copyResetTimer);
    try {
      await copyText(code.textContent);
      button.textContent = 'Copied';
      button.dataset.state = 'copied';
      button.setAttribute('aria-label', 'Code copied');
    } catch {
      button.textContent = 'Copy failed';
      button.dataset.state = 'error';
      button.setAttribute('aria-label', 'Code copy failed');
    }
    button._copyResetTimer = setTimeout(() => {
      button.textContent = 'Copy';
      button.removeAttribute('data-state');
      button.setAttribute('aria-label', 'Copy code');
    }, 1800);
  });
  block.appendChild(button);
});
