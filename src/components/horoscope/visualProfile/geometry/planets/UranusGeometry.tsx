import { formatZodiacSign } from '../../../visualProfileConfig';
import HouseEnvironmentLayer from '../../environment/HouseEnvironmentLayer';
import { CENTER, polarPoint, SignTextureLayer, transformationStyle } from '../shared';
import type { PlanetGeometryProps } from '../types';

export default function UranusGeometry({ parameter, environment, transformation }: PlanetGeometryProps) {
  const signLabel = formatZodiacSign(parameter.sign);
  const spread = transformation.polarity.spread;
  const variation = transformation.modality.variation;
  const branches = 5 + Math.round(transformation.modality.branching * 4);
  return (
    <svg className="visual-profile-prototype__svg visual-profile-prototype__svg--uranus" viewBox="0 0 480 480" role="img" aria-label={`Uranus in ${signLabel} visual profile`} style={transformationStyle(transformation)} data-direction={transformation.polarity.direction} data-texture={transformation.element.texture}>
      <HouseEnvironmentLayer environment={environment} instanceId={parameter.planetId} />
      <g id="visual-profile-planet-layer-uranus" aria-label="Uranus disruption branching and jump">
        <g className="visual-profile-uranus__fractures">{Array.from({ length: branches }, (_, index) => { const angle = index * (360 / branches) - 90 + (index % 2 ? 15 * variation : -7 * variation); const first = polarPoint(42, angle); const breakA = polarPoint(82 * spread, angle + (index % 2 ? 10 : -8)); const breakB = polarPoint(108 * spread, angle + (index % 2 ? -7 : 13)); const end = polarPoint((142 + index % 3 * 10) * spread, angle + (index % 2 ? 18 : -16)); return <g key={index}><path d={`M ${first.x} ${first.y} L ${breakA.x} ${breakA.y}`} /><path d={`M ${breakB.x} ${breakB.y} L ${end.x} ${end.y}`} /><circle cx={end.x} cy={end.y} r="2.5" /></g>; })}</g>
        <path className="visual-profile-uranus__broken-axis" d="M 92 240 L 176 240 M 202 222 L 278 258 M 306 240 L 388 240" /><circle className="visual-profile-uranus__displaced-core" cx={CENTER + 10 * variation} cy={CENTER - 8 * variation} r="18" />
      </g>
      <g id="visual-profile-sign-layer-uranus" aria-label={`${signLabel} transformation`}><SignTextureLayer transformation={transformation} /></g>
      <g id="visual-profile-label-layer-uranus"><text className="visual-profile-label__symbol" x={CENTER} y={CENTER + 7}>♅</text><text className="visual-profile-label__stage" x={CENTER} y="438">{environment.stageLabel}</text></g>
    </svg>
  );
}
