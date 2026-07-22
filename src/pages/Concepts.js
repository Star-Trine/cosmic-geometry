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
        title: 'マカバとベクトル平衡体',
        path: '/concepts/merkaba-vector-equilibrium',
      },
      {
        title: 'プラトン立体',
        path: '/concepts/platonic-solids',
      },
      {
        title: 'テッセラクト（4次元投影）',
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
        title: '天球',
        path: '/concepts/celestial-sphere',
      },
      {
        title: '重力波観測所',
        path: '/concepts/gravity-wave-observatory',
      },
      {
        title: '太陽系',
        path: '/concepts/solar-system',
      },
      {
        title: '系外惑星',
        path: '/concepts/exoplanets',
      },
      {
        title: '星座・アステリズム',
        path: '/concepts/constellations-asterisms',
      },
    ],
  },
  {
    id: 'astrology',
    title: '占星学',
    englishTitle: 'Astrology',
    concepts: [
      {
        title: '黄道十二星座',
        path: '/concepts/zodiac',
      },
      {
        title: 'ネイタルチャート',
        path: '/concepts/natal-chart',
      },
      {
        title: 'ハウス',
        path: '/concepts/astrological-houses',
      },
      {
        title: 'アスペクト',
        path: '/concepts/aspects',
      },
      {
        title: 'トランジット',
        path: '/concepts/transits',
      },
    ],
  },
  {
    id: 'time-geometry',
    title: '時間幾何学',
    englishTitle: 'Time Geometry',
    concepts: [
      {
        title: '時間ベクトル空間',
        path: '/concepts/time-vector-space',
      },
      {
        title: '時間ベクトルの内積',
        path: '/concepts/inner-product',
      },
      {
        title: '時間ベクトルの外積',
        path: '/concepts/outer-product',
      },
      {
        title: '時間ベクトルの線形写像',
        path: '/concepts/linear-map',
      },
      {
        title: '時間同期実験',
        path: '/concepts/time-geometry',
      },
    ],
  },
  {
    id: 'complex-geometry',
    title: '複素幾何学',
    englishTitle: 'Complex Geometry',
    concepts: [
      {
        title: '複素平面ビューワー',
        path: '/concepts/complex-plane-viewer',
      },
      {
        title: 'オイラーの公式ビジュアライザー',
        path: '/concepts/euler-formula-visualizer',
      },
      {
        title: '複素写像ビューワー',
        path: '/concepts/complex-mapping-viewer',
      },
    ],
  },
  {
    id: 'wave-laboratory',
    title: '波動実験室',
    englishTitle: 'Wave Laboratory',
    concepts: [
      {
        title: 'オシレーター',
        path: '/concepts/oscillator',
      },
      {
        title: 'フーリエ級数',
        path: '/concepts/fourier-series',
      },
      {
        title: 'フーリエ変換（FFT）',
        path: '/concepts/fourier-transform',
      },
    ],
  },
  {
    id: 'digital-audio',
    title: 'DTM・音響',
    englishTitle: 'Digital Audio',
    concepts: [
      {
        title: 'シンセサイザー',
        path: '/concepts/synthesizer',
      },
      {
        title: 'ADSRエンベロープ',
        path: '/concepts/adsr-envelope',
      },
      {
        title: 'エフェクトチェーン',
        path: '/concepts/effect-chain',
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
                  {category.title} ({category.englishTitle})
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