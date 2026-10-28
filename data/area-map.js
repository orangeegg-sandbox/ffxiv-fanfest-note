// Verified 2026-10-28. Image anchors are approximate percentages, not GPS.
// Source evidence, timetable transcription and image provenance: docs/SOURCES-AREA-MAP.md.
const pair = (zh, ja) => ({ zh, ja });
const base = 'https://fanfest.finalfantasyxiv.com/2026/jp/';
const link = (zh, ja, url) => ({ label: pair(zh, ja), url });
const walking = (origin, destination) => 'https://www.google.com/maps/dir/?' + new URLSearchParams({ api: '1', origin, destination, travelmode: 'walking' });
const kaihin = '海浜幕張駅 千葉県千葉市';
const toyosuna = '幕張豊砂駅 千葉県千葉市';
const messe = '幕張メッセ 国際展示場1-8ホール';
const aeon = 'イオンモール幕張新都心 グランドモール';
const park = '豊砂公園 千葉県千葉市';
const cross = 'クロス・ウェーブ幕張 幕張テクノガーデンA棟';
const stationLinks = destination => [
  link('海浜幕張站出發・Google Maps 步行', '海浜幕張駅から・Google Maps徒歩', walking(kaihin, destination)),
  link('幕張豐砂站出發・Google Maps 步行', '幕張豊砂駅から・Google Maps徒歩', walking(toyosuna, destination)),
];
const every20Minutes = (first, last) => {
  const minutes = time => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
  const values = [];
  for (let at = minutes(first); at <= minutes(last); at += 20) values.push(`${String(Math.floor(at / 60)).padStart(2, '0')}:${String(at % 60).padStart(2, '0')}`);
  return values;
};
const tableNote = pair('官方目前公布的活動時刻表，10/28 核對，時間為 JST。未另列兩日分表；班次可能變更，出發前再確認。', '現在公開されているイベント時刻表を10/28に確認。日本時間です。日別の表は掲載されていません。変更の場合があるため出発前に再確認してください。');

export const areaGuide = {
  verifiedAt: '2026-10-28',
  title: pair('周邊交通總覽', '周辺アクセスマップ'),
  intro: pair('把車站、會場與接駁站放在同一張官方地圖上。紅色線路是步行／通行動線；巴士圖示標示接駁停靠處。', '駅・会場・シャトル乗り場を1枚の公式マップで確認。赤い線は徒歩・アクセスの動線、バスのマークはシャトルの停留所です。'),
  map: {
    src: './assets/area/overview.webp', width: 3840, height: 2160,
    source: base + '_next/static/media/img_map_large.eeb37c90.jpg',
    downloadSource: base + '_next/static/chunks/images/_next/static/media/img_map.9eb27036_3840.webp',
    alt: pair('官方幕張周邊圖：海浜幕張與幕張豐砂兩站、幕張 MESSE、AEON MALL、豐砂公園、Cross Wave，以及會場間步行動線和三處接駁車站。地圖方向請看右上指北標。', '公式幕張周辺図。海浜幕張・幕張豊砂の2駅、幕張メッセ、イオンモール、豊砂公園、クロス・ウェーブ、徒歩動線と3か所のシャトル停留所。方角は右上の方位マークを確認。'),
  },
  quickRoutes: [
    { title: pair('去主會場：海浜幕張站', '本会場へ：海浜幕張駅'), body: pair('往幕張 MESSE，官方步行目安約 5 分鐘。', '幕張メッセへ、公式の徒歩目安は約5分。'), placeId: 'kaihin-station' },
    { title: pair('去 AEON／公園：幕張豐砂站', 'イオン・公園へ：幕張豊砂駅'), body: pair('車站就在 AEON MALL 前，先找 GRAND MALL 與豐砂公園方向。', '駅はイオンモールの目の前。グランドモール・豊砂公園方面を確認。'), placeId: 'toyosuna-station' },
  ],
  shuttleNote: pair('活動接駁：幕張中央迴旋處 1 號 ↔ AEON GRAND MALL 前；會場末班 18:55、AEON 末班 19:10。Cross Wave 線只供更衣室／寄物使用者，僅有早晚班次。羽田機場巴士在 3 號，請分清楚。', 'イベントシャトル：メッセ中央ロータリー1番 ↔ イオン・グランドモール前。メッセ発最終18:55、イオン発最終19:10。クロス・ウェーブ便は更衣室・クローク利用者専用で朝と夜のみ。羽田空港バスは3番です。'),
  places: [
    {
      id: 'kaihin-station', code: 'A', kind: 'station', x: 19.8, y: 70.8,
      title: pair('海浜幕張站', '海浜幕張駅'), subtitle: pair('JR 京葉線・主會場方向', 'JR京葉線・本会場へ'),
      notes: [
        pair('前往主會場優先選此站：幕張 MESSE 官方標示步行約 5 分鐘；這不含出站、入場隊列或手荷物檢查。', '本会場へはこの駅が便利。幕張メッセ公式の徒歩目安は約5分で、改札からの移動・入場待ち・手荷物検査は含めていません。'),
        pair('一般步行可走圖中行人天橋。早上首次入場需依另一張官方入場圖前往「西広場受付」，再分 1–3 號廳與 4–6・7 號廳隊列；周邊圖的 2F 西入口不取代早上的入場指示。', '通常の徒歩移動は図の歩道橋を利用できます。朝の初回入場は別の公式入場図に従い「西広場受付」へ。1–3ホールと4–6・7ホールの列に分かれます。周辺図の2F西エントランス表示を朝の受付案内の代わりにしないでください。'),
      ],
      links: [link('步行到幕張 MESSE・Google Maps', '幕張メッセへ徒歩・Google Maps', walking(kaihin, messe)), link('步行到 AEON GRAND MALL・Google Maps', 'イオン・グランドモールへ徒歩・Google Maps', walking(kaihin, aeon)), link('早上入場圖・可離線', '朝の入場案内図・オフライン可', './assets/concerts/entrance.webp')],
      venueMaps: [{ id: 'messe-entire', label: pair('查看幕張全區地圖', '幕張全体マップを見る') }],
    },
    {
      id: 'toyosuna-station', code: 'B', kind: 'station', x: 91.4, y: 60.9,
      title: pair('幕張豐砂站（幕張豊砂駅）', '幕張豊砂駅'), subtitle: pair('JR 京葉線・AEON／豐砂公園方向', 'JR京葉線・イオン／豊砂公園へ'),
      notes: [
        pair('AEON 官方交通頁說明商場就在此站前。FanFest 的 AEON 活動區與豐砂公園在 GRAND MALL 一帶；出站後依商場案內前進，不要把整座商場入口當成已到活動地點。', 'イオン公式アクセスでは駅はモールの目の前です。ファンフェスのイオン会場・豊砂公園はグランドモール側。駅から館内外の案内で進み、モール入口から目的地までの移動も見込んでください。'),
        pair('若從此站直走到幕張 MESSE，會場官方步行目安約 20 分鐘。到 GRAND MALL／公園未列精確步行分鐘數，導航時請保留移動與人潮緩衝。', 'この駅から幕張メッセへは会場公式の徒歩目安で約20分。グランドモール・公園までの分単位の所要時間はここでは断定せず、移動と混雑の余裕を見込んでください。'),
      ],
      links: [link('步行到 GRAND MALL・Google Maps', 'グランドモールへ徒歩・Google Maps', walking(toyosuna, aeon)), link('步行到豐砂公園・Google Maps', '豊砂公園へ徒歩・Google Maps', walking(toyosuna, park)), link('步行到幕張 MESSE・Google Maps', '幕張メッセへ徒歩・Google Maps', walking(toyosuna, messe))],
      venueMaps: [{ id: 'aeon', label: pair('AEON 活動位置', 'イオンのアクティビティ') }, { id: 'toyosuna', label: pair('豐砂公園餐飲地圖', '豊砂公園のフードマップ') }],
    },
    {
      id: 'messe', code: 'C', kind: 'venue', x: 32.9, y: 24.9,
      title: pair('幕張 MESSE・主會場', '幕張メッセ・本会場'), subtitle: pair('活動 1–3 號廳・舞台 4–6 號廳・7 號廳', '体験1–3ホール・ステージ4–6ホール・7ホール'),
      notes: [pair('FanFest 使用 1–7 號廳。周邊底圖的建築名稱「1〜8」是整座設施標示；找活動時請切換各館地圖。', 'ファンフェスが使用するのは1–7ホール。周辺図の建物名「1〜8」は施設全体の表示です。目的の体験は各ホールのマップで確認してください。'), pair('往 AEON／豐砂公園可利用圖中的行人天橋；往更衣室／寄物處可經 2F 步行動線。巴士站在中央迴旋處，班次及用途請看接駁站資料。', 'イオン・豊砂公園へは図の歩道橋を利用できます。更衣室・クロークへは2Fの徒歩動線も利用可能。シャトルは中央ロータリーから。便・利用条件は乗り場の案内を確認してください。')],
      links: stationLinks(messe),
      venueMaps: [{ id: 'hall1-3', label: pair('1–3 號廳', '1–3ホール') }, { id: 'hall4-6', label: pair('4–6 號廳・舞台', '4–6ホール・ステージ') }, { id: 'hall7', label: pair('7 號廳', '7ホール') }, { id: 'messe-entire', label: pair('全區・戶外物販', '全体・屋外物販') }],
    },
    {
      id: 'aeon', code: 'D', kind: 'venue', x: 59.7, y: 51.8,
      title: pair('AEON MALL 幕張新都心', 'イオンモール幕張新都心'), subtitle: pair('GRAND MALL・活動區', 'グランドモール・アクティビティ'),
      notes: [pair('從幕張豐砂站出發可依商場指示步行到 GRAND MALL。到達後切換 AEON 活動地圖，找物販、拍照點或解謎活動。', '幕張豊砂駅から案内に沿ってグランドモールへ。到着したらイオンの会場マップで物販・フォトスポット・謎解き等の場所を確認できます。'), pair('往幕張 MESSE 可步行經行人天橋，或在「グランドモール前」搭活動接駁。接駁末班 19:10，並非營運到活動 21:00 結束。', '幕張メッセへは歩道橋で徒歩、または「グランドモール前」からイベントシャトルへ。最終は19:10で、イベント終了予定の21:00までは運行しません。')],
      links: stationLinks(aeon), venueMaps: [{ id: 'aeon', label: pair('開啟 AEON 活動地圖', 'イオンの会場マップを開く') }],
    },
    {
      id: 'toyosuna-park', code: 'E', kind: 'venue', x: 71.1, y: 47.8,
      title: pair('豐砂公園（豊砂公園）', '豊砂公園'), subtitle: pair('AEON 旁・戶外餐飲', 'イオンの隣・屋外フード'),
      notes: [pair('公園緊鄰 AEON GRAND MALL，從幕張豐砂站先往 GRAND MALL／公園方向走。從幕張 MESSE 則可經圖上的行人天橋前往。', '公園はイオンのグランドモールに隣接。幕張豊砂駅からグランドモール・公園方面へ進みます。幕張メッセからは図の歩道橋で移動できます。'), pair('官方未列公園專用接駁站；可利用旁邊 AEON「グランドモール前」站，再步行到公園。商場一般路線巴士和活動接駁是不同服務。', '公園専用のイベントシャトル停留所は掲載されていません。隣接するイオン「グランドモール前」で降りて公園へ徒歩で移動します。一般路線バスとイベントシャトルは別のサービスです。')],
      links: stationLinks(park), venueMaps: [{ id: 'toyosuna', label: pair('開啟餐飲攤位地圖', 'フード出店マップを開く') }],
    },
    {
      id: 'cross-wave', code: 'F', kind: 'shuttle', x: 29.1, y: 82.0,
      title: pair('Cross Wave 幕張・接駁站', 'クロス・ウェーブ幕張・乗り場'), subtitle: pair('更衣室／寄物・使用者專用接駁', '更衣室・クローク利用者専用'),
      notes: [pair('位置：幕張テクノガーデン A 棟。更衣室及寄物需另行事前預約；此路線接駁只供這兩項服務的使用者搭乘。', '場所は幕張テクノガーデンA棟。更衣室・クロークは別途事前予約が必要です。このシャトルはその利用者のみ乗車できます。'), pair('建物 2F 出入口可經行人天橋往幕張 MESSE，官方更衣室地圖標示步行約 10 分鐘。接駁只有以下早晚班次，不是全天循環。', '建物2Fの出入口から歩道橋で幕張メッセへ。公式更衣室案内図では徒歩約10分。シャトルは下記の朝・夜の便のみで、終日循環ではありません。'), pair('11/1（日）09:45、10:00、10:15 發車班次優先安排ミラプリコレクション參加者；仍依現場乘車安排。', '11/1（日）の09:45・10:00・10:15発はミラプリコレクション参加者が優先です。当日の乗車案内に従ってください。')],
      links: [link('海浜幕張站步行到 Cross Wave・Google Maps', '海浜幕張駅から徒歩・Google Maps', walking(kaihin, cross)), link('Cross Wave 步行到幕張 MESSE・Google Maps', 'メッセへ徒歩・Google Maps', walking(cross, messe)), link('官方更衣室／寄物預約說明', '公式の更衣室・クローク案内', base + 'about/#cloak-room')],
      venueMaps: [],
      timetables: [{ title: pair('Cross Wave → 幕張 MESSE', 'クロス・ウェーブ → 幕張メッセ'), departures: ['08:30','08:45','09:00','09:15','09:30','09:45','10:00','10:15','10:30','20:40','20:55','21:10'], note: tableNote }],
    },
    {
      id: 'messe-shuttle', code: 'G', kind: 'shuttle', x: 38.8, y: 40.5,
      title: pair('幕張中央迴旋處・1 號接駁站', 'メッセ中央ロータリー・1番乗り場'), subtitle: pair('往 AEON／Cross Wave', 'イオン・クロス・ウェーブ方面'),
      notes: [pair('活動接駁在中央迴旋處 1 號乘車點。先核對車輛目的地：AEON 線與 Cross Wave 線分開；Cross Wave 線僅供更衣室／寄物使用者。', 'イベントシャトルは中央ロータリー1番から。イオン行き・クロス・ウェーブ行きの目的地を確認してください。クロス・ウェーブ便は更衣室・クローク利用者専用です。'), pair('AEON 班次每 20 分鐘，末班 18:55。班次和座位有限，無法保證到站即上車；可依人潮改走行人天橋。', 'イオン行きは20分間隔、最終18:55。本数・定員に限りがあり、到着後すぐの乗車は保証されません。混雑に応じて歩道橋での移動も検討できます。'), pair('羽田機場巴士在同一中央迴旋處的 3 號乘車點，是另一條路線；請見「交通・羽田機場」核對班次。', '羽田空港バスは同じ中央ロータリーの3番で、別路線です。「アクセス・羽田空港」で時刻を確認してください。')],
      links: [link('官方接駁時刻表・需連線', '公式シャトル時刻表・オンライン', base + 'about/#map'), link('羽田機場交通', '羽田空港への交通', '#transport')],
      venueMaps: [{ id: 'messe-entire', label: pair('幕張全區／戶外位置', '幕張全体・屋外の位置') }],
      timetables: [
        { title: pair('幕張 MESSE → AEON GRAND MALL', '幕張メッセ → イオン・グランドモール'), departures: every20Minutes('10:35','18:55'), note: tableNote },
        { title: pair('幕張 MESSE → Cross Wave（限服務使用者）', '幕張メッセ → クロス・ウェーブ（利用者専用）'), departures: ['08:50','09:05','09:20','09:35','09:50','10:05','10:20','20:30','20:45','21:00','21:15','21:30'], note: tableNote },
      ],
    },
    {
      id: 'aeon-shuttle', code: 'H', kind: 'shuttle', x: 73.2, y: 52.2,
      title: pair('AEON「グランドモール前」接駁站', 'イオン「グランドモール前」乗り場'), subtitle: pair('往幕張 MESSE・鄰近豐砂公園', '幕張メッセ方面・豊砂公園の隣'),
      notes: [pair('在 GRAND MALL 前的活動接駁站搭往幕張 MESSE 的車，與公園相鄰。請辨識活動標示，勿直接把商場一般巴士站或幕張豐砂站巴士當作活動接駁。', 'グランドモール前のイベントシャトルから幕張メッセへ。公園の隣です。イベントの案内を確認し、モールの一般路線バスや幕張豊砂駅のバスと混同しないでください。'), pair('每 20 分鐘一班，末班 19:10；晚間演出後回程需另安排步行或一般交通。班次及座位有限。', '20分間隔、最終19:10。夜の公演後の移動は徒歩や一般交通で別途計画してください。本数・定員に限りがあります。')],
      links: [link('AEON 步行回幕張 MESSE・Google Maps', 'イオンからメッセへ徒歩・Google Maps', walking(aeon, messe)), link('官方接駁時刻表・需連線', '公式シャトル時刻表・オンライン', base + 'about/#map')],
      venueMaps: [{ id: 'aeon', label: pair('AEON 活動地圖', 'イオン会場マップ') }, { id: 'toyosuna', label: pair('豐砂公園餐飲地圖', '豊砂公園フードマップ') }],
      timetables: [{ title: pair('AEON GRAND MALL → 幕張 MESSE', 'イオン・グランドモール → 幕張メッセ'), departures: every20Minutes('10:50','19:10'), note: tableNote }],
    },
  ],
  sources: [link('官方周邊地圖與接駁', '公式周辺マップ・シャトル', base + 'about/#map'), link('官方一般入場安排', '公式の会場入場案内', base + 'about/#entrance'), link('幕張 MESSE 車站交通', '幕張メッセ公式アクセス', 'https://www.m-messe.co.jp/access/'), link('AEON 官方交通', 'イオン公式アクセス', 'https://makuharishintoshin.aeonmall.jp/access')],
};
