// Verified against the official stage, home and event-overview pages on 2026-10-28.
// All date/time fields describe Japan Standard Time (UTC+9), not device local time.
const stageSource = 'https://fanfest.finalfantasyxiv.com/2026/jp/stages/';
const aboutSource = 'https://fanfest.finalfantasyxiv.com/2026/jp/about/';
const stageLocation = { zh: '幕張展覽館 4–6 號廳・舞台區', ja: '幕張メッセ 4–6ホール・ステージエリア' };

export const eventMeta = {
  dates: ['2026-10-31', '2026-11-01'],
  venue: { zh: '幕張展覽館 國際展示場 1–7 號展覽廳', ja: '幕張メッセ 国際展示場 展示ホール1–7' },
  address: { zh: '日本千葉市美濱區中瀨2-1', ja: '千葉市美浜区中瀬2-1' },
  additionalVenues: [
    { zh: 'AEON MALL 幕張新都心', ja: 'イオンモール幕張新都心' },
    { zh: '豐砂公園', ja: '豊砂公園' },
  ],
  hours: [
    { date: '2026-10-31', open: '09:00', close: '21:00' },
    { date: '2026-11-01', open: '09:00', close: '21:00' },
  ],
  hoursNote: { zh: '開場及結束時間為預定，可能變更。', ja: '開催時間は予定です。今後変更される場合があります。' },
  source: aboutSource,
  verifiedAt: '2026-10-28',
};

export const stages = [
  {
    id: 'd1-keynote', date: '2026-10-31', start: '11:00', end: '13:00', category: 'stage',
    title: { zh: '主題演講', ja: '基調講演' },
    description: {
      zh: '製作人兼總監吉田直樹介紹 FFXIV 接下來的新發展。出演：吉田直樹。',
      ja: 'プロデューサー兼ディレクターの吉田直樹が、FFXIVの今後の新展開についてお話しします。出演：吉田直樹。',
    },
    location: stageLocation, locationId: 'main-stage', source: stageSource + '#stages_day1_keynote',
  },
  {
    id: 'd1-ccrc-semifinal', date: '2026-10-31', start: '15:00', end: '16:30', category: 'stage',
    title: { zh: '水晶衝突日本區域冠軍賽・準決賽', ja: 'クリスタルコンフリクトリージョンチャンピオンシップ 2026 Japan Powered by Logicool G™ セミファイナル' },
    shortTitle: { zh: '水晶衝突・準決賽', ja: 'クリスタルコンフリクト 準決勝' },
    description: {
      zh: '晉級的 4 支隊伍爭奪日本冠軍。主持：央川とうい；實況：so5u；解說：せらヴぃ、吉田直樹。',
      ja: '予選を勝ち抜いた4チームが日本王者の座をかけて激突。出演：央川とうい（MC）、so5u（実況）、せらヴぃ・吉田直樹（解説）。',
    },
    location: stageLocation, locationId: 'main-stage', source: stageSource + '#stages_day1_ccrc',
  },
  {
    id: 'd1-quick-qa', date: '2026-10-31', start: '16:30', end: '17:00', category: 'stage',
    title: { zh: '吉田 P 快問快答挑戰！', ja: '吉田Pの一問一答タイムアタック！' },
    description: {
      zh: '吉田 P 挑戰以一問一答形式，盡量回答更多玩家提問。出演：吉田直樹、室內俊夫（室内俊夫）。',
      ja: '吉田Pが一問一答形式で、皆さんからの質問に可能な限りたくさん回答するチャレンジ企画。出演：吉田直樹、室内俊夫。',
    },
    location: stageLocation, locationId: 'main-stage', source: stageSource + '#stages_day1_time_attack',
  },
  {
    id: 'd1-ccrc-final', date: '2026-10-31', start: '17:00', end: '18:30', category: 'stage',
    title: { zh: '水晶衝突日本區域冠軍賽・決賽', ja: 'クリスタルコンフリクトリージョンチャンピオンシップ 2026 Japan Powered by Logicool G™ ファイナル' },
    shortTitle: { zh: '水晶衝突・決賽', ja: 'クリスタルコンフリクト 決勝' },
    description: {
      zh: '決定日本區域冠軍的最終對決。主持：央川とうい；實況：so5u；解說：せらヴぃ、吉田直樹。',
      ja: '日本王者を決めるファイナル。出演：央川とうい（MC）、so5u（実況）、せらヴぃ・吉田直樹（解説）。',
    },
    location: stageLocation, locationId: 'main-stage', source: stageSource + '#stages_day1_ccrc_final',
  },
  {
    id: 'd1-piano', date: '2026-10-31', start: '19:30', end: '20:30', category: 'concert',
    title: { zh: '鋼琴音樂會', ja: 'ピアノコンサート' },
    description: {
      zh: 'Keiko 演奏 FFXIV 鋼琴改編樂曲，嘉賓為 Amanda Achen。網路收看需另購付費直播票，不包含於免費直播。',
      ja: 'KeikoによるFFXIV楽曲のピアノアレンジ。ゲスト：Amanda Achen。オンライン視聴には有料配信チケットが必要で、無料配信の対象外です。',
    },
    location: stageLocation, locationId: 'main-stage', source: stageSource + '#stages_day1_live_piano',
  },
  {
    id: 'd1-live-report', date: '2026-10-31', start: '10:00', category: 'broadcast',
    title: { zh: '會場現場連線', ja: '会場生中継' },
    description: {
      zh: '由ゆいP（おかずクラブ）與にしむらベイベー介紹、體驗活動並訪問參加者。於舞台開演前及節目空檔播出；未公布結束時間，並非連續的固定舞台節目。',
      ja: 'ゆいP（おかずクラブ）とにしむらベイベーによる会場ライブレポート。ステージの開演前や幕間に放送します。終了時刻は未掲載で、連続した固定ステージ枠ではありません。',
    },
    location: { zh: '會場連線（開演前／節目空檔）', ja: '会場中継（開演前・幕間）' },
    source: stageSource + '#stages_day1_day1_live_stream',
  },
  {
    id: 'd2-dev-panel', date: '2026-11-01', start: '10:30', end: '12:00', category: 'stage',
    title: { zh: '開發座談：BGM 幕後故事', ja: '開発パネル' },
    description: {
      zh: '作曲家今村貴文、石川大樹與音效總監祖堅正慶，一同分享 BGM 的製作方法與開發秘話。',
      ja: 'コンポーザーの今村貴文・石川大樹が、サウンドディレクターの祖堅正慶とともに、BGMの作り方から制作中の秘話まで語ります。',
    },
    location: stageLocation, locationId: 'main-stage', source: stageSource + '#stages_day2_dev_panel',
  },
  {
    id: 'd2-live-qa', date: '2026-11-01', start: '12:30', end: '13:30', category: 'stage',
    title: { zh: 'LIVE Q&A 現場問答', ja: 'LIVE Q&A' },
    description: {
      zh: '吉田 P 回答玩家提問。出演：吉田直樹、室內俊夫（室内俊夫）。官方表示將向到場觀眾徵集問題，徵集方法另行公布。',
      ja: '吉田Pが皆さんからの質問に回答。出演：吉田直樹、室内俊夫。来場者を対象に質問を募集予定で、募集方法は後日案内とされています。',
    },
    location: stageLocation, locationId: 'main-stage', source: stageSource + '#stages_day2_live_qa',
  },
  {
    id: 'd2-glamour', date: '2026-11-01', start: '13:50', end: '15:00', category: 'stage',
    title: { zh: '幻化服裝秀', ja: 'ミラプリコレクション' },
    description: {
      zh: '由光之戰士們共同呈現的實體與遊戲內時裝秀。出演：ゆいP（おかずクラブ）、室內俊夫（室内俊夫）。',
      ja: '光の戦士の皆さんと作り上げる、リアル＆ゲームのファッションショー。出演：ゆいP（おかずクラブ）、室内俊夫。',
    },
    location: stageLocation, locationId: 'main-stage', source: stageSource + '#stages_day2_glamour',
  },
  {
    id: 'd2-naokis-room', date: '2026-11-01', start: '15:30', end: '17:30', category: 'stage',
    title: { zh: '直樹的房間', ja: '直樹の部屋' },
    description: {
      zh: '吉田 P 與嘉賓聊天。出演：吉田直樹、室內俊夫（室内俊夫）。嘉賓：濱田龍臣、k4sen、SHAKA、赤見かるび、Clutch_Fi、葛葉、猫麦とろろ、おぼ、うるか、トナカイト、Sasatikk。',
      ja: '吉田Pが豪華ゲストを迎えるトーク。出演：吉田直樹、室内俊夫。ゲスト：濱田龍臣、k4sen、SHAKA、赤見かるび、Clutch_Fi、葛葉、猫麦とろろ、おぼ、うるか、トナカイト、Sasatikk。',
    },
    location: stageLocation, locationId: 'main-stage', source: stageSource + '#stages_day2_naokis_room',
  },
  {
    id: 'd2-primals', date: '2026-11-01', start: '19:00', end: '20:30', category: 'concert',
    title: { zh: 'THE PRIMALS 特別演唱會', ja: 'スペシャルライブ - THE PRIMALS' },
    description: {
      zh: '由音效總監祖堅正慶領軍的 THE PRIMALS 現場演出，嘉賓為 AKINO、伊藤友馬。網路收看需另購付費直播票，不包含於免費直播。',
      ja: '祖堅正慶が率いるTHE PRIMALSのライブ。ゲスト：AKINO、伊藤友馬。オンライン視聴には有料配信チケットが必要で、無料配信の対象外です。',
    },
    location: stageLocation, locationId: 'main-stage', source: stageSource + '#stages_day2_live_band',
  },
  {
    id: 'd2-live-report', date: '2026-11-01', start: '09:30', category: 'broadcast',
    title: { zh: '會場現場連線', ja: '会場生中継' },
    description: {
      zh: '由ゆいP（おかずクラブ）與にしむらベイベー介紹、體驗活動並訪問參加者。於舞台開演前及節目空檔播出；未公布結束時間，並非連續的固定舞台節目。',
      ja: 'ゆいP（おかずクラブ）とにしむらベイベーによる会場ライブレポート。ステージの開演前や幕間に放送します。終了時刻は未掲載で、連続した固定ステージ枠ではありません。',
    },
    location: { zh: '會場連線（開演前／節目空檔）', ja: '会場中継（開演前・幕間）' },
    source: stageSource + '#stages_day2_day2_live_stream',
  },
];

export const stageGuidance = [
  {
    id: 'stage-seating',
    title: { zh: '舞台座位與觀賞規定', ja: 'ステージ観覧について' },
    description: {
      zh: '座位區全部為自由席，節目之間不清場。鋼琴音樂會與特別演唱會期間仍保留座椅；只有特別演唱會可在座位原地站立。不可走入通道或向舞台前方推進，也不可用行李佔位。請勿使用摺疊椅；輪椅使用者可請工作人員引導至專用空間。',
      ja: '着席エリアは全席自由席で、プログラムごとの入れ替えはありません。音楽ステージでも座席は撤去されません。スペシャルライブに限り、その場で立って観覧できますが、通路への移動や前方へ詰め寄る行為は控えてください。荷物での席取り・折りたたみ椅子の利用はご遠慮ください。車いすの方はスタッフが専用スペースへ案内します。',
    },
    source: stageSource + '#viewing_guidelines',
  },
  {
    id: 'stage-streaming',
    title: { zh: '直播與音樂節目', ja: 'ストリーミング・音楽ステージ' },
    description: {
      zh: '一般舞台節目提供免費直播；鋼琴音樂會及 THE PRIMALS 演唱會為付費網路直播。兩日直播票 4,950 日圓（含稅），另收系統費 660 日圓（含稅）。售票至 11 月 21 日 23:59 左右；各場回放預定於翌日 18:00 開放，至 11 月 22 日 23:59 左右。',
      ja: '通常のステージは無料配信。ピアノコンサートとスペシャルライブは有料配信です。両日視聴チケット4,950円（税込）、別途システム利用料660円（税込）。販売は11月21日23:59頃まで。アーカイブは各公演翌日18:00から11月22日23:59頃まで（開始時刻は変更の場合あり）。',
    },
    source: stageSource + '#streaming',
  },
  {
    id: 'stage-recording',
    title: { zh: '拍攝、錄影與錄音', ja: '写真・動画撮影・録音' },
    description: {
      zh: '官方說明會場部分區域或內容設有拍照、錄影與錄音限制，請依現場工作人員指示。舞台內容與時間也可能變更。',
      ja: '会場内の写真・動画撮影・録音には一部制限があります。現場スタッフの指示に従ってください。プログラムの内容・時間は変更される可能性があります。',
    },
    source: aboutSource,
  },
];
