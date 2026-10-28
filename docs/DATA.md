# Verified event data

`data/events.js` combines the modules below into `eventData`. Current `sourceStatus` is `verified`, with a verification date of **2026-10-28**. Source snapshots and translation notes are documented in `SOURCES-STAGES.md` and `SOURCES-ACTIVITIES.md`.

Bilingual text fields use `{ zh: 'Traditional Chinese', ja: '日本語' }`. Preserve the exact Japanese title for quick reference. All dates and times describe **Asia/Tokyo (UTC+9)**, independent of the reader's device timezone. IDs must be stable and unique across stage and activity data.

## Modules

- `stages.js`: `eventMeta`, `stages`, and `stageGuidance`. Metadata records dates, venues, address and provisional opening hours. Stage rows use `{ id, date, start, end?, category, title, shortTitle?, description, location, locationId?, source }`. `category: 'broadcast'` identifies the two intermittent venue broadcasts; never invent their end times. The ten fixed stage programs use `locationId: 'main-stage'`.
- `activities.js`: `activities`, `maps`, `reservationInfo`, and `practical`. Activity rows carry `{ id, category, number?, mapId, title, description, location, source, reservation?, notes? }`. Reservation/practical notes use bilingual `title` and `body` plus a source URL. Keep fees, opening hours, eligibility and reservation exceptions in both languages.
- `summary.js`: generated `summaryImages` metadata with `{ id, lang, title, alt, src, html, verifiedAt, sources, width, height }`. The generator is `scripts/generate-summary.mjs`; do not hand-edit dimensions or generated images.

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
2. Update both languages, retain unknown/missing times as unknown, and verify map numbers against original imagery.
3. Regenerate summary images and heading-font subsets when affected.
4. Add new local assets to `sw.js` `APP_FILES` and bump `VERSION` for every release that changes cached data or assets.
5. Run `npm test`, inspect map and summary rendering, then `npm run package`.

The current cache includes all data modules, original maps and generated summary PNG/HTML files. External official pages are not cached. Personal entries remain separate in browser storage `fanfest-note-v1`; they never become official data. Backup import merges by ID and preserves current entries on collisions.

The summary generator also exports `summaryPhotoSessions` keyed by event date. The TLDR text alternative reads the same grouping and times as the PNG generator; keep these synchronized when updating reservations. Broadcast rows must explicitly identify their intermittent nature and lack of a fixed end time.
