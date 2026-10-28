import { appGuide } from "../data/apps.js";
import { transportGuide } from "../data/transport.js";

const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const local = language => value => typeof value === "string" ? value : value?.[language] || value?.ja || value?.zh || "";
const externalLinks = (items, loc) => `<div class="guide-links">${(items || []).map(link => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(loc(link.label))}<span aria-hidden="true"> ↗</span></a>`).join("")}</div>`;
const list = (items, loc, ordered = false) => items?.length ? `<${ordered ? "ol" : "ul"} class="reading-list${ordered ? " route-steps" : ""}">${items.map(item => `<li>${esc(loc(item))}</li>`).join("")}</${ordered ? "ol" : "ul"}>` : "";

export function renderApps(language) {
  const loc = local(language);
  const tx = (zh, ja) => language === "ja" ? ja : zh;
  const item = app => `<article class="app-entry" id="app-${esc(app.id)}"><div class="app-heading"><h3>${esc(loc(app.title))}</h3><p class="app-scope">${esc(loc(app.scope))}</p></div><div class="app-instructions"><p>${esc(loc(app.purpose))}</p>${list(app.steps, loc, true)}${app.notes?.length ? `<div class="guide-note">${list(app.notes, loc)}</div>` : ""}${externalLinks(app.links, loc)}${app.activityIds?.length ? `<div class="app-activities">${app.activityIds.map(id => `<a class="button secondary small-button" href="#map" data-location="${esc(id)}">${tx("查看對應活動位置", "対象アクティビティの場所")}</a>`).join("")}</div>` : ""}${app.source ? `<a class="guide-source" href="${esc(app.source)}" target="_blank" rel="noopener noreferrer">${tx("官方說明與來源", "公式の案内・出典")} ↗</a>` : ""}</div></article>`;
  return `<div class="app-guide"><p class="guide-intro">${esc(loc(appGuide.intro))}</p><div class="guide-jump" role="group" aria-label="${tx("App 分類", "アプリの分類")}"><button data-jump="apps-required">${tx("必備／指定活動", "必須・対象体験")}</button><button data-jump="apps-optional">${tx("選用 App", "便利なアプリ")}</button><button data-jump="apps-browser">${tx("免安裝工具", "ブラウザーで使う")}</button></div><section id="apps-required" class="guide-section" tabindex="-1"><h2>${tx("必備 App・依參加項目準備", "必要なアプリ・参加内容に合わせて")}</h2>${appGuide.required.map(item).join("")}</section><section id="apps-optional" class="guide-section" tabindex="-1"><h2>${tx("選用 App・交通與翻譯", "あると便利・移動と翻訳")}</h2><p class="small">${tx("以下是個人準備建議，並非 FanFest 入場要求。", "以下は個人向けの準備案で、ファンフェスの入場条件ではありません。")}</p>${appGuide.optional.map(item).join("")}</section><section id="apps-browser" class="guide-section" tabindex="-1"><h2>${tx("免安裝・用瀏覽器即可", "インストール不要・ブラウザーで利用")}</h2>${appGuide.browserTools.map(item).join("")}</section><p class="guide-verified">${tx("核實日期", "確認日")}：${esc(appGuide.verifiedAt)} · ${tx("下載、登入及外部服務需連線；出發前先完成設定。", "ダウンロード・ログイン・外部サービスには通信が必要です。出発前に準備してください。")}</p></div>`;
}

export function renderTransport(language) {
  const loc = local(language);
  const tx = (zh, ja) => language === "ja" ? ja : zh;
  const airport = transportGuide.airportBus;
  const busTable = `<p class="small bus-table-hint" id="airport-table-help">${tx("晚間班次摘錄・左右滑動查看各航廈。— 表示不停靠會場。", "夕方以降の便を抜粋。左右にスクロールして各ターミナルを確認。— は会場に停車しません。")}</p>
    <div class="bus-table-wrap" tabindex="0" role="region" aria-label="${tx("羽田機場巴士時刻表", "羽田空港行きバス時刻表")}" aria-describedby="airport-table-help">
      <table class="bus-table">
        <caption>${tx("海浜幕張／會場 → 羽田・晚間班次", "海浜幕張・会場 → 羽田の夕方便")} (JST)</caption>
        <thead><tr>
          <th scope="col">${tx("海浜幕張站", "海浜幕張駅")}</th>
          <th scope="col">${tx("幕張 MESSE 中央", "幕張メッセ中央")}</th>
          <th scope="col">${tx("T2 抵達", "T2 到着")}</th>
          <th scope="col">${tx("T1 抵達", "T1 到着")}</th>
          <th scope="col">${tx("T3 抵達", "T3 到着")}</th>
        </tr></thead>
        <tbody>${airport.selectedDepartures.map(row => `<tr><th scope="row">${esc(row.station)}</th><td>${row.messe ? esc(row.messe) : `<span aria-label="${tx("不停靠", "停車なし")}">—</span>`}</td><td>${esc(row.terminal2)}</td><td>${esc(row.terminal1)}</td><td>${esc(row.terminal3)}</td></tr>`).join("")}</tbody>
      </table>
    </div>
    <p class="small">${tx("現行表", "現行表")}：${esc(airport.timetableEffectiveAt)} · ${tx("表定時間，未含交通延誤；晚班不代表適合 00:00 航班。", "予定時刻・道路状況により遅延あり。遅い便が00:00のフライトに適するとは限りません。")}</p>`;
  const route = card => `<article class="transport-route" id="route-${esc(card.id)}" tabindex="-1">
    <div class="route-heading"><h3>${esc(loc(card.title))}</h3>${card.tag ? `<span class="tag">${esc(loc(card.tag))}</span>` : ""}</div>
    ${card.id === "haneda-bus" ? busTable : ""}
    ${list(card.steps, loc, true)}
    ${card.notes?.length ? `<div class="guide-note">${list(card.notes, loc)}</div>` : ""}
    ${externalLinks(card.links, loc)}
  </article>`;
  return `<div class="page-title"><div><h1>${esc(loc(transportGuide.title))}</h1><p>${esc(loc(transportGuide.intro))}</p></div></div>
    <aside class="transport-alert">
      <h2>${esc(loc(transportGuide.airportTitle))}</h2>
      <p>${esc(loc(transportGuide.airportWarning))}</p>
      <div class="event-actions"><button class="button secondary" data-jump="transport-${esc(transportGuide.airportSectionId)}">${tx("查看羽田路線與時刻", "羽田への経路・時刻を見る")}</button><button class="button secondary" data-jump="route-haneda-midnight-example">${tx("00:00 起飛・規劃示例", "00:00出発の計画例")}</button></div>
    </aside>
    <div class="guide-jump" role="group" aria-label="${tx("交通指南章節", "アクセス案内の項目")}">${transportGuide.sections.map(section => `<button data-jump="transport-${esc(section.id)}">${esc(loc(section.title))}</button>`).join("")}</div>
    <div class="transport-guide">${transportGuide.sections.map(section => `<section class="guide-section" id="transport-${esc(section.id)}" tabindex="-1"><h2>${esc(loc(section.title))}</h2>${section.summary ? `<p class="guide-intro">${esc(loc(section.summary))}</p>` : ""}${section.cards.map(route).join("")}</section>`).join("")}
      <section class="airport-checklist guide-section"><h2>${tx("DAY 2 去機場前，先確認", "DAY 2・空港へ向かう前に")}</h2>${list(transportGuide.airportChecklist, loc)}${externalLinks(transportGuide.sourceLinks, loc)}<a class="button secondary" href="#schedule">${tx("回到時間表，安排離場時間", "予定表で出発時間を決める")}</a></section>
      <p class="guide-verified">${tx("交通資料核實日期", "交通情報の確認日")}：${esc(transportGuide.verifiedAt)} · ${tx("時間皆為 JST。此頁可離線閱讀，班次與運行狀況請出發前連線確認。", "時刻はすべて日本時間。本文はオフラインで読めます。便・運行状況は出発前にオンラインで確認してください。")}</p>
    </div>`;
}
