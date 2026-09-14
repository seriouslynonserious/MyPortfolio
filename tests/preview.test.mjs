import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';

test('preview survives missing build files and serves the next completed build', async () => {
  const cwd = mkdtempSync(join(tmpdir(), 'portfolio-preview-'));
  const child = spawn(process.execPath, [resolve('scripts/preview.mjs')], {cwd, env:{...process.env, PREVIEW_PORT:'0'}});
  try {
    const origin = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Preview startup timeout')), 10000);
      child.once('error', e => {clearTimeout(timer); reject(e);});
      child.once('exit', code => {clearTimeout(timer); reject(new Error(`Preview exited ${code}`));});
      child.stdout.on('data', data => {const match = data.toString().match(/http:\/\/127\.0\.0\.1:\d+/); if(match){clearTimeout(timer); resolve(match[0]);}});
    });
    assert.equal((await fetch(origin)).status, 503);
    mkdirSync(join(cwd, 'dist/portfolio/browser'), {recursive:true});
    writeFileSync(join(cwd, 'dist/portfolio/browser/index.html'), '<h1>Build complete</h1>');
    const response = await fetch(origin);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Build complete/);
    assert.equal((await fetch(origin+'/missing.js')).status, 404);
    assert.equal((await fetch(origin, {method:'HEAD'})).status, 200);
  } finally {child.kill(); rmSync(cwd, {recursive:true, force:true});}
});
