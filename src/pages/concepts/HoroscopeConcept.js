import '../../styles/ConceptLayout.css';
import './HoroscopeConcept.css';
import horoscopeConceptArt from '../../assets/Conceptart-horoscope.png';
import completionNatalChart from '../../assets/horoscope/horoscope-completion-natal-chart.png';
import completionIndividualProfile from '../../assets/horoscope/horoscope-completion-moon-aquarius.png';
import completionRelationProfile from '../../assets/horoscope/horoscope-visual-profile-moon-conjunction-pluto-420w.gif';
import { Link } from 'react-router-dom';

const visualProfileMappings = [
  ['Planet', 'Actor / Geometry（主体 / 幾何学）'],
  ['Sign', 'Behavior / Transformation（振る舞い / 変形）'],
  ['House', 'Stage / Environment（舞台 / 環境）'],
  ['Aspect', 'Relation / Transition Operator（関係 / 状態遷移）'],
];

const viewModes = ['Planets', 'Houses', 'Angles', 'Aspects', 'Analysis', 'Visual Profile'];

function Section({ number, label, title, children }) {
  return (
    <section className="concept-section">
      <p className="section-label">{label}</p>
      <div className="section-heading">
        <p className="section-number">{number}</p>
        <h2>{title}</h2>
      </div>
      <div className="section-text narrow-text">{children}</div>
    </section>
  );
}

export default function HoroscopeConcept() {
  return (
    <main className="concept-page horoscope-concept">
      <header className="concept-hero">
        <p className="concept-eyebrow">Interactive Learning / Tool</p>
        <h1>Horoscope</h1>
        <p className="concept-subtitle">運命を記す、星の地図。</p>
        <div className="concept-lead">
          <p>Horoscopeは、出生した瞬間の天体配置を円環の中に記録する、西洋占星術の基本図です。</p>
          <p>Cosmic Geometryでは、この出生図を単なる占星術記号の集合としてではなく、天体・角度・分割・関係性によって構成された一つの幾何学的な情報構造として捉えます。</p>
        </div>
      </header>

      <Section number="01" label="Concept" title="コンセプト">
        <p>西洋占星術では、生まれた日時と場所を基準に、その瞬間の太陽・月・惑星の位置を黄道上へ配置した図をNatal Chart、またはBirth Chartと呼びます。</p>
        <p>円環は12のサインに分割され、その中へ天体、ハウス、ASCやMCなどの主要な感受点、そして天体同士の角度関係であるアスペクトが重ねられます。</p>
        <p>それぞれの要素には占星術的な象徴や解釈がありますが、出生図そのものを視覚的に見ると、点・線・角度・円・分割によって構成された複雑な幾何学構造でもあります。</p>
        <p>Horoscopeでは、この構造をインタラクティブな図として再構成し、一つの出生図を複数の視点から観察できる作品を目指します。</p>
      </Section>

      <section className="concept-section concept-art-section">
        <p className="section-label">Concept Art</p>
        <div className="section-heading">
          <p className="section-number">02</p>
          <h2>出生図を構成する円環と関係性</h2>
        </div>
        <figure className="concept-figure">
          <img src={horoscopeConceptArt} alt="12サインと天体を円環状に配置したHoroscopeのコンセプトアート" />
          <figcaption>
            Virgo = Ceres / Libra = Junoは、12分割されたConcept Art上で
            12天体を配置するためのデザイン上の独自対応です。
          </figcaption>
        </figure>
      </section>

      <Section number="03" label="The Twelve Signs" title="12サイン">
        <p>黄道は30度ずつ12の領域に分割され、それぞれが12サインに対応します。</p>
        <p>12サインは出生図における基本的な座標体系の一つであり、天体が黄道上のどの領域に位置しているかを示します。</p>
        <p>西洋占星術では、それぞれのサインに異なる象徴的性質が与えられ、天体の働き方を解釈するための一つのレイヤーとして扱われます。</p>
        <p>また12サインは、2区分・3区分・4区分といった複数の分類体系によって整理することができます。</p>
        <p>Horoscopeでは、これらの区分をVisual Profileへ変換するための重要な構造データとしても利用します。</p>
      </Section>

      <Section number="04" label="Planets" title="天体">
        <p>出生図では、太陽・月を含む主要な天体が黄道上に配置されます。</p>
        <p>西洋占星術では、それぞれの天体は異なる機能や象徴を持つものとして扱われます。</p>
        <p>Horoscopeでは、天体を単なる記号として表示するだけではなく、サイン・ハウス・アスペクトとの関係を含めたデータとして扱います。</p>
        <p>通常のNatal Chartでは一般的な惑星記号やサイン記号を使用しながら、発光・線・透明度・配色などを調整することで、Cosmic Geometryの世界観と調和する視覚表現を検討します。</p>
      </Section>

      <Section number="05" label="Houses" title="ハウス">
        <p>ハウスは、出生時刻と出生地を基準として空を12の領域に分割したものです。</p>
        <p>12サインが黄道上の位置を示すのに対し、ハウスは出生地点から見た空間的な区分として扱われます。</p>
        <p>西洋占星術では、それぞれのハウスが異なる人生領域を象徴すると考えられています。</p>
        <p>Horoscopeでは、このハウス配置をチャート上の空間的な構造として扱うと同時に、Visual Profileでは、各天体が存在するStage / Environmentとして利用します。</p>
      </Section>

      <Section number="06" label="Angles" title="主要感受点">
        <p>ASC、DSC、MC、ICは、出生時刻と場所から決まる出生図の主要な軸です。</p>
        <p>これらの点はチャートの方向性を決める基準となり、ハウス配置や出生図全体の構造にも深く関係します。</p>
        <p>Horoscopeでは、Natal Chartの視認性と一般的な読み方を保つため、ASCを左側に固定した表示を採用します。</p>
      </Section>

      <Section number="07" label="Aspects" title="アスペクト">
        <p>アスペクトとは、天体同士が形成する角度関係です。</p>
        <p>0度、60度、90度、120度、180度などの特定の角度は、西洋占星術において天体同士の関係性を読むための主要な要素として扱われます。</p>
        <p>幾何学的に見ると、アスペクトは円の内部を横切る線として現れます。</p>
        <p>複数の天体を結ぶことで、その出生図固有の幾何学的パターンが形成されます。</p>
        <p>Horoscopeでは、主要なアスペクトやorbを外部APIの結果だけに依存せず、取得した天体位置をもとに内部で計算し、その結果を通常表示とVisual Profileの両方へ利用します。</p>
      </Section>

      <Section number="08" label="Horoscope as Geometry" title="幾何学としてのホロスコープ">
        <p>出生図は占星術的な解釈のための図であると同時に、非常に幾何学的な構造を持っています。</p>
        <div className="horoscope-geometry-lines" aria-label="出生図を構成する幾何学要素">
          <p>12分割された円環。</p>
          <p>360度の角度。</p>
          <p>円周上に配置される天体。</p>
          <p>ハウスを形成する境界線。</p>
          <p>そして天体同士を結ぶアスペクト。</p>
        </div>
        <p>これらを重ねることで、一つの出生図には、その瞬間固有の幾何学的パターンが形成されます。</p>
        <p>Cosmic Geometryでは、この構造そのものを観察することもHoroscopeの重要な体験の一つとして扱います。</p>
        <p>通常のチャート構造は西洋占星術で一般的に用いられる形式を尊重しながら、背景・光・線・色彩・空間表現によって、Cosmic Geometryの世界観へ再構成します。</p>
      </Section>

      <Section number="09" label="Visual Profile" title="Visual Profile">
  <p>
    Visual Profileは、出生図に含まれる天体・サイン・ハウス・アスペクトを、
    色・形・動き・空間といった視覚言語へ変換するCosmic Geometry独自の表現です。
  </p>

  <p>
    Visual Profileでは、出生図の主要要素を次のような役割として扱います。
  </p>

  <dl className="visual-profile-map">
    {visualProfileMappings.map(([source, target]) => (
      <div key={source}>
        <dt>{source}</dt>
        <dd><span aria-hidden="true">→</span>{target}</dd>
      </div>
    ))}
  </dl>

  <p>
    SignはPolarity（2区分）、Modality（3区分）、Element（4元素）の分類をもとに、
    Planet Geometryの方向性、対称性、分岐、密度、曲率、色彩などへ変化を与えます。
    HouseはGeometryそのものを変形させるのではなく、
    その構造が存在するStage / Environmentとして空間表現へ作用します。
  </p>

  <p>
    Visual Profileには、単一の天体構造を観察するIndividualと、
    天体同士のアスペクトを状態遷移として可視化するRelationがあります。
  </p>

  <p>
    Relationでは、アスペクトを単なる接続線として扱いません。
    Planet AのGeometryが、アスペクト固有のTransition Operatorを通過し、
    Planet BのGeometryへ変化していく一種の写像として表現します。
  </p>

  <p>
    Conjunction（0°）はMerge / Fusion、Sextile（60°）はBridge / Exchange、
    Trine（120°）はResonance / Flow、Square（90°）はTension / Cross-force、
    Opposition（180°）はAxis / Polarityとして、それぞれ異なる状態遷移を持ちます。
  </p>

  <p>
    アスペクト自体に一方向の意味を与えているわけではなく、
    観察するPlanetを変更することで、同じ関係を双方のPlanetを起点として確認できます。
  </p>

  <p>
    ここで生成するものは、
    「この人物は情熱的である」「この人物は内向的である」といった人物像の断定ではありません。
  </p>

  <blockquote className="concept-quote">
    <p>
      「この出生図にはどのような構造的特徴があり、
      それを視覚言語へ変換するとどのような形になるのか」
    </p>
  </blockquote>

  <p>
    Visual Profileは人物そのものを定義するものではなく、
    出生図に含まれる構造と視覚表現の対応関係を観察するための試みです。
  </p>
</Section>

      <section className="concept-section visual-profile-completion">
        <p className="section-label">Completion Moment</p>
        <div className="section-heading">
          <h2>Visual Profile Completion Moment</h2>
        </div>
        <div className="section-text narrow-text visual-profile-completion__intro">
          <p>Visual Profileは、2026年8月25日 18:54 JSTに完成しました。</p>
          <p>Horoscopeが出生時刻を扱う作品であることから、この時刻をVisual Profile自身の一つの「birth time」として記録しています。</p>
          <p>以下は、その完成時刻をHoroscopeへ入力して生成したNatal Chart、Individual Visual Profile、Relation Visual Profileです。</p>
        </div>

        <div className="visual-profile-completion__figures">
          <figure className="concept-figure visual-profile-completion__figure visual-profile-completion__figure--natal">
            <div className="visual-profile-completion__figure-heading">
              <p>Natal Chart</p>
              <h3>Completion Moment — 2026.08.25 18:54 JST</h3>
            </div>
            <img src={completionNatalChart} alt="Visual Profile完成時刻 2026年8月25日18時54分のNatal Chart" />
            <figcaption>Visual Profile自身のbirth timeとして記録した完成時刻のNatal Chart。</figcaption>
          </figure>

          <figure className="concept-figure visual-profile-completion__figure visual-profile-completion__figure--individual">
            <div className="visual-profile-completion__figure-heading">
              <p>Individual</p>
              <h3>Moon in Aquarius / 11th House</h3>
            </div>
            <img src={completionIndividualProfile} alt="Visual Profile完成時刻のMoon in Aquarius 11th House Individual Profile" />
            <figcaption>Visual Profile完成時刻に生成されたMoonのIndividual Profile。</figcaption>
          </figure>

          <figure className="concept-figure visual-profile-completion__figure visual-profile-completion__figure--relation">
            <div className="visual-profile-completion__figure-heading">
              <p>Relation</p>
              <h3>Moon → Conjunction → Pluto</h3>
            </div>
            <img src={completionRelationProfile} alt="MoonからPlutoへのConjunction Relation Transition" />
            <figcaption>ConjunctionをMerge / FusionのTransition Operatorとして表現したRelation View。</figcaption>
          </figure>
        </div>
      </section>

      <Section number="10" label="Data and Visualization" title="データと可視化">
        <p>Horoscopeでは、外部APIを出生図生成に必要な基礎データの取得に利用します。</p>
        <p>一方で、元素・区分の集計、惑星分布、アスペクトやorbの判定、Visual Profileへ使用する特徴量など、作品の視覚表現に直接関係するデータは内部で計算します。</p>
        <p>これによって、外部サービスから得た情報をそのまま表示するのではなく、</p>
        <div className="horoscope-data-flow" aria-label="データから可視化までの変換過程">
          <span>Astronomical / Astrological Data</span><span aria-hidden="true">↓</span>
          <span>Structured Data</span><span aria-hidden="true">↓</span>
          <span>Cosmic Geometry Visualization</span>
        </div>
        <p>という変換過程そのものを作品の一部として扱います。</p>
      </Section>

      <section className="concept-section">
        <p className="section-label">Interactive Work</p>
        <div className="section-heading"><p className="section-number">11</p><h2>インタラクティブ作品</h2></div>
        <div className="interactive-card">
          <h3>Horoscope</h3>
          <p>Horoscopeでは、一つの出生図を複数の視点から観察できます。</p>
          <ul className="horoscope-view-modes" aria-label="Horoscopeの表示モード">
            {viewModes.map((mode) => <li key={mode}>{mode}</li>)}
          </ul>
          <p>それぞれの表示を切り替えることで、出生図を構成する要素を個別に確認しながら、それらがどのように一つの円環へ統合されているかを見ることができます。</p>
          <p>通常のデータ表示とVisual Profileは、一方向だけの関係ではありません。</p>
          <div className="horoscope-profile-flow" aria-label="データとVisual Profileの双方向関係">
            <span>Data</span><span aria-hidden="true">→</span><span>Visual Profile</span>
          </div>
          <p>として出生図の構造を視覚化すると同時に、</p>
          <div className="horoscope-profile-flow" aria-hidden="true">
            <span>Visual Profile</span><span>→</span><span>Data</span>
          </div>
          <p>として、目に見えた特徴から元の元素比率・惑星配置・ハウス分布・アスペクトへ戻ることもできます。</p>
          <p>最終的には、出生図を単に「読む」のではなく、データとして確認し、幾何学として観察し、視覚的な形として感じ取ることのできる体験を目指します。</p>
          <Link to="/works/horoscope" className="interactive-button">Interactive Workを開く</Link>
        </div>
      </section>
    </main>
  );
}
