# Horoscope Portfolio Case Study

## ホロスコープ作品 --- ケーススタディ

> **Status:** Draft / Work in Progress\
> **Project:** Cosmic Geometry\
> **Technology:** React / TypeScript / Node.js / SVG / Vercel Functions
> / External API

------------------------------------------------------------------------

## 1. Overview / Concept

Horoscopeは、出生情報から取得した占星術データを、数値・表・Natal
Chart・Analysis・Visual
Profileという複数の視点から観察するための作品です。

Cosmic
Geometryでは、占星術を単なる診断結果として表示するのではなく、天体・星座・ハウス・アスペクトという構造を、データと幾何学的な視覚表現の両方から扱うことを目指しています。

この作品では、出生情報の入力から外部APIとの通信、レスポンスの検証・正規化、独自計算、Reactへのデータ受け渡し、SVGによるNatal
ChartとVisual
Profileの描画、本番環境へのデプロイまでを一つのシステムとして設計しました。

中心となる課題は、複雑な占星術データをそのまま表示するのではなく、

**計算値の確認 → 構造の把握 → 傾向の分析 → 抽象的な視覚体験**

という複数段階で理解できるUIへ変換することです。

------------------------------------------------------------------------

## 2. Requirements / Challenges

主な要件は以下です。

-   生年月日・出生時刻・出生地からHoroscopeを生成すること
-   出生時刻が分かるFullモードと、不明なPartialモードの両方へ対応すること
-   外部APIのレスポンスを直接UIへ渡さないこと
-   主要10天体を安定したDomain Dataとして扱うこと
-   House / Angleが取得できない状態をエラーではなく正常なDomain
    Stateとして扱うこと
-   主要AspectをCosmic Geometry側で独自に判定すること
-   Natal ChartとVisual Profileを同じHoroscope Dataから生成すること
-   ローカル開発環境とVercel本番環境でService Logicを共有すること
-   外部APIのAPI KeyをFrontendへ公開しないこと
-   データの正確性と、SVG上の可読性・視覚表現を分離して設計すること

特に出生時刻不明時には、存在しない情報を仮の値で補完せず、利用できる情報だけで表示を成立させる必要がありました。

------------------------------------------------------------------------

## 3. Architecture / Data Flow

全体のデータフローは以下です。

``` text
React Birth Input
    ↓ HoroscopeRequest
POST /api/horoscope
    ↓
Vercel Function（production）
or local Node HTTP Server（development）
    ↓
Request Validation
    ↓
FreeAstroAPI Client
    ↓
Runtime Response Validation
    ↓
Domain Normalization
    ├─ 主要10天体
    ├─ Houses / Angles
    └─ 独自Aspect計算
    ↓
Analysis / VisualProfileData
    ↓ HoroscopeResponse
React state
    ├─ Information tables
    ├─ Natal Chart SVG
    ├─ Analysis
    └─ Visual Profile SVG
```

### Development

開発環境では、Reactから`/api/horoscope`へ送信したリクエストをCRA
development proxy経由でローカルNode HTTP Serverへ接続します。

``` text
React
→ /api/horoscope
→ CRA development proxy
→ localhost:3001
→ horoscopeServer.ts
```

### Production

本番環境では常駐Node Serverを使用せず、Vercel
FunctionをAPIの入口として使用します。

``` text
React
→ /api/horoscope
→ api/horoscope.ts
→ Request Validation
→ createHoroscope()
```

ローカルと本番ではHTTPの入口が異なりますが、Validation以降のService
Logicは共有しています。

これにより、環境ごとにHoroscope生成処理を重複実装せず、Backendの責務を再利用できる構造にしています。

------------------------------------------------------------------------

## 4. External API Boundary / Normalization

外部占星術APIにはFreeAstroAPIを使用しています。

外部APIから返されたJSONをReactへ直接渡すのではなく、BackendでRuntime
ValidationとNormalizationを行います。

``` text
unknown JSON
    ↓
Runtime Validation
    ↓
FreeAstroNatalResponse
    ↓
Normalization
    ↓
HoroscopeData
```

Normalizationでは、主に以下を行います。

-   必要な主要10天体のみを抽出
-   外部API固有のフィールド名を内部Domain Modelへ変換
-   longitude / house / signなどの値域を検証
-   Angle名を内部表現へ統一
-   不要な天体・ポイントを除外
-   出生時刻不明時のHouse / Angleを`null`として扱う
-   外部APIが返すAspect判定には依存せず、Cosmic Geometry側で再計算する

代表的な変換例です。

``` text
abs_pos  → longitude
pos      → degreeInSign
sign_id  → sign
dc       → DSC
```

この境界を設けることで、外部APIの仕様とFrontendの表示ロジックを直接結合せず、Cosmic
Geometry内部では統一したDomain Dataを扱えるようにしています。

------------------------------------------------------------------------

## 5. Domain Modeling / Calculation

Horoscopeでは、外部APIのレスポンス型、内部Domain型、API Request /
Response型、Frontend表示用型を責務ごとに分離しています。

主要なDomain Dataは以下です。

``` text
HoroscopeRequest
HoroscopeResponse
HoroscopeData
HoroscopeAnalysis
VisualProfileData

PlanetData
HouseData
AngleData
AspectData
```

### Major Aspect Calculation

主要Aspectは以下の5種類です。

  Aspect          Angle   Orb
  ------------- ------- -----
  Conjunction        0°   ±5°
  Sextile           60°   ±5°
  Square            90°   ±5°
  Trine            120°   ±5°
  Opposition       180°   ±5°

10天体の組み合わせは、同じペアを重複して計算しないように処理します。

また、天体間の角度は通常の差分ではなく、360°の円周上で最短となる角度を使用します。

``` ts
const difference = Math.abs(a - b);
const angle = Math.min(difference, 360 - difference);
```

例えば358°と2°の場合、通常の差分は356°ですが、円周上の最短距離は4°です。

このように、占星術上の判定に必要な計算をDomain
LogicとしてFrontendの描画処理から分離しています。

------------------------------------------------------------------------

## 6. Frontend UI / Information Design

Frontendでは、同じHoroscopeResponseを複数のViewへ展開します。

通常表示は以下の3カラムを基本としています。

``` text
Birth Data
│
├── Natal Chart
│
└── Information
```

Information側では、以下の表示モードを切り替えられます。

-   Planets
-   Houses
-   Angles
-   Aspects
-   Analysis
-   Visual Profile

Visual Profileでは専用レイアウトへ切り替え、

``` text
Profile / Control
│
└── Visual Profile
```

という構成で、Individual ViewとRelation Viewを操作できます。

Full /
Partialの状態も同じUI上で扱い、出生時刻不明時には利用できないHouse /
Angle情報を仮の値で補完しません。

------------------------------------------------------------------------

## 7. Natal Chart / Layered SVG

Natal ChartはSVGを複数のLayerへ分けて構成しています。

``` text
Base / Background
Zodiac
Houses
Angles
Planets
Aspects
```

FullモードではASCを基準としてチャートを回転し、ASCを左側の9時方向へ配置します。

PartialモードではASCが存在しないため、Aries 0°を基準として表示します。

また、近接する天体を読みやすくするために表示位置を調整しますが、元の`longitude`そのものは変更しません。

``` text
Domain Data
longitude = 天体本来の位置

Display Geometry
radial lane = SVG上の衝突回避
```

このため、

**Domain Data ≠ Display Position**

という責務分離を維持しています。

表示上の近接判定で作るDisplay
Clusterと、占星術上のConjunctionも別の概念として扱います。

**Display Cluster ≠ Conjunction**

これにより、データの意味を変更せずにNatal
Chart上の可読性を調整しています。

------------------------------------------------------------------------

## 8. Analysis / Visual Profile

### 8.1 Analysis

Analysisでは、主要10天体をSignに基づいて分類・集計します。

``` text
Polarity             → 2区分（Masculine / Feminine）
Modality             → 3区分（Cardinal / Fixed / Mutable）
Element              → 4区分（Fire / Earth / Air / Water）
Planet Distribution  → 12星座ごとの天体分布
House Distribution   → 12ハウスごとの天体分布
```

Polarity / Modality / Elementでは各天体を1票として集計し、Planet
Distributionでは12星座、House
Distributionでは12ハウスを0件の項目も含めて保持します。

出生時刻不明時でもSignに基づくPolarity / Modality / Element / Planet
Distributionは計算できます。一方、Houseを特定できないためHouse
Distributionは`null`として扱います。

### 8.2 Visual Profile

Visual Profileでは、占星術データを独自のVisual Grammarへ変換します。

``` text
Planet → Actor / Base Geometry
         天体ごとの基本形状

Sign   → Transformation / Behavior
         星座による形状・動きの変化

House  → Environment / Stage
         天体が配置される環境・背景表現

Aspect → Relation / Transition Operator
         天体間の関係を表す遷移・アニメーション
```

Individual Viewでは、Planet固有のGeometryにSign TransformationとHouse
Environmentを組み合わせます。

``` text
Planet Geometry
    + Sign Transformation
    + House Environment
        ↓
Individual Visual Profile
```

Relation Viewでは、Individual
ViewのPlanet表現を両端に再利用し、2天体の間へAspectごとのTransition
Operatorを配置します。

``` text
Planet A
    ↓
Aspect Transition Operator
    ↓
Planet B
```

Visual Profileは実際のPlanet / Sign / House / Aspect
Dataを表現へ接続していますが、SVG
Geometryそのものの意味付けは手設計です。

また、現時点ではOrbの強さをアニメーション速度や軌道へ連続的に反映する処理や、Retrograde専用のVisual
Effectは実装していません。

そのため、完全な自動生成ではなく、**実データと手設計のVisual
Grammarを接続した表現システム**として位置付けています。

------------------------------------------------------------------------

## 9. Testing / Representative Examples

Horoscopeではテスト数そのものを示すだけでなく、どの境界を保証しているかを重視しています。

代表的なテスト領域は以下です。

``` text
Request Validation
External API Boundary / Normalization
Full / Partial + Analysis
Circular Geometry / Natal Chart Display
Visual Profile / Aspect Operators
```

### 9.1 Request Validation

Frontendから送信されるHoroscopeRequestは、Backendの処理へ渡す前にValidationします。

代表的な検証対象は以下です。

-   date
-   time
-   timeKnown
-   latitude / longitude
-   timezone
-   place
-   Full / Partialの整合性

不正な入力は外部APIへ送信せず、処理の入口で拒否します。

テストでは、正常なRequestを受理することに加えて、欠損値や範囲外の値、不整合な入力が明示的にエラーになることを検証しています。

このValidationを外部API通信より前に配置することで、不正なデータが後続処理へ流れることを防いでいます。

### 9.2 Normalization / External API Boundary

外部APIレスポンスは`unknown`なデータとして受け取り、Runtime
Validationを通過したデータのみNormalizationします。

Normalizationのテストでは、例えば以下を検証しています。

-   API固有のデータから主要10天体だけを抽出すること
-   North Nodeなど不要なBodyを内部Domain Dataへ含めないこと
-   出生時刻不明時にAPI内部の仮時刻を出生時刻として扱わないこと
-   主要Aspectを各Planet Pairにつき1回だけ計算すること
-   Orb 5°の境界を含めること
-   実際の天体間角度を保持すること
-   必須天体の欠落を拒否すること
-   longitude / house / signなどの不正値を拒否すること

外部ライブラリやAPIそのものを再テストするのではなく、**外部データとCosmic
Geometry内部Domainの接続境界**を検証しています。

### 9.3 Full / Partial + Analysis

出生時刻の有無によって、利用できる情報を明確に分けています。

出生時刻が分かるFullモードでは、Signに基づく分類に加えてHouse
Distributionも計算します。一方、出生時刻が不明なPartialモードでは、Houseに依存しない情報はそのまま保持し、House
Distributionのみ`null`として扱います。

``` ts
const knownTime = calculateBasicAnalysis(createPlanets(1));
const unknownTime = calculateBasicAnalysis(createPlanets(null));

assert.deepEqual(unknownTime.polarity, knownTime.polarity);
assert.deepEqual(unknownTime.modalities, knownTime.modalities);
assert.deepEqual(unknownTime.elements, knownTime.elements);
assert.deepEqual(
  unknownTime.planetDistribution,
  knownTime.planetDistribution,
);
assert.equal(unknownTime.houseDistribution, null);
```

Analysisでは、主要10天体を以下の分類・分布へ集計します。

``` text
Polarity             → 2区分（Masculine / Feminine）
Modality             → 3区分（Cardinal / Fixed / Mutable）
Element              → 4区分（Fire / Earth / Air / Water）
Planet Distribution  → 12星座ごとの天体分布
House Distribution   → 12ハウスごとの天体分布
```

テストでは、主要10天体が各分類へ正しく集計されることに加え、出生時刻不明時にもSignに基づくAnalysisが維持されることを検証しています。

また、未対応のSignや主要10天体の欠落・重複など、不正なDomain
Dataが渡された場合には明示的にエラーとしています。

これにより、**「利用できる情報は維持し、成立しない情報は推測しない」**というFull
/ Partial共通のデータ設計を保証しています。

### 9.4 Circular Geometry / Natal Chart Display

Natal Chartでは、天体位置を0〜360°の循環座標として扱う必要があります。

例えば358°と2°の天体は、通常の差分では356°離れているように見えますが、円周上の最短距離では4°です。

``` js
expect(shortestAngularDistance(358, 2)).toBe(4);
```

この循環座標を基礎として、Natal Chartでは以下をテストしています。

-   0° / 360°境界をまたぐ最短角度
-   5°境界を含む近接天体の判定
-   複数の近接天体による連結クラスター
-   radial laneによる近接天体の分離
-   House cuspの円周上の幅と中点
-   Aspect lineの始点・終点
-   Conjunction用の局所的な接続線
-   短い線分を安全にtrimする処理

複数の天体が近接して表示される場合は、天体本来の`longitude`を変更するのではなく、描画時のradial
laneを分離します。

そのため、

**Domain Longitude ≠ Display Position**

という責務分離を保ち、天体データの正確性を維持したまま表示上の重なりを軽減しています。

同様に、表示上近接している天体をまとめるDisplay
Clusterと、占星術上のConjunctionは別の概念として扱っています。

**Display Cluster ≠ Conjunction**

これにより、Domain
DataとSVG上の表示調整を分離しながら、360°の円形チャートとしての可読性を確保しています。

### 9.5 Visual Profile / Aspect Operators

Visual Profileでは、HoroscopeのDomain
Dataをそのまま固定された図形へ変換するのではなく、複数の視覚的な役割を組み合わせて表現しています。

基本となるVisual Grammarは以下です。

``` text
Planet → Actor / Base Geometry
         天体ごとの基本形状

Sign   → Transformation / Behavior
         星座による形状・動きの変化

House  → Environment / Stage
         天体が配置される環境・背景表現

Aspect → Relation / Transition Operator
         天体間の関係を表す遷移・アニメーション
```

Individual Viewでは、

``` text
Planet Geometry
    + Sign Transformation
    + House Environment
        ↓
Individual Visual Profile
```

という構造で表示を組み立てています。

10天体×12星座×12ハウスの完成形を個別に用意するのではなく、Planet固有の形状にSignによるTransformationとHouseによるEnvironmentを組み合わせることで、入力データに応じたVisual
Profileを生成します。

出生時刻が不明でHouseを特定できない場合は、架空のHouseを補完せず、neutral
environmentを使用します。

テストでは、入力されたPlanet・Sign・Houseを使用しながら、Planet固有のGeometryの主題を維持して表示できることを検証しています。

Relation Viewでは、Individual
Viewと同じPlanet表現を両端に再利用し、その間にAspectごとのTransition
Operatorを配置します。

``` text
Planet A
    ↓
Aspect Transition Operator
    ↓
Planet B
```

主要5Aspectは、それぞれ異なる視覚的遷移として表現しています。

-   **Conjunction（0°）** --- 重なり・融合
-   **Sextile（60°）** --- 接続・橋渡し
-   **Square（90°）** --- 緊張・停止・方向転換
-   **Trine（120°）** --- 共鳴・循環・滑らかな移行
-   **Opposition（180°）** --- 対向・均衡・反転

Relationのテストでは、両端のPlanet・Sign・House表現を維持したまま、Aspectに対応するOperatorが表示され、Playから完了、Replayまでの状態遷移が成立することを検証しています。

なお、Aspectの実角度とOrbはDomain
Dataとして保持・表示していますが、現時点ではOrbの値によってアニメーションの軌道や速度を連続的に変化させる設計ではありません。

Aspect Transition
Operatorは、**Aspect種別を視覚的な遷移規則へ変換する表現レイヤー**として位置付けています。

``` text
Domain Data
    ↓
Visual Parameters
    ↓
Transformation / Environment
    ↓
Geometry / Transition
```

これにより、占星術データの判定・計算と独自の幾何学表現の責務を分離しながら、両者を一つのVisual
Systemとして接続しています。

------------------------------------------------------------------------

## 10. Production / Deployment

FrontendはVercelへデプロイしています。

Horoscope APIもVercel
Functionとして配置し、Frontendと同一Originの`/api/horoscope`から利用します。

``` text
Browser
    ↓
Vercel Frontend
    ↓
/api/horoscope
    ↓
Vercel Function
    ↓
Backend Service
    ↓
FreeAstroAPI
```

API KeyはBackend側のEnvironment
Variableとして管理し、Frontendへ公開しません。

開発途中では、ローカル環境ではCRA
proxyによってAPIへ接続できる一方、本番環境には同等のAPI入口が存在しないという差異がありました。

そこで、本番用の薄いVercel Function Adapterを追加し、既存Backend
Serviceを再利用する構成へ変更しました。

これにより、

``` text
Development
React → CRA proxy → Local Node Server → Service

Production
React → Vercel Function → Service
```

という形で、HTTP入口のみを環境ごとに切り替え、Horoscope生成の中心ロジックを共有しています。

------------------------------------------------------------------------

## Summary

Horoscopeでは、出生情報からVisual
Profileまでを単一の画面機能として作るのではなく、

``` text
Input
→ Validation
→ External API Boundary
→ Runtime Validation
→ Normalization
→ Domain Calculation
→ Analysis
→ Natal Chart Geometry
→ Visual Profile
→ Production
```

という複数の責務へ分離して設計しました。

特に、

-   外部APIと内部Domain Modelの分離
-   Full / PartialをDomain Stateとして扱う設計
-   360°の循環座標を扱うNatal Chart Geometry
-   Domain Dataを変更しない表示上の衝突回避
-   Planet / Sign / House / Aspectを役割分担したVisual Grammar
-   Individual ViewをRelation Viewへ再利用する構造
-   境界単位でのValidationとTest
-   ローカルとVercel本番でService Logicを共有する構成

を通して、データ処理・Frontend・Backend・Visualization・Testing・Deploymentまでを一つの作品として接続しています。

Cosmic
GeometryにおけるHoroscopeは、占星術データを表示するだけでなく、**複雑なDomain
Dataを整理し、意味を保ったまま独自のUIと幾何学表現へ変換するための設計・実装事例**として位置付けています。
