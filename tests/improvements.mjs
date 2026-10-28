import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { once } from 'node:events';
import { createServer } from '../scripts/serve.mjs';
import { appGuide } from '../data/apps.js';

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
const errors = [];
const failedRequests = [];
page.on('pageerror', error => errors.push(error.message));
context.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
let checks = 0;
const pass = message => { checks++; console.log(`PASS ${message}`); };
async function route(name, selector) {
  await page.evaluate(name => { location.hash = name; }, name);
  await page.locator(selector).first().waitFor();
}
async function noOverflow(label) {
  assert.equal(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth + 1), true, `${label}: document overflow`);
}
try {
  await page.goto(origin + '#schedule');
  await page.locator('.agenda-timeline').waitFor();
  assert.equal(await page.locator('.agenda-day').count(), 2);
  assert.equal(await page.locator('.agenda-timeline .event-row').count(), 12);
  assert.equal(await page.locator('[data-schedule-mode="agenda"]').getAttribute('aria-pressed'), 'true');
  await page.locator('[data-schedule-mode="chart"]').click();
  assert.equal(await page.locator('.chart-event').count(), 10);
  assert.equal(await page.locator('.chart-unbounded .event-row').count(), 2);
  assert.equal(await page.locator('.chart-event[data-chart-event="d1-live-report"]').count(), 0);
  assert.deepEqual(await page.locator('.chart-axis time').allTextContents(), Array.from({ length: 13 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00`));
  const keynoteBox = await page.locator('[data-chart-event="d1-keynote"]').boundingBox();
  const shortBox = await page.locator('[data-chart-event="d1-quick-qa"]').boundingBox();
  assert.equal(keynoteBox.height / shortBox.height, 4, 'Two-hour and half-hour blocks must preserve their duration ratio');
  await page.reload(); await page.locator('.timetable-chart').waitFor();
  assert.equal(await page.locator('[data-schedule-mode="chart"]').getAttribute('aria-pressed'), 'true');
  pass('agenda and proportional chart cover both days, separate broadcasts, preserve JST scale and remember view preference');

  await page.locator('[data-chart-event="d1-keynote"]').click();
  assert.match(await page.locator('#chart-detail').innerText(), /主題演講/);
  assert.match(await page.locator('#chart-detail').innerText(), /基調講演/);
  assert.equal(await page.locator('#chart-detail [data-calendar="d1-keynote"]').count(), 1);
  assert.equal(await page.locator('[data-chart-event="d1-keynote"]').getAttribute('aria-expanded'), 'true');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'chart-detail');
  await page.locator('#chart-detail [data-save="d1-keynote"]').click();
  assert.equal(await page.locator('#chart-detail [data-save="d1-keynote"]').getAttribute('aria-pressed'), 'true');
  await page.locator('#saved-filter').click();
  assert.equal(await page.locator('.chart-event').count(), 1);
  await page.locator('#saved-filter').click();
  await page.locator('#event-search').fill('鋼琴');
  assert.equal(await page.locator('.chart-event').count(), 1);
  assert.equal(await page.locator('.chart-event').getAttribute('data-chart-event'), 'd1-piano');
  await page.locator('#event-search').fill('');
  await page.locator('#date-filter').selectOption('2026-11-01');
  assert.equal(await page.locator('.chart-event').count(), 5);
  assert.equal(await page.locator('.chart-unbounded .event-row').count(), 1);
  await page.locator('#date-filter').selectOption('');
  pass('chart selection exposes full details and actions; bookmarks, search and date filters retain correct chart content');

  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    for (const language of ['zh', 'ja']) {
      await page.locator(`[data-lang="${language}"]`).click();
      await noOverflow(`${width}px ${language} chart`);
      if (width < 600) {
        const before = await page.locator('.chart-axis').boundingBox();
        await page.locator('.chart-scroll').evaluate(el => { el.scrollLeft = el.scrollWidth; });
        const after = await page.locator('.chart-axis').boundingBox();
        assert.ok(Math.abs(before.x - after.x) < 1, 'Time axis must remain visible when day columns scroll');
        await page.locator('.chart-scroll').evaluate(el => { el.scrollLeft = 0; });
      }
      await page.locator('[data-schedule-mode="agenda"]').click();
      await noOverflow(`${width}px ${language} agenda`);
      assert.equal(await page.locator('.agenda-timeline .event-row').count(), 12);
      await page.locator('[data-schedule-mode="chart"]').click();
    }
  }
  pass('both timetable modes fit 320px, 390px and desktop in both languages; mobile chart keeps its time axis pinned');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('[data-lang="zh"]').click();
  await route('activities', '[data-activity-view="events"]');
  await page.locator('#activity-activity-eddas-bag > summary').click();
  const edda = page.locator('#activity-activity-eddas-bag');
  assert.deepEqual(await edda.locator('.activity-hours dt').allTextContents(), ['10/31', '11/1']);
  assert.match(await edda.locator('.activity-hours dd').first().innerText(), /20:45/);
  assert.match(await edda.locator('.activity-hours dd').nth(1).innerText(), /18:30/);
  assert.ok(await edda.locator('.activity-conditions li').count() >= 3);
  assert.equal(await edda.locator('.activity-description .reading-copy p').count(), 2);
  await page.locator('#activity-activity-chocobo-race-vr > summary').click();
  assert.match(await page.locator('#activity-activity-chocobo-race-vr .activity-conditions').innerText(), /1,100/);
  assert.match(await page.locator('#activity-activity-chocobo-race-vr .activity-conditions').innerText(), /100kg/);
  await noOverflow('expanded activity details');
  pass('activity details separate day-specific hours and cutoffs, retain prices/restrictions, and split descriptions into readable paragraphs');

  await page.locator('[data-activity-view="apps"]').click();
  assert.equal(await page.locator('#apps-required .app-entry').count(), 3);
  assert.equal(await page.locator('#apps-optional .app-entry').count(), 2);
  assert.equal(await page.locator('#apps-browser .app-entry').count(), 1);
  assert.match(await page.locator('#app-square-enix-app').innerText(), /日本 App Store／Google Play/);
  assert.match(await page.locator('#app-square-enix-app').innerText(), /截圖及列印皆無效/);
  assert.match(await page.locator('#app-instax-print .app-scope').innerText(), /僅列印/);
  assert.match(await page.locator('#app-mystery-line-x .app-scope').innerText(), /AEON/);
  const activityApps = await page.locator('.app-guide').innerText();
  for (const app of [...appGuide.required, ...appGuide.optional, ...appGuide.browserTools]) {
    for (const link of app.links) assert.equal(await page.locator(`#app-${app.id} .guide-links a`).filter({ hasText: link.label.zh }).getAttribute('href'), link.url);
  }
  await page.locator('[data-jump="apps-optional"]').click();
  assert.equal(await page.evaluate(() => document.activeElement.id), 'apps-optional');
  await page.locator('#app-instax-print [data-location]').click();
  await page.locator('#map-canvas[data-map-id]').waitFor();
  assert.equal(await page.locator('#map-canvas').getAttribute('data-map-id'), 'hall1-3');
  assert.match(await page.locator('#map-selection').innerText(), /instax/);
  await page.locator('#map-selection [data-open-apps]').click();
  await page.locator('#apps-required').waitFor();
  await route('tldr', '[data-tldr-view="apps"]');
  await page.locator('[data-tldr-view="apps"]').click();
  assert.equal(await page.locator('.app-guide').innerText(), activityApps);
  pass('Activities and TLDR share required/optional/browser app guidance, official download links, and working activity-map links');

  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    for (const language of ['zh', 'ja']) {
      await page.locator(`[data-lang="${language}"]`).click();
      await noOverflow(`${width}px ${language} app guide`);
      await route('transport', '.transport-guide');
      await noOverflow(`${width}px ${language} transport`);
      assert.equal(await page.locator('#navigation a[href="#map"]').getAttribute('aria-current'), 'page');
      const transport = await page.locator('.transport-guide').innerText();
      assert.match(transport, /18:35/);
      assert.match(transport, /22:45/);
      assert.match(transport, /羽田/);
      assert.doesNotMatch(transport, /成田|空港第2ビル/);
      assert.match(transport, /京急|モノレール/);
      await route('tldr', '[data-tldr-view="apps"]');
    }
  }
  pass('bilingual app and transport guides fit phones/desktops and explain Haneda terminal arrivals, distinct last buses and rail transfers');

  // A failed installation leaves serviceWorker.ready pending indefinitely.
  // Bound the wait and report installation/cache state instead of hanging CI.
  try {
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), undefined, { timeout: 30000 });
  } catch (cause) {
    const workerState = await page.evaluate(async () => ({
      registrations: (await navigator.serviceWorker.getRegistrations()).map(registration => ({
        scope: registration.scope,
        installing: registration.installing?.state ?? null,
        waiting: registration.waiting?.state ?? null,
        active: registration.active?.state ?? null,
      })),
      caches: await Promise.all((await caches.keys()).map(async name => ({ name, entries: (await (await caches.open(name)).keys()).length }))),
      offlineIndicator: document.querySelector('#footer-offline')?.textContent,
    }));
    throw new Error(`Service worker did not control the page within 30s: ${JSON.stringify({ workerState, failedRequests, errors })}`, { cause });
  }
  const status = await page.evaluate(() => new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => reject(new Error('Cache status timed out')), 5000);
    channel.port1.onmessage = event => { clearTimeout(timer); resolve(event.data); };
    navigator.serviceWorker.controller.postMessage({ type: 'CACHE_STATUS' }, [channel.port2]);
  }));
  assert.equal(status.ready, true);
  await context.setOffline(true);
  await route('transport', '.transport-guide');
  assert.equal((await page.reload()).status(), 200);
  await page.locator('.transport-guide').waitFor();
  assert.match(await page.locator('.transport-guide').innerText(), /羽田/);
  for (const file of ['ui/schedule.js', 'ui/preparation.js', 'data/apps.js', 'data/transport.js', 'schedule.css', 'guide.css']) {
    const response = await page.evaluate(async file => { const res = await fetch('./' + file); return { status: res.status, length: (await res.text()).length }; }, file);
    assert.equal(response.status, 200, `${file} unavailable offline`);
    assert.ok(response.length > 0);
  }
  await route('activities', '[data-activity-view="apps"]');
  await page.locator('[data-activity-view="apps"]').click();
  assert.equal(await page.locator('#apps-required .app-entry').count(), 3);
  await route('schedule', '[data-schedule-mode="chart"]');
  assert.equal(await page.locator('.chart-event').count(), 10);
  assert.deepEqual(errors, []);
  pass('new timetable, app and transport modules remain available after a complete offline reload under a deployment subdirectory');
  console.log(`${checks} improvement checks passed.`);
} finally {
  await context.close();
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
