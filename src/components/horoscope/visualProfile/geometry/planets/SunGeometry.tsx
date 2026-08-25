import { formatHouse, formatZodiacSign } from '../../../visualProfileConfig';
import HouseEnvironmentLayer from '../../environment/HouseEnvironmentLayer';
import { CENTER, polarPoint, SignTextureLayer, transformationStyle } from '../shared';
import type { PlanetGeometryProps } from '../types';

const RAY_COUNT = 12;
const radiationPaths = Array.from({ length: RAY_COUNT }, (_, index) => {
  const angle = index * (360 / RAY_COUNT) - 90;
  const outer = polarPoint(index % 2 === 0 ? 142 : 128, angle);
  const bend = polarPoint(index % 3 === 0 ? 80 : 88, angle + (index % 2 === 0 ? 5 : -7));
  const inner = polarPoint(38, angle + (index % 2 === 0 ? 2 : -2));
  return `M ${outer.x} ${outer.y} Q ${bend.x} ${bend.y} ${inner.x} ${inner.y}`;
});
const crystalRings = [62, 92, 122].map((radius, ringIndex) => Array.from({ length: 6 }, (_, index) => { const point = polarPoint(radius, index * 60 - 90 + ringIndex * 10); return `${point.x},${point.y}`; }).join(' '));

export function VirgoSunSnapshot({ instanceId = '' }: { instanceId?: string }) {
  return (
    <svg className="visual-profile-prototype__svg" viewBox="0 0 480 480" role="img" aria-labelledby="visual-profile-sun-title visual-profile-sun-description">
      <title id="visual-profile-sun-title">Sun in Virgo in the twelfth house</title>
      <desc id="visual-profile-sun-description">An inward, mutable and crystalline solar geometry submerged in a veiled environment.</desc>
      <defs>
        <radialGradient id="visual-profile-depth" cx="50%" cy="46%" r="58%"><stop offset="0%" stopColor="#8be4ff" stopOpacity="0.12" /><stop offset="48%" stopColor="#5875c9" stopOpacity="0.07" /><stop offset="100%" stopColor="#050819" stopOpacity="0" /></radialGradient>
        <radialGradient id="visual-profile-core" cx="45%" cy="40%" r="60%"><stop offset="0%" stopColor="#f2fbff" /><stop offset="35%" stopColor="#aeeaff" stopOpacity="0.94" /><stop offset="100%" stopColor="#62b7d2" stopOpacity="0.08" /></radialGradient>
        <linearGradient id="visual-profile-veil" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#b7dfff" stopOpacity="0.02" /><stop offset="52%" stopColor="#8898df" stopOpacity="0.15" /><stop offset="100%" stopColor="#4d548d" stopOpacity="0.01" /></linearGradient>
        <filter id="visual-profile-soft-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="visual-profile-veil-blur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <g id={`visual-profile-environment-layer${instanceId}`} aria-label="Twelfth house environment"><circle className="visual-profile-environment__depth" cx={CENTER} cy={CENTER} r="205" /><ellipse className="visual-profile-environment__orbit visual-profile-environment__orbit--far" cx="238" cy="248" rx="188" ry="132" /><ellipse className="visual-profile-environment__orbit visual-profile-environment__orbit--near" cx="246" cy="226" rx="154" ry="188" /><path className="visual-profile-environment__veil" d="M 26 305 C 115 224, 183 265, 255 218 S 396 129, 466 190 L 466 350 C 350 305, 295 350, 198 331 S 72 368, 26 305 Z" /><path className="visual-profile-environment__veil visual-profile-environment__veil--deep" d="M 12 196 C 103 142, 165 195, 239 169 S 385 88, 475 144 L 475 236 C 392 205, 326 240, 247 225 S 95 248, 12 196 Z" /></g>
      <g id={`visual-profile-planet-layer${instanceId}`} aria-label="Sun core and radiation"><circle className="visual-profile-planet__containment" cx={CENTER} cy={CENTER} r="151" /><g className="visual-profile-planet__radiation">{radiationPaths.map((path, index) => <path key={index} d={path} />)}</g><circle className="visual-profile-planet__halo" cx={CENTER} cy={CENTER} r="44" /><circle className="visual-profile-planet__core" cx={CENTER} cy={CENTER} r="22" /><circle className="visual-profile-planet__core-ring" cx={CENTER} cy={CENTER} r="31" /></g>
      <g id={`visual-profile-sign-layer${instanceId}`} aria-label="Virgo transformation"><g className="visual-profile-sign__crystal-rings">{crystalRings.map((points, index) => <polygon key={index} points={points} />)}</g><g className="visual-profile-sign__lattice">{Array.from({ length: 6 }, (_, index) => { const start = polarPoint(48, index * 60 - 90); const end = polarPoint(132, index * 60 - 86 + (index % 2 === 0 ? 6 : -4)); return <line key={index} x1={start.x} y1={start.y} x2={end.x} y2={end.y} />; })}</g><g className="visual-profile-sign__mutable-nodes">{[52, 78, 106].flatMap((radius, ringIndex) => [20, 140, 260].map((angle, index) => { const point = polarPoint(radius, angle + ringIndex * 13); return <circle key={`${ringIndex}-${index}`} cx={point.x} cy={point.y} r={ringIndex + 1.6} />; }))}</g></g>
      <g id={`visual-profile-label-layer${instanceId}`} aria-label="Prototype label"><text className="visual-profile-label__symbol" x={CENTER} y={CENTER + 7}>☉</text><text className="visual-profile-label__stage" x={CENTER} y="438">DEEP · VEILED · DIFFUSE</text></g>
    </svg>
  );
}

export default function SunGeometry({ parameter, environment, transformation }: PlanetGeometryProps) {
  const signLabel = formatZodiacSign(parameter.sign);
  const houseLabel = formatHouse(parameter.house).toLowerCase();
  const rayCount = 10 + Math.round(transformation.modality.repetition * 8);
  const outwardRays = Array.from({ length: rayCount }, (_, index) => { const variation = transformation.modality.variation * (index % 2 ? 6 : -4); const angle = index * (360 / rayCount) - 90 + variation; const spread = transformation.polarity.spread; return { inner: polarPoint((index % 2 === 0 ? 48 : 54) * (2 - spread), angle), outer: polarPoint((index % 2 === 0 ? 154 : 136) * spread, angle) }; });
  return (
    <svg className="visual-profile-prototype__svg visual-profile-prototype__svg--leo-sun" viewBox="0 0 480 480" role="img" style={transformationStyle(transformation)} data-direction={transformation.polarity.direction} data-texture={transformation.element.texture} aria-labelledby="visual-profile-leo-sun-title visual-profile-leo-sun-description">
      <title id="visual-profile-leo-sun-title">Sun in {signLabel} in the {houseLabel}</title><desc id="visual-profile-leo-sun-description">A stable, outward and luminous solar geometry presented in an open expressive field.</desc>
      <defs><radialGradient id="visual-profile-fifth-house-field" cx="50%" cy="48%" r="62%"><stop offset="0%" stopColor="#fff3cb" stopOpacity="0.14" /><stop offset="42%" stopColor="#ffd990" stopOpacity="0.06" /><stop offset="100%" stopColor="#07101f" stopOpacity="0" /></radialGradient><radialGradient id="visual-profile-leo-core" cx="43%" cy="38%" r="62%"><stop offset="0%" stopColor="#ffffff" /><stop offset="32%" stopColor="#fff1c2" stopOpacity="0.98" /><stop offset="72%" stopColor="#ffc86d" stopOpacity="0.48" /><stop offset="100%" stopColor="#77d9f2" stopOpacity="0.04" /></radialGradient><linearGradient id="visual-profile-leo-ray" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="#8ddff1" stopOpacity="0.28" /><stop offset="55%" stopColor="#ffe3a1" stopOpacity="0.74" /><stop offset="100%" stopColor="#fff8dc" stopOpacity="0.94" /></linearGradient><filter id="visual-profile-leo-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <HouseEnvironmentLayer environment={environment} instanceId={parameter.planetId} />
      <g id="visual-profile-planet-layer" aria-label="Sun core and outward radiation"><circle className="visual-profile-leo-sun__outer-orbit" cx={CENTER} cy={CENTER} r="164" /><g className="visual-profile-leo-sun__radiation">{outwardRays.map((ray, index) => <line key={index} x1={ray.inner.x} y1={ray.inner.y} x2={ray.outer.x} y2={ray.outer.y} />)}</g><circle className="visual-profile-leo-sun__halo" cx={CENTER} cy={CENTER} r="50" /><circle className="visual-profile-leo-sun__core" cx={CENTER} cy={CENTER} r="22" /><circle className="visual-profile-leo-sun__core-ring" cx={CENTER} cy={CENTER} r="32" /></g>
      <g id="visual-profile-sign-layer" aria-label={`${signLabel} transformation`} data-polarity={parameter.polarity} data-modality={parameter.modality} data-element={parameter.element}><SignTextureLayer transformation={transformation} /></g>
      <g id="visual-profile-label-layer" aria-label="Prototype label"><text className="visual-profile-label__symbol visual-profile-label__symbol--leo-sun" x={CENTER} y={CENTER + 7}>☉</text><text className="visual-profile-label__stage" x={CENTER} y="438">{environment.stageLabel}</text></g>
    </svg>
  );
}
