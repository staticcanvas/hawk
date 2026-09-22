/**
 * @fileoverview The `/playground` page's entire configurator: every control's value maps to a
 * live `HawkSearch` instance (remounted on change via `mount()`), a generated ESM/UMD/jsDelivr
 * usage snippet, gallery-theme preset loading (including a `?preset=` deep link from the theme
 * gallery), Pickr color pickers, Lume tooltips, and settings persisted to `localStorage` so a
 * reload keeps the visitor's last configuration.
 *
 * This is one large, single-scope module rather than further split into independent files — most
 * of what it does (DOM control values, the mounted `search` instance, the active preset, the
 * chosen code-snippet format) is genuinely shared mutable state read and written from many
 * places, so splitting it further would mean threading that state through explicit
 * imports/exports between files for no real benefit over the one cohesive module Hugo used to
 * inline directly into the page. The two pieces that *are* genuinely independent and reusable —
 * the JS syntax highlighter and the shared docs adapter — are their own modules (code-
 * highlight.js, hawk-docs-adapter.mjs), imported below.
 * @module playground
 */

import Pickr from '../../webutil/libs/pickr.min.mjs';
import { Lume } from '../../webutil/libs/lume.esm.min.js';
import { HawkSearch } from '../../webutil/libs/hawk.mjs';
import { HawkThemeTypeflow } from '../../webutil/libs/hawk-theme-typeflow.mjs';
import {
  createHawkDocsTheme,
  getHawkGalleryTheme,
  HAWK_GALLERY_THEMES,
  HAWK_PLAYGROUND_TYPEFLOW_PRESET,
  loadAllHawkGalleryThemes,
  loadHawkGalleryTemplate,
} from '../hawk-docs-adapter.mjs';
import { highlightCode } from './code-highlight.js';

/**
 * Directory URL for the `/themes-templates` palette source — a fixed relative path from this
 * module's own location (`docs/static/assets/js/`) to `docs/static/assets/theme-templates/`, so
 * it stays baseURL-correct without needing Hugo's `relURL` the way the inline version this file
 * replaced did.
 * @type {string}
 */
const THEME_TEMPLATES_URL = new URL('../theme-templates/', import.meta.url).href;

HawkSearch.registerTheme('typeflow', HawkThemeTypeflow);
// A theme that stamps nothing — hawk.css's own unthemed structural styles apply, none of
// hawk-theme-typeflow.css's [data-hawk-theme='typeflow'] rules do. HawkSearchConfig has no
// "no theme" sentinel (unlike animation's `false`), so an explicit no-op theme is the way to
// demonstrate the unstyled baseline here.
HawkSearch.registerTheme('blank', { name: 'blank', apply() {} });

const statusEl = document.getElementById('pg-status');
const val = (id) => document.getElementById(id).value;
const checked = (id) => document.getElementById(id).checked;
const radio = (name) => document.querySelector(`input[name="${name}"]:checked`).value;
const setValue = (id, value) => {
  const field = document.getElementById(id);
  if (field && value !== undefined) field.value = String(value);
};
const setChecked = (id, value) => {
  const field = document.getElementById(id);
  if (field && value !== undefined) field.checked = Boolean(value);
};

// The adapter is authoritative for the playground animation profile. Markup values remain
// useful before JavaScript mounts, but this keeps the live controls and future gallery cards
// on the same maintained preset.
setValue('pg-tf-title-style', HAWK_PLAYGROUND_TYPEFLOW_PRESET.title.typeStyle);
setValue('pg-tf-title-direction', HAWK_PLAYGROUND_TYPEFLOW_PRESET.title.direction);
setValue('pg-tf-title-speed', HAWK_PLAYGROUND_TYPEFLOW_PRESET.title.speed);
setValue('pg-tf-title-cursor', HAWK_PLAYGROUND_TYPEFLOW_PRESET.title.cursor);
setChecked('pg-tf-title-cursor-blink', HAWK_PLAYGROUND_TYPEFLOW_PRESET.title.cursorBlink);
setValue('pg-tf-anchor-style', HAWK_PLAYGROUND_TYPEFLOW_PRESET.anchorTitle.typeStyle);
setValue('pg-tf-anchor-direction', HAWK_PLAYGROUND_TYPEFLOW_PRESET.anchorTitle.direction);
setValue('pg-tf-anchor-speed', HAWK_PLAYGROUND_TYPEFLOW_PRESET.anchorTitle.speed);
setValue('pg-tf-anchor-cursor', HAWK_PLAYGROUND_TYPEFLOW_PRESET.anchorTitle.cursor);
setChecked('pg-tf-anchor-cursor-blink', HAWK_PLAYGROUND_TYPEFLOW_PRESET.anchorTitle.cursorBlink);
setValue('pg-tf-content-style', HAWK_PLAYGROUND_TYPEFLOW_PRESET.content.typeStyle);
setValue('pg-tf-content-direction', HAWK_PLAYGROUND_TYPEFLOW_PRESET.content.direction);
setValue('pg-tf-content-speed', HAWK_PLAYGROUND_TYPEFLOW_PRESET.content.speed);
setValue('pg-tf-content-cursor', HAWK_PLAYGROUND_TYPEFLOW_PRESET.content.cursor);
setValue('pg-tf-rotate-hold', HAWK_PLAYGROUND_TYPEFLOW_PRESET.rotate.holdDuration);
setValue('pg-tf-rotate-pause', HAWK_PLAYGROUND_TYPEFLOW_PRESET.rotate.pauseBetween);
setValue('pg-tf-rotate-type-style', HAWK_PLAYGROUND_TYPEFLOW_PRESET.rotate.typeConfig.typeStyle);
setValue('pg-tf-rotate-type-speed', HAWK_PLAYGROUND_TYPEFLOW_PRESET.rotate.typeConfig.speed);
setValue('pg-tf-rotate-type-cursor', HAWK_PLAYGROUND_TYPEFLOW_PRESET.rotate.typeConfig.cursor);
setChecked(
  'pg-tf-rotate-type-cursor-blink',
  HAWK_PLAYGROUND_TYPEFLOW_PRESET.rotate.typeConfig.cursorBlink
);
setValue('pg-tf-rotate-erase-style', HAWK_PLAYGROUND_TYPEFLOW_PRESET.rotate.eraseConfig.eraseStyle);
setValue('pg-tf-rotate-erase-speed', HAWK_PLAYGROUND_TYPEFLOW_PRESET.rotate.eraseConfig.speed);

const tokenInputs = Array.from(document.querySelectorAll('[data-hawk-token]'));
const syncTokenSwatch = (input) => {
  const swatch = input.closest('label')?.querySelector('[data-pickr-trigger]');
  if (!swatch) return;
  const value = input.value.trim();
  swatch.style.setProperty('--pg-token-preview', value || 'transparent');
  swatch.toggleAttribute('data-empty', !value);
};

let activePreset = null;
// Declared here (ahead of restorePlaygroundState()'s call site below) rather than beside
// buildConfigSnippet() further down — that function is only defined, not invoked, this early,
// but restorePlaygroundState() runs as part of this same top-level module evaluation and would
// hit this `let` in its temporal dead zone if the declaration came later in the file.
let pgCodeFormat = 'esm';
const allGalleryThemes = await loadAllHawkGalleryThemes(THEME_TEMPLATES_URL);
const themePresetSelect = document.getElementById('pg-theme-preset');
if (themePresetSelect && allGalleryThemes.length) {
  themePresetSelect.innerHTML = [
    ...allGalleryThemes.map((t) => `<option value="${t.id}">${t.label}</option>`),
    '<option value="none">none (unstyled)</option>',
  ].join('');
}

function applyThemePreset(preset) {
  if (!preset) return;
  if (preset.id === 'none') {
    const noneRadio = document.querySelector('input[name="pg-theme"][value="none"]');
    if (noneRadio) noneRadio.checked = true;
    activePreset = null;
    return;
  }
  const typeflowRadio = document.querySelector('input[name="pg-theme"][value="typeflow"]');
  if (typeflowRadio) typeflowRadio.checked = true;
  tokenInputs.forEach((input) => { input.value = ''; });
  if (preset.tokens) {
    for (const [token, value] of Object.entries(preset.tokens)) {
      const input = tokenInputs.find((candidate) => candidate.dataset.hawkToken === token);
      if (input) {
        input.value = value;
        syncTokenSwatch(input);
      }
    }
  }
  // Reset every layout param a preset *could* set back to the form's own baseline first, then
  // let the preset override what it actually specifies. Without this, a param a previous
  // preset set (e.g. Simple Dark's alignment: 'start') silently survives switching to a preset
  // that doesn't mention it at all (most gallery/template presets only set position/density/
  // scale) — 'start' left over on a 2-column preset stops its preview pane from stretching to
  // the row's height, so it shrinks to fit only its own (often short) content instead.
  setValue('pg-position', 'top-center');
  setValue('pg-density', 'fit');
  setValue('pg-scale', '1');
  setValue('pg-columns', '2');
  setValue('pg-alignment', 'stretch');
  setValue('pg-breakpoint', '768');
  if (preset.params) {
    if (preset.params.position) setValue('pg-position', preset.params.position);
    if (preset.params.density) setValue('pg-density', preset.params.density);
    if (preset.params.scale) setValue('pg-scale', preset.params.scale);
    if (preset.params.columns) setValue('pg-columns', preset.params.columns);
    if (preset.params.alignment) setValue('pg-alignment', preset.params.alignment);
    if (preset.params.breakpoint) setValue('pg-breakpoint', preset.params.breakpoint);
  }
  if (preset.revealAnimation) {
    setValue('pg-reveal-animation', preset.revealAnimation);
  }
  activePreset = preset;
  if (themePresetSelect) themePresetSelect.value = preset.id;
}

const requestedPresetId = new URLSearchParams(window.location.search).get('preset') || 'typeflow';
const requestedPreset = allGalleryThemes.find((theme) => theme.id === requestedPresetId)
  || getHawkGalleryTheme(requestedPresetId)
  || await loadHawkGalleryTemplate(requestedPresetId, THEME_TEMPLATES_URL);
if (requestedPreset) {
  applyThemePreset(requestedPreset);
} else if (themePresetSelect) {
  themePresetSelect.value = 'typeflow';
}

// Restore persisted settings on top of the preset so the user's last-used configuration
// survives a reload. Skip restore when a ?preset= param is explicitly in the URL — that
// signals a deliberate "open with this preset" link and should not be overridden by stale state.
if (!new URLSearchParams(window.location.search).has('preset')) {
  restorePlaygroundState();
  // Re-sync Pickr swatches whose values may have been overwritten by restorePlaygroundState().
  tokenInputs.forEach(syncTokenSwatch);
  // restorePlaygroundState() only updates the pgCodeFormat variable — the tab buttons'
  // aria-selected still reflects the markup's default (ESM) until synced here.
  document.querySelectorAll('[data-pg-code-format] button').forEach((btn) => {
    btn.setAttribute('aria-selected', String(btn.dataset.format === pgCodeFormat));
  });
}

// Backdrop gradient/opacity/blur (above) are [data-hawk-token] inputs without a swatch button —
// they aren't a single pickable color — so they're excluded here rather than handed to
// Pickr.create() with an el of undefined.
const pickers = tokenInputs
  .filter((input) => input.closest('label')?.querySelector('[data-pickr-trigger]'))
  .map((input) => {
  const trigger = input.closest('label')?.querySelector('[data-pickr-trigger]');
  syncTokenSwatch(input);
  const picker = Pickr.create({
    el: trigger,
    useAsButton: true,
    theme: 'nano',
    default: '#20e3b2',
    defaultRepresentation: 'HEXA',
    components: {
      preview: true,
      opacity: true,
      hue: true,
      interaction: {
        hex: true,
        rgba: true,
        input: true,
        cancel: true,
        save: true,
      },
    },
  });

  const commitPickerColor = (color) => {
    if (!color) return;
    input.value = color.toHEXA().toString();
    syncTokenSwatch(input);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  picker
    .on('show', () => {
      // Pickr only parses solid colors. Invalid values (including CSS gradients) leave its
      // previous selection intact until the user deliberately chooses a replacement color.
      picker.setColor(input.value.trim(), true);
    })
    .on('change', commitPickerColor)
    .on('save', (color) => {
      commitPickerColor(color);
      picker.hide();
    });

  input.addEventListener('input', () => syncTokenSwatch(input));
  return picker;
});

// One instance for the whole page — Lume auto-discovers [data-lume] elements on construction
// and stays mutation-aware afterward (a MutationObserver, not a one-time scan), so controls
// that appear later (TypeFlow options un-hiding, a fieldset opening) get tooltips without any
// re-bind call here.
// eslint-disable-next-line no-unused-vars -- kept alive for its side effects; nothing here needs to call back into it.
const lume = new Lume({ offset: 10, motion: 'fade' });

const jsonValue = (id, fallback) => {
  const field = document.getElementById(id);
  try {
    const parsed = JSON.parse(field.value || JSON.stringify(fallback));
    field.setAttribute('aria-invalid', 'false');
    return parsed;
  } catch {
    field.setAttribute('aria-invalid', 'true');
    return fallback;
  }
};

let search = null;
let debugController = null;
let metricsController = null;
let metricsTimer = null;
let typeflowModule = null; // { TypeFlow, createHawkAnimationTypeflow }, cached once loaded

// ── Playground settings persistence ─────────────────────────────────────────────────────────
// All named control values are serialised to localStorage so the playground survives a reload
// with the same configuration the user left it in. Only ids that actually exist in the DOM are
// stored/restored, so adding controls in future doesn't break older saved state.
const PG_STORAGE_KEY = 'hawk:playground:settings';

function savePlaygroundState() {
  try {
    const state = {};
    document.querySelectorAll('.pg-controls [id]').forEach((el) => {
      if (el.type === 'radio') {
        if (el.checked) state[`radio:${el.name}`] = el.value;
      } else if (el.type === 'checkbox') {
        state[el.id] = el.checked;
      } else if (el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.type === 'text' || el.type === 'number' || el.type === 'url') {
        state[el.id] = el.value;
      }
    });
    state.pgCodeFormat = pgCodeFormat;
    localStorage.setItem(PG_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private browsing, storage quota) — silent no-op.
  }
}

function restorePlaygroundState() {
  try {
    const raw = localStorage.getItem(PG_STORAGE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw);
    for (const [key, value] of Object.entries(state)) {
      if (key === 'pgCodeFormat') {
        pgCodeFormat = value;
      } else if (key.startsWith('radio:')) {
        const name = key.slice(6);
        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) radio.checked = true;
      } else {
        const el = document.getElementById(key);
        if (!el) continue;
        if (el.type === 'checkbox') {
          el.checked = Boolean(value);
        } else {
          el.value = String(value);
        }
      }
    }
  } catch {
    // Malformed stored JSON — ignore and use defaults.
  }
}

document.getElementById('pg-reset-btn')?.addEventListener('click', () => {
  try { localStorage.removeItem(PG_STORAGE_KEY); } catch { /* ignore */ }
  window.location.reload();
});

// The released TypeFlow peer is staged locally by hawk's docs build. The toggle still degrades
// to 'instant' with a visible note if an incomplete/manual asset build omitted it. Only the *module* is cached — the
// driver itself is rebuilt fresh on every mount() so TypeFlow-option changes below actually
// take effect (HawkSearch resolves config.animation to a driver object once at construction).
async function loadTypeflowModule() {
  if (typeflowModule) return typeflowModule;
  try {
    const [{ default: TypeFlow }, { createHawkAnimationTypeflow }] = await Promise.all([
      import('../../webutil/libs/typeflow.mjs'),
      import('../../webutil/libs/hawk-animation-typeflow.mjs'),
    ]);
    typeflowModule = { TypeFlow, createHawkAnimationTypeflow };
    return typeflowModule;
  } catch {
    return null;
  }
}

function currentTypeflowOptions() {
  const rotateExtra = jsonValue('pg-tf-rotate-extra', {});
  const rotateTypeConfig = {
    speed: Number(val('pg-tf-rotate-type-speed')),
    typeStyle: val('pg-tf-rotate-type-style'),
    cursor: val('pg-tf-rotate-type-cursor'),
    cursorBlink: checked('pg-tf-rotate-type-cursor-blink'),
  };
  const rotateEraseConfig = {
    speed: Number(val('pg-tf-rotate-erase-speed')),
    eraseStyle: val('pg-tf-rotate-erase-style'),
  };
  return {
    title: {
      typeStyle: val('pg-tf-title-style'),
      direction: val('pg-tf-title-direction'),
      speed: Number(val('pg-tf-title-speed')),
      cursor: val('pg-tf-title-cursor'),
      cursorBlink: checked('pg-tf-title-cursor-blink'),
      ...jsonValue('pg-tf-title-extra', {}),
    },
    anchorTitle: {
      typeStyle: val('pg-tf-anchor-style'),
      direction: val('pg-tf-anchor-direction'),
      speed: Number(val('pg-tf-anchor-speed')),
      cursor: val('pg-tf-anchor-cursor'),
      cursorBlink: checked('pg-tf-anchor-cursor-blink'),
      ...jsonValue('pg-tf-anchor-extra', {}),
    },
    content: {
      html: checked('pg-tf-content-html'),
      typeStyle: val('pg-tf-content-style'),
      direction: val('pg-tf-content-direction'),
      speed: Number(val('pg-tf-content-speed')),
      cursor: val('pg-tf-content-cursor'),
      ...jsonValue('pg-tf-content-extra', {}),
    },
    rotate: {
      holdDuration: Number(val('pg-tf-rotate-hold')),
      pauseBetween: Number(val('pg-tf-rotate-pause')),
      ...rotateExtra,
      typeConfig: { ...rotateTypeConfig, ...(rotateExtra.typeConfig || {}) },
      eraseConfig: { ...rotateEraseConfig, ...(rotateExtra.eraseConfig || {}) },
    },
  };
}

function currentParams() {
  return {
    scale: Number(val('pg-scale')),
    position: val('pg-position'),
    offset: { x: val('pg-offset-x'), y: val('pg-offset-y') },
    alignment: val('pg-alignment'),
    columns: Number(val('pg-columns')),
    breakpoint: Number(val('pg-breakpoint')),
    density: val('pg-density'),
    allowDensityToggle: checked('pg-density-toggle'),
  };
}

function currentThemeTokens() {
  return Object.fromEntries(
    Array.from(document.querySelectorAll('[data-hawk-token]'), (input) => [input.dataset.hawkToken, input.value.trim()])
      .filter(([, value]) => value)
  );
}

function currentPagefindInitOptions() {
  const options = {
    baseUrl: val('pg-pf-base-url').trim() || '/',
    excerptLength: Number(val('pg-pf-excerpt')),
    exactDiacritics: checked('pg-pf-diacritics'),
    noWorker: checked('pg-pf-no-worker'),
    indexWeight: Number(val('pg-pf-index-weight')),
    ranking: {
      termFrequency: Number(val('pg-rank-frequency')),
      termSimilarity: Number(val('pg-rank-similarity')),
      pageLength: Number(val('pg-rank-length')),
      termSaturation: Number(val('pg-rank-saturation')),
      diacriticSimilarity: Number(val('pg-rank-diacritic')),
      metaWeights: jsonValue('pg-rank-meta', { title: 5 }),
    },
  };
  const mergeFilter = jsonValue('pg-pf-merge-filter', {});
  if (mergeFilter && Object.keys(mergeFilter).length) options.mergeFilter = mergeFilter;
  if (val('pg-pf-highlight').trim()) options.highlightParam = val('pg-pf-highlight').trim();
  if (val('pg-pf-cache').trim()) options.metaCacheTag = val('pg-pf-cache').trim();
  return { ...options, ...jsonValue('pg-pf-init-extra', {}) };
}

function currentPagefindSearchOptions() {
  const options = {};
  const filters = jsonValue('pg-pf-filters', {});
  if (filters && Object.keys(filters).length) options.filters = filters;
  const sortKey = val('pg-pf-sort-key').trim();
  if (sortKey) options.sort = { [sortKey]: val('pg-pf-sort-direction') };
  return { ...options, ...jsonValue('pg-pf-search-extra', {}) };
}

function currentHawkConfig(animationName) {
  const tabs = jsonValue('pg-tabs', []);
  const config = {
    index: val('pg-index').trim(),
    id: val('pg-id').trim() || 'hawk-playground-search',
    triggerSelector: val('pg-trigger-selector').trim() || '[data-playground-trigger]',
    excludePages: jsonValue('pg-exclude-pages', []),
    contentSelector: val('pg-content-selector').trim() || '[data-pagefind-body]',
    maxResults: Number(val('pg-max-results')),
    categoryFilterName: val('pg-category-filter').trim() || 'category',
    includeAllTab: checked('pg-include-all'),
    defaultTab: val('pg-default-tab').trim() || 'all',
    eagerResults: checked('pg-eager-results'),
    inlineFilters: checked('pg-inline-filters'),
    previewSections: checked('pg-preview-sections'),
    previewSectionSelector: val('pg-section-selector').trim() || 'h2, h3',
    previewSectionExcerptLength: Number(val('pg-section-excerpt')),
    discoveryRow: checked('pg-discovery-row')
      ? {
          matches: checked('pg-discovery-matches'),
          pages: checked('pg-discovery-pages'),
          headings: checked('pg-discovery-headings'),
        }
      : false,
    enableSecondColumn: checked('pg-second-column'),
    disableDefaultMarkdownStyles: !checked('pg-default-markdown'),
    showPoweredBy: checked('pg-powered-by'),
    showResultDate: checked('pg-result-date'),
    resultDateMetaKey: val('pg-result-date-key').trim() || 'date',
    resultDateFormat: val('pg-result-date-format'),
    showResultTags: checked('pg-result-tags'),
    resultTagsMetaKey: val('pg-result-tags-key').trim() || 'tags',
    showSubpageConnector: checked('pg-subpage-connector'),
    tagAccentColors: checked('pg-tag-accent-colors-enabled')
      ? (val('pg-tag-accent-colors').trim()
        ? val('pg-tag-accent-colors').split(',').map((color) => color.trim()).filter(Boolean)
        : undefined) // undefined, not [] — falls through to hawk.js's own built-in pastel default
      : false,
    headerControls: {
      density: checked('pg-header-density'),
      escape: checked('pg-header-escape'),
    },
    poweredByHref: val('pg-powered-href').trim() || 'https://pagefind.app/',
    enablePins: checked('pg-pins'),
    pinStorageKey: val('pg-pin-key').trim(),
    maxPins: Number(val('pg-max-pins')),
    enableRecentlyViewed: checked('pg-recent'),
    recentlyViewedStorageKey: val('pg-recent-key').trim(),
    maxRecentlyViewed: Number(val('pg-max-recent')),
    hotkeys: {
      open: checked('pg-hotkey-open'),
      slash: checked('pg-hotkey-slash'),
      escape: checked('pg-hotkey-escape'),
    },
    strings: jsonValue('pg-strings', {}),
    rotatingPlaceholders: val('pg-placeholders').split(',').map((item) => item.trim()).filter(Boolean),
    defaultPreviewUrl: val('pg-preview-url').trim() || undefined,
    defaultPreviewTitle: val('pg-preview-title').trim(),
    tabs: tabs.length ? tabs : undefined,
    tabsUrl: !tabs.length && val('pg-tabs-url').trim() ? val('pg-tabs-url').trim() : undefined,
    pagefindInitOptions: currentPagefindInitOptions(),
    pagefindMergeIndexes: jsonValue('pg-pf-merge', []),
    pagefindOptions: currentPagefindSearchOptions(),
    theme: radio('pg-theme') === 'none' ? 'blank' : 'playground-typeflow',
    animation: animationName === 'typeflow' ? 'typeflow' : false,
    revealAnimation: val('pg-reveal-animation') === 'false' ? false : val('pg-reveal-animation'),
    revealDuration: Number(val('pg-reveal-duration')),
    resultsReveal: checked('pg-results-reveal'),
    resultsRevealDirection: val('pg-results-reveal-direction'),
    resultsRevealStagger: Number(val('pg-results-reveal-stagger')),
    params: currentParams(),
  };
  return { ...config, ...jsonValue('pg-hawk-extra', {}) };
}

document.querySelectorAll('[data-pg-highlight]').forEach((code) => {
  code.innerHTML = highlightCode(code.textContent);
});

// Re-indents every line after the first in a JSON.stringify(..., null, 2) block by `indent` —
// used to nest a multi-line object literal inside the UMD snippet's <script> block below.
const reindent = (text, indent) =>
  text.split('\n').map((line, i) => (i === 0 ? line : indent + line)).join('\n');

const CDN_BASE = 'https://cdn.jsdelivr.net/npm/@staticcanvas/hawk@latest';

function buildConfigSnippet(format) {
  const theme = radio('pg-theme');
  const animation = radio('pg-animation');
  const config = currentHawkConfig(animation);

  // UMD: no bundler, no import statements — script tags populate globals (window.Hawk, etc.),
  // matching the exact self-registration order documented in getting-started.md's Browser/CDN
  // section. The playground's theme/animation are always *tuned*, not the plain self-
  // registering defaults, so both still need an explicit register call afterward — for the
  // animation driver that means re-registering 'typeflow' over hawk-animation-typeflow.js's
  // own auto-registered default, using the tuned options below.
  if (format === 'umd') {
    const lines = [`<link rel="stylesheet" href="${CDN_BASE}/dist/hawk.css" />`];
    if (theme !== 'none') lines.push(`<link rel="stylesheet" href="${CDN_BASE}/dist/hawk-theme-typeflow.css" />`);
    lines.push(`<script src="${CDN_BASE}/dist/hawk.js"></script>`);
    if (animation === 'typeflow') {
      lines.push(`<script src="https://cdn.jsdelivr.net/npm/@staticcanvas/typeflow@latest/dist/typeflow.js"></script>`);
      lines.push(`<script src="${CDN_BASE}/dist/hawk-animation-typeflow.js"></script>`);
    }
    lines.push(`<script>`);
    if (theme !== 'none') {
      lines.push(`  Hawk.registerTheme('playground-typeflow', {`);
      lines.push(`    name: 'playground-typeflow',`);
      lines.push(`    apply(el) { el.dataset.hawkTheme = 'typeflow'; },`);
      lines.push(`    tokens: ${reindent(JSON.stringify(currentThemeTokens(), null, 2), '    ')},`);
      lines.push(`  });`);
    } else {
      lines.push(`  Hawk.registerTheme('blank', { name: 'blank', apply() {} });`);
    }
    if (animation === 'typeflow') {
      lines.push(`  // hawk-animation-typeflow.js already self-registered 'typeflow' with its own`);
      lines.push(`  // defaults — re-register it with this configurator's tuned options.`);
      lines.push(`  Hawk.registerAnimation('typeflow', HawkAnimationTypeflow.create(TypeFlow, ${reindent(JSON.stringify(currentTypeflowOptions(), null, 2), '  ')}));`);
    }
    lines.push(`  new Hawk(${reindent(JSON.stringify(config, null, 2), '  ')});`);
    lines.push(`</script>`);
    return lines.join('\n');
  }

  // ESM (bundler, bare specifiers) and jsDelivr (native browser ESM, full CDN URLs) share the
  // same import/register/construct shape — only the specifiers differ.
  const hawkSpecifier = format === 'jsdelivr' ? `${CDN_BASE}/dist/hawk.mjs` : '@staticcanvas/hawk';
  const animationSpecifier =
    format === 'jsdelivr' ? `${CDN_BASE}/dist/hawk-animation-typeflow.mjs` : '@staticcanvas/hawk/animation-typeflow';
  const typeflowSpecifier =
    format === 'jsdelivr'
      ? 'https://cdn.jsdelivr.net/npm/@staticcanvas/typeflow@latest/dist/typeflow.mjs'
      : '@staticcanvas/typeflow';

  const lines = [];
  if (format === 'jsdelivr') {
    lines.push(`<link rel="stylesheet" href="${CDN_BASE}/dist/hawk.css" />`);
    if (theme !== 'none') lines.push(`<link rel="stylesheet" href="${CDN_BASE}/dist/hawk-theme-typeflow.css" />`);
    lines.push(`<script type="module">`);
  }
  lines.push(`import { HawkSearch } from '${hawkSpecifier}';`);
  if (format !== 'jsdelivr' && theme !== 'none') lines.push(`import '@staticcanvas/hawk/theme-typeflow/css';`);
  if (animation === 'typeflow') {
    lines.push(`import { createHawkAnimationTypeflow } from '${animationSpecifier}';`);
    lines.push(`import TypeFlow from '${typeflowSpecifier}';`);
  }
  lines.push('');
  if (theme !== 'none') {
    lines.push(`HawkSearch.registerTheme('playground-typeflow', {`);
    lines.push(`  name: 'playground-typeflow',`);
    lines.push(`  apply(el) { el.dataset.hawkTheme = 'typeflow'; },`);
    lines.push(`  tokens: ${JSON.stringify(currentThemeTokens(), null, 2)},`);
    lines.push(`});`);
  } else {
    lines.push(`HawkSearch.registerTheme('blank', { name: 'blank', apply() {} });`);
  }
  if (animation === 'typeflow') {
    lines.push(`HawkSearch.registerAnimation('typeflow', createHawkAnimationTypeflow(TypeFlow, ${JSON.stringify(currentTypeflowOptions(), null, 2)}));`);
  }
  lines.push('');
  lines.push(`new HawkSearch(${JSON.stringify(config, null, 2)});`);
  if (format === 'jsdelivr') lines.push(`</script>`);
  return lines.join('\n');
}

function setCodeFormat(format) {
  pgCodeFormat = format;
  document.querySelectorAll('[data-pg-code-format] button').forEach((btn) => {
    btn.setAttribute('aria-selected', String(btn.dataset.format === format));
  });
  refreshCodeSnippet();
}

document.querySelectorAll('[data-pg-code-format] button').forEach((btn) => {
  btn.addEventListener('click', () => setCodeFormat(btn.dataset.format));
});

function refreshCodeSnippet() {
  const el = document.getElementById('pg-code-output');
  if (el) el.innerHTML = highlightCode(buildConfigSnippet(pgCodeFormat));
}

function renderMetricsSnapshot() {
  if (!metricsController) return;
  const snap = metricsController.snapshot();
  const grid = document.getElementById('pg-metrics-grid');
  const rows = [
    ['opens', snap.opens],
    ['queries', snap.queries],
    ['zero-result rate', snap.zeroResultRate],
    ['avg matches', snap.averageMatches],
    ['avg query latency (ms)', snap.averageQueryLatencyMs],
    ['selects', snap.selects],
    ['select rate', snap.selectRate],
    ['tab switches', snap.tabSwitches],
    ['pins (+/-)', `${snap.pinAdds}/${snap.pinRemoves}`],
    ['errors', snap.errors],
  ];
  grid.innerHTML = rows.map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`).join('');
}

function teardownDiagnostics() {
  debugController?.dispose();
  debugController = null;
  metricsController?.dispose();
  metricsController = null;
  clearInterval(metricsTimer);
  metricsTimer = null;
}

function applyDiagnostics() {
  teardownDiagnostics();
  if (!search) return;

  if (checked('pg-debug') && window.HawkDebug) {
    debugController = window.HawkDebug.createHawkDebug(search, { label: 'Playground' });
  }

  const metricsPanel = document.getElementById('pg-metrics-panel');
  if (checked('pg-metrics') && window.HawkMetrics) {
    metricsController = window.HawkMetrics.createHawkMetrics(search);
    metricsPanel.hidden = false;
    renderMetricsSnapshot();
    metricsTimer = setInterval(renderMetricsSnapshot, 500);
  } else {
    metricsPanel.hidden = true;
  }
}

let mountGeneration = 0;

async function mount() {
  // Two controls changed in quick succession (e.g. a TypeFlow option right after switching the
  // animation radio) can each start a mount() call before the first one's await resolves —
  // whichever finishes last would otherwise win regardless of which is actually newer. Same
  // stale-response guard shape as hawk.js's own #executeSearch (searchGeneration).
  const generation = ++mountGeneration;

  const animation = radio('pg-animation');
  document.getElementById('pg-typeflow-options').hidden = animation !== 'typeflow';

  let resolvedAnimation = 'instant';
  let fallbackNote = '';
  if (animation === 'typeflow') {
    const mod = await loadTypeflowModule();
    if (generation !== mountGeneration) return; // a newer mount() call superseded this one
    if (mod) {
      HawkSearch.registerAnimation('typeflow', mod.createHawkAnimationTypeflow(mod.TypeFlow, currentTypeflowOptions()));
      resolvedAnimation = 'typeflow';
    } else {
      fallbackNote = ' (typeflow build not found in webutil/libs — see the Animation Plugins guide to stage one)';
    }
  }

  search?.destroy();
  if (radio('pg-theme') !== 'none') {
    HawkSearch.registerTheme(
      'playground-typeflow',
      createHawkDocsTheme('playground-typeflow', currentThemeTokens())
    );
  }
  search = new HawkSearch(currentHawkConfig(resolvedAnimation));

  const presetNote = activePreset
    ? `, preset: ${activePreset.label}`
    : '';
  statusEl.textContent = `Mounted — animation: ${resolvedAnimation}, theme: ${radio('pg-theme')}${presetNote}.${fallbackNote}`;
  applyDiagnostics();
  refreshCodeSnippet();
  savePlaygroundState();
}

themePresetSelect?.addEventListener('change', () => {
  const selectedId = themePresetSelect.value;
  if (selectedId === 'none') {
    applyThemePreset({ id: 'none' });
  } else {
    const match = allGalleryThemes.find((t) => t.id === selectedId);
    if (match) applyThemePreset(match);
  }
  mount();
});

let mountDebounceTimer = null;
function debouncedMount() {
  clearTimeout(mountDebounceTimer);
  mountDebounceTimer = setTimeout(() => {
    mount();
  }, 120);
}

document.querySelectorAll('.pg-controls input[type="radio"], .pg-controls input[type="checkbox"]').forEach((input) => {
  input.addEventListener('change', () => {
    if (input.id === 'pg-debug' || input.id === 'pg-metrics') {
      applyDiagnostics();
    } else {
      mount();
    }
  });
});
document.querySelectorAll('.pg-controls select, .pg-controls textarea, .pg-controls input:not([type="radio"]):not([type="checkbox"])').forEach((input) => {
  input.addEventListener('change', () => {
    mount();
  });
  // Listen to 'input' on text, number, and textarea controls so edits (like speed typing or spinner clicks) take effect live
  input.addEventListener('input', () => {
    debouncedMount();
  });
});

window.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (!search) return;
    if (search.state?.open) {
      search.close();
    } else {
      search.open();
    }
  }
});

window.addEventListener('pagehide', () => {
  pickers.forEach((picker) => picker.destroy());
}, { once: true });

document.querySelectorAll('.pg-copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const target = btn.dataset.copyTarget ? document.querySelector(btn.dataset.copyTarget) : btn.previousElementSibling;
    const code = target?.matches?.('code') ? target : target?.querySelector?.('code');
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.textContent);
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = prev; }, 1200);
    } catch {
      // Clipboard API unavailable (permissions, insecure context) — the code is still
      // selectable/readable in the block itself, so this is a silent no-op, not an error.
    }
  });
});

mount();
