// Official merchandise snapshot checked on 2026-10-28; all times are JST.
// Keep the discrepancy between the goods page and floor detail visible.
const text = (zh, ja) => ({ zh, ja });
const goods = "https://fanfest.finalfantasyxiv.com/2026/jp/goods/";
const floors = "https://fanfest.finalfantasyxiv.com/2026/jp/floors/";
const reservation = "https://fanfest.finalfantasyxiv.com/2026/jp/floors/activity-reservation/";
const store = "https://store.jp.square-enix.com/estore/pages/sp_ff14_fanfest2026.aspx";

export const goodsGuide = {
  verifiedAt: "2026-10-28",
  title: text("會場物販", "会場物販"),
  intro: text(
    "戶外物販以 FanFest 2026 第三彈官方商品為主，沒有兩日通票也可購買。",
    "屋外の物販ではファンフェス2026第3弾の公式グッズを中心に販売。2日通し券を持っていない方も購入できます。"
  ),
  locationId: "goods-store",
  quickFacts: [
    { label: text("地點", "場所"), value: text("幕張 MESSE 屋外展示場・地圖 #35", "幕張メッセ 屋外展示場・マップ #35") },
    { label: text("入場資格", "利用条件"), value: text("沒有兩日通票也可購買", "2日通し券がなくても購入可能") },
    { label: text("購買前準備", "購入前の準備"), value: text("QOくん 商品清單與 QR code", "QOくんの商品リスト・QRコード") }
  ],
  hours: [
    { date: "2026-10-31", open: "09:00", close: "21:00" },
    { date: "2026-11-01", open: "09:00", close: "21:00" }
  ],
  hoursLabel: text("商品頁列出的販售預定時間", "グッズページの販売予定時間"),
  hoursNote: text(
    "官方頁面的時間不一致：商品頁列兩日皆 09:00–21:00；フロア詳情則列 11/1 為 09:00–20:30，並註明兩日均於結束前 30 分鐘停止受理。請提早到場，當日以現場及最新官方公告為準。",
    "公式ページ間で時刻が異なります。グッズページは両日09:00–21:00、フロア詳細は11/1が09:00–20:30で、両日とも最終受付は終了30分前と記載。早めに来場し、当日の現地案内・最新の公式告知を確認してください。"
  ),
  hoursSources: [
    { label: text("商品頁時間", "グッズページの時刻"), url: goods },
    { label: text("フロア詳情時間", "フロア詳細の時刻"), url: floors }
  ],
  sections: [
    {
      id: "how-to-buy",
      title: text("到場前，先用 QOくん", "来場前に QOくんで準備"),
      items: [
        text("在手機瀏覽器開啟活動專用 QOくん，將希望購買的商品列成清單；不需另裝 App。", "スマートフォンのブラウザーでイベント用の QOくんを開き、希望商品をリストにします。専用アプリの追加インストールは不要です。"),
        text("準備 QOくん 產生的 QR code，在商品販售區出示給工作人員。", "QOくんで発行した QR コードを用意し、売り場で提示してください。"),
        text("依現場隊列指示購買及付款。商品清單不代表已付款、已預約或保留庫存。", "現地の列の案内に従い、売り場で購入・支払いを行います。商品リストは決済済み・予約済み・在庫確保を意味しません。")
      ]
    },
    {
      id: "payment",
      title: text("現場付款方式", "当日のお支払い"),
      items: [
        text("現金。", "現金。"),
        text("信用卡：Visa、Mastercard、JCB、Amex。", "クレジットカード：Visa・Mastercard・JCB・Amex。"),
        text("電子錢包：交通系 IC、楽天Edy、nanaco、WAON、QUICPay、iD。", "電子マネー：交通系IC・楽天Edy・nanaco・WAON・QUICPay・iD。"),
        text("條碼支付：PayPay、楽天ペイ、au PAY、d払い。", "バーコード決済：PayPay・楽天ペイ・au PAY・d払い。")
      ]
    },
    {
      id: "queue-and-stock",
      title: text("排隊與數量", "待機列・販売数量"),
      items: [
        text("數量有限；擁擠時可能暫停開放排隊，販售時間也可能更動。", "商品数には限りがあります。混雑状況により一時的に並べない場合があり、販売時間も変更される場合があります。"),
        text("官方商品販售設有抽選預約者優先隊列，也有一般隊列。事前抽選申請已於 10/25 23:59 結束；QOくん 的商品清單與這項預約是不同程序。", "公式グッズ販売には抽選予約者の優先待機列と通常の待機列があります。事前抽選の応募は10/25 23:59に終了。QOくんの商品リストとは別の手続きです。"),
        text("已中選預約者請依 SQUARE ENIX App 的預約票確認集合時段；未預約者可依現場指示使用一般隊列。", "当選済みの方はスクウェア・エニックス アプリの予約チケットで集合時間を確認。予約のない方は現地案内に従い通常の待機列を利用できます。")
      ]
    },
    {
      id: "bonus-and-limits",
      title: text("購物特典與已公布限購", "購入特典・案内済みの購入制限"),
      items: [
        text("在物販會場購買商品滿 ¥14,000（含稅），贈「FanFest 2026 畫板」（アートボード），送完即止。", "物販会場で商品を14,000円（税込）以上購入すると、ファンフェス2026アートボードをプレゼント。なくなり次第配布終了です。"),
        text("畫板與 e-STORE 事前預約活動所贈特典相同。", "アートボードは e-STORE の事前予約キャンペーンで配布した特典と同じものです。"),
        text("來場者紀念袋（来場者お土産バッグ）也在此販售，每人最多購買 1 個。", "来場者お土産バッグもこの売り場で購入でき、1人1個までです。"),
        text("其他商品的個別限購及退換貨條件，請查商品頁或現場告示；官方物販總覽未列出統一規則。", "その他の商品の個別の購入制限・返品交換条件は商品ページや現地案内で確認してください。物販の総合案内には共通ルールの記載がありません。")
      ]
    },
    {
      id: "onsite-and-online",
      title: text("會場購買與 e-STORE", "会場販売と e-STORE"),
      items: [
        text("戶外物販以第三彈商品為主；商品頁列出的是販售陣容，不代表即時庫存。", "屋外物販は第3弾の商品が中心です。グッズページの一覧は販売ラインナップで、リアルタイムの在庫表示ではありません。"),
        text("e-STORE 是另外的網路商店，請在各商品頁確認網路價格、販售狀態、出貨時間與訂購條件；不能視為現場取貨預約。", "e-STORE は別のオンラインショップです。各商品ページで通販価格・販売状況・発送時期・注文条件を確認してください。会場受け取りの予約としては扱わないでください。")
      ]
    }
  ],
  links: [
    { id: "quick-order", label: text("開啟 QOくん 購買清單", "QOくんで商品リストを作る"), url: "https://qo-kun.com/fanfest-finalfantasy14" },
    { id: "goods-official", label: text("官方會場物販資訊", "公式の会場物販案内"), url: goods },
    { id: "online-store", label: text("前往官方 e-STORE", "公式 e-STORE を開く"), url: store },
    { id: "reservation", label: text("已中選預約者的集合說明", "当選済み予約の集合案内"), url: reservation }
  ]
};
