import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  HAWK_GALLERY_TEMPLATE_IDS,
  HAWK_GALLERY_THEMES,
  createHawkGalleryThemeFromTemplate,
} from '../docs/static/assets/hawk-docs-adapter.mjs';

const REQUIRED_TOKENS = [
  '--hawk-bg-canvas',
  '--hawk-bg-surface',
  '--hawk-bg-surface-elevated',
  '--hawk-text-primary',
  '--hawk-text-secondary',
  '--hawk-accent',
  '--hawk-accent-alt',
];

function parseColor(value, backdrop = [255, 255, 255]) {
  const hex = value.match(/^#([\da-f]{6})$/i);
  if (hex) {
    return [0, 2, 4].map((offset) => Number.parseInt(hex[1].slice(offset, offset + 2), 16));
  }

  const rgb = value.match(
    /^rgba?\(\s*([\d.]+)[, ]+\s*([\d.]+)[, ]+\s*([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/i
  );
  if (!rgb) throw new Error(`Unsupported color in theme audit: ${value}`);
  const foreground = rgb.slice(1, 4).map(Number);
  const alpha = rgb[4] === undefined ? 1 : Number(rgb[4]);
  return foreground.map((channel, index) => channel * alpha + backdrop[index] * (1 - alpha));
}

function luminance(color) {
  const channels = color.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground, background, canvas) {
  const backgroundColor = parseColor(background, parseColor(canvas));
  const foregroundColor = parseColor(foreground, backgroundColor);
  const [lighter, darker] = [luminance(foregroundColor), luminance(backgroundColor)].sort(
    (a, b) => b - a
  );
  return (lighter + 0.05) / (darker + 0.05);
}

function loadTemplateThemes() {
  return HAWK_GALLERY_TEMPLATE_IDS.map((id) => {
    const template = JSON.parse(
      fs.readFileSync(path.resolve(import.meta.dirname, `../theme-templates/${id}.json`), 'utf8')
    );
    return createHawkGalleryThemeFromTemplate(id, template);
  });
}

describe('documentation theme gallery', () => {
  const themes = [...HAWK_GALLERY_THEMES, ...loadTemplateThemes()];

  it('maps every allow-listed template to a complete, unique gallery profile', () => {
    expect(themes).not.toContain(null);
    expect(new Set(themes.map(({ id }) => id))).toHaveLength(themes.length);

    for (const theme of themes) {
      expect(theme.label).toBeTruthy();
      expect(theme.colorModes.length).toBeGreaterThan(0);
      expect(theme.params.scale).toBeGreaterThan(0);
      for (const token of REQUIRED_TOKENS) expect(theme.tokens[token]).toBeTruthy();
    }
  });

  it('keeps readable text and distinguishable controls on every surface', () => {
    for (const theme of themes) {
      const surface = theme.tokens['--hawk-bg-surface'];
      const canvas = theme.tokens['--hawk-bg-canvas'];
      expect(
        contrast(theme.tokens['--hawk-text-primary'], surface, canvas),
        theme.id
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(theme.tokens['--hawk-text-secondary'], surface, canvas),
        theme.id
      ).toBeGreaterThanOrEqual(4.5);

      const muted = theme.tokens['--hawk-text-muted'];
      if (muted) expect(contrast(muted, surface, canvas), theme.id).toBeGreaterThanOrEqual(3);
      expect(
        contrast(theme.tokens['--hawk-accent'], surface, canvas),
        theme.id
      ).toBeGreaterThanOrEqual(3);
      expect(
        contrast(theme.tokens['--hawk-accent-alt'], surface, canvas),
        theme.id
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it('defines Simple dark as a seamless minimal layout, not another palette swap', () => {
    const simpleDark = themes.find(({ id }) => id === 'simple-dark');

    expect(simpleDark.params).toMatchObject({
      position: 'top-center',
      alignment: 'start',
      columns: 1,
      density: 'compact',
      scale: 0.9,
    });
    expect(simpleDark.tokens).toMatchObject({
      '--hawk-bg-surface': 'rgba(11, 13, 17, 0)',
      '--hawk-bg-surface-elevated': 'rgba(11, 13, 17, 0)',
      '--hawk-border-subtle': 'rgba(255, 255, 255, 0)',
      '--hawk-border-default': 'rgba(255, 255, 255, 0)',
      '--hawk-border-strong': 'rgba(255, 255, 255, 0)',
      '--hawk-preview-bg': 'rgba(11, 13, 17, 0)',
      '--hawk-shadow': 'none',
    });
  });
});
