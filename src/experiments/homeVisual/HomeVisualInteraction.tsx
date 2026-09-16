// Future interaction experiment: kept separate from the displayed HomeVisual.
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { createCycle, createInteraction, createWaves, DESKTOP_WAVE_SHAPE, MOBILE_WAVE_SHAPE, qualityFor } from './model';
import { renderLightField } from './lightField';
import { renderWaveField } from './waveField';
import { createWavicleField, renderWavicleField } from './wavicleField';
import { createConstellation, renderConstellation } from './adaptiveConstellation';
import { createWideSpace, renderWideSpace, WideSpace } from './wideSpace';
import { advanceScene, FALLBACK_SEED, IDLE_TIME, prepareIdleScene, resetScene, SceneMode, SETTLE_TIME } from './scene';
import './HomeVisual.css';

export default function HomeVisualInteraction() {
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
    let mode: SceneMode = 'idle';
    let settlingElapsed = 0;
    let sceneSeed = ((Math.random() * 0xffffffff) >>> 0) || FALLBACK_SEED;
    let sceneIndex = Math.floor(Math.random() * 6);
    let prepared = false;

    const smooth = (value: number) => {
      const progress = Math.max(0, Math.min(1, value));
      return progress * progress * (3 - 2 * progress);
    };

    const prepareIdle = () => {
      if (!prepareIdleScene(cycle, waves, wavicles, constellation,
        sceneSeed, sceneIndex, aspect, waveShape, constellationMinY)) {
        sceneSeed = FALLBACK_SEED;
        prepareIdleScene(cycle, waves, wavicles, constellation,
          sceneSeed, sceneIndex, aspect, waveShape, constellationMinY);
      }
      mode = 'idle';
      prepared = true;
      interaction.strength = 0;
      interaction.targetStrength = 0;
    };

    const paint = () => {
      renderLightField(image, cycle, interaction, aspect, reducedMotion);
      bufferContext.putImageData(image, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (wideSpace) renderWideSpace(context, wideSpace);
      const fieldOpacity = mode === 'settling'
        ? 1 - 0.75 * smooth((settlingElapsed - 0.65) / 0.95) : 1;
      const waveOpacity = mode === 'settling'
        ? 1 - smooth((settlingElapsed - 0.5) / 0.9) : 1;
      const particleOpacity = mode === 'settling'
        ? 1 - smooth((settlingElapsed - 0.2) / 1) : 1;
      const constellationOpacity = mode === 'settling'
        ? 1 - smooth(settlingElapsed / 0.55) : 1;
      context.save();
      context.globalAlpha = fieldOpacity;
      context.drawImage(buffer, 0, 0, canvas.width, canvas.height);
      context.restore();
      renderWaveField(context, waves, canvas.width, canvas.height, waveShape, waveOpacity);
      renderWavicleField(context, wavicles, canvas.width, canvas.height, particleOpacity);
      renderConstellation(context, constellation, canvas.width, canvas.height, constellationOpacity);
    };

    const resize = () => {
      const bounds = stage.getBoundingClientRect();
      const previousWidth = width;
      const previousHeight = height;
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
      if (!prepared || (mode === 'idle'
        && (Math.abs(previousWidth - width) > 1 || Math.abs(previousHeight - height) > 1))) {
        prepareIdle();
      }
      paint();
    };

    const tick = (timestamp: number) => {
      const delta = lastTime === 0 ? 0 : Math.min(0.05, (timestamp - lastTime) / 1000);
      lastTime = timestamp;
      if (mode === 'settling') {
        settlingElapsed = Math.min(SETTLE_TIME, settlingElapsed + delta);
        if (settlingElapsed >= SETTLE_TIME) {
          sceneIndex += 1;
          sceneSeed = ((Math.random() * 0xffffffff) >>> 0) || FALLBACK_SEED;
          resetScene(cycle, waves, wavicles, constellation, sceneSeed, sceneIndex);
          mode = 'playing';
        }
      } else if (mode === 'playing') {
        advanceScene(cycle, waves, wavicles, constellation,
          delta, aspect, waveShape, constellationMinY);
        if (cycle.elapsed >= IDLE_TIME && constellation.active && constellation.elapsed >= 1.05) {
          mode = 'idle';
          interaction.strength = 0;
          interaction.targetStrength = 0;
        } else if (cycle.elapsed >= 19.3 && !constellation.active) {
          prepareIdle();
        }
      }
      interaction.x += (interaction.targetX - interaction.x) * Math.min(1, delta * 2);
      interaction.y += (interaction.targetY - interaction.y) * Math.min(1, delta * 2);
      interaction.strength += (interaction.targetStrength - interaction.strength) * Math.min(1, delta * 2);
      if (mode === 'idle' || timestamp - lastPaint >= 1000 / fieldFps) {
        paint();
        lastPaint = timestamp;
      }
      if (mode === 'idle') {
        stop();
        return;
      }
      frameId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (mode === 'idle' || document.hidden || reducedMotion || frameId) return;
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
        if (mode !== 'idle') prepareIdle();
        paint();
      } else start();
    };
    const play = () => {
      if (mode !== 'idle' || reducedMotion || document.hidden) return;
      mode = 'settling';
      settlingElapsed = 0;
      start();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    stage.addEventListener('click', play);
    document.addEventListener('visibilitychange', visibility);
    motionQuery.addEventListener('change', motionChange);
    resize();

    return () => {
      stop();
      resizeObserver.disconnect();
      stage.removeEventListener('click', play);
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
