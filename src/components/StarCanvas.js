import './StarCanvas.css';
import { useEffect, useRef } from 'react';

function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // 星の色候補
    const starColors = [
      'rgba(155, 149, 255, ALPHA)',
      'rgba(176, 167, 255, ALPHA)',
      'rgba(112, 120, 255, ALPHA)',
      'rgba(160, 231, 255, ALPHA)',
      'rgba(102, 204, 238, ALPHA)',
      'rgba(255, 170, 212, ALPHA)',
      'rgba(255, 148, 183, ALPHA)',
      'rgba(255, 250, 205, ALPHA)',
      'rgba(173, 255, 47, ALPHA)',
    ];

    let stars = [];

    function initStars() {
  let starCount;
  let rMin, rMax;

  const width = window.innerWidth;
  if (width <= 400) {
    starCount = 20;
    rMin = 0.3;
    rMax = 0.8;
  } else if (width <= 600) {
    starCount = 30;
    rMin = 0.5;
    rMax = 1.0;
  } else {
    starCount = 150;
    rMin = 0.5;
    rMax = 2.0;
  }

  stars = Array(starCount).fill().map(() => {
    const colorIndex = Math.floor(Math.random() * starColors.length);
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * (rMax - rMin) + rMin,
      alpha: Math.random(),
      delta: Math.random() * 0.02,
      baseColor: starColors[colorIndex],
    };
  });
}

    function resizeCanvas() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0); // いったんリセット
      ctx.scale(dpr, dpr);

      initStars();
    }

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      stars.forEach((star) => {
        star.alpha += star.delta;
        if (star.alpha <= 0 || star.alpha >= 1) {
          star.delta = -star.delta;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        const color = star.baseColor.replace('ALPHA', star.alpha.toFixed(2));
        ctx.fillStyle = color;
        ctx.fill();
      });
      requestAnimationFrame(drawStars);
    }

    resizeCanvas();
    drawStars();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="star-canvas" />;
}

export default StarCanvas;
