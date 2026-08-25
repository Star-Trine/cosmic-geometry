import '../../styles/TechNoteLayout.css';
import './HoroscopeTechNote.css';

const sections = [
  {
    number: '01',
    title: 'Overview（概要）',
    paragraphs: [
      'Horoscopeは、出生日時と場所から一般的なNatal Chartを生成し、その構造をCosmic Geometry独自のVisual Profileへ変換する作品です。',
      '現在は主要10天体、12サイン、Placidus方式の12 House、ASC・MC・DSC・IC、主要5 Aspect、Retrograde情報を扱い、標準的なAnalysis、SVG Natal Chart、出生時刻の有無に応じたFull / Partial、Visual Profileまでを実装しています。',
      '占星術解釈文を中心に提示するのではなく、出生図を構成する位置・分類・関係をデータとして解析し、色・形・線・空間関係へ変換して複数の視点から観察できることを作品の特徴としています。',
    ],
  },
  {
    number: '02',
    title: 'Technology Stack（使用技術）',
    paragraphs: [
      'フロントエンドにはReactとTypeScriptを使用し、Natal ChartとVisual ProfileはSVGとCSSで描画しています。バックエンドはNode.jsとTypeScriptで構築し、FreeAstroAPIとの通信とVercel Functionsによる本番Endpointを実装しています。',
      'frontend API clientとbackendでは、HTTP responseをunknownとして受け取り、最低限のruntime validationを通してから正式な型へ接続しています。API keyはserver sideの環境変数で管理し、frontendへ露出させません。',
      'TypeScriptは、FreeAstroAPI response、validation済みデータ、HoroscopeData、HoroscopeAnalysis、VisualProfileData、HoroscopeResponseという複数段階の境界を明確にし、フィールドの不一致や変換ミスを早期に検出するために採用しました。',
      '既存のCosmic Geometry作品はJavaScriptを維持しつつ、Horoscopeとその周辺機能ではJavaScriptとTypeScriptが共存する構成を採用しています。',
    ],
  },
  {
    number: '03',
    title: 'Component Structure（コンポーネント構成）',
    paragraphs: [
      'Horoscope.tsxが画面全体のstateと表示モードを管理し、BirthInput、NatalChart、PlanetTable、HouseTable、AngleTable、AspectTable、AnalysisTable、VisualProfileへ正式データを渡します。生成後の出生情報はBirth Data Summaryとして表示し、Edit / Recalculateから入力状態へ戻せます。',
      'Information ModeはPlanets、Houses、Angles、Aspects、Analysis、Visual Profileの6種類です。独立したChart Modeは設けず、Visual Profile以外の通常ModeではNatal ChartをWorkspace中央へ常時表示し、右側のInformation内容を切り替えます。',
      'Visual Profile Modeでは通常のNatal Chartを表示せず、VisualizationとProfile Infoを組み合わせた専用Workspaceへ切り替えます。Visual Profile内部のGeometryとRelationの構成は、08で詳しく扱います。',
    ],
  },
  {
    number: '04',
    title: 'Data Flow（データフロー）',
    paragraphs: [
      'アプリケーション全体は、Birth Input → frontend API client → POST /api/horoscope → request validation → FreeAstroAPI → response validation → normalization → HoroscopeData → HoroscopeAnalysis → VisualProfileData → HoroscopeResponse → React state → Natal Chart / Tables / Analysis / Visual Profile、という流れで接続されています。',
      'FreeAstroAPI固有のabs_pos、sign_id、dcなどをそのままfrontendへ渡さず、Node.js側でPlanetData、HouseData、AnglePoint、AspectDataを持つCosmic Geometry用のHoroscopeDataへ正規化します。これにより、外部仕様と作品内部の責務を分離しています。',
      'HoroscopeResponseはhoroscope、analysis、visualProfileを返します。Reactはこの単一responseをstateに保持し、HoroscopeDataをNatal ChartとInformation Tablesへ、HoroscopeAnalysisをAnalysis表示へ、VisualProfileDataをVisual Profileへ渡します。',
    ],
  },
  {
    number: '05',
    title: 'Backend Architecture（バックエンド構成）',
    paragraphs: [
      '複雑な天文暦計算を作品内部で一から構築する代わりに、出生図の基礎データ取得にはFreeAstroAPIを採用しました。Node.js backendが外部通信とAPI keyをserver sideへ隔離し、Reactと同じJavaScript / TypeScript系の技術スタックでデータ処理を構築しています。入力された出生情報は処理中のstateとrequestとして扱い、Cosmic Geometry独自のデータベースへ永続保存しません。',
      'backendではHoroscopeRequestを検証し、FreeAstroAPIへ通信した後、生responseを再度runtime validationします。検証済みデータをHoroscopeDataへ正規化し、主要10天体の選別、HouseとAngleの整理、主要5 Aspectの独自計算、HoroscopeAnalysisとVisualProfileDataの生成を行い、HoroscopeResponseへ統合します。',
      'この構成でbackendは単なる外部APIの中継ではなく、外部の占星術データをCosmic Geometryで扱える安定したデータへ翻訳する境界として機能します。各変換段階をTypeScript型で分けることで、API依存の構造がfrontendへ漏れることも防いでいます。',
      '本番環境ではVercel FunctionのPOST /api/horoscopeをHTTPの入口とし、既存のvalidation、FreeAstroAPI client、normalizer、Analysis、Visual Profile生成serviceを再利用しています。このEndpointによって、backend側で必要な処理を完了してから整えたresponseをfrontendへ渡す責務が明確になりました。',
    ],
  },
  {
    number: '06',
    title: 'Rendering and Calculation（描画・計算の仕組み）',
    paragraphs: [
      'Natal ChartはSVGのレイヤー構造で構成し、固定円環と12 Zodiac、主要10 Planet、Placidus方式の12 House、ASC・MC・DSC・IC、Aspectを描画しています。FullではASC longitudeを左9時方向の基準とし、PartialではASCを要求せずAries 0°を左基準としてZodiacとPlanetを配置します。',
      '主要AspectはConjunction、Sextile、Square、Trine、Oppositionの5種類です。Node.js側で天体ペアを一度ずつ評価し、360°境界を考慮した最短角距離と一律±5°のorbから再計算するため、FreeAstroAPIのAspect判定結果には依存しません。',
      'frontendのgeometry helperはlongitudeを共通座標系へ変換し、近接Planetの半径レーン、House cusp間の中間角、Angle位置、Aspect接続点を計算します。Conjunctionは近接位置を局所線で結び、それ以外のAspectは中央領域を横断する線として描画します。',
      'RetrogradeはPlanetDataに保持し、Table表示とNatal Chart上の色分けに反映していますが、Visual Profileで運動方向を反転する表現は未実装です。orbから0〜1のstrengthを生成するbackend処理は実装済みですが、線幅・透明度・発光などの描画値への全面的な接続は今後の調整項目です。',
    ],
  },
  {
    number: '07',
    title: 'Interaction Design（インタラクション設計）',
    paragraphs: [
      'Birth Inputでは出生年月日、出生時刻、City、Country、緯度、経度、IANA timezoneを扱います。Location検索で候補を選ぶと座標とtimezoneが自動反映され、必要に応じて手動でも修正できます。出生時刻不明を選択した場合はtimeをnullとして送信し、Partialデータを生成します。',
      '生成後はBirth Data SummaryでDate、Time、Location、Timezone、Full / Partialを確認でき、Edit / Recalculateから入力へ戻れます。Mode SelectorではPlanets、Houses、Angles、Aspects、Analysis、Visual Profileを切り替えます。',
      '通常ModeはBirth Data、Natal Chart、InformationのWorkspaceとして構成し、Visual ProfileではNatal Chartを外してVisualizationとProfile Infoの専用構成へ切り替えます。Partialでは利用できないHouse、Angle、House Distributionをエラーにせず、その理由を画面上へ表示します。',
      'Natal Chartでは惑星とサインにUnicode記号を採用し、細い線、透明度、発光、寒色系の配色によって一般的な出生図の読み方とCosmic Geometryの視覚世界を両立させています。',
    ],
  },
  {
    number: '08',
    title: 'Visual Profile（独自可視化）',
    paragraphs: [
      'Visual Profileは、HoroscopeDataを直接SVGへ置き換えるのではなく、HoroscopeAnalysisと組み合わせてbackendでVisualProfileDataへ変換した後に描画する、Cosmic Geometry独自の可視化レイヤーです。VisualProfileDataはFull / Partial、Direction、Motion、Palette、Planet、House、Aspectの描画に必要な共通パラメータを保持します。',
      'frontendではVisualProfileData.planetsをPlanetVisualParameterへ派生させ、Planet Actor、Sign Transformation、House Environmentとして分担します。主要10天体は独立したGeometry rendererを持ち、サインのPolarity・Modality・Elementが形状や質感を変化させ、HouseEnvironmentLayerが12 Houseの空間条件を描画します。Partialではhouseをnullとしてneutral environmentへ安全にフォールバックします。',
      'VisualProfile.tsxはIndividual / Relationの選択、実データとの対応、Profile Infoを統括し、planetRenderersのmapから各天体SVGを呼び出します。Geometryは天体別componentへ、House描画はHouseEnvironmentLayerへ分離し、Sign Transformationは純粋な変換helperとして共有しています。',
      'Relation ViewはHoroscopeData.aspectsから選択天体に関係するAspectを取り出し、Conjunction、Sextile、Square、Trine、OppositionをRelation / Transitionとして描画します。各SVGレイヤーとCSS animationを合成し、reduced motionにも対応しています。',
    ],
  },
  {
    number: '09',
    title: 'Challenges and Solutions（課題と解決方法）',
    paragraphs: [
      'JavaScript中心の既存projectへTypeScriptを導入する際は、既存の.jsを維持しながら.tsと.tsxを共存させました。frontendとbackendの型を用途ごとに整理し、外部API型とCosmic Geometry内部型を直接共有しない境界を設けています。',
      'FreeAstroAPIの実responseに対してruntime validationとnormalizationを実装し、出生時刻不明時に省略されるHouse・Angle情報やAPIが返す基準時刻を安全に扱いました。Location検索はGeoapifyとgeo-tzをserver sideで組み合わせ、都市候補から緯度・経度・IANA timezoneを取得しています。',
      'SVG描画では共通のlongitude変換、ASC基準回転、360°境界、近接Planet、Houseの不均等幅、Aspect接続点を純粋関数へ分離しました。AnalysisとVisual Profileも副作用のない変換層として構築し、Full / Partialの両方を自動テストで確認しています。',
      '現在残る課題は、Visual ProfileへのRetrograde運動修飾、orb strengthの描画値への本格接続、hoverやselectionなどのInteraction拡張、描画componentとbundleの最適化です。',
    ],
  },
  {
    number: '10',
    title: 'AI-assisted Development（AIを活用した開発）',
    paragraphs: [
      'AI支援を利用して、既存コードの調査、技術構成の比較、TypeScript導入、型設計、backendとAPI境界、validation / normalization、SVG geometry、Visual Profile、Full / Partial対応の実装を段階的に進めました。',
      '各工程では自動テスト、typecheck、production buildを実行し、結果と変更内容を確認しながら次の仕様と実装範囲を決定しています。',
      '作品コンセプト、UI / UX、Visual ProfileにおけるPlanet・Sign・House・Aspectの意味付け、採用する視覚表現は、対話と実画面の比較を通して判断しました。AIの提案をそのまま採用せず、既存projectへの影響と作品としての意味を確認しながら選択しています。',
    ],
  },
  {
    number: '11',
    title: 'Future Development（今後の拡張）',
    paragraphs: [
      '将来的な機能候補には、詳細な占星術解釈、AIによる解釈、相性診断、Transit、Progression、恒星占星術、Celestial Sphereとの連携があります。ユーザーアカウントとChart保存も候補ですが、現在は出生情報をCosmic Geometry独自のデータベースへ永続保存しない方針です。',
      'Visual Profileでは、Retrogradeによる運動方向の修飾、orb strengthを利用した線幅・透明度・発光の強化、hover・selection・比較表示などのInteractionを拡張できます。',
      '実装規模の拡大に合わせ、SVG componentの描画負荷、animation、bundle size、外部API通信を含むperformanceと保守性の最適化も継続課題です。',
      '本作品は初期設計からbackend、Natal Chart、Analysis、Visual Profileの実装・調整まで、約1か月をかけて制作しました。',
    ],
  },
];

export default function HoroscopeTechNote() {
  return (
    <main className="tech-note-page horoscope-tech-note">
      <header className="tech-note-hero">
        <p className="tech-note-eyebrow">TechNote(技術解説)</p>
        <h1>TechNote</h1>
        <p className="tech-note-work-title">Horoscope（ホロスコープ）</p>
          
        <div className="tech-note-intro">
          <p>
          このページでは、Horoscopeの設計、frontend / backend構成、
          データ処理、Natal Chart、Analysis、Visual Profileの実装について整理します。
          </p>
          <p>
          外部の占星術データをCosmic Geometry独自の構造と可視化へ変換するまでの技術的な流れを解説します。
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
    </main>
  );
}
