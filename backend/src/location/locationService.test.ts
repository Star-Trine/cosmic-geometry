import assert from "node:assert/strict";
import test from "node:test";

import type { Geocoder } from "./geocoder.js";
import type { TimezoneResolver } from "./timezoneResolver.js";
import {
  searchLocations,
  validateLocationSearchRequest,
} from "./locationService.js";

test("trims a valid city and country request", () => {
  assert.deepEqual(
    validateLocationSearchRequest({ city: "  東京  ", country: " 日本 " }),
    { city: "東京", country: "日本" },
  );
});

test("rejects empty, missing, non-string, and excessive values", () => {
  for (const input of [
    { city: "", country: "Japan" },
    { city: "Tokyo", country: "   " },
    { city: 123, country: "Japan" },
    { city: "Tokyo" },
    null,
    { city: "x".repeat(121), country: "Japan" },
  ]) {
    assert.throws(() => validateLocationSearchRequest(input));
  }
});

test("returns candidates from the provider without provider-specific data", async () => {
  const geocoder: Geocoder = {
    search: async () => [
      {
        id: "tokyo",
        label: "Tokyo, Japan",
        locality: "Tokyo",
        region: "Tokyo",
        country: "Japan",
        countryCode: "jp",
        latitude: 35.6762,
        longitude: 139.6503,
      },
    ],
  };
  const timezoneResolver: TimezoneResolver = {
    resolve: () => "Asia/Tokyo",
  };

  const result = await searchLocations(
    { city: "Tokyo", country: "Japan" },
    geocoder,
    timezoneResolver,
  );
  assert.equal(result.candidates.length, 1);
  assert.equal(result.candidates[0]?.latitude, 35.6762);
  assert.equal(result.candidates[0]?.timezone, "Asia/Tokyo");
});

test("resolves a timezone for every geocoded candidate", async () => {
  const geocoder: Geocoder = {
    search: async () => [
      {
        id: "tokyo",
        label: "Tokyo, Japan",
        locality: "Tokyo",
        region: "Tokyo",
        country: "Japan",
        countryCode: "jp",
        latitude: 35.6762,
        longitude: 139.6503,
      },
      {
        id: "new-york",
        label: "New York, United States",
        locality: "New York",
        region: "New York",
        country: "United States",
        countryCode: "us",
        latitude: 40.7128,
        longitude: -74.006,
      },
    ],
  };
  const calls: Array<[number, number]> = [];
  const timezoneResolver: TimezoneResolver = {
    resolve: (latitude, longitude) => {
      calls.push([latitude, longitude]);
      return longitude > 0 ? "Asia/Tokyo" : "America/New_York";
    },
  };

  const result = await searchLocations(
    { city: "test", country: "test" },
    geocoder,
    timezoneResolver,
  );
  assert.deepEqual(
    result.candidates.map(({ timezone }) => timezone),
    ["Asia/Tokyo", "America/New_York"],
  );
  assert.deepEqual(calls, [
    [35.6762, 139.6503],
    [40.7128, -74.006],
  ]);
});
