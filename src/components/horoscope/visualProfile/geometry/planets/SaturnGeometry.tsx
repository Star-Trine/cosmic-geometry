import { formatZodiacSign } from '../../../visualProfileConfig';
import HouseEnvironmentLayer from '../../environment/HouseEnvironmentLayer';
import { CENTER, SignTextureLayer, transformationStyle } from '../shared';
import type { PlanetGeometryProps } from '../types';

export default function SaturnGeometry({ parameter, environment, transformation }: PlanetGeometryProps) {
  const signLabel = formatZodiacSign(parameter.sign);
  const spread = transformation.polarity.spread;
  const variation = transformation.modality.variation;
  const frameCount = 3 + Math.round(transformation.modality.repetition * 2);
  return (
    <svg className="visual-profile-prototype__svg visual-profile-prototype__svg--saturn" viewBox="0 0 480 480" role="img" aria-label={`Saturn in ${signLabel} visual profile`} style={transformationStyle(transformation)} data-direction={transformation.polarity.direction} data-texture={transformation.element.texture}>
      <HouseEnvironmentLayer environment={environment} instanceId={parameter.planetId} />
      <g id="visual-profile-planet-layer-saturn" aria-label="Saturn boundary framework and constraint">
        <g className="visual-profile-saturn__frames">{Array.from({ length: frameCount }, (_, index) => { const size = (82 + index * 38) * spread; const offset = variation * (index % 2 ? 8 : -5); return <rect key={index} x={CENTER - size / 2 + offset} y={CENTER - size / 2} width={size} height={size} rx={8 + transformation.element.curvature * 18} />; })}</g>
        <g className="visual-profile-saturn__walls"><path d="M 112 148 L 112 332" /><path d="M 368 148 L 368 332" /><path d="M 148 112 L 332 112" /><path d="M 148 368 L 332 368" /></g>
        <circle className="visual-profile-saturn__contained-core" cx={CENTER} cy={CENTER} r="24" /><polygon className="visual-profile-saturn__inner-frame" points="240,196 284,240 240,284 196,240" />
      </g>
      <g id="visual-profile-sign-layer-saturn" aria-label={`${signLabel} transformation`}><SignTextureLayer transformation={transformation} /></g>
      <g id="visual-profile-label-layer-saturn"><text className="visual-profile-label__symbol" x={CENTER} y={CENTER + 7}>♄</text><text className="visual-profile-label__stage" x={CENTER} y="438">{environment.stageLabel}</text></g>
    </svg>
  );
}
