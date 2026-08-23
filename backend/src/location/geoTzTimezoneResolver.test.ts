import assert from "node:assert/strict";
import test from "node:test";

import {
  GeoTzTimezoneResolver,
  TimezoneResolutionError,
} from "./geoTzTimezoneResolver.js";

test("resolves representative city coordinates to IANA timezones", () => {
  const resolver = new GeoTzTimezoneResolver();
  assert.equal(resolver.resolve(35.6762, 139.6503), "Asia/Tokyo");
  assert.equal(resolver.resolve(40.7128, -74.006), "America/New_York");
  assert.equal(resolver.resolve(51.5074, -0.1278), "Europe/London");
});

test("rejects invalid latitude and longitude", () => {
  const resolver = new GeoTzTimezoneResolver();
  for (const [latitude, longitude] of [
    [91, 0],
    [-91, 0],
    [0, 181],
    [0, -181],
    [Number.NaN, 0],
    [0, Number.POSITIVE_INFINITY],
  ] as Array<[number, number]>) {
    assert.throws(
      () => resolver.resolve(latitude, longitude),
      (error: unknown) =>
        error instanceof TimezoneResolutionError &&
        error.kind === "invalid_coordinates",
    );
  }
});

test("rejects zero and multiple timezone candidates", () => {
  const none = new GeoTzTimezoneResolver(() => []);
  assert.throws(
    () => none.resolve(0, 0),
    (error: unknown) =>
      error instanceof TimezoneResolutionError && error.kind === "not_found",
  );

  const ambiguous = new GeoTzTimezoneResolver(() => [
    "Asia/Shanghai",
    "Asia/Urumqi",
  ]);
  assert.throws(
    () => ambiguous.resolve(43.839319, 87.526148),
    (error: unknown) =>
      error instanceof TimezoneResolutionError && error.kind === "ambiguous",
  );
});

test("maps geo-tz internal failures without leaking implementation details", () => {
  const resolver = new GeoTzTimezoneResolver(() => {
    throw new Error("data read failed");
  });
  assert.throws(
    () => resolver.resolve(35.6762, 139.6503),
    (error: unknown) =>
      error instanceof TimezoneResolutionError && error.kind === "internal",
  );
});
