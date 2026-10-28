import { eventData as data } from "./data/events.js";
import { appGuide } from "./data/apps.js";
import { renderTimetable } from "./ui/schedule.js";
import { renderApps, renderTransport } from "./ui/preparation.js";
import { renderGoods, renderGoodsResults } from "./ui/goods.js";
import { goodsGuide } from "./data/goods.js";
const $ = (s) => document.querySelector(s);
const icons = {
  home: "M3 10 12 3l9 7v11H3z M9 21v-8h6v8",
  calendar: "M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16 M8 14h2 M14 14h2 M8 18h2",
  spark: "m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4z",
  map: "m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2z M9 3v16 M15 5v16",
  list: "M9 5h12 M9 12h12 M9 19h12 M3 5l1 1 2-3 M3 12l1 1 2-3 M3 19l1 1 2-3",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  external: "M14 3h7v7 M21 3 10 14 M10 3H3v18h18v-7",
  bookmark: "M6 3h12v18l-6-4-6 4z",
  search: "M20 20l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  info: "M12 8v1 M12 12v5 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  check: "m4 12 5 5L20 6",
  plus: "M12 4v16 M4 12h16",
  download: "M12 3v12 m-5-5 5 5 5-5 M4 16v5h16v-5",
  pin: "M19 9c0 6-7 12-7 12S5 15 5 9a7 7 0 0 1 14 0 M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  bag: "M5 7h14l2 14H3z M9 8V6a3 3 0 0 1 6 0v2",
};
const icon = (name) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name] || icons.info}"/></svg>`;
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const key = "fanfest-note-v1";
let storageOK = true;
function read() {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "{}");
    return value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  } catch {
    storageOK = false;
    return {};
  }
}
function validDate(value) {
  if (typeof value !== "string" || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(value))
    return false;
  const parsed = new Date(value + "T00:00:00Z");
  return (
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}
function validTime(value) {
  return typeof value === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}
function validPersonal(p) {
  return (
    p &&
    typeof p.id === "string" &&
    typeof p.title === "string" &&
    p.title.trim().length > 0 &&
    validDate(p.date) &&
    validTime(p.start) &&
    (p.end === undefined ||
      p.end === "" ||
      (validTime(p.end) && p.end > p.start)) &&
    (p.place === undefined || typeof p.place === "string")
  );
}
const loaded = read();
const state = {
  lang: loaded.lang === "ja" ? "ja" : "zh",
  scheduleMode: loaded.scheduleMode === "chart" ? "chart" : "agenda",
  saved: Array.isArray(loaded.saved)
    ? loaded.saved.filter((x) => typeof x === "string")
    : [],
  checks:
    loaded.checks && typeof loaded.checks === "object" ? loaded.checks : {},
  todos: Array.isArray(loaded.todos)
    ? loaded.todos.filter(
        (x) => x && typeof x.id === "string" && typeof x.title === "string",
      )
    : [],
  personal: Array.isArray(loaded.personal)
    ? loaded.personal.filter(validPersonal)
    : [],
};
let page = location.hash.slice(1) || "home",
  query = "",
  filterDate = "",
  savedOnly = false,
  showForm = false,
  cacheReady = false,
  mapZoom = 100,
  selectedMapId = "messe-entire",
  selectedActivityId = "",
  selectedPointIndex = null,
  activityQuery = "",
  activityMap = "",
  activityView = "events",
  tldrView = "timeline",
  goodsView = "guide",
  goodsQuery = "",
  goodsCategory = "",
  selectedChartEvent = "";
const tx = (zh, ja) => (state.lang === "ja" ? ja : zh);
const loc = (o) =>
  typeof o === "string" ? o : o?.[state.lang] || o?.ja || o?.zh || "";
const jp = (o) =>
  state.lang === "zh" && o?.ja
    ? `<div class="jp-name" lang="ja">${esc(o.ja)}</div>`
    : "";
const save = () => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
    return true;
  } catch {
    storageOK = false;
    toast(
      tx(
        "瀏覽器無法儲存；資料只會保留至本次關閉頁面。",
        "保存できません。このページを閉じると変更は失われます。",
      ),
    );
    return false;
  }
};
let toastTimer;
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => ($("#toast").hidden = true), 4500);
}
const source = (id) => data.sources.find((x) => x.id === id);
const sourceLink = (id) =>
  `<a class="button secondary" href="${source(id).url}" target="_blank" rel="noopener noreferrer">${esc(loc(source(id).title))} · ${tx("官方原文", "公式サイト")}${icon("external")}</a>`;
const sentences = (value) => String(value || "").split(/(?<=[。！？])\s*|\n+/u).map(s => s.trim()).filter(Boolean);
const readingCopy = (value) => `<div class="reading-copy">${sentences(loc(value)).map(s => `<p>${esc(s)}</p>`).join("")}</div>`;
function activityNotes(value) {
  let text = loc(value);
  const hours = [];
  text = text.replace(/(10\/31|11\/1)\s+(\d{1,2}:\d{2}\s*[-–〜~]\s*\d{1,2}:\d{2})(\s*※[^\s]*?\d{1,2}:\d{2})?/gu, (_, date, time, cutoff = "") => {
    hours.push({ date, time, cutoff: cutoff.trim() });
    return " ";
  });
  text = text.replace(/(兩日皆於結束前 30 分鐘停止受理|両日とも、最終受付は終了30分前)\s*/gu, "$1。 ");
  const notes = sentences(text);
  return `${hours.length ? `<section class="activity-hours"><h3>${tx("開放時間", "開催時間")} <small>JST</small></h3><dl>${hours.map(h => `<div><dt>${esc(h.date)}</dt><dd>${esc(h.time)}${h.cutoff ? `<small>${esc(h.cutoff)}</small>` : ""}</dd></div>`).join("")}</dl></section>` : ""}${notes.length ? `<section class="activity-conditions"><h3>${tx("參加前須知", "参加前に確認")}</h3><ul class="reading-list">${notes.map(s => `<li>${esc(s)}</li>`).join("")}</ul></section>` : ""}`;
}
function viewSwitch(attribute, selected, items, label) {
  return `<div class="view-switch" role="group" aria-label="${esc(label)}">${items.map(([value, text]) => `<button type="button" ${attribute}="${value}" aria-pressed="${selected === value}">${esc(text)}</button>`).join("")}</div>`;
}
function mapTransportNav() {
  return `<nav class="section-nav" aria-label="${tx("地圖與交通", "マップ・アクセス")}"><a href="#map" ${page === "map" ? 'aria-current="page"' : ""}>${tx("會場地圖", "会場マップ")}</a><a href="#transport" ${page === "transport" ? 'aria-current="page"' : ""}>${tx("交通・成田機場", "アクセス・成田空港")}</a></nav>`;
}
const defaults = [
  {
    id: "ticket",
    title: {
      zh: "確認入場票券與身分證明",
      ja: "チケットと本人確認書類を確認する",
    },
  },
  {
    id: "reserve",
    title: {
      zh: "查閱活動預約方法與期限",
      ja: "アクティビティの予約方法・期限を確認する",
    },
  },
  {
    id: "offline",
    title: {
      zh: "先連線開啟筆記，確認離線可用",
      ja: "オンラインで開き、オフライン保存を確認する",
    },
  },
  {
    id: "power",
    title: {
      zh: "帶上行動電源與充電線",
      ja: "モバイルバッテリーとケーブルを用意する",
    },
  },
  {
    id: "transport",
    title: {
      zh: "保存去程、回程與集合地點",
      ja: "往復の交通手段と待ち合わせ場所を控える",
    },
  },
];
const nav = [
  ["home", "home", "總覽", "ホーム"],
  ["tldr", "download", "懶人包", "早見表"],
  ["schedule", "calendar", "時間表", "予定表"],
  ["activities", "spark", "活動", "体験"],
  ["goods", "bag", "周邊", "物販"],
  ["map", "map", "地圖", "マップ"],
  ["list", "list", "我的清單", "リスト"],
];
function notice() {
  return data.sourceStatus === "verified"
    ? ""
    : `<aside class="notice">${icon("info")}<div><strong>${tx("官方內容尚未載入", "公式情報はまだ収録されていません")}</strong><p>${tx("目前無法取得官方頁面，因此尚未收錄節目時間、預約條件與會場地圖。請先用下方連結查看日文原文；個人行程與清單可正常使用。", "公式ページを取得できていないため、公演時間・予約条件・会場マップは未収録です。下のリンクから公式情報をご確認ください。個人の予定とリストは利用できます。")}</p></div></aside>`;
}
function header(title, desc, action = "") {
  return `<div class="page-title"><div><h1>${title}</h1><p>${desc}</p></div>${action}</div>`;
}
function empty(title, description, action = "", type = "calendar") {
  return `<div class="empty">${icon(type)}<h2>${title}</h2><p>${description}</p>${action}</div>`;
}
function checkRows(items) {
  return items
    .map(
      (x) =>
        `<div class="check-row ${state.checks[x.id] ? "done" : ""}"><input type="checkbox" id="c-${esc(x.id)}" data-check="${esc(x.id)}" ${state.checks[x.id] ? "checked" : ""}><label for="c-${esc(x.id)}">${esc(loc(x.title))}</label>${x.custom ? `<button class="delete" data-delete-todo="${esc(x.id)}" aria-label="${tx("刪除", "削除")}: ${esc(loc(x.title))}">×</button>` : ""}</div>`,
    )
    .join("");
}
function sourceRows() {
  return `<div class="source-list">${data.sources.map((s, i) => `<a class="source-row" href="${s.url}" target="_blank" rel="noopener noreferrer"><span class="source-symbol">${icon(["calendar", "list", "spark", "map"][i])}</span><span><strong>${esc(loc(s.title))}</strong><small>${state.lang === "zh" ? esc(s.title.ja) + " · " : ""}${tx("官方日文頁面 · 需連線", "公式ページ · オンライン")}</small></span><span class="arrow">${icon("external")}</span></a>`).join("")}</div>`;
}
function home() {
  return `<section class="hero"><div><h1>${tx("你的 FanFest<br><em>隨行筆記。</em>", "ファンフェスを、<br><em>手のひらに。</em>")}</h1><p>${tx("舞台節目、會場活動與自己的待辦。<br>整理好再出發，現場隨手查。", "ステージ、会場のアクティビティ、自分の予定。<br>出かける前にまとめて、会場でさっと確認。")}</p><div class="event-dates">10.31 <small>SAT</small> <span>—</span> 11.01 <small>SUN</small></div><div class="edition"><b>JAPAN 2026</b><span>FINAL FANTASY XIV FAN FESTIVAL</span></div></div><aside class="field-note"><h2>${tx("今天，從這裡開始", "まずは、ここから")}</h2><a href="#tldr"><span>${tx("兩天重點，一張帶走", "2日間の早見表を保存")}<small>${tx("繁中・日文時間表圖片", "中国語・日本語のタイムライン")}</small></span>${icon("download")}</a><a href="#schedule"><span>${tx("看看節目時間", "ステージの予定を確認")}<small>ステージ・タイムテーブル</small></span>${icon("arrow")}</a><a href="#map"><span>${tx("找到下一個目的地", "次の目的地を探す")}<small>会場マップ</small></span>${icon("arrow")}</a><a href="#transport"><span>${tx("去程、散場與成田機場", "行き帰り・成田空港へ")}<small>${tx("車站、巴士與機場路線", "駅・バス・空港へのルート")}</small></span>${icon("arrow")}</a><a href="#list"><span>${tx("記下你的必做清單", "やりたいことをメモ")}<small>マイリスト</small></span>${icon("arrow")}</a></aside></section>${notice()}<div class="venue-strip">${icon("pin")}<span>${tx("幕張展覽館 1–7 展廳・AEON MALL 幕張新都心・豐砂公園", "幕張メッセ 1〜7ホール・イオンモール幕張新都心・豊砂公園")}<small>${tx("10/31、11/1 皆為 09:00 開場／21:00 結束（預定）", "両日 09:00 開場／21:00 終了予定")}</small></span></div><div class="home-grid"><section><div class="section-heading"><h2>${tx("官方資訊，一次找到", "公式情報へのリンク")}</h2><span>${tx("日文原文", "公式サイト")}</span></div>${sourceRows()}</section><section><div class="section-heading"><h2>${tx("出發前的小準備", "出発前のチェック")}</h2><a href="#list">${tx("全部清單", "すべて見る")} →</a></div>${checkRows(defaults.slice(0, 3))}<p class="small">${tx("這是個人準備建議；正式入場規定請以官方公告為準。", "個人向けの準備メモです。入場条件は公式案内をご確認ください。")}</p><div class="info-block"><h3>${tx("把筆記帶著走", "オフラインでも手元に")}</h3><p>${tx("首次連線開啟後，網站會儲存已收錄的內容、六張官方地圖、懶人包與商品圖片（約 26 MB）。看到「已可離線使用」後，即可在沒訊號時查閱。外部網站仍需網路。", "初回オンライン時に収録済みの内容、公式マップ6枚、早見表、商品画像（約26 MB）を保存します。「オフライン利用可能」と表示されたら、電波がなくても読めます。外部サイトには接続が必要です。")}</p><div class="status-line" id="offline-status"></div></div></section></div>${practicalInfo()}`;
}
function personalEvent(x) {
  return {
    ...x,
    personal: true,
    title: { zh: x.title, ja: x.title },
    location: { zh: x.place || "", ja: x.place || "" },
  };
}
function allEvents() {
  return [...data.stages, ...state.personal.map(personalEvent)].sort((a, b) =>
    (a.date + a.start).localeCompare(b.date + b.start),
  );
}
function eventRow(e) {
  const saved = e.personal || state.saved.includes(e.id);
  return `<article class="event-row"><div class="event-time">${esc(e.start || "—")}<small>${e.end ? esc(e.end) : e.category === "broadcast" ? tx("起・間歇播出", "〜 随時中継") : tx("結束時間未定", "終了時刻未定")}</small></div><div><span class="tag">${e.personal ? tx("個人安排", "自分の予定") : e.category === "broadcast" ? tx("會場直播・非舞台場次", "会場中継・ステージ枠外") : e.category === "concert" ? tx("音樂節目", "音楽ステージ") : tx("官方節目", "公式プログラム")}</span><h3>${esc(loc(e.title))}</h3>${!e.personal ? jp(e.title) : ""}<div class="event-meta"><span>${esc(e.date)} · JST</span>${e.location ? `<span>${esc(loc(e.location))}</span>` : ""}</div>${e.description ? readingCopy(e.description) : ""}<div class="event-actions"><button class="button secondary small-button" data-calendar="${esc(e.id)}">${icon("download")}${tx("日曆提醒", "カレンダーへ")}</button>${e.locationId ? `<a class="button secondary small-button" href="#map" data-location="${esc(e.locationId)}">${tx("查看位置", "場所を見る")}</a>` : ""}${e.source ? `<a class="small" href="${esc(e.source)}" target="_blank" rel="noopener noreferrer">${tx("官方原文", "公式情報")} ↗</a>` : ""}${e.personal ? `<button class="button secondary small-button" data-delete-event="${esc(e.id)}">${tx("刪除", "削除")}</button>` : ""}</div></div>${e.personal ? "" : `<button class="save-button" aria-pressed="${saved}" aria-label="${saved ? tx("移除收藏", "保存を解除") : tx("收藏節目", "予定を保存")}: ${esc(loc(e.title))}" data-save="${esc(e.id)}">${icon("bookmark")}</button>`}</article>`;
}
function form() {
  return `<form class="event-form" id="event-form" ${showForm ? "" : "hidden"}><h2>${tx("新增個人安排", "自分の予定を追加")}</h2><p class="small">${tx("時間一律使用日本時間（JST，UTC+9）。這是你自己的安排，不是官方節目。", "時刻は日本時間（JST、UTC+9）で入力してください。公式プログラムとは別の個人の予定です。")}</p><div class="form-grid"><label class="wide">${tx("名稱", "タイトル")}<input required name="title" maxlength="100" placeholder="${tx("例如：和朋友在入口集合", "例：友達と入口で待ち合わせ")}"></label><label class="wide">${tx("日期", "日付")}<input required name="date" type="date"></label><label>${tx("開始時間", "開始時刻")}<input required name="start" type="time"></label><label>${tx("結束時間（選填）", "終了時刻（任意）")}<input name="end" type="time"></label><label class="wide">${tx("地點（選填）", "場所（任意）")}<input name="place" maxlength="150"></label></div><p class="form-error" id="form-error" role="alert"></p><div class="form-actions"><button class="button" type="submit">${tx("儲存安排", "予定を保存")}</button><button class="button secondary" type="button" data-cancel-form>${tx("取消", "キャンセル")}</button></div></form>`;
}
function schedule() {
  const dates = [...new Set(allEvents().map((e) => e.date))];
  return (
    header(
      tx("時間表", "予定表"),
      tx(
        "先安排想看的節目，再留一點時間探索。所有時間皆為日本時間。",
        "見たいステージを決めて、会場を巡る時間も。時刻はすべて日本時間です。",
      ),
      `<button class="button" data-add-event>${icon("plus")}${tx("新增安排", "予定を追加")}</button>`,
    ) +
    notice() +
    form() +
    viewSwitch("data-schedule-mode", state.scheduleMode, [["agenda", tx("行程列表", "リスト")], ["chart", tx("圖表時間軸", "タイムテーブル")]], tx("時間表顯示方式", "予定表の表示")) +
    `<div class="toolbar"><label class="search">${icon("search")}<input id="event-search" type="search" aria-label="${tx("搜尋節目", "予定を検索")}" placeholder="${tx("搜尋中文、日文名稱或地點", "タイトル・場所で検索")}" value="${esc(query)}"></label><select id="date-filter" aria-label="${tx("選擇日期", "日付を選択")}"><option value="">${tx("所有日期", "すべての日付")}</option>${dates.map((d) => `<option ${filterDate === d ? "selected" : ""}>${esc(d)}</option>`).join("")}</select><button class="button secondary" id="saved-filter" aria-pressed="${savedOnly}">${icon("bookmark")}${tx("只看我的安排", "保存した予定")}</button></div><div id="event-results">${eventResults()}</div>${stageRules()}<p class="small">${tx("提醒：下載 .ics 日曆檔後，需匯入手機日曆並確認提醒設定。本站不會在關閉後發出背景通知。", "通知：.ics ファイルを端末のカレンダーに取り込み、通知設定を確認してください。このサイトは閉じた状態で通知しません。")}</p>`
  );
}
function stageRules() {
  return `<section class="stage-guidance"><h2>${tx("觀賞與直播須知", "観覧・配信について")}</h2>${(data.stageGuidance || []).map((g) => `<details class="practical-item"><summary>${esc(loc(g.title))}</summary>${readingCopy(g.description)}<a class="small" href="${esc(g.source)}" target="_blank" rel="noopener noreferrer">${tx("官方說明", "公式案内")} ↗</a></details>`).join("")}</section>`;
}
function eventResults() {
  const list = allEvents().filter(
    (e) =>
      (!filterDate || e.date === filterDate) &&
      (!savedOnly || e.personal || state.saved.includes(e.id)) &&
      [loc(e.title), e.title?.ja, e.title?.zh, loc(e.location)]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  if (!list.length)
    return empty(
      allEvents().length
        ? tx("找不到符合的安排", "一致する予定がありません")
        : tx("等待官方時間表", "公式タイムテーブルは未収録です"),
      allEvents().length
        ? tx(
            "換個關鍵字，或清除日期與收藏篩選。",
            "検索語や日付・保存済みの絞り込みを変更してください。",
          )
        : tx(
            "目前尚未核實官方節目與日期。你可以先記下自己的集合、交通或用餐安排。",
            "公式の公演内容と日付はまだ確認できていません。待ち合わせ・移動・食事など、自分の予定を先に記録できます。",
          ),
      sourceLink("stages"),
    );
  return renderTimetable({ events: list, dates: [...new Set(list.map(e => e.date))], mode: state.scheduleMode, language: state.lang, eventRow });
}
function updateChartDetail(focus = false) {
  const detail = $("#chart-detail");
  const selected = allEvents().find(e => e.id === selectedChartEvent);
  const button = [...document.querySelectorAll("[data-chart-event]")].find(b => b.dataset.chartEvent === selectedChartEvent);
  if (!detail || !selected || !button) return;
  detail.innerHTML = eventRow(selected);
  document.querySelectorAll("[data-chart-event]").forEach(b => b.setAttribute("aria-expanded", b === button));
  if (focus) {
    detail.focus({ preventScroll: true });
    detail.scrollIntoView({ block: "center", behavior: "instant" });
  }
}
function activityDetail(a, compact = false) {
  const related = appGuide.required.filter(app => app.activityIds.includes(a.id));
  return `<div class="activity-detail"><div class="activity-title"><span class="map-number">${esc(a.number ?? "—")}</span><div><h2>${esc(loc(a.title))}</h2>${jp(a.title)}</div></div>${a.location ? `<div class="activity-place">${icon("pin")}<span>${esc(loc(a.location))}</span></div>` : ""}<section class="activity-description"><h3>${tx("活動內容", "内容")}</h3>${readingCopy(a.description)}</section>${a.notes ? activityNotes(a.notes) : ""}${a.id === "goods-store" ? `<section class="activity-goods"><h3>${tx("物販資訊與營業時間", "物販情報・販売時間")}</h3>${readingCopy(goodsGuide.hoursNote)}<a class="button secondary" href="#goods">${tx("完整購買須知與商品目錄", "購入ガイドとグッズ一覧")}${icon("arrow")}</a></section>` : ""}${related.length ? `<div class="activity-apps"><strong>${tx("這個活動需要準備 App", "この体験に必要なアプリ")}</strong><p>${related.map(app => esc(loc(app.title))).join(" · ")}</p><button class="button secondary" data-open-apps>${tx("查看下載與設定", "ダウンロード・準備を見る")}${icon("arrow")}</button></div>` : ""}<div class="event-actions"><button class="button secondary" data-save="${esc(a.id)}" aria-pressed="${state.saved.includes(a.id)}">${icon("bookmark")}${state.saved.includes(a.id) ? tx("已收藏", "保存済み") : tx("加入清單", "リストに追加")}</button>${!compact ? `<a class="button secondary" href="#map" data-location="${esc(a.id)}">${icon("pin")}${tx("在地圖上找", "マップで探す")}</a>` : ""}<a class="small" href="${esc(a.source || source("floors").url)}" target="_blank" rel="noopener noreferrer">${tx("官方原文", "公式情報")} ↗</a></div></div>`;
}
function activityResults() {
  const q = activityQuery.trim().toLowerCase();
  const list = data.activities.filter(
    (a) =>
      (!activityMap || a.mapId === activityMap) &&
      [a.number, loc(a.title), a.title?.zh, a.title?.ja, loc(a.description)]
        .join(" ")
        .toLowerCase()
        .includes(q),
  );
  return (
    `<p class="small">${list.length} ${tx("項活動與服務", "件のアクティビティ・サービス")}</p>` +
    (list.length
      ? list
          .map(
            (a) =>
              `<details class="activity-accordion" id="activity-${esc(a.id)}"><summary><span class="map-number">${esc(a.number ?? "—")}</span><span><strong>${esc(loc(a.title))}</strong>${jp(a.title)}</span>${icon("plus")}</summary>${activityDetail(a)}</details>`,
          )
          .join("")
      : empty(
          tx("沒有符合的活動", "該当する項目がありません"),
          tx(
            "可以搜尋編號、中文或日文名稱。",
            "番号・中国語名・日本語名で検索できます。",
          ),
          "",
          "search",
        ))
  );
}
function activities() {
  return (
    header(
      tx("會場活動", "会場のアクティビティ"),
      tx(
        "保留日文名稱，方便現場對照。點開活動可查看條件與地圖位置。",
        "名称や参加条件を確認し、地図で場所を探せます。",
      ),
    ) +
    viewSwitch("data-activity-view", activityView, [["events", tx("活動一覽", "アクティビティ")], ["apps", tx("必備與選用 App", "必要・便利なアプリ")]], tx("活動資訊", "アクティビティ情報")) +
    (activityView === "apps" ? renderApps(state.lang) : `<section class="reservation-note"><h2>${tx("預約與參加方式", "予約・参加について")}</h2><div class="reservation-grid">${(data.reservationInfo || []).map((r) => `<details><summary>${esc(loc(r.title))}</summary>${readingCopy(r.body)}</details>`).join("")}</div>${sourceLink("reservation")}</section>` +
    `<div class="toolbar"><label class="search">${icon("search")}<input id="activity-search" type="search" value="${esc(activityQuery)}" aria-label="${tx("搜尋活動", "アクティビティ検索")}" placeholder="${tx("搜尋活動名稱、編號…", "名称・番号で検索…")}"></label><select id="activity-map-filter" aria-label="${tx("篩選會場", "会場で絞り込み")}"><option value="">${tx("全部會場", "すべての会場")}</option>${[...new Set(data.activities.map((a) => a.mapId).filter(Boolean))].map((id) => `<option value="${esc(id)}" ${activityMap === id ? "selected" : ""}>${esc(loc(data.maps.find((m) => m.id === id)?.title) || id)}</option>`).join("")}</select></div><div id="activity-results">${activityResults()}</div>`)
  );
}
function activeMap() {
  return data.maps.find((m) => m.id === selectedMapId) || data.maps[0];
}
function mapLegend() {
  const map = activeMap();
  if (!map) return "";
  const ids = new Set(
    (map.hotspots || []).flatMap((p) => p.activityIds || [p.activityId]),
  );
  const list = data.activities.filter(
    (a) => ids.has(a.id) || a.mapId === map.id,
  ).sort((a,b)=>Number(a.number??0)-Number(b.number??0));
  return list.length
    ? `<p class="small">${list.length} ${tx("個項目 · 編號順序排列，可在索引內捲動", "件 · 番号順。リスト内をスクロールできます")}</p><div class="map-legend">${list.map((a) => `<button class="legend-row" data-activity="${esc(a.id)}" aria-pressed="${selectedActivityId === a.id}"><span class="map-number">${esc(a.number ?? "—")}</span><span>${esc(loc(a.title))}${jp(a.title)}</span>${icon("arrow")}</button>`).join("")}</div>`
    : `<p class="small">${tx("此圖為交通／會場全景，請切換編號地圖查看活動。", "全体図・アクセス図です。番号付きマップに切り替えると各項目を選べます。")}</p>`;
}
function mapCanvas() {
  const map = activeMap();
  if (!map) return "";
  return `<div class="map-canvas" id="map-canvas" style="width:${mapZoom}%"><img id="venue-map" draggable="false" src="${esc(map.src)}" width="${map.width || 1600}" height="${map.height || 1000}" alt="${esc(loc(map.title))} · ${tx("官方地圖", "公式マップ")}">${(
    map.hotspots || []
  )
    .map((p, pointIndex) => {
      const ids = p.activityIds || [p.activityId];
      const a = data.activities.find((a) => a.id === ids[0]);
      return `<button class="map-pin ${ids.includes(selectedActivityId) ? "selected" : ""}" style="left:${p.x}%;top:${p.y}%" data-activity="${esc(ids[0])}" data-point-index="${pointIndex}" aria-label="${esc(String(p.number ?? a?.number ?? ""))} ${esc(loc(a?.title || p.label))}" aria-pressed="${ids.includes(selectedActivityId)}">${esc(p.number ?? a?.number ?? "S")}</button>`;
    })
    .join("")}</div>`;
}
function mapSelection() {
  const a = data.activities.find((a) => a.id === selectedActivityId);
  if (a) {
    const siblings = data.activities.filter(
      (b) =>
        b.id !== a.id &&
        a.number != null &&
        b.number === a.number &&
        b.mapId === a.mapId,
    );
    return (
      activityDetail(a, true) +
      (siblings.length
        ? `<div class="same-location"><p>${tx("同一編號還有：", "同じ番号のコンテンツ：")}</p>${siblings.map((b) => `<button class="button secondary" data-activity="${esc(b.id)}">${esc(loc(b.title))}</button>`).join("")}</div>`
        : "")
    );
  }
  return `<div class="map-prompt">${icon("pin")}<h2>${tx("點選編號，看看這裡有甚麼", "番号を選んで、内容を確認")}</h2><p>${tx("可直接點選原圖編號，或使用下方的大按鈕索引。同一編號若有多個活動，可分別查看。", "原図の番号か、下の大きな一覧ボタンから選べます。同じ番号に複数の項目がある場合は、それぞれ確認できます。")}</p></div>`;
}
function practicalInfo() {
  return (data.practical || []).length
    ? `<section class="practical-info"><div class="section-heading"><h2>${tx("交通、入場與補給", "アクセス・入場・飲食")}</h2></div>${data.practical.map((p) => `<details class="practical-item"><summary>${esc(loc(p.title))}</summary>${readingCopy(p.body || p.description)}${p.source ? `<a class="small" href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">${tx("官方說明", "公式案内")} ↗</a>` : ""}</details>`).join("")}</section>`
    : "";
}
function maps() {
  const map = activeMap();
  if (!map) return header(tx("會場地圖", "会場マップ"), "") + notice();
  return (
    mapTransportNav() +
    header(
      tx("會場地圖", "会場マップ"),
      tx(
        "官方原圖，編號對照。可放大、拖曳捲動，並點選編號查看活動。",
        "公式マップの番号から内容を確認。拡大・スクロールして、番号を選んでください。",
      ),
    ) +
    `<div class="map-toolbar"><label for="map-select">${tx("選擇地圖", "マップを選択")}</label><select id="map-select">${data.maps.map((m) => `<option value="${esc(m.id)}" ${m.id === map.id ? "selected" : ""}>${esc(loc(m.title))}</option>`).join("")}</select><a class="small" id="map-original" href="${esc(map.source)}" target="_blank" rel="noopener noreferrer">${tx("官方原圖", "公式の原図")} ↗</a></div><div class="map-workspace"><section><div class="map-controls"><button class="button secondary" data-zoom="-25" aria-label="${tx("縮小", "縮小")}" ${mapZoom <= 100 ? "disabled" : ""}>−</button><span id="zoom-label">${mapZoom}%</span><button class="button secondary" data-zoom="25" aria-label="${tx("放大", "拡大")}" ${mapZoom >= 800 ? "disabled" : ""}>＋</button><button class="button secondary" data-reset-map>${tx("重設", "リセット")}</button></div><div class="map-viewport" tabindex="0" aria-label="${tx("可捲動的官方會場地圖", "スクロール可能な公式会場マップ")}">${mapCanvas()}</div><p class="small">${tx("編號依各地圖分開計算；請同時核對會場名稱。官方底圖 © SQUARE ENIX。", "番号はマップごとに異なります。会場名も確認してください。公式マップ © SQUARE ENIX。")}</p><div id="map-selection" tabindex="-1" aria-live="polite">${mapSelection()}</div></section><aside><div class="section-heading"><h2>${tx("編號索引", "番号で探す")}</h2></div><div id="map-legend">${mapLegend()}</div></aside></div>${practicalInfo()}`
  );
}
function summaryPhotoText(date){
 const groups=data.summaryPhotoSessions[date]||[];
 const hours=data.eventMeta.hours.find(h=>h.date===date);
 return `<div class="summary-photo"><h3>${tx('快速合照・集合時間（須事前預約）','クイックフォト・集合時刻（要事前予約）')}</h3>${groups.map(g=>`<p><strong>${esc(g.times)}</strong> ${esc(g.who)}</p>`).join('')}<p class="small">${tx('合照時段是預約票的集合時間，不是保證的體驗開始時間。','フォトの時刻は予約チケットの集合時刻で、体験開始時刻ではありません。')}</p><p class="small">${tx('當日開場','開場')} ${esc(hours.open)} · ${tx('結束預定','終了予定')} ${esc(hours.close)} JST</p></div>`;
}
function tldr() {
  const language = state.lang;
  const sheet = data.summaryImages.find((s) => s.lang === language);
  return (
    header(
      tx("兩天行程，一張看懂", "2日間の予定を、1枚に"),
      tx(
        "儲存到相簿，沒訊號也能看。中日文各一張，所有時間皆為日本時間。",
        "画像を端末に保存すれば、電波がなくても確認できます。中国語・日本語の各1枚。時刻は日本時間です。",
      ),
    ) +
    `<div class="guide-toolbar">${viewSwitch("data-tldr-view", tldrView, [["timeline", tx("時間表圖片", "早見表画像")], ["apps", tx("必備與選用 App", "必要・便利なアプリ")]], tx("懶人包內容", "早見表の内容"))}<a class="text-link" href="#transport">${tx("交通・成田機場", "アクセス・成田空港")} ${icon("arrow")}</a></div>` +
    (tldrView === "apps" ? renderApps(state.lang) : `<div class="summary-actions"><a class="button" id="download-summary" href="./assets/summary/summary-${language}.png" download="fanfest-2026-${language}.png">${icon("download")}${tx("下載繁中懶人包", "日本語の早見表を保存")}</a><a class="button secondary" href="./assets/summary/summary-${language === "zh" ? "ja" : "zh"}.png" download="fanfest-2026-${language === "zh" ? "ja" : "zh"}.png">${tx("另存日文版", "中国語版も保存")}</a></div><p class="small">${tx("若手機改為開啟圖片，可長按圖片儲存。整理日期：", "画像が開いた場合は、長押しして保存してください。確認日：")}${esc(data.verifiedAt)} · ${tx("節目可能調整，以官方公告為準。", "内容は変更になる場合があります。公式発表をご確認ください。")}</p><a class="summary-preview" href="./assets/summary/summary-${language}.png" target="_blank" aria-label="${tx("開啟原尺寸時間表圖片", "タイムライン画像を原寸で開く")}"><img src="./assets/summary/summary-${language}.png" width="${sheet.width}" height="${sheet.height}" alt="${tx("10月31日及11月1日 FanFest 舞台節目與預約重點總覽；相同節目資料可於下方文字版閱讀。", "10月31日・11月1日のファンフェスのステージと予約の要点。予定の内容は下のテキストでも読めます。")}" loading="eager"></a><details class="summary-text"><summary>${tx("閱讀文字版時間表", "タイムラインをテキストで読む")}</summary>${data.dates
      .map(
        (date) =>
          `<h2>${esc(date)} · JST</h2><ul>${data.stages
            .filter((e) => e.date === date)
            .sort((a, b) => a.start.localeCompare(b.start))
            .map(
              (e) =>
                `<li><time>${esc(e.start)}${e.end ? "–" + esc(e.end) : ""}</time><span>${esc(loc(e.title))}${jp(e.title)}${e.category==='broadcast'?`<small class="jp-name">${tx("開演前及節目空檔間歇播出，沒有固定結束時間。","開演前・幕間に随時配信。固定の終了時刻はありません。")}</small>`:''}</span></li>`,
            )
            .join("")}</ul>${summaryPhotoText(date)}`,
      )
      .join(
        "",
      )}<h2>${tx("預約重點", "予約の要点")}</h2>${(data.reservationInfo || []).map((r) => `<h3>${esc(loc(r.title))}</h3>${readingCopy(r.body)}`).join("")}</details>`)
  );
}

function myList() {
  const items = [
      ...defaults,
      ...state.todos.map((x) => ({ ...x, custom: true })),
    ],
    done = items.filter((x) => state.checks[x.id]).length;
  const events = allEvents().filter(
      (x) => x.personal || state.saved.includes(x.id),
    ),
    acts = data.activities.filter((x) => state.saved.includes(x.id));
  return (
    header(
      tx("我的隨行清單", "マイリスト"),
      tx(
        "想做的事，慢慢打勾。資料保存在這個瀏覽器。",
        "やりたいことを、一つずつ。このブラウザーに保存されます。",
      ),
    ) +
    `<div class="two-column"><section><div class="section-heading"><h2>${tx("準備與待辦", "準備・やること")}</h2><span>${done} / ${items.length} ${tx("已完成", "完了")}</span></div><form id="todo-form" class="inline-form"><input name="todo" required maxlength="150" aria-label="${tx("新增待辦事項", "やることを追加")}" placeholder="${tx("記下想做的事…", "やりたいことをメモ…")}"><button class="button" type="submit">${icon("plus")}${tx("新增", "追加")}</button></form>${checkRows(items)}<p class="small">${tx("清單是個人準備建議。清除瀏覽器資料會一併刪除紀錄；不同裝置不會自動同步。", "準備項目は個人向けのメモです。ブラウザーのデータを消すと記録も消えます。端末間の自動同期はありません。")}</p><button class="button secondary" id="export-notes">${icon("download")}${tx("匯出筆記備份", "メモをバックアップ")}</button><button class="button secondary" id="import-trigger">${tx("匯入備份", "バックアップを読込")}</button><input id="import-notes" type="file" accept="application/json,.json" hidden></section><section><div class="section-heading"><h2>${tx("我的安排", "保存した予定")}</h2><a href="#schedule">${tx("管理行程", "予定表へ")} →</a></div>${events.length ? events.map(eventRow).join("") : empty(tx("把喜歡的節目留在這裡", "気になる予定をここに"), tx("在時間表收藏節目，或新增自己的安排，就會出現在這裡。", "予定表で保存したプログラムや、自分で追加した予定がここに表示されます。"), `<a class="button secondary" href="#schedule">${tx("前往時間表", "予定表を開く")} →</a>`, "bookmark")}${acts.length ? `<h2>${tx("已收藏活動", "保存したアクティビティ")}</h2>${acts.map((a) => `<div class="activity"><strong>${esc(loc(a.title))}</strong>${jp(a.title)}<a class="button secondary" href="#map" data-location="${esc(a.id)}">${tx("查看位置", "場所を見る")}</a><button class="button secondary" data-save="${esc(a.id)}">${tx("移除", "削除")}</button></div>`).join("")}` : ""}</section></div>`
  );
}
function render() {
  if (!nav.some((x) => x[0] === page) && page !== "transport") page = "home";
  document.documentElement.lang = state.lang === "ja" ? "ja" : "zh-Hant";
  document.title = tx(
    "FanFest Note · 隨行筆記",
    "FanFest Note · ファンフェス手帖",
  );
  document
    .querySelectorAll("[data-lang]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", b.dataset.lang === state.lang),
    );
  $("#navigation").innerHTML = nav
    .map(
      ([id, ic, zh, ja]) =>
        `<a href="#${id}" ${page === id || (page === "transport" && id === "map") ? 'aria-current="page"' : ""}>${icon(ic)}<span>${tx(zh, ja)}</span>${id === "list" && state.saved.length ? `<span class="count">${state.saved.length}</span>` : ""}</a>`,
    )
    .join("");
  $("#main").innerHTML = {
    home,
    schedule,
    activities,
    tldr,
    goods: () => renderGoods({ language: state.lang, view: goodsView, query: goodsQuery, category: goodsCategory }),
    map: maps,
    transport: () => mapTransportNav() + renderTransport(state.lang),
    list: myList,
  }[page]();
  $("#footer").innerHTML =
    `<div><p>FANFEST NOTE · ${tx("朋友間的非官方隨行指南", "友達と使う非公式ガイド")}</p><p>${tx("FINAL FANTASY XIV 與官方圖文之權利歸 SQUARE ENIX 所有。", "FINAL FANTASY XIV および公式コンテンツの権利は SQUARE ENIX に帰属します。")}</p></div><div><p>${tx("所有活動時間：日本時間 JST（UTC+9）", "イベント時刻：日本時間 JST（UTC+9）")}</p><p>${data.verifiedAt ? tx("官方資料核實日期：", "公式情報の確認日：") + esc(data.verifiedAt) : tx("官方資料：尚待核實", "公式情報：未確認")}</p><div id="footer-offline" class="status-line"></div></div>`;
  updateStatus();
  updateChartDetail();
  if (!storageOK)
    toast(
      tx(
        "瀏覽器儲存功能不可用，請匯出筆記備份。",
        "ブラウザーに保存できません。メモをエクスポートしてください。",
      ),
    );
}
function updateStatus() {
  const status = cacheReady
    ? tx("已可離線使用", "オフライン利用可能")
    : tx("離線資料尚未就緒", "オフライン保存は未完了");
  for (const id of ["#offline-status", "#footer-offline"])
    if ($(id))
      $(id).innerHTML =
        icon(cacheReady ? "check" : "info") + `<span>${status}</span>`;
  $("#connection").textContent = navigator.onLine
    ? tx("目前連線中", "オンライン")
    : tx("目前離線", "オフライン");
  $("#connection").classList.toggle("offline", !navigator.onLine);
}
function download(content, type, name) {
  const blob = new Blob([content], { type }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
function calendar(e) {
  if (
    !validDate(e.date) ||
    !validTime(e.start) ||
    (e.end && !validTime(e.end))
  ) {
    toast(
      tx(
        "日期或時間無效，無法匯出日曆。",
        "日付または時刻が無効なため、出力できません。",
      ),
    );
    return;
  }
  const escapeICS = (s) =>
    String(s)
      .replace(/\\/g, "\\\\")
      .replace(/\r?\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  const stamp = (date, time) =>
    new Date(`${date}T${time}:00+09:00`)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z/, "Z");
  const start = stamp(e.date, e.start);
  const end = e.end ? stamp(e.date, e.end) : null;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FanFest Note//Personal Guide//ZH",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${e.id}@fanfest-note.local`,
    `DTSTAMP:${new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z/, "Z")}`,
    `DTSTART:${start}`,
    ...(end ? [`DTEND:${end}`] : []),
    `SUMMARY:${escapeICS(loc(e.title))}`,
    `LOCATION:${escapeICS(loc(e.location))}`,
    `DESCRIPTION:${escapeICS(tx("FanFest Note 隨行筆記。時間以日本時間輸入；請確認日曆提醒設定。", "FanFest Note。日本時間で入力した予定です。カレンダーの通知設定を確認してください。"))}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeICS(loc(e.title))}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const folded = lines.flatMap((line) => {
    let chunks = [],
      part = "",
      length = 0;
    for (const char of line) {
      const bytes = new TextEncoder().encode(char).length;
      if (length + bytes > 74) {
        chunks.push(part);
        part = " ";
        length = 1;
      }
      part += char;
      length += bytes;
    }
    chunks.push(part);
    return chunks;
  });
  download(
    folded.join("\r\n") + "\r\n",
    "text/calendar;charset=utf-8",
    `fanfest-${e.date}.ics`,
  );
  toast(
    tx(
      "已下載日曆檔，請匯入日曆並確認提醒。",
      "カレンダーファイルをダウンロードしました。取り込んで通知を確認してください。",
    ),
  );
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("button,a");
  if (!b) return;
  if (b.dataset.goodsView) {
    goodsView = b.dataset.goodsView;
    render();
    document.querySelector(`[data-goods-view="${goodsView}"]`)?.focus({ preventScroll: true });
  }
  if (b.dataset.scheduleMode) {
    state.scheduleMode = b.dataset.scheduleMode === "chart" ? "chart" : "agenda";
    save();
    render();
    document.querySelector(`[data-schedule-mode="${state.scheduleMode}"]`)?.focus({ preventScroll: true });
  }
  if (b.dataset.chartEvent) {
    selectedChartEvent = b.dataset.chartEvent;
    updateChartDetail(true);
  }
  if (b.dataset.activityView) {
    activityView = b.dataset.activityView;
    render();
    document.querySelector(`[data-activity-view="${activityView}"]`)?.focus({ preventScroll: true });
  }
  if (b.dataset.tldrView) {
    tldrView = b.dataset.tldrView;
    render();
    document.querySelector(`[data-tldr-view="${tldrView}"]`)?.focus({ preventScroll: true });
  }
  if (b.hasAttribute("data-open-apps")) {
    activityView = "apps";
    if (page !== "activities") location.hash = "activities";
    else { render(); $("#main").focus(); window.scrollTo(0, 0); }
  }
  if (b.dataset.jump) {
    const target = document.getElementById(b.dataset.jump);
    if (target) { target.focus({ preventScroll: true }); target.scrollIntoView({ block: "start", behavior: "instant" }); }
  }
  if (b.classList.contains("skip-link")) {
    e.preventDefault();
    $("#main").focus();
    return;
  }
  if (b.dataset.lang) {
    state.lang = b.dataset.lang;
    save();
    render();
  }
  if (b.hasAttribute("data-add-event")) {
    showForm = true;
    $("#event-form").hidden = false;
    $("#event-form").scrollIntoView({ behavior: "smooth", block: "center" });
    $("#event-form [name=title]").focus();
  }
  if (b.hasAttribute("data-cancel-form")) {
    showForm = false;
    $("#event-form").hidden = true;
  }
  if (b.dataset.save) {
    const id = b.dataset.save;
    state.saved = state.saved.includes(id)
      ? state.saved.filter((x) => x !== id)
      : [...state.saved, id];
    save();
    render();
  }
  if (b.id === "saved-filter") {
    savedOnly = !savedOnly;
    render();
  }
  if (b.dataset.calendar) {
    const item = allEvents().find((x) => x.id === b.dataset.calendar);
    if (item) calendar(item);
  }
  if (b.dataset.deleteEvent) {
    state.personal = state.personal.filter(
      (x) => x.id !== b.dataset.deleteEvent,
    );
    save();
    render();
    toast(tx("已移除個人安排", "個人の予定を削除しました"));
  }
  if (b.dataset.deleteTodo) {
    state.todos = state.todos.filter((x) => x.id !== b.dataset.deleteTodo);
    delete state.checks[b.dataset.deleteTodo];
    save();
    render();
  }
  if (b.id === "import-trigger") $("#import-notes").click();
  if (b.id === "export-notes")
    download(
      JSON.stringify({ format: "fanfest-note", version: 1, ...state }, null, 2),
      "application/json",
      "fanfest-note-backup.json",
    );
  if (b.dataset.location) {
    const id = b.dataset.location;
    const a = data.activities.find((a) => a.id === id);
    selectedActivityId = id;
    selectedPointIndex = null;
    const m =
      data.maps.find((m) =>
        (m.hotspots || []).some((p) =>
          (p.activityIds || [p.activityId]).includes(id),
        ),
      ) || data.maps.find((m) => m.id === a?.mapId);
    if (m) selectedMapId = m.id;
    mapZoom = 100;
    if (page === "map") {
      e.preventDefault();
      render();
      requestAnimationFrame(focusMapSelection);
    }
  }
  if (b.dataset.activity) {
    selectedActivityId = b.dataset.activity;
    selectedPointIndex = b.hasAttribute("data-point-index")
      ? Number(b.dataset.pointIndex)
      : null;
    $("#map-selection").innerHTML = mapSelection();
    $("#map-legend").innerHTML = mapLegend();
    document.querySelectorAll(".map-pin").forEach((pin) => {
      const point = (activeMap().hotspots || [])[
        [...document.querySelectorAll(".map-pin")].indexOf(pin)
      ];
      const active = (point?.activityIds || [point?.activityId]).includes(
        selectedActivityId,
      );
      pin.classList.toggle("selected", active);
      pin.setAttribute("aria-pressed", active);
    });
    focusMapSelection();
  }
  if (b.dataset.zoom || b.hasAttribute("data-reset-map")) {
    mapZoom = b.hasAttribute("data-reset-map")
      ? 100
      : Math.min(800, Math.max(100, mapZoom + Number(b.dataset.zoom)));
    $("#map-canvas").style.width = mapZoom + "%";
    document.querySelector('[data-zoom="-25"]').disabled = mapZoom <= 100;
    document.querySelector('[data-zoom="25"]').disabled = mapZoom >= 800;
    $("#zoom-label").textContent = mapZoom + "%";
    if (selectedActivityId) requestAnimationFrame(focusMapSelection);
  }
});
function focusMapSelection() {
  const viewport = $(".map-viewport"),
    canvas = $("#map-canvas");
  if (!viewport || !canvas) return;
  const points = activeMap()?.hotspots || [];
  const point =
    selectedPointIndex !== null
      ? points[selectedPointIndex]
      : points.find((p) =>
          (p.activityIds || [p.activityId]).includes(selectedActivityId),
        );
  if (point) {
    viewport.scrollTo({
      left: (canvas.offsetWidth * point.x) / 100 - viewport.clientWidth / 2,
      top: (canvas.offsetHeight * point.y) / 100 - viewport.clientHeight / 2,
      behavior: "smooth",
    });
  }
  viewport.focus({ preventScroll: true });
  viewport.scrollIntoView({ behavior: "smooth", block: "center" });
}
let mapDrag = null;
document.addEventListener("pointerdown", (e) => {
  const view = e.target.closest(".map-viewport");
  if (
    !view ||
    e.pointerType !== "mouse" ||
    e.button !== 0 ||
    e.target.closest("button")
  )
    return;
  mapDrag = {
    view,
    x: e.clientX,
    y: e.clientY,
    left: view.scrollLeft,
    top: view.scrollTop,
  };
  view.setPointerCapture(e.pointerId);
});
document.addEventListener("pointermove", (e) => {
  if (!mapDrag) return;
  mapDrag.view.scrollLeft = mapDrag.left - (e.clientX - mapDrag.x);
  mapDrag.view.scrollTop = mapDrag.top - (e.clientY - mapDrag.y);
});
document.addEventListener("pointerup", () => {
  mapDrag = null;
});
document.addEventListener("pointercancel", () => {
  mapDrag = null;
});
document.addEventListener("input", (e) => {
  if (e.target.id === "goods-search") {
    goodsQuery = e.target.value;
    $("#goods-results").innerHTML = renderGoodsResults({ language: state.lang, query: goodsQuery, category: goodsCategory });
  }
  if (e.target.id === "activity-search") {
    activityQuery = e.target.value;
    $("#activity-results").innerHTML = activityResults();
  }
  if (e.target.id === "event-search") {
    query = e.target.value;
    $("#event-results").innerHTML = eventResults();
    updateChartDetail();
  }
});
document.addEventListener("change", async (e) => {
  if (e.target.id === "goods-category") {
    goodsCategory = e.target.value;
    $("#goods-results").innerHTML = renderGoodsResults({ language: state.lang, query: goodsQuery, category: goodsCategory });
  }
  if (e.target.id === "activity-map-filter") {
    activityMap = e.target.value;
    $("#activity-results").innerHTML = activityResults();
  }
  if (e.target.dataset.check) {
    state.checks[e.target.dataset.check] = e.target.checked;
    save();
    e.target.closest(".check-row").classList.toggle("done", e.target.checked);
    if (page === "list") {
      const focused = e.target.id;
      render();
      document.getElementById(focused)?.focus();
    }
  }
  if (e.target.id === "date-filter") {
    filterDate = e.target.value;
    $("#event-results").innerHTML = eventResults();
    updateChartDetail();
  }
  if (e.target.id === "map-select") {
    selectedMapId = e.target.value;
    selectedActivityId = "";
    selectedPointIndex = null;
    mapZoom = 100;
    render();
    $("#map-select").focus();
  }
  if (e.target.id === "import-notes") {
    const f = e.target.files[0];
    if (!f) return;
    try {
      if (f.size > 1000000) throw Error();
      const x = JSON.parse(await f.text());
      if (
        x.format !== "fanfest-note" ||
        x.version !== 1 ||
        !Array.isArray(x.todos) ||
        !Array.isArray(x.personal) ||
        !Array.isArray(x.saved) ||
        !x.checks ||
        typeof x.checks !== "object"
      )
        throw Error();
      if (
        x.todos.some(
          (t) => !t || typeof t.id !== "string" || typeof t.title !== "string",
        ) ||
        x.personal.some((p) => !validPersonal(p))
      )
        throw Error();
      for (const name of ["todos", "personal"])
        state[name] = [
          ...new Map(
            [...x[name], ...state[name]].map((y) => [y.id, y]),
          ).values(),
        ];
      state.saved = [
        ...new Set([
          ...state.saved,
          ...x.saved.filter((y) => typeof y === "string"),
        ]),
      ];
      state.checks = { ...x.checks, ...state.checks };
      save();
      render();
      toast(
        tx(
          "已合併備份，保留目前的筆記。",
          "バックアップを現在のメモに追加しました。",
        ),
      );
    } catch {
      toast(
        tx(
          "無法讀取備份。請選擇本站匯出的 JSON 檔案。",
          "読み込めません。このサイトで出力した JSON を選択してください。",
        ),
      );
    }
  }
});
document.addEventListener("submit", (e) => {
  if (e.target.id === "todo-form") {
    e.preventDefault();
    const title = new FormData(e.target).get("todo").trim();
    if (!title) return;
    state.todos.push({ id: "todo-" + crypto.randomUUID(), title });
    save();
    render();
    $("#todo-form input").focus();
  }
  if (e.target.id === "event-form") {
    e.preventDefault();
    const f = new FormData(e.target),
      v = Object.fromEntries(f);
    if (!v.title.trim() || !validDate(v.date) || !validTime(v.start)) return;
    if (v.end && v.end <= v.start) {
      $("#form-error").textContent = tx(
        "結束時間必須晚於開始時間；跨日行程請分開新增。",
        "終了時刻は開始時刻より後にしてください。日付をまたぐ予定は分けて登録してください。",
      );
      return;
    }
    state.personal.push({
      id: "personal-" + crypto.randomUUID(),
      title: v.title.trim(),
      date: v.date,
      start: v.start,
      end: v.end,
      place: v.place.trim(),
    });
    save();
    showForm = false;
    query = "";
    filterDate = "";
    render();
    toast(tx("已儲存個人安排", "個人の予定を保存しました"));
  }
});
window.addEventListener("hashchange", () => {
  page = location.hash.slice(1);
  showForm = false;
  render();
  window.scrollTo(0, 0);
  $("#main").focus({ preventScroll: true });
  if (page === "map" && selectedActivityId)
    requestAnimationFrame(focusMapSelection);
});
window.addEventListener("online", updateStatus);
window.addEventListener("offline", updateStatus);
render();
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  const checkCache = (worker) => {
    if (!worker) return;
    const c = new MessageChannel();
    c.port1.onmessage = (e) => {
      if (e.data.type === "CACHE_READY") {
        cacheReady = e.data.ready === true;
        updateStatus();
      }
      c.port1.close();
    };
    worker.postMessage({ type: "CACHE_STATUS" }, [c.port2]);
  };
  navigator.serviceWorker.addEventListener("message", (e) => {
    if (e.data?.type === "CACHE_READY") {
      cacheReady = e.data.ready === true;
      updateStatus();
    }
  });
  navigator.serviceWorker.addEventListener("controllerchange", () =>
    checkCache(navigator.serviceWorker.controller),
  );
  navigator.serviceWorker
    .register("./sw.js")
    .then((r) => {
      checkCache(r.active);
      navigator.serviceWorker.ready.then((r) => checkCache(r.active));
    })
    .catch(() => {
      cacheReady = false;
      updateStatus();
    });
}
