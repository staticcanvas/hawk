/** Publish release assets using the release ID, including for newly created drafts. */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fetchReleases } from './generate-release-downloads.mjs';
import { generateReleaseMetadata } from './generate-release-metadata.mjs';

/** Resume a draft or update a release, publishing only after every upload succeeds. */
export async function publishGitHubRelease(
  { repository, token, tag, name, version, notes, assets },
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
      name: `Release ${name} ${version}`,
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
    name: `Release ${name} ${version}`,
    body: notes,
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { name, version } = JSON.parse(readFileSync('package.json', 'utf8'));
  const repository = process.env.GITHUB_REPOSITORY;
  const tag = process.env.RELEASE_TAG;
  const directory = resolve('dist/hawk/dist');
  const bundles = readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name !== 'SHA256SUMS')
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => ({ name: entry.name, data: readFileSync(resolve(directory, entry.name)) }));
  // Preserve Get-ReleaseNotes -AheadOnly's origin/main..HEAD range and fallback.
  const log = execFileSync('git', ['log', 'origin/main..HEAD', '--format=%H%x00%B%x00'], {
    encoding: 'utf8',
  });
  const fields = log.split('\0');
  const commits = [];
  for (let index = 0; index + 1 < fields.length; index += 2) {
    commits.push({ sha: fields[index].trim(), body: fields[index + 1] });
  }
  const metadata = generateReleaseMetadata({
    repository,
    tag,
    name,
    version,
    commits,
    assets: bundles,
    template: readFileSync(new URL('../.github/release-body-template.md', import.meta.url), 'utf8'),
    fallbackNotes: existsSync('release-notes.md') ? readFileSync('release-notes.md', 'utf8') : '',
    packageReadme: readFileSync('README-npm.md', 'utf8'),
  });
  for (const asset of metadata.metadataAssets) {
    writeFileSync(resolve('dist/hawk', asset.name), asset.data);
  }
  writeFileSync(resolve(directory, 'SHA256SUMS'), metadata.assets.at(-1).data);
  const release = await publishGitHubRelease({
    repository,
    token: process.env.GH_TOKEN,
    tag,
    name,
    version,
    notes: metadata.body,
    assets: metadata.assets,
  });
  console.log(`Published ${release.html_url}`);
}
