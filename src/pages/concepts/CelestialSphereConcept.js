import '../../styles/ConceptLayout.css';
import './CelestialSphereConcept.css';
import celestialSphereConceptArt from '../../assets/天球モデル.png';
import { Link } from 'react-router-dom';

export default function CelestialSphereConcept() {
  return (
    <main className="concept-page celestial-sphere-concept">
      {/* Hero */}
      <header className="concept-hero">
        <p className="concept-eyebrow">Interactive Learning</p>

        <h1>Celestial Sphere</h1>
        <p className="concept-subtitle">天球</p>

        <p className="concept-lead">
          見上げる星空を、観察可能な空間構造として捉え直す。
        </p>
      </header>

      {/* Concept */}
      <section className="concept-section">
        <p className="section-label">Concept</p>

        <div className="section-heading">
          <p className="section-number">01</p>
          <h2>星が配置される空間そのものを見る</h2>
        </div>

        <div className="section-text narrow-text">
          <p>
            Celestial Sphereは、地球を中心とした天球の構造を、
            三次元空間として観察するために制作した
            インタラクティブモデルです。
          </p>

          <p>
            私たちは普段、地表から星空を見上げています。
            この作品では視点を天球の外側へ移し、
            天の赤道、黄道、天の極、子午線、恒星などが、
            空間の中でどのような関係を結んでいるのかを観察します。
          </p>

          <p>
            赤経・赤緯や天の赤道といった座標は、
            実際の空に線として描かれているものではありません。
            それらは、人間が星空の位置と運動を理解するために設けた、
            肉眼では見えない基準です。
          </p>

          <p>
            Celestial Sphereでは、その不可視の座標体系を
            点・線・軸・円として三次元空間に可視化します。
            天球を自由に回転・拡大しながら、
            星空を一枚の景色ではなく、
            幾何学的な構造として捉えることを目指しています。
          </p>
        </div>
      </section>

      {/* Concept Art */}
      <section className="concept-section concept-art-section">
        <p className="section-label">Concept Art</p>

        <div className="section-heading">
          <p className="section-number">02</p>
          <h2>天球構造の初期構想</h2>
        </div>

        <figure className="concept-figure">
          <img
            src={celestialSphereConceptArt}
            alt="地球、天の赤道、黄道、子午線、天の極を示した天球モデルのコンセプトアート"
          />

          <figcaption>
            天の赤道、黄道、地軸、子午線、季節の基準点などの関係を
            整理するために制作したコンセプトアート。
            この構想をもとに、各要素を操作可能な三次元モデルとして
            実装しました。
          </figcaption>
        </figure>
      </section>

     {/* Current Implementation */}
<section className="concept-section">
  <p className="section-label">Current Implementation</p>

  <div className="section-heading">
    <p className="section-number">03</p>
    <h2>赤経・赤緯から構築する星空</h2>
  </div>

  <div className="section-text narrow-text">
    <p>
      恒星は、赤経・赤緯に基づく静的データを
      三次元の直交座標へ変換し、天球面上に配置しています。
    </p>

    <p>
      星の位置情報と、星同士を結ぶ線の情報を分離することで、
      同じ恒星を複数の星座やアステリズムの構成要素として
      扱える設計にしています。
    </p>
  </div>

  <div className="celestial-data-grid">
    <article className="celestial-data-card">
      <h3>starData.js</h3>

      <p>
        恒星の名称、赤経、赤緯、明るさ、色などの
        静的データを管理します。
      </p>

      <dl className="celestial-data-list">
        <div>
          <dt>代表恒星</dt>
          <dd>
            シリウス、カノープス、ベガ、アルタイル、デネブ、
            アークトゥルス、ポラリス、ベテルギウスなど
          </dd>
        </div>

        <div>
          <dt>オリオン座</dt>
          <dd>
            ベテルギウス、ベラトリックス、アルニタク、
            アルニラム、ミンタカ、サイフ、リゲル
          </dd>
        </div>

        <div>
          <dt>北斗七星・南斗六星</dt>
          <dd>
            各アステリズムを構成する恒星
          </dd>
        </div>

        <div>
          <dt>黄道十二星座の代表星</dt>
          <dd>
            ハマル、アルデバラン、カストル、ポルックス、
            レグルス、スピカ、アンタレスなど
          </dd>
        </div>
      </dl>
    </article>

    <article className="celestial-data-card">
      <h3>asterismData.js</h3>

      <p>
        恒星同士の接続関係を管理し、
        星座やアステリズムの線を描画します。
      </p>

      <dl className="celestial-data-list">
        <div>
          <dt>季節の星群</dt>
          <dd>
            夏の大三角、冬の大三角、冬のダイヤモンド
          </dd>
        </div>

        <div>
          <dt>代表的なアステリズム</dt>
          <dd>
            北斗七星、南斗六星
          </dd>
        </div>

        <div>
          <dt>星座線</dt>
          <dd>
            オリオン座
          </dd>
        </div>
      </dl>
    </article>
  </div>

  <div className="celestial-next-phase concept-card">
    <p className="section-label">Next Phase</p>
    <h3>静的な星図から、時間を含む天球へ</h3>

    <div className="section-text">
      <p>
        今後は、日時や観測地点をモデルへ導入し、
        地球の自転や観測位置によって星空の見え方が変化する様子を
        再現することを検討しています。
      </p>

      <p>
        さらに、天体データを取得するAPIとの連携によって、
        現実の星空の変化を観察できる
        動的な学習モデルへ発展させる構想があります。
      </p>
    </div>
  </div>
</section>

      {/* Model Structure */}
<section className="concept-section">
  <p className="section-label">Model Structure</p>

  <div className="section-heading">
    <p className="section-number">04</p>
    <h2>天球を構成する四つのレイヤー</h2>
  </div>

  <div className="celestial-structure-grid">
    <article className="celestial-structure-card">
      <p className="structure-number">01</p>
      <h3>中心となる地球</h3>
      <p>
        天球の中心に地球を配置し、
        地上から星空を観測するための基準点を示します。
      </p>
      <span>Earth</span>
    </article>

    <article className="celestial-structure-card">
      <p className="structure-number">02</p>
      <h3>天球の座標構造</h3>
      <p>
        星空上の位置や方向を理解するための、
        肉眼では見えない基準線を可視化します。
      </p>
      <span>天の赤道・黄道・子午線・補助線</span>
    </article>

    <article className="celestial-structure-card">
      <p className="structure-number">03</p>
      <h3>回転軸と天の極</h3>
      <p>
        地球の自転軸を天球まで延長し、
        天の北極と天の南極の位置関係を示します。
      </p>
      <span>天の極を結ぶ軸・北極・南極</span>
    </article>

    <article className="celestial-structure-card">
      <p className="structure-number">04</p>
      <h3>恒星と星のつながり</h3>
      <p>
        赤経・赤緯から配置した恒星を、
        星座やアステリズムの接続情報によって結びます。
      </p>
      <span>恒星・星座線・名称ラベル</span>
    </article>
  </div>
</section>


      {/* Interactive Work */}
<section className="concept-section">
  <p className="section-label">Interactive Work</p>

  <div className="section-heading">
    <p className="section-number">05</p>
    <h2>天球を自由に観察する</h2>
  </div>

  <div className="interactive-card">
    <h3>Celestial Sphere</h3>

    <p>
      天球をドラッグして回転し、視点を拡大・縮小しながら、
      地球、天の赤道、黄道、恒星、星座線の位置関係を
      三次元空間で観察できます。
    </p>

    <Link
      to="/works/celestial-sphere"
      className="interactive-button"
    >
      Interactive Workを開く
    </Link>
  </div>
</section>
    </main>
  );
}