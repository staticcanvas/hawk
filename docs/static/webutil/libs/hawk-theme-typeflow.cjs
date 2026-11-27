/*! hawk-theme-typeflow | MIT */
!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?o(exports):"function"==typeof define&&define.amd?define(["exports"],o):o((e="undefined"!=typeof globalThis?globalThis:e||self).HawkThemeTypeflow={})}(this,function(e){"use strict";var o,t;const l={
/** @type {string} Stable registration name used by Hawk's theme registry. */
name:"typeflow",
/**
     * Selects TypeFlow styles through the root data attribute; CSS is loaded separately.
     * @param {HTMLElement} rootEl Hawk root element receiving the theme attribute.
     * @returns {void}
     */
apply(e){e.dataset.hawkTheme="typeflow"}};"undefined"!=typeof window&&(window.HawkThemeTypeflow=l,null==(t=null==(o=window.Hawk)?void 0:o.registerTheme)||t.call(o,"typeflow",l)),e.HawkThemeTypeflow=l,e.default=l,Object.defineProperties(e,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
//# sourceMappingURL=hawk-theme-typeflow.cjs.map
