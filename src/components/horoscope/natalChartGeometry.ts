import type {
  AspectData,
  HouseData,
  PlanetData,
  PlanetId,
} from '../../data/horoscope/types';

export type Point = {
  x: number;
  y: number;
};

export type PlanetRadialPlacement = {
  planet: PlanetData;
  radius: number;
  clusterIndex: number;
  clusterSize: number;
  laneIndex: number;
};

export type HouseSegment = {
  house: number;
  cuspLongitude: number;
  width: number;
  midpointLongitude: number;
};

export type LineSegment = {
  start: Point;
  end: Point;
};

export type AspectLineGeometry = LineSegment & {
  aspect: AspectData;
  isLocal: boolean;
};

export const normalizeDegrees = (degrees: number) =>
  ((degrees % 360) + 360) % 360;

export const longitudeToScreenAngle = (
  longitude: number,
  referenceLongitude: number,
) => normalizeDegrees(180 - (longitude - referenceLongitude));

export const polarPoint = (
  center: number,
  radius: number,
  longitude: number,
  referenceLongitude: number,
): Point => {
  const screenAngle = longitudeToScreenAngle(longitude, referenceLongitude);
  const radians = (screenAngle * Math.PI) / 180;

  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
};

export const shortestAngularDistance = (
  longitudeA: number,
  longitudeB: number,
) => {
  const difference = Math.abs(longitudeA - longitudeB);
  return Math.min(difference, 360 - difference);
};

export const forwardAngularDistance = (
  startLongitude: number,
  endLongitude: number,
) => normalizeDegrees(endLongitude - startLongitude);

export const circularMidpoint = (
  startLongitude: number,
  endLongitude: number,
) => normalizeDegrees(
  startLongitude + forwardAngularDistance(startLongitude, endLongitude) / 2,
);

export const createHouseSegments = (houses: HouseData[]): HouseSegment[] =>
  houses.map((house, index) => {
    const nextHouse = houses[(index + 1) % houses.length];
    if (!nextHouse) {
      return {
        house: house.house,
        cuspLongitude: house.cuspLongitude,
        width: 0,
        midpointLongitude: house.cuspLongitude,
      };
    }

    return {
      house: house.house,
      cuspLongitude: house.cuspLongitude,
      width: forwardAngularDistance(
        house.cuspLongitude,
        nextHouse.cuspLongitude,
      ),
      midpointLongitude: circularMidpoint(
        house.cuspLongitude,
        nextHouse.cuspLongitude,
      ),
    };
  });

export const createProximityClusters = (
  planets: PlanetData[],
  thresholdDegrees = 5,
): PlanetData[][] => {
  const adjacent = new Map<PlanetId, PlanetId[]>(
    planets.map((planet) => [planet.id, []]),
  );

  for (let firstIndex = 0; firstIndex < planets.length; firstIndex += 1) {
    const first = planets[firstIndex];
    if (!first) continue;

    for (
      let secondIndex = firstIndex + 1;
      secondIndex < planets.length;
      secondIndex += 1
    ) {
      const second = planets[secondIndex];
      if (!second) continue;

      if (
        shortestAngularDistance(first.longitude, second.longitude) <=
        thresholdDegrees
      ) {
        adjacent.get(first.id)?.push(second.id);
        adjacent.get(second.id)?.push(first.id);
      }
    }
  }

  const planetById = new Map(planets.map((planet) => [planet.id, planet]));
  const visited = new Set<PlanetId>();
  const clusters: PlanetData[][] = [];

  for (const planet of planets) {
    if (visited.has(planet.id)) continue;

    const pending = [planet.id];
    const clusterIds = new Set<PlanetId>();
    visited.add(planet.id);

    while (pending.length > 0) {
      const currentId = pending.shift();
      if (!currentId) continue;
      clusterIds.add(currentId);

      for (const neighborId of adjacent.get(currentId) ?? []) {
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          pending.push(neighborId);
        }
      }
    }

    clusters.push(
      planets.filter((candidate) => clusterIds.has(candidate.id)),
    );
  }

  return clusters.map((cluster) =>
    cluster.filter((planet) => planetById.has(planet.id)),
  );
};

export const createPlanetRadialPlacements = (
  planets: PlanetData[],
  baseRadius: number,
  laneStep: number,
  thresholdDegrees = 5,
): PlanetRadialPlacement[] => {
  const laneByPlanet = new Map<
    PlanetId,
    Omit<PlanetRadialPlacement, 'planet'>
  >();

  createProximityClusters(planets, thresholdDegrees).forEach(
    (cluster, clusterIndex) => {
      const centerLane = (cluster.length - 1) / 2;

      cluster.forEach((planet, laneIndex) => {
        laneByPlanet.set(planet.id, {
          radius: baseRadius + (centerLane - laneIndex) * laneStep,
          clusterIndex,
          clusterSize: cluster.length,
          laneIndex,
        });
      });
    },
  );

  return planets.map((planet) => ({
    planet,
    ...(laneByPlanet.get(planet.id) ?? {
      radius: baseRadius,
      clusterIndex: 0,
      clusterSize: 1,
      laneIndex: 0,
    }),
  }));
};

export const trimLineSegment = (
  start: Point,
  end: Point,
  inset: number,
): LineSegment => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const length = Math.hypot(deltaX, deltaY);

  if (length === 0) return { start, end };

  const appliedInset = Math.min(Math.max(inset, 0), length / 2);
  const unitX = deltaX / length;
  const unitY = deltaY / length;

  return {
    start: {
      x: start.x + unitX * appliedInset,
      y: start.y + unitY * appliedInset,
    },
    end: {
      x: end.x - unitX * appliedInset,
      y: end.y - unitY * appliedInset,
    },
  };
};

export const createAspectLineGeometries = (
  aspects: AspectData[],
  placements: PlanetRadialPlacement[],
  center: number,
  referenceLongitude: number,
  connectionRadius: number,
  conjunctionInset: number,
): AspectLineGeometry[] => {
  const placementsById = new Map(
    placements.map((placement) => [placement.planet.id, placement]),
  );

  return aspects.flatMap<AspectLineGeometry>((aspect): AspectLineGeometry[] => {
    const placementA = placementsById.get(aspect.bodyA);
    const placementB = placementsById.get(aspect.bodyB);
    if (!placementA || !placementB) return [];

    if (aspect.type === 'conjunction') {
      const localLine = trimLineSegment(
        polarPoint(
          center,
          placementA.radius,
          placementA.planet.longitude,
          referenceLongitude,
        ),
        polarPoint(
          center,
          placementB.radius,
          placementB.planet.longitude,
          referenceLongitude,
        ),
        conjunctionInset,
      );

      return [{ aspect, ...localLine, isLocal: true }];
    }

    return [{
      aspect,
      start: polarPoint(
        center,
        connectionRadius,
        placementA.planet.longitude,
        referenceLongitude,
      ),
      end: polarPoint(
        center,
        connectionRadius,
        placementB.planet.longitude,
        referenceLongitude,
      ),
      isLocal: false,
    }];
  });
};
