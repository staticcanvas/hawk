/**
 * TypeFlow-backed animation integration for Hawk.
 *
 * @module @staticcanvas/hawk/animation-typeflow
 */

import type { HawkAnimationDriver } from './hawk.js';
import type { TypeFlowConfig, TypeFlowRotateConfig } from '@staticcanvas/typeflow';

/** Configuration overrides for each animated Hawk surface. */
export interface HawkAnimationTypeflowOptions {
  /** TypeFlow configuration for page-title reveals. */
  title?: TypeFlowConfig;
  /** TypeFlow configuration for anchor/section-title reveals. */
  anchorTitle?: TypeFlowConfig;
  /** TypeFlow configuration for HTML-aware preview-content reveals. */
  content?: TypeFlowConfig;
  /** TypeFlow configuration for rotating search placeholders. */
  rotate?: TypeFlowRotateConfig;
}

/**
 * Creates a Hawk animation driver backed by a TypeFlow-compatible singleton.
 *
 * @param TypeFlow TypeFlow singleton exposing `type`, `rotate`, and controller stop behavior.
 * @param options Per-surface TypeFlow configuration overrides.
 * @returns A Hawk animation driver suitable for `HawkSearch` configuration or registration.
 */
export declare function createHawkAnimationTypeflow(
  TypeFlow: unknown,
  options?: HawkAnimationTypeflowOptions
): HawkAnimationDriver;

/** Ready-to-use animation driver backed by the installed TypeFlow package. */
export declare const HawkAnimationTypeflow: HawkAnimationDriver;

export default createHawkAnimationTypeflow;
