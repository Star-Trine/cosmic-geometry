import React, { useEffect, useRef, useState } from 'react';
import './TimeGeometry.css';

const TimeGeometry = () => {
  const [angles, setAngles] = useState({ t1: 0, t2: 90, t3: 180 });

  useEffect(() => {
    const interval = setInterval(() => {
      setAngles(prev => ({
        t1: (prev.t1 + 1) % 360,
        t2: (prev.t2 + 0.8) % 360,
        t3: (prev.t3 + 0.5) % 360,
      }));
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const vectorLength = 100;

  const angleToCoords = (angleDeg) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      x: 150 + vectorLength * Math.cos(angleRad),
      y: 150 + vectorLength * Math.sin(angleRad),
    };
  };

  const isSynchro = (a1, a2) => {
    const diff = Math.abs(a1 - a2) % 360;
    return diff < 10 || diff > 350;
  };

  const t1 = angleToCoords(angles.t1);
  const t2 = angleToCoords(angles.t2);
  const t3 = angleToCoords(angles.t3);

  const t1Color = isSynchro(angles.t1, angles.t2) || isSynchro(angles.t1, angles.t3) ? '#00ffff' : '#e0e7ff';

  return (
    <div className="time-geometry">
      <h2>時間幾何学 - Time Geometry</h2>
      <svg width="300" height="300">
        <circle cx="150" cy="150" r="3" fill="#ffffff" />
        <line x1="150" y1="150" x2={t1.x} y2={t1.y} stroke={t1Color} strokeWidth="2" />
        <line x1="150" y1="150" x2={t2.x} y2={t2.y} stroke="#8888ff" strokeWidth="2" />
        <line x1="150" y1="150" x2={t3.x} y2={t3.y} stroke="#ff88ff" strokeWidth="2" />
      </svg>
      <p>t1と他のベクトルが同期すると発光します。</p>
    </div>
  );
};

export default TimeGeometry;
