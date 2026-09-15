/**
 * @vitest-environment jsdom
 *
 * Verifies createHawkDebug reaches logcad through the UMD-external interop shape too, not just
 * a same-toolchain ESM/CJS import. hawk-debug.js's own UMD build (the one the docs playground
 * actually loads) marks @staticcanvas/logcad external with `globals: { '@staticcanvas/logcad':
 * 'logcad' }` (vite.optional.config.js) — Rollup substitutes the bare global `logcad` for the
 * import with no unwrapping, but logcad's *own* UMD build assigns that global as
 * `{ default: {...} }` (the same shape a CJS require() of an ESM module gets), not the flattened
 * `{ logd, logc, logdrl }` object a same-toolchain `import logcad from` normally resolves to.
 * Confirmed live in the docs playground before this fix: `window.logcad` was `{ default: {...} }`
 * and `window.logcad.logd` was undefined, so createHawkDebug silently fell back to the plain
 * console path even with logcad staged and loaded.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// One extra level of `default` nesting versus tests/hawk-debug.test.js's mock — simulates what
// `import logcad from '@staticcanvas/logcad'` resolves to when Rollup substitutes an *unwrapped*
// external global for the import, not a real module the bundler itself parsed.
vi.mock('@staticcanvas/logcad', () => ({
  default: { default: { logd: vi.fn(), logc: vi.fn(), logdrl: vi.fn() } },
}));

import logcad from '@staticcanvas/logcad';
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
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('createHawkDebug against the UMD-external logcad interop shape', () => {
  it('still finds and calls logd(), not the console fallback', () => {
    const hawk = new HawkSearch({ pagefind: mockPagefind(), animation: false });
    createHawkDebug(hawk);
    expect(logcad.default.logd).toHaveBeenCalledWith(
      expect.any(Object),
      'attach',
      'debugging enabled',
      null,
      false
    );
    hawk.destroy();
  });
});
