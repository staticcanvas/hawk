/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HawkSearch } from '../src/hawk.js';

const instances = [];
function create(config = {}) {
  const pagefind = {
    options: vi.fn().mockResolvedValue(),
    filters: vi.fn().mockResolvedValue({}),
    search: vi.fn().mockResolvedValue({ results: [] }),
  };
  const hawk = new HawkSearch({ pagefind, ...config });
  instances.push(hawk);
  return { hawk, pagefind };
}
beforeEach(() => {
  document.body.innerHTML = '';
  localStorage.clear();
});
afterEach(() => {
  for (const hawk of instances.splice(0)) hawk.destroy();
  document.body.style.overflow = '';
  delete window.requestIdleCallback;
  delete window.cancelIdleCallback;
  delete navigator.connection;
  vi.restoreAllMocks();
});

describe('background search preload', () => {
  it('keeps existing instances lazy unless preloading is requested', async () => {
    const { pagefind } = create();
    await Promise.resolve();
    expect(pagefind.options).not.toHaveBeenCalled();
    expect(pagefind.search).not.toHaveBeenCalled();
  });

  it('warms the initial listing without opening the dialog or moving focus', async () => {
    const { hawk, pagefind } = create();
    const focused = document.activeElement;
    await expect(hawk.preload()).resolves.toBe(true);
    expect(pagefind.search).toHaveBeenCalledTimes(1);
    expect(document.getElementById(hawk.id).hidden).toBe(true);
    expect(document.activeElement).toBe(focused);
    expect(document.body.style.overflow).toBe('');
  });

  it('shares initialization when preload calls and opening overlap', async () => {
    let ready;
    const { hawk, pagefind } = create();
    pagefind.options.mockImplementation(
      () =>
        new Promise((resolve) => {
          ready = resolve;
        })
    );
    const first = hawk.preload();
    expect(hawk.preload()).toBe(first);
    hawk.open();
    await vi.waitFor(() => expect(pagefind.options).toHaveBeenCalledTimes(1));
    ready();
    await expect(first).resolves.toBe(true);
    expect(pagefind.filters).toHaveBeenCalledTimes(1);
    expect(pagefind.search).toHaveBeenCalledTimes(1);
  });

  it('waits for page load and the idle callback before starting background work', async () => {
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
    let idle;
    window.requestIdleCallback = vi.fn((callback) => {
      idle = callback;
      return 7;
    });
    const { hawk, pagefind } = create({ preload: true });
    expect(window.requestIdleCallback).not.toHaveBeenCalled();
    expect(pagefind.options).not.toHaveBeenCalled();
    window.dispatchEvent(new Event('load'));
    expect(window.requestIdleCallback).toHaveBeenCalledTimes(1);
    expect(pagefind.options).not.toHaveBeenCalled();
    idle();
    await expect(hawk.preload()).resolves.toBe(true);
    expect(pagefind.options).toHaveBeenCalledTimes(1);
  });

  it('cancels a scheduled idle preload when destroyed', async () => {
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('complete');
    window.requestIdleCallback = vi.fn(() => 8);
    window.cancelIdleCallback = vi.fn();
    const { hawk, pagefind } = create({ preload: true });
    hawk.destroy();
    expect(window.cancelIdleCallback).toHaveBeenCalledWith(8);
    await expect(hawk.preload()).resolves.toBe(false);
    expect(pagefind.options).not.toHaveBeenCalled();
  });

  it('stops pending initialization from starting tabs or searches after destruction', async () => {
    let ready;
    const { hawk, pagefind } = create();
    pagefind.options.mockImplementation(
      () =>
        new Promise((resolve) => {
          ready = resolve;
        })
    );
    const loading = hawk.preload();
    await vi.waitFor(() => expect(pagefind.options).toHaveBeenCalled());
    hawk.destroy();
    ready();
    await expect(loading).resolves.toBe(false);
    expect(pagefind.filters).not.toHaveBeenCalled();
    expect(pagefind.search).not.toHaveBeenCalled();
  });

  it('allows a user-initiated retry after speculative initialization fails', async () => {
    const { hawk, pagefind } = create();
    pagefind.options.mockRejectedValueOnce(new Error('offline'));
    await expect(hawk.preload()).resolves.toBe(false);
    hawk.open();
    await vi.waitFor(() => expect(pagefind.search).toHaveBeenCalledTimes(1));
    expect(pagefind.options).toHaveBeenCalledTimes(2);
    expect(hawk.state.error).toBeNull();
  });

  it('honors Save-Data for automatic work while allowing an explicit preload', async () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });
    window.requestIdleCallback = vi.fn();
    const { hawk, pagefind } = create({ preload: true, eagerResults: false });
    expect(window.requestIdleCallback).not.toHaveBeenCalled();
    await expect(hawk.preload()).resolves.toBe(true);
    expect(pagefind.options).toHaveBeenCalledTimes(1);
    expect(pagefind.search).not.toHaveBeenCalled();
  });
});
