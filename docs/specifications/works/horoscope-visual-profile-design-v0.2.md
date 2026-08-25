# Horoscope Visual Profile Design v0.2

Last updated: 2026-08-24

## 1. Purpose

Visual Profile は、出生図をもう一つの円形チャートとして再現するものではない。

Horoscope / Analysis から得られる占星術的構造を、Cosmic Geometry 独自の視覚言語へ翻訳し、
個々の天体の性質と、天体同士の関係を幾何学的に観察するための表現層とする。

Visual Profile は、人間そのものを定義したり、その全体像を完全に表現することを目的としない。
人間の人格・感情・経験は、限られた数値や視覚パラメータだけへ還元できるものではない。

本作品はあくまで、

> 出生図から得られる占星術的構造の一部を、幾何学的・視覚的パラメータへ翻訳する試み

として位置づける。

---

## 2. Core Concept

Visual Profile の基本設計思想：

- **Planet = Actor**
- **Sign = Behavior**
- **House = Stage**
- **Aspect = Relation / Transition**

描画・実装上の言い換え：

- **Planet = Geometry**  
  基本の幾何学骨格

- **Sign = Transformation**  
  Planet Geometryへ作用する変形パラメータ

- **House = Environment**  
  Planet Objectが存在する空間演出

- **Aspect = Relation / Transition**  
  Planet A と Planet B の間に生じる関係、および状態遷移

個別Planet Viewでは Planet / Sign / House を静的SVGとして観察する。

Aspectは個別Profileへ常時重ねるのではなく、
将来的な Relation View において、

```text
Planet A
    ↓
Aspect Transition
    ↓
Planet B
```

という動的な遷移として表現する。

---

## 3. Individual Planet View

### Role

Individual Planet View は、選択した1天体について、

```text
Planet Geometry
    ×
Sign Transformation
    ×
House Environment
```

を静的SVGとして表示する。

全10天体を一度に描画するのではなく、
Planet Selectorで1天体ずつ切り替えて観察する。

### Design Rule

- 個別Planet Viewは基本的に静的SVG
- 過剰な常時アニメーションは使用しない
- Planet / Sign / House の由来をProfile Infoで追える
- 単なる抽象アートではなく、生成根拠を確認できるUIとする
- 10天体を同時にDOMへ載せず、選択中Planetを中心に描画する

---

## 4. Planet — Basic Geometry

Planet は Sign や House の影響を受ける前の「素体」とする。

惑星の外観やUnicode記号そのものではなく、
その惑星の作用原理を幾何学的生成ルールとして表現する。

Unicode記号（☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇）は識別ラベルとして利用する。

| Planet | Actorとしての核 | Planet Geometry |
| --- | --- | --- |
| ☉ Sun | 中心・自己・光源 | **Core / Radiation** — 中心核から光・線が放射する |
| ☽ Moon | 受容・反射・周期 | **Wave / Reflection** — 波紋・位相・周期構造 |
| ☿ Mercury | 伝達・接続・交換 | **Network / Signal** — ノードと接続線による通信構造 |
| ♀ Venus | 結合・調和・引力 | **Attraction / Symmetry** — 複数核が引き合い均衡する |
| ♂ Mars | 推進・切断・方向 | **Vector / Impulse** — 起点・軸・方向性のある力 |
| ♃ Jupiter | 拡張・増幅 | **Expansion** — リングや構造が段階的に外へ広がる |
| ♄ Saturn | 境界・制限・構造 | **Boundary / Framework** — 輪・格子・層・枠 |
| ♅ Uranus | 分断・跳躍・刷新 | **Disruption / Branching** — 分岐・非連続・対称性の破壊 |
| ♆ Neptune | 拡散・溶解・浸透 | **Diffusion / Field** — 波・場・曖昧な輪郭 |
| ♇ Pluto | 圧縮・変容・再構成 | **Compression / Transformation** — 凝縮と再構成 |

### Planet Design Principle

例：

- Sun = 黄色い円ではなく、**中心から放射するシステム**
- Mercury = 水星記号ではなく、**接続と伝達を生成するネットワーク**
- Mars = 矢印アイコンではなく、**方向性と推進力を持つベクトル構造**
- Saturn = 土星の外観ではなく、**境界・層・構造を形成するシステム**

---

## 5. Sign — Transformation Parameters

Signは独立した固定SVGを12種類用意するのではなく、
既存の二区分・三区分・四元素を Planet Geometry へ作用させる。

### 5.1 Polarity / 二区分

| Polarity | Visual Transformation |
| --- | --- |
| Masculine | 外向き / 放射 / 展開 |
| Feminine | 内向き / 収束 / 内包 |

### 5.2 Modality / 三区分

| Modality | Visual Transformation |
| --- | --- |
| Cardinal | 起動 / 方向性 / 立ち上がり |
| Fixed | 安定 / 保持 / 持続 / 構造維持 |
| Mutable | 分岐 / 変形 / 揺らぎ |

### 5.3 Element / 四元素

| Element | Visual Transformation |
| --- | --- |
| Fire | 発光 / 鋭さ / エネルギー |
| Earth | 結晶 / 格子 / 密度 |
| Air | 細線 / 接続 / 軽さ / 透明感 |
| Water | 波 / 曲線 / 流動 |

### Transformation Flow

```text
Planet Geometry
    ↓
Polarity
    ↓
Modality
    ↓
Element
    ↓
Sign-transformed Planet Geometry
```

### Implementation Direction

将来的には概念的に、

```ts
PlanetGeometryConfig
+
SignTransformationParameters
```

を組み合わせて描画する。

例：

```ts
{
  polarity: 'feminine',
  modality: 'mutable',
  element: 'earth'
}
```

を描画向けパラメータへ変換し、

```text
direction
stability
branching
density
texture
symmetry
flow
```

などへ反映する。

SignはSVG上の独立レイヤーとして見える場合もあるが、
本質的には **Planet Geometryへの変形演算** として扱う。

---

## 6. House — Stage / Environment

House は Planet Geometryそのものを直接変更せず、
Actor が存在する「舞台・空間条件」を決める。

House番号を単純に色や明るさへ対応させるのではなく、
そのHouseのテーマを可能な限り空間体験へ翻訳する。

| House | 大まかなTheme | Stage / Environment |
| --- | --- | --- |
| 1 | 本質 | **Center / Front / Clear / Present** |
| 2 | 所有 | **Dense / Stable / Grounded / Held** |
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

### Candidate House Parameters

各Houseを将来的に共通パラメータへ変換する。

- `depth`
- `openness`
- `visibility`
- `boundary`
- `density`
- `position`
- `symmetry`
- `connectivity`
- `brightness`

Brightnessは演出の一要素に留め、
House表現の中心にはしない。

### House Principle

例：

- 1H → 中央・前面・明瞭
- 2H → 保持・蓄積・安定・低重心
- 7H → 対面・鏡像・二極・均衡
- 12H → 奥行き・曖昧な境界・ヴェール・部分的不可視

Houseは「背景画像」ではなく、
**Planet Objectの存在の仕方を決める空間場**として扱う。

---

## 7. SVG Layer Structure

Natal Chartと同様に、意味ごとに描画責務を分ける。

概念構造：

```text
Environment Layer
        ↓
Planet Geometry Layer
        ↑
Sign Transformation Parameters
        ↓
Label / Info Layer
```

Prototype段階ではSign由来の補助SVGを独立したSign Layerとして描いてもよい。

ただし将来的には、

```text
Planet Geometry + Sign Parameters
```

をひとつの生成処理として整理する方向を優先する。

Aspectはこの静的三層とは別に Relation / Transition として扱う。

---

## 8. Current Prototypes

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

視覚的方向：

- 中央の発光核
- 内向きに収束する放射
- Mutableによる微細な揺らぎ・分岐
- Earthによる結晶リング・格子・密度
- 12Hによるヴェール・楕円・奥行き・拡散

目標：

**内向き・可変的・結晶的な光源が、深く曖昧な空間に存在する**

Prototype #1 は実装済み。

---

### Prototype #2 — Mercury in Libra / 1st House

```text
Planet
Mercury
→ Network / Signal

Sign
Libra
→ Masculine
→ Cardinal
→ Air

House
1st House
→ Center
→ Front
→ Clear
→ Present
```

視覚的方向：

- 中心ノード
- 対称的なペアノード
- 細い接続線
- 外向きに広がるSignal
- Airによる軽量・透明な線
- 1Hによる浅い奥行き・明瞭な中心フィールド

目標：

**外向きで、軽く、均衡を持ちながら展開する通信構造**

Prototype #2 は実装済み。

---

### Prototype #3 — Mars in Scorpio / 2nd House

```text
Planet
Mars
→ Vector / Impulse

Sign
Scorpio
→ Feminine
→ Fixed
→ Water

House
2nd House
→ Dense
→ Stable
→ Grounded
→ Held
```

視覚的方向：

- 圧縮された起点
- 明確な方向軸
- Mars固有のVector / Impulse
- Feminineによる内向き・収束
- Fixedによる保持・持続
- Waterによる曲線・流動性
- 2Hによる密度・安定・蓄積・低重心

目標：

**内向きに圧縮され、強く保持された流動的なMars Vector**

Prototype #3 は Aspect Transition Prototype の終点候補として使用する。

---

## 9. Planet Selector UI

Visual Profile Mode は専用2カラムWorkspaceを利用する。

### Left — Visualization

選択中PlanetのVisual Profileを表示。

Prototype段階：

```text
☉ Sun
☿ Mercury
♂ Mars
```

将来的には主要10天体：

```text
☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇
```

を切り替える。

選択中のみSVGを中心に描画し、
未選択Planetの重い描画を同時保持しない方向を優先する。

### Right — Profile Info

選択中Planetの生成根拠を表示する。

例：

```text
☿ Mercury

Sign
Libra

Polarity
Masculine

Modality
Cardinal

Element
Air

House
1st House
```

Visual Profileが抽象アートだけにならず、
「なぜこの形になったのか」を確認できる構造とする。

---

## 10. Aspect — Relation / Transition

### Core Idea

Aspectは、個別Planet Profileへ単純な線を重ねるだけのものではない。

Visual Profileにおいては、

> **Planet Object同士の関係を、幾何学的な状態遷移として表現する**

ことを基本方針とする。

概念：

```text
Planet A
    ↓
Aspect Relation / Operator
    ↓
Planet B
```

数学的な厳密な写像そのものではないが、

- Planet A = 始点となる幾何学状態
- Aspect = 関係・変換作用
- Planet B = 遷移先となる幾何学状態

という「写像・関数」のような視覚イメージを採用する。

---

## 11. Aspect Data Policy

Aspect判定はVisual Profile側で再計算しない。

既存Natal Chart / backendで使用している `AspectData[]` をそのまま利用する。

対象：

- Conjunction
- Sextile
- Square
- Trine
- Opposition

Orb：

**±5° inclusive**

Visual Profileだけ別のAspect基準を持たない。

これにより、

```text
Natal Chart Aspect
=
Visual Profile Relation
```

の判定整合性を維持する。

---

## 12. Aspect Relation Grammar

Aspectは必ずしも「接続線」として描画しない。

各Aspectを、Planet AからPlanet Bへ移行する際の
**Relation Geometry / Transition Operator** として扱う。

| Aspect | Relationの核 | Transition候補 |
| --- | --- | --- |
| Conjunction | 融合・重なり | **Merge / Fusion** |
| Sextile | 協調・機会・橋渡し | **Bridge / Exchange** |
| Trine | 共鳴・自然な流れ | **Resonance / Flow** |
| Square | 緊張・摩擦 | **Tension / Cross-force** |
| Opposition | 対向・極性 | **Axis / Polarity** |

### Conjunction

- 2つの構造が重なる
- 一部の核・輪郭・ノードを共有
- 「線で結ぶ」より「融合する」

### Sextile

- 軽いBridge
- 補助ノード
- 細い経路
- 滑らかな交換・橋渡し

### Trine

- 共振
- 循環
- 滑らかな曲線
- 波や場によるFlow

### Square

- 張力
- 直交
- 押し返し
- フレームの歪みやCross-force

### Opposition

- 二極
- 明確な軸
- 中央の均衡点
- 対向する力

具体的なGeometryは、Individual Profileの実物を確認しながら調整する。

---

## 13. Relation View

従来の「10天体すべてを一枚に重ねるComposite View」は優先しない。

代わりに、

**Relation View / Aspect Transition View**

を発展ビューとして採用する。

### Example

```text
Sun / Virgo / 12H
        ↓
Sextile Transition
        ↓
Mars / Scorpio / 2H
```

再生例：

1. Planet A の静的Visual Profileを表示
2. Aspect Transition開始
3. Planet AのGeometryを徐々に遷移状態へ
4. Aspect固有のRelation Geometryを表示
5. Planet BのGeometryを立ち上げる
6. Planet Bの静的Visual Profileへ到達

すべてのPlanetを同時表示する必要はない。

---

## 14. Relation Sequence from AspectData

選択Planet Aについて、既存 `AspectData[]` から
Aを含むAspectだけを抽出できる。

例：

```text
Sun — Conjunction — Venus
Sun — Sextile — Mars
Sun — Square — Saturn
```

Relation Viewでは、

```text
Sun
→ Conjunction
→ Venus

Sun
→ Sextile
→ Mars

Sun
→ Square
→ Saturn
```

のように順番に観察できる。

Planet A が `planet1` / `planet2` のどちらに入っていても、
相手Planetを正規化して取得する。

概念処理：

```text
selectedPlanet
    ↓
AspectData.filter(selectedPlanetを含む)
    ↓
partnerPlanetを取得
    ↓
aspect.typeでTransitionを選択
    ↓
Planet A → Aspect Transition → Planet B
```

---

## 15. Orb as Visual Strength

Aspect成立条件そのものは既存の±5°を使用する。

将来的には、orbをRelation Animationの
**視覚強度パラメータ**として利用できる。

例：

```text
orbが0°に近い
→ Relation effectが明瞭 / 強い

orbが5°に近い
→ Relation effectが淡い / 弱い
```

ただし、これはAspect判定を変更するものではない。

v0.2では候補仕様とし、最終マッピング値は未確定。

---

## 16. Static vs Dynamic Responsibility

### Static

Individual Planet Profile：

```text
Planet
×
Sign
×
House
```

- 静的SVG中心
- Planet Selectorで切り替え
- 観察・比較を目的とする

### Dynamic

Relation View：

```text
Planet A
→ Aspect
→ Planet B
```

- Aspectを動的演出として使用
- Relation / Transitionを時間軸で観察
- Animationはここへ集中させる

この役割分担により、
個別Profileを軽量に保ちつつ、
動的表現をAspectへ集約する。

---

## 17. Performance Direction

現段階では表現体系の成立を優先し、
必要以上に早い最適化は行わない。

ただし以下を基本方針とする。

- 選択中Planetだけを中心に描画
- Individual Viewは静的SVG
- `blur / glow / filter`を過剰に重ねない
- 10天体をフル品質で同時描画しない
- Relation ViewはPlanet A / Transition / Planet Bを順次描画
- Geometryは複雑でもEffectは軽くする

10天体の実データ連携が完了した段階で、
Codeによるレスポンス・描画負荷調査を行う。

調査候補：

- SVG要素数
- filter / blur / glow負荷
- React再レンダリング
- Planet切替時のコスト
- モバイル描画性能
- Relation Animationの負荷

---

## 18. Data / Implementation Direction

既存backend調査により、
Planet / Sign / House用の新しい占星術計算は必須ではない。

既存：

```text
PlanetData
+
Sign Classification
+
House
```

からfrontend側で派生可能。

想定構造：

```text
PlanetVisualData
+
SignClassification
        ↓
PlanetVisualParameters
```

将来的な分離候補：

```text
visualProfile/
├─ planetGeometry
├─ signParameters
├─ houseEnvironment
├─ relationTransitions
└─ profileConfig
```

ただしPrototype段階では過剰な抽象化を避ける。

Individual Profileの比較検証後に、
10天体対応へ向けてconfig / renderer / helperへ分離する。

---

## 19. Development Phases

### Phase 1 — Individual Prototype

- Sun / Virgo / 12H
- Mercury / Libra / 1H
- Mars / Scorpio / 2H
- Planet Selector
- 静的SVG比較

### Phase 2 — Individual Profile Generalization

- Planet Geometryの分離
- Sign Parametersの分離
- House Environmentの分離
- 実Horoscopeデータ接続
- 主要10天体切り替え

### Phase 3 — Performance Review

- 10天体切替時の負荷調査
- SVG / filter最適化
- mobile確認

### Phase 4 — Relation Prototype

最初の固定データ例：

```text
Sun / Virgo / 12H
        ↓
Sextile
        ↓
Mars / Scorpio / 2H
```

Aspect Transitionの視覚表現を検証する。

### Phase 5 — Relation Data Integration

- `AspectData[]`接続
- 選択Planet基準のRelation抽出
- Major Aspect別Transition
- orb強度表現の検討

### Phase 6 — Further Expansion

必要に応じて：

- Retrograde
- Relation sequence UI
- 再生 / Pause / Step
- 全体構造の要約View
- Compositeの再検討

---

## 20. v0.2 Summary

Visual Profile v0.2 の基本構造：

```text
Individual View

Planet = Geometry
        +
Sign = Transformation
        +
House = Environment
        ↓
Static Planet Visual Profile
```

関係性：

```text
Relation View

Planet A
        ↓
Aspect = Relation / Transition
        ↓
Planet B
```

作品全体としては、

> Planetが幾何学の骨格を生成し、Signがその骨格を変形し、Houseが存在する空間を演出する。  
> ユーザーは各天体を静的なVisual Profileとして観察し、AspectによるRelation Viewでは、ある星の構造から別の星の構造へ移る関係性を時間的・幾何学的に体験する。

という構成を採用する。

---

## 21. Deferred / Not Finalized

v0.2時点で未確定：

- Moon / Venus / Jupiter / Saturn / Uranus / Neptune / Pluto の実SVG Geometry
- 12HouseすべてのStage Parameter数値
- 同一PlanetでSignだけ変えた場合の最終的な変形強度
- Aspect Transitionの具体的Animation timing
- orb → effect strength の最終式
- Retrograde表現
- Relation sequenceの再生UI
- Composite Viewを最終的に採用するか
