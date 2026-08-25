# Horoscope Visual Profile Design v0.1

Last updated: 2026-08-24

## 1. Core Concept

Visual Profile は、出生図をもう一つの円形チャートとして再現するのではなく、既存の Horoscope / Analysis データを Cosmic Geometry 独自の視覚言語へ変換する。

基本設計思想：

- **Planet = Actor**
- **Sign = Behavior**
- **House = Stage**

別の言い方では、

- **Planet = Geometry**：基本の幾何学骨格
- **Sign = Transformation**：骨格の変形ルール
- **House = Environment**：骨格が存在する空間演出

Visual Profile は、各天体を個別に観察した後、最終的に全10天体を統合した Composite View へ発展させる。

Aspect と Retrograde は v0.1 の基本設計では一旦対象外とし、Planet / Sign / House の三層構造を先に成立させる。

---

## 2. Planet — Basic Geometry

Planet は Sign や House の影響を受ける前の「素体」とする。

色や占星術記号そのものを主役にするのではなく、各惑星を異なる**幾何学的生成原理**として定義する。

Unicode 記号（☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇）は、主役ではなく識別ラベルとして利用する。

| Planet | Actorとしての核 | Planet Object / Geometry |
| --- | --- | --- |
| ☉ Sun | 中心・自己・光源 | **Core / Radiation** — 中心核から光・線が放射する |
| ☽ Moon | 受容・反射・周期 | **Wave / Reflection** — 核の周囲を波紋・位相が循環する |
| ☿ Mercury | 伝達・接続・交換 | **Network / Signal** — 複数ノード間を細線・パルスが走る |
| ♀ Venus | 結合・調和・引力 | **Attraction / Symmetry** — 複数の核や形が引き合い、均衡する |
| ♂ Mars | 推進・切断・方向 | **Vector / Impulse** — 核から明確な軸・ベクトルが伸びる |
| ♃ Jupiter | 拡張・増幅 | **Expansion** — リングや構造が段階的に外へ広がる |
| ♄ Saturn | 境界・制限・構造 | **Boundary / Framework** — 核を囲う輪・格子・層が形成される |
| ♅ Uranus | 分断・跳躍・刷新 | **Disruption / Branching** — 対称性が崩れ、分岐・非連続構造が生まれる |
| ♆ Neptune | 拡散・溶解・浸透 | **Diffusion / Field** — 輪郭が波や場として周囲へ溶ける |
| ♇ Pluto | 圧縮・変容・再構成 | **Compression / Transformation** — 中心へ凝縮した構造が別構造へ変形する |

### Design Rule

Planet Object は「惑星の絵」ではなく「惑星の作用原理」を表現する。

例：

- Sun = 黄色い円、ではなく **中心から放射するシステム**
- Mercury = 水星記号、ではなく **接続と伝達を生成するネットワーク**
- Saturn = 土星の外観、ではなく **境界・層・構造を形成するシステム**

---

## 3. Sign — Transformation Rules

12サインごとに個別の図形を用意するのではなく、既存の二区分・三区分・四元素を Planet Object へ適用する。

### 3.1 Polarity / 二区分

| Polarity | Visual Transformation |
| --- | --- |
| Masculine | 外向き / 放射 / 展開 |
| Feminine | 内向き / 収束 / 内包 |

### 3.2 Modality / 三区分

| Modality | Visual Transformation |
| --- | --- |
| Cardinal | 起動 / 方向性 / 立ち上がり |
| Fixed | 安定 / 保持 / 明確な対称性 |
| Mutable | 分岐 / 変形 / 揺らぎ |

### 3.3 Element / 四元素

| Element | Visual Transformation |
| --- | --- |
| Fire | 発光 / 鋭さ / エネルギー |
| Earth | 結晶 / 格子 / 密度 |
| Air | 細線 / 接続 / 軽さ |
| Water | 波 / 曲線 / 流動 |

### Transformation Flow

```text
Planet Object
    ↓
Polarity — 方向性
    ↓
Modality — 運動・安定性
    ↓
Element — 質感・構造
    ↓
Sign-transformed Planet Object
```

### Example: Sun in Virgo

Virgo:

- Feminine
- Mutable
- Earth

Sun の `Core / Radiation` に適用すると、

- Feminine → 放射を外へ爆発させず、内向き・内包的にする
- Mutable → 放射構造に分岐・変形・揺らぎを持たせる
- Earth → 線や光へ結晶・格子・密度を与える

結果：

**内向き・可変的・結晶的な Sun Object**

---

## 4. House — Stage / Environment

House は Planet Object 自体の基本骨格を変更するものではなく、その Actor が存在する**舞台・空間条件**として扱う。

ハウス番号を単純に色へ割り当てるのではなく、そのハウスのテーマを可能な限り空間体験として翻訳する。

| House | 大まかなTheme | Stage / Environment |
| --- | --- | --- |
| 1 | 本質 | **Center / Front / Clear** |
| 2 | 所有 | **Dense / Stable / Grounded** |
| 3 | 好奇心 | **Connected / Branching / Local** |
| 4 | 家庭環境 | **Inner / Enclosed / Deep** |
| 5 | 娯楽・恋愛 | **Open / Expressive / Bright** |
| 6 | 労働・健康 | **Structured / Repetitive / Ordered** |
| 7 | パートナー関係 | **Dual / Mirrored / Balanced** |
| 8 | 相続・性 | **Hidden / Deep / Layered** |
| 9 | 高等学問 | **Expansive / Elevated / Distant** |
| 10 | 社会性 | **Public / Visible / Upper** |
| 11 | 交友関係 | **Networked / Distributed / Open** |
| 12 | カルマ | **Diffuse / Submerged / Veiled** |

### Candidate Stage Parameters

実装時には各Houseを、以下のような共通パラメータへ変換する。

- `depth`
- `openness`
- `visibility`
- `boundary`
- `density`
- `position`
- `symmetry`
- `connectivity`
- `brightness`

Brightness は演出の一要素に留め、House表現の中心にはしない。

### Example: 12th House

12th House は、

- 深い
- 境界が曖昧
- 部分的に隠れる
- 奥へ沈む
- ヴェール / 霧のような層
- 一部が背景へ溶ける

といった空間演出を候補とする。

---

## 5. Prototype

最初のSVGプロトタイプは以下とする。

### Prototype #1 — Sun in Virgo / 12th House

```text
Planet
Sun
→ Core / Radiation

Sign
Virgo
→ Feminine
→ Mutable
→ Earth

House
12th House
→ Deep
→ Veiled
→ Diffuse
```

目的：

- Planet / Sign / House が独立した視覚ルールとして成立するか確認
- SVGで線・光・グラデーション・透明度・filter等を使い、コンセプトアートを簡素な幾何学へ翻訳
- 「1つの意味に1つの視覚ルール」を基本として、過剰装飾を避ける

### Prototype #2 — Venus in Libra / 12th House

比較用の第二候補。

```text
Planet
Venus
→ Attraction / Symmetry

Sign
Libra
→ Masculine
→ Cardinal
→ Air

House
12th House
→ Deep
→ Veiled
→ Diffuse
```

同じ12th Houseでも Actor / Sign が変わることで、十分に異なるVisual Profileになることを検証する。

---

## 6. Planet Switching UI

Visual Profile Mode は専用2カラムWorkspaceを利用する。

### Left — Visualization

Visual Profile本体を表示する。

Planet Selector：

```text
☉  ☽  ☿  ♀  ♂  ♃  ♄  ♅  ♆  ♇
```

選択したPlanetに応じて、

```text
Planet Geometry
    ×
Sign Transformation
    ×
House Environment
```

を反映し、同一Workspace内でVisualizationを切り替える。

### Right — Profile Info

選択中のPlanetの生成根拠を表示する。

例：

```text
☉ Sun

Sign
Virgo

Polarity
Feminine

Modality
Mutable

Element
Earth

House
12th
```

Visual Profileが単なる抽象アートにならず、「なぜこの形になったか」をユーザーが追える構造とする。

---

## 7. Composite View

個別の10天体を観察した後、最終的に全10天体を統合した `COMPOSITE` View を用意する。

目的：

- 個別Planet Profile → Chart全体のVisual Profileへ移行
- 出生図固有の「構造」または「視覚的指紋」を生成

ただし、Compositeの具体的な生成アルゴリズムはv0.1では未確定。

まず10天体の個別Profileが成立してから設計する。

UI上では将来的な `COMPOSITE` 導線を予約してよい。

---

## 8. Data / Implementation Direction

既存backend調査により、新しい占星術計算は必須ではない。

既存データ：

```text
Planet
+ Sign
+ House
```

と既存のSign Classification：

```text
Polarity
Modality
Element
```

をfrontend側で結合することで、Planet単位のVisual Parameterを生成できる。

想定：

```text
PlanetVisualData
+
SignClassification
↓
PlanetVisualParameter
```

Visual Profile初版では、frontend helperによる派生処理で対応可能。

React componentは描画責務を中心とする。

---

## 9. v0.1 Summary

Visual Profile v0.1 の基本式：

> **Planetが幾何学の骨格を生成し、Signがその骨格を変形し、Houseが存在する空間を演出する。ユーザーは10天体を個別に観察し、最終的にComposite Viewで全体構造を見る。**

```text
Planet = Actor / Geometry
        ↓
Sign = Behavior / Transformation
        ↓
House = Stage / Environment
        ↓
Individual Planet Visual Profile
        ↓
10 Planet Observation
        ↓
Composite View
```

### Deferred

v0.1では以下を後回しとする。

- AspectのVisual Profileへの統合
- RetrogradeのVisual Profileへの統合
- Composite生成アルゴリズムの詳細
- 10天体すべてのSVG実装
- House Stage Parameterの最終数値
- Animation specification
