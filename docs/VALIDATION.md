# Validation — 2026-10-28

## Official content

Read the four supplied official pages and the linked event overview. Source evidence and extraction decisions are recorded in SOURCES-STAGES.md and SOURCES-ACTIVITIES.md.

- 10 fixed stage programs plus 2 intermittent venue broadcast entries; no invented end times for broadcasts.
- 65 bilingual activities, food stalls, exhibits and services.
- Six original official 4096×2304 JPG maps; 66 hotspot positions. Every activity has a map association.
- Shared Hall 1–3 #6 and repeated meeting/food locations retain their correct relationships; Toyosuna numbering is separate.
- Timeline dates/times, Quick Photo gathering slots, application window and queue cutoff independently checked against official text. Booking-only wording is scoped to the listed reservation activities.
- Both PNGs use deterministic text rendering; the accessible TLDR text uses the same photo-session metadata and includes opening hours and broadcast caveats.

## Browser checks

Final `npm test`: **32 checks passed** (5 offline + 27 functional), followed by clean official-content screenshot capture.

The test suites cover root and subdirectory hosting, complete offline caches and failed downloads, all six routes in both languages at 320/390/1280px, official dates/times, bookmarks, Japan-time calendar exports while the browser uses a different timezone, map-number interactions, shared numbers, fit/zoom/auto-pan/drag/reset, image downloads, text equivalents, personal schedules, checklists, backup imports and keyboard navigation.

Review screenshots are under `.impeccable/review/`. Clean official-schedule captures contain all 12 entries and no synthetic personal plans. The list capture uses a saved actual keynote.

The independent finish reviewer returned **ship** for the current guide. The final review confirmed readable original timeline images and maps, consistent bilingual hierarchy, intact mobile navigation and corrected accessible timeline coverage.

The detector was run once. Its navigation-border warning is a false positive for a selection underline, and its remaining font/size findings refer to overridden declarations or documented small metadata/responsive sizes. No second detector run was substituted for visual review.

## Release

`npm run package` produces `dist/site` and `dist/fanfest-note.zip`. ZIP integrity and presence of all six maps, both PNGs and the shared photo-session metadata were checked; the archive is approximately 23.22 MiB.

No public website deployment or environment publication was performed in this task. Content is a snapshot verified on October 28, 2026; later official changes require reverification and regeneration. Calendar alarms depend on the user's calendar application; the website does not send background push notifications.
