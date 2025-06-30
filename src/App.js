import './App.css';
import Header from './components/Header';
import './components/Header.css';
import StarCanvas from './components/StarCanvas';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Works from './pages/Works';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Sitemap from './pages/Sitemap';
import TimeGeometry from './pages/works/TimeGeometry';
import TimeGeometry3d from './pages/works/TimeGeometry3d';
import InnerProduct from './pages/works/InnerProduct';
import OuterProduct from './pages/works/OuterProduct';
import LinearMap from './pages/works/LinearMap';

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
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/works" element={<Works />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sitemap" element={<Sitemap />} />
              {/* 作品ページ */}
              <Route path="/works/time-geometry" element={<TimeGeometry />} />
              <Route path="/works/time-geometry-3d" element={<TimeGeometry3d />} />
              <Route path="/works/inner-product" element={<InnerProduct />} />
              <Route path="/works/outer-product" element={<OuterProduct />} />
              <Route path="/works/linear-map" element={<LinearMap />} />
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
