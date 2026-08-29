/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HawkSearch } from '../src/hawk.js';
import { HawkAnimationInstant } from '../src/hawk-animation-instant.js';

/**
 * Builds a mock Pagefind module compatible with the subset of the API hawk.js calls.
 * @param {object} [overrides]
 * @returns {object}
 */
function mockPagefind(overrides = {}) {
  return {
    options: vi.fn().mockResolvedValue(undefined),
    filters: vi.fn().mockResolvedValue({ category: { Guides: 2, Reference: 1 } }),
    search: vi.fn().mockResolvedValue({ results: [] }),
    debouncedSearch: vi.fn().mockResolvedValue({ results: [] }),
    ...overrides,
  };
}

function resultFor(data) {
  return { data: vi.fn().mockResolvedValue(data) };
}

beforeEach(() => {
  document.body.innerHTML = '';
  // No test relies on a real network — default fetch to rejecting so #loadPreviewContent
  // falls back to the Pagefind excerpt unless a test stubs its own response.
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('no network in tests')));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('plugin registries', () => {
  it('registers the built-in instant animation driver by default', () => {
    expect(HawkSearch.animations.get('instant')).toBe(HawkAnimationInstant);
  });

  it('registers and resolves a custom theme by name', () => {
    const theme = { name: 'custom', apply: vi.fn() };
    HawkSearch.registerTheme('custom-test', theme);
    const hawk = new HawkSearch({ pagefind: mockPagefind(), theme: 'custom-test' });
    expect(theme.apply).toHaveBeenCalledWith(expect.any(HTMLElement));
    hawk.destroy();
  });

  it('throws for an unregistered theme name', () => {
    expect(() => new HawkSearch({ pagefind: mockPagefind(), theme: 'does-not-exist' })).toThrow(/no theme registered/);
  });

  it('throws for an unregistered animation name', () => {
    expect(() => new HawkSearch({ pagefind: mockPagefind(), animation: 'does-not-exist' })).toThrow(
      /no animation driver registered/
    );
  });

  it('falls back to the instant driver when animation is explicitly false', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), animation: false });
    expect(hawk).toBeTruthy();
    hawk.destroy();
  });
});

describe('constructor validation', () => {
  it('requires either config.index or config.pagefind', () => {
    expect(() => new HawkSearch({})).toThrow(/requires config.index/);
  });
});

describe('theme.tokens', () => {
  it('applies token overrides as inline CSS custom properties on mount', () => {
    const theme = { name: 'custom', apply: vi.fn(), tokens: { '--hawk-accent': '#22d3ee', '--hawk-font-family': 'Inter' } };
    const hawk = new HawkSearch({ pagefind: mockPagefind(), theme });
    const root = document.getElementById(hawk.id);
    expect(root.style.getPropertyValue('--hawk-accent')).toBe('#22d3ee');
    expect(root.style.getPropertyValue('--hawk-font-family')).toBe('Inter');
    hawk.destroy();
  });

  it('does not throw when a theme has no tokens', () => {
    const theme = { name: 'custom', apply: vi.fn() };
    expect(() => new HawkSearch({ pagefind: mockPagefind(), theme }).destroy()).not.toThrow();
  });
});

describe('disableDefaultMarkdownStyles', () => {
  it('stamps data-hawk-markdown-styles="off" on the root when enabled', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), disableDefaultMarkdownStyles: true });
    expect(document.getElementById(hawk.id).dataset.hawkMarkdownStyles).toBe('off');
    hawk.destroy();
  });

  it('is absent by default', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    expect(document.getElementById(hawk.id).dataset.hawkMarkdownStyles).toBeUndefined();
    hawk.destroy();
  });
});

describe('rotatingPlaceholders', () => {
  it('renders no ghost element and a static placeholder when not configured', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    expect(document.querySelector('.hawk-input-ghost')).toBeNull();
    expect(document.querySelector('.hawk-modal-input').placeholder).toBe('Search...');
    hawk.destroy();
  });

  it('renders the ghost with the first string set synchronously, empty native placeholder', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), rotatingPlaceholders: ['Try "tabs"...', 'Try "density"...'] });
    expect(document.querySelector('.hawk-input-ghost').textContent).toBe('Try "tabs"...');
    expect(document.querySelector('.hawk-modal-input').placeholder).toBe('');
    hawk.destroy();
  });

  it('starts rotation on open (instant driver) and stops it on close', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), rotatingPlaceholders: ['a', 'b'], animation: false });
    const wrap = document.querySelector('.hawk-input-wrap');
    // Closed: ghost stays hidden (data-hawk-input-active='true' suppresses it) — never rotates in the background.
    expect(wrap.dataset.hawkInputActive).toBe('true');

    hawk.open();
    expect(wrap.dataset.hawkInputActive).toBe('false'); // open + empty input: ghost visible/rotating
    expect(document.querySelector('.hawk-input-ghost').textContent).toBe('a');

    hawk.close();
    expect(wrap.dataset.hawkInputActive).toBe('true');
    hawk.destroy();
  });

  it('hides the ghost the instant the input has a value, and restores it when cleared', async () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), rotatingPlaceholders: ['a'], animation: false });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    const wrap = document.querySelector('.hawk-input-wrap');

    input.value = 'x';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(wrap.dataset.hawkInputActive).toBe('true'); // "active" here means "has input" (ghost hidden)

    input.value = '';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(wrap.dataset.hawkInputActive).toBe('false');
    hawk.destroy();
  });
});

describe('powered-by attribution', () => {
  it('renders by default, linking to pagefind.app', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    const link = document.querySelector('.hawk-powered-by');
    expect(link.textContent).toBe('Search powered by Pagefind');
    expect(link.getAttribute('href')).toBe('https://pagefind.app/');
    hawk.destroy();
  });

  it('is omitted when showPoweredBy is false', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), showPoweredBy: false });
    expect(document.querySelector('.hawk-powered-by')).toBeNull();
    hawk.destroy();
  });

  it('respects a custom poweredByHref', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), poweredByHref: 'https://example.com/search' });
    expect(document.querySelector('.hawk-powered-by').getAttribute('href')).toBe('https://example.com/search');
    hawk.destroy();
  });
});

describe('layout params', () => {
  it('applies default params as CSS custom properties on mount', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    const root = document.getElementById(hawk.id);
    expect(root.style.getPropertyValue('--hawk-scale')).toBe('1');
    expect(root.dataset.hawkPosition).toBe('top-center');
    hawk.destroy();
  });

  it('setParams updates the CSS custom properties and position attribute', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    hawk.setParams({ scale: 1.5, position: 'center', offset: { y: '2rem' } });
    const root = document.getElementById(hawk.id);
    expect(root.style.getPropertyValue('--hawk-scale')).toBe('1.5');
    expect(root.style.getPropertyValue('--hawk-offset-y')).toBe('2rem');
    expect(root.dataset.hawkPosition).toBe('center');
    hawk.destroy();
  });

  it('merges partial offset overrides instead of replacing the whole object', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), params: { offset: { x: '2rem' } } });
    expect(hawk.params.offset.y).toBe('6vh');
    expect(hawk.params.offset.x).toBe('2rem');
    hawk.destroy();
  });
});

describe('density', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('defaults to medium and renders the fit/medium/compact toggle', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    const root = document.getElementById(hawk.id);
    expect(root.dataset.hawkDensity).toBe('medium');
    const buttons = Array.from(document.querySelectorAll('.hawk-density-btn')).map((b) => b.dataset.density);
    expect(buttons).toEqual(['fit', 'medium', 'compact']);
    expect(document.querySelector('.hawk-density-btn[data-density="medium"]').classList.contains('active')).toBe(true);
    hawk.destroy();
  });

  it('omits the toggle when allowDensityToggle is false', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), params: { allowDensityToggle: false } });
    expect(document.querySelectorAll('.hawk-density-btn')).toHaveLength(0);
    hawk.destroy();
  });

  it('clicking a density button updates state, dataset, and persists the choice', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    const root = document.getElementById(hawk.id);
    document.querySelector('.hawk-density-btn[data-density="compact"]').click();
    expect(root.dataset.hawkDensity).toBe('compact');
    expect(hawk.params.density).toBe('compact');
    expect(document.querySelector('.hawk-density-btn[data-density="compact"]').classList.contains('active')).toBe(true);
    expect(localStorage.getItem('hawk:density')).toBe('compact');
    hawk.destroy();
  });

  it('a persisted density preference applies on construction, but explicit config.params.density wins', () => {
    localStorage.setItem('hawk:density', 'fit');
    const hawk1 = new HawkSearch({ pagefind: mockPagefind() });
    expect(hawk1.params.density).toBe('fit');
    hawk1.destroy();

    const hawk2 = new HawkSearch({ pagefind: mockPagefind(), params: { density: 'compact' } });
    expect(hawk2.params.density).toBe('compact');
    hawk2.destroy();
  });
});

describe('category derivation', () => {
  it('derives filter pills from Pagefind filters() when categories are not configured', async () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const pills = Array.from(document.querySelectorAll('.hawk-filter-pill')).map((el) => el.dataset.filter);
    expect(pills).toEqual(['all', 'Guides', 'Reference']);
    hawk.destroy();
  });

  it('uses explicit categories instead of calling filters() when configured', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({ pagefind, categories: ['Custom'] });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.filters).not.toHaveBeenCalled();
    const pills = Array.from(document.querySelectorAll('.hawk-filter-pill')).map((el) => el.dataset.filter);
    expect(pills).toEqual(['all', 'Custom']);
    hawk.destroy();
  });
});

describe('explicit tabs config', () => {
  it('renders tabs synchronously on mount, without calling filters()', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({
      pagefind,
      tabs: [{ label: 'Guides', filter: { category: 'Guides' } }, { id: 'ref', label: 'Reference' }],
    });
    const pills = Array.from(document.querySelectorAll('.hawk-filter-pill')).map((el) => el.dataset.filter);
    expect(pills).toEqual(['all', 'guides', 'ref']);
    expect(pagefind.filters).not.toHaveBeenCalled();
    hawk.destroy();
  });

  it('omits the "All" tab when includeAllTab is false', () => {
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      tabs: [{ label: 'Guides' }],
      includeAllTab: false,
    });
    const pills = Array.from(document.querySelectorAll('.hawk-filter-pill')).map((el) => el.dataset.filter);
    expect(pills).toEqual(['guides']);
    hawk.destroy();
  });

  it('activates defaultTab on mount and scopes the first search to it', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({
      pagefind,
      tabs: [{ id: 'guides', label: 'Guides', filter: { category: 'Guides' } }],
      defaultTab: 'guides',
    });
    expect(hawk.state.activeTab).toBe('guides');
    const active = document.querySelector('.hawk-filter-pill.active');
    expect(active.dataset.filter).toBe('guides');

    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'x';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith('x', expect.objectContaining({ filters: { category: 'Guides' } }));
    hawk.destroy();
  });

  it('falls back to "all" and warns when defaultTab matches no configured tab', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      tabs: [{ label: 'Guides' }],
      defaultTab: 'does-not-exist',
    });
    expect(hawk.state.activeTab).toBe('all');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('does-not-exist'));
    warn.mockRestore();
    hawk.destroy();
  });

  it('a tab filter object is passed to Pagefind verbatim, including multi-dimension/multi-value filters', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({
      pagefind,
      tabs: [{ id: 'multi', label: 'Multi', filter: { category: ['Guides', 'Reference'], version: '2.x' } }],
      defaultTab: 'multi',
    });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'x';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith(
      'x',
      expect.objectContaining({ filters: { category: ['Guides', 'Reference'], version: '2.x' } })
    );
    hawk.destroy();
  });
});

describe('pagefindOptions passthrough', () => {
  it('merges top-level pagefindOptions into every search call', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({ pagefind, pagefindOptions: { sort: { date: 'desc' } } });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'x';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith('x', expect.objectContaining({ sort: { date: 'desc' } }));
    hawk.destroy();
  });

  it("a tab's own pagefindOptions overrides the top-level one for that tab", async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({
      pagefind,
      pagefindOptions: { sort: { date: 'desc' } },
      tabs: [{ id: 'guides', label: 'Guides', pagefindOptions: { sort: { title: 'asc' } } }],
      defaultTab: 'guides',
    });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'x';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith('x', expect.objectContaining({ sort: { title: 'asc' } }));
    hawk.destroy();
  });
});

describe('categories shorthand still expands to tabs', () => {
  it('produces the same pills as before, filtering on categoryFilterName', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({ pagefind, categories: ['Custom'] });
    expect(pagefind.filters).not.toHaveBeenCalled();
    const pills = Array.from(document.querySelectorAll('.hawk-filter-pill')).map((el) => el.dataset.filter);
    expect(pills).toEqual(['all', 'Custom']);
    hawk.destroy();
  });
});

describe('initial popup state', () => {
  const htmlPage = (bodyInner) => `<!doctype html><html><body>${bodyInner}</body></html>`;

  it('eagerResults (default true) populates the results pane as soon as Pagefind loads, with no query typed', async () => {
    const pagefind = mockPagefind({
      search: vi.fn().mockResolvedValue({
        results: [resultFor({ meta: { title: 'Landing' }, url: '/landing/', excerpt: 'landing excerpt', sub_results: [] })],
      }),
    });
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.search).toHaveBeenCalledWith('', expect.any(Object));
    expect(hawk.state.matches).toHaveLength(1);
    expect(document.querySelector('.hawk-modal-input').value).toBe('');
    hawk.destroy();
  });

  it('eagerResults: false leaves the results pane on "Type to search"', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({ pagefind, eagerResults: false });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.search).not.toHaveBeenCalled();
    expect(document.querySelector('.hawk-modal-counter').textContent).toBe('Type to search');
    hawk.destroy();
  });

  it('defaultPreviewUrl renders on mount, before Pagefind loads or any selection exists', async () => {
    fetch.mockResolvedValue({
      text: () => Promise.resolve(htmlPage('<main data-pagefind-body><h2>Welcome</h2><p>overview text</p></main>')),
    });
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      eagerResults: false,
      defaultPreviewUrl: '/getting-started/',
      defaultPreviewTitle: 'Getting started',
    });
    // Rendered synchronously on mount — no hawk.open()/pagefind load needed to see it queued.
    expect(document.querySelector('.hawk-preview-title')).toBeTruthy();
    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() => expect(content.innerHTML).toContain('overview text'));
    expect(fetch).toHaveBeenCalledWith('/getting-started/');
    hawk.destroy();
  });

  it('a real result replaces the default preview once eagerResults populates matches', async () => {
    fetch.mockResolvedValue({
      text: () => Promise.resolve(htmlPage('<main data-pagefind-body><p>real result content</p></main>')),
    });
    const pagefind = mockPagefind({
      search: vi.fn().mockResolvedValue({
        results: [resultFor({ meta: { title: 'Real' }, url: '/real/', excerpt: 'real excerpt', sub_results: [] })],
      }),
    });
    const hawk = new HawkSearch({ pagefind, defaultPreviewUrl: '/default/', defaultPreviewTitle: 'Default' });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() => expect(content.innerHTML).toContain('real result content'));
    hawk.destroy();
  });
});

describe('search results and keyboard navigation', () => {
  /** @returns {Promise<HawkSearch>} */
  async function hawkWithResults() {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({ meta: { title: 'Page One' }, url: '/one/', excerpt: 'first <mark>match</mark>', sub_results: [] }),
          resultFor({
            meta: { title: 'Page Two' },
            url: '/two/',
            excerpt: 'second match',
            sub_results: [{ title: 'A Section', url: '/two/#section', excerpt: 'section text' }],
          }),
        ],
      }),
    });
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.querySelector('.hawk-modal-input').value = 'match';
    document.querySelector('.hawk-modal-input').dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    return hawk;
  }

  it('flattens page results and their sub_results into rendered rows', async () => {
    const hawk = await hawkWithResults();
    expect(hawk.state.matches).toHaveLength(3);
    expect(hawk.state.matches[0].isAnchor).toBe(false);
    expect(hawk.state.matches[2].isAnchor).toBe(true);
    hawk.destroy();
  });

  it('wraps ArrowDown/ArrowUp selection around the match list', async () => {
    const hawk = await hawkWithResults();
    const input = document.querySelector('.hawk-modal-input');
    expect(hawk.state.selectedIndex).toBe(0);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(hawk.state.selectedIndex).toBe(2);

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(hawk.state.selectedIndex).toBe(1);

    hawk.destroy();
  });
});

describe('pin system', () => {
  afterEach(() => {
    localStorage.clear();
  });

  async function hawkWithResults(config = {}) {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({ meta: { title: 'Page One' }, url: '/one/', excerpt: 'first match', sub_results: [] }),
          resultFor({ meta: { title: 'Page Two' }, url: '/two/', excerpt: 'second match', sub_results: [] }),
        ],
      }),
    });
    const hawk = new HawkSearch({ pagefind, ...config });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.querySelector('.hawk-modal-input').value = 'match';
    document.querySelector('.hawk-modal-input').dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    return hawk;
  }

  it('renders a pin toggle on every row when enablePins (default true)', async () => {
    const hawk = await hawkWithResults();
    expect(document.querySelectorAll('.hawk-pin-btn')).toHaveLength(2);
    expect(document.querySelector('.hawk-pin-btn').textContent).toBe('Pin');
    hawk.destroy();
  });

  it('omits the pin toggle when enablePins is false', async () => {
    const hawk = await hawkWithResults({ enablePins: false });
    expect(document.querySelectorAll('.hawk-pin-btn')).toHaveLength(0);
    hawk.destroy();
  });

  it('clicking the pin toggle pins without navigating or triggering onSelect', async () => {
    const onSelect = vi.fn();
    const hawk = await hawkWithResults({ onSelect });
    const firstPinBtn = document.querySelectorAll('.hawk-pin-btn')[0];

    firstPinBtn.click();
    expect(onSelect).not.toHaveBeenCalled();
    expect(hawk.state.pins).toEqual([{ url: '/one/', title: 'Page One', isAnchor: false }]);
    expect(JSON.parse(localStorage.getItem('hawk:pins'))).toEqual([{ url: '/one/', title: 'Page One', isAnchor: false }]);
    expect(document.querySelectorAll('.hawk-pin-btn')[0].textContent).toBe('Unpin');
    expect(document.querySelectorAll('.hawk-pin-btn')[0].classList.contains('is-pinned')).toBe(true);

    hawk.destroy();
  });

  it('a "Pinned" tab appears once a pin exists and disappears once the last one is removed', async () => {
    const hawk = await hawkWithResults();
    // Baseline pills come from mockPagefind()'s default filters() — category derivation, not pins.
    expect(Array.from(document.querySelectorAll('.hawk-filter-pill')).map((p) => p.dataset.filter)).toEqual([
      'all',
      'Guides',
      'Reference',
    ]);

    document.querySelectorAll('.hawk-pin-btn')[0].click();
    expect(Array.from(document.querySelectorAll('.hawk-filter-pill')).map((p) => p.dataset.filter)).toEqual([
      'pinned',
      'all',
      'Guides',
      'Reference',
    ]);

    document.querySelectorAll('.hawk-pin-btn')[0].click(); // unpin the only pin
    expect(Array.from(document.querySelectorAll('.hawk-filter-pill')).map((p) => p.dataset.filter)).toEqual([
      'all',
      'Guides',
      'Reference',
    ]);
    hawk.destroy();
  });

  it('the Pinned tab lists pins directly (no Pagefind call) and clears any typed query', async () => {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [resultFor({ meta: { title: 'Page One' }, url: '/one/', excerpt: 'first match', sub_results: [] })],
      }),
    });
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'match';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.querySelector('.hawk-pin-btn').click();
    expect(pagefind.debouncedSearch).toHaveBeenCalledTimes(1);

    document.querySelector('.hawk-filter-pill[data-filter="pinned"]').click();
    expect(pagefind.debouncedSearch).toHaveBeenCalledTimes(1); // still just the one call — pinned view didn't search
    expect(hawk.state.matches).toEqual([{ title: 'Page One', url: '/one/', excerpt: '', isAnchor: false, meta: {} }]);
    expect(input.value).toBe('');
    hawk.destroy();
  });

  it('unpinning the last item while viewing the Pinned tab falls back to "all" and resumes a real search', async () => {
    const hawk = await hawkWithResults();
    document.querySelectorAll('.hawk-pin-btn')[0].click();
    document.querySelector('.hawk-filter-pill[data-filter="pinned"]').click();
    expect(hawk.state.activeTab).toBe('pinned');

    document.querySelector('.hawk-pin-btn').click(); // unpin the only item while viewing it
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(hawk.state.activeTab).toBe('all');
    expect(Array.from(document.querySelectorAll('.hawk-filter-pill')).map((p) => p.dataset.filter)).toEqual([
      'all',
      'Guides',
      'Reference',
    ]);
    hawk.destroy();
  });

  it('persists pins across a fresh instance (localStorage) and shows the Pinned tab once tabs resolve', async () => {
    localStorage.setItem('hawk:pins', JSON.stringify([{ url: '/one/', title: 'Page One', isAnchor: false }]));
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    expect(hawk.state.pins).toEqual([{ url: '/one/', title: 'Page One', isAnchor: false }]);
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.querySelector('.hawk-filter-pill[data-filter="pinned"]')).toBeTruthy();
    hawk.destroy();
  });

  it('caps pins at maxPins as a silent no-op past the limit', async () => {
    const hawk = await hawkWithResults({ maxPins: 1 });
    document.querySelectorAll('.hawk-pin-btn')[0].click();
    document.querySelectorAll('.hawk-pin-btn')[1].click(); // second pin attempt, already at the cap
    expect(hawk.state.pins).toHaveLength(1);
    hawk.destroy();
  });
});

describe('result/page metadata', () => {
  async function hawkWithResults(config = {}) {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: { title: 'Page One', section: 'Guides' },
            url: '/one/',
            excerpt: 'first match',
            sub_results: [{ title: 'A Section', url: '/one/#section', excerpt: 'section text' }],
          }),
          resultFor({ meta: { title: 'Page Two' }, url: '/two/', excerpt: 'second match', sub_results: [] }),
        ],
      }),
    });
    const hawk = new HawkSearch({ pagefind, ...config });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.querySelector('.hawk-modal-input').value = 'match';
    document.querySelector('.hawk-modal-input').dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    return hawk;
  }

  it('exposes the full meta object on each match, including sub_results reusing the parent page meta', async () => {
    const hawk = await hawkWithResults();
    expect(hawk.state.matches[0].meta).toEqual({ title: 'Page One', section: 'Guides' });
    expect(hawk.state.matches[1].meta).toEqual({ title: 'Page One', section: 'Guides' }); // the sub_result row
    expect(hawk.state.matches[2].meta).toEqual({ title: 'Page Two' });
    hawk.destroy();
  });

  it('renders a meta.section badge on the result row and, once selected, the preview header', async () => {
    const hawk = await hawkWithResults();
    const firstRow = document.querySelectorAll('.hawk-result-item')[0];
    expect(firstRow.querySelector('.hawk-meta-badge').textContent).toBe('Guides');
    expect(document.querySelector('.hawk-preview-header .hawk-meta-badge').textContent).toBe('Guides');

    const secondRow = document.querySelectorAll('.hawk-result-item')[2]; // Page Two, no meta.section
    expect(secondRow.querySelector('.hawk-meta-badge')).toBeNull();
    hawk.destroy();
  });

  it('tracks pageCount (distinct pages) separately from the flattened match count', async () => {
    const hawk = await hawkWithResults();
    expect(hawk.state.matches).toHaveLength(3); // 2 pages + 1 sub_result anchor
    expect(hawk.state.pageCount).toBe(2);
    hawk.destroy();
  });

  it('the default counter text includes page count only when it differs from the match count', async () => {
    const hawk = await hawkWithResults();
    expect(document.querySelector('.hawk-modal-counter').textContent).toBe('3 matching results across 2 pages');
    hawk.destroy();
  });
});

describe('two-pane keyboard navigation', () => {
  async function hawkWithResults() {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({ meta: { title: 'Page One' }, url: '/one/', excerpt: 'first match', sub_results: [] }),
          resultFor({ meta: { title: 'Page Two' }, url: '/two/', excerpt: 'second match', sub_results: [] }),
        ],
      }),
    });
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.querySelector('.hawk-modal-input').value = 'match';
    document.querySelector('.hawk-modal-input').dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    return hawk;
  }

  it('results pane and preview pane are focusable, and results/preview are not individually tabbable', async () => {
    const hawk = await hawkWithResults();
    expect(document.querySelector('.hawk-results-pane').tabIndex).toBe(0);
    expect(document.querySelector('.hawk-preview-pane').tabIndex).toBe(0);
    document.querySelectorAll('.hawk-result-item').forEach((el) => expect(el.tabIndex).toBe(-1));
    hawk.destroy();
  });

  it('exposes the selected result via aria-activedescendant on the results pane', async () => {
    const hawk = await hawkWithResults();
    const resultsPane = document.querySelector('.hawk-results-pane');
    expect(resultsPane.getAttribute('aria-activedescendant')).toBe(`${hawk.id}-result-0`);

    resultsPane.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(resultsPane.getAttribute('aria-activedescendant')).toBe(`${hawk.id}-result-1`);
    hawk.destroy();
  });

  it('a printable keydown on the results pane forwards to the input and re-runs the search', async () => {
    const hawk = await hawkWithResults();
    const resultsPane = document.querySelector('.hawk-results-pane');
    const input = document.querySelector('.hawk-modal-input');
    resultsPane.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }));
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('matchx');
    hawk.destroy();
  });

  it('ArrowUp/ArrowDown/Home/End on the preview pane scroll it instead of changing selection', async () => {
    const hawk = await hawkWithResults();
    const previewPane = document.querySelector('.hawk-preview-pane');
    Object.defineProperty(previewPane, 'scrollHeight', { value: 1000, configurable: true });

    previewPane.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(previewPane.scrollTop).toBe(48);
    previewPane.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(previewPane.scrollTop).toBe(0);
    previewPane.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(previewPane.scrollTop).toBe(1000);
    previewPane.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(previewPane.scrollTop).toBe(0);
    expect(hawk.state.selectedIndex).toBe(0);
    hawk.destroy();
  });

  it('focusing the preview pane sets data-hawk-show-preview, blur clears it', async () => {
    const hawk = await hawkWithResults();
    const root = document.getElementById(hawk.id);
    const previewPane = document.querySelector('.hawk-preview-pane');
    previewPane.dispatchEvent(new FocusEvent('focus'));
    expect(root.dataset.hawkShowPreview).toBe('true');
    previewPane.dispatchEvent(new FocusEvent('blur'));
    expect(root.dataset.hawkShowPreview).toBe('false');
    hawk.destroy();
  });
});

describe('focus trap', () => {
  async function hawkWithResults(config = {}) {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [resultFor({ meta: { title: 'Page One' }, url: '/one/', excerpt: 'match', sub_results: [] })],
      }),
    });
    const hawk = new HawkSearch({ pagefind, ...config });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.querySelector('.hawk-modal-input').value = 'match';
    document.querySelector('.hawk-modal-input').dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    return hawk;
  }

  it('Tab on the last focusable element wraps to the input (first)', async () => {
    const hawk = await hawkWithResults();
    const input = document.querySelector('.hawk-modal-input');
    const previewPane = document.querySelector('.hawk-preview-pane'); // last stop: medium density, a result is selected
    previewPane.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(input);
    hawk.destroy();
  });

  it('Shift+Tab on the input (first) wraps to the last focusable element', async () => {
    const hawk = await hawkWithResults();
    const input = document.querySelector('.hawk-modal-input');
    const previewPane = document.querySelector('.hawk-preview-pane');
    input.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(previewPane);
    hawk.destroy();
  });

  it('does not trap focus while the modal is closed', async () => {
    const hawk = await hawkWithResults();
    hawk.close();
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(outside);
    outside.remove();
    hawk.destroy();
  });

  it('excludes the preview pane from the trap in compact density when it is not the revealed pane', async () => {
    const hawk = await hawkWithResults({ params: { density: 'compact' } });
    const input = document.querySelector('.hawk-modal-input');
    const resultsPane = document.querySelector('.hawk-results-pane');
    // Last reachable stop is the results pane (preview pane hidden/unreached in compact density).
    resultsPane.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(input);

    input.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
    expect(document.activeElement).toBe(resultsPane);
    hawk.destroy();
  });
});

describe('pagefind load errors', () => {
  it('a rejecting search call renders an unavailable state instead of throwing', async () => {
    const pagefind = mockPagefind({
      search: vi.fn().mockRejectedValue(new Error('index fetch failed')),
      debouncedSearch: vi.fn().mockRejectedValue(new Error('index fetch failed')),
    });
    const hawk = new HawkSearch({ pagefind });
    expect(() => hawk.open()).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.querySelector('.hawk-load-error')).toBeTruthy();
    expect(document.querySelector('.hawk-modal-counter').textContent).toBe('Search unavailable');
    expect(hawk.state.error).toBeInstanceOf(Error);
    hawk.destroy();
  });

  it('a later keystroke search failure also renders the unavailable state, not an unhandled rejection', async () => {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockRejectedValue(new Error('boom')),
    });
    const hawk = new HawkSearch({ pagefind, eagerResults: false });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'x';
    expect(() => input.dispatchEvent(new Event('input'))).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(document.querySelector('.hawk-load-error')).toBeTruthy();
    hawk.destroy();
  });
});

describe('i18n / strings overrides', () => {
  it('overrides render in the markup and result/counter text', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({
      pagefind,
      eagerResults: false,
      strings: {
        dialogLabel: 'Recherche',
        inputPlaceholder: 'Rechercher...',
        typeToSearch: 'Tapez pour rechercher',
        noResults: (query) => `Aucun résultat${query ? ` pour "${query}"` : ''}.`,
      },
    });
    const root = document.getElementById(hawk.id);
    expect(root.getAttribute('aria-label')).toBe('Recherche');
    expect(document.querySelector('.hawk-modal-input').placeholder).toBe('Rechercher...');
    expect(document.querySelector('.hawk-modal-counter').textContent).toBe('Tapez pour rechercher');

    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.querySelector('.hawk-empty').textContent).toBe('Aucun résultat pour "zzz".');
    hawk.destroy();
  });

  it('defaults are unchanged when strings is not configured', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    expect(document.getElementById(hawk.id).getAttribute('aria-label')).toBe('Search');
    expect(document.querySelector('.hawk-modal-input').placeholder).toBe('Search...');
    hawk.destroy();
  });
});

describe('category tabs (keyboard + ARIA)', () => {
  it('renders a roving tabindex, with aria-controls pointing at the results listbox', async () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const pills = Array.from(document.querySelectorAll('.hawk-filter-pill'));
    expect(pills.map((p) => p.dataset.filter)).toEqual(['all', 'Guides', 'Reference']);
    expect(pills[0].tabIndex).toBe(0);
    expect(pills[1].tabIndex).toBe(-1);
    expect(pills[2].tabIndex).toBe(-1);
    expect(pills[0].getAttribute('aria-controls')).toBe(`${hawk.id}-results`);

    hawk.destroy();
  });

  it('ArrowRight/ArrowLeft move focus and activate the tab under focus, wrapping around', async () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const pills = Array.from(document.querySelectorAll('.hawk-filter-pill'));

    pills[0].focus();
    pills[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement.dataset.filter).toBe('Guides');
    expect(document.activeElement.getAttribute('aria-selected')).toBe('true');
    expect(pills[0].tabIndex).toBe(-1);

    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(document.activeElement.dataset.filter).toBe('all');

    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(document.activeElement.dataset.filter).toBe('Reference');

    hawk.destroy();
  });

  it('Home/End jump to the first/last tab', async () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const pills = Array.from(document.querySelectorAll('.hawk-filter-pill'));

    pills[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(document.activeElement.dataset.filter).toBe('Reference');

    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(document.activeElement.dataset.filter).toBe('all');

    hawk.destroy();
  });
});

describe('rich preview content', () => {
  const htmlPage = (bodyInner) => `<!doctype html><html><body>${bodyInner}</body></html>`;

  it('fetches the result page and injects only the contentSelector region', async () => {
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(
          htmlPage(`
            <nav>should not appear</nav>
            <main data-pagefind-body><h2 id="install">Install</h2><p>Run <code>npm install</code>.</p></main>
          `)
        ),
    });
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [resultFor({ meta: { title: 'Getting started' }, url: '/getting-started/', excerpt: 'excerpt', sub_results: [] })],
      }),
    });
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'install';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() => expect(content.innerHTML).toContain('npm install'));

    expect(fetch).toHaveBeenCalledWith('/getting-started/');
    expect(content.innerHTML).not.toContain('should not appear');

    hawk.destroy();
  });

  it('extracts only the matched heading subsection for a sub_result, and caches the page fetch', async () => {
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(
          htmlPage(`
            <main data-pagefind-body>
              <h2 id="first">First</h2><p>first section</p>
              <h2 id="second">Second</h2><p>second section</p>
              <h2 id="third">Third</h2><p>third section</p>
            </main>
          `)
        ),
    });
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: { title: 'Page' },
            url: '/page/',
            excerpt: 'page excerpt',
            sub_results: [{ title: 'Second', url: '/page/#second', excerpt: 'sub excerpt' }],
          }),
        ],
      }),
    });
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'second';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Row 0 is the page itself, row 1 is the "Second" sub_result.
    document.querySelectorAll('.hawk-result-item')[1].dispatchEvent(new Event('mouseenter', { bubbles: true }));

    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() => expect(content.innerHTML).toContain('second section'));
    expect(content.innerHTML).not.toContain('first section');
    expect(content.innerHTML).not.toContain('third section');
    expect(fetch).toHaveBeenCalledTimes(1); // same page as the initial (index 0) selection — cached, not refetched

    hawk.destroy();
  });

  it('falls back to the Pagefind excerpt when the fetch fails', async () => {
    // beforeEach's default fetch mock already rejects.
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [resultFor({ meta: { title: 'Offline Page' }, url: '/offline/', excerpt: 'the excerpt text', sub_results: [] })],
      }),
    });
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'offline';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() => expect(content.innerHTML).toContain('the excerpt text'));

    hawk.destroy();
  });
});
