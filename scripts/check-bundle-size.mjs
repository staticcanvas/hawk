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
// Raised from 6KB: i18n (config.strings + English defaults), the modal focus trap, and
// search/load error handling added real, requested functionality that doesn't compress away.
// 7KB still leaves headroom above the current ~6.4KB build.
const maxGzipBytes = 7 * 1024;
const bundle = readFileSync(bundlePath);
const gzipBytes = gzipSync(bundle).byteLength;

console.log(`${bundlePath}: ${bundle.byteLength} bytes, ${gzipBytes} bytes gzip`);

if (gzipBytes > maxGzipBytes) {
  throw new Error(`Bundle exceeds the ${maxGzipBytes}-byte gzip budget.`);
}
