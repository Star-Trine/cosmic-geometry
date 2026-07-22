// ===== Components =====
import Header from './components/Header';
import Navbar from './components/Navbar';
import StarCanvas from './components/StarCanvas';

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
import Tesseract from './pages/works/Tesseract';
import GravityWaveObservatory from './pages/works/GravityWaveObservatory';
import SolarSystem from './pages/works/SolarSystem';
import Exoplanets from './pages/works/Exoplanets';
import ConstellationsAsterisms from './pages/works/ConstellationsAsterisms';
import Zodiac from './pages/works/Zodiac';
import NatalChart from './pages/works/NatalChart';
import AstrologicalHouses from './pages/works/AstrologicalHouses';
import Aspects from './pages/works/Aspects';
import Transits from './pages/works/Transits';
import ComplexPlaneViewer from './pages/works/ComplexPlaneViewer';
import EulerFormulaVisualizer from './pages/works/EulerFormulaVisualizer';
import ComplexMappingViewer from './pages/works/ComplexMappingViewer';
import Oscillator from './pages/works/Oscillator';
import FourierSeries from './pages/works/FourierSeries';
import FourierTransform from './pages/works/FourierTransform';
import Synthesizer from './pages/works/Synthesizer';
import AdsrEnvelope from './pages/works/AdsrEnvelope';
import EffectChain from './pages/works/EffectChain';

// ===== Concepts =====
import MerkabaVectorEquilibriumConcept from './pages/concepts/MerkabaVectorEquilibriumConcept';
import PlatonicSolidsConcept from './pages/concepts/PlatonicSolidsConcept';
import TesseractConcept from './pages/concepts/TesseractConcept';
import CelestialSphereConcept from './pages/concepts/CelestialSphereConcept';
import GravityWaveObservatoryConcept from './pages/concepts/GravityWaveObservatoryConcept';
import SolarSystemConcept from './pages/concepts/SolarSystemConcept';
import ExoplanetsConcept from './pages/concepts/ExoplanetsConcept';
import ConstellationsAsterismsConcept from './pages/concepts/ConstellationsAsterismsConcept';
import ZodiacConcept from './pages/concepts/ZodiacConcept';
import NatalChartConcept from './pages/concepts/NatalChartConcept';
import AstrologicalHousesConcept from './pages/concepts/AstrologicalHousesConcept';
import AspectsConcept from './pages/concepts/AspectsConcept';
import TransitsConcept from './pages/concepts/TransitsConcept';
import TimeGeometryConcept from './pages/concepts/TimeGeometryConcept';
import TimeVectorSpaceConcept from './pages/concepts/TimeVectorSpaceConcept';
import InnerProductConcept from './pages/concepts/InnerProductConcept';
import OuterProductConcept from './pages/concepts/OuterProductConcept';
import LinearMapConcept from './pages/concepts/LinearMapConcept';
import ComplexPlaneViewerConcept from './pages/concepts/ComplexPlaneViewerConcept';
import EulerFormulaVisualizerConcept from './pages/concepts/EulerFormulaVisualizerConcept';
import ComplexMappingViewerConcept from './pages/concepts/ComplexMappingViewerConcept';
import OscillatorConcept from './pages/concepts/OscillatorConcept';
import FourierSeriesConcept from './pages/concepts/FourierSeriesConcept';
import FourierTransformConcept from './pages/concepts/FourierTransformConcept';
import SynthesizerConcept from './pages/concepts/SynthesizerConcept';
import AdsrEnvelopeConcept from './pages/concepts/AdsrEnvelopeConcept';
import EffectChainConcept from './pages/concepts/EffectChainConcept';
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
  <Route path="/works/tesseract" element={<Tesseract />} />
  <Route path="/works/celestial-sphere" element={<CelestialSphere />} />
  <Route path="/works/gravity-wave-observatory" element={<GravityWaveObservatory />} />
  <Route path="/works/solar-system" element={<SolarSystem />} />
  <Route path="/works/exoplanets" element={<Exoplanets />} />
  <Route path="/works/constellations-asterisms" element={<ConstellationsAsterisms />} />
  <Route path="/works/zodiac" element={<Zodiac />} />
  <Route path="/works/natal-chart" element={<NatalChart />} />
  <Route path="/works/astrological-houses" element={<AstrologicalHouses />} />
  <Route path="/works/aspects" element={<Aspects />} />
  <Route path="/works/transits" element={<Transits />} />
  <Route path="/works/time-vector-space" element={<TimeVectorSpace />} />
  <Route path="/works/time-geometry" element={<TimeGeometry />} />
  <Route path="/works/inner-product" element={<InnerProduct />} />
  <Route path="/works/outer-product" element={<OuterProduct />} />
  <Route path="/works/linear-map" element={<LinearMap />} />
  <Route path="/works/complex-plane-viewer" element={<ComplexPlaneViewer />} />
  <Route path="/works/euler-formula-visualizer" element={<EulerFormulaVisualizer />} />
  <Route path="/works/complex-mapping-viewer" element={<ComplexMappingViewer />} />
  <Route path="/works/oscillator" element={<Oscillator />} />
  <Route path="/works/fourier-series" element={<FourierSeries />} />
  <Route path="/works/fourier-transform" element={<FourierTransform />} />
  <Route path="/works/synthesizer" element={<Synthesizer />} />
  <Route path="/works/adsr-envelope" element={<AdsrEnvelope />} />
  <Route path="/works/effect-chain" element={<EffectChain />} />

  {/* Concepts */}
  <Route path="/concepts/merkaba-vector-equilibrium" element={<MerkabaVectorEquilibriumConcept />} />
  <Route path="/concepts/platonic-solids" element={<PlatonicSolidsConcept />} />
  <Route path="/concepts/tesseract" element={<TesseractConcept />} />
  <Route
    path="/concepts/celestial-sphere"
    element={<CelestialSphereConcept />}
  />
  <Route path="/concepts/gravity-wave-observatory" element={<GravityWaveObservatoryConcept />} />
  <Route path="/concepts/solar-system" element={<SolarSystemConcept />} />
  <Route path="/concepts/exoplanets" element={<ExoplanetsConcept />} />
  <Route path="/concepts/constellations-asterisms" element={<ConstellationsAsterismsConcept />} />
  <Route path="/concepts/zodiac" element={<ZodiacConcept />} />
  <Route path="/concepts/natal-chart" element={<NatalChartConcept />} />
  <Route path="/concepts/astrological-houses" element={<AstrologicalHousesConcept />} />
  <Route path="/concepts/aspects" element={<AspectsConcept />} />
  <Route path="/concepts/transits" element={<TransitsConcept />} />
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
  <Route path="/concepts/complex-plane-viewer" element={<ComplexPlaneViewerConcept />} />
  <Route path="/concepts/euler-formula-visualizer" element={<EulerFormulaVisualizerConcept />} />
  <Route path="/concepts/complex-mapping-viewer" element={<ComplexMappingViewerConcept />} />
  <Route path="/concepts/oscillator" element={<OscillatorConcept />} />
  <Route path="/concepts/fourier-series" element={<FourierSeriesConcept />} />
  <Route path="/concepts/fourier-transform" element={<FourierTransformConcept />} />
  <Route path="/concepts/synthesizer" element={<SynthesizerConcept />} />
  <Route path="/concepts/adsr-envelope" element={<AdsrEnvelopeConcept />} />
  <Route path="/concepts/effect-chain" element={<EffectChainConcept />} />
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
