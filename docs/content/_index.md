---
title: Hawk
description: Themeable, pluggable command-palette search widget for static sites.
category: Overview
hero:
  tagline: Pagefind-backed <strong>command-palette search</strong> you can <em>make match your site</em> — theme it, tab it, pin it, or use the defaults.
  install: npm install @staticcanvas/hawk
showcases:
  - id: compact
    label: Density
    title: Compact
    body: A focused single-column result list for smaller surfaces.
  - id: medium
    label: Density
    title: Medium
    body: Balanced spacing with results and live page preview side by side.
  - id: tabbed
    label: Navigation
    title: Tabbed
    body: Curated and filtered collections remain visible at a glance.
  - id: pinned
    label: Recall
    title: Pinned
    body: Saved and recently viewed pages stay close without another search.
features:
  - title: Pagefind-backed
    body: Chunked, lazily-loaded index with typo tolerance, scaling past a hand-rolled in-browser scorer — hawk owns the UI, Pagefind owns ranking.
  - title: Tabs, curated or auto-derived
    body: Auto-derived category pills by default, explicit tabs with full Pagefind filter power, a sort-based listing tab (e.g. "Recently updated"), or a tab list loaded from a JSON file.
  - title: Themeable to the token
    body: Every color, font, and scrollbar is a --hawk-* custom property. Ship a CSS file, or a few tokens inline with theme.tokens — no fork required.
  - title: Real page previews
    body: The preview pane fetches and renders the actual matched page — headings, code blocks, tables — not a short excerpt. A page-level match can break into a scannable section outline instead of a full dump.
  - title: Modal reveal animations
    body: Open/close animations include fade, scale-fade, slide-down, blur-zoom, spring, a custom animation, or none. Motion is instant when reduced motion is requested.
  - title: Fit, medium, or compact
    body: An in-modal density switcher, persisted per visitor, on top of scale/position/columns layout params.
  - title: Keyboard-first
    body: A real focus trap, two-pane Tab navigation, arrow-key scrolling, Ctrl/Cmd+K — accessible by default, not bolted on after the fact.
  - title: Pins and inline filters
    body: Visitors pin results for later, or type category:Guides directly into the search box — Pagefind's own filtering, exposed as a typed shortcut.
  - title: Zero-config to start
    body: One constructor call, a Pagefind index, and a trigger element get you a working search. Typeflow's typewriter and a built-in trigger button are opt-in.
---

This site's own search box (top of every page, or Ctrl+K) is hawk searching itself — there's no
separate demo page, because dogfooding it here is the demo.
