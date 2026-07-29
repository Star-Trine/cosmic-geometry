// src/pages/Works.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Works.css';

const worksCategories = [
  {
    id: 'sacred-geometry',
    title: '神聖幾何学',
    englishTitle: 'Sacred Geometry',
    works: [
      {
        title: 'Platonic Solids（プラトン立体）',
        path: '/works/platonic-solids',
      },
      {
        title: 'Merkaba & Vector Equilibrium（マカバとベクトル平衡体）',
        path: '/works/merkaba-vector-equilibrium',
      },
      {
        title: 'Tesseract（テッセラクト）',
        path: '/works/tesseract',
      },
    ],
  },
  {
    id: 'astronomy',
    title: '天文学',
    englishTitle: 'Astronomy',
    works: [
      {
        title: 'Celestial Sphere（天球）',
        path: '/works/celestial-sphere',
      },
      {
        title: 'Gravity Wave Observatory（重力波観測所）',
        path: '/works/gravity-wave-observatory',
      },
      {
        title: 'Zero Point（ゼロ・ポイント）',
        path: '/works/zero-point',
      },
    ],
  },
  {
    id: 'astrology',
    title: '占星学',
    englishTitle: 'Astrology',
    works: [
      {
        title: 'Horoscope（ホロスコープ）',
        path: '/works/horoscope',
      },
      {
        title: '27720 Circle System（27720円体系）',
        path: '/works/27720-circle-system',
      },
    ],
  },
  {
    id: 'time-geometry',
    title: '時間幾何学',
    englishTitle: 'Time Geometry',
    works: [
      {
        title: 'Time Vector Space（時間ベクトル空間）',
        path: '/works/time-vector-space',
      },
      {
        title: 'Inner Product（内積）',
        path: '/works/inner-product',
      },
      {
        title: 'Outer Product（外積）',
        path: '/works/outer-product',
      },
      {
        title: 'Linear Transformation（線形変換）',
        path: '/works/linear-map',
      },
      {
        title: 'Time Synchronization Experiment（時間同期実験）',
        path: '/works/time-geometry',
      },
    ],
  },
  {
    id: 'wave-laboratory',
    title: '波動実験室',
    englishTitle: 'Wave Laboratory',
    works: [
      {
        title: 'Emotion Wave（感情の波）',
        path: '/works/emotion-wave',
      },
    ],
  },
  {
    id: 'digital-audio',
    title: '音響・DTM',
    englishTitle: 'Sound / DTM',
    works: [
      {
        title: 'Synthesizer（シンセサイザー）',
        path: '/works/synthesizer',
      },
    ],
  },
  {
    id: 'complex-geometry',
    title: '複素幾何学',
    englishTitle: 'Complex Geometry',
    works: [
      {
        title: 'Complex Geometry（複素幾何学）',
        path: '/works/complex-geometry',
      },
    ],
  },
];

function Works() {
  const [openCategory, setOpenCategory] = useState(null);

  const handleCategoryClick = (categoryId) => {
    setOpenCategory((currentCategory) =>
      currentCategory === categoryId ? null : categoryId
    );
  };

  return (
    <main className="works">
      <h1>作品一覧</h1>

      <div className="works-category-list">
        {worksCategories.map((category) => {
          const isOpen = openCategory === category.id;

          return (
            <section
              key={category.id}
              className={`works-category ${isOpen ? 'is-open' : ''}`}
            >
              <button
                type="button"
                className="works-category-button"
                onClick={() => handleCategoryClick(category.id)}
                aria-expanded={isOpen}
                aria-controls={`${category.id}-works`}
              >
                <span>
                  {category.englishTitle}（{category.title}）
                </span>

                <span
                  className="works-category-icon"
                  aria-hidden="true"
                >
                  {isOpen ? '−' : '＋'}
                </span>
              </button>

              {isOpen && (
                <ul
                  id={`${category.id}-works`}
                  className="works-list"
                >
                  {category.works.map((work) => (
                    <li key={work.path}>
                      <Link to={work.path}>{work.title}</Link>
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

export default Works;
