import assert from "node:assert/strict";
import test from "node:test";

import { calculateBasicAnalysis } from "./calculateBasicAnalysis.js";
import type { PlanetData, ZodiacSignId } from "./types.js";

const signs: ZodiacSignId[] = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
];

const planetIds = [
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
] as const;

const createPlanets = (house: number | null): PlanetData[] =>
  planetIds.map((id, index) => ({
    id,
    name: id,
    longitude: index * 30,
    sign: signs[index] ?? "aries",
    degreeInSign: 0,
    house,
    retrograde: false,
  }));

test("counts polarity, modalities, and elements with one vote per planet", () => {
  const analysis = calculateBasicAnalysis(createPlanets(1));

  assert.deepEqual(analysis, {
    polarity: { masculine: 5, feminine: 5 },
    modalities: { cardinal: 4, fixed: 3, mutable: 3 },
    elements: { fire: 3, earth: 3, air: 2, water: 2 },
    planetDistribution: [
      { sign: "aries", count: 1 },
      { sign: "taurus", count: 1 },
      { sign: "gemini", count: 1 },
      { sign: "cancer", count: 1 },
      { sign: "leo", count: 1 },
      { sign: "virgo", count: 1 },
      { sign: "libra", count: 1 },
      { sign: "scorpio", count: 1 },
      { sign: "sagittarius", count: 1 },
      { sign: "capricorn", count: 1 },
      { sign: "aquarius", count: 0 },
      { sign: "pisces", count: 0 },
    ],
    houseDistribution: [
      { house: 1, count: 10 },
      { house: 2, count: 0 },
      { house: 3, count: 0 },
      { house: 4, count: 0 },
      { house: 5, count: 0 },
      { house: 6, count: 0 },
      { house: 7, count: 0 },
      { house: 8, count: 0 },
      { house: 9, count: 0 },
      { house: 10, count: 0 },
      { house: 11, count: 0 },
      { house: 12, count: 0 },
    ],
  });
  assert.equal(
    analysis.polarity.masculine + analysis.polarity.feminine,
    10,
  );
  assert.equal(
    analysis.modalities.cardinal +
      analysis.modalities.fixed +
      analysis.modalities.mutable,
    10,
  );
  assert.equal(
    analysis.elements.fire +
      analysis.elements.earth +
      analysis.elements.air +
      analysis.elements.water,
    10,
  );
});

test("produces the same classifications when birth time and houses are unknown", () => {
  const knownTime = calculateBasicAnalysis(createPlanets(1));
  const unknownTime = calculateBasicAnalysis(createPlanets(null));

  assert.deepEqual(unknownTime.polarity, knownTime.polarity);
  assert.deepEqual(unknownTime.modalities, knownTime.modalities);
  assert.deepEqual(unknownTime.elements, knownTime.elements);
  assert.deepEqual(
    unknownTime.planetDistribution,
    knownTime.planetDistribution,
  );
  assert.equal(unknownTime.houseDistribution, null);
});

test("rejects an unsupported sign at runtime", () => {
  const planets = createPlanets(1);
  const firstPlanet = planets[0];
  assert.ok(firstPlanet);
  firstPlanet.sign = "ophiuchus" as ZodiacSignId;

  assert.throws(
    () => calculateBasicAnalysis(planets),
    /unsupported sign: ophiuchus/,
  );
});

test("rejects an incomplete or duplicated major-planet set", () => {
  const incomplete = createPlanets(1).slice(0, 9);
  assert.throws(
    () => calculateBasicAnalysis(incomplete),
    /requires 10 planets/,
  );

  const duplicated = createPlanets(1);
  const lastPlanet = duplicated[9];
  assert.ok(lastPlanet);
  lastPlanet.id = "sun";
  assert.throws(
    () => calculateBasicAnalysis(duplicated),
    /duplicate planet: sun/,
  );
});
