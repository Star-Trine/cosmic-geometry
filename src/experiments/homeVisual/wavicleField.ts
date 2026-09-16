import { CycleState, TIMING, WaveShape, WaveState, WavicleFieldState, WavicleState, waveCenterX } from './model';

const POOL_SIZE = 120;
const WAVE_THRESHOLD = 0.42;
const COLORS = ['#75d9e9', '#a4a6f0', '#dc92cf', '#eaf5ff'] as const;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function createWavicleField(): WavicleFieldState {
  const pool: WavicleState[] = Array.from({ length: POOL_SIZE }, () => ({
    active: false, x: 0, y: 0, velocityX: 0, velocityY: 0,
    birthVelocityX: 0, birthVelocityY: 0, flowSpeed: 0,
    age: 0, lifetime: 0, alignmentTime: 0, size: 0,
    opacity: 0, alpha: 0, color: 0, depth: 0, seed: 0,
  }));
  return { pool, activeLimit: POOL_SIZE, spawnCarry: 0, cursor: 0, randomSeed: 0x4c696768 };
}

function random(field: WavicleFieldState): number {
  let seed = field.randomSeed;
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  field.randomSeed = seed;
  return (seed >>> 0) / 4294967296;
}

function spawn(field: WavicleFieldState, wave: WaveState, aspect: number, shape: WaveShape): void {
  let particle: WavicleState | undefined;
  for (let checked = 0; checked < field.activeLimit; checked += 1) {
    const index = (field.cursor + checked) % field.activeLimit;
    if (!field.pool[index].active) {
      particle = field.pool[index];
      field.cursor = (index + 1) % field.activeLimit;
      break;
    }
  }
  if (!particle) return;

  const progress = 0.12 + random(field) * 0.56;
  const centerX = waveCenterX(wave);
  const x = centerX + (progress - 0.5) * shape.halfLength * 2;
  const slope = wave.direction.y / wave.direction.x;
  const envelope = Math.sin(Math.PI * progress);
  const bend = envelope * Math.sin(wave.phase * 0.5) * wave.bendAmount * 0.5 * shape.bendScale;
  const displacement = envelope * wave.displacementAmplitude * shape.displacementScale * (
    Math.sin(progress * Math.PI * 2 * shape.primaryCycles - wave.phase)
    + 0.2 * Math.sin(progress * Math.PI * 2 * shape.secondaryCycles + wave.phase * 0.65)
  );
  const offset = (random(field) - 0.5) * wave.width * 1.2;
  const y = 0.58 + wave.verticalOffset + (x - 0.465) * aspect * slope
    + bend + displacement + offset;

  const depth = Math.floor(random(field) * 3);
  const depthScale = depth === 0 ? 0.72 : depth === 1 ? 1 : 1.25;
  const fan = (random(field) - 0.5) * 1.9;
  const angle = Math.atan2(wave.direction.y, wave.direction.x) + fan;
  const burstSpeed = (0.095 + random(field) * 0.065) * depthScale;
  const colorRoll = random(field);

  particle.active = true;
  particle.x = x;
  particle.y = y;
  particle.birthVelocityX = Math.cos(angle) * burstSpeed;
  particle.birthVelocityY = Math.sin(angle) * burstSpeed * aspect * (aspect < 0.8 ? 1.4 : 1.1);
  particle.velocityX = particle.birthVelocityX;
  particle.velocityY = particle.birthVelocityY;
  particle.flowSpeed = (0.017 + random(field) * 0.01) * depthScale;
  particle.age = 0;
  particle.lifetime = 5.3 + random(field) * 1.8;
  particle.alignmentTime = 1.5 + random(field) * 0.8;
  particle.size = (depth === 0 ? 1.05 : depth === 1 ? 1.65 : 2.3)
    * (0.82 + random(field) * 0.36);
  particle.opacity = (depth === 0 ? 0.42 : depth === 1 ? 0.68 : 0.82)
    * (0.8 + random(field) * 0.2);
  particle.alpha = 0;
  particle.color = colorRoll < 0.44 ? 0 : colorRoll < 0.76 ? 1 : colorRoll < 0.94 ? 2 : 3;
  particle.depth = depth;
  particle.seed = random(field) * Math.PI * 2;
}

export function updateWavicleField(
  field: WavicleFieldState,
  waves: WaveState[],
  cycle: CycleState,
  delta: number,
  aspect: number,
  shape: WaveShape,
): void {
  for (let index = 0; index < field.pool.length; index += 1) {
    const particle = field.pool[index];
    if (!particle.active) continue;
    particle.age += delta;
    if (particle.age >= particle.lifetime || particle.x > 1.1 || particle.y < -0.1 || particle.y > 1.1) {
      particle.active = false;
      continue;
    }
    const alignment = clamp(particle.age / particle.alignmentTime);
    const smoothAlignment = alignment * alignment * (3 - 2 * alignment);
    const localBend = 0.045 * Math.sin(particle.x * 8 - particle.y * 5 + cycle.elapsed * 0.4 + particle.seed);
    const targetX = particle.flowSpeed * 0.977;
    const targetY = particle.flowSpeed * (-0.212 + localBend) * aspect;
    particle.velocityX = particle.birthVelocityX + (targetX - particle.birthVelocityX) * smoothAlignment;
    particle.velocityY = particle.birthVelocityY + (targetY - particle.birthVelocityY) * smoothAlignment;
    particle.x += particle.velocityX * delta;
    particle.y += particle.velocityY * delta;
    const appear = clamp(particle.age / 0.22);
    const fade = clamp((particle.lifetime - particle.age) / 1.5);
    particle.alpha = particle.opacity * appear * fade;
  }

  if (delta <= 0 || cycle.elapsed < TIMING.wavicleStart - 2) return;
  const first = waves[0];
  const second = waves[1];
  const firstCenter = waveCenterX(first);
  const secondCenter = waveCenterX(second);
  const firstPosition = clamp((firstCenter - 0.4) / 0.07) * clamp((0.58 - firstCenter) / 0.05);
  const secondPosition = clamp((secondCenter - 0.4) / 0.07) * clamp((0.58 - secondCenter) / 0.05);
  const firstActivation = clamp((first.intensity - WAVE_THRESHOLD) / 0.33) * firstPosition;
  const secondActivation = clamp((second.intensity - WAVE_THRESHOLD) / 0.33) * secondPosition;
  const activation = Math.max(firstActivation, secondActivation);
  if (activation <= 0) return;
  field.spawnCarry += delta * (field.activeLimit / 5) * activation;
  while (field.spawnCarry >= 1) {
    const source = random(field) * (firstActivation + secondActivation) < firstActivation ? first : second;
    spawn(field, source, aspect, shape);
    field.spawnCarry -= 1;
  }
}

export function renderWavicleField(
  context: CanvasRenderingContext2D,
  field: WavicleFieldState,
  width: number,
  height: number,
  opacity = 1,
): void {
  context.save();
  for (let index = 0; index < field.pool.length; index += 1) {
    const particle = field.pool[index];
    if (!particle.active || particle.alpha <= 0) continue;
    const x = particle.x * width;
    const y = particle.y * height;
    const radius = particle.size * Math.max(1.25, Math.min(width / 1280, height / 510));
    context.fillStyle = COLORS[particle.color];
    context.globalAlpha = particle.alpha * 0.2 * opacity;
    context.beginPath();
    context.arc(x, y, radius * 2.4, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = particle.alpha * opacity;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}
