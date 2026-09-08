/**
 * @vitest-environment jsdom
 *
 * Verifies createHawkDebug's console fallback: when @staticcanvas/logcad resolves to something
 * without a usable logd() (not installed, or a stub), debug output still reaches the console
 * instead of silently no-op'ing — the one deliberate deviation from lume-debug.js's shape
 * documented in src/hawk-debug.js.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('@staticcanvas/logcad', () => ({ default: {} }));

import { HawkSearch } from '../src/hawk.js';
import { createHawkDebug } from '../src/hawk-debug.js';

function mockPagefind(overrides = {}) {
  return {
    options: vi.fn().mockResolvedValue(undefined),
    filters: vi.fn().mockResolvedValue({}),
    search: vi.fn().mockResolvedValue({ results: [] }),
    debouncedSearch: vi.fn().mockResolvedValue({ results: [] }),
    ...overrides,
  };
}

beforeEach(() => {
  document.body.innerHTML = '';
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('no network in tests')));
  vi.spyOn(console, 'info').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('createHawkDebug console fallback', () => {
  it('logs to console.info when logcad has no logd()', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), animation: false });
    createHawkDebug(hawk);
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining('[Hawk:attach]'), expect.any(String), expect.any(String));
    hawk.destroy();
  });
});
