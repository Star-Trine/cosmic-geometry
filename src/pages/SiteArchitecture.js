import './SiteArchitecture.css';

const architectureSections = [
  {
    title: 'Current Architecture',
    description:
      '現在のサイトは、ReactによるSingle Page Applicationを中心に構成されています。共通のVisual Layerと各ページを組み合わせ、一つの世界観を保ちながらコンテンツを切り替えています。',
  },
  {
    title: 'Page and Content Structure',
    description:
      'Worksは作品を選ぶ場所、Conceptsは思想や背景を読む場所、TechNotesは実装方法を知る場所として、それぞれの役割を分けています。',
  },
  {
    title: 'Shared Visual Shell',
    description:
      'Header、StarCanvas、main-content、固定Navbarが全ページ共通の外枠をつくり、その内側に各ページ固有の内容を表示します。',
  },
  {
    title: 'Routing',
    description:
      'App.jsにReact RouterのRouteをまとめ、一覧ページ、作品、Concept、TechNoteなどのページ遷移を管理しています。',
  },
  {
    title: 'Shared Components',
    description:
      'Header、Navbar、StarCanvasをサイト全体で共有し、作品内では必要に応じて描画や操作のための部品を再利用しています。',
  },
  {
    title: 'Responsive Design',
    description:
      '共通breakpointと固定Navbarの回避領域を基礎にしながら、共通レイアウトと作品固有の操作体験を分けて調整しています。',
  },
  {
    title: 'Rendering and Interaction Technologies',
    description:
      'SVG、Canvas 2D、Three.js、React Three Fiber、GSAP、KaTeX、TypeScriptなどを、表現や操作の目的に応じて使い分けています。',
  },
  {
    title: 'Build and Version Control',
    description:
      'npmによる開発・本番buildとGitによる履歴管理を行っています。GitHubとVercelを利用する公開フローの詳細は、今後この章で整理します。',
  },
  {
    title: 'Backend Status',
    status: 'Experimental',
    description:
      'Node.jsとTypeScriptによるbackendは現在試作段階です。Frontendとは接続されておらず、現行サイトの動作には使用していません。',
  },
  {
    title: 'Planned / Future Architecture',
    status: 'Planned',
    description:
      'API、Database、Authenticationなどは将来の構想です。採用技術や接続方法を含め、現時点では未実装です。',
  },
  {
    title: 'Design & Development Records',
    description:
      'docs、Markdown設計資料、Concept参考資料、SVG原稿、screenshots、設計仕様書などを、制作過程を振り返るための記録として整理しています。',
  },
];

export default function SiteArchitecture() {
  return (
    <main className="site-architecture">
      <header className="site-architecture-hero">
        <p className="site-architecture-eyebrow">Structure of Cosmic Geometry</p>
        <h1>Site Architecture</h1>
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
          </section>
        ))}
      </div>
    </main>
  );
}
