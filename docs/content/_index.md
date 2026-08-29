---
title: Hawk
description: Themeable, pluggable command-palette search widget for static sites.
category: Overview
hero:
  eyebrow: Search widget for static sites
  tagline: Pagefind-backed command-palette search you can actually make match your site — theme it, tab it, pin it, or leave every default exactly as it ships.
  install: npm install @staticcanvas/hawk
features:
  - title: Pagefind-backed
    body: Chunked, lazily-loaded index with typo tolerance, scaling past a hand-rolled in-browser scorer — hawk owns the UI, Pagefind owns ranking.
  - title: Dev-controlled tabs
    body: Auto-derived category pills by default, or explicit tabs with full Pagefind filter power — multi-dimension AND, multi-value OR, no translation layer.
  - title: Themeable to the token
    body: Every color, font, and scrollbar is a --hawk-* custom property. Ship a CSS file, or a few tokens inline with theme.tokens — no fork required.
  - title: Keyboard-first
    body: A real focus trap, two-pane Tab navigation, arrow-key scrolling, Ctrl/Cmd+K — accessible by default, not bolted on after the fact.
  - title: Pins and inline filters
    body: Visitors pin results for later, or type category:Guides directly into the search box — Pagefind's own filtering, exposed as a typed shortcut.
  - title: Zero-config to start
    body: One constructor call, a Pagefind index, and a trigger element get you a working search. Typeflow's typewriter and a built-in trigger button are opt-in.
---

This site's own search box (top of every page, or Ctrl+K) is hawk searching itself — there's no
separate demo page, because dogfooding it here is the demo.
