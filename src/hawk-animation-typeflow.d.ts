import type { HawkAnimationDriver } from './hawk.d.ts';

export interface HawkAnimationTypeflowOptions {
  title?: Record<string, unknown>;
  anchorTitle?: Record<string, unknown>;
  content?: Record<string, unknown>;
  rotate?: Record<string, unknown>;
}

export declare function createHawkAnimationTypeflow(
  TypeFlow: unknown,
  options?: HawkAnimationTypeflowOptions
): HawkAnimationDriver;

export default createHawkAnimationTypeflow;
