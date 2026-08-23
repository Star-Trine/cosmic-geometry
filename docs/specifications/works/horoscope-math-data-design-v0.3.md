# Horoscope --- Math / Data Design v0.3

## 1. Purpose（目的）

Horoscope作品における数値・データ・計算処理の設計を整理する。

対象：

-   Reactから受け取る出生情報
-   Node.jsからFreeAstroAPIへ送るデータ
-   FreeAstroAPIから受け取る基礎データ
-   Cosmic Geometry内部で使用するHoroscopeData
-   標準的な集計・分析データ
-   元素・区分・ハウス分布・アスペクト等の自前計算
-   Visual Profileへ渡す視覚変換データ
-   出生時刻既知／不明の2系統のデータ・UI設計

v0.3では、FreeAstroAPIへのMinimal API
Testと出生時刻不明テストで確認した実レスポンスを設計へ反映する。

------------------------------------------------------------------------

## 2. Overall Data Flow（全体データフロー）

``` text
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
  ├─ APIレスポンスをruntime validation
  ├─ API固有データを正規化
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

基本方針：

``` text
FreeAstroAPI固有形式
        ↓
      Node.js
        ↓
Cosmic Geometry内部形式
        ↓
       React
```

ReactをFreeAstroAPI固有のフィールド名・仕様へ直接依存させない。

------------------------------------------------------------------------

## 3. Birth Input（React側の入力仕様）

### Birth Date

-   西暦
-   `YYYY-MM-DD`

### Birth Time

-   24時間表記
-   `HH:MM`
-   出生時刻不明を許可
-   不明の場合に `00:00` を仮定しない
-   `time: null`
-   `timeKnown: false`

出生時刻不明の場合、以下は確定値として扱わない。

-   Houses
-   ASC / MC / DSC / IC
-   惑星のハウス配置
-   ハウス分布
-   ハウス／アングル依存のVisual Profile要素

一方、出生時刻不明でも利用可能な情報は可能な範囲で表示する。

### Birth Place

-   全世界対応
-   都市・市区町村レベルで検索・選択
-   UI上では都市名を表示
-   内部では緯度・経度・タイムゾーンも保持

``` ts
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

------------------------------------------------------------------------

## 4. External API（採用API）

初版の2D Horoscopeでは **FreeAstroAPI** を採用する。

Minimal API Testにより、Natal Chart
APIから実際のJSONレスポンスを取得できることを確認済み。

### FreeAstroAPIから取得する基礎情報

-   天体位置
-   サイン位置
-   ハウスカスプ
-   惑星のハウス配置
-   ASC / MC / DSC / IC
-   逆行情報

APIは主要10天体以外にNorth Node / Lilith /
Chiron等も返すが、初版では使用しない。

### Cosmic Geometry側で自前計算する範囲

-   2区分集計
-   3区分集計
-   4区分（Elements）集計
-   惑星分布
-   ハウス分布
-   主要アスペクト判定
-   orb
-   Visual Profile用の視覚パラメータ
-   出生時刻不明時の月サイン候補判定

------------------------------------------------------------------------

## 5. FreeAstroAPI Request（Node.js → API）

Node.jsからFreeAstroAPIへリクエストを送る。

既知時刻では年月日・時刻・場所・タイムゾーン・計算方式を送信する。

主要な計算条件：

``` text
House System : Placidus
Zodiac Type  : Tropical
```

出生時刻不明の場合：

``` text
time_known: false
```

とし、`hour` / `minute`は送信しない。

`00:00`を仮の出生時刻として送信しない。

------------------------------------------------------------------------

## 6. FreeAstroAPI Actual Response（実レスポンス）

### 出生時刻既知

実レスポンスでは以下を確認した。

-   `subject`
-   `planets`
-   `aspects`
-   `aspects_summary`
-   `confidence`
-   `houses`
-   `angles`
-   `angles_details`

`planets`には以下の13天体・感受点が含まれていた。

``` text
Sun
Moon
Mercury
Venus
Mars
Jupiter
Saturn
Uranus
Neptune
Pluto
North Node
Lilith
Chiron
```

初版ではこのうち主要10天体だけを使用する。

### 出生時刻不明

`time_known: false`で実通信した結果：

-   `subject.settings.time_known` → `false`
-   `planets[].house` → フィールド省略
-   `houses` → top-levelから省略
-   `angles` → top-levelから省略
-   `angles_details` → top-levelから省略
-   `confidence.houses` → `"unavailable"`
-   `confidence.angles` → `"unavailable"`
-   `confidence.overall` → `"medium"`

APIは出生時刻不明時に内部計算上の正午相当datetimeを返すが、これはユーザーの出生時刻として扱わない。

------------------------------------------------------------------------

## 7. API Boundary / Validation

Node.jsではAPIレスポンスを直接内部データとして使用しない。

``` text
unknown JSON
    ↓
validateFreeAstroNatalResponse()
    ↓
FreeAstroNatalResponse
    ↓
normalizeFreeAstroNatalResponse()
    ↓
HoroscopeData
```

runtime validationでは最低限以下を確認する。

-   top-level構造
-   subject
-   出生場所
-   計算設定
-   planets
-   主要10天体の存在
-   longitudeの範囲
-   sign_id
-   house番号
-   houses
-   angles_details
-   `time_known`による必須項目の分岐

出生時刻不明時は、APIがフィールドを`null`ではなく「省略」する仕様を許容する。

------------------------------------------------------------------------

## 8. Normalization（正規化）

FreeAstroAPIの実レスポンスから以下の変換を正式採用する。

``` text
abs_pos  → longitude
pos      → degreeInSign
sign_id  → sign
dc       → DSC
```

Angleの正規化元には `angles_details` を使用する。

`angles`は黄経のみの簡易形式であり、`angles_details`と重複するため内部データの正規化元には使用しない。

### 主要10天体の選別

APIの`id`を使って以下だけを選別する。

``` text
sun
moon
mercury
venus
mars
jupiter
saturn
uranus
neptune
pluto
```

APIの表示名ではなく安定した`id`で識別する。

North Node / Lilith / Chironは初版では除外する。

将来、小惑星・感受点等が作品に必要になった場合、その段階でbackend/API仕様を拡張する。

------------------------------------------------------------------------

## 9. HoroscopeData（正式内部データ構造）

``` ts
type HoroscopeData = {
  birth: BirthData;
  planets: PlanetData[];
  houses: HouseData[] | null;
  angles: AnglePoint[] | null;
  aspects: AspectData[];
};
```

出生時刻不明の場合：

``` text
planets[].house → null
houses          → null
angles          → null
```

これにより、同一のHoroscopeData構造で既知時刻／不明時刻の両方を扱う。

------------------------------------------------------------------------

## 10. BirthData（正式内部データ構造）

``` ts
type BirthData = {
  date: string;
  time: string | null;
  timeKnown: boolean;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  houseSystem: "placidus";
  zodiacType: "tropical";
};
```

既知時刻：

``` text
date: "1995-09-12"
time: "14:30"
timeKnown: true
```

不明時刻：

``` text
date: "1995-09-12"
time: null
timeKnown: false
```

FreeAstroAPIが不明時刻時に返す正午の時刻は`BirthData.time`へ保存しない。

------------------------------------------------------------------------

## 11. Planet Data（天体データ）

初版では主要10天体を対象とする。

``` ts
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

用途：

-   `id` → 安定した内部識別
-   `sign` → 2区分・3区分・4区分集計
-   `longitude` → アスペクト計算
-   `degreeInSign` → 表示
-   `house` → ハウス分布
-   `retrograde` → 通常表示・Visual Profile

------------------------------------------------------------------------

## 12. House Data

``` ts
type HouseData = {
  house: number;
  cuspLongitude: number;
};
```

FreeAstroAPI：

``` text
houses[].abs_pos
```

から、

``` text
cuspLongitude
```

へ正規化する。

出生時刻不明の場合、`houses`全体を`null`とする。

------------------------------------------------------------------------

## 13. Angle Data

対象：

-   ASC
-   MC
-   DSC
-   IC

``` ts
type AnglePoint = {
  name: "ASC" | "MC" | "DSC" | "IC";
  longitude: number;
  sign: ZodiacSignId;
  degreeInSign: number;
};
```

FreeAstroAPIの、

``` text
angles_details.asc
angles_details.mc
angles_details.dc
angles_details.ic
```

を正規化元とする。

``` text
dc → DSC
```

Vertexは初版では使用しない。

出生時刻不明の場合、`angles`全体を`null`とする。

------------------------------------------------------------------------

## 14. Horoscope Analysis（標準分析データ）

### 対象天体

主要10天体。

### 重み

**10天体をすべて同じ1票として扱う。**

-   太陽を特別扱いしない
-   月を特別扱いしない
-   惑星ごとの重み付けは行わない

### 2 Divisions（2区分）

-   Masculine
-   Feminine

### 3 Modalities（3区分）

-   Cardinal
-   Fixed
-   Mutable

### 4 Elements（4区分 / 元素）

4区分とElementsは同一分類として扱う。

-   Fire
-   Earth
-   Air
-   Water

件数と割合を保持する。

これらはVisual
Profile専用の裏データではなく、通常画面でも表・数値として表示する。

------------------------------------------------------------------------

## 15. Planet / House Distribution（惑星・ハウス分布）

### Planet Distribution

主要10天体のサイン・区分等の分布を標準分析として扱う。

### House Distribution

各ハウスに何天体存在するかを単純集計する。

初版では惑星ごとの重み付けは行わない。

出生時刻不明の場合はハウス分布を生成しない。

------------------------------------------------------------------------

## 16. Aspect Calculation（アスペクト計算）

FreeAstroAPIもアスペクトを返すが、Cosmic
GeometryではAPIのアスペクト判定を内部データ生成には使用しない。

主要10天体の黄経からNode.js側で再計算する。

対象：

-   Conjunction --- 0°
-   Sextile --- 60°
-   Square --- 90°
-   Trine --- 120°
-   Opposition --- 180°

Orb：

``` text
一律 ±5°
境界値を含む
orb <= 5°
```

2天体の黄経差：

``` ts
const difference = Math.abs(a - b);
const angle = Math.min(difference, 360 - difference);
```

各天体ペアは1回だけ評価する。

``` text
10天体
→ 45ペア
→ 最短角度
→ 主要5アスペクトとの角度差
→ orb <= 5°なら採用
```

`AspectData.angle`には実際の最短角度を保持する。

``` ts
type AspectData = {
  bodyA: PlanetId;
  bodyB: PlanetId;
  type: AspectType;
  angle: number;
  orb: number;
};
```

APIの`deg`はアスペクト基準角であり、内部`angle`へ直接変換しない。

------------------------------------------------------------------------

## 17. Unknown Birth Time（出生時刻不明）

出生時刻不明でも、取得・計算可能な情報を利用して部分的なHoroscopeを生成する。

### 表示可能

-   主要10天体
-   惑星サイン
-   惑星黄経
-   逆行
-   2区分
-   3区分
-   4区分 / Elements
-   惑星分布
-   主要アスペクト
-   ハウスに依存しないVisual Profile要素

### 表示しない／確定値として扱わない

-   Houses
-   惑星のハウス配置
-   ASC
-   MC
-   DSC
-   IC
-   House Distribution
-   ハウス／アングル依存のVisual Profile要素

React側では出生時刻既知／不明の2系統をUIとして扱える構造にする。

ただし占星術計算上の判断はReactへ持たせず、Node.jsが生成した内部データに基づいて表示を切り替える。

------------------------------------------------------------------------

## 18. Moon Sign Uncertainty（月サインの不確定性）

出生時刻不明の場合、月は1日の間に大きく移動するため、サイン境界を跨ぐ可能性がある。

正午1点の月位置だけを、その日の確定Moon Signとして扱わない。

### 方針

Node.js側で対象日の月サイン候補を判定する。

``` text
その日の範囲で同一サイン
→ 1候補

その日の途中でサイン移動
→ 2候補
```

内部表現の例：

``` ts
type MoonSignResult =
  | {
      certain: true;
      signs: [ZodiacSignId];
    }
  | {
      certain: false;
      signs: [ZodiacSignId, ZodiacSignId];
    };
```

React側では計算せず、Node.jsから受け取った結果を表示する。

``` text
certain: true
→ Pisces

certain: false
→ Pisces / Aries
```

具体的なAPI呼び出し方法・日境界の評価方法は実装時に確定する。

------------------------------------------------------------------------

## 19. Visual Profile Data（独自可視化データ）

Visual
Profileは、出生図に含まれる複雑な情報を、色・光・形・線・動き・方向性といった視覚言語へ変換するCosmic
Geometry独自の表現。

``` text
HoroscopeData
+
HoroscopeAnalysis
↓
VisualProfileData
```

基本対応：

-   **2区分** → Direction / Energy Direction
-   **3区分** → Motion / Shape
-   **4区分 / Elements** → Color / Texture
-   **Planet** → Light / Emphasis
-   **House** → Brightness / Stage
-   **Aspect** → Line / Relationship
-   **Retrograde** → Reverse / Special Motion

### 出生時刻不明時

ハウスに依存しない要素のみで部分的なVisual
Profileを生成できる設計とする。

利用可能：

-   2区分
-   3区分
-   4区分 / Elements
-   惑星
-   アスペクト
-   逆行

利用不可：

-   House
-   Angle
-   House Distribution

出生時刻不明だからVisual
Profile全体を生成不能とするのではなく、利用可能なデータだけで構成する。

------------------------------------------------------------------------

## 20. Visual Profile Principle（基本原則）

Visual Profileは人物像を断定する解釈文を生成するものではない。

出生図の構造を一定のルールで視覚言語へ変換する。

``` text
Data
↓
Structure
↓
Visual Parameters
↓
Visual Profile
```

**InterpretationではなくVisualization。**

------------------------------------------------------------------------

## 21. Node.js → React Response

基本構造：

``` ts
type HoroscopeResponse = {
  horoscope: HoroscopeData;
  analysis: HoroscopeAnalysis;
  visualProfile: VisualProfileData;
};
```

用途：

``` text
horoscope
→ Natal Chart / Planet / House / Angle / Aspect

analysis
→ 2区分 / 3区分 / 4区分 / 分布

visualProfile
→ Cosmic Geometry独自の視覚表現
```

出生時刻不明時も同じ大枠を維持し、利用不能なデータを`null`等で明示する。

------------------------------------------------------------------------

## 22. API Data Adoption Policy

### 初版で採用

-   `subject`の必要な出生・計算条件
-   主要10天体
-   houses
-   angles_detailsのASC / MC / DC / IC

### APIから返るが初版では内部データへ採用しない

-   North Node
-   Lilith
-   Chiron
-   Vertex
-   declination_deg
-   aspects_summary
-   is_applying
-   variant
-   Julian Day
-   Delta T
-   confidence

### API aspects

FreeAstroAPIの`aspects`は本番のHoroscopeData生成には使用しない。

開発時に自前Aspect計算との比較・検証へ利用することは可能。

------------------------------------------------------------------------

## 23. Current Decisions（v0.3確定事項）

-   2D Horoscope初版ではFreeAstroAPIを採用
-   FreeAstroAPI実通信成功
-   Tropical Zodiac
-   Placidus House System
-   初版は主要10天体
-   North Node / Lilith / Chironは初版対象外
-   将来必要になった段階で追加天体・感受点を拡張
-   ASC左固定
-   逆行情報を使用
-   `abs_pos → longitude`
-   `pos → degreeInSign`
-   `sign_id → sign`
-   `dc → DSC`
-   `angles_details`をAngle正規化元とする
-   APIレスポンスをNode.jsでruntime validationする
-   React側をFreeAstroAPI固有形式へ依存させない
-   `HoroscopeData`は `birth / planets / houses / angles / aspects`
-   `planet.house`は `number | null`
-   `houses`は `HouseData[] | null`
-   `angles`は `AnglePoint[] | null`
-   出生時刻不明時はAPIの正午を出生時刻として保持しない
-   出生時刻不明時も利用可能なデータはReactで表示する
-   出生時刻不明時もハウス非依存のVisual Profileを生成可能にする
-   月サイン不確定性はNode.js側で1候補／2候補を判定する方針
-   主要5アスペクト
-   アスペクトはNode.js側で自前計算
-   orb一律±5°
-   orb境界値を含む（`<= 5°`）
-   10天体をすべて同じ1票として集計
-   4区分とElementsは同一分類として扱う
-   2区分・3区分・4区分は通常画面でも表示
-   アスペクトも通常画面で表示
-   元素・区分・惑星分布・ハウス分布をNode.js側で自前集計
-   Visual Profile用視覚パラメータをNode.js側で生成
-   出生時刻不明時に`00:00`を仮定しない
-   出生地は全世界対応を前提とする
-   Node.js → Reactは `horoscope / analysis / visualProfile`
    の三層構造を基本とする

------------------------------------------------------------------------

## 24. Open Questions（今後決めること）

-   FreeAstroAPIのエラーpayloadの実構造
-   HoroscopeAnalysisの正式な型
-   惑星分布の具体的な定義
-   VisualProfileDataの正式な型
-   Visual Profile各要素の具体的な数値変換
-   出生時刻既知／不明のReact UI詳細
-   月サイン候補判定の具体的なAPI呼び出し方法
-   月サイン候補判定の日境界・タイムゾーン処理
-   出生時刻不明時の月位置そのものの不確定性をどこまでUIへ示すか
-   backend公開endpointのrequest / response / error形式
-   Birth Inputとbackend endpointの接続
-   標準分析表をどのUIモードへ配置するか

------------------------------------------------------------------------

## 25. Next Step（次の工程）

FreeAstroAPIの実レスポンス確認とHoroscopeData境界の実装は完了した。

次は標準分析層とReact接続へ進む。

``` text
FreeAstroAPI
↓
Validation
↓
Normalization
↓
HoroscopeData
↓
HoroscopeAnalysis
↓
VisualProfileData
↓
Backend Endpoint
↓
React
```

直近では、

1.  HoroscopeAnalysisの正式化
2.  2区分・3区分・4区分の集計実装
3.  出生時刻既知／不明の分析分岐
4.  VisualProfileDataの設計
5.  backend endpoint
6.  React UI接続

の順で進める。

月サイン不確定性の詳細実装は、出生時刻不明UIを接続する段階で追加する。
