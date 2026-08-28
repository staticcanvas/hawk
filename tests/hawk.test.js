/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
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
