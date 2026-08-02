import '../../styles/ConceptLayout.css';

export default function TimeGeometryConcept() {
  return (
    <main className="concept-page">
      <header className="concept-hero">
        <p className="concept-eyebrow">Original Theory</p>

        <h1>Time Synchronization Experiment</h1>

        <p className="concept-subtitle">
          時間同期実験
        </p>

        <p className="concept-lead">
          複数の時間軸を、異なる速度で回転するベクトルとして表現し、
          時間同士のずれや同期を可視化する初期実験です。
        </p>
      </header>

      <section className="concept-section">
        <div className="section-heading">
          <p className="section-number">01</p>

          <div>
            <p className="section-label">Concept</p>
            <h2>複数の時間ベクトル</h2>
          </div>
        </div>

        <div className="section-text narrow-text">
          <p>
            この作品は、複数の時間軸を、それぞれ異なる速度で回転する
            ベクトルとして表現した初期的な可視化実験です。
          </p>

          <p>
            3本の時間ベクトル t1、t2、t3 は、それぞれ異なる角速度で
            動き続けます。そのなかで、ベクトル同士の向きが一時的に
            近づいた瞬間を「同期」とみなし、発光によって表現しています。
          </p>
        </div>
      </section>

      <section className="concept-section">
        <div className="section-heading">
          <p className="section-number">02</p>

          <div>
            <p className="section-label">Synchronization</p>
            <h2>同期という表現</h2>
          </div>
        </div>

        <div className="section-text narrow-text">
          <p>
            ここで扱う「同期」は、物理学上の時間同期を厳密に再現したもの
            ではありません。
          </p>

          <p>
            複数の時間軸が独立して進みながら、ある瞬間だけ位相や方向性を
            共有するというイメージを視覚化したものです。
          </p>

          <p>
            時間を直線ではなく回転運動として表すことで、時間のずれや周期、
            再接近、重なりといった関係を、幾何学的な動きとして観察します。
          </p>
        </div>
      </section>

      <section className="concept-section">
        <div className="section-heading">
          <p className="section-number">03</p>

          <div>
            <p className="section-label">Prototype</p>
            <h2>Time Vector Spaceへの発展</h2>
          </div>
        </div>

        <div className="section-text narrow-text">
          <p>
            本作は完成された時間理論ではなく、後の
            <strong> Time Vector Space </strong>
            へ発展する以前に制作された、時間軸の関係性を探るための
            初期プロトタイプです。
          </p>
        </div>

        <div className="interactive-card">
          <h3>Interactive Work</h3>

          <p>
            異なる速度で動く3本の時間ベクトルと、
            それらが同期する瞬間を観察できます。
          </p>

          <a
            href="/works/time-geometry"
            className="interactive-button"
          >
            作品を見る
          </a>
        </div>
      </section>
    </main>
  );
}