# Transportation sources — verified 2026-10-28

All clock times in `data/transport.js` are Japan Standard Time. Travel planning is for October 31–November 1, 2026; November 1 is a Sunday. Data is a static snapshot, not a live connection guarantee. The user specified **Narita Terminal 2**, so airport route cards prioritize T2 and **Airport Terminal 2 station / 空港第2ビル駅**. No flight time or airline has yet been supplied, so no personal leave-by time is asserted.

## Venue access and local travel

- https://www.m-messe.co.jp/access/ — official Makuhari Messe access page. Read October 28, 2026. Explicitly states JR Keiyo Line **Kaihin-Makuhari station: about 5 minutes on foot**, **Makuhari-Toyosuna station: about 20 minutes on foot**, and **Makuhari-Hongo station → Makuhari Messe Chuo bus: about 17 minutes**. Walking durations are general venue-access estimates, not the event security queue or a specific hall entrance. Provides return bus-stop maps and official operator timetable links.
- https://fanfest.finalfantasyxiv.com/2026/jp/about/ — event hours, separate entrance queues and inter-venue shuttle information. The event shuttle boards at **Messe central rotary stop 1**. Cross Wave Makuhari service is limited to changing-room/cloakroom users. Do not confuse this with the Narita route at **stop 3**. Both days have a planned 21:00 close.
- https://fanfest.finalfantasyxiv.com/2026/jp/maps/ — inter-venue map and destination context. No invented exact walk duration between the exhibition hall, mall and Toyosuna Park.

The mall's access URL returned HTTP 406 to the research client, so no walking-time or station-adjacency claim was derived from that unavailable page.

## Narita Airport direct bus

Current official route page (HTML timetable, not a PDF):

https://www.keiseibus.co.jp/express-bus/90105-2/

Page title: **成田空港 ～ 稲毛海岸駅・海浜幕張駅**. The Makuhari Messe website links directly to this current page. The old `/kousoku/nrt16.html` URL redirects to the operator homepage and was not used as timetable evidence.

The route page states **時刻：2026年03月20日改正　運賃：2024年04月01日改定**. Verification date (October 28, 2026) is distinct from these effective dates.

Read the airport-bound table, preserving column alignment. Services that stop at **幕張メッセ中央** are:

| Messe Chuo departure | Kaihin-Makuhari departure | T3 arrival | T2 arrival | T1 arrival |
| --- | --- | --- | --- | --- |
| 13:14 | 13:40 | 14:17 | 14:20 | 14:25 |
| 14:34 | 15:00 | 15:37 | 15:40 | 15:45 |
| 16:30 | 16:56 | 17:33 | 17:36 | 17:41 |

These are the three services boarding at Messe Chuo, **not** all services boarding at Kaihin-Makuhari. The station's last published airport-bound departure is **16:56**, with arrival at T3 17:33, T2 17:36 and T1 17:41. The station has additional departures, including 16:25. No airport bus after the 21:00 event close is shown on this route.

The only weekday marker in the airport-bound table is **京成Ｅ 成空★** for the column departing Kaihin-Makuhari at **07:42**. Footnote: **★印：平日のみ運行（但し、12/30〜1/3は運行なし）**. None of the three Messe services or the 16:56 last station departure has this marker. They are therefore represented as available for Sunday planning under the current published table, with a direction to check service notices before travel; no event-specific extra service is assumed.

- Messe Chuo boarding: **3番のりば**.
- Kaihin-Makuhari boarding: **北口3番のりば**.
- Fare to airport: **1,200円（小児600円）**, from both stops.
- Scheduled station-to-terminal durations calculated from the above aligned columns: **37 / 40 / 45 minutes** to T3 / T2 / T1.
- Messe Chuo-to-terminal durations: **63 / 66 / 71 minutes**, because the bus visits hotels before Kaihin-Makuhari. Do not describe this as a 40-minute trip from the venue.
- T2-focused UI presents all three Messe services and their **14:20 / 15:40 / 17:36 T2 arrivals** in a visible three-column timetable before the boarding steps. It gives **40 minutes from Kaihin-Makuhari / 66 minutes from Messe Chuo** as scheduled travel durations, not crowd- or traffic-adjusted trip budgets.
- Airport-bound booking wording: **ご予約・前売りは承っておりません。**
- Airport-bound payment: **運賃は乗車時にバス車内にて、現金・交通系ICカード・回数券にてお支払いください。**
- **クレジットカードでのお支払いはできません。** The airport-origin ticket-counter payment rules are different and must not be applied to the venue-to-airport direction.

Service status: https://www.keiseibus.co.jp/operation-status/

Congestion, full buses and last-minute changes are not predicted. Flight planning must include more than the published in-vehicle duration.

## Railway fallback and terminals

- https://www.jreast.co.jp/map/pdf/map_tokyo.pdf — JR East official Tokyo-area railway map, retrieved successfully October 28, 2026. Supports the route topology **Kaihin-Makuhari → Soga (Keiyo Line) → Chiba (Uchibo/Sotobo Line toward Chiba) → airport (Sobu Main/Narita Line airport connection)**.
- https://www.narita-airport.jp/ja/access/train/ — airport rail access and official route-search entry point. Confirms **Narita Airport station for T1**, **Airport Terminal 2 station for T2/T3**; T3 requires additional access. Its station-access paragraph gives **about 5 minutes on foot from Airport Terminal 2 station to T2**. This does not assert arrival at a particular check-in counter in five minutes. The guide does not promise a through service from every Chiba departure or equate Narita city station with the airport.
- https://www.narita-airport.jp/ja/access/shuttlebus/ — official inter-terminal transfer guidance.

This railway path is an editorial route example based on official network information. Exact Sunday departure times, connection margins, fares, last trains and total travel duration were **not** verified, and are intentionally not asserted. The page directs readers to search with November 1 and their required airport arrival time. Rail availability alone does not imply that a particular flight is still catchable.

## Airport arrival planning

https://www.narita-airport.jp/ja/airportguide/inter-dep/

Official international-departure guide states **出発の2時間以上前には到着**, followed by **到着目安時間は各航空会社のチェックイン開始時間によって変わります。事前に確認をして、余裕を持って空港へ到着しましょう。**

The website therefore cites the airport's **at least 2 hours before international departure** guideline while prioritizing the traveler's airline instructions, terminal and check-in/bag-drop deadlines. It adds explicit time for luggage collection, walking, queues, transfers and possible delay; this is planning advice, not an official fixed margin or a guarantee.
