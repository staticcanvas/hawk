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
  columns: 2, // 1 | 2 — forced to 1 below `breakpoint` regardless of this value
  breakpoint: 768, // px
};

const DEFAULT_HOTKEYS = { open: true, slash: true, escape: true };

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
   * @param {Partial<typeof DEFAULT_PARAMS>} [config.params] Layout params (scale/position/offset/alignment/columns/breakpoint).
   * @param {string|import('./hawk-theme-typeflow.js').HawkTheme} [config.theme='typeflow'] Registered theme name or a theme object.
   * @param {string|import('./hawk-animation-instant.js').HawkAnimationDriver|false} [config.animation] Registered
   *   animation name, a driver object, or `false` to force the instant driver. Defaults to `'typeflow'` if that
   *   name is registered (i.e. the consumer loaded hawk-animation-typeflow.js and registered it), else `'instant'`.
   * @param {string[]} [config.categories] Shorthand for `config.tabs`: one tab per category name, each
   *   filtering on `categoryFilterName`. Ignored if `config.tabs` is given.
   * @param {Array<{id?: string, label: string, filter?: Record<string, string|string[]>, pagefindOptions?: Record<string, unknown>}>} [config.tabs]
   *   Explicit tab list. `filter` is a raw Pagefind `filters` object (passed to `search()`/`debouncedSearch()`
   *   verbatim) — omit it for a filterless tab (e.g. "All"). Replaces auto-derivation from Pagefind's
   *   `filters()` entirely and renders synchronously on mount instead of waiting for Pagefind to load.
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
    this.params = { ...DEFAULT_PARAMS, ...config.params, offset: { ...DEFAULT_PARAMS.offset, ...config.params?.offset } };
    this.categoryFilterName = config.categoryFilterName || 'category';
    this.includeAllTab = config.includeAllTab !== false;
    this.pagefindOptions = config.pagefindOptions || {};
    this.maxResults = config.maxResults ?? 18;
    this.contentSelector = config.contentSelector || '[data-pagefind-body]';
    this.hotkeys = { ...DEFAULT_HOTKEYS, ...config.hotkeys };
    this.onOpen = config.onOpen;
    this.onClose = config.onClose;
    this.onSelect = config.onSelect;

    this.#theme = this.#resolveTheme(config.theme);
    this.#animation = this.#resolveAnimation(config.animation);

    this.#query = '';
    this.#selectedIndex = -1;
    this.#matches = [];
    this.#currentTabId = config.defaultTab || 'all';
    this.#tabs = this.#resolveExplicitTabs(config);
    this.#tabsExplicit = this.#tabs !== null;
    this.#isOpen = false;
    this.#pagefind = null;
    this.#pagefindLoadPromise = null;
    this.#previewController = null;
    this.#previewKey = null;
    this.#fragmentCache = new Map();

    if (this.container) {
      this.#mount();
    }
  }

  #theme;
  #animation;
  #query;
  #selectedIndex;
  #matches;
  #tabs;
  #currentTabId;
  #tabsExplicit;
  #isOpen;
  #pagefind;
  #pagefindLoadPromise;
  #previewController;
  #previewKey;
  #fragmentCache;
  #injectedPagefind;
  #root;
  #input;
  #resultsEl;
  #previewEl;
  #filtersEl;
  #counterEl;
  #mediaQuery;
  #onBreakpointChange;

  /** Public, introspectable state — mirrors the org's "no emitter, poll the public state" convention. */
  get state() {
    return {
      open: this.#isOpen,
      query: this.#query,
      selectedIndex: this.#selectedIndex,
      matches: this.#matches,
      activeTab: this.#currentTabId,
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
      if (this.#currentTabId !== 'all') {
        console.warn(`HawkSearch: no tab with id "${this.#currentTabId}" (defaultTab); falling back to "all".`);
      }
      this.#currentTabId = tabs.some((t) => t.id === 'all') ? 'all' : (tabs[0]?.id ?? 'all');
    }
    this.#renderFilters();
  }

  #mount() {
    const root = document.createElement('div');
    root.innerHTML = this.#markup();
    this.#root = root.firstElementChild;
    this.container.appendChild(this.#root);

    this.#input = this.#root.querySelector('.hawk-modal-input');
    this.#resultsEl = this.#root.querySelector('.hawk-results-pane');
    this.#previewEl = this.#root.querySelector('.hawk-preview-pane');
    this.#filtersEl = this.#root.querySelector('.hawk-modal-filters');
    this.#counterEl = this.#root.querySelector('.hawk-modal-counter');

    if (this.#theme) {
      this.#theme.apply(this.#root);
    }
    this.#applyParams();
    if (this.#tabsExplicit) {
      this.#applyDefaultTabAndRender(this.#tabs);
    }

    document.querySelectorAll(this.triggerSelector).forEach((btn) => {
      btn.addEventListener('click', () => this.open());
    });
    this.#root.querySelectorAll('[data-search-close]').forEach((el) => {
      el.addEventListener('click', () => this.close());
    });

    this.#input.addEventListener('input', () => this.#executeSearch(this.#input.value));
    this.#input.addEventListener('keydown', (event) => this.#handleInputKeydown(event));
    this.#input.addEventListener('focus', () => this.#ensurePagefindLoaded(), { once: true });

    if (this.hotkeys.open || this.hotkeys.slash || this.hotkeys.escape) {
      document.addEventListener('keydown', (event) => this.#handleGlobalKeydown(event));
    }
  }

  #markup() {
    return `
      <div id="${this.id}" class="hawk-modal" role="dialog" aria-modal="true" aria-label="Search" hidden>
        <div class="hawk-modal-backdrop" data-search-close tabindex="-1"></div>
        <div class="hawk-modal-dialog">
          <div class="hawk-modal-header">
            <input class="hawk-modal-input" type="search" placeholder="Search..." autocomplete="off" spellcheck="false"
              aria-autocomplete="list" aria-controls="${this.id}-results" />
            <button class="hawk-modal-esc" data-search-close type="button"><kbd>ESC</kbd></button>
          </div>
          <div class="hawk-modal-filters" role="tablist" aria-label="Filter by category"></div>
          <div class="hawk-modal-body" data-hawk-alignment="${this.params.alignment}">
            <div class="hawk-results-pane" id="${this.id}-results" role="listbox" aria-live="polite"></div>
            <aside class="hawk-preview-pane" aria-live="polite">
              <div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>
            </aside>
          </div>
          <div class="hawk-modal-footer">
            <span class="hawk-hint">&uarr;&darr; Navigate</span>
            <span class="hawk-hint">&crarr; Select</span>
            <span class="hawk-hint">ESC Close</span>
            <div class="hawk-modal-counter">Type to search</div>
          </div>
        </div>
      </div>
    `.trim();
  }

  #applyParams() {
    const { scale, position, offset, columns, breakpoint } = this.params;
    this.#root.style.setProperty('--hawk-scale', String(scale));
    this.#root.style.setProperty('--hawk-offset-x', this.#cssLength(offset.x));
    this.#root.style.setProperty('--hawk-offset-y', this.#cssLength(offset.y));
    this.#root.dataset.hawkPosition = position;
    this.#root.querySelector('.hawk-modal-body').dataset.hawkColumns = String(columns);

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
      return this.#pagefind;
    }
    if (!this.#pagefindLoadPromise) {
      this.#pagefindLoadPromise = import(/* @vite-ignore */ `${this.indexBasePath}pagefind.js`).then(async (mod) => {
        await mod.options({ basePath: this.indexBasePath });
        this.#pagefind = mod;
        await this.#deriveTabs();
        return mod;
      });
    }
    return this.#pagefindLoadPromise;
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
      this.#applyDefaultTabAndRender(this.#normalizeTabs([]));
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
      this.#normalizeTabs(categories.map((c) => ({ id: c, label: c, filter: { [this.categoryFilterName]: c } })))
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
    this.#executeSearch(this.#query);
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

  async #executeSearch(query) {
    this.#query = query;
    await this.#ensurePagefindLoaded();
    if (!this.#pagefind) {
      return;
    }

    const tab = (this.#tabs || []).find((t) => t.id === this.#currentTabId);
    const options = {
      ...this.pagefindOptions,
      ...(tab?.pagefindOptions || {}),
      ...(tab?.filter ? { filters: tab.filter } : {}),
    };
    const { results } = query.trim()
      ? await this.#pagefind.debouncedSearch(query, options)
      : await this.#pagefind.search('', options);

    const flattened = [];
    for (const result of (results || []).slice(0, this.maxResults)) {
      const data = await result.data();
      flattened.push({ title: data.meta?.title || 'Untitled', url: data.url, excerpt: data.excerpt, isAnchor: false });
      for (const sub of data.sub_results || []) {
        if (sub.url === data.url) continue;
        flattened.push({ title: sub.title, url: sub.url, excerpt: sub.excerpt, isAnchor: true });
      }
    }
    this.#matches = flattened.slice(0, this.maxResults);
    this.#selectedIndex = this.#matches.length ? 0 : -1;
    this.#renderResults();
  }

  #renderResults() {
    if (!this.#matches.length) {
      this.#resultsEl.innerHTML = `<div class="hawk-empty">No results${this.#query ? ` for "${this.#query}"` : ''}.</div>`;
      this.#counterEl.textContent = this.#query ? '0 matching results' : 'Type to search';
      this.#renderPreview();
      return;
    }

    this.#counterEl.textContent = this.#query
      ? `${this.#matches.length} matching result${this.#matches.length === 1 ? '' : 's'}`
      : `${this.#matches.length} entries`;

    this.#resultsEl.innerHTML = this.#matches
      .map(
        (item, idx) => `
        <a href="${item.url}" class="hawk-result-item${idx === this.#selectedIndex ? ' is-selected' : ''}" data-index="${idx}" role="option" aria-selected="${idx === this.#selectedIndex}">
          <div class="hawk-result-header">
            <span class="hawk-result-title">${item.isAnchor ? '&sect; ' : ''}${item.title}</span>
          </div>
          <div class="hawk-result-desc">${item.excerpt || ''}</div>
        </a>`
      )
      .join('');

    this.#resultsEl.querySelectorAll('.hawk-result-item').forEach((el) => {
      el.addEventListener('mouseenter', () => this.#setSelection(Number(el.dataset.index), false));
      el.addEventListener('click', () => this.onSelect?.(this.#matches[Number(el.dataset.index)]));
    });

    this.#renderPreview();
  }

  #setSelection(index, scrollIntoView) {
    this.#selectedIndex = index;
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
      this.#previewEl.innerHTML = `<div class="hawk-preview-empty">Type to search, or select a result to preview it here.</div>`;
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
        ${item.isAnchor ? `<span class="hawk-anchor-badge">Section</span>` : ''}
      </div>
      <h3 class="hawk-preview-title"></h3>
      <div class="hawk-preview-content"><div class="hawk-preview-loading">Loading&hellip;</div></div>
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
    if (typeof fetch === 'function' && typeof DOMParser !== 'undefined') {
      try {
        const [pagePath, anchor] = item.url.split('#');
        const root = await this.#fetchFragment(pagePath);
        html = item.isAnchor && anchor ? this.#extractSection(root, anchor) : root.innerHTML;
      } catch {
        html = item.excerpt || '';
      }
    }
    if (this.#previewKey !== key) {
      return; // selection moved on while the fetch was in flight
    }
    this.#previewController = this.#animation.typeContent(contentEl, html);
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

  #handleInputKeydown(event) {
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

  #handleGlobalKeydown(event) {
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

  /** Opens the search modal and focuses the input. */
  open() {
    this.#root.hidden = false;
    document.body.style.overflow = 'hidden';
    this.#isOpen = true;
    this.#ensurePagefindLoaded();
    setTimeout(() => {
      this.#input.focus();
      this.#input.select();
    }, 40);
    this.onOpen?.(this.#query);
  }

  /** Closes the search modal. */
  close() {
    this.#root.hidden = true;
    document.body.style.overflow = '';
    this.#isOpen = false;
    this.onClose?.();
  }

  /** Removes the modal from the DOM and detaches listeners. */
  destroy() {
    this.#animation.stop(this.#previewController);
    this.#mediaQuery?.removeEventListener?.('change', this.#onBreakpointChange);
    this.#root?.remove();
  }
}

if (typeof window !== 'undefined') {
  window.Hawk = HawkSearch;
}

export default HawkSearch;
