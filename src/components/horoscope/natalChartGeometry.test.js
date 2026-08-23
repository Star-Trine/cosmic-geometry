import {
  circularMidpoint,
  createAspectLineGeometries,
  createHouseSegments,
  createPlanetRadialPlacements,
  createProximityClusters,
  forwardAngularDistance,
  shortestAngularDistance,
  trimLineSegment,
} from './natalChartGeometry';

const planet = (id, longitude) => ({
  id,
  name: id,
  longitude,
  sign: 'aries',
  degreeInSign: longitude % 30,
  house: null,
  retrograde: false,
});

test('uses the shortest circular distance across the 360 degree boundary', () => {
  expect(shortestAngularDistance(358, 2)).toBe(4);
  expect(createProximityClusters([
    planet('sun', 358),
    planet('moon', 2),
  ])).toHaveLength(1);
});

test('includes the five degree boundary', () => {
  const clusters = createProximityClusters([
    planet('sun', 10),
    planet('moon', 15),
  ]);

  expect(clusters[0].map(({ id }) => id)).toEqual(['sun', 'moon']);
});

test('treats chained neighbors as one connected cluster', () => {
  const clusters = createProximityClusters([
    planet('sun', 10),
    planet('moon', 14),
    planet('mercury', 18),
  ]);

  expect(clusters).toHaveLength(1);
  expect(clusters[0]).toHaveLength(3);
});

test('assigns four radial lanes without changing longitude', () => {
  const planets = [
    planet('sun', 10),
    planet('moon', 12),
    planet('mercury', 14),
    planet('venus', 16),
  ];
  const placements = createPlanetRadialPlacements(planets, 142, 14);

  expect(new Set(placements.map(({ radius }) => radius)).size).toBe(4);
  expect(placements.map(({ planet: item }) => item.longitude)).toEqual(
    planets.map(({ longitude }) => longitude),
  );
});

test('measures a house arc forward across the 360 degree boundary', () => {
  expect(forwardAngularDistance(350, 10)).toBe(20);
  expect(circularMidpoint(350, 10)).toBe(0);
});

test('creates house widths and midpoints from adjacent cusps', () => {
  const houses = [
    { house: 1, cuspLongitude: 350 },
    { house: 2, cuspLongitude: 10 },
    { house: 3, cuspLongitude: 40 },
  ];
  const segments = createHouseSegments(houses);

  expect(segments[0]).toMatchObject({
    house: 1,
    width: 20,
    midpointLongitude: 0,
  });
  expect(segments[1]).toMatchObject({
    house: 2,
    width: 30,
    midpointLongitude: 25,
  });
  expect(segments[2]).toMatchObject({
    house: 3,
    width: 310,
    midpointLongitude: 195,
  });
});

test('uses a shared inner radius for non-conjunction aspect endpoints', () => {
  const planets = [planet('sun', 0), planet('moon', 120)];
  const placements = createPlanetRadialPlacements(planets, 142, 14);
  const [line] = createAspectLineGeometries(
    [{ bodyA: 'sun', bodyB: 'moon', type: 'trine', angle: 120, orb: 0 }],
    placements,
    250,
    0,
    110,
    5.5,
  );

  expect(Math.hypot(line.start.x - 250, line.start.y - 250)).toBeCloseTo(110);
  expect(Math.hypot(line.end.x - 250, line.end.y - 250)).toBeCloseTo(110);
  expect(line.isLocal).toBe(false);
});

test('builds a trimmed local conjunction line from radial planet lanes', () => {
  const planets = [planet('sun', 358), planet('moon', 2)];
  const placements = createPlanetRadialPlacements(planets, 142, 14);
  const [line] = createAspectLineGeometries(
    [{ bodyA: 'sun', bodyB: 'moon', type: 'conjunction', angle: 4, orb: 4 }],
    placements,
    250,
    0,
    110,
    5.5,
  );

  expect(line.isLocal).toBe(true);
  expect(Math.hypot(line.end.x - line.start.x, line.end.y - line.start.y))
    .toBeLessThan(14);
});

test('trims both ends without reversing a short line', () => {
  expect(trimLineSegment({ x: 0, y: 0 }, { x: 10, y: 0 }, 8)).toEqual({
    start: { x: 5, y: 0 },
    end: { x: 5, y: 0 },
  });
});
