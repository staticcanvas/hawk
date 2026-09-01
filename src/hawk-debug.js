/**
 * Optional Hawk console diagnostics using StaticCanvas Logcad.
 * @module @staticcanvas/hawk/debug
 * @license MIT
 */

import logcad from '@staticcanvas/logcad';

/** @returns {number} A monotonic timestamp when available. */
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

/**
 * Attaches opt-in console diagnostics to a HawkSearch instance. Non-invasive: it wraps the
 * instance's already-public methods/properties (open, close, destroy, setParams, onOpen, onClose,
 * onSelect) rather than requiring any change to hawk.js itself. Query/result lifecycle events
 * (query changes, zero-result queries, tab switches, pin changes, errors) are observed by polling
 * the public `state` getter while the modal is open, since Pagefind's own search call is a private
 * implementation detail hawk.js doesn't expose a hook for — these events are therefore reported at
 * `pollIntervalMs` resolution, not the instant they actually happen.
 *
 * @param {import('./hawk.js').HawkSearch} hawk - HawkSearch instance to inspect.
 * @param {{ enabled?: boolean, label?: string, trace?: boolean, pollIntervalMs?: number }} [options] - Debug options.
 * @returns {{ enabled: boolean, setEnabled: (value: boolean) => void, dispose: () => void }} Debug controller.
 */
export function createHawkDebug(hawk, options = {}) {
  if (!hawk || typeof hawk.open !== 'function' || typeof hawk.close !== 'function') {
    throw new TypeError('createHawkDebug requires a HawkSearch instance.');
  }

  const label = options.label || 'Hawk';
  const trace = options.trace === true;
  const pollIntervalMs = options.pollIntervalMs ?? 150;
  const originals = new Map();
  let enabled = options.enabled !== false;
  let disposed = false;
  let pollId = null;
  let pending = null;

  /**
   * Writes one diagnostic event when debugging is enabled — through @staticcanvas/logcad if it's
   * installed and resolved, else a styled console fallback so debugging still works with no extra
   * runtime staged (see the "typeflow-debug.js" precedent for this dual-path shape).
   * @param {'info'|'warn'|'error'} level Severity level.
   * @param {string} action Event category.
   * @param {string} message Human-readable event message.
   * @param {object|null} [detail] Structured event details.
   * @returns {void}
   */
  const write = (level, action, message, detail) => {
    if (!enabled) return;

    if (typeof logcad?.logd === 'function') {
      logcad.logd(
        {
          name: label,
          color: '#04121c',
          bg: '#38bdf8',
          logname: '◆ Hawk debug',
          logcolor: '#38bdf8',
          logbg: '#04121c',
        },
        action,
        message,
        detail || null,
        trace
      );
      return;
    }

    const colors = {
      info: 'color: #38bdf8; font-weight: bold;',
      warn: 'color: #f59e0b; font-weight: bold;',
      error: 'color: #ef4444; font-weight: bold;',
    };
    const tag = `%c[${label}:${action}]`;
    if (detail) {
      console[level]?.(tag, colors[level] || colors.info, message, detail);
    } else {
      console[level]?.(tag, colors[level] || colors.info, message);
    }
    if (trace) {
      console.trace?.(`[${label}:${action}] trace`);
    }
  };

  /**
   * Wraps an available Hawk method with a diagnostic callback.
   * @param {string} name Method name.
   * @param {(original: Function, args: unknown[]) => unknown} handler Diagnostic callback.
   * @returns {void}
   */
  const wrap = (name, handler) => {
    const original = hawk[name];
    if (typeof original !== 'function') return;
    originals.set(name, original);
    hawk[name] = function debugWrapper(...args) {
      return handler.call(this, original, args);
    };
  };

  /**
   * Wraps a public callback property (onOpen/onClose/onSelect), chaining the caller's own
   * callback (if any) after logging so createHawkDebug never silently drops it.
   * @param {'onOpen'|'onClose'|'onSelect'} name Callback property name.
   * @param {(...args: unknown[]) => object|null} describe Builds the log detail from the call args.
   * @returns {void}
   */
  const wrapCallback = (name, describe) => {
    const previous = hawk[name];
    originals.set(name, previous);
    hawk[name] = (...args) => {
      write('info', name, `${name}()`, describe(...args));
      return previous?.(...args);
    };
  };

  const snapshotState = () => {
    const state = hawk.state;
    return {
      query: state.query,
      matchesLength: state.matches.length,
      activeTab: state.activeTab,
      pinsLength: state.pins.length,
      sawError: Boolean(state.error),
    };
  };

  let previous = snapshotState();

  /**
   * One poll tick: diffs the public `state` getter against the previous tick and emits a
   * diagnostic event for whatever changed (query, settled results, tab, pins, error).
   * @returns {void}
   */
  const poll = () => {
    const current = snapshotState();

    // Independent checks (not if/else-if): a query that resolves inside a single poll interval
    // must still report both events in the same tick — a query-changed baseline recorded from
    // *last* tick's matches count, so a same-tick settle is still detected as a change below.
    if (current.query !== previous.query) {
      write('info', 'query', 'query changed', { query: current.query });
      pending = { query: current.query, startedAt: now(), baselineMatchesLength: previous.matchesLength };
    }
    if (pending && current.matchesLength !== pending.baselineMatchesLength) {
      write('info', 'results', 'results updated', {
        query: current.query,
        matches: current.matchesLength,
        zeroResults: current.matchesLength === 0,
        latencyMs: Number((now() - pending.startedAt).toFixed(1)),
      });
      pending = null;
    }

    if (current.activeTab !== previous.activeTab) {
      write('info', 'tab', 'tab switched', { from: previous.activeTab, to: current.activeTab });
    }
    if (current.pinsLength !== previous.pinsLength) {
      write('info', 'pins', 'pin count changed', { count: current.pinsLength });
    }
    if (current.sawError && !previous.sawError) {
      write('error', 'error', 'pagefind error observed', { error: String(hawk.state.error) });
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

  wrap('open', (original, args) => {
    write('info', 'open', 'open()', null);
    startPolling();
    return original.apply(hawk, args);
  });
  wrap('close', (original, args) => {
    write('info', 'close', 'close()', null);
    stopPolling();
    return original.apply(hawk, args);
  });
  wrap('setParams', (original, args) => {
    write('info', 'params', 'setParams()', { params: args[0] });
    return original.apply(hawk, args);
  });
  wrap('destroy', (original, args) => {
    write('info', 'destroy', 'destroy()', null);
    stopPolling();
    return original.apply(hawk, args);
  });
  wrapCallback('onSelect', (item) => ({ title: item?.title, url: item?.url }));

  write('info', 'attach', 'debugging enabled', null);

  /**
   * Enables or disables diagnostic output.
   * @param {boolean} value Whether diagnostics should be emitted.
   * @returns {void}
   */
  const setEnabled = (value) => {
    enabled = Boolean(value);
    write('info', 'state', enabled ? 'debugging enabled' : 'debugging disabled', null);
  };

  /** Restores every wrapped Hawk method/callback and stops polling. @returns {void} */
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    stopPolling();
    for (const [name, original] of originals) hawk[name] = original;
    if (enabled) write('info', 'detach', 'debugging detached', null);
  };

  return {
    get enabled() {
      return enabled;
    },
    setEnabled,
    dispose,
  };
}

export default createHawkDebug;
