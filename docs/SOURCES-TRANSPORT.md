# Transportation sources — verified 2026-10-28

All clock times in `data/transport.js` are **Japan Standard Time**. Event travel is for October 31–November 1, 2026; November 1 is a Sunday. This is an offline source snapshot, not a live connection guarantee.

The user corrected the day-two destination to **Haneda Airport**. The earlier Terminal 2 answer applied to the previous airport and is **not carried over**. Haneda terminal, airline and actual flight remain unconfirmed. The user asked to skip those details for now and use **00:00** as an assumption. The site therefore labels **November 2, 2026, 00:00 JST**, immediately after day two, as a provisional example. November 1 at 00:00 would instead precede day two and must not be confused with it. Current route data and links supersede the previous airport guidance.

## Venue access and local travel

- https://www.m-messe.co.jp/access/ — official Makuhari Messe access page, read October 28, 2026. States JR Keiyo Line **Kaihin-Makuhari station: about 5 minutes on foot**, **Makuhari-Toyosuna station: about 20 minutes on foot**, and **Makuhari-Hongo station → Makuhari Messe Chuo bus: about 17 minutes**. These are general venue estimates, excluding security queues and movement to a particular hall. The page links directly to the current Haneda bus route below.
- https://fanfest.finalfantasyxiv.com/2026/jp/about/ — event hours, entrance queues and inter-venue shuttles. Event shuttle: **Messe central rotary stop 1**. Cross Wave Makuhari service is limited to changing-room/cloakroom users. The Haneda airport bus instead uses **stop 3**. Both event days have a planned **21:00 close**.
- https://fanfest.finalfantasyxiv.com/2026/jp/maps/ — inter-venue map and destination context. No invented exact walking duration between the halls, mall and Toyosuna Park.

The mall's access URL previously returned HTTP 406, so it is not evidence for a specific walking-time claim.

## Haneda Airport direct bus

**Current official route:** https://www.keiseibus.co.jp/express-bus/90208-2/

Title: **羽田空港 ～ 千葉中央駅・千葉駅・千葉みなと駅・稲毛海岸駅・検見川浜駅・幕張新都心**. Read October 28, 2026. Makuhari Messe's official access page links directly to this route. The airport-bound table states **時刻：2026年02月01日改正　運賃：2026年02月01日改定**. Verification date and effective date are distinct.

The route page publishes one airport-bound timetable, with no weekday/Sunday split or operating-day markers attached to these services. It can therefore support planning for Sunday, November 1 under the current published schedule. This does not assert event-specific extra buses or override subsequent service notices.

The site's table is explicitly a **selected evening subset**, not the full all-day timetable. Cells were extracted from the same aligned columns in the airport-bound table:

| Kaihin-Makuhari departure | Messe Chuo departure | T2 arrival | T1 arrival | T3 arrival |
| --- | --- | --- | --- | --- |
| 18:30 | 18:35 | 19:17 | 19:22 | 19:29 |
| 18:45 | Does not stop | 19:27 | 19:32 | 19:39 |
| 19:15 | Does not stop | 19:57 | 20:02 | 20:09 |
| 19:40 | Does not stop | 20:17 | 20:22 | 20:29 |
| 20:10 | Does not stop | 20:45 | 20:50 | 20:57 |
| 20:45 | Does not stop | 21:20 | 21:25 | 21:32 |
| 21:15 | Does not stop | 21:50 | 21:55 | 22:02 |
| 21:45 | Does not stop | 22:20 | 22:25 | 22:32 |
| 22:45 | Does not stop | 23:20 | 23:25 | 23:32 |

The source uses a down-arrow in the Messe cells after 18:35, meaning these services do not board there; the data represents this as `null`, not as a departure time. The **18:30 station service visits Messe at 18:35**, so station and venue departures must not be reversed. Airport stop order is **T2 → T1 → T3**.

- Last **Messe Chuo** airport-bound departure: **18:35**.
- Last **Kaihin-Makuhari station** airport-bound departure: **22:45**.
- Earlier venue departures also exist. The UI links to the full official table.
- Messe Chuo boarding: **3番のりば**.
- Kaihin-Makuhari boarding: **3番のりば**. The current route's text labels this stop 3 without naming the station exit, so the guide repeats that exact supported detail and provides the official stop-map link.
- Fare from either stop to any listed Haneda terminal: **1,500円（小児750円）**.
- Evening scheduled station-to-terminal duration calculated from the displayed rows: **35–47 minutes to T2**, **47–59 minutes to T3**. These are bus timetable durations, excluding walking, waiting, traffic delay and movement to airline counters.
- Airport-bound booking wording: **ご予約・前売りは承っておりません。**
- Airport-bound payment: **ご乗車の際に、現金・交通系ICカード（PASMO、Suica等）でお支払いください。**
- **クレジットカードでのお支払いはできません。** Airport-origin booking/payment rules elsewhere on the same page must not be applied in reverse.

Service notices: https://www.keiseibus.co.jp/operation-status/

The site distinguishes the last available bus from a sensible service for the assumed flight. The 22:45 bus's existence is not evidence that a 00:00 departure can be caught. Even the 21:15 service is scheduled to reach T3 at 22:02, less than two hours before the illustrative flight, before counter access and airport procedures. Full buses, queues, road congestion and temporary changes are not predicted.

## Railway fallback and terminal selection

Official sources read successfully October 28, 2026:

- https://www.jreast.co.jp/map/pdf/map_tokyo.pdf — JR East Tokyo-area network map. Supports **Kaihin-Makuhari → Tokyo on Keiyo Line**, then **Tokyo → Shinagawa on Yamanote or Keihin-Tohoku Line**. The walking transfer from Tokyo's Keiyo platforms to other JR platforms needs additional allowance; no exact walk duration is asserted.
- https://www.keikyu.co.jp/ride/kakueki/ — Keikyu station list. Shinagawa's entry lists JR Yamanote and Keihin-Tohoku connections; airport station names are explicitly **羽田空港第3ターミナル (KK16)** and **羽田空港第1・第2ターミナル (KK17)**.
- https://www.keikyu.co.jp/ride/kakueki/pdf/ros_vertical_map.pdf — current official Keikyu network map linked by its station-list page. Supports **Shinagawa → Keikyu airport direction**, with destination/connection checks rather than assuming every southbound train reaches the airport.
- https://www.keikyu.co.jp/visit/haneda-airport/ — official airport-access guide and route/fare search. Explicitly warns: **一部国際線ご利用のお客さまは、第2ターミナル出発の場合がございますのでご確認ください。** International travel alone does not imply T3.
- https://tokyo-haneda.com/access/train/index.html — airport railway access. Confirms direct Keikyu and Tokyo Monorail connections and links to operator information. T1 and T2 railway access is on B1F; the guide uses terminal-specific station names rather than treating airport arrival as arrival at a check-in counter.
- https://tokyo-haneda.com/access/travel_between_terminals/index.html — airport inter-terminal guidance. Free terminal shuttle buses exist; T1/T2 also have an underground connecting passage. The page has a temporary-operation notice effective August 18, 2026. The guide links to it without freezing shuttle intervals or representing Keikyu/monorail as free to all passengers: free rail transfer coupons are only for eligible connecting-flight passengers.

The railway route is a **topology example** supported by the official network. Exact November 1 evening departures, connection margins, total travel duration, fares and last trains have **not** been verified and are not asserted. Users are directed to search using the actual date and required airport arrival time. The route does not guarantee a particular flight can still be caught after the event.

## The provisional midnight plan

Official international departure steps: https://tokyo-haneda.com/flight/int/dep_step.html

Haneda's page presents **T2 and T3** international departure procedures. It instructs passengers to confirm their airline counter and complete check-in early, and says counters may change on the day. The page does **not** supply a universal three-hours-before-departure requirement; the guide does not attribute one to it.

For the user-requested **00:00 assumption**, the page explicitly uses the following **editorial planning example**, not a confirmed flight or personal last-safe-departure:

1. Assume the flight leaves **November 2 at 00:00 JST**, so the trip to the airport is on **November 1 evening**.
2. Provisionally aim to reach the correct terminal by **21:00**, allowing three hours. This is a planning allowance, **not an airport-wide rule**. Airline check-in/bag-drop/security/boarding instructions take precedence.
3. Example: station **19:15** bus → **T2 19:57 / T1 20:02 / T3 20:09** scheduled arrivals. Additional time is required before that departure for leaving the event, collecting luggage, walking and queueing; traffic and full-bus contingencies also matter. No exact latest time to leave a hall is asserted.
4. The event's planned **21:00 close coincides with that provisional airport arrival target**. The example requires leaving before the event ends and cannot also promise full attendance.

Once the real flight date, terminal and airline are known, recalculate the plan. No earlier airport's terminal or timing rule is reused.
