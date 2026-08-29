/**
 * @vitest-environment jsdom
 *
 * Verifies the script-tag self-registration path: hawk-theme-typeflow.js / hawk-animation-typeflow.js
 * register themselves against window.Hawk once it exists, matching the documented load order
 * (hawk.js, [typeflow.js,] then these files) — see architecture/plugin-system.md.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { HawkSearch } from '../src/hawk.js';
// Importing hawk.js above already set window.Hawk = HawkSearch as a side effect; this import
// runs right after, so its own self-registration sees window.Hawk already present.
import { HawkThemeTypeflow } from '../src/hawk-theme-typeflow.js';

describe('typeflow theme/animation self-registration', () => {
  afterEach(() => {
    delete window.TypeFlow;
  });

  it('hawk-theme-typeflow self-registers once window.Hawk exists', () => {
    expect(HawkSearch.themes.get('typeflow')).toBe(HawkThemeTypeflow);
  });

  it('a plain HawkSearch instance defaults to the typeflow theme with no explicit registerTheme call', () => {
    const hawk = new HawkSearch({ pagefind: { options: vi.fn(), filters: vi.fn(), search: vi.fn(), debouncedSearch: vi.fn() } });
    const root = document.getElementById(hawk.id);
    expect(root.dataset.hawkTheme).toBe('typeflow');
    hawk.destroy();
  });

  it('hawk-animation-typeflow self-registers only once window.TypeFlow is already present', async () => {
    window.TypeFlow = { type: vi.fn(), rotate: vi.fn() };
    await import('../src/hawk-animation-typeflow.js');
    expect(HawkSearch.animations.has('typeflow')).toBe(true);
  });
});
