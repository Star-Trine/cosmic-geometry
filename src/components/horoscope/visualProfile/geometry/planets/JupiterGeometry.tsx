import { formatZodiacSign } from '../../../visualProfileConfig';
import HouseEnvironmentLayer from '../../environment/HouseEnvironmentLayer';
import { CENTER, SignTextureLayer, transformationStyle } from '../shared';
import type { PlanetGeometryProps } from '../types';

export default function JupiterGeometry({ parameter, environment, transformation }: PlanetGeometryProps) {
  const signLabel = formatZodiacSign(parameter.sign);
  const spread = transformation.polarity.spread;
  const variation = transformation.modality.variation;
  const shellCount = 4 + Math.round(transformation.modality.repetition * 3);
  const shells = Array.from({ length: shellCount }, (_, index) => ({ radius: (42 + index * (22 + index * 2.8)) * spread, offset: variation * (index % 2 ? 7 : -4) }));
  return (
    <svg className="visual-profile-prototype__svg visual-profile-prototype__svg--jupiter" viewBox="0 0 480 480" role="img" aria-label={`Jupiter in ${signLabel} visual profile`} style={transformationStyle(transformation)} data-direction={transformation.polarity.direction} data-texture={transformation.element.texture}>
      <HouseEnvironmentLayer environment={environment} instanceId={parameter.planetId} />
      <g id="visual-profile-planet-layer-jupiter" aria-label="Jupiter expansion growth and amplification">
        <g className="visual-profile-jupiter__shells">{shells.map(({ radius, offset }, index) => <ellipse key={index} cx={CENTER + offset} cy={CENTER} rx={radius} ry={radius * (0.78 + index * 0.025)} />)}</g>
        <g className="visual-profile-jupiter__growth-arcs"><path d="M 132 284 Q 240 114 348 284" /><path d="M 104 308 Q 240 76 376 308" />{variation > 0.5 && <path d="M 166 334 Q 266 154 392 262" />}</g>
        <circle className="visual-profile-jupiter__seed" cx={CENTER} cy={CENTER} r="16" /><circle className="visual-profile-jupiter__seed-ring" cx={CENTER} cy={CENTER} r="29" />
      </g>
      <g id="visual-profile-sign-layer-jupiter" aria-label={`${signLabel} transformation`}><SignTextureLayer transformation={transformation} /></g>
      <g id="visual-profile-label-layer-jupiter"><text className="visual-profile-label__symbol" x={CENTER} y={CENTER + 7}>♃</text><text className="visual-profile-label__stage" x={CENTER} y="438">{environment.stageLabel}</text></g>
    </svg>
  );
}
