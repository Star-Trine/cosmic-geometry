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
import TechNotes from './pages/TechNotes';
import Contact from './pages/Contact';
import Sitemap from './pages/Sitemap';

// ===== Works =====
import CelestialSphere from './pages/works/CelestialSphere';
import TimeGeometry from './pages/works/TimeGeometry';
import TimeVectorSpace from './pages/works/TimeVectorSpace';
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
import ComplexGeometryConcept from './pages/concepts/ComplexGeometryConcept';
import EmotionWaveConcept from './pages/concepts/EmotionWaveConcept';
import SynthesizerConcept from './pages/concepts/SynthesizerConcept';

// ===== TechNotes =====
import PlatonicSolidsTechNote from './pages/techNotes/PlatonicSolidsTechNote';
import MerkabaVectorEquilibriumTechNote from './pages/techNotes/MerkabaVectorEquilibriumTechNote';
import TesseractTechNote from './pages/techNotes/TesseractTechNote';
import CelestialSphereTechNote from './pages/techNotes/CelestialSphereTechNote';
import GravityWaveObservatoryTechNote from './pages/techNotes/GravityWaveObservatoryTechNote';
import ZeroPointTechNote from './pages/techNotes/ZeroPointTechNote';
import HoroscopeTechNote from './pages/techNotes/HoroscopeTechNote';
import CircleSystem27720TechNote from './pages/techNotes/CircleSystem27720TechNote';
import TimeVectorSpaceTechNote from './pages/techNotes/TimeVectorSpaceTechNote';
import TimeGeometryTechNote from './pages/techNotes/TimeGeometryTechNote';
import EmotionWaveTechNote from './pages/techNotes/EmotionWaveTechNote';
import SynthesizerTechNote from './pages/techNotes/SynthesizerTechNote';
import ComplexGeometryTechNote from './pages/techNotes/ComplexGeometryTechNote';
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
  <Route path="/tech-notes" element={<TechNotes />} />
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
  <Route path="/concepts/complex-geometry" element={<ComplexGeometryConcept />} />
  <Route path="/concepts/emotion-wave" element={<EmotionWaveConcept />} />
  <Route path="/concepts/synthesizer" element={<SynthesizerConcept />} />

  {/* TechNotes */}
  <Route path="/tech-notes/platonic-solids" element={<PlatonicSolidsTechNote />} />
  <Route path="/tech-notes/merkaba-vector-equilibrium" element={<MerkabaVectorEquilibriumTechNote />} />
  <Route path="/tech-notes/tesseract" element={<TesseractTechNote />} />
  <Route path="/tech-notes/celestial-sphere" element={<CelestialSphereTechNote />} />
  <Route path="/tech-notes/gravity-wave-observatory" element={<GravityWaveObservatoryTechNote />} />
  <Route path="/tech-notes/zero-point" element={<ZeroPointTechNote />} />
  <Route path="/tech-notes/horoscope" element={<HoroscopeTechNote />} />
  <Route path="/tech-notes/27720-circle-system" element={<CircleSystem27720TechNote />} />
  <Route path="/tech-notes/time-vector-space" element={<TimeVectorSpaceTechNote />} />
  <Route path="/tech-notes/time-geometry" element={<TimeGeometryTechNote />} />
  <Route path="/tech-notes/emotion-wave" element={<EmotionWaveTechNote />} />
  <Route path="/tech-notes/synthesizer" element={<SynthesizerTechNote />} />
  <Route path="/tech-notes/complex-geometry" element={<ComplexGeometryTechNote />} />
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
