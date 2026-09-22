/**
 * @fileoverview Theme gallery page: renders one card per theme (built-in + `/themes-templates`
 * palette templates, both from the shared docs adapter) and mounts an isolated `HawkSearch`
 * preview for whichever card is clicked, destroying the previous preview first — only the active
 * preview ever holds a live Pagefind worker or global hotkeys, per the docs adapter's own
 * "independently editable profile per preview" contract.
 *
 * `playgroundUrl`/`templateUrl` are baseURL-correct absolute paths only Hugo can compute —
 * `docs/layouts/themes/single.html` injects them as `window.__HAWK_THEME_GALLERY_DATA__` in a
 * small inline `<script>` immediately before this module is loaded.
 * @module theme-gallery
 */

import { HawkSearch } from '../../webutil/libs/hawk.mjs';
import { HawkAnimationTypeflow } from '../../webutil/libs/hawk-animation-typeflow.mjs';
import {
  HAWK_GALLERY_THEMES,
  HAWK_GALLERY_TEMPLATE_IDS,
  createHawkDocsTheme,
  getHawkGalleryTheme,
  loadHawkGalleryTemplate,
} from '../hawk-docs-adapter.mjs';

HawkSearch.registerAnimation('typeflow', HawkAnimationTypeflow);

const gallery = document.getElementById('theme-gallery');
const status = document.getElementById('theme-gallery-status');
const { playgroundUrl, templateUrl } = window.__HAWK_THEME_GALLERY_DATA__;

const templateThemes = (
  await Promise.all(HAWK_GALLERY_TEMPLATE_IDS.map((id) => loadHawkGalleryTemplate(id, templateUrl)))
).filter(Boolean);

/** @type {object[]} Built-in gallery themes plus every loaded `/themes-templates` palette. */
const galleryThemes = [...HAWK_GALLERY_THEMES, ...templateThemes];

/** @type {import('../../webutil/libs/hawk.mjs').HawkSearch|null} The currently mounted preview, if any. */
let activePreview = null;

/**
 * Renders one `.theme-gallery-item` card for a gallery theme definition: a clickable swatch
 * preview (`data-gallery-theme`, keyed off in the click handler below) plus a direct "Open in
 * playground" link pre-selecting this theme via `?preset=`.
 * @param {object} theme A `HawkGalleryTheme` definition (see hawk-docs-adapter.mjs).
 * @returns {string} HTML for one gallery card.
 */
function renderGalleryCard(theme) {
  return `
    <div class="theme-gallery-item">
      <button
        class="theme-gallery-card"
        type="button"
        data-gallery-theme="${theme.id}"
        style="--gallery-canvas:${theme.tokens['--hawk-bg-canvas']};--gallery-surface:${theme.tokens['--hawk-bg-surface']};--gallery-text:${theme.tokens['--hawk-text-primary']};--gallery-secondary:${theme.tokens['--hawk-text-secondary']};--gallery-muted:${theme.tokens['--hawk-text-muted'] || theme.tokens['--hawk-text-secondary']};--gallery-accent:${theme.tokens['--hawk-accent']};--gallery-accent-alt:${theme.tokens['--hawk-accent-alt']}"
      >
        <span class="theme-gallery-card__swatches" aria-hidden="true">
          <i style="--swatch:${theme.tokens['--hawk-bg-canvas']}"></i>
          <i style="--swatch:${theme.tokens['--hawk-bg-surface']}"></i>
          <i style="--swatch:${theme.tokens['--hawk-text-primary']}"></i>
          <i style="--swatch:${theme.tokens['--hawk-accent']}"></i>
          <i style="--swatch:${theme.tokens['--hawk-accent-alt']}"></i>
        </span>
        <strong>${theme.label}</strong>
        <span>${theme.description}</span>
        <code>${theme.params.position} · ${theme.params.density} · ${theme.revealAnimation} · ${theme.colorModes.join('/')}</code>
      </button>
      <a class="theme-gallery-playground" href="${playgroundUrl}?preset=${encodeURIComponent(theme.id)}">Open in playground</a>
    </div>
  `;
}

gallery.innerHTML = galleryThemes.map(renderGalleryCard).join('');

gallery.addEventListener('click', (event) => {
  const card = event.target.closest('[data-gallery-theme]');
  if (!card) return;
  const definition =
    galleryThemes.find((theme) => theme.id === card.dataset.galleryTheme) ||
    getHawkGalleryTheme(card.dataset.galleryTheme);
  if (!definition) return;

  activePreview?.destroy();
  activePreview = new HawkSearch({
    index: document.body.dataset.hawkIndex,
    triggerSelector: '[data-gallery-trigger-unused]',
    theme: createHawkDocsTheme(`gallery-${definition.id}`, definition.tokens, 'typeflow', definition.id),
    animation: 'typeflow',
    params: definition.params,
    revealAnimation: definition.revealAnimation,
    rotatingPlaceholders: [`Search with ${definition.label}...`],
    contentSelector: '.doc-article',
    hotkeys: { open: false, slash: false, escape: true },
  });
  gallery.querySelectorAll('[aria-pressed]').forEach((item) => item.removeAttribute('aria-pressed'));
  card.setAttribute('aria-pressed', 'true');
  status.textContent = `${definition.label} preview active.`;
  activePreview.open();
});
