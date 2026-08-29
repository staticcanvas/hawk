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
// placeholder, result/page metadata, powered-by attribution, and the pin system — all real,
// requested functionality (plan-hawk-customization-prd.md) that doesn't compress away. 9KB
// leaves headroom above the current ~7.6KB build for the two phases still to land (inline
// filter syntax, an optional built-in trigger element).
const maxGzipBytes = 9 * 1024;
const bundle = readFileSync(bundlePath);
const gzipBytes = gzipSync(bundle).byteLength;

console.log(`${bundlePath}: ${bundle.byteLength} bytes, ${gzipBytes} bytes gzip`);

if (gzipBytes > maxGzipBytes) {
  throw new Error(`Bundle exceeds the ${maxGzipBytes}-byte gzip budget.`);
}
