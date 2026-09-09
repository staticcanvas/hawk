---
title: Changelog
description: Release history for @staticcanvas/hawk.
eyebrow: Resources
category: Resources
noToc: true
---

## Changelog

Full release history: [CHANGELOG.md](https://gitlab.com/staticcanvas/hawk/-/blob/main/CHANGELOG.md)
in the repository, following [Keep a Changelog](https://keepachangelog.com/en/1.0.0/). Hawk is
pre-1.0 and hasn't cut a tagged release yet — the versions there track `package.json`'s history,
not published tags.

- **Unreleased** — Hugo frontmatter mapping into Pagefind metadata/filters/sorts, configurable
  date and tag rows beneath result descriptions, indented anchor results, and independently
  configurable density/Escape header controls.
- **0.5.2** — fixed a real, confirmed reflected-XSS vulnerability (the typed search query reached
  `innerHTML` unescaped via `strings.noResults`).
- **0.5.1** — a real search-results race condition (`#searchGeneration`), a modal-chrome
  vertical-squish bug at narrow widths, a table/long-word overflow past the docs site's TOC, a
  header overflow at phone widths, and homepage hero/feature-grid alignment and parity polish.
- **0.5.0** — curated/sorted tabs (`HawkTab.sort`, e.g. a "Recently updated" listing) and loading
  a tab list from a JSON file (`config.tabsUrl`).
- **0.4.0** — section-outline previews, per-tab default previews, 5 built-in modal reveal
  animations, and a fix for empty-query result listings never actually populating against a real
  Pagefind index.
- **0.3.0** — theming depth (fonts, JS-only `theme.tokens`, themed scrollbars, mark-highlight
  tokens), a rotating placeholder, result/page metadata, powered-by attribution, the pin system,
  structured inline filter syntax, a built-in trigger element, the modal focus trap, and
  search/load error handling.
- **0.2.0** — dev-controlled tabs, `pagefindOptions`, density modes, two-pane keyboard
  navigation, and configurable initial popup state.
- **0.1.0** — initial extraction from typeflow's docs site search.
