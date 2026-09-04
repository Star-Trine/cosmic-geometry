import { Link } from 'react-router-dom';
import './SiteArchitecture.css';

const architectureSections = [
  {
    title: 'Current Architecture(現在の構成)',
    description:
      '現在のサイトは、ReactによるSingle Page Applicationを中心に構成されています。共通のVisual Layerと各ページを組み合わせ、一つの世界観を保ちながらコンテンツを切り替えています。',
  },
  {
    title: 'Page and Content Structure(ページとコンテンツ構成)',
    description:
      'Worksは作品を選ぶ場所、Conceptsは思想や背景を読む場所、TechNotesは実装方法を知る場所として、それぞれの役割を分けています。',
  },
  {
    title: 'Shared Visual Shell(共通ビジュアル構成)',
    description:
      'Header、StarCanvas、main-content、固定Navbarが全ページ共通の外枠をつくり、その内側に各ページ固有の内容を表示します。',
  },
  {
    title: 'Routing',
    description:
      'App.jsにReact RouterのRouteをまとめ、一覧ページ、作品、Concept、TechNoteなどのページ遷移を管理しています。',
  },
  {
    title: 'Shared Components(共通コンポーネント)',
    description:
      'Header、Navbar、StarCanvasをサイト全体で共有し、作品内では必要に応じて描画や操作のための部品を再利用しています。',
  },
  {
    title: 'Responsive Design',
    description:
      '共通breakpointと固定Navbarの回避領域を基礎にしながら、共通レイアウトと作品固有の操作体験を分けて調整しています。',
  },
  {
    title: 'Rendering and Interaction Technologies(描画・インタラクション技術)',
    description:
      'SVG、Canvas 2D、Three.js、React Three Fiber、GSAP、KaTeX、TypeScriptなどを、表現や操作の目的に応じて使い分けています。',
  },
  {
  title: 'Build and Version Control（ビルド・バージョン管理）',
  description:
    'npmによる開発・本番buildを行い、Gitで変更履歴を管理しています。ソースコードはGitHubで管理し、mainブランチへの反映後はVercelと連携してProduction環境へデプロイします。これにより、開発・履歴管理・公開までを一連のフローとして運用しています。',
  },
  {
  title: 'Backend & API Architecture（バックエンド・API構成）',
  status: 'Current',
  description:
    'Contact Form、Horoscope、Locationなどの機能では、Vercel FunctionsをAPI境界として利用しています。Horoscopeでは、Frontendから送信された入力をVercel Functionで受け取り、Node.js / TypeScriptによるBackend Serviceへ渡します。Backend側ではValidation、External APIとの通信、Normalization、Calculationなどを担当し、Frontendが表示に利用できるデータへ整形して返します。',
  },
  {
  title: 'Application Responsibility（アプリケーションの責務分離）',
  description:
    'FrontendはUI、入力、表示、インタラクションを担当し、Vercel FunctionsはHTTP/API境界として機能します。Backend Serviceは検証・正規化・計算・外部サービスとの接続を担当します。作品固有の計算やVisual Data生成も、可能な範囲でRenderingから分離しています。',
  },
  {
  title: 'Planned / Future Architecture（将来の構成）',
  status: 'Planned',
  description:
    '次の拡張候補として、PostgreSQLを利用したDatabase層の導入を検討しています。Frontend、API、Backendに加えてデータの永続化まで扱うことで、より広いアプリケーション構成へ発展させます。AuthenticationやCloud Infrastructureなどについては、今後の作品や機能で必要性が生じた段階で導入を検討します。',
  },
  {
    title: 'Design & Development Records(設計・開発記録)',
    description:
      'docs、Markdown設計資料、Concept参考資料、SVG原稿、screenshots、設計仕様書などを、制作過程を振り返るための記録として整理しています。',
  },
  {
    title: 'Site Operations & Privacy(サイト運用・プライバシー)',
    description:
      'Vercel AnalyticsとSpeed Insightsを利用して、アクセス状況やWebパフォーマンスを確認しています。また、Contact Formでは回答に必要な情報を扱い、入力検証やSpam対策を行っています。各サービスによるデータの取り扱いなど、詳細はPrivacy Policyに記載しています。',
    privacyLink: true,
  },
];

export default function SiteArchitecture() {
  return (
    <main className="site-architecture">
      <header className="site-architecture-hero">
        <p className="site-architecture-eyebrow">Structure of Cosmic Geometry</p>
        <h1>Site Architecture (サイト構成)</h1>
        <p className="site-architecture-intro">
          このページでは、Cosmic Geometry全体の実装・技術・構造を整理します。
          ページへの導線を示すSitemap、作品の意味を扱うConcept、作品固有の実装を扱うTechNoteとは役割を分けています。
        </p>
      </header>

      <div className="site-architecture-sections">
        {architectureSections.map((section, index) => (
          <section className="site-architecture-section" key={section.title}>
            <div className="site-architecture-section-heading">
              <span className="site-architecture-section-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h2>{section.title}</h2>
                {section.status && (
                  <span className="site-architecture-status">
                    {section.status}
                  </span>
                )}
              </div>
            </div>
            <p>{section.description}</p>
            {section.privacyLink && (
              <Link className="site-architecture-link" to="/privacy-policy">
                プライバシーポリシーを見る
              </Link>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
