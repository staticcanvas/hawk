# GitHub Actions

`workflows/ci.yml` runs on pull requests, pushes to `main` and
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
  The `github-pages` environment must allow `main`.
  Pages builds use the URL returned by `configure-pages`, including a custom
  domain if one is configured.
- Create a `release` environment. Restrict it to the release tag patterns and add
  required reviewers if desired. Protect release tags with a repository ruleset
  so only release maintainers can create or update them.
- On npm, configure the trusted publisher for `@staticcanvas/hawk`: GitHub owner
  `staticcanvas`, repository `hawk`, workflow filename **`ci.yml`**, environment
  **`release`**. The repository URL in
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
bundle, source map, versioned zip/tar.gz archive, `release-notes.md`,
`generic-package-links.json`, `generic-package-checksums.json`, and `SHA256SUMS`. A new
release stays in draft until its assets finish uploading. Reruns skip existing
registry versions and update the existing GitHub release and assets.
`scripts/publish-github-release.mjs` restores the original commit-body note
generation over `origin/main..HEAD`, falling back to the root `release-notes.md`
when there are no classified entries. The release checkout fetches full history.
It finds existing drafts in the authenticated releases list, then uploads and
publishes by release ID, avoiding another lookup by tag after draft creation.
The release body uses the extracted `.github/release-body-template.md`.
It also includes `README-npm.md` as the package description, as requested after
the template restoration. Release notes and the original package-link/usage
sections are retained.

`npm run check:package -- dist/hawk` verifies that the staged `README.md` matches
`README-npm.md`, the staged package identity/version matches the checkout, and
the npm pack listing contains the README and all declared entrypoints at the
correct paths. It runs before artifact upload and after artifact download.
The root `prepublishOnly` guard rejects accidental publication from the repository
root; publish the staged package with `npm publish ./dist/hawk` instead.

The npm `0.43.8` upload contained the repository README and nested
`dist/hawk` package files. A new version is required to replace that package and
update npm's rendered README. The JSR `0.43.8` uploaded README already matches
`README-npm.md`; use **package Settings → Readme Source → Readme** to display it
instead of entrypoint module documentation. These are separate registry issues.

Pages deploys after successful checks on pushes to `main`, including merged pull
requests. Pull request runs, release tags, and manual runs do not deploy. The downloads
page reads GitHub release assets, source archive links, and release notes through
`scripts/generate-release-downloads.mjs`. Drafts and prereleases are excluded;
an empty repository renders a link to GitHub Releases. Release assets must be
uploaded to GitHub Releases to appear on the downloads page. The obsolete
PowerShell package-download helpers have been removed.

Publishing cannot be atomic across npm and JSR. If one succeeds and a later step
fails, fix the cause and rerun the failed jobs for the same tag. Releases are
serialized and never canceled by a newer run. Manual dispatch runs checks only;
it does not publish or deploy.

The old runtime SVG artifact badge is replaced by the Actions status badge and
GitHub's run timing display.

## GitLab release parity audit (2026-11-23)

The source is [the last GitLab CI YAML before migration](https://github.com/staticcanvas/hawk/blob/f3fde5da49047ed5a628c922e89fc198b36c811e/.gitlab-ci.yml),
removed by `3e45b8b`. The body template was extracted from
`release:gitlab`'s `DESCRIPTION` heredoc. It retains the package sections,
all four CDN variants for both providers, and the UMD/ESM usage examples.
Only CI variable names and the obsolete `www.jsr.io/npm/.../v/...` URL were adapted.
The release title again uses `Release <package name> <version>`.

| Original step                                       | GitHub equivalent and audit result                                                                                                                                                                                                                                                                                                                                         |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Release tag rules and package version validation    | Release-tag filters and matching version validation are retained. The `release` environment and repository tag rules provide protection.                                                                                                                                                                                                                                   |
| `lint`, `test`, `test:e2e`                          | All retained and required before publishing; browser artifacts remain available on failure.                                                                                                                                                                                                                                                                                |
| Build, bundle budget, zip/tar.gz, one-week artifact | Retained in the build job and `release-package` artifact.                                                                                                                                                                                                                                                                                                                  |
| Artifact, docs, isolated JSR, and Hugo validation   | Retained. PowerShell syntax checks were removed with the GitLab-only download helpers.                                                                                                                                                                                                                                                                                     |
| Coverage and Codecov                                | Retained; GitHub OIDC replaces the GitLab token. Coverage must succeed before publishing.                                                                                                                                                                                                                                                                                  |
| Generic Registry upload of every bundle             | Replaced by GitHub release asset uploads of every built file, including all optional plugins and source maps.                                                                                                                                                                                                                                                              |
| npm existing-version check and trusted publishing   | Retained, with GitHub trusted publishing and provenance. Non-404 lookup failures stop publishing.                                                                                                                                                                                                                                                                          |
| JSR existing-version handling and publishing        | Retained through the pinned JSR CLI's existing-version handling; GitHub OIDC replaces the API key.                                                                                                                                                                                                                                                                         |
| Full history and `Get-ReleaseNotes -AheadOnly`      | Restored using the same `origin/main..HEAD` range and five selected commit-body categories: Notes, Feature Notes, Breaking Changes, Feature Additions, Feature Updates. The pinned source at `automator-devops` commit `cec29eddec3c78342c75d7b18360a8da61db158a` was inspected. Generated notes take precedence; root notes remain the fallback. Commit links use GitHub. |
| Download/checksum metadata JSON                     | Restored under the original filenames, with GitHub download URLs and SHA256 values. JSON covers the built bundles and archives; `SHA256SUMS` also covers the notes and JSON without circular self-checksums.                                                                                                                                                               |
| Generated notes artifact                            | Restored as a downloadable `release-notes.md` asset, as well as being included in the release body.                                                                                                                                                                                                                                                                        |
| Release body and create-or-update behavior          | Detailed template restored; existing drafts/releases are resumed by ID. A new release publishes after every asset upload succeeds.                                                                                                                                                                                                                                         |
| Serialized registry/release operations              | Retained through release concurrency and non-canceling tag runs.                                                                                                                                                                                                                                                                                                           |
| Pages on main and release tags                      | Main-only deployment is the user's explicit change. Hugo/Pagefind and live release-download metadata are retained.                                                                                                                                                                                                                                                         |
| Runtime SVG badge notification job                  | Removed in the GitHub migration; Actions status and run timing replaced it. This audit records that difference rather than adding the GitLab badge machinery back.                                                                                                                                                                                                         |

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
container path. The browser step explicitly trusts `$GITHUB_WORKSPACE` for
Hugo's Git-based modification dates: checkout's temporary Git configuration
does not cover Hugo running as root against the host-owned mount. Review both images,
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
