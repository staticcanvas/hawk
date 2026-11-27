<!-- rivet:release-notes:start -->

# Hawk 0.43.9

## Fixed

- Publish the staged npm package with the package README and entrypoints at the correct paths. Reject accidental publication from the repository root and validate artifacts before and after transfer.
- Apply `setParams({ allowDensityToggle })` immediately so an existing search instance can hide and restore its size controls without losing the selected density.

## Changed

- Add opt-in background search preloading after page load, with shared initialization, cancellation on destruction, and retry after a speculative failure.
- Allow individual Fit, Medium, and Compact buttons to be omitted through `headerControls.density`; keep the existing defaults and add playground controls for each choice.
- Refine the size switcher, theme state colors, preview surfaces, shadows, and scrollbars while retaining existing palettes.
- Include `README-npm.md` in the GitHub release description alongside release notes, package links, and usage examples.
- Complete animation/theme method documentation and add checks that keep npm declarations, JSR declarations, the implementation contract, and the animation guide aligned.
- Add a reusable GitLab-to-GitHub JavaScript library migration handoff.

<!-- rivet:release-notes:end -->
