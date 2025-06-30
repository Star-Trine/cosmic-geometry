// src/pages/Home.js

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './Home.css';

import StarCanvas from '../components/StarCanvas'; // 背景の星アニメーション

// SVG各種
import { ReactComponent as Circle }           from '../components/svg/circle.svg';
import { ReactComponent as SeedOfLife }       from '../components/svg/seedoflife.svg';
import { ReactComponent as MiniFlowerOfLife } from '../components/svg/minifloweroflife.svg';
import { ReactComponent as FlowerOfLife }     from '../components/svg/floweroflife.svg';
import { ReactComponent as FruitOfLife }      from '../components/svg/fruitsoflife.svg';
import { ReactComponent as MetatronLines }    from '../components/svg/metatronlines.svg';

export default function Home() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // テキストアニメーション
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.2, ease: 'power2.out' }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.6, ease: 'power2.out' }
      );

      // 星の幾何学アニメーション
      const layers = [
        containerRef.current.querySelector('.circle'),
        containerRef.current.querySelector('.seedoflife'),
        containerRef.current.querySelector('.minifl'),
        containerRef.current.querySelector('.floweroflife'),
        containerRef.current.querySelector('.fruitsoflife'),
        containerRef.current.querySelector('.metatronlines'),
      ];

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      // 成長：circle → seed → miniFL → flower
    layers.slice(0, 4).forEach((layer, i) => {
      tl.to(layer, { autoAlpha: 1, duration: 1 }, i * 1.5);
    });

    // flower + miniFL + seed をまとめてフェードアウト
    tl.to([layers[3], layers[2], layers[1]], { autoAlpha: 0, duration: 1 });

    // fruitの登場
    tl.to(layers[4], { autoAlpha: 1, duration: 1 });

    // metatron表示（fruitは残したまま）
    tl.to(layers[5], { autoAlpha: 1, duration: 1 });

    // fruitとmetatronを一緒にフェードアウト
    tl.to([layers[5], layers[4]], { autoAlpha: 0, duration: 1 });

    // circleとseedとminiFLをリセットして非表示に（念のため）
    tl.set([layers[0], layers[1], layers[2], layers[3]], { autoAlpha: 0 });


    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-container">
      <StarCanvas /> {/* 背景の星 */}

      <div className="hero-content">
        <h1 ref={titleRef}>Cosmic Geometry</h1>
        <p ref={subtitleRef}>星々の記憶をアートと数学で表現する</p>
      </div>

      <div className="svg-wrapper" ref={containerRef}>
        <Circle className="layer circle" />
        <SeedOfLife className="layer seedoflife" />
        <MiniFlowerOfLife className="layer minifl" />
        <FlowerOfLife className="layer floweroflife" />
        <FruitOfLife className="layer fruitsoflife" />
        <MetatronLines className="layer metatronlines" />
      </div>

      <footer className="space-footer">
        <p>&copy; 2025 Cosmic Geometry</p>
      </footer>
    </div>
  );
}
