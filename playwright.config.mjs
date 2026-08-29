import { defineConfig } from '@playwright/test';

const PORT = 4174;

/**
 * Real-browser end-to-end coverage, distinct from scripts/benchmark/'s Playwright config (which
 * only measures bundle-load performance). Runs against hawk's own docs site build — see
 * docs/content/_index.md: "This site's own search box ... is hawk searching itself — there's no
 * separate demo page, because dogfooding it here is the demo" — so `npm run test:e2e` first
 * builds hawk and the docs site with a `localhost` `baseURL` override (production `docs:build`'s
 * real GitLab Pages baseURL doesn't serve local test assets) and then exercises the actual
 * production mount in `docs/layouts/_default/baseof.html`, not a synthetic fixture.
 *
 * Builds into public-e2e/, not the real public/ — deliberately isolated from `npm run docs:build`
 * / `npm run docs:serve` output. A `hugo server` left running for local docs preview rebuilds
 * public/ on its own schedule with the real baseURL; sharing that directory raced this suite's
 * one-off baseURL override and intermittently clobbered it mid-run.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  webServer: {
    command: 'node scripts/benchmark/server.mjs',
    port: PORT,
    reuseExistingServer: !process.env.CI,
    cwd: process.cwd(),
    env: { BENCHMARK_PORT: String(PORT) },
  },
  use: {
    baseURL: `http://localhost:${PORT}/public-e2e/`,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
