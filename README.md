# Cosmic Geometry

## 日本語

Cosmic Geometry は、数学・幾何学・天文学・物理学・象徴的解釈を、
視覚的かつインタラクティブなWeb作品として探究する個人プロジェクトです。

幾何学的構造や天体運動、時間、波動、次元といったテーマを、
React / Three.js などのWeb技術を用いて可視化・体験化しています。

作品そのものだけでなく、各作品の背景思想をまとめた Concept、
技術構成や実装方針を記録する TechNote、
プロジェクト全体の構造を整理する Architecture なども含めて、
継続的に設計・改善しています。

---

## 主な内容

- インタラクティブな幾何学表現
- 天球・天体運動の可視化
- 数学的・物理的概念のビジュアライゼーション
- 時間・波動・次元をテーマにした実験的作品
- 各作品の Concept ページ
- 各作品の TechNote
- プロジェクト全体の Site Architecture
- レスポンシブデザイン / Mobile UX

---

## 主な作品

- Time Vector Space
- Celestial Sphere
- Tesseract
- Emotion Wave
- Time Geometry
- Horoscope
- その他、数学・宇宙・幾何学をテーマとした作品

---

## 使用技術

- React
- JavaScript
- TypeScript
- Three.js
- @react-three/fiber
- @react-three/drei
- GSAP
- Node.js / TypeScript
- HTML / CSS
- Git / GitHub
- Vercel

---

## 開発

依存関係をインストールします。

```bash
npm install
```

開発サーバーを起動します。

```bash
npm start
```

通常は以下のURLで確認できます。

```text
http://localhost:3000
```

本番用ビルドを作成します。

```bash
npm run build
```

---

## プロジェクト構成

```text
cosmic-geometry/
├─ api/
├─ backend/
├─ docs/
├─ public/
├─ src/
├─ package.json
└─ README.md
```

主な `src/` 構成：

```text
src/
├─ pages/
├─ components/
├─ styles/
├─ assets/
└─ data/
```

主な `docs/` 構成：

```text
docs/
├─ specifications/
├─ architecture/
├─ development-notes/
├─ assets/
│  ├─ source/
│  ├─ references/
│  └─ drafts/
└─ screenshots/
```

---

## Documentation

### `docs/specifications/`

各作品や機能について、
「何を作るか」「どのような動作を目指すか」を整理する仕様書を管理します。

### `docs/architecture/`

Frontend / Backend / Routing / Deployment など、
Cosmic Geometry 全体の技術構成を記録します。

### `docs/development-notes/`

調査結果、設計上の判断、検討過程など、
必要に応じて開発途中の記録を保存します。

### `docs/assets/`

制作過程で使用した資料や素材を管理します。

- `source/` — 自作した制作原稿・SVGなど
- `references/` — コンセプトアート、構想図、参考資料
- `drafts/` — 未採用・検討中の案

### `docs/screenshots/`

開発中・完成時の画面記録をローカルで管理します。

プライバシーやリポジトリ容量を考慮し、
通常のスクリーンショットや画面収録はGit管理対象外としています。

---

## 制作方針

新しい作品では、可能な限り以下の流れで制作を進めます。

```text
Concept
↓
Specification
↓
Math / Data
↓
State / Interaction
↓
UI
↓
Implementation
↓
TechNote
↓
Mobile UX
```

既存作品については、
現在のコードやConceptから仕様・技術構成を逆算し、
段階的にドキュメントを整備しています。

---

## AI-assisted Development

Cosmic Geometry では、調査・実装・コードレビューなどに
AIツールを活用しています。

企画、Concept、要件整理、UI / Visual設計、
実装方針の判断、動作検証、改善については、
プロジェクト全体の方向性を確認しながら進めています。

---

## Deployment

本プロジェクトは Vercel を利用してデプロイしています。

Website: https://cosmic-geometry.vercel.app/

---

# English

Cosmic Geometry is a personal interactive web project exploring
mathematics, geometry, astronomy, physics, and symbolic interpretation
through visual and interactive experiences.

The project visualizes themes such as geometric structures,
celestial motion, time, waves, and dimensions using modern web technologies
including React and Three.js.

In addition to the interactive works themselves,
the project includes Concept pages describing the ideas behind each work,
TechNotes explaining technical structures and implementation decisions,
and Architecture documentation describing the overall system.

---

## Features

- Interactive geometric visualizations
- Celestial and astronomical models
- Mathematical and physical visualizations
- Experimental works exploring time, waves, and dimensions
- Concept pages for each work
- Technical notes
- Project architecture documentation
- Responsive design and Mobile UX

---

## Main Works

- Time Vector Space
- Celestial Sphere
- Tesseract
- Emotion Wave
- Time Geometry
- Horoscope
- Additional works exploring mathematics, space, and geometry

---

## Tech Stack

- React
- JavaScript
- TypeScript
- Three.js
- @react-three/fiber
- @react-three/drei
- GSAP
- Node.js / TypeScript
- HTML / CSS
- Git / GitHub
- Vercel

---

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The application is typically available at:

```text
http://localhost:3000
```

Create a production build:

```bash
npm run build
```

---

## Project Structure

```text
cosmic-geometry/
├─ api/
├─ backend/
├─ docs/
├─ public/
├─ src/
├─ package.json
└─ README.md
```

Main `src/` structure:

```text
src/
├─ pages/
├─ components/
├─ styles/
├─ assets/
└─ data/
```

Main `docs/` structure:

```text
docs/
├─ specifications/
├─ architecture/
├─ development-notes/
├─ assets/
│  ├─ source/
│  ├─ references/
│  └─ drafts/
└─ screenshots/
```

---

## Documentation

### `docs/specifications/`

Contains specifications describing what each work or feature should do,
including expected behavior, interaction, and design requirements.

### `docs/architecture/`

Documents the overall technical structure of Cosmic Geometry,
including frontend, backend, routing, and deployment.

### `docs/development-notes/`

Stores development notes, investigations, design decisions,
and implementation records when needed.

### `docs/assets/`

Stores production-related materials and visual references.

- `source/` — original SVGs and production source assets
- `references/` — concept art, visual references, and design materials
- `drafts/` — experimental or unused design ideas

### `docs/screenshots/`

Stores local screenshots and screen recordings from development.

For privacy and repository size reasons,
regular screenshots and recordings are excluded from Git tracking.

---

## Production Workflow

For new works, the project aims to follow the workflow below:

```text
Concept
↓
Specification
↓
Math / Data
↓
State / Interaction
↓
UI
↓
Implementation
↓
TechNote
↓
Mobile UX
```

For existing works, specifications and technical documentation
are gradually reconstructed from the current code and Concept pages.

---

## AI-assisted Development

AI tools are used to support research, implementation,
code review, and technical investigation.

Project planning, Concept development, requirement organization,
UI / visual design decisions, implementation direction,
testing, verification, and iterative improvement
are managed as part of the overall development process.

---

## Deployment

This project is deployed with Vercel.

Website: https://cosmic-geometry.vercel.app/