# Cosmic Geometry Home Visual Concept

## 1. Purpose

新しいHome Visualは、Cosmic Geometry全体の入口として、
個別作品そのものを並べるのではなく、
それらの背後に共通する

- 空間
- 場
- 波
- 粒子
- 関係
- 幾何学
- 生成と崩壊

を一つの連続した現象として表現する。

既存Homeの神聖幾何学アニメーションは削除せず、
将来的にWorksへ独立作品として移設する。

候補名：

- Sacred Geometry Genesis
- `/works/sacred-geometry-genesis`

---

## 2. Core Visual Story

Quiet Space
→ Subtle Fluctuation
→ LightField
→ WaveField
→ Wavicle / ParticleField
→ Connection
→ Adaptive Constellation
→ Dissolution
→ Field

静かな宇宙空間に微細な揺らぎが生じる。

その揺らぎが、
明度・色相・密度・歪みとして知覚され、
空間そのものにFieldが立ち上がる。

Field内部には方向性が生まれ、
その流れに沿ってWave-likeな変化が伝搬する。

Waveの時間変化によって、
Fieldの一部がWavicleとして局在し、
空間内へ拡散・移動する。

Wavicle同士は、
距離・位相・状態などの関係によって接続され、
一時的な星図・星座のような幾何学構造を形成する。

その構造は固定されず、
やがて崩壊し、再びFieldへ溶けていく。

---

## 3. Design Principle

### Space, not object

旧Homeのような単一オブジェクト中央配置ではなく、
画面全体をVisual Spaceとして扱う。

余白を埋めるのではなく、
余白そのものを現象が起こる空間として利用する。

### Emergent Geometry

最終Geometryを最初から配置しない。

Geometryは、

Field
→ Wave
→ Wavicle
→ Relation

の結果として自然に立ち上がる。

既知の固定図形を見せることより、
関係から秩序が生まれる過程を重視する。

---

## 4. StarCanvasとの関係

既存のStarCanvasは全ページ共通Visual Layerとして維持する。

StarCanvas：
- Far Space
- distant stars
- 小さい
- ゆっくり明滅
- Interactionなし
- 全ページ共通

Home Wavicle：
- Mid / Near Space
- Field / Waveに従う
- Interactionに弱く反応
- Connection / Geometryへ参加
- Home固有

新Homeでは、

「普段から存在しているCosmic Geometryの宇宙が、
Homeでのみ活性化し、現象を起こす」

ように見せる。

---

## 5. Color Concept

### Main Colors

1. Cyan
   - Field
   - Space
   - Waveの基調

2. Blue Violet
   - Depth
   - Transition
   - 空間の深部

3. Magenta
   - Interference
   - Change
   - Wave後縁
   - 状態変化

4. White / Blue White
   - Connection
   - Structure
   - Geometry

5. Yellow
   - Ignition
   - Energy Peak
   - Threshold
   - 一瞬だけ発生する強調

### Approximate Accent Balance

- Cyan：60
- Magenta：30
- Yellow：10

Blue Violetは、
CyanとMagentaをつなぐ遷移色として扱う。

Yellowは常時使用せず、

- Wave干渉
- Wavicle状態変化
- Connection成立
- Geometry形成
- Energy Peak

などのイベント時のみ、ごく少量使用する。

---

## 6. Rainbow / Spectral Expression

虹色表現は装飾ではなく、
状態変化を示すVisual Languageとして使う。

通常状態：

Cyan
→ Blue Violet
→ Magenta

高エネルギー・干渉時：

White
+
subtle Yellow

Waveでは、
ほのかなスペクトルグラデーションを光の帯として表現する。

背景全体、文字、Navbarなどへ虹色を広げない。

---

## 7. Depth

初期実装ではFull 3Dではなく、
2.5D的な奥行きを採用する。

奥行き表現：

- layer depth
- opacity
- particle size
- motion speed
- halo
- subtle blur
- parallax
- weak pointer response

将来的に必要な場合のみ、
Three.js / R3Fによる本格的な3D表現を検討する。

---

## 8. Interaction Concept

Interactionは作品を操作するためではなく、
現象の遷移を補助するUXとする。

Pointerは、

Quiet Space
→ Field
→ Wave
→ Wavicle

という遷移を弱く後押しする。

例：

- Fieldを局所的に活性化
- Wave発生を少し促進
- Wavicle生成を補助
- 軽いparallax

触らなくても、
放置状態で作品として成立することを前提とする。

---

## 9. Final Geometry

最終Geometryは、
計算機科学的な「星図 / 星座ネットワーク」を想定する。

仮称：

Adaptive Constellation

内部原理として、

- Voronoi-like Field
- Phase Interference
- Delaunay-like Candidate Connection

などを利用できる。

ただし、
Voronoi図やDelaunay三角形分割そのものを
完成形として見せることは目的としない。

粒子間の関係から、
一時的な星図・星座・幾何学ネットワークが
自然に立ち上がることを重視する。

---

## 10. Visual Reference

Home Visualのコンセプトアートは以下を参照。

`docs/assets/references/Home/CosmicGeometryHomeconceptArt.png`

この画像は完成見本ではなく、

- 構図
- 色
- 奥行き
- Wave
- Particle
- Geometry
- 空間密度

のVisual Referenceとして使用する。

ラスター特有の、

- 高密度Particle
- 写実的な惑星
- 強すぎるBloom
- 完成済み中央Mandala

は、そのまま再現しない。

---

## 11. First Implementation Scope

第一段階：

- LightField
- WaveField
- ParticleField / Wavicle

後続段階：

- ConnectionLayer
- GeometryLayer / Adaptive Constellation
- Dissolution

最初から完成形を作らず、
各Layer単体でも小さなVisual Experimentとして成立させる。