---
title: Hawk
description: Themeable, pluggable command-palette search for static sites.
category: Overview
---

## Overview

Hawk is a JS-embeddable search widget for static sites — `npm install` (or a `<script>` tag) and
a constructor call, no host markup beyond a trigger element required. It owns the DOM, keyboard
navigation, and result rendering; [Pagefind](https://pagefind.app/) owns indexing, ranking, and
typo-tolerant matching — hawk is Pagefind's own front end, exposing its filtering and
search-tuning options directly rather than hiding them behind a narrower API. Visual theme and
reveal animation are swappable plugins. (Hawk started as an extraction of typeflow's docs site
search — typeflow is one theme/animation pairing it ships with, not what it's limited to.)

This site's own search box (top of every page, or Ctrl+K) is hawk searching itself — there's no
separate demo page, because dogfooding it here is the demo.

## Where to start

- [Get started]({{< relref "/getting-started" >}}) — install, build a Pagefind index, mount hawk.
- [Theming]({{< relref "/guides/theming" >}}) — the token contract, `theme.tokens`, and how to
  write a new theme.
- [Animation plugins]({{< relref "/guides/animation-plugins" >}}) — the driver contract, the
  built-in typeflow and instant drivers, rotating placeholder text, and how to write your own.
- [Pagefind setup]({{< relref "/guides/pagefind-setup" >}}) — index scoping, dev-controlled tabs,
  and inline filter syntax.
- [Density and keyboard navigation]({{< relref "/guides/density-and-navigation" >}}) — layout
  presets, two-pane keyboard navigation, scrollbars, and initial popup state.
- [Pins, the built-in trigger, and attribution]({{< relref "/guides/pins-and-embedding" >}}).
- [API reference]({{< relref "/api" >}}) — full config, `HawkSearch` methods, and public state.
