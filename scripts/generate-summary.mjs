/**
 * Generate shareable, exact bilingual timeline sheets from verified source data.
 * Uses browser text rendering instead of generative image lettering so dates,
 * times, original Japanese names and reservation constraints remain auditable.
 * Run: node scripts/generate-summary.mjs
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { stages, eventMeta } = await import('../data/stages.js');
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')); }
const out = path.join(root, 'assets/summary');
await mkdir(out, { recursive: true });
const verifiedAt = eventMeta.verifiedAt;
assert.match(verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
const sourceStage = 'https://fanfest.finalfantasyxiv.com/2026/jp/stages/';
const sourceAbout = eventMeta.source;
const sourceReservation = 'https://fanfest.finalfantasyxiv.com/2026/jp/floors/activity-reservation/';
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const text = (value, lang) => typeof value === 'string' ? value : (value?.[lang] || value?.ja || '');
const fixed = stages.filter(item => item.category !== 'broadcast');
const dates = [...new Set(fixed.map(item => item.date))].sort();
assert.deepEqual(dates, ['2026-10-31', '2026-11-01'], 'Review the summary copy when event dates change');
assert.equal(fixed.length, 10, 'Review summary layout if the verified stage count changes');
for (const item of stages) {
  assert.ok(item.id && item.date && item.start && item.title?.zh && item.title?.ja && item.source, `Missing verified stage data: ${item.id}`);
}

// These are gathering times, not promised experience start times. Verified
// against the official reservation page, RETURN TIME section, 2026-10-28.
const photo = {
  '2026-10-31': [{who:'THE PRIMALS', times:'14:00 / 16:15'}],
  '2026-11-01': [{who:'Keiko',times:'12:00 / 14:00 / 16:00'}, {who:'祖堅正慶 & マイケル・クリストファー・コージ・フォックス',times:'13:00 / 15:00'}]
};
const copy = {
  zh: {
    htmlLang:'zh-Hant',title:'兩天行程，一張看懂',subtitle:'FFXIV FAN FESTIVAL 2026 IN TOKYO',
    event:'幕張展覽館・日本時間 JST（UTC+9）', day1:'10 月 31 日（六）',day2:'11 月 1 日（日）',
    opening:'09:00 開場 · 21:00 結束（預定）',stage:'舞台節目',photo:'快速合照・集合時間',reservationOnly:'需事前預約',
    report:'會場實況轉播',reportNote:'節目前及節目間穿插播出，沒有固定結束時間。',
    other:'其他預約活動：11:00–19:30，每 30 分鐘一批。',
    photoNote:'合照欄與其他預約活動列出的是集合時間，不是保證的體驗開始時間。請依自己的票券前往指定隊列。',
    reminders:'預約與入場，先記住這幾件事',
    notes:[
      ['抽選已截止','申請期為 10/21–10/25 23:59；中選者預計於 10/28 前後收到電郵通知。'],
      ['預約頁所列活動：合照須預約','在該頁列出的活動中，只有快速合照必須事前預約；其餘可排一般隊列，預約者優先。名額、贈品與商品可能提前結束。'],
      ['集合時間 ≠ 體驗開始','集合後可能需要等候。超過票面集合時間 30 分鐘，不能再進入預約隊列。'],
      ['請用官方 App 出示票券','電子票截圖或紙本列印無效。請準備 Square Enix App 與足夠電量。']
    ],
    footer:'非官方繁體中文整理 · 舞台時間與集合時間均為日本時間 · 安排可能變更，請以官方公告及現場指示為準。',
    verified:'官方資料核實：',sources:'資料來源：官方「開催概要」「ステージ」「コンテンツ事前予約」',
    alt:'FFXIV FanFest 2026 日本場兩天舞台時間表與預約注意事項，繁體中文版。'
  },
  ja: {
    htmlLang:'ja',title:'2日間の予定を、この1枚に。',subtitle:'FFXIV FAN FESTIVAL 2026 IN TOKYO',
    event:'幕張メッセ・日本時間 JST（UTC+9）',day1:'10月31日（土）',day2:'11月1日（日）',
    opening:'09:00 開場 · 21:00 終了予定',stage:'ステージプログラム',photo:'クイックフォト・集合時刻',reservationOnly:'事前予約が必要',
    report:'会場レポート配信',reportNote:'プログラムの前・合間に配信。固定の終了時刻はありません。',
    other:'その他の予約コンテンツ：11:00–19:30、30分ごと。',
    photoNote:'クイックフォト欄とその他の予約コンテンツの時刻は集合時刻です。体験開始時刻ではありません。ご自身のチケットに従い、予約者用待機列へ。',
    reminders:'予約と入場で、覚えておきたいこと',
    notes:[
      ['抽選の応募受付は終了','応募期間は10/21–10/25 23:59。当選者には10/28頃にメールで連絡予定です。'],
      ['予約ページの対象：フォトは予約必須','この予約対象コンテンツのうち、クイックフォトのみ事前予約が必須。その他は通常の待機列でも参加可能で、予約者優先。配布物や商品は終了する場合があります。'],
      ['集合時刻 ≠ 体験開始時刻','集合後も待ち時間が発生する場合があります。集合時刻から30分を過ぎると予約者用待機列には並べません。'],
      ['チケットは公式アプリで提示','電子チケットのスクリーンショット・紙への印刷は使用不可。スクウェア・エニックス アプリを準備してください。']
    ],
    footer:'非公式の早見表 · 時刻はすべて日本時間 · 内容は変更される場合があります。公式案内・当日の指示をご確認ください。',
    verified:'公式情報確認：',sources:'出典：公式「開催概要」「ステージ」「コンテンツ事前予約」',
    alt:'FFXIV FanFest 2026 in TOKYOの2日間のステージ時刻と予約注意事項をまとめた日本語早見表。'
  }
};

function makeHTML(lang) {
  const c=copy[lang];
  const days=dates.map((date,index)=>{
    const events=fixed.filter(item=>item.date===date).sort((a,b)=>a.start.localeCompare(b.start));
    const hours=eventMeta.hours.find(item=>item.date===date);
    assert.ok(hours?.open && hours?.close, `Missing opening hours: ${date}`);
    const opening=lang==='zh'?`${hours.open} 開場 · ${hours.close} 結束（預定）`:`${hours.open} 開場 · ${hours.close} 終了予定`;
    const broadcasts=stages.filter(item=>item.date===date&&item.category==='broadcast');
    return `<section class="day"><div class="day-header"><div><span class="day-label">DAY ${index+1}</span><h2>${index?c.day2:c.day1}</h2></div><p>${opening}</p></div>
      <div class="section-label">${c.stage}</div>
      <div class="schedule">${events.map(item=>`<article class="event"><div class="time">${escape(item.start)}<small>— ${escape(item.end||'')}</small></div><div><h3>${escape(text(item.shortTitle||item.title,lang))}</h3>${lang==='zh'||item.shortTitle?`<p class="original" lang="ja">${escape(item.title.ja)}</p>`:''}</div></article>`).join('')}</div>
      ${broadcasts.length?`<p class="broadcast"><strong>${escape(broadcasts.map(item=>item.start).join(' / '))} ${c.report}</strong><span>${c.reportNote}</span></p>`:''}
      <div class="photo"><div class="photo-title"><h3>${c.photo}</h3><span>${c.reservationOnly}</span></div><div class="photo-slots">${photo[date].map(item=>`<div><strong>${escape(item.times)}</strong><span>${escape(item.who)}</span></div>`).join('')}</div></div>
    </section>`;
  }).join('');
  return `<!doctype html><html lang="${c.htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${c.title}</title><style>
  :root{color:#173f3b;background:#f6f4ed;font-family:"Noto Sans CJK ${lang==='ja'?'JP':'TC'}",sans-serif;font-synthesis:none}*{box-sizing:border-box}body{margin:0}.sheet{width:1600px;padding:80px 90px 64px;margin:auto}header{padding-bottom:44px;border-bottom:2px solid #173f3b}.brand{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:28px;font-size:25px;letter-spacing:.08em}.brand b{font-family:"Noto Serif CJK ${lang==='ja'?'JP':'TC'}",serif;letter-spacing:.03em;font-size:32px}.brand span{border:1px solid #a8b8ac;padding:7px 18px;letter-spacing:.02em}h1{font-family:"Noto Serif CJK ${lang==='ja'?'JP':'TC'}",serif;font-size:${lang==='ja'?'72':'80'}px;font-weight:700;line-height:1.45;letter-spacing:.015em;margin:0 0 20px}.subtitle{display:flex;justify-content:space-between;gap:24px;color:#52655f;font-size:25px;line-height:1.6}.subtitle p{margin:0}.day{margin-top:52px}.day-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:26px 30px;background:#173f3b;color:#fffefa}.day-header>div{display:flex;align-items:baseline;gap:22px}.day-label{font-size:27px;letter-spacing:.05em;color:#d6e3d3}h2{font-size:43px;line-height:1.5;margin:0;font-weight:700}.day-header p{margin:0;font-size:25px;color:#e5ede3}.section-label{font-size:24px;color:#52655f;margin:22px 0 4px}.event{display:grid;grid-template-columns:218px 1fr;gap:34px;padding:24px 0;border-bottom:1px solid #c9d2c7;align-items:start}.time{font-size:44px;font-weight:650;line-height:1.25;font-variant-numeric:tabular-nums;color:#ad452d;white-space:nowrap}.time small{font-size:26px;font-weight:400;color:#52655f;display:block;margin-top:8px}.event h3{font-size:35px;font-weight:650;line-height:1.5;margin:0;overflow-wrap:anywhere}.original{font-size:24px;line-height:1.55;color:#52655f;margin:7px 0 0}.broadcast{display:flex;gap:22px;align-items:baseline;font-size:23px;color:#52655f;line-height:1.6;margin:19px 0 22px}.broadcast strong{color:#173f3b;font-weight:650;white-space:nowrap}.photo{background:#e5ede3;padding:23px 28px}.photo-title{display:flex;justify-content:space-between;gap:24px;align-items:center}.photo h3{margin:0;font-size:29px}.photo-title>span{font-size:22px;color:#52655f}.photo-slots{display:grid;grid-template-columns:1fr;gap:15px 35px;margin-top:14px}.photo-slots>div{display:flex;align-items:baseline;gap:22px;flex-wrap:wrap}.photo-slots strong{font-size:29px;font-variant-numeric:tabular-nums}.photo-slots span{font-size:25px;color:#52655f}.reservation-note{font-size:24px;color:#52655f;line-height:1.7;margin:25px 0 0}.reservation-note strong{color:#173f3b}.notes{margin-top:48px;padding-top:34px;border-top:2px solid #173f3b}.notes h2{font-size:37px;margin-bottom:22px}.note-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px 50px}.note h3{font-size:28px;margin:0 0 7px;color:#ad452d}.note p{font-size:25px;color:#52655f;line-height:1.65;margin:0}footer{margin-top:38px;padding-top:22px;border-top:1px solid #c9d2c7;color:#52655f;font-size:21px;line-height:1.65}footer p{margin:0 0 9px}.sources{display:flex;justify-content:space-between;gap:22px}.url{font-size:18px;overflow-wrap:anywhere;color:#52655f}.verified{white-space:nowrap}a{color:inherit;text-decoration:none}
  </style></head><body><main class="sheet"><header><div class="brand"><b>FANFEST NOTE</b><span>${lang==='ja'?'日本語':'繁體中文'}</span></div><h1>${c.title}</h1><div class="subtitle"><p>${c.subtitle}</p><p>${c.event}</p></div></header>${days}<p class="reservation-note">${c.photoNote}<br><strong>${c.other}</strong></p><section class="notes"><h2>${c.reminders}</h2><div class="note-grid">${c.notes.map(([title,body])=>`<article class="note"><h3>${title}</h3><p>${body}</p></article>`).join('')}</div></section><footer><p>${c.footer}</p><div class="sources"><span>${c.sources}</span><span class="verified">${c.verified}${verifiedAt}</span></div><p class="url"><a href="${sourceAbout}">${sourceAbout}</a><br><a href="${sourceStage}">${sourceStage}</a><br><a href="${sourceReservation}">${sourceReservation}</a></p></footer></main></body></html>`;
}

const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),headless:true,args:['--no-sandbox']});
const manifest=[];
try{
  for(const lang of ['zh','ja']){
    const html=makeHTML(lang);
    await writeFile(path.join(out,`summary-${lang}.html`),html);
    const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1});
    await page.setContent(html,{waitUntil:'load'});
    await page.evaluate(()=>document.fonts.ready);
    const dimensions=await page.locator('.sheet').evaluate(el=>({width:el.offsetWidth,height:el.offsetHeight}));
    assert.equal(await page.evaluate(()=>document.body.scrollWidth),1600,`${lang} sheet has horizontal overflow`);
    assert.equal(await page.locator('.event').count(),10);
    for(const item of fixed)assert.ok((await page.locator('body').innerText()).includes(text(item.shortTitle||item.title,lang)));
    await page.locator('.sheet').screenshot({path:path.join(out,`summary-${lang}.png`)});
    manifest.push({id:`timeline-${lang}`,lang,title:copy[lang].title,alt:copy[lang].alt,src:`./assets/summary/summary-${lang}.png`,html:`./assets/summary/summary-${lang}.html`,verifiedAt,sources:[sourceAbout,sourceStage,sourceReservation],...dimensions});
    console.log(`${lang}: ${dimensions.width}×${dimensions.height}, 10 fixed stage programs, 2 event days`);
    await page.close();
  }
}finally{await browser.close();}
await writeFile(path.join(root,'data/summary.js'),`// Generated by scripts/generate-summary.mjs from verified official information.\nexport const summaryImages = ${JSON.stringify(manifest,null,2)};\nexport const summaryPhotoSessions = ${JSON.stringify(photo,null,2)};\n`);
