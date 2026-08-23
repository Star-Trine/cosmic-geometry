# Natal Chart 設計仕様

## 1. 目的

Cosmic Geometry における Natal Chart は、出生時の天体配置を占星術チャートとして正確に観測しつつ、天体同士の関係から生まれる幾何学を平面上で明瞭に可視化するための表示領域とする。

この Natal Chart は Visual Profile とは役割を分ける。

- **Natal Chart**：実データに忠実な天体配置と関係性の観測
- **Analysis**：チャート構造の比較・分析
- **Visual Profile**：分析結果を Cosmic Geometry 独自の視覚言語へ再構成

Natal Chart では、視覚表現のために占星術データそのものを改変しない。

---

## 2. 基本方針

### 2.1 データの扱い

- backend / API の計算結果を正として扱う
- frontend 側でアスペクトやハウスを再計算しない
- 表示上の座標変換のみ frontend で行う
- Planet / House / Angle / Aspect の longitude は内部値をそのまま保持する
- 描画上の衝突回避で longitude を変更しない

### 2.2 Full / Partial

#### Full
出生時刻が判明しているチャート。

- Planet：表示
- Zodiac：表示
- House：表示
- Angle：表示
- Aspect：表示
- ASC をチャート基準角として使用

#### Partial
出生時刻不明のチャート。

- Planet：表示
- Zodiac：表示
- Aspect：表示
- House：非表示
- Angle：非表示
- Aries 0° をチャート基準角として使用
- House / Angle を推測して生成しない

---

## 3. SVG 基本構造

- SVG viewBox：`0 0 500 500`
- 中心座標：`250, 250`
- Outer Radius：`220`
- Zodiac Inner Radius：`170`
- 背景：透明
- StarCanvas は App 側の共通背景を利用し、Natal Chart 内で重複生成しない

主要レイヤーは以下の順序とする。

1. Base Layer
2. Zodiac Symbol Layer
3. House Layer
4. Angle Layer
5. Aspect Layer
6. Planet Layer
7. Interaction Layer（将来）

---

## 4. 座標変換

### 4.1 基準角

Full では ASC longitude を reference longitude とする。

Partial では reference longitude を `0°` とする。

### 4.2 longitude → screen angle

```text
screenAngle = 180° - (logicalLongitude - referenceLongitude)
```

この変換により、

- Full：ASC が常に左（9時方向）
- Partial：Aries 0° が常に左（9時方向）

となる。

### 4.3 polar coordinate

各天体・カスプ・角度・記号は、screenAngle と各レイヤー固有の radius から SVG 座標へ変換する。

---

## 5. Base Layer

`<g id="natal-chart-base-layer">`

### 表示要素

- 外円
- Zodiac 内円
- 12本の Zodiac divider

外円と内円そのものは固定。

Zodiac divider は reference longitude に合わせて回転する。

---

## 6. Zodiac Symbol Layer

`<g id="zodiac-symbol-layer">`

### 対象

12サイン。

```text
♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓
```

### 配置

各サインの論理中心 longitude：

```text
15°, 45°, 75°, ... , 345°
```

reference longitude に基づいて画面上の位置を算出する。

### 表示仕様

- 記号はページに対して常に正立
- チャート回転に合わせて記号自体を回転させない
- Font：`Noto Sans Symbols 2`
- fallback：
  - `Apple Symbols`
  - `Segoe UI Symbol`
  - `sans-serif`
- Font Size：`20px`

### 色

現状は共通色。

将来的に四元素などを利用した低彩度の色分けを検討可能だが、未確定。

---

## 7. House Layer

`<g id="house-layer">`

### データ

```ts
type HouseData = {
  house: number;         // 1..12
  cuspLongitude: number; // 0..360
};
```

### 表示条件

Full のみ。

Partial では表示しない。

### Cusp Line

各 House cusp longitude を reference longitude に基づいて配置。

線は中央付近から Zodiac Inner Radius まで伸ばす。

### House Number

House number は、隣接する cusp の中間 longitude に配置する。

360°境界を安全に処理する。

```text
width = normalizeDegrees(nextCusp - currentCusp)
midpoint = normalizeDegrees(currentCusp + width / 2)
```

Placidus 等の不等ハウスをそのまま可視化し、Equal House のように等分しない。

---

## 8. Angle Layer

`<g id="angle-layer">`

### 対象

- ASC
- MC
- DSC
- IC

### 表示条件

Full のみ。

### 配置

各 `angles[].longitude` の実値を使用する。

MC / IC 等を ASC から固定90°間隔で推測しない。

### 表示仕様

- House よりやや強い cyan / ice-blue 系
- House line よりやや太く、高 opacity
- 控えめな cyan glow
- Label はページに対して常に正立
- Label は Outer Radius の約99%付近に配置
- 内側の Planet / Aspect との干渉を避ける

---

## 9. Planet Layer

`<g id="planet-layer">`

### データ

```ts
type PlanetData = {
  id: PlanetId;
  name: string;
  longitude: number;
  sign: ZodiacSignId;
  degreeInSign: number;
  house: number | null;
  retrograde: boolean;
};
```

### 対象天体

- Sun
- Moon
- Mercury
- Venus
- Mars
- Jupiter
- Saturn
- Uranus
- Neptune
- Pluto

### 記号

```text
Sun      ☉
Moon     ☽
Mercury  ☿
Venus    ♀
Mars     ♂
Jupiter  ♃
Saturn   ♄
Uranus   ♅
Neptune  ♆
Pluto    ♇
```

### 配置

longitude を reference longitude に基づいて polar coordinate へ変換する。

### Close Cluster / Collision Avoidance

近接する Planet symbol の重なりを防ぐため、表示半径のみ変更する。

#### Close 判定

最短角距離が `<= 5°` の Planet を close とする。

360°境界も circular distance で判定する。

例：

```text
358° と 2° → 4°
```

#### Cluster

connected component 方式。

例：

```text
A-B = 4°
B-C = 4°
A-C = 8°
```

の場合も A / B / C は同一 display cluster とする。

#### Lane

- Base Radius：`outerRadius × 0.645`（約142）
- Lane Step：`outerRadius × 0.064`（約14）
- Planet longitude は変更しない
- Normalizer の Planet order を安定した lane order として利用

4天体程度まで自然に分離できる設計。

### Planet Color

Direct：

```css
fill: rgba(220, 245, 255, 0.96);
stroke: rgba(44, 84, 151, 0.34);
filter: drop-shadow(0 0 5px rgba(120, 220, 255, 0.42));
```

Retrograde：

```css
fill: rgba(220, 200, 255, 0.96);
filter: drop-shadow(0 0 5px rgba(170, 130, 255, 0.5));
```

Direct は ice blue、Retrograde は lavender とする。

---

## 10. Aspect Layer

`<g id="aspect-layer">`

### データ

```ts
type AspectType =
  | 'conjunction'
  | 'sextile'
  | 'square'
  | 'trine'
  | 'opposition';

type AspectData = {
  bodyA: PlanetId;
  bodyB: PlanetId;
  type: AspectType;
  angle: number;
  orb: number;
};
```

### 判定

backend の AspectData をそのまま使用する。

frontend 側で aspect 判定を再計算しない。

現在 backend では主要5アスペクトを対象とし、orb は共通で ±5°。

### 通常 Aspect

対象：

- Sextile
- Square
- Trine
- Opposition

各 Planet longitude を reference longitude に基づいて角度変換する。

ただし line endpoint は Planet symbol そのものまで伸ばさず、中央の固定 connection radius 上に配置する。

目安：

```text
connectionRadius ≒ 110
```

これにより、アスペクト関係全体が中央に集約され、天体配置から生まれる平面幾何学として視認しやすくなる。

### Conjunction

Conjunction は通常 Aspect と別処理。

Planet Layer で決定された最終表示位置と lane radius を再利用し、対象 Planet pair を局所的に接続する。

Planet symbol を貫通しないよう line trim を行う。

### Cluster と Conjunction の違い

Planet cluster は表示衝突回避。

Conjunction は backend が判定した占星術的 Aspect。

両者を混同しない。

例：

```text
A-B = 4°
B-C = 4°
A-C = 8°
```

- Display cluster：A / B / C
- Conjunction：A-B、B-C のみ

### 色相

Aspect type ごとに色相を分ける。

Cosmic Geometry の寒色・宇宙系の世界観を維持し、一般的な赤青緑の強い占星術ソフト配色は採用しない。

#### Conjunction
青白 / Ice White

#### Sextile
ティール / Blue-Green

#### Trine
明るいシアン / Aqua

#### Square
インディゴ / Blue-Violet

#### Opposition
ラベンダー系バイオレット

線幅、opacity、glow 半径、座標、描画順は既存設計を維持し、色相のみ type ごとに変更する。

### 設計思想

一般的な占星術チャートでは、アスペクト線は「どの惑星とどの惑星が関係しているか」を直接読むための情報線として扱われることが多い。

Cosmic Geometry では、それに加えて、

**天体同士の関係全体がどのような幾何学を形成しているか**

を中央で観測できる構造線として扱う。

Natal Chart 内ではあくまで実データに忠実な表示とし、より自由な抽象化は Visual Profile に委ねる。

---

## 11. Layer Order

最終的な描画順：

```text
Base
↓
Zodiac Symbol
↓
House
↓
Angle
↓
Aspect
↓
Planet
↓
Interaction（future）
```

Planet symbol が Aspect line より上に表示される。

---

## 12. Geometry Utility

座標計算・Planet placement・Aspect endpoint 等の幾何学処理は以下へ分離する。

```text
src/components/horoscope/natalChartGeometry.ts
```

目的：

- NatalChart.tsx の責務を軽減
- 同じ Planet placement を Aspect / Planet 間で共有
- geometry 単体テストを可能にする

---

## 13. Interaction Layer（Future）

将来的な候補：

- Planet hover / click
- Aspect hover / click
- House selection
- selected object highlight
- Information panel との連携

現段階では未実装。

Aspect SVG には将来利用できるよう `angle` / `orb` 等の data attribute を保持可能。

---

## 14. UI上の役割

Natal Chart は Horoscope Work の中央 Workspace に配置する。

通常モード：

```text
Birth Data | Natal Chart | Information
```

Natal Chart の役割は「観測」。

Analysis / Visual Profile と責務を混ぜない。

特に Visual Profile では Natal Chart の円形構造をそのまま再利用することを前提とせず、分析結果を棒グラフ・分布・密度・比率・独自幾何学等へ再構成する方向で別途設計する。

---

## 15. 非変更領域

Natal Chart の表示調整では、原則として以下を変更しない。

- backend
- API
- Type definition
- normalizer
- Aspect calculation
- House calculation
- Angle calculation
- Planet longitude
- AspectData
- orb 判定

frontend は API から受け取った確定データを視覚化する責務に限定する。

---

## 16. テスト方針

最低限以下を確認する。

- Full で ASC が左に固定される
- Partial で Aries 0° が左に固定される
- Zodiac symbol が正立する
- House が Full のみ表示される
- Angle が Full のみ表示される
- Aspect が Full / Partial 双方で表示できる
- 360°境界の Planet close 判定
- connected component による Planet cluster
- Planet longitude を collision avoidance で変更しない
- Conjunction と Planet cluster を混同しない
- unknown PlanetId を安全に無視する
- production build が成功する

---

## 17. 現在の到達点

実装済み：

- Base Layer
- Zodiac Symbol Layer
- House Layer
- Angle Layer
- Aspect Layer
- Planet Layer
- Full / Partial 表示差
- ASC / Aries reference rotation
- Planet collision avoidance
- Aspect type 別色相
- Geometry utility 分離
- Geometry / NatalChart tests

未実装・今後検討：

- Interaction Layer
- Zodiac symbol の意味的色分け
- Visual Profile
- Analysis の詳細設計
- 実データ Conjunction の追加目視確認
- 必要に応じた Aspect connection radius の微調整

---

## 18. コンセプト要約

Cosmic Geometry の Natal Chart は、単なる占星術チャートの再現ではなく、

**地球を基準に観測した天体配置と、その天体間関係から生まれる幾何学を、正確かつ静かな視覚空間として提示するチャート**

を目指す。

Natal Chart は「星を見る」ための場所。

Analysis は「星を読む」ための場所。

Visual Profile は「読み取った構造を形にする」ための場所。

この3段階を分離することで、占星術データの正確性と Cosmic Geometry 独自の視覚表現を両立する。
