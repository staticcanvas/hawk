/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('@staticcanvas/logcad', () => ({
  default: { logd: vi.fn(), logc: vi.fn(), logdrl: vi.fn() },
}));

import logcad from '@staticcanvas/logcad';
import { HawkSearch } from '../src/hawk.js';
import { createHawkDebug } from '../src/hawk-debug.js';

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

/** Extracts every action string logd was called with, in call order. */
function loggedActions() {
  return logcad.logd.mock.calls.map((call) => call[1]);
}

beforeEach(() => {
  document.body.innerHTML = '';
  logcad.logd.mockClear();
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('no network in tests')));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('createHawkDebug', () => {
  it('throws for anything that is not a HawkSearch-shaped instance', () => {
    expect(() => createHawkDebug({})).toThrow(/requires a HawkSearch instance/);
    expect(() => createHawkDebug(null)).toThrow(/requires a HawkSearch instance/);
  });

  it('logs an attach event via logcad on creation', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), animation: false });
    createHawkDebug(hawk);
    expect(loggedActions()).toContain('attach');
    hawk.destroy();
  });

  it('wraps open/close without changing their behavior, logging both', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), animation: false });
    createHawkDebug(hawk);
    logcad.logd.mockClear();

    hawk.open();
    expect(document.getElementById(hawk.id).hidden).toBe(false);
    expect(loggedActions()).toContain('open');

    hawk.close();
    expect(loggedActions()).toContain('close');
    hawk.destroy();
  });

  it('wraps onSelect, still calling the caller-supplied callback', () => {
    const onSelect = vi.fn();
    const hawk = new HawkSearch({ pagefind: mockPagefind(), animation: false, onSelect });
    createHawkDebug(hawk);
    logcad.logd.mockClear();

    hawk.onSelect({ title: 'Guide', url: '/guide/' });
    expect(onSelect).toHaveBeenCalledWith({ title: 'Guide', url: '/guide/' });
    expect(loggedActions()).toContain('onSelect');
    hawk.destroy();
  });

  it('setEnabled(false) suppresses further logging without removing the wrapper', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), animation: false });
    const debug = createHawkDebug(hawk);
    debug.setEnabled(false);
    expect(debug.enabled).toBe(false);
    logcad.logd.mockClear();

    hawk.open();
    expect(logcad.logd).not.toHaveBeenCalled();
    expect(document.getElementById(hawk.id).hidden).toBe(false); // original still ran
    hawk.destroy();
  });

  it('dispose restores the original open/close/onSelect, logging stops', () => {
    const onSelect = vi.fn();
    const hawk = new HawkSearch({ pagefind: mockPagefind(), animation: false, onSelect });
    const debug = createHawkDebug(hawk);
    debug.dispose();
    logcad.logd.mockClear();

    hawk.open();
    hawk.onSelect({ title: 'x', url: '/x' });
    expect(logcad.logd).not.toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith({ title: 'x', url: '/x' });
    hawk.destroy();
  });

  it('logs query-changed then results-updated within one poll interval of a settled query', async () => {
    vi.useFakeTimers();
    const pagefind = mockPagefind({
      debouncedSearch: vi.fn().mockResolvedValue({ results: [resultFor({ meta: { title: 'Guides' }, url: '/guides/', excerpt: '...' })] }),
    });
    const hawk = new HawkSearch({ pagefind, animation: false });
    createHawkDebug(hawk, { pollIntervalMs: 50 });
    logcad.logd.mockClear();

    hawk.open();
    const input = document.querySelector('.hawk-modal-input');
    input.value = 'guides';
    input.dispatchEvent(new Event('input'));
    await vi.advanceTimersByTimeAsync(0); // let the mocked debouncedSearch promise settle
    expect(hawk.state.matches).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(60); // one poll tick
    const actions = loggedActions();
    expect(actions).toContain('query');
    expect(actions).toContain('results');
    const resultsCall = logcad.logd.mock.calls.find((call) => call[1] === 'results');
    expect(resultsCall[3]).toMatchObject({ query: 'guides', matches: 1, zeroResults: false });

    hawk.destroy();
  });

  it('stops polling on close, so no further results/query events are logged while closed', async () => {
    vi.useFakeTimers();
    const pagefind = mockPagefind();
    const hawk = new HawkSearch({ pagefind, animation: false });
    createHawkDebug(hawk, { pollIntervalMs: 50 });
    hawk.open();
    hawk.close();
    logcad.logd.mockClear();

    await vi.advanceTimersByTimeAsync(500);
    expect(loggedActions()).not.toContain('query');
    expect(loggedActions()).not.toContain('results');
    hawk.destroy();
  });
});
