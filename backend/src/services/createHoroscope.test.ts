import assert from "node:assert/strict";
import test from "node:test";

import type { HoroscopeRequest } from "../api/horoscopeApiTypes.js";
import { createHoroscope } from "./createHoroscope.js";

const request = (timeKnown: boolean): HoroscopeRequest => ({
  date: "1995-09-12",
  time: timeKnown ? "14:30" : null,
  timeKnown,
  place: {
    name: "Tokyo, Japan",
    city: "Tokyo",
    country: "Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
  },
});

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

const rawResponse = (timeKnown: boolean): Record<string, unknown> => {
  const response: Record<string, unknown> = {
    subject: {
      datetime: timeKnown
        ? "1995-09-12T14:30:00+09:00"
        : "1995-09-12T12:00:00+09:00",
      location: {
        city: "Tokyo",
        lat: 35.6762,
        lng: 139.6503,
        timezone: "Asia/Tokyo",
      },
      settings: {
        house_system: "placidus",
        zodiac_type: "Tropical",
        time_known: timeKnown,
      },
    },
    planets: planetIds.map((id, index) => ({
      id,
      name: id,
      sign_id: index % 2 === 0 ? "aries" : "taurus",
      pos: 0,
      abs_pos: index * 30,
      retrograde: id === "saturn",
      ...(timeKnown ? { house: (index % 12) + 1 } : {}),
    })),
  };

  if (timeKnown) {
    response.houses = Array.from({ length: 12 }, (_, index) => ({
      house: index + 1,
      abs_pos: index * 30,
    }));
    response.angles_details = {
      asc: { sign_id: "aries", pos: 0, abs_pos: 0 },
      mc: { sign_id: "cancer", pos: 0, abs_pos: 90 },
      dc: { sign_id: "libra", pos: 0, abs_pos: 180 },
      ic: { sign_id: "capricorn", pos: 0, abs_pos: 270 },
    };
  }
  return response;
};

test("builds the three-layer response through the full pipeline", async () => {
  const result = await createHoroscope(request(true), async () => rawResponse(true));

  assert.equal(result.horoscope.planets.length, 10);
  assert.ok(result.horoscope.houses);
  assert.equal(result.analysis.planetDistribution.length, 12);
  assert.equal(result.visualProfile.mode, "full");
});

test("builds a partial response for an unknown birth time", async () => {
  const result = await createHoroscope(
    request(false),
    async () => rawResponse(false),
  );

  assert.equal(result.horoscope.birth.time, null);
  assert.equal(result.horoscope.houses, null);
  assert.equal(result.analysis.houseDistribution, null);
  assert.equal(result.visualProfile.mode, "partial");
  assert.equal(result.visualProfile.houses, null);
});
