# Merchandise catalogue sources — 2026-10-28

## Scope and sources

The dedicated merchandise guide uses the **33 product groups on the official venue merchandise page**, not every listing in the online-store campaign. Chinese titles are concise unofficial translations; the Japanese title retains the official prefix, product name and subtitle. Product order and the five category labels (GOODS, FASHION, FOOD, MUSIC, BOOKS) come from the venue page's public data.

Sources read:

- [Venue merchandise](https://fanfest.finalfantasyxiv.com/2026/jp/goods/), including its public product-name data in `/_next/static/chunks/app/goods/page-d4408574fdeab6d0.js` under the same `/2026/jp` base.
- [Supplied e-STORE campaign](https://store.jp.square-enix.com/estore/pages/sp_ff14_fanfest2026.aspx): 24 featured entries, with explicit tax-inclusive prices and a link to the full collection.
- [Full e-STORE collection](https://store.jp.square-enix.com/estore/e/ee-FF14-FANFEST-2026/): all 59 product entries loaded in its HTML; official listing prices and product URLs were matched by Japanese name and SKU.
- [October 14 product notice](https://store.jp.square-enix.com/estore/t/t7815/).
- [e-STORE payment and shipping guide](https://store.jp.square-enix.com/estore/pages/guide_5.aspx).
- Individual product pages for the music box `MWFF141131`, Emet-Selch earring `MWFF141192`, and black sweatshirt `MWFF141148` were also opened to cross-check prices and product dates.

The 59 online entries reconcile to the 33 venue groups, 20 further perfume variants (the venue groups all 21 together), four full BOX listings, and two Kung-Fu jackets absent from the venue list. Apparel sizes are grouped on their respective product pages. The guide includes one image per venue group; a perfume image illustrates one variant, not all 21.

## Prices and availability

Every catalogue price is an **e-STORE reference price**, not a promise about the price or stock at the venue. `priceSource: 'estore'` records that distinction. The full collection supplied every matched price; no price was guessed. The official payment guide states:

> スクウェア・エニックス e-STOREでは、商品価格を税込で表示しております。

The four collectible series have both individual and BOX listings. This guide records individual prices and explicitly labels them as such: glass plates ¥1,650 (BOX ¥13,200), miniature figures ¥1,650 (BOX ¥9,900), mini puppet plushes ¥1,650 (BOX ¥9,900), and rubber magnets ¥1,100 (BOX ¥6,600). The BOX prices explain the match and are not shown as the displayed single-item price. All 21 perfume variants in the full collection were ¥3,960; the guide links the knight variant as an example and says so.

No live stock or sale-status badge is inferred from a listed product, a product picture, or a working e-STORE link. Sizes, selected variants, actual prices and purchase limits remain subject to official store/venue information. Refer to `SOURCES-GOODS.md` for venue purchase rules, including rules that differ from e-STORE.

## Expired campaign and shipping restrictions

The supplied campaign page explicitly says:

> 事前予約・キャンペーン期間 2026年8月13日(木)11:00～2026年10月1日(木)10:00
>
> 「ファイナルファンタジーXIV ファンフェスティバル 2026 in 東京 オフィシャルグッズ事前予約キャンペーン」は終了しました。(2026/10/1)

It describes general shipment from October 16, not a current promise of arrival before FanFest. The campaign's ¥14,000 art-board gift used account-level accumulation during its own period. The page says orders outside that period do not qualify. These historical online terms are not applied to current orders or merged with on-site receipts.

The October 14 notice changes the Emet-Selch earring's release date from October 16 to October 24. It changes the two `Four Concealed Pon` / `Thirteen Orphans` Kung-Fu Track Jackets to **2027-01-09**, with design changes. Those two jackets are online collection entries, not part of the venue's 33 groups, and are not silently added to the on-site guide.

Online-store restrictions are scoped explicitly to e-STORE. The payment/shipping guide states:

> 日本国外への配送は承っておりません。
>
> 海外発行カードはご利用できません。ご注意ください。

These statements are not claimed as venue-card restrictions. Downloading product information does not place an order or reserve goods.

## Matched venue groups

| Venue group ID | e-STORE SKU | Reference price (JPY, tax included) |
| --- | --- | --- |
| `ffxiv-orgel-living-memory` | [MWFF141131](https://store.jp.square-enix.com/estore/g/gMWFF141131/) | 2,750 |
| `ffxiv-moogle-pen-light` | [MWFF141188](https://store.jp.square-enix.com/estore/g/gMWFF141188/) | 4,950 |
| `ffxiv-calyx-plush` | [MWFF141189](https://store.jp.square-enix.com/estore/g/gMWFF141189/) | 8,250 |
| `ffxiv-living-memory-stole` | [MWFF141190](https://store.jp.square-enix.com/estore/g/gMWFF141190/) | 6,600 |
| `ffxiv-plush-alpaca` | [MWFF141191](https://store.jp.square-enix.com/estore/g/gMWFF141191/) | 5,280 |
| `ffxiv-silver-earrings-emet-selch` | [MWFF141192](https://store.jp.square-enix.com/estore/g/gMWFF141192/) | 27,500 |
| `ffxiv-miniature-figure-collection-vol3` | [MWFF141193](https://store.jp.square-enix.com/estore/g/gMWFF141193/) | 1,650 |
| `ffxiv-mini-puppet-plush-collection-vol3` | [MWFF141194](https://store.jp.square-enix.com/estore/g/gMWFF141194/) | 1,650 |
| `ffxiv-rubber-magnet-collection-vol3` | [MWFF141195](https://store.jp.square-enix.com/estore/g/gMWFF141195/) | 1,100 |
| `ffxiv-neon-light-moogle` | [MWFF141196](https://store.jp.square-enix.com/estore/g/gMWFF141196/) | 6,600 |
| `ffxiv-fake-leather-charm-moogle` | [MWFF141197](https://store.jp.square-enix.com/estore/g/gMWFF141197/) | 1,320 |
| `ffxiv-energy-drink-gummy-gg` | [MWFF141138](https://store.jp.square-enix.com/estore/g/gMWFF141138/) | 1,900 |
| `ffxiv-fat-chocobo-curry` | [MWFF141139](https://store.jp.square-enix.com/estore/g/gMWFF141139/) | 1,080 |
| `ffxiv-fanfest2026-muffler-towel` | [MWFF141140](https://store.jp.square-enix.com/estore/g/gMWFF141140/) | 2,500 |
| `ffxiv-karuta-vol1` | [MWFF141141](https://store.jp.square-enix.com/estore/g/gMWFF141141/) | 4,950 |
| `ffxiv-glass-plate-collection-vol1` | [MWFF141163](https://store.jp.square-enix.com/estore/g/gMWFF141163/) | 1,650 |
| `ffxiv-eau-de-toilette` | [MWFF141164](https://store.jp.square-enix.com/estore/g/gMWFF141164/) | 3,960 |
| `ffxiv-usowoso-backpack` | [MWFF141185](https://store.jp.square-enix.com/estore/g/gMWFF141185/) | 6,930 |
| `ffxiv-clear-keychain-fandaniel-crystal` | [MWFF141186](https://store.jp.square-enix.com/estore/g/gMWFF141186/) | 1,650 |
| `ffxiv-clear-keychain-elidibus-crystal` | [MWFF141187](https://store.jp.square-enix.com/estore/g/gMWFF141187/) | 1,650 |
| `ffxiv-neon-parasol` | [MWFF141198](https://store.jp.square-enix.com/estore/g/gMWFF141198/) | 4,950 |
| `ffxiv-sticky-notes-field-marker` | [MWFF141199](https://store.jp.square-enix.com/estore/g/gMWFF141199/) | 1,100 |
| `ffxiv-bomber-jacket` | [MWFF141142](https://store.jp.square-enix.com/estore/g/gMWFF141142/) | 29,700 |
| `lit-baff-apt-pullover-hoodie` | [MWFF141148](https://store.jp.square-enix.com/estore/g/gMWFF141148/) | 16,500 |
| `lit-baff-apt-sweatshirt` | [MWFF141151](https://store.jp.square-enix.com/estore/g/gMWFF141151/) | 16,500 |
| `lit-baff-apt-t-shirt` | [MWFF141160](https://store.jp.square-enix.com/estore/g/gMWFF141160/) | 7,700 |
| `ffxiv-t-shirt-souvenir-of-strayborough` | [MWFF141145](https://store.jp.square-enix.com/estore/g/gMWFF141145/) | 5,500 |
| `music-piano-arrange` | [SQEX-11239](https://store.jp.square-enix.com/estore/g/gSQEX-11239/) | 3,300 |
| `music-pulse3` | [SQEX-11262](https://store.jp.square-enix.com/estore/g/gSQEX-11262/) | 3,960 |
| `fanfest-pamphlet` | [4988601504294](https://store.jp.square-enix.com/estore/g/g4988601504294/) | 2,500 |
| `calendar-set` | [4988601504287](https://store.jp.square-enix.com/estore/g/g4988601504287/) | 4,950 |
| `postcard-book-2` | [9784301007296](https://store.jp.square-enix.com/estore/g/g9784301007296/) | 1,650 |
| `eorzea-travel-guide` | [9784301006688](https://store.jp.square-enix.com/estore/g/g9784301006688/) | 1,980 |

## Official product image provenance

The 33 768×768 WebP thumbnails were downloaded from the venue page's actual `srcSet` URLs. They are original official files; no visual transformations or generated replacement imagery were used. One thumbnail is retained per group. Total image bytes before source metadata: **1,023,760**. After metadata: **1,023,760**.

Each file embeds its exact official origin, retrieval date, unchanged-pixel note and SQUARE ENIX attribution through `impeccable embed-prompt`. The provenance scan reported **33 rasters, 0 missing**. `imageSource` in `data/goods-catalog.js` independently preserves every remote URL; `image` is the local offline path. Product images and product names belong to their respective rights holders; this guide does not claim authorship.

| Local image | Official origin |
| --- | --- |
| `./assets/goods/ffxiv-orgel-living-memory.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-orgel-living-memory-thumbnail-1.efea571c_768.webp) |
| `./assets/goods/ffxiv-moogle-pen-light.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-moogle-pen-light-thumbnail-1.c99bc92f_768.webp) |
| `./assets/goods/ffxiv-calyx-plush.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-calyx-plush-thumbnail-1.ebbce649_768.webp) |
| `./assets/goods/ffxiv-living-memory-stole.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-living-memory-stole-thumbnail-1.d7243128_768.webp) |
| `./assets/goods/ffxiv-plush-alpaca.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-plush-alpaca-thumbnail-1.1f26157a_768.webp) |
| `./assets/goods/ffxiv-silver-earrings-emet-selch.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-silver-earrings-emet-selch-thumbnail-1.c4c5ca7e_768.webp) |
| `./assets/goods/ffxiv-miniature-figure-collection-vol3.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-miniature-figure-collection-vol3-thumbnail-1.78cffc97_768.webp) |
| `./assets/goods/ffxiv-mini-puppet-plush-collection-vol3.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-mini-puppet-plush-collection-vol3-thumbnail-1.0487061a_768.webp) |
| `./assets/goods/ffxiv-rubber-magnet-collection-vol3.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-rubber-magnet-collection-vol3-thumbnail-1.92c479b0_768.webp) |
| `./assets/goods/ffxiv-neon-light-moogle.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-neon-light-moogle-thumbnail-1.1af4599e_768.webp) |
| `./assets/goods/ffxiv-fake-leather-charm-moogle.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-fake-leather-charm-moogle-thumbnail-1.864a8371_768.webp) |
| `./assets/goods/ffxiv-energy-drink-gummy-gg.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-energy-drink-gummy-gg-thumbnail-1.f0566960_768.webp) |
| `./assets/goods/ffxiv-fat-chocobo-curry.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-fat-chocobo-curry-thumbnail-1.d9dc35ea_768.webp) |
| `./assets/goods/ffxiv-fanfest2026-muffler-towel.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-fanfest2026-muffler-towel-thumbnail-1.00fab34e_768.webp) |
| `./assets/goods/ffxiv-karuta-vol1.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-karuta-vol1-thumbnail-1.dd943621_768.webp) |
| `./assets/goods/ffxiv-glass-plate-collection-vol1.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-glass-plate-collection-vol1-thumbnail-1.138a1632_768.webp) |
| `./assets/goods/ffxiv-eau-de-toilette.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-eau-de-toilette-thumbnail-1.21b7968e_768.webp) |
| `./assets/goods/ffxiv-usowoso-backpack.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-usowoso-backpack-thumbnail-1.3771d8a5_768.webp) |
| `./assets/goods/ffxiv-clear-keychain-fandaniel-crystal.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-clear-keychain-fandaniel-crystal-thumbnail-1.b8717c86_768.webp) |
| `./assets/goods/ffxiv-clear-keychain-elidibus-crystal.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-clear-keychain-elidibus-crystal-thumbnail-1.275bb4b9_768.webp) |
| `./assets/goods/ffxiv-neon-parasol.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-neon-parasol-thumbnail-1.c0a779d9_768.webp) |
| `./assets/goods/ffxiv-sticky-notes-field-marker.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-sticky-notes-field-marker-thumbnail-1.a0892cf5_768.webp) |
| `./assets/goods/ffxiv-bomber-jacket.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-bomber-jacket-thumbnail-1.ab9a7dfd_768.webp) |
| `./assets/goods/lit-baff-apt-pullover-hoodie.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/lit-baff-apt-pullover-hoodie-thumbnail-1.be537854_768.webp) |
| `./assets/goods/lit-baff-apt-sweatshirt.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/lit-baff-apt-sweatshirt-thumbnail-1.855a79bc_768.webp) |
| `./assets/goods/lit-baff-apt-t-shirt.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/lit-baff-apt-t-shirt-thumbnail-1.39c38ba9_768.webp) |
| `./assets/goods/ffxiv-t-shirt-souvenir-of-strayborough.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/ffxiv-t-shirt-souvenir-of-strayborough-thumbnail-1.bf108bd5_768.webp) |
| `./assets/goods/music-piano-arrange.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/music-piano-arrange-thumbnail-1.24e99dab_768.webp) |
| `./assets/goods/music-pulse3.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/music-pulse3-thumbnail-1.5fd93079_768.webp) |
| `./assets/goods/fanfest-pamphlet.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/fanfest-pamphlet-thumbnail-1.af77b4fa_768.webp) |
| `./assets/goods/calendar-set.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/calendar-set-thumbnail-1.06eb91a5_768.webp) |
| `./assets/goods/postcard-book-2.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/postcard-book-2-thumbnail-1.a165a362_768.webp) |
| `./assets/goods/eorzea-travel-guide.webp` | [Official thumbnail](https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/eorzea-travel-guide-thumbnail-1.d307cccc_768.webp) |

## Validation

- 33 unique group IDs exactly match the complete official venue group map.
- Every entry has both languages, an official category, positive numeric price, a matched official e-STORE product URL and a local image.
- All thumbnails are 768×768 WebP and carry source metadata; no remote product image is required at runtime.
- Catalogue source dates describe the snapshot, not a live synchronization service.
