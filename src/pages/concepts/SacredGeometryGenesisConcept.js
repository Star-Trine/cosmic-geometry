import { Link } from 'react-router-dom';
import '../../styles/ConceptLayout.css';
import '../works/SacredGeometryGenesis.css';

export default function SacredGeometryGenesisConcept() {
  return (
    <main className="concept-page">
      <header className="concept-hero">
        <p className="concept-eyebrow">Concept（作品構想）</p>
        <h1>Sacred Geometry Genesis</h1>
        <p className="concept-lead">Conceptは準備中です。</p>
        <nav className="sacred-geometry-genesis__links" aria-label="関連ページ">
          <Link to="/works/sacred-geometry-genesis">作品を見る</Link>
          <Link to="/tech-notes/sacred-geometry-genesis">Tech Noteを見る</Link>
        </nav>
      </header>
    </main>
  );
}
