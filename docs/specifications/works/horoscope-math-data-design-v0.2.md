# Horoscope — Math / Data Design v0.2

## 1. Purpose（目的）

Horoscope作品における数値・データ・計算処理の設計を整理する。

対象：

- Reactから受け取る出生情報
- Node.jsからFreeAstroAPIへ送るデータ
- FreeAstroAPIから受け取る基礎データ
- Cosmic Geometry内部で使用するHoroscopeData
- 標準的な集計・分析データ
- 元素・区分・ハウス分布・アスペクト等の自前計算
- Visual Profileへ渡す視覚変換データ

現時点ではFreeAstroAPI接続前の設計段階であり、実レスポンスとの差異やエラー仕様は接続実験後に確認する。

---

## 2. Overall Data Flow（全体データフロー）

```text
Birth Input
  ↓
React
  ↓
Node.js
  ├─ 入力検証
  ├─ FreeAstroAPI形式へ変換
  ↓
FreeAstroAPI
  ↓
Node.js
  ├─ APIレスポンスを正規化
  ├─ HoroscopeDataを生成
  ├─ 2区分・3区分・4区分を集計
  ├─ 惑星分布・ハウス分布を集計
  ├─ アスペクト計算
  ├─ orb計算
  ├─ HoroscopeAnalysisを生成
  └─ VisualProfileDataを生成
  ↓
React
  ├─ Chart
  ├─ Planets
  ├─ Houses
  ├─ Angles
  ├─ Aspects
  ├─ Analysis Tables
  └─ Visual Profile
```

---

## 3. Birth Input（React側の入力仕様）

### Birth Date

- 西暦
- `YYYY-MM-DD`

### Birth Time

- 24時間表記
- `HH:MM`
- 出生時刻不明を許可
- 不明の場合に `00:00` を仮定しない
- React内部では `time: null` / `timeKnown: false` を想定

出生時刻不明の場合、ハウス・ASC / MC / DSC / IC・惑星のハウス配置などは確定値として扱わない。

月もその日の移動によってサイン境界を跨ぐ可能性があるため、必要に応じて不確定性を表示する。

### Birth Place

- 全世界対応
- 都市・市区町村レベルで検索・選択
- UI上では都市名を表示
- 内部では緯度・経度・タイムゾーンも保持

```ts
type BirthInput = {
  date: string;
  time: string | null;
  timeKnown: boolean;

  place: {
    name: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
};
```

---

## 4. External API（採用API）

初版の2D Horoscopeでは **FreeAstroAPI** を採用する。

### FreeAstroAPIに任せる範囲

- 天体位置
- サイン位置
- ハウスカスプ
- 惑星のハウス配置
- ASC / MC / DSC / IC
- 逆行情報

### Cosmic Geometry側で自前計算する範囲

- 2区分集計
- 3区分集計
- 4区分（Elements）集計
- 惑星分布
- ハウス分布
- 主要アスペクト判定
- orb
- Visual Profile用の視覚パラメータ

APIレスポンスはそのままReact全体で使用せず、Node.jsでCosmic Geometry内部形式へ正規化する。

---

## 5. FreeAstroAPI Request（Node.js → API）

Reactの `BirthInput` をNode.jsでFreeAstroAPI用形式へ変換する。

出生時刻が判明している場合の想定：

```ts
const freeAstroRequest = {
  year: 1995,
  month: 9,
  day: 12,
  hour: 14,
  minute: 30,
  time_known: true,

  city: "Tokyo",
  lat: 35.6762,
  lng: 139.6503,
  tz_str: "Asia/Tokyo",

  house_system: "placidus",
  zodiac_type: "tropical"
};
```

出生時刻不明の場合は `00:00` を補完せず、`time_known: false` とする。

実際の送信形式はFreeAstroAPIの公式仕様と接続実験で確認する。

---

## 6. Normalization（正規化）

```text
FreeAstroAPI Response
↓
Node.js
↓
Cosmic Geometry内部形式
↓
HoroscopeData
```

目的：

- 外部API固有の項目名を内部へ漏らさない
- 将来APIを変更してもReact側への影響を小さくする
- Chart / Tables / Analysis / Visual Profileで共通データを使用できるようにする

例：

```text
API: abs_pos
↓
Cosmic Geometry: longitude
```

---

## 7. Three-Layer Data Model（三層データ構造）

Node.jsからReactへ返すデータは、役割ごとに三層へ分ける。

```text
horoscope
    ↓
analysis
    ↓
visualProfile
```

### 1. horoscope

出生図そのものを構成する基礎データ。

- Planets
- Houses
- Angles
- Aspects

通常のNatal Chartや各データ画面で使用する。

### 2. analysis

HoroscopeDataからNode.jsが自前計算する標準的な分析データ。

- 2区分
- 3区分
- 4区分（Elements）
- 惑星分布
- ハウス分布

これらはVisual Profile専用の裏データではなく、通常のホロスコープ生成アプリと同様に、表・数値としてユーザーにも表示する。

### 3. visualProfile

`horoscope` と `analysis` を元に、Cosmic Geometry独自の視覚言語へ変換したデータ。

---

## 8. HoroscopeData（基礎出生図データ）

現在存在する基本型：

- `PlanetData`
- `HouseData`
- `AnglePoint`
- `AspectData`

これらをまとめる親構造として `HoroscopeData` を追加する想定。

```ts
type HoroscopeData = {
  birth: BirthData;
  planets: PlanetData[];
  houses: HouseData[];
  angles: AnglePoint[];
  aspects: AspectData[];
};
```

詳細はFreeAstroAPIの実レスポンス確認後に確定する。

---

## 9. Planet Data（天体データ）

Visual Profileおよび通常表示の共通データとして、各天体では最低限以下を保持する想定。

```ts
type PlanetData = {
  name: string;
  longitude: number;
  sign: string;
  house: number | null;
  retrograde: boolean;
};
```

用途：

- `sign` → 2区分・3区分・4区分集計
- `longitude` → アスペクト計算
- `house` → ハウス分布
- `retrograde` → 通常表示・Visual Profile

---

## 10. Horoscope Analysis（標準分析データ）

### 対象天体

主要10天体。

### 重み

**10天体をすべて同じ1票として扱う。**

- 太陽を特別扱いしない
- 月を特別扱いしない
- 惑星ごとの重み付けは行わない

### 2 Divisions（2区分）

10天体を同じ1票として集計する。

例：

```text
Masculine 7
Feminine  3
```

Visual Profileでは主に Direction / Energy Direction へ利用する。

### 3 Modalities（3区分）

10天体を同じ1票として集計する。

例：

```text
Cardinal 5
Fixed    2
Mutable  3
```

Visual Profileでは主に Motion / Shape へ利用する。

### 4 Elements（4区分 / 元素）

**4区分とElementsは同一の分類として扱う。**

- Fire
- Earth
- Air
- Water

10天体を同じ1票として集計し、件数・割合を保持する。

例：

```text
Fire  4  → 40%
Earth 2  → 20%
Air   3  → 30%
Water 1  → 10%
```

Visual Profileでは主に Color / Texture へ利用する。

---

## 11. Planet / House Distribution（惑星・ハウス分布）

### Planet Distribution

天体がサイン・区分・その他の分類にどのように分布しているかを、必要に応じて標準分析として表示する。

具体的な表形式はUI設計時に決定する。

### House Distribution

各ハウスに何天体存在するかを単純集計する。

初版では惑星ごとの重み付けは行わない。

例：

```text
House 1  → 3 planets
House 2  → 0 planets
House 3  → 1 planet
...
House 10 → 4 planets
```

通常の分析データとして表示すると同時に、Visual Profileでは Brightness / Stage / 空間密度などへ利用する。

出生時刻不明の場合はハウス分布を生成しない。

---

## 12. Aspect Calculation（アスペクト計算）

主要5アスペクトを自前計算する。

- Conjunction — 0°
- Sextile — 60°
- Square — 90°
- Trine — 120°
- Opposition — 180°

Orbは **一律 ±5°**。

2天体の黄経差を求め、0°〜180°の最短角度に変換する。

```ts
const difference = Math.abs(a - b);
const angle = Math.min(difference, 360 - difference);
```

例：

```text
Sun 358°
Moon 2°
```

単純差は356°だが、最短角度は4°。

Aspect判定例：

```text
Sun     10°
Jupiter 128°

angle = 118°
Trine  = 120°
orb    = 2°
```

±5°以内なのでTrine成立。

### 未確定事項

- orb境界値を含むか
- 同一天体ペアの重複除去方式
- 複数アスペクト候補がorb内に入る場合の優先順位

---

## 13. HoroscopeAnalysis（想定型）

標準分析データの初期イメージ：

```ts
type HoroscopeAnalysis = {
  polarity: {
    masculine: number;
    feminine: number;
  };

  modalities: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };

  elements: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };

  planetDistribution: unknown;
  houseDistribution: number[];
};
```

正式な型は実装前に確定する。

---

## 14. Visual Profile Data（独自可視化データ）

Visual Profileは、出生図に含まれる複雑な情報を、色・光・形・線・動き・方向性といった視覚言語へ変換するCosmic Geometry独自の表現。

```text
HoroscopeData
+
HoroscopeAnalysis
↓
VisualProfileData
```

現在想定している基本対応：

- **2区分** → Direction（方向性） / Energy Direction（エネルギーの方向性）
- **3区分** → Motion（動き） / Shape（形状）
- **4区分 / Elements** → Color（色） / Texture（質感）
- **Planet** → Light（光） / Emphasis（強調）
- **House** → Brightness（明るさ） / Stage（舞台）
- **Aspect** → Line（線） / Relationship（関係性）
- **Retrograde** → Reverse（反転） / Special Motion（特殊な動き）

これらは完全な一対一変換ではなく、必要に応じて複数の視覚パラメータを組み合わせる。

具体的な数値変換式は未確定。

---

## 15. Visual Profile Principle（基本原則）

Visual Profileは人物像を断定する解釈文を生成するものではない。

例えば、

```text
Fireが多い
活動宮が多い
男性区分が多い
```

という出生図の構造を、

```text
暖色
外向きの方向性
活発な形状変化
```

などへ一定のルールで変換する。

> この出生図にはどのような構造的特徴があり、それを視覚言語へ変換するとどのような形になるのか。

という対応関係そのものを観察する。

**InterpretationではなくVisualization。**

---

## 16. Node.js → React Response（想定レスポンス）

Node.jsでは基礎出生図・標準分析・Visual Profile変換をまとめ、役割を分けてReactへ返す。

```ts
type HoroscopeResponse = {
  horoscope: HoroscopeData;
  analysis: HoroscopeAnalysis;
  visualProfile: VisualProfileData;
};
```

用途：

```text
horoscope
→ Natal Chart / Planet / House / Angle / Aspect

analysis
→ 2区分 / 3区分 / 4区分 / 分布などの表・数値表示

visualProfile
→ Cosmic Geometry独自の視覚表現
```

これにより、

```text
Data → Visual Profile
```

だけでなく、

```text
Visual Profile → Analysis → Horoscope Data
```

という逆方向の理解も可能にする。

---

## 17. Error / Unknown Data（未確定・欠損データ）

今後整理する項目：

- FreeAstroAPI接続失敗
- APIレート制限
- 出生地検索失敗
- 不正な日付・時刻
- 出生時刻不明
- ハウス・アングル欠損
- 月サインが出生時刻によって変化する可能性
- APIレスポンス形式変更

---

## 18. Current Decisions（現時点の確定事項）

- 2D Horoscope初版ではFreeAstroAPIを採用
- Tropical Zodiac
- Placidus House System
- 主要10天体
- ノードなし
- ASC左固定
- 逆行情報を使用
- 主要5アスペクト
- orb一律±5°
- 10天体をすべて同じ1票として集計
- 4区分とElementsは同一分類として扱う
- 2区分・3区分・4区分は通常画面でも表として表示する
- アスペクトも通常画面で表示する
- アスペクト判定はNode.js側で自前計算
- 元素・区分・惑星分布・ハウス分布をNode.js側で自前集計
- Visual Profile用視覚パラメータをNode.js側で生成する方針
- React側をFreeAstroAPI固有形式へ依存させない
- Node.jsをAPI変換・正規化・計算層として使用
- 出生時刻不明時に00:00を仮定しない
- 出生地は全世界対応を前提とする
- Node.js → Reactは `horoscope / analysis / visualProfile` の三層構造を基本とする

---

## 19. Open Questions（今後決めること）

- FreeAstroAPIの実レスポンス確認
- FreeAstroAPIのエラー形式
- HoroscopeDataの正式な型
- BirthDataの正式な型
- 各基本データ型の正式フィールド
- HoroscopeAnalysisの正式な型
- 惑星分布の具体的な定義
- Visual Profile各要素の具体的な数値変換
- VisualProfileDataの正式な型
- 出生時刻不明時のVisual Profileの扱い
- 標準分析表をどのUIモードへ配置するか

---

## 20. Next Step（次の工程）

まずFreeAstroAPIを最小構成で接続し、実レスポンスを確認する。

```text
Minimal API Test
↓
Response JSON確認
↓
必要項目を選別
↓
HoroscopeDataを確定
↓
HoroscopeAnalysisを確定
↓
VisualProfileDataを具体化
```

現時点では、これ以上APIレスポンス構造を推測で固定しない。

実データを確認したうえで Math / Data Design v0.3 へ更新する。
