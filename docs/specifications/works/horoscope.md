# Horoscope — Design Specification v0.1

## 1. Overview（作品概要）

出生日時・出生地から生成される西洋占星術の Natal Chart を、データと幾何学的構造の両面から観察するインタラクティブ作品。

一般的なホロスコープ構造をベースとしつつ、Cosmic Geometry 独自の視覚表現 **Visual Profile** によって、出生図の構造的特徴を色・光・形・線・動きへ変換する。

---

## 2. Concept（コンセプト）

ホロスコープを「占い結果を文章で読むもの」だけではなく、

**点・角度・円・分割・関係性によって構成された幾何学的情報構造**

として捉える。

Visual Profile では人物像を断定するのではなく、

**出生図の構造 → 視覚言語**

という変換そのものを作品化する。

---

## 3. User Experience（体験設計）

ユーザーは出生情報を入力し、生成されたひとつの Horoscope を複数の視点から観察する。

通常のデータ表示と Visual Profile を相互に行き来でき、

**Data → Visual Profile**  
**Visual Profile → Data**

の両方向から出生図を理解できる構成とする。

---

## 4. Birth Input（出生情報入力）

独立した入力 UI として配置する。

基本入力候補：

- 生年月日
- 出生時刻
- 出生地

入力データから外部 API へ渡すために必要な緯度・経度・タイムゾーン等へ変換する。

---

## 5. Main UI（画面構成）

Time Vector Space と同様のモード切替型 UI を基本とする。

表示モード：

- Chart
- Planets
- Houses
- Angles
- Aspects
- Visual Profile

Birth Input はモードの一つにはせず、独立した入力領域として扱う。

---

## 6. Natal Chart（チャート本体）

チャート構造は一般的な西洋占星術の Natal Chart を踏襲する。

ただし、以下の視覚表現は Cosmic Geometry のデザインへ統一する。

- 背景
- 円環
- 線
- 発光
- 配色
- 透明度
- 天体表示

**ASC は左側に固定する。**

---

## 7. Astrological System（採用する占星術体系）

初版では以下を採用する。

- 主要 10 天体
- ASC / DSC / MC / IC
- 12 サイン
- 12 ハウス
- Placidus House System
- 逆行情報あり
- ノードは含めない

---

## 8. Aspect System（アスペクト）

主要 5 アスペクトを対象とする。

- Conjunction — 0°
- Sextile — 60°
- Square — 90°
- Trine — 120°
- Opposition — 180°

Orb は初版では **一律 ±5°** とする。

アスペクト判定および orb 計算は自前で行う。

---

## 9. Data Model（基本データ構造）

現在の基本型を発展させる。

- `PlanetData`
- `HouseData`
- `AnglePoint`
- `AspectData`

さらに Birth Input および Horoscope 全体を統合する Aggregate 型を追加する。

---

## 10. External API（外部 API）

外部 API は主に基礎的な天文・占星術データの取得に利用する。

利用対象候補：

- 天体位置
- ハウスカスプ
- ASC / MC
- 逆行情報

API レスポンスをそのまま Visual Profile へ使用せず、内部データ形式へ正規化してから利用する。

---

## 11. Backend Responsibility（Node.js の責務）

Node.js を単なる API プロキシではなく、

**Horoscope Data → Cosmic Geometry Model**

への変換層として扱う。

自前で処理する候補：

- API データ正規化
- 元素集計
- 2区分集計
- 3区分集計
- 4区分集計
- 惑星分布
- ハウス分布
- アスペクト計算
- orb 計算
- Visual Profile 用特徴量生成

---

## 12. Symbols（サイン・天体記号）

初版では Unicode 記号を第一候補とする。

フォント、サイズ、発光、背景円、縁取り、透明度などによって Cosmic Geometry の世界観へ寄せられるか検証する。

表現上の限界が大きい場合は SVG 化を検討する。

---

## 13. Visual Profile（基本設計）

Visual Profile は出生図の特徴量を視覚パラメータへ変換する独自表示。

現時点の基本対応：

- **2区分** → Direction / Energy Direction
- **3区分** → Motion / Shape
- **4区分** → Color / Texture
- **Planet** → Light / Emphasis
- **House** → Brightness / Stage
- **Aspect** → Line / Relationship
- **Retrograde** → Reverse / Special Motion

各要素は完全な 1 対 1 対応ではなく、必要に応じて主担当・副担当を持たせる。

---

## 14. Visual Profile Philosophy（表現原則）

Visual Profile は、

「あなたは情熱的な人物です」

のような人物解釈を生成するものではない。

たとえば、

- 火元素が多い
- 活動宮が多い
- 男性区分が優勢

というデータが存在した場合、それらを一定のルールによって、

- 暖色
- 放射方向
- 活発な形状変化

などへ変換する。

つまり、

**Interpretation ではなく Visualization。**

出生図の特徴を別の視覚言語で観察できることを目的とする。

---

## 15. Open Questions（仮決定・今後の検討事項）

以下は現時点では固定しない。

- 4 元素それぞれの具体的色域
- 元素比率から色を生成する数式
- 2 区分の方向表現
- 3 区分の Motion / Shape ルール
- ハウス分布から Brightness へ変換する方法
- 惑星ごとの Light 表現
- アスペクト種類ごとの Line 表現
- 逆行アニメーション
- Visual Profile 全体の基本形状
- Unicode から SVG へ切り替える基準
- 外部 API の選定と信用するデータ範囲

---

## Implementation Notes（実装メモ）

- チャート本体の構造は一般的な Natal Chart を踏襲し、見た目は Cosmic Geometry の世界観へ寄せる。
- ASC は左固定。
- 外部 API は基礎データ取得に利用し、Visual Profile に直接関係する集計・判定・特徴量生成は自前で行う。
- Concept Art 上の `Virgo = Ceres / Libra = Juno` は 12 分割されたアート上で 12 天体を配置するための独自対応であり、Horoscope 本体・Visual Profile・一般的な支配星体系の仕様には含めない。
