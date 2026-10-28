import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { once } from 'node:events';
import { createServer } from '../scripts/serve.mjs';
import { goodsGuide } from '../data/goods.js';
import { merchandiseCatalog } from '../data/goods-catalog.js';

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
page.on('pageerror', error => errors.push(error.message));
let checks = 0;
const pass = message => { checks++; console.log(`PASS ${message}`); };
async function noOverflow(label) {
  assert.equal(await page.locator('body').evaluate(el => el.scrollWidth <= innerWidth + 1), true, `${label}: document overflow`);
}
async function chooseView(view) {
  await page.locator(`[data-goods-view="${view}"]`).click();
  await page.locator(view === 'guide' ? '.goods-guide' : '.goods-browse').waitFor();
  assert.equal(await page.locator(`[data-goods-view="${view}"]`).getAttribute('aria-pressed'), 'true');
}
try {
  await page.goto(origin + '#goods');
  await page.locator('.goods-guide').waitFor();
  assert.equal(await page.locator('#navigation a').count(), 7);
  assert.equal(await page.locator('#navigation a[href="#goods"]').getAttribute('aria-current'), 'page');
  assert.match(await page.locator('.goods-guide').innerText(), /沒有兩日通票也可購買/);
  assert.match(await page.locator('.goods-guide').innerText(), /屋外展示場/);
  assert.equal(await page.locator('.goods-main-actions a[target="_blank"]').getAttribute('href'), 'https://qo-kun.com/fanfest-finalfantasy14');
  assert.deepEqual(await page.locator('.goods-hours-table tbody td').allTextContents(), ['09:00–21:00', '09:00–21:00']);
  assert.match(await page.locator('.goods-hours-note').innerText(), /20:30/);
  assert.match(await page.locator('.goods-hours-note').innerText(), /30 分鐘/);
  assert.match(await page.locator('#goods-payment').innerText(), /現金/);
  assert.match(await page.locator('#goods-payment').innerText(), /Visa.*Mastercard.*JCB.*Amex/);
  assert.match(await page.locator('#goods-payment').innerText(), /PayPay/);
  assert.match(await page.locator('#goods-how-to-buy').innerText(), /不代表已付款/);
  assert.match(await page.locator('#goods-bonus-and-limits').innerText(), /14,000/);
  assert.match(await page.locator('.goods-online').innerText(), /10\/0?1|10月1日|10 月 1 日|10-01/);
  assert.ok(await page.locator('a[href="https://store.jp.square-enix.com/estore/pages/sp_ff14_fanfest2026.aspx"]').count() > 0);
  pass('goods guide preserves ticket eligibility, official hours discrepancy, payment, QR preparation and separate online campaign information');

  await page.locator('.goods-main-actions [data-location="goods-store"]').click();
  await page.locator('#map-canvas[data-map-id]').waitFor();
  assert.equal(await page.locator('#map-canvas').getAttribute('data-map-id'), 'messe-entire');
  assert.match(await page.locator('#map-selection').innerText(), /商品|グッズ/);
  assert.equal(await page.locator('.map-pin.selected').first().innerText(), '35');
  await page.locator('#navigation a[href="#goods"]').click();
  await page.locator('.goods-guide').waitFor();
  pass('the merchandise tab links to the outdoor shop at official map number 35 and remains directly reachable from navigation');

  await chooseView('catalog');
  assert.equal(merchandiseCatalog.products.length, 33);
  assert.equal(await page.locator('.goods-product').count(), 33);
  assert.match(await page.locator('.goods-catalog-note').innerText(), /官方網店.*參考價/);
  const imageResults = await page.locator('.goods-product img').evaluateAll(async images => Promise.all(images.map(async image => {
    image.loading = 'eager';
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight, url: image.src };
  })));
  for (const result of imageResults) {
    assert.ok(result.width > 0 && result.height > 0, 'Product image failed to decode');
    assert.ok(result.url.startsWith(origin + 'assets/goods/'), 'Product thumbnails must be bundled for offline use');
  }
  assert.equal(new Set(merchandiseCatalog.products.map(product => product.id)).size, 33);
  for (const product of merchandiseCatalog.products) {
    const article = page.locator(`[data-product="${product.id}"]`);
    assert.ok(product.title.zh && product.title.ja, `Missing translation: ${product.id}`);
    assert.match(await article.innerText(), new RegExp(product.title.ja.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    const source = new URL(product.source);
    assert.equal(source.protocol, 'https:');
    assert.ok(['store.jp.square-enix.com', 'fanfest.finalfantasyxiv.com'].includes(source.hostname), `Nonofficial product destination: ${product.id}`);
    assert.equal(await article.locator('.goods-product-link').getAttribute('href'), product.source);
    assert.equal(await article.locator('.goods-product-link').getAttribute('target'), '_blank');
    if (Number.isFinite(product.priceYen)) {
      assert.ok(product.priceYen > 0, `Invalid reference price: ${product.id}`);
      assert.match(await article.locator('.goods-price').innerText(), /參考價/);
    }
    if (product.priceNote?.zh) assert.ok((await article.innerText()).includes(product.priceNote.zh), `Price unit/variant note not displayed: ${product.id}`);
  }
  pass('all 33 venue product groups have bilingual names, decodable local images, official destinations and explicitly scoped reference prices');

  const sample = merchandiseCatalog.products.find(product => product.category === 'GOODS');
  await page.locator('#goods-search').fill(sample.title.zh);
  assert.ok(await page.locator(`[data-product="${sample.id}"]`).count() > 0);
  await page.locator('#goods-search').fill(sample.title.ja);
  assert.ok(await page.locator(`[data-product="${sample.id}"]`).count() > 0);
  await page.locator('#goods-category').selectOption('GOODS');
  await page.locator('[data-lang="ja"]').click();
  assert.equal(await page.locator('[data-goods-view="catalog"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#goods-search').inputValue(), sample.title.ja);
  assert.equal(await page.locator('#goods-category').inputValue(), 'GOODS');
  assert.ok(await page.locator(`[data-product="${sample.id}"]`).count() > 0);
  await page.locator('#goods-search').fill('');
  assert.equal(await page.locator('.goods-product').count(), merchandiseCatalog.products.filter(product => product.category === 'GOODS').length);
  await page.locator('#goods-search').fill('no-such-product-9876');
  assert.equal(await page.locator('.goods-product').count(), 0);
  assert.match(await page.locator('#goods-results').innerText(), /該当する商品がありません/);
  await page.locator('#goods-search').fill('');
  await page.locator('#goods-category').selectOption('');
  assert.equal(await page.locator('.goods-product').count(), 33);
  pass('catalog search accepts Chinese and Japanese names, combines with categories, preserves filters across language changes and recovers from no results');

  for (const width of [320, 390, 640, 768, 1280]) {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 900 });
    for (const language of ['zh', 'ja']) {
      await page.locator(`[data-lang="${language}"]`).click();
      await noOverflow(`${width}px ${language} catalog`);
      await chooseView('guide');
      await noOverflow(`${width}px ${language} guide`);
      if (width < 600) {
        const bounds = await page.locator('#navigation a').evaluateAll(links => links.map(link => {
          const rect = link.getBoundingClientRect();
          return { x: rect.x, right: rect.right, width: rect.width, height: rect.height };
        }));
        assert.equal(bounds.length, 7);
        for (const box of bounds) {
          assert.ok(box.width >= 44 && box.height >= 44, 'Every mobile tab needs a usable tap target');
          assert.ok(box.x >= 0 && box.right <= width + 1, 'Every mobile tab must stay visible');
        }
      }
      await chooseView('catalog');
    }
  }
  pass('both merchandise views and all seven navigation targets fit bilingual phones, tablets and desktops');

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
  await page.locator('.goods-guide').waitFor();
  assert.match(await page.locator('.goods-hours-note').innerText(), /20:30/);
  await chooseView('catalog');
  assert.equal(await page.locator('.goods-product').count(), 33);
  const files = ['goods.css', 'ui/goods.js', 'data/goods.js', 'data/goods-catalog.js', ...merchandiseCatalog.products.map(product => product.image.replace(/^\.\//, ''))];
  for (const file of files) {
    const response = await page.evaluate(async file => { const res = await fetch('./' + file); return { status: res.status, length: (await res.arrayBuffer()).byteLength }; }, file);
    assert.equal(response.status, 200, `${file} unavailable offline`);
    assert.ok(response.length > 0, `${file} empty offline`);
  }
  assert.deepEqual(errors, []);
  pass('merchandise guide, catalog modules and all 33 thumbnails survive an offline reload under a deployment subdirectory');
  console.log(`${checks} goods checks passed.`);
} finally {
  await context.close();
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
