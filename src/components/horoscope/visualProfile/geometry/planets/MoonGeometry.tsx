import { formatZodiacSign } from '../../../visualProfileConfig';
import HouseEnvironmentLayer from '../../environment/HouseEnvironmentLayer';
import { CENTER, polarPoint, SignTextureLayer, transformationStyle } from '../shared';
import type { PlanetGeometryProps } from '../types';

export default function MoonGeometry({ parameter, environment, transformation }: PlanetGeometryProps) {
  const signLabel = formatZodiacSign(parameter.sign);
  const spread = transformation.polarity.spread;
  const variation = transformation.modality.variation;
  const rippleCount = 3 + Math.round(transformation.modality.repetition * 3);
  const ripples = Array.from({ length: rippleCount }, (_, index) => ({
    radius: (56 + index * (25 + variation * (index % 2 ? 6 : -3))) * spread,
    offset: variation * (index % 2 ? 7 : -4),
  }));
  return (
    <svg className="visual-profile-prototype__svg visual-profile-prototype__svg--moon" viewBox="0 0 480 480" role="img" aria-label={`Moon in ${signLabel} visual profile`} style={transformationStyle(transformation)} data-direction={transformation.polarity.direction} data-texture={transformation.element.texture}>
      <HouseEnvironmentLayer environment={environment} instanceId={parameter.planetId} />
      <g id="visual-profile-planet-layer-moon" aria-label="Moon wave reflection and cycle">
        <g className="visual-profile-moon__ripples">{ripples.map(({ radius, offset }, index) => <ellipse key={index} cx={CENTER + offset} cy={CENTER - offset * 0.4} rx={radius} ry={radius * (0.82 + variation * 0.08)} />)}</g>
        <circle className="visual-profile-moon__reflection-orbit" cx={CENTER} cy={CENTER} r={142 * spread} />
        <circle className="visual-profile-moon__core" cx={CENTER} cy={CENTER} r="30" />
        <path className="visual-profile-moon__crescent" d="M 258 207 A 38 38 0 1 0 258 273 A 30 38 0 0 1 258 207 Z" />
        <g className="visual-profile-moon__phase-nodes">{Array.from({ length: 8 }, (_, index) => { const point = polarPoint(118 * spread, index * 45 - 90 + variation * (index % 2 ? 8 : 0)); return <circle key={index} cx={point.x} cy={point.y} r={index === 0 ? 4 : 2.2} />; })}</g>
      </g>
      <g id="visual-profile-sign-layer-moon" aria-label={`${signLabel} transformation`}><SignTextureLayer transformation={transformation} /></g>
      <g id="visual-profile-label-layer-moon"><text className="visual-profile-label__symbol" x={CENTER} y={CENTER + 7}>☽</text><text className="visual-profile-label__stage" x={CENTER} y="438">{environment.stageLabel}</text></g>
    </svg>
  );
}
