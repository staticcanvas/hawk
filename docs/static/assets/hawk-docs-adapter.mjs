/**
 * @fileoverview Docs-only Hawk profile adapter.
 *
 * Each factory returns a fresh object. Callers retain ownership of HawkSearch instances, which
 * lets the production search, playground, and future gallery mount independently without shared
 * mutable configuration or duplicate lifecycle ownership.
 *
 * Consumed by three surfaces, each importing only what it needs:
 *  - `docs/static/assets/js/site-search.js` (production docs search) — `createHawkDocsSearchConfig`.
 *  - `docs/static/assets/js/playground.js` — nearly everything here, for live-tuned previews.
 *  - `docs/static/assets/js/theme-gallery.js` — the gallery listing + `createHawkDocsTheme`.
 * @module hawk-docs-adapter
 */

export const HAWK_PLAYGROUND_TYPEFLOW_PRESET = Object.freeze({
  title: Object.freeze({
    typeStyle: 'zoom-in-space',
    direction: 'left',
    speed: 2,
    cursor: '',
    cursorBlink: false,
  }),
  anchorTitle: Object.freeze({
    typeStyle: 'zoom-in-space',
    direction: 'left',
    speed: 2,
    cursor: '',
    cursorBlink: false,
  }),
  content: Object.freeze({
    html: true,
    typeStyle: 'zoom-in-space',
    direction: 'left',
    speed: 2,
    cursor: '',
  }),
  rotate: Object.freeze({
    holdDuration: 3000,
    pauseBetween: 200,
    typeConfig: Object.freeze({
      typeStyle: 'zoom-in-space',
      direction: 'left',
      speed: 2,
      cursor: '',
      cursorBlink: false,
    }),
    eraseConfig: Object.freeze({ eraseStyle: 'end', speed: 2 }),
  }),
});

export const HAWK_GALLERY_THEMES = Object.freeze([
  Object.freeze({
    id: 'typeflow',
    label: 'TypeFlow',
    description: 'Charcoal surfaces, mint accents, and a compact top-positioned search.',
    tokens: Object.freeze({
      '--hawk-bg-canvas': '#36454f',
      '--hawk-bg-surface': '#2f3c45',
      '--hawk-bg-surface-elevated': '#43545f',
      '--hawk-text-primary': '#f4f8f7',
      '--hawk-text-secondary': '#d0dcda',
      '--hawk-accent': '#20e3b2',
      '--hawk-accent-alt': '#29ffc6',
    }),
    params: Object.freeze({ position: 'top-center', density: 'fit', scale: 1 }),
    revealAnimation: 'scale-fade',
    colorModes: Object.freeze(['dark', 'light']),
    cssAsset: '@staticcanvas/hawk/theme-typeflow/css',
  }),
  Object.freeze({
    id: 'pastel-dusk',
    label: 'Pastel dusk',
    description: 'Deep violet surfaces with lavender, rose, and gold accents.',
    tokens: Object.freeze({
      '--hawk-bg-canvas': '#191724',
      '--hawk-bg-surface': '#1f1d2e',
      '--hawk-bg-surface-elevated': '#26233a',
      '--hawk-border-subtle': '#393552',
      '--hawk-border-default': '#524f67',
      '--hawk-border-strong': '#6e6a86',
      '--hawk-text-primary': '#e0def4',
      '--hawk-text-secondary': '#c4a7e7',
      '--hawk-text-muted': '#908caa',
      '--hawk-accent': '#c4a7e7',
      '--hawk-accent-alt': '#ebbcba',
      '--hawk-accent-dim': 'rgba(196, 167, 231, 0.12)',
      '--hawk-accent-glow': 'rgba(196, 167, 231, 0.2)',
      '--hawk-accent-alt-dim': 'rgba(235, 188, 186, 0.1)',
      '--hawk-accent-alt-glow': 'rgba(235, 188, 186, 0.18)',
      '--hawk-preview-bg': '#211f32',
      '--hawk-shadow': '0 24px 64px rgba(10, 8, 20, 0.5)',
      '--hawk-mark-bg': 'rgba(196, 167, 231, 0.25)',
      '--hawk-mark-color': '#e0def4',
      '--hawk-scrollbar-thumb': 'rgba(144, 140, 170, 0.35)',
      '--hawk-scrollbar-thumb-active': 'rgba(196, 167, 231, 0.65)',
      '--hawk-powered-by-color': '#908caa',
    }),
    params: Object.freeze({ position: 'center', density: 'medium', scale: 0.96 }),
    revealAnimation: 'blur-zoom',
    colorModes: Object.freeze(['dark']),
    cssAsset: null,
  }),
  Object.freeze({
    id: 'simple-dark',
    label: 'Simple dark',
    description: 'A borderless, single-column search that disappears into its blurred backdrop.',
    tokens: Object.freeze({
      '--hawk-bg-canvas': '#0b0d11',
      '--hawk-bg-surface': 'rgba(11, 13, 17, 0)',
      '--hawk-bg-surface-elevated': 'rgba(11, 13, 17, 0)',
      '--hawk-border-subtle': 'rgba(255, 255, 255, 0)',
      '--hawk-border-default': 'rgba(255, 255, 255, 0)',
      '--hawk-border-strong': 'rgba(255, 255, 255, 0)',
      '--hawk-text-primary': '#f2f4f7',
      '--hawk-text-secondary': '#c1c7d1',
      '--hawk-text-muted': '#868f9e',
      '--hawk-accent': '#9aa5b8',
      '--hawk-accent-alt': '#c6cbd6',
      '--hawk-accent-dim': 'rgba(154, 165, 184, 0.12)',
      '--hawk-accent-glow': 'rgba(154, 165, 184, 0.18)',
      '--hawk-accent-alt-dim': 'rgba(198, 203, 214, 0.1)',
      '--hawk-accent-alt-glow': 'rgba(198, 203, 214, 0.16)',
      '--hawk-backdrop': 'rgba(11, 13, 17, 0.62)',
      '--hawk-preview-bg': 'rgba(11, 13, 17, 0)',
      '--hawk-shadow': 'none',
      // Kept subtle on purpose — this theme's whole premise is disappearing into the backdrop, so
      // even the match highlight/scrollbar/attribution stay muted rather than introducing a loud
      // color the rest of the palette deliberately avoids.
      '--hawk-mark-bg': 'rgba(154, 165, 184, 0.22)',
      '--hawk-mark-color': '#f2f4f7',
      '--hawk-scrollbar-thumb': 'rgba(134, 143, 158, 0.3)',
      '--hawk-scrollbar-thumb-active': 'rgba(154, 165, 184, 0.55)',
      '--hawk-powered-by-color': '#868f9e',
    }),
    params: Object.freeze({
      position: 'top-center',
      alignment: 'start',
      columns: 1,
      density: 'compact',
      scale: 0.9,
    }),
    revealAnimation: 'fade',
    colorModes: Object.freeze(['dark']),
    cssAsset: null,
  }),
  Object.freeze({
    id: 'paper-mint',
    label: 'Paper mint',
    description: 'A light paper surface with restrained mint contrast.',
    tokens: Object.freeze({
      '--hawk-bg-canvas': '#f5faf8',
      '--hawk-bg-surface': '#ffffff',
      '--hawk-bg-surface-elevated': '#e9f4f0',
      '--hawk-border-subtle': '#dbe9e4',
      '--hawk-border-default': '#c5dad3',
      '--hawk-border-strong': '#8fb3a8',
      '--hawk-text-primary': '#10211c',
      '--hawk-text-secondary': '#45645b',
      '--hawk-text-muted': '#6d8b82',
      '--hawk-accent': '#008f6c',
      '--hawk-accent-alt': '#00a77b',
      '--hawk-accent-dim': 'rgba(0, 143, 108, 0.09)',
      '--hawk-accent-glow': 'rgba(0, 143, 108, 0.16)',
      '--hawk-accent-alt-dim': 'rgba(0, 167, 123, 0.09)',
      '--hawk-accent-alt-glow': 'rgba(0, 167, 123, 0.16)',
      '--hawk-preview-bg': '#f5faf8',
      '--hawk-backdrop': 'rgba(16, 33, 28, 0.28)',
      '--hawk-shadow': '0 24px 64px rgba(16, 33, 28, 0.16), 0 0 0 1px rgba(0, 143, 108, 0.09)',
      '--hawk-mark-bg': 'rgba(0, 143, 108, 0.18)',
      '--hawk-mark-color': '#10211c',
      '--hawk-scrollbar-thumb': 'rgba(109, 139, 130, 0.35)',
      '--hawk-scrollbar-thumb-active': 'rgba(0, 143, 108, 0.6)',
      '--hawk-powered-by-color': '#6d8b82',
    }),
    params: Object.freeze({ position: 'center', density: 'fit', scale: 0.94 }),
    revealAnimation: 'fade',
    colorModes: Object.freeze(['light']),
    cssAsset: null,
  }),
]);

export const HAWK_GALLERY_TEMPLATE_IDS = Object.freeze([
  'afterglow',
  'chartographer',
  'metro-dark',
  'metro-light',
  'midnight-wave',
  'minimal-dark',
  'nightforge',
  'pastel-shadow',
  'stingray',
  'subtle-sunset',
  // Appended (never inserted between the above) — TEMPLATE_VARIANTS below is keyed off each id's
  // *index* in this array, so inserting earlier would silently reassign every existing template's
  // position/density/revealAnimation variant.
  'amaranth',
  'blush',
  'crimson-ledger',
  'glacier-blue',
  'honeycomb',
  'indigo-night',
  'obsidian',
  'seafoam',
  'solar-flare',
  'verdant',
]);

// Every template theme sharing one params/revealAnimation combo (position: 'center', density:
// 'fit', scale: 0.96, revealAnimation: 'fade') meant 10 otherwise-distinct palettes all behaved
// identically — only the colors differed. A small, deterministic rotation (by each template's
// fixed position in HAWK_GALLERY_TEMPLATE_IDS, not random — stable across reloads and tests)
// gives real structural variety without touching columns/alignment/scale, the combination that
// caused the 'simple-dark' single-column layout bug elsewhere in this codebase — every variant
// here stays on the well-tested 2-column path the 4 built-in themes already exercise.
const TEMPLATE_VARIANTS = Object.freeze([
  Object.freeze({ position: 'center', density: 'fit', revealAnimation: 'fade' }),
  Object.freeze({ position: 'top-center', density: 'medium', revealAnimation: 'scale-fade' }),
  Object.freeze({ position: 'center', density: 'fit', revealAnimation: 'blur-zoom' }),
  Object.freeze({ position: 'top-center', density: 'fit', revealAnimation: 'slide-down' }),
  Object.freeze({ position: 'center', density: 'medium', revealAnimation: 'spring' }),
]);

/**
 * Maps the shared `/theme-templates/*.json` palette schema (`{colors: {ui, syntax}, mode,
 * name, license}`) to Hawk's complete `--hawk-*` theme-token interface, plus a deterministic
 * position/density/revealAnimation variant so otherwise-identical template themes don't all
 * behave the same way (see `TEMPLATE_VARIANTS`'s own comment above).
 * @param {string} id One of `HAWK_GALLERY_TEMPLATE_IDS`.
 * @param {{colors: {ui: object, syntax: object}, mode: 'light'|'dark', name: string, license?: object}} template
 *   The raw parsed template JSON (e.g. from `theme-templates/<id>.json` or a fetched copy).
 * @returns {object|null} A frozen `HawkGalleryTheme`-shaped object, or `null` if `id` isn't
 *   allow-listed in `HAWK_GALLERY_TEMPLATE_IDS` or `template` is missing its color data.
 * @example
 * const theme = createHawkGalleryThemeFromTemplate('nightforge', parsedTemplateJson);
 * HawkSearch.registerTheme(theme.id, createHawkDocsTheme(theme.id, theme.tokens));
 */
export function createHawkGalleryThemeFromTemplate(id, template) {
  const ui = template?.colors?.ui;
  const syntax = template?.colors?.syntax;
  if (!HAWK_GALLERY_TEMPLATE_IDS.includes(id) || !ui || !syntax) return null;
  const alternateAccent = syntax.function === ui.accent ? syntax.string : syntax.function;
  const variant = TEMPLATE_VARIANTS[HAWK_GALLERY_TEMPLATE_IDS.indexOf(id) % TEMPLATE_VARIANTS.length];
  const shadowTint = template.mode === 'light' ? 'rgb(26 26 26 / 0.16)' : 'rgb(0 0 0 / 0.48)';
  return Object.freeze({
    id,
    label: template.name,
    description: `${template.name} uses ${template.mode} surfaces with a ${ui.accent} accent.`,
    tokens: Object.freeze({
      '--hawk-bg-canvas': ui.bg,
      '--hawk-bg-surface': ui.bgAlt,
      '--hawk-bg-surface-elevated': ui.bgElev,
      '--hawk-border-subtle': ui.border,
      '--hawk-border-default': ui.border,
      '--hawk-border-strong': ui.textFaint,
      '--hawk-text-primary': ui.text,
      '--hawk-text-secondary': ui.textMuted,
      '--hawk-text-muted': ui.textFaint,
      '--hawk-accent': ui.accent,
      '--hawk-accent-alt': alternateAccent,
      '--hawk-accent-dim': ui.selection,
      '--hawk-accent-glow': ui.selection,
      '--hawk-accent-alt-dim': ui.selection,
      '--hawk-accent-alt-glow': ui.selection,
      '--hawk-backdrop': template.mode === 'light' ? 'rgb(26 26 26 / 0.28)' : 'rgb(0 0 0 / 0.72)',
      '--hawk-preview-bg': ui.bgAlt,
      '--hawk-shadow': `0 24px 64px ${shadowTint}, 0 0 0 1px ${ui.selection}`,
      '--hawk-mark-bg': ui.selection,
      '--hawk-mark-color': ui.text,
      '--hawk-scrollbar-thumb': ui.textFaint,
      '--hawk-scrollbar-thumb-active': ui.accent,
      '--hawk-powered-by-color': ui.textMuted,
    }),
    params: Object.freeze({ position: variant.position, density: variant.density, scale: 0.96 }),
    revealAnimation: variant.revealAnimation,
    colorModes: Object.freeze([template.mode]),
    cssAsset: null,
    license: Object.freeze({ ...template.license }),
  });
}

/**
 * Fetches one allow-listed palette template as JSON and converts it via
 * `createHawkGalleryThemeFromTemplate`. Network/parse failures resolve to `null` rather than
 * throwing — a missing/broken template should degrade to "this one card is absent," not break
 * the whole gallery or playground preset list.
 * @param {string} id One of `HAWK_GALLERY_TEMPLATE_IDS`.
 * @param {string} baseUrl Directory URL the template JSON lives under, trailing slash included
 *   (e.g. `'assets/theme-templates/'`) — fetched as `` `${baseUrl}${id}.json` ``.
 * @returns {Promise<object|null>} A frozen `HawkGalleryTheme`, or `null` on any failure.
 * @example
 * const theme = await loadHawkGalleryTemplate('afterglow', 'assets/theme-templates/');
 */
export async function loadHawkGalleryTemplate(id, baseUrl) {
  if (!HAWK_GALLERY_TEMPLATE_IDS.includes(id)) return null;
  try {
    const response = await fetch(`${baseUrl}${id}.json`);
    if (!response.ok) return null;
    return createHawkGalleryThemeFromTemplate(id, await response.json());
  } catch {
    return null;
  }
}

/**
 * Returns a mutable copy of one *built-in* gallery definition (not a palette template — see
 * `HAWK_GALLERY_THEMES`) for an isolated preview instance. A copy, not the frozen original,
 * because callers (the theme gallery's click handler, the playground's preset loader) hand the
 * result to `HawkSearch` config paths that may further spread/merge it.
 * @param {string} id A `HAWK_GALLERY_THEMES[number].id` (e.g. `'typeflow'`, `'simple-dark'`).
 * @returns {object|null} A shallow-mutable copy of the matching theme, or `null` if `id` isn't
 *   one of the built-ins.
 */
export function getHawkGalleryTheme(id) {
  const definition = HAWK_GALLERY_THEMES.find((theme) => theme.id === id);
  if (!definition) return null;
  return {
    ...definition,
    tokens: { ...definition.tokens },
    params: { ...definition.params },
    colorModes: [...definition.colorModes],
  };
}

/**
 * Loads the full gallery listing: the 4 built-in `HAWK_GALLERY_THEMES` plus every palette
 * template in `HAWK_GALLERY_TEMPLATE_IDS` that fetches and parses successfully (silently
 * dropped, not retried, if one fails — see `loadHawkGalleryTemplate`).
 * @param {string} [templateBaseUrl] Directory URL the template JSON files live under, trailing
 *   slash included. Defaults to a Hugo-relative path that only makes sense called from a page
 *   already under the docs site root — pass an explicit URL (e.g. one computed from
 *   `import.meta.url`) from any other context.
 * @returns {Promise<object[]>} Built-ins first, then templates, in `HAWK_GALLERY_TEMPLATE_IDS`
 *   order.
 * @example
 * const themes = await loadAllHawkGalleryThemes(new URL('../theme-templates/', import.meta.url).href);
 */
export async function loadAllHawkGalleryThemes(templateBaseUrl = 'assets/theme-templates/') {
  const templates = (
    await Promise.all(
      HAWK_GALLERY_TEMPLATE_IDS.map((id) => loadHawkGalleryTemplate(id, templateBaseUrl))
    )
  ).filter(Boolean);
  return [...HAWK_GALLERY_THEMES, ...templates];
}

/**
 * Returns an isolated `HawkTheme` object (a real object with its own `apply()`, safe to
 * `HawkSearch.registerTheme()` independently per instance) for a docs application surface.
 * `presetId`, when given, also stamps `[data-hawk-theme-preset]` with that value — the same
 * selector the generated per-theme CSS files in `docs/static/assets/themes/` (see
 * `scripts/generate-theme-css.mjs`) are scoped under, so a page could `<link>` one of those
 * instead of relying on `tokens` applied inline, without any other wiring change here.
 * @param {string} name Theme name passed to `HawkSearch.registerTheme(name, ...)`.
 * @param {Record<string, string>} [tokens] `--hawk-*` custom property overrides applied inline
 *   by `apply()`, on top of whatever `baseTheme`'s own CSS already sets.
 * @param {string|null} [baseTheme] Structural theme to layer `tokens` on top of via
 *   `element.dataset.hawkTheme` — `'typeflow'` picks up hawk-theme-typeflow.css's rules; `null`
 *   applies no base theme at all (clears the attribute), useful for a from-scratch palette.
 * @param {string|null} [presetId] When set, also stamps `element.dataset.hawkThemePreset`.
 * @returns {{name: string, apply: (element: HTMLElement) => void, tokens: Record<string, string>}}
 * @example
 * HawkSearch.registerTheme(
 *   'gallery-nightforge',
 *   createHawkDocsTheme('gallery-nightforge', theme.tokens, 'typeflow', theme.id)
 * );
 */
export function createHawkDocsTheme(name, tokens = {}, baseTheme = 'typeflow', presetId = null) {
  return {
    name,
    apply(element) {
      if (baseTheme) element.dataset.hawkTheme = baseTheme;
      else delete element.dataset.hawkTheme;
      if (presetId) element.dataset.hawkThemePreset = presetId;
      else delete element.dataset.hawkThemePreset;
    },
    tokens: { ...tokens },
  };
}

/**
 * Returns the production documentation-search `HawkSearchConfig` — one tab per category (plus a
 * built-in "Recently updated" sorted tab), `typeflow` theme, and the docs site's own content/
 * inline-filter conventions. `overrides` gives the caller a documented escape hatch for anything
 * not already a named parameter, applied last (so it can override everything above, including
 * `theme`), except `params`/`hotkeys`/`headerControls`/`pagefindInitOptions`/`pagefindOptions`,
 * which are shallow-merged rather than replaced outright so a caller overriding one nested field
 * doesn't have to restate the rest.
 * @param {object} options
 * @param {string} options.index Pagefind bundle path, passed straight through as `config.index`.
 * @param {string[]} [options.excludePages] Page URLs/paths Hawk should never index or match.
 * @param {string[]} [options.categories] Category names to derive one filter tab per name from.
 * @param {Record<string, {url: string, title: string}>} [options.categoryDefaults] Per-category
 *   landing page, used as that tab's `defaultPreviewUrl`/`defaultPreviewTitle` when present.
 * @param {Record<string, string>} [options.accentColors] Per-category tab accent color, keyed by
 *   the same names as `categories` — see `HawkTab.accentColor` in api.md's Tabs section.
 * @param {object} [options.overrides] Arbitrary `HawkSearchConfig` fields merged over the
 *   generated defaults (shallow-merged for the nested keys listed above; replaced for everything
 *   else, e.g. `theme`).
 * @returns {object} A complete `HawkSearchConfig`, ready for `new HawkSearch(...)`.
 * @example
 * new HawkSearch(createHawkDocsSearchConfig({
 *   index: document.body.dataset.hawkIndex,
 *   excludePages: ['/', '/404.html'],
 *   categories: ['Guides', 'Reference'],
 *   categoryDefaults: { Guides: { url: '/guides/', title: 'Guides' } },
 *   accentColors: { Guides: '#20e3b2' },
 * }));
 */
export function createHawkDocsSearchConfig({
  index,
  excludePages = [],
  categories = [],
  categoryDefaults = {},
  accentColors = {},
  overrides = {},
}) {
  const tabs = categories.map((name) => {
    const fallback = categoryDefaults[name];
    return {
      id: name.toLowerCase(),
      label: name,
      filter: { category: name },
      ...(accentColors[name] ? { accentColor: accentColors[name] } : {}),
      ...(fallback ? { defaultPreviewUrl: fallback.url, defaultPreviewTitle: fallback.title } : {}),
    };
  });
  tabs.push({
    id: 'recent',
    label: 'Recently updated',
    sort: { date: 'desc' },
    accentColor: '#34d399',
  });

  return {
    index,
    excludePages: [...excludePages],
    theme: 'typeflow',
    inlineFilters: true,
    contentSelector: '.doc-article',
    tabs,
    previewSections: true,
    discoveryRow: {},
    ...overrides,
    params: { ...(overrides.params || {}) },
    hotkeys: { ...(overrides.hotkeys || {}) },
    headerControls:
      overrides.headerControls === false ? false : { ...(overrides.headerControls || {}) },
    pagefindInitOptions: { ...(overrides.pagefindInitOptions || {}) },
    pagefindOptions: { ...(overrides.pagefindOptions || {}) },
  };
}
