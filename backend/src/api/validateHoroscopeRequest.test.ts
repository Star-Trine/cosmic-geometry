import assert from "node:assert/strict";
import test from "node:test";

import { validateHoroscopeRequest } from "./validateHoroscopeRequest.js";

const validRequest = (): Record<string, unknown> => ({
  date: "1995-09-12",
  time: "14:30",
  timeKnown: true,
  place: {
    name: "Tokyo, Japan",
    city: "Tokyo",
    country: "Japan",
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: "Asia/Tokyo",
  },
});

test("accepts valid known-time and unknown-time requests", () => {
  assert.equal(validateHoroscopeRequest(validRequest()).time, "14:30");

  const unknownTime = validRequest();
  unknownTime.timeKnown = false;
  unknownTime.time = null;
  assert.deepEqual(validateHoroscopeRequest(unknownTime).time, null);
});

test("rejects invalid dates and times", () => {
  const invalidDate = validRequest();
  invalidDate.date = "2025-02-30";
  assert.throws(() => validateHoroscopeRequest(invalidDate), /real date/);

  const invalidTime = validRequest();
  invalidTime.time = "24:00";
  assert.throws(() => validateHoroscopeRequest(invalidTime), /valid 24-hour/);
});

test("rejects contradictions between timeKnown and time", () => {
  const missingKnownTime = validRequest();
  missingKnownTime.time = null;
  assert.throws(
    () => validateHoroscopeRequest(missingKnownTime),
    /when timeKnown is true/,
  );

  const unexpectedUnknownTime = validRequest();
  unexpectedUnknownTime.timeKnown = false;
  assert.throws(
    () => validateHoroscopeRequest(unexpectedUnknownTime),
    /must be null/,
  );
});

test("rejects out-of-range coordinates and empty required strings", () => {
  for (const [field, value] of [
    ["latitude", 91],
    ["longitude", -181],
  ] as const) {
    const request = validRequest();
    const place = request.place as Record<string, unknown>;
    place[field] = value;
    assert.throws(() => validateHoroscopeRequest(request), /must be between/);
  }

  for (const field of ["name", "city", "country", "timezone"] as const) {
    const request = validRequest();
    const place = request.place as Record<string, unknown>;
    place[field] = "  ";
    assert.throws(() => validateHoroscopeRequest(request), /non-empty string/);
  }
});
