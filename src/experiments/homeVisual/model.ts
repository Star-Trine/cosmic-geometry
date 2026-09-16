export type Stage = 'quiet' | 'fluctuation' | 'field' | 'wave' | 'wavicle' | 'residual' | 'transition';

export type CycleState = {
  stage: Stage;
  elapsed: number;
  stageElapsed: number;
  cycleIndex: number;
  cycleSeed: number;
  transitionProgress: number;
  paused: boolean;
};

export type QualitySettings = {
  dprCap: number;
  fieldScale: number;
  fieldFps: number;
  maxWavicles: number;
};

export type InteractionState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  strength: number;
  targetStrength: number;
};

export type WaveState = {
  direction: { x: number; y: number };
  phase: number;
  intensity: number;
  speed: number;
  width: number;
  bendAmount: number;
  displacementAmplitude: number;
  age: number;
  lifetime: number;
  delay: number;
  phaseOffset: number;
  verticalOffset: number;
};

export type WaveShape = {
  halfLength: number;
  primaryCycles: number;
  secondaryCycles: number;
  bendScale: number;
  displacementScale: number;
};

export const DESKTOP_WAVE_SHAPE: WaveShape = {
  halfLength: 0.18, primaryCycles: 1.35, secondaryCycles: 2.1, bendScale: 1, displacementScale: 1,
};

export const MOBILE_WAVE_SHAPE: WaveShape = {
  halfLength: 0.275, primaryCycles: 0.55, secondaryCycles: 0.8, bendScale: 0.5, displacementScale: 0.85,
};

// The flow enters from the lower left and settles near the center instead of crossing the entire stage.
export const waveCenterX = (wave: WaveState): number =>
  0.27 + 0.3 * (wave.speed / 0.035) * (1 - Math.exp(-Math.max(0, wave.age) / 3.5));

export type WavicleState = {
  active: boolean;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  birthVelocityX: number;
  birthVelocityY: number;
  flowSpeed: number;
  age: number;
  lifetime: number;
  alignmentTime: number;
  size: number;
  opacity: number;
  alpha: number;
  color: number;
  depth: number;
  seed: number;
};

export type WavicleFieldState = {
  pool: WavicleState[];
  activeLimit: number;
  spawnCarry: number;
  cursor: number;
  randomSeed: number;
};

export type ConstellationState = {
  active: boolean;
  elapsed: number;
  evaluationTime: number;
  formedCycleIndex: number;
  pattern: number;
  starCount: number;
  edgeCount: number;
  starIndices: number[];
  starX: number[];
  starY: number[];
  edgeFrom: number[];
  edgeTo: number[];
};

export const TIMING = {
  cycle: 28,
  fluctuation: 0.5,
  fieldStart: 2,
  fieldFull: 8,
  waveStart: 8,
  wavicleStart: 14,
  residualStart: 18,
  transitionStart: 24,
  residual: 0.25,
} as const;

export const createCycle = (): CycleState => ({
  stage: 'quiet', elapsed: 0, stageElapsed: 0, cycleIndex: 0,
  cycleSeed: 0, transitionProgress: 0, paused: false,
});

export function updateCycle(cycle: CycleState, delta: number): void {
  if (cycle.paused) return;
  cycle.elapsed += delta;
  if (cycle.elapsed >= TIMING.cycle) {
    cycle.elapsed %= TIMING.cycle;
    cycle.cycleIndex += 1;
    cycle.cycleSeed = Math.sin(cycle.cycleIndex * 12.9898) * 0.5;
  }
  const t = cycle.elapsed;
  const next: Stage = t >= TIMING.transitionStart ? 'transition'
    : t >= TIMING.residualStart ? 'residual'
    : t >= TIMING.wavicleStart ? 'wavicle'
    : t >= TIMING.waveStart ? 'wave'
    : t >= TIMING.fieldStart ? 'field'
    : t >= TIMING.fluctuation ? 'fluctuation' : 'quiet';
  cycle.stageElapsed = next === cycle.stage ? cycle.stageElapsed + delta : 0;
  cycle.stage = next;
  cycle.transitionProgress = Math.max(0, Math.min(1,
    (t - TIMING.transitionStart) / (TIMING.cycle - TIMING.transitionStart)));
}

export function fieldEnvelope(cycle: CycleState): number {
  const t = cycle.elapsed;
  const formed = Math.max(0, Math.min(1, (t - TIMING.fieldStart) / (TIMING.fieldFull - TIMING.fieldStart)));
  const smooth = formed * formed * (3 - 2 * formed);
  const residual = cycle.cycleIndex === 0 ? 0 : TIMING.residual;
  const peak = residual + (1 - residual) * smooth;
  if (t < TIMING.residualStart) return peak;
  const fade = Math.max(0, Math.min(1, (t - TIMING.residualStart) / (TIMING.cycle - TIMING.residualStart)));
  return peak + (TIMING.residual - peak) * fade * fade * (3 - 2 * fade);
}

export function qualityFor(width: number): QualitySettings {
  if (width >= 1920) return { dprCap: 1.5, fieldScale: 0.16, fieldFps: 20, maxWavicles: 120 };
  if (width <= 700) return { dprCap: 1.5, fieldScale: 0.2, fieldFps: 20, maxWavicles: 48 };
  if (width <= 1100) return { dprCap: 1.75, fieldScale: 0.18, fieldFps: 20, maxWavicles: 84 };
  return { dprCap: 1.75, fieldScale: 0.18, fieldFps: 20, maxWavicles: 120 };
}

export function createInteraction(): InteractionState {
  return { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5,
    strength: 0, targetStrength: 0 };
}

export function createWaves(): WaveState[] {
  return [
    { direction: { x: 0.977, y: -0.212 }, phase: 0, intensity: 0,
      speed: 0.035, width: 0.055, bendAmount: 0.028,
      displacementAmplitude: 0.026, age: 0,
      lifetime: 12, delay: 0, phaseOffset: 0, verticalOffset: 0 },
    { direction: { x: 0.977, y: -0.212 }, phase: 0, intensity: 0,
      speed: 0.034, width: 0.047, bendAmount: 0.024,
      displacementAmplitude: 0.021, age: 0,
      lifetime: 12, delay: 1.1, phaseOffset: 1.7, verticalOffset: 0.025 },
  ];
}

export function updateWaves(waves: WaveState[], cycle: CycleState): void {
  const fieldStrength = fieldEnvelope(cycle);
  for (let index = 0; index < waves.length; index += 1) {
    const wave = waves[index];
    wave.age = cycle.elapsed - TIMING.waveStart - wave.delay;
    wave.phase = wave.phaseOffset + Math.max(0, wave.age) * 0.55;
    const entrance = Math.max(0, Math.min(1, wave.age / 1.4));
    const exit = Math.max(0, Math.min(1, (wave.lifetime - wave.age) / 3));
    wave.intensity = fieldStrength * entrance * exit * (index === 0 ? 0.75 : 0.6);
  }
}
