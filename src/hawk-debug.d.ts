/**
 * Optional Hawk console diagnostics using StaticCanvas Logcad.
 *
 * @module @staticcanvas/hawk/debug
 */

import type { HawkSearch } from './hawk.js';

/** Options controlling Hawk diagnostic logging and state polling. */
export interface HawkDebugOptions {
  /** Whether diagnostics are initially enabled. Defaults to `true`. */
  enabled?: boolean;
  /** Label included with each diagnostic event. Defaults to `Hawk`. */
  label?: string;
  /** Whether each diagnostic event also emits a stack trace. */
  trace?: boolean;
  /** Poll interval (ms) for observing query/result/tab/pin/error changes via HawkSearch.state. */
  pollIntervalMs?: number;
}

/** Controls an attached Hawk diagnostics session. */
export interface HawkDebugController {
  /** Whether the controller currently emits diagnostic events. */
  readonly enabled: boolean;
  /** Enables or disables diagnostic events without detaching the controller. */
  setEnabled(value: boolean): void;
  /** Restores every wrapped HawkSearch method/callback and stops polling. */
  dispose(): void;
}

/**
 * Attaches opt-in console diagnostics to a HawkSearch instance. Non-invasive: wraps the
 * instance's public methods/callbacks rather than requiring any change to hawk.js itself.
 *
 * @param hawk HawkSearch instance to inspect.
 * @param options Diagnostic logging and polling options.
 * @returns A controller for toggling or disposing the diagnostics integration.
 */
export function createHawkDebug(hawk: HawkSearch, options?: HawkDebugOptions): HawkDebugController;

export default createHawkDebug;
