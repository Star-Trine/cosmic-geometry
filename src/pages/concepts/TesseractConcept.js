import './TesseractConcept.css';
import { BlockMath } from 'react-katex';
import { Link } from "react-router-dom";

const dimensionSteps = [
  {
    dimension: '0D',
    name: '点',
    description: '位置だけを持ち、長さを持たない。',
    symbol: '•',
  },
  {
    dimension: '1D',
    name: '線分',
    description: '点を一つの方向へ動かして生まれる。',
    symbol: '━',
  },
  {
    dimension: '2D',
    name: '正方形',
    description: '線分を、それ自身とは独立した方向へ動かす。',
    symbol: '□',
  },
  {
    dimension: '3D',
    name: '立方体',
    description: '正方形を、第3の方向へ動かして作る。',
    symbol: '▱',
  },
  {
    dimension: '4D',
    name: 'テッセラクト',
    description: '立方体を、第4の独立した方向へ動かした超立方体。',
    symbol: '◇',
  },
];

const structureData = [
  { label: '頂点', value: 16 },
  { label: '辺', value: 32 },
  { label: '正方形の面', value: 24 },
  { label: '立方体の胞', value: 8 },
];

const rotationPlanes = ['XY', 'XZ', 'YZ', 'XW', 'YW', 'ZW'];

export default function TesseractConcept() {
  return (
    <main className="tesseract-concept">
      <header className="tesseract-hero">
        <p className="tesseract-eyebrow">CONCEPT / HIGHER DIMENSION</p>

        <h1>テッセラクト</h1>

        <p className="tesseract-subtitle">
          4次元空間は、どのように見えるのだろう。
        </p>

        <p className="tesseract-lead">
          テッセラクトは、4次元空間における立方体です。
          私たちは4次元空間をそのまま見ることはできませんが、
          3次元空間への投影として、その構造の一部を観察できます。
        </p>

        <div className="tesseract-hero-actions">
          <div className="hero-projection-card" aria-label="4次元から3次元への投影">
          <span>4D Space</span>
          <span className="projection-arrow">↓</span>
          <span>3D Projection</span>
            <p>Projecting the invisible dimension</p>
        </div>

          <a className="secondary-link" href="#dimension">
            次元の構造を見る
          </a>
        </div>
      </header>

      <section className="concept-section origin-section">
        <div className="section-heading">
          <p className="section-number">01</p>
          <div>
            <p className="section-label">ORIGIN</p>
            <h2>この作品の出発点</h2>
          </div>
        </div>

        <div className="origin-grid">
          <blockquote>
            <p>「あれ？ でも4次元空間ってどのように見えるだろう？」</p>
          </blockquote>

          <div className="section-text">
            <p>
              この問いは、2020年にStarsPioneeRで公開した
              「次元と密度について」という記事の中に登場しました。
            </p>

            <p>
              当時は、スピリチュアルで語られる「次元」という言葉を入口に、
              数学におけるベクトル空間、基底、自由度について考えていました。
            </p>

            <p>
              Cosmic Geometryでは、その問いを文章だけで終わらせず、
              高次元図形を動かしながら観察できる作品へ発展させます。
            </p>
          </div>
        </div>
      </section>

      <section id="dimension" className="concept-section">
        <div className="section-heading">
          <p className="section-number">02</p>
          <div>
            <p className="section-label">DIMENSION</p>
            <h2>次元とは、独立した自由度の数</h2>
          </div>
        </div>

        <div className="section-text narrow-text">
          <p>
            ベクトル空間の次元は、その空間の基底を構成する
            独立なベクトルの個数として定義されます。
          </p>

          <div className="formula-card">
            <span className="formula-label">4次元ベクトル</span>
            <BlockMath math={String.raw`\mathbf{v}=a_1\mathbf{e}_1+a_2\mathbf{e}_2+a_3\mathbf{e}_3+a_4\mathbf{e}_4`}/>
            <p>
              e₁、e₂、e₃、e₄は互いに独立した基底ベクトルです。
            </p>
          </div>

          <p>
            テッセラクトで扱う4次元は、時間を加えた時空ではなく、
            x・y・z・wという4本の空間座標を持つ数学的な空間です。
          </p>
        </div>

        <div className="dimension-flow" aria-label="次元の発展">
          {dimensionSteps.map((step, index) => (
            <article className="dimension-card" key={step.dimension}>
              <div className="dimension-symbol" aria-hidden="true">
                {step.symbol}
              </div>

              <p className="dimension-index">{step.dimension}</p>
              <h3>{step.name}</h3>
              <p>{step.description}</p>

              {index < dimensionSteps.length - 1 && (
                <span className="dimension-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="concept-section projection-section">
        <div className="section-heading">
          <p className="section-number">03</p>
          <div>
            <p className="section-label">PROJECTION</p>
            <h2>見えない次元を、投影して見る</h2>
          </div>
        </div>

        <div className="projection-grid">
          <div className="projection-placeholder" aria-label="投影図の予定領域">
            <span>4D</span>
            <span className="projection-arrow">↓</span>
            <span>3D Projection</span>
          </div>

          <div className="section-text">
            <p>
              3次元の立方体を2次元の画面に描くとき、
              私たちは奥行きを投影によって表現します。
            </p>

            <p>
              同じようにテッセラクトも、4次元の頂点を3次元へ投影することで
              観察できます。そのため、画面上に見える形は
              テッセラクトそのものではなく、ひとつの影や写像です。
            </p>

            <p>
              投影方法や視点を変えると、同じ4次元図形でも
              異なる形として現れます。
            </p>
          </div>
        </div>
      </section>

      <section className="concept-section">
        <div className="section-heading">
          <p className="section-number">04</p>
          <div>
            <p className="section-label">STRUCTURE</p>
            <h2>テッセラクトの構造</h2>
          </div>
        </div>

        <div className="structure-grid">
          {structureData.map((item) => (
            <article className="structure-card" key={item.label}>
              <p className="structure-value">{item.value}</p>
              <p>{item.label}</p>
            </article>
          ))}
        </div>

        <div className="section-text narrow-text">
          <p>
            正方形が4本の辺からなり、立方体が6枚の正方形からなるように、
            テッセラクトは8個の立方体状の「胞」によって構成されます。
          </p>
        </div>
      </section>

      <section className="concept-section">
        <div className="section-heading">
          <p className="section-number">05</p>
          <div>
            <p className="section-label">ROTATION</p>
            <h2>4次元空間の回転</h2>
          </div>
        </div>

        <div className="section-text narrow-text">
          <p>
            3次元では、回転はXY・XZ・YZ平面で考えられます。
            4次元では新たにw軸が加わるため、6種類の回転平面が存在します。
          </p>
        </div>

        <div className="rotation-list">
          {rotationPlanes.map((plane) => (
            <span key={plane}>{plane}</span>
          ))}
        </div>

        <p className="rotation-note">
          XW・YW・ZW回転が加わることで、3次元への投影形状は
          内側と外側が入れ替わるように変化します。
        </p>
      </section>

      <section className="concept-section density-section">
        <div className="section-heading">
          <p className="section-number">06</p>
          <div>
            <p className="section-label">DIMENSION &amp; DENSITY</p>
            <h2>次元と密度を考える</h2>
          </div>
        </div>

        <div className="density-columns">
          <article>
            <h3>物理学における密度</h3>
            <p>
              密度は、ある量が線・面・空間などの領域に
              どの程度分布しているかを表します。
            </p>

            <ul>
              <li>単位長さあたりの線密度</li>
              <li>単位面積あたりの面密度</li>
              <li>単位体積あたりの体積密度</li>
              <li>高次元体積に対する密度</li>
            </ul>
          </article>

          <article>
            <h3>StarsPioneeRから残る問い</h3>
            <p>
              かつての記事では、感情・精神・意識にも
              「密度」という考え方を拡張できるのではないかと想像しました。
            </p>

            <p>
              これは物理学上の密度とは異なる比喩的・思想的な問いです。
              Cosmic Geometryでは、科学として確認できる内容と
              想像による探究を区別しながら、両方を残します。
            </p>
          </article>
        </div>
      </section>

     <section id="interactive-work" className="concept-section work-preview">
  <p className="section-label">INTERACTIVE WORK</p>

  <h2>4次元の密度と回転を観察する</h2>

  <p>
    4次元空間に生成した粒子群をXW・YW・ZW平面で回転させ、
    3次元空間へ投影したインタラクティブ作品です。
  </p>

  <p>
    テッセラクトの輪郭と粒子密度の変化を通して、
    直接見ることのできない第4の空間軸を視覚的に観察できます。
  </p>

  <div className="work-features" aria-label="作品の特徴">
    <span>4D Particle Field</span>
    <span>XW / YW / ZW Rotation</span>
    <span>4D → 3D Projection</span>
  </div>

  <div className="work-placeholder">
    <div>
      <p className="work-title">テッセラクト</p>
      <span>4次元密度可視化</span>
    </div>

    <Link className="primary-link" Link to="/works/tesseract">
      Interactive Workを見る
    </Link>
  </div>
</section>
    </main>
  );
}