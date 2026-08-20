import { Link } from 'react-router-dom';
import { BlockMath, InlineMath } from 'react-katex';

import 'katex/dist/katex.min.css';
import '../../styles/ConceptLayout.css';
import './TimeVectorSpaceConcept.css';

import timeVectorSpaceConceptArt
  from '../../assets/timevectorspace.png';

export default function TimeVectorSpaceConcept() {
  return (
    <main className="concept-page time-vector-space-concept">
      {/* Hero */}
      <header className="concept-hero">
        <p className="concept-eyebrow">
          Original Theory / Interactive Mathematics
        </p>

        <h1>Time Vector Space</h1>

        <p className="concept-subtitle">
          時間ベクトル空間
        </p>

        <p className="concept-lead">
          一本の時間を進む視点から離れ、
          無数の時間軸が張る空間を観測する。
        </p>
      </header>

      {/* 01 Concept */}
      <section className="concept-section">
        <p className="section-label">
          Concept（コンセプト）
        </p>

        <div className="section-heading">
          <p className="section-number">01</p>
          <h2>
            時間を、一本の線ではなく
            複数の方向として捉える
          </h2>
        </div>

        <div className="section-text narrow-text">
          <p>
            Time Vector Space（時間ベクトル空間）は、
            パラレルワールドごとに異なる時間軸が存在すると仮定し、
            それぞれを一次独立な時間ベクトルとして扱う
            思考モデルです。
          </p>

          <p>
            私たちは通常、過去から現在、未来へと続く
            一本の時間を生きているように感じています。
            しかし、選ばれなかった可能性や、
            異なる世界で進行する時間まで含めて考えるなら、
            時間は一方向の線ではなく、
            複数の方向を持つ空間として捉えられるかもしれません。
          </p>

          <p>
            本作品では、無数に存在すると仮定した時間軸から
            三つを基底
            <InlineMath math="\mathbf{t}_1,\mathbf{t}_2,\mathbf{t}_3" />
            として取り出し、三次元空間に可視化します。
          </p>

          <p>
            画面上の
            <InlineMath math="\mathbf{t}_1,\mathbf{t}_2,\mathbf{t}_3" />
            は、現実、夢、祈りなどの意味に固定された軸ではありません。
            それぞれが異なるパラレルワールドを進む、
            独立した時間方向を表しています。
          </p>
        </div>

        <blockquote className="concept-quote">
          <p>
            時間とは、ただ前へ進むものなのか。<br />
            それとも、まだ見えていない方向へ広がる
            空間なのだろうか。
          </p>
        </blockquote>
      </section>

      {/* 02 Starting Point */}
      <section className="concept-section">
        <p className="section-label">
          Starting Point（作品の出発地点）
        </p>

        <div className="section-heading">
          <p className="section-number">02</p>
          <h2>
            「時間幾何学について」から、
            インタラクティブ作品へ
          </h2>
        </div>

        <div className="section-text narrow-text">
          <p>
            この作品の思想的な出発点は、
            かつてStarsPioneeRに掲載していた
            「時間幾何学について」という文章にあります。
          </p>

          <p>
            原文は現在残っていませんが、
            そこでは時間を一本の流れとしてだけ捉えず、
            複数の時間や可能性が共存する構造として
            考察していました。
          </p>

          <p>
            その思想をWeb上で可視化する試みとして、
            2025年に四つの3Dモデルを制作しました。
          </p>
        </div>

        <div className="prototype-grid">
          <article className="concept-card prototype-card">
            <p className="prototype-index">01</p>
            <h3>
              Time Vector Space
              <span>時間ベクトル空間</span>
            </h3>
            <p>
              三つの独立した時間軸を、
              三次元空間の基底として表示する試作。
            </p>
          </article>

          <article className="concept-card prototype-card">
            <p className="prototype-index">02</p>
            <h3>
              Inner Product
              <span>内積</span>
            </h3>
            <p>
              時間ベクトル同士の方向的な類似を、
              共鳴の強さとして可視化する試作。
            </p>
          </article>

          <article className="concept-card prototype-card">
            <p className="prototype-index">03</p>
            <h3>
              Cross Product
              <span>外積</span>
            </h3>
            <p>
              二つの時間ベクトルから、
              新しい方向が生成される様子を表す試作。
            </p>
          </article>

          <article className="concept-card prototype-card">
            <p className="prototype-index">04</p>
            <h3>
              Linear Map
              <span>線形写像</span>
            </h3>
            <p>
              時間状態が行列によって
              別の状態へ変換される様子を表す試作。
            </p>
          </article>
        </div>

        <div className="section-text narrow-text prototype-summary">
          <p>
            当時は四つを独立した作品として実装していました。
            しかし改めて構想とコードを見直すと、
            それらはすべて同じ時間ベクトル空間に対する
            異なる数学的操作として整理できます。
          </p>

          <p>
            そこで現在は、四つの試作を一つの
            Time Vector Spaceへ統合し、
            共通の3D空間とUIを持つ作品として
            再設計することを構想しています。
          </p>
        </div>
      </section>

      {/* 03 Mathematical Background */}
      <section className="concept-section">
        <p className="section-label">
          Mathematical Background（数学的背景）
        </p>

        <div className="section-heading">
          <p className="section-number">03</p>
          <h2>
            無数の時間軸が張る
            ベクトル空間
          </h2>
        </div>

        <div className="section-text narrow-text">
          <p>
            異なるパラレルワールドを進む時間軸を、
            一次独立なベクトル
            <InlineMath math="\mathbf{t}_1,\mathbf{t}_2,\ldots,\mathbf{t}_n" />
            として定義します。
          </p>
        </div>

        <div className="formula-card time-formula-card">
          <p className="formula-label">
            Time Vector Space（時間ベクトル空間）
          </p>

          <div className="formula">
            <BlockMath
              math={String.raw`
                \mathcal{T}
                =
                \operatorname{span}
                \left\{
                  \mathbf{t}_1,
                  \mathbf{t}_2,
                  \mathbf{t}_3,
                  \ldots,
                  \mathbf{t}_n
                \right\}
              `}
            />
          </div>

          <p className="formula-description">
            無数に存在すると仮定した時間軸が張る、
            抽象的な時間ベクトル空間。
          </p>
        </div>

        <div className="formula-card time-formula-card">
          <p className="formula-label">
            Three-dimensional Model（三次元モデル）
          </p>

          <div className="formula">
            <BlockMath
              math={String.raw`
                \mathcal{T}_3
                =
                \operatorname{span}
                \left\{
                  \mathbf{t}_1,
                  \mathbf{t}_2,
                  \mathbf{t}_3
                \right\}
              `}
            />
          </div>

          <p className="formula-description">
            本作品では、無数の時間軸から三つを取り出し、
            操作可能な三次元モデルとして表現します。
          </p>
        </div>

        <div className="formula-card time-formula-card">
          <p className="formula-label">
            Temporal State Vector（時間状態ベクトル）
          </p>

          <div className="formula">
            <BlockMath
              math={String.raw`
                \boldsymbol{\tau}
                =
                a_1\mathbf{t}_1
                +
                a_2\mathbf{t}_2
                +
                a_3\mathbf{t}_3
              `}
            />
          </div>

          <p className="formula-description">
            一つの時間状態は、
            複数の時間軸を含む線形結合として表されます。
          </p>
        </div>

        <div className="operation-grid">
          <article className="concept-card operation-card">
            <p className="operation-symbol">Σ</p>
            <h3>
              Linear Combination
              <span>線形結合</span>
            </h3>
            <p>
              複数の時間軸の成分を合成し、
              一つの時間状態ベクトルを生成します。
            </p>
          </article>

          <article className="concept-card operation-card">
            <p className="operation-symbol">·</p>
            <h3>
              Inner Product
              <span>内積</span>
            </h3>
            <p>
              二つの時間状態の角度や、
              方向的な類似を測ります。
            </p>
          </article>

          <article className="concept-card operation-card">
            <p className="operation-symbol">×</p>
            <h3>
              Cross Product
              <span>外積</span>
            </h3>
            <p>
              二つの状態が張る面と、
              その両方に直交する方向を生成します。
            </p>
          </article>

          <article className="concept-card operation-card">
            <p className="operation-symbol">T</p>
            <h3>
              Linear Map
              <span>線形写像</span>
            </h3>
            <p>
              回転、拡大、せん断、反転などによって、
              時間状態や空間全体を変換します。
            </p>
          </article>

          <article className="concept-card operation-card">
            <p className="operation-symbol">P</p>
            <h3>
              Projection
              <span>射影</span>
            </h3>
            <p>
              複数の成分を持つ状態を、
              特定の方向や部分空間へ写します。
            </p>
          </article>
        </div>
      </section>

      {/* 04 Temporal Phenomena */}
      <section className="concept-section">
        <p className="section-label">
          Temporal Phenomena（時間にまつわる現象）
        </p>

        <div className="section-heading">
          <p className="section-number">04</p>
          <h2>
            時間経験を、
            線形代数の構造から考察する
          </h2>
        </div>

        <div className="concept-card theory-notice">
          <p>
            以下の考察は、夢やデジャブなどの仕組みを
            科学的に証明するものではありません。
          </p>

          <p>
            時間にまつわる主観的な経験を、
            線形代数の構造へ写して観察するための
            思考モデルです。
          </p>
        </div>

        <div className="phenomena-grid">
          <article className="phenomenon-card">
            <p className="phenomenon-operation">
              Linear Combination（線形結合）
            </p>

            <h3>Dream（夢）</h3>

            <p>
              夢を、特定の一本の時間軸を進む状態ではなく、
              通常は分離されている複数の時間成分が
              一つの状態へ混ざり合ったものとして考えます。
            </p>

            <p>
              過去の場所に現在の人物が現れたり、
              異なる時代や出来事が同時に存在したりする夢は、
              複数の時間ベクトルの線形結合として
              表現できるかもしれません。
            </p>
          </article>

          <article className="phenomenon-card">
            <p className="phenomenon-operation">
              Inner Product（内積）
            </p>

            <h3>Déjà Vu（デジャブ）</h3>

            <p>
              現在経験している時間状態と、
              別の時間軸上にある状態との方向的な類似が、
              一時的に高まった状態として考えます。
            </p>

            <p>
              完全に同じ記憶ではなく、
              空間の配置や会話の流れ、光景の雰囲気など、
              状態全体の方向が近づくことで、
              「すでに経験した」という感覚が生まれるというモデルです。
            </p>
          </article>

          <article className="phenomenon-card">
            <p className="phenomenon-operation">
              Cross Product（外積）
            </p>

            <h3>Emergence（創発）</h3>

            <p>
             二つの時間状態の関係から、
             そのどちらにも属さない新しい可能性の方向が
             立ち上がる状態です。
            </p>

            <p>
              私たちの意識には、異なる時間に属する複数の記憶が共存しています。
              二つの記憶、選択、世界線が現在の中で交わるとき、
              どちらか一方だけからは導けなかった発想や選択、未来が生まれることがあります。
              本作品では、この新しい方向の出現を、二つの時間ベクトルの外積として表現しています。
            </p>
          </article>

          <article className="phenomenon-card">
            <p className="phenomenon-operation">
              Linear Transformation（線形変換）
            </p>

            <h3>Memory（記憶）</h3>

            <p>
              記憶を、過去の状態をそのまま保存したものではなく、
              現在の自己状態を通して
              過去が再構成されたものとして考えます。
            </p>

            <p>
              同じ出来事であっても、
              現在の価値観や経験によって
              意味の方向や強さが変わる様子を、
              回転、拡大、縮小、射影などの変換として表現します。
            </p>
          </article>

          <article className="phenomenon-card">
            <p className="phenomenon-operation">
              Projection（射影）
            </p>

            <h3>
              Choice and Branching
              <span>選択と分岐</span>
            </h3>

            <p>
              一つの現在状態から、
              複数の可能な時間方向が開かれていると考えます。
            </p>

            <p>
              選択とは可能性そのものを消すことではなく、
              複数の成分を持つ状態が、
              特定の方向へ射影される操作なのかもしれません。
              選ばれなかった方向も、
              時間空間の構造としては残り続けます。
            </p>
          </article>
        </div>

        <div className="concept-card further-considerations">
          <p className="section-label">
            Further Considerations（追加考察）
          </p>

          <p>
            予感は、まだ現在の世界線で観測されていない
            未来状態の一部が、現在へ弱く射影されたものとして。
          </p>

          <p>
            シンクロニシティは、因果的には離れた出来事が、
            時間ベクトル空間上では近い方向や
            共通の構造を持つ状態として考えることができます。
          </p>
        </div>
      </section>

      {/* 05 Interactive Design */}
      <section className="concept-section">
        <p className="section-label">
          Interactive Design（操作設計）
        </p>

        <div className="section-heading">
          <p className="section-number">05</p>
          <h2>
            数学的操作を、
            触れられる時間体験へ
          </h2>
        </div>

        <div className="section-text narrow-text">
          <p>
            統合後の作品では、
            共通の三次元空間を複数のモードから操作します。
          </p>

          <p>
            自動アニメーションを眺めるだけではなく、
            ユーザーがベクトルや係数を変化させる操作そのものが、
            作品の運動になります。
          </p>
        </div>

        <div className="mode-grid">
          <article className="mode-card">
            <p className="mode-index">01</p>
            <h3>Basis（基底）</h3>
            <p>
              三つの基底
              <InlineMath math="\mathbf{t}_1,\mathbf{t}_2,\mathbf{t}_3" />
              と、線形結合によって生成される
              時間状態を観察します。
            </p>
          </article>

          <article className="mode-card">
            <p className="mode-index">02</p>
            <h3>Inner Product（内積）</h3>
            <p>
              二つの状態ベクトルを操作し、
              内積、角度、射影、共鳴強度の変化を観察します。
            </p>
          </article>

          <article className="mode-card">
            <p className="mode-index">03</p>
            <h3>Cross Product（外積）</h3>
            <p>
              二つのベクトルが張る平行四辺形と、
              そこから垂直に立ち上がる
              新しい方向を観察します。
            </p>
          </article>

          <article className="mode-card">
            <p className="mode-index">04</p>
            <h3>Linear Map（線形写像）</h3>
            <p>
              回転、拡大、せん断、反転、射影によって、
              ベクトルと空間が変形する様子を観察します。
            </p>
          </article>
        </div>

        <div className="interaction-flow concept-card">
          <p className="section-label">
            Interaction Flow（操作の流れ）
          </p>

          <div className="interaction-steps">
            <span>モードを選択</span>
            <span aria-hidden="true">→</span>
            <span>ベクトルを操作</span>
            <span aria-hidden="true">→</span>
            <span>数式を更新</span>
            <span aria-hidden="true">→</span>
            <span>幾何学的変化を観察</span>
          </div>
        </div>
      </section>

      {/* 06 Concept Art */}
      <section className="concept-section">
        <p className="section-label">
          Concept Art（コンセプトアート）
        </p>

        <div className="section-heading">
          <p className="section-number">06</p>
          <h2>
            無数の時間方向と、
            その外側から差し込む視点
          </h2>
        </div>

        <figure className="concept-figure time-vector-concept-figure">
          <img
            src={timeVectorSpaceConceptArt}
            alt={
              '三つの時間軸、状態ベクトル、外積による新しい方向、' +
              '線形変換された空間、外部の観測者を表したコンセプトアート'
            }
          />

          <figcaption>
            発光する三つの時間軸は、
            無数に存在する時間方向から取り出した
            三次元モデルを表しています。
            二つの状態ベクトル、その間に形成される面、
            新しく立ち上がる方向、変形する空間、
            そして外部から差し込む観測者の視点を
            一枚に統合したコンセプトアートです。
          </figcaption>
        </figure>
      </section>

      {/* 07 Observer */}
      <section className="concept-section observer-section">
        <p className="section-label">
          Observer（観測者）
        </p>

        <div className="section-heading">
          <p className="section-number">07</p>
          <h2>
            どの時間軸にも
            配置されていない視点
          </h2>
        </div>

        <div className="section-text narrow-text">
          <p>
            この作品を操作する観測者は、
            画面上の
            <InlineMath math="\mathbf{t}_1,\mathbf{t}_2,\mathbf{t}_3" />
            のいずれにも配置されていません。
          </p>

          <p>
            観測者は時間ベクトル空間の外側から、
            複数の時間軸を同時に眺め、
            重ね、変換し、その関係を観察します。
          </p>

          <p>
            それは、一本の時間を生きる視点から一時的に離れ、
            複数の可能性を同時に見渡すための視点です。
          </p>
        </div>

        <blockquote className="concept-quote observer-quote">
          <p>
            時間の外側から眺めていると思った観測者も、<br />
            まだ見えていない時間軸の上に
            存在しているのかもしれない。
          </p>
        </blockquote>
      </section>

      {/* 08 Interactive Work */}
      <section className="concept-section">
        <p className="section-label">
          Interactive Work（インタラクティブ作品）
        </p>

        <div className="section-heading">
          <p className="section-number">08</p>
          <h2>
            時間ベクトル空間を
            自由に観察する
          </h2>
        </div>

        <div className="interactive-card">
          <h3>
            Time Vector Space
            <span>時間ベクトル空間</span>
          </h3>

          <p>
            三つの時間軸を自由に回転・拡大しながら、
            時間ベクトル空間の基礎モデルを観察できます。
            内積、外積、線形写像を含む4つのモードを
            共通UIから切り替えて観察できます。
          </p>

          <Link
            to="/works/time-vector-space"
            className="interactive-button"
          >
            Interactive Workを開く
          </Link>
        </div>
      </section>
    </main>
  );
}