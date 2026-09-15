import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  HAWK_GALLERY_TEMPLATE_IDS,
  HAWK_GALLERY_THEMES,
  createHawkGalleryThemeFromTemplate,
} from '../docs/static/assets/hawk-docs-adapter.mjs';

// Keeps docs/static/assets/themes/*.css (scripts/generate-theme-css.mjs) honest: one small,
// standalone stylesheet per gallery/template theme, scoped under [data-hawk-theme-preset], never
// hand-edited out of sync with its source tokens.
const themesDir = path.resolve(import.meta.dirname, '../docs/static/assets/themes');
const maxBytesPerFile = 3 * 1024;

const templateThemes = HAWK_GALLERY_TEMPLATE_IDS.map((id) => {
  const templatePath = path.resolve(import.meta.dirname, `../theme-templates/${id}.json`);
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
  return createHawkGalleryThemeFromTemplate(id, template);
}).filter(Boolean);

const themes = [...HAWK_GALLERY_THEMES, ...templateThemes];

describe('generated theme CSS files', () => {
  it('has exactly one file per known theme, no stale leftovers', () => {
    const expected = new Set(themes.map((theme) => `${theme.id}.css`));
    const actual = new Set(fs.readdirSync(themesDir).filter((file) => file.endsWith('.css')));
    expect(actual).toEqual(expected);
  });

  for (const theme of themes) {
    it(`${theme.id}.css is scoped, complete, and within the per-theme size budget`, () => {
      const filePath = path.join(themesDir, `${theme.id}.css`);
      const css = fs.readFileSync(filePath, 'utf8');

      expect(Buffer.byteLength(css, 'utf8')).toBeLessThanOrEqual(maxBytesPerFile);
      expect(css).toContain(`[data-hawk-theme-preset='${theme.id}']`);

      for (const [token, value] of Object.entries(theme.tokens)) {
        if (value === null || value === undefined) continue;
        expect(css, `${theme.id}.css missing ${token}`).toContain(`${token}: ${value};`);
      }
    });
  }
});
