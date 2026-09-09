/**
 * Docs-only Hawk profile adapter.
 *
 * Each factory returns a fresh object. Callers retain ownership of HawkSearch instances, which
 * lets the production search, playground, and future gallery mount independently without shared
 * mutable configuration or duplicate lifecycle ownership.
 */

export const HAWK_PLAYGROUND_TYPEFLOW_PRESET = Object.freeze({
  title: Object.freeze({ typeStyle: 'word-fade', direction: 'left', speed: 45 }),
  anchorTitle: Object.freeze({ typeStyle: 'zoom-in-space', direction: 'left', speed: 55 }),
  content: Object.freeze({ html: true, typeStyle: 'word-fade', direction: 'left', speed: 65 }),
  rotate: Object.freeze({
    holdDuration: 3000,
    pauseBetween: 200,
    typeConfig: Object.freeze({ typeStyle: 'char', speed: 45 }),
    eraseConfig: Object.freeze({ eraseStyle: 'end', speed: 35 }),
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
      '--hawk-text-primary': '#e0def4',
      '--hawk-text-secondary': '#c4a7e7',
      '--hawk-text-muted': '#908caa',
      '--hawk-accent': '#c4a7e7',
      '--hawk-accent-alt': '#ebbcba',
      '--hawk-accent-dim': 'rgba(196, 167, 231, 0.12)',
      '--hawk-preview-bg': '#211f32',
    }),
    params: Object.freeze({ position: 'center', density: 'medium', scale: 0.96 }),
    revealAnimation: 'blur-zoom',
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
      '--hawk-text-primary': '#10211c',
      '--hawk-text-secondary': '#45645b',
      '--hawk-text-muted': '#6d8b82',
      '--hawk-accent': '#008f6c',
      '--hawk-accent-alt': '#00a77b',
      '--hawk-accent-dim': 'rgba(0, 143, 108, 0.09)',
      '--hawk-preview-bg': '#f5faf8',
      '--hawk-backdrop': 'rgba(16, 33, 28, 0.28)',
    }),
    params: Object.freeze({ position: 'center', density: 'fit', scale: 0.94 }),
    revealAnimation: 'fade',
    colorModes: Object.freeze(['light']),
    cssAsset: null,
  }),
]);

/** Returns a mutable copy of one gallery definition for an isolated preview instance. */
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

/** Returns an isolated theme object for a docs application surface. */
export function createHawkDocsTheme(name, tokens = {}, baseTheme = 'typeflow') {
  return {
    name,
    apply(element) {
      if (baseTheme) element.dataset.hawkTheme = baseTheme;
      else delete element.dataset.hawkTheme;
    },
    tokens: { ...tokens },
  };
}

/** Returns the production documentation-search profile. */
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
      ...(fallback
        ? { defaultPreviewUrl: fallback.url, defaultPreviewTitle: fallback.title }
        : {}),
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
    ...overrides,
    params: { ...(overrides.params || {}) },
    hotkeys: { ...(overrides.hotkeys || {}) },
    headerControls:
      overrides.headerControls === false ? false : { ...(overrides.headerControls || {}) },
    pagefindInitOptions: { ...(overrides.pagefindInitOptions || {}) },
    pagefindOptions: { ...(overrides.pagefindOptions || {}) },
  };
}
