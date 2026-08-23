import './PrivacyPolicy.css';

const policySections = [
  {
    title: '取得する情報',
    content:
      'Contact Formでは、氏名、メールアドレス、問い合わせCategory、問い合わせ本文を取得します。Horoscope機能では、出生図の生成に必要な生年月日、出生時刻、都市名、国名、緯度、経度、タイムゾーン等の情報を処理します。また、不正送信やSpam対策、サービス提供のため、IPアドレス等の通信情報を処理する場合があります。',
  },
  {
    title: '利用目的',
    content:
      '取得・入力された情報は、お問い合わせへの回答・対応、採用・仕事に関する連絡への対応、作品・技術に関する問い合わせへの対応、Horoscope等の作品機能の提供、出生図の生成、出生地や観測地点の検索、不正送信・Spam・大量送信等の防止、およびサイトの改善に必要な範囲で利用します。',
  },
  {
    title: 'メール送信',
    content: (
      <>
        Contact Formのメール送信処理には
        <a
          href="https://resend.com/docs/introduction"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resend
        </a>
        を利用します。問い合わせ情報はメール配送に必要な範囲で同サービスにより処理されます。
      </>
    ),
  },
  {
    title: 'Horoscope・位置情報機能',
    content: (
      <>
        Horoscope機能では、出生図の計算に
        <a
          href="https://www.freeastroapi.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          FreeAstroAPI
        </a>
        を利用し、出生日時、都市、緯度・経度、タイムゾーン等の計算に必要な情報を送信します。
        また、都市名・国名から緯度・経度を取得するため
        <a
          href="https://www.geoapify.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Geoapify
        </a>
        を利用しています。
        Geoapifyの位置情報データには
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenStreetMap
        </a>
        のデータが含まれます。
        Location検索では、原則として都市名・国名を対象とし、番地等の詳細な住所を検索対象としていません。
        タイムゾーンの判定にはサーバー内部のgeo-tzライブラリを利用しており、
        この判定処理のために外部サービスへ追加の情報送信は行いません。
      </>
    ),
  },
  {
    title: '保存について',
    content:
      '初期構成では、Contact Formの問い合わせ内容、Horoscopeに入力された出生情報、Location検索情報をCosmic Geometry独自のDatabaseへ恒久的に保存しません。ただし、API処理、メール配送、Hostingその他のサービス提供に必要な範囲で、利用する外部サービス側において情報が一時的に処理・保持される場合があります。',
  },
  {
    title: '第三者提供',
    content:
      '法令に基づく場合を除き、取得した情報を本人の同意なく第三者へ提供しません。メール配送、Hosting、出生図計算、位置情報検索など、サービス提供・運用に必要な外部サービスへの処理委託はこの限りではありません。',
  },
  {
    title: '安全管理',
    content:
      '入力値の検証、送信回数の制御、秘密情報の環境変数管理、外部API Keyの非公開化など、取り扱う情報への不正アクセス、漏えい、改ざん等を防ぐために必要な措置を講じます。',
  },
  {
    title: 'アクセス解析・パフォーマンス計測',
    content: (
      <>
        当サイトでは、サイトの利用状況を把握し、改善することを目的として
        <a
          href="https://vercel.com/docs/analytics"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vercel Web Analytics
        </a>
        を利用しています。Vercel Web AnalyticsはCookieを使用せず、匿名化されたデータを扱います。
        また、表示速度やWebパフォーマンスの把握・改善を目的として
        <a
          href="https://vercel.com/docs/speed-insights/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vercel Speed Insights
        </a>
        を利用しています。Vercel Speed Insightsでは、URL、ブラウザ、端末種別、OS、国、Web Vitals等の匿名のパフォーマンス情報を扱います。
        これらのサービスは、個人を特定したり、ページをまたぐ閲覧セッションを特定したりすることを目的として利用するものではありません。
      </>
    ),
  },
  {
    title: '外部サービスについて',
    content: (
      <>
        当サイトでは、機能提供のためにResend、FreeAstroAPI、Geoapify、OpenStreetMap、Vercel等の外部サービスを利用しています。
        各サービスにおける情報の取扱いについては、それぞれのPrivacy Policyや利用規約をご確認ください。
        外部サービスの仕様、利用条件、保存期間等は各提供者により変更される場合があります。
      </>
    ),
  },
  {
    title: '開示・訂正・削除等',
    content:
      'ご自身の情報に関する開示・訂正・削除等のご希望は、Contact Formからご連絡ください。ご本人であることを確認したうえで、合理的な範囲で対応します。',
  },
  {
    title: 'Privacy Policyの変更',
    content:
      '利用するサービスや運用内容の変更に応じて、本ポリシーを更新する場合があります。重要な変更がある場合は、このページで分かるようにお知らせします。',
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="privacy-policy">
      <header className="privacy-policy-hero">
        <p className="privacy-policy-eyebrow">
          Data and Contact Information
        </p>

        <h1>Privacy Policy</h1>

        <p>
          Cosmic Geometryでは、Contact Formや各作品の機能を通じてお預かりする情報を、
          以下の方針に基づいて取り扱います。
        </p>
      </header>

      <div className="privacy-policy-sections">
        {policySections.map((section, index) => (
          <section
            className="privacy-policy-section"
            key={section.title}
          >
            <div className="privacy-policy-heading">
              <span>
                {String(index + 1).padStart(2, '0')}
              </span>

              <h2>{section.title}</h2>
            </div>

            <p>{section.content}</p>
          </section>
        ))}
      </div>

      <footer className="privacy-policy-dates">
        <p>制定日：2026年8月13日</p>
        <p>最終改定日：2026年8月23日</p>
      </footer>
    </main>
  );
}