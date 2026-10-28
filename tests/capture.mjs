// Review captures start from clean browser storage. Keep synthetic test fixtures out
// of the official guide screenshots; show a real saved keynote in the list view.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { once } from 'node:events';
import { createServer, root } from '../scripts/serve.mjs';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), headless: true, args: ['--no-sandbox'] });
const server=createServer(); server.listen(0,'127.0.0.1'); await once(server,'listening');
const origin=`http://127.0.0.1:${server.address().port}/`;
const directory=path.join(root,'.impeccable/review'); await mkdir(directory,{recursive:true});
try {
  for(const [name,width,height] of [['mobile',390,844],['desktop',1280,900]]) {
    const context=await browser.newContext({viewport:{width,height}});
    try {
      const page=await context.newPage();
      await page.goto(origin); await page.locator('#navigation a').first().waitFor();
      await page.locator('#footer-offline').filter({hasText:'已可離線使用'}).waitFor();
      async function stable() {
        await page.evaluate(()=>document.fonts.ready);
        await page.evaluate(()=>new Promise(resolve=>{
          let previous='',frames=0;
          const tick=()=>{const map=document.querySelector('.map-viewport');const position=[scrollY,map?.scrollLeft,map?.scrollTop].join(',');frames=position===previous?frames+1:0;previous=position;frames>=5?resolve():requestAnimationFrame(tick)};
          tick();
        }));
        await page.mouse.move(0,0);
        await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
      }
      async function capture(route,suffix=route) {
        await page.locator(`#navigation a[href="#${route}"]`).click();
        await page.locator('h1').waitFor();
        if(route==='tldr') await page.locator('.summary-preview img').evaluate(img=>img.decode());
        await stable();
        await page.screenshot({path:path.join(directory,`final-${name}${suffix?'-'+suffix:''}.png`),fullPage:true});
      }
      await capture('home','');
      await capture('schedule');
      assert.equal(await page.locator('.event-row').count(),12);
      assert.equal(await page.locator('.event-row:has([data-delete-event])').count(),0);
      await page.locator('[data-save="d1-keynote"]').click();
      await capture('list');
      assert.match(await page.locator('.event-row').innerText(),/基調講演/);
      assert.equal(await page.locator('.event-row:has([data-delete-event])').count(),0);
      await capture('activities');
      await capture('tldr');
      await page.locator('#navigation a[href="#map"]').click();
      for(const id of ['hall1-3','messe-entire','toyosuna']) {
        await page.locator('#map-select').selectOption(id);
        await page.locator('#venue-map').evaluate(img=>img.decode());
        const numbers=(await page.locator('.legend-row .map-number').allTextContents()).map(Number).filter(Number.isFinite);
        assert.deepEqual(numbers,[...numbers].sort((a,b)=>a-b));
        if(id==='hall1-3') await page.locator('.legend-row[data-activity="activity-nice-head"]').click();
        await stable();
        if(id==='hall1-3') await page.screenshot({path:path.join(directory,`final-${name}-map.png`),fullPage:true});
        else {
          const device=name==='mobile'?'phone':'desktop';
          await page.screenshot({path:path.join(directory,`map-${device}-${id}.png`)});
          await page.locator('.map-viewport').screenshot({path:path.join(directory,`map-canvas-${device}-${id}.png`)});
        }
      }
    } finally { await context.close(); }
  }
  console.log('PASS clean review captures: official schedule, real saved keynote, both summaries and final sorted maps');
} finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
