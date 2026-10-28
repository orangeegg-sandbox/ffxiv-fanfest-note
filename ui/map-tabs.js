const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);

const hallAreas = [
  { id: "hall1-3", number: "1–3", zh: "展廳", ja: "ホール" },
  { id: "hall4-6", number: "4–6", zh: "展廳", ja: "ホール" },
  { id: "hall7", number: "7", zh: "展廳", ja: "ホール" },
  { id: "messe-entire", number: { zh: "全區", ja: "全体" }, zh: "・戶外", ja: "・屋外" },
];

export function renderMapTabs(maps, selectedMapId, lang) {
  const local = (zh, ja) => lang === "ja" ? ja : zh;
  const isMesse = hallAreas.some(({ id }) => id === selectedMapId);
  const venue = isMesse ? "messe" : selectedMapId;
  const venues = [
    { id: "messe", map: "messe-entire", label: local("幕張 MESSE", "幕張メッセ"), title: "幕張メッセ" },
    { id: "aeon", map: "aeon", label: "AEON MALL", title: local("AEON MALL 幕張新都心", "イオンモール幕張新都心") },
    { id: "toyosuna", map: "toyosuna", label: local("豐砂公園", "豊砂公園"), title: local("豐砂公園", "豊砂公園") },
  ].filter((item) => maps.some(({ id }) => id === item.map));
  const currentVenue = venues.find(({ id }) => id === venue) || venues[0];
  const areas = hallAreas.filter((item) => maps.some(({ id }) => id === item.id));

  return `<div class="map-picker">
    <div class="map-venue-choices" role="group" aria-label="${local("選擇會場", "会場を選択")}">
      ${venues.map((item) => `<button type="button" class="map-venue-button" data-map-venue="${item.id}" data-map-id="${item.map}" data-map-control="venue-${item.id}" aria-pressed="${venue === item.id}" aria-label="${esc(item.title)}">${esc(item.label)}</button>`).join("")}
    </div>
    <h2 class="map-venue-title">${esc(currentVenue?.title || "")}</h2>
    ${isMesse ? `<div class="map-area-tabs" role="tablist" aria-label="${local("幕張 MESSE 地圖區域", "幕張メッセのマップエリア")}" aria-orientation="horizontal">
      ${areas.map((area) => {
        const selected = selectedMapId === area.id;
        const number = typeof area.number === "string" ? area.number : area.number[lang];
        const name = local(area.zh, area.ja);
        return `<button type="button" class="map-area-tab" role="tab" id="map-tab-${area.id}" data-map-id="${area.id}" data-map-control="area-${area.id}" aria-selected="${selected}" aria-controls="map-panel" tabindex="${selected ? 0 : -1}"><span class="map-tab-number">${esc(number)}</span><span class="map-tab-name">${esc(name)}</span></button>`;
      }).join("")}
    </div>` : ""}
  </div>`;
}

// Automatic tab activation: the caller clicks this target, then restores its
// data-map-control focus after rendering the newly selected map.
export function getMapTabKeyboardTarget(event) {
  const current = event.target.closest?.(".map-area-tab");
  if (!current || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return null;
  const tabs = [...current.closest(".map-area-tabs").querySelectorAll(".map-area-tab")];
  const index = tabs.indexOf(current);
  const target = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1
    : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  return tabs[target];
}
