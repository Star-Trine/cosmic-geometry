// src/pages/Concepts.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Concepts.css';

const conceptCategories = [
  {
    id: 'sacred-geometry',
    title: '神聖幾何学',
    englishTitle: 'Sacred Geometry',
    concepts: [
      {
        title: 'Platonic Solids（プラトン立体）',
        path: '/concepts/platonic-solids',
      },
      {
        title: 'Merkaba & Vector Equilibrium（マカバとベクトル平衡体）',
        path: '/concepts/merkaba-vector-equilibrium',
      },
      {
        title: 'Tesseract（テッセラクト）',
        path: '/concepts/tesseract',
      },
    ],
  },
  {
    id: 'astronomy',
    title: '天文学',
    englishTitle: 'Astronomy',
    concepts: [
      {
        title: 'Celestial Sphere（天球）',
        path: '/concepts/celestial-sphere',
      },
      {
        title: 'Gravity Wave Observatory（重力波観測所）',
        path: '/concepts/gravity-wave-observatory',
      },
      {
        title: 'Zero Point（ゼロ・ポイント）',
        path: '/concepts/zero-point',
      },
    ],
  },
  {
    id: 'astrology',
    title: '占星学',
    englishTitle: 'Astrology',
    concepts: [
      {
        title: 'Horoscope（ホロスコープ）',
        path: '/concepts/horoscope',
      },
      {
        title: '27720 Circle System（27720円体系）',
        path: '/concepts/27720-circle-system',
      },
    ],
  },
  {
    id: 'time-geometry',
    title: '時間幾何学',
    englishTitle: 'Time Geometry',
    concepts: [
      {
        title: 'Time Vector Space（時間ベクトル空間）',
        path: '/concepts/time-vector-space',
      },
      {
        title: 'Inner Product（内積）',
        path: '/concepts/inner-product',
      },
      {
        title: 'Outer Product（外積）',
        path: '/concepts/outer-product',
      },
      {
        title: 'Linear Transformation（線形変換）',
        path: '/concepts/linear-map',
      },
      {
        title: 'Time Synchronization Experiment（時間同期実験）',
        path: '/concepts/time-geometry',
      },
    ],
  },
  {
    id: 'wave-laboratory',
    title: '波動実験室',
    englishTitle: 'Wave Laboratory',
    concepts: [
      {
        title: 'Emotion Wave（感情の波）',
        path: '/concepts/emotion-wave',
      },
    ],
  },
  {
    id: 'digital-audio',
    title: '音響・DTM',
    englishTitle: 'Sound / DTM',
    concepts: [
      {
        title: 'Synthesizer（シンセサイザー）',
        path: '/concepts/synthesizer',
      },
    ],
  },
  {
    id: 'complex-geometry',
    title: '複素幾何学',
    englishTitle: 'Complex Geometry',
    concepts: [
      {
        title: 'Complex Geometry（複素幾何学）',
        path: '/concepts/complex-geometry',
      },
    ],
  },
];

function Concepts() {
  const [openCategory, setOpenCategory] = useState(null);

  const handleCategoryClick = (categoryId) => {
    setOpenCategory((currentCategory) =>
      currentCategory === categoryId ? null : categoryId
    );
  };

  return (
    <main className="concepts">
      <h1>Concepts</h1>

      <p>
        このページでは、各作品の設計思想、数学的背景、実装方法、
        制作メモなどをまとめています。
      </p>

      <div className="concepts-category-list">
        {conceptCategories.map((category) => {
          const isOpen = openCategory === category.id;

          return (
            <section
              key={category.id}
              className={`concepts-category ${isOpen ? 'is-open' : ''}`}
            >
              <button
                type="button"
                className="concepts-category-button"
                onClick={() => handleCategoryClick(category.id)}
                aria-expanded={isOpen}
                aria-controls={`${category.id}-concepts`}
              >
                <span>
                  {category.englishTitle}（{category.title}）
                </span>

                <span
                  className="concepts-category-icon"
                  aria-hidden="true"
                >
                  {isOpen ? '−' : '＋'}
                </span>
              </button>

              {isOpen && (
                <ul
                  id={`${category.id}-concepts`}
                  className="concepts-list"
                >
                  {category.concepts.map((concept) => (
                    <li key={concept.path}>
                      <Link to={concept.path}>{concept.title}</Link>
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

export default Concepts;
