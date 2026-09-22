/**
 * @fileoverview Mounts hawk's own search modal against this docs site itself — see
 * docs/content/_index.md's handcrafted comment block: "there's no separate demo page, because
 * dogfooding it here is the demo." Registers the `typeflow` theme/animation pair and builds the
 * production search config through the shared docs adapter (hawk-docs-adapter.mjs).
 *
 * Site-structure data that only Hugo can compute (category list, per-category landing pages, and
 * baseURL-correct exclude paths) can't live in this static file — baseof.html injects it as
 * `window.__HAWK_DOCS_SEARCH_DATA__` in a small inline `<script>` immediately before this module
 * is loaded. See that template for exactly how `categories`/`categoryDefaults` are derived.
 * @module site-search
 */

import { HawkSearch } from '../../webutil/libs/hawk.mjs';
import { HawkThemeTypeflow } from '../../webutil/libs/hawk-theme-typeflow.mjs';
import { HawkAnimationTypeflow } from '../../webutil/libs/hawk-animation-typeflow.mjs';
import { createHawkDocsSearchConfig } from '../hawk-docs-adapter.mjs';

HawkSearch.registerTheme('typeflow', HawkThemeTypeflow);
HawkSearch.registerAnimation('typeflow', HawkAnimationTypeflow);

/**
 * One color per category tab, so the filter row itself hints at "which tab" before you even read
 * the label. A working example of `HawkTab.accentColor`, documented in api.md's Tabs section.
 * @type {Record<string, string>}
 */
const accentColors = {
  Guides: '#20e3b2',
  Reference: '#0cebeb',
  Resources: '#7ee8c6',
  Tools: '#29ffc6',
};

const { categories, categoryDefaults, excludePages } = window.__HAWK_DOCS_SEARCH_DATA__;

new HawkSearch(
  createHawkDocsSearchConfig({
    index: document.body.dataset.hawkIndex,
    excludePages,
    categories,
    categoryDefaults,
    accentColors,
  })
);
