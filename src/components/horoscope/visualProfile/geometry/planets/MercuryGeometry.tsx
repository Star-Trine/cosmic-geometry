import { formatHouse, formatZodiacSign } from '../../../visualProfileConfig';
import HouseEnvironmentLayer from '../../environment/HouseEnvironmentLayer';
import { CENTER, SignTextureLayer, transformationStyle } from '../shared';
import type { PlanetGeometryProps } from '../types';

const mercuryNodes = [{ x: 240, y: 240, size: 7, primary: true }, { x: 168, y: 193, size: 4 }, { x: 312, y: 193, size: 4 }, { x: 151, y: 281, size: 4 }, { x: 329, y: 281, size: 4 }, { x: 99, y: 170, size: 3 }, { x: 381, y: 170, size: 3 }, { x: 92, y: 324, size: 3 }, { x: 388, y: 324, size: 3 }, { x: 240, y: 112, size: 3.5 }, { x: 240, y: 368, size: 3.5 }];
const mercuryConnections = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 9], [0, 10], [1, 2], [1, 3], [2, 4], [3, 4], [1, 5], [2, 6], [3, 7], [4, 8], [5, 9], [6, 9], [7, 10], [8, 10]];

export default function MercuryGeometry({ parameter, environment, transformation }: PlanetGeometryProps) {
  const signLabel = formatZodiacSign(parameter.sign);
  const houseLabel = formatHouse(parameter.house).toLowerCase();
  const transformedNodes = mercuryNodes.map((node, index) => ({ ...node, x: CENTER + (node.x - CENTER) * transformation.polarity.spread, y: CENTER + (node.y - CENTER) * transformation.polarity.spread + (index % 2 ? 8 : -5) * transformation.modality.variation }));
  const connectionCount = Math.max(8, Math.round(mercuryConnections.length * (0.55 + transformation.element.connectivity * 0.45)));
  return (
    <svg className="visual-profile-prototype__svg visual-profile-prototype__svg--mercury" viewBox="0 0 480 480" role="img" style={transformationStyle(transformation)} data-direction={transformation.polarity.direction} data-texture={transformation.element.texture} aria-labelledby="visual-profile-mercury-title visual-profile-mercury-description">
      <title id="visual-profile-mercury-title">Mercury in {signLabel} in the {houseLabel}</title><desc id="visual-profile-mercury-description">An outward, balanced and airy communication network presented in a clear frontal field.</desc>
      <defs><radialGradient id="visual-profile-front-field" cx="50%" cy="50%" r="58%"><stop offset="0%" stopColor="#d8f8ff" stopOpacity="0.13" /><stop offset="62%" stopColor="#6bdaf0" stopOpacity="0.045" /><stop offset="100%" stopColor="#07101e" stopOpacity="0" /></radialGradient><filter id="visual-profile-signal-glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
      <HouseEnvironmentLayer environment={environment} instanceId={parameter.planetId} />
      <g id="visual-profile-planet-layer" aria-label="Mercury network and signal"><g className="visual-profile-mercury__connections">{mercuryConnections.slice(0, connectionCount).map(([fromIndex, toIndex]) => { const from = transformedNodes[fromIndex]; const to = transformedNodes[toIndex]; return <line key={`${fromIndex}-${toIndex}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />; })}</g><g className="visual-profile-mercury__nodes">{transformedNodes.map((node, index) => <g key={index} className={node.primary ? 'is-primary' : undefined}><circle className="visual-profile-mercury__node-halo" cx={node.x} cy={node.y} r={node.size + 7} /><circle className="visual-profile-mercury__node" cx={node.x} cy={node.y} r={node.size} /></g>)}</g></g>
      <g id="visual-profile-sign-layer" aria-label={`${signLabel} transformation`} data-polarity={parameter.polarity} data-modality={parameter.modality} data-element={parameter.element}><SignTextureLayer transformation={transformation} /></g>
      <g id="visual-profile-label-layer" aria-label="Prototype label"><text className="visual-profile-label__symbol visual-profile-label__symbol--mercury" x={CENTER} y={CENTER + 7}>☿</text><text className="visual-profile-label__stage" x={CENTER} y="438">{environment.stageLabel}</text></g>
    </svg>
  );
}
