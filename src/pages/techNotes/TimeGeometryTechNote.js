import '../../styles/TechNoteLayout.css';
import './TimeGeometryTechNote.css';
import { Link } from 'react-router-dom';

const sections = [
  {
    number: '01',
    title: 'Overview（概要）',
    paragraphs: [
      'Time Synchronization Experimentは、3本の時間ベクトル t1・t2・t3 を異なる速度で回転させ、一時的に角度が近づく状態を「同期」として可視化する作品です。',
      '一般的な数学として角度、ラジアン変換、三角関数、円周上の座標計算を使用し、異なる回転速度を持つベクトルを時間軸として扱う部分と、角度差10度以内を同期とみなす条件は、本作品における独自の可視化モデルです。',
    ],
  },
  {
    number: '02',
    title: 'State Management（状態管理）',
    paragraphs: [
      'ReactのuseStateを使い、3本の時間ベクトルの現在角度を angles として保持しています。初期値は t1 = 0度、t2 = 90度、t3 = 180度です。',
      'setAnglesはstateを更新するためにReactから渡される関数です。角度が更新されるとコンポーネントが再レンダリングされ、新しい角度を使ってSVGの位置が再計算されます。',
    ],
  },
  {
    number: '03',
    title: 'Animation Flow（アニメーション）',
    paragraphs: [
      'useEffect内でsetIntervalを開始し、約16ミリ秒ごとにsetAnglesを呼び出しています。',
      '更新時には現在のstateをprevとして受け取り、t1は1度、t2は0.8度、t3は0.5度ずつ加算します。360度を超えた値は % 360 によって0〜359度の範囲へ戻します。',
    ],
  },
  {
    number: '04',
    title: 'Coordinate Calculation（座標計算）',
    paragraphs: [
      'angleToCoords関数では、度数法で保持している角度をラジアンへ変換し、Math.cosとMath.sinを使ってSVG上のx・y座標を計算します。',
      'SVGの中心は (150, 150)、ベクトル長は100です。各時間ベクトルの角度から円周上の終点座標を求め、その値をSVGのline要素へ渡します。',
    ],
  },
  {
    number: '05',
    title: 'Synchronization Logic（同期判定）',
    paragraphs: [
      'isSynchro関数は、2つの角度の差を計算し、その差が10度未満の場合を同期状態と判定します。',
      '358度と2度のように0度と360度の境界をまたぐ場合も近い角度として扱うため、差が350度を超える場合も同期と判定しています。',
      '現在はt1とt2、またはt1とt3が同期した場合に、t1の色をシアンへ変更します。',
    ],
  },
  {
    number: '06',
    title: 'SVG Rendering（SVG描画）',
    paragraphs: [
      '3本のベクトルはSVGのline要素として描画しています。始点はすべて中心座標 (150, 150) で固定し、angleToCoordsで求めた座標を終点 x2・y2 に使用します。',
      'state更新による再レンダリングと座標計算が繰り返されることで、3本の線が異なる速度で回転しているように見えます。',
    ],
  },
  {
    number: '07',
    title: 'CSS and Responsive Design（CSS・レスポンシブ）',
    paragraphs: [
      '作品全体は最大幅680pxのパネルとして構成し、CSS変数で背景、境界線、文字色などを管理しています。',
      'radial-gradientやbackdrop-filterを使ってCosmic Geometry共通の半透明・発光表現を作り、SVGはwidth: min()によって画面幅に応じて縮小します。',
      '600px以下ではボタンを折り返し可能にし、パネルのpadding、タイトルサイズ、SVGサイズを縮小してモバイル表示へ対応しています。',
    ],
  },
  {
    number: '08',
    title: 'AI-assisted Development（AIを活用した開発）',
    paragraphs: [
      '実装ではAIとの対話を活用しながら、Reactのstate管理、時間更新処理、角度からSVG座標への変換、同期判定のロジックを整理しました。',
      'TechNote作成時には実際のJSXとCSSを確認し、コードの処理を自分で理解しながら技術内容を整理しています。',
    ],
  },
  {
    number: '09',
    title: 'Future Development（今後の拡張）',
    paragraphs: [
      '現在は自動再生のみですが、再生・停止、回転速度の変更、同期判定角度の調整、各ベクトルの数値表示などを追加する余地があります。',
      '今後は、時間軸同士の同期関係をより詳しく観察できるインタラクションや可視化方法も検討できます。',
    ],
  },
];

export default function TimeGeometryTechNote() {
  return (
    <main className="tech-note-page time-geometry-tech-note">
      <header className="tech-note-hero">
        <p className="tech-note-eyebrow">TechNote（技術解説）</p>
        <h1>TechNote</h1>
        <p className="tech-note-work-title">
          Time Synchronization Experiment（時間同期実験）
        </p>
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

      <section className="tech-note-section tech-note-interactive">
        <div className="tech-note-section-heading">
          <h2>Interactive Work</h2>
        </div>
        <div className="tech-note-interactive-card">
          <Link to="/works/time-geometry" className="tech-note-interactive-button">
            Interactive Workを開く
          </Link>
        </div>
      </section>
    </main>
  );
}
