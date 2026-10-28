import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { readFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import { createServer, root } from '../scripts/serve.mjs';
import { eventData } from '../data/events.js';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), headless: true, args: ['--no-sandbox'] });
const server = createServer();
server.listen(0, '127.0.0.1'); await once(server, 'listening');
const origin = `http://127.0.0.1:${server.address().port}/`;
const scratch = await mkdtemp(path.join(tmpdir(), 'fanfest-functional-'));
const screenshots = path.join(root, '.impeccable/review');
await mkdir(screenshots, { recursive: true });
let count = 0;
const pass = name => { count++; console.log(`PASS ${name}`); };
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true, timezoneId: 'America/Los_Angeles' });
const page = await context.newPage();
const errors = [];
const personalRows = page.locator('.event-row:has([data-delete-event])');
page.on('pageerror', error => errors.push(error.message));
const headings = {
  zh: { home: '你的 FanFest', schedule: '時間表', activities: '會場活動', map: '會場地圖', list: '我的隨行清單', tldr: /./ },
  ja: { home: 'ファンフェスを、', schedule: '予定表', activities: '会場のアクティビティ', map: '会場マップ', list: 'マイリスト', tldr: /./ }
};
async function route(name, lang = 'zh') {
  await page.locator(`#navigation a[href="#${name}"]`).click();
  await page.locator('h1').filter({ hasText: headings[lang][name] }).waitFor();
}
async function capture(filename) {
  await page.evaluate(() => document.fonts.ready);
  await page.locator('#toast').waitFor({ state: 'hidden', timeout: 10000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(screenshots, filename), fullPage: true });
}
try {
  assert.equal(eventData.sourceStatus, 'verified');
  assert.deepEqual(eventData.dates, ['2026-10-31', '2026-11-01']);
  assert.equal(eventData.stages.length, 12);
  assert.equal(eventData.stages.filter(item => item.category === 'broadcast').length, 2);
  assert.equal(eventData.stages.filter(item => item.end).length, 10);
  for (const [id, date, start, end, title] of [
    ['d1-keynote', '2026-10-31', '11:00', '13:00', '基調講演'],
    ['d1-piano', '2026-10-31', '19:30', '20:30', 'ピアノコンサート'],
    ['d2-primals', '2026-11-01', '19:00', '20:30', 'スペシャルライブ - THE PRIMALS']
  ]) {
    const item = eventData.stages.find(event => event.id === id);
    assert.ok(item, `Missing official event ${id}`);
    assert.equal(item.date, date); assert.equal(item.start, start); assert.equal(item.end, end);
    assert.equal(item.title.ja, title);
    assert.ok(item.title.zh && item.description.zh && item.description.ja);
    assert.match(item.source, /^https:\/\/fanfest\.finalfantasyxiv\.com\/2026\/jp\/stages\//);
  }
  assert.equal(new Set([...eventData.stages, ...eventData.activities].map(item => item.id)).size, eventData.stages.length + eventData.activities.length);
  pass('verified two-day official schedule has 10 fixed programs, 2 broadcast windows, exact key times and bilingual source-backed content');
  await page.goto(origin);
  await page.locator('#navigation a').first().waitFor();
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    for (const lang of ['zh', 'ja']) {
      await page.locator(`[data-lang="${lang}"]`).click();
      assert.equal(await page.locator('html').getAttribute('lang'), lang === 'zh' ? 'zh-Hant' : 'ja');
      for (const name of Object.keys(headings[lang])) {
        await route(name, lang);
        assert.equal(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth), true, `${width}px ${lang} ${name} horizontal overflow`);
        assert.equal(await page.locator(`#navigation a[href="#${name}"]`).getAttribute('aria-current'), 'page');
        if (lang === 'zh' && name === 'home') await capture(`final-${width < 600 ? 'mobile' : 'desktop'}.png`);
      }
      pass(`${lang}: ${Object.keys(headings[lang]).length} routes and active navigation at ${width}px, no overflow`);
    }
  }
  await page.reload();
  await page.locator('html[lang="ja"]').waitFor();
  pass('Japanese language preference persists after reload');
  await page.locator('[data-lang="zh"]').click();
  await page.setViewportSize({ width: 390, height: 844 });
  await route('schedule');
  // Check real official content independently from custom notes.
  assert.equal(await page.locator('.event-row').count(), 12);
  const keynote = page.locator('.event-row').filter({ has: page.locator('[data-save="d1-keynote"]') });
  assert.match(await keynote.innerText(), /主題演講/);
  assert.match(await keynote.innerText(), /基調講演/);
  assert.match(await keynote.innerText(), /11:00/);
  await page.locator('#event-search').fill('基調講演');
  assert.equal(await page.locator('.event-row').count(), 1);
  await page.locator('#event-search').fill('鋼琴');
  assert.equal(await page.locator('.event-row').count(), 1);
  await page.locator('#event-search').fill('');
  await page.locator('#date-filter').selectOption('2026-11-01');
  assert.equal(await page.locator('.event-row').count(), 6);
  await page.locator('#date-filter').selectOption('');
  pass('official stage schedule displays Japanese references, both-language search and date filtering');
  await keynote.locator('[data-save="d1-keynote"]').click();
  await page.locator('#saved-filter').click();
  assert.equal(await page.locator('.event-row').count(), 1);
  await page.reload(); await page.locator('.event-row').first().waitFor();
  assert.equal(await page.locator('[data-save="d1-keynote"]').getAttribute('aria-pressed'), 'true');
  await page.locator('[data-save="d1-keynote"]').click();
  const officialCalendarPromise = page.waitForEvent('download');
  await page.locator('[data-calendar="d1-keynote"]').click();
  const officialCalendar = await officialCalendarPromise;
  const officialPath = path.join(scratch, 'official.ics'); await officialCalendar.saveAs(officialPath);
  const officialICS = (await readFile(officialPath, 'utf8')).replace(/\r\n /g, '');
  assert.match(officialICS, /DTSTART:20261031T020000Z/);
  assert.match(officialICS, /DTEND:20261031T040000Z/);
  assert.match(officialICS, /SUMMARY:主題演講/);
  pass('official program bookmarks persist and calendar export retains correct JST times in a non-Japan browser timezone');
  await page.locator('[data-location="main-stage"]').first().click();
  await page.locator('#map-select').waitFor();
  assert.equal(await page.locator('#map-select').inputValue(), 'hall4-6');
  assert.match(await page.locator('#map-selection').innerText(), /ステージ/);
  assert.equal(await page.locator('.map-pin.selected').count(), 1);
  pass('stage location links select and highlight the official main-stage location');
  await page.locator('#map-select').selectOption('messe-entire');
  assert.equal(await page.locator('#map-original').getAttribute('href'), 'https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/media/messe_entire.f6fe34fd.jpg');
  for (const map of eventData.maps) {
    assert.ok(map.width > 1000 && map.height > 1000);
    assert.match(map.source, /^https:\/\/fanfest\.finalfantasyxiv\.com\/2026\/jp\/_next\/static\/media\//);
    await page.locator('#map-select').selectOption(map.id);
    await page.locator('#venue-map').evaluate(img => img.decode());
    const size = await page.locator('#venue-map').evaluate(img => ({width:img.naturalWidth,height:img.naturalHeight}));
    assert.equal(size.width, map.width); assert.equal(size.height, map.height);
    const legendNumbers = (await page.locator('.legend-row .map-number').allTextContents()).map(Number).filter(Number.isFinite);
    assert.deepEqual(legendNumbers, [...legendNumbers].sort((a,b)=>a-b), `Unsorted ${map.id} number index`);
    assert.equal(await page.locator('.map-viewport').evaluate(view => view.scrollWidth <= view.clientWidth + 2), true, `Initial ${map.id} map must fit the phone viewport`);
    for (const pin of map.hotspots) {
      assert.ok(pin.x >= 0 && pin.x <= 100 && pin.y >= 0 && pin.y <= 100);
      for (const id of pin.activityIds || [pin.activityId]) assert.ok(eventData.activities.find(a => a.id === id), `Missing hotspot activity ${id}`);
    }
  }
  pass('all six official original maps load at recorded dimensions with valid linked hotspots');
  await page.locator('#map-select').selectOption('hall1-3');
  await page.locator('.map-pin[data-activity="activity-nice-head"]').click();
  assert.match(await page.locator('#map-selection').innerText(), /ナイスヘッド・ガーデン/);
  await page.locator('.same-location [data-activity="activity-allagan"]').click();
  assert.match(await page.locator('#map-selection').innerText(), /古のアラグの操作盤/);
  await page.locator('.same-location [data-activity="activity-nice-head"]').click();
  assert.match(await page.locator('#map-selection').innerText(), /ナイスヘッド・ガーデン/);
  await page.locator('.legend-row[data-activity="activity-allagan"]').click();
  assert.match(await page.locator('#map-selection').innerText(), /古のアラグの操作盤/);
  assert.equal(await page.locator('.map-pin.selected').innerText(), '6');
  await page.locator('[data-zoom="25"]').click();
  assert.equal(await page.locator('#zoom-label').innerText(), '125%');
  assert.match(await page.locator('#map-canvas').getAttribute('style'), /125%/);
  await page.locator('[data-reset-map]').click();
  assert.equal(await page.locator('#zoom-label').innerText(), '100%');
  assert.equal(await page.locator('[data-zoom="-25"]').isDisabled(), true);
  pass('shared Makuhari #6 resolves both activities through pins, index and sibling links; zoom/reset stays in bounds');
  await page.locator('#map-select').selectOption('toyosuna');
  await page.locator('.map-pin[data-activity="food-eorzea-cafe"]').click();
  const food = eventData.activities.find(a => a.id === 'food-eorzea-cafe');
  assert.ok((await page.locator('#map-selection').innerText()).includes(food.title.ja));
  assert.equal(await page.locator('.map-pin.selected').innerText(), '1');
  pass('Toyosuna #1 correctly uses its own venue numbering');
  // Selection should remain findable in a zoomed image, not merely in the text panel.
  for (let zoom=100; zoom<400; zoom+=25) await page.locator('[data-zoom="25"]').click();
  await page.locator('.legend-row[data-activity="food-eorzea-cafe"]').click();
  await page.waitForFunction(() => {
    const view=document.querySelector('.map-viewport').getBoundingClientRect();
    const pin=document.querySelector('.map-pin.selected').getBoundingClientRect();
    return pin.left >= view.left && pin.right <= view.right && pin.top >= view.top && pin.bottom <= view.bottom;
  });
  // Wait for selection's smooth pan/page scroll before starting a user drag.
  await page.evaluate(() => new Promise(resolve => {
    let previous='', stable=0;
    const tick=()=>{
      const view=document.querySelector('.map-viewport');
      const now=[view.scrollLeft,view.scrollTop,scrollY].join(',');
      stable=now===previous?stable+1:0;previous=now;
      if(stable>=5)resolve();else requestAnimationFrame(tick);
    };tick();
  }));
  // Exercise drag independently of the selection's scroll position: a user can
  // also move the map with native scrollbars before dragging its blank area.
  await page.locator('.map-viewport').evaluate(view=>{
    view.scrollTo({left:100,top:0,behavior:'instant'});
    const rect=view.getBoundingClientRect();
    window.scrollTo({top:scrollY+rect.top-80,behavior:'instant'});
  });
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const dragPoint=await page.locator('.map-viewport').evaluate(view=>{
    const r=view.getBoundingClientRect();
    for(let y=r.top+30;y<Math.min(r.bottom-30,innerHeight-90);y+=30)
      for(let x=r.left+100;x<r.right-30;x+=30){
        const target=document.elementFromPoint(x,y);
        if(target?.closest('.map-viewport')===view&&!target.closest('button'))return{x,y};
      }
    return null;
  });
  assert.ok(dragPoint, 'No exposed draggable map area');
  const beforeDrag = await page.locator('.map-viewport').evaluate(view => view.scrollLeft);
  await page.mouse.move(dragPoint.x,dragPoint.y);
  await page.mouse.down();
  await page.mouse.move(dragPoint.x-60,dragPoint.y,{steps:5});
  await page.mouse.up();
  const afterDrag=await page.locator('.map-viewport').evaluate(view=>view.scrollLeft);
  assert.ok(afterDrag > beforeDrag+30, `Map drag did not pan: ${beforeDrag} -> ${afterDrag}`);
  const repeatedPin = page.locator('.map-pin[data-activity="food-truck-03"]').nth(1);
  const repeatedIndex = Number(await repeatedPin.getAttribute('data-point-index'));
  const repeatedPoint = eventData.maps.find(map => map.id === 'toyosuna').hotspots[repeatedIndex];
  await repeatedPin.click();
  await page.waitForFunction(point => {
    const view=document.querySelector('.map-viewport'), canvas=document.querySelector('#map-canvas');
    const expected=Math.max(0,Math.min(view.scrollWidth-view.clientWidth,canvas.offsetWidth*point.x/100-view.clientWidth/2));
    return Math.abs(view.scrollLeft-expected)<2;
  }, repeatedPoint);
  assert.match(await page.locator('#map-selection').innerText(), /BBQ Freely/);
  await page.locator('[data-reset-map]').click();
  assert.equal(await page.locator('.map-viewport').evaluate(view => view.scrollWidth <= view.clientWidth + 2), true);
  pass('zoomed selection auto-pans, repeated locations keep the clicked pin, mouse drag pans and reset restores fit');

  await route('activities');
  await page.locator('#activity-search').fill('ナイスヘッド');
  assert.equal(await page.locator('.activity-accordion').count(), 1);
  assert.match(await page.locator('.activity-accordion').innerText(), /ナイスヘッド/);
  const niceHead = eventData.activities.find(a => a.id === 'activity-nice-head');
  await page.locator('#activity-search').fill(niceHead.title.zh);
  assert.equal(await page.locator('.activity-accordion').count(), 1);
  await page.locator('.activity-accordion summary').click();
  await page.locator('[data-location="activity-nice-head"]').click();
  await page.locator('#map-select').waitFor();
  assert.equal(await page.locator('#map-select').inputValue(), 'hall1-3');
  assert.match(await page.locator('#map-selection').innerText(), /ナイスヘッド/);
  await route('activities');
  await page.locator('#activity-search').fill('39');
  await page.locator('#activity-map-filter').selectOption('aeon');
  assert.equal(await page.locator('.activity-accordion').count(), 1);
  assert.ok((await page.locator('.activity-accordion').innerText()).includes(eventData.activities.find(a => a.id === 'activity-real-mystery').title.ja));
  pass('activity search supports Japanese, Traditional Chinese and numbered venue filtering, with working map links');
  await page.locator('#activity-search').fill('');
  await page.locator('#activity-map-filter').selectOption('');
  for (const lang of ['zh','ja']) {
    await page.locator(`[data-lang="${lang}"]`).click();
    await route('tldr', lang);
    await page.locator('.summary-preview img').evaluate(img => img.decode());
    assert.match(await page.locator('.summary-preview img').getAttribute('src'), new RegExp(`summary-${lang}\\.png$`));
    const image = await page.locator('.summary-preview img').evaluate(img => ({width:img.naturalWidth,height:img.naturalHeight}));
    assert.equal(image.width, 1600); assert.ok(image.height > 2500);
    const promise = page.waitForEvent('download');
    await page.locator('#download-summary').click();
    const result = await promise;
    assert.equal(result.suggestedFilename(), `fanfest-2026-${lang}.png`);
    const imagePath = path.join(scratch, `summary-${lang}.png`); await result.saveAs(imagePath);
    const bytes = await readFile(imagePath);
    assert.equal(bytes.subarray(1,4).toString(), 'PNG');
    assert.equal(bytes.readUInt32BE(16), 1600);
    assert.ok(bytes.readUInt32BE(20) > 2500);
    await page.locator('.summary-text summary').click();
    assert.equal(await page.locator('.summary-text li').count(), 12);
    const text = await page.locator('.summary-text').innerText();
    for (const event of eventData.stages) {
      assert.ok(text.includes(event.title[lang]), `Missing ${lang} summary ${event.id}`);
      assert.ok(text.includes(event.start));
    }
    assert.match(text, /2026-10-31/); assert.match(text, /2026-11-01/);
    const photoSections=page.locator('.summary-photo');
    assert.equal(await photoSections.count(),2);
    const photoText=(await photoSections.allInnerTexts()).join(' ').replace(/\s+/g,' ');
    assert.match(photoText,/14:00 \/ 16:15\s+THE PRIMALS/);
    assert.match(photoText,/12:00 \/ 14:00 \/ 16:00\s+Keiko/);
    assert.match(photoText,/13:00 \/ 15:00\s+祖堅正慶/);
    assert.match(photoText,/09:00/);assert.match(photoText,/21:00/);
    assert.match(photoText,lang==='zh'?/不是保證的體驗開始時間/:/体験開始時刻ではありません/);
    const broadcastContext=page.locator('.summary-text li').filter({hasText:lang==='zh'?'沒有固定結束時間':'固定の終了時刻はありません'});
    assert.equal(await broadcastContext.count(),2);
    assert.match(await broadcastContext.first().innerText(),lang==='zh'?/間歇播出/:/随時配信/);

  }
  pass('both PNGs are high-resolution; accessible text covers both days, photo gathering times, opening hours and intermittent broadcast caveats');
  await page.locator('[data-lang="zh"]').click();
  await route('schedule');
  await page.locator('.skip-link').focus();
  await page.keyboard.press('Enter');
  assert.match(await page.locator('h1').innerText(), /時間表/);
  assert.equal(await page.evaluate(() => document.activeElement.id), 'main');
  assert.equal(new URL(page.url()).hash, '#schedule');
  pass('keyboard skip link focuses main content without changing the current route');
  await page.locator('[data-add-event]').click();
  await page.locator('[name="title"]').fill('朋友集合，入口; 測試');
  await page.locator('[name="date"]').fill('2026-11-15');
  await page.locator('[name="start"]').fill('10:30');
  await page.locator('[name="end"]').fill('10:30');
  await page.locator('[name="place"]').fill('集合處');
  await page.locator('#event-form [type="submit"]').click();
  assert.match(await page.locator('#form-error').innerText(), /必須晚於/);
  assert.equal(await personalRows.count(), 0);
  await page.locator('[name="end"]').fill('09:00');
  await page.locator('#event-form [type="submit"]').click();
  assert.equal(await personalRows.count(), 0);
  pass('equal and earlier end times rejected');
  await page.locator('[name="end"]').fill('11:15');
  await page.locator('#event-form [type="submit"]').click();
  await personalRows.waitFor();
  await page.reload();
  await personalRows.waitFor();
  assert.match(await personalRows.innerText(), /朋友集合/);
  pass('personal itinerary persists after reload');
  await page.locator('#event-search').fill('不存在的項目');
  assert.equal(await personalRows.count(), 0);
  await page.locator('#event-search').fill('集合處');
  assert.equal(await personalRows.count(), 1);
  pass('itinerary search by location and no-results state');
  const calendarPromise = page.waitForEvent('download');
  await page.locator('[data-calendar]').click();
  const calendar = await calendarPromise;
  const calendarPath = path.join(scratch, 'event.ics'); await calendar.saveAs(calendarPath);
  const raw = await readFile(calendarPath, 'utf8');
  const ics = raw.replace(/\r\n /g, '');
  assert.match(ics, /DTSTART:20261115T013000Z/);
  assert.match(ics, /DTEND:20261115T021500Z/);
  assert.match(ics, /TRIGGER:-PT15M/);
  assert.match(ics, /SUMMARY:朋友集合，入口\\; 測試/);
  assert.ok(raw.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
  pass('ICS download uses UTC converted from JST, a 15-minute alarm, escaped delimiters, and UTF-8 line folding');
  await capture('final-mobile-schedule.png');
  await route('list');
  const todo = '<img src=x onerror="window.todoInjected=true"> 飲品';
  await page.locator('#todo-form input').fill(todo);
  await page.locator('#todo-form button').click();
  const custom = page.locator('.check-row').filter({ hasText: todo });
  assert.equal(await custom.count(), 1);
  assert.equal(await custom.locator('img').count(), 0);
  assert.equal(await page.evaluate(() => window.todoInjected), undefined);
  await custom.locator('input').check();
  await page.reload();
  await page.locator('#todo-form').waitFor();
  assert.equal(await page.locator('.check-row').filter({ hasText: todo }).locator('input').isChecked(), true);
  pass('custom todo text is escaped and checked state persists');
  const backupPromise = page.waitForEvent('download');
  await page.locator('#export-notes').click();
  const backup = await backupPromise;
  const backupPath = path.join(scratch, 'backup.json'); await backup.saveAs(backupPath);
  const backupData = JSON.parse(await readFile(backupPath, 'utf8'));
  assert.equal(backupData.format, 'fanfest-note');
  assert.equal(backupData.personal.length, 1);
  assert.equal(backupData.todos.length, 1);
  await page.evaluate(() => localStorage.clear());
  await page.reload(); await page.locator('#todo-form').waitFor();
  assert.equal(await personalRows.count(), 0);
  await page.locator('#import-notes').setInputFiles(backupPath);
  await personalRows.waitFor();
  assert.equal(await page.locator('.check-row').filter({ hasText: todo }).locator('input').isChecked(), true);
  assert.equal(await personalRows.count(), 1);
  const importInput = await page.locator('#import-notes').elementHandle();
  await page.locator('#import-notes').setInputFiles(backupPath);
  await page.waitForFunction(element => !element.isConnected, importInput);
  assert.equal(await personalRows.count(), 1);
  assert.equal(await page.locator('.check-row').filter({ hasText: todo }).count(), 1);
  pass('JSON backup restores itinerary and checked todos without duplicates');
  await page.locator('#import-notes').setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{"not":"a backup"}') });
  await page.waitForFunction(() => document.querySelector('#toast').textContent.includes('無法讀取備份'));
  assert.match(await page.locator('#toast').innerText(), /無法讀取備份/);
  assert.equal(await personalRows.count(), 1);
  pass('invalid backup rejected without deleting existing notes');
  for (const bad of [
    { date: '2026-99-99' }, { date: '2026-02-30' }, { start: '99:99' },
    { end: '09:00' }, { end: '10:30' }, { end: {} }, { place: {} }
  ]) {
    await page.evaluate(() => {
      window.importToast = new Promise((resolve, reject) => {
        const toast = document.querySelector('#toast');
        const observer = new MutationObserver(() => { clearTimeout(timer); observer.disconnect(); resolve(toast.textContent); });
        const timer = setTimeout(() => { observer.disconnect(); reject(new Error('No import result')); }, 5000);
        observer.observe(toast, { childList: true, subtree: true, characterData: true });
      });
    });
    const invalid = { ...backupData, personal: [{ id: 'corrupted', title: 'Invalid event', date: '2026-11-15', start: '10:30', end: '11:00', place: '', ...bad }] };
    await page.locator('#import-notes').setInputFiles({ name: 'corrupt.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(invalid)) });
    assert.match(await page.evaluate(() => window.importToast), /無法讀取備份/);
    assert.equal(await personalRows.count(), 1);
  }
  pass('corrupted backup dates, times, end-time order, and field types rejected');
  await page.locator('.check-row').filter({ hasText: todo }).locator('[data-delete-todo]').click();
  await page.locator('#todo-form input').fill('帶上水瓶與行動電源');
  await page.locator('#todo-form button').click();
  await capture('final-mobile-list.png');
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    for (const name of ['schedule', 'list']) {
      await route(name);
      assert.equal(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth), true, `${width}px populated ${name} overflow`);
      if (width === 1280) await capture(`final-desktop-${name}.png`);
    }
  }
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    for (const name of ['map', 'activities', 'tldr']) {
      await route(name);
      if (name === 'map') {
        await page.locator('#map-select').selectOption('hall1-3');
        await page.locator('#venue-map').evaluate(img => img.decode());
        await page.locator('.legend-row[data-activity="activity-nice-head"]').click();
      }
      if (name === 'tldr') await page.locator('.summary-preview img').evaluate(img => img.decode());
      assert.equal(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth), true, `${width}px final ${name} overflow`);
      await capture(`final-${width < 600 ? 'mobile' : 'desktop'}-${name}.png`);
    }
  }
  assert.deepEqual(errors, []);
  pass('populated mobile and desktop views fit, with no JavaScript exceptions');
  console.log(`${count} functional checks passed.`);
} finally {
  await context.close(); await browser.close();
  await new Promise(resolve => server.close(resolve));
  await rm(scratch, { recursive: true, force: true });
}

// Replaces scenario/debug captures with clean official-content review captures.
await import('./capture.mjs');
