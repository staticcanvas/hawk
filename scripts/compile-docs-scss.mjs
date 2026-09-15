/**
 * @fileoverview Compiles the docs site's SCSS sources (docs/static/assets/scss/*.scss) into the
 * plain CSS files every Hugo template actually `<link>`s (docs/static/assets/docs.css and
 * .../playground.css) — the same "generated file committed to git, regenerated on build, verified
 * clean" pattern scripts/generate-theme-css.mjs already established for per-theme CSS.
 *
 * The .scss sources are themselves plain CSS split into scoped partials (see
 * docs/static/assets/scss/docs.scss's own header for the split rationale and why partial order is
 * load-bearing) — this script doesn't rely on any Sass-specific language feature beyond `@use` for
 * combining them, so its only real job is "concatenate these partials into one file, minus the
 * `@use` lines Sass consumes." Using the real `sass` compiler (rather than hand-rolled
 * concatenation) still buys real value for free: syntax validation of every partial, and it's
 * already the standard tool a "switch to .scss" ask implies — a future partial that *does* want
 * real Sass features (nesting, a shared variable) works immediately with zero extra wiring.
 * @module scripts/compile-docs-scss
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as sass from 'sass';

/** @type {Array<{name: string, entry: string, out: string}>} One compile target per output file. */
const TARGETS = [
  {
    name: 'docs.css',
    entry: resolve('docs/static/assets/scss/docs.scss'),
    out: resolve('docs/static/assets/docs.css'),
  },
  {
    name: 'playground.css',
    entry: resolve('docs/static/assets/scss/playground.scss'),
    out: resolve('docs/static/assets/playground.css'),
  },
];

for (const target of TARGETS) {
  const result = sass.compile(target.entry, { style: 'expanded', sourceMap: false });
  writeFileSync(target.out, result.css, 'utf8');
  console.log(`Compiled ${target.name} (${(result.css.length / 1024).toFixed(1)}KB)`);
}
