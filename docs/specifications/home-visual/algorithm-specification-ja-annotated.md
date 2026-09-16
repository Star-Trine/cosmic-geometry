# Cosmic Geometry Home Visual
# Algorithm Specification

> 注記：この版では、設計上の英語用語に可能な限り日本語補足を付けています。
> 関数名・型名・プロパティ名など、実装上の識別子は英語のまま維持しています。

## 1. Scope

第一段階の実装対象：

- LightField
- WaveField
- ParticleField / Wavicle

後続フェーズ：

- ConnectionLayer（接続レイヤー）
- Adaptive Constellation（適応型星座ネットワーク）
- Dissolution（崩壊・溶解）

初期実装では、
LightField → WaveField → ParticleField / Wavicle
までを一つの連続したVisual Systemとして成立させる。

Connection / Geometryについては、
第一段階のData Model上で将来拡張可能な状態を維持するが、
描画・接続アルゴリズム自体は実装しない。

---

## 2. Global Flow

First Cycle（初回サイクル）：

Quiet Space  
→ Subtle Fluctuation（微細な揺らぎ）  
→ LightField Formation（LightFieldの形成）  
→ Wave Propagation（伝搬）（Waveの伝搬）  
→ Wavicle Localization / Spread（Wavicleの局在化／拡散）  
→ Flow Alignment（流れへの整列）  
→ Residual State（残留状態）  
→ Next-cycle Transition（次サイクルへの遷移）

Following Cycles（2周目以降のサイクル）：

Residual Field（残留する場）  
→ Subtle Fluctuation（微細な揺らぎ）  
→ LightField Formation（LightFieldの形成）  
→ Wave Propagation（伝搬）（Waveの伝搬）  
→ Wavicle Localization / Spread（Wavicleの局在化／拡散）  
→ Flow Alignment（流れへの整列）  
→ Residual State（残留状態）  
→ Next-cycle Transition（次サイクルへの遷移）

将来的に：

Residual State（残留状態）  
→ Connection  
→ Adaptive Constellation（適応型星座ネットワーク）  
→ Dissolution（崩壊・溶解）  
→ Field

完全なリセットを繰り返すAnimationではなく、
Field・Wave・Wavicleが連続的に状態を変えながら
ゆるく循環するVisual Systemとする。

---

## 3. CycleState

Home Visual全体の進行状態を `CycleState` で一元管理する。

### 3.1 Purpose

LightField / WaveField / ParticleFieldがそれぞれ独自に時間を判断することを避ける。

HomeVisual側でCycleの進行を管理し、
各Layerへ共通の進行状態を渡す。

### 3.2 State

```ts
CycleState
- stage
- elapsed
- stageElapsed
- cycleIndex
- cycleSeed
- transitionProgress
- paused
```

### 3.3 Stage

```text
quiet
fluctuation
field
wave
wavicle
residual
transition
```

Stageは完全に排他的な状態として描画を切り替えるものではない。

各Visual LayerはそれぞれのEnvelopeを持ち、
複数Stageが時間的に重なりながら遷移する。

これにより、

- Loose Cycle（ゆるやかな循環）
- Layer overlap（レイヤーの時間的な重なり）
- Timing調整
- Pointerによる遷移補助
- Repeat Cycle（繰り返しサイクル）
- Residual State（残留状態）

を一貫して制御する。

---

## 4. Common Mathematical Conventions（共通の数学的規約）

Home Visual内の数学的な値は以下の規約へ統一する。

### 4.1 Position

位置はviewportのpixel値へ直接依存させず、
aspect ratioを考慮した正規化座標を使用する。

viewport変更時も、
Visual構図の意味が大きく変化しないようにする。

### 4.2 Direction

方向は原則として長さ1の単位ベクトルとして扱う。

### 4.3 Angle / Phase（角度／位相）

角度および位相の内部表現はradianを使用する。

### 4.4 Time

時間の基本単位はsecondとする。

```text
1.0 = 1 second
```

以下はすべて秒単位で扱う。

- elapsed
- stageElapsed
- age
- lifetime
- deltaTime

### 4.5 Normalized Scalar（正規化されたスカラー値）

以下の値は原則として0.0–1.0へ正規化する。

- intensity
- energy
- density
- localization
- influence
- transitionProgress
- opacity系の論理値

### 4.6 Color

Color文字列そのものを各Stateの主要データとして保持しない。

色は、

- palette
- intensity
- energy
- distortion
- wave influence
- current stage

などから描画時に算出する。

---

# 5. LightField

## 5.1 Purpose

LightFieldは、
静かな宇宙空間からFieldそのものが立ち上がる過程を表現する。

単一の光源が出現するのではなく、

- brightness
- density
- distortion
- color transition

によって、
空間そのものの状態が変化したように見せる。

## 5.2 Origin

Fieldは完全中央固定ではなく、
中央付近から少し左下へ偏った位置を基本Originとする。

初期候補値：

```text
center.x = 0.42–0.55
center.y = 0.48–0.62
```

Cycleごとにこの範囲内で小さな位置変化を持たせる。

完全なRandom位置にはしない。

Waveの基本方向が Left → Right、
かつ slightly Left-Lower → Right-Upper であるため、
Fieldを少し左下側に配置することで画面全体に自然な流れを作る。

この数値は最終値ではなく、
4K / Laptop / MobileでのVisual確認後に調整する。

## 5.3 Initial Fluctuation

最初の揺らぎは主に：

- brightness difference（明るさの差）
- distortion

として表現する。

補助的に：

- density difference（密度差）
- subtle hue difference（微かな色相差）

を使用できる。

最初から明確な物体・線・粒子を表示しない。

「何かが現れた」よりも、
「空間の状態がわずかに変わり始めた」
という見え方を優先する。

## 5.4 Shape

Fieldは固定された円形にはしない。

基本形：

- cloud-like（雲状）
- elliptical（楕円状）
- irregular（不定形）
- gently stretched（ゆるく引き伸ばされた形）

楕円状の基礎形状へ低周波の歪みを加える。

輪郭線は描かない。

## 5.5 Motion

Fieldは、

- slowly expanding（ゆっくり広がる）
- drifting（漂う）
- breathing（呼吸するような伸縮）
- locally distorting（局所的に歪む）

という動きを持つ。

急激な拡大・収縮は避ける。

Field Motionは後続するWaveFieldの方向性にも影響する。

## 5.6 Vector Flow（ベクトルの流れ）

第一段階ではTensor Fieldを使用しない。

2D / 2.5D Vector Fieldとして扱う。

基本構造：

```text
Field Flow
=
Base Flow（基本の流れ）
+ Local Bend（局所的な曲がり）
+ Slow Drift（ゆっくりした漂い）
```

### Base Flow（基本の流れ）

全体の主要方向を決める。

```text
Left → Right
slightly Left-Lower → Right-Upper
```

### Local Bend（局所的な曲がり）

Field内部にわずかな湾曲・蛇行を与える。

低周波のsin / cos等、軽量な連続関数を利用する。

Local Bend（局所的な曲がり）はBase Flow（基本の流れ）を壊さない程度に抑える。

### Slow Drift（ゆっくりした漂い）

Cycle全体を通した非常にゆっくりした方向変化。

Visualが完全に同じ位置へ固定されて見えないようにする。

## 5.7 Distortion（歪み）

Fieldは楕円距離を基礎とし、
座標へ小さな歪みを加えることで不定形な場として見せる。

Distortion（歪み）は以下へ利用する。

- brightness
- density
- Cyan edge
- Magenta change
- Wave generation influence
- Wavicle generation influence

厳密な物理的Field計算ではなく、
Visual Modelとして扱う。

## 5.8 Color

Field base：

- Blue Violet

Active region / edge（活性領域／縁）：

- Cyan

Distortion（歪み） / change：

- Magenta

Cyanを全画面へ均等に広げず、
Blue Violetを奥行きと遷移の基底として利用する。

---

# 6. Color Usage

## 6.1 Conceptual Balance（概念上の色バランス）

Concept上の相対的な色の重要度：

- Cyan：60
- Magenta：30
- Yellow：10

この値は画面上の面積比率を意味しない。

Visual Concept上での存在感・役割の比率として扱う。

## 6.2 Rendering Balance（描画時の色バランス）

実際の描画では以下を初期目安とする。

Persistent chromatic area（常時見える色領域）：

- Cyan：45–55%
- Blue Violet：30–40%
- Magenta：10–20%

Event-only area（イベント時だけ現れる色領域）：

- Yellow：平均1%未満
- Peak時でも1–3%程度

Structure：

- White / Blue White
- chromatic color ratioとは独立した明度レイヤー

## 6.3 Yellow

Yellowは常時表示しない。

以下のような高エネルギー・状態変化Event時のみ使用する。

- Wave interference（Waveの干渉）
- Wavicle state transition（Wavicleの状態遷移）
- Connection formation（接続の形成）
- Geometry formation（幾何学構造の形成）
- Energy peak（エネルギーのピーク）

第一段階では主に、

- Wave intensity peak
- Wavicle birth
- strong local activation（局所的な活性）

などへ限定的に利用できる。

---

# 7. WaveField

## 7.1 Purpose

WaveFieldは、
LightFieldによって形成された空間内部を
方向性を持って伝搬する変化を表現する。

厳密な物理学上の波動ではなく、

- Propagation（伝搬）
- Flow
- Wave-like Motion（波のような動き）

を統合したVisual Modelとして扱う。

## 7.2 Origin

Waveは、Field内部の

- gradient
- density difference（密度差）
- distortion
- local activation（局所的な活性）

を起点として発生する。

Field Motionと無関係な完全Random方向にはしない。

## 7.3 Direction

基本方向：

```text
Left → Right
```

完全水平ではなく、

```text
slightly Left-Lower → Right-Upper
```

へ流す。

初期候補：

約10–15度程度の上向き。

Field Motionによってわずかな蛇行・湾曲を許可する。

この角度もVisual確認後に調整する。

## 7.4 Motion

WaveはField Vector Flow（ベクトルの流れ）を基礎として移動する。

必要なVisual Parameter：

- direction
- phase
- displacementAmplitude
- intensity
- speed
- wavelength-like spacing
- width
- bendAmount
- envelope
- age
- lifetime

厳密な波動方程式は必須としない。

周期関数を利用する場合も、
物理再現ではなくVisual Motion Generatorとして使用する。

## 7.5 Visual Form

Waveは主に **Luminous Band（発光する帯）** として描画する。

必要に応じて、

- multiple low-opacity strokes（低透明度の線を複数重ねる）
- phase-like variation（位相のような変化）
- density variation（密度変化）
- subtle trail（微かな残像）
- local glow（局所的な発光）

を組み合わせる。

一本の明確な線として見せるのではなく、
幅と密度を持った光の流れとして扱う。

## 7.6 Wave Count（Waveの本数）

第一段階では：

- Wide / 4K：2–3
- Laptop：2
- Mobile：1–2

程度を初期候補とする。

Waveを大量に生成して画面を埋めない。

複数Waveを使用する場合も、

- direction
- phase
- width
- position

を少しずらし、
一つの大きな流れとして見える範囲に抑える。

## 7.7 Spectral Color（スペクトル色）

基本：

Cyan  
→ Blue Violet  
→ Magenta

Rainbow表現は採用するが、
高彩度の虹色帯として常時表示しない。

Luminous Band（発光する帯）内部の微かなSpectral Transition（スペクトルの色遷移）として使用する。

高エネルギーEvent：

White  
+  
subtle Yellow

---

# 8. ParticleField / Wavicle

## 8.1 Purpose

Wavicleは、
WaveFieldの時間変化によって
Fieldの一部が局在して見えるVisual Entityである。

量子力学の厳密なシミュレーションではない。

Visual Concept上：

```text
Field
→ Wave
→ Localized State（局在した状態）
→ Wavicle
```

という関係を表現する。

## 8.2 Generation Trigger（生成トリガー）

厳密な共振条件のみを使用しない。

発生条件が成立しづらくなり、
ParticleFieldが十分に形成されないことを避ける。

Primary Trigger（主要トリガー）：

```text
Wave Intensity > Threshold
```

Secondary Influence（補助的な影響要因）：

- Field intensity
- distortion
- density
- local gradient
- phase-like state
- pointer assist（ポインターによる補助）

これらを補助係数として使用する。

## 8.3 Activation（活性度）

Wavicle生成のための `activation` を用意する。

概念上：

```text
activation
=
Wave Influence
× Field Influence
× Distortion（歪み） Influence
× Interaction Assist
```

一定Thresholdを超えた領域でWavicle生成候補とする。

Pointer操作なしでも必ず発生可能であること。

## 8.4 Spawn Control（生成量の制御）

Particle生成量をframe countへ直接依存させない。

時間基準のSpawn Rate（生成頻度）を使用する。

```text
spawnRate
=
baseRate
× max(0, activation - threshold)
```

`spawnRate × deltaTime` を蓄積し、
一定量を超えた時点でWavicle PoolからParticleを起動する。

これにより、

- FPS差
- 4K / Laptop差
- browser負荷

による生成数の大きな変化を抑える。

## 8.5 Birth Motion（生成直後の動き）

発生時は **Burst-like Spread（ぶわっと散開する動き）** とする。

「ぶわっと散る」動きを持つ。

ただし完全な360度Randomにはしない。

出生時の速度は、

- Wave direction
- radial burst（放射状の散開）
- small seeded variation（seedに基づく小さな個体差）

を合成する。

Waveの進行方向を中心とした扇状の散開を基本とする。

## 8.6 Flow Alignment（流れへの整列）

Burst後、
Wavicleは徐々にField / Wave Flowへ整列する。

Flow Alignment（流れへの整列）は急激に行わない。

初期候補：

```text
alignment time = 1.2–2.5 sec
```

この時間により、

Birth  
→ Spreading  
→ Aligning  
→ Flowing

という状態変化を作る。

## 8.7 Post-Birth Motion（生成直後の動き）（生成後の動き）

発生後：

- Field Flowへ徐々に整列
- Waveの影響を弱く残す
- 個体差を少量維持
- 過剰なRandom Motionを避ける

画面全体がParticle Stormのように
ごちゃごちゃしないことを優先する。

## 8.8 Residual State（残留状態）

WavicleはCycle終了時にすべて消さない。

初期候補：

```text
Residual Wavicle = 10–20%
```

残留したWavicleは次Cycleへ引き継ぐ。

将来的には、

- Connection
- Adaptive Constellation（適応型星座ネットワーク）

形成候補として利用する。

## 8.9 Color

通常：

- Blue White
- Pale Cyan

Wave influence：

Cyan  
→ Blue Violet  
→ Magenta

High-energy event：

White  
+  
small Yellow

## 8.10 Depth（奥行き）

Wavicleは2.5D的なDepth（奥行き）を持つ。

### Far（遠景）

- small
- faint
- slow

### Mid（中景）

- standard
- main Wave interaction

### Near（近景）

- slightly larger
- brighter
- stronger parallax

既存StarCanvasの星とは視覚的な距離を明確に分ける。

---

# 9. Residual State（残留状態） and Repeat Cycle（繰り返しサイクル）

Cycle終了時にVisualを完全な無状態へリセットしない。

初期候補：

```text
Field Residual     = 20–30%
Wavicle Residual   = 10–20%
```

残ったField / Wavicleから
次CycleのSubtle Fluctuation（微細な揺らぎ）へ接続する。

### First Cycle（初回サイクル）

```text
Quiet Space
→ Subtle Fluctuation（微細な揺らぎ）
→ Field
→ Wave
→ Wavicle
→ Residual
```

### Following Cycles（2周目以降のサイクル）

```text
Residual Field（残留する場）
→ Subtle Fluctuation（微細な揺らぎ）
→ Field
→ Wave
→ Wavicle
→ Residual
```

Cycle境界では完全な暗転・全消去を避ける。

Crossfade的に状態を引き継ぐことで、

「Loop Animation」

よりも、

「常に変化し続ける宇宙空間」

として見えることを目指す。

---

# 10. Adaptive Constellation（適応型星座ネットワーク）
# Future Phase

## 10.1 Purpose

残留したWavicle同士の関係から、
一時的な星図・星座ネットワークを形成する。

Visible Result：

**Adaptive Constellation（適応型星座ネットワーク）**

## 10.2 Candidate Logic（接続候補の判定ロジック）

内部候補：

- Delaunay-like neighbor relationship
- spatial distance（空間距離）
- phase similarity（位相の近さ）
- energy threshold（エネルギーしきい値）
- stability time（安定している時間）

```text
Candidate Neighbor
→ Compatible State
→ Threshold
→ Stability
→ Connection
```

## 10.3 Visual Result（見た目としての結果）

最終表示は、
Delaunay triangulationやVoronoi Diagramを
そのまま見せることを目的としない。

結果として：

- constellation
- star map
- network
- triangle
- polygon
- temporary geometry

が自然に形成されることを目指す。

第一段階では未実装。

---

# 11. Interaction

## 11.1 Concept

Pointer操作は、
現象を直接支配するControllerではない。

Field → Wave → Wavicle

の状態遷移を弱く補助する触媒として扱う。

## 11.2 Possible Effects

Pointer proximityによって：

- Field activationを少し増加
- Wave generationを補助
- Wave intensityを少し増加
- Wavicle activationを補助
- Wavicle spreadを少し補助
- subtle parallax（微かな視差効果）

を発生させる。

Pointer assistはVisual System本来の自律性を壊さない範囲に抑える。

初期候補：

最大5–10%程度の補助。

## 11.3 Pointer Smoothing（ポインター入力の平滑化）

raw pointer値を直接Visualへ使用しない。

以下を用意する。

- pointerPosition
- pointerVelocity
- smoothedPosition
- smoothedVelocity
- influenceStrength
- lastInteractionTime

入力を平滑化し、
急激なVisual変化を避ける。

## 11.4 Camera / Perspective（カメラ／遠近感）

第一段階ではOrbitControlsを使用しない。

代わりに：

- subtle parallax（微かな視差効果）
- small layer shift（レイヤーの小さな位置ずれ）
- weak perspective response（弱い遠近反応）

を利用する。

Full 3D / OrbitControlsは
Visualが安定した後に再検討する。

---

# 12. Timing

## 12.1 Loop Concept（ループの考え方）

完全な機械的Loopではなく、
Loose Cycle（ゆるやかな循環）とする。

Cycleごとに小さく変化させてよいもの：

- Field origin
- Field rotation
- Wave phase
- Wave width
- Wavicle seed
- spawn position
- residual distribution

大きく変化させないもの：

- Waveの主要方向
- color role
- visual hierarchy
- title用negative space
- Interaction上限

## 12.2 Initial Timing（初期タイミング）

初期実装では26–30秒程度を基準とする。

各Stageは完全分離せず、
Envelopeによって重なりながら進行する。

初期候補：

```text
Quiet / Subtle Fluctuation（微細な揺らぎ）   0.0–2.5 sec
LightField Formation（LightFieldの形成）         2.0–8.0 sec
WaveField Propagation（伝搬）        7.0–15.0 sec
Wavicle Birth / Spread      11.0–19.0 sec
Flow Alignment（流れへの整列）              14.0–22.0 sec
Residual State（残留状態）              18.0–26.0 sec
Next-cycle Transition（次サイクルへの遷移）       24.0–28.0 sec
```

初回のみQuiet Spaceを明確に見せる。

二周目以降はResidual State（残留状態）から
次CycleのSubtle Fluctuation（微細な揺らぎ）へ接続する。

TimingはVisual確認後に調整する。

---

# 13. Data Model Draft（データモデル草案）

## 13.1 CycleState

```text
stage
elapsed
stageElapsed
cycleIndex
cycleSeed
transitionProgress
paused
```

## 13.2 FieldState

```text
center
scale
rotation
intensity
distortionAmount
flowDirection
drift
density
age
seed
```

Field内部の各地点の色・密度は
Stateとして大量保存せず、
Field Modelから描画時に派生させる。

## 13.3 WaveState

```text
origin
direction
phase
displacementAmplitude
intensity
speed
wavelength
width
length
age
lifetime
envelope
bendAmount
active
```

## 13.4 Wavicle

```text
id
position
velocity
phase
energy
age
lifetime
localization
waveInfluence
fieldInfluence
depth
size
opacity
state
spawnTime
seed
active
alignment
```

state候補：

```text
inactive
birth
spreading
aligning
flowing
residual
fading
```

Wavicleは固定長Poolとして管理し、
毎回new / deleteを繰り返さない。

`connectionEligibility` は第一段階では必須Stateとせず、
将来的に他の値から派生可能か再検討する。

## 13.5 InteractionState

```text
pointerPosition
pointerVelocity
smoothedPosition
smoothedVelocity
pointerInside
pointerActive
lastInteractionTime
influenceStrength
idleDuration
```

各Layer用assist値は、
必要に応じて`influenceStrength`から派生する。

## 13.6 QualitySettings

```text
tier
dprCap
fieldRenderScale
maxWavicles
waveCount
glowLevel
trailLength
targetFps
reducedMotion
```

## 13.7 RuntimeState

```text
viewportWidth
viewportHeight
actualDpr
visibilityState
isHomeActive
```

Runtime状態（実行中の状態）とQuality設定（描画品質設定）を分離する。

---

# 14. Rendering Architecture（描画構成）

第一段階では：

**StarCanvas  
+ one visible Canvas 2D（画面に表示するCanvas 2D）  
+ one low-resolution offscreen buffer（画面外で事前描画する低解像度バッファ）  
+ HTML**

を基本構成とする。

```text
StarCanvas
└─ existing Far（遠景） Space canvas

HomeVisual
├─ visible Canvas 2D（画面に表示するCanvas 2D）
│  ├─ LightField offscreen buffer（画面外で事前描画する低解像度バッファ） composite
│  ├─ WaveField
│  └─ ParticleField / Wavicle
│
└─ HomeVisualContent
   ├─ title
   └─ subtitle
```

## 14.1 LightField

LightFieldのState / Field FunctionはTypeScript moduleとして管理する。

描画は低解像度offscreen canvasへ行い、
visible canvasへ拡大合成する。

Wave / Wavicleも同じField Modelを参照する。

CSS GradientだけでVisualとAlgorithmを別々に管理する構成は避ける。

## 14.2 WaveField

visible Canvas 2D（画面に表示するCanvas 2D）へ描画する。

複数のlow-opacity strokeやLuminous Band（発光する帯）を重ねて表現する。

## 14.3 ParticleField

WaveFieldと同じvisible Canvasへ描画する。

Canvas自体をLayerごとに増やさない。

描画順によってDepth（奥行き）を表現する。

## 14.4 HTML

以下はCanvasへ描画しない。

- Home title
- subtitle
- accessibility text

HTMLとして維持する。

---

# 15. Component / Scheduler Architecture（コンポーネント／描画スケジューラ構成）

React Componentは最小限にする。

```text
Home
└─ HomeVisual
   ├─ canvas
   ├─ HomeVisualContent
   └─ InteractionLayer
```

Visualの責務は
React ComponentではなくTypeScript moduleとして分離する。

例：

```text
homeVisual/
├─ engine/
│  ├─ cycle
│  ├─ scheduler
│  ├─ viewport
│  └─ quality
├─ field/
│  ├─ createFieldState
│  ├─ updateField
│  ├─ sampleField
│  └─ renderField
├─ wave/
│  ├─ createWaveState
│  ├─ updateWaves
│  ├─ sampleWave
│  └─ renderWaves
├─ wavicle/
│  ├─ createWaviclePool
│  ├─ spawnWavicles
│  ├─ updateWavicles
│  └─ renderWavicles
└─ interaction/
   ├─ collectPointer
   └─ smoothInteraction
```

`LightField` / `WaveField` / `ParticleField`
を別々のReact ComponentやCanvasにする必要はない。

## 15.1 Frame Order（1フレーム内の処理順）

```text
1. deltaTime取得
2. CycleState更新
3. InteractionState更新・平滑化
4. FieldState更新
5. WaveState更新
6. Wavicle生成
7. Wavicle更新
8. Canvas clear / residual処理
9. LightField合成
10. WaveField描画
11. Far（遠景） / Mid（中景） Wavicle描画
12. Near（近景） Wavicle描画
```

Animation中の値はReact stateへ毎frame保存しない。

Mutable state / refs / engine内部で管理する。

---

# 16. Performance

## 16.1 Principles

- HomeVisualは一つのrequestAnimationFrameを共有
- Layerごとにschedulerを作らない
- StarCanvasは既存Loopのまま維持
- DPR上限を設定
- LightFieldは低解像度bufferを利用
- WavicleはPoolで再利用
- 毎frameのobject生成を抑える
- Particle数だけで密度感を作らない
- glow / halo / trailを選択的に使用
- Home unmount時に停止
- hidden tabで停止または低頻度化
- reduced-motionを考慮する

## 16.2 Initial Quality Values

### Wide / 4K

```text
Wavicle Pool        220
Typical Active      140–190
Wave Count（Waveの本数）          2–3
DPR Cap             1.5
Field Render Scale  0.25
Depth（奥行き） Layer         3
Parallax            14–20px max
```

### Laptop

```text
Wavicle Pool        140
Typical Active      90–120
Wave Count（Waveの本数）          2
DPR Cap             1.75
Field Render Scale  0.33
Depth（奥行き） Layer         3
Parallax            8–14px max
```

### Mobile

```text
Wavicle Pool        70
Typical Active      35–55
Wave Count（Waveの本数）          1–2
DPR Cap             1.5
Field Render Scale  0.33
Depth（奥行き） Layer         2
Parallax            3–6px max
```

これらは初期値であり、
実機Visual確認・Performance確認後に調整する。

4Kだからといって画面面積に比例してParticle数を増やさない。

広い空間はParticle密度ではなく、

- scale
- spacing
- Wave length
- Field spread
- negative space

によって活用する。

## 16.3 Performance Degradation Order（負荷が高いときの品質低下順）

負荷が高い場合：

1. trail削減
2. glow削減
3. Field buffer解像度削減
4. Wave補助表現削減
5. Wavicle数削減
6. DPR cap削減
7. FPS制限

の順で品質を下げる。

---

# 17. Responsive（画面幅ごとの対応）

## 17.1 Wide / 4K

- Waveを横方向へ大きく展開
- Field originを少し左下へ配置
- Negative Spaceを十分残す
- Particle密度を過剰に上げない

## 17.2 Laptop

- 4K版の構図を圧縮
- Field / Waveの関係を維持
- Densityを大きく変えない

## 17.3 Mobile

Laptop版の単純縮小にはしない。

- Fieldを一箇所へ集約
- Wave lengthを短縮
- 左下→右上の方向性は維持
- Near（近景） Wavicle削減
- Glow削減
- Magenta領域を少し縮小
- Touch時のみ短いAssist
- Navbar領域を描画可能範囲から除外

---

# 18. Home Viewport（Homeの描画領域）

既存の共通`.main-content`制約とは分離し、
Home Visualのみviewport基準の描画領域を利用する。

描画可能Heightは概念上：

```text
availableHeight
=
viewportHeight
- visibleHeaderHeight
- fixedNavbarSafeArea
```

とする。

共通Shellそのものを大きく変更することは避ける。

---

# 19. Reduced Motion（動きを抑える設定）

`prefers-reduced-motion` が有効な場合：

- Fieldは静かな低強度状態
- Wave propagationは停止または極低速
- Wavicle burstは停止
- Pointer parallaxは停止
- 強いGlow / Trailは削減
- StarCanvasとの視覚的一貫性は維持

完全な黒画面へ戻すのではなく、
静的なLightFieldとして成立させる。

---

# 20. First Implementation Scope（最初の実装範囲）

最初の実装ではWave / Wavicleを一度に完成させない。

第一ステップ：

```text
HomeVisual
├─ viewport-sized Canvas
├─ one animation scheduler
├─ CycleState
├─ QualitySettings
├─ InteractionState
├─ resize / DPR handling
├─ visibility handling
├─ reduced-motion handling
└─ LightField only
```

最初のVisual完成条件：

- StarCanvasの上へHome専用Canvasが正しく重なる
- Header / Navbar / Home textを遮らない
- 4K / Laptop / Mobileで描画領域が成立する
- Homeから離れたらAnimationが停止する
- hidden tabでAnimationが停止する
- DPR capが機能する
- LightFieldが中央より少し左下から形成される
- Fieldがゆっくり広がる
- Blue Violet baseが確認できる
- Cyan edgeが確認できる
- Magenta distortionが少量見える
- 二周目で完全リセットされない
- reduced-motionで静かなFieldになる

この基盤が安定した後：

LightField  
→ WaveField  
→ ParticleField / Wavicle

の順で追加する。

---

# 21. Current Decisions（現在の確定事項）

Confirmed：

- React + TypeScriptを基本技術とする
- Visual描画はCanvas 2Dを使用する
- Fieldは中央寄りで少し左下へ偏る
- Field origin初期値は提案範囲から開始する
- 初期揺らぎはbrightness + distortion
- Fieldはゆっくり広がる
- Tensor Fieldは初期段階では使用しない
- 軽量なVector Fieldを使用する
- WaveはField Motionに従う
- WaveはLuminous Band（発光する帯）として表示する
- Wave方向はLeft → Right、slightly Left-Lower → Right-Upper
- RainbowはWave内部のsubtle spectral transitionとして使用する
- WavicleはWaveによって発生・散開する
- 発生条件はWave intensityをPrimary Trigger（主要トリガー）とする
- Burst後はField Flowへ徐々に整列する
- Wavicleは少しResidualとして残す
- Pointerは状態遷移の補助とする
- Colorの60 / 30 / 10は画面占有率ではない
- YellowはEvent時のみごく少量使用する
- CycleStateを導入する
- Position / Direction / Phase / Time / Scalarの数学規約を統一する
- Cycle終了時に完全リセットしない
- Fieldを20–30%程度残す
- Wavicleを10–20%程度残す
- Cycle時間は初期値として26–30秒程度とする
- Final GeometryはAdaptive Constellation（適応型星座ネットワーク）とする
- First ImplementationはLightFieldから開始する

---

# 22. Pending / Visual Tuning（未確定・見た目調整項目）

実装後のVisual確認で調整する項目：

- Field originの最終位置
- Field scale
- Field rotation
- distortion amount
- Cyan / Blue Violet / Magentaの混合
- Wave angle
- Wave width
- Wave bend
- Wave count
- Wavicle threshold
- Wavicle spawn rate
- burst angle
- alignment time
- Particle density
- halo size
- pointer influence
- Cycle duration
- viewport別Quality値

Future Phase：

- Voronoi-like Field
- Delaunay-like Candidate Connection
- phase similarity（位相の近さ）
- Connection threshold
- stability time（安定している時間）
- Adaptive Constellation（適応型星座ネットワーク）詳細
- Geometry rendering
- detailed Dissolution（崩壊・溶解）
- R3F
- OrbitControls
