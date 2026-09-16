import { Link } from 'react-router-dom';
import '../../styles/TechNoteLayout.css';
import '../works/SacredGeometryGenesis.css';

export default function SacredGeometryGenesisTechNote() {
  return (
    <main className="tech-note-page">
      <header className="tech-note-hero">
        <p className="tech-note-eyebrow">TechNote（技術解説）</p>
        <h1>TechNote</h1>
        <p className="tech-note-work-title">Sacred Geometry Genesis</p>
        <div className="tech-note-intro">
          <p>Tech Noteは準備中です。</p>
        </div>
        <nav className="sacred-geometry-genesis__links" aria-label="関連ページ">
          <Link to="/works/sacred-geometry-genesis">作品を見る</Link>
          <Link to="/concepts/sacred-geometry-genesis">Conceptを見る</Link>
        </nav>
      </header>
    </main>
  );
}
