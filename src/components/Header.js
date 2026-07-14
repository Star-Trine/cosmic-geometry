// src/components/Header.js
import React, { useEffect, useRef } from 'react';
import './Header.css';

const Header = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    let intervalId;

    const onLoad = () => {
      const svg = svgRef.current?.contentDocument;
      if (!svg) return;

      const stars = svg.getElementById('ZodiacStars');
      const lines = svg.getElementById('ConstellationLines');

      if (stars && lines) {
        stars.style.opacity = '0';
        lines.style.opacity = '0';

        stars.style.transition = 'opacity 1s ease';
        lines.style.transition = 'opacity 1s ease';

        // ループ処理
        const animate = () => {
          stars.style.opacity = '0';
          lines.style.opacity = '0';

          setTimeout(() => {
            stars.style.opacity = '1';
          }, 500);

          setTimeout(() => {
            lines.style.opacity = '1';
          }, 1500);

          // フェードアウトのタイミング（任意で調整）
          setTimeout(() => {
            lines.style.opacity = '0';
            stars.style.opacity = '0';
          }, 5000);
        };

        animate(); // 初回呼び出し
        intervalId = setInterval(animate, 7000); // 7秒ごとにループ
      }
    };

    const object = svgRef.current;
    if (object) {
      object.addEventListener('load', onLoad);
    }

    return () => {
      if (object) {
        object.removeEventListener('load', onLoad);
      }
      clearInterval(intervalId);
    };
  }, []);

  return (
    <header className="header">
      <object
        ref={svgRef}
        type="image/svg+xml"
        data="/assets/zodiac.sign.svg"
        className="zodiac-svg"
        aria-label="Zodiac Sign Animation"
      />
    </header>
  );
};

export default Header;
