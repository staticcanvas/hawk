/**
 * @fileoverview Compares Hawk's production bundle against published tooltip libraries.
 * @module scripts/compare-bundle-size
 *
 * Queries bundlephobia's public API for each competitor's published gzip size and prints a
 * markdown table alongside Hawk's own local build. Run by hand when a competitor ships a major
 * version or before a Hawk release that changes bundle size — not wired into CI.
 *
 * Usage: node scripts/compare-bundle-size.mjs
 */

import { gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BUNDLEPHOBIA_API = 'https://bundlephobia.com/api/size';

const COMPETITORS = [
  { label: 'Floating UI', package: '@floating-ui/dom' },
  { label: 'Tippy.js', package: 'tippy.js' },
  { label: 'React Tooltip', package: 'react-tooltip' },
  { label: 'Radix Tooltip', package: '@radix-ui/react-tooltip' },
];

/**
 * Reads the local production bundle and returns its gzip size in bytes.
 * @returns {{name: string, gzip: number}}
 */
function readLocalHawkSize() {
  const pkg = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
  const packageName = pkg.name.split('/').pop();
  const bundlePath = `dist/${packageName}/dist/${packageName}.min.js`;
  const bundle = readFileSync(resolve(bundlePath));
  return { name: 'Hawk', gzip: gzipSync(bundle).byteLength };
}

/**
 * Fetches a competitor's published gzip size from bundlephobia.
 * @param {{label: string, package: string}} competitor
 * @returns {Promise<{name: string, gzip: number | null}>}
 */
async function fetchCompetitorSize({ label, package: packageName }) {
  const url = `${BUNDLEPHOBIA_API}?package=${encodeURIComponent(packageName)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return { name: label, gzip: data.gzip };
  } catch (error) {
    console.error(`Failed to fetch ${packageName}: ${error.message}`);
    return { name: label, gzip: null };
  }
}

/**
 * Formats a byte count as a "N.N KB" string, or "n/a" when null.
 * @param {number | null} bytes
 * @returns {string}
 */
function formatKb(bytes) {
  return bytes === null ? 'n/a' : `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
  const results = [readLocalHawkSize(), ...(await Promise.all(COMPETITORS.map(fetchCompetitorSize)))];
  results.sort((a, b) => (a.gzip ?? Infinity) - (b.gzip ?? Infinity));

  console.log('| Library | Gzip size |');
  console.log('| :------ | :-------- |');
  for (const { name, gzip } of results) {
    console.log(`| ${name} | ${formatKb(gzip)} |`);
  }
}

main();
