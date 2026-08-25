import { useState } from 'react';
import { Link } from 'react-router-dom';
import './TechNotes.css';

const techNoteCategories = [
  {
    id: 'interpretation',
    title: '既存概念の再解釈・拡張',
    englishTitle: 'Interpretation',
    techNotes: [
      {
        title: 'Tesseract（テッセラクト）',
        path: '/tech-notes/tesseract',
        type: '4D Projection / Particle Visualization',
        technologies: ['React', 'JavaScript', 'R3F', 'Three.js'],
      },
      {
        title: 'Celestial Sphere（天球）',
        path: '/tech-notes/celestial-sphere',
        type: 'Celestial Coordinate Visualization',
        technologies: ['React', 'JavaScript', 'R3F', 'Three.js'],
      },
      {
        title: 'Horoscope（ホロスコープ）',
        path: '/tech-notes/horoscope',
        type: 'Natal Chart / Visual Profile',
        technologies: ['React', 'TypeScript', 'SVG', 'Node.js', 'FreeAstroAPI'],
      },
    ],
  },
  {
    id: 'original-theory',
    title: '独自理論・独自体系',
    englishTitle: 'Original Theory',
    techNotes: [
      {
        title: 'Time Vector Space（時間ベクトル空間）',
        path: '/tech-notes/time-vector-space',
        type: 'Interactive 3D Mathematics',
        technologies: ['React', 'JavaScript', 'R3F', 'Three.js', 'KaTeX'],
      },
      {
        title: 'Time Synchronization Experiment（時間同期実験）',
        path: '/tech-notes/time-geometry',
        type: 'SVG Vector Animation',
        technologies: ['React', 'JavaScript', 'SVG', 'CSS'],
      },
      {
        title: 'Emotion Wave（感情の波）',
        path: '/tech-notes/emotion-wave',
        type: 'Interactive Wave Visualization',
        technologies: ['React', 'JavaScript', 'SVG', 'CSS'],
      },
    ],
  },
  {
    id: 'sensory-experiments',
    title: '感覚表現の実験',
    englishTitle: 'Sensory Experiments',
    techNotes: [
      {
        title: 'Synthesizer（シンセサイザー）',
        path: '/tech-notes/synthesizer',
        type: 'Audio Interaction / Planned Work',
        technologies: [],
        status: 'Coming Soon',
      },
    ],
  },
];

export default function TechNotes() {
  const [openCategory, setOpenCategory] = useState(null);

  return (
    <main className="tech-notes">
      <h1>TechNote（技術解説）</h1>
      <p className="tech-notes-intro">
        各作品を支える技術、構造、描画や計算の仕組みをまとめています。
      </p>

      <div className="tech-notes-category-list">
        {techNoteCategories.map((category) => {
          const isOpen = openCategory === category.id;

          return (
            <section
              key={category.id}
              className={`tech-notes-category ${isOpen ? 'is-open' : ''}`}
            >
              <button
                type="button"
                className="tech-notes-category-button"
                aria-expanded={isOpen}
                aria-controls={`${category.id}-tech-notes`}
                onClick={() =>
                  setOpenCategory((current) =>
                    current === category.id ? null : category.id
                  )
                }
              >
                <span>{category.englishTitle}（{category.title}）</span>
                <span className="tech-notes-category-icon" aria-hidden="true">
                  {isOpen ? '−' : '＋'}
                </span>
              </button>

              {isOpen && (
                <ul id={`${category.id}-tech-notes`} className="tech-notes-list">
                  {category.techNotes.map((techNote) => (
                    <li key={techNote.path}>
                      <Link to={techNote.path}>
                        <span className="tech-notes-item-title">
                          {techNote.title}
                        </span>
                        <span className="tech-notes-item-type">
                          {techNote.type}
                        </span>

                        <span className="tech-notes-item-labels">
                          {techNote.technologies.map((technology) => (
                            <span
                              key={technology}
                              className="tech-notes-technology"
                            >
                              {technology}
                            </span>
                          ))}

                          {techNote.consideringTechnologies?.map((technology) => (
                            <span
                              key={technology}
                              className="tech-notes-technology is-considering"
                            >
                              検討中: {technology}
                            </span>
                          ))}

                          {techNote.status && (
                            <span className="tech-notes-status">
                              {techNote.status}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
