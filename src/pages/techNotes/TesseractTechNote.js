import '../../styles/TechNoteLayout.css';
import './TesseractTechNote.css';
import { Link } from 'react-router-dom';

const sections = [
  {
    number: '01',
    title: 'Overview（概要）',
    paragraphs: [
      'Tesseractは、直接見ることのできない4次元超立方体を、3次元空間への投影として観察するインタラクティブ作品です。Conceptで示している「見えない次元を投影して見る」という考えを、4次元座標の生成・回転・透視投影という処理へ置き換えています。',
      '画面では、点から線、正方形、立方体、テッセラクトへと次元が増える過程を時間に沿って再生します。完成段階では4次元空間内の粒子群も表示し、輪郭だけでなく、回転によって投影密度が変化する様子を可視化します。',
      '処理の中心は「4D頂点 → 軸方向への展開 → XW・YW・ZW回転 → 3D透視投影 → Three.js用座標 → 頂点・辺・粒子の描画」という流れです。',
    ],
  },
  {
    number: '02',
    title: 'Technology Stack（使用技術）',
    paragraphs: [
      'Reactはページ全体の構成、現在の生成段階を示すラベル、粒子表示の切り替えを担当します。useStateで段階名と粒子の表示状態を保持し、useMemoで変化しない頂点・辺・TypedArrayを再利用し、useRefでThree.jsのオブジェクトやBufferAttributeを直接参照しています。',
      '@react-three/fiberはReactのコンポーネントとしてThree.jsのCanvas、points、lineSegments、bufferGeometry、materialを組み立てるために使用しています。毎フレームの計算はuseFrameでCanvasの描画ループへ接続されています。',
      '@react-three/dreiのOrbitControlsにより、ドラッグによる視点回転とズームを追加しています。粒子の色生成、HSL変換、加算合成にはThree.js本体のMathUtils、Color、AdditiveBlendingを使用しています。',
    ],
  },
  {
    number: '03',
    title: 'Component Structure（コンポーネント構成）',
    paragraphs: [
      'Tesseractコンポーネントは作品ページの入口です。見出し、Conceptへの導線、React Three FiberのCanvas、次元ごとの構造情報を配置し、DimensionModelから受け取った段階名を画面へ表示します。',
      '同じファイル内のDimensionModelが、16頂点と32辺からなる輪郭の生成、次元を段階的に広げる計算、4次元回転、3次元投影、BufferGeometryの更新を担当します。数学処理と輪郭描画を一か所で追える構成です。',
      'TesseractDensityParticlesは別コンポーネントに分離されています。4次元粒子の初期配置と色を一度生成し、表示中は各粒子へ輪郭と同じ種類の回転・投影を適用します。輪郭と密度表現を分けることで、それぞれ異なる頂点数やマテリアル設定を持てるようになっています。',
    ],
  },
  {
    number: '04',
    title: 'Data Flow（データフロー）',
    paragraphs: [
      'createVertices4Dは0から15までの整数の4ビットを利用し、各ビットをx・y・z・wの符号へ対応させます。各成分が-1または1となる全組み合わせから、テッセラクトの16頂点 [x, y, z, w] を生成します。',
      'createEdgesは16頂点のすべての組を比較し、4成分のうち1成分だけが異なる組を辺として保存します。これにより、1本の座標軸方向だけで隣接する頂点が結ばれ、32本の辺が生成されます。',
      '描画ループでは、各頂点に現在の次元段階を表すaxisScalesを掛け、回転と投影を順番に適用します。投影後の3成分はFloat32Arrayへ書き込まれ、頂点用BufferAttributeと辺用BufferAttributeへ渡されます。辺の配列は頂点番号の組なので、投影済み頂点から始点と終点を取り出してlineSegments用の座標列を構築します。',
      '段階名はDimensionModelからonStageChangeを通じて親へ通知されます。親はstageLabelを更新し、最終段階「4次元テッセラクトの3次元投影」の間だけdensityActiveをtrueにして粒子コンポーネントを表示します。',
    ],
  },
  {
    number: '05',
    title: 'Rendering and Calculation（描画・計算の仕組み）',
    paragraphs: [
      '4次元の回転は、一度に2本の座標軸が作る平面を選び、その2成分へ2次元回転と同じcos・sinの式を適用します。例えばXW回転では x′ = x cosθ − w sinθ、w′ = x sinθ + w cosθ とし、yとzは変更しません。YW回転とZW回転も同じ考え方で、それぞれyとw、zとwを更新します。',
      'Conceptでは4次元空間の回転平面としてXY・XZ・YZ・XW・YW・ZWの6種類を説明していますが、現在の作品コードで連続適用しているのはXW・YW・ZWです。角度は経過時間に0.8、0.5、0.35を掛けて作り、異なる速度で第4軸を含む回転を重ねています。',
      '回転後の [x, y, z, w] は透視投影 scale = d / (d − w) によって3次元へ変換されます。dは投影距離で、輪郭と表示時の粒子では4です。最終座標は [x × scale, y × scale, z × scale] となり、wが投影位置へ近づくほど大きく、遠ざかるほど小さく見えます。これはConceptにある「4次元図形そのものではなく、3次元へ落とした影を見る」という表現を担う処理です。',
      '次元生成ではx、y、z、wのaxisScalesを順番に0から1へ変化させます。各段階は3秒の展開と1.5秒の保持で構成され、smoothstepで開始と終了を滑らかにしています。4軸目まで展開した後は完成状態を4秒間表示し、サイクルを繰り返します。',
      '投影済みの16頂点はpointsとpointsMaterial、32辺はlineSegmentsとlineBasicMaterialで描画されます。これらは照明計算を必要としないマテリアルであり、形状の構造を一定の色と明るさで読み取れる構成です。Canvasのカメラは位置 [0, 0, 5.5]、視野角45度で設定されています。',
      '粒子は標準で作品側から5,000個を渡し、4次元超立方体の内部と外側寄りの領域を混ぜた分布として生成します。各粒子の4次元位置から色相を決め、投影後は頂点カラー、半透明、加算合成、depthWrite無効のpointsMaterialで密度の重なりを光として表現しています。',
    ],
  },
  {
    number: '06',
    title: 'Interaction Design（インタラクション設計）',
    paragraphs: [
      '図形の次元生成と4次元回転は時間に基づいて自動進行します。ユーザーが回転角を直接変更するスライダーはなく、操作はOrbitControlsによる視点の回転とズームに絞られています。自動で変化する数学モデルを、任意の3次元方向から観察する設計です。',
      'OrbitControlsでは慣性を感じるdampingを有効にし、カメラ距離を3から9の範囲へ制限しています。図形へ近づきすぎたり遠ざかりすぎたりすることを防ぎながら、内側と外側が入れ替わるように見える投影の変化を追えます。',
      '画面左上の段階ラベルは、現在どの軸を展開しているかをReact stateへ反映したものです。Reactのstate更新は毎フレームではなく、段階名が変わったときだけ行い、連続する座標更新はThree.jsのBufferAttribute側で処理しています。',
    ],
  },
  {
    number: '07',
    title: 'Challenges and Solutions（課題と解決方法）',
    paragraphs: [
      '既存コードから確認できる対策として、変化しない4次元頂点、辺、描画用TypedArray、粒子の初期位置と色はuseMemoで保持されています。毎フレーム新しいBufferGeometryを作るのではなく、同じFloat32Arrayを書き換えてBufferAttributeのneedsUpdateをtrueにすることで、GPUへ更新を通知しています。',
      '粒子側の投影関数では、d − wが0に極端に近い場合に分母を±0.001へ補正し、ゼロ除算と過度な拡大を避けています。また、粒子が4次元回転中も確実に描画対象となるよう、pointsではfrustumCulledをfalseにしています。',
      '一方、制作時に発生した具体的な不具合や修正の時系列は、現在のコメントとコードだけからは確認できません。そのため、ここでは実装上確認できる対策のみを記載し、推測による改善履歴は加えていません。',
    ],
  },
 {
  number: '08',
  title: 'AI-assisted Development（AIを活用した開発）',
  paragraphs: [
    'Tesseractの制作では、4次元回転や3次元投影の考え方を整理する際にAIとの対話を活用しました。数式やReact Three Fiberでの実装方法について提案を受けながら、実際の描画結果を確認し、作品のConceptに合うよう調整を重ねています。',
  ],
  },
  {
    number: '09',
    title: 'Future Development（今後の拡張）',
    paragraphs: [
      '現在の実装はXW・YW・ZW平面の自動回転に焦点を当てています。Conceptで扱う6種類の回転平面を個別に観察するUI、回転速度や投影距離の操作、アニメーションの一時停止などは、現在の構造から考えられる拡張候補です。これらは現時点では未実装です。',
      '5,000個の粒子を毎フレームCPU側で回転・投影しているため、将来粒子数を増やす場合は、端末性能に応じた密度調整や、シェーダーへ計算を移す方法を検討できます。あわせて、4次元回転・投影関数を独立して検証できるテストを用意すると、数学処理を変更した際の確認がしやすくなります。',
    ],
  },
];

export default function TesseractTechNote() {
  return (
    <main className="tech-note-page tesseract-tech-note">
      <header className="tech-note-hero">
        <p className="tech-note-eyebrow">TechNote（技術解説）</p>
        <h1>TechNote</h1>
        <p className="tech-note-work-title">Tesseract（テッセラクト）</p>
        <div className="tech-note-intro">
          <p>
            4次元超立方体の頂点と辺が、回転と3次元投影を経て
            React Three Fiberの描画データへ変換される流れを整理します。
          </p>
          <p>
            Conceptで示した「見えない次元を投影して観察する」という意図を、
            現在の実装がどのような数学とコードで形にしているかを解説します。
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

      <section className="tech-note-section tech-note-interactive">
        <div className="tech-note-section-heading">
          <h2>Interactive Work</h2>
        </div>
        <div className="tech-note-interactive-card">
          <Link to="/works/tesseract" className="tech-note-interactive-button">
            Interactive Workを開く
          </Link>
        </div>
      </section>
    </main>
  );
}
