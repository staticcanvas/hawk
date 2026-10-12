/**
 * @fileoverview Runs JSR's publish dry-run against an isolated release artifact.
 * @module scripts/check-jsr-package
 */

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const projectRoot = resolve(import.meta.dirname, '..');
const packageName = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'))
  .name.split('/')
  .pop();
const sourceRoot = resolve(projectRoot, process.argv[2] || `dist/${packageName}`);
const jsrCli = join(projectRoot, 'node_modules/jsr/dist/bin.js');

if (!existsSync(sourceRoot)) {
  throw new Error(`JSR package directory does not exist: ${sourceRoot}`);
}
if (!existsSync(join(sourceRoot, 'jsr.json')) && !existsSync(join(sourceRoot, 'jsr.jsonc'))) {
  throw new Error(`JSR package directory has no jsr.json or jsr.jsonc: ${sourceRoot}`);
}
if (!existsSync(jsrCli)) {
  throw new Error(`Pinned JSR CLI is not installed: ${jsrCli}`);
}

const cleanRoom = mkdtempSync(join(tmpdir(), 'hawk-jsr-check-'));
const isolatedPackage = join(cleanRoom, basename(sourceRoot));
const denoCache = join(cleanRoom, '.deno-cache');

/** Finds the Deno executable downloaded by the pinned JSR CLI. */
function findManagedDeno() {
  if (process.env.DENO_BIN_PATH) return process.env.DENO_BIN_PATH;

  const downloadRoot = join(projectRoot, 'node_modules', 'jsr', '.download');
  if (!existsSync(downloadRoot)) return null;

  const executableName = process.platform === 'win32' ? 'deno.exe' : 'deno';
  const pending = [downloadRoot];
  while (pending.length) {
    const directory = pending.pop();
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) pending.push(path);
      else if (entry.isFile() && entry.name === executableName) return path;
    }
  }
  return null;
}

try {
  cpSync(sourceRoot, isolatedPackage, { recursive: true });
  console.log(`Checking JSR package in isolated directory: ${isolatedPackage}`);

  const result = spawnSync(process.execPath, [jsrCli, 'publish', '--dry-run', '--allow-dirty'], {
    cwd: isolatedPackage,
    stdio: 'inherit',
    env: { ...process.env, DENO_DIR: denoCache },
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`JSR clean-room publish check failed with exit code ${result.status}.`);
  }

  // `deno publish --dry-run` currently stops before the registry's documentation-generation
  // pass. Run the same documentation parser explicitly in the isolated package so undeclared
  // type-only dependencies cannot pass validation and then fail after upload.
  const denoBin = findManagedDeno();
  if (!denoBin) {
    throw new Error('Could not locate the Deno binary managed by the pinned JSR CLI.');
  }
  const jsrManifestPath = existsSync(join(isolatedPackage, 'jsr.json'))
    ? join(isolatedPackage, 'jsr.json')
    : join(isolatedPackage, 'jsr.jsonc');
  const jsrManifest = readFileSync(jsrManifestPath, 'utf8');
  const entrypoints = [
    ...new Set(
      [...jsrManifest.matchAll(/"(\.\/[^"\n]+\.(?:[cm]?[jt]sx?))"/g)].map((match) => match[1])
    ),
  ];
  if (!entrypoints.length) {
    throw new Error(`Could not find any JSR entrypoints in ${basename(jsrManifestPath)}.`);
  }

  const docsResult = spawnSync(denoBin, ['doc', '--json', ...entrypoints], {
    cwd: isolatedPackage,
    stdio: ['ignore', 'ignore', 'inherit'],
    env: { ...process.env, DENO_DIR: denoCache },
  });
  if (docsResult.error) throw docsResult.error;
  if (docsResult.status !== 0) {
    throw new Error(
      `JSR clean-room documentation check failed with exit code ${docsResult.status}.`
    );
  }
} finally {
  rmSync(cleanRoom, { recursive: true, force: true });
}

console.log('JSR clean-room publish and documentation checks passed.');
