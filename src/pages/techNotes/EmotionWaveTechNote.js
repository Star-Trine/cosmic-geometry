import '../../styles/TechNoteLayout.css';
import './EmotionWaveTechNote.css';
import { Link } from 'react-router-dom';

const sections = [
  {
    number: '01', title: 'Overview（概要）', paragraphs: [
      'Emotion Waveは、8種類の一次感情をそれぞれ異なる正弦波として定義し、ユーザーが指定した強度に応じて一つの合成波を生成するインタラクティブ作品です。Conceptにある「複数の感情が重なって一つの状態を作る」という考えを、波の加算とSVGポリラインへ置き換えています。',
      '画面は、感情ごとの強度スライダーを持つ操作パネルと、合成波・合計強度・優勢感情・有効な感情数を表示する可視化パネルで構成されます。入力を変更するとReact stateが更新され、波形と集計結果が同じデータから再計算されます。',
      'この波形は感情を物理現象として測定・再現するものではありません。現在のコードは、固定した周波数・位相・色とユーザー入力強度を使う作品独自の視覚モデルです。',
    ],
  },
  {
    number: '02', title: 'Technology Stack（使用技術）', paragraphs: [
      'ReactのuseStateで8感情の強度を保持し、useMemoで有効感情、合計強度、240点の合成波を派生データとして計算します。入力イベント以外のタイマーやrequestAnimationFrameは使っておらず、スライダー変更時の再レンダリングが描画更新の契機です。',
      '波形は外部チャートライブラリを使わず、ReactからSVGのline、polyline、linearGradient、filterを生成しています。CSSは2カラムの作品UI、グリッド背景、発光、レスポンシブなパネル配置を担当します。',
      'Conceptではフーリエ級数やPlutchikの感情の輪を着想として扱っていますが、実装している数値処理は8本の正弦波の単純加算です。余弦項、フーリエ係数推定、二次感情の判定処理はありません。',
    ],
  },
  {
    number: '03', title: 'Emotion Data（感情データ）', paragraphs: [
      'emotions配列には、喜び、信頼、恐れ、驚き、悲しみ、嫌悪、怒り、期待の8件が順番に定義されています。各要素はstate参照用id、日本語名、英語名、表示色、波形用frequency、開始位置をずらすphaseを持ちます。',
      'frequencyは喜びの1から期待の2.75まで0.25刻みで増えます。phaseは0、π/6、π/4、π/3、π/2、0.65π、0.8π、πです。これらはコード内の固定値で、スライダーが変更するのは各感情のstrengthだけです。',
      '色は黄色、緑、青緑、水色、青、紫、赤、オレンジの順で各感情へ割り当てられます。スライダーのaccentColor、感情識別点、SVGグラデーションに同じ値を使いますが、現在の合成波の色は感情比率から混色するのではなく、8色を固定順序で横方向に並べたグラデーションです。',
    ],
  },
  {
    number: '04', title: 'State and Data Flow（状態とデータフロー）', paragraphs: [
      'strengthsは感情IDをキー、0から100の数値を値とするオブジェクトです。初期化時はObject.fromEntriesで全感情を0にし、スライダー変更時はhandleStrengthChangeが対象IDだけをNumber(value)で更新します。Resetは同じ形式のゼロ状態を作り直します。',
      'activeEmotionsはstrengthが0より大きい感情だけを抽出し、強度の降順へ並べた配列です。その先頭をdominantEmotionとして表示し、同じ配列から有効感情数と日本語名一覧を作ります。同率時は元のemotions配列の順序が保たれるため、先に定義された感情が優勢表示になります。',
      'totalStrengthは全strengthの合計で、0から最大800まで取り得ます。データフローは「range入力 → strengths更新 → activeEmotions・totalStrength・combinedWavePoints再計算 → SVGとステータス表示更新」です。',
    ],
  },
  {
    number: '05', title: 'Wave Calculation（波形計算）', paragraphs: [
      'SVGの論理サイズは1000 × 420、中心線はy = 210、サンプル数は240です。各点のprogressを index / 239 として0から1へ進め、x = progress × 1000で横座標を求めます。',
      '感情iの強度をsᵢ、固定周波数をfᵢ、位相をφᵢとすると、各サンプルの合成値は Σ[(sᵢ / 100) sin(2π fᵢ progress + φᵢ)] です。すべての感情をreduceで加算するため、波同士が強め合う区間と打ち消し合う区間が一つの折れ線に現れます。',
      '振幅の正規化には max(totalStrength, 100) を使い、amplitude = waveValue / (normalization / 100) × 120 とします。合計強度が100以下では各スライダー値が振幅へ直接反映され、100を超えると総量で割ることで多数の感情を上げた際の過度な振幅増加を抑えます。SVG座標は下向きが正なので、y = 210 − amplitudeです。',
    ],
  },
  {
    number: '06', title: 'SVG Rendering（SVG描画）', paragraphs: [
      '240個の「x,y」文字列を空白で連結し、polylineのpoints属性へ渡します。波形はfillなし、線幅5、丸い端点・接合で描画され、中心には破線のlineを置いて振幅0の基準を示します。',
      'linearGradientは8色を配列順に0%から100%へ等間隔で配置します。feGaussianBlurの標準偏差6とfeMergeでぼかしと元線を重ね、発光する合成波として表示します。個別の感情波を別々に描く処理はありません。',
      '全strengthが0の場合も計算結果は中心線上のpolylineですが、その上に「左側のスライダーから感情を選択してください」という案内を表示します。SVGにはviewBoxとrole、aria-labelを設定し、CSSでパネル幅に合わせて伸縮します。',
    ],
  },
  {
    number: '07', title: 'Interaction and Responsive Design（操作とレスポンシブ）', paragraphs: [
      '各感情は0から100のrange入力で操作し、現在値をoutputへ表示します。入力変更に補間アニメーションや遅延はなく、強度、波形、優勢感情、件数が即時に更新されます。Resetボタンは8件すべてを0へ戻します。',
      '通常は左に260〜330pxの操作パネル、右に可視化パネルを置く2カラムです。900px以下では縦1カラムにし、感情コントロールを2列へ変更します。600px以下ではヘッダー操作を折り返し、感情コントロールとステータスを1列に戻し、波形領域を420pxから320pxへ縮めます。',
      '波形領域はSVGのviewBoxを維持して縮小されるため、240サンプルの計算自体は画面幅で変わりません。CSSのグリッド背景、半透明パネル、backdrop-filter、SVGフィルターがCosmic Geometryの視覚表現を担当します。',
    ],
  },
  {
    number: '08', title: 'Current Scope and Constraints（現在の範囲と制約）', paragraphs: [
      '実装済みなのは一次感情8件の強度操作、正弦波の合成、固定グラデーションによるSVG描画、合計強度・優勢感情・有効感情の集計です。Conceptに記載された隣接感情から愛や畏怖などを導く二次感情モデルは、現在の作品コードには実装されていません。',
      '周波数と位相は視覚的に異なる波を作るための固定パラメータであり、心理測定や可視光の物理周波数との換算処理はありません。色も波長から算出せず、16進カラーを直接保持しています。',
      '波形は静止した一周期相当のサンプルを入力ごとに再計算する構成です。時間方向へ流れるアニメーション、個別波の表示、履歴保存、音声出力はありません。これらを実装済みの機能として扱わないことが現在のモデルを理解するうえで重要です。',
    ],
  },
  {
    number: '09', title: 'Future Development（今後の拡張）', paragraphs: [
      '現在のデータ構造を拡張する場合、個別波の表示切替、位相や周波数の操作、時間オフセットによるアニメーション、感情比率に応じた動的な混色などが候補になります。いずれも現在は未実装です。',
      'Conceptにある二次感情を扱う場合は、単に波形を加算する処理とは別に、どの一次感情の組と強度を二次感情として判定するかを定義する必要があります。現在のactiveEmotionsは0より大きい感情の抽出と並べ替えだけで、その判定ロジックは持っていません。',
    ],
  },
];

export default function EmotionWaveTechNote() {
  return (
    <main className="tech-note-page emotion-wave-tech-note">
      <header className="tech-note-hero">
        <p className="tech-note-eyebrow">TechNote（技術解説）</p><h1>TechNote</h1>
        <p className="tech-note-work-title">Emotion Wave（感情の波）</p>
        <div className="tech-note-intro">
          <p>8種類の感情データと強度入力が正弦波へ変換され、一つのSVG合成波として描画される流れを整理します。</p>
          <p>Conceptの芸術的な波モデルと、現在のコードが実際に行う数値計算・集計・表示の境界を明確にしながら解説します。</p>
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
        <div className="tech-note-interactive-card"><Link to="/works/emotion-wave" className="tech-note-interactive-button">Interactive Workを開く</Link></div>
      </section>
    </main>
  );
}
