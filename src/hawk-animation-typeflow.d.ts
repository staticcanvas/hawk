import type { HawkAnimationDriver } from './hawk.d.ts';
import type { TypeFlowConfig, TypeFlowRotateConfig } from '@staticcanvas/typeflow';

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

export declare function createHawkAnimationTypeflow(
  TypeFlow: unknown,
  options?: HawkAnimationTypeflowOptions
): HawkAnimationDriver;

export declare const HawkAnimationTypeflow: HawkAnimationDriver;

export default createHawkAnimationTypeflow;
