# Horoscope --- Visual Profile Design v0.1

## 1. Purpose

Visual
Profileは、HoroscopeDataおよびHoroscopeAnalysisに含まれる出生図の構造を、色・光・形・線・動き・方向性などの視覚言語へ変換するCosmic
Geometry独自の可視化モデルである。

人物像を文章によって断定するInterpretationではなく、出生図の構造そのものをVisualizationすることを目的とする。

``` text
Data → Visual Profile
Visual Profile → Data
```

視覚的な特徴から元の出生図構造へ戻って理解できる設計とする。

## 2. Data Flow

``` text
HoroscopeData
+
HoroscopeAnalysis
↓
VisualProfileData
↓
React
├─ Circular / Chart-based Visual Profile
└─ Abstract Visual Profile
```

## 3. Basic Visual Layers

Visual Profileの基礎三層は以下とする。

``` text
2区分 → Direction / Energy Direction
3区分 → Motion / Shape Behavior
4区分（Elements） → Color / Texture
```

### 3.1 Polarity --- Direction

Masculine /
Feminineを二択として扱うのではなく、主要10天体の比率に基づいて方向性へ反映する。

-   Masculine優勢 → 外側へ広がる方向性
-   Feminine優勢 → 内側へ収束する方向性

比率によって方向性の強弱を連続的に変化させる。

### 3.2 Modality --- Motion / Shape

3区分は、Visual Profileの動き・形状変化にアクセントを与える。

-   Cardinal（活動） → 始動 / 放射 / 展開
-   Fixed（不動） → 安定 / 保持 / 密度
-   Mutable（柔軟） → 変形 / 流動 / 揺らぎ

単純な三択ではなく、各区分の比率をVisual Parameterへ反映する。

### 3.3 Elements --- Color / Texture

Fire / Earth / Air / Waterには固定1色を割り当てず、それぞれ色域（Color
Family）を持たせる。

例：

-   Fire → 赤 / 橙 / 金 / マゼンタ系
-   Earth → 茶 / 黄土 / 深緑 / 金属色系
-   Air → 緑 / シアン / 黄緑 / 淡色系
-   Water → 青 / 藍 / 紫 / 青緑系

4元素の構成比率を利用して、出生図固有のPaletteを生成する。

## 4. Element / Sign Structure

12サインは、4元素 × 3区分という既存の占星術構造をVisual
Profileでも利用する。

例：

``` text
Fire
├─ Aries        — Cardinal
├─ Leo          — Fixed
└─ Sagittarius  — Mutable
```

元素を親となるColor Family、サインをその派生表現として扱う。

12サインへ互いに無関係な12色を割り当てるのではなく、元素と3区分の構造を維持した視覚体系とする。

## 5. Planet --- Light Source / Emphasis

惑星はVisual Profileにおける「主役」として扱う。

惑星記号そのものは、通常のNatal Chartとして理解しやすい形を維持する。

Visual
Profileでは惑星を発光する光源として扱い、惑星が位置するサイン・元素から得られた色を発光表現へ反映する。

``` text
Planet
↓
Sign
↓
Element Color Family
↓
Light / Emphasis
```

## 6. House --- Stage

ハウスは「惑星＝役者」に対する「舞台」として扱う。

Visual Profileでは、単純なHouse Distributionの集計値だけではなく、

> どの惑星が、どのハウスという舞台に存在するか

という関係を重視する。

Planet × Houseによる具体的な視覚変換ルールは今後決定する。

House
Distribution自体はHoroscopeAnalysisの標準分析データとして維持する。

## 7. Aspect --- Line / Relationship

主要5アスペクトを線として表現する。

-   Conjunction → 接続 / 重なり
-   Sextile → 軽い線
-   Square → 鋭い線
-   Trine → 滑らかな線
-   Opposition → 強い対向線

orbは線の視覚強度へ変換する。

候補：

-   opacity
-   width
-   glow

orbが小さいほど関係性を強く表示する。

## 8. Retrograde --- Reverse Motion

逆行はVisual Profile上では運動方向の反転として表現する。

通常のデータ表示では R などの記号によって明示し、Visual
Profileでは対応する動きの方向を反転させる。

## 9. Full / Partial Visual Profile

出生時刻既知の場合はFull Visual
Profileとして、利用可能な全データを使用する。

出生時刻不明の場合はPartial Visual Profileとして、House /
Angleなど出生時刻依存データを確定値として使用しない。

Full / Partialの両方をUI上で扱える構成とする。

## 10. VisualProfileData Responsibility

VisualProfileDataはNode.js側で生成する。

``` text
HoroscopeData
+
HoroscopeAnalysis
↓
視覚的意味を持つVisual Parameters
↓
VisualProfileData
```

Node.jsでは、Direction / Motion / Shape Behavior / Palette /
Strengthなど、描画に意味を持つパラメータまで計算する。

SVG / Canvas / Three.jsなどによる具体的な描画処理はReact側の責務とする。

## 11. Two Visualization Modes

Visual Profileには二つの表示方式を採用する。

### 11.1 Circular / Chart-based Visual Profile

従来の円形Natal Chartを基礎として、VisualProfileDataによるColor / Light
/ Motion / Direction / Aspect Lines / House Stageなどを重ねる。

元の出生図とVisual Profileの対応関係を直接観察しやすい表示方式。

### 11.2 Abstract Visual Profile

HoroscopeData /
HoroscopeAnalysisから生成されたVisualProfileDataを利用し、従来のNatal
Chartとは異なる抽象的な視覚表現を生成する。

色・光・形・動き・方向性・線などによって、出生図の構造を独立したVisualとして表現する。

## 12. Shared Data Principle

Circular版とAbstract版で別々のVisual Profile計算を行わない。

Node.jsで一つのVisualProfileDataを生成し、同一人物・同一出生図について共通のデータを使用する。

``` text
VisualProfileData
↓
├─ Circular Renderer
└─ Abstract Renderer
```

二つの表示方式は「異なるVisual Profile」ではなく、「同じVisual
Profileを異なる視覚表現で観察する二つのView」として扱う。

## 13. Design Principle

Visual Profileは性格診断ではない。

例えば、

``` text
Fireが多い
Cardinalが多い
Masculineが多い
```

という出生図構造を、

``` text
暖色
活発な形状変化
外向きの方向性
```

などへ一定の規則によって変換する。

「この人物は情熱的である」と解釈するのではなく、

> この出生図にはこの構造があり、それを視覚言語へ変換するとこの形になる

という対応関係を観察する。

**InterpretationではなくVisualization.**

## 14. Open Questions

今後決定する項目：

-   Planet × Houseを具体的にどう視覚表現するか
-   12サインのColor Family内での具体的な色・質感
-   3区分の比率をMotion / Shape Parameterへ変換する具体式
-   2区分の比率をDirection Parameterへ変換する具体式
-   4元素比率からPaletteを生成する具体式
-   orbからopacity / width / glowへの具体的な変換式
-   VisualProfileDataの正式なTypeScript型
-   Full / PartialをVisualProfileData上でどう表現するか
-   Abstract Visual Profileの具体的な形状・描画方式
