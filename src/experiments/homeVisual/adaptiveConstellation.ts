import { ConstellationState, CycleState, WavicleFieldState, WavicleState } from './model';

const MAX_STARS = 6;
const MAX_EDGES = 10;
const MAX_SELECTION_DISTANCE = 0.65;
const CANDIDATE_INTERVAL = 0.3;
const FIRST_FORMATION = 16;
const LAST_FORMATION = 19.3;
const GROW_TIME = 1.2;
const HOLD_TIME = 1.1;
const FADE_TIME = 0.9;
const TOTAL_TIME = GROW_TIME + HOLD_TIME + FADE_TIME;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function createConstellation(): ConstellationState {
  return {
    active: false, elapsed: 0, evaluationTime: 0, formedCycleIndex: -1, pattern: 0,
    starCount: 0, edgeCount: 0,
    starIndices: Array(MAX_STARS).fill(-1),
    starX: Array(MAX_STARS).fill(0),
    starY: Array(MAX_STARS).fill(0),
    edgeFrom: Array(MAX_EDGES).fill(0),
    edgeTo: Array(MAX_EDGES).fill(0),
  };
}

function stable(particle: WavicleState): boolean {
  return particle.active
    && particle.age >= Math.max(0.8, particle.alignmentTime * 0.55)
    && particle.lifetime - particle.age >= 2.1
    && particle.alpha >= 0.22;
}

function addEdge(state: ConstellationState, from: number, to: number): void {
  if (state.edgeCount >= MAX_EDGES) return;
  state.edgeFrom[state.edgeCount] = from;
  state.edgeTo[state.edgeCount] = to;
  state.edgeCount += 1;
}

function chooseStars(
  state: ConstellationState,
  field: WavicleFieldState,
  aspect: number,
  cycleIndex: number,
  minY: number,
): void {
  const pool = field.pool;
  let anchorIndex = -1;
  let anchorScore = -Infinity;
  for (let index = 0; index < field.activeLimit; index += 1) {
    const particle = pool[index];
    if (!stable(particle)) continue;
    if (particle.x < 0.32 || particle.x > 0.63 || particle.y < minY || particle.y > 0.78) continue;
    const dx = (particle.x - 0.5) * aspect;
    const dy = particle.y - 0.56;
    const score = particle.alpha + (particle.lifetime - particle.age) * 0.08
      - (dx * dx + dy * dy) * 0.85;
    if (score > anchorScore) {
      anchorScore = score;
      anchorIndex = index;
    }
  }
  if (anchorIndex < 0) return;

  const anchor = pool[anchorIndex];
  state.starIndices[0] = anchorIndex;
  state.starCount = 1;
  // Farthest-point selection spreads a small stable set across the particle cloud.
  for (let slot = 1; slot < MAX_STARS; slot += 1) {
    let bestIndex = -1;
    let bestScore = -Infinity;
    for (let index = 0; index < field.activeLimit; index += 1) {
      const particle = pool[index];
      if (!stable(particle) || particle.x < 0.27 || particle.x > 0.67
        || particle.y < minY || particle.y > 0.84) continue;
      let nearestDistance = Infinity;
      for (let selected = 0; selected < state.starCount; selected += 1) {
        if (state.starIndices[selected] === index) {
          nearestDistance = 0;
          break;
        }
        const other = pool[state.starIndices[selected]];
        const dx = (particle.x - other.x) * aspect;
        const dy = particle.y - other.y;
        nearestDistance = Math.min(nearestDistance, dx * dx + dy * dy);
      }
      const anchorX = (particle.x - anchor.x) * aspect;
      const anchorY = particle.y - anchor.y;
      const anchorDistance = anchorX * anchorX + anchorY * anchorY;
      if (nearestDistance < 0.05 * 0.05
        || anchorDistance > MAX_SELECTION_DISTANCE * MAX_SELECTION_DISTANCE) continue;
      const velocityX = (particle.velocityX - anchor.velocityX) * aspect;
      const velocityY = particle.velocityY - anchor.velocityY;
      if (velocityX * velocityX + velocityY * velocityY > 0.12 * 0.12) continue;
      const score = nearestDistance + particle.alpha * 0.012;
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }
    if (bestIndex < 0) break;
    state.starIndices[state.starCount] = bestIndex;
    state.starCount += 1;
  }
  if (state.starCount < 4) {
    state.starCount = 0;
    return;
  }

  // Order the small selected set around its center before choosing one sparse pattern.
  let centerX = 0;
  let centerY = 0;
  for (let slot = 0; slot < state.starCount; slot += 1) {
    centerX += pool[state.starIndices[slot]].x;
    centerY += pool[state.starIndices[slot]].y;
  }
  centerX /= state.starCount;
  centerY /= state.starCount;
  let topY = 1;
  for (let slot = 0; slot < state.starCount; slot += 1) {
    topY = Math.min(topY, pool[state.starIndices[slot]].y);
  }
  const shiftX = Math.max(-0.075, Math.min(0.075, 0.5 - centerX));
  const desiredY = Math.max(0.52, minY + 0.11);
  const shiftY = Math.max(minY - topY,
    Math.max(-0.055, Math.min(0.055, desiredY - centerY)));
  for (let left = 0; left < state.starCount - 1; left += 1) {
    for (let right = left + 1; right < state.starCount; right += 1) {
      const first = pool[state.starIndices[left]];
      const second = pool[state.starIndices[right]];
      if (Math.atan2(first.y - centerY, first.x - centerX)
        > Math.atan2(second.y - centerY, second.x - centerX)) {
        const swap = state.starIndices[left];
        state.starIndices[left] = state.starIndices[right];
        state.starIndices[right] = swap;
      }
    }
  }

  for (let slot = 0; slot < state.starCount; slot += 1) {
    const particle = pool[state.starIndices[slot]];
    state.starX[slot] = particle.x + shiftX;
    state.starY[slot] = particle.y + shiftY;
  }
  state.edgeCount = 0;
  state.pattern = cycleIndex % 6;
  if (state.pattern === 0) { // Chained triangles
    for (let slot = 0; slot < state.starCount; slot += 1) addEdge(state, slot, (slot + 1) % state.starCount);
    for (let slot = 0; slot + 2 < state.starCount; slot += 2) addEdge(state, slot, slot + 2);
  } else if (state.pattern === 1) { // Polyline with a small fork
    for (let slot = 0; slot + 1 < state.starCount; slot += 1) addEdge(state, slot, slot + 1);
    addEdge(state, 0, 2);
    addEdge(state, 0, state.starCount - 1);
    if (state.starCount >= 5) addEdge(state, 2, state.starCount - 1);
  } else if (state.pattern === 2) { // Branch structure
    for (let slot = 1; slot < state.starCount; slot += 1) addEdge(state, 0, slot);
    for (let slot = 1; slot + 1 < state.starCount; slot += 1) addEdge(state, slot, slot + 1);
  } else if (state.pattern === 3) { // Small polygon
    for (let slot = 0; slot < state.starCount; slot += 1) addEdge(state, slot, (slot + 1) % state.starCount);
    addEdge(state, 0, 2);
  } else if (state.pattern === 4) { // Constellation-like sparse network
    for (let slot = 0; slot + 1 < state.starCount; slot += 1) addEdge(state, slot, slot + 1);
    for (let slot = 0; slot + 2 < state.starCount; slot += 1) addEdge(state, slot, slot + 2);
  } else { // Triangle with a short trailing branch
    addEdge(state, 0, 1);
    addEdge(state, 1, 2);
    addEdge(state, 2, 0);
    for (let slot = 3; slot < state.starCount; slot += 1) addEdge(state, slot - 1, slot);
    addEdge(state, 0, state.starCount - 1);
    if (state.starCount >= 5) addEdge(state, 1, 4);
  }
  state.active = true;
  state.elapsed = 0;
}

export function updateConstellation(
  state: ConstellationState,
  field: WavicleFieldState,
  cycle: CycleState,
  delta: number,
  aspect: number,
  minY: number,
): void {
  if (state.active) {
    state.elapsed += delta;
    if (state.elapsed >= TOTAL_TIME) state.active = false;
    return;
  }
  if (state.formedCycleIndex === cycle.cycleIndex
    || cycle.elapsed < FIRST_FORMATION || cycle.elapsed > LAST_FORMATION) return;
  state.evaluationTime += delta;
  if (state.evaluationTime < CANDIDATE_INTERVAL) return;
  state.evaluationTime = 0;
  chooseStars(state, field, aspect, cycle.cycleIndex, minY);
  if (state.active) state.formedCycleIndex = cycle.cycleIndex;
}

export function renderConstellation(
  context: CanvasRenderingContext2D,
  state: ConstellationState,
  width: number,
  height: number,
  opacity = 1,
): void {
  if (!state.active) return;
  const fade = clamp((TOTAL_TIME - state.elapsed) / FADE_TIME);
  const pointAppear = clamp(state.elapsed / 0.4);
  const scale = Math.max(1, Math.min(width / 1280, height / 510));
  context.save();
  context.lineCap = 'round';
  for (let edge = 0; edge < state.edgeCount; edge += 1) {
    const growth = clamp((state.elapsed - edge * 0.09) / 0.42);
    if (growth <= 0) continue;
    const from = state.edgeFrom[edge];
    const to = state.edgeTo[edge];
    const x1 = state.starX[from] * width;
    const y1 = state.starY[from] * height;
    const x2 = state.starX[to] * width;
    const y2 = state.starY[to] * height;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x1 + (x2 - x1) * growth, y1 + (y2 - y1) * growth);
    context.strokeStyle = '#cbdcff';
    context.lineWidth = scale * 3.2;
    context.globalAlpha = 0.11 * fade * opacity;
    context.stroke();
    context.strokeStyle = '#f2f7ff';
    context.lineWidth = scale * 1.4;
    context.globalAlpha = 0.46 * fade * opacity;
    context.stroke();
  }
  context.fillStyle = '#f2f7ff';
  for (let slot = 0; slot < state.starCount; slot += 1) {
    const x = state.starX[slot] * width;
    const y = state.starY[slot] * height;
    context.globalAlpha = 0.16 * pointAppear * fade * opacity;
    context.beginPath();
    context.arc(x, y, scale * 4.8, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 0.76 * pointAppear * fade * opacity;
    context.beginPath();
    context.arc(x, y, scale * 1.8, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}
