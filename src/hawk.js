/**
 * @fileoverview Hawk core engine: a themeable, pluggable command-palette search UI backed by
 * Pagefind. Ported from typeflow's docs site search (docs/static/assets/docs.js /
 * docs/static/assets/docs.css) — DOM structure, keyboard navigation, and modal open/close
 * behavior carried over; the hand-rolled in-browser index/scorer replaced with Pagefind, which
 * owns indexing, ranking, typo tolerance, and match highlighting.
 *
 * Hawk never imports Pagefind, TypeFlow, or a theme's CSS directly — it only knows the
 * contracts documented in architecture/plugin-system.md, architecture/theme-contract.md, and
 * architecture/animation-driver-contract.md.
 * @module hawk
 */

import { HawkAnimationInstant } from './hawk-animation-instant.js';

/** @type {Map<string, import('./hawk-theme-typeflow.js').HawkTheme>} */
const themeRegistry = new Map();
/** @type {Map<string, import('./hawk-animation-instant.js').HawkAnimationDriver>} */
const animationRegistry = new Map();
animationRegistry.set('instant', HawkAnimationInstant);

const DEFAULT_PARAMS = {
  scale: 1,
  position: 'top-center', // 'top-center' | 'center' | 'top-left' | 'top-right'
  offset: { x: '1rem', y: '6vh' },
  alignment: 'stretch', // 'stretch' | 'start' | 'center'
  columns: 2, // 1 | 2 — forced to 1 below `breakpoint` (or in 'compact' density) regardless of this value
  breakpoint: 768, // px
  density: 'medium', // 'fit' | 'medium' | 'compact'
  allowDensityToggle: true,
};

const DENSITY_VALUES = new Set(['fit', 'medium', 'compact']);
const DENSITY_STORAGE_KEY = 'hawk:density';
const PINNED_TAB_ID = 'pinned';

const DEFAULT_HOTKEYS = { open: true, slash: true, escape: true };

/**
 * The 5 built-in `config.revealAnimation` names, each paired with the duration (ms) hawk.css's
 * own keyframes for that name are tuned to — used as the default for `config.revealDuration` and
 * written to `--hawk-reveal-duration` on mount, so hawk.js's close() timer and hawk.css's
 * `animation-duration` read the same single number instead of two hardcoded values drifting apart.
 * A custom (unlisted) `revealAnimation` name falls back to 220ms unless `revealDuration` is given.
 */
const REVEAL_ANIMATION_DURATIONS = {
  fade: 160,
  'scale-fade': 200,
  'slide-down': 220,
  'blur-zoom': 260,
  spring: 340,
};

/**
 * Every piece of UI text hawk renders, overridable via `config.strings` for localization.
 * `matchingResults`/`entries`/`noResults` are functions (not plain strings) so a consumer can
 * supply real pluralization/interpolation logic for their locale instead of hawk guessing at it.
 * `matchingResults`/`entries` receive `(count, pageCount)` — `pageCount` (the number of distinct
 * pages represented, vs. `count`'s flattened row count including anchor/section sub-results) is
 * additive: a single-argument override still works, `pageCount` is just ignored.
 */
const DEFAULT_STRINGS = {
  dialogLabel: 'Search',
  inputPlaceholder: 'Search...',
  densityGroupLabel: 'Result density',
  densityFit: 'Fit',
  densityMedium: 'Medium',
  densityCompact: 'Compact',
  escKey: 'ESC',
  filtersLabel: 'Filter by category',
  previewLabel: 'Preview',
  hintNavigate: 'Navigate',
  hintSelect: 'Select',
  hintClose: 'Close',
  previewEmpty: 'Type to search, or select a result to preview it here.',
  previewLoading: 'Loading…',
  sectionBadge: 'Section',
  untitled: 'Untitled',
  typeToSearch: 'Type to search',
  noResults: (query) => `No results${query ? ` for "${query}"` : ''}.`,
  matchingResults: (count, pageCount) => {
    const base = `${count} matching result${count === 1 ? '' : 's'}`;
    return pageCount && pageCount !== count ? `${base} across ${pageCount} page${pageCount === 1 ? '' : 's'}` : base;
  },
  entries: (count, pageCount) => {
    const base = `${count} entries`;
    return pageCount && pageCount !== count ? `${base} across ${pageCount} page${pageCount === 1 ? '' : 's'}` : base;
  },
  unavailable: 'Search is unavailable right now. Try again later.',
  unavailableCounter: 'Search unavailable',
  poweredBy: 'Search powered by Pagefind',
  pinnedTab: 'Pinned',
  pinAction: 'Pin',
  unpinAction: 'Unpin',
  triggerLabel: 'Search',
  triggerLabelLong: 'Search...',
  triggerKbd: 'Ctrl+K',
};

let instanceCount = 0;

/**
 * Themeable, pluggable command-palette search backed by Pagefind.
 */
export class HawkSearch {
  static themes = themeRegistry;
  static animations = animationRegistry;

  /**
   * Registers a theme plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-theme-typeflow.js').HawkTheme} theme
   */
  static registerTheme(name, theme) {
    themeRegistry.set(name, theme);
  }

  /**
   * Registers an animation driver plugin so it can be selected by name.
   * @param {string} name
   * @param {import('./hawk-animation-instant.js').HawkAnimationDriver} driver
   */
  static registerAnimation(name, driver) {
    animationRegistry.set(name, driver);
  }

  /**
   * @param {object} [config]
   * @param {string} [config.index] Base path (URL, trailing slash) to a Pagefind bundle — the
   *   directory `pagefind --site <dir>` wrote `pagefind.js` into. Required unless `config.pagefind` is given.
   * @param {object} [config.pagefind] A pre-loaded Pagefind module (or compatible mock) to use
   *   instead of dynamically importing one from `config.index` — e.g. when the consumer already
   *   bundles Pagefind, or in tests.
   * @param {string} [config.triggerSelector='[data-search-trigger]'] Elements that open the modal on click.
   * @param {HTMLElement} [config.container=document.body] Where the modal is mounted.
   * @param {Partial<typeof DEFAULT_PARAMS>} [config.params] Layout params: scale/position/offset/alignment/
   *   columns/breakpoint, plus `density` ('fit'|'medium'|'compact', default 'medium' — 'compact' forces
   *   1 column like below `breakpoint`) and `allowDensityToggle` (default true — shows an in-modal
   *   fit/medium/compact switcher; the visitor's last choice persists to `localStorage`). If `density`
   *   isn't given here, a previously-persisted choice is used before falling back to 'medium'.
   * @param {string|import('./hawk-theme-typeflow.js').HawkTheme} [config.theme='typeflow'] Registered theme name or a theme object.
   * @param {string|import('./hawk-animation-instant.js').HawkAnimationDriver|false} [config.animation] Registered
   *   animation name, a driver object, or `false` to force the instant driver. Defaults to `'typeflow'` if that
   *   name is registered (i.e. the consumer loaded hawk-animation-typeflow.js and registered it), else `'instant'`.
   * @param {string[]} [config.categories] Shorthand for `config.tabs`: one tab per category name, each
   *   filtering on `categoryFilterName`. Ignored if `config.tabs` is given.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>, defaultPreviewUrl?: string, defaultPreviewTitle?: string}>} [config.tabs]
   *   Explicit tab list. `filter` is a raw Pagefind `filters` object (passed to `search()`/`debouncedSearch()`
   *   verbatim) — omit it for a filterless tab (e.g. "All"). `defaultPreviewUrl`/`defaultPreviewTitle` override
   *   `config.defaultPreviewUrl`/`config.defaultPreviewTitle` while this tab is active and nothing is selected
   *   (zero matches, or before a query is typed) — see the top-level options below for the fetch/extract
   *   behavior those share. Replaces auto-derivation from Pagefind's `filters()` entirely and renders
   *   synchronously on mount instead of waiting for Pagefind to load.
   * @param {boolean} [config.includeAllTab=true] Prepend a filterless "All" tab to `tabs`/`categories`/the
   *   auto-derived list.
   * @param {string} [config.defaultTab='all'] Tab id active on open. Falls back to `'all'` (with a console
   *   warning) if it doesn't match any resolved tab.
   * @param {Record<string, unknown>} [config.pagefindOptions] Raw options merged into every
   *   `search()`/`debouncedSearch()` call (e.g. `sort`, `ranking`, `language`) — an escape hatch for Pagefind
   *   tuning hawk doesn't otherwise wrap. A tab's own `pagefindOptions` merges over this per-tab.
   * @param {string} [config.categoryFilterName='category'] The Pagefind filter dimension used for the
   *   auto-derived tabs and the `categories` shorthand (see `data-pagefind-filter`).
   * @param {number} [config.maxResults=18] Maximum rendered result rows.
   * @param {string} [config.contentSelector='[data-pagefind-body]'] Selector used to extract the
   *   preview pane's content from a fetched result page (fetched from `item.url`, same-origin).
   *   Falls back to Pagefind's short excerpt if `fetch`/`DOMParser` are unavailable or the request fails.
   * @param {boolean} [config.disableDefaultMarkdownStyles=false] Opts out of hawk.css's own preview-content
   *   prose rules (headings/lists/tables/code/etc.) entirely, so a consumer can target `.hawk-preview-content`
   *   with their own CSS (e.g. an existing site-wide `.prose` class) instead of overriding hawk's.
   * @param {string} [config.defaultPreviewUrl] Shows this page's content in the preview pane as soon as the
   *   modal mounts, before any result is selected — fetched/extracted via the same path a real selection
   *   uses. Also shown whenever the active tab has zero matches and doesn't define its own
   *   `defaultPreviewUrl` (see `config.tabs`). Replaced the instant real results exist (from a selection,
   *   or from `eagerResults`).
   * @param {string} [config.defaultPreviewTitle=''] Title shown above `defaultPreviewUrl`'s content.
   * @param {'fade'|'scale-fade'|'slide-down'|'blur-zoom'|'spring'|string|false} [config.revealAnimation='scale-fade']
   *   Modal open/close reveal, applied to `.hawk-modal-backdrop`/`.hawk-modal-dialog` via hawk.css keyframes
   *   selected on `[data-hawk-reveal]`. `false` disables it (today's instant show/hide). Any other string is
   *   accepted too — hawk.js only sets the attribute and the CSS variable below, so a consumer can define
   *   `[data-hawk-reveal="my-name"]` keyframes of their own. Always skipped (instant, matching `false`)
   *   when the visitor has `prefers-reduced-motion: reduce` set.
   * @param {number} [config.revealDuration] Milliseconds hawk.js waits before actually hiding the modal
   *   after `close()` (and the value written to `--hawk-reveal-duration`, which hawk.css's keyframes read
   *   for `animation-duration`) — defaults to the built-in duration for the 5 named animations above, or
   *   220ms for an unrecognized/custom `revealAnimation` name.
   * @param {boolean} [config.eagerResults=true] Runs an empty-query search as soon as Pagefind loads, so the
   *   results pane shows a default listing instead of "Type to search". Set `false` to keep the results pane
   *   empty until the visitor types.
   * @param {string[]} [config.rotatingPlaceholders] Example queries cycled through the input's placeholder
   *   via the animation driver's `rotatePlaceholder` (an overlay, since a native `<input>` placeholder can't
   *   be typed character-by-character) — only while the modal is open and the input is empty. Falls back to
   *   `strings.inputPlaceholder` (unchanged, static) if omitted.
   * @param {boolean} [config.showPoweredBy=true] Shows a small "Search powered by Pagefind" link in the
   *   modal footer. Text-only (no logo asset vendored).
   * @param {string} [config.poweredByHref='https://pagefind.app/'] Link target for the powered-by attribution.
   * @param {boolean} [config.enablePins=true] Lets a visitor pin a result from within the results list — a
   *   pin toggle renders on every row, and a synthetic "Pinned" tab is prepended once at least one exists.
   * @param {string} [config.pinStorageKey='hawk:pins'] `localStorage` key pins persist to (an array of
   *   `{url, title, isAnchor}`).
   * @param {number} [config.maxPins=20] Caps the number of pins; pinning past the cap is a silent no-op.
   * @param {boolean} [config.inlineFilters=false] Lets a visitor type `dimension:value` tokens (e.g.
   *   `category:Guides`, `tag:"multi word"`) directly into the search box — parsed out as a Pagefind
   *   filters object (merged over the active tab's own `filter`, inline wins on a dimension collision)
   *   and stripped from the text actually searched. Off by default: turning it on changes how a literal
   *   colon in a normal query behaves (e.g. `"ratio: 16:9"` would get `ratio:` parsed as a filter attempt).
   * @param {boolean} [config.previewSections=false] For a page-level match (not an anchor/sub_result — those
   *   already show their one matched section in full), breaks the preview into clickable rows — one per
   *   heading matching `previewSectionSelector`, each with the heading text and a short plain-text excerpt
   *   of the content up to the next heading — instead of dumping the whole page. Falls back to the full
   *   content view if the page has no matching headings. Reuses the same fetched/cached page content the
   *   full view uses — no extra network request.
   * @param {string} [config.previewSectionSelector='h2, h3'] Which headings count as a "section" for
   *   `previewSections`.
   * @param {number} [config.previewSectionExcerptLength=140] Max characters of a `previewSections` row's
   *   excerpt before truncating with an ellipsis.
   * @param {object} [config.trigger] Renders hawk's own trigger button instead of requiring the consumer to
   *   build one — omit entirely to keep today's behavior (`triggerSelector` pointing at hand-built markup).
   * @param {'minimal'|'compact'|'default'} [config.trigger.kind='default'] `'minimal'`: icon only. `'compact'`:
   *   icon + "Search". `'default'`: icon + "Search..." + a Ctrl/Cmd+K hint (omitted if `hotkeys.open` is off).
   * @param {string|HTMLElement} config.trigger.container Required — selector or element the trigger button is
   *   appended into. Always marked `[data-search-trigger]` regardless of a customized `triggerSelector`.
   * @param {Partial<typeof DEFAULT_STRINGS>} [config.strings] Overrides for any UI text (localization).
   *   See `DEFAULT_STRINGS` for the full key list; `noResults`/`matchingResults`/`entries` are
   *   functions, not plain strings, so a locale can supply its own pluralization.
   * @param {(query: string) => void} [config.onOpen]
   * @param {() => void} [config.onClose]
   * @param {(item: object) => void} [config.onSelect]
   */
  constructor(config = {}) {
    if (!config.index && !config.pagefind) {
      throw new Error('HawkSearch requires config.index (the Pagefind bundle base path) or config.pagefind.');
    }

    this.id = config.id || `hawk-search-${(instanceCount += 1)}`;
    this.indexBasePath = config.index ? (config.index.endsWith('/') ? config.index : `${config.index}/`) : null;
    this.#injectedPagefind = config.pagefind || null;
    this.triggerSelector = config.triggerSelector || '[data-search-trigger]';
    this.container = config.container || (typeof document !== 'undefined' ? document.body : null);
    const storedDensity = this.#readStoredDensity();
    this.params = {
      ...DEFAULT_PARAMS,
      ...(storedDensity ? { density: storedDensity } : {}),
      ...config.params,
      offset: { ...DEFAULT_PARAMS.offset, ...config.params?.offset },
    };
    this.categoryFilterName = config.categoryFilterName || 'category';
    this.includeAllTab = config.includeAllTab !== false;
    this.pagefindOptions = config.pagefindOptions || {};
    this.maxResults = config.maxResults ?? 18;
    this.contentSelector = config.contentSelector || '[data-pagefind-body]';
    this.disableDefaultMarkdownStyles = config.disableDefaultMarkdownStyles || false;
    this.rotatingPlaceholders = config.rotatingPlaceholders || [];
    this.showPoweredBy = config.showPoweredBy !== false;
    this.poweredByHref = config.poweredByHref || 'https://pagefind.app/';
    this.enablePins = config.enablePins !== false;
    this.pinStorageKey = config.pinStorageKey || 'hawk:pins';
    this.maxPins = config.maxPins ?? 20;
    this.inlineFilters = config.inlineFilters || false;
    this.previewSections = config.previewSections || false;
    this.previewSectionSelector = config.previewSectionSelector || 'h2, h3';
    this.previewSectionExcerptLength = config.previewSectionExcerptLength ?? 140;
    this.triggerConfig = config.trigger || null;
    this.hotkeys = { ...DEFAULT_HOTKEYS, ...config.hotkeys };
    this.strings = { ...DEFAULT_STRINGS, ...config.strings };
    this.defaultPreviewUrl = config.defaultPreviewUrl || null;
    this.defaultPreviewTitle = config.defaultPreviewTitle || '';
    this.revealAnimation = config.revealAnimation === false ? false : config.revealAnimation || 'scale-fade';
    this.revealDuration = config.revealDuration ?? REVEAL_ANIMATION_DURATIONS[this.revealAnimation] ?? 220;
    this.eagerResults = config.eagerResults !== false;
    this.onOpen = config.onOpen;
    this.onClose = config.onClose;
    this.onSelect = config.onSelect;

    this.#theme = this.#resolveTheme(config.theme);
    this.#animation = this.#resolveAnimation(config.animation);

    this.#query = '';
    this.#selectedIndex = -1;
    this.#matches = [];
    this.#pageCount = 0;
    this.#pins = this.enablePins ? this.#readPins() : [];
    this.#currentTabId = config.defaultTab || 'all';
    this.#tabs = this.#resolveExplicitTabs(config);
    this.#tabsExplicit = this.#tabs !== null;
    this.#isOpen = false;
    this.#pagefind = null;
    this.#pagefindLoadPromise = null;
    this.#pagefindError = null;
    this.#previewController = null;
    this.#previewKey = null;
    this.#fragmentCache = new Map();
    this.#scrollBrightenTimers = new Map();

    if (this.container) {
      this.#mount();
    }
  }

  #theme;
  #animation;
  #query;
  #selectedIndex;
  #matches;
  #pageCount;
  #pins;
  #builtInTrigger;
  #tabs;
  #currentTabId;
  #tabsExplicit;
  #isOpen;
  #pagefind;
  #pagefindLoadPromise;
  #pagefindError;
  #previewController;
  #previewKey;
  #fragmentCache;
  #injectedPagefind;
  #root;
  #input;
  #inputWrap;
  #placeholderGhostEl;
  #placeholderController;
  #resultsEl;
  #previewEl;
  #filtersEl;
  #counterEl;
  #scrollBrightenTimers;
  #mediaQuery;
  #onBreakpointChange;
  #revealTimer;

  /** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */
  get state() {
    return {
      open: this.#isOpen,
      query: this.#query,
      selectedIndex: this.#selectedIndex,
      matches: this.#matches,
      pageCount: this.#pageCount,
      pins: this.#pins,
      activeTab: this.#currentTabId,
      error: this.#pagefindError,
    };
  }

  #resolveTheme(theme) {
    if (!theme) {
      return themeRegistry.get('typeflow') || null;
    }
    if (typeof theme === 'string') {
      const resolved = themeRegistry.get(theme);
      if (!resolved) {
        throw new Error(`HawkSearch: no theme registered as "${theme}". Call HawkSearch.registerTheme first.`);
      }
      return resolved;
    }
    return theme;
  }

  #resolveAnimation(animation) {
    if (animation === false) {
      return animationRegistry.get('instant');
    }
    if (!animation) {
      return animationRegistry.get('typeflow') || animationRegistry.get('instant');
    }
    if (typeof animation === 'string') {
      const resolved = animationRegistry.get(animation);
      if (!resolved) {
        throw new Error(`HawkSearch: no animation driver registered as "${animation}". Call HawkSearch.registerAnimation first.`);
      }
      return resolved;
    }
    return animation;
  }

  /**
   * Resolves `config.tabs`/`config.categories` into a normalized tab list, or `null` if neither
   * is configured (meaning: derive tabs from Pagefind's `filters()` once the index loads).
   */
  #resolveExplicitTabs(config) {
    if (config.tabs) {
      return this.#normalizeTabs(config.tabs);
    }
    if (config.categories) {
      return this.#normalizeTabs(config.categories.map((c) => ({ id: c, label: c, filter: { [this.categoryFilterName]: c } })));
    }
    return null;
  }

  /**
   * Fills in `id` (slugified from `label` when omitted) and prepends a filterless "All" tab
   * per `includeAllTab`.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} tabs
   */
  #normalizeTabs(tabs) {
    const normalized = tabs.map((t) => ({
      id: t.id || this.#slugify(t.label),
      label: t.label,
      filter: t.filter || null,
      pagefindOptions: t.pagefindOptions || null,
      defaultPreviewUrl: t.defaultPreviewUrl || null,
      defaultPreviewTitle: t.defaultPreviewTitle || '',
    }));
    return this.includeAllTab
      ? [{ id: 'all', label: 'All', filter: null, pagefindOptions: null }, ...normalized]
      : normalized;
  }

  #slugify(label) {
    return (
      String(label)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'tab'
    );
  }

  /**
   * Sets the resolved tab list, validates `#currentTabId` against it (falling back to `'all'`,
   * or the first tab if there's no `'all'`, with a console warning if a configured `defaultTab`
   * didn't match), and re-renders the filter pills.
   * @param {ReturnType<HawkSearch['#normalizeTabs']>} tabs
   */
  #applyDefaultTabAndRender(tabs) {
    this.#tabs = tabs;
    if (!tabs.some((t) => t.id === this.#currentTabId)) {
      // Not a misconfiguration warning when it's the Pinned tab dynamically appearing/disappearing
      // as pins are added/removed (#togglePin) — only for a genuinely unmatched defaultTab.
      if (this.#currentTabId !== 'all' && this.#currentTabId !== PINNED_TAB_ID) {
        console.warn(`HawkSearch: no tab with id "${this.#currentTabId}" (defaultTab); falling back to "all".`);
      }
      this.#currentTabId = tabs.some((t) => t.id === 'all') ? 'all' : (tabs[0]?.id ?? 'all');
    }
    this.#renderFilters();
  }

  #mount() {
    this.#mountTrigger();
    const root = document.createElement('div');
    root.innerHTML = this.#markup();
    this.#root = root.firstElementChild;
    this.container.appendChild(this.#root);

    this.#input = this.#root.querySelector('.hawk-modal-input');
    this.#inputWrap = this.#root.querySelector('.hawk-input-wrap');
    this.#placeholderGhostEl = this.#root.querySelector('.hawk-input-ghost');
    if (this.#placeholderGhostEl) {
      // Set synchronously so there's no blank gap before rotation starts on open() — the
      // animation driver only takes over the cycling from here, not the initial paint.
      this.#placeholderGhostEl.textContent = this.rotatingPlaceholders[0];
      this.#updatePlaceholderVisibility();
    }
    this.#resultsEl = this.#root.querySelector('.hawk-results-pane');
    this.#previewEl = this.#root.querySelector('.hawk-preview-pane');
    this.#filtersEl = this.#root.querySelector('.hawk-modal-filters');
    this.#counterEl = this.#root.querySelector('.hawk-modal-counter');
    [this.#resultsEl, this.#previewEl, this.#filtersEl].forEach((el) => this.#wireScrollBrighten(el));

    if (this.#theme) {
      this.#theme.apply(this.#root);
      Object.entries(this.#theme.tokens || {}).forEach(([token, value]) => {
        this.#root.style.setProperty(token, value);
      });
    }
    if (this.disableDefaultMarkdownStyles) {
      this.#root.dataset.hawkMarkdownStyles = 'off';
    }
    if (this.revealAnimation) {
      this.#root.dataset.hawkReveal = this.revealAnimation;
      this.#root.style.setProperty('--hawk-reveal-duration', `${this.revealDuration}ms`);
    }
    this.#applyParams();
    if (this.#tabsExplicit) {
      this.#applyDefaultTabAndRender(this.#withPinnedTab(this.#tabs));
    }
    const initialDefault = this.#activeTabDefaultPreview();
    if (initialDefault.url) {
      this.#renderDefaultPreview(initialDefault.url, initialDefault.title);
    }

    document.querySelectorAll(this.triggerSelector).forEach((btn) => {
      btn.addEventListener('click', () => this.open());
    });
    this.#root.querySelectorAll('[data-search-close]').forEach((el) => {
      el.addEventListener('click', () => this.close());
    });
    this.#root.querySelectorAll('.hawk-density-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.setParams({ density: btn.dataset.density });
        this.#persistDensity(btn.dataset.density);
      });
    });

    this.#input.addEventListener('input', () => {
      this.#executeSearch(this.#input.value);
      this.#updatePlaceholderVisibility();
    });
    this.#input.addEventListener('keydown', (event) => this.#handleListKeydown(event));
    this.#input.addEventListener('focus', () => this.#ensurePagefindLoaded(), { once: true });

    this.#resultsEl.addEventListener('keydown', (event) => this.#handleResultsPaneKeydown(event));
    this.#previewEl.addEventListener('keydown', (event) => this.#handlePreviewKeydown(event));
    // Reveals the preview pane in place of the results pane in single-column (compact/narrow)
    // layouts — see the [data-hawk-show-preview] rules in hawk.css.
    this.#previewEl.addEventListener('focus', () => {
      this.#root.dataset.hawkShowPreview = 'true';
    });
    this.#previewEl.addEventListener('blur', () => {
      this.#root.dataset.hawkShowPreview = 'false';
    });

    // Always attached (not gated by `hotkeys`) — focus trapping is baseline modal accessibility,
    // not an opt-in hotkey. #handleGlobalKeydown checks `this.hotkeys.*` itself per hotkey.
    document.addEventListener('keydown', (event) => this.#handleGlobalKeydown(event));
  }

  /**
   * Renders hawk's own trigger button into `triggerConfig.container` (config.trigger) — the
   * default `[data-search-trigger]` marker means the existing triggerSelector-based click wiring
   * later in #mount() picks it up automatically, no separate listener needed. A no-op when
   * config.trigger wasn't given (today's only mode: triggerSelector points at hand-built markup).
   */
  #mountTrigger() {
    if (!this.triggerConfig) {
      return;
    }
    const target =
      typeof this.triggerConfig.container === 'string'
        ? document.querySelector(this.triggerConfig.container)
        : this.triggerConfig.container;
    if (!target) {
      console.warn(`HawkSearch: config.trigger.container "${this.triggerConfig.container}" not found — no built-in trigger rendered.`);
      return;
    }
    const kind = this.triggerConfig.kind || 'default';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `hawk-trigger hawk-trigger-${kind}`;
    btn.setAttribute('data-search-trigger', '');
    if (kind === 'minimal') {
      btn.setAttribute('aria-label', this.strings.dialogLabel);
    }
    btn.innerHTML = this.#triggerMarkup(kind);
    if (this.#theme) {
      // The trigger button lives outside #root, so it doesn't inherit #root's scoped
      // [data-hawk-theme='name'] custom properties from the theme's CSS file — stamping the
      // same attribute here (attribute selectors match any element, not just #root) is what
      // makes the theme's tokens actually reach it too, not just the modal.
      this.#theme.apply(btn);
      Object.entries(this.#theme.tokens || {}).forEach(([token, value]) => {
        btn.style.setProperty(token, value);
      });
    }
    target.appendChild(btn);
    this.#builtInTrigger = btn;
  }

  #triggerMarkup(kind) {
    const s = this.strings;
    const icon = `<svg class="hawk-trigger-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    if (kind === 'minimal') {
      return icon;
    }
    if (kind === 'compact') {
      return `${icon}<span class="hawk-trigger-label">${s.triggerLabel}</span>`;
    }
    const kbd = this.hotkeys.open ? `<kbd class="hawk-trigger-kbd">${s.triggerKbd}</kbd>` : '';
    return `${icon}<span class="hawk-trigger-label">${s.triggerLabelLong}</span>${kbd}`;
  }

  #markup() {
    const s = this.strings;
    return `
      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="${s.dialogLabel}" hidden>
        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>
        <div class="hawk-modal-dialog">
          <div class="hawk-modal-header">
            <div class="hawk-input-wrap">
              <input class="hawk-modal-input" type="search" placeholder="${this.rotatingPlaceholders.length ? '' : s.inputPlaceholder}" autocomplete="off" spellcheck="false"
                aria-autocomplete="list" aria-controls="${this.id}-results" />
              ${this.rotatingPlaceholders.length ? `<span class="hawk-input-ghost" aria-hidden="true"></span>` : ''}
            </div>
            ${
              this.params.allowDensityToggle
                ? `<div class="hawk-density-toggle" role="group" aria-label="${s.densityGroupLabel}">
              <button type="button" class="hawk-density-btn" data-density="fit">${s.densityFit}</button>
              <button type="button" class="hawk-density-btn" data-density="medium">${s.densityMedium}</button>
              <button type="button" class="hawk-density-btn" data-density="compact">${s.densityCompact}</button>
            </div>`
                : ''
            }
            <button class="hawk-modal-esc" data-search-close type="button"><kbd>${s.escKey}</kbd></button>
          </div>
          <div class="hawk-modal-filters" role="tablist" aria-label="${s.filtersLabel}"></div>
          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">
            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite" tabindex="0"></div>
            <aside class="hawk-preview-pane" aria-live="polite" aria-label="${s.previewLabel}" tabindex="0">
              <div class="hawk-preview-empty">${s.previewEmpty}</div>
            </aside>
          </div>
          <div class="hawk-modal-footer">
            <span class="hawk-hint">&uarr;&darr; ${s.hintNavigate}</span>
            <span class="hawk-hint">&crarr; ${s.hintSelect}</span>
            <span class="hawk-hint">${s.escKey} ${s.hintClose}</span>
            <div class="hawk-modal-counter">${s.typeToSearch}</div>
            ${
              this.showPoweredBy
                ? `<a class="hawk-powered-by" href="${this.poweredByHref}" target="_blank" rel="noreferrer">${s.poweredBy}</a>`
                : ''
            }
          </div>
        </div>
      </div>
    `.trim();
  }

  #applyParams() {
    const { scale, position, offset, columns, breakpoint, density } = this.params;
    this.#root.style.setProperty('--hawk-scale', String(scale));
    this.#root.style.setProperty('--hawk-offset-x', this.#cssLength(offset.x));
    this.#root.style.setProperty('--hawk-offset-y', this.#cssLength(offset.y));
    this.#root.dataset.hawkPosition = position;
    this.#root.dataset.hawkDensity = density;
    this.#root.querySelector('.hawk-modal-body').dataset.hawkColumns = String(columns);
    this.#root.querySelectorAll('.hawk-density-btn').forEach((btn) => {
      const isActive = btn.dataset.density === density;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    if (this.#mediaQuery) {
      this.#mediaQuery.removeEventListener?.('change', this.#onBreakpointChange);
      this.#mediaQuery = null;
    }
    if (typeof window.matchMedia === 'function') {
      this.#mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
      this.#onBreakpointChange = () => {
        this.#root.dataset.hawkCompact = String(this.#mediaQuery.matches);
      };
      this.#mediaQuery.addEventListener('change', this.#onBreakpointChange);
      this.#onBreakpointChange();
    }
  }

  #cssLength(value) {
    return typeof value === 'number' ? `${value}px` : String(value);
  }

  /** Reads a persisted density preference, if any. Never throws (private browsing, SSR, etc.). */
  #readStoredDensity() {
    try {
      const value = typeof localStorage !== 'undefined' ? localStorage.getItem(DENSITY_STORAGE_KEY) : null;
      return DENSITY_VALUES.has(value) ? value : null;
    } catch {
      return null;
    }
  }

  /** Persists a density preference so it survives modal close/reopen and page reloads. */
  #persistDensity(density) {
    try {
      localStorage?.setItem(DENSITY_STORAGE_KEY, density);
    } catch {
      // private browsing / storage disabled / no localStorage (SSR) — density still applies for this session.
    }
  }

  /** Reads persisted pins. Never throws (private browsing, SSR, corrupt JSON, etc.). */
  #readPins() {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(this.pinStorageKey) : null;
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /** Persists the current pin list. Never throws — pins still work in-memory this session either way. */
  #writePins(pins) {
    try {
      localStorage?.setItem(this.pinStorageKey, JSON.stringify(pins));
    } catch {
      // private browsing / storage disabled / no localStorage (SSR) — pins don't persist this session.
    }
  }

  #isPinned(url) {
    return this.#pins.some((p) => p.url === url);
  }

  /**
   * Returns `tabs` with a synthetic "Pinned" tab prepended, if pins are enabled and at least one
   * exists — filterless, sourced from `#pins` instead of a Pagefind search (see #activateFilter/
   * #renderPinnedResults). Absent entirely when there's nothing pinned, same as `includeAllTab`'s
   * "All" pill only ever being one thing, not a toggle.
   */
  #withPinnedTab(tabs) {
    if (!this.enablePins || !this.#pins.length) {
      return tabs;
    }
    return [
      { id: PINNED_TAB_ID, label: this.strings.pinnedTab, filter: null, pagefindOptions: null, defaultPreviewUrl: null, defaultPreviewTitle: '' },
      ...tabs,
    ];
  }

  /**
   * Toggles `item`'s pin state, persists it, and updates the tab list (the "Pinned" tab
   * appears/disappears as pins go from/to zero) — then refreshes whatever's currently showing:
   * re-renders the pinned list if that tab is active, re-runs the last search if the tab just
   * disappeared out from under an active Pinned view, or just re-renders the current matches
   * (no new Pagefind call needed) to flip the toggled row's pressed-state everywhere else.
   */
  #togglePin(item) {
    const wasOnPinnedTab = this.#currentTabId === PINNED_TAB_ID;
    if (this.#isPinned(item.url)) {
      this.#pins = this.#pins.filter((p) => p.url !== item.url);
    } else if (this.#pins.length < this.maxPins) {
      this.#pins = [...this.#pins, { url: item.url, title: item.title, isAnchor: item.isAnchor }];
    } else {
      return;
    }
    this.#writePins(this.#pins);
    this.#applyDefaultTabAndRender(this.#withPinnedTab((this.#tabs || []).filter((t) => t.id !== PINNED_TAB_ID)));
    if (this.#currentTabId === PINNED_TAB_ID) {
      this.#renderPinnedResults();
    } else if (wasOnPinnedTab) {
      this.#executeSearch(this.#query);
    } else {
      this.#renderResults();
    }
  }

  /** Lists pinned items directly — no Pagefind call, they already carry title/url/isAnchor. */
  #renderPinnedResults() {
    this.#matches = this.#pins.map((p) => ({ title: p.title, url: p.url, excerpt: '', isAnchor: p.isAnchor, meta: {} }));
    this.#pageCount = new Set(this.#matches.map((m) => m.url.split('#')[0])).size;
    this.#selectedIndex = this.#matches.length ? 0 : -1;
    this.#renderResults();
  }

  /**
   * Updates layout params after construction (scale/position/offset/alignment/columns/breakpoint).
   * @param {Partial<typeof DEFAULT_PARAMS>} params
   */
  setParams(params) {
    this.params = { ...this.params, ...params, offset: { ...this.params.offset, ...params?.offset } };
    this.#applyParams();
  }

  async #ensurePagefindLoaded() {
    if (this.#pagefind) {
      return this.#pagefind;
    }
    if (this.#injectedPagefind) {
      this.#pagefind = this.#injectedPagefind;
      await this.#deriveTabs();
      await this.#afterPagefindReady();
      return this.#pagefind;
    }
    if (!this.#pagefindLoadPromise) {
      this.#pagefindLoadPromise = import(/* @vite-ignore */ `${this.indexBasePath}pagefind.js`)
        .then(async (mod) => {
          await mod.options({ basePath: this.indexBasePath });
          this.#pagefind = mod;
          await this.#deriveTabs();
          await this.#afterPagefindReady();
          return mod;
        })
        .catch((err) => {
          // A 404/network failure loading Pagefind's own runtime — `this.#pagefind` stays null,
          // so callers' existing `if (!this.#pagefind) return;` guards already no-op correctly.
          // This promise resolving (not rejecting) to null is what keeps that guard sufficient —
          // without it, every `await this.#ensurePagefindLoaded()` call site would need its own
          // try/catch instead of one shared one here. Cached like a success, so a failed load
          // isn't retried on every keystroke.
          this.#pagefindError = err;
          this.#renderLoadError();
          return null;
        });
    }
    return this.#pagefindLoadPromise;
  }

  /**
   * Runs once, right after Pagefind first loads and tabs are resolved: populates a default
   * results listing (`eagerResults`) if the visitor hasn't typed anything yet.
   */
  async #afterPagefindReady() {
    // defaultTab: 'pinned' with pins already present from a previous session — show them
    // directly rather than letting eagerResults run an unfiltered Pagefind search underneath.
    if (this.#currentTabId === PINNED_TAB_ID) {
      this.#renderPinnedResults();
      return;
    }
    if (this.eagerResults && !this.#query) {
      await this.#executeSearch('');
    }
  }

  /**
   * Renders a "search unavailable" state in place of results — used when Pagefind's runtime
   * fails to load, or a search call itself rejects, instead of leaving the modal on a stale
   * "Type to search" state or throwing an unhandled rejection out of an event listener.
   */
  #renderLoadError() {
    this.#resultsEl.innerHTML = `<div class="hawk-empty hawk-load-error" role="alert">${this.strings.unavailable}</div>`;
    this.#resultsEl.removeAttribute('aria-activedescendant');
    this.#counterEl.textContent = this.strings.unavailableCounter;
  }

  /**
   * The default preview to show when nothing is selected: the active tab's own
   * `defaultPreviewUrl`/`defaultPreviewTitle` if it has one, else `config.defaultPreviewUrl`/
   * `config.defaultPreviewTitle`, else neither.
   * @returns {{url: string|null, title: string}}
   */
  #activeTabDefaultPreview() {
    const tab = (this.#tabs || []).find((t) => t.id === this.#currentTabId);
    if (tab?.defaultPreviewUrl) {
      return { url: tab.defaultPreviewUrl, title: tab.defaultPreviewTitle };
    }
    return { url: this.defaultPreviewUrl, title: this.defaultPreviewTitle };
  }

  /**
   * Renders `url`'s content into the preview pane in place of a real selection — on mount before
   * any result exists, and whenever the active tab has zero matches. Reuses the same fetch/extract
   * path `#loadPreviewContent` uses for a real match, so it's real rendered page content, not a
   * special-cased fixture. A real selection (or an `eagerResults` listing) replaces it the moment
   * `#matches` is non-empty.
   * @param {string} url
   * @param {string} title
   */
  #renderDefaultPreview(url, title) {
    if (url === this.#previewKey) {
      return;
    }
    this.#previewKey = url;
    this.#previewEl.innerHTML = `
      <div class="hawk-preview-header"></div>
      <h3 class="hawk-preview-title"></h3>
      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>
    `;
    const titleEl = this.#previewEl.querySelector('.hawk-preview-title');
    const contentEl = this.#previewEl.querySelector('.hawk-preview-content');
    this.#animation.typeTitle(titleEl, title, { isAnchor: false });
    this.#loadPreviewContent({ url, excerpt: '', isAnchor: false }, url, contentEl);
  }

  /**
   * Derives tabs from Pagefind's `filters()` for `categoryFilterName`, unless `tabs`/`categories`
   * was explicitly configured — in which case this is a no-op, since `#mount()` already rendered
   * them synchronously.
   */
  async #deriveTabs() {
    if (this.#tabsExplicit) {
      return;
    }
    if (!this.#pagefind) {
      this.#applyDefaultTabAndRender(this.#withPinnedTab(this.#normalizeTabs([])));
      return;
    }
    let categories = [];
    try {
      const filters = await this.#pagefind.filters();
      const values = filters?.[this.categoryFilterName];
      categories = values ? Object.keys(values) : [];
    } catch {
      categories = [];
    }
    this.#applyDefaultTabAndRender(
      this.#withPinnedTab(this.#normalizeTabs(categories.map((c) => ({ id: c, label: c, filter: { [this.categoryFilterName]: c } }))))
    );
  }

  #renderFilters() {
    const tabs = this.#tabs || [];
    this.#filtersEl.innerHTML = tabs
      .map((tab) => {
        const isActive = tab.id === this.#currentTabId;
        return `<button type="button" class="hawk-filter-pill${isActive ? ' active' : ''}" data-filter="${tab.id}" role="tab" aria-selected="${isActive}" aria-controls="${this.id}-results" tabindex="${isActive ? 0 : -1}">${tab.label}</button>`;
      })
      .join('');

    const pillEls = Array.from(this.#filtersEl.querySelectorAll('.hawk-filter-pill'));
    pillEls.forEach((pill, idx) => {
      pill.addEventListener('click', () => {
        this.#activateFilter(pill);
        this.#input.focus();
      });
      pill.addEventListener('keydown', (event) => this.#handleFilterKeydown(event, idx, pillEls));
    });
  }

  /**
   * Activates a tab: updates selection state/ARIA and re-runs the current search scoped to it.
   * For an auto-derived tab, flag a page with `data-pagefind-filter="<categoryFilterName>:<value>"`
   * — a page can carry more than one such marker to appear under multiple tabs.
   * @param {HTMLElement} pill
   */
  #activateFilter(pill) {
    this.#currentTabId = pill.dataset.filter;
    this.#filtersEl.querySelectorAll('.hawk-filter-pill').forEach((p) => {
      const isActive = p === pill;
      p.classList.toggle('active', isActive);
      p.setAttribute('aria-selected', String(isActive));
      p.tabIndex = isActive ? 0 : -1;
    });
    if (this.#currentTabId === PINNED_TAB_ID) {
      // The Pinned tab isn't a search scope — it's a fixed list, so a leftover typed query from
      // another tab shouldn't silently (and confusingly) carry over.
      this.#query = '';
      this.#input.value = '';
      this.#renderPinnedResults();
    } else {
      this.#executeSearch(this.#query);
    }
  }

  /**
   * Standard ARIA tablist keyboard pattern: Left/Right (wraparound) and Home/End move focus
   * and activate the tab under focus.
   */
  #handleFilterKeydown(event, idx, pillEls) {
    let nextIdx = null;
    if (event.key === 'ArrowRight') {
      nextIdx = (idx + 1) % pillEls.length;
    } else if (event.key === 'ArrowLeft') {
      nextIdx = (idx - 1 + pillEls.length) % pillEls.length;
    } else if (event.key === 'Home') {
      nextIdx = 0;
    } else if (event.key === 'End') {
      nextIdx = pillEls.length - 1;
    }
    if (nextIdx !== null) {
      event.preventDefault();
      pillEls[nextIdx].focus();
      this.#activateFilter(pillEls[nextIdx]);
    }
  }

  /**
   * Parses `dimension:value` tokens out of a raw query (config.inlineFilters), e.g.
   * `category:Guides responsive nav` -> `{ filters: { category: 'Guides' }, remainingQuery: 'responsive nav' }`.
   * A quoted value (`tag:"multi word"`) keeps its spaces; repeating a dimension collects an array
   * (OR, matching Pagefind's own multi-value filter shape). A no-op (returns `query` unchanged,
   * `filters: null`) when `inlineFilters` isn't enabled.
   * @param {string} query
   * @returns {{filters: Record<string, string|string[]>|null, remainingQuery: string}}
   */
  #parseInlineFilters(query) {
    if (!this.inlineFilters) {
      return { filters: null, remainingQuery: query };
    }
    const filters = {};
    const remainingQuery = query
      .replace(/(\w+):("[^"]*"|\S+)/g, (_match, dimension, rawValue) => {
        const value = rawValue.startsWith('"') && rawValue.endsWith('"') ? rawValue.slice(1, -1) : rawValue;
        if (filters[dimension] === undefined) {
          filters[dimension] = value;
        } else if (Array.isArray(filters[dimension])) {
          filters[dimension].push(value);
        } else {
          filters[dimension] = [filters[dimension], value];
        }
        return '';
      })
      .replace(/\s+/g, ' ')
      .trim();
    return { filters: Object.keys(filters).length ? filters : null, remainingQuery };
  }

  async #executeSearch(query) {
    this.#query = query;
    await this.#ensurePagefindLoaded();
    if (!this.#pagefind) {
      return;
    }

    const tab = (this.#tabs || []).find((t) => t.id === this.#currentTabId);
    const { filters: inlineFilters, remainingQuery } = this.#parseInlineFilters(query);
    const mergedFilters =
      tab?.filter || inlineFilters ? { ...(tab?.filter || {}), ...(inlineFilters || {}) } : null;
    const options = {
      ...this.pagefindOptions,
      ...(tab?.pagefindOptions || {}),
      ...(mergedFilters ? { filters: mergedFilters } : {}),
    };
    const searchTerm = this.inlineFilters ? remainingQuery : query;
    let results;
    try {
      // Pagefind treats a real (even empty-string) search term and "no term at all" as two
      // different modes: `search('', ...)` scores against an empty string and matches nothing,
      // while `search(null, ...)` is its documented filter-only listing mode — every page
      // matching `options.filters` (or every page, with none), unranked. Passing `null` here
      // (not `''`) is what makes eagerResults' listing, and a just-switched tab's own listing,
      // actually populate instead of silently showing zero results forever.
      ({ results } = searchTerm.trim()
        ? await this.#pagefind.debouncedSearch(searchTerm, options)
        : await this.#pagefind.search(null, options));
    } catch (err) {
      // Covers every search call, not just the initial load — a transient failure on a later
      // keystroke (not just Pagefind's runtime failing to load in the first place) shouldn't
      // throw out of the `input` listener as an unhandled rejection either.
      this.#pagefindError = err;
      this.#renderLoadError();
      return;
    }

    const flattened = [];
    for (const result of (results || []).slice(0, this.maxResults)) {
      const data = await result.data();
      flattened.push({
        title: data.meta?.title || this.strings.untitled,
        url: data.url,
        excerpt: data.excerpt,
        isAnchor: false,
        meta: data.meta || {},
      });
      for (const sub of data.sub_results || []) {
        if (sub.url === data.url) continue;
        // sub_results don't carry their own meta — reuse the parent page's, so a section/category
        // badge is consistent whether the row is the page itself or one of its anchors.
        flattened.push({ title: sub.title, url: sub.url, excerpt: sub.excerpt, isAnchor: true, meta: data.meta || {} });
      }
    }
    this.#matches = flattened.slice(0, this.maxResults);
    this.#pageCount = new Set(this.#matches.map((m) => m.url.split('#')[0])).size;
    this.#selectedIndex = this.#matches.length ? 0 : -1;
    this.#renderResults();
  }

  #renderResults() {
    if (!this.#matches.length) {
      this.#resultsEl.innerHTML = `<div class="hawk-empty">${this.strings.noResults(this.#query)}</div>`;
      this.#resultsEl.removeAttribute('aria-activedescendant');
      this.#counterEl.textContent = this.#query ? this.strings.matchingResults(0, 0) : this.strings.typeToSearch;
      this.#renderPreview();
      return;
    }

    this.#counterEl.textContent = this.#query
      ? this.strings.matchingResults(this.#matches.length, this.#pageCount)
      : this.strings.entries(this.#matches.length, this.#pageCount);

    this.#resultsEl.innerHTML = this.#matches
      .map((item, idx) => {
        const pinned = this.enablePins && this.#isPinned(item.url);
        return `
        <a href="${item.url}" id="${this.id}-result-${idx}" class="hawk-result-item${idx === this.#selectedIndex ? ' is-selected' : ''}" data-index="${idx}" role="option" tabindex="-1" aria-selected="${idx === this.#selectedIndex}">
          <div class="hawk-result-header">
            <span class="hawk-result-title">${item.isAnchor ? '&sect; ' : ''}${item.title}</span>
            ${item.meta?.section ? `<span class="hawk-meta-badge">${item.meta.section}</span>` : ''}
            ${
              this.enablePins
                ? `<span class="hawk-pin-btn${pinned ? ' is-pinned' : ''}" role="button" aria-pressed="${pinned}" data-index="${idx}">${pinned ? this.strings.unpinAction : this.strings.pinAction}</span>`
                : ''
            }
          </div>
          <div class="hawk-result-desc">${item.excerpt || ''}</div>
        </a>`;
      })
      .join('');
    this.#resultsEl.setAttribute('aria-activedescendant', `${this.id}-result-${this.#selectedIndex}`);

    this.#resultsEl.querySelectorAll('.hawk-result-item').forEach((el) => {
      el.addEventListener('mouseenter', () => this.#setSelection(Number(el.dataset.index), false));
      el.addEventListener('click', (event) => {
        const idx = Number(el.dataset.index);
        if (event.target.closest('.hawk-pin-btn')) {
          // .hawk-pin-btn is a <span>, not a nested <button>/<a>, specifically so it can sit
          // inside this row's own <a> without invalid interactive-content nesting — this click
          // check is what keeps it from also triggering the row's navigation/onSelect.
          event.preventDefault();
          event.stopPropagation();
          this.#togglePin(this.#matches[idx]);
          return;
        }
        this.onSelect?.(this.#matches[idx]);
      });
    });

    this.#renderPreview();
  }

  #setSelection(index, scrollIntoView) {
    this.#selectedIndex = index;
    this.#resultsEl.setAttribute('aria-activedescendant', `${this.id}-result-${index}`);
    this.#resultsEl.querySelectorAll('.hawk-result-item').forEach((el) => {
      const isSelected = Number(el.dataset.index) === index;
      el.classList.toggle('is-selected', isSelected);
      el.setAttribute('aria-selected', String(isSelected));
      if (isSelected && scrollIntoView) {
        el.scrollIntoView?.({ block: 'nearest' });
      }
    });
    this.#renderPreview();
  }

  #renderPreview() {
    const item = this.#matches[this.#selectedIndex];
    if (!item) {
      const fallback = this.#activeTabDefaultPreview();
      if (fallback.url) {
        this.#renderDefaultPreview(fallback.url, fallback.title);
      } else {
        this.#previewKey = null;
        this.#previewEl.innerHTML = `<div class="hawk-preview-empty">${this.strings.previewEmpty}</div>`;
      }
      return;
    }

    const key = item.url;
    if (key === this.#previewKey) {
      return;
    }
    this.#previewKey = key;
    this.#animation.stop(this.#previewController);

    this.#previewEl.innerHTML = `
      <div class="hawk-preview-header">
        ${item.isAnchor ? `<span class="hawk-anchor-badge">${this.strings.sectionBadge}</span>` : ''}
        ${item.meta?.section ? `<span class="hawk-meta-badge">${item.meta.section}</span>` : ''}
      </div>
      <h3 class="hawk-preview-title"></h3>
      <div class="hawk-preview-content"><div class="hawk-preview-loading">${this.strings.previewLoading}</div></div>
    `;
    const titleEl = this.#previewEl.querySelector('.hawk-preview-title');
    const contentEl = this.#previewEl.querySelector('.hawk-preview-content');
    this.#animation.typeTitle(titleEl, item.title, { isAnchor: item.isAnchor });
    this.#loadPreviewContent(item, key, contentEl);
  }

  /**
   * Fills the preview pane with the full rendered page content (markdown-rendered HTML,
   * including syntax-highlighted code blocks — whatever the site's own build already produced),
   * fetched from `item.url` and narrowed to `contentSelector`. For an anchor/section match, only
   * that heading's subsection is extracted. Falls back to Pagefind's short excerpt if fetching
   * isn't possible (no fetch/DOMParser, cross-origin, network error) or the selection has moved
   * on by the time the fetch resolves.
   */
  async #loadPreviewContent(item, key, contentEl) {
    let html = item.excerpt || '';
    let sections = null;
    if (typeof fetch === 'function' && typeof DOMParser !== 'undefined') {
      try {
        const [pagePath, anchor] = item.url.split('#');
        const root = await this.#fetchFragment(pagePath);
        if (item.isAnchor && anchor) {
          html = this.#extractSection(root, anchor);
        } else if (this.previewSections) {
          sections = this.#extractSections(root);
          if (!sections.length) {
            html = root.innerHTML; // no matching headings — fall back to the full content view
          }
        } else {
          html = root.innerHTML;
        }
      } catch {
        html = item.excerpt || '';
      }
    }
    if (this.#previewKey !== key) {
      return; // selection moved on while the fetch was in flight
    }
    if (sections && sections.length) {
      // A structured list of rows, not prose — rendered directly rather than through the
      // animation driver's typeContent, which is built for typing out text/HTML, not populating
      // a list of links.
      this.#renderPreviewSections(sections, item, contentEl);
    } else {
      this.#previewController = this.#animation.typeContent(contentEl, html);
    }
  }

  /**
   * Breaks a page's content root into `{title, slug, excerpt}` rows, one per heading matching
   * `previewSectionSelector` — the heading's own text, its id, and a short plain-text excerpt of
   * the content between it and the next heading of *any* level (so a subsection's text doesn't
   * leak into its parent's excerpt). Pure DOM traversal over content hawk already fetched and
   * parsed for the full-content view — no extra network request, and cheap even for a long page
   * (a few dozen headings at most in practice).
   * @param {Element} root
   * @returns {{title: string, slug: string, excerpt: string}[]}
   */
  #extractSections(root) {
    return Array.from(root.querySelectorAll(this.previewSectionSelector))
      .filter((heading) => heading.id)
      .map((heading) => {
        const parts = [];
        let el = heading.nextElementSibling;
        while (el && !/^H[1-6]$/.test(el.tagName)) {
          const text = el.textContent.trim();
          if (text) {
            parts.push(text);
          }
          el = el.nextElementSibling;
        }
        let excerpt = parts.join(' ').replace(/\s+/g, ' ').trim();
        if (excerpt.length > this.previewSectionExcerptLength) {
          excerpt = `${excerpt.slice(0, this.previewSectionExcerptLength).trimEnd()}…`;
        }
        return { title: heading.textContent.trim(), slug: heading.id, excerpt };
      });
  }

  /**
   * Renders `previewSections`' rows — each a real link to that heading on the actual page (same
   * click-to-navigate semantics as a normal result), reporting through `onSelect` like any other
   * selection.
   */
  #renderPreviewSections(sections, item, contentEl) {
    const basePath = item.url.split('#')[0];
    contentEl.innerHTML = sections
      .map(
        (s) => `
        <a class="hawk-preview-section-row" href="${basePath}#${s.slug}">
          <span class="hawk-preview-section-title">${s.title}</span>
          ${s.excerpt ? `<span class="hawk-preview-section-excerpt">${s.excerpt}</span>` : ''}
        </a>`
      )
      .join('');
    contentEl.querySelectorAll('.hawk-preview-section-row').forEach((el, idx) => {
      el.addEventListener('click', () => {
        const s = sections[idx];
        this.onSelect?.({ title: s.title, url: `${basePath}#${s.slug}`, excerpt: s.excerpt, isAnchor: true, meta: item.meta || {} });
      });
    });
  }

  /**
   * Fetches and parses a result page, returning (and caching, by promise, so concurrent
   * requests for the same page dedupe) the element matched by `contentSelector`.
   * @param {string} pagePath URL without the `#anchor` suffix.
   * @returns {Promise<Element>}
   */
  #fetchFragment(pagePath) {
    if (this.#fragmentCache.has(pagePath)) {
      return this.#fragmentCache.get(pagePath);
    }
    const promise = fetch(pagePath)
      .then((res) => res.text())
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.querySelector(this.contentSelector) || doc.body;
      })
      .catch((err) => {
        this.#fragmentCache.delete(pagePath);
        throw err;
      });
    this.#fragmentCache.set(pagePath, promise);
    return promise;
  }

  /**
   * Extracts one heading's subsection (the heading itself plus every following sibling up to
   * the next heading of the same or higher level) from a fetched page's content root.
   * @param {Element} root
   * @param {string} slug Anchor id, without the leading `#`.
   * @returns {string} HTML, or the whole root's HTML if the heading isn't found.
   */
  #extractSection(root, slug) {
    // Attribute-selector form instead of `#${slug}` — sidesteps needing CSS.escape() for
    // CSS-identifier-special characters, which isn't implemented in every environment (jsdom
    // included). Only `"` needs escaping inside the attribute-selector string literal itself.
    const heading = root.querySelector(`[id="${String(slug).replace(/"/g, '\\"')}"]`);
    if (!heading) {
      return root.innerHTML;
    }
    const level = Number(heading.tagName[1]) || 6;
    const parts = [heading.outerHTML];
    let el = heading.nextElementSibling;
    while (el && !(/^H[1-6]$/.test(el.tagName) && Number(el.tagName[1]) <= level)) {
      parts.push(el.outerHTML);
      el = el.nextElementSibling;
    }
    return parts.join('');
  }

  /**
   * ArrowUp/ArrowDown (wraparound selection) + Enter (select and navigate). Shared between the
   * search input and the results pane — both are valid places for the current selection to
   * change from, and neither branch reads `event.target`.
   */
  #handleListKeydown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.#matches.length) {
        this.#setSelection((this.#selectedIndex + 1) % this.#matches.length, true);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.#matches.length) {
        this.#setSelection((this.#selectedIndex - 1 + this.#matches.length) % this.#matches.length, true);
      }
    } else if (event.key === 'Enter') {
      const item = this.#matches[this.#selectedIndex];
      if (item) {
        this.onSelect?.(item);
        window.location.href = item.url;
      }
    }
  }

  /**
   * Handles a keydown that landed on the results pane itself (reached via Tab, not the input):
   * a printable character refocuses the input and forwards the keystroke, so a user who tabbed
   * away can resume typing without an extra click; everything else falls through to the shared
   * selection/navigation handling.
   */
  #handleResultsPaneKeydown(event) {
    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      this.#input.focus();
      this.#input.value += event.key;
      this.#input.dispatchEvent(new Event('input'));
      return;
    }
    this.#handleListKeydown(event);
  }

  /**
   * ArrowUp/ArrowDown/PageUp/PageDown/Home/End scroll the preview pane when it has focus,
   * instead of changing the result selection. Implemented as explicit `scrollTop` math rather
   * than relying on native focused-scroll-container behavior, which isn't consistent across
   * browsers and doesn't exist in jsdom at all.
   */
  #handlePreviewKeydown(event) {
    const step = 48;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.#previewEl.scrollTop += step;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.#previewEl.scrollTop -= step;
    } else if (event.key === 'PageDown') {
      event.preventDefault();
      this.#previewEl.scrollTop += this.#previewEl.clientHeight;
    } else if (event.key === 'PageUp') {
      event.preventDefault();
      this.#previewEl.scrollTop -= this.#previewEl.clientHeight;
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.#previewEl.scrollTop = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      this.#previewEl.scrollTop = this.#previewEl.scrollHeight;
    }
  }

  #handleGlobalKeydown(event) {
    if (this.#isOpen && event.key === 'Tab') {
      this.#trapFocus(event);
    }

    const target = event.target;
    const isTyping = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

    if (this.hotkeys.open && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.#isOpen ? this.close() : this.open();
    } else if (this.hotkeys.slash && event.key === '/' && !isTyping) {
      event.preventDefault();
      this.open();
    } else if (this.hotkeys.escape && event.key === 'Escape' && this.#isOpen) {
      this.close();
    }
  }

  /**
   * True when the preview pane is actually reachable given the current layout — mirrors the
   * CSS conditions in hawk.css's [data-hawk-compact]/[data-hawk-density='compact'] rules (hidden
   * in single-column layouts unless focus has already revealed it). Checked in JS, not via
   * layout/computed-style, so the focus trap stays correct without depending on real rendering
   * (and is testable under jsdom, which never renders).
   */
  #isPreviewPaneReachable() {
    const singleColumn = this.#root.dataset.hawkCompact === 'true' || this.params.density === 'compact';
    return !singleColumn || this.#root.dataset.hawkShowPreview === 'true';
  }

  /** The modal's Tab stops, in DOM/tab order, given the current layout and config. */
  #getFocusableElements() {
    return [
      this.#input,
      ...(this.params.allowDensityToggle ? Array.from(this.#root.querySelectorAll('.hawk-density-btn')) : []),
      this.#root.querySelector('.hawk-modal-esc'),
      this.#filtersEl.querySelector('.hawk-filter-pill[tabindex="0"]'),
      this.#resultsEl,
      ...(this.#isPreviewPaneReachable() ? [this.#previewEl] : []),
    ].filter(Boolean);
  }

  /**
   * Keeps Tab/Shift+Tab cycling within the modal instead of escaping to the page behind the
   * backdrop — required modal-dialog behavior (WAI-ARIA APG), not previously implemented.
   */
  #trapFocus(event) {
    const focusable = this.#getFocusableElements();
    if (!focusable.length) {
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /**
   * True unless `config.revealAnimation` is `false` or the visitor has `prefers-reduced-motion:
   * reduce` set — the single check `open()`/`close()` gate their reveal-animation branch on.
   */
  #revealAnimationActive() {
    return Boolean(this.revealAnimation) && !(typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /** Opens the search modal and focuses the input. */
  open() {
    clearTimeout(this.#revealTimer);
    delete this.#root.dataset.hawkAnimState;
    this.#root.hidden = false;
    document.body.style.overflow = 'hidden';
    this.#isOpen = true;
    this.#ensurePagefindLoaded();
    this.#updatePlaceholderVisibility();
    if (this.#revealAnimationActive()) {
      // 'opening' selects hawk.css's enter keyframes (see [data-hawk-reveal] rules); cleared once
      // they finish so a later close() starts from a clean attribute state, not mid-animation.
      this.#root.dataset.hawkAnimState = 'opening';
      this.#revealTimer = setTimeout(() => {
        delete this.#root.dataset.hawkAnimState;
      }, this.revealDuration);
    }
    setTimeout(() => {
      this.#input.focus();
      this.#input.select();
    }, 40);
    this.onOpen?.(this.#query);
  }

  /** Closes the search modal. */
  close() {
    document.body.style.overflow = '';
    this.#isOpen = false;
    this.#updatePlaceholderVisibility();
    this.onClose?.();
    clearTimeout(this.#revealTimer);
    if (this.#revealAnimationActive()) {
      // Stays visible (not [hidden]) for the exit keyframes' duration — [data-hawk-anim-state
      // ='closing'] also sets pointer-events: none (hawk.css) so the fading-out dialog can't
      // still be clicked/tabbed into during that window.
      this.#root.dataset.hawkAnimState = 'closing';
      this.#revealTimer = setTimeout(() => {
        this.#root.hidden = true;
        delete this.#root.dataset.hawkAnimState;
      }, this.revealDuration);
    } else {
      this.#root.hidden = true;
    }
  }

  /**
   * Brightens a pane's scrollbar thumb (`[data-hawk-scrolling='true']`, see hawk.css) for as long
   * as it's actively scrolling, fading back to idle opacity ~500ms after the last scroll event —
   * not just on `:hover`, so keyboard-driven scrolling (the preview pane's arrow-key handler sets
   * `scrollTop` directly, which fires a native `scroll` event) lights it up too, not only a mouse
   * sitting over the pane.
   */
  #wireScrollBrighten(el) {
    el.addEventListener(
      'scroll',
      () => {
        el.dataset.hawkScrolling = 'true';
        clearTimeout(this.#scrollBrightenTimers.get(el));
        this.#scrollBrightenTimers.set(
          el,
          setTimeout(() => {
            el.dataset.hawkScrolling = 'false';
          }, 500)
        );
      },
      { passive: true }
    );
  }

  /**
   * Starts/stops the rotating-placeholder animation and toggles the ghost overlay's visibility.
   * Runs only while the modal is open and the input is empty — never in the background while
   * closed, and stops the instant there's real input value (deliberately not gated on focus:
   * `open()` auto-focuses the input a beat later, so gating on focus would hide the rotation
   * before it's ever seen).
   */
  #updatePlaceholderVisibility() {
    if (!this.#placeholderGhostEl) {
      return;
    }
    const active = this.#isOpen && !this.#input.value;
    this.#inputWrap.dataset.hawkInputActive = String(!active);
    if (active && !this.#placeholderController) {
      this.#placeholderController = this.#animation.rotatePlaceholder(this.#placeholderGhostEl, this.rotatingPlaceholders);
    } else if (!active && this.#placeholderController) {
      this.#animation.stop(this.#placeholderController);
      this.#placeholderController = null;
    }
  }

  /** Removes the modal from the DOM and detaches listeners. */
  destroy() {
    this.#animation.stop(this.#previewController);
    if (this.#placeholderController) {
      this.#animation.stop(this.#placeholderController);
    }
    this.#mediaQuery?.removeEventListener?.('change', this.#onBreakpointChange);
    this.#scrollBrightenTimers.forEach((id) => clearTimeout(id));
    clearTimeout(this.#revealTimer);
    this.#root?.remove();
    this.#builtInTrigger?.remove();
  }
}

if (typeof window !== 'undefined') {
  window.Hawk = HawkSearch;
}

export default HawkSearch;
