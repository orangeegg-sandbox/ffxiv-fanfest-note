# FanFest Note · 隨行筆記

繁體中文／日本語的手機友善 FFXIV FanFest 靜態指南。已核實日本場 2026/10/31–11/1 的舞台節目、會場活動、預約規則、官方地圖及交通／入場資訊；內容快照日期為 **2026-10-28**。

## 本機開啟

需要 Node.js 20 以上。網站沒有執行時依賴，也不需要建置：

```sh
npm run dev
```

預設使用 4173 埠；可用 `PORT=8080 npm run dev` 更改。請透過 HTTP 開啟，不能直接雙擊 HTML；ES modules 與離線快取需要有效來源。

## 功能

- 七個主分頁：總覽、懶人包、時間表、活動、周邊、地圖、我的清單；交通子頁可從地圖、總覽與懶人包進入。
- 10 個固定舞台節目、2 個間歇會場直播，時間皆為 JST（UTC+9）。中文保留日文原名。
- 時間表可切換行程列表與比例圖表；圖表保留左側時間軸，支援日期橫向捲動、重疊安排、詳細介紹、收藏、日曆與文字版。
- 兩場音樂節目附觀賞指南：排隊／開門時間尚未公布、入場資格與取消指定席加購、前往舞台、自由席與站立規則、電子票及腕帶準備。兩張官方入場／舞台示意圖可離線放大；Quick Photo 預約及網路直播票另行說明，THE PRIMALS 並提示與暫定羽田巴士方案重疊。
- 65 個活動、展覽、服務、商品及餐飲項目，可搜尋、依會場篩選及收藏。詳情將每日開放時間、受理截止、費用與參加條件分段呈現。
- 周邊分頁提供購買須知及 33 組商品目錄：繁中／日文搜尋、分類、本地官方圖片與放大連結、含稅網店參考價及商品頁。保留 #35 物販地圖連結、QOくん／支付／特典／限購說明，明列官方營業時間分歧；已結束的網購活動、配送與付款限制另行標示。
- 地圖先選周邊交通／幕張／AEON／豐砂公園，手機以 2×2 排列；六張原始官方會場圖、66 個熱點與編號索引保留。幕張各館與全區・戶外採灰底深藍斜角分頁，支援鍵盤操作。活動／舞台連到地圖，同號多活動與不同會場重複編號分別處理。
- 周邊交通總覽使用可離線放大的官方 ACCESS MAP，8 個地點涵蓋兩個車站、各會場與三處接駁站。可用圖片或文字索引選取、放大定位、查看會場內地圖，並開啟 Google Maps 步行導航（需連線）。四個方向的活動接駁時刻表可離線查閱，保留日期／變更限制、Cross Wave 使用資格及 1 號活動接駁與 3 號羽田巴士的區別。地圖紅線是步行動線；早上首次入場另依西広場受付指示。
- 懶人包：繁中、日文各一張兩日時間表 PNG，包含預約集合時段與重點。可下載到相簿，另有文字版。
- 活動與懶人包都有必備／指定活動、選用 App 與免安裝工具指南，附官方下載連結、設定步驟及適用範圍。
- 交通指南包含會場往返與羽田方案；晚間巴士表列出 T2／T1／T3 抵達時間，區分幕張メッセ中央末班 18:35 與海浜幕張站末班 22:45，另附鐵路轉乘與航廈說明。11/2 00:00 JST 僅作 DAY 2 後的暫定起飛範例，航廈未定；不據此保證個人最晚離場時間。
- 個人行程、待辦勾選、JSON 備份／合併匯入。資料只存在目前瀏覽器，不會跨裝置同步。
- `.ics` 匯出以日本時間輸入、UTC 儲存，含開始前 15 分鐘提醒；需自行匯入日曆及確認通知。網站不發送背景通知。
- 原子離線快取：全部必要資產成功後才顯示離線就緒。外部官方網站仍需連線。

## 官方來源與更新

- https://fanfest.finalfantasyxiv.com/2026/jp/stages/
- https://fanfest.finalfantasyxiv.com/2026/jp/floors/activity-reservation/
- https://fanfest.finalfantasyxiv.com/2026/jp/floors/
- https://fanfest.finalfantasyxiv.com/2026/jp/maps/
- https://fanfest.finalfantasyxiv.com/2026/jp/about/
- https://fanfest.finalfantasyxiv.com/2026/jp/goods/
- https://store.jp.square-enix.com/estore/pages/sp_ff14_fanfest2026.aspx

活動資料入口為 `data/events.js`；App、交通、周邊地圖／接駁、音樂節目觀賞、物販指南與商品目錄分別在 `data/apps.js`、`data/transport.js`、`data/area-map.js`、`data/concerts.js`、`data/goods.js`、`data/goods-catalog.js`。格式見 `docs/DATA.md`，來源核對見 `docs/SOURCES-STAGES.md`、`docs/SOURCES-ACTIVITIES.md`、`docs/SOURCES-APPS.md`、`docs/SOURCES-TRANSPORT.md`、`docs/SOURCES-AREA-MAP.md`、`docs/SOURCES-CONCERTS.md`、`docs/SOURCES-GOODS.md` 與 `docs/SOURCES-GOODS-CATALOG.md`。此站不會自動抓取更新；變更官方內容時，需重新核對日文原文、翻譯、條件與核實日期。巴士表的生效日期與資料核實日期分開保存；活動接駁依目前公布的活動表保存，不補造未列的兩日分表。班次及運行狀況需出發前再確認。

```sh
npm run generate:summary
```

此指令以 Playwright／Chromium 重新產生雙語 PNG、HTML 與 `data/summary.js`。需要涵蓋繁中／日文的系統字型；目前環境使用 Noto CJK。舞台資料由 `data/stages.js` 讀入，Quick Photo 集合時段與預約摘要常數也需隨官方變更核對，詳見 `assets/summary/README.md`。

變更標題後可執行 `python3 scripts/subset-fonts.py` 更新本地字型子集（需 fonttools 與系統 fonts-noto-cjk）。每次發布資產或資料變更時提高 `sw.js` 的 `VERSION`；新增檔案需加入 `APP_FILES`。

## 驗證

```sh
npm ci
npx playwright install chromium
npm test
```

已安裝系統 Chromium 時，測試使用 `/usr/bin/chromium`，或指定 `CHROMIUM_PATH`。目前合計 62 項檢查：4 項時間表單元檢查、5 項離線檢查、27 項既有功能檢查、7 項功能改善瀏覽器檢查、6 項物販檢查、4 項羽田／地圖分頁檢查、4 項音樂節目觀賞檢查與 5 項周邊地圖檢查。涵蓋雙語主分頁及交通子頁、320／390／1280px 版面、時間軸與重疊安排、活動條件、App 連結、交通資訊、地圖、JST 日曆匯出、備份及根目錄／子目錄離線讀取。物販檢查另涵蓋 640／768px、七個導覽目標、雙語搜尋／篩選、33 張圖片與離線目錄。羽田／地圖檢查另涵蓋六圖切換、鍵盤選取與焦點、四種寬度的觸控目標、各航廈巴士到達時間、暫定午夜範例及子目錄離線讀取。音樂節目檢查涵蓋雙語觀賞規則、圖表／收藏／地圖連結、展開詳情的四種寬度，以及兩張官方圖的子目錄離線讀取與放大。周邊地圖檢查涵蓋 8 個地點、雙語步行與接駁說明、四個方向的完整班次、Google Maps 步行網址、圖片／索引／縮放定位、既有六圖往返、320／390／640／1280px 版面及子目錄離線讀取。執行結果與限制見 `docs/VALIDATION.md`。

## 靜態封裝與部署

```sh
npm run package
```

需 Python 3。輸出 `dist/site/` 與 `dist/fanfest-note.zip`，只包含網站需要的 HTML、CSS、JS、manifest、資料、圖示、字型及圖片素材。原始碼保存在 `main`，`deploy` 分支只包含 `dist/site/` 的靜態檔案與 `.nojekyll`。更新網站時，先在 `main` 修改並驗證，再重新封裝及更新 `deploy`，最後確認 Pages 建置及公開網站。

GitHub Pages 已啟用，[Settings → Pages](https://github.com/orangeegg-sandbox/ffxiv-fanfest-note/settings/pages) 的發布來源為 **Deploy from a branch → deploy → / (root)**。公開網址為 https://orangeegg-sandbox.github.io/ffxiv-fanfest-note/ 。Pages API 已回報此設定建置成功；每次更新仍需另行確認最新提交的發布結果；各版本的公開驗證狀態見 `docs/VALIDATION.md`。

全站使用相對路徑，支援子目錄；hash 分頁不需要伺服器路由規則。不要部署整個儲存庫、`.agents` 或測試資料。Service Worker 只在 HTTPS／localhost 可用；首次連線且顯示離線就緒後，才可離線查閱。瀏覽器仍可能清理快取，重要個人筆記請匯出備份。

這是朋友間的非官方指南。官方文字與地圖的權利屬於原權利人；資料可能變更，以官方公告及現場指示為準。
