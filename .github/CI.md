# GitHub Actions

`workflows/ci.yml` replaces the GitLab pipeline. Pull requests, pushes to `main` and
`develop`, and manual runs check lint, unit tests, Chromium browser tests, bundle
budgets, release artifacts, JSR publish contents, and Hugo rendering. Dependencies
come from `npm ci` with an npm cache; Node 24 LTS and Hugo Extended are pinned in
`actions/setup/action.yml`. Jobs use GitHub-hosted Ubuntu runners. The browser job
runs inside the official Playwright 1.62.1 Noble image, pinned by digest in the
workflow, with its preinstalled Chromium, fonts, and rendering libraries.
Coverage, publishing, and Pages all require this browser job to pass.

## One-time service setup

- Enable Actions in `staticcanvas/hawk`.
- Set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.
  The `github-pages` environment must allow `main` and `*-release` / `*-release+*`
  tags. Pages builds use the URL returned by `configure-pages`, including a custom
  domain if one is configured.
- Create a `release` environment. Restrict it to the release tag patterns and add
  required reviewers if desired. Protect release tags with a repository ruleset
  so only release maintainers can create or update them.
- On npm, configure the trusted publisher for `@staticcanvas/hawk`: GitHub owner
  `staticcanvas`, repository `hawk`, workflow filename **`ci.yml`**, environment
  **`release`**. Replace the previous GitLab publisher. The repository URL in
  `package.json` must match this repository. No npm token is required.
- On JSR, link `@staticcanvas/hawk` to `staticcanvas/hawk` in the package settings
  and enable publishing from GitHub Actions. No `JSR_API_KEY` is required.
- Activate `staticcanvas/hawk` in Codecov's GitHub integration. The release
  coverage job authenticates with OIDC; no `CODECOV_TOKEN` is required.
- If branch rules require CI checks, select the new Actions check names: `lint`,
  `unit`, `browser`, and `Build and validate release`.

See [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/),
[JSR publishing](https://jsr.io/docs/publishing-packages), and
[GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Node 24 LTS avoids the Node 25 native `localStorage` global conflicting with the
current Vitest/jsdom browser storage mocks.

## Releases

Keep `package.json` and `jsr.jsonc` versions in sync, update `CHANGELOG.md` and
`release-notes.md`, and push a tag such as `v0.43.7-release` (or
`0.43.7-release`). An optional `+build.metadata` suffix must also match the package
version. Unsupported or mismatched tags fail validation before publishing.

After all checks and coverage upload succeed, the workflow publishes the validated
artifact to npm and JSR. It then creates a GitHub release, attaches every browser
bundle, source map, versioned zip/tar.gz archive, and a `SHA256SUMS` file. A new
release stays in draft until its assets finish uploading. Reruns skip existing
registry versions and update the existing GitHub release and assets.

Pages deploys on successful `main` pushes and successful releases. The downloads
page reads GitHub release assets, source archive links, and release notes through
`scripts/generate-release-downloads.mjs`. Drafts and prereleases are excluded;
an empty repository renders a link to GitHub Releases. Historical GitLab packages
are not copied automatically. The old PowerShell GitLab download helpers remain
available for accessing those historical packages but are no longer used by CI.

Publishing cannot be atomic across npm and JSR. If one succeeds and a later step
fails, fix the cause and rerun the failed jobs for the same tag. Releases are
serialized and never canceled by a newer run. Manual dispatch runs checks only;
it does not publish or deploy.

The old runtime SVG artifact badge is replaced by the Actions status badge and
GitHub's run timing display.

## Migration validation

Local validation on 2026-11-04 passed `actionlint`, ESLint, all 228 unit tests,
all 24 Chromium browser tests, coverage collection, all five bundle builds, the
size budget, archive validation, valid/invalid release-tag checks, JSR's isolated publish/documentation dry runs,
and Hugo/Pagefind builds. The GitHub release API successfully generated download
metadata. Publishing, Codecov upload, and Pages deployment require the service
settings above and have not been run from this checkout.

For local browser validation, install the same dependencies as CI with
`npx playwright install --with-deps chromium`. Missing Liberation fonts can widen
the search trigger beyond its 180px budget and change screenshot text metrics.
The original width failure disappears with these fonts; the assertion remains
unchanged. The screenshot test waits for index fragment requests to settle and
normalizes Git-derived result dates to `2000-01-01` before capture. Its reviewed
phone and tablet baselines retain real Pagefind results and the existing pixel
tolerance.

PR #2's browser artifacts showed a tablet screenshot mismatch (8,495 pixels).
Waiting for `open()`'s delayed focus/select callback removed the selected query,
but pinning Chromium hinting and disabling LCD text rendering was insufficient:
run `41853451061` still differed by 8,294 pixels. A generic Ubuntu installation
does not reproduce the hosted runner's complete rendering environment.

The browser job and screenshot generation now use the same digest-pinned
Playwright container. Keep its version aligned with `@playwright/test` in the
lockfile. Generate snapshots in that container with the Node/Hugo versions from
`actions/setup/action.yml`, run `npm ci --include=dev`, and use
`npm run test:e2e -- --grep 'maintained screenshots' --update-snapshots=all`.
Use a Linux filesystem checkout; for a bind-mounted checkout, Git must trust its
container path (`actions/checkout` configures this in CI). Review both images,
then run the complete browser suite without updating snapshots. The 1% pixel
tolerance remains unchanged. Screenshot artifacts include rendering metadata
with font load states, browser version, device scale, and dialog dimensions.
The pinned-image verification passed a fresh dependency install and site build,
all 24 browser tests, and three repeated screenshot tests. The regenerated
images matched the committed baselines, so no image changes were needed.

The shared bug knowledge base was unavailable during validation. The Node 25
storage compatibility, missing-font, rasterization, and delayed-focus findings
are documented here instead.
On this Windows-mounted checkout, Node's recursive bundle copy also returned
`EINVAL`; the builds and checks passed from an isolated Linux filesystem copy.
