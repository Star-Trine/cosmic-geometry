import assert from "node:assert/strict";
import test from "node:test";

import { calculatePlanetDistribution } from "./calculatePlanetDistribution.js";
import type {
  PlanetData,
  PlanetId,
  ZodiacSignId,
} from "./types.js";

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

const createPlanets = (
  signs: ZodiacSignId[],
  house: number | null,
): PlanetData[] =>
  planetIds.map((id, index) => ({
    id,
    name: id,
    longitude: index * 30,
    sign: signs[index] ?? "aries",
    degreeInSign: 0,
    house,
    retrograde: false,
  }));

const distributedSigns: ZodiacSignId[] = [
  "aries",
  "aries",
  "aries",
  "taurus",
  "taurus",
  "gemini",
  "leo",
  "scorpio",
  "scorpio",
  "pisces",
];

test("creates all twelve signs, including empty and shared signs", () => {
  const distribution = calculatePlanetDistribution(
    createPlanets(distributedSigns, 1),
  );

  assert.equal(distribution.length, 12);
  assert.deepEqual(distribution[0], { sign: "aries", count: 3 });
  assert.deepEqual(distribution[1], { sign: "taurus", count: 2 });
  assert.deepEqual(distribution[3], { sign: "cancer", count: 0 });
  assert.deepEqual(distribution[11], { sign: "pisces", count: 1 });
  assert.equal(
    distribution.reduce((sum, entry) => sum + entry.count, 0),
    10,
  );
});

test("produces the same distribution when birth time and houses are unknown", () => {
  const knownTime = calculatePlanetDistribution(
    createPlanets(distributedSigns, 1),
  );
  const unknownTime = calculatePlanetDistribution(
    createPlanets(distributedSigns, null),
  );

  assert.deepEqual(unknownTime, knownTime);
});

test("rejects an unsupported sign at runtime", () => {
  const planets = createPlanets(distributedSigns, 1);
  const firstPlanet = planets[0];
  assert.ok(firstPlanet);
  firstPlanet.sign = "ophiuchus" as ZodiacSignId;

  assert.throws(
    () => calculatePlanetDistribution(planets),
    /unsupported sign: ophiuchus/,
  );
});
