---
title: Metrics
description: Headless counters and timings for a HawkSearch instance — Pagefind query stats, tab/pin usage, and session duration.
eyebrow: Guide
category: Guides
---

## What it does

`@staticcanvas/hawk/metrics` is an optional, headless module (no DOM of its own) that attaches
lightweight counters and timings to a HawkSearch instance:

- `opens` / `closes` / `destroys`, `totalOpenMs` — how much the palette actually gets used
- `queries`, `zeroResultQueries` / `zeroResultRate` — the core Pagefind health signal: how often
  this site's index fails a visitor
- `totalMatches` / `maxMatches` → `averageMatches` per query
- `selects` → `selectRate` (selects ÷ queries) — a rough proxy for "did results answer the question"
- `tabSwitches` total and `perTab` — which category/tab actually gets used
- `pinAdds` / `pinRemoves`, `errors`
- `lastQueryLatencyMs` / `averageQueryLatencyMs` — wall-clock between a query changing and its
  results settling, resolution-limited by `pollIntervalMs` (see below), not Pagefind's own timing

Like `@staticcanvas/hawk/debug`, it's non-invasive — `createHawkMetrics()` wraps the instance's
already-public methods/callbacks and polls the public `state` getter while the modal is open. It
renders nothing; draw a UI from `.snapshot()` yourself (the [Playground](/playground/) page's live
stats readout is a working example).

```js
import { HawkSearch } from '@staticcanvas/hawk';
import { createHawkMetrics } from '@staticcanvas/hawk/metrics';

const hawk = new HawkSearch({ index: '/pagefind/' });
const metrics = createHawkMetrics(hawk);

setInterval(() => {
  console.table(metrics.snapshot());
}, 5000);

// later
metrics.reset(); // clear counters, keep the instance running
metrics.dispose(); // restore hawk's original methods/callbacks entirely
```

## Options

| Option           | Default             | Description                                                         |
| ---------------- | -------------------- | --------------------------------------------------------------------- |
| `now`            | `performance.now`    | Clock override — useful in tests.                                     |
| `pollIntervalMs` | `150`                 | How often query/result/tab/pin/error changes are checked while open.  |
