// Schedule geometry is measured in JST minutes, never in the device's time zone.
const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[c]);
const minute = (time) => {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time || "")) return null;
  const [hour, minutes] = time.split(":").map(Number);
  return hour * 60 + minutes;
};
const clock = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** Place overlapping fixed-duration events in distinct lanes without changing time. */
export function timetableLayout(events, requestedDates = []) {
  const dates = [...new Set([...requestedDates, ...events.map((event) => event.date)])].sort();
  const fixed = [];
  const unbounded = [];
  for (const event of events) {
    const start = minute(event.start);
    const end = minute(event.end);
    if (event.category !== "broadcast" && start !== null && end !== null && end > start) {
      fixed.push({ event, start, end });
    } else {
      unbounded.push(event);
    }
  }
  // Retain the full festival day while also showing early/late personal plans.
  const start = Math.floor(Math.min(9 * 60, ...fixed.map((item) => item.start)) / 60) * 60;
  const end = Math.ceil(Math.max(21 * 60, ...fixed.map((item) => item.end)) / 60) * 60;
  const days = dates.map((date) => {
    const laneEnds = [];
    const entries = fixed.filter((item) => item.event.date === date)
      .sort((a, b) => a.start - b.start || b.end - a.end || a.event.id.localeCompare(b.event.id))
      .map((item) => {
        let lane = laneEnds.findIndex((end) => end <= item.start);
        if (lane === -1) lane = laneEnds.length;
        laneEnds[lane] = item.end;
        return { ...item, lane };
      });
    return { date, entries, lanes: Math.max(1, laneEnds.length) };
  });
  return { start, end, days, unbounded };
}

function formatDay(date, language) {
  const day = new Date(`${date}T12:00:00+09:00`);
  return new Intl.DateTimeFormat(language === "ja" ? "ja-JP" : "zh-TW", {
    month: "numeric", day: "numeric", weekday: "short", timeZone: "Asia/Tokyo",
  }).format(day);
}

export function renderTimetable({ events, dates = [], mode = "agenda", language = "zh", eventRow }) {
  const tx = (zh, ja) => language === "ja" ? ja : zh;
  const loc = (value) => typeof value === "string" ? value : value?.[language] || value?.ja || value?.zh || "";
  const layout = timetableLayout(events, dates);
  if (mode !== "chart") {
    return `<div class="agenda-timeline">${layout.days.map(({ date }) => {
      const dayEvents = events.filter((event) => event.date === date);
      return dayEvents.length ? `<section class="agenda-day" aria-labelledby="agenda-${escape(date)}"><h2 class="date-label" id="agenda-${escape(date)}"><span>${escape(formatDay(date, language))}</span><small>${escape(date)} · JST</small></h2><div class="agenda-entries">${dayEvents.map(eventRow).join("")}</div></section>` : "";
    }).join("")}</div>`;
  }

  const scale = 2;
  const height = (layout.end - layout.start) * scale;
  const ticks = [];
  for (let time = layout.start; time <= layout.end; time += 60) ticks.push(time);
  const columns = layout.days.map((day) => `minmax(${Math.max(248, day.lanes * 208)}px, 1fr)`).join(" ");
  const kind = (event) => event.personal ? tx("個人安排", "自分の予定") : event.category === "concert" ? tx("音樂節目", "音楽ステージ") : tx("官方舞台", "公式ステージ");
  const blocks = (day) => day.entries.map(({ event, start, end, lane }) => {
    const short = end - start < 30;
    const title = loc(event.shortTitle || event.title);
    const fullTitle = loc(event.title);
    return `<button class="chart-event ${event.personal ? "chart-personal" : "chart-official"}${short ? " chart-short" : ""}" data-chart-event="${escape(event.id)}" aria-controls="chart-detail" aria-expanded="false" aria-label="${escape(`${event.date} ${event.start}–${event.end} JST · ${fullTitle} · ${kind(event)} · ${tx("查看詳情", "詳細を見る")}`)}" style="top:${(start - layout.start) * scale}px;height:${(end - start) * scale}px;left:calc(${lane * 100 / day.lanes}% + 4px);width:calc(${100 / day.lanes}% - 8px)"><span class="chart-event-time">${escape(event.start)}–${escape(event.end)}</span><strong>${escape(title)}</strong>${language === "zh" && !event.personal && event.title?.ja ? `<span class="chart-event-jp" lang="ja">${escape(loc(event.shortTitle?.ja || event.title.ja))}</span>` : ""}<span class="chart-event-kind">${kind(event)}</span></button>`;
  }).join("");

  const timedRows = layout.days.flatMap((day) => day.entries).map(({ event }) => event);
  return `<section class="timetable-chart" aria-label="${tx("時間比例圖表", "時間軸のタイムテーブル")}"><div class="chart-caption"><p>${tx("左側為日本時間；方塊高度對應節目長度。點選節目查看詳情。", "左側は日本時間。枠の高さは所要時間を表します。予定を選ぶと詳細を表示します。")}</p><p class="small">${tx("左右滑動比較日期；同時段的個人安排會並排顯示。", "左右にスクロールして日付を比較。同時刻の自分の予定は横に並びます。")}</p></div><div class="chart-scroll" tabindex="0" role="region" aria-label="${tx("可左右捲動的時間表", "左右にスクロールできる予定表")}"><div class="chart-grid" style="grid-template-columns:58px ${columns}"><div class="chart-corner">JST</div>${layout.days.map((day) => `<h2 class="chart-day-title">${escape(formatDay(day.date, language))}<small>${escape(day.date)}</small></h2>`).join("")}<div class="chart-axis" style="height:${height}px">${ticks.map((time) => `<time class="chart-tick" style="top:${(time - layout.start) * scale}px">${clock(time)}</time>`).join("")}</div>${layout.days.map((day) => `<div class="chart-day" style="height:${height}px" aria-label="${escape(day.date)}">${ticks.map((time) => `<span class="chart-hour-line" style="top:${(time - layout.start) * scale}px" aria-hidden="true"></span>`).join("")}${blocks(day)}${!day.entries.length ? `<p class="chart-no-events">${tx("沒有固定時段", "時間枠のある予定はありません")}</p>` : ""}</div>`).join("")}</div></div><div class="chart-detail" id="chart-detail" tabindex="-1" aria-live="polite"><p>${tx("點選圖表中的節目，可在這裡閱讀完整介紹、收藏及加入日曆。", "表の予定を選ぶと、ここで詳しい説明の確認、保存、カレンダーへの追加ができます。")}</p></div>${layout.unbounded.length ? `<section class="chart-unbounded"><h2>${tx("間歇直播與結束時間未定的安排", "随時中継・終了時刻未定の予定")}</h2><p class="small">${tx("以下安排沒有固定結束時間，因此不畫成連續時段。", "終了時刻が決まっていないため、連続した時間枠には表示していません。")}</p>${layout.unbounded.map(eventRow).join("")}</section>` : ""}${timedRows.length ? `<details class="chart-text-alternative"><summary>${tx("以文字閱讀圖表全部節目", "表のすべての予定をテキストで読む")}</summary>${timedRows.map(eventRow).join("")}</details>` : ""}</section>`;
}
