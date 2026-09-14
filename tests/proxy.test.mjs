import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
const script = resolve('scripts/netlify-proxy.mjs');
function run(backend, check) {
  const cwd = mkdtempSync(join(tmpdir(), 'portfolio-proxy-'));
  try {
    mkdirSync(join(cwd, 'dist/portfolio/browser'), {recursive: true});
    const result = spawnSync(process.execPath, [script], {cwd, env: {...process.env, CLOUD_RUN_BACKEND: backend}});
    check(result, cwd);
  } finally { rmSync(cwd, {recursive: true, force: true}); }
}
test('production refuses an unset backend', () => run('', r => assert.notEqual(r.status, 0)));
test('API rewrite precedes SPA fallback', () => run('https://example.run.app', (r, cwd) => {
  assert.equal(r.status, 0);
  assert.equal(readFileSync(join(cwd, 'dist/portfolio/browser/_redirects'), 'utf8'), '/api/* https://example.run.app/api/:splat 200\n/* /index.html 200\n');
}));
test('rejects non-HTTPS and path-bearing backend values', () => {
  for (const url of ['http://example.com', 'https://example.com/path']) run(url, r => assert.notEqual(r.status, 0));
});
