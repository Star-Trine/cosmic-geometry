import assert from "node:assert/strict";
import test from "node:test";

import { calculateAspects } from "../horoscope/calculateAspects.js";
import type { PlanetData } from "../horoscope/types.js";
import { normalizeFreeAstroNatalResponse } from "./normalizeNatalResponse.js";

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

const longitudes = [0, 5, 60, 185, 33, 77, 101, 144, 222, 301];

const createFixture = (): Record<string, unknown> => ({
  subject: {
    datetime: "1995-09-12T14:30:00+09:00",
    location: {
      city: "Tokyo",
      lat: 35.6762,
      lng: 139.6503,
      timezone: "Asia/Tokyo",
    },
    settings: {
      house_system: "placidus",
      zodiac_type: "Tropical",
      time_known: true,
    },
  },
  planets: [
    ...planetIds.map((id, index) => ({
      id,
      name: id[0]?.toUpperCase() + id.slice(1),
      sign: "Ari",
      sign_id: "aries",
      pos: (longitudes[index] ?? 0) % 30,
      abs_pos: longitudes[index],
      retrograde: false,
      house: (index % 12) + 1,
      declination_deg: 0,
    })),
    {
      id: "north_node",
      name: "North Node",
      sign_id: "libra",
      pos: 1,
      abs_pos: 181,
      retrograde: true,
      house: 7,
      variant: "mean",
    },
  ],
  houses: Array.from({ length: 12 }, (_, index) => ({
    house: index + 1,
    name: String(index + 1),
    sign_id: "aries",
    pos: 0,
    abs_pos: index * 30,
  })),
  angles: { asc: 0, mc: 90, dc: 180, ic: 270, vertex: 45 },
  angles_details: {
    asc: { sign_id: "aries", pos: 0, abs_pos: 0, house: 1 },
    mc: { sign_id: "cancer", pos: 0, abs_pos: 90, house: 10 },
    dc: { sign_id: "libra", pos: 0, abs_pos: 180, house: 7 },
    ic: { sign_id: "capricorn", pos: 0, abs_pos: 270, house: 4 },
    vertex: { sign_id: "taurus", pos: 15, abs_pos: 45, house: 2 },
  },
  aspects: [{ p1: "not", p2: "used", type: "square", orb: 99 }],
  aspects_summary: { total: 1 },
  confidence: { overall: "high" },
});

test("normalizes the API boundary and excludes API-only bodies and fields", () => {
  const horoscope = normalizeFreeAstroNatalResponse(createFixture());

  assert.equal(horoscope.birth.houseSystem, "placidus");
  assert.equal(horoscope.birth.zodiacType, "tropical");
  assert.equal(horoscope.birth.date, "1995-09-12");
  assert.equal(horoscope.birth.time, "14:30");
  assert.deepEqual(
    horoscope.planets.map((planet) => planet.id),
    planetIds,
  );
  assert.equal(horoscope.planets.length, 10);
  assert.ok(horoscope.houses);
  assert.deepEqual(horoscope.houses[0], {
    house: 1,
    cuspLongitude: 0,
  });
  assert.ok(horoscope.angles);
  assert.deepEqual(
    horoscope.angles.map((angle) => angle.name),
    ["ASC", "MC", "DSC", "IC"],
  );
  assert.equal(
    horoscope.aspects.some((aspect) => aspect.bodyA === ("not" as never)),
    false,
  );
});

test("normalizes an unknown-time response without treating API noon as birth time", () => {
  const fixture = createFixture() as {
    subject: {
      datetime: string;
      settings: { time_known: boolean };
    };
    planets: Array<Record<string, unknown>>;
    houses?: unknown;
    angles?: unknown;
    angles_details?: unknown;
  };
  fixture.subject.datetime = "1995-09-12T12:00:00+09:00";
  fixture.subject.settings.time_known = false;
  for (const planet of fixture.planets) {
    delete planet.house;
  }
  delete fixture.houses;
  delete fixture.angles;
  delete fixture.angles_details;

  const horoscope = normalizeFreeAstroNatalResponse(fixture);

  assert.deepEqual(horoscope.birth, {
    date: "1995-09-12",
    time: null,
    timeKnown: false,
    city: "Tokyo",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
    houseSystem: "placidus",
    zodiacType: "tropical",
  });
  assert.equal(horoscope.planets.length, 10);
  assert.ok(horoscope.planets.every((planet) => planet.house === null));
  assert.equal(horoscope.houses, null);
  assert.equal(horoscope.angles, null);
  assert.ok(horoscope.aspects.length > 0);
});

test("calculates each pair once, includes a five-degree orb, and keeps the actual angle", () => {
  const planets: PlanetData[] = [
    {
      id: "sun",
      name: "Sun",
      longitude: 358,
      sign: "pisces",
      degreeInSign: 28,
      house: 1,
      retrograde: false,
    },
    {
      id: "moon",
      name: "Moon",
      longitude: 3,
      sign: "aries",
      degreeInSign: 3,
      house: 1,
      retrograde: false,
    },
    {
      id: "mars",
      name: "Mars",
      longitude: 118,
      sign: "cancer",
      degreeInSign: 28,
      house: 5,
      retrograde: false,
    },
  ];

  const aspects = calculateAspects(planets);

  assert.deepEqual(aspects, [
    {
      bodyA: "sun",
      bodyB: "moon",
      type: "conjunction",
      angle: 5,
      orb: 5,
    },
    {
      bodyA: "sun",
      bodyB: "mars",
      type: "trine",
      angle: 120,
      orb: 0,
    },
    {
      bodyA: "moon",
      bodyB: "mars",
      type: "trine",
      angle: 115,
      orb: 5,
    },
  ]);
});

test("rejects a response when a required planet is missing", () => {
  const fixture = createFixture();
  const planets = fixture.planets;
  assert.ok(Array.isArray(planets));
  fixture.planets = planets.filter(
    (planet) =>
      typeof planet !== "object" ||
      planet === null ||
      !("id" in planet) ||
      planet.id !== "pluto",
  );

  assert.throws(
    () => normalizeFreeAstroNatalResponse(fixture),
    /exactly one pluto/,
  );
});

test("rejects invalid longitude, house number, and sign_id values", () => {
  const invalidLongitude = createFixture();
  const longitudePlanets = invalidLongitude.planets;
  assert.ok(Array.isArray(longitudePlanets));
  assert.ok(typeof longitudePlanets[0] === "object" && longitudePlanets[0]);
  longitudePlanets[0].abs_pos = 360;
  assert.throws(
    () => normalizeFreeAstroNatalResponse(invalidLongitude),
    /planets\[0\]\.abs_pos/,
  );

  const invalidHouse = createFixture();
  const houses = invalidHouse.houses;
  assert.ok(Array.isArray(houses));
  assert.ok(typeof houses[0] === "object" && houses[0]);
  houses[0].house = 13;
  assert.throws(
    () => normalizeFreeAstroNatalResponse(invalidHouse),
    /houses\[0\]\.house/,
  );

  const invalidSign = createFixture();
  const signPlanets = invalidSign.planets;
  assert.ok(Array.isArray(signPlanets));
  assert.ok(typeof signPlanets[0] === "object" && signPlanets[0]);
  signPlanets[0].sign_id = "ophiuchus";
  assert.throws(
    () => normalizeFreeAstroNatalResponse(invalidSign),
    /unsupported sign_id/,
  );
});
