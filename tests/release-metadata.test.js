import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  categorizedReleaseNotes,
  generateReleaseMetadata,
} from '../scripts/generate-release-metadata.mjs';
import { publishGitHubRelease } from '../scripts/publish-github-release.mjs';

const template = readFileSync(
  new URL('../.github/release-body-template.md', import.meta.url),
  'utf8'
);
const options = {
  repository: 'staticcanvas/hawk',
  tag: 'v0.43.8-release',
  name: '@staticcanvas/hawk',
  version: '0.43.8',
  template,
  fallbackNotes: 'Repository release notes',
  packageReadme: '# Package overview\n\nPackage usage from README-npm.md.',
  assets: [{ name: 'hawk.esm.js', data: Buffer.from('abc') }],
};

describe('GitLab release metadata parity', () => {
  it('uploads every bundle, archive, source map, and restored metadata file before publishing', async () => {
    const files = [
      'hawk.js',
      'hawk.js.map',
      'hawk-theme-typeflow.mjs',
      'hawk-animation-typeflow.mjs',
      'hawk-debug.mjs',
      'hawk-metrics.mjs',
      'hawk-0.43.8.zip',
      'hawk-0.43.8.tar.gz',
    ];
    const metadata = generateReleaseMetadata({
      ...options,
      assets: files.map((name) => ({ name, data: Buffer.from(name) })),
    });
    const uploaded = [];
    let published = false;
    const release = {
      id: 42,
      tag_name: options.tag,
      upload_url: 'https://uploads.github.com/releases/42/assets{?name,label}',
    };
    const request = async (url, init) => {
      let result;
      if (url.includes('uploads.github.com')) {
        uploaded.push(new URL(url).searchParams.get('name'));
        expect(published).toBe(false);
        result = { id: uploaded.length, state: 'uploaded' };
      } else if (init.method === 'PATCH') {
        expect(uploaded).toEqual(metadata.assets.map((asset) => asset.name));
        expect(JSON.parse(init.body)).toMatchObject({
          name: 'Release @staticcanvas/hawk 0.43.8',
          body: metadata.body,
          draft: false,
        });
        published = true;
        result = release;
      } else if (init.method === 'POST') {
        result = release;
      } else {
        result = [];
      }
      return { ok: true, status: 200, json: async () => result };
    };
    await publishGitHubRelease(
      { ...options, token: 'test-token', notes: metadata.body, assets: metadata.assets },
      request
    );
    expect(published).toBe(true);
    expect(uploaded).toHaveLength(files.length + 4);
  });
  it('restores both registries, all eight CDN variants, and both usage examples', () => {
    const { body } = generateReleaseMetadata(options);
    expect(body).toContain('Repository release notes');
    expect(body).toContain(options.packageReadme);
    expect(body.indexOf('Repository release notes')).toBeLessThan(
      body.indexOf('# Package overview')
    );
    expect(body).toContain('## **Package Links**');
    expect(body).toContain('https://www.npmjs.com/package/@staticcanvas/hawk/v/0.43.8');
    expect(body).toContain('https://jsr.io/@staticcanvas/hawk/0.43.8');
    for (const cdn of ['https://unpkg.com', 'https://cdn.jsdelivr.net/npm']) {
      for (const suffix of ['esm.js', 'js', 'esm.min.js', 'min.js']) {
        expect(body).toContain(`${cdn}/@staticcanvas/hawk@0.43.8/dist/hawk.${suffix}`);
      }
    }
    expect(body).toContain(
      '<script src="https://cdn.jsdelivr.net/npm/@staticcanvas/hawk@0.43.8/dist/hawk.js"></script>'
    );
    expect(body).toContain(
      "import * as packageModule from 'https://cdn.jsdelivr.net/npm/@staticcanvas/hawk@0.43.8/dist/hawk.esm.js';"
    );
    expect(body).not.toMatch(/\$\{(?:PROJECT|CI_|PACKAGE|RELEASE)/);
  });

  it('attaches notes and both metadata JSON files with versioned download URLs and real SHA256 values', () => {
    const result = generateReleaseMetadata(options);
    expect(result.assets.map((asset) => asset.name)).toEqual([
      'hawk.esm.js',
      'release-notes.md',
      'generic-package-links.json',
      'generic-package-checksums.json',
      'SHA256SUMS',
    ]);
    const digest = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
    const links = JSON.parse(
      result.metadataAssets.find((asset) => asset.name === 'generic-package-links.json').data
    );
    expect(links).toEqual([
      {
        file_name: 'hawk.esm.js',
        file_sha256: digest,
        checksum: digest,
        size: 3,
        download_url:
          'https://github.com/staticcanvas/hawk/releases/download/v0.43.8-release/hawk.esm.js',
      },
    ]);
    expect(
      JSON.parse(
        result.metadataAssets.find((asset) => asset.name === 'generic-package-checksums.json').data
      )
    ).toEqual([{ file_name: 'hawk.esm.js', checksum: digest }]);
    const checksums = result.assets.at(-1).data.toString();
    expect(checksums).toContain(`${digest}  hawk.esm.js\n`);
    for (const asset of result.metadataAssets) expect(checksums).toContain(`  ${asset.name}\n`);
    expect(checksums).not.toContain('  SHA256SUMS\n');
  });

  it('extracts all five historical commit-body categories with GitHub commit links', () => {
    const categories = [
      'Notes:',
      'Feature Notes:',
      'Breaking Changes:',
      'Feature Additions:',
      'Feature Updates:',
    ];
    const sha = 'a'.repeat(40);
    const body = categories.map((category) => `📌 ${category}\n- ${category} entry`).join('\n\n');
    const generated = categorizedReleaseNotes([{ sha, body }], options.repository);
    for (const category of categories)
      expect(generated).toContain(`## ${category}\n\n- ${category} entry`);
    expect(generated).toContain(`https://github.com/staticcanvas/hawk/commit/${sha}`);
    const metadata = generateReleaseMetadata({ ...options, commits: [{ sha, body }] });
    expect(metadata.body).not.toContain('Repository release notes');
    expect(metadata.body).toContain('Breaking Changes: entry');
  });

  it('falls back to repository notes when commits have no classified entries', () => {
    const result = generateReleaseMetadata({
      ...options,
      commits: [{ sha: 'b'.repeat(40), body: 'fix: ordinary conventional commit' }],
      fallbackNotes: 'See https://gitlab.com/staticcanvas/hawk/-/commit/123',
    });
    expect(result.body).toContain('See https://github.com/staticcanvas/hawk/commit/123');
    expect(generateReleaseMetadata({ ...options, fallbackNotes: '' }).body).toContain(
      'No release notes found.'
    );
  });

  it('keeps multiline entries within their commit and does not absorb the next commit subject', () => {
    const notes = categorizedReleaseNotes(
      [
        { sha: 'a'.repeat(40), body: 'Notes:\n- First line\n  Continued detail' },
        { sha: 'b'.repeat(40), body: 'unrelated subject\n\nFeature Updates:\n- Second entry' },
      ],
      options.repository
    );
    expect(notes).toContain('- First line Continued detail [');
    expect(notes).not.toContain('unrelated subject');
    expect(notes).toContain('## Feature Updates:\n\n- Second entry');
  });

  it('rejects unknown template placeholders and empty artifacts', () => {
    expect(() => generateReleaseMetadata({ ...options, template: '${UNKNOWN}' })).toThrow(
      'Unknown release template field'
    );
    expect(() => generateReleaseMetadata({ ...options, assets: [] })).toThrow('No release bundles');
  });
});
