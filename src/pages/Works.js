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
        title: 'マカバとベクトル平衡体',
        path: '/works/merkaba-vector-equilibrium',
      },
      {
        title: 'プラトン立体',
        path: '/works/platonic-solids',
      },
      {
        title: 'テッセラクト（4次元投影）',
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
        title: '天球',
        path: '/works/celestial-sphere',
      },
      {
        title: '重力波観測所',
        path: '/works/gravity-wave-observatory',
      },
      {
        title: '太陽系',
        path: '/works/solar-system',
      },
      {
        title: '系外惑星',
        path: '/works/exoplanets',
      },
      {
        title: '星座・アステリズム',
        path: '/works/constellations-asterisms',
      },
    ],
  },
  {
    id: 'astrology',
    title: '占星学',
    englishTitle: 'Astrology',
    works: [
      {
        title: '黄道十二星座',
        path: '/works/zodiac',
      },
      {
        title: 'ネイタルチャート',
        path: '/works/natal-chart',
      },
      {
        title: 'ハウス',
        path: '/works/astrological-houses',
      },
      {
        title: 'アスペクト',
        path: '/works/aspects',
      },
      {
        title: 'トランジット',
        path: '/works/transits',
      },
    ],
  },
  {
    id: 'time-geometry',
    title: '時間幾何学',
    englishTitle: 'Time Geometry',
    works: [
      {
        title: '時間ベクトル空間',
        path: '/works/time-vector-space',
      },
      {
        title: '時間ベクトルの内積',
        path: '/works/inner-product',
      },
      {
        title: '時間ベクトルの外積',
        path: '/works/outer-product',
      },
      {
        title: '時間ベクトルの線形写像',
        path: '/works/linear-map',
      },
      {
        title: '時間同期実験',
        path: '/works/time-geometry',
      },
    ],
  },
  {
    id: 'complex-geometry',
    title: '複素幾何学',
    englishTitle: 'Complex Geometry',
    works: [
      {
        title: '複素平面ビューワー',
        path: '/works/complex-plane-viewer',
      },
      {
        title: 'オイラーの公式ビジュアライザー',
        path: '/works/euler-formula-visualizer',
      },
      {
        title: '複素写像ビューワー',
        path: '/works/complex-mapping-viewer',
      },
    ],
  },
  {
    id: 'wave-laboratory',
    title: '波動実験室',
    englishTitle: 'Wave Laboratory',
    works: [
      {
        title: 'オシレーター',
        path: '/works/oscillator',
      },
      {
        title: 'フーリエ級数',
        path: '/works/fourier-series',
      },
      {
        title: 'フーリエ変換（FFT）',
        path: '/works/fourier-transform',
      },
    ],
  },
  {
    id: 'digital-audio',
    title: 'DTM・音響',
    englishTitle: 'Digital Audio',
    works: [
      {
        title: 'シンセサイザー',
        path: '/works/synthesizer',
      },
      {
        title: 'ADSRエンベロープ',
        path: '/works/adsr-envelope',
      },
      {
        title: 'エフェクトチェーン',
        path: '/works/effect-chain',
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
                  {category.title} ({category.englishTitle})
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