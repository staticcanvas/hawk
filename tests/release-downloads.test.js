import { describe, expect, it } from 'vitest';
import { fetchReleases, releaseDownloads } from '../scripts/generate-release-downloads.mjs';

const release = {
  tag_name: 'v1.2.3-release+build.1',
  name: 'Hawk 1.2.3',
  published_at: '2026-10-01T00:00:00Z',
  html_url: 'https://github.com/staticcanvas/hawk/releases/tag/v1.2.3-release+build.1',
  zipball_url: 'https://api.github.com/repos/staticcanvas/hawk/zipball/v1.2.3-release+build.1',
  tarball_url: 'https://api.github.com/repos/staticcanvas/hawk/tarball/v1.2.3-release+build.1',
  body: 'Release notes',
  assets: [
    {
      name: 'hawk-1.2.3.tar.gz',
      browser_download_url:
        'https://github.com/staticcanvas/hawk/releases/download/v1.2.3-release/hawk-1.2.3.tar.gz',
      size: 123,
      digest: 'sha256:abc',
    },
  ],
};

describe('GitHub release downloads', () => {
  it('maps assets, source archives, notes, and build metadata to the Hugo schema', () => {
    const data = releaseDownloads([release], 'staticcanvas/hawk');
    expect(data.versions[0]).toMatchObject({
      version: '1.2.3+build.1',
      release_notes: 'Release notes',
      release_url: release.html_url,
      source_url: 'https://github.com/staticcanvas/hawk/tree/v1.2.3-release%2Bbuild.1',
    });
    expect(data.versions[0].assets).toEqual([
      expect.objectContaining({
        name: 'hawk-1.2.3.tar.gz',
        kind: 'tar.gz',
        size: 123,
        checksum: 'abc',
      }),
      expect.objectContaining({ name: 'Source code (zip)', url: release.zipball_url }),
      expect.objectContaining({ name: 'Source code (tar.gz)', url: release.tarball_url }),
    ]);
  });

  it('excludes unpublished and prerelease records and sorts newest first', () => {
    const newer = { ...release, tag_name: 'v2.0.0-release', published_at: '2026-11-01T00:00:00Z' };
    expect(
      releaseDownloads(
        [release, { ...release, draft: true }, { ...release, prerelease: true }, newer],
        'staticcanvas/hawk'
      ).versions.map((entry) => entry.version)
    ).toEqual(['2.0.0', '1.2.3+build.1']);
  });

  it('paginates beyond 100 releases and sends authentication on each request', async () => {
    const requests = [];
    const releases = await fetchReleases(
      'staticcanvas/hawk',
      'test-token',
      async (url, options) => {
        requests.push({ url, options });
        return {
          ok: true,
          json: async () => (requests.length === 1 ? Array(100).fill(release) : [release]),
        };
      }
    );
    expect(releases).toHaveLength(101);
    expect(requests[1].url).toContain('page=2');
    expect(requests[1].options.headers.Authorization).toBe('Bearer test-token');
  });

  it('fails on API errors rather than returning incomplete downloads', async () => {
    await expect(
      fetchReleases('staticcanvas/hawk', undefined, async () => ({
        ok: false,
        status: 403,
      }))
    ).rejects.toThrow('HTTP 403');
    await expect(fetchReleases('../wrong', undefined)).rejects.toThrow('Invalid GitHub repository');
  });

  it('supports a new repository with no releases', () => {
    expect(releaseDownloads([], 'staticcanvas/hawk').versions).toEqual([]);
  });
});
