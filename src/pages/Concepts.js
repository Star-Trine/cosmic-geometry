// src/pages/Concepts.js

import React from 'react';
import './Concepts.css';

function Concepts() {
  return (
    <main className="concepts">
      <h1>Concepts</h1>

      <p>
        このページでは、各作品の設計思想、数学的背景、実装方法、
        制作メモなどをまとめています。
      </p>

      <h2>Categories</h2>

      <ul>
        <li>神聖幾何学 (Sacred Geometry)</li>
        <li>天文学 (Astronomy)</li>
        <li>占星学 (Astrology)</li>
        <li>時間幾何学 (Time Geometry)</li>
        <li>複素幾何学 (Complex Geometry)</li>
        <li>波動実験室 (Wave Laboratory)</li>
        <li>DTM・音響 (Digital Audio)</li>
      </ul>
    </main>
  );
}

export default Concepts;
