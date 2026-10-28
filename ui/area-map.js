import { areaGuide } from "../data/area-map.js";

const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);
const local = language => value => typeof value === "string" ? value : value?.[language] || value?.ja || value?.zh || "";
const externalLink = (link, loc) => `<a href="${esc(link.url)}"${/^(?:https?:|\.\/assets\/)/.test(link.url) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(loc(link.label))}</a>`;

export function renderAreaLegend(language, selectedPlaceId) {
  const loc = local(language);
  const tx = (zh, ja) => language === "ja" ? ja : zh;
  const groups = [
    { title: tx("車站", "駅"), places: areaGuide.places.filter(place => place.kind === "station") },
    { title: tx("會場", "会場"), places: areaGuide.places.filter(place => !["station", "bus", "shuttle"].includes(place.kind)) },
    { title: tx("接駁與寄物處", "シャトル・クローク"), places: areaGuide.places.filter(place => ["bus", "shuttle"].includes(place.kind)) },
  ];
  return groups.filter(group => group.places.length).map(group => `<section class="area-place-group">
    <h4>${group.title}</h4>
    ${group.places.map(place => `<button type="button" class="area-place-button" data-area-place="${esc(place.id)}" aria-pressed="${place.id === selectedPlaceId}">
      <span class="area-place-code" aria-hidden="true">${esc(place.code)}</span>
      <span><strong>${esc(loc(place.title))}</strong>${place.subtitle ? `<small>${esc(loc(place.subtitle))}</small>` : ""}</span>
    </button>`).join("")}
  </section>`).join("");
}

export function renderAreaSelection(selectedPlaceId, language) {
  const loc = local(language);
  const tx = (zh, ja) => language === "ja" ? ja : zh;
  const place = areaGuide.places.find(item => item.id === selectedPlaceId) || areaGuide.places[0];
  if (!place) return "";
  return `<div class="area-selection-heading"><h3><span class="area-place-code" aria-hidden="true">${esc(place.code)}</span>${esc(loc(place.title))}</h3>
    <button type="button" class="button secondary" data-area-focus="${esc(place.id)}">${tx("在圖上查看", "地図で確認")}</button>
  </div>
  ${place.subtitle ? `<p class="area-place-subtitle">${esc(loc(place.subtitle))}</p>` : ""}
  ${place.notes?.length ? `<ul class="area-reading-list">${place.notes.map(note => `<li>${esc(loc(note))}</li>`).join("")}</ul>` : ""}
  ${place.venueMaps?.length ? `<div class="area-venue-links" role="group" aria-label="${tx("開啟會場內部地圖", "会場内マップを開く")}">${place.venueMaps.map(map => `<button type="button" class="button secondary" data-area-venue="${esc(map.id)}">${esc(loc(map.label))}</button>`).join("")}</div>` : ""}
  ${place.timetables?.length ? `<div class="area-timetables">${place.timetables.map(table => `<details class="area-timetable"><summary>${esc(loc(table.title))}</summary><p class="area-time-label">${tx("發車時刻・日本時間 JST", "発車時刻・日本時間 JST")}</p><ul class="area-departures">${table.departures.map(time => `<li><time>${esc(time)}</time></li>`).join("")}</ul>${table.note ? `<p class="area-timetable-note">${esc(loc(table.note))}</p>` : ""}</details>`).join("")}</div>` : ""}
  ${place.links?.length ? `<div class="area-navigation-links"><p>${tx("Google Maps 步行導航與官方網站需連線。現場入場動線依工作人員指示。", "Google マップの徒歩経路・公式サイトには通信が必要です。会場の入場動線はスタッフの案内に従ってください。")}</p><div>${place.links.map(link => externalLink(link, loc)).join("")}</div></div>` : ""}`;
}

export function renderAreaOverview({ language = "zh", selectedPlaceId, zoom = 100 }) {
  const loc = local(language);
  const tx = (zh, ja) => language === "ja" ? ja : zh;
  const selected = areaGuide.places.find(place => place.id === selectedPlaceId) || areaGuide.places[0];
  const selectedId = selected?.id;
  const map = areaGuide.map;
  return `<div class="area-overview" id="map-panel" role="region" aria-label="${esc(loc(areaGuide.title))}">
    <p class="area-intro">${esc(loc(areaGuide.intro))}</p>
    <div class="area-map-layout">
      <section class="area-map-main" aria-label="${tx("周邊交通地圖", "周辺アクセスマップ")}">
        <div class="map-controls"><button class="button secondary" data-zoom="-25" aria-label="${tx("縮小", "縮小")}" ${zoom <= 100 ? "disabled" : ""}>−</button><span id="zoom-label">${zoom}%</span><button class="button secondary" data-zoom="25" aria-label="${tx("放大", "拡大")}" ${zoom >= 800 ? "disabled" : ""}>＋</button><button class="button secondary" data-reset-map>${tx("重設", "リセット")}</button></div>
        <div class="map-viewport area-map-viewport" tabindex="0" aria-label="${tx("可放大、捲動的官方周邊交通地圖", "拡大・スクロールできる公式周辺アクセスマップ")}">
          <div class="map-canvas" id="map-canvas" data-map-id="area-overview" style="width:${Number(zoom)}%">
            <img id="venue-map" draggable="false" src="${esc(map.src)}" width="${esc(map.width)}" height="${esc(map.height)}" alt="${esc(loc(map.alt))}">
            ${areaGuide.places.map(place => `<button type="button" class="area-pin${place.id === selectedId ? " selected" : ""}" style="left:${Number(place.x)}%;top:${Number(place.y)}%" data-area-place="${esc(place.id)}" aria-label="${esc(place.code)} ${esc(loc(place.title))}" title="${esc(loc(place.title))}" aria-pressed="${place.id === selectedId}"><span>${esc(place.code)}</span></button>`).join("")}
          </div>
        </div>
        <p class="area-map-help">${tx("點選圖中的車站、會場或巴士圖示，或用地點列表查看說明。可放大與拖曳；字母是本站的定位標記。", "図中の駅・会場・バスのアイコンか、地点リストを選んで案内を確認。拡大・ドラッグができます。英字は本ガイドの位置マークです。")}</p>
        <div class="area-map-source"><a href="${esc(map.src)}" target="_blank" rel="noopener noreferrer">${tx("開啟大圖・可離線", "大きな画像・オフライン可")}</a><a id="map-original" href="${esc(map.source)}" target="_blank" rel="noopener noreferrer">${tx("官方原圖・需連線", "公式原図・オンライン")}</a><span>© SQUARE ENIX</span></div>
        ${areaGuide.quickRoutes?.length ? `<div class="area-quick-routes" role="group" aria-label="${tx("從車站出發", "駅から出発")}">${areaGuide.quickRoutes.map(route => `<button type="button" data-area-place="${esc(route.placeId)}" aria-pressed="${route.placeId === selectedId}"><strong>${esc(loc(route.title))}</strong><span>${esc(loc(route.body))}</span></button>`).join("")}</div>` : ""}
      </section>
      <aside class="area-place-index"><h3>${tx("選擇地點", "地点を選択")}</h3><div id="area-legend">${renderAreaLegend(language, selectedId)}</div></aside>
      <section class="area-selection" id="area-selection" tabindex="-1" aria-live="polite">${renderAreaSelection(selectedId, language)}</section>
    </div>
    <section class="area-shuttle-note"><h3>${tx("接駁與回程", "シャトルバス・帰り道")}</h3><p>${esc(loc(areaGuide.shuttleNote))}</p><a href="#transport">${tx("查看交通指南與羽田路線", "交通ガイド・羽田への経路を確認")}</a></section>
    <details class="area-source-list"><summary>${tx("官方來源與核實日期", "公式出典・確認日")}</summary><p>${tx("核實日期", "確認日")}：${esc(areaGuide.verifiedAt)} · ${tx("外部網站需連線", "外部サイトはオンライン")}</p><div>${areaGuide.sources.map(link => externalLink(link, loc)).join("")}</div></details>
  </div>`;
}
