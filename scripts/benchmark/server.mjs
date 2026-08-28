/**
 * @fileoverview Minimal static file server for the runtime benchmark fixtures.
 * @module scripts/benchmark/server
 *
 * Serves the repository root so fixture pages can load the local Hawk build via relative paths.
 * Started automatically by Playwright's `webServer` option in `playwright.config.mjs`.
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = process.cwd();
const PORT = Number(process.env.BENCHMARK_PORT ?? 4173);

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const filePath = normalize(join(ROOT, urlPath));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const stats = await stat(filePath);
    if (stats.isDirectory()) throw new Error('directory');
    const body = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': CONTENT_TYPES[extname(filePath)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Benchmark fixture server listening on http://localhost:${PORT}`);
});
