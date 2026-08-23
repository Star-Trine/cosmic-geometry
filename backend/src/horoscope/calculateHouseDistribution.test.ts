import assert from "node:assert/strict";
import test from "node:test";

import { calculateHouseDistribution } from "./calculateHouseDistribution.js";
import type { PlanetData, PlanetId } from "./types.js";

const planetIds: PlanetId[] = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

const createPlanets = (houses: Array<number | null>): PlanetData[] =>
  planetIds.map((id, index) => ({
    id,
    name: id,
    longitude: index * 30,
    sign: "aries",
    degreeInSign: 0,
    house: houses[index] ?? null,
    retrograde: false,
  }));

test("creates all twelve houses, including empty and shared houses", () => {
  const distribution = calculateHouseDistribution(
    createPlanets([1, 1, 3, 3, 3, 6, 8, 10, 10, 12]),
  );

  assert.ok(distribution);
  assert.equal(distribution.length, 12);
  assert.deepEqual(distribution[0], { house: 1, count: 2 });
  assert.deepEqual(distribution[1], { house: 2, count: 0 });
  assert.deepEqual(distribution[2], { house: 3, count: 3 });
  assert.deepEqual(distribution[9], { house: 10, count: 2 });
  assert.equal(
    distribution.reduce((sum, entry) => sum + entry.count, 0),
    10,
  );
});

test("returns null rather than a zero distribution when houses are unknown", () => {
  const distribution = calculateHouseDistribution(
    createPlanets(Array.from({ length: 10 }, () => null)),
  );

  assert.equal(distribution, null);
});

test("returns null when even one planet house is unknown", () => {
  const distribution = calculateHouseDistribution(
    createPlanets([1, 2, 3, 4, 5, 6, 7, 8, 9, null]),
  );

  assert.equal(distribution, null);
});

test("rejects a house outside the valid range", () => {
  assert.throws(
    () =>
      calculateHouseDistribution(
        createPlanets([0, 1, 2, 3, 4, 5, 6, 7, 8, 13]),
      ),
    /invalid house/,
  );
});
