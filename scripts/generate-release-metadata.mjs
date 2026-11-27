/** Release metadata restored from the GitLab pipeline preceding commit 3e45b8b. */
import { createHash } from 'node:crypto';

const categories = [
  'Notes:',
  'Feature Notes:',
  'Breaking Changes:',
  'Feature Additions:',
  'Feature Updates:',
];

/** Extract the commit-body sections selected by the original Get-ReleaseNotes call. */
export function categorizedReleaseNotes(commits, repository) {
  const entries = new Map(categories.map((category) => [category, []]));
  for (const { sha, body } of commits) {
    let category;
    for (const raw of body.split('\n')) {
      const line = raw.trim();
      const heading = line.replace(/[^A-Za-z :]/g, '').trim();
      if (entries.has(heading)) {
        category = heading;
      } else if (category && /^-\s+/.test(line)) {
        entries
          .get(category)
          .push(`${line} [${sha.slice(0, 15)}](https://github.com/${repository}/commit/${sha})`);
      } else if (category && line && !/^(?:#|Merge\b)/.test(line)) {
        const group = entries.get(category);
        if (group.length) {
          const index = group.length - 1;
          group[index] = group[index].replace(
            / (\[[^\]]+\]\(https:.*\))$/,
            (_, link) => ` ${line} ${link}`
          );
        }
      }
    }
  }
  return [...entries]
    .filter(([, lines]) => lines.length)
    .map(([category, lines]) => `## ${category}\n\n${lines.join('\n')}`)
    .join('\n\n');
}

/** Render the extracted release body and produce downloadable notes and JSON metadata. */
export function generateReleaseMetadata({
  repository,
  tag,
  name,
  version,
  template,
  commits = [],
  fallbackNotes = '',
  packageReadme,
  assets,
}) {
  if (!assets.length) throw new Error('No release bundles found.');
  const projectName = name.split('/').pop();
  const notes = (
    categorizedReleaseNotes(commits, repository).trim() ||
    fallbackNotes.trim() ||
    'No release notes found.'
  ).replace(
    /https:\/\/gitlab\.com\/staticcanvas\/hawk\/-\/commit\//g,
    'https://github.com/staticcanvas/hawk/commit/'
  );
  const values = {
    RELEASE_NOTES: notes,
    PACKAGE_README: packageReadme || '',
    PACKAGE_NAME: name,
    PROJECT_NAME: projectName,
    PROJECT_VERSION: version,
  };
  const body = template.replace(/\$\{([A-Z_]+)\}/g, (placeholder, key) => {
    if (!Object.hasOwn(values, key))
      throw new Error(`Unknown release template field: ${placeholder}`);
    return values[key];
  });
  const links = assets.map((asset) => {
    const checksum = createHash('sha256').update(asset.data).digest('hex');
    return {
      file_name: asset.name,
      file_sha256: checksum,
      checksum,
      size: asset.data.length,
      download_url: `https://github.com/${repository}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(asset.name)}`,
    };
  });
  const metadataAssets = [
    { name: 'release-notes.md', data: Buffer.from(`${notes}\n`) },
    {
      name: 'generic-package-links.json',
      data: Buffer.from(`${JSON.stringify(links, null, 2)}\n`),
    },
    {
      name: 'generic-package-checksums.json',
      data: Buffer.from(
        `${JSON.stringify(
          links.map(({ file_name, checksum }) => ({ file_name, checksum })),
          null,
          2
        )}\n`
      ),
    },
  ];
  const allAssets = [...assets, ...metadataAssets];
  const checksums = allAssets
    .map((asset) => `${createHash('sha256').update(asset.data).digest('hex')}  ${asset.name}\n`)
    .join('');
  allAssets.push({ name: 'SHA256SUMS', data: Buffer.from(checksums) });
  return { body, metadataAssets, assets: allAssets };
}
