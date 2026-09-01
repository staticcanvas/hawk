import type { HawkSearch } from './hawk.js';

/**
 * Hawk Debug - Optional console diagnostics using StaticCanvas Logcad.
 */
export interface HawkDebugOptions {
  enabled?: boolean;
  label?: string;
  trace?: boolean;
  /** Poll interval (ms) for observing query/result/tab/pin/error changes via HawkSearch.state. */
  pollIntervalMs?: number;
}

export interface HawkDebugController {
  readonly enabled: boolean;
  setEnabled(value: boolean): void;
  /** Restores every wrapped HawkSearch method/callback and stops polling. */
  dispose(): void;
}

/**
 * Attaches opt-in console diagnostics to a HawkSearch instance. Non-invasive: wraps the
 * instance's public methods/callbacks rather than requiring any change to hawk.js itself.
 */
export function createHawkDebug(hawk: HawkSearch, options?: HawkDebugOptions): HawkDebugController;

export default createHawkDebug;
