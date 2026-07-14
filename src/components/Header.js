// src/components/Header.js
import React, { useEffect, useRef, useState } from 'react';
import './Header.css';

const Header = () => {
  const svgRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    let intervalId;
    const timeoutIds = [];

    const onLoad = () => {
      const svg = svgRef.current?.contentDocument;
      if (!svg) return;

      const stars = svg.getElementById('ZodiacStars');
      const lines = svg.getElementById('ConstellationLines');

      if (!stars || !lines) return;

      stars.style.opacity = '0';
      lines.style.opacity = '0';
      stars.style.transition = 'opacity 1s ease';
      lines.style.transition = 'opacity 1s ease';

      const animate = () => {
        stars.style.opacity = '0';
        lines.style.opacity = '0';

        timeoutIds.push(
          setTimeout(() => {
            stars.style.opacity = '1';
          }, 500)
        );

        timeoutIds.push(
          setTimeout(() => {
            lines.style.opacity = '1';
          }, 1500)
        );

        timeoutIds.push(
          setTimeout(() => {
            lines.style.opacity = '0';
            stars.style.opacity = '0';
          }, 5000)
        );
      };

      animate();
      intervalId = setInterval(animate, 7000);
    };

    const object = svgRef.current;
    object?.addEventListener('load', onLoad);

    return () => {
      object?.removeEventListener('load', onLoad);
      clearInterval(intervalId);
      timeoutIds.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setSlideIndex((current) => (current + 1) % 4);
    }, 7000);

    return () => clearInterval(slideTimer);
  }, []);

  return (
    <header className="header">
      <div
        className="zodiac-track"
        style={{ '--slide-index': slideIndex }}
      >
        <object
          ref={svgRef}
          type="image/svg+xml"
          data="/assets/zodiac.sign.svg"
          className="zodiac-svg"
          aria-label="Zodiac Sign Animation"
        />
      </div>
    </header>
  );
};

export default Header;
