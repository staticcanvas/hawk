---
title: Hawk
description: Themeable, pluggable command-palette search widget for static sites.
category: Overview
hero:
  tagline: Pagefind-backed <strong>command-palette search</strong> you can <em>make match your site</em> — theme it, tab it, pin it, or use the defaults.
  install: npm install @staticcanvas/hawk
features:
  - title: Pagefind-backed
    body: A <strong>chunked, lazily-loaded index</strong> with typo tolerance — Hawk owns the interface while <em>Pagefind preserves ranking</em>.
  - title: Tabs, curated or auto-derived
    body: Use <strong>auto-derived category pills</strong>, explicit Pagefind filters, a sorted listing such as <em>Recently updated</em>, or tabs loaded from JSON.
  - title: Themeable to the token
    body: Colors, fonts, and scrollbars use <strong>--hawk-* custom properties</strong>. Supply CSS or <em>theme.tokens</em> without modifying Hawk source.
  - title: Real page previews
    body: The preview pane fetches the <strong>matched page content</strong>, including headings, code, and tables. Page matches can render as a <em>section outline</em>.
  - title: Modal reveal animations
    body: Open/close animations include <strong>fade, scale-fade, slide-down, blur-zoom, and spring</strong>, plus a custom animation or none. Motion is <em>instant under reduced motion</em>.
  - title: Fit, medium, or compact
    body: An in-modal <strong>density switcher</strong> persists the visitor's choice alongside <em>auto viewport-scaled modals</em>, position offsets, and column layouts.
  - title: Keyboard-first
    body: A <strong>modal focus trap</strong>, two-pane Tab navigation, arrow-key movement, Escape, and <em>Ctrl/Cmd+K</em> are included.
  - title: Pins and inline filters
    body: Visitors can <strong>pin results</strong> or type <em>category:Guides</em> to apply Pagefind filtering from the query field.
  - title: Zero-config to start
    body: Start with <strong>one constructor call</strong>, a Pagefind index, and a trigger. The TypeFlow driver and <em>built-in trigger</em> remain optional.
---

This site's own search box (top of every page, or Ctrl+K) is hawk searching itself — there's no
separate demo page, because dogfooding it here is the demo.
