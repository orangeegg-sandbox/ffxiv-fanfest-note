# Official activity and map sources

Verified on **2026-10-28**. Source language: Japanese. Traditional Chinese copy in `data/activities.js` is a faithful, condensed reader aid; Japanese names are retained for matching signage. Descriptions are summaries, not quotations of every official detail. Source links remain available for full conditions and updates.

## Pages read

- https://fanfest.finalfantasyxiv.com/2026/jp/floors/
- https://fanfest.finalfantasyxiv.com/2026/jp/floors/activity-reservation/
- https://fanfest.finalfantasyxiv.com/2026/jp/maps/
- https://fanfest.finalfantasyxiv.com/2026/jp/about/

The floor page displays short cards; its public client bundle also contains the actual modal details, operating hours, restrictions, prices, reservation flags and numbered service labels:

https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/9577-d12cf1bba1a855cf.js

This is the same published content used by the official site. The map page's image metadata additionally comes from:

https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/9519-b34fc5975f08d08b.js

## Coverage

- 65 entries: all official numbered Makuhari/AEON positions 1–39, a second activity at number 6, an unnumbered main-stage entry, and Toyosuna food positions 1–24.
- Six original JPG map images, saved byte-for-byte under `assets/maps/` at their original 4096 × 2304 dimensions.
- 66 hotspots. Each is anchored at the visible official numbered marker center, using x/y percentages. Approximate manually read centering is for selection, not pedestrian navigation or surveying.
- The two number-28 meeting points and the two number-3 BBQ Freely markers each use one activity ID at two image positions.
- Hall 1–3 number 6 means **both** Nice Head Garden and the Allagan control panel inside it. A single hotspot includes `activityIds` for both; both activity records retain number 6.
- Toyosuna numbering is independent of Makuhari/AEON numbering; always resolve `(mapId, number)` together.
- The main stage is visibly marked `ステージ` in Hall 4–6, without a number. It uses `id: main-stage`, `mapId: hall4-6` and an unnumbered hotspot.
- Official text calls the FFVII Remake exhibit location `1-3 / B`, while its numbered marker 3 appears against the yellow A area in the image. The app preserves the official text label and anchors to the actual official number, without silently changing either.

## Reservation and use conditions

- The reservation lottery ran October 21–25, ending 23:59 JST. Results are expected by email around October 28; the app also provides result status.
- **Within the reservation page's listed contents**, Quick Photo alone requires an advance booking. Other listed items offer general queues, with reserved queues prioritized. This does **not** mean all event services are walk-in: changing rooms and cloakroom require separate reservations.
- Reservation meeting time is not the guaranteed experience start. Joining the reserved queue more than 30 minutes after the meeting time is not permitted.
- App ticket display is required; screenshots and printed copies are invalid.
- The `reservationInfo` payment summary is scoped to the reservation page's paid contents. Individual booth/modal payment details and food vendors can differ; no blanket cashless claim is made for the entire festival.
- Activity-specific operating hours and last-acceptance cutoffs are retained in notes. Not all contents open at 09:00 or close at 21:00.
- Food/AEON areas can be used without FanFest admission tickets. Food shop numbers are grouped under Toyosuna, with official vendor descriptions and general 10:00–20:00 food-area hours.
- No invented train timings or walking durations are included. Shuttle information is limited to official stop locations, planned operation and capacity caveats. The Cross Wave shuttle is only for changing-room/cloakroom users.

## Original images

All maps are official SQUARE ENIX assets. Copyright remains with SQUARE ENIX. The local copies enable the user's offline guide; `maps[].source` points to each original image.

- `messe_entire.f6fe34fd.jpg` — 2F central mall / outdoor exhibition area.
- `messe_hall1-3.0be2c736.jpg` — Halls 1–3.
- `messe_hall4-6.66cd19f4.jpg` — Halls 4–6 and main stage.
- `messe_hall7.ea20eeaa.jpg` — Hall 7.
- `aeon.c1bab500.jpg` — AEON MALL.
- `toyosuna.07bce888.jpg` — Toyosuna Park food area.

Original URL prefix: `https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/media/`.
