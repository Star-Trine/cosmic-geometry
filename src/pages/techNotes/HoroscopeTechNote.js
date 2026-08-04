import '../../styles/TechNoteLayout.css';
import './HoroscopeTechNote.css';

const sections = [
  {
    number: '01',
    title: 'Overview（概要）',
    paragraphs: [
      'この作品の技術的な目的と、実装全体の概要を紹介します。',
      '作品のコンセプトを、どのような技術と構成で実現しているかを整理します。',
    ],
  },
  {
    number: '02',
    title: 'Technology Stack（使用技術）',
    paragraphs: [
      'この作品で使用しているライブラリ、フレームワーク、描画技術について紹介します。',
      '各技術を採用した理由についても、今後追記します。',
    ],
  },
  {
    number: '03',
    title: 'Component Structure（コンポーネント構成）',
    paragraphs: [
      '画面を構成する主要なコンポーネントと、それぞれの役割を整理します。',
      'コンポーネント同士の関係や責務について、コードを確認しながら追記します。',
    ],
  },
  {
    number: '04',
    title: 'Data Flow（データフロー）',
    paragraphs: [
      'データがどこで定義され、どのように各コンポーネントへ渡されているかを説明します。',
      '状態管理、プロパティ、イベント処理などの流れも整理します。',
    ],
  },
  {
    number: '05',
    title: 'Rendering and Calculation（描画・計算の仕組み）',
    paragraphs: [
      '画面上の図形、アニメーション、3Dモデル、数値結果がどのように描画・計算されているかを紹介します。',
      '作品固有の数式や座標変換についても、今後詳しく解説します。',
    ],
  },
  {
    number: '06',
    title: 'Interaction Design（インタラクション設計）',
    paragraphs: [
      'ユーザーの操作と画面表示が、どのように連動しているかを整理します。',
      'ボタン、スライダー、カメラ操作、モード切り替えなどの実装を紹介します。',
    ],
  },
  {
    number: '07',
    title: 'Challenges and Solutions（課題と解決方法）',
    paragraphs: [
      '実装中に発生した問題と、その原因、解決方法を記録します。',
      '描画、レイアウト、パフォーマンス、レスポンシブ対応などの課題を順次追加します。',
    ],
  },
  {
    number: '08',
    title: 'AI-assisted Development（AIを活用した開発）',
    paragraphs: [
      '設計、実装、デバッグ、コード整理の各段階で、AIをどのように活用したかを記録します。',
      'AIが生成したコードをどのように確認し、修正し、作品へ取り入れたかも整理します。',
    ],
  },
  {
    number: '09',
    title: 'Future Development（今後の拡張）',
    paragraphs: [
      '今後追加したい機能や、改善を検討している技術的な課題を整理します。',
      '作品単体の拡張だけでなく、他の作品やデータとの接続についても記録します。',
    ],
  },
];

export default function HoroscopeTechNote() {
  return (
    <main className="tech-note-page horoscope-tech-note">
      <header className="tech-note-hero">
        <p className="tech-note-eyebrow">TechNote（技術解説）</p>
        <h1>TechNote</h1>
        <p className="tech-note-work-title">Horoscope（ホロスコープ）</p>
        <div className="tech-note-intro">
          <p>
            このページでは、作品の実装に使用した技術、コンポーネント構成、
            データの流れ、描画や計算の仕組みについて整理します。
          </p>
          <p>
            内容は今後、実際のコードを確認しながら順次更新します。
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

