/**
 * TypeFlow-backed animation integration for Hawk.
 *
 * @module @staticcanvas/hawk/animation-typeflow
 */

import type { HawkAnimationDriver } from './hawk.js';
import type { TypeFlowConfig, TypeFlowRotateConfig } from '@staticcanvas/typeflow';

/** Configuration overrides for each animated Hawk surface. */
export interface HawkAnimationTypeflowOptions {
  /** Page-title overrides; omitted fields keep the zoom-in-space, left, 2 ms baseline. */
  title?: TypeFlowConfig;
  /** Anchor-title overrides; defaults match the page-title baseline. */
  anchorTitle?: TypeFlowConfig;
  /** Preview overrides; HTML mode and the preview tag allow-list are enabled by default. */
  content?: TypeFlowConfig;
  /** Placeholder overrides; nested typeConfig/eraseConfig merge with their own defaults. */
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
