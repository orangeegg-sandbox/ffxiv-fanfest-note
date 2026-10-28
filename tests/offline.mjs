import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import { existsSync } from 'node:fs';
import { mkdtemp, copyFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createServer } from '../scripts/serve.mjs';
import { eventData } from '../data/events.js';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const executablePath = process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined);
const browser = await chromium.launch({ executablePath, headless: true, args: ['--no-sandbox'] });
let checks = 0;
try {
  for (const base of ['/', '/fanfest/']) {
    const server = createServer({ base });
    server.listen(0, '127.0.0.1'); await once(server, 'listening');
    const url = `http://127.0.0.1:${server.address().port}${base}`;
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      assert.equal((await page.goto(url)).status(), 200);
      await page.evaluate(async () => {
        await navigator.serviceWorker.register('./sw.js');
        await navigator.serviceWorker.ready;
        if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
      });
      const status = await page.evaluate(() => new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        const timer = setTimeout(() => reject(new Error('Service worker status timed out')), 5000);
        channel.port1.onmessage = event => { clearTimeout(timer); resolve(event.data); };
        navigator.serviceWorker.controller.postMessage({ type: 'CACHE_STATUS' }, [channel.port2]);
      }));
      assert.equal(status.type, 'CACHE_READY');
      assert.equal(status.ready, true);
      const officialAssets = eventData.sourceStatus === 'verified' ? [
        'data/stages.js', 'data/activities.js',
        ...eventData.maps.map(map => map.src.replace(/^\.\//, '')),
        'assets/summary/summary-zh.png', 'assets/summary/summary-ja.png'
      ] : [];
      assert.ok(status.files >= 8 + officialAssets.length);
      checks++;
      await context.setOffline(true);
      assert.equal((await page.reload()).status(), 200);
      await page.locator('h1').waitFor();
      assert.match(await page.locator('h1').innerText(), /FanFest/);
      for (const name of ['app.js', 'styles.css', 'data/events.js', 'manifest.webmanifest', 'icons/icon.svg', 'fonts/guide-serif-zh.woff', 'fonts/guide-serif-ja.woff', ...officialAssets]) {
        const response = await page.evaluate(async name => {
          const result = await fetch(`./${name}`);
          return { status: result.status, length: (await result.arrayBuffer()).byteLength };
        }, name);
        assert.equal(response.status, 200, `${base}${name} unavailable offline`);
        assert.ok(response.length > 0);
      }
      assert.equal(await page.locator('body').evaluate(el => el.scrollWidth <= window.innerWidth), true, 'Mobile horizontal overflow');
      if (eventData.sourceStatus === 'verified') {
        for (const route of ['schedule', 'activities', 'map', 'tldr']) {
          await page.locator(`#navigation a[href="#${route}"]`).click();
          await page.locator('h1').waitFor();
          assert.equal(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth), true, `Offline ${route} overflow`);
        }
      }
      assert.deepEqual(errors, []);
      checks++;
      console.log(`PASS ${base}: complete cache and offline reload at 390px`);
    } finally {
      await context.close();
      await new Promise(resolve => server.close(resolve));
    }
  }
  // Verify a missing required asset cannot turn into a false "offline ready".
  const incomplete = await mkdtemp(path.join(tmpdir(), 'fanfest-incomplete-'));
  await copyFile(new URL('../sw.js', import.meta.url), path.join(incomplete, 'sw.js'));
  await writeFile(path.join(incomplete, 'index.html'), '<!doctype html><title>Cache failure fixture</title>');
  const failureServer = createServer({ directory: incomplete });
  failureServer.listen(0, '127.0.0.1'); await once(failureServer, 'listening');
  const failureContext = await browser.newContext();
  try {
    const page = await failureContext.newPage();
    await page.goto(`http://127.0.0.1:${failureServer.address().port}/`);
    const active = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.register('./sw.js');
      const worker = registration.installing;
      if (worker && worker.state !== 'redundant') await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Failed installation did not settle')), 10000);
        worker.addEventListener('statechange', () => {
          if (worker.state === 'redundant') { clearTimeout(timer); resolve(); }
        });
      });
      return Boolean(registration.active || navigator.serviceWorker.controller);
    });
    assert.equal(active, false);
    checks++;
    console.log('PASS incomplete download: service worker never activates');
  } finally {
    await failureContext.close();
    await new Promise(resolve => failureServer.close(resolve));
    await rm(incomplete, { recursive: true, force: true });
  }
  console.log(`${checks} offline checks passed.`);
} finally { await browser.close(); }
