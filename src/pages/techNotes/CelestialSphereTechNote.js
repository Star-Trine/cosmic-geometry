import '../../styles/TechNoteLayout.css';
import './CelestialSphereTechNote.css';
import { Link } from 'react-router-dom';

const sections = [
  {
    number: '01', title: 'Overview（概要）', paragraphs: [
      'Celestial Sphereは、地球を中心とする天球をReact Three Fiber上の三次元モデルとして構築し、天の赤道、黄道、子午線、天の極、恒星、アステリズムの位置関係を外側から観察する作品です。Conceptで示した「肉眼では見えない座標体系を点・線・軸・円として可視化する」という方針を、Three.jsの球・円・線分・文字へ置き換えています。',
      '現在のモデルは、静的に保持した恒星の赤経・赤緯を天球半径3の直交座標へ変換し、恒星を球、恒星間の接続を線分として描画します。日時、観測地点、地球の自転による見え方の変化はまだ計算していません。',
      '処理の中心は「恒星データと接続データの読込 → 赤経・赤緯のラジアン変換 → 天球面上の座標生成 → BufferGeometryとメッシュの構築 → Canvas内での描画」という流れです。',
    ],
  },
  {
    number: '02', title: 'Technology Stack（使用技術）', paragraphs: [
      'Reactは作品ページと表示要素の構成、恒星ホバー状態の管理を担当します。StarPointsではuseStateで現在ホバーされている恒星IDを保持し、AsterismLinesとCircleLineではuseMemoを使って変化しないBufferGeometryを再利用しています。',
      '@react-three/fiberのCanvasをThree.js描画の入口とし、mesh、line、lineSegments、group、ambientLight、directionalLightをReactコンポーネントとして組み立てています。Three.js本体はVector3、BufferGeometry、MathUtils、DoubleSideなど、座標・形状・マテリアル設定に使用しています。',
      '@react-three/dreiはOrbitControlsとTextに使用しています。OrbitControlsが視点操作を、Textが天の北極・南極、天の赤道、黄道、およびホバー中の恒星名ラベルを担当します。',
    ],
  },
  {
    number: '03', title: 'Component Structure（コンポーネント構成）', paragraphs: [
      'CelestialSphereは作品ページの入口で、Concept・TechNoteへの導線、Canvas、見出しと説明文を配置します。Canvasの内部には照明、CelestialSphereModel、OrbitControlsを配置し、三次元モデルとカメラ操作をまとめています。',
      'CelestialSphereModelは天球全体の構成役です。半径3の半透明球、天の赤道、黄道、直交する2本の子午線、天の極を結ぶ軸、北極・南極の点とラベルを配置し、StarPoints、AsterismLines、Earthを同じgroupへ統合します。',
      'CircleLineは指定した半径、色、透明度、回転、分割数から円周のBufferGeometryを作る共通部品です。Earthは半径0.45の地球、地球赤道、地軸を一つのgroupとして23.4度傾けます。StarPointsは恒星メッシュとホバーラベル、AsterismLinesはすべての接続線を一つのlineSegmentsとして担当します。',
    ],
  },
  {
    number: '04', title: 'Data Structure and Flow（データ構造と流れ）', paragraphs: [
      'starData.jsには42件の恒星が配列として定義されています。各要素はid、英語名、日本語名、赤経ra、赤緯dec、等級magnitudeを基本フィールドとし、一部はspectralType、color、aliasも持ちます。色がない恒星は描画時に白が使われます。',
      'asterismData.jsは恒星の位置を重複保持せず、アステリズムごとのid・英語名・日本語名と、connectionsの恒星IDペアを管理します。現在は夏の大三角、北斗七星、南斗六星、冬の大三角、冬のダイヤモンド、オリオン座の6グループです。',
      'StarPointsはstarsを順に座標変換して個別メッシュへ渡します。AsterismLinesはconnectionsの開始IDと終了IDをstarsから検索し、両端を座標変換してVector3の列へ追加します。存在しないIDを含む接続は描画せず、その後setFromPointsで単一のBufferGeometryへ変換します。',
    ],
  },
  {
    number: '05', title: 'Coordinate Conversion（座標変換）', paragraphs: [
      'celestialToCartesianは赤経を時間単位、赤緯を度単位で受け取ります。赤経は1時間を15度として raHours × 15 を度へ直し、赤経・赤緯の両方をTHREE.MathUtils.degToRadでラジアンへ変換します。',
      '半径をr、赤経をα、赤緯をδとすると、実装する座標は x = r cosδ cosα、y = r sinδ、z = r cosδ sinα です。赤緯を上下方向のyへ、赤経をxz平面上の回転へ対応させています。',
      '恒星は天球面との重なりを避けるため半径3 × 1.01、アステリズム線は3 × 1.005へ配置します。恒星の球半径は max(0.02, 0.06 − magnitude × 0.01) で決まり、等級値が小さい恒星ほど大きく表示されます。これは表示サイズの簡易対応であり、物理的な恒星半径の再現ではありません。',
    ],
  },
  {
    number: '06', title: 'Rendering Structure（描画構造）', paragraphs: [
      '天球本体はsphereGeometryと透明なmeshBasicMaterialで描画し、両面表示、opacity 0.055、depthWrite無効にしています。座標線はCircleLineが128分割の点列を作り、lineBasicMaterialで描画します。黄道だけは半径をわずかに大きくし、23.4度傾けています。',
      '地球はmeshStandardMaterialを使うため、ambientLightとdirectionalLightの影響を受けます。一方、恒星、座標線、地軸、天の極はmeshBasicMaterialまたはlineBasicMaterialを使い、照明に左右されず色を読み取れる構成です。',
      '恒星をポイント専用プリミティブへまとめず個別のsphereGeometryとしているため、それぞれがポインターイベントを受け取れます。ホバーした恒星だけ日本語名のTextを球の上に追加し、カーソルもpointerへ切り替えます。',
    ],
  },
  {
    number: '07', title: 'Interaction and Camera（操作とカメラ）', paragraphs: [
      'カメラは位置 [6.5, 4.5, 6.5]、視野角45度で開始し、天球を斜め上の外側から見ます。OrbitControlsによりドラッグで視点を回転し、ズームで内部へ近づいたり全体を引いて観察したりできます。',
      'パン操作は無効で、注視対象が天球中心からずれないようにしています。dampingFactorは0.06、カメラ距離は1.2から16に制限されています。モデル自体を時間で回転させるアニメーションはなく、視点操作と恒星ホバーが現在のインタラクションです。',
      'CSSではCanvas領域を高さ min(70vh, 680px) とし、作品全体を最大1000pxに制限します。560px以下では外側幅、角丸、導線の折り返しを調整しています。',
    ],
  },
  {
    number: '08', title: 'Implementation Characteristics（実装上の特徴）', paragraphs: [
      '恒星の位置データとアステリズムの接続データを分離しているため、同じ恒星を複数の星群で共有できます。座標変換もStarPointsとAsterismLinesで同じ関数を使い、点と線の位置基準を一致させています。',
      '円周形状と接続線形状はuseMemoで保持されます。静的モデルなので毎フレーム座標を更新する処理はなく、Canvasの再描画負荷は主にカメラ操作時に発生します。',
      '現在の恒星データは作品内の静的配列であり、網羅的な星表ではありません。観測地点に応じた地平座標、日時による恒星時、歳差、章動、大気差などの天文計算も現時点の対象外です。',
    ],
  },
  {
    number: '09', title: 'Future Development（今後の拡張）', paragraphs: [
      'Conceptで示されている日時と観測地点の導入、地球の自転に応じた見え方の変化、外部天体データAPIとの連携は将来構想であり、現在のコードには実装されていません。実装する場合は、現在の静的な赤経・赤緯データと、時刻・位置によって変化する表示座標の責務を分ける必要があります。',
      '現在は恒星名のみホバー表示され、アステリズム名の表示切替や個別選択はありません。表示レイヤーのオン・オフ、恒星・星群の検索、内側からの観測視点なども、現在の点・線・group構造から考えられる拡張候補です。',
    ],
  },
];

export default function CelestialSphereTechNote() {
  return (
    <main className="tech-note-page celestial-sphere-tech-note">
      <header className="tech-note-hero">
        <p className="tech-note-eyebrow">TechNote（技術解説）</p><h1>TechNote</h1>
        <p className="tech-note-work-title">Celestial Sphere（天球）</p>
        <div className="tech-note-intro">
          <p>赤経・赤緯の静的データが天球上の三次元座標へ変換され、恒星、星群、座標線として描画される流れを整理します。</p>
          <p>Conceptで示した不可視の天球座標を、現在のReact Three Fiber実装がどのように点・線・軸・円へ置き換えているかを解説します。</p>
        </div>
      </header>
      {sections.map((section) => (
        <section key={section.number} className="tech-note-section">
          <div className="tech-note-section-heading"><p className="tech-note-section-number">{section.number}</p><h2>{section.title}</h2></div>
          <div className="tech-note-section-text tech-note-card">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>
      ))}
      <section className="tech-note-section tech-note-interactive">
        <div className="tech-note-section-heading"><h2>Interactive Work</h2></div>
        <div className="tech-note-interactive-card"><Link to="/works/celestial-sphere" className="tech-note-interactive-button">Interactive Workを開く</Link></div>
      </section>
    </main>
  );
}
