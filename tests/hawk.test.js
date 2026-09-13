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
  localStorage.clear();
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
    const theme = {
      name: 'custom',
      apply: vi.fn(),
      tokens: { '--hawk-accent': '#22d3ee', '--hawk-font-family': 'Inter' },
    };
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
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      rotatingPlaceholders: ['Try "tabs"...', 'Try "density"...'],
    });
    expect(document.querySelector('.hawk-input-ghost').textContent).toBe('Try "tabs"...');
    expect(document.querySelector('.hawk-modal-input').placeholder).toBe('');
    hawk.destroy();
  });

  it('starts rotation on open (instant driver) and stops it on close', () => {
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      rotatingPlaceholders: ['a', 'b'],
      animation: false,
    });
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
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      rotatingPlaceholders: ['a'],
      animation: false,
    });
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
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      poweredByHref: 'https://example.com/search',
    });
    expect(document.querySelector('.hawk-powered-by').getAttribute('href')).toBe(
      'https://example.com/search'
    );
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

  it('supports a minimal search header with all right-side controls hidden', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), headerControls: false });
    expect(document.querySelector('.hawk-density-toggle')).toBeNull();
    expect(document.querySelector('.hawk-modal-esc')).toBeNull();
    expect(document.querySelector('.hawk-modal-header').children).toHaveLength(1);
    hawk.destroy();
  });

  it('can hide density and Escape controls independently', () => {
    const noDensity = new HawkSearch({
      pagefind: mockPagefind(),
      headerControls: { density: false },
    });
    expect(document.querySelector('.hawk-density-toggle')).toBeNull();
    expect(document.querySelector('.hawk-modal-esc')).toBeTruthy();
    noDensity.destroy();

    const noEscape = new HawkSearch({
      pagefind: mockPagefind(),
      headerControls: { escape: false },
    });
    expect(document.querySelector('.hawk-density-toggle')).toBeTruthy();
    expect(document.querySelector('.hawk-modal-esc')).toBeNull();
    noEscape.destroy();
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

  it("a tab's sort shorthand merges into its own pagefindOptions.sort", async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({
      pagefind,
      tabs: [
        {
          id: 'recent',
          label: 'Recently updated',
          sort: { date: 'desc' },
          pagefindOptions: { ranking: { termFrequency: 0 } },
        },
      ],
      defaultTab: 'recent',
    });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'x';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith(
      'x',
      expect.objectContaining({ sort: { date: 'desc' }, ranking: { termFrequency: 0 } })
    );
    hawk.destroy();
  });
});

describe('config.tabsUrl', () => {
  it('fetches and renders tabs from a JSON file once Pagefind loads', async () => {
    fetch.mockResolvedValue({
      json: () =>
        Promise.resolve([{ id: 'guides', label: 'Guides', filter: { category: 'Guides' } }]),
    });
    const hawk = new HawkSearch({ pagefind: mockPagefind(), tabsUrl: '/tabs.json' });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(fetch).toHaveBeenCalledWith('/tabs.json');
    const pills = Array.from(document.querySelectorAll('.hawk-filter-pill')).map(
      (el) => el.dataset.filter
    );
    expect(pills).toEqual(['all', 'guides']);
    hawk.destroy();
  });

  it('falls back to auto-derived tabs (with a console warning) when the fetch fails', async () => {
    // beforeEach's default fetch mock already rejects.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const pagefind = mockPagefind({
      filters: vi.fn().mockResolvedValue({ category: { Reference: 1 } }),
    });
    const hawk = new HawkSearch({ pagefind, tabsUrl: '/tabs.json' });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const pills = Array.from(document.querySelectorAll('.hawk-filter-pill')).map(
      (el) => el.dataset.filter
    );
    expect(pills).toEqual(['all', 'Reference']);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('/tabs.json'), expect.anything());
    warn.mockRestore();
    hawk.destroy();
  });

  it('falls back to auto-derived tabs when the response is valid JSON but not an array', async () => {
    fetch.mockResolvedValue({ json: () => Promise.resolve({ not: 'an array' }) });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const pagefind = mockPagefind({
      filters: vi.fn().mockResolvedValue({ category: { Reference: 1 } }),
    });
    const hawk = new HawkSearch({ pagefind, tabsUrl: '/tabs.json' });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const pills = Array.from(document.querySelectorAll('.hawk-filter-pill')).map(
      (el) => el.dataset.filter
    );
    expect(pills).toEqual(['all', 'Reference']);
    warn.mockRestore();
    hawk.destroy();
  });

  it('is ignored when config.tabs is also given (the synchronous list always wins)', async () => {
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      tabs: [{ id: 'inline', label: 'Inline' }],
      tabsUrl: '/tabs.json',
    });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(fetch).not.toHaveBeenCalledWith('/tabs.json');
    hawk.destroy();
  });
});

describe('pagefindOptions passthrough', () => {
  it('configures Pagefind and merges additional indexes before deriving tabs', async () => {
    const events = [];
    const pagefind = mockPagefind({
      options: vi.fn(async (options) => events.push(['options', options])),
      init: vi.fn(async () => events.push(['init'])),
      mergeIndex: vi.fn(async (path, options) => events.push(['merge', path, options])),
      filters: vi.fn(async () => {
        events.push(['filters']);
        return { category: { Guides: 1 } };
      }),
    });
    const hawk = new HawkSearch({
      pagefind,
      pagefindInitOptions: { excerptLength: 20, ranking: { pageLength: 0.5 } },
      pagefindMergeIndexes: [
        { bundlePath: 'https://docs.example/pagefind', options: { indexWeight: 0.5 } },
      ],
    });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(events.slice(0, 4)).toEqual([
      ['options', { excerptLength: 20, ranking: { pageLength: 0.5 } }],
      ['init'],
      ['merge', 'https://docs.example/pagefind', { indexWeight: 0.5 }],
      ['filters'],
    ]);
    hawk.destroy();
  });

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

describe('inlineFilters', () => {
  it('is a no-op when not enabled — a literal colon stays part of the search term', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'category:Guides responsive';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith('category:Guides responsive', expect.not.objectContaining({ filters: expect.anything() }));
    hawk.destroy();
  });

  it('parses a dimension:value token out, filters on it, and searches only the remaining text', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({ pagefind, inlineFilters: true });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'category:Guides responsive nav';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith(
      'responsive nav',
      expect.objectContaining({ filters: { category: 'Guides' } })
    );
    hawk.destroy();
  });

  it('keeps spaces in a quoted value and collects repeated dimensions into an array', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({ pagefind, inlineFilters: true });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'tag:api tag:"multi word" auth';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith('auth', expect.objectContaining({ filters: { tag: ['api', 'multi word'] } }));
    hawk.destroy();
  });

  it("merges with the active tab's own filter, inline winning on a dimension collision", async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({
      pagefind,
      inlineFilters: true,
      tabs: [{ id: 'guides', label: 'Guides', filter: { category: 'Guides', lang: 'en' } }],
      defaultTab: 'guides',
    });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'category:Reference nav';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith(
      'nav',
      expect.objectContaining({ filters: { category: 'Reference', lang: 'en' } })
    );
    hawk.destroy();
  });
});

describe('inlineFilters', () => {
  it('is a no-op when not enabled — a literal colon stays part of the search term', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'category:Guides responsive';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith(
      'category:Guides responsive',
      expect.not.objectContaining({ filters: expect.anything() })
    );
    hawk.destroy();
  });

  it('parses a dimension:value token out, filters on it, and searches only the remaining text', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({ pagefind, inlineFilters: true });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'category:Guides responsive nav';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith(
      'responsive nav',
      expect.objectContaining({ filters: { category: 'Guides' } })
    );
    hawk.destroy();
  });

  it('keeps spaces in a quoted value and collects repeated dimensions into an array', async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({ pagefind, inlineFilters: true });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'tag:api tag:"multi word" auth';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith(
      'auth',
      expect.objectContaining({ filters: { tag: ['api', 'multi word'] } })
    );
    hawk.destroy();
  });

  it("merges with the active tab's own filter, inline winning on a dimension collision", async () => {
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({
      pagefind,
      inlineFilters: true,
      tabs: [{ id: 'guides', label: 'Guides', filter: { category: 'Guides', lang: 'en' } }],
      defaultTab: 'guides',
    });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'category:Reference nav';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(pagefind.debouncedSearch).toHaveBeenCalledWith(
      'nav',
      expect.objectContaining({ filters: { category: 'Reference', lang: 'en' } })
    );
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

  it("passes null (not an empty string) to search() for every empty-query call, matching Pagefind's filter-only listing mode", async () => {
    const pagefind = mockPagefind({
      search: vi.fn().mockResolvedValue({ results: [] }),
    });
    const hawk = new HawkSearch({
      pagefind,
      tabs: [{ id: 'guides', label: 'Guides', filter: { category: 'Guides' } }],
      defaultTab: 'guides',
    });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    for (const [term] of pagefind.search.mock.calls) {
      expect(term).toBeNull();
    }
    hawk.destroy();
  });

  it('eagerResults (default true) populates the results pane as soon as Pagefind loads, with no query typed', async () => {
    const pagefind = mockPagefind({
      search: vi.fn().mockResolvedValue({
        results: [resultFor({ meta: { title: 'Landing' }, url: '/landing/', excerpt: 'landing excerpt', sub_results: [] })],
      }),
    });
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    // null, not '' — Pagefind's real API treats '' as an actual (zero-match) search term and
    // null as its filter-only listing mode; see #executeSearch's own comment on this.
    expect(pagefind.search).toHaveBeenCalledWith(null, expect.any(Object));
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

  it("a tab's own defaultPreviewUrl renders on mount when it's the active tab, overriding the top-level default", async () => {
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(htmlPage('<main data-pagefind-body><p>guides landing content</p></main>')),
    });
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      eagerResults: false,
      tabs: [
        {
          id: 'guides',
          label: 'Guides',
          defaultPreviewUrl: '/guides/',
          defaultPreviewTitle: 'Guides',
        },
      ],
      defaultTab: 'guides',
      defaultPreviewUrl: '/top-level/',
      defaultPreviewTitle: 'Top level',
    });
    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() => expect(content.innerHTML).toContain('guides landing content'));
    expect(fetch).toHaveBeenCalledWith('/guides/');
    expect(fetch).not.toHaveBeenCalledWith('/top-level/');
    hawk.destroy();
  });

  it("falls back to the active tab's own defaultPreviewUrl when a search on that tab returns zero matches", async () => {
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(htmlPage('<main data-pagefind-body><p>guides landing content</p></main>')),
    });
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({ results: [] }),
    });
    const hawk = new HawkSearch({
      pagefind,
      eagerResults: false,
      tabs: [
        {
          id: 'guides',
          label: 'Guides',
          defaultPreviewUrl: '/guides/',
          defaultPreviewTitle: 'Guides',
        },
      ],
      defaultTab: 'guides',
    });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'nomatch';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() => expect(content.innerHTML).toContain('guides landing content'));
    hawk.destroy();
  });

  it('a tab with no defaultPreviewUrl of its own falls back to the top-level default when its search returns zero matches', async () => {
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(htmlPage('<main data-pagefind-body><p>top level content</p></main>')),
    });
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({ results: [] }),
    });
    const hawk = new HawkSearch({
      pagefind,
      eagerResults: false,
      tabs: [{ id: 'reference', label: 'Reference' }],
      defaultTab: 'reference',
      defaultPreviewUrl: '/top-level/',
      defaultPreviewTitle: 'Top level',
    });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'nomatch';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() => expect(content.innerHTML).toContain('top level content'));
    hawk.destroy();
  });

  it('shows the plain previewEmpty string when neither the active tab nor the top level configures a default', async () => {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({ results: [] }),
    });
    const hawk = new HawkSearch({ pagefind, eagerResults: false });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'nomatch';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(document.querySelector('.hawk-preview-empty').textContent).toBe(
      hawk.strings.previewEmpty
    );
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

  it('excludePages omits a page and its anchors while backfilling later results', async () => {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: { title: 'Home' },
            url: '/?source=search',
            excerpt: 'home',
            sub_results: [{ title: 'Features', url: '/#features', excerpt: 'features' }],
          }),
          resultFor({
            meta: { title: 'Guide' },
            url: '/guide/',
            excerpt: 'guide',
            sub_results: [],
          }),
        ],
      }),
    });
    const hawk = new HawkSearch({ pagefind, excludePages: '/', maxResults: 1 });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'page';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(hawk.state.matches.map((match) => match.url)).toEqual(['/guide/']);
    expect(hawk.state.pageCount).toBe(1);
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

describe('search race safety (#searchGeneration)', () => {
  // A real race, not a hypothetical one: eagerResults' own empty-query listing and a query typed
  // right after open() both go through #executeSearch, and both can be awaiting the same
  // in-flight Pagefind load — nothing guarantees debouncedSearch()/search() calls resolve in the
  // order they were made. A stale, later-resolving-but-earlier-started call must not clobber a
  // newer one's results once it does resolve.
  it('discards an earlier search call that resolves after a newer one already committed its results', async () => {
    let resolveFirst;
    let resolveSecond;
    const pagefind = mockPagefind({
      debouncedSearch: vi
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveFirst = resolve;
            })
        )
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveSecond = resolve;
            })
        ),
    });
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const input = document.querySelector('.hawk-modal-input');
    input.value = 'first-query';
    input.dispatchEvent(new Event('input'));
    input.value = 'second-query';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Resolve out of call order: the second (newer) call settles first, then the first (older,
    // now-stale) call settles after it — the reverse of a well-behaved network round trip.
    resolveSecond({
      results: [
        resultFor({
          meta: { title: 'Second' },
          url: '/second/',
          excerpt: 'second',
          sub_results: [],
        }),
      ],
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    resolveFirst({
      results: [
        resultFor({ meta: { title: 'First' }, url: '/first/', excerpt: 'first', sub_results: [] }),
      ],
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(hawk.state.matches).toHaveLength(1);
    expect(hawk.state.matches[0].title).toBe('Second');
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
          resultFor({
            meta: { title: 'Page One' },
            url: '/one/',
            excerpt: 'first match',
            sub_results: [],
          }),
          resultFor({
            meta: { title: 'Page Two' },
            url: '/two/',
            excerpt: 'second match',
            sub_results: [],
          }),
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
    expect(JSON.parse(localStorage.getItem('hawk:pins'))).toEqual([
      { url: '/one/', title: 'Page One', isAnchor: false },
    ]);
    expect(document.querySelectorAll('.hawk-pin-btn')[0].textContent).toBe('Unpin');
    expect(document.querySelectorAll('.hawk-pin-btn')[0].classList.contains('is-pinned')).toBe(
      true
    );

    hawk.destroy();
  });

  it('a "Pinned" tab appears once a pin exists and disappears once the last one is removed', async () => {
    const hawk = await hawkWithResults();
    // Baseline pills come from mockPagefind()'s default filters() — category derivation, not pins.
    expect(
      Array.from(document.querySelectorAll('.hawk-filter-pill')).map((p) => p.dataset.filter)
    ).toEqual(['all', 'Guides', 'Reference']);

    document.querySelectorAll('.hawk-pin-btn')[0].click();
    expect(
      Array.from(document.querySelectorAll('.hawk-filter-pill')).map((p) => p.dataset.filter)
    ).toEqual(['pinned', 'all', 'Guides', 'Reference']);

    document.querySelectorAll('.hawk-pin-btn')[0].click(); // unpin the only pin
    expect(
      Array.from(document.querySelectorAll('.hawk-filter-pill')).map((p) => p.dataset.filter)
    ).toEqual(['all', 'Guides', 'Reference']);
    hawk.destroy();
  });

  it('the Pinned tab lists pins directly (no Pagefind call) and clears any typed query', async () => {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: { title: 'Page One' },
            url: '/one/',
            excerpt: 'first match',
            sub_results: [],
          }),
        ],
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
    expect(hawk.state.matches).toEqual([
      { title: 'Page One', url: '/one/', excerpt: '', isAnchor: false, meta: {} },
    ]);
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
    expect(
      Array.from(document.querySelectorAll('.hawk-filter-pill')).map((p) => p.dataset.filter)
    ).toEqual(['all', 'Guides', 'Reference']);
    hawk.destroy();
  });

  it('persists pins across a fresh instance (localStorage) and shows the Pinned tab once tabs resolve', async () => {
    localStorage.setItem(
      'hawk:pins',
      JSON.stringify([{ url: '/one/', title: 'Page One', isAnchor: false }])
    );
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

describe('recently viewed history', () => {
  afterEach(() => {
    localStorage.clear();
  });

  async function hawkWithResult(config = {}) {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: { title: 'History page' },
            url: '/history/',
            excerpt: 'history match',
            sub_results: [],
          }),
        ],
      }),
    });
    const hawk = new HawkSearch({ pagefind, ...config });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'history';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    return hawk;
  }

  it('records a selected result and exposes a synthetic Recently viewed tab', async () => {
    const hawk = await hawkWithResult();
    const row = document.querySelector('.hawk-result-item');
    row.addEventListener('click', (event) => event.preventDefault());
    row.click();

    expect(hawk.state.recentlyViewed).toEqual([
      expect.objectContaining({
        url: '/history/',
        title: 'History page',
        isAnchor: false,
        viewedAt: expect.any(String),
      }),
    ]);
    expect(document.querySelector('[data-filter="recently-viewed"]')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('hawk:recently-viewed'))).toHaveLength(1);
    hawk.destroy();
  });

  it('loads persisted history newest-first and lists it without Pagefind', async () => {
    localStorage.setItem(
      'hawk:recently-viewed',
      JSON.stringify([
        { url: '/new/', title: 'New', isAnchor: false, viewedAt: '2026-09-09T02:00:00.000Z' },
        { url: '/old/', title: 'Old', isAnchor: false, viewedAt: '2026-09-09T01:00:00.000Z' },
      ])
    );
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.querySelector('[data-filter="recently-viewed"]').click();

    expect(pagefind.debouncedSearch).not.toHaveBeenCalled();
    expect(hawk.state.matches.map((item) => item.title)).toEqual(['New', 'Old']);
    hawk.destroy();
  });

  it('can disable recently viewed history', async () => {
    const hawk = await hawkWithResult({ enableRecentlyViewed: false });
    const row = document.querySelector('.hawk-result-item');
    row.addEventListener('click', (event) => event.preventDefault());
    row.click();

    expect(hawk.state.recentlyViewed).toEqual([]);
    expect(document.querySelector('[data-filter="recently-viewed"]')).toBeNull();
    expect(localStorage.getItem('hawk:recently-viewed')).toBeNull();
    hawk.destroy();
  });
});

describe('second column configuration', () => {
  it('enables the preview column by default', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    const root = document.getElementById(hawk.id);
    expect(root.dataset.hawkSecondColumn).toBe('true');
    expect(root.querySelector('.hawk-modal-body').dataset.hawkColumns).toBe('2');
    expect(hawk.state.secondColumnEnabled).toBe(true);
    hawk.destroy();
  });

  it('forces a single results column when enableSecondColumn is false', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), enableSecondColumn: false });
    const root = document.getElementById(hawk.id);
    expect(root.dataset.hawkSecondColumn).toBe('false');
    expect(root.querySelector('.hawk-modal-body').dataset.hawkColumns).toBe('1');
    expect(hawk.state.secondColumnEnabled).toBe(false);
    hawk.destroy();
  });
});

describe('discovery row', () => {
  async function hawkWithDiscovery(config = {}, searchImpl) {
    const deferredSearch =
      searchImpl ||
      vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: { title: 'Page One', category: 'Guides' },
            url: '/one/',
            excerpt: 'Learn <mark>Pagefind</mark> search with <mark>metadata</mark>.',
            sub_results: [
              {
                title: 'Metadata contract',
                url: '/one/#metadata-contract',
                excerpt: '<mark>Metadata</mark> fields.',
              },
            ],
          }),
          resultFor({
            meta: { title: 'Page Two', category: 'Reference' },
            url: '/two/?view=full',
            excerpt: 'A second <mark>Pagefind</mark> result.',
            sub_results: [
              {
                title: 'API details',
                url: '/two/?view=full#api-details',
                excerpt: '<mark>API</mark> details.',
              },
            ],
          }),
        ],
      });
    const hawk = new HawkSearch({
      pagefind: mockPagefind({ debouncedSearch: deferredSearch }),
      tabs: [],
      discoveryRow: {},
      eagerResults: false,
      ...config,
    });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'pagefind metadata';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    return { hawk, deferredSearch };
  }

  it('is opt-in and renders no DOM row by default', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    expect(document.querySelector('.hawk-discovery-row')).toBeNull();
    hawk.destroy();
  });

  it('renders ranked, deduplicated matches, pages, and fragment links from Pagefind data', async () => {
    const { hawk } = await hawkWithDiscovery();
    const row = document.querySelector('.hawk-discovery-row');
    expect(row.getAttribute('aria-busy')).toBe('false');
    expect(row.querySelectorAll('.hawk-discovery-group')).toHaveLength(3);
    expect(
      Array.from(
        row.querySelectorAll('[data-hawk-discovery-group="matches"] a'),
        (el) => el.textContent
      )
    ).toEqual(['Pagefind', 'metadata', 'API']);
    expect(
      Array.from(
        row.querySelectorAll('[data-hawk-discovery-group="pages"] a'),
        (el) => el.textContent
      )
    ).toEqual(['Page One', 'Page Two']);
    expect(
      Array.from(row.querySelectorAll('[data-hawk-discovery-group="headings"] a'), (el) =>
        el.getAttribute('href')
      )
    ).toEqual(['/one/#metadata-contract', '/two/?view=full#api-details']);
    hawk.destroy();
  });

  it('supports independent disabled, renamed, limited, and empty group states', async () => {
    const { hawk } = await hawkWithDiscovery({
      discoveryRow: {
        matches: false,
        pages: { label: 'Pages', maxItems: 1 },
        headings: { maxItems: 0 },
      },
    });
    expect(document.querySelector('[data-hawk-discovery-group="matches"]')).toBeNull();
    expect(
      document.querySelector('[data-hawk-discovery-group="pages"] .hawk-discovery-title')
        .textContent
    ).toBe('Pages');
    expect(document.querySelectorAll('[data-hawk-discovery-group="pages"] a')).toHaveLength(1);
    expect(
      document.querySelector('[data-hawk-discovery-group="headings"] .hawk-discovery-empty')
        .textContent
    ).toBe('No links available.');
    hawk.destroy();
  });

  it('announces loading while Pagefind is pending and includes links in the modal focus trap', async () => {
    let resolveSearch;
    const pending = new Promise((resolve) => {
      resolveSearch = resolve;
    });
    const search = vi.fn().mockReturnValue(pending);
    const setup = hawkWithDiscovery({}, search);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const row = document.querySelector('.hawk-discovery-row');
    expect(row.getAttribute('aria-busy')).toBe('true');
    expect(row.querySelector('[role="status"]').textContent).toBe('Finding links…');
    resolveSearch({
      results: [
        resultFor({
          meta: { title: 'One' },
          url: '/one/',
          excerpt: '<mark>one</mark>',
          sub_results: [],
        }),
      ],
    });
    const { hawk } = await setup;
    const links = document.querySelectorAll('.hawk-discovery-link');
    const lastLink = links[links.length - 1];
    lastLink.focus();
    lastLink.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(document.querySelector('.hawk-modal-input'));
    hawk.destroy();
  });
});

describe('result/page metadata', () => {
  async function hawkWithResults(config = {}) {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: {
              title: 'Page One',
              section: 'Guides',
              date: '2026-09-09',
              tags: 'Pagefind, Hugo',
              published: '2026-09-01',
              topics: 'Search, Metadata',
            },
            url: '/one/',
            excerpt: 'first match',
            sub_results: [{ title: 'A Section', url: '/one/#section', excerpt: 'section text' }],
          }),
          resultFor({
            meta: { title: 'Page Two' },
            url: '/two/',
            excerpt: 'second match',
            sub_results: [],
          }),
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
    expect(hawk.state.matches[0].meta).toEqual({
      title: 'Page One',
      section: 'Guides',
      date: '2026-09-09',
      tags: 'Pagefind, Hugo',
      published: '2026-09-01',
      topics: 'Search, Metadata',
    });
    expect(hawk.state.matches[1].meta).toEqual(hawk.state.matches[0].meta); // the sub_result row
    expect(hawk.state.matches[2].meta).toEqual({ title: 'Page Two' });
    hawk.destroy();
  });

  it('renders date and tags before the description and keeps the section badge in the preview', async () => {
    const hawk = await hawkWithResults();
    const firstRow = document.querySelectorAll('.hawk-result-item')[0];
    expect(firstRow.querySelector('.hawk-result-meta').nextElementSibling).toBe(
      firstRow.querySelector('.hawk-result-desc')
    );
    expect(firstRow.querySelector('.hawk-result-date').textContent).toBe('2026-09-09');
    expect(
      Array.from(firstRow.querySelectorAll('.hawk-result-tag'), (tag) => tag.textContent)
    ).toEqual(['Guides', 'Pagefind', 'Hugo']);
    expect(document.querySelector('.hawk-preview-header .hawk-meta-badge').textContent).toBe(
      'Guides'
    );

    const secondRow = document.querySelectorAll('.hawk-result-item')[2]; // Page Two, no meta.section
    expect(secondRow.querySelector('.hawk-meta-badge')).toBeNull();
    hawk.destroy();
  });

  it('can disable result dates and tags independently', async () => {
    const noDate = await hawkWithResults({ showResultDate: false });
    expect(document.querySelector('.hawk-result-date')).toBeNull();
    expect(document.querySelector('.hawk-result-tag')).toBeTruthy();
    noDate.destroy();

    const noTags = await hawkWithResults({ showResultTags: false });
    expect(document.querySelector('.hawk-result-date')).toBeTruthy();
    expect(document.querySelector('.hawk-result-tag')).toBeNull();
    expect(document.querySelector('.hawk-preview-header .hawk-meta-badge')).toBeNull();
    noTags.destroy();
  });

  it('uses configurable Pagefind metadata keys for dates and tags', async () => {
    const hawk = await hawkWithResults({
      resultDateMetaKey: 'published',
      resultTagsMetaKey: 'topics',
    });
    const firstRow = document.querySelector('.hawk-result-item');
    expect(firstRow.querySelector('.hawk-result-date').textContent).toBe('2026-09-01');
    expect(
      Array.from(firstRow.querySelectorAll('.hawk-result-tag'), (tag) => tag.textContent)
    ).toEqual(['Guides', 'Search', 'Metadata']);
    hawk.destroy();
  });

  it('suppresses duplicate tags when section and tags overlap or tags repeat', async () => {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: {
              title: 'Dup Page',
              section: 'Guides',
              tags: 'Guides, API, API, Guides',
            },
            url: '/dup/',
            excerpt: 'excerpt',
            sub_results: [],
          }),
        ],
      }),
    });
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.querySelector('.hawk-modal-input').value = 'dup';
    document.querySelector('.hawk-modal-input').dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const row = document.querySelector('.hawk-result-item');
    const tags = Array.from(row.querySelectorAll('.hawk-result-tag'), (t) => t.textContent);
    expect(tags).toEqual(['Guides', 'API']); // duplicates suppressed
    hawk.destroy();
  });

  it('escapes special characters in date and tag values safely in HTML', async () => {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: {
              title: 'Escaped Page',
              date: '2026-09-10"><script>alert(1)</script>',
              tags: '<b>XSS</b>, "quoted"',
            },
            url: '/escaped/',
            excerpt: 'excerpt',
            sub_results: [],
          }),
        ],
      }),
    });
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.querySelector('.hawk-modal-input').value = 'esc';
    document.querySelector('.hawk-modal-input').dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const row = document.querySelector('.hawk-result-item');
    expect(row.querySelector('script')).toBeNull();
    expect(row.querySelector('b')).toBeNull();
    expect(row.querySelector('.hawk-result-date').getAttribute('datetime')).toBe(
      '2026-09-10"><script>alert(1)</script>'
    );
    expect(row.querySelector('.hawk-result-date').textContent).toBe(
      '2026-09-10"><script>alert(1)</script>'
    );
    expect(row.innerHTML).toContain('&lt;b&gt;XSS&lt;/b&gt;');
    hawk.destroy();
  });

  it('passes date sorting options to Pagefind when sort option or tab sort is configured', async () => {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({ results: [] }),
    });
    const hawk = new HawkSearch({
      pagefind,
      pagefindOptions: { sort: { date: 'desc' } },
    });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.querySelector('.hawk-modal-input').value = 'sorted';
    document.querySelector('.hawk-modal-input').dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(pagefind.debouncedSearch).toHaveBeenCalledWith(
      'sorted',
      expect.objectContaining({
        sort: { date: 'desc' },
      })
    );
    hawk.destroy();
  });

  it('renders without error when date or tag metadata keys are completely missing or null', async () => {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: { title: 'Missing Meta Page' },
            url: '/missing/',
            excerpt: 'excerpt',
            sub_results: [],
          }),
        ],
      }),
    });
    const hawk = new HawkSearch({ pagefind });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    document.querySelector('.hawk-modal-input').value = 'missing';
    document.querySelector('.hawk-modal-input').dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const row = document.querySelector('.hawk-result-item');
    expect(row.querySelector('.hawk-result-meta')).toBeNull();
    expect(row.querySelector('.hawk-result-date')).toBeNull();
    expect(row.querySelector('.hawk-result-tag')).toBeNull();
    hawk.destroy();
  });

  it('indents Pagefind sub-results beneath their parent page', async () => {
    const hawk = await hawkWithResults();
    const rows = document.querySelectorAll('.hawk-result-item');
    expect(rows[0].classList.contains('hawk-result-item--subpage')).toBe(false);
    expect(rows[1].classList.contains('hawk-result-item--subpage')).toBe(true);
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
    expect(document.querySelector('.hawk-modal-counter').textContent).toBe(
      '3 matching results across 2 pages'
    );
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

describe('scroll-triggered scrollbar brighten', () => {
  async function hawkWithResults() {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: { title: 'Page One' },
            url: '/one/',
            excerpt: 'first match',
            sub_results: [],
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

  // Fake timers are only enabled after setup (hawkWithResults() awaits real setTimeout(0) ticks
  // internally — enabling fake timers first would hang those awaits) and disabled again before
  // teardown, so each test controls its own window rather than a shared beforeEach/afterEach.

  it('marks a pane as scrolling on a scroll event, and clears it ~500ms after the last one', async () => {
    const hawk = await hawkWithResults();
    const resultsPane = document.querySelector('.hawk-results-pane');
    expect(resultsPane.dataset.hawkScrolling).toBeUndefined();

    vi.useFakeTimers();
    resultsPane.dispatchEvent(new Event('scroll'));
    expect(resultsPane.dataset.hawkScrolling).toBe('true');

    vi.advanceTimersByTime(499);
    expect(resultsPane.dataset.hawkScrolling).toBe('true');
    vi.advanceTimersByTime(1);
    expect(resultsPane.dataset.hawkScrolling).toBe('false');

    vi.useRealTimers();
    hawk.destroy();
  });

  it('a fresh scroll event resets the fade-out timer instead of stacking', async () => {
    const hawk = await hawkWithResults();
    const previewPane = document.querySelector('.hawk-preview-pane');

    vi.useFakeTimers();
    previewPane.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(400);
    previewPane.dispatchEvent(new Event('scroll')); // resets the clock
    vi.advanceTimersByTime(400);
    expect(previewPane.dataset.hawkScrolling).toBe('true'); // 800ms of activity, but never 500ms idle
    vi.advanceTimersByTime(100);
    expect(previewPane.dataset.hawkScrolling).toBe('false');

    vi.useRealTimers();
    hawk.destroy();
  });

  it('keyboard-driven preview scrolling (scrollTop set programmatically) fires the same scroll event', async () => {
    const hawk = await hawkWithResults();
    const previewPane = document.querySelector('.hawk-preview-pane');
    previewPane.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    // jsdom doesn't dispatch a native 'scroll' event from a programmatic scrollTop write (no real
    // layout/scrolling engine) — dispatch it explicitly here to exercise the same listener a real
    // browser's native scroll-from-scrollTop behavior would trigger.
    previewPane.dispatchEvent(new Event('scroll'));
    expect(previewPane.dataset.hawkScrolling).toBe('true');
    hawk.destroy();
  });

  it('clears pending fade-out timers on destroy without throwing', async () => {
    const hawk = await hawkWithResults();
    document.querySelector('.hawk-results-pane').dispatchEvent(new Event('scroll'));
    expect(() => hawk.destroy()).not.toThrow();
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

  it('marks compact result rows with the compact density contract', async () => {
    const hawk = await hawkWithResults({ params: { density: 'compact' } });
    const row = document.querySelector('.hawk-result-item');
    expect(row.closest('.hawk-modal').getAttribute('data-hawk-density')).toBe('compact');
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

  it('escapes a typed query before it reaches noResults()/innerHTML — regression test for a real reflected-XSS finding', async () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = '<img src=x onerror="window.__hawkXssProbe = true">';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(window.__hawkXssProbe).toBeUndefined();
    const empty = document.querySelector('.hawk-empty');
    expect(empty.querySelector('img')).toBeNull();
    expect(empty.textContent).toContain('<img src=x onerror="window.__hawkXssProbe = true">');
    hawk.destroy();
  });

  it('a custom noResults override also receives an escaped query (the escape happens at the call site, not inside the default string)', async () => {
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      strings: { noResults: (query) => `Nothing for ${query}` },
    });
    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = '<script>window.__hawkXssProbe = true</script>';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(window.__hawkXssProbe).toBeUndefined();
    expect(document.querySelector('.hawk-empty').innerHTML).toContain('&lt;script&gt;');
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

  it('stops the previous title animation and ignores stale content when selection changes quickly', async () => {
    let resolveFirstPage;
    let resolveSecondPage;
    fetch.mockImplementation(
      (url) =>
        new Promise((resolve) => {
          if (url === '/first/') resolveFirstPage = resolve;
          else resolveSecondPage = resolve;
        })
    );
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: { title: 'First page' },
            url: '/first/',
            excerpt: 'first',
            sub_results: [],
          }),
          resultFor({
            meta: { title: 'Second page' },
            url: '/second/',
            excerpt: 'second',
            sub_results: [],
          }),
        ],
      }),
    });
    const titleControllers = [];
    const contentControllers = [];
    const animation = {
      typeTitle: vi.fn(() => {
        const controller = { stop: vi.fn() };
        titleControllers.push(controller);
        return controller;
      }),
      typeContent: vi.fn((element, html) => {
        element.innerHTML = html;
        const controller = { stop: vi.fn() };
        contentControllers.push(controller);
        return controller;
      }),
      rotatePlaceholder() {
        return null;
      },
      stop(controller) {
        controller?.stop();
      },
    };
    const hawk = new HawkSearch({ pagefind, animation });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'page';
    input.dispatchEvent(new Event('input'));
    await vi.waitFor(() => expect(document.querySelectorAll('.hawk-result-item')).toHaveLength(2));

    document
      .querySelectorAll('.hawk-result-item')[1]
      .dispatchEvent(new Event('mouseenter', { bubbles: true }));
    expect(titleControllers[0].stop).toHaveBeenCalledOnce();

    resolveSecondPage({
      text: () =>
        Promise.resolve(htmlPage('<main data-pagefind-body><p>second page content</p></main>')),
    });
    await vi.waitFor(() => expect(animation.typeContent).toHaveBeenCalledOnce());
    expect(document.querySelector('.hawk-preview-content').textContent).toContain(
      'second page content'
    );

    resolveFirstPage({
      text: () =>
        Promise.resolve(
          htmlPage('<main data-pagefind-body><p>stale first page content</p></main>')
        ),
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(animation.typeContent).toHaveBeenCalledOnce();
    expect(document.querySelector('.hawk-preview-content').textContent).not.toContain(
      'stale first page content'
    );

    hawk.destroy();
    expect(titleControllers[1].stop).toHaveBeenCalledOnce();
    expect(contentControllers[0].stop).toHaveBeenCalledOnce();
  });

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

describe('built-in trigger (config.trigger)', () => {
  let host;
  beforeEach(() => {
    host = document.createElement('div');
    host.id = 'trigger-host';
    document.body.appendChild(host);
  });
  afterEach(() => {
    host.remove();
  });

  it('renders nothing extra when config.trigger is omitted', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    expect(document.querySelector('.hawk-trigger')).toBeNull();
    hawk.destroy();
  });

  it('renders a default-kind trigger (icon + label + kbd hint) into a selector container', () => {
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      trigger: { container: '#trigger-host' },
    });
    const btn = host.querySelector('.hawk-trigger');
    expect(btn).toBeTruthy();
    expect(btn.classList.contains('hawk-trigger-default')).toBe(true);
    expect(btn.hasAttribute('data-search-trigger')).toBe(true);
    expect(btn.querySelector('.hawk-trigger-label').textContent).toBe('Search...');
    expect(btn.querySelector('.hawk-trigger-kbd').textContent).toBe('Ctrl+K');
    hawk.destroy();
  });

  it('accepts an element directly instead of a selector', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), trigger: { container: host } });
    expect(host.querySelector('.hawk-trigger')).toBeTruthy();
    hawk.destroy();
  });

  it('minimal kind renders icon-only with an aria-label, no label/kbd', () => {
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      trigger: { kind: 'minimal', container: host },
    });
    const btn = host.querySelector('.hawk-trigger');
    expect(btn.querySelector('.hawk-trigger-label')).toBeNull();
    expect(btn.querySelector('.hawk-trigger-kbd')).toBeNull();
    expect(btn.getAttribute('aria-label')).toBe('Search');
    hawk.destroy();
  });

  it('compact kind renders icon + label, no kbd hint', () => {
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      trigger: { kind: 'compact', container: host },
    });
    const btn = host.querySelector('.hawk-trigger');
    expect(btn.querySelector('.hawk-trigger-label').textContent).toBe('Search');
    expect(btn.querySelector('.hawk-trigger-kbd')).toBeNull();
    hawk.destroy();
  });

  it('omits the kbd hint when hotkeys.open is disabled', () => {
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      trigger: { container: host },
      hotkeys: { open: false },
    });
    expect(host.querySelector('.hawk-trigger-kbd')).toBeNull();
    hawk.destroy();
  });

  it('clicking the built-in trigger opens the modal (picked up by the existing triggerSelector wiring)', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), trigger: { container: host } });
    host.querySelector('.hawk-trigger').click();
    expect(hawk.state.open).toBe(true);
    hawk.destroy();
  });

  it('applies the theme to the trigger button too, since it renders outside #root', () => {
    const theme = {
      name: 'custom',
      apply: vi.fn((el) => (el.dataset.hawkTheme = 'custom')),
      tokens: { '--hawk-accent': '#22d3ee' },
    };
    const hawk = new HawkSearch({ pagefind: mockPagefind(), trigger: { container: host }, theme });
    const btn = host.querySelector('.hawk-trigger');
    expect(theme.apply).toHaveBeenCalledWith(btn);
    expect(btn.dataset.hawkTheme).toBe('custom');
    expect(btn.style.getPropertyValue('--hawk-accent')).toBe('#22d3ee');
    hawk.destroy();
  });

  it('warns and renders nothing when the container selector matches nothing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      trigger: { container: '#does-not-exist' },
    });
    expect(document.querySelector('.hawk-trigger')).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('does-not-exist'));
    warn.mockRestore();
    hawk.destroy();
  });

  it('removes the trigger button on destroy()', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), trigger: { container: host } });
    expect(host.querySelector('.hawk-trigger')).toBeTruthy();
    hawk.destroy();
    expect(host.querySelector('.hawk-trigger')).toBeNull();
  });
});

describe('previewSections', () => {
  const htmlPage = (bodyInner) => `<!doctype html><html><body>${bodyInner}</body></html>`;

  async function selectFirstResult(config = {}) {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: { title: 'Theming' },
            url: '/guides/theming/',
            excerpt: 'excerpt',
            sub_results: [],
          }),
        ],
      }),
    });
    const hawk = new HawkSearch({ pagefind, ...config });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'theming';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    return hawk;
  }

  it('is off by default — a page-level match still shows the full content view', async () => {
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(
          htmlPage(
            '<main data-pagefind-body><h2 id="contract">The contract</h2><p>A theme is two things.</p></main>'
          )
        ),
    });
    const hawk = await selectFirstResult();
    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() => expect(content.innerHTML).toContain('A theme is two things'));
    expect(document.querySelector('.hawk-preview-section-row')).toBeNull();
    hawk.destroy();
  });

  it('renders one row per matching heading, with title and a plain-text excerpt', async () => {
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(
          htmlPage(`
            <main data-pagefind-body>
              <h2 id="contract">The contract</h2>
              <p>A theme is <strong>two</strong> things: a CSS file and a plugin object.</p>
              <h2 id="tokens">Token list</h2>
              <p>hawk.css reads every color through a token.</p>
            </main>
          `)
        ),
    });
    const hawk = await selectFirstResult({ previewSections: true });
    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() =>
      expect(content.querySelectorAll('.hawk-preview-section-row')).toHaveLength(2)
    );

    const rows = content.querySelectorAll('.hawk-preview-section-row');
    expect(rows[0].querySelector('.hawk-preview-section-title').textContent).toBe('The contract');
    expect(rows[0].querySelector('.hawk-preview-section-excerpt').textContent).toBe(
      'A theme is two things: a CSS file and a plugin object.'
    );
    expect(rows[0].getAttribute('href')).toBe('/guides/theming/#contract');
    expect(rows[1].querySelector('.hawk-preview-section-title').textContent).toBe('Token list');
    hawk.destroy();
  });

  it('routes structured section rows through the content animation driver', async () => {
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(
          htmlPage(
            '<main data-pagefind-body><h2 id="contract">The contract</h2><p>Body text.</p></main>'
          )
        ),
    });
    const typeContent = vi.fn((el, html) => {
      el.innerHTML = html;
      return null;
    });
    const animation = {
      typeTitle(el, text) {
        el.textContent = text;
        return null;
      },
      typeContent,
      rotatePlaceholder() {
        return null;
      },
      stop() {},
    };
    const hawk = await selectFirstResult({ previewSections: true, animation });
    await vi.waitFor(() => expect(typeContent).toHaveBeenCalled());
    expect(typeContent.mock.calls[0][1]).toContain('hawk-preview-section-row');
    hawk.destroy();
  });

  it('truncates a long excerpt to previewSectionExcerptLength with an ellipsis', async () => {
    const longText = 'word '.repeat(60).trim();
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(
          htmlPage(`<main data-pagefind-body><h2 id="a">A</h2><p>${longText}</p></main>`)
        ),
    });
    const hawk = await selectFirstResult({
      previewSections: true,
      previewSectionExcerptLength: 20,
    });
    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() => expect(content.querySelector('.hawk-preview-section-row')).toBeTruthy());
    const excerpt = content.querySelector('.hawk-preview-section-excerpt').textContent;
    expect(excerpt.length).toBeLessThanOrEqual(21); // 20 chars + the ellipsis character
    expect(excerpt.endsWith('…')).toBe(true);
    hawk.destroy();
  });

  it('falls back to the full content view when the page has no matching headings', async () => {
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(
          htmlPage('<main data-pagefind-body><p>No headings on this page at all.</p></main>')
        ),
    });
    const hawk = await selectFirstResult({ previewSections: true });
    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() =>
      expect(content.textContent).toContain('No headings on this page at all.')
    );
    expect(document.querySelector('.hawk-preview-section-row')).toBeNull();
    hawk.destroy();
  });

  it('respects a custom previewSectionSelector', async () => {
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(
          htmlPage(
            '<main data-pagefind-body><h2 id="skip">Skip me</h2><p>x</p><h4 id="keep">Keep me</h4><p>y</p></main>'
          )
        ),
    });
    const hawk = await selectFirstResult({ previewSections: true, previewSectionSelector: 'h4' });
    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() =>
      expect(content.querySelectorAll('.hawk-preview-section-row')).toHaveLength(1)
    );
    expect(content.querySelector('.hawk-preview-section-title').textContent).toBe('Keep me');
    hawk.destroy();
  });

  it('clicking a section row reports through onSelect with an anchor-shaped match', async () => {
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(
          htmlPage(
            '<main data-pagefind-body><h2 id="contract">The contract</h2><p>Body text.</p></main>'
          )
        ),
    });
    const onSelect = vi.fn();
    const hawk = await selectFirstResult({ previewSections: true, onSelect });
    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() => expect(content.querySelector('.hawk-preview-section-row')).toBeTruthy());

    content.querySelector('.hawk-preview-section-row').click();
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'The contract',
        url: '/guides/theming/#contract',
        isAnchor: true,
      })
    );
    hawk.destroy();
  });

  it('does not affect an anchor/sub_result match — that still shows its one section in full', async () => {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({
            meta: { title: 'Theming' },
            url: '/guides/theming/',
            excerpt: 'excerpt',
            sub_results: [
              { title: 'Token list', url: '/guides/theming/#tokens', excerpt: 'sub excerpt' },
            ],
          }),
        ],
      }),
    });
    fetch.mockResolvedValue({
      text: () =>
        Promise.resolve(
          htmlPage(`
            <main data-pagefind-body>
              <h2 id="contract">The contract</h2><p>x</p>
              <h2 id="tokens">Token list</h2><p>hawk.css reads every color through a token.</p>
            </main>
          `)
        ),
    });
    const hawk = new HawkSearch({ pagefind, previewSections: true });
    hawk.open();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'theming';
    input.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Row 1 is the "Token list" sub_result (row 0 is the page itself).
    document
      .querySelectorAll('.hawk-result-item')[1]
      .dispatchEvent(new Event('mouseenter', { bubbles: true }));
    const content = document.querySelector('.hawk-preview-content');
    await vi.waitFor(() =>
      expect(content.innerHTML).toContain('hawk.css reads every color through a token.')
    );
    expect(document.querySelector('.hawk-preview-section-row')).toBeNull();
    hawk.destroy();
  });
});

describe('tab accentColor', () => {
  it('writes --hawk-tab-accent inline on a tab with accentColor, and omits the style attribute for one without', async () => {
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      tabs: [
        { id: 'guides', label: 'Guides', accentColor: '#22d3ee' },
        { id: 'reference', label: 'Reference' },
      ],
    });
    const guides = document.querySelector('[data-filter="guides"]');
    const reference = document.querySelector('[data-filter="reference"]');
    expect(guides.getAttribute('style')).toContain('--hawk-tab-accent: #22d3ee');
    expect(reference.hasAttribute('style')).toBe(false);
    hawk.destroy();
  });

  it('escapes a stray double-quote in accentColor so it cannot break out of the style attribute', async () => {
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      tabs: [
        { id: 'x', label: 'X', accentColor: 'red" onmouseover="window.__hawkAccentProbe = true' },
      ],
    });
    const pill = document.querySelector('[data-filter="x"]');
    // The real security property: the quote never breaks out of the style attribute to create a
    // second, live one. getAttribute('style') returns the *decoded* value (jsdom, like a real
    // browser, turns the &quot; the escape produced back into a literal " on parse) — a raw
    // string still containing the payload text here is expected and fine, since it never became
    // markup.
    expect(pill.getAttribute('onmouseover')).toBeNull();
    expect(pill.outerHTML).toContain('&quot;');
    hawk.destroy();
  });
});

describe('staggered results reveal', () => {
  it('defaults to direction "up", writing --hawk-results-stagger and a per-row --hawk-row-index', async () => {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: [
          resultFor({ meta: { title: 'One' }, url: '/one/', excerpt: 'x', sub_results: [] }),
        ],
      }),
    });
    const hawk = new HawkSearch({ pagefind });
    const root = document.querySelector('.hawk-modal');
    expect(root.dataset.hawkResultsReveal).toBe('up');
    expect(root.style.getPropertyValue('--hawk-results-stagger')).toBe('22ms');

    hawk.open();
    document.querySelector('.hawk-modal-input').value = 'x';
    document.querySelector('.hawk-modal-input').dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    const row = document.querySelector('.hawk-result-item');
    expect(row.getAttribute('style')).toContain('--hawk-row-index: 0');
    hawk.destroy();
  });

  it('caps --hawk-row-index at 10 so a long result list has a bounded stagger tail', async () => {
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({
        results: Array.from({ length: 15 }, (_, i) =>
          resultFor({ meta: { title: `Page ${i}` }, url: `/p${i}/`, excerpt: 'x', sub_results: [] })
        ),
      }),
    });
    const hawk = new HawkSearch({ pagefind, maxResults: 15 });
    hawk.open();
    document.querySelector('.hawk-modal-input').value = 'x';
    document.querySelector('.hawk-modal-input').dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));
    const rows = document.querySelectorAll('.hawk-result-item');
    expect(rows[9].getAttribute('style')).toContain('--hawk-row-index: 9'); // the 10th row, still uncapped
    expect(rows[10].getAttribute('style')).toContain('--hawk-row-index: 10'); // the 11th row, cap kicks in
    expect(rows[14].getAttribute('style')).toContain('--hawk-row-index: 10');
    hawk.destroy();
  });

  it('resultsRevealDirection and resultsReveal: false are configurable', () => {
    const hawkRight = new HawkSearch({
      pagefind: mockPagefind(),
      id: 'hawk-right',
      resultsRevealDirection: 'right',
    });
    expect(document.getElementById('hawk-right').dataset.hawkResultsReveal).toBe('right');
    hawkRight.destroy();

    const hawkOff = new HawkSearch({
      pagefind: mockPagefind(),
      id: 'hawk-off',
      resultsReveal: false,
    });
    expect(document.getElementById('hawk-off').dataset.hawkResultsReveal).toBeUndefined();
    hawkOff.destroy();
  });
});

describe('modal reveal animation', () => {
  it('defaults to scale-fade, writing --hawk-reveal-duration from the built-in duration table', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    const root = document.querySelector('.hawk-modal');
    expect(root.dataset.hawkReveal).toBe('scale-fade');
    expect(root.style.getPropertyValue('--hawk-reveal-duration')).toBe('200ms');
    hawk.destroy();
  });

  it('open() enters the opening state and clears it after revealDuration', () => {
    vi.useFakeTimers();
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    const root = document.querySelector('.hawk-modal');

    hawk.open();
    expect(root.hidden).toBe(false);
    expect(root.dataset.hawkAnimState).toBe('opening');

    vi.advanceTimersByTime(199);
    expect(root.dataset.hawkAnimState).toBe('opening');
    vi.advanceTimersByTime(1);
    expect(root.dataset.hawkAnimState).toBeUndefined();

    vi.useRealTimers();
    hawk.destroy();
  });

  it('close() keeps the modal visible through the exit reveal, then hides it after revealDuration', () => {
    vi.useFakeTimers();
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    const root = document.querySelector('.hawk-modal');
    hawk.open();
    vi.advanceTimersByTime(200); // let the opening state fully clear first

    hawk.close();
    expect(root.hidden).toBe(false);
    expect(root.dataset.hawkAnimState).toBe('closing');

    vi.advanceTimersByTime(199);
    expect(root.hidden).toBe(false);
    vi.advanceTimersByTime(1);
    expect(root.hidden).toBe(true);
    expect(root.dataset.hawkAnimState).toBeUndefined();

    vi.useRealTimers();
    hawk.destroy();
  });

  it('re-opening while a close is still animating cancels the pending hide instead of racing it', () => {
    vi.useFakeTimers();
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    const root = document.querySelector('.hawk-modal');
    hawk.open();
    vi.advanceTimersByTime(200);
    hawk.close();
    vi.advanceTimersByTime(100); // partway through the exit reveal, still visible

    hawk.open();
    expect(root.hidden).toBe(false);
    expect(root.dataset.hawkAnimState).toBe('opening');
    vi.advanceTimersByTime(200);
    expect(root.hidden).toBe(false); // the cancelled close() timer never fired

    vi.useRealTimers();
    hawk.destroy();
  });

  it('applies configurable backdrop scrim tokens to the mounted modal', () => {
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      backdrop: {
        color: 'rgba(10, 10, 15, 0.6)',
        gradient: 'radial-gradient(circle at 50% 0%, red, blue)',
        opacity: 0.8,
        blur: '18px',
      },
    });
    const root = document.querySelector('.hawk-modal');
    expect(root.style.getPropertyValue('--hawk-backdrop')).toBe('rgba(10, 10, 15, 0.6)');
    expect(root.style.getPropertyValue('--hawk-backdrop-gradient')).toContain('radial-gradient');
    expect(root.style.getPropertyValue('--hawk-backdrop-opacity')).toBe('0.8');
    expect(root.style.getPropertyValue('--hawk-backdrop-blur')).toBe('18px');
    hawk.destroy();
  });

  it('revealAnimation: false keeps open()/close() instant, with no [data-hawk-reveal]/[data-hawk-anim-state] attributes', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), revealAnimation: false });
    const root = document.querySelector('.hawk-modal');
    expect(root.dataset.hawkReveal).toBeUndefined();

    hawk.open();
    expect(root.hidden).toBe(false);
    expect(root.dataset.hawkAnimState).toBeUndefined();

    hawk.close();
    expect(root.hidden).toBe(true);
    hawk.destroy();
  });

  it('prefers-reduced-motion makes open()/close() instant even with a revealAnimation configured', () => {
    // Also covers #applyParams' own matchMedia() call (breakpoint tracking) — same mocked
    // function, a different query string — so the return value needs a real-enough
    // MediaQueryList shape (addEventListener/removeEventListener), not just `matches`.
    vi.stubGlobal(
      'matchMedia',
      vi
        .fn()
        .mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    );
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    const root = document.querySelector('.hawk-modal');

    hawk.open();
    expect(root.hidden).toBe(false);
    expect(root.dataset.hawkAnimState).toBeUndefined();

    hawk.close();
    expect(root.hidden).toBe(true);
    hawk.destroy();
  });

  it('a custom revealAnimation name is accepted verbatim and defaults revealDuration to 220ms', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), revealAnimation: 'my-custom-reveal' });
    const root = document.querySelector('.hawk-modal');
    expect(root.dataset.hawkReveal).toBe('my-custom-reveal');
    expect(root.style.getPropertyValue('--hawk-reveal-duration')).toBe('220ms');
    hawk.destroy();
  });

  it('config.revealDuration overrides the built-in per-name default', () => {
    vi.useFakeTimers();
    const hawk = new HawkSearch({
      pagefind: mockPagefind(),
      revealAnimation: 'fade',
      revealDuration: 500,
    });
    const root = document.querySelector('.hawk-modal');
    expect(root.style.getPropertyValue('--hawk-reveal-duration')).toBe('500ms');

    hawk.open();
    vi.advanceTimersByTime(499);
    expect(root.dataset.hawkAnimState).toBe('opening');
    vi.advanceTimersByTime(1);
    expect(root.dataset.hawkAnimState).toBeUndefined();

    vi.useRealTimers();
    hawk.destroy();
  });

  it('clears the pending reveal timer on destroy without throwing', () => {
    vi.useFakeTimers();
    const hawk = new HawkSearch({ pagefind: mockPagefind() });
    hawk.open();
    expect(() => hawk.destroy()).not.toThrow();
    expect(() => vi.advanceTimersByTime(1000)).not.toThrow();
    vi.useRealTimers();
  });
});
