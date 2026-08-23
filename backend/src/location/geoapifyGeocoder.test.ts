import assert from "node:assert/strict";
import test from "node:test";

import {
  GeoapifyGeocoder,
  GeoapifyGeocoderError,
  normalizeGeoapifyResponse,
} from "./geoapifyGeocoder.js";

const geoapifyResult = {
  place_id: "tokyo-id",
  formatted: "Tokyo, Japan",
  city: "Tokyo",
  state: "Tokyo",
  country: "Japan",
  country_code: "JP",
  lat: 35.6762,
  lon: 139.6503,
  datasource: { sourcename: "openstreetmap" },
};

test("normalizes Geoapify fields and removes provider-specific fields", () => {
  const [candidate] = normalizeGeoapifyResponse({ results: [geoapifyResult] });
  assert.deepEqual(candidate, {
    id: "tokyo-id",
    label: "Tokyo, Japan",
    locality: "Tokyo",
    region: "Tokyo",
    country: "Japan",
    countryCode: "jp",
    latitude: 35.6762,
    longitude: 139.6503,
  });
  assert.equal("datasource" in (candidate ?? {}), false);
});

test("returns an empty list for zero results", () => {
  assert.deepEqual(normalizeGeoapifyResponse({ results: [] }), []);
});

test("rejects a malformed top-level response", () => {
  assert.throws(
    () => normalizeGeoapifyResponse({}),
    (error: unknown) =>
      error instanceof GeoapifyGeocoderError &&
      error.kind === "invalid_response",
  );
});

test("builds a Unicode-safe city search and limits results", async () => {
  let requestedUrl: URL | undefined;
  const geocoder = new GeoapifyGeocoder({
    apiKey: "secret-key",
    fetchImpl: async (input) => {
      requestedUrl = new URL(String(input));
      return new Response(JSON.stringify({ results: [geoapifyResult] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    },
  });

  const candidates = await geocoder.search({ city: "東京", country: "日本" });
  assert.equal(candidates.length, 1);
  assert.equal(requestedUrl?.searchParams.get("city"), "東京");
  assert.equal(requestedUrl?.searchParams.get("country"), "日本");
  assert.equal(requestedUrl?.searchParams.get("type"), "city");
  assert.equal(requestedUrl?.searchParams.get("limit"), "5");
});

test("maps Geoapify HTTP errors without exposing the API key", async () => {
  for (const [status, kind] of [
    [429, "rate_limit"],
    [401, "authentication"],
    [500, "request_failed"],
  ] as const) {
    const geocoder = new GeoapifyGeocoder({
      apiKey: "do-not-log-this-key",
      fetchImpl: async () => new Response("{}", { status }),
    });

    await assert.rejects(
      () => geocoder.search({ city: "Tokyo", country: "Japan" }),
      (error: unknown) =>
        error instanceof GeoapifyGeocoderError &&
        error.kind === kind &&
        !error.message.includes("do-not-log-this-key"),
    );
  }
});
