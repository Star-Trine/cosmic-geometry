type GalaxyPoint = { x: number; y: number; size: number; alpha: number };
type Nebula = { gradient: CanvasGradient; x: number; y: number; size: number };
type Planet = {
  x: number;
  y: number;
  radius: number;
  halo: CanvasGradient;
  surface: CanvasGradient;
  light: CanvasGradient;
};

export type WideSpace = {
  nebulae: Nebula[];
  galaxy: GalaxyPoint[];
  dust: GalaxyPoint[];
  galaxyCore: CanvasGradient;
  galaxyX: number;
  galaxyY: number;
  galaxyRadius: number;
  planet: Planet;
};

export function createWideSpace(context: CanvasRenderingContext2D, width: number, height: number): WideSpace {
  const nebulae: Nebula[] = [];
  const addNebula = (x: number, y: number, radius: number, inner: string, middle: string) => {
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, inner);
    gradient.addColorStop(0.48, middle);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    nebulae.push({ gradient, x: x - radius, y: y - radius, size: radius * 2 });
  };

  addNebula(width * 0.07, height * 0.6, width * 0.31,
    'rgba(68, 79, 160, 0.14)', 'rgba(42, 135, 174, 0.075)');
  addNebula(width * 0.12, height * 0.19, width * 0.2,
    'rgba(54, 83, 150, 0.18)', 'rgba(48, 113, 157, 0.075)');
  addNebula(width * 0.2, height * 0.26, width * 0.13,
    'rgba(54, 120, 155, 0.09)', 'rgba(79, 78, 147, 0.04)');
  addNebula(width * 0.95, height * 0.36, width * 0.3,
    'rgba(91, 61, 144, 0.12)', 'rgba(58, 113, 169, 0.065)');
  addNebula(width * 0.85, height * 0.76, width * 0.18,
    'rgba(106, 55, 122, 0.06)', 'rgba(49, 82, 141, 0.035)');
  addNebula(width * 0.95, height * 0.87, width * 0.18,
    'rgba(65, 95, 153, 0.17)', 'rgba(59, 73, 134, 0.08)');
  addNebula(width * 0.87, height * 0.79, width * 0.12,
    'rgba(118, 70, 140, 0.09)', 'rgba(67, 108, 151, 0.04)');

  const galaxyX = width * 0.83;
  const galaxyY = height * 0.265;
  const galaxyRadius = Math.min(width * 0.105, height * 0.125);
  const galaxyCore = context.createRadialGradient(galaxyX, galaxyY, 0, galaxyX, galaxyY, galaxyRadius);
  galaxyCore.addColorStop(0, 'rgba(180, 199, 244, 0.37)');
  galaxyCore.addColorStop(0.16, 'rgba(117, 143, 211, 0.17)');
  galaxyCore.addColorStop(1, 'rgba(80, 96, 171, 0)');
  const galaxy: GalaxyPoint[] = [];
  for (let index = 0; index < 80; index += 1) {
    const progress = (index + 0.5) / 80;
    const arm = index % 2 ? Math.PI : 0;
    const angle = arm + progress * Math.PI * 3.5;
    const distance = galaxyRadius * Math.sqrt(progress);
    galaxy.push({
      x: galaxyX + Math.cos(angle) * distance,
      y: galaxyY + Math.sin(angle) * distance * 0.45,
      size: index % 7 === 0 ? 2 : 1.2,
      alpha: (1 - progress * 0.45) * (index % 5 === 0 ? 0.72 : 0.43),
    });
  }

  const dust: GalaxyPoint[] = [];
  let seed = 0x5eeda11;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const addDust = (x: number, y: number, radiusX: number, radiusY: number, count: number) => {
    for (let index = 0; index < count; index += 1) {
      const angle = random() * Math.PI * 2;
      const distance = Math.sqrt(random());
      dust.push({
        x: x + Math.cos(angle) * distance * radiusX,
        y: y + Math.sin(angle) * distance * radiusY,
        size: random() < 0.13 ? 2 : 1.2,
        alpha: 0.18 + random() * 0.42,
      });
    }
  };
  addDust(width * 0.13, height * 0.2, width * 0.13, height * 0.14, 60);
  addDust(width * 0.9, height * 0.82, width * 0.12, height * 0.12, 72);

  const planetX = width * 0.025;
  const planetY = height * 0.865;
  const planetRadius = Math.min(width * 0.08, height * 0.15);
  const halo = context.createRadialGradient(
    planetX, planetY, planetRadius * 0.9, planetX, planetY, planetRadius * 1.55);
  halo.addColorStop(0, 'rgba(95, 136, 202, 0.1)');
  halo.addColorStop(1, 'rgba(95, 136, 202, 0)');
  const surface = context.createRadialGradient(
    planetX + planetRadius * 0.48, planetY - planetRadius * 0.38, planetRadius * 0.04,
    planetX, planetY, planetRadius * 1.25);
  surface.addColorStop(0, 'rgba(25, 38, 67, 0.97)');
  surface.addColorStop(0.42, 'rgba(8, 15, 33, 0.98)');
  surface.addColorStop(1, 'rgba(2, 5, 17, 0.99)');
  const lightX = planetX + planetRadius * 0.85;
  const lightY = planetY - planetRadius * 0.45;
  const light = context.createRadialGradient(
    lightX, lightY, planetRadius * 0.06, lightX, lightY, planetRadius * 1.85);
  light.addColorStop(0, 'rgba(164, 194, 225, 0.34)');
  light.addColorStop(0.4, 'rgba(89, 130, 178, 0.15)');
  light.addColorStop(1, 'rgba(69, 98, 141, 0)');

  return {
    nebulae, galaxy, dust, galaxyCore, galaxyX, galaxyY, galaxyRadius,
    planet: { x: planetX, y: planetY, radius: planetRadius, halo, surface, light },
  };
}

export function renderWideSpace(context: CanvasRenderingContext2D, space: WideSpace): void {
  context.save();
  for (let index = 0; index < space.nebulae.length; index += 1) {
    const nebula = space.nebulae[index];
    context.fillStyle = nebula.gradient;
    context.fillRect(nebula.x, nebula.y, nebula.size, nebula.size);
  }
  context.fillStyle = space.galaxyCore;
  context.fillRect(
    space.galaxyX - space.galaxyRadius, space.galaxyY - space.galaxyRadius,
    space.galaxyRadius * 2, space.galaxyRadius * 2);
  context.strokeStyle = 'rgba(160, 183, 232, 0.24)';
  context.lineWidth = Math.max(1, space.galaxyRadius * 0.014);
  for (let arm = 0; arm < 2; arm += 1) {
    context.beginPath();
    for (let sample = 0; sample <= 24; sample += 1) {
      const progress = sample / 24;
      const angle = arm * Math.PI + progress * Math.PI * 3.5;
      const distance = space.galaxyRadius * Math.sqrt(progress);
      const x = space.galaxyX + Math.cos(angle) * distance;
      const y = space.galaxyY + Math.sin(angle) * distance * 0.45;
      if (sample === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  }
  context.fillStyle = '#c5d7fa';
  for (let index = 0; index < space.galaxy.length; index += 1) {
    const point = space.galaxy[index];
    context.globalAlpha = point.alpha;
    context.fillRect(point.x, point.y, point.size, point.size);
  }
  for (let index = 0; index < space.dust.length; index += 1) {
    const point = space.dust[index];
    context.globalAlpha = point.alpha;
    context.fillRect(point.x, point.y, point.size, point.size);
  }
  const planet = space.planet;
  context.globalAlpha = 1;
  context.fillStyle = planet.halo;
  context.beginPath();
  context.arc(planet.x, planet.y, planet.radius * 1.55, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = planet.surface;
  context.beginPath();
  context.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
  context.fill();
  context.save();
  context.clip();
  context.fillStyle = planet.light;
  context.fillRect(planet.x - planet.radius, planet.y - planet.radius, planet.radius * 2, planet.radius * 2);
  context.restore();
  context.strokeStyle = 'rgba(145, 186, 226, 0.25)';
  context.lineWidth = Math.max(1, planet.radius * 0.018);
  context.beginPath();
  context.arc(planet.x, planet.y, planet.radius, -1.4, 0.75);
  context.stroke();
  context.restore();
}
