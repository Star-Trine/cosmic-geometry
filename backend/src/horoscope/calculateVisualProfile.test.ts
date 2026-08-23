import assert from "node:assert/strict";
import test from "node:test";

import type { HoroscopeAnalysis } from "./analysisTypes.js";
import { calculateVisualProfile } from "./calculateVisualProfile.js";
import type {
  AspectData,
  HoroscopeData,
  PlanetData,
  PlanetId,
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

const createPlanets = (houseKnown: boolean): PlanetData[] =>
  planetIds.map((id, index) => ({
    id,
    name: id,
    longitude: index * 30,
    sign: index % 2 === 0 ? "aries" : "taurus",
    degreeInSign: 0,
    house: houseKnown ? (index % 12) + 1 : null,
    retrograde: id === "saturn",
  }));

const aspects: AspectData[] = [
  {
    bodyA: "sun",
    bodyB: "moon",
    type: "conjunction",
    angle: 0,
    orb: 0,
  },
  {
    bodyA: "mercury",
    bodyB: "venus",
    type: "sextile",
    angle: 62.5,
    orb: 2.5,
  },
  {
    bodyA: "mars",
    bodyB: "jupiter",
    type: "square",
    angle: 95,
    orb: 5,
  },
  {
    bodyA: "saturn",
    bodyB: "uranus",
    type: "trine",
    angle: 120,
    orb: -1,
  },
  {
    bodyA: "neptune",
    bodyB: "pluto",
    type: "opposition",
    angle: 174,
    orb: 6,
  },
];

const createHoroscope = (timeKnown: boolean): HoroscopeData => ({
  birth: {
    date: "1995-09-12",
    time: timeKnown ? "14:30" : null,
    timeKnown,
    city: "Tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
    houseSystem: "placidus",
    zodiacType: "tropical",
  },
  planets: createPlanets(timeKnown),
  houses: timeKnown
    ? Array.from({ length: 12 }, (_, index) => ({
        house: index + 1,
        cuspLongitude: index * 30,
      }))
    : null,
  angles: timeKnown
    ? [
        {
          name: "ASC",
          longitude: 0,
          sign: "aries",
          degreeInSign: 0,
        },
      ]
    : null,
  aspects,
});

const analysis: HoroscopeAnalysis = {
  polarity: { masculine: 7, feminine: 3 },
  modalities: { cardinal: 4, fixed: 3, mutable: 3 },
  elements: { fire: 3, earth: 2, air: 4, water: 1 },
  planetDistribution: [
    { sign: "aries", count: 5 },
    { sign: "taurus", count: 5 },
    { sign: "gemini", count: 0 },
    { sign: "cancer", count: 0 },
    { sign: "leo", count: 0 },
    { sign: "virgo", count: 0 },
    { sign: "libra", count: 0 },
    { sign: "scorpio", count: 0 },
    { sign: "sagittarius", count: 0 },
    { sign: "capricorn", count: 0 },
    { sign: "aquarius", count: 0 },
    { sign: "pisces", count: 0 },
  ],
  houseDistribution: null,
};

const sum = (values: number[]): number =>
  values.reduce((total, value) => total + value, 0);

test("creates normalized shared parameters for a full Visual Profile", () => {
  const profile = calculateVisualProfile(createHoroscope(true), analysis);

  assert.equal(profile.mode, "full");
  assert.deepEqual(profile.direction, { outward: 0.7, inward: 0.3 });
  assert.equal(
    sum([profile.motion.cardinal, profile.motion.fixed, profile.motion.mutable]),
    1,
  );
  assert.equal(
    sum([
      profile.palette.fire,
      profile.palette.earth,
      profile.palette.air,
      profile.palette.water,
    ]),
    1,
  );
  assert.equal(profile.houses?.length, 12);
  assert.equal(
    profile.planets.find((planet) => planet.planetId === "saturn")
      ?.retrograde,
    true,
  );
});

test("converts orb to clamped aspect strength", () => {
  const profile = calculateVisualProfile(createHoroscope(true), analysis);

  assert.deepEqual(
    profile.aspects.map((aspect) => aspect.strength),
    [1, 0.5, 0, 1, 0],
  );
  assert.ok(
    profile.aspects.every(
      (aspect) => aspect.strength >= 0 && aspect.strength <= 1,
    ),
  );
});

test("creates a partial profile without birth-time-dependent data", () => {
  const profile = calculateVisualProfile(createHoroscope(false), analysis);

  assert.equal(profile.mode, "partial");
  assert.equal(profile.houses, null);
  assert.ok(profile.planets.every((planet) => planet.house === null));
  assert.equal(profile.aspects.length, aspects.length);
});

test("rejects analysis counts that do not total ten", () => {
  const invalidAnalysis: HoroscopeAnalysis = {
    ...analysis,
    polarity: { masculine: 7, feminine: 2 },
  };

  assert.throws(
    () => calculateVisualProfile(createHoroscope(true), invalidAnalysis),
    /Polarity counts must total 10/,
  );
});
