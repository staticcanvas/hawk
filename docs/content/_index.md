---
title: Hawk
description: Themeable, pluggable command-palette search widget for static sites.
category: Overview
tags:
  - search
  - pagefind
  - command palette
  - theming
  - typeflow
related:
  - /getting-started
  - /guides/theming
  - /themes
hero:
  tagline: Pagefind-backed <strong>command-palette search</strong> you can <em>make match your site</em> — theme it, tab it, pin it, or use the defaults.
  install: npm install @staticcanvas/hawk
features:
  - title: Pagefind-backed
    icon: search
    href: pagefind-setup/
    body: A <strong>chunked, lazily-loaded index</strong> with typo tolerance — Hawk owns the interface while <em>Pagefind preserves ranking</em>.
  - title: Tabs, curated or auto-derived
    icon: tabs
    href: api/#tabs
    body: Use <strong>auto-derived category pills</strong>, explicit Pagefind filters, a sorted listing such as <em>Recently updated</em>, or tabs loaded from JSON.
  - title: Themeable to the token
    icon: palette
    href: guides/theming/
    body: Colors, fonts, and scrollbars use <strong>--hawk-* custom properties</strong>. Supply CSS or <em>theme.tokens</em> without modifying Hawk source.
  - title: Real page previews
    icon: eye
    href: api/#rich-preview-content
    body: The preview pane fetches the <strong>matched page content</strong>, including headings, code, and tables. Page matches can render as a <em>section outline</em>.
  - title: Modal reveal animations
    icon: sparkles
    href: guides/animation-plugins/
    body: Open/close animations include <strong>fade, scale-fade, slide-down, blur-zoom, and spring</strong>, plus a custom animation or none. Motion is <em>instant under reduced motion</em>.
  - title: Fit, medium, or compact
    icon: layout
    href: guides/density-and-navigation/
    body: An in-modal <strong>density switcher</strong> persists the visitor's choice alongside <em>auto viewport-scaled modals</em>, position offsets, and column layouts.
  - title: Keyboard-first
    icon: keyboard
    href: api/#instance-methods
    body: A <strong>modal focus trap</strong>, two-pane <kbd>Tab</kbd> navigation, <kbd>↑</kbd>/<kbd>↓</kbd> movement, <kbd>Esc</kbd>, and <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>K</kbd> are included.
  - title: Pins and inline filters
    icon: pin
    href: guides/pins-and-embedding/
    body: Visitors can <strong>pin results</strong> or type <em>category:Guides</em> to apply Pagefind filtering from the query field.
  - title: Zero-config to start
    icon: rocket
    href: getting-started/
    body: Start with <strong>one constructor call</strong>, a Pagefind index, and a trigger. The TypeFlow driver and <em>built-in trigger</em> remain optional.
---

This site's own search box (top of every page, or <kbd>Ctrl</kbd>+<kbd>K</kbd>) is hawk searching itself -- Use Playground and Themes to further explore.
