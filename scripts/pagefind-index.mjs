/**
 * @fileoverview Thin wrapper around the Pagefind CLI: indexes a built static site so hawk
 * has something to search. This is the documented integration recipe for consumers, and it's
 * what hawk's own docs:build / dev:typeflow scripts call.
 *
 * Usage: node scripts/pagefind-index.mjs --site <built-site-dir> [--output-subdir <name>]
 *
 * Before running this, the site's HTML must mark its content region with
 * `data-pagefind-body` and may exclude chrome (nav/header/footer) with `data-pagefind-ignore`.
 * Skipping this scoping step is the #1 footgun: without it, Pagefind indexes the whole
 * <body> and every result gets polluted with repeated nav/header/footer text.
 * @module scripts/pagefind-index
 */

import { spawnSync } from 'node:child_process';

/**
 * Parses `--flag value` pairs from argv.
 * @param {string[]} argv
 * @returns {Record<string, string>}
 */
const parseArgs = (argv) => {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) {
      args[argv[i].slice(2)] = argv[i + 1];
      i += 1;
    }
  }
  return args;
};

const args = parseArgs(process.argv.slice(2));
const site = args.site || 'public';
const outputSubdir = args['output-subdir'] || 'pagefind';

console.log(`Indexing "${site}" with Pagefind (output subdir: "${outputSubdir}")...`);

const result = spawnSync('npx', ['--yes', 'pagefind', '--site', site, '--output-subdir', outputSubdir], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status !== 0) {
  throw new Error(`Pagefind indexing failed (exit code ${result.status}).`);
}
