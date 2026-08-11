import '../../styles/TechNoteLayout.css';
import './HoroscopeTechNote.css';

const sections = [
  {
    number: '01',
    title: 'Overview（概要）',
    paragraphs: [
      'Horoscopeは、出生情報から一般的なネイタルチャートを生成し、その構造をCosmic Geometry独自の視覚表現へ変換することを目的とした作品です。',
      'v1では、惑星・サイン・ハウス・主要感受点・アスペクト・逆行などの一般的なホロスコープ情報を扱い、それらをVisualProfileへ変換する構成を検討しています。',
      '通常の占星術解釈文を表示するのではなく、出生図に含まれる構造的特徴を色・光・形・線・動きとして可視化し、直感的に理解できる体験を目指します。',
    ],
  },
  {
    number: '02',
    title: 'Technology Stack（使用技術）',
    paragraphs: [
      'フロントエンドにはReactとTypeScriptを使用し、ネイタルチャートやVisualProfileの描画にはSVGとCSSを使用する予定です。',
      'バックエンドにはNode.jsとTypeScriptを使用し、外部APIとの通信、データの正規化、アスペクト計算、区分集計、VisualProfile生成などを担当させる構成を検討しています。',
      'TypeScriptは、外部APIから取得したデータをPlanetData、HouseData、AnglePoint、AspectDataなどの内部データモデルへ段階的に変換する際に、データ構造と役割を明示する目的で採用しています。',
      '既存のCosmic Geometry作品はJavaScriptのまま維持し、Horoscopeを新規TypeScript作品として開発しています。',
    ],
  },
  {
    number: '03',
    title: 'Component Structure（コンポーネント構成）',
    paragraphs: [
      '画面は、出生情報を入力するBirth Inputと、表示内容を切り替えるメイン表示領域から構成する予定です。',
      'メイン表示では、Chart、Planets、Houses、Angles、Aspects、Visual Profileをボタンで切り替えられる構成を検討しています。',
      '表示切り替えUIはTime Vector Spaceなど他作品でも再利用できる共通コンポーネントとして設計することも検討しています。',
      'ネイタルチャート本体、惑星表、ハウス表、感受点表、アスペクト表、VisualProfileは、それぞれ責務を分離したコンポーネントとして実装する予定です。',
    ],
  },
  {
    number: '04',
    title: 'Data Flow（データフロー）',
    paragraphs: [
      '基本的なデータフローは、Birth Input → React → Node.js API → External Astrology API → Node.jsによる変換・計算 → Reactによる可視化、という構成を想定しています。',
      '外部APIから取得したデータをそのままフロントエンドへ渡すのではなく、Node.js側でCosmic Geometry独自の安定したデータモデルへ変換します。',
      'フロントエンドでは、PlanetData、HouseData、AnglePoint、AspectDataなどの共通データから、円形チャートと各種データ表を描画します。',
      'VisualProfileは、一般的なホロスコープデータをさらに解析し、視覚表現用の特徴量へ変換したCosmic Geometry独自のデータレイヤーとして扱います。',
    ],
  },
  {
    number: '05',
    title: 'Rendering and Calculation（描画・計算の仕組み）',
    paragraphs: [
      'ネイタルチャートは一般的なホロスコープの構造を基礎とし、ASCを左側に固定した円形レイアウトを採用する予定です。',
      '10天体、12サイン、Placidus方式の12ハウス、ASC・MC・DSC・IC、主要5アスペクトを表示対象とします。',
      '主要アスペクトはConjunction、Sextile、Square、Trine、Oppositionの5種類とし、v1ではすべて一律±5度のorbで判定します。',
      'アスペクトは外部APIの判定結果に依存せず、惑星間の角距離からNode.js側で計算します。実際のorb値は、線の太さ・透明度・発光などの視覚強度へ利用する予定です。',
      '逆行情報もPlanetDataに保持し、通常とは異なる動きや反転表現へ利用することを検討しています。',
    ],
  },
  {
    number: '06',
    title: 'Interaction Design（インタラクション設計）',
    paragraphs: [
      'ユーザーは出生年月日、出生時刻、出生場所を入力し、ネイタルチャートを生成します。',
      '生成後はChart、Planets、Houses、Angles、Aspects、Visual Profileの各表示モードを切り替えながら、出生図を異なる視点から観察できる構成を予定しています。',
      'チャート構造は一般的なネイタルチャートを維持しつつ、配色、光、線、背景などのデザインはCosmic Geometry全体の世界観に調和させます。',
      '惑星記号やサイン記号にはUnicode記号を第一候補として使用し、フォント、サイズ、発光、背景処理などでCosmic Geometryらしい表現が可能か検討します。',
    ],
  },
  {
    number: '07',
    title: 'Challenges and Solutions（課題と解決方法）',
    paragraphs: [
      '既存のCosmic GeometryはJavaScriptを中心に構築されているため、HoroscopeのみをTypeScriptで新規開発できるよう、JavaScriptとTypeScriptを共存させる構成を導入しました。',
      'フロントエンド側ではtsconfig.jsonを追加し、既存の.jsファイルを維持したまま.tsおよび.tsxファイルを使用できる環境を整えています。',
      '初期実装ではPlanetDataの型定義とmockデータを作成し、TypeScriptによる型チェックを確認しました。スペルミスや型の不一致をコンパイル段階で検出できることも確認しています。',
      '今後は、外部APIの仕様差異、出生場所から緯度経度・タイムゾーンへの変換、SVG円環の配置計算、VisualProfileの数値変換ルールなどが技術的な検討課題になります。',
    ],
  },
  {
    number: '08',
    title: 'AI-assisted Development（AIを活用した開発）',
    paragraphs: [
      '作品コンセプト、技術選定、データモデル、UI構成、VisualProfileの設計についてAIとの対話を通して整理しています。',
      '実装では、TypeScript導入、型定義、コンパイルエラーの確認などを一つずつ検証しながら進めています。',
      'AIが提案した内容をそのまま採用するのではなく、作品の意味や既存プロジェクトへの影響を確認しながら、必要な技術と実装範囲を選択しています。',
    ],
  },
  {
    number: '09',
    title: 'Future Development（今後の拡張）',
    paragraphs: [
      'v1では一般的なネイタルチャートとVisualProfileの2D可視化に集中し、機能を広げすぎない方針です。',
      '将来的な拡張候補として、詳細な占星術鑑定文、AIによる解釈、相性診断、トランジット、プログレス、恒星占星術、3D Celestial Sphere連携などを検討しています。',
      'ユーザーアカウントやチャート保存機能も将来候補ですが、v1では出生情報を永続保存しない設計とします。',
      'VisualProfileでは、2区分をDirection、3区分をMotion / Shape、4区分をColor / Textureの基礎レイヤーとし、その上に惑星、ハウス、アスペクト、逆行の視覚情報を重ねる構成を検討しています。',
    ],
  },
];

export default function HoroscopeTechNote() {
  return (
    <main className="tech-note-page horoscope-tech-note">
      <header className="tech-note-hero">
        <p className="tech-note-eyebrow">TechNote(技術解説)</p>
        <h1>TechNote</h1>
        <p className="tech-note-work-title">Horoscope（ホロスコープ）</p>
          
        <div className="tech-note-intro">
          <p>
          このページでは、Horoscopeの初期設計、技術構成、
          データモデル、可視化の考え方について整理します。
          </p>
          <p>
          内容は実装の進行に合わせて更新します。
          </p>
        </div>
      </header>

      {sections.map((section) => (
        <section key={section.number} className="tech-note-section">
          <div className="tech-note-section-heading">
            <p className="tech-note-section-number">{section.number}</p>
            <h2>{section.title}</h2>
          </div>

          <div className="tech-note-section-text tech-note-card">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}