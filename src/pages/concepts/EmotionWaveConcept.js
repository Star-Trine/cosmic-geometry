import '../../styles/ConceptLayout.css';
import './EmotionWaveConcept.css';
import emotionWaveImage from '../../assets/emotion-wave.png';
import { BlockMath } from 'react-katex';
import { Link } from 'react-router-dom';

export default function EmotionWaveConcept() {
  return (
    <main className="concept-page emotion-wave-concept">
      {/* ========================================= */}
      {/* Hero */}
      {/* ========================================= */}
      <header className="concept-hero">
        <p className="concept-eyebrow">
          COSMIC GEOMETRY / CONCEPT
        </p>

        <h1>
          感情の波
          <br />
          Emotion Wave
        </h1>

        <p className="concept-subtitle">
          感情を「波」として捉え、その重なりを可視化する
        </p>

        <p className="concept-lead">
          Emotion Wave は、人間の感情を固定された分類ではなく、
          互いに重なり合い、干渉しながら変化する「波」として捉える
          インタラクティブ作品です。
        </p>
      </header>

      {/* ========================================= */}
      {/* 01 概要 */}
      {/* ========================================= */}
      <section className="concept-section">
        <div className="section-heading">
          <p className="section-number">01</p>

          <div>
            <p className="section-label">OVERVIEW</p>
            <h2>概要</h2>
          </div>
        </div>

        <div className="section-text narrow-text">
          <p>
            Emotion Wave は、人間の感情を「波」として捉え、
            その重なりや干渉を可視化するインタラクティブ作品です。
          </p>

          <p>
            私たちは日常の中で、喜びや悲しみ、怒り、恐れなど、
            さまざまな感情を経験します。
          </p>

          <p>
            しかし、それらは単独で存在することは少なく、
            多くの場合、複数の感情が同時に重なり合い、
            一つの心の状態を形成しています。
          </p>

          <p>
            本作品では、その複雑な感情の構造を、
            色彩・波・幾何学によって視覚的に表現することを試みます。
          </p>
        </div>
      </section>

      {/* ========================================= */}
      {/* 02 制作背景 */}
      {/* ========================================= */}
      <section className="concept-section">
        <div className="section-heading">
          <p className="section-number">02</p>

          <div>
            <p className="section-label">ORIGIN</p>
            <h2>制作背景</h2>
          </div>
        </div>

        <div className="section-text narrow-text">
          <p>
            本作品は、僕が以前運営していた
            <strong> StarsPioneeR </strong>
            に掲載していた「波動」という記事を出発点としています。
          </p>

          <p>
            当時は、波の性質やフーリエ級数、可視光、感情理論など、
            それぞれ異なる分野の概念を一つの記事として考察していました。
          </p>

          <p>
            Emotion Wave は、それらを文章として読むだけではなく、
            実際に体験できる作品として再構築することを目的としています。
          </p>

          <blockquote className="concept-quote">
            <p>
              異なる感情は、重なり合う波のように、
              一つの心の状態を形づくる。
            </p>
          </blockquote>
        </div>
      </section>

      {/* ========================================= */}
      {/* 03 コンセプト */}
      {/* ========================================= */}
      <section className="concept-section">
        <div className="section-heading">
          <p className="section-number">03</p>

          <div>
            <p className="section-label">CONCEPT</p>
            <h2>コンセプト</h2>
          </div>
        </div>

        <div className="section-text narrow-text">
          <p>
            Emotion Wave では、
            一次感情をそれぞれ固有の「波」として定義します。
          </p>

          <p>
            一つひとつの感情は異なる色彩や波の性質を持ち、
            それらが重なり合うことで、新しい感情の表情が生まれます。
          </p>

          <p>
            この作品で表現する波は、
            物理現象としての波を正確に再現するものではありません。
          </p>

          <p>
            あくまで、人間の感情を理解するための
            芸術的・視覚的なモデルとして設計されています。
          </p>
        </div>
      </section>

      {/* ========================================= */}
      {/* 04 数学的背景 */}
      {/* ========================================= */}
      <section className="concept-section">
        <div className="section-heading">
          <p className="section-number">04</p>

          <div>
            <p className="section-label">MATHEMATICAL BACKGROUND</p>
            <h2>数学的背景</h2>
          </div>
        </div>

        <div className="section-text narrow-text">
          <p>
            Emotion Wave の表現には、
            数学における「波」の考え方を取り入れています。
          </p>

          <ul className="concept-list">
            <li>波の重ね合わせ（Superposition）</li>
            <li>フーリエ級数（Fourier Series）</li>
            <li>正弦波・余弦波</li>
            <li>周期関数</li>
          </ul>

          <p>
            実際の感情を数式だけで説明できるわけではありません。
          </p>

          <p>
            しかし、「複数の波が重なって新しい波形を形成する」
            という数学的な考え方は、
            本作品の世界観を形づくる重要な着想となっています。
          </p>

          <div className="formula-card">
            <p className="formula-label">フーリエ級数</p>

            <BlockMath
              math={String.raw`
\begin{aligned}
E(t)=\;&
\frac{a_0}{2}
+a_1\sin(\omega_1t+\phi_1)+b_1\cos(\omega_1t+\phi_1)\\
&+a_2\sin(\omega_2t+\phi_2)+b_2\cos(\omega_2t+\phi_2)\\
&+a_3\sin(\omega_3t+\phi_3)+b_3\cos(\omega_3t+\phi_3)\\
&+\cdots
\end{aligned}
`}
            />

            <BlockMath
              math={String.raw`
E(t)=
\frac{a_0}{2}
+\sum_{i=1}^{N}
\left[
a_i\sin(\omega_i t+\phi_i)
+
b_i\cos(\omega_i t+\phi_i)
\right]
`}
            />
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 05 心理学的背景 */}
      {/* ========================================= */}
      <section className="concept-section">
        <div className="section-heading">
          <p className="section-number">05</p>

          <div>
            <p className="section-label">PSYCHOLOGICAL BACKGROUND</p>
            <h2>心理学的背景</h2>
          </div>
        </div>

        <div className="section-text narrow-text">
          <p>
            Emotion Wave は、心理学者 Robert Plutchik が提唱した
            「感情の輪（Wheel of Emotions）」を参考にしています。
          </p>

          <figure className="concept-figure">
            <img
              src={emotionWaveImage}
              alt="一次感情と二次感情の関係を示した Emotion Wave の概念図"
            />

            <figcaption>
              一次感情と二次感情の関係を示した
              Emotion Wave の感情モデル
            </figcaption>
          </figure>

          <div className="concept-card">
            <h3>一次感情（基本波）</h3>

            <p>
              本作品では、
              喜び・信頼・恐れ・驚き・悲しみ・嫌悪・怒り・期待の
              8つを基本波として定義しています。
            </p>

            <p>
              それぞれの感情は固有の色彩を持ち、
              Emotion Wave における最小単位となります。
            </p>
          </div>

          <div className="concept-card">
            <h3>二次感情（複合波）</h3>

            <p>
              二次感情は、隣接する二つの一次感情が
              重なり合うことで生まれる複合波です。
            </p>

            <ul className="concept-list">
              <li>喜び × 信頼 → 愛</li>
              <li>信頼 × 恐れ → 服従</li>
              <li>恐れ × 驚き → 畏怖</li>
              <li>驚き × 悲しみ → 落胆</li>
              <li>悲しみ × 嫌悪 → 後悔</li>
              <li>嫌悪 × 怒り → 軽蔑</li>
              <li>怒り × 期待 → 攻撃性</li>
              <li>期待 × 喜び → 楽観</li>
            </ul>
          </div>

          <div className="concept-card">
            <h3>色彩について</h3>

            <p>
              本作品では、それぞれの一次感情に
              固有の色を割り当てています。
            </p>

            <p>
              この配色は心理学的な分類を参考にしつつ、
              Cosmic Geometry の世界観に合わせて再構成したものです。
            </p>

            <p>
              色そのものも、一つの「波」の性質として扱っています。
            </p>

            <ul className="concept-list">
              <li>喜び（Joy）：黄色</li>
              <li>信頼（Trust）：緑</li>
              <li>恐れ（Fear）：青緑</li>
              <li>驚き（Surprise）：水色</li>
              <li>悲しみ（Sadness）：青</li>
              <li>嫌悪（Disgust）：紫</li>
              <li>怒り（Anger）：赤</li>
              <li>期待（Anticipation）：オレンジ</li>
            </ul>

            <p>これらの色彩は、感情の分類だけでなく、重なり合う波や二次感情の表現にも用いられ、
              Emotion Wave の視覚的な基盤となっています。
            </p>
          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 06 まとめ */}
      {/* ========================================= */}
      <section className="concept-section">
        <div className="section-heading">
          <p className="section-number">06</p>

          <div>
            <p className="section-label">CONCLUSION</p>
            <h2>まとめ</h2>
          </div>
        </div>

        <div className="section-text narrow-text">
          <blockquote className="concept-quote">
            <p>
              Emotion Wave は、
              感情を分類するための作品ではありません。
            </p>
          </blockquote>

          <p>
            感情を「波」として捉え、その重なりや変化を通して、
            人間の内面を新しい視点から見つめ直すことを目的としています。
          </p>
        </div>
      </section>

      {/* ========================================= */}
      {/* Interactive Work */}
      {/* ========================================= */}
      <div className="interactive-card">
        <h3>Interactive Work</h3>

        <p>
          Emotion Wave を実際に体験できる
          インタラクティブコンテンツはこちら。
        </p>

        <Link
          to="/works/emotion-wave"
          className="interactive-button"
        >
          Explore Emotion Wave →
        </Link>
      </div>
    </main>
  );
}