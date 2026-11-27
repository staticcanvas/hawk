import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const npmTypes = read('../src/hawk-animation-typeflow.d.ts');
const jsrTypes = read('../src/hawk-animation-typeflow-jsr.d.ts');
const guide = read('../docs/content/guides/animation-plugins.md');
const implementation = read('../src/hawk-animation-typeflow-core.js');

function declarationGroups(source) {
  const body = source.match(
    /export interface HawkAnimationTypeflowOptions\s*\{([\s\S]*?)^\}/m
  )?.[1];
  if (!body) throw new Error('Missing HawkAnimationTypeflowOptions interface.');
  return [...body.matchAll(/^\s*([A-Za-z_$][\w$]*)\??\s*:/gm)].map((match) => match[1]).sort();
}

function documentedGroups(source) {
  const section = source.split('### TypeFlow configuration groups\n')[1]?.split(/\n#{1,3} /)[0];
  if (!section) throw new Error('Missing TypeFlow configuration groups reference.');
  return [...section.matchAll(/^\|\s*`([A-Za-z_$][\w$]*)`\s*\|/gm)].map((match) => match[1]).sort();
}

function checkGroups(types, documentation) {
  const declared = declarationGroups(types);
  const documented = documentedGroups(documentation);
  if (!declared.length || JSON.stringify(declared) !== JSON.stringify(documented)) {
    throw new Error(`Animation option drift: declared [${declared}], documented [${documented}].`);
  }
}

describe('TypeFlow public option groups', () => {
  it('keeps the npm declarations, JSR declarations, implementation contract, and guide aligned', () => {
    checkGroups(npmTypes, guide);
    checkGroups(jsrTypes, guide);
    const implemented = [
      ...implementation.matchAll(/@param\s+\{[^}]+\}\s+\[options\.([A-Za-z_$][\w$]*)\]/g),
    ]
      .map((match) => match[1])
      .sort();
    expect(implemented).toEqual(declarationGroups(npmTypes));
  });

  it('rejects an option added only to a declaration', () => {
    const changed = npmTypes.replace(
      'export interface HawkAnimationTypeflowOptions {',
      'export interface HawkAnimationTypeflowOptions {\n  futureSurface?: TypeFlowConfig;'
    );
    expect(() => checkGroups(changed, guide)).toThrow('Animation option drift');
  });

  it('rejects an option added only to the guide', () => {
    const changed = guide.replace(
      '### TypeFlow configuration groups\n',
      '### TypeFlow configuration groups\n\n| `futureSurface` | `TypeFlowConfig` | none | extra |\n'
    );
    expect(() => checkGroups(npmTypes, changed)).toThrow('Animation option drift');
  });
});
