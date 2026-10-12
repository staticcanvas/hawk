/* @ts-self-types="./hawk-debug.d.ts" */

/**
 * JSR-native Hawk console diagnostics using StaticCanvas Logcad.
 * @module @staticcanvas/hawk/debug
 * @license MIT
 */

import logcad from 'jsr:@staticcanvas/logcad@^0.6.0';
import { createHawkDebugWithLogcad } from './hawk-debug-core.js';

/**
 * Attaches opt-in console diagnostics to a HawkSearch instance.
 * @param {import('./hawk.js').HawkSearch} hawk - HawkSearch instance to inspect.
 * @param {{ enabled?: boolean, label?: string, trace?: boolean, pollIntervalMs?: number }} [options] - Debug options.
 * @returns {{ enabled: boolean, setEnabled: (value: boolean) => void, dispose: () => void }} Debug controller.
 */
export function createHawkDebug(hawk, options = {}) {
  return createHawkDebugWithLogcad(logcad, hawk, options);
}

export default createHawkDebug;
