# App preparation sources

Verified **2026-10-28**. `data/apps.js` distinguishes official requirements from optional editorial suggestions. Requirements are scoped to admission or the named activity; installing every listed app is not a universal admission condition.

## Required for admission and reservation tickets

- Official ticket rules: https://fanfest.finalfantasyxiv.com/2026/jp/tickets/
- Official reservation rules: https://fanfest.finalfantasyxiv.com/2026/jp/floors/activity-reservation/
- Official app information and store links: https://www.jp.square-enix.com/sqexapp/

The ticket page says:

> チケットのご使用にはスクウェア・エニックス アプリ（無料）が必要です。
>
> ※日本国内のApp StoreおよびGoogle Playからのみダウンロードできます。
>
> 当日入場される際には、スクウェア・エニックス アプリ上に表示されている電子チケットの提示が必要です。
>
> 電子チケット画面のスクリーンショットや、電子チケットを紙に印刷したものではご入場いただけません。

It also requires recipients of distributed tickets to have their own SQUARE ENIX account and app. Users who have configured one-time passwords are instructed to bring their existing security token or authentication app in case app login expires. The guide therefore recommends checking login and ticket display before travel; it does not instruct users to install a new authenticator or change authentication settings.

The reservation page separately requires the same app to show reservation tickets and rejects screenshots or printouts. This is the **スクウェア・エニックス アプリ**, not **FFXIV コンパニオン**. The official landing page supplies iOS App Store ID `1358622983` and Android package `com.square_enix.android_googleplay.PortalAppjp`; these exact links are used in the guide. Japan-store availability is surfaced prominently for overseas visitors. No workaround for store availability is promised.

## Required for specific activities

Official floor page: https://fanfest.finalfantasyxiv.com/2026/jp/floors/

Its published activity detail text is in:
https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/9577-d12cf1bba1a855cf.js

### instax screenshot printing — Halls 1–3, number 10

`activity.instax.detail`:

> スクリーンショットをチェキプリント™にする場合は、スマートフォンに保存した画像データをご用意ください。また、専用アプリのインストールが必要です。

`activity.instax.annotation.item2`:

> スクリーンショットのプリントには「instax mini Link™」アプリ、もしくは「instax Link WIDE™」アプリのインストールが必要です。

The requirement is **mini Link OR Link WIDE**, and specifically for printing screenshots. It is not described as requiring both apps, nor as a requirement for every visitor or every photo experience. Official manufacturer pages provide the download controls:

- https://instax.jp/mini_link_3/#app
- https://instax.jp/link_wide_2/

The floor page links to the manufacturer’s broader printer page at https://instax.jp/smartphoneprinter/. Its current product pages above include download controls for the exact apps named by FanFest. The mini Link page supplies App Store ID `1478853024` and Android package `com.fujifilm.instaxminiLink`; the Link WIDE 2 page supplies the `instax Link WIDE` App Store ID `1549819218` and an official Android download redirect. Old guessed `/app.html` paths returned 404 and are not used; `/link_wide/` now serves a support index rather than the download controls. The app named `instax UP!` in manufacturer navigation is not substituted for either required printer app.

### Real mystery game — AEON MALL, number 39

`activity.real_mystery.detail`:

> スマートフォンアプリの「LINE」、「X」の使用や、二次元バーコードの読み取りが可能なスマートフォンが必要です。

The guide names **LINE + X** and a phone capable of scanning QR codes. It does not turn QR scanning into a requirement to install a third-party scanner. Confirming the apps work and arranging data access are practical preparation suggestions, not additional invented eligibility rules.

Official download information:

- LINE: https://www.line.me/ja/ (includes App Store and Google Play links).
- X: https://help.x.com/ja/using-x/download-the-x-app (includes both platform store links).

## Merchandise preparation is a web tool

`goods.store.detail` asks visitors to prepare a QR code from **QOくん** before showing it at the merchandise counter (number 35). The exact link in the official page is https://qo-kun.com/fanfest-finalfantasy14 . The site serves a browser application; its HTML says JavaScript and cookies must be enabled. The guide labels it as a browser tool, not a required native app download. Creating a requested-items list is not represented as a stock reservation or purchase guarantee.

## Optional recommendations

These are guide recommendations for navigation and reading Japanese, **not festival requirements or endorsements**:

- Google Maps: https://www.google.com/maps/about/ — source of the iOS and Android store links. Save destinations and meeting points; live routing and delays require connectivity. The guide does not claim offline public-transport routing.
- Google Translate: https://translate.google.com/about/ — source of store links and its published offline-language download feature. Available functions and language support depend on platform and app version; official Japanese rules remain authoritative.

No app or external service is included in the guide’s service-worker cache. Download links require internet access. App requirements and platform availability may change; official linked pages remain the source of truth.
