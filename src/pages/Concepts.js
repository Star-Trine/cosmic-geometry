// src/pages/Concepts.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Concepts.css';

const conceptCategories = [
  {
    id: 'interpretation',
    title: '既存概念の再解釈・拡張',
    englishTitle: 'Interpretation',
    concepts: [
      {
        title: 'Tesseract（テッセラクト）',
        path: '/concepts/tesseract',
        summary: '見えない第4の空間軸を、次元生成と3次元投影から観察する。',
      },
      {
        title: 'Celestial Sphere（天球）',
        path: '/concepts/celestial-sphere',
        summary: '星座だけでなく、星が配置される天球構造そのものを観察する。',
      },
      {
        title: 'Horoscope（ホロスコープ）',
        path: '/concepts/horoscope',
        summary: '出生図に含まれる天体・ハウス・アスペクトの構造を視覚表現へ変換する。',
      },
    ],
  },
  {
    id: 'original-theory',
    title: '独自理論・独自体系',
    englishTitle: 'Original Theory',
    concepts: [
      {
        title: 'Time Vector Space（時間ベクトル空間）',
        path: '/concepts/time-vector-space',
        summary: '時間をベクトル空間として捉え、関係・方向・変換を数学的に探究する。',
      },
      {
        title: 'Time Synchronization Experiment（時間同期実験）',
        path: '/concepts/time-geometry',
        summary: '異なる速度を持つ複数の時間が、一時的に同期する状態を観察する。',
      },
      {
        title: 'Emotion Wave（感情の波）',
        path: '/concepts/emotion-wave',
        summary: '感情を波として捉え、重なりから生まれる干渉と調和を可視化する。',
      },
    ],
  },
  {
    id: 'sensory-experiments',
    title: '感覚表現の実験',
    englishTitle: 'Sensory Experiments',
    concepts: [
      {
        title: 'Synthesizer（シンセサイザー）',
        path: '/concepts/synthesizer',
        summary: '音の生成と加工を、波形やスペクトルとともに体験する。',
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
      <h1>Concepts (設計思想)</h1>

      <p>
        このページでは、各作品の設計思想、数学的背景、
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
                      <Link to={concept.path}>
                        <span className="concepts-item-title">
                          {concept.title}
                        </span>
                        <span className="concepts-item-summary">
                          {concept.summary}
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

export default Concepts;
