# Hawk release gate

This audit records the source, API, documentation, TypeFlow integration, and verification state for Hawk 0.11.0.

## Scope and evidence

The audit covered every JavaScript module under `src/`, the matching declaration files, the public API guide, TypeFlow guides, playground wiring, and the browser gallery. The following commands were run from the repository root:

| Gate | Result | Evidence |
| --- | --- | --- |
| Static lint | Pass | `npm run lint` |
| Unit/integration tests | Pass | `npm test` — 8 files, 181 tests |
| Bundle build | Pass | `npm run build` — core and four optional bundles |
| Bundle budget | Pass | `npm run check:size` — `hawk.min.js` 40,438 bytes / 11,602 gzip |
| Browser tests | Pass | `npm run test:e2e` — Hugo/Pagefind build and Playwright suite |
| Release artifact validation | Pass | `npm run validate:release` after creating the CI-equivalent zip and tar.gz archives |
| Formatting of changed test code | Pass | `npx prettier --check tests/e2e/hawk.spec.mjs` |

## Audit findings

### F-001 — Release blocker: none found

No failing logic, race, unsafe default, or TypeFlow interface mismatch was reproduced. The core uses the instant driver when no optional animation is registered, and registry selection, reduced-motion handling, preview loading, pin/recent storage, filtering, and responsive layout are covered by tests.

### F-002 — JSDoc completeness follow-up (low)

The exported `HawkAnimationInstant` object (`src/hawk-animation-instant.js:11-28`) and `HawkThemeTypeflow` object (`src/hawk-theme-typeflow.js:20-26`) are typed through module-level typedefs but do not document each exported method/property with individual `@param`/`@returns` tags. This does not affect runtime or generated declarations, but a future API-documentation pass should add method-level descriptions and use explicit DOM types instead of `Function` in the shared driver typedef.

### F-003 — Declaration/API drift watch (low)

`src/hawk-animation-typeflow.d.ts` correctly exposes the four TypeFlow option groups and the factory, while `docs/content/guides/animation-plugins.md` documents the same groups and defaults. Keep the declaration and guide changes in the same commit when TypeFlow adds a new option group.

### F-004 — Documentation coverage is complete for shipped features

The API guide documents constructor defaults, tabs, filtering, theming, preview sections, metadata, pins, recently viewed results, reveal animations, the built-in trigger, localization, debug, and metrics. The getting-started and animation guides cover both the zero-TypeFlow path and self-registration path. No shipped public option was found without either an API entry or a guide example.

## Verified invariants

- `DEFAULT_PARAMS` and the complete-defaults example agree for scale, position, offset, alignment, columns, breakpoint, density, and density toggling.
- TypeFlow defaults use the explicit `zoom-in-space` spatial style, 2 ms speed, left-to-right direction, and reduced-motion respect across title, content, and placeholder surfaces.
- The content adapter passes an allow-list to TypeFlow; the instant adapter writes synchronously and exposes the same driver methods.
- Theme and animation registration are optional. Loading the optional modules after `window.Hawk` self-registers them; core remains usable without TypeFlow.
- Search state transitions are observed by the debug/metrics adapters without changing Hawk's search implementation.

## Constrained follow-up epic

These are non-blocking maintenance tasks for a standard implementation model. Complete them in order, with the listed acceptance checks.

### E1. Strengthen animation-driver JSDoc

Add explicit method-level JSDoc to `HawkAnimationInstant`, introduce named DOM/string types for the driver interface, and mirror the descriptions in `src/hawk-animation-typeflow.d.ts`. Acceptance: `npm run lint`, `npm test`, and declaration review show no `Function`-typed public method.

### E2. Add declaration drift CI coverage

Add a small type-surface check that compares the TypeFlow option groups exported by the declaration file with the documented groups in `docs/content/guides/animation-plugins.md`. Acceptance: the check fails when a group is added to one surface but not the other, and `npm test` remains green.

### E3. Keep the release gate current

Run the complete command set in the evidence table for each release candidate and update this file with the exact counts and bundle sizes. Acceptance: no gate is marked pass without a reproducible command result.

## API/configuration reference

| Area | Authoritative source | Current default/interface |
| --- | --- | --- |
| Core layout | `src/hawk.js` `DEFAULT_PARAMS` | `scale: 1`, `position: top-center`, `columns: 2`, `breakpoint: 768`, `density: medium` |
| TypeFlow title/content | `src/hawk-animation-typeflow.js` | `zoom-in-space`, `speed: 2`, `direction: left`, reduced-motion respected |
| TypeFlow rotation | `src/hawk-animation-typeflow.js` | hold 3000 ms, pause 200 ms, end erase style |
| Public API | `src/hawk.d.ts`, `docs/content/api.md` | Constructor and plugin interfaces documented |
| Verification | `package.json` scripts | lint, unit, build, size, and browser gates above |
