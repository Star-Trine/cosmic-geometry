// ===== Components =====
import Header from './components/Header';
import Navbar from './components/Navbar';
import StarCanvas from './components/StarCanvas';
import 'katex/dist/katex.min.css';

// ===== Styles =====
import './App.css';
import './components/Header.css';

// ===== React =====
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ===== Main Pages =====
import Home from './pages/Home';
import About from './pages/About';
import Works from './pages/Works';
import Concepts from './pages/Concepts';
import Contact from './pages/Contact';
import Sitemap from './pages/Sitemap';

// ===== Works =====
import CelestialSphere from './pages/works/CelestialSphere';
import TimeGeometry from './pages/works/TimeGeometry';
import TimeVectorSpace from './pages/works/TimeVectorSpace';
import InnerProduct from './pages/works/InnerProduct';
import OuterProduct from './pages/works/OuterProduct';
import LinearMap from './pages/works/LinearMap';
import MerkabaVectorEquilibrium from './pages/works/MerkabaVectorEquilibrium';
import PlatonicSolids from './pages/works/PlatonicSolids';
import CircleSystem27720 from './pages/works/CircleSystem27720';
import Tesseract from './pages/works/Tesseract';
import GravityWaveObservatory from './pages/works/GravityWaveObservatory';
import ZeroPoint from './pages/works/ZeroPoint';
import Horoscope from './pages/works/Horoscope';
import ComplexGeometry from './pages/works/ComplexGeometry';
import EmotionWave from './pages/works/EmotionWave';
import Synthesizer from './pages/works/Synthesizer';

// ===== Concepts =====
import MerkabaVectorEquilibriumConcept from './pages/concepts/MerkabaVectorEquilibriumConcept';
import PlatonicSolidsConcept from './pages/concepts/PlatonicSolidsConcept';
import CircleSystem27720Concept from './pages/concepts/CircleSystem27720Concept';
import TesseractConcept from './pages/concepts/TesseractConcept';
import CelestialSphereConcept from './pages/concepts/CelestialSphereConcept';
import GravityWaveObservatoryConcept from './pages/concepts/GravityWaveObservatoryConcept';
import ZeroPointConcept from './pages/concepts/ZeroPointConcept';
import HoroscopeConcept from './pages/concepts/HoroscopeConcept';
import TimeGeometryConcept from './pages/concepts/TimeGeometryConcept';
import TimeVectorSpaceConcept from './pages/concepts/TimeVectorSpaceConcept';
import InnerProductConcept from './pages/concepts/InnerProductConcept';
import OuterProductConcept from './pages/concepts/OuterProductConcept';
import LinearMapConcept from './pages/concepts/LinearMapConcept';
import ComplexGeometryConcept from './pages/concepts/ComplexGeometryConcept';
import EmotionWaveConcept from './pages/concepts/EmotionWaveConcept';
import SynthesizerConcept from './pages/concepts/SynthesizerConcept';
function App() {
  return (
    <>
      <div className="star-background">
        <StarCanvas />
      </div>

      <Router>
        {/* 全体をflexで縦に配置するためのラッパー */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          {/* 中央寄せにしたいコンテンツ */}
          <main className="main-content">
         <Routes>
  {/* メインページ */}
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/works" element={<Works />} />
  <Route path="/concepts" element={<Concepts />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/sitemap" element={<Sitemap />} />

  {/* Works */}
  <Route path="/works/merkaba-vector-equilibrium" element={<MerkabaVectorEquilibrium />} />
  <Route path="/works/platonic-solids" element={<PlatonicSolids />} />
  <Route path="/works/27720-circle-system" element={<CircleSystem27720 />} />
  <Route path="/works/tesseract" element={<Tesseract />} />
  <Route path="/works/celestial-sphere" element={<CelestialSphere />} />
  <Route path="/works/gravity-wave-observatory" element={<GravityWaveObservatory />} />
  <Route path="/works/zero-point" element={<ZeroPoint />} />
  <Route path="/works/horoscope" element={<Horoscope />} />
  <Route path="/works/time-vector-space" element={<TimeVectorSpace />} />
  <Route path="/works/time-geometry" element={<TimeGeometry />} />
  <Route path="/works/inner-product" element={<InnerProduct />} />
  <Route path="/works/outer-product" element={<OuterProduct />} />
  <Route path="/works/linear-map" element={<LinearMap />} />
  <Route path="/works/complex-geometry" element={<ComplexGeometry />} />
  <Route path="/works/emotion-wave" element={<EmotionWave />} />
  <Route path="/works/synthesizer" element={<Synthesizer />} />

  {/* Concepts */}
  <Route path="/concepts/merkaba-vector-equilibrium" element={<MerkabaVectorEquilibriumConcept />} />
  <Route path="/concepts/platonic-solids" element={<PlatonicSolidsConcept />} />
  <Route path="/concepts/27720-circle-system" element={<CircleSystem27720Concept />} />
  <Route path="/concepts/tesseract" element={<TesseractConcept />} />
  <Route
    path="/concepts/celestial-sphere"
    element={<CelestialSphereConcept />}
  />
  <Route path="/concepts/gravity-wave-observatory" element={<GravityWaveObservatoryConcept />} />
  <Route path="/concepts/zero-point" element={<ZeroPointConcept />} />
  <Route path="/concepts/horoscope" element={<HoroscopeConcept />} />
  <Route
    path="/concepts/time-vector-space"
    element={<TimeVectorSpaceConcept />}
  />
  <Route
    path="/concepts/time-geometry"
    element={<TimeGeometryConcept />}
  />
  <Route
    path="/concepts/inner-product"
    element={<InnerProductConcept />}
  />
  <Route
    path="/concepts/outer-product"
    element={<OuterProductConcept />}
  />
  <Route
    path="/concepts/linear-map"
    element={<LinearMapConcept />}
  />
  <Route path="/concepts/complex-geometry" element={<ComplexGeometryConcept />} />
  <Route path="/concepts/emotion-wave" element={<EmotionWaveConcept />} />
  <Route path="/concepts/synthesizer" element={<SynthesizerConcept />} />
</Routes>
          </main>

          {/* フッターとしてのナビゲーション */}
          <footer>
            <Navbar />
          </footer>
        </div>
      </Router>
    </>
  );
}

export default App;
