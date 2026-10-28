# FanFest Note · 隨行筆記

繁體中文／日本語的手機友善 FFXIV FanFest 靜態指南。已核實日本場 2026/10/31–11/1 的舞台節目、會場活動、預約規則、官方地圖及交通／入場資訊；內容快照日期為 **2026-10-28**。

## 本機開啟

需要 Node.js 20 以上。網站沒有執行時依賴，也不需要建置：

```sh
npm run dev
```

預設使用 4173 埠；可用 `PORT=8080 npm run dev` 更改。請透過 HTTP 開啟，不能直接雙擊 HTML；ES modules 與離線快取需要有效來源。

## 功能

- 六個分頁：總覽、懶人包、時間表、活動、地圖、我的清單。
- 10 個固定舞台節目、2 個間歇會場直播，時間皆為 JST（UTC+9）。中文保留日文原名。
- 65 個活動、展覽、服務、商品及餐飲項目，可搜尋、依會場篩選及收藏。
- 六張原始官方地圖、66 個熱點與編號索引；活動／舞台連到地圖。同號多活動與不同會場重複編號分別處理。
- 懶人包：繁中、日文各一張兩日時間表 PNG，包含預約集合時段與重點。可下載到相簿，另有文字版。
- 個人行程、待辦勾選、JSON 備份／合併匯入。資料只存在目前瀏覽器，不會跨裝置同步。
- `.ics` 匯出以日本時間輸入、UTC 儲存，含開始前 15 分鐘提醒；需自行匯入日曆及確認通知。網站不發送背景通知。
- 原子離線快取：全部必要資產成功後才顯示離線就緒。外部官方網站仍需連線。

## 官方來源與更新

- https://fanfest.finalfantasyxiv.com/2026/jp/stages/
- https://fanfest.finalfantasyxiv.com/2026/jp/floors/activity-reservation/
- https://fanfest.finalfantasyxiv.com/2026/jp/floors/
- https://fanfest.finalfantasyxiv.com/2026/jp/maps/
- https://fanfest.finalfantasyxiv.com/2026/jp/about/

資料入口為 `data/events.js`。格式見 `docs/DATA.md`，來源核對見 `docs/SOURCES-STAGES.md` 與 `docs/SOURCES-ACTIVITIES.md`。此站不會自動抓取更新；變更官方內容時，需重新核對日文原文、翻譯、條件與核實日期。

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

已安裝系統 Chromium 時，測試使用 `/usr/bin/chromium`，或指定 `CHROMIUM_PATH`。測試涵蓋雙語六分頁、手機／桌面版面、官方時間與編號映射、個人行程、JST 日曆匯出、備份驗證、根目錄／子目錄部署及地圖／懶人包離線讀取。

## 靜態封裝與部署

```sh
npm run package
```

需 Python 3。輸出 `dist/site/` 與 `dist/fanfest-note.zip`，只包含網站需要的 HTML、CSS、JS、manifest、資料、圖示、字型及圖片素材。原始碼保存在 `main`，`deploy` 分支只包含 `dist/site/` 的靜態檔案與 `.nojekyll`。GitHub Pages 應選擇 `deploy` 分支的根目錄作為發布來源。更新網站時，先在 `main` 修改並驗證，再重新封裝及更新 `deploy`。

兩個分支已推送到 GitHub。目前整合憑證無權啟用 Pages，需在 [Settings → Pages](https://github.com/orangeegg-sandbox/ffxiv-fanfest-note/settings/pages) 將 Source 設為 **Deploy from a branch**、Branch 設為 **deploy**、資料夾選 **/ (root)**，然後儲存。首次建置完成後，網址為 https://orangeegg-sandbox.github.io/ffxiv-fanfest-note/ 。

全站使用相對路徑，支援子目錄；hash 分頁不需要伺服器路由規則。不要部署整個儲存庫、`.agents` 或測試資料。Service Worker 只在 HTTPS／localhost 可用；首次連線且顯示離線就緒後，才可離線查閱。瀏覽器仍可能清理快取，重要個人筆記請匯出備份。

這是朋友間的非官方指南。官方文字與地圖的權利屬於原權利人；資料可能變更，以官方公告及現場指示為準。
