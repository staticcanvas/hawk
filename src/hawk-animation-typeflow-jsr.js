/* @ts-self-types="./hawk-animation-typeflow-jsr.d.ts" */

import TypeFlow from 'jsr:@staticcanvas/typeflow@^0.34.1';
import { createHawkAnimationTypeflow } from './hawk-animation-typeflow-core.js';

/** Ready-to-use driver backed by the released JSR TypeFlow package. */
export const HawkAnimationTypeflow = createHawkAnimationTypeflow(TypeFlow);
export { createHawkAnimationTypeflow };

if (typeof window !== 'undefined') {
  window.HawkAnimationTypeflow = {
    ...HawkAnimationTypeflow,
    create: createHawkAnimationTypeflow,
  };
  window.Hawk?.registerAnimation?.('typeflow', HawkAnimationTypeflow);
}

export default createHawkAnimationTypeflow;
