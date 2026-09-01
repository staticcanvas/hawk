/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { HawkSearch } from '../src/hawk.js';
import { createHawkMetrics } from '../src/hawk-metrics.js';

/**
 * Builds a mock Pagefind module compatible with the subset of the API hawk.js calls.
 * @param {object} [overrides]
 * @returns {object}
 */
function mockPagefind(overrides = {}) {
  return {
    options: vi.fn().mockResolvedValue(undefined),
    filters: vi.fn().mockResolvedValue({}),
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
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('no network in tests')));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('createHawkMetrics', () => {
  it('throws for anything that is not a HawkSearch-shaped instance', () => {
    expect(() => createHawkMetrics({})).toThrow(/requires a HawkSearch instance/);
  });

  it('counts opens/closes and accumulates totalOpenMs', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), animation: false });
    let t = 1000;
    const metrics = createHawkMetrics(hawk, { now: () => t });

    hawk.open();
    t += 500;
    hawk.close();

    const snap = metrics.snapshot();
    expect(snap.opens).toBe(1);
    expect(snap.closes).toBe(1);
    expect(snap.totalOpenMs).toBe(500);
    hawk.destroy();
  });

  it('counts selects via the wrapped onSelect, preserving the caller-supplied callback', () => {
    const onSelect = vi.fn();
    const hawk = new HawkSearch({ pagefind: mockPagefind(), animation: false, onSelect });
    const metrics = createHawkMetrics(hawk);

    hawk.onSelect({ title: 'x', url: '/x' });
    hawk.onSelect({ title: 'y', url: '/y' });

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(metrics.snapshot().selects).toBe(2);
    hawk.destroy();
  });

  it('tracks a settled non-empty query: queries, matches, zeroResultQueries, latency', async () => {
    vi.useFakeTimers();
    const pagefind = mockPagefind({
      debouncedSearch: vi
        .fn()
        .mockResolvedValueOnce({ results: [resultFor({ meta: { title: 'Guides' }, url: '/guides/', excerpt: '...' })] })
        .mockResolvedValueOnce({ results: [] }),
    });
    let t = 0;
    const hawk = new HawkSearch({ pagefind, animation: false });
    const metrics = createHawkMetrics(hawk, { pollIntervalMs: 50, now: () => t });

    hawk.open();
    const input = document.querySelector('.hawk-modal-input');

    input.value = 'guides';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(0);
    t += 60;
    await vi.advanceTimersByTimeAsync(60); // poll tick sees the settled 1-match result

    let snap = metrics.snapshot();
    expect(snap.queries).toBe(1);
    expect(snap.zeroResultQueries).toBe(0);
    expect(snap.averageMatches).toBe(1);
    expect(snap.lastQueryLatencyMs).toBeGreaterThanOrEqual(0);

    input.value = 'zzz-no-match';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(0);
    t += 60;
    await vi.advanceTimersByTimeAsync(60);

    snap = metrics.snapshot();
    expect(snap.queries).toBe(2);
    expect(snap.zeroResultQueries).toBe(1);
    expect(snap.zeroResultRate).toBe(0.5);

    hawk.destroy();
  });

  it('counts a tab switch, attributed to the newly-active tab id', async () => {
    vi.useFakeTimers();
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({
      pagefind,
      animation: false,
      tabs: [
        { id: 'all', label: 'All' },
        { id: 'guides', label: 'Guides', filter: { category: 'Guides' } },
      ],
    });
    const metrics = createHawkMetrics(hawk, { pollIntervalMs: 50 });
    hawk.open();
    await vi.advanceTimersByTimeAsync(0);

    document.querySelector('.hawk-filter-pill[data-filter="guides"]').click();
    await vi.advanceTimersByTimeAsync(60);

    const snap = metrics.snapshot();
    expect(snap.tabSwitches).toBe(1);
    expect(snap.perTab).toEqual({ guides: 1 });
    hawk.destroy();
  });

  it('reset() clears counters without needing a fresh instance', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), animation: false });
    const metrics = createHawkMetrics(hawk);
    hawk.open();
    hawk.close();
    expect(metrics.snapshot().opens).toBe(1);

    metrics.reset();
    expect(metrics.snapshot().opens).toBe(0);
    hawk.destroy();
  });

  it('dispose restores the original open/close/onSelect', () => {
    const onSelect = vi.fn();
    const hawk = new HawkSearch({ pagefind: mockPagefind(), animation: false, onSelect });
    const metrics = createHawkMetrics(hawk);
    metrics.dispose();

    hawk.open();
    hawk.onSelect({ title: 'x', url: '/x' });
    expect(metrics.snapshot().opens).toBe(0);
    expect(onSelect).toHaveBeenCalledWith({ title: 'x', url: '/x' });
    hawk.destroy();
  });
});
