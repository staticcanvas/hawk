import { defineConfig } from 'vite';
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import terser from '@rollup/plugin-terser';

const pkg = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
const packageDist = `dist/${pkg.name.split('/').pop()}`;
const bundleDist = `${packageDist}/dist`;

const MODES = {
  'theme-typeflow': {
    name: 'hawk-theme-typeflow',
    entry: 'src/hawk-theme-typeflow.js',
    globalName: 'HawkThemeTypeflow',
    external: [],
    cssSource: 'src/hawk-theme-typeflow.css',
  },
  'animation-typeflow': {
    name: 'hawk-animation-typeflow',
    entry: 'src/hawk-animation-typeflow.js',
    globalName: 'HawkAnimationTypeflow',
    external: ['@staticcanvas/typeflow'],
  },
};

const mode = MODES[process.env.npm_config_mode];
if (!mode) {
  throw new Error(
    `vite.optional.config.js requires npm_config_mode to be one of: ${Object.keys(MODES).join(', ')}`
  );
}
const { name, entry, globalName, external, cssSource } = mode;

/** Vite plugin that copies optional bundles into the documentation web utility. */
const stageOptionalAssets = {
  name: 'stage-optional-web-assets',
  // See the matching note in vite.config.js's stageWebUtilityAssets — closeBundle can fire
  // outside an actual `vite build` (e.g. under Vitest) without this guard.
  apply: 'build',
  closeBundle() {
    const destination = resolve('docs/static/webutil/libs');
    mkdirSync(destination, { recursive: true });
    cpSync(resolve(bundleDist), destination, { recursive: true });
    // Vite's lib build only bundles JS entry points — a mode's CSS (if any) ships
    // separately and needs its own copy step here.
    if (cssSource && existsSync(resolve(cssSource))) {
      cpSync(resolve(cssSource), resolve(destination, cssSource.split('/').pop()));
    }
  },
};

/**
 * Builds one Rollup output configuration for an optional bundle format.
 * @param {string} format Rollup output format.
 * @param {string} fileName Generated file name.
 * @param {Array<object>} [plugins=[]] Rollup plugins.
 * @returns {object} Rollup output configuration.
 */
const output = (format, fileName, plugins = []) => ({
  format,
  ...(format === 'umd' ? { name: globalName, exports: 'named' } : {}),
  dir: bundleDist,
  entryFileNames: fileName,
  plugins,
  ...(external.length ? { globals: { '@staticcanvas/typeflow': 'TypeFlow' } } : {}),
});

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    copyPublicDir: false,
    sourcemap: true,
    target: 'es2015',
    lib: { entry: resolve(entry), name: globalName, fileName: name },
    minify: false,
    rollupOptions: {
      external,
      output: [
        output('umd', `${name}.js`, [terser({ format: { comments: true, preamble: `/*! ${name} | ${pkg.license} */` } })]),
        output('umd', `${name}.min.js`, [terser({ format: { comments: /^!/ }, compress: true, mangle: true })]),
        output('umd', `${name}.cjs`, [terser({ format: { comments: true, preamble: `/*! ${name} | ${pkg.license} */` } })]),
        output('es', `${name}.mjs`, [terser({ format: { comments: true, preamble: `/*! ${name} | ${pkg.license} */` } })]),
        output('es', `${name}.esm.js`, [terser({ format: { comments: true, preamble: `/*! ${name} | ${pkg.license} */` } })]),
        output('es', `${name}.esm.min.js`, [terser({ format: { comments: /^!/ }, compress: true, mangle: true })]),
      ],
    },
  },
  plugins: [stageOptionalAssets],
});
