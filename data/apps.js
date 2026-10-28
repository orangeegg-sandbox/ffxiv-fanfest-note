// Official activity requirements checked on 2026-10-28. Optional tools are editorial suggestions.
const text = (zh, ja) => ({ zh, ja });
const link = (zh, ja, url) => ({ label: text(zh, ja), url });

export const appGuide = {
  verifiedAt: '2026-10-28',
  intro: text(
    '先完成安裝、登入與票券確認。SQUARE ENIX App 用於入場；其他必備項目只適用於下列活動。下載及外部服務需要網路，本站離線快取不包含這些 App。',
    '来場前にインストール・ログイン・チケット表示を確認しましょう。スクウェア・エニックス アプリは入場用、その他の必須項目は対象の体験に参加する場合のみ必要です。ダウンロードや外部サービスには通信が必要です。このガイドのオフライン保存に各アプリは含まれません。'
  ),
  required: [
    {
      id: 'square-enix-app',
      title: text('SQUARE ENIX App', 'スクウェア・エニックス アプリ'),
      scope: text('入場・電子票券・已中選的預約', '入場・電子チケット・当選済みの予約'),
      purpose: text('顯示本人入場電子票券與活動預約票。同行者也需先接收分配的票券。', '本人の入場用電子チケットとコンテンツ予約チケットを表示します。同行者へのチケット分配も入場前に済ませてください。'),
      steps: [
        text('安裝並登入購票／接收分票時使用的帳號。', '購入・分配で使用したアカウントでログイン。'),
        text('打開 App 的票券頁，確認自己的入場券與中選預約。', 'アプリのチケット画面で、自分の入場券と当選した予約を確認。'),
        text('有設定一次性密碼的人，攜帶原本使用的驗證 App 或安全權杖。', 'ワンタイムパスワード利用者は、設定済みの認証アプリまたはセキュリティトークンも携帯。')
      ],
      notes: [
        text('官方限定日本 App Store／Google Play 下載。海外使用者請出發前確認能否安裝及顯示票券；無法使用時洽官方支援。', '公式案内では日本国内の App Store／Google Play からのみダウンロード可能。海外からの参加者は渡航前にインストール・チケット表示を確認し、利用できない場合は公式サポートへ。'),
        text('必須顯示 App 內的電子票券；截圖及列印皆無效。此 App 與 FFXIV Companion 不同。', 'アプリ内の電子チケットを提示してください。スクリーンショット・印刷は無効です。FFXIV コンパニオンとは別のアプリです。')
      ],
      links: [
        link('iPhone／App Store', 'iPhone／App Store', 'https://itunes.apple.com/jp/app/id1358622983?mt=8'),
        link('Android／Google Play', 'Android／Google Play', 'https://play.google.com/store/apps/details?id=com.square_enix.android_googleplay.PortalAppjp'),
        link('官方使用說明', '公式アプリ案内', 'https://www.jp.square-enix.com/sqexapp/')
      ],
      source: 'https://fanfest.finalfantasyxiv.com/2026/jp/tickets/',
      activityIds: []
    },
    {
      id: 'instax-print',
      title: text('instax mini Link 或 instax Link WIDE', 'instax mini Link または instax Link WIDE'),
      scope: text('僅列印遊戲截圖時必備 · 1–3 號廳 #10', 'スクリーンショットのプリント時に必要 · 1–3 ホール #10'),
      purpose: text('把已存入手機的遊戲截圖列印為 instax 相片。官方要求安裝 mini Link 或 Link WIDE 專用 App。', 'スマートフォンに保存したスクリーンショットをチェキプリントにします。公式案内では mini Link または Link WIDE の専用アプリが必要です。'),
      steps: [
        text('先把要列印的截圖存入手機相簿。', 'プリントしたい画像をスマートフォンに保存。'),
        text('從 FUJIFILM 官方頁下載對應 App，並確認可以選取照片。', 'FUJIFILM の公式ページから対象アプリをダウンロードし、写真を選べるか確認。')
      ],
      notes: [
        text('此要求適用於截圖列印，並非全體入場者必須安裝。現場備用數量用完即結束。', 'この条件はスクリーンショットのプリント用です。全来場者への必須条件ではありません。準備数量がなくなり次第終了します。')
      ],
      links: [
        link('mini Link 官方下載頁', 'mini Link 公式ダウンロード', 'https://instax.jp/mini_link_3/#app'),
        link('Link WIDE 官方下載頁', 'Link WIDE 公式ダウンロード', 'https://instax.jp/link_wide_2/')
      ],
      source: 'https://fanfest.finalfantasyxiv.com/2026/jp/floors/',
      activityIds: ['activity-instax']
    },
    {
      id: 'mystery-line-x',
      title: text('LINE ＋ X', 'LINE ＋ X'),
      scope: text('AEON 實境解謎必備 · #39', 'イオンモールのリアル謎解きに必要 · #39'),
      purpose: text('參加「臨終留言，留待夢醒之後」（ダイイングメッセージは夢のあとで）需要可使用 LINE、X，並能讀取 QR code 的智慧型手機。', '「ダイイングメッセージは夢のあとで」には、LINE・X を使用でき、二次元バーコードを読み取れるスマートフォンが必要です。'),
      steps: [
        text('事先安裝 LINE 與 X，確認在自己的手機上可以使用。', 'LINE と X を事前にインストールし、自分の端末で利用できるか確認。'),
        text('測試手機相機的 QR code 讀取功能，並準備可用的行動網路。', 'カメラなどで二次元バーコードを読めるか確認し、利用できる通信環境を準備。')
      ],
      notes: [
        text('不需另外安裝來路不明的 QR code App；手機內建功能可讀取即可。活動本身不需 FanFest 門票。', '端末の標準機能で読み取れれば、別の二次元バーコード用アプリは不要です。この体験にはファンフェスのチケットは不要です。')
      ],
      links: [
        link('LINE 官方下載頁', 'LINE 公式ダウンロード', 'https://www.line.me/ja/'),
        link('X 官方下載頁', 'X 公式ダウンロード', 'https://help.x.com/ja/using-x/download-the-x-app')
      ],
      source: 'https://fanfest.finalfantasyxiv.com/2026/jp/floors/',
      activityIds: ['activity-real-mystery']
    }
  ],
  optional: [
    {
      id: 'google-maps',
      title: text('Google 地圖', 'Google マップ'),
      scope: text('選用 · 交通與步行找路', '任意 · 交通・徒歩ルートの確認'),
      purpose: text('儲存幕張メッセ、飯店與機場航廈的位置；離場前再查即時路線。這是本指南的準備建議，並非活動要求。', '幕張メッセ・宿泊先・空港ターミナルを保存し、出発前に経路を再確認。ガイドからの準備提案で、イベントの必須アプリではありません。'),
      steps: [text('儲存目的地與集合點，與朋友確認相同出口。', '目的地と集合場所を保存し、友人と同じ出口を確認。')],
      notes: [text('即時班次、延誤與路線查詢需要網路，仍以運輸業者公告為準。', '最新の時刻・遅延・経路検索には通信が必要です。交通事業者の案内を優先してください。')],
      links: [
        link('iPhone／App Store', 'iPhone／App Store', 'https://itunes.apple.com/us/app/google-maps/id585027354'),
        link('Android／Google Play', 'Android／Google Play', 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps')
      ],
      source: 'https://www.google.com/maps/about/',
      activityIds: []
    },
    {
      id: 'google-translate',
      title: text('Google 翻譯', 'Google 翻訳'),
      scope: text('選用 · 現場日文與餐牌', '任意 · 現地の案内・メニューの翻訳'),
      purpose: text('協助閱讀現場新增公告、餐牌或溝通。翻譯可能有誤，入場與預約規則以官方日文為準。', '追加の掲示やメニューの確認、会話の補助に。翻訳には誤りがあり得るため、入場・予約条件は公式の日本語案内を優先してください。'),
      steps: [text('出發前下載需要的離線語言，並測試實際可用功能。', '出発前に必要なオフライン言語をダウンロードし、利用できる機能を確認。')],
      notes: [text('功能及離線語言支援依裝置與 App 版本而異。', '機能・オフライン言語の対応は端末やアプリのバージョンにより異なります。')],
      links: [
        link('iPhone／App Store', 'iPhone／App Store', 'https://itunes.apple.com/us/app/apple-store/id414706506'),
        link('Android／Google Play', 'Android／Google Play', 'https://play.google.com/store/apps/details?id=com.google.android.apps.translate')
      ],
      source: 'https://translate.google.com/about/',
      activityIds: []
    }
  ],
  browserTools: [
    {
      id: 'qo-kun',
      title: text('QOくん · 商品購買清單', 'QOくん · グッズ購入リスト'),
      scope: text('周邊商品區 #35 · 瀏覽器使用', 'グッズ販売 #35 · ブラウザーで利用'),
      purpose: text('官方請購買商品的訪客預先列出想買的商品，並在販售區出示 QOくん 產生的 QR code。這是網頁工具，不需安裝 App。', '公式案内では、希望商品を事前にリスト化し、QOくん で発行した QR コードを売り場で提示します。Web ツールなのでアプリのインストールは不要です。'),
      steps: [text('開啟活動專用頁，建立清單並準備 QR code。', 'イベント専用ページを開き、リストと QR コードを準備。')],
      notes: [text('購買清單不等於庫存保留或購買保證；商品供應以現場為準。', 'リストは商品の取り置き・購入保証ではありません。販売状況は現地で確認してください。')],
      links: [link('開啟 QOくん', 'QOくん を開く', 'https://qo-kun.com/fanfest-finalfantasy14')],
      source: 'https://fanfest.finalfantasyxiv.com/2026/jp/floors/',
      activityIds: ['goods-store']
    }
  ]
};
