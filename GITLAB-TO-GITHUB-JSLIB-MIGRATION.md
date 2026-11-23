# GitLab → GitHub migration handoff for JavaScript libraries

Use this file as an implementation task for an agent in another library repository.
It covers both the initial migration and the follow-up fixes discovered in Hawk.
Evidence was reviewed on 2026-11-24, through Hawk commit `60a26ce`, including the registry
README investigation recorded below. Replace the examples with the destination
repository's identity and preserve its existing features and release contract.

## Instructions to the implementing agent

Implement and verify the applicable changes in this document. Inspect the target
repository and its history first; do not stop after writing a proposed plan.
Read its agent instructions, preserve unrelated edits, and follow its established
build and contribution conventions. Treat Hawk as a working reference, not a
template to copy without adaptation. Mark genuinely inapplicable tasks as such.

Preserve the original release body, package formats, plugins, source maps,
metadata, quality gates, and rerun behavior. Do not simplify those away during
the migration. Document each platform-specific replacement and any missing
external setting. Commit and push according to the user's existing instructions.
Publishing a new package version or moving existing tags must be within the
user's requested scope; a repository migration alone does not imply either.

## 1. Establish the target identity and original release behavior

Fill these values from the target checkout before editing:

| Value                                     | Meaning / Hawk example                                                |
| ----------------------------------------- | --------------------------------------------------------------------- |
| Old GitLab path                           | Original namespace/project, including any subgroups                   |
| GitHub owner/repo                         | `staticcanvas/hawk`                                                   |
| npm package                               | `@staticcanvas/hawk`; do not assume its scope equals the GitHub owner |
| JSR package                               | Read its actual manifest; it can differ from npm                      |
| Bundle stem and package staging directory | `hawk`, `dist/hawk`                                                   |
| Default / development branches            | `main`, `develop`; confirm actual PR direction                        |
| Workflow filename and release environment | `ci.yml`, `release`                                                   |
| Release tag convention                    | `v0.43.8-release`, optionally build metadata                          |
| Documentation URL and generator           | `https://staticcanvas.github.io/hawk/`, Hugo + Pagefind               |
| Logo and banner URLs                      | Verify the target library's assets individually                       |

Use `git log --all -- .gitlab-ci.yml` and `git show <pre-migration-commit>:.gitlab-ci.yml`
if the old pipeline is deleted. Read referenced scripts and templates at their
pinned revisions. Inventory every job, dependency, artifact, environment,
credential, trigger, and description heredoc. Write an old-step → new-step table
in the target's CI documentation before declaring parity.

## 2. Replace repository and documentation links correctly

Update both display text and destinations in `README.md`, `README-npm.md`,
contribution instructions, examples, docs content/templates, package metadata,
repository automation, release tooling, and generated package files.

| Old URL form                              | GitHub form                                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `https://gitlab.com/<old-path>`           | `https://github.com/<owner>/<repo>`                                                               |
| `.../-/issues`, `.../-/work_items`        | `.../issues`                                                                                      |
| `.../-/merge_requests`                    | `.../pulls`                                                                                       |
| New MR link with target branch parameters | `.../compare/<base>...<head>` or the repository's PR creation flow                                |
| `.../-/pipelines`                         | `.../actions` or `.../actions/workflows/<workflow>.yml`                                           |
| `.../-/releases/permalink/latest`         | `.../releases/latest`                                                                             |
| `.../-/tags`                              | `.../tags`                                                                                        |
| `.../-/blob/<ref>/<path>`                 | `.../blob/<ref>/<path>`                                                                           |
| `.../-/edit/<ref>/<path>`                 | `.../edit/<ref>/<path>`                                                                           |
| `.../-/commit/<sha>`                      | `.../commit/<sha>`                                                                                |
| GitLab raw file URL                       | `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>` or the verified shared asset host |
| `<namespace>.gitlab.io/<project>/`        | The configured GitHub Pages/custom-domain URL, preserving the project base path                   |

Do not simply replace `gitlab.com` with `github.com`: `/-/` paths, API URLs,
work-item links, and Pages hosts have different structures. Commit links remain
valid only if their commits exist in the destination history. Keep third-party
GitLab references and historical attribution when they remain correct.

Update clone commands, issue links, source links, service acknowledgements,
license links, and “merge request” wording where they describe the active host.
Check related StaticCanvas library links too, using each library's actual host.

## 3. Migrate badges and images

Preserve the project's chosen badge colors and style while replacing providers:

| Badge    | GitHub endpoint / destination                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------------------------- |
| License  | `img.shields.io/github/license/<owner>/<repo>` → repository `blob/<branch>/LICENSE`                              |
| Pipeline | `img.shields.io/github/actions/workflow/status/<owner>/<repo>/<workflow>.yml?branch=<branch>` → Actions workflow |
| Issues   | `img.shields.io/github/issues/<owner>/<repo>` → repository issues                                                |
| Release  | `img.shields.io/github/v/release/<owner>/<repo>` → releases/latest                                               |
| Tag      | `img.shields.io/github/v/tag/<owner>/<repo>` → tags                                                              |
| Codecov  | `codecov.io/gh/<owner>/<repo>/graph/badge.svg` → `codecov.io/gh/<owner>/<repo>`                                  |

Use `logo=github` and update alt text and badge labels. Remove GitLab-specific
runtime artifact badge links; Hawk replaced them with Actions status and run
timing. If another project needs equivalent SVG artifacts, account for that
explicitly rather than silently dropping its notification job.

Keep npm version/download/license badges, JSR badges, and jsDelivr badges tied to
the actual package identity. Migration does not rename the registry package.
Remove stale release-branch pins and empty token parameters from Codecov badges.

Hawk's observed image changes were:

- Main README: centered `https://bucket.s3.silvercottage.dev/logos/hawk/hawk-logo.svg`, width 128.
- npm README: `https://bucket.s3.silvercottage.dev/logos/hawk/dist/webp/hawk-banner-1024x410.webp`, 512 × 205.
- `.rivet/repo_config.json`: matching project logo/banner metadata instead of the old `r2os.staticcanvas.me` URL.

For another library, verify its own files exist and render, and retain its
approved layout. Do not invent an asset path by substituting a name and assuming
it is valid. Remove obsolete duplicate GitLab icons/links from docs headers and
footers; update accessible labels and the corresponding browser selectors.

## 4. Update package metadata and README publishing

- Set `package.json` `repository.url` to the GitHub Git URL, `bugs.url` to GitHub
  issues, and `homepage` to the actual documentation URL.
- Preserve package names, exports, module formats, peer dependencies, and license.
- Keep npm and JSR versions consistent when a version change is requested. Update
  lockfile/package staging metadata through the project's normal release tooling.
- Verify staged `package.json`, `jsr.json[c]`, and README files, not only root files.
- Preserve `README-npm.md` as the package documentation source. Copy it to
  `<package-stage>/README.md` for both registry uploads; the repository README can
  remain different. A nested `<package-stage>/README.md` inside a root npm package
  does not become the package's displayed README.
- Inspect an actual npm pack result. Its top-level `package/README.md` must match
  `README-npm.md`; declared entrypoints must exist at the paths in the packed
  manifest. Publishing the repository root can produce `package/dist/<lib>/...`
  while declaring `./dist/<lib>.cjs`, resulting in the wrong README and layout.
- Hawk's follow-up `scripts/check-package-readme.mjs` validates staged README,
  identity/version, and the actual npm pack file listing. It runs before artifact
  upload and after download; a root `prepublishOnly` lifecycle guard blocks the
  observed accidental root publication. Adapt this guard to the target package
  layout rather than forbidding root publication in projects that publish from root.
- Publish the validated staging directory or its validated tarball. Add a guard
  against accidentally publishing the repository root when it is not the intended
  package root. Retain checks after downloading CI artifacts as appropriate.
- In JSR, confirm README inclusion in `publish.include` and inspect the published
  version manifest and `/README.md` file. Then check the actual package Overview.
  A file being uploaded does not prove that the registry renders it.
- Set **JSR package Settings → Readme Source → Readme** when the desired Overview
  is the package README. JSR's default can prefer entrypoint module documentation.

Hawk evidence: npm `0.43.8` contained the repository README at package root and the
correct package README under `package/dist/hawk/README.md`. JSR `0.43.8` already
contained a byte-for-byte copy of `README-npm.md`, but its Overview showed generated
documentation. These are different problems; do not republish JSR unnecessarily
to fix a display setting. npm requires a new package version to update its
displayed README; moving Git tags or rerunning an already-published version does
not replace the npm package. See [npm README behavior](https://docs.npmjs.com/about-package-readme-files/)
and [JSR's Readme Source behavior](https://github.com/jsr-io/jsr/blob/main/frontend/docs/packages.md#documentation).

## 5. Update repository automation and generated content

- For Rivet projects, set `.rivet/repo_meta.json` `provider` to `github` and update
  project identity, documentation/image URLs, and CI path scopes in
  `.rivet/repo_config.json`. Include `.github/workflows/*.yml` and composite actions.
- Make generated README settings agree with the approved README layout so the
  next regeneration does not undo the migration.
- Inspect remaining GitLab provider blocks against the installed tool's schema.
  A legacy/default configuration block is not evidence of an active GitLab call;
  do not delete schema fields blindly.
- Correct source changelog/release-note links as appropriate, then regenerate
  `docs/data/changelog.json` and any other projections from the canonical source.
  Do not hand-edit generated JSON while leaving its generator unchanged.
- Check Vite staging hooks and dependency copies. Hawk needed normalization of
  old StaticCanvas host links in staged dependency comments. Apply a narrow,
  understood transformation at the copy step rather than repeatedly editing
  generated/minified files. Preserve licenses, attribution, and working mappings.
- Ignore generated release-data outputs in the correct locations. Remove obsolete
  GitLab download helpers only after replacing their consumers.

## 6. Replace CI while preserving all quality gates

Use `.github/workflows/ci.yml` and a shared setup action where appropriate. Adapt
commands to the target's actual scripts and staging directory. The required shape:

| Job                        | Required behavior                                                                                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint and unit checks       | PRs, main/development pushes, release tags, and manual validation                                                                                    |
| Browser checks, if present | Real built docs/demo, real search index if used; failure artifacts                                                                                   |
| Build / validate           | All bundles, size budget, versioned zip + tar.gz, package README/layout checks, docs-data validation, isolated JSR checks, Hugo render if applicable |
| Coverage                   | Release-tag run; upload with Codecov OIDC; failure blocks release                                                                                    |
| Release                    | Wait for lint, unit, browser, build, coverage; publish npm and JSR; create/update the GitHub release and its full asset set                          |
| Pages build/deploy         | Successful push to `main` only, after required checks; PRs, tags, and manual validation do not deploy                                                |

Use locked dependency installation (`npm ci --include=dev` in Hawk), a compatible
Node LTS runtime, pinned tools, timeouts, and suitable caches. Hawk pinned Node
24, Hugo Extended, and a matching Playwright image. Those exact versions are
historical reference values, not instructions to downgrade another repository.
Confirm current action/tool compatibility against official documentation when
implementing; keep package lockfile and browser image versions aligned.

Start with `contents: read`. Give the release job `contents: write` and
`id-token: write`, coverage OIDC its needed permission, and Pages deployment
`pages: write` plus `id-token: write`. Serialize releases and Pages deployments;
newer validation runs may cancel older validation, but tag publishing must not
be canceled halfway through.

Release tags must match the existing convention and package version. GitHub
trigger tag filters are globs; validate the full regex in a job. Hawk accepts
`^v?(\d+\.\d+\.\d+)-release(\+[a-zA-Z0-9.-]+)?$`, then compares the version,
including build metadata, with the manifests.

## 7. Preserve the release description and every downloadable asset

Extract the target's original release description heredoc/template. Keep its
sections and examples, changing platform/identity values where necessary.
Hawk's migration initially lost these and they had to be restored:

- Original title: `Release <package name> <version>`.
- Generated release notes, falling back to the root `release-notes.md`.
- Package links for npm and JSR using their actual package identities.
- Both Unpkg and jsDelivr links for ESM, UMD, minified ESM, and minified UMD.
- Browser script-tag and ESM import examples, pointing to files that exist.
- All core/optional bundles and source maps, plus versioned `.zip` and `.tar.gz`.
- Downloadable `release-notes.md`, `generic-package-links.json`,
  `generic-package-checksums.json`, and `SHA256SUMS`.

Keep the body template as a separate tracked file. Use a small, explicit renderer
with identity variables rather than an unrelated shortened body. Correct invalid
legacy registry URLs and verify the resulting links.

For Hawk's original note generation, the pinned PowerShell module selected five
commit-body categories: Notes, Feature Notes, Breaking Changes, Feature Additions,
and Feature Updates. It read `origin/main..HEAD` (`-AheadOnly`) and otherwise fell
back to root notes. The restoration preserved that contract and fetched full
history in the release job. Another project's generator or range can differ;
inspect it instead of imposing Hawk's range or converting it to an unrelated
conventional-commit generator. Retain GitHub links to the correct commits.

Use authenticated release listing to find existing drafts, or retain the release
ID returned when creating one. Upload via its returned upload URL and update by
ID. Hawk's `gh release create --draft` immediately followed by a fresh tag lookup
failed with `release not found`. Do not solve this by dropping assets or notes.
Publish a new draft only after every upload succeeds; reruns must resume drafts
and update existing releases without creating duplicates.

Generate actual SHA256 values and downloadable GitHub asset URLs in the JSON.
Include metadata and notes in `SHA256SUMS`, without circular/self checksums.
GitLab Generic Registry files must become real GitHub release attachments, not
just source archive links or stale GitLab package URLs. Source archives alone
do not contain the complete built distribution contract.

For reference only: Hawk has five bundle families × six formats × bundle/map,
two built archives, three metadata/notes files, and `SHA256SUMS`: 66 assets.
Compute the expected set for the target project; do not hardcode 66 elsewhere.

## 8. Connect the external services

Repository code changes cannot configure these services by themselves. Inspect
connected settings if access is available; otherwise report the exact outstanding
setting and destination. Do not claim a hosted release passed from local checks.

- **GitHub Actions:** enable workflows and configure the existing branch rules to
  require the intended check names, not obsolete GitLab or Jekyll checks.
- **GitHub Pages:** Settings → Pages → Build and deployment → Source = **GitHub
  Actions**. Do not publish raw Hugo `docs/` using the branch/Jekyll builder.
  Allow the production branch in the `github-pages` deployment environment.
- **Release environment / tag rules:** allow the intended release tag patterns
  and retain the repository's deployment protection policy.
- **npm:** configure the GitHub trusted publisher with exact owner, repository,
  workflow filename, and environment. The package `repository.url` must match.
  Use the supported hosted-runner/OIDC setup and compatible npm version.
- **JSR:** link the actual GitHub repository in package settings; publish with
  `id-token: write` and the pinned CLI. Set Readme Source as described above.
- **Codecov:** activate/link the GitHub repository and use its GitHub badge and
  OIDC upload instead of the old GitLab token setup.

Official setup references: [Pages source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow),
[npm trusted publishing](https://docs.npmjs.com/trusted-publishers/),
[JSR publishing](https://jsr.io/docs/publishing-packages#publishing-from-github-actions).

## 9. Keep publishing rerunnable

Publish the validated staged artifact. npm should skip an already-published
version; publish only after a genuine missing-version response. Authentication,
network, and registry failures must fail instead of being treated as “not found.”
JSR's pinned CLI supports existing-version handling; preserve it with OIDC.
Use npm provenance for the intended GitHub release flow where supported.

Keep isolated JSR dry-run and documentation-generation validation. A publish
dry-run alone previously missed a type-only peer-dependency resolution failure
that the registry's documentation pass rejected. Test the real exported modules
and use declared/versioned JSR type imports when necessary.

Registry versions already published are not replaced by moving Git tags. A
correction to published package contents may require a new version. Separate
that release decision from restoring GitHub attachments or editing a release body.

## 10. Migrate Hugo / Pagefind documentation and downloads

- Update `docs/hugo.toml` base URL and repository params, retaining custom domains
  and repository path prefixes. Update source/edit links, icons, and labels.
- Build the docs with the project's actual generator. For Hawk, preserve the
  complete `docs:build` chain: docs data, JS bundles, SCSS/theme CSS, Hugo, Pagefind.
- Use `configure-pages` output to set the production base URL, then upload the
  generated `public/` artifact and deploy that artifact.
- Fetch published GitHub releases/assets for downloads; paginate, exclude drafts
  and prereleases, preserve checksums, release notes, asset provenance/source URLs,
  and source zip/tar links. API failures must not silently erase the downloads list.
- Generate both the Hugo data file and any public JSON used by client code.
  Preserve a useful empty-repository fallback pointing to GitHub releases.
- Retain main-only Pages deployment. A push to main includes merged PRs and direct
  authorized pushes; it is not literally an event filter for merge commits only.
  A tag release alone does not refresh the deployed downloads page under this policy.

The Jekyll error `Liquid error ... wrong number of arguments` against Hugo
shortcodes means the wrong Pages builder is processing the source. Fix the Pages
source/workflow selection; do not rewrite valid Hugo templates into Liquid.

## 11. Preserve browser-test determinism where relevant

Hawk's browser fixes were required to make the migrated checks reproducible:

- Run snapshots and CI in the same official Playwright image, pinned by digest
  and matched to the lockfile. Install/use its expected browser and fonts.
- Generate and review new baselines in that environment. Keep assertion quality
  and pixel tolerance; do not weaken tests to hide rendering differences.
- Wait for real delayed focus/select behavior before filling inputs, and for
  hydration/index requests to settle before capture. Normalize volatile
  Git-derived dates only in the screenshot test, not production data.
- In a root-run browser container with a host-mounted workspace, trust the exact
  `$GITHUB_WORKSPACE` using Git `safe.directory` before Hugo reads Git history.
  Checkout's temporary Git configuration was not sufficient for this later step.
- Preserve failure screenshots, reports, and useful rendering/font metadata.
- Keep local test docs output isolated from a concurrently running production
  docs server. Hawk uses `public-e2e/` and a localhost base URL.

Apply these to existing browser tests; do not add a browser stack to a library
that does not have or need one merely to match Hawk.

## 12. Verify branch history and tags deliberately

Check actual PR head/base, mergeability, required checks, and linear-history
rules. A failed obsolete Pages check, a content conflict, and “rebaseable=false”
are distinct problems. Inspect before changing branch history.

If the user requests a rebase, back up the original tip, rebase onto the correct
base, compare the final tree with the original, and use an explicit
`--force-with-lease` when updating the rebased branch. Do not force-push unrelated
branches. Historical release tags normally remain on their original version
commits. If the user already rewrote tags and requests pushing them, compare
local/remote tag object IDs and push those exact targets; do not repoint old
version tags to the newest package version by assumption.

## 13. Acceptance checks and final handoff

Use existing project commands and add meaningful regression checks for migrated
release behavior. At minimum:

- [ ] Search remaining GitLab, old Pages/CDN/image URLs, GitLab Shields/Codecov,
      `/-/` links, obsolete release artifact badges, and CI env variables with `rg`.
      Classify historical/third-party/provider-schema matches instead of blanket deletion.
- [ ] Validate README links, badges, logos, contribution links, and generated headers.
- [ ] Check npm/JSR manifest identity and versions, staged README equality, packed
      file paths, and all public package entrypoints.
- [ ] Run lint, unit tests, build, size checks, release-artifact validation,
      isolated JSR validation, docs/search builds, and existing browser tests as applicable.
- [ ] Run `actionlint` against workflows and check formatting/diffs.
- [ ] Test release rendering, notes fallback, JSON URLs/checksums, new/existing
      drafts, upload failure behavior, and complete asset enumeration.
- [ ] Verify PRs validate without publishing or deploying, tags publish without
      deploying Pages, and successful main pushes alone deploy Pages.
- [ ] After an authorized real release, inspect the registry manifests/tarballs
      and rendered npm/JSR pages. An upload succeeding is not proof of the right README.
- [ ] Inspect the GitHub release's expected asset set, nonzero sizes, upload
      states, body, metadata links, and checksums. Download both built archives and
      metadata; verify their digests. Check the actual docs/downloads page after deployment.

Deliver a concise changed-file summary, an original-CI parity table, commands and
results, outstanding service settings, and commit/PR/run/release links when
available. State clearly which hosted operations were actually verified.

## Reference implementation and commit evidence

These are immutable Hawk references for adapting the implementation, not
requirements to copy its filenames or project-specific constants unchanged.

- [Original GitLab CI](https://github.com/staticcanvas/hawk/blob/f3fde5da49047ed5a628c922e89fc198b36c811e/.gitlab-ci.yml).
- [Completed reference tree](https://github.com/staticcanvas/hawk/tree/d17fd53):
  `.github/workflows/ci.yml`, `.github/actions/setup/action.yml`,
  `.github/release-body-template.md`, `.github/CI.md`,
  `scripts/generate-release-downloads.mjs`, `scripts/generate-release-metadata.mjs`,
  `scripts/publish-github-release.mjs`, `scripts/normalize-project-links.mjs`,
  `scripts/validate-release.mjs`, `scripts/check-jsr-package.mjs`, and their tests.
- [Registry README/layout validation](https://github.com/staticcanvas/hawk/blob/60a26ce/scripts/check-package-readme.mjs)
  and [regression tests](https://github.com/staticcanvas/hawk/blob/60a26ce/tests/package-readme.test.js),
  with the root publication guard and CI checks in that same commit.

| Commit                                                                                                                                                                                               | Evidence                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [`3e45b8b`](https://github.com/staticcanvas/hawk/commit/3e45b8b)                                                                                                                                     | Initial CI, registry, docs, and metadata migration                                |
| [`ccd5496`](https://github.com/staticcanvas/hawk/commit/ccd5496), [`5476d56`](https://github.com/staticcanvas/hawk/commit/5476d56)                                                                   | Correct asset paths, Rivet settings, README image layout                          |
| [`ef73a2e`](https://github.com/staticcanvas/hawk/commit/ef73a2e), [`5cae235`](https://github.com/staticcanvas/hawk/commit/5cae235), [`0d8d580`](https://github.com/staticcanvas/hawk/commit/0d8d580) | Screenshot stability, matching Playwright container, Git workspace trust          |
| [`2fa5dca`](https://github.com/staticcanvas/hawk/commit/2fa5dca)                                                                                                                                     | Remaining metadata/badge/docs links, staged dependency comments, obsolete helpers |
| [`90aa598`](https://github.com/staticcanvas/hawk/commit/90aa598)                                                                                                                                     | Main-only Pages deployment                                                        |
| [`dfb691e`](https://github.com/staticcanvas/hawk/commit/dfb691e)                                                                                                                                     | Release-ID upload/publish fix                                                     |
| [`d17fd53`](https://github.com/staticcanvas/hawk/commit/d17fd53)                                                                                                                                     | Historical body template, generated notes, JSON/notes assets, full parity audit   |

The reference release run `45170153030` passed. Hawk `v0.43.8-release` had all 66
expected assets verified, all 65 file checksums matched GitHub digests, and all
62 bundle/archive metadata links matched uploaded assets. Those counts describe
Hawk's distribution, not a universal acceptance count for other libraries.
