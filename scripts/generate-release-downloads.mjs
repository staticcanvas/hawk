/**
 * @fileoverview Generates Hugo download metadata from public GitHub releases.
 * @module scripts/generate-release-downloads
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/** Converts GitHub releases to the schema consumed by the downloads shortcode. */
export function releaseDownloads(releases, repository) {
  return {
    generated_at: new Date().toISOString(),
    project: repository,
    versions: releases
      .filter((release) => !release.draft && !release.prerelease)
      .sort((a, b) => (b.published_at || '').localeCompare(a.published_at || ''))
      .map((release) => {
        const sourceUrl = `https://github.com/${repository}/tree/${encodeURIComponent(release.tag_name)}`;
        const assets = release.assets.map((asset) => ({
          name: asset.name,
          kind: asset.name.endsWith('.tar.gz')
            ? 'tar.gz'
            : asset.name.endsWith('.map')
              ? 'source map'
              : asset.name.split('.').pop(),
          url: asset.browser_download_url,
          source_url: sourceUrl,
          size: asset.size,
          checksum: asset.digest?.replace(/^sha256:/, '') || null,
        }));
        for (const format of ['zip', 'tarball']) {
          assets.push({
            name: `Source code (${format === 'tarball' ? 'tar.gz' : format})`,
            kind: 'source archive',
            url: release[format === 'zip' ? 'zipball_url' : 'tarball_url'],
            source_url: sourceUrl,
            size: null,
            checksum: null,
          });
        }
        return {
          version: release.tag_name.replace(/^v/, '').replace(/-release(?=\+|$)/, ''),
          tag: release.tag_name,
          name: release.name,
          released_at: release.published_at,
          release_url: release.html_url,
          source_url: sourceUrl,
          release_notes: release.body || '',
          assets,
        };
      }),
  };
}

/** Fetches all release pages; errors must fail CI rather than erase the downloads list. */
export async function fetchReleases(repository, token, request = fetch) {
  if (!/^[A-Za-z0-9][\w.-]*\/[A-Za-z0-9_][\w.-]*$/.test(repository)) {
    throw new Error(`Invalid GitHub repository: ${repository}`);
  }
  const releases = [];
  for (let page = 1; ; page++) {
    const response = await request(
      `https://api.github.com/repos/${repository}/releases?per_page=100&page=${page}`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }
    );
    if (!response.ok) throw new Error(`GitHub release request failed: HTTP ${response.status}`);
    const batch = await response.json();
    releases.push(...batch);
    if (batch.length < 100) return releases;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const repository = process.env.GITHUB_REPOSITORY || 'staticcanvas/hawk';
  const output = resolve(process.argv[2] || 'docs/data/releases.json');
  const releases = await fetchReleases(
    repository,
    process.env.GH_TOKEN || process.env.GITHUB_TOKEN
  );
  const data = releaseDownloads(releases, repository);
  for (const path of [output, resolve('docs/static/data/releases.json')]) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
  }
  console.log(`Wrote ${data.versions.length} GitHub release versions to ${output}`);
}
