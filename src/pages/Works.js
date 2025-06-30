import React from 'react';
import "./Works.css"; //スタイリングも分けておk！
import { Link } from 'react-router-dom'; //←追加

function Works() {
  return (
    <div className="works">
    <h1>作品一覧</h1>
      <ul className="works-list">
        <li><Link to="/works/time-geometry"><span>時間幾何学（Time Geometry）</span></Link></li>
        <li><Link to="/works/time-geometry-3d">時間幾何学 3次元アニメーション</Link></li>
        <li><Link to="/works/inner-product"><span>内積の可視化</span></Link></li>
        <li><Link to="/works/outer-product">外積の可視化</Link></li>
        <li><Link to="/works/linear-map">線形写像</Link></li>  {/* ← 追加 */}
        {/* ここに作品が増えていく */}
      </ul>
    </div>
  );
}

export default Works;
