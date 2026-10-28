# Validation — 2026-10-28

## Official content

Read the four supplied official pages, the linked event overview, ticket/app requirements, manufacturer download pages, and official venue/operator/airport access sources. Source evidence and extraction decisions are recorded in SOURCES-STAGES.md, SOURCES-ACTIVITIES.md, SOURCES-APPS.md and SOURCES-TRANSPORT.md.

- 10 fixed stage programs plus 2 intermittent venue broadcast entries; no invented end times for broadcasts.
- 65 bilingual activities, food stalls, exhibits and services.
- Six original official 4096×2304 JPG maps; 66 hotspot positions. Every activity has a map association.
- Shared Hall 1–3 #6 and repeated meeting/food locations retain their correct relationships; Toyosuna numbering is separate.
- Timeline dates/times, Quick Photo gathering slots, application window and queue cutoff independently checked against official text. Booking-only wording is scoped to the listed reservation activities.
- Both PNGs use deterministic text rendering; the accessible TLDR text uses the same photo-session metadata and includes opening hours and broadcast caveats.
- App requirements are scoped to admission or the named activity: SQUARE ENIX app for tickets, either supported instax app for screenshot printing, LINE and X for the mystery game. Optional navigation/translation apps and the QOくん browser tool are identified separately. Official download links, Japan-store availability and ticket screenshot restrictions were checked.
- Narita T2 table retains all three Messe Chuo services and T2 arrivals: 13:14 → 13:40 → 14:20; 14:34 → 15:00 → 15:40; 16:30 → 16:56 → 17:36. Columns are Messe Chuo, Kaihin-Makuhari and T2. The March 20 timetable revision is distinct from the October 28 verification date; Sunday applicability and boarding/payment details are recorded in the source notes.
- The rail fallback names 空港第2ビル駅 for T2. No verified flight time, personal leave-by time, exact Sunday rail schedule or guarantee of catching a flight is asserted.

## Browser checks

Current `npm test`: **43 checks passed**: the unchanged 32 existing checks (5 offline + 27 functional), plus 4 timetable unit checks and 7 improvement browser checks.

The existing suites cover root and subdirectory hosting, complete offline caches and failed downloads, all six primary routes in both languages at 320/390/1280px, official dates/times, bookmarks, Japan-time calendar exports while the browser uses a different timezone, map-number interactions, shared numbers, fit/zoom/auto-pan/drag/reset, image downloads, text equivalents, personal schedules, checklists, backup imports and keyboard navigation.

New checks cover both schedule modes, proportional block heights, the pinned left time axis, date/search/bookmark filtering, full chart details and focus, overlapping/early/late/unknown-end personal entries, structured activity hours and conditions, shared App guidance and download links, transport navigation, T2 bus/rail content and offline reload under a deployment subdirectory. Both languages are checked at 320/390/1280px, including document overflow. The six new cache files were individually fetched while offline, with no page errors.

Review screenshots are under `.impeccable/review/`. The current set includes 13 `improved-*.png` captures of agenda/chart, mobile activity detail, Apps, TLDR Apps, transport and Narita T2 content at desktop 1440px and phone 390/320px sizes. Chart captures include the second day and Japanese at 320px. Earlier clean official-schedule captures contain all 12 entries and no synthetic personal plans; the list capture uses a saved actual keynote.

The independent finish reviewer returned **ship**, with no material fixes, after reviewing all 13 current captures, implementation, sources and tests. The earlier guide review also returned ship for maps, generated timeline images and core navigation.

The current detector report, `.impeccable/review/improvements-detector.json`, contains **0 primary findings and 23 advisories**. Advisories concern font sizes outside the recorded frontmatter scale and the chart's 6px event-block radius. These are documented differences from the baseline, not proof of a rendering defect or a replacement for visual review; the independent reviewer assessed the rendered results.

The documenter compared `DESIGN.md` and `.impeccable/design.json` with `app.js`, `ui/schedule.js`, `ui/preparation.js`, `guide.css` and `schedule.css`. The extensions retain paper/evergreen/sage/rust colors, serif page headings, sans-serif reading text, thin dividers, flat surfaces, explicit labels and existing focus styles. The design references were preserved. Chart-specific corners and compact labels, additional reading sizes, and the baseline's existing 13px responsive labels were not promoted to new design-system tokens merely to clear advisories.

## Release

`npm run package` produces `dist/site` and `dist/fanfest-note.zip`. The current package contains **32 static site files**, including `.nojekyll`; the ZIP adds `START-HERE.txt`. ZIP integrity passed. All **28 precache assets** are present, including the six new UI/data/CSS files, all six maps and both summary PNGs. `sw.js` is versioned `2026-10-28-guide-v4`.

Source lives on `main`; `deploy` contains only the packaged static site and excludes development tools, tests and repository configuration. The current extension package is locally verified; pushing this revision and checking its public deployment are the remaining release steps at the time of this record.

GitHub Pages is now enabled. Its API reports `build_type: legacy`, source branch `deploy`, source path `/` and status `built`, at https://orangeegg-sandbox.github.io/ffxiv-fanfest-note/ . This verifies the publishing configuration and an existing build, not publication of unpushed local changes. No cloud environment publication was performed.

Content is a snapshot verified on October 28, 2026; later official changes require reverification and regeneration. Calendar alarms depend on the user's calendar application; the website does not send background push notifications.
