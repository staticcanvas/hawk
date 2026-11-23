/** Publish release assets using the release ID, including for newly created drafts. */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fetchReleases } from './generate-release-downloads.mjs';

/** Resume a draft or update a release, publishing only after every upload succeeds. */
export async function publishGitHubRelease(
  { repository, token, tag, version, notes, assets },
  request = fetch
) {
  if (!token) throw new Error('GH_TOKEN is required to publish a release.');
  if (!assets.length) throw new Error('Release assets are required.');
  const match = /^v?(\d+\.\d+\.\d+)-release(\+[a-zA-Z0-9.-]+)?$/.exec(tag);
  if (!match || `${match[1]}${match[2] || ''}` !== version) {
    throw new Error(`Release tag ${tag} must match package version ${version}.`);
  }
  const base = `https://api.github.com/repos/${repository}`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
  };
  async function api(url, method = 'GET', body, binary = false) {
    const response = await request(url, {
      method,
      headers: {
        ...headers,
        ...(body === undefined
          ? {}
          : { 'Content-Type': binary ? 'application/octet-stream' : 'application/json' }),
      },
      ...(body === undefined ? {} : { body: binary ? body : JSON.stringify(body) }),
    });
    if (!response.ok) {
      throw new Error(`GitHub release ${method} ${url} failed: HTTP ${response.status}`);
    }
    return response.status === 204 ? undefined : response.json();
  }

  // Listing releases also finds drafts, which may not be available via tag lookup.
  const releases = await fetchReleases(repository, token, request);
  let release = releases.find((entry) => entry.tag_name === tag);
  if (!release) {
    release = await api(`${base}/releases`, 'POST', {
      tag_name: tag,
      name: `Hawk ${version}`,
      body: notes,
      draft: true,
    });
  }
  const existingAssets = [];
  for (let page = 1; ; page++) {
    const batch = await api(`${base}/releases/${release.id}/assets?per_page=100&page=${page}`);
    existingAssets.push(...batch);
    if (batch.length < 100) break;
  }
  const uploadUrl = release.upload_url.replace(/\{.*$/, '');
  for (const asset of assets) {
    const existing = existingAssets.find((entry) => entry.name === asset.name);
    if (existing) await api(`${base}/releases/assets/${existing.id}`, 'DELETE');
    console.log(`Uploading ${asset.name} to release ${release.id}`);
    await api(`${uploadUrl}?name=${encodeURIComponent(asset.name)}`, 'POST', asset.data, true);
  }
  return api(`${base}/releases/${release.id}`, 'PATCH', {
    draft: false,
    make_latest: 'true',
    name: `Hawk ${version}`,
    body: notes,
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { name, version } = JSON.parse(readFileSync('package.json', 'utf8'));
  const notes = `${readFileSync('release-notes.md', 'utf8')}\n\n## Packages\n\n- [npm](https://www.npmjs.com/package/${name}/v/${version})\n- [JSR](https://jsr.io/${name}/${version})\n- [jsDelivr](https://cdn.jsdelivr.net/npm/${name}@${version}/dist/)\n- [unpkg](https://unpkg.com/${name}@${version}/dist/)\n`;
  const directory = resolve('dist/hawk/dist');
  const assets = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name !== 'SHA256SUMS')
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => ({ name: entry.name, data: readFileSync(resolve(directory, entry.name)) }));
  if (!assets.length) throw new Error('No release bundles found.');
  const checksums = assets
    .map((asset) => `${createHash('sha256').update(asset.data).digest('hex')}  ${asset.name}\n`)
    .join('');
  writeFileSync(resolve(directory, 'SHA256SUMS'), checksums);
  assets.push({ name: 'SHA256SUMS', data: Buffer.from(checksums) });
  const release = await publishGitHubRelease({
    repository: process.env.GITHUB_REPOSITORY,
    token: process.env.GH_TOKEN,
    tag: process.env.RELEASE_TAG,
    version,
    notes,
    assets,
  });
  console.log(`Published ${release.html_url}`);
}
