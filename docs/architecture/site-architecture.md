# Cosmic Geometry — Site Architecture

## 1. Purpose（目的）

このドキュメントでは、Cosmic Geometry全体の現在のArchitectureと、各レイヤーの責務を整理します。

公開サイト上の「Site Architecture」ページが閲覧者向けの概要を示すのに対し、このドキュメントでは開発・保守を目的として、Frontend、API、Backend、External Service、Rendering、Deploymentなどの関係をより詳しく記録します。

---

## 2. Current Architecture（現在の構成）

Cosmic Geometryは、ReactによるSingle Page Application（SPA）を中心に構成されています。

現在の主要な構成は次の通りです。

```text
User
↓
React SPA
↓
Page / Work / UI Components
↓
Frontend Logic / API Client
↓
Vercel Functions
↓
Backend Service
↓
Validation / Normalization / Calculation
↓
External API
```

すべての作品がBackendを必要とするわけではありません。

作品の性質に応じて、Frontend内部だけで計算・描画が完結する構成と、API / Backendを利用する構成を使い分けています。

---

## 3. Page and Content Structure（ページとコンテンツ構成）

サイト内のコンテンツは、主に以下の役割に分けています。

### Works

インタラクティブ作品そのものを表示します。

各作品は、それぞれ固有の計算、Rendering、UI、Interactionを持ちます。

### Concepts

作品の背景にある思想や、数学・宇宙・幾何学などのConceptを説明します。

実装方法そのものではなく、「何を表現する作品なのか」という背景を扱います。

### TechNotes

作品の実装方法、技術的背景、計算方法などを説明します。

### Site Architecture

Cosmic Geometry全体の技術構成と、それぞれの責務を説明します。

### Sitemap

サイト内のページ構造と導線を整理します。

---

## 4. Shared Visual Shell（共通ビジュアル構成）

サイト全体では、共通のVisual Layerを利用しています。

主な共通要素は以下です。

```text
Header
StarCanvas
main-content
Navbar
```

これらがサイト共通の外枠を形成し、その内側に各ページ・作品固有のContentを表示します。

共通Visual Shellと作品固有UIを分離することで、サイト全体の世界観を維持しながら、各作品で異なるInteractionを実装できる構成にしています。

---

## 5. Routing

ページ遷移はReact Routerによって管理しています。

`App.js` をRoutingの主要な入口とし、一覧ページ、作品ページ、Concept、TechNoteなどのRouteをまとめて管理します。

主なページ群は以下です。

```text
Home
About
Works
Individual Works
Concepts
TechNotes
Contact
Site Architecture
Sitemap
Privacy Policy
```

内部ページへの移動には `react-router-dom` の `Link` などを利用し、SPA内部でNavigationを行います。

---

## 6. Shared Components（共通コンポーネント）

サイト全体で使用する共通Componentと、作品固有Componentを分けています。

### Global Components

主な共通Componentは以下です。

```text
Header
Navbar
StarCanvas
```

これらは、サイト全体のLayout、Navigation、Visual表現などを担当します。

### Work Components

各作品内部では、必要に応じて描画、Control、Information表示などのComponentを利用します。

作品固有の処理についても、可能な範囲でComponentや処理単位に分離し、UIと計算処理が過度に密結合しない構成を目指しています。

---

## 7. Frontend Responsibility（フロントエンドの責務）

Frontendでは、主に以下を担当します。

```text
UI
User Input
Interaction
Page State
Visual Data Display
Rendering
API Request
API Response Display
```

ReactをUI構築の中心として使用し、作品の性質に応じてJavaScript / TypeScriptによる計算処理を組み合わせています。

Frontendだけで完結する作品では、入力、計算、Visual Data生成、RenderingまでをClient側で処理します。

Backendが必要な機能では、FrontendからAPIへRequestを送り、返されたDataをUIやVisualizationへ反映します。

---

## 8. Rendering and Interaction Technologies（描画・インタラクション技術）

作品の目的に応じて、複数のRendering技術を使い分けています。

主な技術は以下です。

```text
SVG
Canvas 2D
Three.js
React Three Fiber
Drei
GSAP
KaTeX
```

たとえば、数学的な2D図形やPath表現ではSVG、3D空間や幾何学表現ではThree.js / React Three Fiberなど、作品の表現目的に合わせてRendering方式を選択しています。

AnimationにはGSAPや各Rendering Layerに適した更新処理を使用し、数式表示にはKaTeXを利用しています。

---

## 9. API Boundary（API境界）

Backendを必要とする機能では、Vercel FunctionsをFrontendとBackendのAPI Boundaryとして利用しています。

現在、APIを利用する機能には以下があります。

```text
Contact
Horoscope
Location
```

基本的なData Flowは次の形です。

```text
Frontend
↓
HTTP Request
↓
Vercel Function
↓
Backend Service
↓
Response
↓
Frontend
```

Vercel FunctionはHTTP Request / Responseの境界として機能し、FrontendとBackendの責務を分離します。

---

## 10. Backend Responsibility（バックエンドの責務）

BackendではNode.js / TypeScriptを利用しています。

Horoscopeなどの機能では、主に以下の処理を担当します。

```text
Request Validation
External API Communication
Data Normalization
Calculation
Data Transformation
Response Creation
```

Frontendから受け取ったInputを検証し、必要に応じてExternal APIとの通信やCalculationを行います。

取得したDataについても、そのままFrontendへ渡すのではなく、必要なNormalizationやTransformationを行い、Frontendが利用しやすいData Structureへ整形して返します。

---

## 11. External API Boundary（外部API境界）

External APIを利用する機能では、外部Serviceとの通信をBackend側で扱います。

基本的な構造は以下です。

```text
Frontend
↓
Vercel Function
↓
Backend Service
↓
External API
↓
Backend Service
↓
Normalization / Calculation
↓
Frontend
```

External API固有のResponse形式をFrontendへ直接依存させるのではなく、Backendで必要な形式へ変換することで、External ServiceとUIの責務を分離します。

---

## 12. Data Flow（データフロー）

Cosmic Geometryでは、機能の処理を可能な範囲で以下のような責務境界として捉えています。

```text
Input
↓
Validation
↓
Processing
↓
Normalization
↓
Calculation
↓
Visual Data
↓
Rendering
```

Horoscopeでは、この構造が比較的明確に分離されています。

今後はTesseract、Celestial Sphere、Emotion Wave、Time Vector Space、Time Geometryなどの既存作品についてもData Flowを逆算し、それぞれの責務境界を整理していきます。

---

## 13. Application Responsibility（アプリケーションの責務分離）

Architecture上では、以下の責務を可能な範囲で分離します。

```text
Frontend
├─ UI
├─ Input
├─ Interaction
└─ Rendering

API
├─ HTTP Request
├─ HTTP Response
└─ Frontend / Backend Boundary

Backend
├─ Validation
├─ Normalization
├─ Calculation
└─ External Service Integration

External Service
└─ External Data / External Processing
```

作品固有のCalculationやVisual Data生成についても、Rendering Layerから責務を分離する構成を基本方針としています。

---

## 14. Responsive Design

共通Breakpointと固定Navbarを考慮したLayoutを基礎としながら、各作品固有の操作体験に応じてResponsive Designを調整しています。

共通Layoutと作品固有Layoutを分けることで、サイト全体の一貫性と、作品ごとの操作性を両立させています。

---

## 15. Build and Version Control（ビルド・バージョン管理）

開発から公開までは、以下の流れを基本としています。

```text
Local Development
↓
npm Build
↓
Git
↓
GitHub
↓
main Branch
↓
Vercel
↓
Production
```

npmによる開発・本番Buildを行い、Gitで変更履歴を管理しています。

ソースコードはGitHubで管理し、main Branchへの反映後はVercelと連携してProduction環境へDeploymentします。

これにより、開発、履歴管理、公開までを一連のFlowとして運用しています。

---

## 16. Design & Development Records（設計・開発記録）

設計や制作過程は、`docs/` を中心に記録しています。

主なDocumentation対象は以下です。

```text
Requirements
Specifications
Architecture
Data Flow
Development Notes
Concept References
Screenshots
SVG Sources
Testing Records
```

完成済み作品についても、実装されたCodeからArchitecture、Data Flow、Responsibility、Input / Outputなどを逆算し、設計資料として整理していきます。

---

## 17. Site Operations（サイト運用）

Production環境ではVercelを利用しています。

主な運用要素は以下です。

```text
Vercel Deployment
Vercel Analytics
Speed Insights
```

Vercel Analyticsによってアクセス状況を確認し、Speed InsightsによってWeb Performanceを確認しています。

---

## 18. Privacy and Input Handling（プライバシー・入力情報）

Contact FormなどUser Inputを扱う機能では、入力検証やSpam対策を行っています。

Frontend側のValidationだけに依存せず、必要な機能ではAPI BoundaryでもValidationを実施します。

利用しているExternal Serviceや取得する情報など、データの取り扱いに関する詳細はPrivacy Policyに記載しています。

---

## 19. Planned / Future Architecture（将来の構成）

次の個人制作上のArchitecture拡張候補として、PostgreSQLを利用したDatabase Layerの導入を検討しています。

想定する基本構造は以下です。

```text
React Frontend
↓
Vercel Functions
↓
Node.js / TypeScript Backend
↓
PostgreSQL
```

これにより、

```text
Frontend
Backend
API
Database
```

までを一つのApplication Architectureとして扱い、データの永続化を含む構成へ発展させることを目指します。

AuthenticationやCloud Infrastructureについては、今後の作品や機能で必要性が生じた段階で導入を検討します。

---

## 20. Architecture Development Policy（設計・開発方針）

今後の新規作品では、可能な範囲で以下の順序を意識して制作します。

```text
Concept
↓
Specification
↓
Architecture
↓
Data Flow
↓
Responsibility
↓
Boundary
↓
Test
↓
Implementation
↓
Documentation
↓
Production
```

一方、すでに完成している既存作品については、完成した作品とCodeを起点として逆方向に構造を確認します。

```text
Production Work
↓
Data Flow
↓
Responsibility
↓
Input / Output
↓
Boundary
↓
Code
↓
Test
```

この方法によって、既存作品を単に「動く成果物」として残すのではなく、Architecture、Data Flow、責務境界を説明でき、変更時に検証・保守できるSoftwareとして整理していきます。

---

## 21. Architecture Overview（全体構成）

現在のCosmic Geometry全体を大きく整理すると、以下の構成になります。

```text
Cosmic Geometry

├─ React SPA
│  ├─ Shared Visual Shell
│  ├─ Pages
│  ├─ Works
│  ├─ Concepts
│  ├─ TechNotes
│  └─ Shared Components
│
├─ Rendering / Interaction
│  ├─ SVG
│  ├─ Canvas 2D
│  ├─ Three.js
│  ├─ React Three Fiber / Drei
│  ├─ GSAP
│  └─ KaTeX
│
├─ API
│  └─ Vercel Functions
│
├─ Backend
│  ├─ Node.js
│  ├─ TypeScript
│  ├─ Validation
│  ├─ Normalization
│  ├─ Calculation
│  └─ External API Integration
│
├─ Documentation
│  ├─ Requirements
│  ├─ Specifications
│  ├─ Architecture
│  ├─ Data Flow
│  ├─ Development Notes
│  └─ Testing Records
│
└─ Production / Operations
   ├─ Git
   ├─ GitHub
   ├─ Vercel
   ├─ Vercel Analytics
   └─ Speed Insights

Future
└─ PostgreSQL Database Layer
```

このArchitectureを基礎として、作品ごとの設計・Data Flow・Boundary Testを今後さらに整理していきます。