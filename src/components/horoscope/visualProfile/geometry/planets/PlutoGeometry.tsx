import { formatZodiacSign } from '../../../visualProfileConfig';
import HouseEnvironmentLayer from '../../environment/HouseEnvironmentLayer';
import { CENTER, polarPoint, SignTextureLayer, transformationStyle } from '../shared';
import type { PlanetGeometryProps } from '../types';

export default function PlutoGeometry({ parameter, environment, transformation }: PlanetGeometryProps) {
  const signLabel = formatZodiacSign(parameter.sign);
  const spread = transformation.polarity.spread;
  const variation = transformation.modality.variation;
  const vectors = 8 + Math.round(transformation.modality.repetition * 4);
  return (
    <svg className="visual-profile-prototype__svg visual-profile-prototype__svg--pluto" viewBox="0 0 480 480" role="img" aria-label={`Pluto in ${signLabel} visual profile`} style={transformationStyle(transformation)} data-direction={transformation.polarity.direction} data-texture={transformation.element.texture}>
      <HouseEnvironmentLayer environment={environment} instanceId={parameter.planetId} />
      <g id="visual-profile-planet-layer-pluto" aria-label="Pluto compression transformation and reconstruction">
        <g className="visual-profile-pluto__collapse-rings">{[136, 102, 72].map((radius, index) => <ellipse key={radius} cx={CENTER + (index - 1) * variation * 7} cy={CENTER} rx={radius * spread} ry={radius * (0.72 + index * 0.08)} />)}</g>
        <g className="visual-profile-pluto__inward-vectors">{Array.from({ length: vectors }, (_, index) => { const angle = index * (360 / vectors) - 90 + (index % 2 ? variation * 8 : 0); const start = polarPoint(152 * spread, angle); const end = polarPoint(48, angle + (index % 2 ? variation * 5 : -variation * 4)); return <path key={index} d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} />; })}</g>
        <circle className="visual-profile-pluto__compressed-core" cx={CENTER} cy={CENTER} r="27" /><polygon className="visual-profile-pluto__rebuilt-core" points="240,207 269,224 266,258 240,276 211,258 214,224" />
      </g>
      <g id="visual-profile-sign-layer-pluto" aria-label={`${signLabel} transformation`}><SignTextureLayer transformation={transformation} /></g>
      <g id="visual-profile-label-layer-pluto"><text className="visual-profile-label__symbol" x={CENTER} y={CENTER + 7}>♇</text><text className="visual-profile-label__stage" x={CENTER} y="438">{environment.stageLabel}</text></g>
    </svg>
  );
}
