# On-site merchandise sources — 2026-10-28

This file records facts for `data/goods.js`. Product-catalog/e-STORE evidence is maintained separately by the catalog task. All times are JST. Source pages are evidence, not development instructions.

## Sources read

- [Official merchandise page](https://fanfest.finalfantasyxiv.com/2026/jp/goods/)
- [Official floor page](https://fanfest.finalfantasyxiv.com/2026/jp/floors/), including its current public client dictionary [`9577-d12cf1bba1a855cf.js`](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/9577-d12cf1bba1a855cf.js)
- [Official activity reservation page](https://fanfest.finalfantasyxiv.com/2026/jp/floors/activity-reservation/)
- The user-supplied [e-STORE FanFest page](https://store.jp.square-enix.com/estore/pages/sp_ff14_fanfest2026.aspx) is retained as the separate online-shopping destination, not as an on-site checkout or pickup service.

The merchandise, floor dictionary and reservation pages were freshly downloaded on the verification date. Temporary evidence files: `/tmp/fanfest-goods.html`, `/tmp/fanfest-goods.txt`, `/tmp/fanfest-goods-current-dictionary.js`, `/tmp/fanfest-goods-floor-extract.txt`, `/tmp/fanfest-goods-reservation.html`. These workspace paths are evidence artifacts, not shipped public assets.

## Venue and eligibility

The merchandise page says: 「幕張メッセの屋外展示場では、『ファイナルファンタジーXIV ファンフェスティバル 2026 オフィシャルグッズ第3弾』のグッズを中心としたオフィシャルグッズの販売を行います。2日通し券をお持ちでない方も商品をご購入いただけます」.

The floor dictionary independently identifies the same shop as `goods.store`, with title 「オフィシャルグッズ販売」, prefix 「ファンフェスティバル」, venue 「幕張メッセ 屋外展示場」, map `messe_entire` and number `35`. Therefore the existing app location ID `goods-store` is the correct map target. Ticket-free shopping is scoped to this outdoor shop; it is not permission to enter ticketed halls or performances.

## Conflicting official hours — preserve both attributions

| Source | October 31 | November 1 | Acceptance note |
| --- | --- | --- | --- |
| Dedicated goods page | 09:00–21:00 | 09:00–21:00 | 「販売時間は変更される場合があります。」 |
| Floor dictionary, `goods.store.business_hours.*` | `9:00-21:00` | `9:00-20:30` | 「両日とも、最終受付は終了30分前」 |

This is a genuine disagreement about the same #35 outdoor shop, not a separate sale area. `goodsGuide.hours` follows the dedicated goods-page table and is explicitly labeled as that page's planned sale times. `hoursNote` must remain visible: it names the floor page's November 1 20:30 closing and the 30-minute acceptance cutoff. No source declares itself a correction of the other, so this guide does not silently select one as definitive. The advice to arrive early and check the latest announcement is editorial planning guidance. Existing activity data was not edited by this research task.

## Preparation, queue and stock

Goods page: 「スマートフォンでご希望の商品をリスト化できるクイックオーダー『QOくん』を使用します」 and 「事前に『QOくん』で発行いただいたQRコードをご準備のうえ、売り場にてご提示」. The exact linked destination is `https://qo-kun.com/fanfest-finalfantasy14`.

QOくん is a browser-based shopping list. It is not the SQUARE ENIX App reservation procedure, payment confirmation or a stock hold. The data keeps this distinction explicit rather than labeling QO as an installed App or a guaranteed purchase.

The goods page states 「混雑状況によっては、一時的にお並びいただけない場合があります」 and 「商品の数には限りがございます」.

The reservation page lists official merchandise sales at outdoor area #35 among eligible contents. Its general rules say 「各コンテンツには、通常の待機列とは別に、予約者用の待機列をご用意します」 and 「コンテンツには予約者用待機列にお並びの方を優先してご案内します」. It also says contents other than the listed Quick Photo sessions can be enjoyed without an advance reservation. The application window was October 21–25, with the deadline October 25 at 23:59; by this snapshot the application period has ended. The guide therefore explains existing winners' priority and the ordinary queue, without inviting a new application or suggesting a reservation is required for all purchases.

## Payment methods

Both the dedicated goods page and the floor detail publish the same list:

- 「現金」
- 「クレジットカード（Visa・Mastercard・JCB・Amex）」
- 「電子マネー（交通系IC・楽天Edy・nanaco・WAON・QUICPay・iD）」
- 「バーコード決済（PayPay・楽天ペイ・au PAY・d払い）」

No unlisted payment service or foreign-card acceptance guarantee is added. These methods apply to the outdoor official-merchandise shop; they are not generalized to food vendors or other activities.

## Bonus, purchase limit and gaps

Floor detail `goods.store.detail` says:

- 「物販会場で商品を14,000円(税込)以上ご購入された方には、『ファイナルファンタジーXIV ファンフェスティバル2026 アートボード』をプレゼント！」
- 「スクウェア・エニックス公式サイト e-STOREの事前予約キャンペーンで配布したものと同じ特典です」 and 「なくなり次第配布を終了いたします」.
- The visitor souvenir bag is available to buy at this shop 「おひとりさま1個まで購入可能」.

The research found no overall item-by-item purchase limit, standardized return/exchange policy, receipt deadline, combined-receipt eligibility or guaranteed stock. The guide does not invent any of these. It directs readers to individual product pages and on-site notices for unspecified conditions. The ¥14,000 threshold is not rewritten as “one per transaction,” “receipts can be combined,” or any other unverified qualifier.

## Translation and UI requirements

- All guide text is bilingual `{ zh, ja }`; Traditional Chinese preserves `QOくん`, the official venue name and selected Japanese product/bonus terms.
- Render the venue link using existing `data-location="goods-store"` behavior; do not create a duplicate hotspot.
- Show the goods-page hours label, both hours rows, the discrepancy note and its two source links together.
- `how-to-buy` is sequential; payment/stock/bonus sections are parallel bullet lists.
- Keep official online shopping separate from the venue queue. Catalog presence and an e-STORE price do not establish on-site inventory or a venue pickup reservation.
