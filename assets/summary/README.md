# Shareable timeline sheets

- `summary-zh.png`: Traditional Chinese, with original Japanese program names.
- `summary-ja.png`: Japanese.
- Matching HTML files retain selectable, accessible text and source links.
- `data/summary.js` stores dimensions, descriptions and source metadata for the site.

Generate with `node scripts/generate-summary.mjs`. It imports the verified
`data/stages.js` program data and opening hours, then renders deterministic text
through Playwright/Chromium. Regeneration requires Chromium and fonts covering
Japanese and Traditional Chinese (the current environment has Noto Sans/Serif
CJK). The output PNGs have no font/runtime dependency.

The generator also records verified Quick Photo gathering slots and concise
reservation conditions from the official reservation page. Review those constants
whenever official reservation information changes. Do not call gathering times
experience start times. Report broadcasts are listed separately and are never
shown with an invented ending time.

Sources, verified 2026-10-28:

- https://fanfest.finalfantasyxiv.com/2026/jp/about/
- https://fanfest.finalfantasyxiv.com/2026/jp/stages/
- https://fanfest.finalfantasyxiv.com/2026/jp/floors/activity-reservation/

This is an unofficial summary, not an official event handout. Schedule and
reservation changes must be checked against official announcements.
