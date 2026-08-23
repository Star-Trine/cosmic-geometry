# Horoscope Common UI Design

## 1. Purpose

Horoscope作品の共通UI構成を定義する。

このUIでは、ホロスコープの元データ・分析結果・Visual Profileを、同一のNatal Chartを基準として観察できる構成を採用する。

Time Vector SpaceのUI設計をベースにしつつ、Horoscopeでは「幾何学空間」よりも「星・天球・出生図」を主役とする。

---

## 2. UI Concept

### Role Separation

- **Horoscope**
  - 出生図そのものを観察する
  - Planets / Houses / Angles / Aspectsなどの元データを確認する

- **Analysis**
  - 出生図の構造や分布を比較・把握する
  - Elements / Modalities / Polarities / Planet Distribution / House Distributionなどを扱う

- **Visual Profile**
  - HoroscopeAnalysisをCosmic Geometry独自の視覚言語へ変換する
  - 円環・線・透明度・光・幾何学構造などを用いた抽象表現を行う

---

## 3. Core UI Structure

Time Vector Spaceと同様、ページ全体は以下の階層で構成する。

```text
Work Header
↓
Mode Selector
↓
Main Workspace
```

Main Workspaceは3カラムを基本とする。

```text
┌────────────┬────────────────────┬──────────────┐
│ BIRTH DATA │                    │ INFORMATION  │
│            │     NATAL CHART    │              │
│ Date       │                    │ Selected     │
│ Time       │         ◎          │ Data         │
│ Location   │                    │              │
│            │                    │ Analysis     │
└────────────┴────────────────────┴──────────────┘
```

### Recommended Width

通常Modeでは以下を目安とする。

- Left / Birth Data: **約20%**
- Center / Natal Chart: **約50〜55%**
- Right / Information: **約25〜30%**

中央のNatal Chartを最も大きく見せる。

ただし、この比率は固定ではない。Modeの役割に応じてレイアウトを変更できる設計とする。

---

## 4. Natal Chart Policy

円形Natal Chartは、**Planets / Houses / Angles / Aspects / Analysis の通常Modeでは常時表示する**。

Natal Chartは通常Modeにおける作品全体の「基準座標」として扱う。

そのため、従来の `Chart` Modeは廃止候補とする。

一方、**Visual Profile ModeではNatal Chartを表示せず、専用の2カラムレイアウトへ切り替える**。  
Visual ProfileはNatal Chartの補助表示ではなく、HoroscopeAnalysisをCosmic Geometry独自の視覚言語へ変換した独立したVisualizationとして扱う。

### ModeごとのNatal Chart連動例

- **Planets**
  - 選択した惑星を強調
- **Houses**
  - House領域 / House cuspを強調
- **Angles**
  - ASC / MC / DSC / ICを強調
- **Aspects**
  - 対象Aspect lineを強調
- **Analysis**
  - Natal Chartは基準図として静かに表示
- **Visual Profile**
  - Natal Chartは非表示
  - 専用2カラムレイアウトへ切り替える
  - Visual ProfileそのものをMain Visualizationとして大きく表示する

---

## 5. Mode Selector

Mode SelectorはTime Vector Spaceと同様、ページ上部に横並びで配置する。

```text
PLANETS
HOUSES
ANGLES
ASPECTS
ANALYSIS
VISUAL PROFILE
```

選択中Modeのみ発光・境界線・背景変化などで強調する。

Mode Selectorは「同じ出生図を異なる視点から見る」という意味を持つ。

---

## 6. Visual Direction

Time Vector Spaceでは、

- Grid
- Coordinates
- Vector
- Geometric lines

などによって数学空間を表現している。

Horoscopeでは同じ表現をそのまま流用せず、**星空・天球・光**を中心とした視覚演出へ変更する。

### Base Layer Idea

```text
StarCanvas
──────────────
Faint Nebula / Glow
──────────────
Natal Chart
──────────────
Aspect Lines
──────────────
Planet Symbols
──────────────
UI Panels
```

Natal Chartを完全な不透明パネルへ閉じ込めず、**星空の中に出生図が浮かんでいるように見せる**。

---

## 7. Star / Space Effects

候補となる演出：

- StarCanvasを背景レイヤーとして使用
- 星のゆっくりした瞬き
- 背景星の微弱なparallax
- Zodiac circle外周の薄いglow
- Planet symbol周辺のhalo
- 選択Planetの発光
- Aspect lineの微弱な呼吸アニメーション
- 非常に薄いnebula / haze

派手な宇宙背景ではなく、**静かな天球観測空間**を目指す。

---

## 8. Birth Input

Birth Inputは計算前には重要だが、計算後は主役ではない。

そのため、

- 左Panelに配置
- 計算後はBirth Data Summaryとして簡略化
- Edit / Recalculate操作で再入力可能

とする。

常時大きな入力フォームを表示し続ける必要はない。

---

## 9. Visual Profile Layout

Visual Profile Modeのみ、通常の3カラム構成から専用の2カラム構成へ切り替える。

```text
┌────────────────┬──────────────────────────┐
│ PROFILE INFO   │      VISUAL PROFILE      │
│ / CONTROLS     │                          │
│                │            ◎             │
│ Summary        │                          │
│ Parameters     │   Geometric / Circular   │
│ Derived Data   │      Visualization       │
└────────────────┴──────────────────────────┘
```

Visual Profile側には十分な表示領域を確保し、円形表現・放射構造・複数レイヤー・アニメーションなどの演出を制限しない。

Mode SelectorはVisual Profile表示中も上部に残し、他のModeへすぐ戻れるようにする。

---

## 10. Information Panel

右側Panelは現在選択しているModeに応じて内容を切り替える。

例：

### Planets
- Planet
- Sign
- Degree
- House

### Houses
- House number
- Sign
- Cusp

### Angles
- ASC
- MC
- DSC
- IC

### Aspects
- Planet pair
- Aspect type
- Orb

### Analysis
- Elements
- Modalities
- Polarities
- Planet Distribution
- House Distribution

### Visual Profile
- Profile components
- Derived values
- Interpretation / structure explanation

---

## 11. Design Principle

Horoscope UIでは、

```text
Natal Chart = 通常Modeにおける出生図そのもの
Mode = 出生図を見る視点
Right Panel = 現在の視点の詳細
Visual Profile = 出生図構造を独立したVisualizationへ抽象化したMode
```

という関係を維持する。

通常ModeではNatal Chartを共通の基準図として残し、Visual Profile Modeではその基準図から離れて、抽象化されたVisual Profile自体を主役にする。

最終的には、

```text
Raw Horoscope Data
↓
Analytical View
↓
Visual Profile
```

と、データの抽象度が段階的に上がる構造を目指す。

---

## 12. Relationship with Cosmic Geometry

Time Vector SpaceとHoroscopeでは、

- Header
- Mode Selector
- 3-column Workspace
- Panel design
- Typography
- Border / Glow language

などのUI文法を共有する。

一方でMain Visualizationは作品ごとに変える。

### Time Vector Space
数学・幾何学・座標空間

### Horoscope
星・天球・出生図

これにより、Cosmic Geometry作品群としての統一感を保ちながら、各作品独自の世界観を表現する。
