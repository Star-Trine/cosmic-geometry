import { formatZodiacSign } from '../../../visualProfileConfig';
import HouseEnvironmentLayer from '../../environment/HouseEnvironmentLayer';
import { CENTER, SignTextureLayer, transformationStyle } from '../shared';
import type { PlanetGeometryProps } from '../types';

export default function VenusGeometry({ parameter, environment, transformation }: PlanetGeometryProps) {
  const signLabel = formatZodiacSign(parameter.sign);
  const distance = 62 * transformation.polarity.spread;
  const variation = transformation.modality.variation;
  const leftX = CENTER - distance;
  const rightX = CENTER + distance;
  return (
    <svg className="visual-profile-prototype__svg visual-profile-prototype__svg--venus" viewBox="0 0 480 480" role="img" aria-label={`Venus in ${signLabel} visual profile`} style={transformationStyle(transformation)} data-direction={transformation.polarity.direction} data-texture={transformation.element.texture}>
      <HouseEnvironmentLayer environment={environment} instanceId={parameter.planetId} />
      <g id="visual-profile-planet-layer-venus" aria-label="Venus attraction symmetry and balance">
        <line className="visual-profile-venus__symmetry-axis" x1={CENTER} y1="92" x2={CENTER} y2="388" />
        <ellipse className="visual-profile-venus__balance-orbit" cx={CENTER} cy={CENTER} rx={132 * transformation.polarity.spread} ry="92" />
        <g className="visual-profile-venus__attraction-paths"><path d={`M ${leftX} 218 C ${CENTER - 38} ${188 - variation * 18}, ${CENTER - 22} 222, ${CENTER} 240`} /><path d={`M ${rightX} 218 C ${CENTER + 38} ${188 + variation * 18}, ${CENTER + 22} 222, ${CENTER} 240`} /><path d={`M ${leftX} 262 C ${CENTER - 36} 294, ${CENTER - 18} 260, ${CENTER} 240`} /><path d={`M ${rightX} 262 C ${CENTER + 36} 294, ${CENTER + 18} 260, ${CENTER} 240`} /></g>
        <g className="visual-profile-venus__paired-forms"><circle cx={leftX} cy="240" r="22" /><circle cx={rightX} cy="240" r="22" /><circle cx={leftX} cy="240" r="8" /><circle cx={rightX} cy="240" r="8" /></g>
        <circle className="visual-profile-venus__attraction-core" cx={CENTER} cy={CENTER} r="12" />
      </g>
      <g id="visual-profile-sign-layer-venus" aria-label={`${signLabel} transformation`}><SignTextureLayer transformation={transformation} /></g>
      <g id="visual-profile-label-layer-venus"><text className="visual-profile-label__symbol" x={CENTER} y={CENTER + 7}>♀</text><text className="visual-profile-label__stage" x={CENTER} y="438">{environment.stageLabel}</text></g>
    </svg>
  );
}
