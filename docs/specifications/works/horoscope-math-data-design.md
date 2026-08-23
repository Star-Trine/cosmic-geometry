# Horoscope — Math / Data Design v0.1

## 1. Purpose（目的）
Horoscope作品における数値・データ・計算処理の設計を整理する。

対象：
- Reactから受け取る出生情報
- Node.jsからFreeAstroAPIへ送るデータ
- FreeAstroAPIから受け取る基礎データ
- Cosmic Geometry内部で使用するHoroscopeData
- 元素・区分・ハウス分布・アスペクト等の自前計算
- Visual Profileへ渡す特徴量

現時点ではFreeAstroAPI接続前の設計段階であり、レスポンス構造の詳細は接続実験後に確定する。

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
  ├─ 元素・区分集計
  ├─ ハウス分布集計
  ├─ アスペクト計算
  ├─ orb計算
  └─ Visual Profile用特徴量生成
  ↓
React
  ├─ Chart
  ├─ Planets
  ├─ Houses
  ├─ Angles
  ├─ Aspects
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

出生時刻不明の場合、ハウス・ASC/MC/DSC/IC・惑星のハウス配置などは確定値として扱わない。
月もその日の移動でサイン境界を跨ぐ可能性があるため、必要に応じて不確定性を表示する。

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
- 4元素集計
- 2区分集計
- 3区分集計
- ハウス分布
- 惑星分布
- 主要アスペクト判定
- orb
- Visual Profile用特徴量

APIレスポンスはそのままReact全体で使わず、Node.jsで内部形式へ正規化する。

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

実際のフィールド名・必須項目・エラー仕様はFreeAstroAPI接続実験後に確定する。

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
- Chart / Tables / Visual Profileで共通データを使えるようにする

例：

```text
API: abs_pos
↓
Cosmic Geometry: longitude
```

---

## 7. HoroscopeData（統合データ型）

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

## 8. Planet Data（天体データ）

最低限保持したい項目：

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
- `sign` → 元素・2区分・3区分・4区分集計
- `longitude` → アスペクト計算
- `house` → ハウス分布
- `retrograde` → 通常表示・Visual Profile

---

## 9. Aggregation Rules（集計ルール）

### 対象天体
主要10天体。

### 重み
**10天体をすべて同じ1票として扱う。**
太陽・月を特別扱いせず、惑星ごとの重み付けは行わない。

### 4 Elements（4元素）
10天体のサインから Fire / Earth / Air / Water を集計し、割合へ変換する。

### 2 Divisions（2区分）
10天体を同じ1票として集計。
Visual Profileでは Direction / Energy Direction への利用を想定。

### 3 Modalities（3区分）
10天体を同じ1票として集計。
Visual Profileでは Motion / Shape への利用を想定。

### 4 Divisions
Visual Profileでは Color / Texture への利用を想定。
具体的な変換ルールは今後決定する。

---

## 10. House Distribution（ハウス分布）

各ハウスに何天体存在するかを単純集計する。
初版では惑星ごとの重み付けは行わない。

Visual Profileでは Brightness / Stage / 空間密度などへの変換候補とする。

出生時刻不明の場合はハウス分布を生成しない。

---

## 11. Aspect Calculation（アスペクト計算）

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
Sun 10°
Jupiter 128°
angle = 118°
Trine = 120°
orb = 2°
```

±5°以内なのでTrine成立。

### 未確定事項
- orb境界値を含むか
- 同一天体ペアの重複除去方式
- 複数アスペクト候補がorb内に入る場合の優先順位

---

## 12. Visual Profile Data（特徴量）

```text
HoroscopeData
↓
Analysis / Feature Data
↓
VisualProfileData
```

現在の基本対応：

- 2区分 → Direction / Energy Direction
- 3区分 → Motion / Shape
- 4区分 → Color / Texture
- Planet → Light / Emphasis
- House → Brightness / Stage
- Aspect → Line / Relationship
- Retrograde → Reverse / Special Motion

具体的な数値変換式は未確定。

---

## 13. Visual Profile Principle（基本原則）

Visual Profileは人物解釈文を生成するものではない。

例：

```text
Fireが多い
活動宮が多い
男性区分が多い
```

という構造を、

```text
暖色
外向きの方向性
活発な形状変化
```

などへ一定ルールで変換する。

**InterpretationではなくVisualization。**

---

## 14. Error / Unknown Data（未確定・欠損データ）

今後整理する項目：

- FreeAstroAPI接続失敗
- APIレート制限
- 出生地検索失敗
- 不正な日付・時刻
- 出生時刻不明
- ハウス・アングル欠損
- 月サインが出生時刻で変化する可能性
- APIレスポンス形式変更

---

## 15. Current Decisions（現時点の確定事項）

- 2D Horoscope初版ではFreeAstroAPIを採用
- Tropical Zodiac
- Placidus House System
- 主要10天体
- ノードなし
- ASC左固定
- 逆行情報を使用
- 主要5アスペクト
- orb一律±5°
- 元素・区分集計は10天体すべて1票
- アスペクトは自前計算
- 元素・区分・惑星分布・ハウス分布を自前集計
- Visual Profile用特徴量を自前生成
- React側をFreeAstroAPI固有形式へ依存させない
- Node.jsをAPI変換・正規化・計算層として使用
- 出生時刻不明時に00:00を仮定しない
- 出生地は全世界対応を前提とする

---

## 16. Open Questions（今後決めること）

- FreeAstroAPIの実レスポンス確認
- FreeAstroAPIのエラー形式
- HoroscopeDataの正式な型
- BirthDataの正式な型
- 各基本データ型の正式フィールド
- Visual Profile各要素の具体的な数値変換
- VisualProfileDataの正式な型
- 出生時刻不明時のVisual Profileの扱い

---

## 17. Next Step（次の工程）

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
自前集計・アスペクト計算設計
↓
VisualProfileData設計
```

現時点では、これ以上APIレスポンス構造を推測で固定しない。
実データを確認したうえで Math / Data Design v0.2 へ更新する。
