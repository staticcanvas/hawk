import { defineConfig } from 'vite';
import copy from 'rollup-plugin-copy';
import { resolve } from 'node:path';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import terser from '@rollup/plugin-terser';

const pkg = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
const packageName = pkg.name.split('/').pop();
const packageDist = `dist/${packageName}`;
const bundleDist = `${packageDist}/dist`;

const banner = `/*! ${packageName} v${pkg.version} | ${pkg.homepage} | ${pkg.license} */`;

/**
 * Creates the Vite plugin that stages generated bundles and documentation assets.
 * @returns {{name: string, closeBundle: () => void}} Vite staging plugin.
 */
function stageWebUtilityAssets() {
  return {
    name: 'stage-web-utility-assets',
    // Without this, Vitest (which loads this same vite.config.js) can still trigger
    // closeBundle when it tears down its dev server — wiping docs/static/webutil/libs and
    // only partially restoring it, since Vitest never runs vite.optional.config.js's build.
    apply: 'build',
    closeBundle() {
      const destination = resolve('docs/static/webutil/libs');
      rmSync(destination, { recursive: true, force: true });
      mkdirSync(destination, { recursive: true });
      if (existsSync(resolve(bundleDist))) {
        cpSync(resolve(bundleDist), destination, { recursive: true });
      }
      // Vite's lib build only bundles JS entry points — hawk.css ships separately
      // (the "./css" export, matching lume's "./css": "./src/lume.css" convention)
      // and needs its own copy step here.
      if (existsSync(resolve('src/hawk.css'))) {
        cpSync(resolve('src/hawk.css'), resolve(destination, 'hawk.css'));
      }
      const pickrAssets = [
        ['node_modules/@simonwep/pickr/dist/pickr.min.mjs', 'pickr.min.mjs'],
        ['node_modules/@simonwep/pickr/dist/themes/nano.min.css', 'pickr-nano.min.css'],
      ];
      for (const [source, filename] of pickrAssets) {
        if (existsSync(resolve(source))) {
          cpSync(resolve(source), resolve(destination, filename));
        }
      }
      const brandingDestination = resolve('docs/static/webutil/assets/branding');
      mkdirSync(brandingDestination, { recursive: true });
      if (existsSync(resolve('branding/hawk-logo.svg'))) {
        cpSync(resolve('branding/hawk-logo.svg'), resolve(brandingDestination, 'hawk-logo.svg'));
      }
      const docsData = resolve('docs/data');
      mkdirSync(docsData, { recursive: true });
      cpSync(resolve('package.json'), resolve(docsData, 'package.json'));
    },
  };
}

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: false,
    sourcemap: true,
    target: 'es2015',
    lib: {
      entry: resolve(`src/${packageName}.js`),
      name: 'Hawk',
      fileName: packageName,
    },
    minify: false,
    rollupOptions: {
      output: [
        {
          format: 'umd',
          name: 'Hawk',
          dir: bundleDist,
          entryFileNames: `${packageName}.js`,
          exports: 'named',
          plugins: [terser({ format: { comments: true, preamble: banner } })],
        },
        {
          format: 'umd',
          name: 'Hawk',
          dir: bundleDist,
          entryFileNames: `${packageName}.min.js`,
          exports: 'named',
          plugins: [terser({ format: { comments: /^!/ }, compress: true, mangle: true })],
        },
        {
          format: 'umd',
          name: 'Hawk',
          dir: bundleDist,
          entryFileNames: `${packageName}.cjs`,
          exports: 'named',
          plugins: [terser({ format: { comments: true, preamble: banner } })],
        },
        {
          format: 'es',
          dir: bundleDist,
          entryFileNames: `${packageName}.mjs`,
          plugins: [terser({ format: { comments: true, preamble: banner } })],
        },
        {
          format: 'es',
          dir: bundleDist,
          entryFileNames: `${packageName}.esm.js`,
          plugins: [terser({ format: { comments: true, preamble: banner } })],
        },
        {
          format: 'es',
          dir: bundleDist,
          entryFileNames: `${packageName}.esm.min.js`,
          plugins: [terser({ format: { comments: /^!/ }, compress: true, mangle: true })],
        },
      ],
    },
  },
  test: {
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.js'],
      exclude: [
        '**/node_modules/**',
        'tests/**',
        'src/hawk-theme-typeflow.js',
        'src/hawk-animation-typeflow.js',
      ],
    },
  },
  plugins: [
    copy({
      targets: [
        { src: 'README-npm.md', dest: packageDist, rename: 'README.md' },
        {
          src: 'package.json',
          dest: packageDist,
          transform: (contents) => {
            const packageJson = JSON.parse(contents.toString());
            delete packageJson.scripts;
            delete packageJson.devDependencies;
            delete packageJson.files;
            return JSON.stringify(packageJson, null, 2);
          },
        },
        { src: 'src', dest: packageDist },
        { src: 'branding', dest: packageDist },
        { src: 'LICENSE', dest: packageDist },
        { src: 'jsr.jsonc', dest: packageDist },
      ],
      hook: 'writeBundle',
    }),
    stageWebUtilityAssets(),
  ],
});
