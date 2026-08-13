import './PrivacyPolicy.css';

const policySections = [
  {
    title: '取得する情報',
    content:
      'Contact Formでは、氏名、メールアドレス、問い合わせCategory、問い合わせ本文を取得します。また、不正送信やSpam対策のため、IPアドレス等の通信情報を処理します。',
  },
  {
    title: '利用目的',
    content:
      '取得した情報は、お問い合わせへの回答・対応、採用・仕事に関する連絡への対応、作品・技術に関する問い合わせへの対応、不正送信・Spam・大量送信等の防止に利用します。',
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
    title: '保存について',
    content:
      '初期構成では、問い合わせ内容をCosmic Geometry独自のDatabaseへ保存しません。ただし、メール配送やHostingに必要な範囲で、利用する外部サービス側において情報が処理・保持される場合があります。',
  },
  {
    title: '第三者提供',
    content:
      '法令に基づく場合を除き、取得した情報を本人の同意なく第三者へ提供しません。メール配送やHostingなど、運用に必要な外部サービスへの処理委託はこの限りではありません。',
  },
  {
    title: '安全管理',
    content:
      '入力値の検証、送信回数の制御、秘密情報の環境変数管理など、取り扱う情報への不正アクセス、漏えい、改ざん等を防ぐために必要な措置を講じます。',
  },
  {
    title: 'アクセス解析',
    content: (
      <>
        今後、アクセス状況の把握・サイト改善を目的として
        <a
          href="https://vercel.com/docs/analytics"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vercel Web Analytics
        </a>
        を導入する場合があります。現時点では未導入です。導入時には、本ポリシーを実際の運用内容に合わせて更新します。
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
        <p className="privacy-policy-eyebrow">Data and Contact Information</p>
        <h1>Privacy Policy</h1>
        <p>
          Cosmic Geometryでは、Contact Formを通じてお預かりする情報を、
          以下の方針に基づいて取り扱います。
        </p>
      </header>

      <div className="privacy-policy-sections">
        {policySections.map((section, index) => (
          <section className="privacy-policy-section" key={section.title}>
            <div className="privacy-policy-heading">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{section.title}</h2>
            </div>
            <p>{section.content}</p>
          </section>
        ))}
      </div>

      <footer className="privacy-policy-dates">
        <p>制定日：2026年8月13日</p>
        <p>最終改定日：2026年8月14日</p>
      </footer>
    </main>
  );
}
