// components/StarCanvas.js
import { useEffect, useRef } from 'react';

function StarCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    //星の色の候補（青紫の黒い背景に映える色）
    const starColors = [
      'rgba(155, 149, 255, ALPHA)',  // 薄紫
      'rgba(176, 167, 255, ALPHA)',  // ラベンダー
      'rgba(112, 120, 255, ALPHA)',  // 青みがかった紫
      'rgba(160, 231, 255, ALPHA)',  // 薄いシアン
      'rgba(102, 204, 238, ALPHA)',  // 明るいシアン
      'rgba(255, 170, 212, ALPHA)',  // ピンク
      'rgba(255, 148, 183, ALPHA)',  // 薄ピンク
      'rgba(255, 250, 205, ALPHA)',  // クリームイエロー
      'rgba(173, 255, 47, ALPHA)',   // 黄緑
    ];

    // 星を初期化
    let stars = Array(150).fill().map(() => {
      const colorIndex = Math.floor(Math.random() * starColors.length);
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        delta: Math.random() * 0.02,
        baseColor: starColors[colorIndex],
      };
    });

    // 星を描画するアニメーションループ
    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    // キャンバスのサイズ設定
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawStars();

    // ウィンドウリサイズ対応
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: 'radial-gradient(ellipse at center, #000022 0%, #000000 100%)',
      }}
    />
  );
}

export default StarCanvas;
