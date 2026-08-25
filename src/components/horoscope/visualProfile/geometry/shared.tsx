import type { CSSProperties } from 'react';
import type { SignVisualTransformation } from '../../visualProfileTransformations';

export const CENTER = 240;

export const polarPoint = (radius: number, angle: number) => {
  const radians = (angle * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
};

export const transformationStyle = (
  transformation: SignVisualTransformation,
): CSSProperties => ({
  '--vp-primary': transformation.element.colors.primary,
  '--vp-secondary': transformation.element.colors.secondary,
  '--vp-accent': transformation.element.colors.accent,
  '--vp-glow': transformation.element.colors.glow,
  '--vp-core': transformation.element.colors.core,
  '--vp-opacity': transformation.element.colors.opacity,
  '--vp-line-weight': transformation.element.lineWeight,
  '--vp-element-glow': transformation.element.glow,
  '--vp-ray-width': `${0.65 + transformation.element.lineWeight * 0.9}px`,
  '--vp-network-width': `${0.45 + transformation.element.lineWeight * 0.75}px`,
  '--vp-vector-width': `${1.3 + transformation.element.lineWeight * 1.5}px`,
  '--vp-texture-width': `${0.45 + transformation.element.lineWeight * 0.65}px`,
  '--vp-glow-radius': `${1 + transformation.element.glow * 4}px`,
  '--vp-core-glow-radius': `${3 + transformation.element.glow * 7}px`,
} as CSSProperties);

export function SignTextureLayer({ transformation }: { transformation: SignVisualTransformation }) {
  const { texture } = transformation.element;
  const variation = transformation.modality.variation;
  const spread = transformation.polarity.spread;
  const ringRadius = 94 * spread;

  if (texture === 'crystalline') {
    return (
      <g className="visual-profile-transform__crystal" aria-label="Earth crystalline texture">
        {[58, 86, 116].map((radius, ring) => (
          <polygon key={radius} points={Array.from({ length: 6 }, (_, index) => {
            const point = polarPoint(radius * spread, index * 60 - 90 + ring * 9 * variation);
            return `${point.x},${point.y}`;
          }).join(' ')} />
        ))}
        {Array.from({ length: 8 }, (_, index) => {
          const angle = index * 45 - 90 + (index % 2 ? 7 * variation : 0);
          const start = polarPoint(46, angle);
          const end = polarPoint(132 * spread, angle + (index % 2 ? 5 * variation : -3 * variation));
          return <line key={index} x1={start.x} y1={start.y} x2={end.x} y2={end.y} />;
        })}
      </g>
    );
  }

  if (texture === 'network') {
    const nodes = Array.from({ length: 8 }, (_, index) => polarPoint(
      ringRadius + (index % 2 ? 12 * variation : 0),
      index * 45 - 90 + (index % 3) * 6 * variation,
    ));
    return (
      <g className="visual-profile-transform__network" aria-label="Air network texture">
        <polygon points={nodes.map(({ x, y }) => `${x},${y}`).join(' ')} />
        {nodes.map((node, index) => (
          <g key={index}>
            <line x1={CENTER} y1={CENTER} x2={node.x} y2={node.y} />
            <circle cx={node.x} cy={node.y} r={index % 2 ? 2 : 3} />
          </g>
        ))}
      </g>
    );
  }

  if (texture === 'fluid') {
    const curve = 24 + transformation.element.curvature * 18;
    return (
      <g className="visual-profile-transform__fluid" aria-label="Water fluid texture">
        <path d={`M 82 238 C 145 ${238 - curve}, 190 ${238 + curve}, 240 238 S 342 ${238 - curve}, 398 238`} />
        <path d={`M 104 274 C 158 ${274 + curve}, 204 ${274 - curve}, 248 274 S 330 ${274 + curve}, 376 274`} />
        <ellipse cx={CENTER} cy={CENTER + 12} rx={132 * spread} ry={86 * spread} />
      </g>
    );
  }

  return (
    <g className="visual-profile-transform__radiant" aria-label="Fire radiant texture">
      <circle cx={CENTER} cy={CENTER} r={ringRadius} />
      {Array.from({ length: 8 }, (_, index) => {
        const angle = index * 45 - 90;
        const left = polarPoint(104 * spread, angle - 4);
        const tip = polarPoint(137 * spread, angle);
        const right = polarPoint(104 * spread, angle + 4);
        return <path key={angle} d={`M ${left.x} ${left.y} L ${tip.x} ${tip.y} L ${right.x} ${right.y}`} />;
      })}
    </g>
  );
}
