import type {
  AnglePoint,
  AspectData,
  HouseData,
  PlanetData,
  PlanetId,
} from '../../data/horoscope/types';
import {
  createAspectLineGeometries,
  createHouseSegments,
  createPlanetRadialPlacements,
  polarPoint,
} from './natalChartGeometry';

const CHART_SIZE = 500;
const CHART_CENTER = CHART_SIZE / 2;
const OUTER_RADIUS = 220;
const ZODIAC_INNER_RADIUS = 170;
const ZODIAC_SECTIONS = 12;
const DEGREES_PER_SECTION = 360 / ZODIAC_SECTIONS;
const ZODIAC_SYMBOL_RADIUS = (OUTER_RADIUS + ZODIAC_INNER_RADIUS) / 2;
const PLANET_BASE_RADIUS = OUTER_RADIUS * 0.645;
const PLANET_LANE_STEP = OUTER_RADIUS * 0.064;
const PLANET_CLUSTER_THRESHOLD = 5;
const HOUSE_CUSP_INNER_RADIUS = OUTER_RADIUS * 0.118;
const HOUSE_CUSP_OUTER_RADIUS = ZODIAC_INNER_RADIUS;
const HOUSE_NUMBER_RADIUS = OUTER_RADIUS * 0.455;
const ANGLE_LINE_INNER_RADIUS = HOUSE_CUSP_INNER_RADIUS;
const ANGLE_LINE_OUTER_RADIUS = ZODIAC_INNER_RADIUS;
const ANGLE_LABEL_RADIUS = OUTER_RADIUS * 0.99;
const ASPECT_CONNECTION_RADIUS = OUTER_RADIUS * 0.5;
const CONJUNCTION_SYMBOL_INSET = OUTER_RADIUS * 0.025;

const ZODIAC_SIGNS = [
  { id: 'aries', symbol: '♈', centerLongitude: 15 },
  { id: 'taurus', symbol: '♉', centerLongitude: 45 },
  { id: 'gemini', symbol: '♊', centerLongitude: 75 },
  { id: 'cancer', symbol: '♋', centerLongitude: 105 },
  { id: 'leo', symbol: '♌', centerLongitude: 135 },
  { id: 'virgo', symbol: '♍', centerLongitude: 165 },
  { id: 'libra', symbol: '♎', centerLongitude: 195 },
  { id: 'scorpio', symbol: '♏', centerLongitude: 225 },
  { id: 'sagittarius', symbol: '♐', centerLongitude: 255 },
  { id: 'capricorn', symbol: '♑', centerLongitude: 285 },
  { id: 'aquarius', symbol: '♒', centerLongitude: 315 },
  { id: 'pisces', symbol: '♓', centerLongitude: 345 },
] as const;

const PLANET_SYMBOLS: Record<PlanetId, string> = {
  sun: '☉',
  moon: '☽',
  mercury: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
  uranus: '♅',
  neptune: '♆',
  pluto: '♇',
};

type Props = {
  ascLongitude: number | null;
  angles: AnglePoint[] | null;
  aspects: AspectData[];
  houses: HouseData[] | null;
  planets: PlanetData[];
};

export default function NatalChart({
  ascLongitude,
  angles,
  aspects,
  houses,
  planets,
}: Props) {
  // Partial（および生成前）はAries 0°を基準とし、ASCを要求しない。
  const referenceLongitude = ascLongitude ?? 0;
  const zodiacDividers = Array.from({ length: ZODIAC_SECTIONS }, (_, index) => {
    const longitude = index * DEGREES_PER_SECTION;
    const innerPoint = polarPoint(
      CHART_CENTER,
      ZODIAC_INNER_RADIUS,
      longitude,
      referenceLongitude,
    );
    const outerPoint = polarPoint(
      CHART_CENTER,
      OUTER_RADIUS,
      longitude,
      referenceLongitude,
    );

    return {
      longitude,
      x1: innerPoint.x,
      y1: innerPoint.y,
      x2: outerPoint.x,
      y2: outerPoint.y,
    };
  });
  const planetPlacements = createPlanetRadialPlacements(
    planets,
    PLANET_BASE_RADIUS,
    PLANET_LANE_STEP,
    PLANET_CLUSTER_THRESHOLD,
  );
  const houseSegments = houses === null ? [] : createHouseSegments(houses);
  const aspectLines = createAspectLineGeometries(
    aspects,
    planetPlacements,
    CHART_CENTER,
    referenceLongitude,
    ASPECT_CONNECTION_RADIUS,
    CONJUNCTION_SYMBOL_INSET,
  );

  return (
    <section className="horoscope-natal-chart">
      <h2>Natal Chart</h2>

      <svg
        className="horoscope-natal-chart__svg"
        aria-labelledby="natal-chart-title natal-chart-description"
        viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
        width="100%"
        role="img"
      >
        <title id="natal-chart-title">Natal chart base grid</title>
        <desc id="natal-chart-description">
          A circular zodiac ring divided into twelve equal sections and oriented by the chart reference longitude.
        </desc>

        <g id="natal-chart-base-layer" className="natal-chart-base-layer">
          <circle
            className="natal-chart-base-layer__field"
            cx={CHART_CENTER}
            cy={CHART_CENTER}
            r={OUTER_RADIUS}
          />
          <circle
            className="natal-chart-base-layer__outer-circle"
            cx={CHART_CENTER}
            cy={CHART_CENTER}
            r={OUTER_RADIUS}
          />
          <circle
            className="natal-chart-base-layer__inner-circle"
            cx={CHART_CENTER}
            cy={CHART_CENTER}
            r={ZODIAC_INNER_RADIUS}
          />
          <g className="natal-chart-base-layer__zodiac-dividers">
            {zodiacDividers.map((line) => (
              <line
                key={line.longitude}
                data-longitude={line.longitude}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
              />
            ))}
          </g>
        </g>

        <g id="zodiac-symbol-layer" className="zodiac-symbol-layer">
          {ZODIAC_SIGNS.map((sign) => {
            const point = polarPoint(
              CHART_CENTER,
              ZODIAC_SYMBOL_RADIUS,
              sign.centerLongitude,
              referenceLongitude,
            );

            return (
              <text
                key={sign.id}
                className="zodiac-symbol-layer__symbol"
                data-sign={sign.id}
                data-longitude={sign.centerLongitude}
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {sign.symbol}
              </text>
            );
          })}
        </g>

        {houses !== null && (
          <g id="house-layer" className="house-layer">
            <g className="house-layer__cusps">
              {houseSegments.map((segment) => {
                const innerPoint = polarPoint(
                  CHART_CENTER,
                  HOUSE_CUSP_INNER_RADIUS,
                  segment.cuspLongitude,
                  referenceLongitude,
                );
                const outerPoint = polarPoint(
                  CHART_CENTER,
                  HOUSE_CUSP_OUTER_RADIUS,
                  segment.cuspLongitude,
                  referenceLongitude,
                );

                return (
                  <line
                    key={segment.house}
                    data-house={segment.house}
                    data-longitude={segment.cuspLongitude}
                    x1={innerPoint.x}
                    y1={innerPoint.y}
                    x2={outerPoint.x}
                    y2={outerPoint.y}
                  />
                );
              })}
            </g>

            <g className="house-layer__numbers">
              {houseSegments.map((segment) => {
                const point = polarPoint(
                  CHART_CENTER,
                  HOUSE_NUMBER_RADIUS,
                  segment.midpointLongitude,
                  referenceLongitude,
                );

                return (
                  <text
                    key={segment.house}
                    data-house={segment.house}
                    data-midpoint-longitude={segment.midpointLongitude}
                    x={point.x}
                    y={point.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {segment.house}
                  </text>
                );
              })}
            </g>
          </g>
        )}

        {angles !== null && (
          <g id="angle-layer" className="angle-layer">
            <g className="angle-layer__lines">
              {angles.map((angle) => {
                const innerPoint = polarPoint(
                  CHART_CENTER,
                  ANGLE_LINE_INNER_RADIUS,
                  angle.longitude,
                  referenceLongitude,
                );
                const outerPoint = polarPoint(
                  CHART_CENTER,
                  ANGLE_LINE_OUTER_RADIUS,
                  angle.longitude,
                  referenceLongitude,
                );

                return (
                  <line
                    key={angle.name}
                    data-angle={angle.name}
                    data-longitude={angle.longitude}
                    x1={innerPoint.x}
                    y1={innerPoint.y}
                    x2={outerPoint.x}
                    y2={outerPoint.y}
                  />
                );
              })}
            </g>

            <g className="angle-layer__labels">
              {angles.map((angle) => {
                const point = polarPoint(
                  CHART_CENTER,
                  ANGLE_LABEL_RADIUS,
                  angle.longitude,
                  referenceLongitude,
                );

                return (
                  <text
                    key={angle.name}
                    data-angle={angle.name}
                    data-longitude={angle.longitude}
                    x={point.x}
                    y={point.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {angle.name}
                  </text>
                );
              })}
            </g>
          </g>
        )}

        <g id="aspect-layer" className="aspect-layer">
          <g className="aspect-layer__major">
            {aspectLines.filter((line) => !line.isLocal).map((line) => (
              <line
                key={`${line.aspect.bodyA}-${line.aspect.bodyB}`}
                className={`aspect-layer__line aspect--${line.aspect.type}`}
                data-body-a={line.aspect.bodyA}
                data-body-b={line.aspect.bodyB}
                data-aspect={line.aspect.type}
                data-angle={line.aspect.angle}
                data-orb={line.aspect.orb}
                x1={line.start.x}
                y1={line.start.y}
                x2={line.end.x}
                y2={line.end.y}
              />
            ))}
          </g>

          <g className="aspect-layer__conjunctions">
            {aspectLines.filter((line) => line.isLocal).map((line) => (
              <line
                key={`${line.aspect.bodyA}-${line.aspect.bodyB}`}
                className="aspect-layer__line aspect--conjunction"
                data-body-a={line.aspect.bodyA}
                data-body-b={line.aspect.bodyB}
                data-aspect={line.aspect.type}
                data-angle={line.aspect.angle}
                data-orb={line.aspect.orb}
                x1={line.start.x}
                y1={line.start.y}
                x2={line.end.x}
                y2={line.end.y}
              />
            ))}
          </g>
        </g>

        <g id="planet-layer" className="planet-layer">
          {planetPlacements.map((placement) => {
            const { planet, radius, clusterIndex, clusterSize, laneIndex } = placement;
            const point = polarPoint(
              CHART_CENTER,
              radius,
              planet.longitude,
              referenceLongitude,
            );

            return (
              <text
                key={planet.id}
                className={`planet-layer__symbol${planet.retrograde ? ' is-retrograde' : ''}`}
                data-planet={planet.id}
                data-longitude={planet.longitude}
                data-radius={radius}
                data-cluster={clusterIndex}
                data-cluster-size={clusterSize}
                data-lane={laneIndex}
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="central"
                aria-label={`${planet.name}${planet.retrograde ? ', retrograde' : ''}`}
              >
                {PLANET_SYMBOLS[planet.id]}
              </text>
            );
          })}
        </g>
      </svg>
    </section>
  );
}
