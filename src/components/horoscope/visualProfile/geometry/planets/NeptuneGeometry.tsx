import { formatZodiacSign } from '../../../visualProfileConfig';
import HouseEnvironmentLayer from '../../environment/HouseEnvironmentLayer';
import { CENTER, polarPoint, SignTextureLayer, transformationStyle } from '../shared';
import type { PlanetGeometryProps } from '../types';

export default function NeptuneGeometry({ parameter, environment, transformation }: PlanetGeometryProps) {
  const signLabel = formatZodiacSign(parameter.sign);
  const spread = transformation.polarity.spread;
  const variation = transformation.modality.variation;
  const fieldCount = 4 + Math.round(transformation.modality.repetition * 2);
  return (
    <svg className="visual-profile-prototype__svg visual-profile-prototype__svg--neptune" viewBox="0 0 480 480" role="img" aria-label={`Neptune in ${signLabel} visual profile`} style={transformationStyle(transformation)} data-direction={transformation.polarity.direction} data-texture={transformation.element.texture}>
      <HouseEnvironmentLayer environment={environment} instanceId={parameter.planetId} />
      <g id="visual-profile-planet-layer-neptune" aria-label="Neptune diffusion dissolution and field">
        <g className="visual-profile-neptune__fields">{Array.from({ length: fieldCount }, (_, index) => { const radius = (62 + index * 26) * spread; const offset = variation * (index % 2 ? 13 : -9); return <ellipse key={index} cx={CENTER + offset} cy={CENTER - offset * 0.55} rx={radius} ry={radius * (0.62 + index * 0.045)} />; })}</g>
        <path className="visual-profile-neptune__dissolving-contour" d="M 82 274 C 142 178, 204 302, 258 210 S 358 176, 406 252" /><circle className="visual-profile-neptune__source" cx={CENTER - 18 * variation} cy={CENTER + 8 * variation} r="15" />
        <g className="visual-profile-neptune__diffuse-points">{[18, 76, 143, 218, 292, 344].map((angle, index) => { const point = polarPoint((106 + index * 7) * spread, angle); return <circle key={angle} cx={point.x} cy={point.y} r={3 - index * 0.25} />; })}</g>
      </g>
      <g id="visual-profile-sign-layer-neptune" aria-label={`${signLabel} transformation`}><SignTextureLayer transformation={transformation} /></g>
      <g id="visual-profile-label-layer-neptune"><text className="visual-profile-label__symbol" x={CENTER} y={CENTER + 7}>♆</text><text className="visual-profile-label__stage" x={CENTER} y="438">{environment.stageLabel}</text></g>
    </svg>
  );
}
