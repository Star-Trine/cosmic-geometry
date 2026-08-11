// src/pages/Works.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Works.css';

const worksCategories = [
  {
    id: 'interpretation',
    title: '既存概念の再解釈・拡張',
    englishTitle: 'Interpretation',
    works: [
      {
        title: 'Tesseract（テッセラクト）',
        path: '/works/tesseract',
      },
      {
        title: 'Celestial Sphere（天球）',
        path: '/works/celestial-sphere',
      },
      {
        title: 'Horoscope（ホロスコープ）',
        path: '/works/horoscope',
      },
    ],
  },
  {
    id: 'original-theory',
    title: '独自理論・独自体系',
    englishTitle: 'Original Theory',
    works: [
      {
        title: 'Time Vector Space（時間ベクトル空間）',
        path: '/works/time-vector-space',
      },
      {
        title: 'Time Synchronization Experiment（時間同期実験）',
        path: '/works/time-geometry',
      },
      {
        title: 'Emotion Wave（感情の波）',
        path: '/works/emotion-wave',
      },
    ],
  },
  {
    id: 'sensory-experiments',
    title: '感覚表現の実験',
    englishTitle: 'Sensory Experiments',
    works: [
      {
        title: 'Synthesizer（シンセサイザー）',
        path: '/works/synthesizer',
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
      <h1>Work (作品一覧)</h1>


    <p className="works-intro">
      数学・宇宙・時間・感覚をテーマに制作した、Cosmic Geometryの作品をまとめています。
    </p>

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
