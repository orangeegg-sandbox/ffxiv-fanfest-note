import { concertGuide } from "../data/concerts.js";

const esc = value => String(value ?? "").replace(/[&<>"']/g, character => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[character]);

export function renderConcertGuide(eventId, language = "zh") {
  const event = concertGuide.events[eventId];
  if (!event) return "";
  const tx = (zh, ja) => language === "ja" ? ja : zh;
  const loc = value => typeof value === "string" ? value : value?.[language] || value?.ja || value?.zh || "";
  const items = (values, ordered = false) => {
    const tag = ordered ? "ol" : "ul";
    return `<${tag} class="concert-reading-list">${values.map(value => `<li>${esc(loc(value))}</li>`).join("")}</${tag}>`;
  };
  const map = item => `<figure class="concert-map" data-concert-map="${esc(item.id)}">
    <a class="concert-map-image" href="${esc(item.src)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(loc(item.title))} · ${tx("另開分頁放大圖片", "別タブで画像を拡大")}">
      <img src="${esc(item.src)}" alt="${esc(loc(item.alt))}" width="${esc(item.width)}" height="${esc(item.height)}" loading="lazy" decoding="async">
    </a>
    <figcaption><strong>${esc(loc(item.title))}</strong>
      <div class="concert-map-links"><a href="${esc(item.src)}" target="_blank" rel="noopener noreferrer">${tx("放大圖片・可離線", "画像を拡大・オフライン可")}</a><a href="${esc(item.source)}" target="_blank" rel="noopener noreferrer">${tx("官方原圖・需連線", "公式原図・オンライン")}</a></div>
    </figcaption>
  </figure>`;

  return `<div class="concert-guide" data-concert-id="${esc(eventId)}">
    <dl class="concert-quick-facts">
      <div><dt>${tx("排隊時間", "整列時刻")}</dt><dd>${esc(loc(concertGuide.queueStatus))}</dd></div>
      <div><dt>${tx("門票與預約", "チケット・予約")}</dt><dd>${esc(loc(concertGuide.admission))}</dd></div>
    </dl>
    ${event.airportNote ? `<p class="concert-airport-note">${esc(loc(event.airportNote))}<a href="#transport">${tx("查看羽田交通與暫定行程", "羽田への交通・仮の計画を確認")}</a></p>` : ""}
    <details class="concert-details">
      <summary>${tx("入場、座位與準備須知", "入場・座席・持ち物の案内")}</summary>
      <div class="concert-details-body">
        <section><h4>${tx("前往舞台", "ステージへの行き方")}</h4>${items(concertGuide.gettingThere, true)}</section>
        <section><h4>${tx("座位與站立規則", "座席・立ち見のルール")}</h4>${items([event.posture, ...concertGuide.seating])}</section>
        <section><h4>${tx("入場前先準備", "入場前の準備")}</h4>${items(concertGuide.preparation)}</section>
        <section class="concert-maps"><h4>${tx("官方入場路線與舞台配置", "公式の入場ルート・ステージ配置")}</h4><p class="concert-map-help">${tx("點圖可另開分頁放大。完成本站離線快取後，這兩張圖也可離線查看。", "画像を選ぶと別タブで拡大できます。サイトのオフライン保存が完了すると、この2枚も通信なしで確認できます。")}</p>${concertGuide.maps.map(map).join("")}</section>
        <section class="concert-sources"><h4>${tx("官方說明與核實日期", "公式案内・確認日")}</h4><p>${tx("核實日期", "確認日")}：${esc(concertGuide.verifiedAt)} · ${tx("以下外部連結需連線。", "以下の外部リンクには通信が必要です。")}</p><div>${concertGuide.sources.map(source => `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(loc(source.label))}</a>`).join("")}</div></section>
      </div>
    </details>
  </div>`;
}
