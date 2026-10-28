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
const placeIds = ['kaihin-station', 'toyosuna-station', 'messe', 'aeon', 'toyosuna-park', 'cross-wave', 'messe-shuttle', 'aeon-shuttle'];
const selection = page.locator('#area-selection');
async function selectPlace(id) {
  await page.locator(`#area-legend [data-area-place="${id}"]`).click();
  await page.locator(`#area-selection [data-area-focus="${id}"]`).waitFor();
  await page.waitForFunction(() => document.activeElement.id === 'area-selection');
}
async function expandTimetables() {
  for (const table of await selection.locator('.area-timetable').all()) {
    if (!await table.evaluate(element => element.open)) await table.locator('summary').click();
  }
}
const googleLinks = () => selection.locator('a[href^="https://www.google.com/maps/dir/"]');
// Independent expectations transcribed from docs/SOURCES-AREA-MAP.md, not the
// application's data object: these protect the two directions and midday gap.
const departures = {
  messeAeon: '10:35 10:55 11:15 11:35 11:55 12:15 12:35 12:55 13:15 13:35 13:55 14:15 14:35 14:55 15:15 15:35 15:55 16:15 16:35 16:55 17:15 17:35 17:55 18:15 18:35 18:55'.split(' '),
  aeonMesse: '10:50 11:10 11:30 11:50 12:10 12:30 12:50 13:10 13:30 13:50 14:10 14:30 14:50 15:10 15:30 15:50 16:10 16:30 16:50 17:10 17:30 17:50 18:10 18:30 18:50 19:10'.split(' '),
  messeCross: '08:50 09:05 09:20 09:35 09:50 10:05 10:20 20:30 20:45 21:00 21:15 21:30'.split(' '),
  crossMesse: '08:30 08:45 09:00 09:15 09:30 09:45 10:00 10:15 10:30 20:40 20:55 21:10'.split(' '),
};
try {
  await page.goto(origin + '#map');
  await selectMap(page, 'area-overview');
  assert.equal(await page.locator('.map-venue-button').count(), 4);
  assert.deepEqual(await page.locator('#venue-map').evaluate(async image => { await image.decode(); return [image.naturalWidth, image.naturalHeight]; }), [3840, 2160]);
  assert.equal(await page.locator('#map-original').getAttribute('href'), 'https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/media/img_map_large.eeb37c90.jpg');
  for (const language of ['zh', 'ja']) {
    await page.locator(`[data-lang="${language}"]`).click();
    assert.match(await page.locator('.area-intro').innerText(), /步行|徒歩/);
    assert.deepEqual(await page.locator('#area-legend [data-area-place]').evaluateAll(elements => elements.map(element => element.dataset.areaPlace).sort()), [...placeIds].sort());
    assert.deepEqual(await page.locator('.area-pin').evaluateAll(elements => elements.map(element => element.dataset.areaPlace).sort()), [...placeIds].sort());
    for (const id of placeIds) {
      await selectPlace(id);
      assert.ok((await selection.locator('h3').innerText()).length > 4);
      assert.ok(await selection.locator('.area-reading-list li').count() >= 2);
      for (const href of await googleLinks().evaluateAll(elements => elements.map(element => element.href))) {
        const url = new URL(href);
        assert.equal(url.searchParams.get('api'), '1');
        assert.equal(url.searchParams.get('travelmode'), 'walking');
        assert.ok(url.searchParams.get('origin'));
        assert.ok(url.searchParams.get('destination'));
        assert.equal(url.searchParams.has('key'), false, 'Directions must work without an embedded API key');
      }
    }
    for (const [id, station, destinations, minutes] of [
      ['kaihin-station', '海浜幕張駅 千葉県千葉市', ['幕張メッセ 国際展示場1-8ホール', 'イオンモール幕張新都心 グランドモール'], 5],
      ['toyosuna-station', '幕張豊砂駅 千葉県千葉市', ['イオンモール幕張新都心 グランドモール', '豊砂公園 千葉県千葉市', '幕張メッセ 国際展示場1-8ホール'], 20],
    ]) {
      await selectPlace(id);
      const urls = (await googleLinks().evaluateAll(elements => elements.map(element => element.href))).map(href => new URL(href));
      assert.deepEqual(urls.map(url => url.searchParams.get('origin')), destinations.map(() => station));
      assert.deepEqual(urls.map(url => url.searchParams.get('destination')), destinations);
      assert.match(await selection.innerText(), new RegExp(`${minutes} ?分`));
      assert.match(await selection.locator('.area-navigation-links > p').innerText(), /需連線|通信が必要/);
    }
    await selectPlace('kaihin-station');
    assert.match(await selection.innerText(), /西広場受付/);
    assert.match(await selection.innerText(), /1–3/);
    assert.match(await selection.innerText(), /4–6・7/);
    assert.equal(await selection.locator('a[href="./assets/concerts/entrance.webp"]').count(), 1);
    await selectPlace('messe');
    assert.match(await selection.innerText(), /1–7/);
    await selectPlace('toyosuna-park');
    assert.match(await selection.innerText(), /未列公園專用|公園専用.*掲載されていません/);
    assert.match(await selection.innerText(), /グランドモール前/);
  }
  pass('the official area image covers both stations, all venues and three shuttle areas, with correct walking destinations and separate morning-admission guidance in both languages');

  for (const language of ['zh', 'ja']) {
    await page.locator(`[data-lang="${language}"]`).click();
    for (const [place, expected, directions] of [
      ['messe-shuttle', [departures.messeAeon, departures.messeCross], [/幕張.*→.*AEON|幕張.*→.*イオン/, /幕張.*→.*Cross Wave|幕張.*→.*クロス/]],
      ['aeon-shuttle', [departures.aeonMesse], [/AEON.*→.*幕張|イオン.*→.*幕張/]],
      ['cross-wave', [departures.crossMesse], [/Cross Wave.*→.*幕張|クロス.*→.*幕張/]],
    ]) {
      await selectPlace(place); await expandTimetables();
      const tables = selection.locator('.area-timetable');
      assert.equal(await tables.count(), expected.length);
      for (let i = 0; i < expected.length; i++) {
        assert.match(await tables.nth(i).locator('summary').innerText(), directions[i]);
        assert.deepEqual(await tables.nth(i).locator('time').allTextContents(), expected[i]);
        assert.match(await tables.nth(i).innerText(), /JST/);
        assert.match(await tables.nth(i).innerText(), /10\/28/);
        assert.match(await tables.nth(i).innerText(), /可能變更|変更/);
        assert.match(await tables.nth(i).innerText(), /未另列兩日分表|日別の表は掲載されていません/);
      }
      const text = await selection.innerText();
      assert.doesNotMatch(text, /免費|無料/, 'The official shuttle source does not state a fare');
      if (place === 'messe-shuttle') {
        assert.match(text, /1 號|1番/); assert.match(text, /3 號|3番/); assert.match(text, /羽田/);
        assert.match(text, /僅供更衣室／寄物使用者|更衣室・クローク利用者専用/);
      }
      if (place === 'aeon-shuttle') {
        assert.match(text, /グランドモール前/);
        assert.match(text, /晚間演出後回程需另安排|夜の公演後.*別途計画/);
      }
      if (place === 'cross-wave') {
        assert.match(text, /只供這兩項服務的使用者|その利用者のみ/);
        assert.match(text, /事前預約|事前予約/);
        assert.match(text, /不是全天循環|終日循環ではありません/);
        assert.match(text, /11\/1/); assert.match(text, /09:45.*10:00.*10:15/);
        assert.match(text, /ミラプリコレクション/); assert.match(text, /優先/);
      }
    }
    await selectPlace('aeon');
    assert.match(await selection.innerText(), /並非營運到活動 21:00 結束|21:00までは運行しません/);
  }
  pass('both languages show the four published shuttle timetables in the correct direction, the Cross Wave midday gap and user restriction, November 1 priority, and the early AEON last bus');

  await page.locator('[data-lang="zh"]').click();
  await selectPlace('aeon');
  await selection.locator('[data-area-focus]').click();
  await page.waitForFunction(() => document.activeElement.matches('.map-viewport'));
  assert.equal(await page.locator('#zoom-label').innerText(), '300%');
  assert.ok(await page.locator('.map-viewport').evaluate(element => element.scrollLeft > 0));
  const selectedPointVisible = () => page.locator('.area-pin[aria-pressed="true"]').evaluate(pin => {
    const point = pin.getBoundingClientRect(), frame = pin.closest('.map-viewport').getBoundingClientRect();
    return point.left >= frame.left && point.right <= frame.right && point.top >= frame.top && point.bottom <= frame.bottom;
  });
  assert.equal(await selectedPointVisible(), true);
  await page.locator('[data-zoom="25"]').click();
  await selectPlace('kaihin-station');
  assert.equal(await page.locator('#zoom-label').innerText(), '325%', 'Selecting a place must preserve zoom');
  assert.equal(await page.locator('.area-pin[aria-pressed="true"]').count(), 1);
  assert.equal(await page.locator('[data-area-place="kaihin-station"][aria-pressed="true"]').count(), 3);
  await selection.locator('[data-area-focus]').click();
  await page.waitForFunction(() => document.activeElement.matches('.map-viewport'));
  assert.equal(await selectedPointVisible(), true);
  const viewport = page.locator('.map-viewport');
  const scrollBefore = await viewport.evaluate(element => element.scrollLeft);
  const frame = await viewport.boundingBox();
  await page.mouse.move(frame.x + 25, frame.y + 25);
  await page.mouse.down(); await page.mouse.move(frame.x + 95, frame.y + 25, { steps: 5 }); await page.mouse.up();
  assert.ok(await viewport.evaluate(element => element.scrollLeft) < scrollBefore, 'Dragging must pan the magnified map');
  await page.locator('[data-reset-map]').click();
  assert.equal(await page.locator('#zoom-label').innerText(), '100%');
  assert.equal(await viewport.evaluate(element => element.scrollLeft), 0);
  assert.equal(await page.locator('[data-reset-map]').evaluate(element => element === document.activeElement), true);
  assert.equal(await page.locator('[data-zoom="-25"]').isDisabled(), true);
  await page.locator('.area-quick-routes [data-area-place="toyosuna-station"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.activeElement.id === 'area-selection');
  assert.equal(await selection.locator('[data-area-focus="toyosuna-station"]').count(), 1);
  await page.locator('.area-pin[data-area-place="messe"]').click();
  await page.waitForFunction(() => document.activeElement.id === 'area-selection');
  assert.equal(await selection.locator('[data-area-focus="messe"]').count(), 1);
  for (const [mapId, place] of [['hall1-3', 'messe'], ['hall4-6', 'messe'], ['hall7', 'messe'], ['messe-entire', 'messe'], ['aeon', 'toyosuna-station'], ['toyosuna', 'toyosuna-station']]) {
    await selectMap(page, 'area-overview'); await selectPlace(place);
    await selection.locator(`[data-area-venue="${mapId}"]`).click();
    await page.locator(`#map-canvas[data-map-id="${mapId}"]`).waitFor();
    assert.equal(await page.locator('#zoom-label').innerText(), '100%');
    assert.equal(await page.locator('.map-viewport').evaluate(element => element === document.activeElement), true);
    assert.equal(await page.locator('#map-original').getAttribute('href'), eventData.maps.find(map => map.id === mapId).source);
    assert.ok(await page.locator('#venue-map').evaluate(async image => { await image.decode(); return image.naturalWidth > 0; }));
  }
  pass('map pins, keyboard station shortcuts and selection focus work with retained zoom, centering, drag and reset; all six existing venue maps remain reachable from the overview');

  await selectMap(page, 'area-overview');
  for (const width of [320, 390, 640, 1280]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    for (const language of ['zh', 'ja']) {
      await page.locator(`[data-lang="${language}"]`).click();
      await selectPlace('messe-shuttle'); await expandTimetables();
      assert.equal(await page.locator('body').evaluate(body => body.scrollWidth <= innerWidth + 1), true, `${width}px ${language}: area map or expanded timetable overflows`);
      // Dense pins over the original artwork have equivalent full-size index
      // controls. Check those alternatives, both station shortcuts and toolbar.
      for (const control of await page.locator('.map-venue-button, #area-legend button, .area-quick-routes button, .area-selection button, .area-timetable > summary, .map-controls button, .area-navigation-links a, .area-map-source a').all()) {
        const box = await control.boundingBox();
        assert.ok(box.width >= 44 && box.height >= 44, `${width}px ${language}: small target ${await control.innerText()} (${box.width} × ${box.height})`);
      }
      await selectPlace('toyosuna-station');
      assert.equal(await page.locator('body').evaluate(body => body.scrollWidth <= innerWidth + 1), true, `${width}px ${language}: station directions overflow`);
    }
  }
  pass('the bilingual area view, expanded timetables and station directions fit 320px, 390px, 640px and desktop widths with full-size equivalent controls for every map pin');

  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller), undefined, { timeout: 30000 });
  const status = await page.evaluate(() => new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => { channel.port1.close(); reject(new Error('Area map cache status timed out')); }, 5000);
    channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data); };
    navigator.serviceWorker.controller.postMessage({ type: 'CACHE_STATUS' }, [channel.port2]);
  }));
  assert.equal(status.ready, true);
  await context.setOffline(true);
  assert.equal((await page.reload()).status(), 200);
  await selectMap(page, 'area-overview');
  for (const file of ['data/area-map.js', 'ui/area-map.js', 'area-map.css', 'assets/area/overview.webp']) {
    const result = await page.evaluate(async file => {
      const response = await fetch('./' + file); return { status: response.status, bytes: (await response.arrayBuffer()).byteLength };
    }, file);
    assert.equal(result.status, 200, `${file} unavailable offline`); assert.ok(result.bytes > 0);
  }
  await selectPlace('aeon-shuttle'); await expandTimetables();
  assert.deepEqual(await selection.locator('time').allTextContents(), departures.aeonMesse);
  await selectPlace('kaihin-station');
  for (const [link, file] of [
    [page.locator('.area-map-source a[href="./assets/area/overview.webp"]'), 'assets/area/overview.webp'],
    [selection.locator('a[href="./assets/concerts/entrance.webp"]'), 'assets/concerts/entrance.webp'],
  ]) {
    const [popup] = await Promise.all([context.waitForEvent('page'), link.click()]);
    await popup.waitForLoadState();
    assert.equal(popup.url(), origin + file);
    assert.deepEqual(await popup.locator('img').evaluate(async image => { await image.decode(); return [image.naturalWidth, image.naturalHeight]; }), [3840, 2160]);
    await popup.close();
  }
  await page.locator('.area-shuttle-note a[href="#transport"]').click();
  await page.locator('#route-haneda-midnight-example').waitFor();
  assert.deepEqual(errors, []);
  pass('area modules, CSS, shuttle schedules, enlarged official overview and admission images, and the Haneda guide work offline under a deployment subdirectory without JavaScript errors');
  console.log(`${checks} area map checks passed.`);
} finally {
  await context.close();
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
