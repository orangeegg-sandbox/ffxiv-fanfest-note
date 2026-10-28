# Validation — 2026-10-28

## Official content

Read the original four official pages, linked event overview, ticket/app requirements, manufacturer download pages, official venue/operator/airport access sources, and the added merchandise/e-STORE pages. Source evidence and extraction decisions are recorded in SOURCES-STAGES.md, SOURCES-ACTIVITIES.md, SOURCES-APPS.md, SOURCES-TRANSPORT.md, SOURCES-GOODS.md and SOURCES-GOODS-CATALOG.md.

- 10 fixed stage programs plus 2 intermittent venue broadcast entries; no invented end times for broadcasts.
- 65 bilingual activities, food stalls, exhibits and services.
- Six original official 4096×2304 JPG maps; 66 hotspot positions. Every activity has a map association.
- Shared Hall 1–3 #6 and repeated meeting/food locations retain their correct relationships; Toyosuna numbering is separate.
- Timeline dates/times, Quick Photo gathering slots, application window and queue cutoff independently checked against official text. Booking-only wording is scoped to the listed reservation activities.
- Both PNGs use deterministic text rendering; the accessible TLDR text uses the same photo-session metadata and includes opening hours and broadcast caveats.
- App requirements are scoped to admission or the named activity: SQUARE ENIX app for tickets, either supported instax app for screenshot printing, LINE and X for the mystery game. Optional navigation/translation apps and the QOくん browser tool are identified separately. Official download links, Japan-store availability and ticket screenshot restrictions were checked.
- Narita T2 table retains all three Messe Chuo services and T2 arrivals: 13:14 → 13:40 → 14:20; 14:34 → 15:00 → 15:40; 16:30 → 16:56 → 17:36. Columns are Messe Chuo, Kaihin-Makuhari and T2. The March 20 timetable revision is distinct from the October 28 verification date; Sunday applicability and boarding/payment details are recorded in the source notes.
- The rail fallback names 空港第2ビル駅 for T2. No verified flight time, personal leave-by time, exact Sunday rail schedule or guarantee of catching a flight is asserted.
- Merchandise uses all 33 official venue product groups with verified e-STORE reference prices and local official 768×768 WebP thumbnails. Single-item collectible prices and perfume variants retain explicit scope.
- The outdoor #35 shop, ticket-free shopping, QOくん QR preparation, published payment methods, ¥14,000 art-board bonus and one souvenir bag per person were checked. Dedicated goods hours (both days 09:00–21:00) and conflicting floor hours (November 1 until 20:30; both days acceptance ends 30 minutes before close) are shown together with sources.
- The e-STORE campaign ended October 1; its historical bonus and delivery terms stay separate from venue purchasing. Japan-only delivery and overseas-issued-card restrictions are explicitly scoped to the online store.

## Browser checks

Current test suites: **49 checks passed**: 32 existing checks (5 offline + 27 functional), 4 timetable unit checks, 7 improvement browser checks and 6 merchandise browser checks. The improvement checks passed after the pinned-axis correction; merchandise checks passed after correcting Japanese navigation at 640px.

The existing suites cover root and subdirectory hosting, complete offline caches and failed downloads, the six original primary routes in both languages at 320/390/1280px, official dates/times, bookmarks, Japan-time calendar exports while the browser uses a different timezone, map-number interactions, shared numbers, fit/zoom/auto-pan/drag/reset, image downloads, text equivalents, personal schedules, checklists, backup imports and keyboard navigation.

New checks cover both schedule modes, proportional block heights, the pinned left time axis, date/search/bookmark filtering, full chart details and focus, overlapping/early/late/unknown-end personal entries, structured activity hours and conditions, shared App guidance and download links, transport navigation, T2 bus/rail content and offline reload under a deployment subdirectory. Both languages are checked at 320/390/1280px, including document overflow. The six new cache files were individually fetched while offline, with no page errors.

Merchandise checks cover the purchasing rules and hours conflict, #35 navigation, all 33 bilingual product groups/local images/official links/reference-price notes, combined search and category filters, language-state preservation, empty-state recovery, both views at 320/390/640/768/1280px and subdirectory offline reload. The 37 added merchandise assets were fetched offline with no page errors. Mobile checks confirm all seven navigation targets remain visible and at least 44px in both dimensions.

Review screenshots are under `.impeccable/review/`. The prior improvement set includes 13 `improved-*.png` captures of agenda/chart, mobile activity detail, Apps, TLDR Apps, transport and Narita T2 content at desktop 1440px and phone 390/320px sizes. Chart captures include the second day and Japanese at 320px. Earlier clean official-schedule captures contain all 12 entries and no synthetic personal plans; the list capture uses a saved actual keynote.

For the prior improvement release, the independent finish reviewer returned **ship**, with no material fixes, after reviewing all 13 captures, implementation, sources and tests. The earlier guide review also returned ship for maps, generated timeline images and core navigation.

The prior improvement detector report, `.impeccable/review/improvements-detector.json`, contains **0 primary findings and 23 advisories**. Advisories concern font sizes outside the recorded frontmatter scale and the chart's 6px event-block radius. These are documented differences from the baseline, not proof of a rendering defect or a replacement for visual review; the independent reviewer assessed the rendered results.

The documenter compared `DESIGN.md` and `.impeccable/design.json` with `app.js`, `ui/schedule.js`, `ui/preparation.js`, `guide.css` and `schedule.css`. The extensions retain paper/evergreen/sage/rust colors, serif page headings, sans-serif reading text, thin dividers, flat surfaces, explicit labels and existing focus styles. The design references were preserved. Chart-specific corners and compact labels, additional reading sizes, and the baseline's existing 13px responsive labels were not promoted to new design-system tokens merely to clear advisories.

The merchandise set adds 12 `goods-*.png` captures, covering guide/catalog first viewports, the hours discrepancy, collectible price units, search empty state and Japanese layouts at 320px and 640px. The independent merchandise review requested one change: remove repeated category labels above product headings. After correction and recapture, the reviewer scored that fix resolved, found no introduced regressions and returned **ship** for the scored fix. All six merchandise checks passed again. `.impeccable/review/goods-detector.json` reports **0 primary findings and 10 font-size advisories**; this report complements the completed visual review.

For this ordinary extension, the documenter compared `DESIGN.md` and `.impeccable/design.json` with `goods.css`, `ui/goods.js`, the guide/catalog data and the two 390px first-viewport captures. The goods screens retain paper/evergreen/sage/rust, serif page headings, sans-serif reading text, thin rules, flat panels, explicit selection labels and inherited focus states. The design files were preserved. Their six-destination prose now lags the seven-tab product and remains recorded drift. Task-specific product type sizes and the 601–900px navigation adaptation were not promoted to global tokens as part of this extension.

## Release

The current merchandise cache is `2026-10-28-goods-v5`, with **65 precache assets**. Package verification found **102 static site files**, including `.nojekyll` and 33 image-provenance `.webp.json` sidecars; ZIP integrity passed. The metadata sidecars ship with the images but are not runtime precache assets. `npm run package` produces `dist/site` and `dist/fanfest-note.zip`; the ZIP also contains `START-HERE.txt`. Implementation commit `33b5222` and deployment commit `7a17005` were pushed. GitHub Pages reported that exact deployment commit built successfully.

The previous verified guide-v4 release contained 32 static site files and 28 precache assets; ZIP integrity and asset coverage passed for that release.

Source lives on `main`; `deploy` contains only the packaged static site and excludes development tools, tests and repository configuration. For the previous guide-v4 release, implementation commit `bf02956` and deployment commit `0310464` were pushed. GitHub Pages reported the exact deployment commit built successfully.

GitHub Pages uses `build_type: legacy`, source branch `deploy` and source path `/`, at https://orangeegg-sandbox.github.io/ffxiv-fanfest-note/ . The public service worker now serves `2026-10-28-goods-v5`. A fresh 390px live browser verified all seven tabs, the visible hours discrepancy, all 33 decoded product images, Chinese search, Japanese switching and an offline reload of the complete catalogue without JavaScript errors. The previous guide-v4 live check verified the chart's ten fixed events, selected event details, three required App groups in TLDR, the three-row T2 bus table, Japanese transport content and a complete offline reload, with no JavaScript errors. No cloud environment publication was performed.

Content is a snapshot verified on October 28, 2026; later official changes require reverification and regeneration. Calendar alarms depend on the user's calendar application; the website does not send background push notifications.
