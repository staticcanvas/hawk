/**
 * Headless counters and timing measurements for HawkSearch.
 *
 * @module @staticcanvas/hawk/metrics
 */

import type { HawkSearch } from './hawk.js';

/** Options controlling the metrics clock and public-state polling interval. */
export interface HawkMetricsOptions {
  /** Optional clock, useful for tests. */
  now?: () => number;
  /** Poll interval (ms) for observing query/result/tab/pin/error changes via HawkSearch.state. */
  pollIntervalMs?: number;
}

/** Immutable snapshot of counters and derived measurements for the current interval. */
export interface HawkMetricsSnapshot {
  startedAt: number;
  opens: number;
  closes: number;
  destroys: number;
  totalOpenMs: number;
  queries: number;
  zeroResultQueries: number;
  totalMatches: number;
  maxMatches: number;
  selects: number;
  tabSwitches: number;
  perTab: Record<string, number>;
  pinAdds: number;
  pinRemoves: number;
  errors: number;
  lastQueryLatencyMs: number;
  elapsedMs: number;
  zeroResultRate: number;
  averageMatches: number;
  selectRate: number;
  averageQueryLatencyMs: number;
  open: boolean;
}

/** Controls an attached Hawk metrics session. */
export interface HawkMetricsController {
  /** Returns a copy of the current counters and derived rates/timings. */
  snapshot(): HawkMetricsSnapshot;
  /** Resets all counters and starts a new measurement interval. */
  reset(): void;
  /** Restores every wrapped HawkSearch method/callback and stops polling. */
  dispose(): void;
}

/**
 * Attaches lightweight counters and timing measurements to a HawkSearch instance.
 * The returned controller is opt-in, headless, and has no effect until the instance opens.
 *
 * @param hawk HawkSearch instance to measure.
 * @param options Clock and polling options.
 * @returns A controller for reading, resetting, or disposing the metrics integration.
 */
export function createHawkMetrics(hawk: HawkSearch, options?: HawkMetricsOptions): HawkMetricsController;

export default createHawkMetrics;
