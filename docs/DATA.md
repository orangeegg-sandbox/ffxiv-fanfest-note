# Verified event data

`data/events.js` combines stage, activity and summary modules into `eventData`. Current `sourceStatus` is `verified`, with a verification date of **2026-10-28**. App and transport guides are separate modules consumed by `ui/preparation.js`; merchandise guide/catalog modules are consumed by `ui/goods.js`. Each has its own `verifiedAt`. Source snapshots and translation notes are documented in `SOURCES-STAGES.md`, `SOURCES-ACTIVITIES.md`, `SOURCES-APPS.md`, `SOURCES-TRANSPORT.md`, `SOURCES-GOODS.md` and `SOURCES-GOODS-CATALOG.md`.

Bilingual text fields use `{ zh: 'Traditional Chinese', ja: '日本語' }`. Preserve the exact Japanese title for quick reference. All dates and times describe **Asia/Tokyo (UTC+9)**, independent of the reader's device timezone. IDs must be stable and unique across stage and activity data.

## Modules

- `stages.js`: `eventMeta`, `stages`, and `stageGuidance`. Metadata records dates, venues, address and provisional opening hours. Stage rows use `{ id, date, start, end?, category, title, shortTitle?, description, location, locationId?, source }`. `category: 'broadcast'` identifies the two intermittent venue broadcasts; never invent their end times. The ten fixed stage programs use `locationId: 'main-stage'`.
- `activities.js`: `activities`, `maps`, `reservationInfo`, and `practical`. Activity rows carry `{ id, category, number?, mapId, title, description, location, source, reservation?, notes? }`. Reservation/practical notes use bilingual `title` and `body` plus a source URL. Keep fees, opening hours, eligibility and reservation exceptions in both languages.
- `summary.js`: generated `summaryImages` metadata with `{ id, lang, title, alt, src, html, verifiedAt, sources, width, height }`. The generator is `scripts/generate-summary.mjs`; do not hand-edit dimensions or generated images.
- `apps.js`: `appGuide` contains `verifiedAt`, bilingual `intro`, and `required`, `optional`, `browserTools` arrays. Each entry has `{ id, title, scope, purpose, steps, notes, links, source, activityIds }`; links use `{ label, url }`. `activityIds` connects scoped requirements to the existing activity/map records. Keep admission requirements, requirements for a particular activity, and editorial suggestions distinct.
- `transport.js`: `transportGuide` contains bilingual title, introduction, airport warning, route sections, an airport checklist, source links and `airportBus`. Sections use `{ id, title, summary, cards }`; route cards use `{ id, title, tag, steps, notes, links }`. Airport bus data keeps `timetableEffectiveAt`, `fareEffectiveAt`, `source` and `selectedMesseDepartures` separate from the guide verification date. Each bus row has `{ messe, station, terminal3, terminal2, terminal1 }` as JST clock strings.
- `goods.js`: `goodsGuide` contains `verifiedAt`, bilingual title/introduction, `locationId`, `quickFacts`, dated `hours`, `hoursNote`, `hoursSources`, ordered/parallel `sections` and official `links`. Preserve both official hours attributions and the existing `goods-store` location ID.
- `goods-catalog.js`: `merchandiseCatalog` contains `verifiedAt`, campaign/collection/venue source URLs, bilingual introduction/notes, official links and 33 `products`. Each product uses `{ id, title, category, priceYen, priceSource, source, image, imageSource, imageWidth, imageHeight, linkLabel, variants?, priceNote? }`. `priceSource: 'estore'` means a verified tax-inclusive online reference price; `priceNote` scopes single-item or variant pricing.

## Schedule and activity presentation

`ui/schedule.js` renders both the agenda and chart from the same filtered official and personal entries. Chart positions and heights derive from JST minutes; overlapping entries use separate lanes. The hourly axis normally covers 09:00–21:00 and extends to include earlier/later personal plans. Intermittent broadcasts and entries without a valid fixed end remain in a separate readable list, with no inferred duration. Selecting a chart block opens the full event row and its existing bookmark/calendar controls; the chart also has a text equivalent. The chosen display mode is saved with browser preferences.

Activity `description` and `notes` remain bilingual source strings. The UI divides sentences into readable paragraphs/lists and extracts dated `10/31` and `11/1` time ranges from `notes` into an opening-hours definition list. Any attached cutoff stays with its day; remaining fees, restrictions and conditions stay in the notes list. Changes to the source wording must be checked in both languages because the presentation parser recognizes specific date/time forms.

## App and transport scope

Activities and TLDR render the same app guide. The three required groups are the SQUARE ENIX ticket app, either supported instax printing app for the named screenshot-print activity, and LINE plus X for the mystery game. The two optional entries are Google Maps and Google Translate; QOくん is a browser tool. Preserve the Japan-store restriction, account/login preparation and rejection of ticket screenshots, without presenting every app as a universal entry requirement.

`#transport` is a subpage of Maps with links from Home and TLDR. Its airport destination is Narita **Terminal 2**. The visible bus table selects the three services that board at Messe Chuo, not the entire Kaihin-Makuhari timetable:

| Messe Chuo | Kaihin-Makuhari | Narita T2 arrival |
| --- | --- | --- |
| 13:14 | 13:40 | 14:20 |
| 14:34 | 15:00 | 15:40 |
| 16:30 | 16:56 | 17:36 |

The current timetable is effective 2026-03-20. Under that table the last listed station departure is 16:56; no airport bus after the planned 21:00 festival close is shown. Preserve the difference between the scheduled 66-minute trip from Messe Chuo and 40 minutes from the station. The rail fallback is a route example via Soga and Chiba to **空港第2ビル駅**; exact Sunday rail departures, fares and total journey time are not verified. No flight time is supplied, so the guide cannot establish a personal latest departure from the event. See `SOURCES-TRANSPORT.md` for boarding, payment, Sunday-service and airport-arrival evidence.

## Merchandise scope and presentation

`#goods` is the seventh primary tab, with purchasing-guide and catalog views. `ui/goods.js` searches Chinese/Japanese names and supports five official categories: GOODS, FASHION, FOOD, MUSIC and BOOKS. Search/category state survives language changes during the session. Each of the 33 official venue product groups has one local 768×768 WebP in `assets/goods/`; its official original URL remains in `imageSource`. Image links enlarge the bundled image, and product links open the official e-STORE page. The perfume group and collectible units retain explicit variant/single-item notes. Product count describes venue groups, not online SKUs or current stock.

The shop is the existing outdoor `goods-store` location, map #35, with links in both directions. Ticket-free purchasing applies to that shop. QOくん creates a browser-based list and QR code, not a payment, reservation or stock hold. The guide separates the ended priority-queue lottery from the ordinary queue and lists the published venue payment methods, ¥14,000 art-board bonus and souvenir-bag limit of one per person.

Keep the official hours disagreement visible with both source links: the dedicated goods page lists both days 09:00–21:00; the floor page lists November 1 until 20:30 and acceptance ending 30 minutes before closing on both days. Neither source is silently treated as a correction.

The supplied e-STORE campaign ended October 1 at 10:00 JST. Its account-accumulated bonus and delivery statements are historical online terms. Current e-STORE purchases do not inherit the ended campaign or venue collection rights. Japan-only delivery and rejection of overseas-issued cards are online-store conditions, not venue-card restrictions. Reference prices, listed products and cached images provide no live stock or venue-price guarantee.

## Official maps and number mappings

Six original JPG files are kept in `assets/maps/`. Each map has `{ id, title, src, source, width, height, hotspots }`; `src` is a local relative path and `source` is the original official image URL. The original maps are 4096×2304.

A hotspot has `{ activityId, activityIds?, number?, label, x, y }`. Coordinates are percentages of the original image, not screen pixels. They must be checked against the actual official image. `activityIds` records multiple activities at one position. Every referenced activity must exist; use `mapId` to choose the correct venue map.

- Hall 1–3 number 6 contains both Nice Head Garden and the Allagan control panel.
- Number 28 has two meeting-point positions; Toyosuna food number 3 also appears twice.
- Toyosuna food numbers 1–24 are independent of Makuhari numbers 1–39.
- `main-stage` is an unnumbered location on Hall 4–6, used by stage program links.

The UI supports selection, 100–800% zoom, touch scrolling, mouse dragging, number-to-detail selection and activity-to-map links. Selecting an activity pans its hotspot into view. Original printed numbers remain visible; transparent hit areas gain a badge only on hover, focus or selection. The indexed buttons provide an alternative to selecting crowded locations directly on the image. This is an annotated official map, not GPS navigation.

## Summary images

The TL;DR tab serves a Traditional Chinese and a Japanese all-in-one PNG. Both contain both days' fixed stage timeline, independent broadcast-start notes, Quick Photo gathering slots and concise reservation/entry reminders. Gathering times are not promised experience start times. The Quick Photo reservation-only statement is scoped to the reservation page's listed contents; cloakrooms/changing rooms have separate requirements.

The generator imports stage metadata, but also holds verified photo-slot and reservation-copy constants. Reverify those constants whenever the official reservation page changes, then run `npm run generate:summary`. Matching HTML sources preserve readable text. The tab also renders its timeline text from the same event data.

## Updating and offline coverage

1. Read current official pages and linked conditions; preserve source URLs and update the true verification date only after checking.
2. Update both languages, retain unknown/missing times as unknown, and verify map numbers against original imagery. Recheck app requirement scope/store links and transport direction, effective dates, weekday restrictions, terminal and arrival columns when those guides change. For goods, recheck both hours sources, purchasing restrictions, campaign dates, product-group/SKU matches, price units and original image URLs.
3. Regenerate summary images and heading-font subsets when affected.
4. Add new local assets to `sw.js` `APP_FILES` and bump `VERSION` for every release that changes cached data or assets.
5. Run `npm test`, inspect map and summary rendering, then `npm run package`.

The `2026-10-28-goods-v5` cache includes 65 required assets, adding `goods.css`, `ui/goods.js`, both merchandise data modules and all 33 product images to the existing guides, maps, summary PNG/HTML files and fonts. External official pages, QOくん, e-STORE checkout/stock, app downloads and live routing services are not cached. Personal entries remain separate in browser storage `fanfest-note-v1`; they never become official data. Backup import merges by ID and preserves current entries on collisions.

The summary generator also exports `summaryPhotoSessions` keyed by event date. The TLDR text alternative reads the same grouping and times as the PNG generator; keep these synchronized when updating reservations. Broadcast rows must explicitly identify their intermittent nature and lack of a fixed end time.
