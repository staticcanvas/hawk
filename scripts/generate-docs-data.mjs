/**
 * @fileoverview Projects repository-owned documentation into Hugo data files.
 * @module scripts/generate-docs-data
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const changelogPath = join(projectRoot, 'CHANGELOG.md');
const changelogDataPath = join(projectRoot, 'docs/data/changelog.json');
const markdown = readFileSync(changelogPath, 'utf8').trimEnd();

writeFileSync(
  changelogDataPath,
  `${JSON.stringify(
    {
      source: 'CHANGELOG.md',
      markdown,
    },
    null,
    2
  )}\n`
);

console.log(`Generated ${changelogDataPath} from ${changelogPath}.`);
