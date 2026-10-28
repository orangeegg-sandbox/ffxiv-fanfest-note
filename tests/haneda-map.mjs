import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { once } from 'node:events';
import { createServer } from '../scripts/serve.mjs';
import { eventData } from '../data/events.js';
import { selectMap } from './map-controls.mjs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), headless: true, args: ['--no-sandbox'] });
const server = createServer({ base: '/fanfest/' });
server.listen(0, '127.0.0.1'); await once(server, 'listening');
const origin = `http://127.0.0.1:${server.address().port}/fanfest/`;
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'America/Los_Angeles' });
const page = await context.newPage();
await page.emulateMedia({ reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
let checks = 0;
const pass = message => { checks++; console.log(`PASS ${message}`); };
async function route(name, selector) {
  await page.evaluate(name => { location.hash = name; }, name);
  await page.locator(selector).first().waitFor();
}
async function assertMap(mapId) {
  assert.equal(await page.locator('#map-canvas').getAttribute('data-map-id'), mapId);
  assert.equal(await page.locator('#map-original').getAttribute('href'), eventData.maps.find(map => map.id === mapId).source);
}
try {
  await page.goto(origin + '#map');
  await page.locator('[role="tab"]').first().waitFor();
  await selectMap(page, 'hall1-3');
  await page.locator('.legend-row[data-activity="activity-nice-head"]').click();
  await page.locator('[data-zoom="25"]').click();
  await page.locator('[role="tab"][data-map-id="hall4-6"]').click();
  assert.equal(await page.locator('#zoom-label').innerText(), '100%');
  assert.equal(await page.locator('.map-pin.selected').count(), 0);
  assert.equal(await page.locator('#map-selection .map-prompt').count(), 1);
  for (const [key, destination] of [
    ['ArrowRight', 'hall7'], ['End', 'messe-entire'], ['ArrowRight', 'hall1-3'],
    ['ArrowLeft', 'messe-entire'], ['Home', 'hall1-3'],
  ]) {
    await page.keyboard.press(key);
    await assertMap(destination);
    const tab = page.locator(`[role="tab"][data-map-id="${destination}"]`);
    assert.equal(await tab.getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('[role="tab"][tabindex="0"]').count(), 1);
    assert.equal(await page.evaluate(() => document.activeElement.dataset.mapControl), `area-${destination}`);
  }
  for (const map of eventData.maps) {
    await selectMap(page, map.id);
    await assertMap(map.id);
    const venue = ['aeon', 'toyosuna'].includes(map.id) ? map.id : 'messe';
    assert.equal(await page.locator(`.map-venue-button[data-map-venue="${venue}"]`).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('.map-venue-button[aria-pressed="true"]').count(), 1);
    assert.equal(await page.locator('[role="tab"]').count(), venue === 'messe' ? 4 : 0);
  }
  pass('map tabs support arrows/Home/End, preserve keyboard focus, reset selections and expose all six maps through visible venue controls');

  for (const width of [320, 390, 640, 1280]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    for (const language of ['zh', 'ja']) {
      await page.locator(`[data-lang="${language}"]`).click();
      await selectMap(page, 'hall1-3');
      assert.equal(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth + 1), true, `${width}px ${language}: map overflow`);
      for (const control of await page.locator('.map-venue-button, [role="tab"][data-map-id]').all()) {
        const bounds = await control.boundingBox();
        assert.ok(bounds.width >= 44 && bounds.height >= 44, `${width}px ${language}: map target smaller than 44px`);
        assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width + 1, `${width}px ${language}: map choice outside viewport`);
        assert.equal(await control.evaluate(el => {
          const range = document.createRange(); range.selectNodeContents(el);
          const text = range.getBoundingClientRect(), target = el.getBoundingClientRect();
          return text.left >= target.left - 1 && text.right <= target.right + 1;
        }), true, `${width}px ${language}: map label extends beyond its target`);
      }
    }
  }
  pass('bilingual venue and slanted hall tabs fit 320px, 390px, 640px and desktop with visible 44px touch targets');

  for (const language of ['zh', 'ja']) {
    await page.locator(`[data-lang="${language}"]`).click();
    await route('transport', '#transport-haneda');
    const text = await page.locator('#main').innerText();
    assert.match(text, /羽田/);
    assert.doesNotMatch(text, /成田|Narita|空港第2ビル/);
    assert.match(text, /18:35/);
    assert.match(text, /22:45/);
    assert.match(text, /00:00/);
    assert.match(text, /11\s*\/\s*2|11月2日|11 月 2 日|11-02/);
    assert.match(text, /假設|暫定|仮定|仮の/);
    assert.match(text, /未確認|未確定/);
    assert.match(text, /1,500/);
    assert.match(text, /750/);
    assert.match(text, /京急|モノレール/);
    for (const terminal of ['T1', 'T2', 'T3']) assert.match(await page.locator('.bus-table thead').innerText(), new RegExp(terminal));
    assert.equal(await page.locator('#route-haneda-bus .bus-table').count(), 1);
    assert.deepEqual(await page.locator('.bus-table tbody tr').first().locator('th, td').allTextContents(), ['18:30', '18:35', '19:17', '19:22', '19:29']);
    assert.deepEqual(await page.locator('.bus-table tbody tr').last().locator('th, td').allTextContents(), ['22:45', '—', '23:20', '23:25', '23:32']);
    for (const width of [320, 390, 640, 1280]) {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
      assert.equal(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth + 1), true, `${width}px ${language}: transport overflow`);
    }
    await route('map', '.map-venue-button');
  }
  pass('Haneda guidance distinguishes last boarding points, all three terminal arrivals, and the provisional midnight-after-day-two scenario without retaining Narita assumptions');

  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
  });
  const status = await page.evaluate(() => new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => reject(new Error('Cache status timed out')), 5000);
    channel.port1.onmessage = event => { clearTimeout(timer); resolve(event.data); };
    navigator.serviceWorker.controller.postMessage({ type: 'CACHE_STATUS' }, [channel.port2]);
  }));
  assert.equal(status.ready, true);
  await context.setOffline(true);
  assert.equal((await page.reload()).status(), 200);
  await page.locator('.map-venue-button').first().waitFor();
  for (const map of eventData.maps) {
    await selectMap(page, map.id);
    await page.locator('#venue-map').evaluate(image => image.decode());
    await assertMap(map.id);
  }
  await route('transport', '#transport-haneda');
  assert.equal((await page.reload()).status(), 200);
  await page.locator('#route-haneda-bus .bus-table').waitFor();
  assert.match(await page.locator('#transport-haneda').innerText(), /羽田/);
  assert.deepEqual(errors, []);
  pass('new map controls, all six map images and Haneda guide work after complete offline reloads under a deployment subdirectory');
  console.log(`${checks} Haneda/map checks passed.`);
} finally {
  await context.close();
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
