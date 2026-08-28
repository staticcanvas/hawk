/**
 * @fileoverview Dev-loop helper: copies hawk's freshly built bundle (and a Pagefind preview
 * index generated from typeflow's own built docs site) into typeflow's
 * docs/static/webutil/libs/hawk/, so the hawk-playground.html page in typeflow's docs can load
 * a live build while hawk is being developed. Mirrors typeflow's own `stageWebUtilityAssets`
 * vite plugin (vite.config.js), targeting a `hawk/` subfolder so it never collides with
 * typeflow's own dist files.
 *
 * This script assumes hawk is checked out at `typeflow/hawk/` (its expected location during
 * prototyping) and that `npm run docs:build` has already been run once in typeflow, so
 * `typeflow/public/` exists to index. It is a no-op (with a warning) for the preview-index
 * step if that directory isn't there yet — the bundle copy still happens.
 * @module scripts/copy-to-typeflow
 */

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const pkg = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
const packageName = pkg.name.split('/').pop();
const bundleDist = resolve(`dist/${packageName}/dist`);

const typeflowRoot = resolve('..');
const typeflowPublic = resolve(typeflowRoot, 'public');
const destination = resolve(typeflowRoot, 'docs/static/webutil/libs/hawk');

if (!existsSync(resolve(typeflowRoot, 'package.json'))) {
  throw new Error(
    'copy-to-typeflow.mjs expects hawk to be checked out inside a typeflow working tree (../package.json not found).'
  );
}

rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });

if (existsSync(bundleDist)) {
  cpSync(bundleDist, destination, { recursive: true });
  console.log(`Copied hawk bundle -> ${destination}`);
} else {
  throw new Error(`No build output found at ${bundleDist}. Run "npm run build" first.`);
}

for (const cssFile of ['hawk.css', 'hawk-theme-typeflow.css']) {
  const source = resolve('src', cssFile);
  if (existsSync(source)) {
    cpSync(source, resolve(destination, cssFile));
  }
}
console.log('Copied hawk stylesheets.');

if (existsSync(typeflowPublic)) {
  const previewIndexSite = typeflowPublic;
  console.log(`Generating Pagefind preview index from ${previewIndexSite}...`);
  const result = spawnSync(
    'npx',
    ['--yes', 'pagefind', '--site', previewIndexSite, '--output-subdir', 'pagefind-hawk-preview'],
    { stdio: 'inherit', shell: process.platform === 'win32' }
  );
  if (result.status !== 0) {
    console.warn('Pagefind preview indexing failed; hawk-playground.html will have no search data.');
  } else {
    const generatedIndex = resolve(typeflowPublic, 'pagefind-hawk-preview');
    const previewDestination = resolve(destination, 'pagefind-preview');
    cpSync(generatedIndex, previewDestination, { recursive: true });
    rmSync(generatedIndex, { recursive: true, force: true });
    console.log(`Copied Pagefind preview index -> ${previewDestination}`);
  }
} else {
  console.warn(
    `No built site found at ${typeflowPublic} — skipping preview index generation. ` +
      'Run "npm run docs:build" in typeflow first, then re-run this script to refresh the preview index.'
  );
}
