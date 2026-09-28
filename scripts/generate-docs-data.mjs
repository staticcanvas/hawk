/**
 * @fileoverview Projects repository-owned documentation into Hugo data files.
 * @module scripts/generate-docs-data
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const changelogPath = join(projectRoot, 'CHANGELOG.md');
const changelogDataPath = join(projectRoot, 'docs/data/changelog.json');
const packagePath = join(projectRoot, 'package.json');
const packageDataPath = join(projectRoot, 'docs/data/package.json');
const markdown = readFileSync(changelogPath, 'utf8').trimEnd();
const packageDocument = JSON.parse(readFileSync(packagePath, 'utf8'));

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

writeFileSync(packageDataPath, `${JSON.stringify(packageDocument, null, 2)}\n`);

console.log(`Generated ${changelogDataPath} from ${changelogPath}.`);
console.log(`Generated ${packageDataPath} from ${packagePath}.`);
