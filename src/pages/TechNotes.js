import { useState } from 'react';
import { Link } from 'react-router-dom';
import './TechNotes.css';

const techNoteCategories = [
  {
    id: 'sacred-geometry',
    title: '神聖幾何学',
    englishTitle: 'Sacred Geometry',
    techNotes: [
      { title: 'Platonic Solids（プラトン立体）', path: '/tech-notes/platonic-solids' },
      { title: 'Merkaba & Vector Equilibrium（マカバとベクトル平衡体）', path: '/tech-notes/merkaba-vector-equilibrium' },
      { title: 'Tesseract（テッセラクト）', path: '/tech-notes/tesseract' },
    ],
  },
  {
    id: 'astronomy',
    title: '天文学',
    englishTitle: 'Astronomy',
    techNotes: [
      { title: 'Celestial Sphere（天球）', path: '/tech-notes/celestial-sphere' },
      { title: 'Gravity Wave Observatory（重力波観測所）', path: '/tech-notes/gravity-wave-observatory' },
      { title: 'Zero Point（ゼロ・ポイント）', path: '/tech-notes/zero-point' },
    ],
  },
  {
    id: 'astrology',
    title: '占星学',
    englishTitle: 'Astrology',
    techNotes: [
      { title: 'Horoscope（ホロスコープ）', path: '/tech-notes/horoscope' },
      { title: '27720 Circle System（27720円体系）', path: '/tech-notes/27720-circle-system' },
    ],
  },
  {
    id: 'time-geometry',
    title: '時間幾何学',
    englishTitle: 'Time Geometry',
    techNotes: [
      { title: 'Time Vector Space（時間ベクトル空間）', path: '/tech-notes/time-vector-space' },
      { title: 'Time Synchronization Experiment（時間同期実験）', path: '/tech-notes/time-geometry' },
    ],
  },
  {
    id: 'wave-laboratory',
    title: '波動実験室',
    englishTitle: 'Wave Laboratory',
    techNotes: [
      { title: 'Emotion Wave（感情の波）', path: '/tech-notes/emotion-wave' },
    ],
  },
  {
    id: 'digital-audio',
    title: '音響・DTM',
    englishTitle: 'Sound / DTM',
    techNotes: [
      { title: 'Synthesizer（シンセサイザー）', path: '/tech-notes/synthesizer' },
    ],
  },
  {
    id: 'complex-geometry',
    title: '複素幾何学',
    englishTitle: 'Complex Geometry',
    techNotes: [
      { title: 'Complex Geometry（複素幾何学）', path: '/tech-notes/complex-geometry' },
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
                      <Link to={techNote.path}>{techNote.title}</Link>
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
