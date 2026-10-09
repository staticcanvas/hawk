/**
 * @fileoverview Runs JSR's publish dry-run against an isolated release artifact.
 * @module scripts/check-jsr-package
 */

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const projectRoot = resolve(import.meta.dirname, '..');
const packageName = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8')).name
  .split('/')
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

try {
  cpSync(sourceRoot, isolatedPackage, { recursive: true });
  console.log(`Checking JSR package in isolated directory: ${isolatedPackage}`);

  const result = spawnSync(
    process.execPath,
    [jsrCli, 'publish', '--dry-run', '--allow-dirty'],
    {
      cwd: isolatedPackage,
      stdio: 'inherit',
      env: { ...process.env, DENO_DIR: join(cleanRoom, '.deno-cache') },
    }
  );

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`JSR clean-room publish check failed with exit code ${result.status}.`);
  }
} finally {
  rmSync(cleanRoom, { recursive: true, force: true });
}

console.log('JSR clean-room publish check passed.');
