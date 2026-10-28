# Area map, stations and event shuttle verification

Verified **2026-10-28** for FanFest **October 31–November 1, 2026**. All shuttle times below are **JST**. The official pages and live timetable dialogs were read through the inherited proxy with TLS verification enabled. This is a static planning snapshot, not live routing or a guarantee of boarding.

## Official consolidated map

Source page: https://fanfest.finalfantasyxiv.com/2026/jp/about/#map

- Official optimized image: https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/chunks/images/_next/static/media/img_map.9eb27036_3840.webp
- Original image linked by the official page: https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/media/img_map_large.eeb37c90.jpg
- The optimized image is **3840 × 2160**, **191,028 bytes**, SHA-256 `660d52ab79945f130c0bf535f0af44bd9b9a4b1ecdfbe7d142734e79db9dc711`.
- The linked original is **2048 × 1152**, **1,717,882 bytes**, SHA-256 `aa4d88dd8b90b1f77643bedc799367392d84caafb9b2d91f5ea8b1b5b608037b`.

The official map visibly connects **JR Kaihin-Makuhari**, **JR Makuhari-Toyosuna**, **Makuhari Messe**, **AEON MALL Makuhari Shintoshin**, **Toyosuna Park**, and **Cross Wave Makuhari**. Three bus symbols identify shuttle stop areas at Messe, AEON and Cross Wave. It includes footbridges, elevator symbols and a rotated north arrow; do not assume the drawing is north-up or use image percentages as geographic coordinates.

The map's red arrows are **walking/access paths**, including the approach marked **「2F 西エントランスから」**. They are not a plotted bus road route. The bus symbols show stops, not the exact roads taken by each shuttle. The venue building is labelled halls **1–8**, but this FanFest uses **1–7**. Preserve the official artwork while using the correct event scope in the guide's text.

The current overview is an additional area-navigation surface. The six existing venue/floor maps remain unchanged and continue to identify activities inside each venue.

## General arrival versus morning admission

Source: https://fanfest.finalfantasyxiv.com/2026/jp/about/#entrance

The event says morning queues split by destination:

> 朝の時間帯は、行き先が「1-3ホール」または「4-6ホール・7ホール」のどちらかによって入場待機列が分かれます。

The separate entrance map shows **Kaihin-Makuhari station → orange walking route → stairs down to 西広場受付**, then blue for halls 1–3 or purple for halls 4–6/7:

https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/media/img_entrance_map_large.5c835224.jpg

That entrance map is already cached for concert guidance as `assets/concerts/entrance.webp`. Its morning West Plaza route takes precedence over treating the overview's 2F west entrance as an unconditional first-admission shortcut. Follow signs and staff; entrances and passageways may temporarily close due to congestion. See also `SOURCES-CONCERTS.md` for ticket/wristband requirements and the absence of a concert-specific evening queue time.

## Walking and rail-station access

### Makuhari Messe official access

https://www.m-messe.co.jp/access/

Exact source statements:

- **「JR京葉線 『海浜幕張駅』から徒歩約5分」**.
- **「※JR京葉線 『幕張豊砂駅』からは徒歩約20分」**.
- **「JR総武線・京成線『幕張本郷駅』から『幕張メッセ中央』行きバスで約17分」**.
- The bus section identifies **Makuhari-Hongo station boarding stop 1** for these local-bus routes.

These are venue/operator estimates to Messe, not timed arrivals at a particular stage, activity, admission queue or seat. Extra time is needed for station exit, finding entrances, waiting, crowds and luggage. **Makuhari-Hongo is not plotted on the consolidated event image**; show it as a wider-area connection or external navigation link rather than inventing an off-map pin. Makuhari station, Makuhari-Hongo, Kaihin-Makuhari and Makuhari-Toyosuna are distinct stations.

### AEON MALL and Toyosuna Park

Current official access page: https://makuharishintoshin.aeonmall.jp/access

The legacy event-linked domain `https://makuharishintoshin-aeonmall.com/static/detail/access` redirects there. The page states:

> JR 京葉線「東京駅」より約30分「幕張豊砂駅」前！！

The station faces the **Ekimae Mall** side of the large AEON complex. The event map and shuttle timetable identify the festival's AEON stop at **Grand Mall**, with Toyosuna Park adjacent to that part of the complex. Do not equate arriving at Makuhari-Toyosuna station with arriving at Grand Mall's activity area or the park. Follow mall signs toward Grand Mall/Toyosuna Park; no precise station-to-Grand-Mall or station-to-park walking duration was verified.

AEON's access page separately lists ordinary **paid route buses** from Kaihin-Makuhari, Makuhari-Hongo and other stations. These are not the FanFest inter-venue shuttle. A weekday evening fare promotion on AEON's page must not be applied to the Saturday/Sunday event shuttle.

The event maps page identifies AEON activities at **ホビーコート** and **グランドコート**, and says Toyosuna Park's content is usable without a FanFest ticket:

https://fanfest.finalfantasyxiv.com/2026/jp/maps/

The event overview gives Toyosuna Park's address as **千葉県千葉市美浜区豊砂1-12** and AEON's as **千葉県千葉市美浜区豊砂1-1他**. Neither page supplies a dedicated Toyosuna Park shuttle stop. The AEON Grand Mall stop is the nearby named event stop; continue on foot to the park.

### Cross Wave / cloakroom

https://fanfest.finalfantasyxiv.com/2026/jp/about/#cloak-room

- **クロス・ウェーブ幕張**, **千葉県千葉市美浜区中瀬1-3 幕張テクノガーデンA棟**.
- Official text: **「幕張メッセへは、建物2階の出入口から歩道橋を使用することでスムーズに移動できます」**.
- Official cloakroom map labels the walk to Messe **「徒歩約10分」**: https://fanfest.finalfantasyxiv.com/2026/jp/_next/static/media/img_cloakroom_map_large.48ce3485.jpg . Its optimized image was visually inspected; this is the venue-to-venue walking estimate, not a guarantee to the user's hall or queue.
- Changing rooms/cloakroom require separate reservations. Their facility hours do not imply continuous shuttle service.

## Event shuttle endpoints and restrictions

Source: https://fanfest.finalfantasyxiv.com/2026/jp/about/#map

Official text:

> 会場間は、歩道橋を利用することでスムーズに移動できますが、移動のサポートとしてシャトルバスの運行も予定しております。

> 運行本数や乗車定員には限りがありますので、状況に応じてご活用ください。

The three named departure points are:

1. **幕張メッセ 中央ロータリー（1番乗り場）** → AEON MALL or Cross Wave.
2. **イオンモール幕張新都心 グランドモール前** → Makuhari Messe. The complete “Grand Mall front” wording appears in the timetable dialog.
3. **クロス・ウェーブ幕張** → Makuhari Messe.

Cross Wave restriction, also repeated in the cloakroom section:

> シャトルバスは更衣室、クロークを利用する方のみご乗車いただけます。

**No shuttle fare statement was found in the inspected event text or dialogs.** Do not call these shuttles free, paid or reservation-free without further source evidence. The published capacity caveat remains relevant even when a departure is shown.

The event shuttle's Messe **stop 1** differs from the **Haneda airport bus at Messe Chuo stop 3**. The Haneda route is independently sourced at https://www.keiseibus.co.jp/express-bus/90208-2/ and documented in `SOURCES-TRANSPORT.md`; do not merge the routes, fares or timetables.

## Published shuttle timetable snapshot

The `時刻表はこちら` controls open live HTML tables, rather than timetable images. All three dialogs were opened in Chromium and their table cells were extracted separately to avoid accidentally mixing the two columns in the Messe departure table. Scratch text and row arrays are under `/tmp/area-shuttle-*.txt` and `/tmp/area-shuttle-tables.json`, not runtime assets.

The page is for the October 31–November 1 event. The ordinary rows have **no separate Day 1 / Day 2 table or date label**. The Cross Wave table explicitly adds a November 1 priority exception. Present these as the **currently published event timetable, verified October 28**, with the special Sunday note and an instruction to recheck current operation. Do not describe this as a year-round service or a separately guaranteed timetable for each day.

Every dialog says **「時刻表は変更される場合があります。」** Cross Wave also says **「一部ダイヤを調整いたしました。」**

### Messe → AEON Grand Mall

**10:35, 10:55; then each hour 11–18 at :15, :35, :55.**

Equivalent compact display: **10:35–18:55, every 20 minutes**. These are departures from Messe central rotary stop 1; no arrival times are published in the dialog.

### AEON Grand Mall → Messe

**10:50; then each hour 11–18 at :10, :30, :50; 19:10.**

Equivalent compact display: **10:50–19:10, every 20 minutes**. These are departures from Grand Mall front, not from Makuhari-Toyosuna station.

The AEON shuttle ends before the event's planned 21:00 close. Do not promise a ride after the evening concerts; walking and other independently checked transport must be considered.

### Messe → Cross Wave

**08:50; 09:05, 09:20, 09:35, 09:50; 10:05, 10:20; 20:30, 20:45; 21:00, 21:15, 21:30.**

There are no listed departures from 10:20 until 20:30. Do not label it an all-day 15-minute service.

### Cross Wave → Messe

**08:30, 08:45; 09:00, 09:15, 09:30, 09:45※; 10:00※, 10:15※, 10:30; 20:40, 20:55; 21:10.**

Footnote, verbatim:

> ※11月1日（日）は、ステージプログラム「ミラプリコレクション」参加者の方が優先的にご乗車いただける便になります。

The **09:45 / 10:00 / 10:15 departures on November 1** prioritize Mirapuri Collection participants. This is an additional priority rule; it does not remove the general changing-room/cloakroom-user restriction.

## Navigation links and presentation limits

Online Google Maps directions may use station/venue names or officially sourced destinations, but any computed route, estimate, accessibility instruction or live bus result belongs to that external service. Do not freeze an unverified Google estimate into the offline guide or imply the offline image performs GPS navigation.

Preserve Japanese place names for sign matching. Clearly distinguish walking paths, event-shuttle connections, ordinary local buses, the airport bus and the morning admission queue. Diagram selection must not invent a dedicated stop at each hall or in Toyosuna Park.
