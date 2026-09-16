import { WaveShape, WaveState, waveCenterX } from './model';

export function renderWaveField(
  context: CanvasRenderingContext2D,
  waves: WaveState[],
  width: number,
  height: number,
  shape: WaveShape,
  opacity = 1,
): void {
  for (let index = 0; index < waves.length; index += 1) {
    const wave = waves[index];
    if (wave.intensity <= 0) continue;

    // The source and slope follow LightField's near-center origin and base flow.
    const centerX = width * waveCenterX(wave);
    const centerY = height * (0.58 + wave.verticalOffset)
      + (centerX - width * 0.465) * wave.direction.y / wave.direction.x;
    const halfLength = width * shape.halfLength;
    const startX = centerX - halfLength;
    const endX = centerX + halfLength;
    const slope = wave.direction.y / wave.direction.x;
    const startY = centerY - halfLength * slope;
    const endY = centerY + halfLength * slope;
    context.beginPath();
    context.moveTo(startX, startY);
    for (let sample = 1; sample <= 32; sample += 1) {
      const progress = sample / 32;
      const x = startX + (endX - startX) * progress;
      const envelope = Math.sin(Math.PI * progress);
      const bend = envelope * Math.sin(wave.phase * 0.5) * wave.bendAmount * height * 0.5 * shape.bendScale;
      const displacement = envelope * wave.displacementAmplitude * height * shape.displacementScale * (
        Math.sin(progress * Math.PI * 2 * shape.primaryCycles - wave.phase)
        + 0.2 * Math.sin(progress * Math.PI * 2 * shape.secondaryCycles + wave.phase * 0.65)
      );
      context.lineTo(x, centerY + (x - centerX) * slope + bend + displacement);
    }

    const color = context.createLinearGradient(startX, startY, endX, endY);
    color.addColorStop(0, 'rgba(70, 200, 215, 0)');
    color.addColorStop(0.12, 'rgba(70, 200, 215, 0.65)');
    color.addColorStop(0.24, 'rgba(71, 184, 214, 0.75)');
    color.addColorStop(0.37, 'rgba(77, 150, 216, 0.78)');
    color.addColorStop(0.5, 'rgba(91, 119, 209, 0.8)');
    color.addColorStop(0.62, 'rgba(119, 105, 200, 0.78)');
    color.addColorStop(0.73, 'rgba(145, 102, 194, 0.75)');
    color.addColorStop(0.84, 'rgba(172, 93, 179, 0.7)');
    color.addColorStop(0.94, 'rgba(192, 90, 162, 0.5)');
    color.addColorStop(1, 'rgba(192, 90, 162, 0)');

    context.save();
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.globalAlpha = wave.intensity * 0.35 * opacity;
    context.lineWidth = height * wave.width;
    context.stroke();
    context.globalAlpha = wave.intensity * 0.55 * opacity;
    context.lineWidth = height * wave.width * 0.16;
    context.stroke();
    context.restore();
  }
}
