import { CycleState, InteractionState, TIMING, fieldEnvelope } from './model';

const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function renderLightField(
  image: ImageData,
  cycle: CycleState,
  interaction: InteractionState,
  aspect: number,
  reducedMotion: boolean,
): void {
  const { width, height, data } = image;
  const time = reducedMotion ? TIMING.fieldFull + 1 : cycle.cycleIndex * TIMING.cycle + cycle.elapsed;
  const intensity = reducedMotion ? 0.43 : fieldEnvelope(cycle);
  const expansion = reducedMotion ? 1.05 : 0.78 + 0.26 * clamp(
    (cycle.elapsed - TIMING.fieldStart) / (TIMING.fieldFull - TIMING.fieldStart));
  const breathing = reducedMotion ? 1 : 1 + 0.035 * Math.sin(time * 0.35);
  const driftX = reducedMotion ? 0 : 0.014 * Math.sin(time * 0.11);
  const driftY = reducedMotion ? 0 : 0.012 * Math.cos(time * 0.09);
  const centerX = 0.465 + cycle.cycleSeed * 0.025 + driftX + (interaction.x - 0.5) * interaction.strength * 0.016;
  const centerY = 0.56 + cycle.cycleSeed * 0.012 + driftY + (interaction.y - 0.5) * interaction.strength * 0.016;
  const radiusX = 0.46 * expansion * breathing;
  const radiusY = 0.36 * expansion * breathing;
  const baseFlowX = 0.977;
  const baseFlowY = -0.212;
  const active = intensity * (1 + interaction.strength * 0.08);

  for (let y = 0; y < height; y += 1) {
    const v = y / height;
    for (let x = 0; x < width; x += 1) {
      const u = x / width;
      const dx = (u - centerX) * aspect;
      const dy = v - centerY;
      const bend = Math.sin(dy * 8 + time * 0.18) * 0.010
        + Math.cos(dx * 5 - time * 0.12) * 0.006;
      const slowDrift = Math.sin(time * 0.075) * 0.006;
      const flowX = baseFlowX + bend;
      const flowY = baseFlowY + slowDrift - bend * 0.45;
      const warpX = dx + 0.022 * Math.sin(dy * 17 + time * 0.24) * flowY;
      const warpY = dy + 0.028 * Math.sin(dx * 9 - time * 0.2) * flowX;
      const ellipse = (warpX / radiusX) ** 2 + (warpY / radiusY) ** 2;
      const irregular = 0.14 * Math.sin(warpX * 12 + time * 0.13)
        * Math.cos(warpY * 10 - time * 0.1);
      const distance = Math.max(0, ellipse + irregular);
      const cloud = Math.exp(-distance * 1.95);
      const edgeOffset = (distance - 0.65) / 0.55;
      const edge = Math.exp(-(edgeOffset * edgeOffset))
        * (0.12 + 0.85 * Math.max(0, Math.sin(warpX * 8 + warpY * 5 + time * 0.1)
          * Math.cos(warpY * 6 - warpX * 3)));
      const magenta = Math.max(0, Math.sin(warpX * 12 - warpY * 9 + time * 0.23))
        * Math.exp(-distance * 2.5);
      const offset = (y * width + x) * 4;
      // Premultiplied-looking low-opacity color; distant stars remain visible.
      data[offset] = Math.min(255, 87 - edge * 35 + magenta * 95);
      data[offset + 1] = Math.min(255, 84 + edge * 110);
      data[offset + 2] = Math.min(255, 174 + edge * 75 + magenta * 28);
      data[offset + 3] = Math.min(148, active * (cloud * 100 + edge * 44 + magenta * 20));
    }
  }
}
