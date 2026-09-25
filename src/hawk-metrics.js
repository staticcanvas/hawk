/* @ts-self-types="./hawk-metrics.d.ts" */

/**
 * Optional Hawk instrumentation for development and performance checks.
 * @module @staticcanvas/hawk/metrics
 * @license MIT
 */

/** @returns {number} A monotonic timestamp when available. */
const defaultNow = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/**
 * Calculates a rounded average while avoiding division by zero.
 * @param {number} total Accumulated value.
 * @param {number} count Number of samples.
 * @returns {number} Rounded average.
 */
const average = (total, count) => (count ? Number((total / count).toFixed(2)) : 0);

/**
 * Attaches lightweight counters and timing measurements to a HawkSearch instance. The returned
 * controller is opt-in and headless — no DOM is created, so it's safe to poll `.snapshot()` from
 * a consumer's own UI (see hawk's Playground page for a working example).
 *
 * Non-invasive: it wraps `open`/`close`/`destroy`/`setParams`/`onSelect` — HawkSearch's already
 * public surface — and, while the modal is open, polls the public `state` getter to observe
 * query/result/tab/pin/error changes it has no other hook into. Poll-based counters
 * (`zeroResultQueries`, `averageQueryLatencyMs`, etc.) are therefore resolution-limited by
 * `pollIntervalMs`, not exact to the millisecond Pagefind itself resolved a query.
 *
 * @param {import('./hawk.js').HawkSearch} hawk - HawkSearch instance to measure.
 * @param {{ now?: () => number, pollIntervalMs?: number }} [options] - Optional clock/poll rate, useful for tests.
 * @returns {{ snapshot: () => object, reset: () => void, dispose: () => void }} Metrics controller.
 */
export function createHawkMetrics(hawk, options = {}) {
  if (!hawk || typeof hawk.open !== 'function' || typeof hawk.close !== 'function') {
    throw new TypeError('createHawkMetrics requires a HawkSearch instance.');
  }

  const now = typeof options.now === 'function' ? options.now : defaultNow;
  const pollIntervalMs = options.pollIntervalMs ?? 150;
  const originals = new Map();
  let disposed = false;
  let pollId = null;
  let pending = null;
  let previous = null;
  let state;

  /** Resets all counters and starts a new measurement interval. @returns {void} */
  const reset = () => {
    state = {
      startedAt: now(),
      opens: 0,
      closes: 0,
      destroys: 0,
      totalOpenMs: 0,
      lastOpenedAt: null,
      queries: 0,
      zeroResultQueries: 0,
      totalMatches: 0,
      maxMatches: 0,
      selects: 0,
      tabSwitches: 0,
      perTab: {},
      pinAdds: 0,
      pinRemoves: 0,
      errors: 0,
      queryLatencyTotal: 0,
      queryLatencySamples: 0,
      lastQueryLatencyMs: 0,
    };
  };

  /**
   * Wraps an available Hawk method while retaining its original implementation.
   * @param {string} name Method name.
   * @param {(original: Function, args: unknown[]) => unknown} handler Instrumentation callback.
   * @returns {void}
   */
  const wrap = (name, handler) => {
    const original = hawk[name];
    if (typeof original !== 'function') return;
    originals.set(name, original);
    hawk[name] = function metricsWrapper(...args) {
      return handler.call(this, original, args);
    };
  };

  const snapshotState = () => {
    const s = hawk.state;
    return {
      query: s.query,
      matchesLength: s.matches.length,
      activeTab: s.activeTab,
      pinsLength: s.pins.length,
      sawError: Boolean(s.error),
    };
  };

  /**
   * One poll tick: diffs the public `state` getter against the previous tick, updating counters
   * for whatever changed (query, settled results, tab, pins, error).
   * @returns {void}
   */
  const poll = () => {
    const current = snapshotState();

    // Independent checks (not if/else-if): a query that resolves inside a single poll interval
    // must still be counted — the baseline is recorded from *last* tick's matches count, so a
    // same-tick settle is still detected as a change below.
    if (current.query !== previous.query) {
      pending = { query: current.query, startedAt: now(), baselineMatchesLength: previous.matchesLength };
    }
    if (pending && current.matchesLength !== pending.baselineMatchesLength) {
      if (pending.query) {
        state.queries += 1;
        state.totalMatches += current.matchesLength;
        state.maxMatches = Math.max(state.maxMatches, current.matchesLength);
        if (current.matchesLength === 0) state.zeroResultQueries += 1;
        state.lastQueryLatencyMs = Number((now() - pending.startedAt).toFixed(1));
        state.queryLatencyTotal += state.lastQueryLatencyMs;
        state.queryLatencySamples += 1;
      }
      pending = null;
    }

    if (current.activeTab !== previous.activeTab) {
      state.tabSwitches += 1;
      state.perTab[current.activeTab] = (state.perTab[current.activeTab] || 0) + 1;
    }
    if (current.pinsLength !== previous.pinsLength) {
      if (current.pinsLength > previous.pinsLength) state.pinAdds += 1;
      else state.pinRemoves += 1;
    }
    if (current.sawError && !previous.sawError) {
      state.errors += 1;
    }
    previous = current;
  };

  const startPolling = () => {
    if (pollId) return;
    previous = snapshotState();
    pending = { query: previous.query, startedAt: now(), baselineMatchesLength: previous.matchesLength };
    pollId = setInterval(poll, pollIntervalMs);
  };
  const stopPolling = () => {
    clearInterval(pollId);
    pollId = null;
    pending = null;
  };

  reset();

  wrap('open', (original, args) => {
    state.opens += 1;
    state.lastOpenedAt = now();
    startPolling();
    return original.apply(hawk, args);
  });

  wrap('close', (original, args) => {
    state.closes += 1;
    if (state.lastOpenedAt !== null) {
      state.totalOpenMs += Math.max(0, now() - state.lastOpenedAt);
      state.lastOpenedAt = null;
    }
    stopPolling();
    return original.apply(hawk, args);
  });

  wrap('destroy', (original, args) => {
    state.destroys += 1;
    stopPolling();
    return original.apply(hawk, args);
  });

  const previousOnSelect = hawk.onSelect;
  originals.set('onSelect', previousOnSelect);
  hawk.onSelect = (...args) => {
    state.selects += 1;
    return previousOnSelect?.(...args);
  };

  /**
   * Returns a copy of the current counters and derived rates/timings.
   * @returns {object} Current metrics snapshot.
   */
  const snapshot = () => ({
    ...state,
    perTab: { ...state.perTab },
    elapsedMs: Math.max(0, now() - state.startedAt),
    zeroResultRate: average(state.zeroResultQueries, state.queries),
    averageMatches: average(state.totalMatches, state.queries),
    selectRate: average(state.selects, state.queries),
    averageQueryLatencyMs: average(state.queryLatencyTotal, state.queryLatencySamples),
    open: hawk.state.open,
  });

  /** Restores every wrapped Hawk method/callback and stops polling. @returns {void} */
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    stopPolling();
    for (const [name, original] of originals) hawk[name] = original;
  };

  return { snapshot, reset, dispose };
}

export default createHawkMetrics;
