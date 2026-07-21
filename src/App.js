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
import TimeGeometry3d from './pages/works/TimeGeometry3d';
import InnerProduct from './pages/works/InnerProduct';
import OuterProduct from './pages/works/OuterProduct';
import LinearMap from './pages/works/LinearMap';

// ===== Concepts =====
import CelestialSphereConcept from './pages/concepts/CelestialSphereConcept';
import TimeGeometryConcept from './pages/concepts/TimeGeometryConcept';
import TimeGeometry3dConcept from './pages/concepts/TimeGeometry3dConcept';
import InnerProductConcept from './pages/concepts/InnerProductConcept';
import OuterProductConcept from './pages/concepts/OuterProductConcept';
import LinearMapConcept from './pages/concepts/LinearMapConcept';
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
  <Route path="/works/celestial-sphere" element={<CelestialSphere />} />
  <Route path="/works/time-geometry" element={<TimeGeometry />} />
  <Route path="/works/time-geometry-3d" element={<TimeGeometry3d />} />
  <Route path="/works/inner-product" element={<InnerProduct />} />
  <Route path="/works/outer-product" element={<OuterProduct />} />
  <Route path="/works/linear-map" element={<LinearMap />} />

  {/* Concepts */}
  <Route
    path="/concepts/celestial-sphere"
    element={<CelestialSphereConcept />}
  />
  <Route
    path="/concepts/time-geometry"
    element={<TimeGeometryConcept />}
  />
  <Route
    path="/concepts/time-geometry-3d"
    element={<TimeGeometry3dConcept />}
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
