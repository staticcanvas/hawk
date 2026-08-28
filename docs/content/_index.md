---
title: Hawk
description: Themeable, pluggable command-palette search for static sites.
category: Overview
---

## Overview

Hawk is a search modal extracted from typeflow's docs site search. It owns the DOM, keyboard
navigation, and result rendering; [Pagefind](https://pagefind.app/) owns indexing, ranking, and
typo-tolerant matching; visual theme and reveal animation are swappable plugins rather than
hardcoded choices.

This site's own search box (top of every page, or Ctrl+K) is hawk searching itself — there's no
separate demo page, because dogfooding it here is the demo.

## Where to start

- [Get started]({{< relref "/getting-started" >}}) — install, build a Pagefind index, mount hawk.
- [Theming]({{< relref "/guides/theming" >}}) — the token contract and how to write a new theme.
- [Animation plugins]({{< relref "/guides/animation-plugins" >}}) — the driver contract, the
  built-in typeflow and instant drivers, and how to write your own.
- [Pagefind setup]({{< relref "/guides/pagefind-setup" >}}) — the `data-pagefind-body` /
  `data-pagefind-ignore` scoping that makes match quality good.
- [API reference]({{< relref "/api" >}}) — full config, `HawkSearch` methods, and public state.
