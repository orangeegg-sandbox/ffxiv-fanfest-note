import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { once } from 'node:events';
import { createServer } from '../scripts/serve.mjs';

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
const ids = ['d1-piano', 'd2-primals'];
const guide = id => page.locator(`.agenda-timeline [data-concert-id="${id}"]`);
async function route(name, selector) {
  await page.evaluate(name => { location.hash = name; }, name);
  await page.locator(selector).first().waitFor();
}
async function expand(item) {
  const details = item.locator('.concert-details');
  if (!await details.evaluate(element => element.open)) await details.locator('summary').click();
}
try {
  await page.goto(origin + '#schedule');
  await page.locator('.agenda-timeline').waitFor();
  assert.equal(await page.locator('.agenda-timeline [data-concert-id]').count(), 2);
  for (const language of ['zh', 'ja']) {
    await page.locator(`[data-lang="${language}"]`).click();
    for (const id of ids) {
      const item = guide(id);
      const facts = item.locator('.concert-quick-facts');
      assert.match(await facts.innerText(), /未公布|公表されていません/);
      assert.doesNotMatch(await facts.locator('dd').first().innerText(), /\b\d{1,2}:\d{2}\b/, 'A precise queue opening time must not be invented');
      assert.match(await facts.innerText(), /有效|有効/);
      assert.match(await facts.innerText(), /指定席/);
      assert.match(await facts.innerText(), /取消|取りやめ/);
      assert.match(await facts.innerText(), /自由席/);
      await expand(item);
      const text = await item.innerText();
      assert.match(text, /西広場受付/);
      assert.match(text, /海浜幕張/);
      assert.match(text, /紫/);
      assert.match(text, /早上|朝の/);
      assert.match(text, /一般入場|会場入場/);
      assert.match(text, /兩日通票|2日通し券/);
      assert.match(text, /截圖|スクリーンショット/);
      assert.match(text, /快速合照|クイックフォト/);
      assert.match(text, /付費直播|有料配信/);
      assert.match(text, /不清場|入れ替えなし/);
      assert.equal(await item.locator('.concert-sources a[href$="news/stage-update/"]').count(), 1);
      const row = item.locator('xpath=ancestor::article[1]');
      const time = await row.locator('.event-time').innerText();
      assert.match(time, id === 'd1-piano' ? /19:30/ : /19:00/);
      assert.match(time, /20:30/);
    }
    assert.match(await guide('d1-piano').innerText(), /坐著|座って/);
    assert.match(await guide('d2-primals').innerText(), /原地站立|自分の場所で立ち上がれ/);
    const airport = await guide('d2-primals').locator('.concert-airport-note').innerText();
    assert.match(airport, /19:15/); assert.match(airport, /00:00/);
    assert.match(airport, /暫定|仮プラン/); assert.match(airport, /重疊|重な/);
    assert.equal(await guide('d1-piano').locator('.concert-airport-note').count(), 0);
  }
  pass('both concert entries preserve show times, state unpublished queue times and cancelled seat add-ons, and explain distinct seating, admission, photo and flight-planning rules in both languages');

  await page.locator('[data-lang="zh"]').click();
  const pianoFacts = await guide('d1-piano').locator('.concert-quick-facts').innerText();
  await page.locator('[data-schedule-mode="chart"]').click();
  await page.locator('[data-chart-event="d1-piano"]').click();
  assert.equal(await page.locator('#chart-detail [data-concert-id="d1-piano"] .concert-quick-facts').innerText(), pianoFacts);
  await page.locator('#chart-detail [data-save="d1-piano"]').click();
  await route('list', '[data-concert-id="d1-piano"]');
  await page.reload(); await page.locator('[data-concert-id="d1-piano"]').waitFor();
  assert.equal(await page.locator('[data-concert-id]').count(), 1);
  const saved = page.locator('.event-row').filter({ has: page.locator('[data-concert-id="d1-piano"]') });
  assert.equal(await saved.locator('.concert-quick-facts').innerText(), pianoFacts);
  await saved.locator('[data-location="main-stage"]').click();
  await page.locator('#map-canvas[data-map-id="hall4-6"]').waitFor();
  assert.equal(await page.locator('.map-pin.selected').count(), 1);
  await route('schedule', '[data-schedule-mode="agenda"]');
  await page.locator('[data-schedule-mode="agenda"]').click();
  pass('concert guidance is shared by chart details and persisted saved events, and its stage link selects the correct Hall 4–6 map');

  for (const width of [320, 390, 640, 1280]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    for (const language of ['zh', 'ja']) {
      await page.locator(`[data-lang="${language}"]`).click();
      for (const id of ids) {
        const item = guide(id);
        await expand(item);
        const summary = await item.locator('.concert-details > summary').boundingBox();
        assert.ok(summary.height >= 44 && summary.width >= 44, `${width}px ${language}: concert disclosure target too small`);
        for (const image of await item.locator('.concert-map img').all()) {
          await image.scrollIntoViewIfNeeded();
          const dimensions = await image.evaluate(async image => { await image.decode(); return [image.naturalWidth, image.naturalHeight]; });
          assert.deepEqual(dimensions, [3840, 2160]);
        }
      }
      assert.equal(await page.locator('body').evaluate(body => body.scrollWidth <= innerWidth + 1), true, `${width}px ${language}: expanded concert guidance overflows`);
    }
  }
  pass('expanded concert guidance and both official maps fit bilingual 320px, 390px, 640px and desktop layouts with accessible disclosure targets');

  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), undefined, { timeout: 30000 });
  const status = await page.evaluate(() => new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => reject(new Error('Concert cache status timed out')), 5000);
    channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data); };
    navigator.serviceWorker.controller.postMessage({ type: 'CACHE_STATUS' }, [channel.port2]);
  }));
  assert.equal(status.ready, true);
  await context.setOffline(true);
  assert.equal((await page.reload()).status(), 200);
  await guide('d1-piano').waitFor();
  await expand(guide('d1-piano'));
  for (const file of ['data/concerts.js', 'ui/concerts.js', 'concerts.css', 'assets/concerts/entrance.webp', 'assets/concerts/stage-area.webp']) {
    const result = await page.evaluate(async file => {
      const response = await fetch('./' + file); return { status: response.status, bytes: (await response.arrayBuffer()).byteLength };
    }, file);
    assert.equal(result.status, 200, `${file} unavailable offline`); assert.ok(result.bytes > 0);
  }
  for (const mapId of ['entrance', 'stage-area']) {
    const localImageLink = guide('d1-piano').locator(`[data-concert-map="${mapId}"] .concert-map-image`);
    const [popup] = await Promise.all([context.waitForEvent('page'), localImageLink.click()]);
    await popup.waitForLoadState();
    assert.equal(popup.url(), origin + `assets/concerts/${mapId}.webp`);
    assert.deepEqual(await popup.locator('img').evaluate(async image => { await image.decode(); return [image.naturalWidth, image.naturalHeight]; }), [3840, 2160]);
    await popup.close();
  }
  await expand(guide('d2-primals'));
  await guide('d2-primals').locator('.concert-airport-note a').click();
  await page.locator('#route-haneda-midnight-example').waitFor();
  assert.match(await page.locator('#route-haneda-midnight-example').innerText(), /19:15/);
  assert.deepEqual(errors, []);
  pass('concert modules, both enlarged official images and the linked provisional airport plan work offline after a subdirectory reload without JavaScript errors');
  console.log(`${checks} concert checks passed.`);
} finally {
  await context.close();
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
