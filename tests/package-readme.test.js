import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { validatePackedFiles, validateStagedReadme } from '../scripts/check-package-readme.mjs';

const directories = [];
afterEach(() => {
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'hawk-package-readme-'));
  directories.push(root);
  const staged = join(root, 'dist/hawk');
  mkdirSync(staged, { recursive: true });
  const manifest = {
    name: '@staticcanvas/hawk',
    version: '1.2.3',
    main: './dist/hawk.cjs',
    exports: {
      '.': { import: './dist/hawk.mjs', types: './src/hawk.d.ts' },
      './css': './src/hawk.css',
    },
  };
  for (const directory of [root, staged])
    writeFileSync(join(directory, 'package.json'), JSON.stringify(manifest));
  writeFileSync(join(root, 'README-npm.md'), '# Package usage\n');
  writeFileSync(join(staged, 'README.md'), '# Package usage\n');
  return { root, staged, manifest };
}

describe('registry package README and layout', () => {
  it('accepts the intended package README in a matching staged artifact', () => {
    const { root, staged, manifest } = fixture();
    expect(validateStagedReadme(root, staged)).toEqual(manifest);
    validatePackedFiles(
      manifest,
      [
        'README.md',
        'package.json',
        'LICENSE',
        'dist/hawk.cjs',
        'dist/hawk.mjs',
        'src/hawk.d.ts',
        'src/hawk.css',
      ].map((path) => ({ path }))
    );
  });

  it('blocks publishing from the repository root', () => {
    const { root } = fixture();
    expect(() => validateStagedReadme(root, root)).toThrow('not the repository root');
  });

  it('rejects a different repository README even when one exists in the package', () => {
    const { root, staged } = fixture();
    writeFileSync(join(staged, 'README.md'), '# Contributor instructions\n');
    expect(() => validateStagedReadme(root, staged)).toThrow('must match');
  });

  it('rejects stale package artifacts', () => {
    const { root, staged, manifest } = fixture();
    writeFileSync(join(staged, 'package.json'), JSON.stringify({ ...manifest, version: '1.2.2' }));
    expect(() => validateStagedReadme(root, staged)).toThrow('rebuild first');
  });

  it('detects the observed root-package layout with nested distribution entrypoints', () => {
    const { manifest } = fixture();
    const files = [
      'README.md',
      'package.json',
      'LICENSE',
      'dist/hawk/README.md',
      'dist/hawk/dist/hawk.cjs',
    ];
    expect(() =>
      validatePackedFiles(
        manifest,
        files.map((path) => ({ path }))
      )
    ).toThrow('dist/hawk.cjs');
  });

  it('rejects a pack result that excludes the README or an exported module', () => {
    const { manifest } = fixture();
    expect(() => validatePackedFiles(manifest, [{ path: 'package.json' }])).toThrow('README.md');
    const files = [
      'README.md',
      'package.json',
      'LICENSE',
      'dist/hawk.cjs',
      'dist/hawk.mjs',
      'src/hawk.d.ts',
    ];
    expect(() =>
      validatePackedFiles(
        manifest,
        files.map((path) => ({ path }))
      )
    ).toThrow('src/hawk.css');
  });
});
