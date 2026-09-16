// Future interaction experiment: idle scene and click/tap cycle helpers.
import {
  ConstellationState, CycleState, TIMING, WaveShape, WaveState, WavicleFieldState,
  updateCycle, updateWaves,
} from './model';
import { updateWavicleField } from './wavicleField';
import { updateConstellation } from './adaptiveConstellation';

export type SceneMode = 'idle' | 'settling' | 'playing';

export const IDLE_TIME = 17.45;
export const SETTLE_TIME = 1.6;
const SIMULATION_STEP = 1 / 60;
export const FALLBACK_SEED = 0x4c696768;

export function resetScene(
  cycle: CycleState,
  waves: WaveState[],
  wavicles: WavicleFieldState,
  constellation: ConstellationState,
  seed: number,
  cycleIndex: number,
): void {
  cycle.stage = 'quiet';
  cycle.elapsed = 0;
  cycle.stageElapsed = 0;
  cycle.cycleIndex = cycleIndex;
  cycle.cycleSeed = Math.sin(cycleIndex * 12.9898) * 0.5;
  cycle.transitionProgress = 0;
  cycle.paused = false;
  updateWaves(waves, cycle);
  wavicles.spawnCarry = 0;
  wavicles.cursor = 0;
  wavicles.randomSeed = seed || FALLBACK_SEED;
  for (let index = 0; index < wavicles.pool.length; index += 1) {
    wavicles.pool[index].active = false;
  }
  constellation.active = false;
  constellation.elapsed = 0;
  constellation.evaluationTime = 0;
  constellation.formedCycleIndex = -1;
  constellation.starCount = 0;
  constellation.edgeCount = 0;
}

export function advanceScene(
  cycle: CycleState,
  waves: WaveState[],
  wavicles: WavicleFieldState,
  constellation: ConstellationState,
  delta: number,
  aspect: number,
  shape: WaveShape,
  minY: number,
): void {
  updateCycle(cycle, delta);
  updateWaves(waves, cycle);
  updateWavicleField(wavicles, waves, cycle, delta, aspect, shape);
  updateConstellation(constellation, wavicles, cycle, delta, aspect, minY);
}

export function prepareIdleScene(
  cycle: CycleState,
  waves: WaveState[],
  wavicles: WavicleFieldState,
  constellation: ConstellationState,
  seed: number,
  cycleIndex: number,
  aspect: number,
  shape: WaveShape,
  minY: number,
): boolean {
  resetScene(cycle, waves, wavicles, constellation, seed, cycleIndex);
  while (cycle.elapsed < IDLE_TIME - SIMULATION_STEP / 2) {
    advanceScene(cycle, waves, wavicles, constellation,
      Math.min(SIMULATION_STEP, IDLE_TIME - cycle.elapsed), aspect, shape, minY);
  }
  return constellation.active && constellation.elapsed >= 1.05
    && cycle.elapsed < TIMING.residualStart;
}
