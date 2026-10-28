# Stage source verification

Verified on **2026-10-28**. Data written to `data/stages.js`.

## Sources read

1. https://fanfest.finalfantasyxiv.com/2026/jp/stages/
2. https://fanfest.finalfantasyxiv.com/2026/jp/ (event dates and venues)
3. https://fanfest.finalfantasyxiv.com/2026/jp/about/ (opening hours, addresses, entry, transport and general photo/recording restrictions)
4. Official Hall 4–6 map, inspected by the parallel map-verification agent: unnumbered stage in Hall 4–6. Shared location ID: `main-stage`.

All three HTML pages were successfully fetched through the environment proxy with TLS verification enabled. Their rendered HTML text was parsed directly; script payloads were excluded from text extraction. Local scratch captures exist in `/tmp/fanfest-official/` and are not application assets.

## Dates and venue

- Saturday **2026-10-31** and Sunday **2026-11-01**.
- Both days: doors **09:00**, event ends **21:00**, explicitly provisional in the official overview.
- Main venue: 幕張メッセ 国際展示場 展示ホール1–7, 千葉市美浜区中瀬2-1.
- Additional venues: イオンモール幕張新都心 and 豊砂公園.
- All times are **JST (UTC+9)**. They must not be interpreted as the reader's device-local time.

## Schedule transcription

| Date | Time JST | Exact Japanese title |
| --- | --- | --- |
| 10/31 | 11:00–13:00 | 基調講演 |
| 10/31 | 15:00–16:30 | クリスタルコンフリクトリージョンチャンピオンシップ 2026 Japan Powered by Logicool G™ セミファイナル |
| 10/31 | 16:30–17:00 | 吉田Pの一問一答タイムアタック！ |
| 10/31 | 17:00–18:30 | クリスタルコンフリクトリージョンチャンピオンシップ 2026 Japan Powered by Logicool G™ ファイナル |
| 10/31 | 19:30–20:30 | ピアノコンサート |
| 11/01 | 10:30–12:00 | 開発パネル |
| 11/01 | 12:30–13:30 | LIVE Q&A |
| 11/01 | 13:50–15:00 | ミラプリコレクション |
| 11/01 | 15:30–17:30 | 直樹の部屋 |
| 11/01 | 19:00–20:30 | スペシャルライブ - THE PRIMALS |

There are also two **会場生中継** entries: 10/31 from **10:00** and 11/01 from **09:30**. The official page explicitly says these air **before the stage starts and between programs**. No end is given. They are `category: 'broadcast'`, have no `end` and no `locationId`, and must not be drawn as continuous all-day stage slots.

Japanese source titles are retained verbatim apart from HTML `<wbr>`/layout-only spaces. Traditional Chinese titles and summaries are editorial translations, not a claim of official localized terminology. Performers' names remain in Japanese/Latin script for lookup; 室内俊夫 is also shown beside its Traditional Chinese rendering.

## Important limitations and rules retained

- Program content/times may change.
- Stage seating is all unreserved; there is no audience replacement between programs, and concert chairs remain available.
- Only the special live permits standing in the seated area, in place; no crowding into aisles/front. No bag-based seat reservation, no folding chairs. Wheelchair users should contact staff for designated space.
- Free streams exclude the piano concert and THE PRIMALS live. Paid streaming ticket: both days ¥4,950 tax included, plus ¥660 system fee tax included. Sales run to approximately 2026-11-21 23:59. Archives are planned from the following day at 18:00 until approximately 2026-11-22 23:59; archive start may change.
- These streaming charges concern **online viewing**, not an invented extra on-site concert charge.
- The official overview states that photos, video and audio recording have partial restrictions and users must follow staff instructions. No program-specific total recording ban was invented.
- The LIVE Q&A page still says collection methods will be announced later. No assumed application method is supplied.

## Data exports

- `stages`: 12 entries (10 fixed programs, 2 intermittent venue broadcasts).
- `eventMeta`: verified dates, main venue/address, related venues and provisional opening/closing hours.
- `stageGuidance`: bilingual seating, streaming and recording notes with source links.
