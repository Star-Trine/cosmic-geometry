import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { createCycle, createInteraction, createWaves, DESKTOP_WAVE_SHAPE, MOBILE_WAVE_SHAPE, qualityFor, updateCycle, updateWaves } from './model';
import { renderLightField } from './lightField';
import { renderWaveField } from './waveField';
import { createWavicleField, renderWavicleField, updateWavicleField } from './wavicleField';
import { createConstellation, renderConstellation, updateConstellation } from './adaptiveConstellation';
import { createWideSpace, renderWideSpace, WideSpace } from './wideSpace';
import './HomeVisual.css';

export default function HomeVisual() {
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const ctx = gsap.context(() => {
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
    }, stage);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!stage || !canvas || !context) return;

    const buffer = document.createElement('canvas');
    const bufferContext = buffer.getContext('2d', { alpha: true });
    if (!bufferContext) return;

    const cycle = createCycle();
    const interaction = createInteraction();
    const waves = createWaves();
    const wavicles = createWavicleField();
    const constellation = createConstellation();
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    let image: ImageData;
    let width = 1;
    let height = 1;
    let aspect = 1;
    let constellationMinY = 0.36;
    let fieldFps = 20;
    let wideSpace: WideSpace | null = null;
    let waveShape = DESKTOP_WAVE_SHAPE;
    let frameId = 0;
    let lastTime = 0;
    let lastPaint = 0;
    const paint = () => {
      renderLightField(image, cycle, interaction, aspect, reducedMotion);
      bufferContext.putImageData(image, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (wideSpace) renderWideSpace(context, wideSpace);
      context.drawImage(buffer, 0, 0, canvas.width, canvas.height);
      renderWaveField(context, waves, canvas.width, canvas.height, waveShape);
      renderWavicleField(context, wavicles, canvas.width, canvas.height);
      renderConstellation(context, constellation, canvas.width, canvas.height);
    };

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      aspect = width / height;
      const contentBottom = contentRef.current?.getBoundingClientRect().bottom ?? bounds.top;
      constellationMinY = Math.max(0.36, (contentBottom - bounds.top + 28) / height);
      const quality = qualityFor(width);
      const dpr = Math.min(window.devicePixelRatio || 1, quality.dprCap);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      waveShape = width <= 700 ? MOBILE_WAVE_SHAPE : DESKTOP_WAVE_SHAPE;
      wideSpace = width >= 701 ? createWideSpace(context, canvas.width, canvas.height) : null;
      buffer.width = Math.max(1, Math.min(360, Math.round(width * quality.fieldScale)));
      buffer.height = Math.max(1, Math.min(220, Math.round(height * quality.fieldScale)));
      image = bufferContext.createImageData(buffer.width, buffer.height);
      fieldFps = quality.fieldFps;
      wavicles.activeLimit = quality.maxWavicles;
      for (let index = wavicles.activeLimit; index < wavicles.pool.length; index += 1) {
        wavicles.pool[index].active = false;
      }
      paint();
    };

    const tick = (timestamp: number) => {
      const delta = lastTime === 0 ? 0 : Math.min(0.05, (timestamp - lastTime) / 1000);
      lastTime = timestamp;
      updateCycle(cycle, delta);
      updateWaves(waves, cycle);
      updateWavicleField(wavicles, waves, cycle, delta, aspect, waveShape);
      updateConstellation(constellation, wavicles, cycle, delta, aspect, constellationMinY);
      interaction.x += (interaction.targetX - interaction.x) * Math.min(1, delta * 2);
      interaction.y += (interaction.targetY - interaction.y) * Math.min(1, delta * 2);
      interaction.strength += (interaction.targetStrength - interaction.strength) * Math.min(1, delta * 2);
      if (timestamp - lastPaint >= 1000 / fieldFps) {
        paint();
        lastPaint = timestamp;
      }
      frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (document.hidden || reducedMotion || frameId) return;
      cycle.paused = false;
      lastTime = 0;
      frameId = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
      cycle.paused = true;
    };
    const visibility = () => document.hidden ? stop() : start();
    const motionChange = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) {
        stop();
        interaction.strength = 0;
        interaction.targetStrength = 0;
        paint();
      } else start();
    };
    const pointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const bounds = stage.getBoundingClientRect();
      interaction.targetX = (event.clientX - bounds.left) / bounds.width;
      interaction.targetY = (event.clientY - bounds.top) / bounds.height;
      interaction.targetStrength = 1;
    };
    const pointerLeave = () => { interaction.targetStrength = 0; };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    stage.addEventListener('pointermove', pointerMove);
    stage.addEventListener('pointerleave', pointerLeave);
    document.addEventListener('visibilitychange', visibility);
    motionQuery.addEventListener('change', motionChange);
    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      stage.removeEventListener('pointermove', pointerMove);
      stage.removeEventListener('pointerleave', pointerLeave);
      document.removeEventListener('visibilitychange', visibility);
      motionQuery.removeEventListener('change', motionChange);
    };
  }, []);

  return (
    <section className="home-visual-experiment" ref={stageRef} aria-label="Home Visual experiment">
      <canvas ref={canvasRef} className="home-visual-experiment__canvas" aria-hidden="true" />
      <div className="home-visual-experiment__content" ref={contentRef}>
        <h1 ref={titleRef}>Cosmic Geometry</h1>
        <p ref={subtitleRef}>星々の記憶をアートと数学で表現する</p>
      </div>
      <footer className="space-footer">
        <p>&copy; 2025–2026 Cosmic Geometry</p>
      </footer>
    </section>
  );
}
