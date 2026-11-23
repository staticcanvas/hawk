import { describe, expect, it, vi } from 'vitest';
import { publishGitHubRelease } from '../scripts/publish-github-release.mjs';

const base = 'https://api.github.com/repos/staticcanvas/hawk';
const release = {
  id: 42,
  tag_name: 'v0.43.8-release',
  draft: true,
  upload_url: 'https://uploads.github.com/repos/staticcanvas/hawk/releases/42/assets{?name,label}',
};
const options = {
  repository: 'staticcanvas/hawk',
  token: 'test-token',
  tag: release.tag_name,
  name: '@staticcanvas/hawk',
  version: '0.43.8',
  notes: 'Release notes with package links',
  assets: [{ name: 'hawk file.mjs', data: Buffer.from('bundle') }],
};
function response(data, status = 200) {
  return { ok: status < 400, status, json: async () => data };
}

describe('GitHub release publishing', () => {
  it('uploads a new draft by ID without looking it up again by tag', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(response(release, 201))
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(response({ id: 123 }, 201))
      .mockResolvedValueOnce(response({ ...release, draft: false }));

    await publishGitHubRelease(options, request);

    const calls = request.mock.calls;
    expect(calls.map(([url]) => url)).toEqual([
      `${base}/releases?per_page=100&page=1`,
      `${base}/releases`,
      `${base}/releases/42/assets?per_page=100&page=1`,
      'https://uploads.github.com/repos/staticcanvas/hawk/releases/42/assets?name=hawk%20file.mjs',
      `${base}/releases/42`,
    ]);
    expect(JSON.parse(calls[1][1].body)).toMatchObject({ draft: true, body: options.notes });
    expect(calls[3][1].body).toBe(options.assets[0].data);
    expect(calls[3][1].headers['Content-Type']).toBe('application/octet-stream');
    expect(JSON.parse(calls[4][1].body)).toMatchObject({ draft: false, body: options.notes });
    expect(calls.every(([, init]) => init.headers.Authorization === 'Bearer test-token')).toBe(
      true
    );
  });

  it.each([true, false])(
    'resumes an existing release (draft=%s) and replaces matching assets',
    async (draft) => {
      const request = vi
        .fn()
        .mockResolvedValueOnce(response([{ ...release, draft }]))
        .mockResolvedValueOnce(response([{ id: 99, name: options.assets[0].name }]))
        .mockResolvedValueOnce(response(undefined, 204))
        .mockResolvedValueOnce(response({ id: 100 }, 201))
        .mockResolvedValueOnce(response({ ...release, draft: false }));

      await publishGitHubRelease(options, request);

      expect(request.mock.calls[2]).toEqual([
        `${base}/releases/assets/99`,
        expect.objectContaining({ method: 'DELETE' }),
      ]);
      expect(request.mock.calls.some(([url]) => url === `${base}/releases`)).toBe(false);
      expect(request.mock.calls.at(-1)[1].method).toBe('PATCH');
    }
  );

  it('leaves the draft unpublished when an upload fails', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce(response([release]))
      .mockResolvedValueOnce(response([]))
      .mockResolvedValueOnce(response({}, 502));

    await expect(publishGitHubRelease(options, request)).rejects.toThrow('HTTP 502');
    expect(request.mock.calls.some(([, init]) => init.method === 'PATCH')).toBe(false);
  });

  it('does not create a duplicate release when listing releases fails', async () => {
    const request = vi.fn().mockResolvedValueOnce(response({}, 403));
    await expect(publishGitHubRelease(options, request)).rejects.toThrow('HTTP 403');
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('rejects missing credentials, missing assets, and mismatched versions before making requests', async () => {
    const request = vi.fn();
    await expect(publishGitHubRelease({ ...options, token: '' }, request)).rejects.toThrow(
      'GH_TOKEN'
    );
    await expect(publishGitHubRelease({ ...options, assets: [] }, request)).rejects.toThrow(
      'assets'
    );
    await expect(publishGitHubRelease({ ...options, version: '0.43.7' }, request)).rejects.toThrow(
      'must match'
    );
    expect(request).not.toHaveBeenCalled();
  });
});
