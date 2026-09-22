---
title: Debug
description: Console diagnostics for a HawkSearch instance's open/close/query/select lifecycle, optionally routed through StaticCanvas Logcad.
eyebrow: Guide
category: Guides
tags:
  - debug
  - console diagnostics
  - logging
  - troubleshooting
related:
  - /guides/metrics
  - /api
---

## What it does

`@staticcanvas/hawk/debug` is an optional, opt-in module that logs a HawkSearch instance's
lifecycle to the console: opens, closes, `setParams()` calls, selections, and — while the modal is
open — query changes, settled results (including zero-result queries), tab switches, pin count
changes, and Pagefind load errors.

It's non-invasive: `createHawkDebug()` wraps the instance's already-public methods and callbacks
(`open`, `close`, `destroy`, `setParams`, `onSelect`) rather than requiring any change to how you
construct `HawkSearch`. Query/result/tab/pin/error events are observed by polling the public
`state` getter while the modal is open, since Pagefind's own search call is a private
implementation detail hawk.js doesn't expose a hook for — these are reported at `pollIntervalMs`
resolution (default 150ms), not the instant they actually happen.

```js
import { HawkSearch } from '@staticcanvas/hawk';
import { createHawkDebug } from '@staticcanvas/hawk/debug';

const hawk = new HawkSearch({ index: '/pagefind/' });
const debug = createHawkDebug(hawk);

// later
debug.setEnabled(false); // pause logging without removing the wrapper
debug.dispose(); // restore hawk's original methods/callbacks entirely
```

## Logcad, or a console fallback

If [`@staticcanvas/logcad`](https://gitlab.com/staticcanvas/logcad) is installed, every event
routes through its `logd()` for styled, filterable console output. If it isn't, `createHawkDebug`
falls back to plain styled `console.*` calls — debugging works out of the box either way.

```js
// with logcad installed, this is all that's needed for styled output:
import '@staticcanvas/logcad';
import { createHawkDebug } from '@staticcanvas/hawk/debug';

createHawkDebug(hawk, { label: 'Docs Search', trace: false });
```

## Options

| Option           | Default   | Description                                                            |
| ---------------- | --------- | ------------------------------------------------------------------------ |
| `enabled`        | `true`    | Whether logging starts on.                                              |
| `label`          | `'Hawk'`  | Name shown in each log entry.                                           |
| `trace`          | `false`   | Include a call-stack trace with each entry (logcad path only).          |
| `pollIntervalMs` | `150`     | How often query/result/tab/pin/error changes are checked while open.    |

See it live on the [Playground](/playground/) page — toggle Debug on and open devtools console.
