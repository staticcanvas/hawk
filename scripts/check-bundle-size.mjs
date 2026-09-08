/**
 * @fileoverview Checks the compressed production bundle against its size budget.
 * @module scripts/check-bundle-size
 */

import { gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const pkg = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
const packageName = pkg.name.split('/').pop();
const bundlePath = `dist/${packageName}/dist/${packageName}.min.js`;
// Raised 6KB -> 7KB: i18n (config.strings + English defaults), the modal focus trap, and
// search/load error handling.
// Raised 7KB -> 9KB: theming depth (font/mark/scrollbar tokens, theme.tokens), the rotating
// placeholder, result/page metadata, powered-by attribution, the pin system, inline filter
// syntax, and the built-in trigger element — all real, requested functionality
// (plan-hawk-customization-prd.md) that doesn't compress away.
// Raised 9KB -> 10KB: previewSections (section-outline previews), the 5 built-in modal reveal
// animations (config.revealAnimation), and per-tab default previews left ~115 bytes of headroom
// under 9KB — too tight for the next real feature to land without immediately re-raising this.
const maxGzipBytes = 10 * 1024;
const bundle = readFileSync(bundlePath);
const gzipBytes = gzipSync(bundle).byteLength;

console.log(`${bundlePath}: ${bundle.byteLength} bytes, ${gzipBytes} bytes gzip`);

if (gzipBytes > maxGzipBytes) {
  throw new Error(`Bundle exceeds the ${maxGzipBytes}-byte gzip budget.`);
}
