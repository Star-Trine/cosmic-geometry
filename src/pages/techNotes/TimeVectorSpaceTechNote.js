import '../../styles/TechNoteLayout.css';
import './TimeVectorSpaceTechNote.css';
import { Link } from 'react-router-dom';

const sections = [
  {
    number: '01', title: 'Overview（概要）', paragraphs: [
      'Time Vector Spaceは、三つの基底ベクトルが張る三次元空間を共通の舞台とし、線形結合、内積、外積、線形写像を4つのモードから操作するインタラクティブ作品です。Concept上の「複数の時間方向をベクトル空間として観察する」という独自モデルを、標準的な線形代数の計算とReact Three Fiberの三次元表示へ対応させています。',
      '現在の作品コードではBasis、Inner Product、Cross Product、Linear Mapの4モードが一つのページに統合済みです。各モードは共通のナビゲーション、基底軸、背景粒子、方向線、ベクトル矢印、操作パネル、Canvas、結果パネルを共有しながら、異なるstateと数学処理を持ちます。',
      '基本的な流れは「モード選択 → スライダーや表示設定によるstate更新 → THREE.Vector3または3×3行列の生成 → useMemoによる結果計算 → 3D形状とKaTeX数式の同時更新」です。自動アニメーションではなく、ユーザー操作そのものがモデルの変化を作ります。',
    ],
  },
  {
    number: '02', title: 'Technology Stack（使用技術）', paragraphs: [
      'ReactはactiveMode、係数、入力ベクトル、変換種別、パネルの開閉、補助表示のオン・オフをuseStateで管理します。ベクトル、行列、長さ、角度、射影、外積、行列式、BufferGeometryなど、入力から導出できる値はuseMemoで再計算範囲を限定しています。',
      '@react-three/fiberのCanvasでThree.jsシーンをReactコンポーネントとして構成します。Three.js本体のVector3、ArrowHelper、BufferGeometry、BufferAttribute、Float32BufferAttribute、MathUtilsを、ベクトル演算と点・線・面・格子の生成に使用しています。',
      '@react-three/dreiのOrbitControlsは全モードの視点回転とズーム、Textは矢印先端や原点のラベルに使われます。react-katexのBlockMathとInlineMathが、現在の係数や計算結果を数式として表示します。',
    ],
  },
  {
    number: '03', title: 'Application and Shared Components（画面構成と共通部品）', paragraphs: [
      'TimeVectorSpaceはactiveModeをbasisで初期化し、4つのボタンからbasis、innerProduct、crossProduct、linearMapへ切り替えます。同じnavigation要素を選択中のモードへpropsで渡し、各モードがページ全体を返す構成です。モードを切り替えると現在のモードコンポーネントは外れ、戻った際はそのモードのstateが初期値から作り直されます。',
      'CoefficientSliderは−3から3、0.1刻みの共通range入力で、KaTeXラベル、現在値、モードから渡された更新関数をまとめます。VectorArrowはVector3の長さと正規化方向からTHREE.ArrowHelperを生成し、終点の球と任意ラベルを追加します。長さ0.001未満のベクトルは描画しません。',
      'BasisAxesは長さ3.4のt₁・t₂・t₃をx・y・z軸へ配置し、原点を表示します。TimeParticlesは半径4〜11の球状領域へ280点を一度だけランダム生成します。BackgroundTimeDirectionsは34方向へ放射状の線分を作ります。これらは数学的な計算対象ではなく、共通の時間空間を示す背景レイヤーです。',
    ],
  },
  {
    number: '04', title: 'Basis Mode（基底・線形結合）', paragraphs: [
      'Basis Modeは係数a₁、a₂、a₃を初期値1.4、1.1、0.8で保持し、状態ベクトルu = (a₁, a₂, a₃)を生成します。各スライダーの変更はcoefficientsオブジェクトの対象値だけを更新し、uの矢印、座標、KaTeXの線形結合、大きさ √(a₁² + a₂² + a₃²)へ同時に反映されます。',
      'LinearCombinationGuidesは原点、(a₁,0,0)、(a₁,a₂,0)、(a₁,a₂,a₃)を順に結ぶ3本の破線を作り、各基底成分が終点へ積み上がる過程を示します。showGuidesで表示を切り替えられ、状態ベクトルの終点には発光する球を置きます。',
      'このモードは、Conceptで時間状態を三つの時間軸の線形結合として表した部分に対応します。コード上のt₁・t₂・t₃は直交するx・y・z方向であり、係数を変えることで状態がどの方向をどれだけ含むかを観察します。',
    ],
  },
  {
    number: '05', title: 'Inner Product Mode（内積）', paragraphs: [
      'Inner Product Modeはベクトルuとvを各3成分で保持し、内積u・v、両ベクトルの長さ、cosineSimilarity = (u・v)/(|u||v|)、angle = arccos(cosineSimilarity)を計算します。浮動小数点誤差でarccosの範囲を外れないよう、コサイン値を−1から1へclampします。',
      'uの長さが1e−10より大きい場合、vのuへの射影を projᵤ(v) = u × (u・v)/|u|² で求めます。uがほぼゼロなら射影はゼロベクトルとし、uまたはvがほぼゼロなら角度とコサイン類似度は未定義として「—」を表示します。',
      '3D表示にはu、v、射影ベクトルを描き、vの終点から射影先まで破線を結びます。useLayoutEffectで破線のline distanceを計算し、showProjectionで射影矢印と補助線をまとめて切り替えます。結果パネルは内積、角度、コサイン類似度を表示します。',
    ],
  },
  {
    number: '06', title: 'Cross Product Mode（外積）', paragraphs: [
      'Cross Product Modeもuとvを各3成分で保持し、u×v = (u₂v₃−u₃v₂, u₃v₁−u₁v₃, u₁v₂−u₂v₁)を成分ごとに計算します。結果ベクトルの長さは平方和の平方根で求め、同じ値をuとvが張る平行四辺形の面積として表示します。',
      '角度は内積モードと同様に、ベクトル長がしきい値を超える場合だけ正規化内積から求めます。外積ベクトルはuとvの両方へ直交する方向として矢印で描画され、Conceptで「二つの状態から立ち上がる新しい方向」とした表現に対応します。',
      'Parallelogramは原点、u、u+v、vから2枚の三角形を作り、Float32ArrayをBufferAttributeへ設定して半透明の面を描きます。showParallelogramで面だけを非表示にでき、u、v、外積の矢印と計算結果は残ります。',
    ],
  },
  {
    number: '07', title: 'Linear Map Mode（線形写像）', paragraphs: [
      'Linear Map Modeは拡大・縮小、回転、せん断、反転、射影の5種類から3×3行列を生成します。拡大は対角成分s₁・s₂・s₃、回転はt₁t₂平面のcos・sin行列、せん断は第1成分へk倍の第2成分を加える行列です。反転は第3成分の符号を反転し、射影は第3成分を0にする固定行列です。',
      'transformVectorは行列とVector3の積を各行の積和として計算します。同じ関数で入力vからAvを求め、標準基底e₁・e₂・e₃からAe₁・Ae₂・Ae₃を生成します。TransformedGridも格子線の両端へ同じ変換を適用するため、ベクトルだけでなく空間全体の変形を観察できます。',
      '行列式は3×3の余因子展開で計算し、絶対値が1e−10未満なら「次元が失われる」、負なら「向きが反転」、それ以外は「向きを保つ」と表示します。変換前・変換後の格子は個別に切り替えられ、入力ベクトル、変換後ベクトル、変換基底、行列、行列式が同じstateから更新されます。',
    ],
  },
  {
    number: '08', title: 'Rendering and Interaction（描画と操作）', paragraphs: [
      '全モードのCanvasはカメラ位置 [5.8, 4.5, 6.8]、視野角46度、device pixel ratio 1〜1.7で構成されます。背景色とfog、ambientLight、2灯のpointLight、gridHelperを共通の視覚基盤とし、OrbitControlsはdampingFactor 0.06、距離4.5〜12、注視点 [0.65, 0.65, 0.65]です。',
      '操作パネル、3D Canvas、結果パネルは通常3カラムです。CSSは画面幅に応じて構成を組み替え、モードナビゲーション、スライダー、数式、Canvasを狭い画面でも読めるよう調整します。数式は結果を文字列へ埋め込むため、スライダーと三次元形状と数値表示が同時に変わります。',
      '各モードにはResetがあり、そのモードの入力値、開閉状態、表示オプションを初期値へ戻します。毎フレーム数学値を変える処理はなく、背景粒子も静的です。現在の動きはユーザー入力とOrbitControlsによるカメラ操作から生まれます。',
    ],
  },
  {
    number: '09', title: 'Current Scope and Future Development（現在の範囲と今後）', paragraphs: [
      '現在は4モードすべてが実装され、共通ナビゲーションから切り替え可能です。一方で、モード間で入力値を共有する仕組みはなく、切り替えによって各モードのローカルstateは保持されません。行列・ベクトルの保存、履歴比較、アニメーション再生も実装されていません。',
      'Conceptで夢、デジャブ、創発、記憶などと数学操作を対応させていますが、これらは作品独自の解釈レイヤーです。コードが実際に計算するのは標準的な三次元ベクトルと行列であり、現象を科学的に判定・予測する処理ではありません。',
      '今後の拡張候補として、モード間で同じベクトルを引き継ぐ共有state、行列の直接編集、操作履歴、変換の補間アニメーション、数値計算のテストが考えられます。いずれも現在の実装とは区別すべき未実装項目です。',
    ],
  },
];

export default function TimeVectorSpaceTechNote() {
  return (
    <main className="tech-note-page time-vector-space-tech-note">
      <header className="tech-note-hero">
        <p className="tech-note-eyebrow">TechNote（技術解説）</p><h1>TechNote</h1>
        <p className="tech-note-work-title">Time Vector Space（時間ベクトル空間）</p>
        <div className="tech-note-intro">
          <p>4つの操作モードが、共通の三次元空間でベクトルと行列を計算・描画する構造を整理します。</p>
          <p>Conceptの時間モデルと、現在のコードが実行する線形代数・state管理・React Three Fiber描画の対応を解説します。</p>
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
        <div className="tech-note-interactive-card"><Link to="/works/time-vector-space" className="tech-note-interactive-button">Interactive Workを開く</Link></div>
      </section>
    </main>
  );
}
