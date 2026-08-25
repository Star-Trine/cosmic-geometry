import { useId, type ComponentType, type CSSProperties } from 'react';
import type {
  HouseEnvironmentConfig,
  HouseEnvironmentVariant,
} from '../../visualProfileConfig';

const CENTER = 240;

type EnvironmentRendererProps = {
  environment: HouseEnvironmentConfig;
  idScope: string;
};

export type HouseEnvironmentLayerProps = {
  environment: HouseEnvironmentConfig;
  instanceId: string;
};

const polarPoint = (radius: number, angle: number) => {
  const radians = (angle * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  };
};

const layerId = (idScope: string) => `visual-profile-environment-layer-${idScope}`;
const gradientId = (idScope: string) => `visual-profile-environment-gradient-${idScope}`;

const positionOffset = (position: HouseEnvironmentConfig['position']) => ({
  center: { x: 0, y: 0 },
  upper: { x: 0, y: -28 },
  lower: { x: 0, y: 28 },
  inner: { x: 0, y: 8 },
  outer: { x: 0, y: -4 },
}[position]);

const environmentStyle = (environment: HouseEnvironmentConfig): CSSProperties => ({
  color: `rgba(125, 211, 238, ${0.3 + environment.brightness * 0.5})`,
  fill: 'none',
  stroke: `rgba(125, 211, 238, ${0.14 + environment.visibility * 0.34})`,
  strokeWidth: 0.6 + environment.boundary * 1.15,
  filter: `drop-shadow(0 0 ${1 + environment.brightness * 3}px rgba(86, 195, 226, ${0.08 + environment.brightness * 0.16}))`,
});

const positionedTransform = (environment: HouseEnvironmentConfig) => {
  const { x, y } = positionOffset(environment.position);
  return `translate(${x} ${y})`;
};

function NeutralEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  return (
    <g id={layerId(idScope)} aria-label={environment.label}>
      <circle className="visual-profile-environment__neutral-field" cx={CENTER} cy={CENTER} r="205" />
      <circle className="visual-profile-environment__neutral-boundary" cx={CENTER} cy={CENTER} r="178" />
    </g>
  );
}

function FrontEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  const fieldId = gradientId(idScope);
  return (
    <g id={layerId(idScope)} aria-label={environment.label}>
      <defs>
        <radialGradient id={fieldId} cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#d8f8ff" stopOpacity="0.13" />
          <stop offset="62%" stopColor="#6bdaf0" stopOpacity="0.045" />
          <stop offset="100%" stopColor="#07101e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="visual-profile-environment__front-field" style={{ fill: `url(#${fieldId})` }} cx={CENTER} cy={CENTER} r="205" />
      <circle className="visual-profile-environment__clear-ring" cx={CENTER} cy={CENTER} r="180" />
      <circle className="visual-profile-environment__clear-ring visual-profile-environment__clear-ring--inner" cx={CENTER} cy={CENTER} r="154" />
      <line className="visual-profile-environment__clear-axis" x1="48" y1={CENTER} x2="432" y2={CENTER} />
      <line className="visual-profile-environment__clear-axis" x1={CENTER} y1="48" x2={CENTER} y2="432" />
    </g>
  );
}

function HeldEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  const fieldId = gradientId(idScope);
  return (
    <g id={layerId(idScope)} aria-label={environment.label}>
      <defs>
        <radialGradient id={fieldId} cx="50%" cy="64%" r="55%">
          <stop offset="0%" stopColor="#8edbea" stopOpacity="0.13" />
          <stop offset="58%" stopColor="#557ca8" stopOpacity="0.055" />
          <stop offset="100%" stopColor="#07101d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="visual-profile-environment__held-field" style={{ fill: `url(#${fieldId})` }} cx={CENTER} cy={CENTER} r="205" />
      <rect className="visual-profile-environment__held-boundary" x="66" y="74" width="348" height="326" rx="74" />
      <g className="visual-profile-environment__ground-layers">
        <path d="M 62 340 Q 240 322 418 340 L 405 359 Q 240 346 75 359 Z" />
        <path d="M 78 366 Q 240 351 402 366 L 389 383 Q 240 373 91 383 Z" />
        <path d="M 101 390 Q 240 380 379 390 L 365 405 Q 240 398 115 405 Z" />
      </g>
      <line className="visual-profile-environment__ground-axis" x1="78" y1="326" x2="402" y2="326" />
    </g>
  );
}

function ExpressiveEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  const fieldId = gradientId(idScope);
  return (
    <g id={layerId(idScope)} aria-label={environment.label}>
      <defs>
        <radialGradient id={fieldId} cx="50%" cy="48%" r="62%">
          <stop offset="0%" stopColor="#fff3cb" stopOpacity="0.14" />
          <stop offset="42%" stopColor="#ffd990" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#07101f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="visual-profile-environment__expressive-field" style={{ fill: `url(#${fieldId})` }} cx={CENTER} cy={CENTER} r="210" />
      <g className="visual-profile-environment__open-arcs">
        <path d="M 62 278 A 188 188 0 0 1 418 278" />
        <path d="M 88 312 A 166 166 0 0 1 392 312" />
        <path d="M 120 344 A 142 142 0 0 1 360 344" />
      </g>
      <g className="visual-profile-environment__stage-points">
        {[210, 240, 270, 300, 330].map((angle) => {
          const point = polarPoint(188, angle);
          return <circle key={angle} cx={point.x} cy={point.y} r="2.4" />;
        })}
      </g>
    </g>
  );
}

function LocalNetworkEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  const nodeCount = 5 + Math.round(environment.density * 4);
  const radius = 58 + environment.openness * 54;
  const nodes = Array.from({ length: nodeCount }, (_, index) => polarPoint(
    radius * (index % 3 === 0 ? 0.62 : 1),
    index * (360 / nodeCount) - 90 + (index % 2 ? 9 : -5),
  ));
  const connectionCount = Math.max(nodeCount, Math.round(nodeCount * environment.connectivity * 1.7));
  return (
    <g id={layerId(idScope)} aria-label={environment.label} data-environment-pattern="local-network" transform={positionedTransform(environment)} style={environmentStyle(environment)}>
      <circle cx={CENTER} cy={CENTER} r={radius + 25 * environment.boundary} opacity={0.18 + environment.boundary * 0.28} />
      <g className="visual-profile-environment__local-connections">
        {Array.from({ length: connectionCount }, (_, index) => {
          const from = nodes[index % nodeCount];
          const to = nodes[(index + 1 + index % 2) % nodeCount];
          return <line key={index} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
        })}
      </g>
      <g className="visual-profile-environment__local-nodes">{nodes.map((node, index) => <circle key={index} cx={node.x} cy={node.y} r={2 + environment.brightness * 1.8} fill="currentColor" />)}</g>
    </g>
  );
}

function EnclosedEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  const ringCount = 2 + Math.round(environment.density * 3);
  const baseRadius = 128 - environment.depth * 28;
  return (
    <g id={layerId(idScope)} aria-label={environment.label} data-environment-pattern="enclosed" transform={positionedTransform(environment)} style={environmentStyle(environment)}>
      {Array.from({ length: ringCount }, (_, index) => <ellipse key={index} cx={CENTER} cy={CENTER + index * 3 * (1 - environment.symmetry)} rx={baseRadius + index * 16 * environment.openness} ry={(baseRadius + index * 13) * (0.78 + environment.symmetry * 0.18)} opacity={(0.22 + environment.visibility * 0.35) * (1 - index * 0.1)} />)}
      <path d="M 115 240 C 134 134, 346 134, 365 240 C 346 348, 134 348, 115 240 Z" opacity={0.2 + environment.boundary * 0.45} />
    </g>
  );
}

function OrderedEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  const lineCount = 4 + Math.round(environment.density * 4);
  const extent = 92 + environment.openness * 70;
  const spacing = (extent * 2) / (lineCount - 1);
  return (
    <g id={layerId(idScope)} aria-label={environment.label} data-environment-pattern="ordered" transform={positionedTransform(environment)} style={environmentStyle(environment)}>
      <rect x={CENTER - extent} y={CENTER - extent} width={extent * 2} height={extent * 2} rx={12 + (1 - environment.boundary) * 30} opacity={0.18 + environment.boundary * 0.35} />
      <g className="visual-profile-environment__ordered-grid" opacity={0.25 + environment.visibility * 0.45}>
        {Array.from({ length: lineCount }, (_, index) => { const offset = CENTER - extent + index * spacing; return <g key={index}><line x1={offset} y1={CENTER - extent} x2={offset} y2={CENTER + extent} /><line x1={CENTER - extent} y1={offset} x2={CENTER + extent} y2={offset} /></g>; })}
      </g>
    </g>
  );
}

function MirroredEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  const distance = 72 + environment.openness * 54;
  const radius = 42 + environment.density * 18;
  return (
    <g id={layerId(idScope)} aria-label={environment.label} data-environment-pattern="mirrored" transform={positionedTransform(environment)} style={environmentStyle(environment)}>
      <line x1={CENTER} y1="72" x2={CENTER} y2="408" opacity={0.3 + environment.symmetry * 0.45} />
      <ellipse cx={CENTER - distance} cy={CENTER} rx={radius} ry={radius * 1.18} opacity={0.2 + environment.visibility * 0.38} />
      <ellipse cx={CENTER + distance} cy={CENTER} rx={radius} ry={radius * 1.18} opacity={0.2 + environment.visibility * 0.38} />
      <path d={`M ${CENTER - distance} 240 Q 240 ${190 - environment.connectivity * 30} ${CENTER + distance} 240 Q 240 ${290 + environment.connectivity * 30} ${CENTER - distance} 240`} opacity={0.25 + environment.connectivity * 0.45} />
    </g>
  );
}

function LayeredEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  const layerCount = 3 + Math.round(environment.density * 4);
  return (
    <g id={layerId(idScope)} aria-label={environment.label} data-environment-pattern="layered" transform={positionedTransform(environment)} style={environmentStyle(environment)}>
      {Array.from({ length: layerCount }, (_, index) => {
        const inset = index * (12 + environment.depth * 5);
        const offset = (index % 2 ? 1 : -1) * (1 - environment.symmetry) * 18;
        return <path key={index} d={`M ${62 + inset + offset} ${170 + inset * 0.5} Q 240 ${92 + inset}, ${418 - inset + offset} ${170 + inset * 0.5} L ${390 - inset} ${342 - inset * 0.35} Q 240 ${394 - inset}, ${90 + inset} ${342 - inset * 0.35} Z`} opacity={(0.12 + environment.visibility * 0.28) * (1 - index * 0.08)} />;
      })}
    </g>
  );
}

function ElevatedEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  const horizonCount = 2 + Math.round(environment.density * 4);
  const spread = 120 + environment.openness * 78;
  return (
    <g id={layerId(idScope)} aria-label={environment.label} data-environment-pattern="elevated" transform={positionedTransform(environment)} style={environmentStyle(environment)}>
      {Array.from({ length: horizonCount }, (_, index) => <path key={index} d={`M ${CENTER - spread + index * 12} ${292 - index * 25} Q 240 ${238 - environment.depth * 45 - index * 10}, ${CENTER + spread - index * 12} ${292 - index * 25}`} opacity={0.2 + environment.visibility * 0.35 - index * 0.025} />)}
      <g className="visual-profile-environment__distant-points">{[205, 235, 270, 305, 335].map((angle) => { const point = polarPoint(178 + environment.openness * 18, angle); return <circle key={angle} cx={point.x} cy={point.y} r={1.3 + environment.brightness} fill="currentColor" opacity={0.35 + environment.visibility * 0.4} />; })}</g>
    </g>
  );
}

function PublicEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  const width = 120 + environment.openness * 80;
  return (
    <g id={layerId(idScope)} aria-label={environment.label} data-environment-pattern="public" transform={positionedTransform(environment)} style={environmentStyle(environment)}>
      <path d={`M ${CENTER - width} 178 Q 240 ${105 - environment.depth * 20}, ${CENTER + width} 178`} opacity={0.3 + environment.visibility * 0.45} />
      <path d={`M ${CENTER - width * 0.82} 208 L 240 145 L ${CENTER + width * 0.82} 208`} opacity={0.2 + environment.boundary * 0.4} />
      <g className="visual-profile-environment__public-rays">{Array.from({ length: 5 + Math.round(environment.density * 3) }, (_, index) => { const x = CENTER - width * 0.72 + index * (width * 1.44 / (4 + Math.round(environment.density * 3))); return <line key={index} x1={x} y1="190" x2={x + (x - CENTER) * 0.16} y2="92" opacity={0.18 + environment.brightness * 0.36} />; })}</g>
    </g>
  );
}

function DistributedEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  const nodeCount = 8 + Math.round(environment.density * 8);
  const radius = 128 + environment.openness * 65;
  const nodes = Array.from({ length: nodeCount }, (_, index) => polarPoint(radius * (index % 3 === 0 ? 0.7 : 1), index * (360 / nodeCount) - 90 + (index % 4) * 7));
  const connectionCount = Math.round(nodeCount * (0.5 + environment.connectivity));
  return (
    <g id={layerId(idScope)} aria-label={environment.label} data-environment-pattern="distributed" transform={positionedTransform(environment)} style={environmentStyle(environment)}>
      <g className="visual-profile-environment__distributed-connections">{Array.from({ length: connectionCount }, (_, index) => { const from = nodes[index % nodeCount]; const to = nodes[(index + 2 + index % 3) % nodeCount]; return <line key={index} x1={from.x} y1={from.y} x2={to.x} y2={to.y} opacity={0.15 + environment.connectivity * 0.32} />; })}</g>
      <g className="visual-profile-environment__distributed-nodes">{nodes.map((node, index) => <circle key={index} cx={node.x} cy={node.y} r={1.6 + environment.brightness * 1.6} fill="currentColor" opacity={0.35 + environment.visibility * 0.45} />)}</g>
    </g>
  );
}

function VeiledEnvironment({ environment, idScope }: EnvironmentRendererProps) {
  const fieldId = gradientId(idScope);
  const secondaryId = `visual-profile-environment-secondary-${idScope}`;
  const blurId = `visual-profile-environment-blur-${idScope}`;
  return (
    <g id={layerId(idScope)} aria-label={environment.label}>
      <defs>
        <radialGradient id={fieldId} cx="50%" cy="46%" r="58%">
          <stop offset="0%" stopColor="#8be4ff" stopOpacity="0.12" />
          <stop offset="48%" stopColor="#5875c9" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#050819" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={secondaryId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b7dfff" stopOpacity="0.02" />
          <stop offset="52%" stopColor="#8898df" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#4d548d" stopOpacity="0.01" />
        </linearGradient>
        <filter id={blurId} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
      </defs>
      <circle className="visual-profile-environment__depth" style={{ fill: `url(#${fieldId})` }} cx={CENTER} cy={CENTER} r="205" />
      <ellipse className="visual-profile-environment__orbit visual-profile-environment__orbit--far" cx="238" cy="248" rx="188" ry="132" />
      <ellipse className="visual-profile-environment__orbit visual-profile-environment__orbit--near" cx="246" cy="226" rx="154" ry="188" />
      <path className="visual-profile-environment__veil" style={{ fill: `url(#${secondaryId})`, filter: `url(#${blurId})` }} d="M 26 305 C 115 224, 183 265, 255 218 S 396 129, 466 190 L 466 350 C 350 305, 295 350, 198 331 S 72 368, 26 305 Z" />
      <path className="visual-profile-environment__veil visual-profile-environment__veil--deep" style={{ fill: `url(#${secondaryId})`, filter: `url(#${blurId})` }} d="M 12 196 C 103 142, 165 195, 239 169 S 385 88, 475 144 L 475 236 C 392 205, 326 240, 247 225 S 95 248, 12 196 Z" />
    </g>
  );
}

export const HOUSE_ENVIRONMENT_RENDERERS: Record<
  HouseEnvironmentVariant,
  ComponentType<EnvironmentRendererProps>
> = {
  front: FrontEnvironment,
  held: HeldEnvironment,
  localNetwork: LocalNetworkEnvironment,
  enclosed: EnclosedEnvironment,
  expressive: ExpressiveEnvironment,
  ordered: OrderedEnvironment,
  mirrored: MirroredEnvironment,
  layered: LayeredEnvironment,
  elevated: ElevatedEnvironment,
  public: PublicEnvironment,
  distributed: DistributedEnvironment,
  veiled: VeiledEnvironment,
  neutral: NeutralEnvironment,
};

export default function HouseEnvironmentLayer({
  environment,
  instanceId,
}: HouseEnvironmentLayerProps) {
  const reactId = useId().replace(/:/g, '');
  const idScope = `${instanceId}-${reactId}`;
  const Renderer = HOUSE_ENVIRONMENT_RENDERERS[environment.variant];
  return (
    <g
      data-house-environment={environment.variant}
      data-depth={environment.depth}
      data-openness={environment.openness}
      data-visibility={environment.visibility}
      data-boundary={environment.boundary}
      data-density={environment.density}
      data-symmetry={environment.symmetry}
      data-connectivity={environment.connectivity}
      data-brightness={environment.brightness}
      data-position={environment.position}
    >
      <Renderer environment={environment} idScope={idScope} />
    </g>
  );
}
