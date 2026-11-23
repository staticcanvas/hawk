/** Check that registries receive the staged package and its intended README. */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Reject root publication, stale artifacts, and the repository README. */
export function validateStagedReadme(projectRoot, packageRoot) {
  if (resolve(projectRoot) === resolve(packageRoot)) {
    throw new Error(
      'Publish the staged package with npm publish ./dist/hawk, not the repository root.'
    );
  }
  const source = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8'));
  const staged = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8'));
  if (source.name !== staged.name || source.version !== staged.version) {
    throw new Error(
      `Staged package ${staged.name}@${staged.version} does not match ${source.name}@${source.version}; rebuild first.`
    );
  }
  const expected = readFileSync(resolve(projectRoot, 'README-npm.md'));
  const actual = readFileSync(resolve(packageRoot, 'README.md'));
  if (!expected.length || !actual.equals(expected)) {
    throw new Error('Staged README.md must match the nonempty root README-npm.md for npm and JSR.');
  }
  return staged;
}

/** Check the actual npm pack file listing, including every declared public entrypoint. */
export function validatePackedFiles(manifest, files) {
  const paths = new Set(files.map((file) => file.path));
  const required = new Set(['README.md', 'package.json', 'LICENSE']);
  const visit = (value) => {
    if (typeof value === 'string' && value.startsWith('./')) required.add(value.slice(2));
    else if (value && typeof value === 'object') Object.values(value).forEach(visit);
  };
  for (const field of ['main', 'module', 'browser', 'types', 'exports']) visit(manifest[field]);
  const missing = [...required].filter((path) => !paths.has(path));
  if (missing.length) {
    throw new Error(`npm package is missing required files at package root: ${missing.join(', ')}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const projectRoot = resolve(import.meta.dirname, '..');
  const packageRoot = resolve(process.argv[2] || 'dist/hawk');
  const manifest = validateStagedReadme(projectRoot, packageRoot);
  const npmCli = process.env.npm_execpath;
  const result = spawnSync(
    npmCli ? process.execPath : 'npm',
    [...(npmCli ? [npmCli] : []), 'pack', '--dry-run', '--json', '--ignore-scripts'],
    { cwd: packageRoot, encoding: 'utf8' }
  );
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`npm pack check failed: ${result.stderr}`);
  const packages = JSON.parse(result.stdout);
  if (packages.length !== 1) throw new Error('Expected exactly one staged npm package.');
  validatePackedFiles(manifest, packages[0].files);
  console.log(
    `Package README and all declared entrypoints verified: ${manifest.name}@${manifest.version}`
  );
}
